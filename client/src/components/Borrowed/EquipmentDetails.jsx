import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { FaEye } from 'react-icons/fa';
import ImageModal from './ImageModal';
import axios from 'axios';
import ApprovedModal from '../modal/approvedModal';
import ConfirmReturn from './ConfirmReturn';
const EquipmentDetails = ({ isOpen, onClose, equipmentDetails, setEquipmentDetails,  toast, fetchAllBorrowedItems }) => {
  if (!isOpen) return null;
  
  // Define the state for image modal open
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [localEquipmentToDecline, setLocalEquipmentToDecline] = useState(null);
  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [confirmReturnDialogOpen, setConfirmReturnDialogOpen] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  

  const openImageModal = (imageUrl) => {
    setCurrentImageUrl(imageUrl);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setCurrentImageUrl("");
    setImageModalOpen(false);
  };

  const handleReturnItem = (borrowedItemId, itemId) => {
    setLocalEquipmentToDecline({ borrowedItemId, itemId });
    setConfirmReturnDialogOpen(true);
    setShowApprovedModal(true);
  };

  const confirmReturnItem = async () => {
    if (!localEquipmentToDecline) {
      console.error('No equipment selected for return.');
      return;
    }

    const { borrowedItemId, itemId } = localEquipmentToDecline;

    console.log('Returning item, setting loading to true');
    setConfirmReturnDialogOpen(false);
    setApproveLoading(true);
    setShowApprovedModal(true);

    try {
      const response = await axios.patch(
        `http://localhost:8000/api/borrow-items/${borrowedItemId}/item/${itemId}/return`,
        { status: 'Returned' },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setEquipmentDetails(prevDetails =>
          prevDetails.map(item =>
            item.id === itemId ? { ...item, status: 'Returned' } : item
          )
        );
        toast.success("Item successfully returned.");
        setShowApprovedModal(false);

        await fetchAllBorrowedItems();
        console.log('Fetched all borrowed items after return');
      } else {
        toast.error("Failed to return item.");
      }
    } catch (error) {
      console.error('Error returning item:', error);
      toast.error("Failed to return item.");
    } finally {
      console.log('Finished returning item, setting loading to false');
      setApproveLoading(false);
      setConfirmReturnDialogOpen(false);
    }
  };

  const closeConfirmReturnModal = () => {
    setApproveLoading(false);
    setConfirmReturnDialogOpen(false);
    setShowApprovedModal(false);
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
    {
        name: "Action",
        selector: row => (
          <div className="flex gap-2">
            <button
              className="bg-primary text-white py-1 px-2 rounded hover:bg-primary-dark"
              onClick={() => handleReturnItem(row.transactionId, row.id)}
              aria-label={`Return action for ${row.equipment._id}`}
            >
              Return
            </button>
          </div>
        ),
        sortable: false,
        width: '220px',
      },
    ];

  // Define filteredItems if needed, otherwise use equipmentDetails directly
  const filteredItems = equipmentDetails; 
  // Replace with actual filtering logic if needed

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-end items-center w-full "
      role="dialog"
      aria-labelledby="equipment-modal-title"
      aria-describedby="equipment-modal-description"
    >
      <div className="bg-white p-6 rounded-lg w-full max-w-7xl mx-4 sm:mx-6 md:mx-8 lg:mx-10 xl:mx-12 max-h-[80vh] overflow-y-auto">
        <h2 id="equipment-modal-title" className="text-2xl font-bold mb-4 text-black">Equipment Details</h2>
        {approveLoading && <p>Loading...</p>}
        {equipmentDetails && equipmentDetails.length > 0 ? (
          <DataTable
            columns={equipmentColumns}
            data={filteredItems}
            pagination
            highlightOnHover
            pointerOnHover
            responsive
            customStyles={{
              headCells: {
                style: {
                  fontWeight: 'bold',
                  backgroundColor: '#F7FAFC',
                  color: 'black',
                },
              },
              cells: {
                style: {
                  padding: '12px',
                  color: 'black',
                },
              },
            }}
          />
        ) : (
          <p id="equipment-modal-description" className="text-black">No details available.</p>
        )}
        <button
          className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
          onClick={onClose}
          aria-label="Close Equipment Modal"
        >
          Close
        </button>
        <ImageModal
          isOpen={imageModalOpen}
          onClose={closeImageModal}
          imageUrl={currentImageUrl}
        />
       
        <ConfirmReturn
          isOpen={confirmReturnDialogOpen}
          onClose={closeConfirmReturnModal}
          onConfirm={confirmReturnItem}
        />
        {showApprovedModal && <ApprovedModal />}
      </div>
    </div>
  );
};

export default EquipmentDetails;


