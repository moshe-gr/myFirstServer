const mongoose = require('mongoose');
const schema = mongoose.Schema;

var userSchema = new schema({
    email: {
        type: String,
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
        type: String,
        required: true,
        unique: true
    },
    telephone: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        required: true
    },
    role: {
        type: String
    },
    role_number: {
        type: Number,
        required: true
    },
    more_info: {
        type: schema.Types.ObjectId,
        refPath: 'role'
    }
});

module.exports = mongoose.model("user", userSchema);