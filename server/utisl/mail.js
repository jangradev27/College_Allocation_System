const nodemailer=require("nodemailer");
require("dotenv").config();
const SendMail=async(title,email,body)=>{
    try{
        const transporter=nodemailer.createTransport({
            host:process.env.Mail_host,
            auth:{
                user:process.env.Mail_user,
                pass:process.env.Mail_pass
            }
        })
        const info=await transporter.sendMail({
            to:email,
            subject:title,
            html:body,
            from:"Jangraji"
        })
        console.log(info);
        return info;
        
    }
    catch(err){
        console.log(err.message);
    }
}

module.exports=SendMail;