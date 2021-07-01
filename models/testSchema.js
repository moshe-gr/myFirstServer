const mongoose = require('mongoose');
const schema = mongoose.Schema;

const testSchema = new schema({
    supervisor: {
        type: schema.Types.ObjectId,
        ref: 'user',
        autopopulate: true
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
    }],
    done: [{
        intern: {
            type: schema.Types.ObjectId,
            ref: 'user',
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

testSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('test', testSchema);