import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware to protect routes by verifying JWT authentication
export const protectRoute = async (req, res, next) => {
    try {
        // Extract the JWT token from cookies
        const token = req.cookies.jwt;

        // If no token is provided, return an Unauthorized error
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        // Verify and decode the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // If token verification fails, return an Unauthorized error
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        // Fetch the user from the database using the decoded userId
        const user = await User.findById(decoded.userId).select("-password"); // Exclude password for security

        // If user is not found, return an error response
        if (!user) {
            return res.status(400).json({ message: "User Not Found" });
        }

        // Attach the authenticated user data to the request object
        req.user = user;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
