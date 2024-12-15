import React, { useRef, useEffect } from 'react';

const ImageModal = ({ isOpen, onClose, imageUrl }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      modalRef.current.focus();
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center"
      role="dialog"
      aria-labelledby="image-modal-title"
      aria-describedby="image-modal-description"
    >
      <div
        className="relative bg-white p-4 rounded-lg shadow-lg"
        tabIndex="-1"
        ref={modalRef}
      >
        <img 
          src={imageUrl} 
          alt="Equipment" 
          className="w-64 h-64 object-contain rounded"
          id="image-modal-description"
        />
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-2 mr-2 text-red-600 hover:text-red-800"
          aria-label="Close image modal"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ImageModal;