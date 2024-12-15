import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Admin Schema
const adminSchema = new mongoose.Schema({
    googleId: { type: String }, // Google authentication ID (if needed)
    displayName: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    image: { 
        type: String, 
        default: 'default.jpg' 
    },
    role: { 
        type: String, 
        enum: ['Admin', 'SuperAdmin'], 
        default: 'Admin' // Can be expanded if needed (e.g., SuperAdmin, Moderator)
    },
    permissions: [{
        type: String, // Permissions that are granted to the admin
        enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE_USERS', 'MANAGE_EQUIPMENT'],
        default: ['READ', 'UPDATE'] // Default permissions can be set as per requirements
    }],
    lastLogin: { 
        type: Date 
    },
    status: { 
        type: String, 
        enum: ['Active', 'Inactive'], 
        default: 'Active' 
    },
    inventory: { type: Boolean, default: true },
    transaction: { type: Boolean, default: true },
    borrowed: { type: Boolean, default: true },
    report: { type: Boolean, default: true },
    userManagement: { type: Boolean, default: true },
    addTransaction: { type: Boolean, default: true }
    
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Method to validate password
adminSchema.methods.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Method to update the last login timestamp
adminSchema.methods.updateLastLogin = function() {
    this.lastLogin = new Date();
    return this.save();
};



export default mongoose.model("Admin", adminSchema);
