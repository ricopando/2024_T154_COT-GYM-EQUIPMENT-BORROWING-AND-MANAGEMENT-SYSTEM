import React, { useState} from 'react';
import DataTable from 'react-data-table-component';
import { FaEye } from 'react-icons/fa';
import ImageModal from './ImageModal';


const EquipmentDetails = ({ isOpen, onClose, equipmentDetails }) => {
  if (!isOpen) return null;
  
  // Define the state for image modal open
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");


  

  const openImageModal = (imageUrl) => {
    setCurrentImageUrl(imageUrl);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setCurrentImageUrl("");
    setImageModalOpen(false);
  };





  const equipmentColumns = [
    {
      name: "Name",
      selector: row => row.equipment.name,
      sortable: true,
    },
    {
      name: "Serial No",
      selector: row => row.equipment.serialNumber,
      sortable: true,
    },
    {
      name: "Model",
      selector: row => row.equipment.model,
      sortable: true,
    },
    {
      name: "Category",
      selector: row => row.equipment.category,
      sortable: true,
    },
    {
      name: "Image",
      selector: row => (
        <button
          onClick={() => openImageModal(row.equipment.image)}
          className="text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label={`View image of ${row.equipment.name}`}
          tabIndex="0"
        >
          <FaEye />
        </button>
      ),
      sortable: false,
    },
      {
        name: "Borrowed Date",
        selector: row => new Date(row.borrowDate).toLocaleDateString(),
        sortable: true,
      },
      {
        name: "Return Date",
        selector: row => new Date(row.returnDate).toLocaleDateString(),
        sortable: true,
      },
    {
      name: "Status",
      selector: row => row.status,
      sortable: true,
    },
    ];

  // Define filteredItems if needed, otherwise use equipmentDetails directly
  const filteredItems = equipmentDetails; 
  // Replace with actual filtering logic if needed

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center w-full z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl mx-4 max-h-[85vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Equipment Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Close Equipment Modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
         
          
          {equipmentDetails && equipmentDetails.length > 0 ? (
            <DataTable
              columns={equipmentColumns}
              data={filteredItems}
              pagination
              highlightOnHover
              pointerOnHover
              responsive
              customStyles={{
                headRow: {
                  style: {
                    backgroundColor: '#F9FAFB',
                    borderBottom: '1px solid #E5E7EB',
                  },
                },
                headCells: {
                  style: {
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#374151',
                    paddingTop: '1rem',
                    paddingBottom: '1rem',
                  },
                },
                rows: {
                  style: {
                    '&:not(:last-of-type)': {
                      borderBottom: '1px solid #E5E7EB',
                    },
                  },
                },
                cells: {
                  style: {
                    fontSize: '0.875rem',
                    color: '#374151',
                    padding: '1rem',
                  },
                },
              }}
            />
          ) : (
            <p className="text-gray-500 text-center py-4">No details available.</p>
          )}
        </div>

        {/* Modals */}
        <ImageModal
          isOpen={imageModalOpen}
          onClose={closeImageModal}
          imageUrl={currentImageUrl}
        />
       
    
       
      </div>
    </div>
  );
};

export default EquipmentDetails;


