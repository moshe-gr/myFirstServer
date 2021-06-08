const InternModel = require('../models/internSchema.js');
const UserModel = require('../models/userSchema.js');

function internControler() {
    function createIntern(req, res) {
        if(!req.body._id) {
            return res.status(400).send({});
        }
        var newIntern = new InternModel(req.body.intern_info);
        newIntern.save((err, newDoc) => {
            if (err) {
                var msg = "";
                if (err.code == 11000) {
                    msg = "Intern allready exists"
                }
                return res.status(500).send({ msg });
            }
            res.status(201).send(newDoc);
            UserModel.updateOne({ _id: req.body._id }, { $set: { internInfo: newDoc._id } }, (err, result) => {
                if (err) {
                    return res.status(500).send();
                }
                if (!result.n) {
                    return res.status(404).send();
                }
                res.status(200).send();
            })
        })
    }
    function updateIntern(req, res) {
        InternModel.updateOne({ _id: req.params._id }, { $set: req.body }, (err, result) => {
            if (err) {
                return res.status(500).send();
            }
            if (!result.n) {
                return res.status(404).send();
            }
            res.status(200).send();
        })
    }
    function deleteIntern(req, res) {
        InternModel.deleteOne({ _id: req.params._id }, (err, result) => {
            if (err) {
                return res.status(500).send();
            }
            if (!result.n) {
                return res.status(404).send();
            }
            res.status(200).send();
        })
    }
    function getIntern(req, res) {
        InternModel.findOne({ _id: req.params._id }, (err, intern) => {
            if (err) {
                return res.status(500).send();
            }
            if (!Intern) {
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