import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import bcrypt from "bcrypt";
import User from "../models/user.js"; // Import User model
import Admin from "../models/admin.js"; // Import Admin model
import dotenv from "dotenv";
import transporter from '../utils/mailer.js';

dotenv.config();

// Predefined admin email list (can be stored in environment variables or DB for flexibility)
const adminEmails = ['johanjaydegenion20@gmail.com']; // Replace with actual admin emails

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google login profile:', profile);
        
        // Check if the user is an admin by email
        const isAdmin = adminEmails.includes(profile.emails[0].value);
        console.log('Is Admin:', isAdmin);

        let user;
        
        if (isAdmin) {
          // Check if the admin already exists
          user = await Admin.findOne({ googleId: profile.id });
          if (!user) {
            // If admin does not exist, create new admin
            const password = Math.random().toString(36).slice(-8); // Generate random password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            user = new Admin({
              googleId: profile.id,
              displayName: profile.displayName,
              email: profile.emails[0].value,
              image: profile.photos[0].value,
              password: hashedPassword,
            });

            await user.save();
            console.log('Admin user saved:', user);

            // Send email to admin with generated password
            const mailOptions = {
              from: process.env.EMAIL,
              to: profile.emails[0].value,
              subject: 'Your Generated Admin Password',
              text: `Hello ${profile.displayName},\n\nYour generated admin password is: ${password}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log('Error sending email:', error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
          }
        } else {
          // Check if the user already exists in the User model
          user = await User.findOne({ googleId: profile.id });
          if (!user) {
            // If user does not exist, create new user
            const password = Math.random().toString(36).slice(-8); // Generate random password
            const hashedPassword = await bcrypt.hash(password, 10);

            user = new User({
              googleId: profile.id,
              displayName: profile.displayName,
              email: profile.emails[0].value,
              image: profile.photos[0].value,
              password: hashedPassword,
            });

            await user.save();
            console.log('Regular user saved:', user);

            // Send email to user with generated password
            const mailOptions = {
              from: process.env.EMAIL,
              to: profile.emails[0].value,
              subject: 'Your Generated Password',
              text: `Hello ${profile.displayName},\n\nYour generated password is: ${password}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log('Error sending email:', error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
          }
        }

        return done(null, user);
      } catch (error) {
        console.error('Error during Google OAuth:', error);
        return done(error, null);
      }
    }
  )
);

// Serialize user to save in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user to retrieve from session
passport.deserializeUser(async (id, done) => {
  try {
    let user;
    // Try to find the user in the Admin model first
    user = await Admin.findById(id);
    if (!user) {
      // If not found in Admin model, search in the User model
      user = await User.findById(id);
    }
    done(null, user);
  } catch (error) {
    console.error('Error during deserialization:', error);
    done(error, null);
  }
});

export default passport;
