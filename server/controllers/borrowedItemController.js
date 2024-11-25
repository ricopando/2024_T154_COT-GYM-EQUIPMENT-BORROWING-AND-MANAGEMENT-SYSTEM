import BorrowedItem from "../models/borrowedItem.js";
import Equipment from "../models/equipment.js";

// Get all borrowed items for the authenticated user
const getBorrowedItems = async (req, res) => {
    try {
        // Remove user filter to fetch all borrowed items
        const borrowedItems = await BorrowedItem.find()
            .populate('user', 'displayName email')
            .populate('equipment');
        
        const itemsWithUserName = borrowedItems.map(item => ({
            ...item.toObject(),
            userName: item.user.displayName
        }));

        res.status(200).json(itemsWithUserName);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
  
};

// Get borrowed item by ID
const getBorrowedItem = async (req, res) => {
    try {
        const borrowedItem = await BorrowedItem.findById(req.params.id)
            .populate('user', 'displayName email')
            .populate('equipment');
        
        if (!borrowedItem) {
            return res.status(404).json({ message: "Borrowed item not found" });
        }

        // Include user's name in the response
        const itemWithUserName = {
            ...borrowedItem.toObject(),
            userName: borrowedItem.user.displayName
        };

        res.status(200).json(itemWithUserName);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Return borrowed item
const returnBorrowedItem = async (req, res) => {
    try {
        const borrowedItem = await BorrowedItem.findById(req.params.id);
        if (!borrowedItem) {
            return res.status(404).json({ message: "Borrowed item not found" });
        }

        if (borrowedItem.status === 'Returned') {
            return res.status(400).json({ message: "Item already returned" });
        }

        borrowedItem.status = 'Returned';
        await borrowedItem.save();

        // Update equipment availability status
        await Equipment.findByIdAndUpdate(borrowedItem.equipment, {
            availabilityStatus: 'Available'
        });

        res.status(200).json(borrowedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to return item" });
    }
};

// Add this new controller function
const createBorrowedItem = async (req, res) => {
    try {
        const { equipmentId, borrowDate, returnDate, status, borrowListId } = req.body;
        
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // Create new borrowed item
        const borrowedItem = await BorrowedItem.create({
            user: req.user._id,
            equipment: equipmentId,
            borrowDate,
            returnDate,
            status
        });

        // Update equipment availability
        await Equipment.findByIdAndUpdate(equipmentId, {
            availabilityStatus: 'Borrowed'
        });

        // Populate the response
        const populatedItem = await BorrowedItem.findById(borrowedItem._id)
            .populate('user', 'name email')
            .populate('equipment');

        res.status(201).json(populatedItem);
    } catch (error) {
        console.error('Error creating borrowed item:', error);
        res.status(500).json({ message: "Failed to create borrowed item" });
    }
};
export const updateBorrowedItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedItem = await BorrowedItem.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update item status', error });
  }
};

// Get all borrowed items for a specific user
const getBorrowedItemsByUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const borrowedItems = await BorrowedItem.find({ user: req.user._id })
            .populate('user', 'displayName email')
            .populate('equipment');
        
        // Map through borrowedItems to include user's name in the response
        const itemsWithUserName = borrowedItems.map(item => ({
            ...item.toObject(),
            userName: item.user.displayName
        }));

        res.status(200).json(itemsWithUserName);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete borrowed item by ID
const deleteBorrowedItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedItem = await BorrowedItem.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json({ message: "Item successfully deleted" });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: "Failed to delete item" });
    }
};

export {
    getBorrowedItems,
    getBorrowedItem,
    returnBorrowedItem,
    createBorrowedItem,
    getBorrowedItemsByUser,
    deleteBorrowedItem
};
