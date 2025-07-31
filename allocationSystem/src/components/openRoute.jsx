import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const OpenRoute = ({children}) => {
  const {token}=useSelector(state=>state.Auth);
  if(token){
    return <Navigate to={"/dashboard/Data"}/>
  }
  return children;
}

export default OpenRoute