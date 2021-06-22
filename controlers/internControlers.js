const InternModel = require('../models/internSchema.js');
const UserModel = require('../models/userSchema.js');
const SupervisorModel = require('../models/supervisorSchema.js');

function internControler() {
    function createIntern(req, res) {
        if(!req.body.intern_info.user) {
            return res.status(400).send({msg: "id missing"});
        }
        var newIntern = new InternModel(req.body.intern_info);
        newIntern.save((err, newDoc) => {
            if (err) {
                let msg = "";
                return res.status(500).send({ msg });
            }
            UserModel.findByIdAndUpdate(
                req.body.intern_info.user,
                { $set: { more_info: newDoc._id } },
                (err, result) => {
                    if (err) {
                        return res.status(500).send();
                    }
                }
            );
            SupervisorModel.updateMany(
                { medical_institution: req.body.intern_info.professional.medical_institution },
                { $push: { students: req.body.intern_info.user } }
            );
            res.status(201).send(newDoc);
        })
    }

    function updateIntern(req, res) {
        InternModel.findByIdAndUpdate(req.params._id, { $set: req.body }, (err, result) => {
            if (err) {
                return res.status(500).send();
            }
            if (req.body.intern_info.professional.medical_institution) {
                SupervisorModel.updateMany(
                    { medical_institution: req.body.intern_info.professional.medical_institution },
                    { $push: { students: req.body.intern_info.user } }
                );
            }
            res.status(200).send(result);
        })
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
        createIntern,
        updateIntern,
        deleteIntern,
        getIntern,
        getAll
    }
}

module.exports = internControler();