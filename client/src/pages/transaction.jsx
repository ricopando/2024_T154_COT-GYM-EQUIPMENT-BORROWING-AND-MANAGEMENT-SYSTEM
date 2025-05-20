import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { toast } from "react-hot-toast";
import DeleteModal from "../components/modal/deleteModal";
import EquipmentDetails from "../components/Transaction/EquipmentDetails";
import { FaCheck } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import Swal from "sweetalert2";

const Transaction = () => {
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [equipmentDetails, setEquipmentDetails] = useState(null);
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [declineTransactionId, setDeclineTransactionId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToApprove, setTransactionToApprove] = useState(null);

  const fetchAllBorrowedItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/borrow-items",
        {
          withCredentials: true,
        }
      );

      console.log("Fetched transactions:", response.data);

      // Filter only pending transactions and ensure proper data structure
      const pendingTransactions = response.data
        .filter((item) => item.status === "Pending")
        .map((item) => ({
          ...item,
          _id: item.item || item._id, // Use item as primary ID
          items: Array.isArray(item.equipment) ? item.equipment : [],
          user: item.user || { name: "N/A", email: "N/A" },
        }));

      console.log("Processed transactions:", pendingTransactions);
      setBorrowedItems(pendingTransactions);
    } catch (error) {
      console.error("Error fetching borrowed items:", error);
      toast.error("Failed to load transactions");
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
      selector: (row) => row._id || row.item,
      sortable: true,
      width: "200px",
    },
    {
      name: "User",
      selector: (row) => row.user?.name || "N/A",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.user?.email || "N/A",
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
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs ${
            row.status === "Approved"
              ? "bg-green-100 text-green-800"
              : row.status === "Returned"
              ? "bg-gray-100 text-gray-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Equipment Info",
      cell: (row) => {
        console.log("Row data:", row);
        const transactionId = row.item || row._id;
        const equipmentCount = Array.isArray(row.equipment)
          ? row.equipment.length
          : 0;

        return (
          <button
            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => {
              console.log("Clicked row:", row);
              if (!transactionId) {
                toast.error("Invalid transaction data");
                return;
              }
              openEquipmentModal(row.equipment || [], transactionId);
            }}
            aria-label={`View equipment details for transaction ${
              transactionId || "unknown"
            }`}
          >
            View Details ({equipmentCount})
          </button>
        );
      },
      ignoreRowClick: true,
    },
    {
      name: "Actions",
      cell: (row) => {
        if (row.status === "Pending") {
          return (
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => handleApproveTransaction(row._id || row.item)}
                className="text-white py-1 px-3 rounded hover:bg-primary-dark"
                style={{ backgroundColor: "#008000" }}
              >
                <FaCheck />
              </button>
              <button
                onClick={() => handleDeclineTransaction(row._id || row.item)}
                className="text-white py-1 px-3 rounded hover:bg-gray-600"
                style={{ backgroundColor: "#FF0000" }}
              >
                <MdCancel />
              </button>
            </div>
          );
        }
        return null;
      },
      ignoreRowClick: true,
    },
  ];

  // Filtered data based on search query with null checks
  const filteredItems = borrowedItems.filter((item) => {
    if (!searchQuery.trim()) return true;

    const search = searchQuery.toLowerCase();
    const userName = item.user?.name?.toLowerCase() || "";
    const userEmail = item.user?.email?.toLowerCase() || "";
    const transactionId = (item._id || item.item || "").toLowerCase();

    return (
      userName.includes(search) ||
      userEmail.includes(search) ||
      transactionId.includes(search)
    );
  });

  // Helper Functions
  const handleDeleteTransaction = async (itemId) => {
    if (!itemId) {
      console.error("Invalid itemId:", itemId);
      toast.error("Invalid transaction ID.");
      return;
    }

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
    }
  };

  const handleApproveTransaction = (itemId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to approve this transaction?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.patch(
            `http://localhost:8000/api/borrow-items/${itemId}`,
            {
              status: "Approved",
            },
            {
              withCredentials: true,
            }
          );

          if (response.status === 200) {
            const updatedItems = response.data.items.map((item) => ({
              ...item,
              status: "Approved",
            }));

            setBorrowedItems((prevItems) =>
              prevItems.map((item) =>
                item._id === itemId
                  ? { ...item, status: "Approved", equipment: updatedItems }
                  : item
              )
            );

            Swal.fire({
              title: "Approved!",
              text: "Transaction has been approved successfully.",
              icon: "success",
              confirmButtonColor: "#3085d6",
            });

            await fetchAllBorrowedItems();
          } else {
            Swal.fire({
              title: "Error!",
              text: "Failed to approve transaction.",
              icon: "error",
              confirmButtonColor: "#d33",
            });
          }
        } catch (error) {
          console.error("Failed to approve transaction:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to approve transaction.",
            icon: "error",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
  };

  const handleDeclineTransaction = (itemId) => {
    if (!itemId) {
      console.error("Invalid itemId:", itemId);
      toast.error("Invalid transaction ID.");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You want to decline this transaction?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, decline it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await handleDeleteTransaction(itemId);
          await fetchAllBorrowedItems();

          Swal.fire({
            title: "Declined!",
            text: "Transaction has been declined successfully.",
            icon: "success",
            confirmButtonColor: "#3085d6",
          });
        } catch (error) {
          console.error("Failed to decline transaction:", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to decline transaction.",
            icon: "error",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
  };

  const openEquipmentModal = async (equipment, transactionId) => {
    try {
      console.log("Opening modal for transaction ID:", transactionId);
      console.log("Equipment data:", equipment);

      if (!transactionId) {
        console.error("Transaction ID is undefined or null");
        toast.error("Invalid transaction ID");
        return;
      }

      // Find the transaction in the current state first
      const transaction = borrowedItems.find(
        (item) => item.item === transactionId || item._id === transactionId
      );

      if (transaction && transaction.equipment) {
        // If we have the equipment data in the current state, use it
        const equipmentWithDetails = transaction.equipment
          .map((item) => {
            // Ensure we have a valid item structure
            if (!item) return null;

            return {
              id: item._id || item.id,
              transactionId,
              status: item.status || "Pending",
              name: item.name || item.equipment?.name || "N/A",
              serialNumber:
                item.serialNumber || item.equipment?.serialNumber || "N/A",
              category: item.category || item.equipment?.category || "N/A",
              image: item.image || item.equipment?.image || null,
              borrowDate: item.borrowDate || new Date(),
              returnDate: item.returnDate || new Date(),
            };
          })
          .filter(Boolean); // Remove any null items

        console.log("Processed equipment data:", equipmentWithDetails);
        setEquipmentDetails(equipmentWithDetails);
        setEquipmentModalOpen(true);
      } else {
        // If not in current state, fetch from API
        const response = await axios.get(
          `http://localhost:8000/api/borrow-items/${transactionId}`,
          {
            withCredentials: true,
          }
        );

        if (!response.data || !response.data.equipment) {
          toast.error("No equipment details found");
          return;
        }

        const equipmentWithDetails = response.data.equipment
          .map((item) => {
            // Ensure we have a valid item structure
            if (!item) return null;

            return {
              id: item._id || item.id,
              transactionId,
              status: item.status || "Pending",
              name: item.name || item.equipment?.name || "N/A",
              serialNumber:
                item.serialNumber || item.equipment?.serialNumber || "N/A",
              category: item.category || item.equipment?.category || "N/A",
              image: item.image || item.equipment?.image || null,
              borrowDate: item.borrowDate || new Date(),
              returnDate: item.returnDate || new Date(),
            };
          })
          .filter(Boolean); // Remove any null items

        console.log("Processed equipment data from API:", equipmentWithDetails);
        setEquipmentDetails(equipmentWithDetails);
        setEquipmentModalOpen(true);
      }
    } catch (error) {
      console.error("Error details:", error);
      toast.error("Failed to load equipment details. Please try again.");
    }
  };

  const closeEquipmentModal = () => {
    setEquipmentDetails(null);
    setEquipmentModalOpen(false);
  };

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

  // Main Component Return
  return (
    <div className="p-8">
      <div className="max-w-full mx-auto">
        <div className="mb-8">
          <h1
            className="text-4xl font-bold text-black dark:text-white relative inline-block
            after:content-[''] after:block after:w-1/2 after:h-1 after:bg-primary
            after:mt-2 after:rounded-full"
          >
            Transaction
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
            Manage and track all pending transactions in your account
          </p>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {loading
                  ? "Loading transactions..."
                  : `${filteredItems.length} pending transaction${
                      filteredItems.length !== 1 ? "s" : ""
                    }`}
              </div>
              <div className="w-64">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
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
              <p className="text-gray-600">Loading transactions...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-4 text-lg text-gray-600">
                No pending transactions found
              </p>
              {searchQuery && (
                <p className="mt-2 text-sm text-gray-500">
                  Try adjusting your search query
                </p>
              )}
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredItems}
              pagination
              highlightOnHover
              pointerOnHover
              responsive
              progressPending={loading}
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
      {showDeleteModal && <DeleteModal />}

      <EquipmentDetails
        isOpen={equipmentModalOpen}
        onClose={closeEquipmentModal}
        equipmentDetails={equipmentDetails}
        setEquipmentDetails={setEquipmentDetails}
        setBorrowedItems={setBorrowedItems}
        toast={toast}
        fetchAllBorrowedItems={fetchAllBorrowedItems}
        updateEquipmentStatus={updateEquipmentStatus}
      />
    </div>
  );
};

export default Transaction;
