import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d", 
    });

    // Store the token in an HTTP-only cookie
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiry: 7 days (in milliseconds)
        httpOnly: true,  // (protects against XSS attacks)
        sameSite: "strict", // Prevents CSRF attacks by allowing requests only from the same site
        secure: process.env.NODE_ENV !== "development",
        path: "/" // Ensures cookie is sent with all requests to the server
    });

    return token; 
};
