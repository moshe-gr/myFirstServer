const express = require('express');
const testControler = require('../controlers/testControlers.js');

const testRouts = express.Router();
testRouts.get("/getAllTests/:_id", testControler.getAllTests);
testRouts.put("/addTest", testControler.addTest);

module.exports = testRouts;