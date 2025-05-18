import express from "express";  
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js"; 
import { protectRoute } from "../middleware/auth.middleware.js";  

const router = express.Router();  

// Route for user signup (registration)
router.post("/signup", signup);

// Route for user login
router.post("/login", login);

// Route for user logout - using optionalAuth to prevent unauthorized errors on logout
router.post("/logout", logout);

// Route for updating user profile (Protected Route)
router.put("/update-profile", protectRoute, updateProfile);

// Route to check if a user is authenticated (Protected Route)
router.get("/check", protectRoute, checkAuth);

export default router;  