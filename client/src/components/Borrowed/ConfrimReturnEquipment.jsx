// components/modal/ConfirmDeclineDialog.jsx
import React from 'react';

const ConfirmReturnEquipment = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Confirm Return</h2>
        <p>Are you sure you want to return this equipment?</p>
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-300 text-black py-1 px-4 rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white py-1 px-4 rounded"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmReturnEquipment;