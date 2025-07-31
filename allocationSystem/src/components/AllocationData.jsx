import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Users, MapPin, User, BookOpen, Building, CheckCircle, AlertCircle } from 'lucide-react';
import {useSelector} from 'react-redux'
import { getAllAllocationData } from '../operations/services/Allocation';

// Utility to format Date nicely
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const AllocationDisplay = () => {
  // Mock selector (replace with your actual useSelector)
  const {token} = useSelector(state=>state.Auth);
  
  const [allocation, setAllocation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getAllocationData = async () => {
      try {
        setLoading(true);
        const response = await getAllAllocationData(token);
        
        setAllocation(response);
      } catch (err) {
        setError('Failed to fetch allocation data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getAllocationData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" />
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );
  }

  if (!allocation || allocation.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4" />
          <p className="text-xl">No allocation data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen overflow-scroll bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Allocation Dashboard</h1>
          <p className="text-gray-600">View and manage examination duty allocations</p>
        </div>

        <div className="space-y-8">
          {allocation.map((allocationItem, index) => (
            <div key={allocationItem._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold">Allocation #{index + 1}</h2>
                      <p className="text-blue-100">{formatDate(allocationItem.Date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span className="capitalize font-medium">{allocationItem.shift}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span className="font-medium">{allocationItem.TotalStudents} Students</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        allocationItem.Status === 'allocated' 
                          ? 'bg-green-500/20 text-green-100' 
                          : 'bg-yellow-500/20 text-yellow-100'
                      }`}>
                        {allocationItem.Status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Courses Section */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center mb-4">
                  <BookOpen className="w-5 h-5 text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">Courses</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allocationItem.Courses.map((course, courseIndex) => (
                    <span 
                      key={courseIndex}
                      className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              {/* Teachers and Rooms Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Teacher Assignments */}
                  <div>
                    <div className="flex items-center mb-4">
                      <User className="w-5 h-5 text-green-500 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800">Teacher Assignments</h3>
                      <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        {allocationItem.TeacherAssignments.length} Teachers
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      {allocationItem.TeacherAssignments.map((assignment, teacherIndex) => (
                        <div key={assignment._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-800 text-lg">{assignment.teacherId.Name}</h4>
                              <p className="text-gray-600 text-sm">{assignment.teacherId.email}</p>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              assignment.teacherId.IsAvailable 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {assignment.teacherId.IsAvailable ? 'Available' : 'Unavailable'}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Current Duties:</span>
                              <span className="ml-2 font-medium">{assignment.teacherId.PracticalDuty}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Remaining:</span>
                              <span className="ml-2 font-medium">{assignment.teacherId.RemainingDuty}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Max Duties:</span>
                              <span className="ml-2 font-medium">{assignment.teacherId.MaxDuties}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Assigned Room:</span>
                              <span className="ml-2 font-medium">Room {assignment.assignedRoom.RoomNo}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>Floor {assignment.assignedRoom.floor} • {assignment.assignedRoom.RoomType} • Capacity: {assignment.assignedRoom.Capacity}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Room Details */}
                  <div>
                    <div className="flex items-center mb-4">
                      <Building className="w-5 h-5 text-purple-500 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800">Room Allocations</h3>
                      <span className="ml-2 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                        {allocationItem.RoomDetails.length} Rooms
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      {allocationItem.RoomDetails.map((roomDetail, roomIndex) => (
                        <div key={roomDetail._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-800 text-lg">Room {roomDetail.roomId.RoomNo}</h4>
                              <p className="text-gray-600 text-sm">{roomDetail.roomId.RoomType}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Utilization</div>
                              <div className="text-lg font-semibold text-blue-600">
                                {Math.round((roomDetail.allocatedStudents / roomDetail.roomId.Capacity) * 100)}%
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-gray-500">Floor:</span>
                              <span className="ml-2 font-medium">{roomDetail.roomId.floor}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Capacity:</span>
                              <span className="ml-2 font-medium">{roomDetail.roomId.Capacity}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Allocated:</span>
                              <span className="ml-2 font-medium">{roomDetail.allocatedStudents} students</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Available:</span>
                              <span className="ml-2 font-medium">{roomDetail.roomId.Capacity - roomDetail.allocatedStudents} seats</span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Room Utilization</span>
                              <span>{roomDetail.allocatedStudents}/{roomDetail.roomId.Capacity}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${(roomDetail.allocatedStudents / roomDetail.roomId.Capacity) * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Course Distribution */}
                          <div className="pt-3 border-t border-gray-100">
                            <div className="text-xs text-gray-500 mb-2">Course Distribution:</div>
                            <div className="flex flex-wrap gap-2">
                              {roomDetail.courseDistribution.map((course, courseIndex) => (
                                <span key={courseIndex} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                  {course.courseName}: {course.students} students
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllocationDisplay;