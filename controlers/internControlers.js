const InternModel = require('../models/internSchema.js');
const UserModel = require('../models/userSchema.js');

function internControler() {
    function createIntern(req, res) {
        if(!req.body._id) {
            return res.status(400).send({msg: "id missing"});
        }
        var newIntern = new InternModel(req.body.intern_info);
        newIntern.save((err, newDoc) => {
            if (err) {
                let msg = "";
                return res.status(500).send({ msg });
            }
            UserModel.findByIdAndUpdate(req.body._id, { $set: { intern_info: newDoc._id } }, (err, result) => {
                if (err) {
                    return res.status(500).send();
                }
                if (!result.n) {
                    return res.status(404).send();
                }
                res.status(200).send();
            })
            res.status(201).send(newDoc);
        })
    }

    function updateIntern(req, res) {
        InternModel.findByIdAndUpdate(req.params._id, { $set: req.body }, (err, result) => {
            if (err) {
                return res.status(500).send();
            }
            res.status(200).send();
        })
    }

    function deleteIntern(req, res) {
        InternModel.findByIdAndDelete(req.body._id, (err, result) => {
            if (err) {
                return res.status(500).send();
            }
            if (!result.n) {
                return res.status(404).send();
            }
            res.status(200).send();
            UserModel.findByIdAndUpdate(req.params._id, { $unset: { internInfo: 1 } }, (err, result, res) => {
                if (err) {
                    return res.status(500).send();
                }
                if (!result.n) {
                    return res.status(404).send();
                }
                return res.status(200).send();
            })
        })
    }

    function getIntern(req, res) {
        InternModel.findById(req.params._id, (err, intern) => {
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