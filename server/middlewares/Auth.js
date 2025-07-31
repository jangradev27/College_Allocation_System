const jwt=require("jsonwebtoken");
require("dotenv").config();

exports.islogin=async(req,res,next)=>{
    try{
     const token=req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");
    if(!token){
        return res.status(401).json({ 
            message:"token not found"
        })
    }
    try{
        const decode=jwt.verify(token,process.env.JWT_Secret)
        
        req.user=decode;
    }
    catch(err){
        return res.status(401).json({
            message:"Token not valid"
        })
    }
    console.log(req.user);
    next();
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"internal server error at islogin",
            error:err.message
        })
    }

}