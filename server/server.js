const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');


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

// Route to handle signup for employees and employers with password hashing
app.post('/signup', upload.fields([{ name: 'picture' }, { name: 'resume' }]), (req, res) => {
  const { accountType, lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName, email, password } = req.body;

  // Hash the password before storing it
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    let sql, values;
    if (accountType === 'employee') {
      const pictureUrl = req.files['picture'] ? req.files['picture'][0].filename : null;
      const resumeUrl = req.files['resume'] ? req.files['resume'][0].filename : null;

      sql = 'INSERT INTO employee (lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, picture, resume, status_id, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      values = [lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, pictureUrl, resumeUrl, 2, email, hashedPassword];
    } else if (accountType === 'employer') {
      sql = 'INSERT INTO employer (lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName, status_id, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      values = [lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName, 2, email, hashedPassword];
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
});

// Login route with password comparison using bcrypt
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const employeeSql = 'SELECT id, email, password, "employee" AS accountType FROM employee WHERE email = ?';

  db.query(employeeSql, [email], (err, employeeResults) => {
    if (err) {
      console.error('Error querying employee table:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    // If an employee is found, compare the password
    if (employeeResults.length > 0) {
      const employee = employeeResults[0];
      
      bcrypt.compare(password, employee.password, (err, isMatch) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.status(500).json({ error: 'Internal error' });
        }
        if (isMatch) {
          return res.json({
            message: 'Login successful',
            accountType: employee.accountType,
            id: employee.id,
          });
        } else {
          return res.status(401).json({ error: 'Invalid password' });
        }
      });
      return; // Exit early since we found the employee
    }

    // If no employee was found, check the employer table
    const employerSql = 'SELECT id, email, password, "employer" AS accountType FROM employer WHERE email = ?';
    db.query(employerSql, [email], (err, employerResults) => {
      if (err) {
        console.error('Error querying employer table:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (employerResults.length > 0) {
        const employer = employerResults[0];
        
        bcrypt.compare(password, employer.password, (err, isMatch) => {
          if (err) {
            console.error('Error comparing passwords:', err);
            return res.status(500).json({ error: 'Internal error' });
          }
          if (isMatch) {
            return res.json({
              message: 'Login successful',
              accountType: employer.accountType,
              id: employer.id,
            });
          } else {
            return res.status(401).json({ error: 'Invalid password' });
          }
        });
      } else {
        // If no user is found in both tables
        return res.status(404).json({ error: 'User not found' });
      }
    });
  });
});


app.post('/api/job_postings/AddJobPosting', (req, res) => {
  const { jobName, jobOverview, jobDescription, salary, country } = req.body;

  console.log('Received job posting data:', jobName, jobOverview, jobDescription, salary, country);

  if (!jobName || !jobDescription || !salary || !country) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = 'INSERT INTO job_postings (jobName, jobOverview, jobDescription, salary, country) VALUES (?, ?, ?, ?, ?)';
  const values = [jobName, jobOverview || null, jobDescription, salary, country];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error inserting job posting:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.status(201).json({ message: 'Job posting created successfully', id: results.insertId });
  });
});

// Route to delete an employee by ID
app.delete('/api/employees/:id', (req, res) => {
  const { id } = req.params;

  const deleteEmployeeSql = 'DELETE FROM employee WHERE id = ?';
  db.query(deleteEmployeeSql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    if (result.affectedRows > 0) {
      return res.json({ message: 'Employee deleted successfully' });
    } else {
      return res.status(404).json({ error: 'Employee not found' });
    }
  });
});

// Update user profile
app.put('/api/employees/:id', upload.fields([{ name: 'picture' }, { name: 'resume' }]), (req, res) => {
  const { id } = req.params;

  const { firstName, lastName, middleName, province, municipality, barangay, zipCode, mobileNumber } = req.body;
  
  const picture = req.files['picture'] ? req.files['picture'][0].filename : null;
  const resume = req.files['resume'] ? req.files['resume'][0].filename : null;

  const sql = `UPDATE employee SET firstName = ?, lastName = ?, middleName = ?, province = ?, municipality = ?, barangay = ?, zipCode = ?, mobileNumber = ?, 
      picture = COALESCE(?, picture), resume = COALESCE(?, resume) WHERE id = ?`;

  db.query(sql, [firstName, lastName, middleName, province, municipality, barangay, zipCode, mobileNumber, picture, resume, id], (err, result) => {
    if (err) {
      console.error('Error updating profile:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    if (result.affectedRows > 0) {
      res.json({ message: 'Profile updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
});

// Route to fetch all users (employees and employers)
app.get('/api/users', (req, res) => {
  const employeeSql = 'SELECT id, lastName, firstName, email, "Employee" AS userType FROM employee';
  const employerSql = 'SELECT id, lastName, firstName, email, "Employer" AS userType FROM employer';

  db.query(employeeSql, (err, employeeResults) => {
    if (err) {
      console.error('Error fetching employee data:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    db.query(employerSql, (err, employerResults) => {
      if (err) {
        console.error('Error fetching employer data:', err);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }

      // Combine both results into a single array
      const allUsers = [...employeeResults, ...employerResults];
      res.json(allUsers);
    });
  });
});

// Route to fetch a user by ID (either Employee or Employer)
app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;

  const employeeSql = `SELECT id, lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, picture, resume, 'Employee' AS userType FROM employee WHERE id = ?`;
  const employerSql = `SELECT id, lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName AS companyName, NULL AS picture, NULL AS resume, 'Employer' AS userType FROM employer WHERE id = ?`;

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


// Route to get all job postings
app.get('/api/job-postings', (req, res) => {
  const sql = 'SELECT id, jobName AS name, jobOverview AS overview, jobDescription AS description, salary, country FROM job_postings';

  db.query(sql, (err, results) => {
      if (err) {
          console.error('Error fetching job postings:', err);
          return res.status(500).json({ error: 'Database error', details: err.message });
      }

      res.json(results);
  });
});

app.get('/api/job-postings/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM job_postings WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching job posting:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: 'Job posting not found' });
    }
  });
});

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

app.listen(8081, () => {
  console.log("Listening on port 8081");
});
