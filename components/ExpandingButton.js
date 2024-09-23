import Form from "./Form";
export const ExpandingButton = ({
  isButtonClicked,
  buttonRef,
  handleButtonClick,
  isExpand,
  isFullyExpanded,
  buttonText,
  handleCloseClick,
  shine,
  email,
  setEmail,
  emailError,
  handleSubmit,
  isTextVisible,
}) => (
  <button
    ref={buttonRef}
    className={`absolute flex flex-col items-center justify-center z-10 rounded-sm shadow-lg font-semibold transition-all duration-1000 ease-out fade-in-button font-montserrat
    ${isButtonClicked ? "bg-white" : "bg-[#0077be] text-white  hover:bg-[#005c9e]"}  ${isFullyExpanded ? "mobile-height" : ""}`}
    style={{
      top: "55%", // Always center vertically
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: isExpand ? (isFullyExpanded ? "90%" : "300px") : "200px",
      maxWidth: isFullyExpanded ? "500px" : "none",
      height: isExpand ? (isFullyExpanded ? "400px" : "100px") : "auto",
      padding: isButtonClicked ? (isFullyExpanded ? "30px" : "16px 24px") : "14px 20px",
      borderRadius: "20px",
      boxShadow: isButtonClicked ? "0 8px 30px rgba(0, 0, 0, 0.15)" : "0 2px 5px rgba(0, 0, 0, 0.1)",
      transformOrigin: "center",
      transition: "all 0.6s ease-out",
    }}
    onClick={!isButtonClicked ? handleButtonClick : undefined}
  >
    {!isButtonClicked && (
      <div className="shine-effect" />
    )}

    {isFullyExpanded ? (
      <>
        {/* Close Button */}
        <button
          className="absolute top-[-10px] right-[-10px] w-8 h-8 rounded-full bg-[#0077be] text-white hover:bg-[#005c9e] transition-colors"
          onClick={handleCloseClick}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Main Text and Description */}
        <div
          className="w-full mx-auto"
          style={{
            opacity: isTextVisible ? 1 : 0, // Use isTextVisible to control visibility
            transition: "opacity 3s ", // Smooth fade-in transition
          }}
        >
          <h2 className={` mb-4 text-[2rem] text-left flex-wrap text-gray-700 font-montserrat`}>
            Montez dans le train ! 🚂
          </h2>

          <p className="text-left text-sm mb-8 font-normal text-gray-500 font-montserrat">
            Vos employés utilisent ChatGPT, top ! Au-delà de ça, vous ne savez pas comment tirer partie de cette révolution de l’IA pour faire{" "}
            <span className="font-semibold mx-2">
              exploser votre chiffre d’affaires ?
            </span>
            Ne restez pas sur le quai, montez dans le train — notre plateforme est faite pour ça ;)
          </p>
        </div>

        {/* Email Form */}
        <Form handleSubmit={handleSubmit} email={email} setEmail={setEmail} emailError={emailError} buttonText={buttonText} isTextVisible={isTextVisible} />      </>
    ) : (
      <span
        style={{
          position: "relative",
          zIndex: 1,
          opacity: isExpand ? 0 : 1,
          transition: "opacity 0.3s",
        }}
      >
        🤖 + 👨 = ♥️
      </span>
    )}
  </button>
);
