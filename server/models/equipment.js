import mongoose from 'mongoose';
const { Schema } = mongoose;

const equipmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String, // URL or base64 string for the image
        required: true
    },
    availabilityStatus: {
        type: String,
        enum: ['Available', 'Borrow'],
        default: 'Available'
    },
    category: {
        type: String,
        enum: ['Sports', 'Furniture', 'Electronics'],
        required: true
    },
    serialNumber: {
        type: String, // Optional field for equipment tracking
    },
    model: {
        type: String, // Optional field for model info
    },
    additionalInfo: {
        type: String // Optional additional notes about the equipment
    }
});

const Equipment = mongoose.model('Equipment', equipmentSchema);
export default Equipment;

