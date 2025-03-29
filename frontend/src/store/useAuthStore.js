import { create } from "zustand"; // Zustand for state management
import { axiosInstance } from "../lib/axios.js"; // Axios instance for API calls
import toast from "react-hot-toast"; // For toast notifications
import { io } from "socket.io-client"; // For real-time communication

// Set the base URL depending on the environment
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

// Zustand store for authentication and socket management
export const useAuthStore = create((set, get) => ({
  authUser: null, // Stores authenticated user data
  isSigningUp: false, // Loading state for sign-up process
  isLoggingIn: false, // Loading state for login process
  isUpdatingProfile: false, // Loading state for profile update
  isCheckingAuth: true, // Indicates if authentication check is in progress
  onlineUsers: [], // Stores a list of currently online users
  socket: null, // Stores the socket instance for real-time communication

  // Check if user is authenticated on app load
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check"); // Check authentication status
      set({ authUser: res.data }); // Store user data in state
      get().connectSocket(); // Connect to socket after authentication
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null }); // Reset auth state if error occurs
    } finally {
      set({ isCheckingAuth: false }); // Authentication check completed
    }
  },

  // Sign-up function
  signup: async (data) => {
    set({ isSigningUp: true }); // Set loading state
    try {
      const res = await axiosInstance.post("/auth/signup", data); // Send sign-up request
      set({ authUser: res.data }); // Store user data after successful signup
      toast.success("Account created successfully"); // Show success message
      get().connectSocket(); // Connect to socket
    } catch (error) {
      toast.error(error.response.data.message); // Show error message
    } finally {
      set({ isSigningUp: false }); // Reset loading state
    }
  },

  // Login function
  login: async (data) => {
    set({ isLoggingIn: true }); // Set loading state
    try {
      const res = await axiosInstance.post("/auth/login", data); // Send login request
      set({ authUser: res.data }); // Store user data after successful login
      toast.success("Logged in successfully"); // Show success message
      get().connectSocket(); // Connect to socket
    } catch (error) {
      toast.error(error.response.data.message); // Show error message
    } finally {
      set({ isLoggingIn: false }); // Reset loading state
    }
  },

  // Logout function
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout"); // Send logout request
      set({ authUser: null }); // Reset user state
      toast.success("Logged out successfully"); // Show success message
      get().disconnectSocket(); // Disconnect from socket
    } catch (error) {
      toast.error(error.response.data.message); // Show error message
    }
  },

  // Update user profile function
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true }); // Set loading state
    try {
      const res = await axiosInstance.put("/auth/update-profile", data); // Send update request
      set({ authUser: res.data }); // Update user data
      toast.success("Profile updated successfully"); // Show success message
    } catch (error) {
      console.log("Error in updateProfile:", error);
      toast.error(error.response.data.message); // Show error message
    } finally {
      set({ isUpdatingProfile: false }); // Reset loading state
    }
  },

  // Connect to WebSocket for real-time updates
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return; // Avoid reconnecting if already connected

    const socket = io(BASE_URL, {
      query: { userId: authUser._id }, // Pass user ID for socket authentication
    });
    socket.connect();

    set({ socket: socket }); // Store socket instance

    // Listen for online users event
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds }); // Update online users list
    });
  },

  // Disconnect WebSocket connection
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));