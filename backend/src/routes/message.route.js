import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'; 
import { getUsersForSidebar } from '../controllers/message.controller.js'; // Controller to fetch users for sidebar
import { getMessages } from '../controllers/message.controller.js'; // Controller to fetch messages between users
import { sendMessage } from '../controllers/message.controller.js'; // Controller to handle sending messages

const router = express.Router(); 

// Route to get the list of users (excluding the logged-in user) for the chat sidebar
// Protected route (requires authentication)
// Calls `getUsersForSidebar` controller to fetch all users except the logged-in user
router.get("/users", protectRoute, getUsersForSidebar);

// Route to get messages exchanged between the logged-in user and another user
// Protected route (requires authentication)
// `:id` is a dynamic parameter representing the ID of the user being chatted with
//  Calls `getMessages` controller to retrieve messages
router.get("/:id", protectRoute, getMessages);

// Route to send a new message
// Protected route (requires authentication)
// `:id` represents the recipient user's ID
// Calls `sendMessage` controller to handle message sending (supports text and image messages)
router.post("/send/:id", protectRoute, sendMessage);

export default router; 