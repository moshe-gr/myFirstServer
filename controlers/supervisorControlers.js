const InternModel = require('../models/internSchema.js');
const UserModel = require('../models/userSchema.js');
const SupervisorModel = require('../models/supervisorSchema.js');
const mongoose = require('mongoose');

function supervisorControler() {
    function updateSupervisor(req, res) {
        SupervisorModel.findByIdAndUpdate(
            req.params._id,
            req.body.task ? { $push: { tasks: req.body } } : { $set: req.body },
            (err, result) => {
                if (err) {
                    return res.status(500).send({ msg: "" });
                }
                res.status(200).send(result);
            }
        );
    }
    return {
        updateSupervisor
    }
}

module.exports = supervisorControler();