const UserModel = require('../models/userSchema.js');
const SupervisorModel = require('../models/supervisorSchema.js');
const InternModel = require('../models/internSchema.js');
const TestModel = require('../models/testSchema.js');
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

    async function deleteUser(req, res) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            const deletedDoc = await UserModel.findOneAndDelete(
                { _id: req.params._id },
                { session }
            );
            if (deletedDoc.role == "intern") {
                await InternModel.deleteOne(
                    { user: deletedDoc._id },
                    { session }
                );
                await SupervisorModel.updateMany(
                    { students: req.params._id },
                    { $pull: { students: req.params._id } },
                    { session }
                );
            }
            else if (deletedDoc.role == "supervisor") {
                const deleteSuper = await SupervisorModel.findOneAndDelete(
                    { user: deletedDoc._id },
                    { session }
                );
                await TestModel.deleteMany(
                    { _id: { $in: deleteSuper.tasks } },
                    { session }
                );
                await InternModel.updateMany(
                    { user: { $in: deleteSuper.students } },
                    { $pullAll: { tasks: deleteSuper.tasks } },
                    { session }
                );
            }
            await session.commitTransaction();
            res.status(200).send({ msg: "deleted successfully" });
        }
        catch (err) {
            await session.abortTransaction();
            res.status(500).send({ msg: err });
        }
        finally {
            session.endSession();
        }
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
    
    return {
        createUser,
        updateUser,
        deleteUser,
        getUser,
        getAll
    }
}

module.exports = userControler();