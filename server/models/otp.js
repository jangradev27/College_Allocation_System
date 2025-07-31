const mongoose=require("mongoose");
const SendMail = require("../utisl/mail");

const otpschema=mongoose.Schema({
    otp:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:10*60
    }
},{createdAt:true});
const SendVerificationMail=async(otp,email)=>{
    const data=await SendMail("YOur Otp for the createing the account",email,otp);
    console.log(data);

}
otpschema.pre("save",async function(next){
    await SendVerificationMail(this.otp,this.email);
    next();
})

module.exports=mongoose.model("OTP",otpschema);