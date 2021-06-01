const port = process.env.PORT || 8080;
const dbPath = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myFirst";
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouts = require('./routs/userRouts.js');
const smsAuthRouts = require('./routs/smsAuthRoutes.js')
const UserToken = require("./models/userToken.js");

var app = express();

mongoose.connect(dbPath);
console.log(dbPath);

app.use(cors());
app.use(express.json());
app.use('/auth', smsAuthRouts);
app.use('/api', (req, res, next) => {
    let userToken = new UserToken(false, req.headers['x-access-token']);
    if (userToken.isNotExpired) {
        req.user = userToken;
        next();
    }
    else {
        res.status(401).send();
    }
})
app.use('/api/users', userRouts);
app.listen(port, console.log("Server up at port " + port));