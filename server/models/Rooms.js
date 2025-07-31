const mongoose = require("mongoose");

const RoomsSchema = mongoose.Schema({
    RoomNo: {
        type: Number,
        required: true,
        unique: true
    },
    floor: {
        type: Number,
        required: true
    },
    RoomType: {
        type: String,
        required: true
    },
    Capacity: {
        type: Number,
        required: true
    },
    IsAvailable: {
        type: Boolean,
        default: true
    }
});

module.exports=mongoose.model("Room",RoomsSchema);