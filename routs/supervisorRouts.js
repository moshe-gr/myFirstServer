const express = require('express');
const supervisorControler = require('../controlers/supervisorControlers.js');

const supervisorRout = express.Router();
supervisorRout.post("/createSupervisor", supervisorControler.createSupervisor);

module.exports = supervisorRout;