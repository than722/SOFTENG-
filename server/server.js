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
  password: '1234',
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
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : req.cookies.token;

  if (!token) {
      return res.status(401).json({ message: "No token provided. Unauthorized access." });
  }

  jwt.verify(token, "our-jsonwebtoken-secret-key", (err, decoded) => {
      if (err) {
          return res.status(403).json({ message: "Invalid token. Forbidden access." });
      }
      req.userId = decoded.userId;
      req.userType = decoded.userType;
      next();
  });
};


// Protected route example that uses verifyUser middleware
app.get('/', verifyUser, (req, res) => {
  return res.json({ Status: "Success", name: req.name });
});

app.post(
  '/signup',
  upload.fields([
    { name: 'picture', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'birth_certificate', maxCount: 1 },
    { name: 'validId', maxCount: 1 },
    { name: 'passport', maxCount: 1 },
    { name: 'marriage_contract', maxCount: 1 },
  ]),
  (req, res) => {
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
      civilStatus,
    } = req.body;

    console.log('Received signup data:', req.body);
    console.log('Received files:', req.files);

    // Validate required fields
    if (!email || !password || !accountType || !lastName || !firstName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['employee', 'employer'].includes(accountType)) {
      return res.status(400).json({ error: 'Invalid account type' });
    }

    if (accountType === 'employer' && !companyName) {
      return res.status(400).json({ error: 'Company name is required for employers' });
    }

    if (civilStatus === 'Married' && !req.files['marriage_contract']) {
      return res
        .status(400)
        .json({ error: 'Marriage contract is required for married users' });
    }

    // Extract file URLs or paths
    const validIdUrl = req.files['validId']?.[0]?.filename || null;

    if (!validIdUrl) {
      return res.status(400).json({ error: 'Valid ID is required' });
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
      }

      let sql, values;

      if (accountType === 'employee') {
        sql = `
          INSERT INTO employee 
          (lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, email, password, civil_status) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        values = [
          lastName,
          firstName,
          middleName,
          province,
          municipality,
          barangay,
          zipCode,
          mobileNumber,
          email,
          hashedPassword,
          civilStatus || 'Single', // Default to Single if not provided
        ];
      } else {
        sql = `
          INSERT INTO employer 
          (lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName, validId, email, password) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        values = [
          lastName,
          firstName,
          middleName,
          province,
          municipality,
          barangay,
          zipCode,
          mobileNumber,
          companyName,
          validIdUrl,
          email,
          hashedPassword,
        ];
      }

      // Execute query
      db.query(sql, values, (err, results) => {
        if (err) {
          console.error('Database error:', err.message);
          return res.status(500).json({ error: 'Database error', details: err.message });
        }

        const userId = results.insertId;
        const userType = accountType === 'employee' ? 'employee' : 'employer';

        // Insert into user table
        const userSql =
          'INSERT INTO user (user_type, employee_id, employer_id) VALUES (?, ?, ?)';
        db.query(
          userSql,
          [userType, userType === 'employee' ? userId : null, userType === 'employer' ? userId : null],
          (err) => {
            if (err) {
              console.error('Error creating user:', err.message);
              return res
                .status(500)
                .json({ error: 'Database error while inserting user', details: err.message });
            }

            res.status(201).json({ id: userId });
          }
        );
      });
    });
  }
);




app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const employeeSql = 'SELECT employee_id AS userId, email, password, "employee" AS userType FROM employee WHERE email = ?';

  // Check if the user is an employee
  db.query(employeeSql, [email], (err, employeeResults) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      if (employeeResults.length > 0) {
          const employee = employeeResults[0];

          bcrypt.compare(password, employee.password, (err, isMatch) => {
              if (err) return res.status(500).json({ error: 'Internal error' });
              if (isMatch) {
                  // Generate the JWT token
                  const token = jwt.sign(
                      { name: employee.email, userType: employee.userType, userId: employee.userId },
                      "our-jsonwebtoken-secret-key",
                      { expiresIn: '1d' } // Token valid for 1 day
                  );

                  // Send the token as an httpOnly cookie
                  res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day expiry

                  return res.json({
                      message: 'Login successful',
                      userType: employee.userType,
                      userId: employee.userId
                  });
              } else {
                  return res.status(401).json({ error: 'Invalid password' });
              }
          });
          return;
      }

      // Check if the user is an employer
      const employerSql = 'SELECT employer_id AS userId, email, password, "employer" AS userType FROM employer WHERE email = ?';
      db.query(employerSql, [email], (err, employerResults) => {
          if (err) return res.status(500).json({ error: 'Database error' });

          if (employerResults.length > 0) {
              const employer = employerResults[0];

              bcrypt.compare(password, employer.password, (err, isMatch) => {
                  if (err) return res.status(500).json({ error: 'Internal error' });
                  if (isMatch) {
                      // Generate the JWT token
                      const token = jwt.sign(
                          { name: employer.email, userType: employer.userType, userId: employer.userId },
                          "our-jsonwebtoken-secret-key",
                          { expiresIn: '1d' } // Token valid for 1 day
                      );

                      // Send the token as an httpOnly cookie
                      res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day expiry

                      return res.json({
                          message: 'Login successful',
                          userType: employer.userType,
                          userId: employer.userId
                      });
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
  const token = req.cookies.token; // Retrieve the token from cookies
  if (!token) {
      return res.status(401).json({ message: 'No token found. Unauthorized access.' });
  }

  jwt.verify(token, "our-jsonwebtoken-secret-key", (err, decoded) => {
      if (err) {
          return res.status(403).json({ message: 'Token verification failed. Forbidden access.' });
      }

      // Ensure the token contains userType and userId
      const { userType, userId } = decoded;
      if (!userType || !userId) {
          return res.status(403).json({ message: 'Invalid token payload.' });
      }

      // Return user type and ID
      return res.json({
          message: 'Authenticated',
          userType: userType,
          userId: userId
      });
  });
});

app.post('/api/job_postings/AddJobPosting', (req, res) => {
  const { jobName, jobOverview, jobDescription, salary, country, employer_id } = req.body;

  console.log('Received job posting data:', jobName, jobOverview, jobDescription, salary, country, employer_id);

  if (!jobName || !jobDescription || !salary || !country || !employer_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = 'INSERT INTO job_postings (jobName, jobOverview, jobDescription, salary, country, employer_id) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [jobName, jobOverview || null, jobDescription, salary, country, employer_id];

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

app.post('/api/applications/apply', verifyUser, (req, res) => {
  const { job_id } = req.body;
  const employee_id = req.userId;  // Retrieved from the decoded token

  // Fetch employee details from the employee table
  const getEmployeeDetailsQuery = 'SELECT email, lastName, firstName, status_id FROM employee WHERE employee_id = ?';
  db.query(getEmployeeDetailsQuery, [employee_id], (err, employeeResults) => {
    if (err) {
      console.error('Error fetching employee details:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    if (employeeResults.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const { email, lastName, firstName, status_id } = employeeResults[0];

    // Check if the employee already applied for the same job
    const checkIfAppliedQuery = 'SELECT * FROM applications WHERE job_id = ? AND employee_id = ?';
    db.query(checkIfAppliedQuery, [job_id, employee_id], (err, applicationResults) => {
      if (err) {
        console.error('Error checking existing applications:', err);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }

      if (applicationResults.length > 0) {
        return res.status(409).json({ message: 'You have already applied for this job.' });
      }

      // Check if the job exists and get the employer_id
      const checkJobQuery = 'SELECT employer_id FROM job_postings WHERE job_id = ?';
      db.query(checkJobQuery, [job_id], (err, jobResults) => {
        if (err) {
          console.error('Error checking job:', err);
          return res.status(500).json({ error: 'Database error', details: err.message });
        }

        if (jobResults.length === 0) {
          return res.status(404).json({ message: 'Job posting not found' });
        }

        const employer_id = jobResults[0].employer_id;

        // Insert the job application
        const applyQuery = 'INSERT INTO applications (job_id, employee_id, apply_date, email, lastName, firstName, status_id, employer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const applyDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

        db.query(applyQuery, [job_id, employee_id, applyDate, email, lastName, firstName, status_id, employer_id], (err, results) => {
          if (err) {
            console.error('Error inserting application:', err);
            return res.status(500).json({ error: 'Database error', details: err.message });
          }

          res.status(201).json({ message: 'Application submitted successfully', applicationId: results.insertId, employer_id });
        });
      });
    });
  });
});

// Get applicants for all jobs posted by an employer
app.get('/api/applications/employer/:employerId', (req, res) => {
  const employerId = req.params.employerId;

  if (!employerId) {
      return res.status(400).send("Missing employerId.");
  }

  const query = `
      SELECT 
          j.job_id, 
          a.applications_id, 
          a.firstName, 
          a.lastName, 
          a.email, 
          a.apply_date, 
          a.status_id
      FROM 
          applications a
      JOIN 
          job_postings j ON a.job_id = j.job_id
      WHERE 
          j.employer_id = ?;
  `;

  db.query(query, [employerId], (err, results) => {
      if (err) {
          console.error("Error fetching applicants for employer:", err);
          return res.status(500).send("Failed to fetch applicants.");
      }
      res.json(results);
  });
});



// Route to delete a job posting by ID (protected)
app.delete('/api/jobs/:id', verifyUser, (req, res) => {
  const { id } = req.params;

  // Ensure only employers can delete their own job postings
  if (req.userType !== 'employer') {
      return res.status(403).json({ message: 'Access denied. Only employers can delete job postings.' });
  }

  const sql = 'DELETE FROM job_postings WHERE job_id = ? AND employer_id = ?';
  db.query(sql, [id, req.userId], (err, results) => {
      if (err) {
          console.error('Error deleting job posting:', err);
          return res.status(500).json({ error: 'Database error', details: err.message });
      }

      if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Job posting not found or you are not authorized to delete it.' });
      }

      res.json({ message: 'Job posting deleted successfully' });
  });
});


// Route to check if the user has already applied for a job
app.get('/api/applications/check/:job_id', verifyUser, (req, res) => {
  const { job_id } = req.params;
  const employee_id = req.userId; // Retrieve the employee ID from the verified token

  if (!job_id || !employee_id) {
      return res.status(400).json({ message: "Missing job ID or user ID" });
  }

  const query = 'SELECT * FROM applications WHERE job_id = ? AND employee_id = ?';
  db.query(query, [job_id, employee_id], (err, results) => {
      if (err) {
          console.error('Error checking application status:', err);
          return res.status(500).json({ error: 'Database error', details: err.message });
      }

      if (results.length > 0) {
          return res.json({ applied: true }); // User has already applied
      } else {
          return res.json({ applied: false }); // User has not applied
      }
  });
});





// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
