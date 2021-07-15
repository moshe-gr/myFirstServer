const UserModel = require('../models/userSchema.js');
const SupervisorModel = require('../models/supervisorSchema.js');
const InternModel = require('../models/internSchema.js');
const mongoose = require('mongoose');

function userControler() {
    function createUser(req, res) {
        if(!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.passport || !req.body.telephone || !req.body.pic){
            return res.status(400).send({ msg: "missing data" });
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
        });
    }

    function updateUser(req, res) {
        UserModel.findByIdAndUpdate(
            req.params._id,
            { $set: req.body },
            (err, doc) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.status(200).send(doc);
            }
        );
    }

    function deleteUser(req, res) {
        UserModel.deleteOne(
            { _id: req.params._id },
            (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.status(200).send({ msg: "deleted successfully" });
            }
        );
    }

    function getUser(req, res) {
        UserModel.findById(req.params._id)
        .populate({
            path: 'more_info', populate: {
                path: 'students', model: 'user'
            }
        })
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
        );
    }

    function getAll(req, res) {
        if (req.user.role_number > 1) { //not admin
            return res.status(403).send({ msg: "forbiden access" });
        }
        UserModel.find((err, userList) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).send(userList);
        });
    }

    async function createSupervisor(req, res) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            if (!req.body.medical_institution || !req.body.user) {
                return res.status(400).send({ msg: "Missing data" });
            }
            const newSupervisor = new SupervisorModel(req.body);
            const students = await InternModel.find(
                {
                    'professional.medical_institution': req.body.medical_institution
                },
                {},
                { session }
            );
            students.forEach(intern => {
                newSupervisor.students.push(intern.user);
            });
            const newSuperDoc = await newSupervisor.save({ session });
            await UserModel.findByIdAndUpdate(
                req.body.user,
                { $set: { more_info: newSuperDoc._id } },
                { session }
            );
            await session.commitTransaction();
            res.status(201).send(newSuperDoc);
        }
        catch (err) {
            await session.abortTransaction();
            res.status(500).send({ msg: err });
        }
        finally {
            session.endSession();            
        }
    }

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