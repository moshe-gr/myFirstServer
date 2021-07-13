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
        session.startTransaction();
        try {
            const newTestDoc = await new TestModel(req.body).save();
            const doc = await SupervisorModel.findOneAndUpdate(
                { user: req.body.supervisor },
                { $push: { tasks: newTestDoc._id } }
            );
            doc.students.forEach(async intern => {
                await InternModel.updateOne({ user: intern }, { $push: { tasks: newTestDoc._id } });
            });
            res.status(201).send(newTestDoc);
        }
        catch {
            await session.abortTransaction();
            session.endSession();
            res.status(500).send({ msg: "blabla" });
        }
    }

    async function addDone(req, res) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            await new AnswerModel(req.body).save().then(
                newAnsDoc => {
                    InternModel.findOneAndUpdate(
                        { user: req.body.intern },
                        { $push: { done: newAnsDoc._id } }
                    ).then(
                        () => {
                            SupervisorModel.updateOne(
                                { tasks: req.body.test },
                                { $push: { done: newAnsDoc._id } }
                            ).then(
                                () => res.status(201).send(newAnsDoc),
                                () => {
                                    res.status(500).send({ msg: "can't add done to supervisor" });
                                    throw new Error();
                                }
                            );
                        },
                        () => {
                            res.status(500).send({ msg: "can't add done" });
                            throw new Error();
                        }
                    );
                 },
                () => {
                    res.status(500).send({ msg: "can't create done" });
                    throw new Error();
                }
            );
        }
        catch {
            await session.abortTransaction();
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
            }).populate({ path: 'test', model: 'test' })
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
        session.startTransaction();
        try {
            await TestModel.findByIdAndDelete(req.params._id).then(
                removedTestDoc => {
                    SupervisorModel.findOneAndUpdate(
                        { user: removedTestDoc.supervisor },
                        { $pull: { tasks: removedTestDoc._id } }
                    ).populate('students', 'tasks').updateMany(
                        { $pull: { 'tasks': removedTestDoc._id } }
                    ).then(
                        () => res.status(200).send(removedTestDoc),
                        () => {
                            res.status(500).send({ msg: "can't remove test" });
                            throw new Error();
                        }
                    );
                },
                () => {
                    res.status(500).send({ msg: "can't delete test" });
                    throw new Error();
                }
            );
        }
        catch {
            await session.abortTransaction();
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