import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore"; // Import chat store
import { Image, Send, X } from "lucide-react"; // Import icons for UI
import toast from "react-hot-toast"; // Import toast for error notifications

const MessageInput = () => {
  // State to manage input text
  const [text, setText] = useState("");
  // State to store image preview URL
  const [imagePreview, setImagePreview] = useState(null);
  // Reference for file input (to trigger file selection programmatically)
  const fileInputRef = useRef(null);

  // Access sendMessage function from the chat store
  const { sendMessage } = useChatStore();

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Validate if the selected file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Read the selected image as a Data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // Store the image preview URL
    };
    reader.readAsDataURL(file); // Convert image to Data URL
  };

  // Remove selected image
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
  };

  // Handle sending the message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return; // Prevent empty messages

    try {
      await sendMessage({
        text: text.trim(), // Send text message
        image: imagePreview, // Send image if available
      });

      // Reset input fields after sending message
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {/* Display image preview if an image is selected */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            {/* Remove image button */}
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Message Input Form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          {/* Text Input Field */}
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Hidden File Input for Image Upload */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Image Upload Button */}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        {/* Send Message Button */}
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview} // Disable if no text/image
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;