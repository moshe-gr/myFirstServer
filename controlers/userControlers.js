const UserModel = require('../models/userSchema.js');
const SupervisorModel = require('../models/supervisorSchema.js');
const InternModel = require('../models/internSchema.js');
const TestModel = require('../models/testSchema.js');
const mongoose = require('mongoose');

function userControler() {
    function createUser(req, res) {
        if(!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.passport || !req.body.telephone || !req.body.pic){
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
                return res.status(500).send(err);
            }
            res.status(200).send(result);
        })
    }

    function deleteUser(req, res) {
        UserModel.findByIdAndDelete(req.params._id, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (!result.n) {
                return res.status(404).send({ msg: "not found" });
            }
            res.status(200).send(result);
        })
    }

    function getUser(req, res) {
        UserModel.findById(req.params._id)
        .populate('more_info')
        .exec(
            (err, user) => {
                if (err) {
                    return res.status(500).send(err);
                }
                if (!user) {
                    return res.status(404).send({ msg: "not found" });
                }
                res.status(200).send(user);
            }
        )
    }

    function getAll(req, res) {
        if (req.user.role_number > 1) { //not admin
            return res.status(403).send({ msg: "forbiden access" })
        }
        UserModel.find((err, userList) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).send(userList);
        })
    }

    async function createSupervisor(req, res) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            if (!req.body.medical_institution || !req.body.user) {
                res.status(400).send({ msg: "Missing data" });
                throw new Error();
            }
            const newSupervisor = new SupervisorModel(req.body);
            const newTest = new TestModel({ supervisor: req.body.user });
            newTest.save(
                (err, newTestDoc) => {
                    if (err) {
                        res.status(500).send({ msg: "error creating tests" });
                        throw new Error();
                    }
                    newSupervisor.tasks = newTestDoc._id;
                    InternModel.find(
                        {
                            'professional.medical_institution': req.body.medical_institution
                        },
                        (err, students) => {
                            if (err) {
                                res.status(500).send({ msg: "can't add students" });
                                throw new Error();
                            }
                            students.forEach(intern => {
                                newSupervisor.students.push(intern.user);
                                intern.tasks.push(newTestDoc._id);
                                intern.save(
                                    (err, newIntDoc) => {
                                        if (err) {
                                            res.status(500).send({ msg: "can't add test to interns" });
                                            throw new Error();
                                        }
                                    }
                                );
                            });
                            newSupervisor.save((err, newSuperDoc) => {
                                if (err) {
                                    res.status(500).send({ msg: "can't create supervisor" });
                                    throw new Error();
                                }
                                UserModel.findByIdAndUpdate(
                                    req.body.user,
                                    { $set: { more_info: newSuperDoc._id } },
                                    (err, result) => {
                                        if (err) {
                                            res.status(500).send({ msg: "can't update user" });
                                            throw new Error();
                                        }
                                        res.status(201).send(newSuperDoc);
                                    }
                                );
                            });
                        }
                    );
                }
            );
        }
        catch {
            await session.abortTransaction();
            session.endSession();
        }
    }

    async function createIntern(req, res) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            if(!req.body.user) {
                res.status(400).send({ msg: "id missing" });
                throw new Error();
            }
            const newIntern = new InternModel(req.body);
            SupervisorModel.find(
                { medical_institution: req.body.professional.medical_institution },
                (err, resultList) => {
                    if (err) {
                        res.status(500).send({ msg: "can't find suprvisors" });
                        throw new Error();
                    }
                    resultList.forEach(supervisor => {
                        newIntern.tasks.push(supervisor.tasks);
                        supervisor.students.push(req.body.user);
                        supervisor.save(
                            (err, newSuper) => {
                                if (err) {
                                    res.status(500).send({ msg: "faild to update supervisor" });
                                    throw new Error();
                                }
                            }
                        )
                    });
                    newIntern.save((err, newDoc) => {
                        if (err) {
                            res.status(500).send({ msg: "can't save" });
                            throw new Error();
                        }
                        UserModel.findByIdAndUpdate(
                            req.body.user,
                            { $set: { more_info: newDoc._id } },
                            (err, result) => {
                                if (err) {
                                    res.status(500).send({ msg: "can't update user" });
                                    throw new Error();
                                }
                            }
                        );
                        res.status(201).send(newDoc);
                    });
                }
            );
        }
        catch {
            await session.abortTransaction();
            session.endSession();
        }
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