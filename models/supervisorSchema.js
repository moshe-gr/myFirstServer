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
    }
})

module.exports = mongoose.model('supervisor', supervisorSchema);