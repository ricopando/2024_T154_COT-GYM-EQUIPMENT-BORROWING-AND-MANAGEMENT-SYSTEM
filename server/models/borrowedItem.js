import mongoose from 'mongoose';
const { Schema } = mongoose;

const borrowedItemSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        equipment: {
            type: Schema.Types.ObjectId,
            ref: 'Equipment',
            required: true
        },
        borrowDate: {
            type: Date,
            required: true
        },
        returnDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Returned'],
            default: 'Pending'
        },
        notes: String
    }],
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Returned'],
        default: 'Pending'
    }
}, {
    timestamps: true
});



export default mongoose.model('BorrowedItem', borrowedItemSchema);