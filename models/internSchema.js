const mongoose = require('mongoose');
const schema = mongoose.Schema;

var internSchema = new schema({
    user: {
        type: schema.Types.ObjectId,
        ref: "user"
    },
    personal: {
        age: {
            type: Number
        },
        country: {
            type: String
        },
        city: {
            type: String
        },
        graduation_year: {
            type: Number
        },
        academic_institution: {
            type: String
        }
    },
    professional: {
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
    },
    tests: {
        done: {
            type: [schema.Types.ObjectId],
            ref: 'test'
        },
        todo: {
            type: [String]
        }
    }
})

module.exports = mongoose.model("intern", internSchema);