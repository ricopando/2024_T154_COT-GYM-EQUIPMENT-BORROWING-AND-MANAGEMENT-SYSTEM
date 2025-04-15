import React from "react";
import { Link } from "react-router-dom";
import restrictedAccess from "../assets/restrictedAccess.gif";

const RestrictedAccess = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <img
        src={restrictedAccess}
        alt="Access Denied"
        className="h-64 w-64 mb-8"
      />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Restricted Access
      </h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Sorry, you don't have permission to access this page.
      </p>
      <Link
        to="/"
        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
      >
        Back to Login
      </Link>
    </div>
  );
};

export default RestrictedAccess;
