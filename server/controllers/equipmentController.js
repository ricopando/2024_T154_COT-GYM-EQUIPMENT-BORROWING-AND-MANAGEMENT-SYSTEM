import equipment from '../model/equipment.js'; // Import the equipment data

// Get all equipment
const getEquipment = (req, res) => {
    try {
        res.status(200).json(equipment); // Return the list of equipment
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a single equipment by ID
const getEquipmentById = (req, res) => {
    try {
        const equip = equipment.find(e => e.id === req.params.id); // Find equipment by ID
        if (!equip) {
            return res.status(404).json({ message: "Equipment not found" });
        }
        res.status(200).json(equip);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Create a new equipment
const createEquipment = (req, res) => {
    const newEquipment = { id: (equipment.length + 1).toString(), ...req.body, createdAt: new Date(), updatedAt: new Date() };
    equipment.push(newEquipment); // Add new equipment to the array
    res.status(201).json(newEquipment);
};

// Update an existing equipment by ID
const updateEquipment = (req, res) => {
    try {
        const index = equipment.findIndex(e => e.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ message: "Equipment not found" });
        }
        equipment[index] = { ...equipment[index], ...req.body, updatedAt: new Date() }; // Update equipment details
        res.status(200).json(equipment[index]);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error updating equipment" });
    }
};

// Delete an equipment by ID
const deleteEquipment = (req, res) => {
    try {
        const index = equipment.findIndex(e => e.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ message: "Equipment not found" });
        }
        equipment.splice(index, 1); // Remove equipment from the array
        res.status(200).json({ message: "Equipment deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { getEquipment, getEquipmentById, createEquipment, updateEquipment, deleteEquipment };
