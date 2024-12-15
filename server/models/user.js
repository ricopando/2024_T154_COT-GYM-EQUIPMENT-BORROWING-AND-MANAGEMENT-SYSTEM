import mongoose from "mongoose";
import bcrypt from "bcrypt";


const userSchema = new mongoose.Schema({
    googleId: { type: String },
    givenName: { type: String },
    familyName: { type: String},
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: String,
    password: { type: String }, 
    role: { type: String, enum: ['User', 'Admin', 'Personnel'], default: 'User' },
    borrowedItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BorrowedItem'
    }],
    inventory: { type: Boolean, default: false },
    transaction: { type: Boolean, default: false },
    borrowed: { type: Boolean, default: false },
    report: { type: Boolean, default: false },
    userManagement: { type: Boolean, default: false },
    addTransaction: { type: Boolean, default: false }
});

userSchema.methods.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema); 