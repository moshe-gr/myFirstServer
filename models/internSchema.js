const mongoose = require('mongoose');
const schema = mongoose.Schema;

var internSchema = new schema({
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
})

module.exports = mongoose.model("intern", internSchema);