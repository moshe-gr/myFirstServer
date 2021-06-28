const mongoose = require('mongoose');
const schema = mongoose.Schema;

const testSchema = new schema({
    exam: {
        type: String
    },
    result: {
        type: Number
    }
})

module.exports = mongoose.model('test', testSchema);