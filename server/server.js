const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors({
  origin: "http://localhost:3000", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Create MySQL connection using mysql2
const db = mysql.createConnection({
  host: "localhost",
  user: 'root',
  password: 'root',
  database: 'mydb'
});

// Check if uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer setup for file handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Middleware to verify user token
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Message: "We need a token, please provide it." });
  } else {
    jwt.verify(token, "our-jsonwebtoken-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Message: "Authentication Error." });
      } else {
        req.name = decoded.name;
        next();
      }
    });
  }
};

// Protected route example that uses verifyUser middleware
app.get('/', verifyUser, (req, res) => {
  return res.json({ Status: "Success", name: req.name });
});

// Signup route
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

  console.log('Received signup data:', req.body);
  console.log('Received files:', req.files);

  if (!accountType) {
    return res.status(400).json({ error: 'Missing account type' });
  }
  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Missing password' });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Internal server error' });

    const pictureUrl = req.files['picture'] ? req.files['picture'][0].filename : null;
    const resumeUrl = req.files['resume'] ? req.files['resume'][0].filename : null;

    let sql, values;
    if (accountType === 'employee') {
      sql = 'INSERT INTO employee (lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, picture, resume, status_id, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      values = [lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, pictureUrl, resumeUrl, 2, email, hashedPassword];
    } else if (accountType === 'employer') {
      sql = 'INSERT INTO employer (lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName, status_id, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      values = [lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName, 2, email, hashedPassword];
    } else {
      return res.status(400).json({ error: 'Invalid account type' });
    }

    db.query(sql, values, (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err.message });

      const userId = results.insertId;
      const userType = accountType === 'employee' ? 'employee' : 'employer';

      const userSql = 'INSERT INTO user (user_type, employee_id, employer_id) VALUES (?, ?, ?)';
      db.query(userSql, [userType, userType === 'employee' ? userId : null, userType === 'employer' ? userId : null], (err) => {
        if (err) return res.status(500).json({ error: 'Database error while inserting user', details: err.message });
        res.json({ id: userId });
      });
    });
  });
});


// Login route with JWT and bcrypt
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const employeeSql = 'SELECT employee_id AS userId, email, password, "employee" AS userType FROM employee WHERE email = ?';

  db.query(employeeSql, [email], (err, employeeResults) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (employeeResults.length > 0) {
      const employee = employeeResults[0];

      bcrypt.compare(password, employee.password, (err, isMatch) => {
        if (err) return res.status(500).json({ error: 'Internal error' });
        if (isMatch) {
          const token = jwt.sign({ name: employee.email, userType: employee.userType, userId: employee.userId }, "our-jsonwebtoken-secret-key", { expiresIn: '1d' });
          res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day expiry

          return res.json({ message: 'Login successful', userType: employee.userType, userId: employee.userId });
        } else {
          return res.status(401).json({ error: 'Invalid password' });
        }
      });
      return;
    }

    // Similar logic for employers
    const employerSql = 'SELECT employer_id AS userId, email, password, "employer" AS userType FROM employer WHERE email = ?';
    db.query(employerSql, [email], (err, employerResults) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      if (employerResults.length > 0) {
        const employer = employerResults[0];

        bcrypt.compare(password, employer.password, (err, isMatch) => {
          if (err) return res.status(500).json({ error: 'Internal error' });
          if (isMatch) {
            const token = jwt.sign({ name: employer.email, userType: employer.userType, userId: employer.userId }, "our-jsonwebtoken-secret-key", { expiresIn: '1d' });
            res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

            return res.json({ message: 'Login successful', userType: employer.userType, userId: employer.userId });
          } else {
            return res.status(401).json({ error: 'Invalid password' });
          }
        });
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    });
  });
});

app.get('/verify-session', (req, res) => {
  const token = req.cookies.token; // Retrieve the token from the cookie
  if (!token) {
    return res.status(401).json({ message: 'No token found. Unauthorized access.' });
  }

  jwt.verify(token, "our-jsonwebtoken-secret-key", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token verification failed. Forbidden access.' });
    }
    return res.json({ message: 'Authenticated', userType: decoded.userType, userId: decoded.userId });
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
    res.status(201).json({ message: 'Job posting created successfully', job_id: results.insertId });
  });
});

// Route to delete an employee or employer by ID based on account type
app.delete('/api/:accountType/:id', (req, res) => {
  const { accountType, id } = req.params;

  // Validate account type
  if (accountType !== 'employees' && accountType !== 'employers') {
    return res.status(400).json({ error: 'Invalid account type' });
  }

  const tableName = accountType === 'employees' ? 'employee' : 'employer';
  const columnId = accountType === 'employees' ? 'employee_id' : 'employer_id';

  const deleteSql = `DELETE FROM ${tableName} WHERE ${columnId} = ?`;
  db.query(deleteSql, [id], (err, result) => {
    if (err) {
      console.error(`Error deleting ${accountType.slice(0, -1)}:`, err); // Remove "s" from accountType for better logging
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    if (result.affectedRows > 0) {
      return res.json({ message: `${accountType.slice(0, -1)} deleted successfully` });
    } else {
      return res.status(404).json({ error: `${accountType.slice(0, -1)} not found` });
    }
  });
});

app.get('/api/users', (req, res) => {
  const employeeQuery = `
    SELECT employee_id AS id, lastName, firstName, middleName, province, municipality, barangay, 
           zipCode, mobileNumber, picture, resume, status_id AS statusId, progress_id AS progressId, 
           email, 'Employee' AS userType
    FROM employee
  `;

  const employerQuery = `
    SELECT employer_id AS id, lastName, firstName, middleName, province, municipality, barangay, 
           zipCode, mobileNumber, companyName, status_id AS statusId, progress_id AS progressId, 
           email, 'Employer' AS userType
    FROM employer
  `;

  db.query(employeeQuery, (err, employeeResults) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });

    db.query(employerQuery, (err, employerResults) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err.message });

      // Combine employee and employer data
      const users = [...employeeResults, ...employerResults];
      res.json(users);
    });
  });
});


// Route to get user profile by user_id (employee or employer)
app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;

  const employeeQuery = `
    SELECT employee_id AS id, lastName, firstName, middleName, province, municipality, barangay, 
           zipCode, mobileNumber, picture, resume, 'employee' AS userType 
    FROM employee 
    WHERE employee_id = ?`;

  const employerQuery = `
    SELECT employer_id AS id, lastName, firstName, middleName, province, municipality, barangay, 
           zipCode, mobileNumber, companyName, 'employer' AS userType 
    FROM employer 
    WHERE employer_id = ?`;

  // First, try to find the user as an employee
  db.query(employeeQuery, [userId], (err, employeeResults) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    if (employeeResults.length > 0) {
      return res.json(employeeResults[0]);
    }

    // If not an employee, try to find the user as an employer
    db.query(employerQuery, [userId], (err, employerResults) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }

      if (employerResults.length > 0) {
        return res.json(employerResults[0]);
      }

      // If not found in either table, return a 404 error
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

// Route to get all job postings
app.get('/api/job_postings', (req, res) => {
  const sql = 'SELECT * FROM job_postings';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    res.json(results);
  });
});

// Route to get a job posting by ID (continuation from where it was cut off)
app.get('/api/job_postings/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM job_postings WHERE job_id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Job posting not found' });
    res.json(results[0]);
  });
});

// Route to update a job posting by ID
app.put('/api/job_postings/:id', (req, res) => {
  const { id } = req.params;
  const { jobName, jobOverview, jobDescription, salary, country } = req.body;

  const sql = `UPDATE job_postings SET 
               jobName = COALESCE(?, jobName), 
               jobOverview = COALESCE(?, jobOverview), 
               jobDescription = COALESCE(?, jobDescription), 
               salary = COALESCE(?, salary), 
               country = COALESCE(?, country) 
               WHERE job_id = ?`;

  const values = [jobName, jobOverview, jobDescription, salary, country, job_id];
  db.query(sql, values, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Job posting not found' });
    res.json({ message: 'Job posting updated successfully' });
  });
});

// Route to delete a job posting by ID
app.delete('/api/job_postings/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM job_postings WHERE job_id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    if (results.affectedRows === 0) return res.status(404).json({ error: 'Job posting not found' });
    res.json({ message: 'Job posting deleted successfully' });
  });
});


// Sign-out route to clear the JWT token
app.post('/signout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Sign out successful' });
})

// Apply for a job
app.post('/api/applications/apply', verifyUser, (req, res) => {
  // Get job_id from the request body and the employee's ID from the decoded token (req.name contains the logged-in user's email)
  const { job_id } = req.body;
  const employee_id = req.name; // Assuming req.name contains the logged-in employee's email or userId

  if (!job_id || !employee_id) {
    return res.status(400).json({ error: 'Job ID and Employee ID are required' });
  }

  const apply_date = new Date().toISOString().slice(0, 19).replace('T', ' '); // Get current date in 'YYYY-MM-DD HH:MM:SS' format

  // Insert application into the 'applications' table
  const sql = 'INSERT INTO applications (job_id, employee_id, apply_date) VALUES (?, ?, ?)';
  const values = [job_id, employee_id, apply_date];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error inserting application:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    res.status(201).json({ message: 'Application submitted successfully', applicationId: results.insertId });
  });
});

// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
