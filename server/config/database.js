const mongoose=require("mongoose")
require('dotenv').config();
const dbconnect=()=>{
    mongoose.connect(process.env.Database_Url)
    .then(()=>{
        console.log("db connecetd succesfully");

    })
    .catch((err)=>{
        console.log({
            error:err.message,
            message:"error in dbconnection"
        })
        process.exit(1);
    })
}

module.exports=dbconnect;