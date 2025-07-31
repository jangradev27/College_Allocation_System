const User=require("../models/User");
const OTP=require("../models/otp");
const {SendMail}=require("../utisl/mail");
const generator=require("otp-generator")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken");

exports.SendOtp=async(req,res)=>{
    try{
        const {email}=req.body;
        if(!email) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
                data: {}
            })
        }
        const otp=generator.generate(6,{
            lowerCaseAlphabets:false,
            upperCaseAlphabets:false,
            specialChars:false,
            digits:true
        })

        const newOTP=await OTP.create({otp,email})
        return res.status(200).json({
            success:true,
            message:"OTP sent successfully"
        })
        
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"error at send otp function",
            error:err.message
        })
    }
}
exports.SignUp = async (req, res) => {
    try {
        const { Name, email, password,otp} = req.body;
        console.log(Name, email, password,otp)
        // Check for missing fields
        if (!Name || !email || !password  ||!otp ) {
            return res.status(400).json({
                success: false,
                message: "Please enter all required fields"
            });
        }

        

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: "An account with this email already exists"
            });
        }

        const Otp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
        if(Otp[0].otp!==otp){
            return res.status(400).json({
                message:"Otp mismatched",
                success:false
            })
        }
        // Hash the password
        const hashedPass = await bcrypt.hash(password, 10);

     
      
        // Create new user
        const newUser = await User.create({ Name, email, password: hashedPass });
        return res.status(200).json({
            success: true,
            message: "User created successfully",
            data: newUser
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error at signup",
            error: err.message
        });
    }
};


exports.login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        console.log(password)
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"enter all the fields"
            })
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:'User not found'
            })
        }
        
        if(! (await bcrypt.compare(password,user.password))){
            return res.status(400).json({
                success:false,
                message:"pass is not correct"
            })
        }
       

        const payload={
           id:user._id,
           email:user.email
        }
        const token=jwt.sign(payload,process.env.JWT_Secret,{
            expiresIn: "72h"
        });
       
        user.token=token;
        user.password=undefined;
        const options={
             httpOnly:true,
             expiresIn:new Date(Date.now() + 7 * 24 * 3600 * 1000)  
        }
        res.cookie("token",token,options).status(200).json({
            success:true,
            message:"user loggedin Successfully",
            data:user
        }) 
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Internal server error at login fuction",
            error:err.message
        })}
}