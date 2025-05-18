import Navbar from "./components/Navbar"; 
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { Routes, Route, Navigate } from "react-router-dom"; 
import { useAuthStore } from "./store/useAuthStore"; 
import { useThemeStore } from "./store/useThemeStore"; 
import { useEffect } from "react"; 
import { Loader } from "lucide-react"; 
import { Toaster } from "react-hot-toast"; 

const App = () => {
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
        <Loader className="size-10 animate-spin" /> 
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar /> 

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster /> 
    </div>
  );
};

export default App;