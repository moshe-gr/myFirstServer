const InternModel = require('../models/internSchema.js');
const UserModel = require('../models/userSchema.js');
const SupervisorModel = require('../models/supervisorSchema.js');
const mongoose = require('mongoose');

function supervisorControler() {
    async function updateSupervisor(req, res) {
        if (req.body.task) {
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                SupervisorModel.findByIdAndUpdate(
                    req.params._id,
                    { $push: { tasks: req.body } },
                    (err, result) => {
                        if (err) {
                            res.status(500).send({ msg: "faild to update supervisor" });
                            throw new Error();
                        }
                        InternModel.updateMany(
                            { 'professional.medical_institution': 'Shaare zedek' },
                            { $push: { 'tasks.todo': req.body } },
                            (err, result) => {
                                if (err) {
                                    res.status(500).send({ msg: "faild to update interns" });
                                    throw new Error();
                                }
                            }
                        )
                        res.status(200).send(result);
                    }
                );
            }
            catch {
                await session.abortTransaction();
                session.endSession();
            }
        }
        else {
            SupervisorModel.findByIdAndUpdate(
                req.params._id,
                { $set: req.body },
                (err, result) => {
                    if (err) {
                        return res.status(500).send({ msg: "" });
                    }
                    res.status(200).send(result);
                }
            );           
        }          
    }

    return {
        updateSupervisor
    }
    
}

module.exports = supervisorControler();