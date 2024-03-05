// app.js

const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false, // Don't reject unauthorized connections (for self-signed certificates)
        ca: fs.readFileSync(process.env.CERT_CA).toString(),
        key: fs.readFileSync(process.env.CERT_KEY).toString(),
        cert: fs.readFileSync(process.env.CERT_CERT).toString()
    }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define routes
app.post('/submit-form', async (req, res) => {
    try {
        const { customer_name, age,email} = req.body;

        // Insert data into PostgreSQL
        const client = await pool.connect();
        const result = await client.query('INSERT INTO customer (customer_name,age,email) VALUES ($1, $2,$3)', [customer_name,age,email]);
        client.release();

        res.status(200).send('Data inserted successfully');
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/',async(req,res)=>{
    res.send("HTTPS")
})

https.createServer({
    key: fs.readFileSync(process.env.CERT_KEY),
    cert: fs.readFileSync(process.env.CERT_CERT),
    ca: fs.readFileSync(process.env.CERT_CA)
}, app).listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
});
