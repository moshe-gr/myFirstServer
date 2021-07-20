const InternModel = require('../models/internSchema.js');
const UserModel = require('../models/userSchema.js');
const SupervisorModel = require('../models/supervisorSchema.js');
const mongoose = require('mongoose');

function supervisorControler() {

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
                { user: 1, _id: 0 },
                { session }
            );
            students.forEach(student => {
                newSupervisor.students.push(student.user);
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

    return {
        createSupervisor
    }
    
}

module.exports = supervisorControler();