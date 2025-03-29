import Navbar from "./components/Navbar"; 
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { Routes, Route, Navigate } from "react-router-dom"; // React Router for handling navigation
import { useAuthStore } from "./store/useAuthStore"; // Zustand store for authentication state
import { useThemeStore } from "./store/useThemeStore"; // Zustand store for theme management
import { useEffect } from "react"; // Hook to run effects on component mount

import { Loader } from "lucide-react"; // Loader icon for loading state
import { Toaster } from "react-hot-toast"; // Toast notifications for user feedback

const App = () => {
  // Extract authentication-related state and functions from Zustand
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  
  // Extract theme state from Zustand
  const { theme } = useThemeStore();

  console.log({ onlineUsers }); // Logging online users for debugging

  // Run checkAuth() when the component mounts to check user authentication status
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser }); // Logging authentication state for debugging

  // Show a loading screen while authentication is being checked
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" /> {/* Loading spinner */}
      </div>
    );

  return (
    <div data-theme={theme}> {/* Apply the selected theme */}
      <Navbar /> {/* Navbar component for navigation */}

      <Routes>
        {/* Protected route: Show HomePage if user is authenticated, otherwise redirect to login */}
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />

        {/* Public route: Show SignUpPage if user is NOT authenticated, otherwise redirect to home */}
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />

        {/* Public route: Show LoginPage if user is NOT authenticated, otherwise redirect to home */}
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />

        {/* SettingsPage is accessible to all users */}
        <Route path="/settings" element={<SettingsPage />} />

        {/* Protected route: Show ProfilePage if user is authenticated, otherwise redirect to login */}
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster /> {/* Toast notifications for success/error messages */}
    </div>
  );
};

export default App;