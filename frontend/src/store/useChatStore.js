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

  /**
   * Fetches the list of users available for chat.
   */
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load users.");
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
      set({ messages: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load messages.");
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

    if (!selectedUser?._id) {
      toast.error("No user selected.");
      return;
    }

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set((state) => ({ messages: [...state.messages, res.data] }));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message.");
    }
  },

  /**
   * Subscribes to real-time message updates via WebSocket.
   */
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser?._id) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) {
      toast.error("Socket not connected.");
      return;
    }

    socket.off("newMessage"); // Prevent duplicate listeners

    socket.on("newMessage", (newMessage) => {
      const isMessageFromSelectedUser = newMessage.senderId === selectedUser._id;

      if (!isMessageFromSelectedUser) return;

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));
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
    set({ selectedUser });
  },
}));