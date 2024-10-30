import Furniture from "../models/furniture.js";

const getFurnitures = async (req, res) => {
    try {
        const furnitures = await Furniture.find();
        res.send(furnitures);
    } catch (error) {
        console.log(error);
    }
}

const getFurniture = async (req, res) => {
    try {
        const furniture = await Furniture.findById(req.params.furniture_id);
        res.send(furniture);
    } catch (error) {
        console.log(error);
    }
}

const postFurniture = async (req, res) => {
    try {
        const furniture = new Furniture(req.body);
        const savedFurniture = await furniture.save();
        res.status(200).json(savedFurniture);
    } catch (error) {
        console.log(error);
    }
}

const deleteFurniture = async (req, res) => {
    try {
        const furniture = await Furniture.findByIdAndDelete(req.params.furniture_id);
        if (!furniture) {
            return res.status(404).json({ message: "Furniture not found" });
        }

        res.status(200).json({ message: "Furniture deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to delete furniture" });
    }
}

const updateFurniture = async (req, res) => {
    try {
        const furniture = await Furniture.findById(req.params.furniture_id);
        if (!furniture) {
            return res.status(404).json({ message: "Furniture not found" });
        }

        furniture.name = req.body.name || furniture.name;
        furniture.description = req.body.description || furniture.description;
        furniture.image = req.body.image || furniture.image;
        furniture.availabilityStatus = req.body.availabilityStatus || furniture.availabilityStatus;

        const updatedFurniture = await furniture.save();
        res.status(200).json(updatedFurniture);
    } catch (error) {
        console.log(error);
    }
}

export { getFurnitures, getFurniture, postFurniture, deleteFurniture, updateFurniture };
