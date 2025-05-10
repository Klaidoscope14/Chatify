//This code defines authentication-related routes for a web application using Express.js.

import express from "express";  
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js"; 
import { protectRoute } from "../middleware/auth.middleware.js";  

const router = express.Router();  

// Route for user signup (registration)
router.post("/signup", signup);
// Calls the signup controller when a POST request is made to /signup

// Route for user login
router.post("/login", login);
// Calls the login controller when a POST request is made to /login

// Route for user logout - using optionalAuth to prevent unauthorized errors on logout
router.post("/logout", logout);
// Calls the logout controller when a POST request is made to /logout

// Route for updating user profile (Protected Route)
router.put("/update-profile", protectRoute, updateProfile);
// Calls the updateProfile controller when a PUT request is made to /update-profile
// Uses protectRoute middleware to ensure only authenticated users can update their profile

// Route to check if a user is authenticated (Protected Route)
router.get("/check", protectRoute, checkAuth);
// Calls the checkAuth controller when a GET request is made to /check
// Uses protectRoute middleware to verify authentication

export default router;  