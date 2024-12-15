import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';

const tableCustomStyles = {
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
      paddingTop: '1rem',
      paddingBottom: '1rem',
    },
  },
  rows: {
    style: {
      '&:not(:last-of-type)': {
        borderBottom: '1px solid #E5E7EB',
      },
    },
  },
  cells: {
    style: {
      fontSize: '0.875rem',
      color: '#374151',
      padding: '1rem',
    },
  },
};

const columns = [
  {
    name: 'Transaction ID',
    selector: (row) => row.item,
    sortable: true,
    width: '250px',
  },
  {
    name: 'Transaction Date',
    selector: (row) => new Date(row.createdAt).toLocaleDateString(),
    sortable: true,
    width: '200px',
  },
  {
    name: 'User Name',
    selector: (row) => row.user.name,
    sortable: true,
    width: '200px',
  },
  {
    name: 'Email',
    selector: (row) => row.user.email,
    sortable: true,
    width: '250px',
  },
  {
    name: 'Borrow Date',
    selector: (row) => row.equipment[0]?.borrowDate 
      ? new Date(row.equipment[0].borrowDate).toLocaleDateString() 
      : 'N/A',
    sortable: true,
    width: '150px',
  },
  {
    name: 'Return Date',
    selector: (row) => row.equipment[0]?.returnDate 
      ? new Date(row.equipment[0].returnDate).toLocaleDateString() 
      : 'N/A',
    sortable: true,
    width: '150px',
  },
  {
    name: 'Status',
    selector: (row) => row.equipment[0]?.status,
    sortable: true,
    cell: (row) => (
      <span className={`px-3 py-1 rounded-full text-sm ${
        row.equipment[0]?.status === 'Approved' ? 'bg-green-100 text-green-800'
        : row.equipment[0]?.status === 'Pending' ? 'bg-yellow-100 text-yellow-800'
        : 'bg-gray-100 text-gray-800'
      }`}>
        {row.equipment[0]?.status}
      </span>
    ),
    width: '150px',
  },
 
];

const HistoryModal = ({ isOpen, onClose, itemId }) => {
  const [historyData, setHistoryData] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHistoryData = async () => {
      if (!itemId) return;
      
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/borrow-items/equipment/${itemId}/history`);
        if (!Array.isArray(response.data)) throw new Error('Unexpected data format received.');
        setHistoryData(response.data);
      } catch (error) {
        setError('Failed to fetch history data.');
        console.error('Failed to fetch history data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) fetchHistoryData();
  }, [isOpen, itemId]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    
    // Get the first history entry's equipment details (assuming all entries are for the same equipment)
    const equipmentDetails = historyData[0]?.equipment[0] || {};
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Equipment History</title>
          <style>
            @page {
              size: landscape;
              margin: 2cm;
            }
            @media print {
              body {
                width: 100%;
                height: 100%;
                margin: 0 auto;
                padding: 0;
                max-width: 100%;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              table {
                width: 100% !important;
                table-layout: fixed;
              }
            }
            body { 
              font-family: Arial, sans-serif; 
              padding: 0; 
              line-height: 1.4;
              font-size: 12px;
              max-width: 100%;
            }
            h1 {
              margin-bottom: 20px;
              font-size: 20px;
            }
            .equipment-details { 
              background-color: #f9fafb; 
              padding: 16px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .equipment-details h2 { 
              margin-top: 0;
              margin-bottom: 12px;
              font-size: 14px;
            }
            .details-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 8px;
            }
            .detail-item {
              display: flex;
              gap: 4px;
            }
            .detail-label {
              font-weight: 600;
              color: #374151;
              min-width: 10px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
              font-size: 11px;
              table-layout: fixed;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 10px 8px;
              text-align: left;
              word-wrap: break-word;
              overflow-wrap: break-word;
            }
            th { 
              background-color: #f9fafb;
              font-weight: 600;
              font-size: 12px;
            }
            .status-badge {
              padding: 2px 8px;
              border-radius: 9999px;
              font-size: 11px;
              display: inline-block;
            }
            .status-approved { background-color: #dcfce7; color: #166534; }
            .status-pending { background-color: #fef9c3; color: #854d0e; }
            .status-default { background-color: #f3f4f6; color: #1f2937; }
            th:nth-child(1), td:nth-child(1) { width: 15%; }
            th:nth-child(2), td:nth-child(2) { width: 12%; }
            th:nth-child(3), td:nth-child(3) { width: 15%; }
            th:nth-child(4), td:nth-child(4) { width: 20%; }
            th:nth-child(5), td:nth-child(5) { width: 12%; }
            th:nth-child(6), td:nth-child(6) { width: 12%; }
            th:nth-child(7), td:nth-child(7) { width: 14%; }
          </style>
        </head>
        <body>
          <h1>Equipment History</h1>
          <div class="equipment-details">
            <h2>Equipment Details</h2>
            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Name:</span>
                <span>${equipmentDetails.name || 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Serial Number:</span>
                <span>${equipmentDetails.serialNumber || 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Category:</span>
                <span>${equipmentDetails.category || 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Model:</span>
                <span>${equipmentDetails.model || 'N/A'}</span>
              </div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Transaction Date</th>
                <th>User Name</th>
                <th>Email</th>
                <th>Borrow Date</th>
                <th>Return Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${historyData.map(row => `
                <tr>
                  <td>${row.item}</td>
                  <td>${new Date(row.createdAt).toLocaleDateString()  }</td>
                  <td>${row.user.name}</td>
                  <td>${row.user.email}</td>
                  <td>${row.equipment[0]?.borrowDate ? new Date(row.equipment[0].borrowDate).toLocaleDateString() : 'N/A'}</td>
                  <td>${row.equipment[0]?.returnDate ? new Date(row.equipment[0].returnDate).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span class="status-badge ${
                      row.equipment[0]?.status === 'Approved' ? 'status-approved'
                      : row.equipment[0]?.status === 'Pending' ? 'status-pending'
                      : 'status-default'
                    }">
                      ${row.equipment[0]?.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center w-full z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-screen-2xl mx-4 max-h-[85vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Equipment History</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isLoading || historyData.length === 0}
                aria-label="Print history"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Close history modal"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 bg-red-50 rounded-md">{error}</div>
          ) : historyData.length > 0 ? (
            <DataTable
              columns={columns}
              data={historyData}
              pagination
              highlightOnHover
              responsive
              striped
              customStyles={tableCustomStyles}
            />
          ) : (
            <p className="text-gray-500 text-center py-4">No history available for this equipment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;