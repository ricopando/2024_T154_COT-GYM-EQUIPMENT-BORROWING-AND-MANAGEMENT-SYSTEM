import React from "react";
import { Link } from "react-router-dom";

const RestrictedAccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Restricted Access
        </h1>

        <p className="text-gray-600 mb-8">
          Sorry, you don't have permission to access this page. Please contact
          your administrator if you believe this is an error.
        </p>

        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors"
          >
            Return to Home
          </Link>

          <Link
            to="/login"
            className="block w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Login with Different Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestrictedAccess;
