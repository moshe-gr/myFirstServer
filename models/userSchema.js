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
        type: String
    },
    role: {
        type: String
    },
    role_number: {
        type: Number
    },
    more_info: {
        type: schema.Types.ObjectId,
        refPath: 'role'
    }
});

module.exports = mongoose.model("user", userSchema);