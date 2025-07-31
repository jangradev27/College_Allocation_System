import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  DoorOpen, 
  Building, 
  Users, 
  Hash,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux"
import { CreateRoomData } from '../operations/services/Allocation';
const CreateRoom = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const dispatch=useDispatch();
  const {token}=useSelector(state=>state.Auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors
  } = useForm({
    defaultValues: {
      RoomNo: '',
      floor: '',
      RoomType: '',
      Capacity: ''
    }
  });

  const roomTypes = [
  'Lecture Hall',
  'Normal Room'
];

  const onSubmit = (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    clearErrors();

      // Convert string values to numbers for the schema
      const roomData = {
        RoomNo: parseInt(data.RoomNo),
        floor: parseInt(data.floor),
        RoomType: data.RoomType,
        Capacity: parseInt(data.Capacity)
      };

      console.log('Submitting room data:', roomData);
      dispatch(CreateRoomData(data,token))
     setIsSubmitting(false);

  };

  const handleReset = () => {
    reset();
    setErrors({});
    setSubmitStatus(null);
  };

  return (
    <div className="  min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <NavLink to={"/dashboard/Data"} className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </NavLink>
          <div className="flex items-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
              <DoorOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Create New Room</h1>
              <p className="text-gray-600">Add a new room to the system</p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
            <span className="text-green-800 font-medium">Room created successfully!</span>
          </div>
        )}

        {errors.root && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <span className="text-red-800">{errors.root.message}</span>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Room Number */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Hash className="h-4 w-4 mr-2 text-blue-500" />
                  Room Number
                </label>
                <input
                  type="number"
                  {...register('RoomNo', {
                    required: 'Room number is required',
                    min: {
                      value: 1,
                      message: 'Room number must be at least 1'
                    },
                    valueAsNumber: true
                  })}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    errors.RoomNo 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                  }`}
                  placeholder="Enter room number (e.g., 101, 205)"
                />
                {errors.RoomNo && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.RoomNo.message}
                  </p>
                )}
              </div>

              {/* Floor */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Building className="h-4 w-4 mr-2 text-green-500" />
                  Floor
                </label>
                <input
                  type="number"
                  {...register('floor', {
                    required: 'Floor is required',
                    min: {
                      value: 0,
                      message: 'Floor must be 0 or greater'
                    },
                    valueAsNumber: true
                  })}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    errors.floor 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                  }`}
                  placeholder="Enter floor number (0 for ground floor)"
                />
                {errors.floor && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.floor.message}
                  </p>
                )}
              </div>

              {/* Room Type */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <DoorOpen className="h-4 w-4 mr-2 text-purple-500" />
                  Room Type
                </label>
                <select
                  {...register('RoomType', {
                    required: 'Room type is required'
                  })}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    errors.RoomType 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                  }`}
                >
                  <option value="">Select room type</option>
                  {roomTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.RoomType && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.RoomType.message}
                  </p>
                )}
              </div>

              {/* Capacity */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Users className="h-4 w-4 mr-2 text-orange-500" />
                  Capacity
                </label>
                <input
                  type="number"
                  {...register('Capacity', {
                    required: 'Capacity is required',
                    min: {
                      value: 1,
                      message: 'Capacity must be at least 1'
                    },
                    max: {
                      value: 1000,
                      message: 'Capacity cannot exceed 1000' 
                    },
                    valueAsNumber: true
                  })}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    errors.Capacity 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                  }`}
                  placeholder="Enter room capacity (number of people)"
                />
                {errors.Capacity && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.Capacity.message}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Creating Room...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Create Room
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Reset Form
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Important Notes</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Room numbers must be unique across the system</li>
                <li>• Floor 0 represents the ground floor</li>
                <li>• Capacity should reflect the maximum safe occupancy</li>
                <li>• All fields are required to create a room</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;