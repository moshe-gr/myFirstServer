const UserModel = require('../models/userSchema.js');
const SupervisorModel = require('../models/supervisorSchema.js');
const InternModel = require('../models/internSchema.js');
const mongoose = require('mongoose');

function userControler() {
    function createUser(req, res) {
        if(!req.body.first_name || !req.body.last_name || !req.body.id || !req.body.passport || !req.body.telephone || !req.body.pic){
            return res.status(400).send({});
        }
        var newUser = new UserModel(req.body);
        newUser.save((err, newDoc) => {
            if (err) {
                var msg = "";
                if (err.code == 11000) {
                    msg = "User allready exists"
                }
                return res.status(500).send({ msg });
            }
            res.status(201).send(newDoc);
        })
    }

    function updateUser(req, res) {
        UserModel.findByIdAndUpdate(req.params._id, { $set: req.body }, (err, result) => {
            if (err) {
                return res.status(500).send();
            }
            res.status(200).send(result);
        })
    }

    function deleteUser(req, res) {
        UserModel.findByIdAndDelete(req.params._id, (err, result) => {
            if (err) {
                return res.status(500).send();
            }
            if (!result.n) {
                return res.status(404).send();
            }
            res.status(200).send(result);
        })
    }

    function getUser(req, res) {
        UserModel.findById(req.params._id, (err, user) => {
            if (err) {
                return res.status(500).send();
            }
            if (!user) {
                return res.status(404).send();
            }
            res.status(200).send(user);
        })
    }

    function getAll(req, res) {
        UserModel.find((err, userList) => {
            if (err) {
                return res.status(500).send();
            }
            res.status(200).send(userList);
        })
    }

    function createSupervisor(req, res) {
        if (!req.body.medical_institution || !req.body.user) {
            return res.status(400).send({});
        }
        const newSupervisor = new SupervisorModel(req.body);
        InternModel.find(
            {
                'professional.medical_institution' : req.body.medical_institution
            },
            {
                'user': 1,
                _id: 0
            },
            (err, students) => {
                if (err) {
                   return res.status(500).send(err);
                }
                console.log(req.body.medical_institution);
                console.log(students);
                students.forEach(data => newSupervisor.students.push(data.user));
                console.log(newSupervisor);
            }
        ); 
        newSupervisor.save((err, newDoc) => {
            if (err) {
                res.status(500).send();
            }
            UserModel.findByIdAndUpdate(
                req.body.user,
                { $set: { more_info: newDoc._id } },
                (err, result) => {
                    if (err) {
                        res.status(500).send(err);
                    }
                }
            );
            res.status(201).send(newDoc);
        });
    }

    function createIntern(req, res) {
        if(!req.body.user) {
            return res.status(400).send({msg: "id missing"});
        }
        var newIntern = new InternModel(req.body);
        newIntern.save((err, newDoc) => {
            if (err) {
                let msg = "";
                return res.status(500).send({ msg });
            }
            UserModel.findByIdAndUpdate(
                req.body.user,
                { $set: { more_info: newDoc._id } },
                (err, result) => {
                    if (err) {
                        return res.status(500).send();
                    }
                }
            );
            SupervisorModel.updateMany(
                { medical_institution: req.body.professional.medical_institution },
                { $push: { students: req.body.user } },
                (err, result) => {
                    if (err) {
                        return res.status(500);
                    }
                }
            );
            res.status(201).send(newDoc);
        })
    }
    
    return {
        createUser,
        updateUser,
        deleteUser,
        getUser,
        getAll,
        createSupervisor,
        createIntern
    }
}

module.exports = userControler();