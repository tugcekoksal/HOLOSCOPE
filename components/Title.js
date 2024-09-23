const Title = ({ isButtonClicked, isHoveredText, isMobile }) => (
  <h1
    className={`absolute font-bold z-30 transition-all duration-[0.5s] md:duration-[0.7s] ease-in-out text-[#004772] 
      ${isButtonClicked ? "text-5xl sm:text-6xl" : isHoveredText ? "text-5xl sm:text-7xl" : "text-5xl sm:text-6xl"}`}
    style={{
      top: isButtonClicked ? (isMobile ? "0.7%" : "0.3%") : "45%",
      left: "50%",
      transform: isButtonClicked
        ? "translate(-50%, 0)"
        : "translate(-50%, -50%)",
      pointerEvents: "none",
    }}
  >
    holoscope
  </h1>
)
export default Title
