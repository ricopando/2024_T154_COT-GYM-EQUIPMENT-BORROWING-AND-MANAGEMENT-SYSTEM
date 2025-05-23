import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import RestrictedAccess from "./RestrictedAccess";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/auth/check",
          {
            withCredentials: true,
          }
        );

        console.log("Auth check response:", response.data);

        // Check if the response indicates authentication
        if (response.data.isAuthenticated && response.data.user) {
          setIsAuthenticated(true);
          // Use the role from the backend response
          const role = response.data.user.role === "Admin" ? "admin" : "user";
          setUserRole(role);
          console.log("User role from backend:", role);
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If not authenticated, show restricted access page
  if (!isAuthenticated) {
    console.log("Not authenticated, showing restricted access");
    return <RestrictedAccess />;
  }

  console.log("Current user role:", userRole);
  console.log("Allowed roles:", allowedRoles);

  // Check if user has permission for this route
  if (!allowedRoles.includes(userRole)) {
    console.log(
      "Access denied. User role:",
      userRole,
      "Allowed roles:",
      allowedRoles
    );

    // If authenticated but wrong role, redirect to their appropriate home page
    if (userRole === "admin") {
      return <Navigate to="/dashboard" state={{ from: location }} replace />;
    } else {
      return <Navigate to="/home" state={{ from: location }} replace />;
    }
  }

  // User has correct role, render the protected content
  return children;
};

export default ProtectedRoute;
