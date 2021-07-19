const express = require('express');
const internControler = require('../controlers/internControlers.js');

const internRouts = express.Router();
internRouts.post("/createIntern", internControler.createIntern);
internRouts.put("/:_id", internControler.updateIntern);
internRouts.get("/:_id", internControler.getIntern);

module.exports = internRouts;