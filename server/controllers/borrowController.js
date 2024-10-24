import borrowRecords from '../model/borrow.js'; // Import the borrow records data

// Get all borrow records
const getBorrows = (req, res) => {
    try {
        res.status(200).json(borrowRecords); // Return the list of borrow records
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a single borrow record by ID
const getBorrowById = (req, res) => {
    try {
        const borrow = borrowRecords.find(b => b.id === req.params.id); // Find borrow record by ID
        if (!borrow) {
            return res.status(404).json({ message: "Borrow record not found" });
        }
        res.status(200).json(borrow);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Create a new borrow record
const createBorrow = (req, res) => {
    const newBorrow = { id: (borrowRecords.length + 1).toString(), ...req.body, createdAt: new Date(), updatedAt: new Date() };
    borrowRecords.push(newBorrow); // Add new borrow record to the array
    res.status(201).json(newBorrow);
};

// Update an existing borrow record by ID
const updateBorrow = (req, res) => {
    try {
        const index = borrowRecords.findIndex(b => b.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ message: "Borrow record not found" });
        }
        borrowRecords[index] = { ...borrowRecords[index], ...req.body, updatedAt: new Date() }; // Update borrow record details
        res.status(200).json(borrowRecords[index]);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error updating borrow record" });
    }
};

// Delete a borrow record by ID
const deleteBorrow = (req, res) => {
    try {
        const index = borrowRecords.findIndex(b => b.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ message: "Borrow record not found" });
        }
        borrowRecords.splice(index, 1); // Remove borrow record from the array
        res.status(200).json({ message: "Borrow record deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { getBorrows, getBorrowById, createBorrow, updateBorrow, deleteBorrow };
