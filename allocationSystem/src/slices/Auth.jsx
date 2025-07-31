import { createSlice } from "@reduxjs/toolkit"



const initialState={
    token:localStorage.getItem("token")? JSON.parse(localStorage.getItem("token")):null,
    user:localStorage.getItem("User")?JSON.parse(localStorage.getItem("User")):null,
    formdata:null
}

const authSlice=createSlice({
    name:"Auth",
    initialState,
    reducers:{
        setUser(state,value){
            state.user=value.payload
        },
        setToken(state,value){
            state.token=value.payload;
        },
        setFormdata(state,value){
            state.formdata=value.payload
        },
        Reset(state,value){
            state.formdata=null
            state.token=null
            state.user=null
        }
    }
})


export const{setFormdata,setToken,Reset,setUser}=authSlice.actions;

export default authSlice.reducer    