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

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'), false);
    }
    cb(null, true);
  },
});


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
  // Access the token from the cookies
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ error: 'Authentication token is missing. Please log in.' });
  }

  // Verify the token
  jwt.verify(token, 'our-jsonwebtoken-secret-key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Attach user information to the request object
    req.userId = decoded.userId;  // Assuming decoded contains the userId
    req.userType = decoded.userType;  // You can also store userType if needed
    next();
  });
};

module.exports = verifyUser;




app.use('/uploads', express.static('uploads'));

app.post(
  '/signup',
  upload.fields([
    { name: 'picture', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'birth_certificate', maxCount: 1 },
    { name: 'validId', maxCount: 1 },
    { name: 'passport', maxCount: 1 },  // Optional
    { name: 'marriage_contract', maxCount: 1 },  // Optional
  ]),
  (req, res) => {
    // Ensure accountType is present in the body
    const { accountType, lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName, email, password, civilStatus, birthday } = req.body;

    if (!accountType) {
      return res.status(400).json({ error: 'Account type is required.' });
    }

    if (!['employee', 'employer'].includes(accountType)) {
      return res.status(400).json({ error: 'Invalid account type.' });
    }

    // Validate other required fields
    if (!lastName || !firstName || !email || !password) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Log received data and files
    console.log('Received signup data:', req.body);
    console.log('Received files:', req.files);

    const birthCertificateUrl = req.files['birth_certificate']?.[0]?.filename || null;
    const validIdUrl = req.files['validId']?.[0]?.filename || null;
    const passportUrl = req.files['passport']?.[0]?.filename || null;
    const marriageContractUrl = req.files['marriage_contract']?.[0]?.filename || null;
    const pictureUrl = req.files['picture']?.[0]?.filename || null;
    const resumeUrl = req.files['resume']?.[0]?.filename || null;

    // Validate required fields for married users (only if married)
    if (civilStatus === 'married' && !marriageContractUrl) {
      return res.status(400).json({ error: 'Marriage contract is required for married users.' });
    }

    // Validate birthday between 23 and 45 years ago
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 45, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear() - 23, today.getMonth(), today.getDate());
    const selectedBirthday = new Date(birthday);
    if (selectedBirthday < minDate || selectedBirthday > maxDate) {
      return res.status(400).json({ error: 'Birthday must indicate an age between 23 and 45.' });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Error during password hashing:", err);
        return res.status(500).json({ error: 'Internal server error', details: err.message });
      }

      let sql, values;
      const userBirthday = birthday || null; // Handle missing birthday

      // Insert data based on account type
      if (accountType === 'employee') {
        sql = `
          INSERT INTO employee 
          (lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, civil_status, picture, resume, birth_certificate, validId, passport, marriage_contract, email, password, birthday) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        values = [
          lastName,
          firstName,
          middleName,
          province,
          municipality,
          barangay,
          zipCode,
          mobileNumber,
          civilStatus,
          pictureUrl,
          resumeUrl,
          birthCertificateUrl,
          validIdUrl,
          passportUrl,  // Optional passport
          marriageContractUrl, // Optional marriage contract
          email,
          hashedPassword,
          userBirthday,
        ];
      } else if (accountType === 'employer') {
        sql = `
          INSERT INTO employer 
          (lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName, validId, email, password, birthday) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
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
          userBirthday,
        ];
      } else {
        return res.status(400).json({ error: 'Invalid account type' });
      }

      // Insert into the employee/employer table
      db.query(sql, values, (err, results) => {
        if (err) {
          console.error('Database error during insert:', err);
          return res.status(500).json({ error: 'Database error', details: err.message });
        }

        const userId = results.insertId;
        const userType = accountType === 'employee' ? 'employee' : 'employer';

        // Insert into the user table
        const userSql = 'INSERT INTO user (user_type, employee_id, employer_id) VALUES (?, ?, ?)';
        db.query(userSql, [userType, userType === 'employee' ? userId : null, userType === 'employer' ? userId : null], (err) => {
          if (err) {
            console.error('Error inserting into user table:', err);
            return res.status(500).json({ error: 'Database error while inserting user', details: err.message });
          }
          res.json({ id: userId });
        });
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
           zipCode, mobileNumber, picture, resume, status_id AS statusId, progress_id,
           email, 'Employee' AS userType
    FROM employee
  `;

  const employerQuery = `
    SELECT employer_id AS id, lastName, firstName, middleName, province, municipality, barangay, 
           zipCode, mobileNumber, companyName, status_id AS statusId, progress_id, 
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

app.put('/api/users/:id/status', (req, res) => {
  console.log(req.originalUrl); // Log the requested URL
  console.log(req.body); // Log the request body

  const userId = req.params.id; // This is now the employee_id or employer_id
  const { progressId } = req.body;

  // Validate progressId is provided in the request body
  if (!progressId) {
    return res.status(400).json({ error: 'Missing progressId in request body' });
  }

  const queryEmployee = `UPDATE employee SET progress_id = ? WHERE employee_id = ?`;
  const queryEmployer = `UPDATE employer SET progress_id = ? WHERE employer_id = ?`;
  const updateEmployeeStatus = `UPDATE employee SET status_id = 1 WHERE employee_id = ?`; // Update status_id to 1 when accepted

  // First, check if the user is an employee by querying the employee table
  db.query('SELECT * FROM employee WHERE employee_id = ?', [userId], (err, employeeResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to query employee data' });
    }

    if (employeeResults.length > 0) {
      // If the user is found in the employee table, update their progress
      db.query(queryEmployee, [progressId, userId], (err, updateResults) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to update employee progress' });
        }

        if (updateResults.affectedRows > 0) {
          // If the progress is accepted (progressId = 1), update the employee's status_id to 1
          if (progressId === 1) {
            db.query(updateEmployeeStatus, [userId], (err, statusUpdateResults) => {
              if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Failed to update employee status' });
              }

              if (statusUpdateResults.affectedRows > 0) {
                return res.json({ message: 'Employee progress and status updated successfully' });
              } else {
                return res.status(404).json({ error: 'Employee status not updated' });
              }
            });
          } else {
            return res.json({ message: 'Employee progress updated successfully' });
          }
        } else {
          return res.status(404).json({ error: 'Employee not found or progress not updated' });
        }
      });
    } else {
      // If the user is not an employee, check if they are an employer
      db.query('SELECT * FROM employer WHERE employer_id = ?', [userId], (err, employerResults) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to query employer data' });
        }

        if (employerResults.length > 0) {
          // If the user is found in the employer table, update their progress
          db.query(queryEmployer, [progressId, userId], (err, updateResults) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Failed to update employer progress' });
            }

            if (updateResults.affectedRows > 0) {
              return res.json({ message: 'Employer progress updated successfully' });
            } else {
              return res.status(404).json({ error: 'Employer not found or progress not updated' });
            }
          });
        } else {
          // If the user is neither an employee nor an employer, return an error
          return res.status(404).json({ error: 'User not found in both employee and employer tables' });
        }
      });
    }
  });
});





// Delete rejected users
app.delete('/api/users/rejected', (req, res) => {
  const queryEmployee = `DELETE FROM employees WHERE progress_id = 2`;
  const queryEmployer = `DELETE FROM employers WHERE progress_id = 2`;

  db.query(queryEmployee, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete rejected employees' });
    }
    db.query(queryEmployer, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to delete rejected employers' });
      }
      return res.json({ message: 'Rejected users deleted successfully' });
    });
  });
});

// Route to get user profile by user_id (employee or employer)
app.get('/api/users/:userId', (req, res) => {
  const { userId } = req.params;
  const { userType } = req.query;

  // Validate userType
  if (!userType || (userType !== 'employee' && userType !== 'employer')) {
    return res.status(400).json({ error: 'Invalid user type' });
  }

  const employeeQuery = `
    SELECT employee_id AS id, lastName, firstName, middleName, province, municipality, barangay, 
           zipCode, mobileNumber, picture, resume, validId, birth_certificate, passport, marriage_contract, 
           birthday, 'employee' AS userType 
    FROM employee 
    WHERE employee_id = ?;
  `;
  
  const employerQuery = `
    SELECT employer_id AS id, lastName, firstName, middleName, province, municipality, barangay, 
           zipCode, mobileNumber, companyName, birthday, 'employer' AS userType 
    FROM employer 
    WHERE employer_id = ?;
  `;

  // Choose the query based on the userType
  const query = userType === 'employee' ? employeeQuery : employerQuery;

  // Query the database for the user
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    if (results.length > 0) {
      const user = results[0];

      // Append file URLs to user data
      user.pictureUrl = user.picture ? `/uploads/${user.picture}` : null;
      user.resumeUrl = user.resume ? `/uploads/${user.resume}` : null;
      user.validIDUrl = user.validId ? `/uploads/${user.validId}` : null;
      user.birthcertificateUrl = user.birth_certificate ? `/uploads/${user.birth_certificate}` : null;
      user.passportUrl = user.passport ? `/uploads/${user.passport}` : null;
      user.marriagecontractUrl = user.marriage_contract ? `/uploads/${user.marriage_contract}` : null;

      // If the user is an employee, fetch deficiencies
      if (userType === 'employee') {
        const getDeficienciesQuery = `
          SELECT file_name 
          FROM deficiency_requests
          WHERE employee_id = ?;
        `;

        db.query(getDeficienciesQuery, [userId], (err, deficienciesResults) => {
          if (err) {
            console.error("Error fetching deficiencies:", err);
            return res.status(500).json({ error: 'Failed to fetch deficiencies', details: err.message });
          }

          const deficiencies = deficienciesResults.map((row) => row.file_name);
          user.deficiencies = deficiencies;

          // Check if there are no deficiencies
          if (deficiencies.length === 0) {
            user.noDeficienciesMessage = "All files are submitted. No deficiencies.";
          }

          // Send the response after adding deficiencies and message
          return res.json(user);
        });
      } else {
        // If the user is an employer, no deficiencies data is needed
        return res.json(user);
      }
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  });
});



// Route to serve uploaded files (e.g., picture, resume)
app.get('/uploads/:fileName', (req, res) => {
  const { fileName } = req.params;

  if (!fileName) {
    return res.status(400).send('File name is required.');
  }

  // Sanitize the file name to prevent directory traversal attacks
  const sanitizedFileName = path.basename(fileName);

  // Use only the 'uploads' directory path
  const filePath = path.join(__dirname, 'uploads', sanitizedFileName);

  // Validate file existence
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found.');
  }

  // Optional: Validate file extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
  const fileExtension = path.extname(sanitizedFileName).toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    return res.status(400).send('Invalid file type.');
  }

  // Serve the file
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error while sending file:', err);
      res.status(500).send('Could not send the file.');
    }
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

// Route to get job postings created by the current employer
app.get('/api/employers/:employerId/jobs', (req, res) => {
  const employerId = req.params.employerId;
  const sql = 'SELECT * FROM job_postings WHERE employer_id = ?';

  db.query(sql, [employerId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.json(results);
  });
});

// Add this route to your Express server
app.get('/api/applications/job/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  const sql = 'SELECT * FROM applications WHERE job_id = ?';

  db.query(sql, [jobId], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Database error', details: err.message });
      }
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

  // Check if the job has any applications in the 'applications' table
  const checkApplicationSql = 'SELECT * FROM applications WHERE job_id = ?';
  db.query(checkApplicationSql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err.message });
    
    // If there are applications for this job, prevent deletion
    if (results.length > 0) {
      return res.status(400).json({ error: 'Cannot delete job posting: job has applicants' });
    }

    // Proceed with the deletion if no applications found
    const deleteJobSql = 'DELETE FROM job_postings WHERE job_id = ?';
    db.query(deleteJobSql, [id], (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error', details: err.message });
      if (results.affectedRows === 0) return res.status(404).json({ error: 'Job posting not found' });
      res.json({ message: 'Job posting deleted successfully' });
    });
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
  const getEmployeeDetailsQuery = 'SELECT email, lastName, firstName, status_id, progress_id FROM employee WHERE employee_id = ?';
  db.query(getEmployeeDetailsQuery, [employee_id], (err, employeeResults) => {
    if (err) {
      console.error('Error fetching employee details:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    if (employeeResults.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const { email, lastName, firstName, status_id, progress_id } = employeeResults[0];

    // Check if the employee's progress_id and status_id allow them to apply
    if (progress_id === 2 || progress_id === 3) {
      return res.status(403).json({ message: 'You are not allowed to apply for jobs due to your current status.' });
    }

    if (status_id === 2 || status_id === 3) {
      return res.status(403).json({ message: 'You are not allowed to apply for jobs due to your current status.' });
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

app.get('/api/employees/status', verifyUser, (req, res) => {
  const employee_id = req.userId;  // Retrieved from the decoded token

  // Fetch the status_id and progress_id from the employee table
  const getEmployeeStatusQuery = 'SELECT status_id, progress_id FROM employee WHERE employee_id = ?';
  db.query(getEmployeeStatusQuery, [employee_id], (err, results) => {
      if (err) {
          console.error('Error fetching employee status:', err);
          return res.status(500).json({ error: 'Database error', details: err.message });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'Employee not found' });
      }

      const { status_id, progress_id } = results[0];
      res.status(200).json({ status_id, progress_id });
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
          j.jobName,  -- Add jobName from job_postings table
          a.applications_id,  -- Keep applications_id as per your schema
          a.firstName, 
          a.lastName, 
          a.email, 
          a.apply_date, 
          a.status_id,
          a.employee_id  -- Add employee_id for reference
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

      // If there are no applicants, return an empty array
      if (results.length === 0) {
          return res.json([]); // Send an empty array instead of a 404
      }

      // Send the results, which include job details and applicant info
      res.json(results);
  });
});



// Get details of an applicant based on applicationId
app.get('/api/applicants/:applicationId', (req, res) => {
  const applicationId = req.params.applicationId;

  if (!applicationId) {
    return res.status(400).send("Missing applicationId.");
  }

  const getEmployeeIdQuery = `
    SELECT employee_id
    FROM applications
    WHERE applications_id = ?;
  `;

  db.query(getEmployeeIdQuery, [applicationId], (err, results) => {
    if (err) {
      console.error("Error fetching employee_id from applications:", err);
      return res.status(500).send("Failed to fetch employee_id from applications.");
    }

    if (results.length === 0) {
      return res.status(404).send("Application not found.");
    }

    const employeeId = results[0].employee_id;

    const getEmployeeDetailsQuery = `
      SELECT 
        e.employee_id, 
        e.firstName, 
        e.lastName, 
        e.email, 
        e.province, 
        e.municipality, 
        e.barangay, 
        e.zipCode,
        e.picture, 
        e.resume,   
        e.validId,  
        e.status_id
      FROM employee e
      WHERE e.employee_id = ?;
    `;

    db.query(getEmployeeDetailsQuery, [employeeId], (err, employeeResults) => {
      if (err) {
        console.error("Error fetching employee details:", err);
        return res.status(500).send("Failed to fetch employee details.");
      }

      if (employeeResults.length === 0) {
        return res.status(404).send("Employee details not found.");
      }

      const employee = employeeResults[0];
      console.log("Employee details:", employee);

      const pictureUrl = employee.picture ? `/uploads/${employee.picture}` : null;
      const resumeUrl = employee.resume ? `/uploads/${employee.resume}` : null;
      const valid_id_Url = employee.validId ? `/uploads/${employee.validId}` : null;

      let status = '';
      switch (employee.status_id) {
        case 1:
          status = 'Active';
          break;
        case 2:
          status = 'Inactive';
          break;
        case 3:
          status = 'Pending';
          break;
        default:
          status = 'Unknown';
          break;
      }

      // Ensure the response is sent only once
      console.log("Sending response with employee details:", {
        ...employee,
        status: status,
        picture_url: pictureUrl,
        resume_url: resumeUrl,
        valid_id_url: valid_id_Url,
      });

      return res.json({
        ...employee,
        status: status,
        picture_url: pictureUrl,
        resume_url: resumeUrl,
        valid_id_url: valid_id_Url,
      });
    });
  });
});




app.put('/api/employees/:employeeId/hire', (req, res) => {
  const { employeeId } = req.params;
  const { status_id } = req.body; // Should be 4 for hired

  console.log(`Hiring employee with ID: ${employeeId} and status_id: ${status_id}`); // Debugging log

  if (status_id !== 4) {
    return res.status(400).json({ success: false, message: 'Invalid status_id for hiring. Must be 4.' });
  }

  // Step 1: Update the employee table first
  const updateEmployeeSql = 'UPDATE employee SET status_id = ? WHERE employee_id = ?';
  db.query(updateEmployeeSql, [status_id, employeeId], (empError, empResult) => {
    if (empError) {
      console.error(empError);
      return res.status(500).json({ success: false, message: 'Server error while updating employee status.' });
    }

    if (empResult.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found or already hired.' });
    }

    console.log(`Employee status updated for employee_id: ${employeeId}`);

    // Step 2: Update the applications table for the specific employee_id
    const updateApplicationSql = `
      UPDATE applications
      SET status_id = ?
      WHERE employee_id = ?`; // Ensures only this employee's applications are updated

    db.query(updateApplicationSql, [status_id, employeeId], (appError, appResult) => {
      if (appError) {
        console.error(appError);
        return res.status(500).json({ success: false, message: 'Server error while updating application status.' });
      }

      if (appResult.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'No applications found for the given employee ID.' });
      }

      console.log(`Application status updated for employee_id: ${employeeId}`);
      res.status(200).json({
        success: true,
        message: 'Applicant hired successfully. Status updated in both employee and applications tables.',
      });
    });
  });
});

app.put('/api/employees/:employeeId/reject', (req, res) => {
  const { employeeId } = req.params;
  const { status_id } = req.body; // Should be 5 for rejected

  console.log(`Rejecting employee with ID: ${employeeId} and status_id: ${status_id}`); // Debugging log

  if (status_id !== 5) {
    return res.status(400).json({ success: false, message: 'Invalid status_id for rejection. Must be 5.' });
  }

  // Step 1: Update the employee table first
  const updateEmployeeSql = 'UPDATE employee SET status_id = ? WHERE employee_id = ?';
  db.query(updateEmployeeSql, [status_id, employeeId], (empError, empResult) => {
    if (empError) {
      console.error(empError);
      return res.status(500).json({ success: false, message: 'Server error while updating employee status.' });
    }

    if (empResult.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found or already rejected.' });
    }

    console.log(`Employee status updated for employee_id: ${employeeId}`);

    // Step 2: Update the applications table for the specific employee_id
    const updateApplicationSql = `
      UPDATE applications
      SET status_id = ?
      WHERE employee_id = ?`; // Ensures only this employee's applications are updated

    db.query(updateApplicationSql, [status_id, employeeId], (appError, appResult) => {
      if (appError) {
        console.error(appError);
        return res.status(500).json({ success: false, message: 'Server error while updating application status.' });
      }

      if (appResult.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'No applications found for the given employee ID.' });
      }

      console.log(`Application status updated for employee_id: ${employeeId}`);
      res.status(200).json({
        success: true,
        message: 'Applicant rejected successfully. Status updated in both employee and applications tables.',
      });
    });
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

app.get("/api/applied-jobs/:employeeID", (req, res) => {
  const { employeeID } = req.params;

  if (!employeeID) {
    return res.status(400).json({ message: "Employee ID is required" });
  }

  // Query to check if the employeeID exists in the applications table
  const queryApplications = `
    SELECT job_id 
    FROM applications 
    WHERE employee_id = ?;
  `;

  db.query(queryApplications, [employeeID], (err, applicationResults) => {
    if (err) {
      console.error("Error fetching applications:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    // If no applications found, return an empty array
    if (applicationResults.length === 0) {
      return res.json([]); // Send an empty array instead of a 404
    }

    // Get all job_id values
    const jobIds = applicationResults.map((row) => row.job_id);

    // Query to fetch job details based on job_ids
    const queryJobDetails = `
      SELECT 
        jp.job_id, 
        jp.jobName, 
        jp.jobOverview, 
        jp.jobDescription, 
        jp.salary, 
        jp.country, 
        jp.datePosted, 
        e.companyName AS employerName,
        e.employer_id AS employerID
      FROM job_postings jp
      JOIN employer e ON jp.employer_id = e.employer_id
      WHERE jp.job_id IN (?);
    `;

    db.query(queryJobDetails, [jobIds], (err, jobResults) => {
      if (err) {
        console.error("Error fetching job details:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      // Include employer's name in the response
      const enrichedResults = jobResults.map((job) => ({
        jobID: job.job_id,
        jobName: job.jobName,
        jobOverview: job.jobOverview,
        jobDescription: job.jobDescription,
        salary: job.salary,
        country: job.country,
        datePosted: job.datePosted,
        employerName: job.employerName,
        employerID: job.employerID,
      }));

      res.json(enrichedResults); // Send enriched job results
    });
  });
});


app.post('/api/users/:userId/withdraw', verifyUser, (req, res) => {
  const { userId } = req.params; // userId from URL (should be employee_id)
  const { reason } = req.body;   // Withdrawal reason

  // Step 1: Check if the userId matches the employee_id in the token
  if (parseInt(userId) !== req.userId) {
    return res.status(403).json({ error: "You are not authorized to withdraw this application." });
  }

  // Step 2: Fetch the applications_id for the employee using employee_id
  db.query(
    'SELECT applications_id FROM applications WHERE employee_id = ? LIMIT 1',
    [req.userId], // Use employee_id from the token (req.userId)
    (err, results) => {
      if (err) {
        console.error('Error fetching applications ID:', err);
        return res.status(500).json({ error: "Error retrieving application information." });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "No application found for this employee." });
      }

      const applicationId = results[0].applications_id;

      // Step 3: Insert the withdrawal request into the withdrawals table using employee_id
      db.query(
        'INSERT INTO withdrawals (employee_id, application_id, reason) VALUES (?, ?, ?)', // Using employee_id as foreign key
        [req.userId, applicationId, reason],  // Insert the withdrawal request
        (err, results) => {
          if (err) {
            console.error('Error inserting withdrawal request:', err);
            return res.status(500).json({ error: "Error processing your withdrawal request." });
          }

          res.status(200).json({ message: "Withdrawal request submitted successfully." });
        }
      );
    }
  );
});

  // Fetch all withdrawal requests
app.get('/api/admin/withdrawal-requests', (req, res) => {
  // Fetch all withdrawal requests and join with the employee table to get the full name
  db.query(
    `
    SELECT withdrawals.withdrawal_id, withdrawals.reason, withdrawals.withdrawn_at, withdrawals.employee_id, 
           CONCAT(employee.firstName, ' ', employee.lastName) AS applicantName
    FROM withdrawals
    JOIN employee ON withdrawals.employee_id = employee.employee_id
    ORDER BY withdrawals.withdrawn_at DESC
    `,
    (err, results) => {
      if (err) {
        console.error('Error fetching withdrawal requests:', err);
        return res.status(500).json({ error: 'Error fetching withdrawal requests.' });
      }

      // Respond with the withdrawal requests
      res.status(200).json(results);
    }
  );
});
  
  // Approve or reject a withdrawal request
  app.post('/api/admin/withdrawal-requests/:id', (req, res) => {
    const { id } = req.params;
    const { action } = req.body; // 'approve' or 'reject'
  
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Must be "approve" or "reject".' });
    }
  
    // Update the status of the withdrawal request
    db.query(
      'UPDATE withdrawals SET status = ? WHERE withdrawal_id = ?',
      [action === 'approve' ? 'Approved' : 'Rejected', id],
      (err, result) => {
        if (err) {
          console.error('Error updating withdrawal request:', err);
          return res.status(500).json({ error: 'Failed to process the withdrawal request.' });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Withdrawal request not found.' });
        }
  
        // Send success response
        res.status(200).json({ message: `Withdrawal request ${action}ed successfully.` });
      }
    );
  });

// API to fetch notifications based on employee_id
app.get('/api/notifications/:employeeId', (req, res) => {
  const employeeId = parseInt(req.params.employeeId, 10);

  if (!employeeId) {
    return res.status(400).json({ error: 'Invalid employee ID' });
  }

  const query = `
    SELECT 
      applications.status_id,
      job_postings.jobName,
      employer.firstName AS employer_first_name,  -- Corrected to firstName
      employer.lastName AS employer_last_name,    -- Corrected to lastName
      CASE 
        WHEN applications.status_id = 4 THEN CONCAT('You have been hired by ', employer.firstName, ' ', employer.lastName, ' for the position of ', job_postings.jobName)
        WHEN applications.status_id = 5 THEN CONCAT('Your application for the position of ', job_postings.jobName, ' has been rejected.')
        ELSE NULL
      END AS message,
      CASE 
        WHEN applications.status_id = 4 THEN 'hire'
        WHEN applications.status_id = 5 THEN 'application'
        ELSE 'general'
      END AS type
    FROM applications
    INNER JOIN job_postings ON applications.job_id = job_postings.job_id
    INNER JOIN employer ON job_postings.employer_id = employer.employer_id
    WHERE applications.employee_id = ? AND applications.status_id IN (4, 5)
  `;

  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching notifications:', err);
      return res.status(500).json({ error: 'Failed to fetch notifications' });
    }

    const notifications = results.map((row) => ({
      id: row.status_id, // Adjust the notification ID accordingly
      message: row.message,
      type: row.type,
    }));

    res.json(notifications);
  });
});

  

// API to mark a notification as read
app.delete('/api/notifications/:notificationId', (req, res) => {
  const notificationId = parseInt(req.params.notificationId, 10);
  const { userType } = req.query; // Distinguish between employee and employer

  if (!notificationId || !userType) {
    return res.status(400).json({ error: 'Invalid request parameters' });
  }

  let query;

  // Clear notifications based on userType
  if (userType === 'employee') {
    query = 'DELETE FROM applications WHERE status_id = ?';
  } else if (userType === 'employer') {
    query = 'DELETE FROM applications WHERE applications_id = ?';
  } else {
    return res.status(400).json({ error: 'Invalid user type' });
  }

  db.query(query, [notificationId], (err, results) => {
    if (err) {
      console.error('Error clearing notification:', err);
      return res.status(500).json({ error: 'Failed to clear notification' });
    }

    res.json({ message: 'Notification cleared successfully' });
  });
});


// Route to get notifications for an employer
app.get('/api/employers/:employerId/notifications', (req, res) => {
  const { employerId } = req.params;

  const query = `
    SELECT 
      a.applications_id AS notificationId,
      a.employee_id,
      a.lastName,
      a.firstName,
      a.job_id,
      j.jobName,
      a.apply_date,
      a.status_id AS \`status\`
    FROM applications AS a
    JOIN job_postings AS j ON a.job_id = j.job_id
    WHERE a.employer_id = ?
    ORDER BY a.apply_date DESC;
  `;

  db.query(query, [employerId], (err, results) => {
    if (err) {
      console.error('Error fetching notifications:', err);
      res.status(500).json({ error: 'Failed to fetch notifications' });
      return;
    }

    const notifications = results.map((row) => ({
      applicationId: row.notificationId, // Keep applicationId for notifications
      employeeId: row.employee_id,
      employeeName: `${row.firstName} ${row.lastName}`,
      jobId: row.job_id, // Use job_id for the job details
      jobName: row.jobName,
      message: `${row.firstName} ${row.lastName} applied for the job: ${row.jobName}`,
      applyDate: new Date(row.apply_date).toISOString(),
      status: row.status,
    }));

    res.json(notifications);
  });
});




app.post('/api/deficiencies/request', (req, res) => {
  const { applicantId, requiredFiles, reason } = req.body;

  if (!applicantId || !Array.isArray(requiredFiles) || requiredFiles.length === 0) {
    return res.status(400).json({ message: 'Applicant ID, required files, and reason are required.' });
  }

  const query = 'INSERT INTO deficiency_requests (employee_id, file_name, reason) VALUES ?';
  const values = requiredFiles.map((file) => [applicantId, file, reason]);

  db.query(query, [values], (err) => {
    if (err) {
      console.error('Error saving deficiency request:', err);
      return res.status(500).json({ message: 'Failed to save deficiency request.' });
    }
    res.json({ message: 'Deficiency request saved successfully.' });
  });
});


// Get deficiencies for a specific employee
app.post('/api/employees/:employeeId/submit-file', upload.single('file'), async (req, res) => {
  console.log('Received File:', req.file);
  console.log('Employee ID:', req.params.employeeId);
  console.log('File Type:', req.body.type);

  const { employeeId } = req.params;
  const { type } = req.body;

  if (!req.file || !type) {
    return res.status(400).json({ error: 'File or type not provided.' });
  }

  const filePath = req.file.path;
  const columnMap = {
    picture: 'picture',
    resume: 'resume',
    validId: 'validId',
    birth_certificate: 'birth_certificate',
    passport: 'passport',
    marriage_contract: 'marriage_contract',
  };

  if (!columnMap[type]) {
    return res.status(400).json({ error: 'Invalid file type.' });
  }

  try {
    // Ensure employeeId is valid
    if (isNaN(employeeId)) {
      return res.status(400).json({ error: 'Invalid employee ID.' });
    }

    // Update the respective file column in the employee table
    const column = columnMap[type];
    const sql = `UPDATE employee SET ${column} = ? WHERE employee_id = ?`;
    const values = [filePath, employeeId];

    db.execute(sql, values, (err, result) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        return res.status(500).json({ error: 'Error updating employee data' });
      }

      if (result.affectedRows > 0) {
        // Increment progress_step in the admin table
        const progressQuery = `
          UPDATE admin 
          SET progress_step = progress_step + 1 
          WHERE employee_id = ?`;
        db.query(progressQuery, [employeeId], (progressErr) => {
          if (progressErr) {
            console.error('Error updating progress_step:', progressErr);
            return res.status(500).json({ error: 'Error updating progress step.' });
          }
          res.status(200).json({ message: 'File uploaded successfully and progress updated!' });
        });
      } else {
        res.status(400).json({ error: 'Failed to update employee record.' });
      }
    });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: 'Failed to upload file.' });
  }
});




// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
