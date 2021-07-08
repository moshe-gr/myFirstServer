const express = require('express');
const awsControler = require('../controlers/awsControlers.js');

const awsRouts = express.Router();
awsRouts.post('/upload', awsControler.getUrl);
awsRouts.delete('/delete/:name', awsControler.deleteFile);

module.exports = awsRouts;
