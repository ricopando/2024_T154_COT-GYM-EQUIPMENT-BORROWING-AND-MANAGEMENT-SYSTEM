import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session"; // Use import instead of require
import passport from "passport"; // Use import instead of require
import { Strategy as OAuth2Strategy } from "passport-google-oauth2"; // Use import instead of require
import userModel from "./models/user.js";

dotenv.config();

const app = express();

const clientid = "632465390564-dd4fovg5t44809fn6kdpot28sv496bnn.apps.googleusercontent.com";
const clientsecret = "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";

app.use(cors({
    origin:"http://localhost:5173",
    methods:"GET,POST,PUT,DELETE",
    credentials:true
}));
app.use(express.json());

// Setup session
app.use(session({
    secret: "82446e0bd15cb5bbe80b4e9b106b6806ae6f6f", // Ideally, move this to .env
    resave: false,
    saveUninitialized: true
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new OAuth2Strategy(
        {
            clientID: clientid,
            clientSecret: clientsecret,
            callbackURL: "/auth/google/callback",
            scope: ["profile", "email"]
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userModel.findOne({ googleId: profile.id });
                if (!user) {
                    user = new userModel({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails[0].value,
                        image: profile.photos[0].value
                    });
                    await user.save();
                }
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Google OAuth login
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: "http://localhost:5173/dashboard",
    failureRedirect: "http://localhost:5173/login"
}));

const port = process.env.PORT || 5000;

const corsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true,
};


app.get("/login/sucess",async(req,res)=>{

    if(req.user){
        res.status(200).json({message:"user Login",user:req.user})
    }else{
        res.status(400).json({message:"Not Authorized"})
    }
})

app.get("/logout",(req,res,next)=>{
    req.logout(function(err){
        if(err){return next(err)}
        res.redirect("http://localhost:5173");
    })
})
// Routes
import sportsEquipmentRoute from "./routes/sportsEquipmentRoutes.js";
import furnitureRoute from "./routes/furnitureRoutes.js";
import electronicRoute from "./routes/electronicRoutes.js";

app.use("/api/sportsEquipment", sportsEquipmentRoute);
app.use("/api/furniture", furnitureRoute);
app.use("/api/electronic", electronicRoute);

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB);
    } catch (error) {
        console.log(error);
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
});

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});

app.listen(port, () => {
    connect();
    console.log(`Connected to PORT ${port}`);
});
