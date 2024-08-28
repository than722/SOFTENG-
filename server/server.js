const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Create MySQL connection using mysql2
const db = mysql.createConnection({
  host: "localhost",
  user: 'root',
  password: '1234',
  database: 'mydb'
});

// Check if the uploads directory exists, and create it if it doesn't
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log(`Created directory: ${uploadsDir}`);
} else {
  console.log(`Directory already exists: ${uploadsDir}`);
}

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Route to handle signup for employees and employers
app.post('/signup', upload.fields([{ name: 'picture' }, { name: 'resume' }]), (req, res) => {
  const { accountType, lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName } = req.body;
  let sql, values;

  if (accountType === 'employee') {
    const pictureUrl = req.files['picture'] ? req.files['picture'][0].filename : null;
    const resumeUrl = req.files['resume'] ? req.files['resume'][0].filename : null;

    sql = 'INSERT INTO employee (lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, picture, resume, status_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    values = [lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, pictureUrl, resumeUrl, 2]; // status_id default to 1 (active)
  } else if (accountType === 'employer') {
    sql = 'INSERT INTO employer (lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName, status_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    values = [lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName, 2]; // status_id default to 1 (active)
  } else {
    return res.status(400).json({ error: 'Invalid account type' });
  }

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error executing signup query:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    res.json({ id: results.insertId });
  });
});


// Route to fetch all users
app.get('/api/users', (req, res) => {
  const sql = `
    SELECT id, CONCAT_WS(' ', lastName, firstName, middleName) AS name, 
           'Employee' AS type, status_id AS statusId, picture AS pictureUrl, resume AS resumeUrl 
    FROM employee
    UNION ALL
    SELECT id, CONCAT_WS(' ', lastName, firstName, middleName) AS name, 
           'Employer' AS type, status_id AS statusId, NULL AS pictureUrl, NULL AS resumeUrl 
    FROM employer
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.json(results);
  });
});

// Route to fetch a user by ID (either Employee or Employer)
app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;

  const employeeSql = `
    SELECT id, lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, picture, resume, 'Employee' AS userType
    FROM employee WHERE id = ?
  `;

  const employerSql = `
    SELECT id, lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName AS companyName, NULL AS picture, NULL AS resume, 'Employer' AS userType
    FROM employer WHERE id = ?
  `;

  db.query(employeeSql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching employee data:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      db.query(employerSql, [id], (err, results) => {
        if (err) {
          console.error('Error fetching employer data:', err);
          return res.status(500).json({ error: 'Database error', details: err.message });
        }

        if (results.length > 0) {
          res.json(results[0]);
        } else {
          res.status(404).json({ error: 'User not found' });
        }
      });
    }
  });
});

// Route to update a user's status (progress)
app.put('/api/users/:id/status', (req, res) => {
  const { id } = req.params;
  const { progressId } = req.body;

  const updateEmployeeSql = 'UPDATE employee SET status_id = ? WHERE id = ?';
  const updateEmployerSql = 'UPDATE employer SET status_id = ? WHERE id = ?';

  // First, try to update the employee's status
  db.query(updateEmployeeSql, [progressId, id], (err, results) => {
    if (err) {
      console.error('Error executing employee update query:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    if (results.affectedRows === 0) {
      // If no employee was updated, try updating the employer's status
      db.query(updateEmployerSql, [progressId, id], (err, results) => {
        if (err) {
          console.error('Error executing employer update query:', err);
          return res.status(500).json({ error: 'Database error', details: err.message });
        }

        if (results.affectedRows === 0) {
          // If no rows were affected in either table, the user was not found
          return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Progress updated successfully' });
      });
    } else {
      res.json({ message: 'Progress updated successfully' });
    }
  });
});


// Route to update a user's profile (Employee or Employer)
app.put('/api/users/:id', upload.fields([{ name: 'picture' }, { name: 'resume' }]), (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName } = req.body;
  const pictureUrl = req.files['picture'] ? req.files['picture'][0].filename : null;
  const resumeUrl = req.files['resume'] ? req.files['resume'][0].filename : null;

  // First, try to update the employee
  let sql = `
    UPDATE employee 
    SET firstName = ?, lastName = ?, middleName = ?, province = ?, municipality = ?, barangay = ?, zipCode = ?, mobileNumber = ?
  `;
  let values = [firstName, lastName, middleName, province, municipality, barangay, zipCode, mobileNumber];

  // Conditionally add picture and resume fields if they are provided
  if (pictureUrl) {
    sql += `, picture = ?`;
    values.push(pictureUrl);
  }

  if (resumeUrl) {
    sql += `, resume = ?`;
    values.push(resumeUrl);
  }

  sql += ` WHERE id = ?`;
  values.push(id);

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error executing employee update query:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    if (results.affectedRows === 0) {
      // If no employee was updated, try updating the employer
      let employerSql = `
        UPDATE employer 
        SET firstName = ?, lastName = ?, middleName = ?, province = ?, municipality = ?, barangay = ?, zipCode = ?, mobileNumber = ?, companyName = ?
      `;
      let employerValues = [firstName, lastName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName];

      employerSql += ` WHERE id = ?`;
      employerValues.push(id);

      db.query(employerSql, employerValues, (err, results) => {
        if (err) {
          console.error('Error executing employer update query:', err);
          return res.status(500).json({ error: 'Database error', details: err.message });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully' });
      });
    } else {
      res.json({ message: 'Profile updated successfully' });
    }
  });
});

// Route to delete a user profile by ID
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;

  const deleteFiles = (profile) => {
    const pictureFilePath = profile.picture ? path.join(uploadsDir, profile.picture.toString()) : null;
    const resumeFilePath = profile.resume ? path.join(uploadsDir, profile.resume.toString()) : null;

    // Delete files from server if they exist
    if (pictureFilePath && fs.existsSync(pictureFilePath)) {
      fs.unlinkSync(pictureFilePath);
    }
    if (resumeFilePath && fs.existsSync(resumeFilePath)) {
      fs.unlinkSync(resumeFilePath);
    }
  };

  const deleteUserSql = (table) => `DELETE FROM ${table} WHERE id = ?`;

  // Try to delete from employee table first
  const getEmployeeSql = 'SELECT picture, resume FROM employee WHERE id = ?';
  db.query(getEmployeeSql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching employee data:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    if (results.length > 0) {
      deleteFiles(results[0]);
      db.query(deleteUserSql('employee'), [id], (err) => {
        if (err) {
          console.error('Error executing employee delete query:', err);
          return res.status(500).json({ error: 'Database error', details: err.message });
        }
        return res.json({ message: 'Profile deleted successfully' });
      });
    } else {
      // If no employee was found, try the employer table
      const getEmployerSql = 'SELECT NULL AS picture, NULL AS resume FROM employer WHERE id = ?';
      db.query(getEmployerSql, [id], (err, results) => {
        if (err) {
          console.error('Error fetching employer data:', err);
          return res.status(500).json({ error: 'Database error', details: err.message });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: 'Profile not found' });
        }

        db.query(deleteUserSql('employer'), [id], (err) => {
          if (err) {
            console.error('Error executing employer delete query:', err);
            return res.status(500).json({ error: 'Database error', details: err.message });
          }
          return res.json({ message: 'Profile deleted successfully' });
        });
      });
    }
  });
});


// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

app.listen(8081, () => {
  console.log("Listening on port 8081");
});
