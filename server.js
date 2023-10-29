const express = require('express');
require('dotenv').config();
const cors = require('cors');
const primaryRoutes = require('./backend/routes/primaryRoutes.js');
const dotenv = require("dotenv");
const path = require('path');

// instantiating
const app = express();

// variables
const PORT = process.env.PORT || 5000;

// server middleware
app.use(cors({ origin: '*' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/",primaryRoutes);

app.use(express.static('./client/build'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname,'./client','build','index.html'));
  
});

app.listen(PORT, () => console.log('Server listening on: ', PORT));
