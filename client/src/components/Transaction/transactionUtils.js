// utils/transactionUtils.js
import axios from "axios";
import { toast } from "react-hot-toast";

export const handleDeleteTransaction = async (itemId, setBorrowedItems, setDeleteLoading) => {
  if (!itemId) {
    console.error("Invalid itemId:", itemId);
    toast.error("Invalid transaction ID.");
    return;
  }

  console.log("Attempting to delete item with ID:", itemId);

  setDeleteLoading(true);
  try {
    const response = await axios.delete(`http://localhost:8000/api/borrow-items/${itemId}`, {
      withCredentials: true,
    });

    if (response.status === 200) {
      setBorrowedItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
      toast.success("Transaction successfully deleted.");
    } else {
      toast.error("Failed to delete transaction.");
    }
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    toast.error("Failed to delete transaction.");
  } finally {
    setDeleteLoading(false);
  }
};

// Add other utility functions here...