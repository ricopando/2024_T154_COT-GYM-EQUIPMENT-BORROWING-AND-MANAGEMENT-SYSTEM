import mongoose from "mongoose";
const {Schema} = mongoose;

const sportsEquipmentSchema = new Schema ({

    sportsEquipment_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    image: {
        type: String, 
        required: true 
    },
    availabilityStatus: {
        type: String,
        enum: ['Available', 'Unavailable'],
        default: 'Available'
    },
   
})
const sportsEquipmentModel = mongoose.model("sportsEquipment", sportsEquipmentSchema);
export default sportsEquipmentModel;
