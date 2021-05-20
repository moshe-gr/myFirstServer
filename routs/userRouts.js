const express = require('express');

var userRouts = express.Router();
userRouts.post("/create");
userRouts.put("/:_id");
userRouts.delete("/:_id");
userRouts.get("/getAll");
userRouts.get("/:_id");

module.exports = userRouts;