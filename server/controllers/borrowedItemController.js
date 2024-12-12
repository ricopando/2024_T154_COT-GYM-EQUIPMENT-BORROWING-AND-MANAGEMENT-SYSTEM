import BorrowedItem from "../models/borrowedItem.js";
import Equipment from "../models/equipment.js";


// Get all borrowed items for the authenticated user
const getBorrowedItems = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const borrowedItems = await BorrowedItem.find()
            .populate('user', 'displayName email')
            .populate('items.equipment', 'name serialNumber image model category createdAt status borrowDate returnDate availabilityStatus');
        
        // Transform the borrowed items into an array of objects
        const itemsArray = borrowedItems.map(item => ({
            item: item._id,
            equipment: item.items.map(i => ({
                equipment: i.equipment,
                status: i.status,
                borrowDate: i.borrowDate,
                returnDate: i.returnDate,
                id: i._id,
                availabilityStatus: i.equipment.availabilityStatus
            })),
            status: item.status,
            createdAt: item.createdAt,
            user: {
                id: item.user._id,
                name: item.user.displayName,
                email: item.user.email
            }
        }));

        res.status(200).json(itemsArray);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get borrowed item by ID
const getBorrowedItem = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const borrowedItem = await BorrowedItem.findById(req.params.id)
            .populate('user', 'displayName email')
            .populate('items.equipment');
        
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
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
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
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const { equipmentIds, borrowDate, returnDate, status } = req.body;
  
        // Map through the equipmentIds to create multiple items in the items array
        const itemsArray = equipmentIds.map(equipmentId => ({
            equipment: equipmentId,
            borrowDate,
            returnDate,
            status
        }));
  
        // Create the BorrowedItem with all items
        const borrowedItem = await BorrowedItem.create({
            user: req.user._id,
            items: itemsArray  // Store all equipment items in the same BorrowedItem document
        });
  
        // Update equipment availability
        await Promise.all(
            equipmentIds.map(equipmentId =>
                Equipment.findByIdAndUpdate(equipmentId, { availabilityStatus: 'Borrowed' })
            )
        );
  
        // Populate the response with user and equipment data
        const populatedItem = await BorrowedItem.findById(borrowedItem._id)
            .populate('user', 'name email')
            .populate('items.equipment');
  
        res.status(201).json(populatedItem);  // Send back the created BorrowedItem
  
    } catch (error) {
        console.error('Error creating borrowed item:', error);
        res.status(500).json({ message: "Failed to create borrowed item" });
    }
};

// Update borrowed item status
const updateBorrowedItemStatus = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Find the borrowed item by its ID
        const borrowedItem = await BorrowedItem.findById(id);
        if (!borrowedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Update the status of the borrowed item
        borrowedItem.status = status;

        // Update the status of each equipment item in the array
        borrowedItem.items.forEach(item => {
            item.status = status;
        });

        // Save the updated borrowed item
        await borrowedItem.save();

        res.status(200).json(borrowedItem);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update item status', error });
    }
};

// Get all borrowed items for a specific user
const getBorrowedItemsByUser = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const borrowedItems = await BorrowedItem.find({ user: req.user._id })
            .populate('user', 'displayName email')
            .populate('items.equipment', 'name  serialNumber image model category');
        
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
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const { id } = req.params;
        console.log("Attempting to delete item with ID:", id);

        const deletedItem = await BorrowedItem.findByIdAndDelete(id);

        if (!deletedItem) {
            console.log("Item not found for ID:", id);
            return res.status(404).json({ message: "Item not found" });
        }

        console.log("Deleted item:", deletedItem);

        // Update the availability status of each equipment item to 'Available' if not borrowed by others
        await Promise.all(
            deletedItem.items.map(async (item) => {
                const isStillBorrowed = await BorrowedItem.exists({
                    'items.equipment': item.equipment,
                    'items.status': { $in: ['Borrowed', 'Pending', 'Approved'] }
                });

                if (!isStillBorrowed) {
                    await Equipment.findByIdAndUpdate(item.equipment, { availabilityStatus: 'Available' });
                }
            })
        );

        res.status(200).json({ message: "Item successfully deleted" });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ message: "Failed to delete item" });
    }
};

// Delete borrowed item from array
const deleteBorrowedItemFromArray = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const { borrowedItemId, itemId } = req.params;

        // Find the borrowed item by its ID
        const borrowedItem = await BorrowedItem.findById(borrowedItemId);
        if (!borrowedItem) {
            return res.status(404).json({ message: "Borrowed item not found" });
        }

        // Find the index of the item in the items array by its ID
        const itemIndex = borrowedItem.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in the borrowed item" });
        }

        // Remove the item from the items array
        const removedItem = borrowedItem.items.splice(itemIndex, 1)[0];

        // Ensure you are accessing the correct equipment ID
        const equipmentId = removedItem.equipment._id || removedItem.equipment;

        // Log the removed item
        console.log("Removed item:", removedItem);

        // Save the updated borrowed item
        await borrowedItem.save();

        // Check if the removed item is still borrowed in other transactions
        const isStillBorrowed = await BorrowedItem.exists({
            'items.equipment': equipmentId,
            'items.status': { $in: ['Borrowed', 'Pending', 'Approved'] }
        });

        // Update the equipment's availability status if it was borrowed and not part of any other transactions
        if (!isStillBorrowed) {
            await Equipment.findByIdAndUpdate(equipmentId, { availabilityStatus: 'Available' });
        }

        // If the items array is empty, delete the borrowed item document
        if (borrowedItem.items.length === 0) {
            await BorrowedItem.findByIdAndDelete(borrowedItemId);
            return res.status(200).json({ message: "Borrowed item document deleted as it has no items left" });
        }

        res.status(200).json({ message: "Item successfully removed", removedItem });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to remove item from borrowed item", error });
    }
};

// Update item status in array
const updateItemStatusInArray = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const { borrowedItemId, itemId } = req.params;
        const { status } = req.body;

        // Find the borrowed item by its ID
        const borrowedItem = await BorrowedItem.findById(borrowedItemId);
        if (!borrowedItem) {
            return res.status(404).json({ message: 'Borrowed item not found' });
        }

        // Find the index of the item in the items array by its ID
        const itemIndex = borrowedItem.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in the borrowed item' });
        }

        // Update the status of the specific item
        borrowedItem.items[itemIndex].status = status;

        // Check if all items are approved
        const allApproved = borrowedItem.items.every(item => item.status === 'Approved');
        if (allApproved) {
            borrowedItem.status = 'Approved';

            // Update the availability status of each equipment item to 'Borrowed'
            await Promise.all(
                borrowedItem.items.map(async (item) => {
                    await Equipment.findByIdAndUpdate(item.equipment, { availabilityStatus: 'Borrowed' });
                })
            );
        }

        // Save the updated borrowed item
        await borrowedItem.save();

        res.status(200).json(borrowedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update item status in array', error });
    }
};

const returnItemInArray = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const { borrowedItemId, itemId } = req.params;

        // Find the borrowed item by its ID
        const borrowedItem = await BorrowedItem.findById(borrowedItemId);
        if (!borrowedItem) {
            return res.status(404).json({ message: 'Borrowed item not found' });
        }

        // Find the index of the item in the items array by its ID
        const itemIndex = borrowedItem.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in the borrowed item' });
        }

        // Update the status of the specific item to 'Returned'
        borrowedItem.items[itemIndex].status = 'Returned';

        // Update the availability status of the equipment to 'Available'
        await Equipment.findByIdAndUpdate(borrowedItem.items[itemIndex].equipment, { availabilityStatus: 'Available' });

        // Check if all items are returned
        const allReturned = borrowedItem.items.every(item => item.status === 'Returned');
        if (allReturned) {
            borrowedItem.status = 'Returned';
        }

        // Save the updated borrowed item
        await borrowedItem.save();

        res.status(200).json(borrowedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to return item in array', error });
    }
};

// Get equipment history by equipment ID
const getEquipmentHistory = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    try {
        const { equipmentId } = req.params;
        console.log("Fetching history for equipment ID:", equipmentId);

        const history = await BorrowedItem.find({ 'items.equipment': equipmentId })
            .populate('user', 'displayName email')
            .populate('items.equipment', 'borrowDate returnDate status');

        console.log("Fetched history:", history);

        const historyData = history.map(item => ({
            item: item._id,
            equipment: item.items.map(i => ({
                equipment: i.equipment,
                status: i.status,
                borrowDate: i.borrowDate,
                returnDate: i.returnDate,
                id: i._id,
            availabilityStatus: i.equipment.availabilityStatus
        })),
        status: item.status,
        createdAt: item.createdAt,
        user: {
            id: item.user._id,
            name: item.user.displayName,
            email: item.user.email
        }
    }));

        console.log("Transformed history data:", historyData);

        res.status(200).json(historyData);
    } catch (error) {
        console.error("Error fetching equipment history:", error);
        res.status(500).json({ message: "Failed to fetch equipment history" });
    }
};




export {
    getBorrowedItems,
    getBorrowedItem,
    returnBorrowedItem,
    createBorrowedItem,
    getBorrowedItemsByUser,
    deleteBorrowedItem,
    deleteBorrowedItemFromArray,
    updateItemStatusInArray,
    updateBorrowedItemStatus,
    returnItemInArray,
    getEquipmentHistory
};