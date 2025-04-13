import { generateToken } from "../lib/utils.js"; // Importing function to generate JWT token
import User from "../models/user.model.js"; // Importing the User model from the database
import bcrypt from "bcryptjs"; // Importing bcrypt for password hashing
import cloudinary from "../lib/cloudinary.js"; // Importing Cloudinary for profile picture uploads

// Controller for user signup (register)
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body; // Extracting user input from request body
  try {
    // Validate if all fields are provided
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure password meets minimum length requirement
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists in the database
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // Hash the password before storing it in the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance with hashed password
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // Generate JWT token for authentication
      generateToken(newUser._id, res);
      
      // Save the new user to the database
      await newUser.save();

      // Return user details (excluding password) in response
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller for user login
export const login = async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body
  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found, return an error
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare input password with hashed password in database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token upon successful authentication
    generateToken(user._id, res);

    // Return user details (excluding password)
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller for user logout
export const logout = (req, res) => {
  try {
    // Clear the JWT cookie by setting its value to an empty string and expiring it immediately
    res.cookie("jwt", "", { 
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      path: "/"
    });

    // Send a success response indicating the user has been logged out
    res.status(200).json({ message: "Logged out successfully" });
  } 
  catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to update user profile (profile picture)
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body; // Get profile picture from request body
    const userId = req.user._id; // Extract user ID from request (assumes authentication middleware)

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    // Upload the new profile picture to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    
    // Update user document with the new profile picture URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to check if user is authenticated
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user); // Return authenticated user details
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};