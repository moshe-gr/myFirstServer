const faceDetect = require('../utils/faceDetection.js');

function faceDetection(req, res) {
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
    );
}

module.exports = { faceDetection };