import React, { useEffect, useState } from "react";

const Notification = ({ message, onClose }) => {
  const [visible, setVisible] = useState(true); // Initially visible

  useEffect(() => {
    // Fade out the notification after 2 seconds
    const hideTimer = setTimeout(() => {
      setVisible(false); // Start the fade-out process
    }, 2000);

    // Call onClose after the fade-out completes (after 2.5 seconds)
    const closeTimer = setTimeout(() => {
      onClose(); // Reset the parent state after the notification is hidden
    }, 2500);

    // Clean up the timers when the component is unmounted
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  // Return null when not visible (removes it from the DOM)
  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 bg-[#0077be] text-white px-[40px] py-[30px] font-bold rounded-md shadow-md transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        zIndex: 50, // Ensure it's above other elements
      }}
    >
      {message}
    </div>
  );
};

export default Notification;
