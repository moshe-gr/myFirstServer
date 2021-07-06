const InternModel = require('../models/internSchema.js');
const UserModel = require('../models/userSchema.js');
const SupervisorModel = require('../models/supervisorSchema.js');
const TestModel = require('../models/testSchema.js');
const mongoose = require('mongoose');

function testControler() {

    function addTest(req, res) {
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

    function deleteTest(req, res) {
        
    }

    function markTest(req, res) {
        
    }

    function getAllTests(req, res) {
        if (req.user.role_number == 4) {
            InternModel.findById(req.params._id, 'tasks')
            .populate('tasks')
            .exec(
                (err, tests) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    if (!tests) {
                        return res.status(404).send({ msg: "not found" });
                    }
                    res.status(200).send(tests);
                }
            );
        }
        else if (req.user.role_number == 2) {
            SupervisorModel.findById(req.params._id, 'tasks')
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
    }

    return {
        addTest,
        getAllTests
    }

}

module.exports = testControler();