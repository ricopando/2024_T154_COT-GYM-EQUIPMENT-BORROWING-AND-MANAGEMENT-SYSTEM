import mongoose from "mongoose";
const {Schema} = mongoose;

const electronicSchema = new Schema ({

    electronic_id: {
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
const electronicModel = mongoose.model("electronicEquipment", electronicSchema);
export default electronicModel;
