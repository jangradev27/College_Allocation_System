const mongoose=require("mongoose");

const InstitutionSchema=mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{ 
        type:String,
        required:true
    },
    Rooms:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Room"
    }],
    Teachers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Teacher"
    }], 
    
    Students:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
    },
    token:{
       type:Object
    },
    Allocations:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Allocation"
    }]

})
module.exports=mongoose.model("Instituion",InstitutionSchema);