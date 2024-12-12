import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/AdminNavbar';
import LoadingModal from '../components/modal/loadingModal';
import DataTable from 'react-data-table-component';
import EquipmentDetails from '../components/Borrowed/EquipmentDetails';
import { toast } from 'react-hot-toast';
import ConfirmReturn from '../components/Borrowed/ConfirmReturn';
import ApprovedModal from '../components/modal/approvedModal';
import Form from '../components/Form';



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

  const fetchAllBorrowedItems = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/borrow-items", {
        withCredentials: true,
      });
      console.log("Fetched data:", response.data);
      const dataWithId = response.data.map((item, index) => ({
        ...item,
        id: index + 1,
      }));

      const filteredData = dataWithId.filter(item => {
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
        console.log("No transaction to return.");
        return;
    }
    console.log(`Confirming return for transaction ID: ${transactionToReturn}`);
    setConfirmReturnDialogOpen(false);
    setApproveLoading(true);
    setShowApprovedModal(true);
    try {
        const response = await axios.patch(`http://localhost:8000/api/borrow-items/${transactionToReturn}`, {
            status: 'Returned'
        }, {
            withCredentials: true,
        });

        if (response.status === 200) {
            console.log("Transaction returned successfully.");
            toast.success("Transaction returned successfully.");
            await fetchAllBorrowedItems();
        } else {
            console.log("Failed to return transaction.");
            toast.error("Failed to return transaction.");
        }
    } catch (error) {
        console.error("Failed to return transaction:", error);
        toast.error("Failed to return transaction.");
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
    const equipmentWithTransactionId = equipment.map(equip => ({
      ...equip,
      transactionId
    }));
    setEquipmentDetails(equipmentWithTransactionId);
    setEquipmentModalOpen(true);
  };

  // Ensure useEffect is correctly set up to update equipment details
  useEffect(() => {
    if (equipmentModalOpen) {
      const currentTransaction = borrowedItems.find(item => item.id === equipmentDetails[0]?.transactionId);
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
  const filteredItems = borrowedItems.filter(item =>
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
    const transaction = borrowedItems.find(item => item._id === borrowedItemId);
    if (transaction && transaction.equipment.every(equip => equip.status === 'Returned')) {
      try {
        const response = await axios.patch(`http://localhost:8000/api/borrow-items/${borrowedItemId}`, {
          status: 'Returned'
        }, {
          withCredentials: true,
        });

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

  const handleFormOpen = (userDetails) => {
    setSelectedUserDetails(userDetails);
    setIsFormOpen(true);
  };

  const columns = [
    { name: 'Transaction ID', selector: row => row.item, sortable: true },
    { name: 'User', selector: row => row.user.name, sortable: true },
    { name: 'Email', selector: row => row.user.email, sortable: true },
    { name: 'Transaction Date', selector: row => new Date(row.createdAt).toLocaleDateString(), sortable: true },
    { name: 'Transaction Time', selector: row => new Date(row.createdAt).toLocaleTimeString(), sortable: true },
    { name: 'Status', selector: row => row.status, sortable: true },
    {
      name: 'Equipment Info',
      cell: row => (
        <button
          className="text-blue-500 hover:underline"
          onClick={() => openEquipmentModal(row.equipment, row.item)}
          aria-label={`View equipment details for transaction ${row.item}`}
        >
          View
        </button>
      ),
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => handleReturnTransaction(row.item)}
            className="bg-primary text-white py-1 px-2 rounded hover:bg-gray-500"
          >
            Return
          </button>
        </div>
      ),
    },
    {
      name: 'Form',
      cell: row => (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => handleFormOpen(row.user)}
            className="bg-primary text-white py-1 px-2 rounded hover:bg-gray-500"
          >
            Form
          </button>
        </div>
      ),
    },
    
  ];

  return (
    <div className="flex h-screen">
      <Sidebar className="fixed h-full" />
      <div className="flex-1 flex flex-col ">
        <Navbar />
        <div className="flex-1 flex flex-col p-4 overflow-y-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Borrowed</h1>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="mb-4 p-2 border border-gray-300 rounded w-1/4"
          />
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <DataTable
                columns={columns}
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
                      padding: '10px',
                      color: 'black',
                    },
                  },
                }}
              />
            </div>
          )}
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
          {isFormOpen && <Form userDetails={selectedUserDetails} />}
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
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`}</style>

export default Borrowed;

