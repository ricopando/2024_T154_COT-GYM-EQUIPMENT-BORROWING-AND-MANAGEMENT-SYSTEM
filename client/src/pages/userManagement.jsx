import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/AdminNavbar";
import DataTable from "react-data-table-component";
import { FaUserPlus } from "react-icons/fa";
import AddAdmin from "../components/AddAdmin";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [imageModal, setImageModal] = useState({
    isOpen: false,
    imageUrl: "",
  });
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [removeAdminModal, setRemoveAdminModal] = useState({
    isOpen: false,
    userId: null,
  });

  useEffect(() => {
    console.log("Filtering users with search query:", searchQuery);
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log("Filtered results:", filtered);
    setFilteredData(filtered);
  }, [users, searchQuery]);

  const fetchUsers = async () => {
    console.log("Fetching users...");
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(
        "http://localhost:8000/api/auth/admins",
        {
          withCredentials: true,
        }
      );
      console.log("API Response:", response.data);
      const filteredUsers = response.data.filter(
        (user) => user.role === "Admin"
      );
      console.log("Filtered admin users:", filteredUsers);
      setUsers(filteredUsers);
      setFilteredData(filteredUsers);
    } catch (err) {
      console.error("Error details:", {
        message: err.message,
        response: err.response,
        stack: err.stack,
      });
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    console.log("Search query changed:", e.target.value);
    setSearchQuery(e.target.value);
  };

  const handleAccessToggle = async (userId, accessType, currentAccess) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/auth/users/${userId}/toggle-access`,
        {
          accessType,
          accessValue: !currentAccess,
        },
        {
          withCredentials: true,
        }
      );

      console.log(response.data.message);
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error(`Error toggling ${accessType} access:`, error);
      setError(
        error.response?.data?.message || `Failed to toggle ${accessType} access`
      );
    }
  };

  const handleRemoveAdmin = async (userId) => {
    setRemoveAdminModal({ isOpen: true, userId });
  };

  const confirmRemoveAdmin = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/auth/users/${removeAdminModal.userId}/remove-admin`,
        {},
        { withCredentials: true }
      );
      console.log(response.data.message);
      fetchUsers(); // Refresh the user list
      setRemoveAdminModal({ isOpen: false, userId: null }); // Close modal
    } catch (error) {
      console.error("Error removing admin:", error);
      setError(error.response?.data?.message || "Failed to remove admin");
    }
  };

  // Define columns for the DataTable
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Image",
      selector: (row) => row.image,
      sortable: true,
      cell: (row) => (
        <div className="py-2">
          {row.image ? (
            <img
              src={row.image}
              alt={`${row.name}'s profile`}
              className="h-10 w-10 rounded-full object-cover"
              onError={(e) => {
                e.target.src = "/default-avatar.png"; // Fallback image
                e.target.onerror = null; // Prevent infinite loop
              }}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">
                {row.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      name: "Inventory Access",
      selector: (row) => row.inventory,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center justify-center py-2">
          <input
            type="checkbox"
            checked={!row.inventory}
            onChange={() =>
              handleAccessToggle(row._id, "inventory", row.inventory)
            }
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            aria-label={`Toggle inventory access for ${row.name}`}
          />
          <span className="ml-2 text-sm text-gray-500">
            {row.inventory ? "Allowed" : "Blocked"}
          </span>
        </div>
      ),
    },
    {
      name: "Transaction Access",
      selector: (row) => row.transaction,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center justify-center py-2">
          <input
            type="checkbox"
            checked={!row.transaction}
            onChange={() =>
              handleAccessToggle(row._id, "transaction", row.transaction)
            }
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            aria-label={`Toggle transaction access for ${row.name}`}
          />
          <span className="ml-2 text-sm text-gray-500">
            {row.transaction ? "Allowed" : "Blocked"}
          </span>
        </div>
      ),
    },
    {
      name: "Borrowed Access",
      selector: (row) => row.borrowed,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center justify-center py-2">
          <input
            type="checkbox"
            checked={!row.borrowed}
            onChange={() =>
              handleAccessToggle(row._id, "borrowed", row.borrowed)
            }
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            aria-label={`Toggle borrowed access for ${row.name}`}
          />
          <span className="ml-2 text-sm text-gray-500">
            {row.borrowed ? "Allowed" : "Blocked"}
          </span>
        </div>
      ),
    },
    {
      name: "Report Access",
      selector: (row) => row.report,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center justify-center py-2">
          <input
            type="checkbox"
            checked={!row.report}
            onChange={() => handleAccessToggle(row._id, "report", row.report)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            aria-label={`Toggle report access for ${row.name}`}
          />
          <span className="ml-2 text-sm text-gray-500">
            {row.report ? "Allowed" : "Blocked"}
          </span>
        </div>
      ),
    },
    {
      name: "User Management Access",
      selector: (row) => row.userManagement,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center justify-center py-2">
          <input
            type="checkbox"
            checked={!row.userManagement}
            onChange={() =>
              handleAccessToggle(row._id, "userManagement", row.userManagement)
            }
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            aria-label={`Toggle report access for ${row.name}`}
          />
          <span className="ml-2 text-sm text-gray-500">
            {row.userManagement ? "Allowed" : "Blocked"}
          </span>
        </div>
      ),
    },
    {
      name: "Add Transaction Access",
      selector: (row) => row.addTransaction,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center justify-center py-2">
          <input
            type="checkbox"
            checked={!row.addTransaction}
            onChange={() =>
              handleAccessToggle(row._id, "addTransaction", row.addTransaction)
            }
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            aria-label={`Toggle report access for ${row.name}`}
          />
          <span className="ml-2 text-sm text-gray-500">
            {row.addTransaction ? "Allowed" : "Blocked"}
          </span>
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex items-center justify-center py-2">
          <button
            onClick={() => handleRemoveAdmin(row._id)}
            className="text-base text-white bg-primary rounded-md focus:outline-none"
            style={{ width: "5rem", height: "2rem", fontSize: ".8rem" }}
            aria-label={`Remove admin status for ${row.name}`}
          >
            Remove
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const RemoveAdminModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
        <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Remove Admin
          </h3>
          <p className="text-gray-500 mb-6">
            Are you sure you want to remove this admin? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md "
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-full mx-auto">
            <div className="text-left mt-8 mb-10">
              <h1
                className="text-5xl font-bold text-black dark:text-white relative inline-block
                after:content-[''] after:block after:w-1/2 after:h-1 after:bg-primary
                after:mt-2 after:rounded-full"
              >
                USER MANAGEMENT
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
                Manage and track all users in the system
              </p>
            </div>

            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between space-x-4">
                  <div className="w-1/4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search Users"
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
                  <button
                    onClick={() => setShowAddAdminModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-primary"
                    aria-label="Add new admin"
                    tabIndex={0}
                  >
                    <FaUserPlus className="w-4 h-4" />
                    <span>Add Admin</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="loader"></div>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={filteredData}
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

          {/* Image Modal */}
          {imageModal.isOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
              <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-xs md:max-w-md">
                <img
                  src={imageModal.imageUrl}
                  alt="User"
                  className="w-full h-auto object-contain rounded"
                />
                <button
                  onClick={() => setImageModal({ isOpen: false, imageUrl: "" })}
                  className="absolute top-0 right-0 mt-2 mr-2 text-red-600 hover:text-red-800"
                  aria-label="Close image modal"
                >
                  &times;
                </button>
              </div>
            </div>
          )}

          <AddAdmin
            isOpen={showAddAdminModal}
            onClose={() => setShowAddAdminModal(false)}
            onAdminAdded={fetchUsers}
          />

          <RemoveAdminModal
            isOpen={removeAdminModal.isOpen}
            onClose={() => setRemoveAdminModal({ isOpen: false, userId: null })}
            onConfirm={confirmRemoveAdmin}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
