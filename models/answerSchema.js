const mongoose = require('mongoose');
const schema = mongoose.Schema;

const answerSchema = new schema({
    intern: {
        type: schema.Types.ObjectId,
        ref: 'user'
    },
    done: [{
        test: {
            type: schema.Types.ObjectId,
            ref: 'test',
            autopopulate: true
        },
        file_url: {
            type: String
        },
        result: {
            type: Number
        },
        date: {
            type: Number,
            default: Date.now()
        }
    }]
})

module.exports = mongoose.model('answer', answerSchema);