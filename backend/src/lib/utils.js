import jwt from "jsonwebtoken";

// Function to generate a JWT token and store it in an HTTP-only cookie
export const generateToken = (userId, res) => {
    // Generate a JWT token with the userId as payload
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d", // Token will expire in 7 days
    });

    // Store the token in an HTTP-only cookie
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiry: 7 days (in milliseconds)
        httpOnly: true,  // Prevents JavaScript access to the cookie (protects against XSS attacks)
        sameSite: "strict", // Prevents CSRF attacks by allowing requests only from the same site
        secure: process.env.NODE_ENV !== "development" // Use secure cookies in production (HTTPS only)
    });

    return token; // Return the generated token
};
