import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditDatesModal = ({
  isOpen,
  onClose,
  onConfirm,
  initialBorrowDate,
  initialReturnDate,
  borrowedDates,
  itemId,
  version
}) => {
  if (!isOpen) return null;

  const [borrowDate, setBorrowDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [currentVersion, setCurrentVersion] = useState(version);

  useEffect(() => {
    if (initialBorrowDate) {
      const date = new Date(initialBorrowDate);
      setBorrowDate(date);
    }
    if (initialReturnDate) {
      const date = new Date(initialReturnDate);
      setReturnDate(date);
    }
  }, [initialBorrowDate, initialReturnDate]);

  useEffect(() => {
    console.log("Borrowed Dates:", borrowedDates);
  }, [borrowedDates]);

  const isDateDisabled = (date) => {
    return borrowedDates.some((borrowedItem) => {
      if (!Array.isArray(borrowedItem.equipment)) return false;

      return borrowedItem.equipment.some((equipmentItem) => {
        // Skip current booking
        if (
          equipmentItem.borrowDate === initialBorrowDate &&
          equipmentItem.returnDate === initialReturnDate
        ) {
          return false;
        }

        if (
          equipmentItem.equipment?._id === itemId &&
          (equipmentItem.status === "Pending" ||
            equipmentItem.status === "Approved")
        ) {
          const bookingStart = new Date(equipmentItem.borrowDate);
          const bookingEnd = new Date(equipmentItem.returnDate);

          // Set time to start of day for comparison
          date.setHours(0, 0, 0, 0);
          bookingStart.setHours(0, 0, 0, 0);
          bookingEnd.setHours(0, 0, 0, 0);

          return date >= bookingStart && date <= bookingEnd;
        }
        return false;
      });
    });
  };

  const highlightWithRanges = (date) => {
    const isHighlighted = borrowedDates.some((borrowedItem) => {
      if (!Array.isArray(borrowedItem.equipment)) return false;

      return borrowedItem.equipment.some((equipmentItem) => {
        // Skip current booking
        if (
          equipmentItem.borrowDate === initialBorrowDate &&
          equipmentItem.returnDate === initialReturnDate
        ) {
          return false;
        }

        if (
          equipmentItem.equipment?._id === itemId &&
          (equipmentItem.status === "Pending" ||
            equipmentItem.status === "Approved")
        ) {
          const bookingStart = new Date(equipmentItem.borrowDate);
          const bookingEnd = new Date(equipmentItem.returnDate);

          // Set time to start of day for comparison
          const compareDate = new Date(date);
          compareDate.setHours(0, 0, 0, 0);
          bookingStart.setHours(0, 0, 0, 0);
          bookingEnd.setHours(0, 0, 0, 0);

          return compareDate >= bookingStart && compareDate <= bookingEnd;
        }
        return false;
      });
    });
    return isHighlighted ? "highlight-red" : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (borrowDate && returnDate) {
      try {
        await onConfirm(
          borrowDate.toISOString(), 
          returnDate.toISOString(),
          currentVersion
        );
        setCurrentVersion(prev => prev + 1);
      } catch (error) {
        if (error.status === 409) {
          alert('This item was updated by someone else. Please refresh and try again.');
          onClose();
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Dates</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Borrow Date
              </label>
              <DatePicker
                selected={borrowDate}
                onChange={(date) => setBorrowDate(date)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                minDate={new Date()}
                filterDate={(date) => !isDateDisabled(date)}
                dayClassName={highlightWithRanges}
                inline
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Return Date
              </label>
              <DatePicker
                selected={returnDate}
                onChange={(date) => setReturnDate(date)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                minDate={borrowDate || new Date()}
                filterDate={(date) => !isDateDisabled(date)}
                dayClassName={highlightWithRanges}
                inline
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <style jsx global>{`
        .highlight-red {
          background-color: #ffcccc !important;
          color: #666 !important;
          border-bottom: 2px solid red !important;
        }

        .react-datepicker__day--disabled {
          color: #ccc !important;
          cursor: not-allowed !important;
          text-decoration: line-through !important;
        }

        .react-datepicker__day:hover {
          background-color: #f0f0f0 !important;
        }
      `}</style>
    </div>
  );
};

export default EditDatesModal;
