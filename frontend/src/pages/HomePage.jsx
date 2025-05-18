import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  // Get the selected user from the chat store
  const { selectedUser } = useChatStore();

  return (
    // Main container with full screen height and background color
    <div className="h-screen bg-base-200">
      {/* Centered container for the chat UI */}
      <div className="flex items-center justify-center pt-20 px-4">
        {/* Chat box container with rounded corners and shadow effect */}
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          {/* Flex container to hold the sidebar and chat area */}
          <div className="flex h-full rounded-lg overflow-hidden">
            {/* Sidebar component for displaying user contacts */}
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;