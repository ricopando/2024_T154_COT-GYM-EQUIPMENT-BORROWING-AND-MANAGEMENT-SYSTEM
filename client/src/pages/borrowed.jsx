import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/AdminNavbar";
import LoadingModal from "../components/modal/loadingModal";
import DataTable from "react-data-table-component";
import EquipmentDetails from "../components/Borrowed/EquipmentDetails";
import { toast } from "react-hot-toast";
import ConfirmReturn from "../components/Borrowed/ConfirmReturn";
import ApprovedModal from "../components/modal/approvedModal";
import Form from "../components/Form";

const Borrowed = () => {
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [equipmentDetails, setEquipmentDetails] = useState(null);
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [confirmReturnDialogOpen, setConfirmReturnDialogOpen] = useState(false);
  const [transactionToReturn, setTransactionToReturn] = useState(null);
  const [approveLoading, setApproveLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [selectedBorrowedItems, setSelectedBorrowedItems] = useState(null);

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

      const filteredData = dataWithId.filter((item) => {
        if (item.status !== "Approved" && item.status !== "Returned") {
          return false;
        }
        if (!item.equipment || item.equipment.length === 0) {
          if (item._id) {
          }
          return false;
        }
        return true;
      });

      setBorrowedItems(filteredData);
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleReturnTransaction = (itemId) => {
    console.log(`Return button clicked for transaction ID: ${itemId}`);
    setTransactionToReturn(itemId);
    setConfirmReturnDialogOpen(true);
    console.log(`Transaction to return set to: ${transactionToReturn}`);
    console.log(`Confirm return dialog open: ${confirmReturnDialogOpen}`);
  };

  const confirmReturnTransaction = async () => {
    if (!transactionToReturn) {
      toast.error("No transaction selected for return");
      return;
    }

    try {
      setConfirmReturnDialogOpen(false);
      setApproveLoading(true);
      setShowApprovedModal(true);

      const response = await axios.patch(
        `http://localhost:8000/api/borrow-items/${transactionToReturn}/return`,
        { status: "Returned" },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Items returned successfully");
        await fetchAllBorrowedItems();
      }
    } catch (error) {
      console.error("Return transaction failed:", error);
      toast.error(error.response?.data?.message || "Failed to return items");
    } finally {
      setTransactionToReturn(null);
      setConfirmReturnDialogOpen(false);
      setApproveLoading(false);
      setShowApprovedModal(false);
    }
  };

  const openEquipmentModal = async (equipment, transactionId) => {
    if (!equipment || equipment.length === 0) {
      setEquipmentModalOpen(false);
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
    checkAndReturnTransaction(borrowedItemId);
  };

  const checkAndReturnTransaction = async (borrowedItemId) => {
    const transaction = borrowedItems.find(
      (item) => item._id === borrowedItemId
    );
    if (
      transaction &&
      transaction.equipment.every((equip) => equip.status === "Returned")
    ) {
      try {
        const response = await axios.patch(
          `http://localhost:8000/api/borrow-items/${borrowedItemId}`,
          {
            status: "Returned",
          },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          console.log("Transaction status updated to Returned.");
          toast.success("Transaction status updated to Returned.");
          await fetchAllBorrowedItems();
        } else {
          console.log("Failed to update transaction status.");
          toast.error("Failed to update transaction status.");
        }
      } catch (error) {
        console.error("Failed to update transaction status:", error);
        toast.error("Failed to update transaction status.");
      }
    }
  };

  const closeConfirmReturnDialog = () => {
    setTransactionToReturn(null);
    setConfirmReturnDialogOpen(false);
  };

  const handleFormOpen = (userDetails, borrowedItems) => {
    setSelectedUserDetails(userDetails);
    setSelectedBorrowedItems(borrowedItems);
    setIsFormOpen(true);
  };

  const columns = [
    {
      name: "Transaction ID",
      selector: (row) => row.item,
      sortable: true,
      style: {
        fontWeight: "bold",
      },
    },
    { name: "User", selector: (row) => row.user.name, sortable: true },
    { name: "Email", selector: (row) => row.user.email, sortable: true },
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
      cell: (row) => (
        <button
          className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
          onClick={() => openEquipmentModal(row.equipment, row.item)}
          aria-label={`View equipment details for transaction ${row.item}`}
        >
          View
        </button>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleReturnTransaction(row.item)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return
          </button>
        </div>
      ),
    },
    {
      name: "Form",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleFormOpen(row.user, row)}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
          >
            Form
          </button>
        </div>
      ),
    },
  ];

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
                BORROWED EQUIPMENT
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
                Manage and track all borrowed equipment transactions
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
                        onChange={handleSearchChange}
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

          {loading && <LoadingModal />}
          {approveLoading && showApprovedModal && <ApprovedModal />}
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
          <ConfirmReturn
            isOpen={confirmReturnDialogOpen}
            onClose={closeConfirmReturnDialog}
            onConfirm={confirmReturnTransaction}
          />
          {isFormOpen && (
            <Form
              userDetails={selectedUserDetails}
              borrowedItems={selectedBorrowedItems}
              onClose={() => {
                setIsFormOpen(false);
                setSelectedUserDetails(null);
                setSelectedBorrowedItems(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

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
`}</style>;

export default Borrowed;
