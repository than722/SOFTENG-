const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Create MySQL connection
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
    cb(null, uploadsDir); // Specify the directory for file uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Naming the file uniquely
  }
});

const upload = multer({ storage: storage });

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
  const { statusId } = req.body; // Expect statusId (1 for Active, 2 for Inactive)

  // Update status in employee table
  const updateEmployeeSql = 'UPDATE employee SET status_id = ? WHERE id = ?';
  db.query(updateEmployeeSql, [statusId, id], (err, results) => {
    if (err) {
      console.error('Error executing employee update query:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    // If not updated in employee table, try employer table
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
  const deleteEmployeeSql = 'DELETE FROM employee WHERE status_id = 2'; // Assuming 2 is the ID for rejected
  const deleteEmployerSql = 'DELETE FROM employer WHERE status_id = 2'; // Assuming 2 is the ID for rejected

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

app.listen(8081, () => {
  console.log("Listening on port 8081");
});
