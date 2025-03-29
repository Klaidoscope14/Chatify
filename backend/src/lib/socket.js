import { Server } from "socket.io";  // Import Socket.IO for real-time communication
import http from "http";  // Import HTTP module to create a server
import express from "express";  // Import Express framework

const app = express();

// Create an HTTP server and attach Express to it
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Allow connections from the frontend
  },
});

// Object to store online users { userId: socketId }
const userSocketMap = {};

// Function to get the socket ID of a specific user
export function getReceiverSocketId(userId) {
  return userSocketMap[userId]; // Returns the socket ID for a given userId
}

// Handle new WebSocket connections
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // Extract user ID from the handshake query
  const userId = socket.handshake.query.userId;

  // If a userId exists, store it in the userSocketMap
  if (userId) userSocketMap[userId] = socket.id;

  // Emit the list of online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);

    // Remove the user from the online users list
    delete userSocketMap[userId];

    // Emit the updated list of online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Export io, app, and server for use in other parts of the app
export { io, app, server };