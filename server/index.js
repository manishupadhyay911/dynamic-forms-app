const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv').config();
const app = express();
const port = 5000;
app.use(cors());
app.use(bodyParser.json());

// Database connection
const dbConfig = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: 'defaultdb',
  port: 24184,
  ssl: {
    rejectUnauthorized: true, // Adjust if needed
  },
};

const getDBConnection = async () => {
  const connection = await mysql.createConnection(dbConfig);
  return connection;
};

// deployment
const __dirname1=path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/client/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"))
  );
} else {
  
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}


// Google Sheets API setup
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const KEYFILEPATH = path.join(__dirname, '/etc/secrets/secrets.json');
const SPREADSHEET_ID = process.env.SHEET_ID;

// Load client secrets from a local file.
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const sheets = google.sheets({ version: 'v4', auth });

// API endpoints
app.post('/submitForm', async (req, res) => {
  const { formType, name, countryCode, phoneNumber } = req.body;
  const query = 'INSERT INTO forms (formType, name, countryCode, phoneNumber) VALUES (?, ?, ?, ?)';

  try {
    const connection = await getDBConnection();
    await connection.execute(query, [formType, name, countryCode, phoneNumber]);
    await connection.end();
    res.send({ message: 'Form data saved successfully!' });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.get('/refreshData', async (req, res) => {
  const query = 'SELECT * FROM forms';

  try {
    const connection = await getDBConnection();
    const [rows] = await connection.execute(query);
    await connection.end();

    // Format data for Google Sheets
    const data = rows.map(row => [row.formType, row.name, row.countryCode, row.phoneNumber]);

    // Define request to update Google Sheet
    const resource = {
      values: data,
    };

    // Update Google Sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A2', // Adjust the range according to your sheet
      valueInputOption: 'RAW',
      resource,
    });

    res.send({ message: 'Data synchronized with Google Sheets successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
