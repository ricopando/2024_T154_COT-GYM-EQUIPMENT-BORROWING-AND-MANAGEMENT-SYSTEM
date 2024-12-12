import express from "express";
import session from "express-session";
import passport from "./config/passport.js"; // Import the configured Passport instance
import cors from "cors";
import dotenv from "dotenv";
import equipmentRoutes from './routes/Equipmentroutes.js';
import borrowListRoutes from './routes/borrowedListRoutes.js';
import borrowedItemRoutes from './routes/borrowedItemRoutes.js';
import authRoute from "./routes/authroutes.js"
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['set-cookie']
}));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET, // A secret string for encryption
    resave: false,
    saveUninitialized: false, // Changed to false for better security
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Only use secure in production
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
  })
);

// Initialize Passport and Session Handling
app.use(passport.initialize());
app.use(passport.session());

// Add this middleware to log session and user info
app.use((req, res, next) => {
 
  next();
});

// Add a test endpoint to check authentication
app.get('/api/auth/check', (req, res) => {
  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.user,
    session: req.session
  });
});

// Other Routes
app.use('/api/auth', authRoute)
app.use('/api', equipmentRoutes);
app.use('/api/borrow-lists', borrowListRoutes);
app.use('/api/borrow-items', borrowedItemRoutes);



const port = process.env.PORT || 8000;

app.listen(port, () => {
    connectDB(); // Connect to MongoDB
    console.log(`Connected to PORT ${port}`);
});