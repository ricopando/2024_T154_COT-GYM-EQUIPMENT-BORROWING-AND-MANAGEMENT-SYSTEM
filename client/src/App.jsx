import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/landingpage";
import Catalog from "./pages/Catalog/catalog";  
import Login from "./pages/login";
import Borrow from "./pages/borrow";
import BorrowList from "./pages/borrowList";
import Dashboard from "./pages/dashboard";
import UserManagement from "./pages/userManagement";
import Transaction from "./pages/transaction";
import Borrowed from "./pages/borrowed";
import Inventory from "./pages/inventory";
import ErrorBoundary from "./pages/error";
import Report from "./pages/report";
const App = () => {
  return (
    <Router>
      <ErrorBoundary>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/borrow" element={<Borrow />} />
        <Route path="/borrowList" element={<BorrowList />} />
        <Route path="/" element={<Login />} />
      </Routes>
      <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/userManagement" element={<UserManagement />} />
      <Route path="/transaction" element={<Transaction />} />
      <Route path="/borrowed" element={<Borrowed />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/report" element={<Report />} />
     </Routes>
     </ErrorBoundary>
    </Router>
  );
};

export default App;
