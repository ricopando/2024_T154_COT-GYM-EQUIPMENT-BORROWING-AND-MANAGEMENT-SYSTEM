import React, { useEffect } from "react";
import PropTypes from "prop-types";

const catalogModal = ({ children, onClose }) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

catalogModal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default catalogModal;