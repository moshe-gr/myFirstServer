const InternModel = require('../models/internSchema.js');
const UserModel = require('../models/userSchema.js');
const SupervisorModel = require('../models/supervisorSchema.js');
const mongoose = require('mongoose');

function internControler() {

    async function createIntern(req, res) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            if(!req.body.user) {
                return res.status(400).send({ msg: "id missing" });
            }
            const newIntern = new InternModel(req.body);
            const tasks = await SupervisorModel.find(
                { medical_institution: req.body.professional.medical_institution },
                { tasks: 1, _id: 0 },
                { session }
            );
            tasks.forEach(
                task => task.tasks.forEach(
                    task => newIntern.tasks.push(task)
                )
            );
            await SupervisorModel.updateMany(
                { medical_institution: req.body.professional.medical_institution },
                { $push: { students: req.body.user } },
                { session }
            );
            const newIntDoc = await newIntern.save({ session });
            await UserModel.findByIdAndUpdate(
                req.body.user,
                { $set: { more_info: newIntDoc._id } },
                { session }
            );
            await session.commitTransaction();
            res.status(201).send(newIntDoc);
        }
        catch (err) {
            await session.abortTransaction();
            res.status(500).send({ msg: err });
            session.endSession();
        }
        finally {
            session.endSession();
        }
    }

    async function updateIntern(req, res) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            InternModel.findByIdAndUpdate(
                req.params._id,
                { $set: req.body },
                (err, result) => {
                    if (err) {
                        res.status(500).send({  msg: "faild to update intern" });
                        throw new Error();
                    }
                    if (req.body.professional && req.body.professional.medical_institution != result.professional.medical_institution) {
                        SupervisorModel.updateMany(
                            { medical_institution: req.body.professional.medical_institution },
                            { $push: { students: req.body.user } },
                            (err, result) => {
                                if (err) {
                                    res.status(500).send({ msg: "faild to add supervisors" });
                                    throw new Error();
                                }
                            }
                        );
                        SupervisorModel.updateMany(
                            { medical_institution: result.professional.medical_institution },
                            { $pull: { students: req.body.user } },
                            (err, result) => {
                                if (err) {
                                    res.status(500).send({ msg: "faild to delete supervisors" });
                                    throw new Error();
                                }
                            }
                        );
                    }
                res.status(200).send(result);
                }
            );
        }
        catch {
            await session.abortTransaction();
            session.endSession();
        }
    }

    function getIntern(req, res) {
        InternModel.findById(req.params._id, (err, intern) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (!intern) {
                return res.status(404).send({ msg: "not found" });
            }
            res.status(200).send(intern);
        });
    }
    
    return {
        createIntern,
        updateIntern,
        getIntern
    }
}

module.exports = internControler();