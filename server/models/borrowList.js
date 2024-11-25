import mongoose from 'mongoose';
const { Schema } = mongoose;

const borrowListSchema = new Schema({
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
        }
    }],
    status: {
        type: String,
        enum: ['Draft', 'Submitted', 'Cancel'],
        default: 'Draft'
    },
    submittedAt: Date,
    processedAt: Date,
    processedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

export default mongoose.model('BorrowList', borrowListSchema);