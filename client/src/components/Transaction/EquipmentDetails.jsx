import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { FaEye } from 'react-icons/fa';
import ImageModal from './ImageModal';
import axios from 'axios';
import ConfirmEquipmentDeclineDialog from './ConfirmEquipmentDeclineDialog';
import DeleteModal from '../modal/deleteModal';
import ApprovedModal from '../modal/approvedModal';
import ConfirmApproved from './ConfirmApproved';
const EquipmentDetails = ({ isOpen, onClose, equipmentDetails, setEquipmentDetails,  setDeleteLoading, toast, fetchAllBorrowedItems }) => {
  if (!isOpen) return null;
  
  // Define the state for image modal open
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [localEquipmentToDecline, setLocalEquipmentToDecline] = useState(null);
  const [confirmEquipmentDeclineDialogOpen, setConfirmEquipmentDeclineDialogOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [confirmApprovedDialogOpen, setConfirmApprovedDialogOpen] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);

  const openImageModal = (imageUrl) => {
    setCurrentImageUrl(imageUrl);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setCurrentImageUrl("");
    setImageModalOpen(false);
  };

  const handleDeleteItemFromArray = (borrowedItemId, itemId) => {
    setLocalEquipmentToDecline({ borrowedItemId, itemId });
    setConfirmEquipmentDeclineDialogOpen(true);
    
  };

  const confirmDeleteItemFromArray = async () => {
    if (!localEquipmentToDecline) {
      console.error('No equipment selected for deletion.');
      return;
    }

    const { borrowedItemId, itemId } = localEquipmentToDecline;

    setConfirmEquipmentDeclineDialogOpen(false);
    setDeleteLoading(true);
    setShowDeleteModal(true);

    try {
      const response = await axios.delete(`http://localhost:8000/api/borrow-items/${borrowedItemId}/item/${itemId}`, {
        withCredentials: true,
      });

      console.log('Delete response:', response);

      if (response.status === 200) {
        setEquipmentDetails(prevDetails => 
          prevDetails.filter(item => item.id !== itemId)
        );

        await fetchAllBorrowedItems();
        console.log('Fetched all borrowed items after deletion');

        toast.success("Item successfully deleted.");
      } else {
        console.error('Failed to delete item. Response status:', response.status);
        toast.error("Failed to delete item.");
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error("Failed to delete item.");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  
  const handleApproveItem = (borrowedItemId, itemId) => {
    setLocalEquipmentToDecline({ borrowedItemId, itemId });
    setConfirmApprovedDialogOpen(true);
    setShowApprovedModal(true);
  };

  const confirmApproveItem = async () => {
    if (!localEquipmentToDecline) {
      console.error('No equipment selected for approval.');
      return;
    }

    const { borrowedItemId, itemId } = localEquipmentToDecline;

    console.log('Approving item, setting loading to true');
    setConfirmApprovedDialogOpen(false);
    setApproveLoading(true);
    setShowApprovedModal(true);
      // Start loading when the approve action is triggered

    try {
      const response = await axios.patch(
        `http://localhost:8000/api/borrow-items/${borrowedItemId}/item/${itemId}/status`,
        { status: 'Approved' },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setEquipmentDetails(prevDetails =>
          prevDetails.map(item =>
            item.id === itemId ? { ...item, status: 'Approved' } : item
          )
        );
        toast.success("Item successfully approved.");
        setShowApprovedModal(false);  // Close the ApprovedModal after successful approval

        // Fetch updated list of borrowed items
        await fetchAllBorrowedItems();
        console.log('Fetched all borrowed items after approval');
      } else {
        toast.error("Failed to approve item.");
      }
    } catch (error) {
      console.error('Error approving item:', error);
      toast.error("Failed to approve item.");
    } finally {
      console.log('Finished approving item, setting loading to false');
      setApproveLoading(false);  // Ensure loading is reset after the operation
      setConfirmApprovedDialogOpen(false);
    }
  };

  const closeConfirmApprovedModal = () => {
    setApproveLoading(false);
    setConfirmApprovedDialogOpen(false);
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
              onClick={() => handleApproveItem(row.transactionId, row.id)}
              aria-label={`Approve action for ${row.equipment._id}`}
            >
              Approve
            </button>
            <button
              className="bg-gray-500 text-white py-1 px-2 rounded hover:bg-gray-600"
              onClick={() => handleDeleteItemFromArray(row.transactionId, row.id)}
              aria-label={`Decline action for ${row.equipment._id}`}
            >
              Decline
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
        <ConfirmEquipmentDeclineDialog
          isOpen={confirmEquipmentDeclineDialogOpen}
          onClose={() => setConfirmEquipmentDeclineDialogOpen(false)}
          onConfirm={confirmDeleteItemFromArray}
        />
        <ConfirmApproved
          isOpen={confirmApprovedDialogOpen}
          onClose={closeConfirmApprovedModal}
          onConfirm={confirmApproveItem}
        />
        {showApprovedModal && <ApprovedModal />}
        {showDeleteModal && <DeleteModal />}
      
      </div>
    </div>
  );
};

export default EquipmentDetails;


