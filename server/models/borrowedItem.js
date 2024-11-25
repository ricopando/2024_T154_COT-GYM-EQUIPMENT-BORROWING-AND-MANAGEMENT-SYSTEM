import mongoose from 'mongoose';
const { Schema } = mongoose;

const borrowedItemSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
        enum: ['Pending', 'Approve', 'Returned'],
        default: 'Pending'
    },
    notes: String
}, {
    timestamps: true
});

// Add index for better query performance
borrowedItemSchema.index({ user: 1, status: 1 });

export default mongoose.model('BorrowedItem', borrowedItemSchema);