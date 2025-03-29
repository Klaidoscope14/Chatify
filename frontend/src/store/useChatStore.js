import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore"; // Import authentication store to access the socket

// Zustand store for chat functionality
export const useChatStore = create((set, get) => ({
  // State variables
  messages: [], // Stores the chat messages
  users: [], // Stores the list of available users
  selectedUser: null, // Currently selected chat user
  isUsersLoading: false, // Indicates if user list is being loaded
  isMessagesLoading: false, // Indicates if messages are being loaded

  /**
   * Fetches the list of users available for chat.
   */
  getUsers: async () => {
    set({ isUsersLoading: true }); // Set loading state
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data }); // Store users in state
    } catch (error) {
      toast.error(error.response.data.message); // Show error message
    } finally {
      set({ isUsersLoading: false }); // Reset loading state
    }
  },

  /**
   * Fetches chat messages between the logged-in user and a selected user.
   * @param {string} userId - The ID of the selected user.
   */
  getMessages: async (userId) => {
    set({ isMessagesLoading: true }); // Set loading state
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data }); // Store fetched messages in state
    } catch (error) {
      toast.error(error.response.data.message); // Show error message
    } finally {
      set({ isMessagesLoading: false }); // Reset loading state
    }
  },

  /**
   * Sends a new message to the selected user.
   * @param {Object} messageData - The message content and metadata.
   */
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get(); // Get the selected user and current messages
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] }); // Append the new message to the chat
    } catch (error) {
      toast.error(error.response.data.message); // Show error message
    }
  },

  /**
   * Subscribes to real-time message updates via WebSocket.
   * Listens for incoming messages and updates the state if the message is from the selected user.
   */
  subscribeToMessages: () => {
    const { selectedUser } = get(); // Get the selected user
    if (!selectedUser) return; // Do nothing if no user is selected

    const socket = useAuthStore.getState().socket; // Get WebSocket instance from Auth Store

    socket.on("newMessage", (newMessage) => {
      // Check if the new message is from the currently selected user
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return; // Ignore messages from other users

      set({
        messages: [...get().messages, newMessage], // Append new message to chat
      });
    });
  },

  /**
   * Unsubscribes from the WebSocket event to stop receiving real-time messages.
   */
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage"); // Remove event listener
  },

  /**
   * Updates the currently selected user for chat.
   * @param {Object} selectedUser - The user object to be set as the current chat user.
   */
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));