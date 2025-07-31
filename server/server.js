const express=require("express");
const app=express();
const cors=require("cors");
const dbconnect = require("./config/database");
const AuthRoutes=require("./routes/auth");
const InstitudeRoutes=require("./routes/institution");
const AllocationRoutes=require("./routes/allocation")
const cookieParser = require("cookie-parser");
require("dotenv").config();

const PORT=process.env.PORT || 1000;


app.use(cors());
app.use(cookieParser()) 
app.use(express.json());  
app.use(AuthRoutes);  
app.use(InstitudeRoutes);
app.use(AllocationRoutes)

app.listen(PORT,()=>{
    console.log("server started at "+ PORT) 
})
app.get("/",(req,res)=>{
    res.send("hello ji")
}) 

dbconnect();