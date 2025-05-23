import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
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
import AdminLayout from "./components/Layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          {/* Public route - only login */}
          <Route path="/" element={<Login />} />

          {/* Protected User Routes */}
          <Route
            path="/catalog"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <Catalog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/borrow"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Borrow />
              </ProtectedRoute>
            }
          />
          <Route
            path="/borrowList"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <BorrowList />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/userManagement"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <UserManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transaction"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <Transaction />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/borrowed"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <Borrowed />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <Inventory />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <Report />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/addtransaction"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <AddTransaction />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirect unauthorized or unknown routes to restricted access */}
          <Route
            path="*"
            element={
              <ProtectedRoute allowedRoles={[]}>
                <Navigate to="/" replace />
              </ProtectedRoute>
            }
          />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
