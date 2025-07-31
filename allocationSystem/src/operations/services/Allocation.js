import toast from "react-hot-toast";
import apiconnector from "../apiconnector";
import { Allocationapi } from "../api";


export const CreateRoomData=(data,token)=>{
    const toastId=toast.loading("Creating Room...");
    return async(dispatch)=>{
        try{
            const response=await apiconnector(Allocationapi.createRoom,"POST",data,{
                Authorization:`Bearer ${token}`
            })
            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("Room created SuccessFully");


        }
        catch(err){
            toast.error(err?.response?.data?.message || err.message);

        }
        toast.dismiss(toastId);
    }
}


export const CreateTeacherData=(data,token)=>{
    const toastId=toast.loading("Adding Teacher...");
    return async(dispatch)=>{
        try{
            const response=await apiconnector(Allocationapi.createTeacher,"POST",data,{
                Authorization:`Bearer ${token}`
            })
            
            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("Teacher created SuccessFully");


        }
        catch(err){
           
            toast.error(err?.response?.data?.message || err.message);
        }
        toast.dismiss(toastId)
    }
}

export const createAllocation=(data,token)=>{
    const toastId=toast.loading("Creating Allocation,please wait");
     return async(dispatch)=>{
        try{
            const response=await apiconnector(Allocationapi.creatallocation,"POST",data,{
                Authorization:`Bearer ${token}`
            })
            
            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("Allocation created SuccessFully");


        }
        catch(err){
            
            toast.error(err?.response?.data?.message || err.message);

        }
        toast.dismiss(toastId)
    }
}


export const getAllAllocationData=async(token)=>{
    let result=[];
    const toastId=toast.loading("fetching data");
   try{
     const response=await apiconnector(Allocationapi.getallAllocation,"GET",null,{
        Authorization:`Bearer ${token}`
    })
    if(!response.data.success){
        throw new Error(response.data.message);
    
    }
    
    result=response.data.data;
    toast.success("data fetched SuccessFully");
   }
   catch(err){
    
   toast.error(err?.response?.data?.message || err.message);
   }
   toast.dismiss(toastId)
   return result;

}
export const getTeachers=async(token)=>{
    let result=[];
    const toastId=toast.loading("fetching data");
   try{
     const response=await apiconnector(Allocationapi.getTeachers,"GET",null,{
        Authorization:`Bearer ${token}`
    })
    if(!response.data.success){
        throw new Error(response.data.message);
    
    }
    
    result=response.data.data;
    toast.success("data fetched SuccessFully");
   }
   catch(err){
    
    toast.error(err?.response?.data?.message || err.message);
   }
   toast.dismiss(toastId)
   return result;

}
export const getRooms=async(token)=>{
    let result=[];
    const toastId=toast.loading("fetching data");
   try{
     const response=await apiconnector(Allocationapi.getRooms,"GET",null,{
        Authorization:`Bearer ${token}`
    })
    if(!response.data.success){
        throw new Error(response.data.message);
    
    }
    
    result=response.data.data;
    toast.success("data fetched SuccessFully");
   }
   catch(err){
    console.log(err);
    toast.error(err?.response?.data?.message || err.message);
   }
   toast.dismiss(toastId)
   return result;

}