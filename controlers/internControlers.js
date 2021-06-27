const InternModel = require('../models/internSchema.js');
const UserModel = require('../models/userSchema.js');
const SupervisorModel = require('../models/supervisorSchema.js');
const mongoose = require('mongoose');

function internControler() {

    async function updateIntern(req, res) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            InternModel.findByIdAndUpdate(req.params._id, { $set: req.body }, (err, result) => {
                if (err) {
                    return res.status(500).send();
                }
                if (req.body.professional) {
                    SupervisorModel.updateMany(
                        { medical_institution: req.body.professional.medical_institution },
                        { $push: { students: req.body.user } },
                        (err, result) => {
                            if (err) {
                                return res.status(500).send();
                            }
                        }
                    );
                    SupervisorModel.updateMany(
                        { medical_institution: result.professional.medical_institution },
                        { $pull: { students: req.body.user } },
                        (err, result) => {
                            if (err) {
                                return res.status(500).send();
                            }
                        }
                    );
                }
                res.status(200).send(result);
            });
            }
        catch {
            await session.abortTransaction();
            session.endSession();
        }
    }

    function deleteIntern(req, res) {
        InternModel.findByIdAndDelete(req.body._id, (err, result) => {
            if (err) {
                return res.status(500).send();
            }
            UserModel.findByIdAndUpdate(req.params._id, { $unset: { internInfo: 1 } }, (err, result, res) => {
                if (err) {
                    return res.status(500).send();
                }
            });
            SupervisorModel.updateMany(
                { medical_institution: req.body.intern_info.professional.medical_institution },
                { $pull: { students: req.body.intern_info.user } }
            );
            res.status(200).send(result);
        })
    }

    function getIntern(req, res) {
        InternModel.findById(req.params._id, (err, intern) => {
            if (err) {
                return res.status(500).send();
            }
            if (!intern) {
                return res.status(404).send();
            }
            res.status(200).send(intern);
        })
    }

    function getAll(req, res) {
        InternModel.find((err, internList) => {
            if (err) {
                return res.status(500).send();
            }
            res.status(200).send(internList);
        })
    }
    
    return {
        updateIntern,
        deleteIntern,
        getIntern,
        getAll
    }
}

module.exports = internControler();