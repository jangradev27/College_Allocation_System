const mongoose = require("mongoose");

const TeacherSchema = mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    PracticalDuty: {
        type: Number,
        default: 0
    },
    RemainingDuty: {
        type: Number,
        default: 5
    },
    MaxDuties: {
        type: Number,
        default: 5
    },
    IsAvailable: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("Teacher", TeacherSchema);