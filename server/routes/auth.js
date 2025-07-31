const express=require("express");
const { SendOtp, SignUp, login } = require("../controllers/auth");
const { islogin } = require("../middlewares/Auth");
const router= express.Router();


router.post("/sendOtp",SendOtp);
router.post("/SignUp",SignUp);
router.post("/login",login)

module.exports=router;