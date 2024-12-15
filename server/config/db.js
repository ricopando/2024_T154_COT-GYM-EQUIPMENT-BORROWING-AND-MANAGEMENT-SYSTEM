import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB, {
            
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit process if MongoDB connection fails
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
});

export default connectDB;
