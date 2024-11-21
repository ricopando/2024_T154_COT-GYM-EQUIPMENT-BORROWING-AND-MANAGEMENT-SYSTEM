import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashBoard from './pages/Dashboard';
import Login from './pages/Login';
import Inventory from './pages/Inventory';
import Layout from './pages/Layout';
import Catalog from './pages/Catalog';
import UserLayout from './pages/UserLayout'; // UserLayout for user-related routes
import Borrow from './pages/Borrow';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} /> {/* Login Route */}

      {/* Dashboard routes with Layout */}
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<DashBoard />} /> {/* Dashboard */}
        <Route path="inventory" element={<Inventory />} /> {/* Inventory */}
      </Route>

      {/* User-related routes under UserLayout */}
      <Route path="/catalog" element={<UserLayout />}> {/* UserLayout wrapper */}
        <Route index element={<Catalog />} /> {/* Catalog page */}
        <Route path="borrow" element={<Borrow />} /> {/* Borrow page */}
      </Route>
    </Routes>
  );
}

export default App;
