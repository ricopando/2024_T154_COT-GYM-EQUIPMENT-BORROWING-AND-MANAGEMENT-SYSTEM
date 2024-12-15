import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
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
import AddTransaction from "./pages/Addtransaction";
import axios from "axios";

const App = () => {
  const [userAccess, setUserAccess] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserAccess = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/auth/status", {
        withCredentials: true,
      });
      console.log("User Access Response:", response.data);

      // Access the user directly from the response object
      const currentUserAccess = response.data.user; // Access the user property directly

      if (currentUserAccess) {
        setUserAccess({
          inventory: currentUserAccess.inventory ?? false,
          transaction: currentUserAccess.transaction ?? false,
          borrowed: currentUserAccess.borrowed ?? false,
          report: currentUserAccess.report ?? false,
          userManagement: currentUserAccess.userManagement ?? false,
          addTransaction:  currentUserAccess.addTransaction ?? false,
        });
      } else {
        console.error("Current user not found in response");
        setUserAccess({
          inventory: false,
          transaction: false,
          borrowed: false,
          report: false,
          userManagement: false,
          addTransaction: false
        });
      }
    } catch (error) {
      console.error("Error fetching user access:", error);
      setUserAccess({
        inventory: false,
        transaction: false,
        borrowed: false,
        report: false,
        userManagement: false,
        addTransaction: false
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAccess();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route
            path="/borrow"
            element= {<Borrow /> }
          />
          <Route path="/borrowList" element={<BorrowList />} />
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/userManagement" element={ userAccess.userManagement ? <UserManagement />: <Navigate to="/dashboard" />} />
          <Route
            path="/transaction"
            element={
              userAccess.transaction ? <Transaction /> : <Navigate to="/dashboard" />
            }
          />
          <Route path="/borrowed" element={userAccess.borrowed ? <Borrowed /> : <Navigate to="/dashboard" />} />
          <Route
            path="/inventory"
            element={userAccess.inventory ? <Inventory /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/report"
            element={userAccess.report ? <Report /> : <Navigate to="/dashboard" />}
          />
          <Route path="/addtransaction" element={userAccess.addTransaction ? <AddTransaction /> :<Navigate to="/dashboard" /> } /> 
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
