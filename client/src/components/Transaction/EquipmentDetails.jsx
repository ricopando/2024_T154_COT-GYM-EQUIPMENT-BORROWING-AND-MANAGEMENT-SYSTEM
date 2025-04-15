import React, { useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { FaEye } from "react-icons/fa";
import ImageModal from "./ImageModal";

const EquipmentDetails = ({ isOpen, onClose, equipmentDetails, toast }) => {
  if (!isOpen) return null;

  // Define the state for image modal open
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState("");

  // Ensure equipmentDetails is properly formatted
  const formattedEquipmentDetails = Array.isArray(equipmentDetails)
    ? equipmentDetails.map((item) => ({
        id: item.id || item._id,
        name: item.name || item.equipment?.name || "N/A",
        serialNumber:
          item.serialNumber || item.equipment?.serialNumber || "N/A",
        category: item.category || item.equipment?.category || "N/A",
        status: item.status || "Pending",
        image: item.image || item.equipment?.image,
      }))
    : [];

  const openImageModal = (imageUrl) => {
    if (!imageUrl) {
      toast.error("No image available");
      return;
    }
    setCurrentImageUrl(imageUrl);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setCurrentImageUrl("");
    setImageModalOpen(false);
  };

  const columns = [
    {
      name: "Equipment Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => <span className="text-gray-900">{row.name}</span>,
    },
    {
      name: "Serial Number",
      selector: (row) => row.serialNumber,
      sortable: true,
      cell: (row) => <span className="text-gray-900">{row.serialNumber}</span>,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
      cell: (row) => <span className="text-gray-900">{row.category}</span>,
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
      name: "Image",
      cell: (row) => {
        const imageUrl = row.image;
        return (
          <button
            onClick={() => openImageModal(imageUrl)}
            className={`text-blue-600 hover:text-blue-800 ${
              !imageUrl ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!imageUrl}
          >
            <FaEye />
          </button>
        );
      },
      ignoreRowClick: true,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Equipment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="sr-only">Close</span>
            &times;
          </button>
        </div>

        <DataTable
          columns={columns}
          data={formattedEquipmentDetails}
          pagination
          highlightOnHover
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

        {/* Image Modal */}
        <ImageModal
          isOpen={imageModalOpen}
          onClose={closeImageModal}
          imageUrl={currentImageUrl}
        />
      </div>
    </div>
  );
};

export default EquipmentDetails;
