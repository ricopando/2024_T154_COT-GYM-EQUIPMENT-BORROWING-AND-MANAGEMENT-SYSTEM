import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const HistoryModal = ({ isOpen, onClose, itemId }) => {
  const [historyData, setHistoryData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistoryData = async () => {
      if (!itemId) {
        console.warn('No itemId provided');
        return;
      }
      try {
        console.log(`Fetching history for itemId: ${itemId}`);
        const response = await axios.get(`http://localhost:8000/api/borrow-items/equipment/${itemId}/history`);
        
        // Log the raw response data
        console.log('Raw response data:', response.data);

        // Check if response.data is an array
        if (!Array.isArray(response.data)) {
          console.error('Expected an array but got:', typeof response.data);
          setError('Unexpected data format received.');
          return;
        }

        // Directly use the response data as it matches the expected structure
        setHistoryData(response.data);
        console.log('Transformed data:', response.data);
      } catch (error) {
        console.error('Failed to fetch history data:', error);
        setError('Failed to fetch history data.');
      }
    };

    if (isOpen) {
      fetchHistoryData();
    }
  }, [isOpen, itemId]);

  if (!isOpen) return null;

  const columns = [
    {
      name: 'User Name',
      selector: row => row.user.name,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Email',
      selector: row => row.user.email,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Borrow Date',
      selector: row => row.equipment[0]?.borrowDate ? new Date(row.equipment[0].borrowDate).toLocaleDateString() : 'N/A',
      sortable: true,
      width: '200px',
    },
    {
      name: 'Return Date',
      selector: row => row.equipment[0]?.returnDate ? new Date(row.equipment[0].returnDate).toLocaleDateString() : 'N/A',
      sortable: true,
      width: '200px',
        },
    {
      name: 'Status',
      selector: row => row.equipment[0]?.status,
      sortable: true,
      width: '200px',
    },
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-2xl md:max-w-4xl">
        <h3 className="text-lg font-medium text-gray-900">Equipment History</h3>
        <div className="mt-2">
          {error ? (
            <p>{error}</p>
          ) : (
            <DataTable
              columns={columns}
              data={historyData}
              pagination
              highlightOnHover
              responsive
              striped
            />
          )}
        </div>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-2 mr-2 text-red-600 hover:text-red-800"
          aria-label="Close history modal"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default HistoryModal;