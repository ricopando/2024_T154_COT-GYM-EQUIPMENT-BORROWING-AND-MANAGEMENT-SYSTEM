import express from "express";
import session from "express-session";
import passport from "./config/passport.js"; // Import the configured Passport instance
import cors from "cors";
import dotenv from "dotenv";
import equipmentRoutes from './routes/Equipmentroutes.js';

import authRoute from "./routes/authroutes.js"
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET, // A secret string for encryption
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true in production if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // Session expiry time (1 day)
    },
  })
);

// Initialize Passport and Session Handling
app.use(passport.initialize());
app.use(passport.session());


// Other Routes
app.use("/api/auth", authRoute)
app.use('/api', equipmentRoutes);



const port = process.env.PORT || 8000;

app.listen(port, () => {
    connectDB(); // Connect to MongoDB
    console.log(`Connected to PORT ${port}`);
});