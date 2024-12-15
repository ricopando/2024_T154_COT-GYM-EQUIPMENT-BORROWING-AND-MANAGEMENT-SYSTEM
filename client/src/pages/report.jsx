import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/AdminNavbar';
import DataTable from 'react-data-table-component';
import EquipmentDetails from "../components/Report/EquipmentDetails";
const Report = () => {
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [equipmentDetails, setEquipmentDetails] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeEquipmentDetails, setIncludeEquipmentDetails] = useState(true);

  const filterButtons = [
    { label: 'All', value: 'all' },
    { label: 'Approved', value: 'Approved' },
    { label: 'Returned', value: 'Returned' },
    { label: 'Pending', value: 'Pending' }
  ];

  const filteredItems = borrowedItems.filter(item => {
    const statusMatch = activeFilter === 'all' ? true : item.status === activeFilter;
    
    let dateMatch = true;
    const itemDate = new Date(item.createdAt);
    
    if (startDate) {
      dateMatch = dateMatch && itemDate >= new Date(startDate);
    }
    if (endDate) {
      const endDateTime = new Date(endDate);
      endDateTime.setDate(endDateTime.getDate() + 1);
      dateMatch = dateMatch && itemDate < endDateTime;
    }

    return statusMatch && dateMatch;
  });

  const fetchAllBorrowedItems = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/borrow-items", {
        withCredentials: true,
      });
      
      // Add sequential ID to each item
      const dataWithId = response.data.map((item, index) => ({
        ...item,
        id: index + 1,
      }));

      // Only filter out items with no equipment
      const filteredData = dataWithId.filter(item => {
        if (!item.equipment || item.equipment.length === 0) {
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



  

  const columns = [
    {
      name: "Transaction ID",
      selector: row => row.item,
      sortable: true,
      width: '200px',
  
    },
    {
      name: "User",
      selector: row => row.user.name,
      sortable: true,
    
    },
    {
      name: "Email",
      selector: row => row.user.email,
      sortable: true,
      width: '200px',
  
    },
    {
      name: "Transaction Date",
      selector: row => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Transaction Time",
      selector: row => new Date(row.createdAt).toLocaleTimeString(),
      sortable: true,
    },
    {
      name: "Status",
      selector: row => row.status,
      sortable: true,
    },
    {
      name: "Equipment Info",
      cell: row => (
        <button
          className="text-blue-500 hover:underline"
          onClick={() => openEquipmentModal(row.equipment,row.item)}
          aria-label={`View equipment details for transaction ${row.item}`}
        >
          View
        </button>
      ),
    }

    // ... other columns as provided ...
  ];

  useEffect(() => {
    fetchAllBorrowedItems();
  }, []);

  const openEquipmentModal = async (equipment, transactionId) => {
    if (!equipment || equipment.length === 0) {
      setEquipmentModalOpen(false);
      await handleDeleteTransaction(transactionId); // Await the deletion
      return;
    }
    const equipmentWithTransactionId = equipment.map(equip => ({
      ...equip,
      transactionId
    }));
    setEquipmentDetails(equipmentWithTransactionId);
    setEquipmentModalOpen(true);
  };

  const handlePrint = () => {
    const printContent = document.createElement('div');
    
    // Create header
    const header = document.createElement('div');
    header.innerHTML = `
      <h1 style="text-align: center; font-size: 24px; margin-bottom: 20px;">Borrowed Items Report</h1>
      <p style="text-align: center; margin-bottom: 20px;">Generated on: ${new Date().toLocaleString()}</p>
    `;
    printContent.appendChild(header);

    // Create main transactions table
    const mainTable = document.createElement('table');
    mainTable.style.cssText = 'width: 100%; border-collapse: collapse; margin-bottom: 30px;';

    // Add table headers
    const headers = columns
      .filter(col => col.name !== 'Equipment Info')
      .map(col => col.name);
    
    const headerRow = `
      <tr>
        ${headers.map(header => `
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">
            ${header}
          </th>
        `).join('')}
      </tr>
    `;
    mainTable.innerHTML = headerRow;

    // Add transaction data and equipment details for each transaction
    filteredItems.forEach(item => {
      // Add main transaction row
      const mainRow = document.createElement('tr');
      mainRow.innerHTML = `
        <td style="border: 1px solid #ddd; padding: 8px;">${item.item}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.user.name}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.user.email}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${new Date(item.createdAt).toLocaleDateString()}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${new Date(item.createdAt).toLocaleTimeString()}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.status}</td>
      `;
      mainTable.appendChild(mainRow);

      // Only add equipment details if the toggle is on
      if (includeEquipmentDetails && item.equipment && item.equipment.length > 0) {
        const equipmentRow = document.createElement('tr');
        const equipmentCell = document.createElement('td');
        equipmentCell.colSpan = headers.length;
        equipmentCell.style.padding = '0';  // Remove padding to align with main table

        const equipmentTable = document.createElement('table');
        equipmentTable.style.cssText = 'width: 100%; border-collapse: collapse; margin: 8px 0; background-color: #f8f9fa;';
        
        // Equipment details header with adjusted column widths
        equipmentTable.innerHTML = `
          <tr>
            <th style="border: 1px solid #ddd; padding: 6px; text-align: left; background-color: #e9ecef; width: 14%;">Name</th>
            <th style="border: 1px solid #ddd; padding: 6px; text-align: left; background-color: #e9ecef; width: 14%;">Serial No</th>
            <th style="border: 1px solid #ddd; padding: 6px; text-align: left; background-color: #e9ecef; width: 14%;">Model</th>
            <th style="border: 1px solid #ddd; padding: 6px; text-align: left; background-color: #e9ecef; width: 14%;">Category</th>
            <th style="border: 1px solid #ddd; padding: 6px; text-align: left; background-color: #e9ecef; width: 14%;">Status</th>
            <th style="border: 1px solid #ddd; padding: 6px; text-align: left; background-color: #e9ecef; width: 15%;">Borrowed Date</th>
            <th style="border: 1px solid #ddd; padding: 6px; text-align: left; background-color: #e9ecef; width: 15%;">Return Date</th>
          </tr>
          ${item.equipment.map(equip => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 6px; width: 14%;">${equip.equipment.name}</td>
              <td style="border: 1px solid #ddd; padding: 6px; width: 14%;">${equip.equipment.serialNumber}</td>
              <td style="border: 1px solid #ddd; padding: 6px; width: 14%;">${equip.equipment.model}</td>
              <td style="border: 1px solid #ddd; padding: 6px; width: 14%;">${equip.equipment.category}</td>
              <td style="border: 1px solid #ddd; padding: 6px; width: 14%;">${equip.status}</td>
              <td style="border: 1px solid #ddd; padding: 6px; width: 15%;">${new Date(equip.borrowDate).toLocaleDateString()}</td>
              <td style="border: 1px solid #ddd; padding: 6px; width: 15%;">${new Date(equip.returnDate).toLocaleDateString()}</td>
            </tr>
          `).join('')}
        `;

        equipmentCell.appendChild(equipmentTable);
        equipmentRow.appendChild(equipmentCell);
        mainTable.appendChild(equipmentRow);
      }
    });

    printContent.appendChild(mainTable);

    // Create print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Borrowed Items Report</title>
          <style>
            @page {
              size: landscape;
            }
            @media print {
              body {
                padding: 20px;
              }
              table {
                page-break-inside: auto;
              }
              tr {
                page-break-inside: avoid;
                page-break-after: auto;
              }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleResetDateFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Borrowed Items Report</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage and track all borrowed equipment
                </p>
              </div>
              <div className="flex items-center gap-4">
                {/* Add toggle switch before print button */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Include Equipment Details</span>
                  <button
                    onClick={() => setIncludeEquipmentDetails(!includeEquipmentDetails)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${includeEquipmentDetails ? 'bg-blue-600' : 'bg-gray-200'}
                    `}
                    role="switch"
                    aria-checked={includeEquipmentDetails}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${includeEquipmentDetails ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Print report"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print Report
                </button>
              </div>
            </div>

            {/* Add Date Filter Section */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {/* Status Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {filterButtons.map(button => (
                  <button
                    key={button.value}
                    onClick={() => setActiveFilter(button.value)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                      ${activeFilter === button.value 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}
                    `}
                    aria-label={`Filter by ${button.label}`}
                  >
                    {button.label}
                  </button>
                ))}
              </div>

              {/* Date Filter Section */}
              <div className="flex items-center gap-2 ml-auto">
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Start date"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="End date"
                  />
                  <button
                    onClick={handleResetDateFilter}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
                    aria-label="Reset date filter"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* DataTable Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading data...</p>
                </div>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={filteredItems}
                pagination
                responsive
                highlightOnHover
                striped
                customStyles={{
                  headRow: {
                    style: {
                      backgroundColor: '#F9FAFB',
                      fontSize: '0.875rem',
                      color: '#374151',
                      fontWeight: '600',
                    },
                  },
                  rows: {
                    style: {
                      fontSize: '0.875rem',
                      color: '#1F2937',
                      '&:hover': {
                        backgroundColor: '#F3F4F6',
                      },
                    },
                  },
                }}
              />
            )}
          </div>

          {/* Equipment Details Modal */}
          <EquipmentDetails
            isOpen={equipmentModalOpen}
            onClose={() => setEquipmentModalOpen(false)}
            equipmentDetails={equipmentDetails}
            setEquipmentDetails={setEquipmentDetails}
          />
        </main>
      </div>
    </div>
  );
};

export default Report;