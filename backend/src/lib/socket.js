import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookie from "cookie";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Define allowed origins based on environment
const allowedOrigins = process.env.NODE_ENV === "production" 
  ? [process.env.PRODUCTION_URL || ""] 
  : ["http://localhost:5173"];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000, // Close connection after 60s of inactivity
});

// In-memory map to store online users
const userSocketMap = {};

// Helper function to get socket ID by user ID
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Helper function to get online users excluding the current user
export function getOnlineUsersExcludingSelf(currentUserId) {
  return Object.keys(userSocketMap).filter(id => id !== currentUserId);
}

// Much simpler authentication middleware that won't block connections
io.use((socket, next) => {
  try {
    const userId = socket.handshake.query.userId;
    
    if (userId) {
      socket.userId = userId;
      return next();
    }
    
    // Try to get userId from cookie as fallback
    const cookies = socket.handshake.headers.cookie 
      ? cookie.parse(socket.handshake.headers.cookie) 
      : null;
    
    if (cookies && cookies.jwt) {
      try {
        const decoded = jwt.verify(cookies.jwt, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        return next();
      } catch (err) {
        console.log("Invalid token in cookie, using query userId");
      }
    }
    
    // If we reach here and don't have a userId, still allow connection
    // but log a warning
    if (!socket.userId) {
      console.warn("Socket connection without userId");
    }
    next();
  } catch (error) {
    console.error("Socket authentication error:", error);
    next(); // Allow connection anyway to prevent blocking functionality
  }
});

io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  const userId = socket.userId || socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    
    // Get the list of online users for the current user
    socket.emit("onlineUsers", getOnlineUsersExcludingSelf(userId));
    
    // Broadcast to everyone else that this user is now online
    socket.broadcast.emit("onlineUsers", getOnlineUsersExcludingSelf(null));
  }

  // Allow clients to fetch online users manually
  socket.on("getOnlineUsers", (callback) => {
    const currentUserId = socket.userId || socket.handshake.query.userId;
    const onlineUsersExcludingSelf = getOnlineUsersExcludingSelf(currentUserId);
    
    if (typeof callback === 'function') {
      callback(onlineUsersExcludingSelf);
    } else {
      socket.emit("onlineUsers", onlineUsersExcludingSelf);
    }
  });

  // Handle private message event
  socket.on("privateMessage", (data) => {
    const receiverSocketId = userSocketMap[data.receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", data.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
    
    let disconnectedUserId = null;
    
    // Find and remove the disconnected user from userSocketMap
    for (const [uid, sid] of Object.entries(userSocketMap)) {
      if (sid === socket.id) {
        disconnectedUserId = uid;
        delete userSocketMap[uid];
        break;
      }
    }

    if (disconnectedUserId) {
      // Broadcast to all remaining clients that this user is now offline
      socket.broadcast.emit("onlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { io, app, server };