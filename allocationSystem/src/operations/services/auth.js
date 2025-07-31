import toast from "react-hot-toast"
import apiconnector from "../apiconnector"
import { AuthApi } from "../api"
import {Reset, setToken, setUser} from "../../slices/Auth"
export const SendOtp=(data,navigate)=>{
    const toastId=toast.loading("Sending Otp");
    return async(dispatch)=>{
        try{
            const response=await apiconnector(AuthApi.sendOtp,"POST",data);
            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success("OTp sent SuccessFully");
            navigate("/verify")
        }
        catch(err){
            toast.error(err?.response?.data?.message || err.message);
        }
        toast.dismiss(toastId)
    }

}

export const SignUp=(data,navigate)=>{
    const toastId=toast.loading("creating User")
    return async(dispatch)=>{
        try{
            const response=await apiconnector(AuthApi.signUp,"POST",data);
            

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            toast.success("User Created SuccessFully");
            navigate("/login")
        }
        catch(err){
            
            toast.error(err?.response?.data?.message || err.message);
        }
        toast.dismiss(toastId);
    }
}

export const login=(data,navigate)=>{
    const toastId=toast.loading("loging");
    return async(dispatch)=>{
        try{
            const response=await apiconnector(AuthApi.login,"POST",data);

            
            if(!response.data.success){
                throw new Error(response.data.message);
            }

            const User=response.data.data;

            localStorage.setItem("User",JSON.stringify(User));
            localStorage.setItem("token",JSON.stringify(User.token));

            dispatch(setToken(User.token));
            dispatch(setUser(User));
            toast.success("User loggedIn successFully");
            navigate("/dashboard/Data");
        }
        catch(err){
            
            toast.error(err?.response?.data?.message || err.message);
        }
        toast.dismiss(toastId);
    }
}

export const LogOut=(navigate)=>{
    const toastId=toast.loading("logging Out");
    return async(dispatch)=>{
        
        localStorage.removeItem("User");
        localStorage.removeItem("token");
        dispatch(Reset());
        toast.success("User logOut");
        toast.dismiss(toastId)
        navigate("/login")
    }

}