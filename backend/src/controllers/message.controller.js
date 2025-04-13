import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

//Retrieves a list of all users except the currently logged-in user.
export const getUsersForSidebar = async (req, res) => {
  try {
    // Get the logged-in user's ID from the request object
    const loggedInUserId = req.user._id;

    // Find all users except the logged-in user and exclude their passwords
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    // Send the list of users as a response
    res.status(200).json(filteredUsers);
  } catch (error) {
    // Handle errors and return a 500 Internal Server Error response
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Retrieves chat history between the logged-in user and another user.
export const getMessages = async (req, res) => {
  try {
    // Extract the ID of the user to chat with from request parameters
    const { id: userToChatId } = req.params;
    
    // Get the logged-in user's ID
    const myId = req.user._id;

    // Find messages where the logged-in user is either the sender or receiver
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    // Send the retrieved messages as a response
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Sends a new message (text or image) to a specific user and emits it via WebSockets.
export const sendMessage = async (req, res) => {
  try {
    // Extract message details (text and image) from request body
    const { text, image } = req.body;
    // Extract receiver's user ID from request parameters
    const { id: receiverId } = req.params;

    // Get the logged-in user's ID (sender)
    const senderId = req.user._id;

    // Validate that we have at least text or image
    if (!text && !image) {
      return res.status(400).json({ error: "Message content is required" });
    }

    let imageUrl;
    if (image) {
      try {
        // Upload base64 image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      } catch (error) {
        console.log("Error uploading image:", error);
        // Continue without image if upload fails
      }
    }

    // Create a new message object
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // Save the new message to the database
    const savedMessage = await newMessage.save();

    // Send message via WebSockets - send to receiver only
    // The sender already has the message from the API response
    try {
      // Get the receiver's WebSocket socket ID
      const receiverSocketId = getReceiverSocketId(receiverId);
      
      // If the receiver is online, send them the new message via WebSockets
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", savedMessage);
      }
      
      // We no longer notify the sender via socket since they already have the message
      // from the API response. This prevents duplicate messages.
    } catch (error) {
      console.log("Socket error in sendMessage:", error);
      // Don't fail the request if socket communication fails
    }

    // Send the saved message as a response
    res.status(201).json(savedMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    
    // Handle errors and return a 500 Internal Server Error response
    res.status(500).json({ error: "Internal server error" });
  }
};