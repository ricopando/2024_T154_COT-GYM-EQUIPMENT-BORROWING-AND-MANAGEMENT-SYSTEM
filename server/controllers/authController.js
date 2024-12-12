import bcrypt from 'bcrypt';
import { verifyRecaptcha } from '../utils/recaptcha.js';
import userModel from "../models/user.js";
import adminModel from "../models/admin.js";

// Register a new user or admin
const register = async (req, res) => {
    const { email, displayName, isAdmin } = req.body;  // `isAdmin` flag to determine role

    try {
        let user;

        // Check if the user already exists, based on the role (User or Admin)
        if (isAdmin) {
            user = await adminModel.findOne({ email });
        } else {
            user = await userModel.findOne({ email });
        }

        if (user) return res.status(400).json({ message: "User already exists" });

        // Generate a random password
        const password = Math.random().toString(36).slice(-8); // Generate random 8-character password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user or admin based on the `isAdmin` flag
        if (isAdmin) {
            user = new adminModel({ email, displayName, password: hashedPassword });
        } else {
            user = new userModel({ email, displayName, password: hashedPassword });
        }

        await user.save();
        res.status(201).json({ message: `${isAdmin ? 'Admin' : 'User'} registered`, password });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// reCAPTCHA verification route
const verifyRecaptchaRoute = async (req, res) => {
    const { recaptchaToken } = req.body;
    if (!recaptchaToken) {
        return res.status(400).json({ message: "reCAPTCHA token is required" });
    }
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (isRecaptchaValid) {
        res.status(200).json({ message: "reCAPTCHA validation successful" });
    } else {
        res.status(400).json({ message: "reCAPTCHA validation failed" });
    }
};

// Login function with reCAPTCHA verification
const login = async (req, res) => {
    
    const { email, password, recaptchaToken } = req.body;

    if (!recaptchaToken) {
        return res.status(400).json({ message: "reCAPTCHA token is required" });
    }

    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
        return res.status(400).json({ message: "reCAPTCHA validation failed" });
    }

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        let user = await adminModel.findOne({ email }) || await userModel.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found" });
       
        const isMatch = await user.validatePassword(password);
        
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });
        

        const role = user.role || 'User'; // Default to 'User' if no role specified

        req.login(user, (err) => {
            if (err) return res.status(500).json({ message: "Error during login" });
            res.status(200).json({ message: `${role} login successful`, user: { ...user.toJSON(), role } });
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Logout function
const logout = (req, res) => {
    console.log("Logging out...");
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).json({ message: "Error during logout" });
        }
        console.log("Logged out successfully");
        res.status(200).json({ message: "Logged out successfully" });
    });
};

// Authentication status check
const checkAuthStatus = (req, res) => {
    if (req.user) {
        console.log('Authenticated user:', req.user); // Log the user data
        if (req.user.role === 'admin') {
          return res.json({ user: req.user }); // Admin
        } else {
          return res.json({ user: req.user }); // Regular user
        }
      } else {
        return res.status(401).json({ message: 'Not authenticated' });
      }
};


// Change Password function (for both user and admin)
const changePassword = async (req, res) => {
    const { newPassword } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        console.error("User not authenticated");
        return res.status(401).json({ message: "User not authenticated" });
    }

    if (!newPassword) {
        console.error("New password is required");
        return res.status(400).json({ message: "New password is required" });
    }

    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password for the authenticated user (whether user or admin)
        const updatedUser = await userModel.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });

        // If user is admin, update in adminModel as well (in case user is logged in as an admin)
        if (!updatedUser) {
            await adminModel.findByIdAndUpdate(userId, { password: hashedPassword });
        }

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Server error" });
    }
};


export { register, login, logout, checkAuthStatus, verifyRecaptchaRoute, changePassword };