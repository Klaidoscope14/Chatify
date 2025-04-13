import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  // Get chat-related state and functions from store
  const {
    messages,              // List of chat messages
    getMessages,           // Function to fetch messages from backend
    isMessagesLoading,     // Boolean flag for loading state
    selectedUser,          // The currently selected user in the chat
    subscribeToMessages,   // Function to subscribe to real-time messages
    unsubscribeFromMessages, // Function to unsubscribe when unmounting
  } = useChatStore();

  // Get the authenticated user
  const { authUser } = useAuthStore();

  // Reference to the message container for auto-scrolling
  const messageContainerRef = useRef(null);
  // Reference to the last message for auto-scrolling
  const lastMessageRef = useRef(null);

  // Fetch messages when the selected user changes
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id); // Fetch messages for the selected user
      subscribeToMessages(); // Start real-time message updates
    }

    return () => unsubscribeFromMessages(); // Cleanup on component unmount
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Auto-scroll to the latest message when messages change
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    } else if (messageContainerRef.current) {
      // If no last message ref (empty chat), scroll to bottom of container
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Show a skeleton loader while messages are loading
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      {/* Chat header (shows selected user info) */}
      <ChatHeader />

      {/* Message display area */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4"
        ref={messageContainerRef}
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-zinc-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message._id || index}
              className={`chat ${message.senderId === authUser?._id ? "chat-end" : "chat-start"}`}
              ref={index === messages.length - 1 ? lastMessageRef : null} // Only set ref on last message
            >
              {/* User profile picture */}
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser?._id
                        ? authUser?.profilePic || "/avatar.png" // Sender's profile pic
                        : selectedUser?.profilePic || "/avatar.png" // Receiver's profile pic
                    }
                    alt="profile pic"
                  />
                </div>
              </div>

              {/* Message timestamp */}
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              {/* Message bubble */}
              <div className="chat-bubble flex flex-col">
                {/* Display image if message contains an image */}
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}

                {/* Display text message if available */}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message input field */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer;