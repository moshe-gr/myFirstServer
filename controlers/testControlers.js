const InternModel = require('../models/internSchema.js');
const SupervisorModel = require('../models/supervisorSchema.js');
const TestModel = require('../models/testSchema.js');
const AnswerModel = require('../models/answerSchema.js');

function testControler() {

    function addTest(req, res) {
        if (req.user > 2) {
            return res.status(403).send({ msg: "denied" });
        }
        TestModel.findByIdAndUpdate(
            req.body._id,
            { $push: { tasks: req.body.task } },
            (err, doc) => {
                if (err) {
                    res.status(500).send({ msg: "faild to add test" });
                }
                res.status(200).send(doc);
            }
        );
    }

    function addDone(req, res) {
        AnswerModel.findByIdAndUpdate(
            req.body._id,
            { $push: { done: { file_url: req.body.file_url, test: req.body.test } } },
            (err, doc) => {
                if (err) {
                    res.status(500).send({ msg: "faild to add answers" });
                }
                res.status(200).send(doc);
            }
        );
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
            .populate({ path: 'tasks', populate:{  path:'supervisor', model: 'user', populate: {path: 'more_info', model: 'supervisor'} }})
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
        .populate('done')
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
        .populate('done')
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
        
    }

    function deleteTest(req, res) {
        if (req.user > 2) {
            return res.status(403).send({ msg: "denied" });
        }
        TestModel.findByIdAndUpdate(
            req.body._id,
            { $pull: { tasks: { file_url: req.body.file_url } } },
            (err, doc) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.status(200).send(doc);
            }
        );
    }

    return {
        addTest,
        addDone,
        getAllSupervisorTests,
        getAllInternTests,
        getAllInternDone,
        getAllSupervisorDone,
        deleteTest
    }

}

module.exports = testControler();