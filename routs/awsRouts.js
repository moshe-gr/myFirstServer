const express = require('express');
const awsControler = require('../controlers/awsControlers.js');

const awsRouts = express.Router();
awsRouts.post('/img', awsControler.getUrl);

module.exports = awsRouts;
