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
    borrowedItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BorrowedItem'
    }],
});

userSchema.methods.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema); 