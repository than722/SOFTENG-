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

// Route to update status
app.put('/api/users/:id/status', (req, res) => {
  const { id } = req.params;
  const { statusId } = req.body;

  const updateEmployeeSql = 'UPDATE employee SET status_id = ? WHERE id = ?';
  db.query(updateEmployeeSql, [statusId, id], (err, results) => {
    if (err) {
      console.error('Error executing employee update query:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    if (results.affectedRows === 0) {
      const updateEmployerSql = 'UPDATE employer SET status_id = ? WHERE id = ?';
      db.query(updateEmployerSql, [statusId, id], (err, results) => {
        if (err) {
          console.error('Error executing employer update query:', err);
          return res.status(500).json({ error: 'Database error', details: err.message });
        }
        res.json({ message: 'Status updated successfully' });
      });
    } else {
      res.json({ message: 'Status updated successfully' });
    }
  });
});

// Route to delete rejected users
app.delete('/api/users/rejected', (req, res) => {
  const deleteEmployeeSql = 'DELETE FROM employee WHERE status_id = 2';
  const deleteEmployerSql = 'DELETE FROM employer WHERE status_id = 2';

  db.query(deleteEmployeeSql, (err) => {
    if (err) {
      console.error('Error executing employee delete query:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    db.query(deleteEmployerSql, (err) => {
      if (err) {
        console.error('Error executing employer delete query:', err);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      res.json({ message: 'Rejected users deleted successfully' });
    });
  });
});

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// Route to handle signup for employees and employers
app.post('/signup', upload.fields([{ name: 'picture' }, { name: 'resume' }]), (req, res) => {
  const { accountType, lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName } = req.body;
  let sql, values;

  if (accountType === 'employee') {
    const pictureUrl = req.files['picture'] ? req.files['picture'][0].filename : null;
    const resumeUrl = req.files['resume'] ? req.files['resume'][0].filename : null;

    sql = 'INSERT INTO employee (lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, picture, resume) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    values = [lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, pictureUrl, resumeUrl];
  } else if (accountType === 'employer') {
    sql = 'INSERT INTO employer (lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    values = [lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName];
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

// Route to fetch an employee's profile by ID with picture and resume as base64
app.get('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT id, lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, picture, resume 
    FROM employee WHERE id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (results.length > 0) {
      const employee = results[0];

      // Ensure the image is correctly served as a URL
      if (employee.picture) {
        employee.picture = `http://localhost:8081/uploads/${employee.picture}`;
      }

      res.json(employee);
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  });
});

app.listen(8081, () => {
  console.log("Listening on port 8081");
});
