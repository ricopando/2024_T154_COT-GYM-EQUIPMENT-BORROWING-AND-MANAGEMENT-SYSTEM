import React from "react";

const SuccessChangePass = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl transform transition-all duration-300 ease-in-out max-w-md w-full mx-4">
        <div className="flex flex-col items-center text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>

          {/* Success Message */}
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Password Changed Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>

          {/* Button */}
          <button
            onClick={onClose}
            className="bg-primary text-white font-semibold py-2 px-6 rounded-lg 
            transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 
            focus:ring-primary focus:ring-opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessChangePass;
