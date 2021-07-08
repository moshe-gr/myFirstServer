const port = process.env.PORT || 8080;
const dbPath = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/myFirst";
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouts = require('./routs/userRouts.js');
const smsAuthRouts = require('./routs/smsAuthRoutes.js');
const UserToken = require('./models/userToken.js');
const internRouts = require('./routs/internRouts.js');
const supervisorRouts = require('./routs/supervisorRouts.js');
const awsRouts = require('./routs/awsRouts.js');
const testRouts = require('./routs/testRouts.js');
const faceDetectionControler = require('./controlers/faceDetectionControler.js');

const app = express();

mongoose.connect(dbPath, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(dbPath);

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use('/auth', smsAuthRouts);
app.use('/api', (req, res, next) => {
    let userToken = new UserToken(false, req.headers['x-access-token']);
    if (userToken.isNotExpired()) {
        req.user = userToken;
        next();
    }
    else {
        res.status(401).send({ msg: "token expired" });
    }
});
app.post('/api/faceDetect', faceDetectionControler.faceDetection);
app.use('/api/users', userRouts);
app.use('/api/interns', internRouts);
app.use('/api/supervisors', supervisorRouts)
app.use('/api/awsS3', awsRouts);
app.use('/api/tests', testRouts);
app.listen(port, console.log("Server up at port " + port));