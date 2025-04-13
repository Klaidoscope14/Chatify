import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore"; // Access WebSocket from auth store

export const useChatStore = create((set, get) => ({
  // State variables
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,
  // Set to track messages we've already processed to prevent duplicates
  processedMessageIds: new Set(),

  /**
   * Fetches the list of users available for chat.
   */
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to load users.";
      toast.error(errorMessage);
      console.error("Error fetching users:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  /**
   * Fetches chat messages between the logged-in user and a selected user.
   * @param {string} userId - The ID of the selected user.
   */
  getMessages: async (userId) => {
    if (!userId) {
      toast.error("No user selected.");
      return;
    }

    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      
      // Create a new Set of processed message IDs
      const processedIds = new Set();
      res.data.forEach(msg => processedIds.add(msg._id));
      
      set({ 
        messages: res.data,
        processedMessageIds: processedIds
      });
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to load messages.";
      toast.error(errorMessage);
      console.error("Error fetching messages:", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  /**
   * Sends a new message to the selected user.
   * @param {Object} messageData - The message content and metadata.
   */
  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    const authUser = useAuthStore.getState().authUser;

    if (!selectedUser?._id) {
      toast.error("No user selected.");
      return;
    }

    // Add message validation
    if (!messageData.text && !messageData.image) {
      toast.error("Message cannot be empty");
      return;
    }

    set({ isSendingMessage: true });
    
    try {
      // Direct API call to send message
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      
      // Add the message to our local state and mark it as processed
      if (res.data && res.data._id) {
        set((state) => {
          // Skip if we've already processed this message
          if (state.processedMessageIds.has(res.data._id)) {
            return state;
          }
          
          // Add message ID to processed set
          const newProcessedIds = new Set(state.processedMessageIds);
          newProcessedIds.add(res.data._id);
          
          return { 
            messages: [...state.messages, res.data],
            processedMessageIds: newProcessedIds
          };
        });
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to send message.";
      toast.error(errorMessage);
      console.error("Error sending message:", error);
    } finally {
      set({ isSendingMessage: false });
    }
  },

  /**
   * Subscribes to real-time message updates via WebSocket.
   */
  subscribeToMessages: () => {
    const { selectedUser } = get();
    const authUser = useAuthStore.getState().authUser;
    
    if (!selectedUser?._id || !authUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.error("Socket not connected. Message subscription failed.");
      return;
    }

    // Remove any existing listeners to prevent duplicates
    socket.off("newMessage");

    // Listen for new messages
    socket.on("newMessage", (newMessage) => {
      // Only process messages relevant to current chat
      const isRelevantChat = 
        (newMessage.senderId === selectedUser._id && newMessage.receiverId === authUser._id) || 
        (newMessage.senderId === authUser._id && newMessage.receiverId === selectedUser._id);
      
      if (isRelevantChat && newMessage._id) {
        set((state) => {
          // Skip if we've already processed this message
          if (state.processedMessageIds.has(newMessage._id)) {
            return state;
          }
          
          // Add message ID to processed set
          const newProcessedIds = new Set(state.processedMessageIds);
          newProcessedIds.add(newMessage._id);
          
          console.log("Adding new socket message:", newMessage._id);
          
          return { 
            messages: [...state.messages, newMessage],
            processedMessageIds: newProcessedIds
          };
        });
      }
    });
  },

  /**
   * Unsubscribes from the WebSocket event.
   */
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  /**
   * Sets the currently selected chat user.
   * @param {Object} selectedUser - The user object to be set.
   */
  setSelectedUser: (selectedUser) => {
    // Clear processed messages when changing users
    set({ 
      selectedUser,
      processedMessageIds: new Set()
    });
  },
}));