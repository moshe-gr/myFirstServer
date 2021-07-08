const mongoose = require('mongoose');
const schema = mongoose.Schema;

const testSchema = new schema({
    supervisor: {
        type: schema.Types.ObjectId,
        ref: 'user'
    },
    tasks: [{
        name: {
            type: String
        },
        task: {
            type: String
        },
        modified: {
            type: Number,
            default: Date.now()
        },
        file_url: {
            type: String
        }
    }]
})

module.exports = mongoose.model('test', testSchema);