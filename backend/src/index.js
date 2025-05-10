import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Define allowed origins based on environment
const allowedOrigins = process.env.NODE_ENV === "production"
  ? [process.env.PRODUCTION_URL || ""]
  : ["http://localhost:5173"];

app.use(express.json({ limit: '50mb' })); // Parse JSON payloads with a size limit of 50MB
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Parse URL-encoded data with a size limit of 50MB
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? true : allowedOrigins,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});