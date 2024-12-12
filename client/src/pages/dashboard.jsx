import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/AdminNavbar';

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col"> {/* Adds space for the sidebar */}
       <Navbar />
        <main className="flex-1 p-4 "> {/* Add padding to ensure content is not hidden behind navbar */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
          {/* Main content goes here */}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;