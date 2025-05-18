import { X } from "lucide-react"; 
import { useAuthStore } from "../store/useAuthStore"; 
import { useChatStore } from "../store/useChatStore"; 

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  // Get the list of online users
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        {/* Left Section: User Info */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"} 
                alt={selectedUser.fullName} 
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3> {/* Display user's full name */}
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"} {/* Show online status */}
            </p>
          </div>
        </div>

        {/* Right Section: Close Button */}
        <button onClick={() => setSelectedUser(null)}> 
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;