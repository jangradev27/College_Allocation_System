import React from 'react'
import {combineReducers} from "@reduxjs/toolkit"
import AuthSlice from "../slices/Auth"
const rootReducer=combineReducers({
    Auth:AuthSlice
})

export default rootReducer
