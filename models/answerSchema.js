const mongoose = require('mongoose');
const schema = mongoose.Schema;

const answerSchema = new schema({
    intern: {
        type: schema.Types.ObjectId,
        ref: 'user'
    },
    done: [{
        test: {
            name: {
                type: String,
                requierd: true
            },
            modified: {
                type: Number,
                requierd: true
            },
            file_url: {
                type: String,
                requierd: true
            }
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
    }]
})

module.exports = mongoose.model('answer', answerSchema);