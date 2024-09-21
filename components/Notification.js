import React, { useEffect, useState } from "react";

const Notification = ({ message, onClose }) => {
  const [visible, setVisible] = useState(true); // Initially visible

  useEffect(() => {
    // Fade out the notification after 2 seconds
    const hideTimer = setTimeout(() => {
      setVisible(false); // Start the fade-out process
    }, 3000);

    // Call onClose after the fade-out completes (after 2.5 seconds)
    const closeTimer = setTimeout(() => {
      onClose(); // Reset the parent state after the notification is hidden
    }, 3500);

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
    className={`fixed bottom-6 mx-4 md:mx-0 right-0 md:right-4 bg-gradient-to-r from-[#0077be] to-[#00a3ff] text-white px-[20px] md:px-[40px] py-[15px] md:py-[30px] font-bold rounded-md shadow-lg transition-opacity duration-500 ${
      visible ? "opacity-100" : "opacity-0"
    }`}
    style={{
      zIndex: 50, // Ensure it's above other elements
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3), 0 8px 25px rgba(0, 119, 190, 0.4)", // More pronounced shadow
    }}
  >
    {message}
  </div>
  
  );
};

export default Notification;
