import BorrowList from "../models/borrowList.js";
import Equipment from "../models/equipment.js";

// Get all borrow lists
const getBorrowLists = async (req, res) => {
    try {
        console.log('Fetching borrow lists for user:', req.user._id);
        
        const borrowLists = await BorrowList.find({ user: req.user._id })
            .populate('user', 'name email')
            .populate('items.equipment')
            .populate('processedBy', 'name email');
            
        console.log('Found borrow lists:', borrowLists);
        
        res.status(200).json(borrowLists);
    } catch (error) {
        console.error('Error in getBorrowLists:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get borrow list by ID
const getBorrowList = async (req, res) => {
    try {
        const borrowList = await BorrowList.findOne({ _id: req.params.id, user: req.user._id })
            .populate('user', 'name email')
            .populate('items.equipment')
            .populate('processedBy', 'name email');
        
        if (!borrowList) {
            return res.status(404).json({ message: "Borrow list not found" });
        }
        res.status(200).json(borrowList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Create new borrow list
const createBorrowList = async (req, res) => {
    try {
        const borrowList = new BorrowList({
            user: req.user._id, // Assuming you have user info in request
            items: req.body.items,
            status: 'Draft'
        });

        const savedBorrowList = await borrowList.save();
        res.status(201).json(savedBorrowList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create borrow list" });
    }
};

// Update borrow list
const updateBorrowList = async (req, res) => {
    try {
        const borrowList = await BorrowList.findById(req.params.id);
        if (!borrowList) {
            return res.status(404).json({ message: "Borrow list not found" });
        }

        // Only allow updates if status is Draft
        if (borrowList.status !== 'Draft') {
            return res.status(400).json({ message: "Cannot update submitted borrow list" });
        }

        borrowList.items = req.body.items || borrowList.items;
        const updatedBorrowList = await borrowList.save();
        res.status(200).json(updatedBorrowList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update borrow list" });
    }
};

// Submit borrow list
const submitBorrowList = async (req, res) => {
    try {
        const borrowList = await BorrowList.findById(req.params.id);
        if (!borrowList) {
            return res.status(404).json({ message: "Borrow list not found" });
        }

        if (borrowList.status !== 'Draft') {
            return res.status(400).json({ message: "Borrow list already submitted" });
        }

        borrowList.status = 'Submitted';
        borrowList.submittedAt = new Date();
        const updatedBorrowList = await borrowList.save();
        res.status(200).json(updatedBorrowList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to submit borrow list" });
    }
};

// Process borrow list (Approve/Reject)
const processBorrowList = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const borrowList = await BorrowList.findById(req.params.id);
        if (!borrowList) {
            return res.status(404).json({ message: "Borrow list not found" });
        }

        if (borrowList.status !== 'Submitted') {
            return res.status(400).json({ message: "Can only process submitted borrow lists" });
        }

        borrowList.status = status;
        borrowList.processedAt = new Date();
        borrowList.processedBy = req.user._id;

        
        // Update equipment availability status for all items in the list
        for (const item of borrowList.items) {
            await Equipment.findByIdAndUpdate(item.equipment, {
                availabilityStatus: 'Borrowed'
            });
        }

        // Save updated borrow list status
        const updatedBorrowList = await borrowList.save();
        res.status(200).json(updatedBorrowList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to process borrow list" });
    }
};

// Delete borrow list
const deleteBorrowList = async (req, res) => {
    try {
        const borrowList = await BorrowList.findById(req.params.id);
        
        if (!borrowList) {
            return res.status(404).json({ message: "Borrow list not found" });
        }

       

        await BorrowList.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Borrow list deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete borrow list" });
    }
};

export {
    getBorrowLists,
    getBorrowList,
    createBorrowList,
    updateBorrowList,
    submitBorrowList,
    processBorrowList,
    deleteBorrowList
};