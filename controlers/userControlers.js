const UserModel = require('../models/userSchema.js');

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
            res.status(200).send();
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
            res.status(200).send();
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
    
    return {
        createUser,
        updateUser,
        deleteUser,
        getUser,
        getAll
    }
}

module.exports = userControler();