const mongoose = require('mongoose');
const schema = mongoose.Schema;

var supervisorSchema = new schema({
    medical_institution: {
        type: String,
        required: true
    },
    students: {
        type: [schema.Types.ObjectId],
        ref: 'user'
    },
    user: {
        type: schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    tasks: {
        type: [schema.Types.ObjectId],
        ref: 'test'
    },
    done: {
        type: [schema.Types.ObjectId],
        ref: 'answer'
    }
})

module.exports = mongoose.model('supervisor', supervisorSchema);