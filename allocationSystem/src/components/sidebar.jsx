import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  DoorOpen,
  Users,
  UserCheck,
} from 'lucide-react';

const Sidebar = () => {
  const sidebarItems = [
    { id: 'dashboard', label: 'All-Data', icon: Home, path: '/dashboard/Data' },
    { id: 'rooms', label: 'Room Creation', icon: DoorOpen, path: '/dashboard/addRooms' },
    { id: 'teachers', label: 'Teacher Data Creation', icon: Users, path: '/dashboard/addTeacher' },
    { id: 'allocation', label: 'Allocation', icon: UserCheck, path: '/dashboard/CreateAllocation' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r min-h-screen">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Home className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-800">Education Portal</h1>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) => `
                    w-full flex items-center px-3 py-3 text-left rounded-lg transition-all duration-200 group
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 shadow-sm border border-blue-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <div className={`
                    p-2 rounded-md mr-3 transition-colors duration-200
                    ${window.location.pathname === item.path
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700'
                    }
                  `}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        
      </div>

     
    </div>
  );
};

export default Sidebar;
