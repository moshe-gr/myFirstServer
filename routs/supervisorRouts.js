const express = require('express');
const supervisorControler = require('../controlers/supervisorControlers.js');

const supervisorRout = express.Router();
supervisorRout.put("/:_id", supervisorControler.updateSupervisor);

module.exports = supervisorRout;