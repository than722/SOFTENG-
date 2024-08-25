const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: 'root',
  password: 'root',
  database: 'mydb'
});

app.post('/signup', (req, res) => {
  const accountType = req.body.accountType;

  if (accountType === 'employee') {
    const sqlEmployee = "INSERT INTO employee (`lastName`, `firstName`, `middleName`, `province`, `municipality`, `barangay`, `zipCode`, `mobileNumber`) VALUES (?)";
    const valuesEmployee = [
      req.body.lastName,
      req.body.firstName,
      req.body.middleName,
      req.body.province,
      req.body.municipality,
      req.body.barangay,
      req.body.zipCode,
      req.body.mobileNumber
    ];

    db.query(sqlEmployee, [valuesEmployee], (err, data) => {
      if (err) return res.json(err);
      return res.json({ message: 'Employee registered successfully', data });
    });

  } else if (accountType === 'employer') {
    const sqlEmployer = "INSERT INTO employer (`lastName`, `firstName`, `middleName`, `province`, `municipality`, `barangay`, `zipCode`, `mobileNumber`, `companyName`) VALUES (?)";
    const valuesEmployer = [
      req.body.lastName,
      req.body.firstName,
      req.body.middleName,
      req.body.province,
      req.body.municipality,
      req.body.barangay,
      req.body.zipCode,
      req.body.mobileNumber,
      req.body.companyName
    ];

    db.query(sqlEmployer, [valuesEmployer], (err, data) => {
      if (err) return res.json(err);
      return res.json({ message: 'Employer registered successfully', data });
    });

  } else {
    res.status(400).json({ message: 'Invalid account type' });
  }
});

app.get("/", (req, res) => {
  res.send("server is ready");
});

app.listen(8081, () => {
  console.log("Listening on port 8081");
});
