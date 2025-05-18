import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Connect to the MongoDB database using the connection string from environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};