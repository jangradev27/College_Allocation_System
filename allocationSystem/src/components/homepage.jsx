import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const onNavigate=useNavigate();
  return (
    <div className="min-h-screen min-w-full bg-gray-50 border-[1px] border-black">
      

      <main className="">
        <div className="">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Allocation System
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Manage and track your resource allocations efficiently with our comprehensive system.
            </p>
            
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <button
                onClick={() => onNavigate('/login')}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md"
              >
                Get Started
              </button>
              <button
                onClick={() => onNavigate('/SignUp')}
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-blue-600 font-medium py-2 px-6 rounded-md border border-blue-600"
              >
                Create Account
              </button>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-lg p-6 mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Easy Management</h3>
                <p className="text-gray-600">Streamline your allocation process with intuitive tools</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-lg p-6 mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Real-time Tracking</h3>
                <p className="text-gray-600">Monitor allocations and usage in real-time</p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-lg p-6 mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Detailed Reports</h3>
                <p className="text-gray-600">Generate comprehensive reports and analytics</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;