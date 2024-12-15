import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "../../components/Navbar/Navbar";
import CatalogModal from "./catalogModal";
import AOS from "aos";
import LoadingModal from "../../components/modal/loadingModal";

// Add axios default config
axios.defaults.withCredentials = true;

const Catalog = () => {
  const [equipmentItems, setEquipmentItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [borrowListId, setBorrowListId] = useState(null);
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabledDialogOpen, setIsDisabledDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isDateErrorDialogOpen, setIsDateErrorDialogOpen] = useState(false);

  const checkAuth = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/auth/check');
      return response.data.isAuthenticated;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  };

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/equipment');
        setEquipmentItems(response.data);
        setFilteredItems(response.data);
      } catch (error) {
        console.error('Failed to fetch equipment data:', error);
        alert('Failed to fetch equipment data.');
      }
    };
    fetchEquipment();
  }, []);

  useEffect(() => {
    const fetchBorrowedItems = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/borrow-items');
        console.log('Fetched borrowed items:', response.data);
        setBorrowedItems(response.data);
      } catch (error) {
        console.error('Failed to fetch borrowed items:', error);
      }
    };
    fetchBorrowedItems();
  }, []);

  const isDateDisabled = (date, itemId) => {
    const currentDate = date.getTime();
    console.log(`Checking date: ${currentDate} for itemId: ${itemId}`);

    return borrowedItems.some((borrowedItem) => {
      console.log('Borrowed Item:', borrowedItem);

      // Check if borrowedItem has an equipment array
      if (Array.isArray(borrowedItem.equipment)) {
        return borrowedItem.equipment.some((equipmentItem) => {
          console.log('Equipment Item:', equipmentItem);

          // Ensure the equipmentItem has an equipment object and check the ID
          if (equipmentItem.equipment?._id === itemId && (equipmentItem.status === "Pending" || equipmentItem.status === "Approved")) {
            const borrowDate = new Date(equipmentItem.borrowDate).getTime();
            const returnDate = new Date(equipmentItem.returnDate).getTime();
            console.log(`Item: ${equipmentItem.equipment._id}, Borrow Date: ${borrowDate}, Return Date: ${returnDate}`);
            
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
          if (equipmentItem.equipment?._id === selectedItem._id && (equipmentItem.status === "Pending" || equipmentItem.status === "Approved")) {
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

  const handleFilter = () => {
    let filtered = equipmentItems;
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }
    setFilteredItems(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [searchQuery, selectedCategory, equipmentItems]);

  const handleImageClick = (item) => {
    if (item.availabilityStatus === 'Maintenance' || item.isDisabled) {
      setIsDisabledDialogOpen(true);
      return;
    }
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setStartDate(null);
    setEndDate(null);
  };

  const getOrCreateBorrowList = async () => {
    try {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        throw new Error('User not authenticated');
      }
      const response = await axios.get('http://localhost:8000/api/borrow-lists');
      const activeLists = response.data.filter(list => list.status === 'Draft');
      if (activeLists.length > 0) {
        return activeLists[0]._id;
      }
      const newListResponse = await axios.post('http://localhost:8000/api/borrow-lists', { items: [] });
      return newListResponse.data._id;
    } catch (error) {
      console.error('Error in getOrCreateBorrowList:', error);
      if (error.response?.status === 401) {
        alert('Please log in to create a borrow list');
      }
      throw error;
    }
  };

  const handleAddToList = async () => {
    try {
      if (!selectedItem || !startDate || !endDate) {
        setIsDateErrorDialogOpen(true);
        return;
      }
      if (startDate > endDate) {
        alert('End date must be after start date');
        return;
      }
      
      // Close the modal before starting the loading process
      handleCloseModal();
      setIsLoading(true);

      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        alert('Please log in to add items to your borrow list');
        setIsLoading(false);
        return;
      }

      const listId = borrowListId || await getOrCreateBorrowList();
      setBorrowListId(listId);
      const currentList = await axios.get(`http://localhost:8000/api/borrow-lists/${listId}`);
      const currentItems = currentList.data.items || [];
      const newItem = {
        equipment: selectedItem._id,
        borrowDate: startDate.toISOString(),
        returnDate: endDate.toISOString()
      };
      const updatedItems = [...currentItems, newItem];
      await axios.put(`http://localhost:8000/api/borrow-lists/${listId}`, { items: updatedItems });
      setIsSuccessDialogOpen(true);
    } catch (error) {
      console.error('Error in handleAddToList:', error);
      alert('Failed to add item to borrow list. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 600,
      easing: "ease-in-out",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-500 ease-in-out min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4">
        <div className="text-left mt-5 mb-12">
          <h1 data-aos="fade-up" className="text-5xl font-extrabold tracking-tight">Equipment</h1>
        </div>
        <div data-aos="fade-up" className="flex justify-between items-center mt-5 mb-12">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search equipment..."
            className="p-2 border rounded w-full max-w-xs transition duration-500 ease-in-out"
            aria-label="Search equipment"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded ml-4 transition duration-500 ease-in-out"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            <option value="furnitures">Furnitures</option>
            {Array.from(new Set(equipmentItems.map(e => e.category))).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 place-items-center mt-5">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="w-full max-w-xs h-[350px] rounded-2xl bg-white dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-primary hover:text-white relative shadow-xl transition duration-500 ease-in-out group mt-5 flex flex-col justify-between"
              tabIndex="0"
              aria-label={`Equipment card for ${item.name}`}
              onClick={() => handleImageClick(item)}
              onKeyDown={(e) => e.key === 'Enter' && handleImageClick(item)}
              data-aos="fade-up"
            >
              <div className="h-[150px] flex justify-center items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="max-w-[140px] max-h-[140px] block mx-auto transform group-hover:scale-105 transition duration-500 ease-in-out drop-shadow-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/placeholder.jpg";
                  }}
                />
              </div>
              <div className="mt-8 p-4 text-center flex-grow">
                <h1 className="mb-5 text-xl font-bold">{item.name}</h1>
                <p className="text-gray-500 group-hover:text-white transition duration-500 ease-in-out text-sm line-clamp-2">
                  {item.serialNumber}
                </p>
              </div>
              <div className="p-4 flex justify-center">
                <button
                  className="bg-primary hover:scale-105 transition duration-500 ease-in-out text-white py-1 px-4 rounded-full group-hover:bg-white group-hover:text-primary"
                  aria-label={`Order ${item.name}`}
                >
                  Borrow Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && selectedItem && (
        <CatalogModal onClose={handleCloseModal} className="z-40">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
            <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
              <span className="sr-only">Close</span>
              &times;
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <button
              className={`px-4 py-2 ${activeTab === 0 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-l`}
              onClick={() => setActiveTab(0)}
            >
              Book Item
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-r`}
              onClick={() => setActiveTab(1)}
            >
              Details
            </button>
          </div>
          <div className="p-4">
            {activeTab === 0 && (
              <div>
                <img
                  src={selectedItem.image || '/images/placeholder.jpg'}
                  alt={selectedItem.name}
                  className="w-full h-64 object-contain rounded mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">Select Borrow Period</h3>
                <div className="flex flex-col space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      className="w-full p-2 border rounded"
                      minDate={new Date()}
                      filterDate={(date) => !isDateDisabled(date, selectedItem._id)}
                      dayClassName={(date) => highlightWithRanges(date)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      className="w-full p-2 border rounded"
                      minDate={startDate || new Date()}
                      filterDate={(date) => !isDateDisabled(date, selectedItem._id)}
                      dayClassName={(date) => highlightWithRanges(date)}
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === 1 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Details</h3>
                <p className="text-gray-700"><strong>Name:</strong> {selectedItem.name}</p>
                <p className="text-gray-700"><strong>Serial Number:</strong> {selectedItem.serialNumber}</p>
                <p className="text-gray-700"><strong>Model:</strong> {selectedItem.model || 'N/A'}</p>
                <p className="text-gray-700"><strong>Category:</strong> {selectedItem.category || 'N/A'}</p>
                <p className="text-gray-700"><strong>Description:</strong> {selectedItem.description || 'No description available.'}</p>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-2 mt-4 border-t border-gray-200 pt-4">
            <button
              onClick={handleCloseModal}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleAddToList}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              disabled={isLoading}
            >
              Add to List
            </button>
          </div>
        </CatalogModal>
      )}
      {isSuccessDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Success</h2>
            <p>Item added to your borrow list successfully!</p>
            <button
              onClick={() => setIsSuccessDialogOpen(false)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {isDisabledDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Item Unavailable</h2>
            <p>This equipment is Under Maintenance.</p>
            <button
              onClick={() => setIsDisabledDialogOpen(false)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {isDateErrorDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Date Selection Required</h2>
            <p>Please select both a start date and end date to proceed.</p>
            <button
              onClick={() => setIsDateErrorDialogOpen(false)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {isLoading && <LoadingModal />}
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

export default Catalog;