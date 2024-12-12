import Equipment from "../models/equipment.js";

// Get all equipment
const getEquipments = async (req, res) => {
    try {
        const equipment = await Equipment.find();
        res.send(equipment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get a single equipment by ID
const getEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.equipment_id);
        if (!equipment) {
            return res.status(404).json({ message: "Equipment not found" });
        }
        res.send(equipment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Create a new equipment
const postEquipment = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const equipment = new Equipment(req.body);
        const savedEquipment = await equipment.save();
        res.status(201).json(savedEquipment);
    } catch (error) {
        console.error('Error creating equipment:', error);
        res.status(500).json({ message: "Failed to create equipment", error: error.message });
    }
};

// Delete equipment by ID
const deleteEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findByIdAndDelete(req.params.equipment_id);
        if (!equipment) {
            return res.status(404).json({ message: "Equipment not found" });
        }
        res.status(200).json({ message: "Equipment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete equipment" });
    }
};

// Update equipment by ID
const updateEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.equipment_id);
        
        if (!equipment) {
            return res.status(404).json({ message: "Equipment not found" });
        }

        // Update fields with provided data or keep existing values
        equipment.name = req.body.name || equipment.name;
        equipment.description = req.body.description || equipment.description;
        equipment.image = req.body.image || equipment.image;
        equipment.availabilityStatus = req.body.availabilityStatus || equipment.availabilityStatus;
        equipment.category = req.body.category || equipment.category;
        equipment.serialNumber = req.body.serialNumber || equipment.serialNumber;
        equipment.model = req.body.model || equipment.model;
       

        // Save the updated equipment
        const updatedEquipment = await equipment.save();
        res.status(200).json(updatedEquipment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to update equipment" });
    }
};

export { 
    getEquipments, 
    getEquipment, 
    postEquipment, 
    deleteEquipment, 
    updateEquipment 
};
