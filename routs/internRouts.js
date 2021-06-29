const express = require('express');
const internControler = require('../controlers/internControlers.js');

const internRouts = express.Router();
internRouts.put("/:_id", internControler.updateIntern);
internRouts.delete("/:_id", internControler.deleteIntern);
internRouts.get("/getAll", internControler.getAll);
internRouts.get("/:_id", internControler.getIntern);

module.exports = internRouts;