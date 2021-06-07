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
    personal: {
        age: {
            type: Number
        },
        contry: {
            type: String
        },
        city: {
            type: String
        },
        academic_institution: {
            type: String
        }
    },
    professional: {
        graduation_year: {
            type: Number
        },
        medical_institution: {
            type: String
        },
        residency: {
            type: String
        },
        department: {
            type: String
        },
        year_in_residency: {
            type: Number
        }
    }
});

module.exports = mongoose.model("user", userSchema);