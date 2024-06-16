# dynamic-forms-app
# Dynamic Forms App

## Overview

Dynamic Forms App is a full-stack web application built using the SQL, Express, React, and Node.js (SERN) stack. The app features dynamic forms based on user interaction, form validation, data storage in a MySQL database hosted on Aiven, and data synchronization with Google Sheets.

## Features

- Dynamic forms based on user interaction
- Form validation (alphabetic name, valid country code, numeric phone number)
- Data storage in MySQL database hosted on Aiven
- Data synchronization with Google Sheets
- Data persistence using local storage
- Responsive design for both mobile and desktop views

## Tech Stack

- **Frontend:** React, React Router
- **Backend:** Node.js, Express
- **Database:** MySQL (Aiven)
- **External APIs:** Google Sheets API

## Prerequisites

- Node.js and npm
- MySQL database (Aiven)
- Google Cloud project with Sheets API enabled
- Service account with JSON key for Google Sheets API



## Backend Setup

### Prerequisites

Before setting up the backend, ensure you have the following:

- Node.js and npm installed
- A MySQL instance on Aiven
- A Google Cloud project with the Sheets API enabled
- A service account with JSON key for Google Sheets API

### Steps to Setup

1. **Navigate to the `server` directory**

    Open your terminal and navigate to the `server` directory of the cloned repository:

    ```bash
    cd server
    ```

2. **Install Dependencies**

    Install the required npm packages by running:

    ```bash
    npm install
    ```

3. **Configure MySQL Connection**

    Update the MySQL connection details in `index.js` with your Aiven MySQL instance information:

    ```js
    const dbConfig = {
      host: 'your-aiven-mysql-hostname', // Aiven hostname
      user: 'your-aiven-username',
      password: 'your-aiven-password',
      database: 'your-database-name',
      port: your-aiven-port, // usually 3306
      ssl: {
        rejectUnauthorized: true, // Adjust if needed
      },
    };
    ```

4. **Configure Google Sheets API**

    Update the Google Sheets API configuration in `index.js`:

    - Download your service account key file from Google Cloud Console.
    - Place the key file in the `server` directory.
    - Update the `KEYFILEPATH` and `SPREADSHEET_ID` constants:

    ```js
    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
    const KEYFILEPATH = path.join(__dirname, 'path-to-your-service-account-file.json'); // Path to your service account key file
    const SPREADSHEET_ID = 'your-google-sheet-id'; // Your Google Sheets ID
    ```

5. **Create the Database Table**

    Ensure your MySQL database has the required table. Connect to your MySQL instance and create the table using the following SQL command:

    ```sql
    CREATE TABLE forms (
      id INT AUTO_INCREMENT PRIMARY KEY,
      formType VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      countryCode VARCHAR(10) NOT NULL,
      phoneNumber VARCHAR(20) NOT NULL
    );
    ```

6. **Start the Server**

    Start your Node.js server by running:

    ```bash
    node index.js
    ```

    The server will run on port 5000 by default. You can access it at `http://localhost:5000`.

### API Endpoints

The backend exposes the following API endpoints:

- **POST `/submitForm`**
  - Description: Submits form data to the MySQL database.
  - Request Body:
    ```json
    {
      "formType": "Form A",
      "name": "John Doe",
      "countryCode": "US",
      "phoneNumber": "1234567890"
    }
    ```
  - Response:
    ```json
    {
      "message": "Form data saved successfully!"
    }
    ```

- **GET `/refreshData`**
  - Description: Synchronizes data from the MySQL database with the Google Sheet.
  - Response:
    ```json
    {
      "message": "Data synchronized with Google Sheets successfully"
    }
    ```

### Error Handling

In case of errors, the endpoints will return a `500` status with the error details in the response body.

### Environment Variables

For a production environment, consider using environment variables to manage sensitive information such as database credentials and Google Sheets API keys.

You can use the `dotenv` package to manage environment variables:

1. Install `dotenv`:

    ```bash
    npm install dotenv
    ```

2. Create a `.env` file in the `server` directory and add your environment variables:

    ```env
    DB_HOST=your-aiven-mysql-hostname
    DB_USER=your-aiven-username
    DB_PASSWORD=your-aiven-password
    DB_NAME=your-database-name
    DB_PORT=your-aiven-port
    GOOGLE_SHEET_ID=your-google-sheet-id
    GOOGLE_KEY_FILE=path-to-your-service-account-file.json
    ```

3. Update your `index.js` to use the environment variables:

    ```js
    require('dotenv').config();

    const dbConfig = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      ssl: {
        rejectUnauthorized: true,
      },
    };

    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
    const KEYFILEPATH = path.join(__dirname, process.env.GOOGLE_KEY_FILE);
    const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
    ```

By following these steps, you will have your backend server set up and connected to both Aiven MySQL and Google Sheets API.
