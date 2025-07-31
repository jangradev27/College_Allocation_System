import React from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, BookOpen, Target } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { CreateTeacherData } from '../operations/services/Allocation';

const TeacherData = () => {
  const dispatch=useDispatch();
  const {token}=useSelector(state=>state.Auth);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm({
    defaultValues: {
      Name: '',
      email: '',
      PracticalDuty: 0,
      MaxDuties: 5
    }
  });

  const maxDuties = watch('MaxDuties');
  const practicalDuty = watch('PracticalDuty');

  const onSubmit = async (data) => {
    dispatch(CreateTeacherData(data,token));
  };
  console.log(import.meta.env.VITE_API_BASE_URL)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Registration</h1>
            <p className="text-gray-600">Add new teacher to the system</p>
          </div>

          <div className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <User className="w-4 h-4 mr-2 text-blue-500" />
                Full Name
              </label>
              <input
                type="text"
                {...register('Name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters long'
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter teacher's full name"
              />
              {errors.Name && (
                <p className="text-red-500 text-sm">{errors.Name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Mail className="w-4 h-4 mr-2 text-blue-500" />
                Email Address
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter teacher's email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Practical Duty Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                Current Practical Duties
              </label>
              <input
                type="number"
                {...register('PracticalDuty', {
                  required: 'Practical duty count is required',
                  min: {
                    value: 0,
                    message: 'Practical duties cannot be negative'
                  },
                  max: {
                    value: maxDuties || 5,
                    message: `Practical duties cannot exceed ${maxDuties || 5}`
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="0"
                min="0"
              />
              {errors.PracticalDuty && (
                <p className="text-red-500 text-sm">{errors.PracticalDuty.message}</p>
              )}
            </div>

            {/* Max Duties Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Target className="w-4 h-4 mr-2 text-blue-500" />
                Maximum Duties Allowed
              </label>
              <input
                type="number"
                {...register('MaxDuties', {
                  required: 'Maximum duties is required',
                  min: {
                    value: 1,
                    message: 'Maximum duties must be at least 1'
                  },
                  max: {
                    value: 20,
                    message: 'Maximum duties cannot exceed 20'
                  }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="5"
                min="1"
                max="20"
              />
              {errors.MaxDuties && (
                <p className="text-red-500 text-sm">{errors.MaxDuties.message}</p>
              )}
            </div>

            {/* Duty Summary */}
            {(practicalDuty > 0 || maxDuties > 0) && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Duty Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-blue-600 font-semibold">{practicalDuty || 0}</p>
                    <p className="text-blue-500">Current</p>
                  </div>
                  <div className="text-center">
                    <p className="text-green-600 font-semibold">{(maxDuties || 5) - (practicalDuty || 0)}</p>
                    <p className="text-green-500">Available</p>
                  </div>
                  <div className="text-center">
                    <p className="text-purple-600 font-semibold">{maxDuties || 5}</p>
                    <p className="text-purple-500">Maximum</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Registering Teacher...
                </div>
              ) : (
                'Register Teacher'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherData;
