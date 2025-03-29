//This file configures Cloudinary to handle image uploads in a Node.js application using environment variables.

// Import Cloudinary's v2 API for advanced image processing(uploading , transformation aur optimization)
import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

config();

// Configure Cloudinary with credentials stored in environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Cloudinary account name
    api_key: process.env.CLOUDINARY_API_KEY,        // API key for authentication
    api_secret: process.env.CLOUDINARY_API_SECRET,  // API secret for secure access
});

// Export the configured Cloudinary instance for use in other files
export default cloudinary;