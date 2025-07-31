const express=require("express");

const { islogin } = require("../middlewares/Auth");
const { CreateRoomsData, TeacherData, DepartmentData, getRooms, getTeacher } = require("../controllers/Institution");
const router=express.Router();
router.post("/RoomsData",islogin,CreateRoomsData);
router.post("/TeacherData",islogin,TeacherData);
router.get("/getRooms",islogin,getRooms);
router.get("/getTeachers",islogin,getTeacher)

module.exports=router;