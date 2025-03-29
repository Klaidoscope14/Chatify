const MessageSkeleton = () => {
  // Create an array of 6 items for skeleton messages (used for loading state)
  const skeletonMessages = Array(6).fill(null);

  return (
    // Main container for the skeleton loader, making it scrollable
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {skeletonMessages.map((_, idx) => (
        // Dynamically assign `chat-start` (left) or `chat-end` (right) based on index
        <div key={idx} className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}>
          
          {/* Skeleton avatar placeholder */}
          <div className="chat-image avatar">
            <div className="size-10 rounded-full">
              <div className="skeleton w-full h-full rounded-full" />
            </div>
          </div>

          {/* Skeleton placeholder for username/header */}
          <div className="chat-header mb-1">
            <div className="skeleton h-4 w-16" />
          </div>

          {/* Skeleton placeholder for chat message */}
          <div className="chat-bubble bg-transparent p-0">
            <div className="skeleton h-16 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;