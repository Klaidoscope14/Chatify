import { Link } from "react-router-dom"; // Import Link for navigation
import { useAuthStore } from "../store/useAuthStore"; // Import authentication store
import { LogOut, MessageSquare, Settings, User } from "lucide-react"; // Import icons

const Navbar = () => {
  // Get authentication state and logout function from the store
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          
          {/* App Logo & Title */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              {/* Logo Icon */}
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              {/* App Name */}
              <h1 className="text-lg font-bold">Chatify</h1>
            </Link>
          </div>

          {/* Navbar Right Section (Buttons) */}
          <div className="flex items-center gap-2">
            {/* Settings Button */}
            <Link
              to={"/settings"}
              className={`btn btn-sm gap-2 transition-colors`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span> {/* Visible only on larger screens */}
            </Link>

            {/* Display Profile & Logout buttons if user is authenticated */}
            {authUser && (
              <>
                {/* Profile Button */}
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span> {/* Hidden on small screens */}
                </Link>

                {/* Logout Button */}
                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span> {/* Hidden on small screens */}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;