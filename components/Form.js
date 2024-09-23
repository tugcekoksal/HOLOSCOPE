const Form = ({ handleSubmit, email, setEmail, emailError, buttonText, isTextVisible }) => (
  <form
    onSubmit={handleSubmit}
    noValidate
    style={{
      opacity: isTextVisible ? 1 : 0, // Form fades in when fully expanded
      transition: "opacity 1s ease-in-out", // Smooth fade-in transition
    }}
    className="flex flex-col items-center space-y-3 focus-within:bg-white rounded-[15px] w-full"
  >
    <input
      type="email"
      placeholder="Your email address"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="focus:bg-white mb-2 sm:mb-0 p-3 px-4 w-full sm:flex-grow rounded-[15px] outline-none border border-gray-300  bg-gray-100 text-gray-700 placeholder-gray-400  placeholder-opacity-75 "
      required
    />
    {/* Show error message */}
    {emailError && (
      <p className="text-red-500 text-sm font-medium ">
        {emailError}
      </p>
    )}
    <button
      type="submit"
      className="bg-[#0077be] font-montserrat text-white px-6 py-3 w-full sm:flex-grow rounded-[15px] hover:bg-[#005c9e] mt-2 sm:mt-0 font-semibold"
    >
      <span className="font-semibold">{buttonText}</span>
    </button>
  </form>
);
 export default Form