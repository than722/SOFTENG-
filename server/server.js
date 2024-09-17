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
  const { accountType, lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName, email, password } = req.body;
  let sql, values;

  if (accountType === 'employee') {
    const pictureUrl = req.files['picture'] ? req.files['picture'][0].filename : null;
    const resumeUrl = req.files['resume'] ? req.files['resume'][0].filename : null;

    sql = 'INSERT INTO employee (lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, picture, resume, status_id, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)';
    values = [lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, pictureUrl, resumeUrl, 2, email, password];
  } else if (accountType === 'employer') {
    sql = 'INSERT INTO employer (lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName, status_id, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)';
    values = [lastName, firstName, middleName, province, municipality, barangay, zipCode, mobileNumber, companyName, 2, email, password];
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

// Route to login (handle both employees and employers)
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const employeeSql = 'SELECT id, email, password, "employee" AS accountType FROM employee WHERE email = ?';
  
  db.query(employeeSql, [email], (err, employeeResults) => {
    if (err) {
      console.error('Error querying employee table:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (employeeResults.length > 0) {
      const employee = employeeResults[0];
      if (password === employee.password) {
        return res.json({ message: 'Login successful', accountType: employee.accountType, id: employee.id });
      } else {
        return res.status(401).json({ error: 'Invalid password' });
      }
    }

    const employerSql = 'SELECT id, email, password, "employer" AS accountType FROM employer WHERE email = ?';
    db.query(employerSql, [email], (err, employerResults) => {
      if (err) {
        console.error('Error querying employer table:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (employerResults.length > 0) {
        const employer = employerResults[0];
        if (password === employer.password) {
          return res.json({ message: 'Login successful', accountType: employer.accountType, id: employer.id });
        } else {
          return res.status(401).json({ error: 'Invalid password' });
        }
      }

      return res.status(404).json({ error: 'User not found' });
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

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

app.listen(8081, () => {
  console.log("Listening on port 8081");
});
