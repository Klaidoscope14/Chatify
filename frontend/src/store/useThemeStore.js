import { create } from "zustand"; // Import Zustand to create a global state store

// Zustand store for theme management
export const useThemeStore = create((set) => ({
    // State variable to store the theme, retrieved from localStorage if available, otherwise defaults to "coffee"
    theme: localStorage.getItem("chat-theme") || "coffee",

    // Function to update the theme
    setTheme: (theme) => {
        localStorage.setItem("chat-theme", theme); // Save the selected theme in localStorage for persistence
        set({ theme }); // Update the Zustand state with the new theme
    },
}));