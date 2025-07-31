import React from 'react'
import Sidebar from './sidebar'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className='flex w-full '>
        <Sidebar/>
        <div className=' w-full'>
            <Outlet/>
        </div>


    </div>
  )
}

export default Dashboard