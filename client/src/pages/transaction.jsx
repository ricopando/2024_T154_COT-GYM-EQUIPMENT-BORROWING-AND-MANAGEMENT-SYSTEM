import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar/AdminNavbar";
import Sidebar from "../components/Sidebar/Sidebar";
import LoadingModal from "../components/modal/loadingModal";
import DeleteModal from "../components/modal/deleteModal";
import EquipmentDetails from "../components/Transaction/EquipmentDetails";
import ConfirmDeclineDialog from "../components/Transaction/ConfirmDeclineDialog";
import ConfirmApproved from "../components/Transaction/ConfirmApproved";
import ApprovedModal from "../components/modal/approvedModal";

const Transaction = () => {
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [equipmentDetails, setEquipmentDetails] = useState(null);
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [declineTransactionId, setDeclineTransactionId] = useState(null);
  const [confirmDeclineDialogOpen, setConfirmDeclineDialogOpen] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [confirmApprovedDialogOpen, setConfirmApprovedDialogOpen] =
    useState(false);
  const [transactionToApprove, setTransactionToApprove] = useState(null);
  const [approveLoading, setApproveLoading] = useState(false);

  // Define fetchAllBorrowedItems outside of useEffect
  const fetchAllBorrowedItems = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/borrow-items",
        {
          withCredentials: true,
        }
      );
      console.log("Fetched data:", response.data);
      const dataWithId = response.data.map((item, index) => ({
        ...item,
        id: index + 1,
      }));

      // Filter transactions to only include those with a status of "Pending"
      const filteredData = dataWithId.filter((item) => {
        if (item.status !== "Pending") {
          return false; // Exclude non-pending transactions
        }
        if (!item.equipment || item.equipment.length === 0) {
          if (item._id) {
            // Ensure item._id is defined
            handleDeleteTransaction(item._id); // Automatically delete transaction
          }
          return false; // Exclude from the list
        }
        return true;
      });

      setBorrowedItems(filteredData); // Update state with filtered data
    } catch (error) {
      console.error("Failed to fetch all borrowed items:", error);
      toast.error("Failed to load borrowed items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBorrowedItems();
  }, []);

  const columns = [
    {
      name: "Transaction ID",
      selector: (row) => row.item,
      sortable: true,
      width: "200px",
    },
    {
      name: "User",
      selector: (row) => row.user.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.user.email,
      sortable: true,
      width: "200px",
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
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Equipment Info",
      cell: (row) => (
        <button
          className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
          onClick={() => openEquipmentModal(row.equipment, row.item)}
          aria-label={`View equipment details for transaction ${row.item}`}
        >
          View
        </button>
      ),
      ignoreRowClick: true,
    },
    {
      name: "Actions",
      cell: (row) => {
        console.log("Row data:", row);
        return (
          <div className="flex justify-center">
            <button
              onClick={() => handleApproveTransaction(row.item)}
              className="bg-primary text-white py-1 px-1 rounded hover:bg-primary-dark mr-2"
            >
              Approve
            </button>
            <button
              onClick={() => handleDeclineTransaction(row.item)}
              className="bg-gray-500 text-white py-1 px-1 rounded hover:bg-gray-600"
            >
              Decline
            </button>
          </div>
        );
      },
      ignoreRowClick: true,
    },
  ];

  // Helper Functions
  const handleDeleteTransaction = async (itemId) => {
    if (!itemId) {
      console.error("Invalid itemId:", itemId);
      toast.error("Invalid transaction ID.");
      return;
    }

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
        await fetchAllBorrowedItems(); // Re-fetch to ensure UI is up-to-date
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

  const handleApproveTransaction = (itemId) => {
    setTransactionToApprove(itemId);
    setConfirmApprovedDialogOpen(true);
  };

  const confirmApprovedTransaction = async () => {
    if (!transactionToApprove) return;
    setConfirmApprovedDialogOpen(false);
    setApproveLoading(true); // Start loading
    setShowApprovedModal(true); // Ensure modal is shown
    try {
      // Update the transaction status to 'Approved'
      const response = await axios.patch(
        `http://localhost:8000/api/borrow-items/${transactionToApprove}`,
        {
          status: "Approved",
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        // Update the status of each equipment item in the transaction to 'Approved'
        const updatedItems = response.data.items.map((item) => ({
          ...item,
          status: "Approved",
        }));

        // Update the state with the new status for each equipment item
        setBorrowedItems((prevItems) =>
          prevItems.map((item) =>
            item._id === transactionToApprove
              ? { ...item, status: "Approved", equipment: updatedItems }
              : item
          )
        );
        toast.success("Transaction approved successfully.");

        // Fetch all borrowed items to refresh the table
        await fetchAllBorrowedItems();
      } else {
        toast.error("Failed to approve transaction.");
      }
    } catch (error) {
      console.error("Failed to approve transaction:", error);
      toast.error("Failed to approve transaction.");
    } finally {
      setTransactionToApprove(null);
      setConfirmApprovedDialogOpen(false);
      setApproveLoading(false); // End loading
      setShowApprovedModal(false); // Ensure modal is hidden
    }
  };

  const handleDeclineTransaction = (itemId) => {
    if (!itemId) {
      console.error("Invalid itemId:", itemId);
      toast.error("Invalid transaction ID.");
      return;
    }
    setDeclineTransactionId(itemId);
    setConfirmDeclineDialogOpen(true);
  };

  const confirmDeclineTransaction = async () => {
    if (declineTransactionId) {
      setConfirmDeclineDialogOpen(false);
      setDeleteLoading(true);
      setShowDeleteModal(true);
      try {
        await handleDeleteTransaction(declineTransactionId);
        await fetchAllBorrowedItems(); // Ensure this is called to refresh data
        setDeclineTransactionId(null);
      } catch (error) {
        console.error("Failed to decline transaction:", error);
        toast.error("Failed to decline transaction.");
      } finally {
        setDeleteLoading(false);
        setShowDeleteModal(false);
      }
    }
  };

  const closeConfirmDeclineDialog = () => {
    setDeclineTransactionId(null);
    setConfirmDeclineDialogOpen(false);
  };

  const openEquipmentModal = async (equipment, transactionId) => {
    if (!equipment || equipment.length === 0) {
      setEquipmentModalOpen(false);
      await handleDeleteTransaction(transactionId); // Await the deletion
      return;
    }
    const equipmentWithTransactionId = equipment.map((equip) => ({
      ...equip,
      transactionId,
    }));
    setEquipmentDetails(equipmentWithTransactionId);
    setEquipmentModalOpen(true);
  };

  // Ensure useEffect is correctly set up to update equipment details
  useEffect(() => {
    if (equipmentModalOpen) {
      const currentTransaction = borrowedItems.find(
        (item) => item.id === equipmentDetails[0]?.transactionId
      );
      if (currentTransaction) {
        setEquipmentDetails(currentTransaction.equipment);
      }
    }
  }, [borrowedItems, equipmentModalOpen, equipmentDetails]);

  const closeEquipmentModal = () => {
    setEquipmentDetails(null);
    setEquipmentModalOpen(false);
  };

  // Filtered data based on search query
  const filteredItems = borrowedItems.filter(
    (item) =>
      item.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const updateEquipmentStatus = (borrowedItemId, itemId, newStatus) => {
    setBorrowedItems((prevItems) =>
      prevItems.map((item) =>
        item._id === borrowedItemId
          ? {
              ...item,
              equipment: item.equipment.map((equip) =>
                equip.id === itemId ? { ...equip, status: newStatus } : equip
              ),
            }
          : item
      )
    );

    // Check if all equipment items are approved
    checkAndApproveTransaction(borrowedItemId);
  };

  const checkAndApproveTransaction = (borrowedItemId) => {
    const transaction = borrowedItems.find(
      (item) => item._id === borrowedItemId
    );
    if (
      transaction &&
      transaction.equipment.every((equip) => equip.status === "Approved")
    ) {
      handleApproveTransaction(borrowedItemId);
    }
  };

  const closeConfirmApprovedDialog = () => {
    setTransactionToApprove(null);
    setConfirmApprovedDialogOpen(false);
  };

  // Main Component Return
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-full mx-auto">
            <div className="mb-8">
              <h1
                className="text-5xl font-bold text-black dark:text-white relative inline-block
                after:content-[''] after:block after:w-1/2 after:h-1 after:bg-primary
                after:mt-2 after:rounded-full"
              >
                TRANSACTION
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
                Manage and track all pending transactions in your account
              </p>
            </div>

            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-end space-x-4">
                  <div className="w-1/8">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search "
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="absolute left-3 top-2.5 text-gray-400">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="loader"></div>
                </div>
              ) : (
                <DataTable
                  columns={columns}
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
                        padding: "12px 16px",
                      },
                    },
                    cells: {
                      style: {
                        fontSize: "0.875rem",
                        color: "#1F2937",
                        padding: "12px 16px",
                      },
                    },
                  }}
                />
              )}
            </div>
          </div>

          {/* Keep existing modals */}
          {loading && <LoadingModal />}
          {deleteLoading && showDeleteModal && <DeleteModal />}
          {approveLoading && showApprovedModal && <ApprovedModal />}

          <EquipmentDetails
            isOpen={equipmentModalOpen}
            onClose={closeEquipmentModal}
            equipmentDetails={equipmentDetails}
            setEquipmentDetails={setEquipmentDetails}
            setBorrowedItems={setBorrowedItems}
            setDeleteLoading={setDeleteLoading}
            setShowDeleteModal={setShowDeleteModal}
            toast={toast}
            fetchAllBorrowedItems={fetchAllBorrowedItems}
            updateEquipmentStatus={updateEquipmentStatus}
          />
          <ConfirmDeclineDialog
            isOpen={confirmDeclineDialogOpen}
            onClose={closeConfirmDeclineDialog}
            onConfirm={confirmDeclineTransaction}
          />
          <ConfirmApproved
            isOpen={confirmApprovedDialogOpen}
            onClose={closeConfirmApprovedDialog}
            onConfirm={confirmApprovedTransaction}
          />
        </div>
      </div>

      <style jsx>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Transaction;
