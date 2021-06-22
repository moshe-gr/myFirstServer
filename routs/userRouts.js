const express = require('express');
const userControler = require('../controlers/userControlers.js');

var userRouts = express.Router();
userRouts.post("/create", userControler.createUser);
userRouts.post("/createSupervisor", userControler.createSupervisor);
userRouts.post("/createIntern", userControler.createIntern);
userRouts.put("/:_id", userControler.updateUser);
userRouts.delete("/:_id", userControler.deleteUser);
userRouts.get("/getAll", userControler.getAll);
userRouts.get("/:_id", userControler.getUser);

module.exports = userRouts;