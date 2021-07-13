const mongoose = require('mongoose');
const schema = mongoose.Schema;

const answerSchema = new schema({
    intern: {
        type: schema.Types.ObjectId,
        ref: 'user'
    },    
    test: {
        type: schema.Types.ObjectId,
        ref: 'test'
    },
    file_url: {
        type: String,
        requierd: true
    },
    result: {
        type: Number
    },
    date: {
        type: Number,
        default: Date.now()
    }    
})

module.exports = mongoose.model('answer', answerSchema);