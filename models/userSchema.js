const mongoose = require('mongoose');
const schema = mongoose.Schema;

var userSchema = new schema({
    id: {
        type: Number,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    passport: {
        type: Number,
        required: true,
        unique: true
    },
    telephone: {
        type: String,
        required: true
    },
    pic: {
        type: Object
    },
    roleNumber: {
        type: Number
    },
    internInfo: {
        type: schema.Types.ObjectId,
        ref: "intern"
    }
});

module.exports = mongoose.model("user", userSchema);