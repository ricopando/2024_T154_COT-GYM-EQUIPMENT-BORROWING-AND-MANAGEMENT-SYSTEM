import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar/Sidebar';
import { FaEye } from 'react-icons/fa';
import DataTable from 'react-data-table-component';
import Navbar from '../components/Navbar/AdminNavbar';
import HistoryModal from '../components/HistoryModal';

const Inventory = () => {
  const [equipmentItems, setEquipmentItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [modalState, setModalState] = useState({
    isOpen: false,
    isEditMode: false,
    selectedItem: null,
  });
  const [dialogs, setDialogs] = useState({
    confirmDelete: false,
    success: false,
    error: false,
    borrowed: false,
  });
  const [messages, setMessages] = useState({
    success: '',
    error: '',
  });
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    description: '',
    image: '',
    category: '',
    serialNumber: '',
    model: '',
    availabilityStatus: 'Available',
  });
  const [imageModal, setImageModal] = useState({
    isOpen: false,
    imageUrl: '',
  });
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [historyModal, setHistoryModal] = useState({
    isOpen: false,
    itemId: null,
  });

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/equipment');
      const dataWithId = response.data.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
      setEquipmentItems(dataWithId);
      setFilteredData(dataWithId);
    } catch (error) {
      setMessages({ ...messages, error: 'Failed to fetch equipment data.' });
      setDialogs({ ...dialogs, error: true });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEquipment = async () => {
    if (!modalState.selectedItem) {
      console.error('No item selected for deletion');
      return;
    }

    if (modalState.selectedItem.availabilityStatus === 'Borrowed') {
      setDialogs({ ...dialogs, borrowed: true });
      return;
    }

    setLoading(true);
    setIsDeleting(true);
    try {
      console.log(`Attempting to delete equipment with ID: ${modalState.selectedItem._id}`);
      await axios.delete(`http://localhost:8000/api/equipment/${modalState.selectedItem._id}`);
      setMessages({ ...messages, success: 'Equipment deleted successfully!' });
      setDialogs({ ...dialogs, confirmDelete: false, success: true });
      fetchEquipment();
    } catch (error) {
      console.error('Failed to delete equipment:', error);
      setMessages({ ...messages, error: 'Failed to delete equipment.' });
      setDialogs({ ...dialogs, error: true });
    } finally {
      setLoading(false);
      setIsDeleting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEquipment((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvailabilityChange = async (event, item) => {
    const newStatus = event.target.value;
    if (item.availabilityStatus === 'Borrowed') {
      // Prevent any changes if the item is already 'Borrowed'
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8000/api/equipment/${item._id}`, {
        ...item,
        availabilityStatus: newStatus,
      });

      if (response.status === 200) {
        setEquipmentItems(equipmentItems.map(equip => 
          equip._id === item._id ? { ...equip, availabilityStatus: newStatus } : equip
        ));
        setMessages({ ...messages, success: 'Availability status updated successfully!' });
        setDialogs({ ...dialogs, success: true });
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      setMessages({ ...messages, error: 'Failed to update availability status.' });
      setDialogs({ ...dialogs, error: true });
    }
  };

  const handleImageClick = (imageUrl) => {
    setImageModal({ isOpen: true, imageUrl });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEditClick = (item) => {
    if (item.availabilityStatus === 'Borrowed') {
      setDialogs({ ...dialogs, borrowed: true });
      return;
    }
    setModalState({ isOpen: true, isEditMode: true, selectedItem: item });
    setNewEquipment({
      name: item.name,
      description: item.description,
      image: item.image,
      category: item.category,
      serialNumber: item.serialNumber,
      model: item.model,
      availabilityStatus: item.availabilityStatus,
    });
  };

  const handleAddClick = () => {
    setNewEquipment({
      name: '',
      description: '',
      image: '',
      category: '',
      serialNumber: '',
      model: '',
      availabilityStatus: 'Available',
    });
    setModalState({ isOpen: true, isEditMode: false, selectedItem: null });
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
        params: {
          key: import.meta.env.VITE_IMGBB_API_KEY, // Access the API key from environment variables
        },
        withCredentials: false, // Ensure credentials are not included
      });

      if (response.data.success) {
        return response.data.data.url; // Return the URL of the uploaded image
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      setMessages({ ...messages, error: 'Failed to upload image.' });
      setDialogs({ ...dialogs, error: true });
      return null;
    }
  };

  const handleAddOrEditEquipment = async () => {
    setLoading(true);
    setIsSaving(true);
    try {
      let imageUrl = newEquipment.image;

      if (newEquipment.imageFile) {
        imageUrl = await handleImageUpload(newEquipment.imageFile);
        if (!imageUrl) return; // Exit if image upload fails
      }

      const equipmentData = { ...newEquipment, image: imageUrl };

      if (modalState.isEditMode) {
        // Edit existing equipment
        const response = await axios.put(
          `http://localhost:8000/api/equipment/${modalState.selectedItem._id}`,
          equipmentData
        );
        if (response.status === 200) {
          setMessages({ ...messages, success: 'Equipment updated successfully!' });
        }
      } else {
        // Add new equipment
        const response = await axios.post('http://localhost:8000/api/equipment', equipmentData);
        if (response.status === 201) {
          setMessages({ ...messages, success: 'Equipment added successfully!' });
        }
      }
      setDialogs({ ...dialogs, success: true });
      setModalState({ ...modalState, isOpen: false });
      fetchEquipment();
    } catch (error) {
      setMessages({ ...messages, error: 'Failed to save equipment.' });
      setDialogs({ ...dialogs, error: true });
    } finally {
      setLoading(false);
      setIsSaving(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewEquipment((prev) => ({ ...prev, imageFile: file }));
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  useEffect(() => {
    if (searchQuery || categoryFilter) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = equipmentItems.filter(item => {
        const matchesQuery = ['id', 'name', 'category', 'availabilityStatus', 'serialNumber', 'model'].some(field =>
          item[field]?.toString().toLowerCase().includes(lowercasedQuery)
        );
        const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
        return matchesQuery && matchesCategory;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(equipmentItems);
    }
  }, [searchQuery, categoryFilter, equipmentItems]);

  const handleDeleteClick = (item) => {
    if (item.availabilityStatus === 'Borrowed') {
      setDialogs({ ...dialogs, borrowed: true });
      return;
    }
    setModalState({ ...modalState, selectedItem: item });
    setDialogs({ ...dialogs, confirmDelete: true });
  };

  const handleHistoryClick = (item) => {
    setHistoryModal({ isOpen: true, itemId: item._id });
  };

  // Define columns for the DataTable
  const columns = [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true,
      className: 'text-center',
    },
    {
      name: 'Equipment Name',
      selector: row => row.name,
      sortable: true,
      className: 'text-left',
    },
    {
      name: 'Category',
      selector: row => row.category,
      sortable: true,
      className: 'text-left',
    },
    {
      name: 'Availability',
      cell: row => (
        <select
          value={row.availabilityStatus}
          onChange={(event) => handleAvailabilityChange(event, row)}
          className="bg-white border border-gray-300 rounded-lg p-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label={`Change availability status for ${row.name}`}
          disabled={row.availabilityStatus === 'Borrowed'}
        >
          <option value="Available">Available</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Borrowed" disabled={row.availabilityStatus === 'Borrowed'}>Borrowed</option>
        </select>
      ),
    },
    {
      name: 'Serial Number',
      selector: row => row.serialNumber,
      sortable: true,
      className: 'text-left',
    },
    {
      name: 'Model',
      selector: row => row.model,
      sortable: true,
      className: 'text-left',
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleImageClick(row.image)}
            className="text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label={`View image of ${row.name}`}
          >
            <FaEye />
          </button>
          <button
            onClick={() => handleEditClick(row)}
            className="text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label={`Edit ${row.name}`}
            disabled={row.availabilityStatus === 'Borrowed'}
            style={{ cursor: row.availabilityStatus === 'Borrowed' ? 'not-allowed' : 'pointer' }}
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-300"
            aria-label={`Delete ${row.name}`}
            disabled={row.availabilityStatus === 'Borrowed'}
            style={{ cursor: row.availabilityStatus === 'Borrowed' ? 'not-allowed' : 'pointer' }}
          >
            Delete
          </button>
          <button
            onClick={() => handleHistoryClick(row)}
            className="text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label={`View history of ${row.name}`}
          
          >
            History
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
              <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage and track all equipment in the inventory
              </p>
            </div>

            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between space-x-4">
                  <div className="w-1/4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search Equipment"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="absolute left-3 top-2.5 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-white border border-gray-300 rounded-lg p-2"
                    >
                      <option value="">All Categories</option>
                      <option value="Sports">Sports</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Electronics">Electronics</option>
                    </select>
                    <button
                      onClick={handleAddClick}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Equipment
                    </button>
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
                  data={filteredData}
                  pagination
                  highlightOnHover
                  pointerOnHover
                  responsive
                  customStyles={{
                    headRow: {
                      style: {
                        backgroundColor: '#F9FAFB',
                        borderBottom: '1px solid #E5E7EB',
                      },
                    },
                    headCells: {
                      style: {
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        padding: '12px 16px',
                      },
                    },
                    cells: {
                      style: {
                        fontSize: '0.875rem',
                        color: '#1F2937',
                        padding: '12px 16px',
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
                  alt="Equipment" 
                  className="w-full h-auto object-contain rounded"
                />
                <button
                  onClick={() => setImageModal({ isOpen: false, imageUrl: '' })}
                  className="absolute top-0 right-0 mt-2 mr-2 text-red-600 hover:text-red-800"
                  aria-label="Close image modal"
                >
                  &times;
                </button>
              </div>
            </div>
          )}

          {/* Modals and Dialogs */}
          {modalState.isOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
              <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {modalState.isEditMode ? 'Edit Equipment' : 'Add New Equipment'}
                  </h3>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      value={newEquipment.name}
                      onChange={handleInputChange}
                      placeholder="Equipment Name"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <select
                      name="category"
                      value={newEquipment.category}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="">Select Category</option>
                      <option value="Sports">Sports</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Electronics">Electronics</option>
                    </select>
                    <textarea
                      name="description"
                      value={newEquipment.description}
                      onChange={handleInputChange}
                      placeholder="Description"
                      className="w-full p-2 border border-gray-300 rounded col-span-1 md:col-span-2 h-24"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      name="serialNumber"
                      value={newEquipment.serialNumber}
                      onChange={handleInputChange}
                      placeholder="Serial Number"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      name="model"
                      value={newEquipment.model}
                      onChange={handleInputChange}
                      placeholder="Model"
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex flex-col items-center px-4 py-3 space-y-2">
                    <button
                      onClick={() => setModalState({ ...modalState, isOpen: false })}
                      className={`px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddOrEditEquipment}
                      className={`px-4 py-2 bg-primary text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving...' : modalState.isEditMode ? 'Update' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dialogs */}
          {dialogs.confirmDelete && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
              <div className="relative top-20 mx-auto p-5 border w-full max-w-sm shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Confirm Delete
                  </h3>
                  <div className="mt-2">
                    <p>Are you sure you want to delete this equipment?</p>
                  </div>
                  <div className="items-center px-4 py-3">
                    <button
                      onClick={() => setDialogs({ ...dialogs, confirmDelete: false })}
                      className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteEquipment}
                      className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 mt-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {dialogs.success && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
              <div className="relative top-20 mx-auto p-5 border w-full max-w-sm shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Success
                  </h3>
                  <div className="mt-2">
                    <p>{messages.success}</p>
                  </div>
                  <div className="items-center px-4 py-3">
                    <button
                      onClick={() => setDialogs({ ...dialogs, success: false })}
                      className="px-4 py-2 bg-primary text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {dialogs.error && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
              <div className="relative top-20 mx-auto p-5 border w-full max-w-sm shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Error
                  </h3>
                  <div className="mt-2">
                    <p>{messages.error}</p>
                  </div>
                  <div className="items-center px-4 py-3">
                    <button
                      onClick={() => setDialogs({ ...dialogs, error: false })}
                      className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Modal */}
          {historyModal.isOpen && (
            <HistoryModal
              isOpen={historyModal.isOpen}
              onClose={() => setHistoryModal({ isOpen: false, itemId: null })}
              itemId={historyModal.itemId}
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
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`}</style>

export default Inventory;