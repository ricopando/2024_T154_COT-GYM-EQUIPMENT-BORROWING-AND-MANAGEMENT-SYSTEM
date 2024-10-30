import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; //bootstrap
import { BrowserRouter, Routes, Route } from "react-router-dom";
// IMPORT COMPONENTS HERE
import UserPage from "./components/UserPage.jsx";
import LoginPage from "./components/LoginPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/userDashboard" element={<UserPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
