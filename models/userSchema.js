const mongoose = require('mongoose');
const schema = mongoose.Schema;

var userSchema = new schema({});

module.exports = mongoose.model("user", userSchema);