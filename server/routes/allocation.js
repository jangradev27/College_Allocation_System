const express=require('express');
const router=express.Router();
const {createAllocation, getAllocation, getAllAllocations, getInstitutionAllocations}=require("../controllers/allocationservice")
const{islogin}=require("../middlewares/Auth")
router.post("/allocatedRooms",islogin,createAllocation);
router.post("/getAllocation",islogin,getAllocation)
router.get("/allAllocations",islogin,getInstitutionAllocations)
router.post("/getDateAllocation",islogin,getAllAllocations);
module.exports=router;