const express = require('express');
const app = express();
const API_KEY = 'YOUR_SECRET_API_KEY';
const path = require('path');

app.get('/api/get-css', (req, res) => {
    if (req.query.apikey === API_KEY) {
        res.sendFile(path.join(__dirname, 'public/css/style.css'));
    } else {
        res.status(403).send('Access Denied');
    }
});

app.get('/api/get-js', (req, res) => {
    if (req.query.apikey === API_KEY) {
        res.sendFile(path.join(__dirname, 'public/js/main.js'));
    } else {
        res.status(403).send('Access Denied');
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
