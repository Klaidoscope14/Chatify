// Import Mongoose to interact with MongoDB
import mongoose from "mongoose";

// Async function to connect to MongoDB
export const connectDB = async () => {
  try {
    // Connect to the MongoDB database using the connection string from environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // Log a success message with the database host
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};