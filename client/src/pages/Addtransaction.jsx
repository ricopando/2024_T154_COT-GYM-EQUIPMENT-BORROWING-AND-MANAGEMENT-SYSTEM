import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/AdminNavbar";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";

const Addtransaction = () => {
  const [equipmentItems, setEquipmentItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [borrowedItems, setBorrowedItems] = useState([]);

  // Fetch equipment and users on component mount
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

    fetchEquipment();
    fetchUsers();
    fetchBorrowedItems();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/equipment");
      setEquipmentItems(response.data);
    } catch (error) {
      console.error("Failed to fetch equipment:", error);
      toast.error("Failed to fetch equipment");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/auth/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to fetch users");
    }
  };

  const handleAddItem = (item) => {
    if (!selectedUser) {
      toast.error("Please select a user first");
      return;
    }
    if (!item.borrowDate || !item.returnDate) {
      toast.error("Please select borrow and return dates");
      return;
    }

    // Check if item is already in the selected items
    if (selectedItems.some((selected) => selected.equipment._id === item._id)) {
      toast.error("This item is already in the list");
      return;
    }

    setSelectedItems((prev) => [
      ...prev,
      {
        equipment: {
          _id: item._id,
          name: item.name,
          // Include other item properties you want to display
        },
        borrowDate: item.borrowDate,
        returnDate: item.returnDate,
      },
    ]);

    // Optional: Show success message
    toast.success("Item added to selection");
  };

  const handleRemoveItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.filter((item) => item.equipment._id !== itemId)
    );
  };

  const handleSubmit = async () => {
    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }
    if (selectedItems.length === 0) {
      toast.error("Please add items to the list");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/borrow-items/user",
        {
          userId: selectedUser,
          items: selectedItems.map((item) => ({
            equipment: item.equipment._id,
            borrowDate: item.borrowDate,
            returnDate: item.returnDate,
            status: "Pending",
          })),
          status: "Pending",
        }
      );

      console.log("Success:", response.data);
      toast.success("Transaction created successfully");

      // Optional: Clear form after successful submission
      setSelectedItems([]);
      setSelectedUser("");
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      toast.error(
        `Failed to create transaction: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredEquipment = equipmentItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isDateDisabled = (date, itemId) => {
    const currentDate = date.getTime();
    console.log(`Checking date: ${currentDate} for itemId: ${itemId}`);

    return borrowedItems.some((borrowedItem) => {
      console.log("Borrowed Item:", borrowedItem);

      // Check if borrowedItem has an equipment array
      if (Array.isArray(borrowedItem.equipment)) {
        return borrowedItem.equipment.some((equipmentItem) => {
          console.log("Equipment Item:", equipmentItem);

          // Ensure the equipmentItem has an equipment object and check the ID
          if (
            equipmentItem.equipment?._id === itemId &&
            (equipmentItem.status === "Pending" ||
              equipmentItem.status === "Approved")
          ) {
            const borrowDate = new Date(equipmentItem.borrowDate).getTime();
            const returnDate = new Date(equipmentItem.returnDate).getTime();
            console.log(
              `Item: ${equipmentItem.equipment._id}, Borrow Date: ${borrowDate}, Return Date: ${returnDate}`
            );

            // Check if the current date is within the borrow and return date range
            return currentDate >= borrowDate && currentDate <= returnDate;
          }
          return false;
        });
      }
      return false;
    });
  };

  // Custom styling for the date picker to show a red line for disabled dates
  const highlightWithRanges = (date) => {
    const isHighlighted = borrowedItems.some((borrowedItem) => {
      if (Array.isArray(borrowedItem.equipment)) {
        return borrowedItem.equipment.some((equipmentItem) => {
          if (
            equipmentItem.equipment?._id &&
            (equipmentItem.status === "Pending" ||
              equipmentItem.status === "Approved")
          ) {
            const borrowDate = new Date(equipmentItem.borrowDate);
            const returnDate = new Date(equipmentItem.returnDate);
            return date >= borrowDate && date <= returnDate;
          }
          return false;
        });
      }
      return false;
    });
    return isHighlighted ? "highlight-red" : "";
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1
              className="text-5xl font-bold text-black dark:text-white relative inline-block
                            after:content-[''] after:block after:w-1/2 after:h-1 after:bg-primary
                            after:mt-2 after:rounded-full"
            >
              CREATE TRANSACTION
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
              Create and manage equipment borrowing transactions
            </p>
          </div>

          {/* User Selection */}
          <div className="mb-6">
            <label className="block mb-2">Select User</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a user...</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Equipment List and Selected Items */}
          <div className="grid grid-cols-2 gap-6 h-[calc(100vh-350px)]">
            {/* Available Equipment */}
            <div className="overflow-hidden flex flex-col">
              <h2 className="text-xl font-bold mb-4">Available Equipment</h2>

              {/* Move search and filter here */}
              <div className="mb-4 flex gap-4">
                <input
                  type="text"
                  placeholder="Search equipment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="p-2 border rounded flex-1"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="p-2 border rounded"
                >
                  <option value="">All Categories</option>
                  {Array.from(
                    new Set(equipmentItems.map((e) => e.category))
                  ).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="overflow-y-auto flex-1">
                <div className="grid gap-4 pr-2">
                  {filteredEquipment.map((item) => (
                    <div key={item._id} className="border p-4 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 className="font-bold">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            {item.category}
                          </p>
                          <p className="text-sm text-gray-600">
                            {" "}
                            Serial Number: {item.serialNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4 mb-2">
                        <div>
                          <label className="block text-sm mb-1">
                            Borrow Date
                          </label>
                          <DatePicker
                            selected={item.borrowDate}
                            onChange={(date) => {
                              const updatedItems = [...equipmentItems];
                              const index = updatedItems.findIndex(
                                (i) => i._id === item._id
                              );
                              updatedItems[index] = {
                                ...item,
                                borrowDate: date,
                              };
                              setEquipmentItems(updatedItems);
                            }}
                            className="p-2 border rounded text-sm"
                            minDate={new Date()}
                            filterDate={(date) =>
                              !isDateDisabled(date, item._id)
                            }
                            dayClassName={(date) =>
                              highlightWithRanges(date, item._id)
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">
                            Return Date
                          </label>
                          <DatePicker
                            selected={item.returnDate}
                            onChange={(date) => {
                              const updatedItems = [...equipmentItems];
                              const index = updatedItems.findIndex(
                                (i) => i._id === item._id
                              );
                              updatedItems[index] = {
                                ...item,
                                returnDate: date,
                              };
                              setEquipmentItems(updatedItems);
                            }}
                            className="p-2 border rounded text-sm"
                            minDate={item.borrowDate || new Date()}
                            filterDate={(date) =>
                              !isDateDisabled(date, item._id)
                            }
                            dayClassName={(date) =>
                              highlightWithRanges(date, item._id)
                            }
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddItem(item)}
                        className="bg-primary text-white px-4 py-2 rounded w-full"
                        disabled={
                          selectedItems.some(
                            (selected) => selected.equipment._id === item._id
                          ) ||
                          !item.borrowDate ||
                          !item.returnDate
                        }
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Items */}
            <div className="overflow-hidden flex flex-col">
              <h2 className="text-xl font-bold mb-4">Selected Items</h2>
              <div className="overflow-y-auto flex-1">
                <div className="grid gap-4 pr-2">
                  {selectedItems.map((item) => (
                    <div
                      key={item.equipment._id}
                      className="border p-4 rounded flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-bold">{item.equipment.name}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(item.borrowDate).toLocaleDateString()} -{" "}
                          {new Date(item.returnDate).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.equipment._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={loading || selectedItems.length === 0 || !selectedUser}
              className="bg-green-500 text-white px-6 py-2 rounded disabled:bg-gray-400"
            >
              {loading ? "Creating Transaction..." : "Create Transaction"}
            </button>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .highlight-red {
          background-color: #ffcccc !important;
          color: gray !important;
          border-bottom: 2px solid red;
          border-radius: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default Addtransaction;
