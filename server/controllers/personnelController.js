import personnel from '../model/personnel.js'; // Import the personnel data

// Get all personnel
const getPersonnel = (req, res) => {
    try {
        res.status(200).json(personnel); // Send back the personnel data
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a single personnel by ID
const getPersonnelById = (req, res) => {
    try {
        const person = personnel.find(p => p.id === req.params.id); // Find personnel by ID
        if (!person) {
            return res.status(404).json({ message: "Personnel not found" });
        }
        res.status(200).json(person);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Create a new personnel
const createPersonnel = (req, res) => {
    const newPersonnel = { id: (personnel.length + 1).toString(), ...req.body, createdAt: new Date(), updatedAt: new Date() };
    personnel.push(newPersonnel); // Add new personnel to the array
    res.status(201).json(newPersonnel);
};

// Update an existing personnel by ID
const updatePersonnel = (req, res) => {
    try {
        const index = personnel.findIndex(p => p.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ message: "Personnel not found" });
        }
        personnel[index] = { ...personnel[index], ...req.body, updatedAt: new Date() }; // Update personnel details
        res.status(200).json(personnel[index]);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error updating personnel" });
    }
};

// Delete a personnel by ID
const deletePersonnel = (req, res) => {
    try {
        const index = personnel.findIndex(p => p.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ message: "Personnel not found" });
        }
        personnel.splice(index, 1); // Remove personnel from the array
        res.status(200).json({ message: "Personnel deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { getPersonnel, getPersonnelById, createPersonnel, updatePersonnel, deletePersonnel };
