
export const canvasStyles = (isMobile) => ({
  top: isMobile ? "-10px" : "-20px",
  left: isMobile ? "-10px" : "-20px",
  width: isMobile ? "calc(100% + 20px)" : "calc(100% + 40px)",
  height: isMobile ? "calc(100% + 20px)" : "calc(100% + 40px)",
});
