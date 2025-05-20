import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import EquipmentDetails from "../components/Borrowed/EquipmentDetails";
import { toast } from "react-hot-toast";
import ConfirmReturn from "../components/Borrowed/ConfirmReturn";
import ApprovedModal from "../components/modal/approvedModal";
import Form from "../components/Form";
import Swal from "sweetalert2";

const Borrowed = () => {
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [equipmentDetails, setEquipmentDetails] = useState(null);
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showApprovedModal, setShowApprovedModal] = useState(false);
  const [confirmReturnDialogOpen, setConfirmReturnDialogOpen] = useState(false);
  const [transactionToReturn, setTransactionToReturn] = useState(null);
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

      // Filter only approved and returned items
      const filteredData = dataWithId.filter((item) => {
        return item.status === "Approved" || item.status === "Returned";
      });

      // Sort by createdAt in descending order (newest first)
      const sortedData = filteredData.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setBorrowedItems(sortedData);
    } catch (error) {
      console.error("Failed to fetch all borrowed items:", error);
      toast.error("Failed to load borrowed items");
    }
  };

  useEffect(() => {
    fetchAllBorrowedItems();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleReturnTransaction = async (itemId) => {
    try {
      const result = await Swal.fire({
        title: "Confirm Return",
        text: "Are you sure you want to mark this transaction as returned?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, mark as returned",
      });

      if (result.isConfirmed) {
        const response = await axios.patch(
          `http://localhost:8000/api/borrow-items/${itemId}/return`,
          { status: "Returned" },
          { withCredentials: true }
        );

        if (response.status === 200) {
          Swal.fire({
            title: "Success!",
            text: "Transaction marked as returned successfully",
            icon: "success",
          });
          await fetchAllBorrowedItems();
        }
      }
    } catch (error) {
      console.error("Error returning transaction:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to mark transaction as returned",
        icon: "error",
      });
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

  const closeEquipmentModal = () => {
    setEquipmentDetails(null);
    setEquipmentModalOpen(false);
  };

  // Filtered data based on search query with null checks
  const filteredItems = borrowedItems.filter((item) => {
    if (!item || !item.user) return false;

    const searchLower = searchQuery.toLowerCase();
    const userName = item.user.name || "";
    const userEmail = item.user.email || "";
    const itemName = item.equipment?.[0]?.equipment?.name || "";

    return (
      userName.toLowerCase().includes(searchLower) ||
      userEmail.toLowerCase().includes(searchLower) ||
      itemName.toLowerCase().includes(searchLower)
    );
  });

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
    {
      name: "User",
      selector: (row) => row.user?.displayName || row.user?.name || "N/A",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.user?.email || "N/A",
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
            className="px-3 py-1 bg-primary text-white text-sm rounded-lg"
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
    <div className="p-8">
      <div className="max-w-full mx-auto">
        <div className="mb-8">
          <h1
            className="text-4xl font-bold text-black dark:text-white relative inline-block
            after:content-[''] after:block after:w-1/2 after:h-1 after:bg-primary
            after:mt-2 after:rounded-full"
          >
            Borrowed Equipment
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
        </div>
      </div>

      {showApprovedModal && <ApprovedModal />}
      <EquipmentDetails
        isOpen={equipmentModalOpen}
        onClose={closeEquipmentModal}
        equipmentDetails={equipmentDetails}
        setEquipmentDetails={setEquipmentDetails}
        setBorrowedItems={setBorrowedItems}
        toast={toast}
        fetchAllBorrowedItems={fetchAllBorrowedItems}
      />
      <ConfirmReturn
        isOpen={confirmReturnDialogOpen}
        onClose={() => setConfirmReturnDialogOpen(false)}
        onConfirm={() => {}}
      />
      {isFormOpen && (
        <Form
          userDetails={selectedUserDetails}
          s
          borrowedItems={selectedBorrowedItems}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedUserDetails(null);
            setSelectedBorrowedItems(null);
          }}
        />
      )}
    </div>
  );
};

export default Borrowed;
