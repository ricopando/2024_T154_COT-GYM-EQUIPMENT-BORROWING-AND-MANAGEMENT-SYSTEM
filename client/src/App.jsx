import React from 'react';
import './App.css';
import Home from './Component/Home';
import Headers from './Component/Headers';
import Dashboard from './Component/Dashboard';
import Error from './Component/Error';
import { Routes, Route, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();

  return (
    <>
      {/* Render Headers only if the current path is '/dashboard' */}
      {location.pathname === '/dashboard' && <Headers />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}

// Note: Ensure your App component is wrapped in Router in your main entry file (usually index.js)
export default App;