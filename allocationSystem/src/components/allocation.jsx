import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Calendar, Clock, BookOpen, Users } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createAllocation } from '../operations/services/Allocation';

const Allocation = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      date: '',
      shift: '',
      courses: [{ courseName: '', numberOfStudents: '' }]
    }
  });

  const dispatch = useDispatch();
  const { token, user } = useSelector(state => state.Auth); // Assuming user info is in state.Auth

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'courses'
  });

  const watchedCourses = watch('courses');

  const totalStudents = watchedCourses.reduce((sum, course) => {
    const students = course.numberOfStudents || 0;
    return sum + students;
  }, 0);

  const onSubmit = (data) => {
    // Transform courses to match backend interface
    const processedData = {
      shift: data.shift,
      date: data.date,
      institutionId: user?._id, // Or wherever institution id is stored in the logged-in user 
      courses: data.courses.map(course => ({
        name: course.courseName.trim(),
        students: course.numberOfStudents // Already integer due to valueAsNumber:true
      }))
    };
    console.log(processedData)
    dispatch(createAllocation(processedData, token));
  };

  const addCourse = () => {
    append({ courseName: '', numberOfStudents: '' });
  };

  const removeCourse = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Allocation Form</h1>
        <p className="text-gray-600">
          Manage course allocations with date, shift, and student information
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Date and Shift Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Input */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              Date
            </label>
            <input
              type="date"
              {...register('date', {
                required: 'Date is required'
              })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.date ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Shift Input */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4 mr-2 text-green-500" />
              Shift
            </label>
            <select
              {...register('shift', {
                required: 'Shift is required'
              })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.shift ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select Shift</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
            </select>
            {errors.shift && (
              <p className="text-red-500 text-sm mt-1">{errors.shift.message}</p>
            )}
          </div>
        </div>

        {/* Courses Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center text-xl font-semibold text-gray-800">
              <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
              Courses
            </h2>
            <button
              type="button"
              onClick={addCourse}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Course
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">
                    Course {index + 1}
                  </h3>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCourse(index)}
                      className="flex items-center px-2 py-1 text-red-600 hover:text-red-800 focus:outline-none"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Course Name */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">
                      Course Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter course name"
                      {...register(`courses.${index}.courseName`, {
                        required: 'Course name is required',
                        minLength: {
                          value: 2,
                          message: 'Course name must be at least 2 characters'
                        }
                      })}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.courses?.[index]?.courseName
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                    />
                    {errors.courses?.[index]?.courseName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.courses[index].courseName.message}
                      </p>
                    )}
                  </div>

                  {/* Number of Students */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-600">
                      Number of Students
                    </label>
                    <input
                      type="number"
                      min="1"
                      placeholder="Enter number of students"
                      {...register(`courses.${index}.numberOfStudents`, {
                        required: 'Number of students is required',
                        min: {
                          value: 1,
                          message: 'Must have at least 1 student'
                        },
                        max: {
                          value: 1000,
                          message: 'Cannot exceed 1000 students'
                        },
                        valueAsNumber: true
                      })}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.courses?.[index]?.numberOfStudents
                          ? 'border-red-300'
                          : 'border-gray-300'
                      }`}
                    />
                    {errors.courses?.[index]?.numberOfStudents && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.courses[index].numberOfStudents.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Students Summary */}
          {totalStudents > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  Total Students: {totalStudents}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Submit Allocation
          </button>
        </div>
      </form>
    </div>
  );
};

export default Allocation;
