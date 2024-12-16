import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { FaEye } from "react-icons/fa";
import ImageModal from "./ImageModal";
import axios from "axios";
import ConfirmEquipmentDeclineDialog from "./ConfirmEquipmentDeclineDialog";
import DeleteModal from "../modal/deleteModal";
import ApprovedModal from "../modal/approvedModal";
import ConfirmApproved from "./ConfirmApproved";
import EditDatesModal from "./EditDatesModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EquipmentDetails = ({
  isOpen,
  onClose,
  equipmentDetails,
  setEquipmentDetails,
  setDeleteLoading,
  toast,
  fetchAllBorrowedItems,
}) => {
  if (!isOpen) return null;

  // Define the state for image modal open
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [localEquipmentToDecline, setLocalEquipmentToDecline] = useState(null);
  const [
    confirmEquipmentDeclineDialogOpen,
    setConfirmEquipmentDeclineDialogOpen,
  ] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [confirmApprovedDialogOpen, setConfirmApprovedDialogOpen] =
    useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [editDatesModalOpen, setEditDatesModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [borrowedItems, setBorrowedItems] = useState([]);

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
      console.error("No equipment selected for deletion.");
      return;
    }

    const { borrowedItemId, itemId } = localEquipmentToDecline;

    setConfirmEquipmentDeclineDialogOpen(false);
    setDeleteLoading(true);
    setShowDeleteModal(true);

    try {
      const response = await axios.delete(
        `http://localhost:8000/api/borrow-items/${borrowedItemId}/item/${itemId}`,
        {
          withCredentials: true,
        }
      );

      console.log("Delete response:", response);

      if (response.status === 200) {
        setEquipmentDetails((prevDetails) =>
          prevDetails.filter((item) => item.id !== itemId)
        );

        await fetchAllBorrowedItems();
        console.log("Fetched all borrowed items after deletion");

        toast.success("Item successfully deleted.");
      } else {
        console.error(
          "Failed to delete item. Response status:",
          response.status
        );
        toast.error("Failed to delete item.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
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
      console.error("No equipment selected for approval.");
      return;
    }

    const { borrowedItemId, itemId } = localEquipmentToDecline;

    console.log("Approving item, setting loading to true");
    setConfirmApprovedDialogOpen(false);
    setApproveLoading(true);
    setShowApprovedModal(true);
    // Start loading when the approve action is triggered

    try {
      const response = await axios.patch(
        `http://localhost:8000/api/borrow-items/${borrowedItemId}/item/${itemId}/status`,
        { status: "Approved" },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setEquipmentDetails((prevDetails) =>
          prevDetails.map((item) =>
            item.id === itemId ? { ...item, status: "Approved" } : item
          )
        );
        toast.success("Item successfully approved.");
        setShowApprovedModal(false); // Close the ApprovedModal after successful approval

        // Fetch updated list of borrowed items
        await fetchAllBorrowedItems();
        console.log("Fetched all borrowed items after approval");
      } else {
        toast.error("Failed to approve item.");
      }
    } catch (error) {
      console.error("Error approving item:", error);
      toast.error("Failed to approve item.");
    } finally {
      console.log("Finished approving item, setting loading to false");
      setApproveLoading(false); // Ensure loading is reset after the operation
      setConfirmApprovedDialogOpen(false);
    }
  };

  const closeConfirmApprovedModal = () => {
    setApproveLoading(false);
    setConfirmApprovedDialogOpen(false);
    setShowApprovedModal(false);
  };

  const handleEditDateItem = (borrowedItemId, itemId) => {
    const item = equipmentDetails.find((item) => item.id === itemId);
    setSelectedItem({ borrowedItemId, itemId, item });
    setEditDatesModalOpen(true);
  };

  const handleUpdateDates = async (newBorrowDate, newReturnDate) => {
    if (!selectedItem) return;

    try {
      const response = await axios.patch(
        `http://localhost:8000/api/borrow-items/${selectedItem.borrowedItemId}/item/${selectedItem.itemId}/dates`,
        {
          borrowDate: newBorrowDate,
          returnDate: newReturnDate,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setEquipmentDetails((prevDetails) =>
          prevDetails.map((item) =>
            item.id === selectedItem.itemId
              ? {
                  ...item,
                  borrowDate: newBorrowDate,
                  returnDate: newReturnDate,
                }
              : item
          )
        );
        toast.success("Dates updated successfully");
        setEditDatesModalOpen(false);
        await fetchAllBorrowedItems();
      }
    } catch (error) {
      console.error("Error updating dates:", error);
      toast.error("Failed to update dates");
    }
  };

  const equipmentColumns = [
    {
      name: "Name",
      selector: (row) => row.equipment.name,
      sortable: true,
    },
    {
      name: "Serial No",
      selector: (row) => row.equipment.serialNumber,
      sortable: true,
    },
    {
      name: "Model",
      selector: (row) => row.equipment.model,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.equipment.category,
      sortable: true,
    },
    {
      name: "Image",
      selector: (row) => (
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
      selector: (row) => new Date(row.borrowDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Return Date",
      selector: (row) => new Date(row.returnDate).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="flex gap-1">
          <button
            className={`text-white py-1 px-1 rounded ${
              row.status === "Approved"
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-primary hover:bg-primary-dark"
            }`}
            onClick={() => handleApproveItem(row.transactionId, row.id)}
            disabled={row.status === "Approved"}
            aria-label={`Approve action for ${row.equipment._id}`}
          >
            Approve
          </button>
          <button
            className={`text-white py-1 px-1 rounded ${
              row.status === "Approved"
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-500 hover:bg-gray-600"
            }`}
            onClick={() => handleDeleteItemFromArray(row.transactionId, row.id)}
            disabled={row.status === "Approved"}
            aria-label={`Decline action for ${row.equipment._id}`}
          >
            Decline
          </button>
          <button
            className={`text-white py-1 px-1 rounded ${
              row.status === "Approved"
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
            onClick={() => handleEditDateItem(row.transactionId, row.id)}
            aria-label={`Edit date for ${row.equipment._id}`}
          >
            Edit Date
          </button>
        </div>
      ),
      sortable: false,
      width: "250px",
    },
  ];

  // Define filteredItems if needed, otherwise use equipmentDetails directly
  const filteredItems = equipmentDetails;
  // Replace with actual filtering logic if needed

  // Fetch borrowed items
  useEffect(() => {
    const fetchBorrowedItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/borrow-items"
        );
        setBorrowedItems(response.data);
      } catch (error) {
        console.error("Failed to fetch borrowed items:", error);
      }
    };
    fetchBorrowedItems();
  }, []);

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
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {approveLoading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

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
                    backgroundColor: "#F9FAFB",
                    borderBottom: "1px solid #E5E7EB",
                  },
                },
                headCells: {
                  style: {
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#374151",
                    paddingTop: "1rem",
                    paddingBottom: "1rem",
                  },
                },
                rows: {
                  style: {
                    "&:not(:last-of-type)": {
                      borderBottom: "1px solid #E5E7EB",
                    },
                  },
                },
                cells: {
                  style: {
                    fontSize: "0.875rem",
                    color: "#374151",
                    padding: "1rem",
                  },
                },
              }}
            />
          ) : (
            <p className="text-gray-500 text-center py-4">
              No details available.
            </p>
          )}
        </div>

        {/* Modals */}
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
        {selectedItem && (
          <EditDatesModal
            isOpen={editDatesModalOpen}
            onClose={() => setEditDatesModalOpen(false)}
            onConfirm={handleUpdateDates}
            initialBorrowDate={selectedItem.item.borrowDate}
            initialReturnDate={selectedItem.item.returnDate}
            borrowedDates={borrowedItems}
            itemId={selectedItem.item.equipment._id}
          />
        )}
      </div>
    </div>
  );
};

export default EquipmentDetails;
