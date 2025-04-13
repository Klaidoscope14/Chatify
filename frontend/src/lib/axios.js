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

// Add response interceptor to handle 401 errors gracefully
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only log auth errors on routes that aren't logout or login
    if (error.response?.status === 401 && 
        !error.config.url.includes('/auth/logout') && 
        !error.config.url.includes('/auth/login')) {
      console.log('Authentication error:', error.response?.data?.message);
    }
    return Promise.reject(error);
  }
);