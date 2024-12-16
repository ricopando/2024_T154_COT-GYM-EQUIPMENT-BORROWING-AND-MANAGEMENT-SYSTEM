import React from "react";

const ApprovedModal = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100">
    <div className="bg-white p-6 rounded shadow-lg flex items-center space-x-4">
      <svg
        className="animate-spin h-5 w-5 text-primary
          xmlns="
        http:fill="none" //www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <span className="text-lg font-medium text-primary">Approved...</span>
    </div>
  </div>
);

export default ApprovedModal;
