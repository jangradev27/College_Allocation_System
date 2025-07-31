
const Rooms = require("../models/Rooms");
const Teacher = require("../models/Teacher");
const User = require("../models/User");

exports.CreateRoomsData = async (req, res) => {
    try {
        const { RoomNo, RoomType,floor, Capacity } = req.body;
        const id = req.user.id;

        if (!RoomNo || !RoomType || !Capacity || !floor) {
            return res.status(400).json({
                success: false,
                message: 'Please enter all the fields',
            });
        }

        const room = await Rooms.create({ RoomNo, RoomType,floor, Capacity });
        const user = await User.findByIdAndUpdate(id, { $push: { Rooms: room._id } }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Room data entered successfully",
            data: { room, user },
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error in CreateRoomsData function",
            error: err.message,
        });
    }
};

exports.TeacherData = async (req, res) => {
    try {
        const { Name, email,PracticalDuty,MaxDuties } = req.body;
        const id = req.user.id;

        if (!Name  || !email ||!PracticalDuty || !MaxDuties) {
            return res.status(400).json({
                success: false,
                message: "Please enter all fields",
            });
        }
        const Remainingduty=MaxDuties-PracticalDuty;
        const teacher = await Teacher.create({ Name,email,PracticalDuty,MaxDuties,RemainingDuty:Remainingduty});
        const user = await User.findByIdAndUpdate(id, { $push: { Teachers: teacher._id } }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Teacher data created successfully",
            data: { teacher, user },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error in TeacherData function",
            error: err.message,
        });
    }
};

exports.getTeacher=async(req,res)=>{
    try{
        const {id}=req.user;
        const user=await User.findById(id).populate("Teachers");
        if(!user){
            return res.status(400).json({
                success:false,
                message:"user not found"
            })
        }

        return res.status(200).json({
            success:true,
            data:user.Teachers
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Internal server error in TeacherData function",
            error: err.message,
        });
    }
}

exports.getRooms=async(req,res)=>{
    try{
        const {id}=req.user;
        const user=await User.findById(id).populate("Rooms");
        if(!user){
            return res.status(400).json({
                success:false,
                message:"user not found"
            })
        }

        return res.status(200).json({
            success:true,
            data:user.Rooms
        })
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "Internal server error in TeacherData function",
            error: err.message,
        });
    }
}