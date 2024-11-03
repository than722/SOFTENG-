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
  password: 'root',
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

const upload = multer({ dest: 'uploads/' });

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Route to handle signup for employees and employers with password hashing
app.post('/signup', upload.fields([{ name: 'picture', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), (req, res) => {
  const { 
    accountType,
    lastName, 
    firstName, 
    middleName, 
    province, 
    municipality, 
    barangay, 
    zipCode, 
    mobileNumber, 
    companyName, 
    email, 
    password,
  } = req.body;

  // Check if the password is a valid string
  if (typeof password !== 'string' || password.trim() === '') {
      return res.status(400).json({ error: 'Invalid password' });
  }

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
          return res.status(500).json({ error: 'Internal server error' });
      }

      let sql, values;
      const pictureUrl = req.files['picture'] ? req.files['picture'][0].filename : null;
      const resumeUrl = req.files['resume'] ? req.files['resume'][0].filename : null;

      if (accountType === 'employee') {
          sql = 'INSERT INTO employee (lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, picture, resume, status_id, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'; 
          values = [lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, pictureUrl, resumeUrl, 2, email, hashedPassword];
      } else if (accountType === 'employer') {
          sql = 'INSERT INTO employer (lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName, status_id, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'; 
          values = [lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName, 2, email, hashedPassword];
      } else {
          return res.status(400).json({ error: 'Invalid account type' });
      }

      // First, insert into employee or employer
      db.query(sql, values, (err, results) => {
          if (err) {
              return res.status(500).json({ error: 'Database error', details: err.message });
          }

          // After inserting, also insert into user table
          const employeeId = accountType === 'employee' ? results.insertId : null;
          const employerId = accountType === 'employer' ? results.insertId : null;
          const userType = accountType === 'employee' ? 'employee' : 'employer';

          const userSql = 'INSERT INTO user (user_type, employee_id, employer_id) VALUES (?, ?, ?)';
          db.query(userSql, [userType, employeeId, employerId], (err) => {
              if (err) {
                  return res.status(500).json({ error: 'Database error while inserting user', details: err.message });
              }
              res.json({ id: results.insertId }); // Return the ID of the created employee/employer
          });
      });
  });
});

// Login route with password comparison using bcrypt
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const employeeSql = 'SELECT employee_id, email, password, "employee" AS accountType FROM employee WHERE email = ?';

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
            employeeId: employee.employee_id,
          });
        } else {
          return res.status(401).json({ error: 'Invalid password' });
        }
      });
      return; // Exit early since we found the employee
    }

    // If no employee was found, check the employer table
    const employerSql = 'SELECT employer_id, email, password, "employer" AS accountType FROM employer WHERE email = ?';
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
              employerId: employer.employer_id,
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
app.delete('/api/employees/:employeeId', (req, res) => {
  const { employeeId } = req.params;

  const deleteEmployeeSql = 'DELETE FROM employee WHERE employee_id = ?';
  db.query(deleteEmployeeSql, [employeeId], (err, result) => {
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

// Route to get user profile by employee_id or employer_id
app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;

  const employeeQuery = 'SELECT employee_id, lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, picture, resume, "Employee" AS userType FROM employee WHERE employee_id = ?';
  db.query(employeeQuery, [userId], (err, employeeResults) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    if (employeeResults.length > 0) {
      return res.json(employeeResults[0]);
    }

    const employerQuery = 'SELECT employer_id, lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName AS companyName, NULL AS picture, NULL AS resume, "Employer" AS userType FROM employer WHERE employer_id = ?';
    db.query(employerQuery, [userId], (err, employerResults) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }

      if (employerResults.length > 0) {
        return res.json(employerResults[0]);
      }

      res.status(404).json({ error: 'User not found' });
    });
  });
});


app.put('/api/users/:userId', upload.fields([{ name: 'picture', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), (req, res) => {
  const { userId } = req.params;

  const { 
    lastName, 
    firstName, 
    middleName, 
    province, 
    municipality, 
    barangay, 
    zipCode, 
    mobileNumber, 
    companyName, 
  } = req.body;

  const pictureUrl = req.files['picture'] ? req.files['picture'][0].filename : null;
  const resumeUrl = req.files['resume'] ? req.files['resume'][0].filename : null;

  const employeeUpdateSql = `UPDATE employee SET 
    lastName = COALESCE(?, lastName), 
    firstName = COALESCE(?, firstName), 
    middleName = COALESCE(?, middleName), 
    province = COALESCE(?, province), 
    municipality = COALESCE(?, municipality), 
    barangay = COALESCE(?, barangay), 
    zipCode = COALESCE(?, zipCode), 
    mobileNumber = COALESCE(?, mobileNumber), 
    picture = COALESCE(?, picture), 
    resume = COALESCE(?, resume) 
    WHERE employee_id = ?`;

  const employeeValues = [
    lastName, 
    firstName, 
    middleName, 
    province, 
    municipality, 
    barangay, 
    zipCode, 
    mobileNumber, 
    pictureUrl, 
    resumeUrl, 
    userId,
  ];

  db.query(employeeUpdateSql, employeeValues, (err, employeeResults) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    if (employeeResults.affectedRows > 0) {
      return res.json({ message: 'Employee updated successfully' });
    } else {
      return res.status(404).json({ error: 'Employee not found' });
    }
  });
});
// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
