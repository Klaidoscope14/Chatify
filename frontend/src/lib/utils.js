export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",  // Ensures two-digit hour (e.g., 09 instead of 9)
    minute: "2-digit", // Ensures two-digit minute
    hour12: false, // Uses 24-hour format instead of AM/PM
  });
}