import Equipment from "../models/equipment.js";

// Get all non-archived equipment
const getEquipments = async (req, res) => {
    try {
        const equipment = await Equipment.find({ isArchived: { $ne: true } })
            .select('+version'); // Explicitly include version field
        
        // Ensure each equipment has a version field
        const equipmentWithVersions = equipment.map(item => ({
            ...item.toObject(),
            version: item.version || 0
        }));
        
        res.send(equipmentWithVersions);
    } catch (error) {
        console.error('Fetch error:', error);
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
        const equipment = new Equipment({
            ...req.body,
            version: 0 // Initialize version for new equipment
        });
        const savedEquipment = await equipment.save();
        res.status(201).json(savedEquipment);
    } catch (error) {
        console.error('Create error:', error);
        res.status(500).json({ message: "Failed to create equipment", error: error.message });
    }
};

const deleteEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.equipment_id);
        if (!equipment) {
            return res.status(404).json({ message: "Equipment not found" });
        }

        // Archive the equipment
        equipment.isArchived = true;
        await equipment.save();

        res.status(200).json({ message: "Equipment archived successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to archive equipment" });
    }
};

// Update equipment by ID
const updateEquipment = async (req, res) => {
    try {
        const { version, ...updateData } = req.body;
        
        // First, verify if the equipment exists and check its current version
        const currentEquipment = await Equipment.findById(req.params.equipment_id);
        
        if (!currentEquipment) {
            return res.status(404).json({ message: "Equipment not found" });
        }

        // Log versions for debugging
        console.log('Current version in DB:', currentEquipment.version);
        console.log('Received version from client:', version);

        // Compare versions
        if (currentEquipment.version !== version) {
            return res.status(409).json({ 
                message: "Equipment has been modified by another user. Please refresh and try again.",
                currentVersion: currentEquipment.version
            });
        }

        // If versions match, update the equipment and increment version
        const updatedEquipment = await Equipment.findByIdAndUpdate(
            req.params.equipment_id,
            {
                ...updateData,
                version: version + 1 // Increment version
            },
            { new: true }
        );

        res.status(200).json(updatedEquipment);
    } catch (error) {
        console.error('Update error:', error);
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
