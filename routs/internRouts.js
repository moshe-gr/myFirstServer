const express = require('express');
const internControler = require('../controlers/internControlers.js');

var internRouts = express.Router();
internRouts.post("/create", internControler.createIntern);
internRouts.put("/:_id", internControler.updateIntern);
internRouts.delete("/:_id", internControler.deleteIntern);
internRouts.get("/getAll", internControler.getAll);
internRouts.get("/:_id", internControler.getIntern);

module.exports = internRouts;