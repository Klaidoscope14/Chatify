import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// In-memory map to store online users
const userSocketMap = {};

// Helper function to get socket ID by user ID
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;

    // Emit to all clients the updated list of online users
    io.emit("onlineUsers", Object.keys(userSocketMap));
  }

  // Allow clients to fetch online users manually
  socket.on("getOnlineUsers", (_, callback) => {
    callback(Object.keys(userSocketMap));
  });

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);

    // Remove user from online map
    if (userId) {
      delete userSocketMap[userId];
    }

    // Broadcast updated user list
    io.emit("onlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };