import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,  // References another document (User)
            ref: "User",  // refers to the "User" model
            required: true,  
        },

        receiverId: { 
            type: mongoose.Schema.Types.ObjectId,  // References another document (User)
            ref: "User",  // refers to the "User" model
            required: true,  
        },

        text:{
            type : String,
        },

        image : {
            type: String
        },
    },
    {timestamps : true} // Automatically adds `createdAt` and `updatedAt` fields
);

const Message = mongoose.model("Message" , messageSchema);

export default Message;