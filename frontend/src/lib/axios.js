import axios from "axios"; // Import the axios library for making HTTP requests

// Create an instance of axios with custom configuration
export const axiosInstance = axios.create({
  // Set the base URL dynamically based on the environment (development or production)
  baseURL: import.meta.env.MODE === "development" 
    ? "http://localhost:5001/api" // If in development mode, use local server
    : "/api", // In production, use the relative API path

  // Enable sending cookies and credentials with cross-origin requests
  withCredentials: true,
});