const express = require('express');
const bodyParser = require('body-parser');
const _ = require('dotenv').config();
const connectDB = require('./config/dbConn');

connectDB();

const port = process.env.port; // Server Port
const app = express();
app.use(bodyParser.json());

app.use('/owners', require('./routes/owner'));
app.use('/cars', require('./routes/car'));

app.listen(port, () => {
    console.log(`The server is running on port: ${port}...`)
});