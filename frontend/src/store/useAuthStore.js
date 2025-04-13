import { create } from "zustand"; // Zustand for state management
import { axiosInstance } from "../lib/axios.js"; // Axios instance for API calls
import toast from "react-hot-toast"; // For toast notifications
import { io } from "socket.io-client"; // For real-time communication

// Set the base URL depending on the environment
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "";

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
      const errorMessage = error?.response?.data?.message || "Sign up failed. Please try again.";
      toast.error(errorMessage); // Show error message
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
      const errorMessage = error?.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(errorMessage); // Show error message
    } finally {
      set({ isLoggingIn: false }); // Reset loading state
    }
  },

  // Logout function
  logout: async () => {
    try {
      // First, update local state to prevent any more API calls
      // that would require authentication
      set({ authUser: null, onlineUsers: [] });
      
      // Disconnect socket first to prevent reconnection attempts
      get().disconnectSocket();
      
      // Send logout request - ignore any errors
      try {
        await axiosInstance.post("/auth/logout");
        toast.success("Logged out successfully");
      } catch (error) {
        // Silently handle logout errors - user is already logged out in UI
        console.log("Logout API error (ignoring):", error);
      }
    } catch (error) {
      // This catch shouldn't be needed but kept for safety
      console.error("Unexpected error during logout:", error);
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
      const errorMessage = error?.response?.data?.message || "Profile update failed. Please try again.";
      toast.error(errorMessage); // Show error message
    } finally {
      set({ isUpdatingProfile: false }); // Reset loading state
    }
  },

  // Connect to WebSocket for real-time updates
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || !authUser._id) {
      console.log("Cannot connect socket: No authenticated user");
      return;
    }
    
    // Disconnect existing socket before creating a new one
    get().disconnectSocket();
    
    try {
      console.log("Connecting socket for user:", authUser._id);
      
      const socket = io(BASE_URL, {
        query: { userId: authUser._id }, // Pass user ID for socket authentication
        reconnectionDelay: 1000, // Wait 1s before trying to reconnect
        reconnectionAttempts: 10, // More retry attempts
        timeout: 20000, // Longer timeout (20s)
        withCredentials: true, // Enable sending cookies
      });
      
      // Set socket in state immediately to prevent multiple connections
      set({ socket });
      
      socket.on("connect", () => {
        console.log("Socket connected successfully with ID:", socket.id);
        // Request online users as soon as we connect
        socket.emit("getOnlineUsers");
      });
      
      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      // Listen for online users event
      socket.on("onlineUsers", (userIds) => {
        console.log("Received online users:", userIds);
        set({ onlineUsers: userIds });
      });
      
      // Handle errors
      socket.on("error", (error) => {
        console.error("Socket error:", error);
      });
      
      // Handle disconnection
      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });
      
    } catch (error) {
      console.error("Error initializing socket:", error);
    }
  },

  // Disconnect WebSocket connection
  disconnectSocket: () => {
    const socket = get().socket;
    if (!socket) return;
    
    try {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("onlineUsers");
      socket.off("error");
      socket.off("disconnect");
      
      if (socket.connected) {
        socket.disconnect();
        console.log("Socket disconnected");
      }
      
      set({ socket: null });
    } catch (error) {
      console.error("Error disconnecting socket:", error);
    }
  },
}));