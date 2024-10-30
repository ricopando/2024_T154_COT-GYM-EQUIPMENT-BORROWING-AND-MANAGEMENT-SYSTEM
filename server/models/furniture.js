import mongoose from "mongoose";
const {Schema} = mongoose;

const furnitureSchema = new Schema ({

    furniture_id: {
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
const furnitureModel = mongoose.model("furniture", furnitureSchema);
export default furnitureModel;
