import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route ,Routes, useNavigate} from 'react-router-dom'
import HomePage from './components/homepage'
import LoginPage from './components/login'
import SignupPage from './components/SignUp'
import Dashboard from './components/dashboard'
import CreateRoom from './components/CreatRoom'
import TeacherData from './components/TeacherData'
import Allocation from './components/allocation'
import OTPVerificationPage from './components/verifyEmail'
import { useDispatch, useSelector } from 'react-redux'
import OpenRoute from './components/openRoute'
import PrivateRoute from './components/PrivateRoute'
import { LogOut } from './operations/services/auth'
import AllocationDisplay from './components/ShowData'
function App() {
  const {token}=useSelector(state=>state.Auth)
  const dispatch=useDispatch()
  const onNavigate=useNavigate()
  return (
    <div className='w-full'>
      <nav className="bg-white shadow-sm border-b">
        <div className="p-2 ">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Allocation System</h1>
            </div>
            {
             !token &&<div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('/login')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate("/SignUp")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Up
              </button>
            
            </div>
            }
            {
              token && <div className="flex items-center space-x-4">
              <button
                onClick={() => dispatch(LogOut(onNavigate))}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Log Out
              </button>
              <button
                onClick={() => onNavigate("/dashboard/Data")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </button>
            
            </div>
            }
          </div>
        </div>
      </nav>
      <Routes>
        <Route path='/' element={<OpenRoute><HomePage/></OpenRoute>}/>
        <Route path="/login" element={<OpenRoute><LoginPage/></OpenRoute>}/>
        <Route path='/verify' element={<OpenRoute><OTPVerificationPage/>
        </OpenRoute>}/>
        <Route path='/SignUp' element={<OpenRoute><SignupPage/></OpenRoute>}/>
        <Route path="/dashboard/*" element={<PrivateRoute><Dashboard/></PrivateRoute>}>
            <Route path='Data' element={<AllocationDisplay/>}/>
            <Route path="addRooms" element={<CreateRoom/>}/>
            <Route path="addTeacher" element={<TeacherData/>} />
            <Route path="CreateAllocation" element= {<Allocation/>} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
