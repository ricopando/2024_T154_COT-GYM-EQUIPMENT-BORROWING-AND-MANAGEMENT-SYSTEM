import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from 'react-data-table-component';
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar/Navbar";

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
  const [confirmTransactionCancelDialogOpen, setConfirmTransactionCancelDialogOpen] = useState(false);
  const [transactionToCancel, setTransactionToCancel] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchBorrowedItemsByUser = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/borrow-items/user/actual-user-id", {
          withCredentials: true,
        });
        if (isMounted) {
          const filteredItems = response.data.filter(item => item.items && item.items.length > 0);
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
    if (!deleteLoading && equipmentDetails && equipmentDetails.items.length === 0) {
      closeEquipmentModal();
    }
  }, [deleteLoading, equipmentDetails]);

  const handleDeleteTransaction = async (itemId) => {
    setDeleteLoading(true);
    try {
      const response = await axios.delete(`http://localhost:8000/api/borrow-items/${itemId}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setBorrowedItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
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
      const response = await axios.delete(`http://localhost:8000/api/borrow-items/${borrowedItemId}/item/${itemId}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setBorrowedItems((prevItems) =>
          prevItems.map((item) => {
            if (item._id === borrowedItemId) {
              const updatedItems = item.items.filter((equipmentItem) => equipmentItem._id !== itemId);
              if (updatedItems.length === 0) {
                handleDeleteTransaction(borrowedItemId);
                return null;
              }
              return { ...item, items: updatedItems };
            }
            return item;
          }).filter(Boolean)
        );

        if (equipmentDetails && equipmentDetails._id === borrowedItemId) {
          const updatedEquipmentItems = equipmentDetails.items.filter((equipmentItem) => equipmentItem._id !== itemId);
          setEquipmentDetails({ ...equipmentDetails, items: updatedEquipmentItems });
        }

        setEquipmentItems((prevItems) =>
          prevItems.map((equipmentItem) =>
            equipmentItem._id === itemId ? { ...equipmentItem, availabilityStatus: 'Available' } : equipmentItem
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
        await handleDeleteItemFromArray(itemToCancel.borrowedItemId, itemToCancel.itemId);
        setItemToCancel(null);
        setConfirmCancelDialogOpen(false);
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

  const columns = [
    {
      name: "Transaction ID",
      selector: row => row._id,
      sortable: true,
    },
    {
      name: "Transaction Date",
      selector: row => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Transaction Time",
      selector: row => new Date(row.createdAt).toLocaleTimeString(),
      sortable: true,
    },
    {
      name: "Equipment",
      cell: row => (
        <button
          className="text-blue-500 hover:underline"
          onClick={() => openEquipmentModal(row)}
        >
          See Equipment
        </button>
      ),
    },
    {
      name: "Status",
      selector: row => row.status,
      sortable: true,
    },
    {
      name: "Action",
      cell: row => (
        <button
          className="text-red-500 hover:underline"
          onClick={() => handleCancelTransaction(row._id)}
        >
          Cancel Transaction
        </button>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      <Navbar />
      <div className="container mx-auto px-4">
        <div className="text-left mt-5 mb-12">
          <h1 data-aos="fade-up" className="text-5xl font-extrabold tracking-tight">Borrow</h1>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg max-w-3xl w-full">
              <h2 className="text-xl font-bold mb-4">Equipment Details</h2>
              {equipmentDetails ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b">Name</th>
                        <th className="py-2 px-4 border-b">Serial No</th>
                        <th className="py-2 px-4 border-b">Model</th>
                        <th className="py-2 px-4 border-b">Category</th>
                        <th className="py-2 px-4 border-b">Image</th>
                        <th className="py-2 px-4 border-b">Borrow Date</th>
                        <th className="py-2 px-4 border-b">Return Date</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equipmentDetails.items.map((equipmentItem) => (
                        <tr key={equipmentItem._id}>
                          <td className="py-2 px-4 border-b">{equipmentItem.equipment.name}</td>
                          <td className="py-2 px-4 border-b">{equipmentItem.equipment.serialNumber}</td>
                          <td className="py-2 px-4 border-b">{equipmentItem.equipment.model}</td>
                          <td className="py-2 px-4 border-b">{equipmentItem.equipment.category}</td>
                          <td className="py-2 px-4 border-b">
                            <button
                              className="text-blue-500 hover:underline"
                              onClick={() => openImageModal(equipmentItem.equipment.image)}
                            >
                              View Image
                            </button>
                          </td>
                          <td className="py-2 px-4 border-b">
                            {new Date(equipmentItem.borrowDate).toLocaleString()}
                          </td>
                          <td className="py-2 px-4 border-b">{new Date(equipmentItem.returnDate).toLocaleDateString()}</td>
                          <td className="py-2 px-4 border-b">{equipmentItem.status}</td>
                          <td className="py-2 px-4 border-b">
                            <button
                              className="text-red-500 hover:underline"
                              onClick={() => handleCancel(equipmentDetails._id, equipmentItem._id)}
                            >
                              Cancel Item
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No details available.</p>
              )}
              <button
                className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={closeEquipmentModal}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {imageModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
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
              <p>Are you sure you want to cancel this item? This action cannot be undone.</p>
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
              <h2 className="text-xl font-bold mb-4">Confirm Transaction Cancellation</h2>
              <p>Are you sure you want to cancel this transaction? This action cannot be undone.</p>
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                  onClick={closeConfirmTransactionCancelDialog}
                >
                  No
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  onClick={confirmTransactionCancel}
                >
                  Yes
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
