import SportsEquipment from "../models/sportsEquipment.js"

const getSportsEquipments = async (req, res) => {
    try{
        const sportsEquipment = await SportsEquipment.find();
        res.send(sportsEquipment);
    }catch(error){
        console.log(error)
    }
}

const getSportsEquipment = async (req, res) => {
    try{
        const sportsEquipment = await SportsEquipment.findById(req.params.sportsEquipment_id)
        res.send(sportsEquipment);
    }catch(error){
        console.log(error);
    }
}

const postSportsEquipment = async (req, res) => {
    try{
        const sportsEquipment = new SportsEquipment(req.body);
        const savedSportsEquipment = await sportsEquipment.save();
        res.status(200).json(savedSportsEquipment);
    }catch(error){
        console.log(error);
    }
}

const deleteSportsEquipment = async (req, res) => {
    try{
        const sportsEquipment = await SportsEquipment.findByIdAndDelete(req.params.sportsEquipment_id)
        if(!sportsEquipment){
            return res.status(404).json({message: "sportsEquipment not found"});
        }

        res.status(200).json({message: "sportsEquipment deleted Successfully"})
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Failed to delete sportsEquipment"});
    }

}

const updateSportsEquipment = async (req, res) => {
    try{
        const sportsEquipment = await SportsEquipment.findById(req.params.sportsEquipment_id)
        if (!sportsEquipment) {
            return res.status(404).json({ message: "sportsEquipment not found" });
        }
        sportsEquipment.sportsEquipment_id= req.body.sportsEquipment_id || sportsEquipment.sportsEquipment_id;
        sportsEquipment.name = req.body.name || sportsEquipment.name;
        sportsEquipment.description = req.body.description || sportsEquipment.description;
        sportsEquipment.image = req.body.image || sportsEquipment.image;
        sportsEquipment.availabilityStatus = req.body.availabilityStatus || sportsEquipment.availabilityStatus;

        const updatedSportsEquipment = await sportsEquipment.save();
        res.status(200).json(updatedSportsEquipment);
        
    }catch(error){
        console.log(error)
    }
}

export {getSportsEquipments, getSportsEquipment, postSportsEquipment, deleteSportsEquipment, updateSportsEquipment}