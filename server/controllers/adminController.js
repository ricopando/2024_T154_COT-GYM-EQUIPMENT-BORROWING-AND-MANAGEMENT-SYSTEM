import adminRecords from '../model/admin.js'; // Import the admin records data

// Get all admin records
const getAdmins = (req, res) => {
    try {
        res.status(200).json(adminRecords); // Return the list of admin records
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a single admin record by personnelId
const getAdminById = (req, res) => {
    try {
        const admin = adminRecords.find(a => a.personnelId === req.params.id); // Find admin record by personnelId
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        res.status(200).json(admin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Create a new admin record
const createAdmin = (req, res) => {
    const newAdmin = { personnelId: (adminRecords.length + 1).toString(), ...req.body }; // Create new admin record
    adminRecords.push(newAdmin); // Add new admin record to the array
    res.status(201).json(newAdmin);
};

// Update an existing admin record by personnelId
const updateAdmin = (req, res) => {
    try {
        const index = adminRecords.findIndex(a => a.personnelId === req.params.id); // Find index of admin record
        if (index === -1) {
            return res.status(404).json({ message: "Admin not found" });
        }
        adminRecords[index] = { ...adminRecords[index], ...req.body }; // Update admin record details
        res.status(200).json(adminRecords[index]);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Error updating admin record" });
    }
};

// Delete an admin record by personnelId
const deleteAdmin = (req, res) => {
    try {
        const index = adminRecords.findIndex(a => a.personnelId === req.params.id); // Find index of admin record
        if (index === -1) {
            return res.status(404).json({ message: "Admin not found" });
        }
        adminRecords.splice(index, 1); // Remove admin record from the array
        res.status(200).json({ message: "Admin record deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { getAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin };
