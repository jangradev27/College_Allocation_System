import React, { useEffect, useState } from 'react'
import TeacherDisplay from './TeachersDisplay'
import RoomDisplay from './RoomDisplay'
import AllocationDisplay from './AllocationData';

const ShowData = () => {
  const [showRoom,setShowRoom]=useState(false);  
  const [showAllocation,setShowAllocation]=useState(true);  
  const [showTeachers,setShowTeachers]=useState(false);  
  const handleShowAllocations=()=>{
    setShowAllocation(true);
    setShowRoom(false);
    setShowTeachers(false);
  }
    const handleShowRooms=()=>{
    setShowAllocation(false);
    setShowRoom(true);
    setShowTeachers(false);
  }
    const handleShowTeachers=()=>{
    setShowAllocation(false);
    setShowRoom(false);
    setShowTeachers(true);
  }
  return (
   <>
     <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center space-x-8 py-4">
            <button onClick={handleShowAllocations} className="px-6 py-3 text-gray-700 font-medium rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 border border-transparent hover:border-blue-200">
              Allocations
            </button>
            <button onClick={handleShowRooms} className="px-6 py-3 text-gray-700 font-medium rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-200 border border-transparent hover:border-green-200">
              Rooms
            </button>
            <button onClick={handleShowTeachers} className="px-6 py-3 text-gray-700 font-medium rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 border border-transparent hover:border-purple-200">
              Teachers
            </button>
          </div>
        </div>
      </nav>

      {showAllocation && <AllocationDisplay/>}
      {showRoom && <RoomDisplay/>}
      {showTeachers && <TeacherDisplay/>}
   </>

  )
}

export default ShowData