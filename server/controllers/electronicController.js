import Electronic from "../models/electronic.js";

const getElectronics = async (req, res) => {
    try {
        const electronics = await Electronic.find();
        res.send(electronics);
    } catch (error) {
        console.log(error);
    }
}

const getElectronic = async (req, res) => {
    try {
        const electronic = await Electronic.findById(req.params.electronic_id);
        res.send(electronic);
    } catch (error) {
        console.log(error);
    }
}

const postElectronic = async (req, res) => {
    try {
        const electronic = new Electronic(req.body);
        const savedElectronic = await electronic.save();
        res.status(200).json(savedElectronic);
    } catch (error) {
        console.log(error);
    }
}

const deleteElectronic = async (req, res) => {
    try {
        const electronic = await Electronic.findByIdAndDelete(req.params.electronic_id);
        if (!electronic) {
            return res.status(404).json({ message: "Electronic item not found" });
        }

        res.status(200).json({ message: "Electronic item deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to delete electronic item" });
    }
}

const updateElectronic = async (req, res) => {
    try {
        const electronic = await Electronic.findById(req.params.electronic_id);
        if (!electronic) {
            return res.status(404).json({ message: "Electronic item not found" });
        }

        electronic.name = req.body.name || electronic.name;
        electronic.description = req.body.description || electronic.description;
        electronic.image = req.body.image || electronic.image;
        electronic.availabilityStatus = req.body.availabilityStatus || electronic.availabilityStatus;

        const updatedElectronic = await electronic.save();
        res.status(200).json(updatedElectronic);
    } catch (error) {
        console.log(error);
    }
}

export { getElectronics, getElectronic, postElectronic, deleteElectronic, updateElectronic };
