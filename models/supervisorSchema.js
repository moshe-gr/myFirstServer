const mongoose = require('mongoose');
const schema = mongoose.Schema;

var supervisorSchema = new schema({
    medical_institution: {
        type: String,
        required: true
    },
    students: {
        type: [schema.Types.ObjectId],
        ref: 'user',
        autopopulate: true
    },
    user: {
        type: schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    tasks: [{
        name: {
            type: String
        },
        task: {
            type: String
        },
        modified: {
            type: Date,
            default: Date.now()
        },
        file_url: {
            type: String
        }
    }]
})

supervisorSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('supervisor', supervisorSchema);