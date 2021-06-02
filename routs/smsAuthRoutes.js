const express = require('express');
const smsAuthControler = require('../controlers/smsAuthControlers.js');

var smsAuthRouts = express.Router();
smsAuthRouts.post('/request', smsAuthControler.authRequest);
smsAuthRouts.post('/check', smsAuthControler.authCheck);
smsAuthRouts.post('/cancel', smsAuthControler.authCancel);
smsAuthRouts.get('/:passport', smsAuthControler.authLogin);

module.exports = smsAuthRouts;