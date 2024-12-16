import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";

// Separate component for loading state
const LoadingState = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded shadow-lg flex items-center space-x-4">
      <svg
        className="animate-spin h-5 w-5 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <span className="text-lg font-medium">Loading...</span>
    </div>
  </div>
);

// Separate component for empty state
const EmptyState = () => (
  <div className="flex justify-center items-center min-h-[60vh] bg-gray-100">
    <div
      data-aos="fade-up"
      className="p-6 mt-1 text-center bg-white rounded shadow max-w-sm"
    >
      <div className="mb-3 p-2 bg-gray-50 rounded-full inline-flex">
        <svg
          className="w-12 h-12 text-blue-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V7h2v2z" />
        </svg>
      </div>
      <h5 className="font-bold">No Active Borrow List</h5>
      <p className="text-gray-600">Start by adding items to your borrow list</p>
    </div>
  </div>
);

// Separate component for item card
const ItemCard = ({ item, onOpenDeleteDialog }) => (
  <div className="flex flex-col transition-transform transform hover:-translate-y-1 shadow rounded overflow-hidden">
    <img
      src={item.equipment?.image || "https://via.placeholder.com/400"}
      alt={item.equipment?.name}
      className="object-contain bg-gray-100 h-60"
    />
    <div className="flex-grow p-3">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h6 className="font-bold">{item.equipment?.name}</h6>
          <span className="text-sm text-balck border border-primary rounded px-2">
            {item.equipment?.category}
          </span>
        </div>
        <button
          onClick={() => onOpenDeleteDialog(item._id)}
          className="text-red-500 hover:bg-red-100 p-1 rounded"
          aria-label="Delete item"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 2a1 1 0 00-1 1v1H3a1 1 0 000 2h1v9a2 2 0 002 2h8a2 2 0 002-2V6h1a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm3 3h2v9H9V5z" />
          </svg>
        </button>
      </div>
      <div className="flex gap-2 items-center bg-gray-50 p-2 rounded">
        <svg
          className="w-5 h-5 text-primary"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm0 2h8v2H6V4zm0 4h8v8H6V8z" />
        </svg>
        <div>
          <p className="text-sm font-medium">
            From: {new Date(item.startDate).toLocaleDateString()}
          </p>
          <p className="text-sm font-medium">
            To: {new Date(item.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Add this component near your other component definitions
const SuccessDeleteModal = ({ onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl transform transition-all duration-300 ease-in-out max-w-md w-full mx-4">
      <div className="flex flex-col items-center text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Successfully Deleted!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          The item has been removed from your borrow list.
        </p>

        {/* Button */}
        <button
          onClick={onClose}
          className="bg-primary text-white font-semibold py-2 px-6 rounded-lg 
          transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 
          focus:ring-primary focus:ring-opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  </div>
);

const SubmitSuccessModal = ({ onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl transform transition-all duration-300 ease-in-out max-w-md w-full mx-4">
      <div className="flex flex-col items-center text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Successfully Submitted!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Your borrow list has been submitted successfully.
        </p>

        {/* Button */}
        <button
          onClick={onClose}
          className="bg-primary text-white font-semibold py-2 px-6 rounded-lg 
          transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 
          focus:ring-primary focus:ring-opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  </div>
);

const BorrowList = () => {
  const [borrowList, setBorrowList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showSuccessDelete, setShowSuccessDelete] = useState(false);
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);

  const navigate = useNavigate();

  const fetchBorrowList = async () => {
    try {
      console.log("Fetching borrow list...");
      const response = await axios.get(
        "http://localhost:8000/api/borrow-lists",
        {
          withCredentials: true,
        }
      );
      console.log("Response received:", response.data);

      const activeLists = response.data.filter(
        (list) => list.status === "Draft"
      );
      if (activeLists.length > 0) {
        const listWithEquipment = await Promise.all(
          activeLists[0].items.map(async (item) => {
            const equipmentResponse = await axios.get(
              `http://localhost:8000/api/equipment/${item.equipment._id}`,
              { withCredentials: true }
            );
            return {
              ...item,
              equipment: equipmentResponse.data,
              startDate: item.borrowDate,
              endDate: item.returnDate,
            };
          })
        );

        setBorrowList({
          ...activeLists[0],
          items: listWithEquipment,
        });
      } else {
        console.log("No active borrow lists found.");
        setBorrowList(null);
      }
    } catch (error) {
      console.error("Error fetching borrow list:", error);
      handleError(error, "Failed to load borrow list");
      setBorrowList(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowList();
    AOS.init();
  }, []);

  const handleRemoveItem = async (itemId) => {
    if (isRemoving) return;
    setIsRemoving(true);

    const updatedItems = borrowList.items.filter((item) => item._id !== itemId);
    setBorrowList((prevState) => ({
      ...prevState,
      items: updatedItems,
    }));

    try {
      if (updatedItems.length === 0) {
        await axios.delete(
          `http://localhost:8000/api/borrow-lists/${borrowList._id}`,
          {
            withCredentials: true,
          }
        );
        setBorrowList(null);
        toast.success("Borrow list deleted successfully");
      } else {
        await axios.put(
          `http://localhost:8000/api/borrow-lists/${borrowList._id}`,
          {
            items: updatedItems,
          },
          { withCredentials: true }
        );
        toast.success("Item removed successfully");
      }
    } catch (error) {
      handleError(error, "Unable to remove item. Please try again.");
      setBorrowList((prevState) => ({
        ...prevState,
        items: [...prevState.items],
      }));
    } finally {
      setIsRemoving(false);
    }
  };

  const handleOpenConfirmDialog = () => setOpenConfirmDialog(true);
  const handleCloseConfirmDialog = () => setOpenConfirmDialog(false);

  const handleOpenDeleteDialog = (itemId) => {
    setItemToDelete(itemId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setItemToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      await handleRemoveItem(itemToDelete);
      handleCloseDeleteDialog();
      setShowSuccessDelete(true); // Show success modal after deletion
    }
  };

  const handleSubmitList = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      setLoading(true);

      const submitResponse = await axios.post(
        `http://localhost:8000/api/borrow-lists/${borrowList._id}/submit`,
        {},
        { withCredentials: true }
      );

      const createBorrowedItems = await axios.post(
        "http://localhost:8000/api/borrow-items",
        {
          equipmentIds: borrowList.items.map((item) => item.equipment._id),
          borrowDate: borrowList.items[0].startDate,
          returnDate: borrowList.items[0].endDate,
          status: "Pending",
        },
        { withCredentials: true }
      );

      const deleteList = await axios.delete(
        `http://localhost:8000/api/borrow-lists/${borrowList._id}`,
        { withCredentials: true }
      );

      toast.success("Borrow list submitted and deleted successfully");
      setBorrowList(null);
      handleCloseConfirmDialog();
      setShowSubmitSuccess(true); // Show success modal after submission
    } catch (error) {
      handleError(error, "Failed to submit borrow list");
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 relative">
      <Navbar className="z-50" />
      <div className="container mx-auto px-4 pt-8">
        <div className="text-left mt-8 mb-16">
          <h1
            data-aos="fade-up"
            className="text-5xl font-bold text-gray-800 dark:text-white relative inline-block
            after:content-[''] after:block after:w-1/2 after:h-1 after:bg-primary
            after:mt-2 after:rounded-full"
          >
            BORROW LIST
          </h1>
        </div>
      </div>
      {!borrowList ? (
        <EmptyState />
      ) : (
        <div className="container mx-auto px-4">
          <div className="w-full bg-white rounded shadow border border-gray-200 flex flex-col">
            <div className="p-2 border-b border-gray-200 flex justify-between items-center">
              <span className="text-sm text-black-500 border border-primary rounded px-2">
                Draft
              </span>
            </div>
            <div className="p-2 overflow-y-auto">
              {borrowList.items.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {borrowList.items.map((item) => (
                    <ItemCard
                      key={item._id}
                      item={item}
                      onOpenDeleteDialog={handleOpenDeleteDialog}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="p-2 bg-gray-100 border-t border-gray-200 flex justify-end gap-2">
              {openConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full transition-transform transform scale-95">
                    <h2 className="text-lg font-bold mb-2">
                      Confirm Submission
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Are you sure you want to submit this borrow list? This
                      action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleCloseConfirmDialog}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitList}
                        className="px-4 py-2 bg-primary text-white rounded  transition"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Confirm"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {openDeleteDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full transition-transform transform scale-95">
                    <h2 className="text-lg font-bold mb-2">Confirm Deletion</h2>
                    <p className="text-gray-600 mb-4">
                      Are you sure you want to delete this item from your borrow
                      list? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleCloseDeleteDialog}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmDelete}
                        className="px-4 py-2 bg-primary text-white rounded transition"
                        disabled={isRemoving}
                      >
                        {isRemoving ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <button
                onClick={handleOpenConfirmDialog}
                className="px-4 py-2 bg-primary text-white rounded transition"
                disabled={borrowList.items.length === 0 || isSubmitting}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessDelete && (
        <SuccessDeleteModal onClose={() => setShowSuccessDelete(false)} />
      )}
      {showSubmitSuccess && (
        <SubmitSuccessModal onClose={() => setShowSubmitSuccess(false)} />
      )}
    </div>
  );
};

export default BorrowList;
