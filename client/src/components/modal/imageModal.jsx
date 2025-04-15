import React from "react";

const ImageModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Equipment Image</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="sr-only">Close</span>
            &times;
          </button>
        </div>
        <div className="relative w-full h-96">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Equipment"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No image available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
