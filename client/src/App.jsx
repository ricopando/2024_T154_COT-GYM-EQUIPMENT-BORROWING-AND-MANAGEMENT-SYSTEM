import React from 'react';
import { Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import AdminDashBoard from './pages/AdminDashBoard';
import Inventory from './pages/Inventory';
import UserDashBoard from './pages/UserDashBoard';

function App() {
  return (
  <>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin-dashboard" element={<AdminDashBoard />} />
      <Route path="/user-dashboard" element={<UserDashBoard />} />
      <Route path="/admin-inventory" element={<Inventory />} /> {/* Inventory page */}

    </Routes>
     </>  
  );
}

export default App;
