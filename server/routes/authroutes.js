import express from 'express';
import passport from 'passport';
import { register, login, logout, checkAuthStatus, verifyRecaptchaRoute, changePassword } from "../controllers/authController.js";

const router = express.Router();

// Google OAuth login route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback route
router.get("/google/callback", (req, res, next) => {
    passport.authenticate("google", (err, user) => {
        if (err || !user) {
            console.error("Google login failed:", err);
            return res.redirect("http://localhost:5173"); // Redirect to login page
        }
        
        // Log user role for debugging
        console.log("Logged in user role:", user.role);

        req.login(user, (loginErr) => {
            if (loginErr) {
                console.error("Error during login session:", loginErr);
                return res.redirect("http://localhost:5173");
            }
            // Redirect based on user role
            if (user.role === "Admin") {
                return res.redirect("http://localhost:5173/dashboard");
            }
            return res.redirect("http://localhost:5173/home");
        });
    })(req, res, next);
});

// Register a new user
router.post("/register", register);

// Manual Login route for email/password login
router.post("/login", login);

// Check authentication status
router.get("/status", checkAuthStatus);

// Logout route for logging out the user
router.get("/logout", logout);

// New route for testing reCAPTCHA token validation
router.post("/verify-recaptcha", verifyRecaptchaRoute);

router.post('/change-password', changePassword);

export default router;