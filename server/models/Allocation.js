const mongoose = require("mongoose");

const AllocationSchema = mongoose.Schema({
    Date: {
        type: Date,
        default:Date.now,
        required: true
    },
    shift: {
        type: String,
        required: true
    },
    Courses: [{
        type: String,
        required: true
    }],
    AllocatedRooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    }],
    AllocatedTeachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher"
    }],
    RoomDetails: [{
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room"
        },
        allocatedStudents: Number,
        courseDistribution: [{
            courseName: String,
            students: Number,
            section: String
        }]
    }],
    TeacherAssignments: [{
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher"
        },
        assignedRoom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room"
        }
    }],
    Institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Instituion' // Because Institution is in models/User.js
  },
    TotalStudents: Number,
    Status: {
        type: String,
        enum: ['allocated', 'pending', 'failed'],
        default: 'pending'
    }
});

module.exports = mongoose.model("Allocation", AllocationSchema);

