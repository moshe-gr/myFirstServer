const port = process.env.PORT || 8080;
const dbPath = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myFirst";
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouts = require('./routs/userRouts.js');
const smsAuthRouts = require('./routs/smsAuthRoutes.js');
const UserToken = require('./models/userToken.js');
const internRouts = require('./routs/internRouts.js');
const awsControlers = require('./controlers/awsControlers');
const faceDetectionControler = require('./controlers/faceDetectionControler.js');

var app = express();

mongoose.connect(dbPath, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(dbPath);

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use('/auth', smsAuthRouts);
app.post('/faceDetect', faceDetectionControler.faceDetection);
app.use('/api', (req, res, next) => {
    let userToken = new UserToken(false, req.headers['x-access-token']);
    if (userToken.isNotExpired()) {
        req.user = userToken;
        next();
    }
    else {
        res.status(401).send();
    }
});
app.use('/api/users', userRouts);
app.use('/api/interns', internRouts);
app.post('/api/awsupload', awsControlers.getUrl);
app.listen(port, console.log("Server up at port " + port));