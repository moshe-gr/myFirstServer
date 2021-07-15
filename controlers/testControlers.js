const InternModel = require('../models/internSchema.js');
const SupervisorModel = require('../models/supervisorSchema.js');
const TestModel = require('../models/testSchema.js');
const AnswerModel = require('../models/answerSchema.js');
const mongoose = require('mongoose');

function testControler() {

    async function addTest(req, res) {
        if (req.user > 2) {
            return res.status(403).send({ msg: "denied" });
        }
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            const newTestDoc = new TestModel(req.body);
            await newTestDoc.save({ session });
            const doc = await SupervisorModel.findOneAndUpdate(
                { user: req.body.supervisor },
                { $push: { tasks: newTestDoc._id } },
                { session }
            );
            await InternModel.updateMany(
                { user: { $in: doc.students } },
                { $push: { tasks: newTestDoc._id } },
                { session }
            );
            await session.commitTransaction();
            res.status(201).send(newTestDoc);
        }
        catch (err) {
            await session.abortTransaction();
            res.status(500).send({ msg: err });
        }
        finally {
            session.endSession();
        }
    }

    async function addDone(req, res) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            newAnsDoc = new AnswerModel(req.body);
            await newAnsDoc.save({ session });
            await InternModel.findOneAndUpdate(
                { user: req.body.intern },
                { $push: { done: newAnsDoc._id } },
                { session }
            );
            await SupervisorModel.updateOne(
                { tasks: req.body.test },
                { $push: { done: newAnsDoc._id } },
                { session }
            );
            await session.commitTransaction();
            res.status(201).send(newAnsDoc);
        }
        catch (err) {
            await session.abortTransaction();
            res.status(500).send({ msg: err });
        }
        finally {
            session.endSession();
        }
    }

    function getAllSupervisorTests(req, res) {
        if (req.user > 2) {
            return res.status(403).send({ msg: "denied" });
        }
        SupervisorModel.findById(req.params._id, { tasks: 1, _id: 0})
        .populate('tasks')
        .exec(
            (err, tests) => {
                if (err) {
                    return res.status(500).send(err);
                }
                if (!tests) {
                    return res.status(404).send({ msg: "not found" });
                }
                res.status(200).send(tests.tasks);
            }
        );
    }

    function getAllInternTests(req, res) {
        InternModel.findById(req.params._id, { tasks: 1, _id: 0 })
        .populate({
            path: 'tasks', populate: {
                path: 'supervisor', model: 'user', populate: {
                    path: 'more_info', model: 'supervisor'
                }
            }
        })
        .exec(
            (err, tests) => {
                if (err) {
                    return res.status(500).send(err);
                }
                if (!tests) {
                    return res.status(404).send({ msg: "not found" });
                }
                res.status(200).send(tests.tasks);               
            }
        );
    }

    function getAllInternDone(req, res) {     
        InternModel.findById(req.params._id, { done: 1, _id: 0})
            .populate({
                path: 'done', populate: {
                    path: 'test', model: 'test'
                }
            })
        .exec(
            (err, tests) => {
                if (err) {
                    return res.status(500).send(err);
                }
                if (!tests) {
                    return res.status(404).send({ msg: "not found" });
                }
                res.status(200).send(tests.done);
            }
        );
    }

    function getAllSupervisorDone(req, res) {
        if (req.user > 2) {
            return res.status(403).send({ msg: "denied" });
        }
        SupervisorModel.findById(req.params._id, { done: 1, _id: 0})
        .populate({
            path: 'done', populate: {
                path: 'intern', model: 'user', populate: {
                    path: 'more_info', model: 'intern'
                }
            }
        })
        .exec(
            (err, tests) => {
                if (err) {
                    return res.status(500).send(err);
                }
                if (!tests) {
                    return res.status(404).send({ msg: "not found" });
                }
                tests.populate('done.test', (err, testss) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.status(200).send(testss.done);
                });
            }
        );
    }

    function markTest(req, res) {
        if (req.user > 2) {
            return res.status(403).send({ msg: "denied" });
        }
        AnswerModel.findByIdAndUpdate(
            req.body._id,
            { $set: { result: req.body.result } },
            (err, doc) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.status(200).send(doc); 
            }
        );
    }

    async function deleteTest(req, res) {
        if (req.user > 2) {
            return res.status(403).send({ msg: "denied" });
        }
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            const doc = await SupervisorModel.findOneAndUpdate(
                { tasks: req.params._id },
                { $pull: { tasks: req.params._id } },
                { session }
            );
            await InternModel.updateMany(
                { user: { $in: doc.students } },
                { $pull: { tasks: req.params._id } },
                { session }
            );
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

    return {
        addTest,
        addDone,
        getAllSupervisorTests,
        getAllInternTests,
        getAllInternDone,
        getAllSupervisorDone,
        markTest,
        deleteTest
    }

}

module.exports = testControler();