import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar/Navbar";
import StudentBorrowerSlipPreview from "../components/BorrowerSlipPreview";
import AOS from "aos";
import "aos/dist/aos.css";

const Borrow = () => {
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [equipmentItems, setEquipmentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [equipmentDetails, setEquipmentDetails] = useState(null);
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [confirmCancelDialogOpen, setConfirmCancelDialogOpen] = useState(false);
  const [itemToCancel, setItemToCancel] = useState(null);
  const [
    confirmTransactionCancelDialogOpen,
    setConfirmTransactionCancelDialogOpen,
  ] = useState(false);
  const [transactionToCancel, setTransactionToCancel] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [borrowerSlipModalOpen, setBorrowerSlipModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [setSuccessMessage] = useState("");

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchBorrowedItemsByUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/borrow-items/user/actual-user-id",
          {
            withCredentials: true,
          }
        );
        if (isMounted) {
          const filteredItems = response.data.filter(
            (item) => item.items && item.items.length > 0
          );
          setBorrowedItems(filteredItems);
        }
      } catch (error) {
        console.error("Failed to fetch borrowed items for user:", error);
        toast.error("Failed to load borrowed items for user");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBorrowedItemsByUser();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (
      !deleteLoading &&
      equipmentDetails &&
      equipmentDetails.items.length === 0
    ) {
      closeEquipmentModal();
    }
  }, [deleteLoading, equipmentDetails]);

  const handleDeleteTransaction = async (itemId) => {
    setDeleteLoading(true);
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/borrow-items/${itemId}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setBorrowedItems((prevItems) =>
          prevItems.filter((item) => item._id !== itemId)
        );
        toast.success("Transaction successfully deleted.");
      } else {
        toast.error("Failed to delete transaction.");
      }
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      toast.error("Failed to delete transaction.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteItemFromArray = async (borrowedItemId, itemId) => {
    setDeleteLoading(true);
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/borrow-items/${borrowedItemId}/item/${itemId}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setBorrowedItems((prevItems) =>
          prevItems
            .map((item) => {
              if (item._id === borrowedItemId) {
                const updatedItems = item.items.filter(
                  (equipmentItem) => equipmentItem._id !== itemId
                );
                if (updatedItems.length === 0) {
                  handleDeleteTransaction(borrowedItemId);
                  return null;
                }
                return { ...item, items: updatedItems };
              }
              return item;
            })
            .filter(Boolean)
        );

        if (equipmentDetails && equipmentDetails._id === borrowedItemId) {
          const updatedEquipmentItems = equipmentDetails.items.filter(
            (equipmentItem) => equipmentItem._id !== itemId
          );
          setEquipmentDetails({
            ...equipmentDetails,
            items: updatedEquipmentItems,
          });
        }

        setEquipmentItems((prevItems) =>
          prevItems.map((equipmentItem) =>
            equipmentItem._id === itemId
              ? { ...equipmentItem, availabilityStatus: "Available" }
              : equipmentItem
          )
        );

        toast.success("Item successfully deleted.");
      } else {
        toast.error("Failed to delete item.");
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.error("Failed to delete item.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancel = (borrowedItemId, itemId) => {
    setItemToCancel({ borrowedItemId, itemId });
    setConfirmCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    if (itemToCancel) {
      try {
        await handleDeleteItemFromArray(
          itemToCancel.borrowedItemId,
          itemToCancel.itemId
        );
        setItemToCancel(null);
        setConfirmCancelDialogOpen(false);
        setSuccessMessage("Item successfully cancelled!");
        setShowSuccessModal(true);
      } catch (error) {
        console.error("Error confirming cancellation:", error);
        toast.error("Failed to delete the item.");
      }
    }
  };

  const closeConfirmCancelDialog = () => {
    setItemToCancel(null);
    setConfirmCancelDialogOpen(false);
  };

  const handleCancelTransaction = (transactionId) => {
    setTransactionToCancel(transactionId);
    setConfirmTransactionCancelDialogOpen(true);
  };

  const confirmTransactionCancel = async () => {
    if (transactionToCancel) {
      try {
        await handleDeleteTransaction(transactionToCancel);
        setTransactionToCancel(null);
        setConfirmTransactionCancelDialogOpen(false);
        setShowSuccessModal(true);
      } catch (error) {
        console.error("Error confirming transaction cancellation:", error);
        toast.error("Failed to delete the transaction.");
      }
    }
  };

  const closeConfirmTransactionCancelDialog = () => {
    setTransactionToCancel(null);
    setConfirmTransactionCancelDialogOpen(false);
  };

  const openEquipmentModal = (equipment) => {
    if (!equipment || !equipment.items || equipment.items.length === 0) {
      setEquipmentModalOpen(false);
      return;
    }
    setEquipmentDetails(equipment);
    setEquipmentModalOpen(true);
  };

  const closeEquipmentModal = () => {
    setEquipmentDetails(null);
    setEquipmentModalOpen(false);
  };

  const openImageModal = (url) => {
    setImageUrl(url);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageUrl("");
    setImageModalOpen(false);
  };

  const openBorrowerSlipPreview = (transaction) => {
    console.log("Selected Transaction:", transaction);
    setSelectedTransaction(transaction);
    setBorrowerSlipModalOpen(true);
  };

  const closeBorrowerSlipPreview = () => {
    setSelectedTransaction(null);
    setBorrowerSlipModalOpen(false);
  };

  const columns = [
    {
      name: "Transaction ID",
      selector: (row) => row._id,
      sortable: true,
    },
    {
      name: "Transaction Date",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Transaction Time",
      selector: (row) => new Date(row.createdAt).toLocaleTimeString(),
      sortable: true,
    },
    {
      name: "Equipment",
      cell: (row) => (
        <button
          className="text-blue-500 hover:underline"
          onClick={() => openEquipmentModal(row)}
        >
          See Equipment
        </button>
      ),
    },
    {
      name: "Form",
      cell: (row) => (
        <button
          className="text-green-500 hover:underline"
          onClick={() => openBorrowerSlipPreview(row)}
        >
          View Form
        </button>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) =>
        row.status !== "Approved" &&
        row.status !== "Returned" && (
          <button
            className="text-red-500 hover:underline"
            onClick={() => handleCancelTransaction(row._id)}
          >
            Cancel Transaction
          </button>
        ),
    },
  ];

  const equipmentDetailsColumns = [
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
      cell: (row) => (
        <button
          className="text-blue-500 hover:underline"
          onClick={() => openImageModal(row.equipment.image)}
        >
          View Image
        </button>
      ),
    },
    {
      name: "Borrow Date",
      selector: (row) => new Date(row.borrowDate).toLocaleString(),
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
      cell: (row) =>
        row.status !== "Approved" &&
        row.status !== "Returned" && (
          <button
            className="text-red-500 hover:underline"
            onClick={() => handleCancel(equipmentDetails._id, row._id)}
          >
            Cancel Item
          </button>
        ),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      <Navbar />
      <div className="container mx-auto px-4 pt-8">
        <div className="text-left mt-8 mb-16">
          <h1
            data-aos="fade-up"
            className="text-5xl font-bold text-gray-800 dark:text-white relative inline-block
            after:content-[''] after:block after:w-1/2 after:h-1 after:bg-primary
            after:mt-2 after:rounded-full"
          >
            BORROWED ITEMS
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-gray-600 dark:text-gray-400 mt-4 text-lg"
          >
            Track and manage your borrowed equipment
          </p>
        </div>

        {loading || actionLoading ? (
          <p>Loading...</p>
        ) : (
          <DataTable
            columns={columns}
            data={borrowedItems}
            pagination
            highlightOnHover
            className="bg-white"
          />
        )}

        {deleteLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg flex items-center space-x-4">
              <svg
                className="animate-spin h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
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
              <span className="text-lg font-medium">Deleting...</span>
            </div>
          </div>
        )}

        {equipmentModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold dark:text-white">
                  Equipment Details
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
                  onClick={closeEquipmentModal}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {equipmentDetails ? (
                <DataTable
                  columns={equipmentDetailsColumns}
                  data={equipmentDetails.items}
                  pagination
                  highlightOnHover
                  responsive
                  theme="default"
                  className="dark:bg-gray-800"
                />
              ) : (
                <p className="dark:text-white">No details available.</p>
              )}
            </div>
          </div>
        )}

        {imageModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[60]">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full">
              <img src={imageUrl} alt="Equipment" className="w-full h-auto" />
              <button
                className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={closeImageModal}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {confirmCancelDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Confirm Cancellation</h2>
              <p>
                Are you sure you want to cancel this item? This action cannot be
                undone.
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                  onClick={closeConfirmCancelDialog}
                >
                  No
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  onClick={confirmCancel}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmTransactionCancelDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">
                Confirm Transaction Cancellation
              </h2>
              <p>
                Are you sure you want to cancel this transaction? This action
                cannot be undone.
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                  onClick={closeConfirmTransactionCancelDialog}
                >
                  No
                </button>
                <button
                  className="bg-primary text-white font-bold py-2 px-4 rounded"
                  onClick={confirmTransactionCancel}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {borrowerSlipModalOpen && selectedTransaction && (
          <StudentBorrowerSlipPreview
            borrowedItems={selectedTransaction}
            onClose={closeBorrowerSlipPreview}
            userDetails={selectedTransaction.user}
          />
        )}

        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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
                  Transaction Successfully Cancelled!
                </h2>

                {/* Button */}
                <button
                  className="bg-primary text-white font-semibold py-2 px-6 rounded-lg 
                  transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 
                  focus:ring-primary focus:ring-opacity-50"
                  onClick={() => setShowSuccessModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Borrow;
