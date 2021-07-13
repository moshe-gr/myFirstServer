const express = require('express');
const testControler = require('../controlers/testControlers.js');

const testRouts = express.Router();
testRouts.get("/getAllSupervisorTests/:_id", testControler.getAllSupervisorTests);
testRouts.get("/getAllInternTests/:_id", testControler.getAllInternTests);
testRouts.get("/getAllInternDone/:_id", testControler.getAllInternDone);
testRouts.get("/getAllSupervisorDone/:_id", testControler.getAllSupervisorDone);
testRouts.put("/addTest", testControler.addTest);
testRouts.put("/addDone", testControler.addDone);
testRouts.put("/markTest", testControler.markTest);
testRouts.delete("/delete/:_id", testControler.deleteTest);

module.exports = testRouts;