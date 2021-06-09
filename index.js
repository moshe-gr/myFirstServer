const port = process.env.PORT || 8080;
const dbPath = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myFirst";
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouts = require('./routs/userRouts.js');
const smsAuthRouts = require('./routs/smsAuthRoutes.js');
const UserToken = require('./models/userToken.js');
const faceDetect = require('./utils/faceDetection.js');
const internRouts = require('./routs/internRouts.js');

var app = express();

mongoose.connect(dbPath);
console.log(dbPath);

app.use(cors());
app.use(express.json());
app.use('/auth', smsAuthRouts);
app.use('/faceDetect', (req, res) => {
    let face = faceDetect(req.body.pic);
    face.then(
        result => {
            if (result == 1) {
                res.status(200).send();
            }
            else {
                res.status(401).send({ msg: result > 1 ? "To many faces" : "Cant find face" });
            }
        },
        reject => {
            res.status(500).send({ msg: reject });
        }
    )
})
app.use('/api', (req, res, next) => {
    let userToken = new UserToken(false, req.headers['x-access-token']);
    if (userToken.isNotExpired()) {
        req.user = userToken;
        next();
    }
    else {
        res.status(401).send();
    }
})
app.use('/api/users', userRouts);
app.use('/api/interns', internRouts);
app.listen(port, console.log("Server up at port " + port));