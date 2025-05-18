import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'; 
import { getUsersForSidebar } from '../controllers/message.controller.js'; // Controller to fetch users for sidebar
import { getMessages } from '../controllers/message.controller.js'; // Controller to fetch messages between users
import { sendMessage } from '../controllers/message.controller.js'; // Controller to handle sending messages

const router = express.Router(); 
router.get("/users", protectRoute, getUsersForSidebar);

router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

export default router; 