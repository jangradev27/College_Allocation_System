import React, { useState } from 'react';
import OTPInput from 'react-otp-input';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import {useSelector,useDispatch} from "react-redux"
import { useNavigate } from 'react-router-dom';
import { SignUp } from '../operations/services/auth';
const OtpSection = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
const {formdata}=useSelector(state=>state.Auth)
console.log(formdata)
const dispatch=useDispatch();
const navigate=useNavigate();
  // Simulate formData from Redux (replace with actual useSelector)


  const handleSubmit = async (e) => {
    e.preventDefault();
    const data={
        ...formdata,
        otp:otp
    }
    dispatch(SignUp(data,navigate));
  };

  const ResendOtp = async () => {
   
  };

  const handleBack = () => {
    navigate("/login")
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="flex flex-col gap-5 rounded-lg bg-white shadow-lg p-4 border-gray-400 border-[1px]">
        <h1 className="text-3xl  font-bold">
          Verify Email
        </h1>
        <p className="text-rich-black-200">
          A verification code has been sent to you. Enter the code below.
        </p>
        
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <form 
          className="flex flex-col gap-4 " 
          onSubmit={handleSubmit}
        >
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderInput={(props) => (
              <input
                {...props}
                placeholder="-"
                style={{
                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                }}
                className=" border-2 w-[48px] lg:w-[60px] bg-rich-black-800 rounded-[0.5rem] text-rich-black-5 aspect-square text-center  focus:outline-2 focus:outline-yellow-50"
              />
            )}
            containerStyle={{
              justifyContent: "space-between",
              gap: "0 6px",
            }}
          />
          
          <button 
            type="submit" 
            disabled={isLoading || otp.length !== 6}
            className="w-full bg-yellow-300 cursor-pointer text-black hover:bg-yellow-200 h-[2rem] text-xl rounded-md transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              'Submit'
            )}
          </button>
        </form>

        <div className="flex justify-between items-center">
          <button onClick={handleBack} className=" hover:text-rich-black-200 transition-colors">
            <div className='flex gap-2 items-center'>
              <ArrowLeft className="w-4 h-4" />
              <p>Back to login</p>
            </div>
          </button>
          
          <button 
            onClick={ResendOtp} 
            type="button" 
            disabled={isLoading}
            className="text-blue-300 hover:text-blue-400 transition-colors cursor-pointer disabled:opacity-50"
          >
            <div className="flex justify-center items-center gap-2 text-blue-400">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Resend it
            </div>
          </button>
        </div>

        {/* Help Text */}
        
      </div>
    </div>
  );
};

export default OtpSection;