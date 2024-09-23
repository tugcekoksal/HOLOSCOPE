const NavBar = ({ isMobile }) => (
  <nav
    className={`navbar fixed top-0 left-0 w-full ${isMobile ? 'h-[60px]' : 'h-[70px]'} z-20 mb-4`}
    style={{
      background: "linear-gradient(to bottom, #f3f4f6, white)", // Gradient from gray-100 to white
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      transition: "all 0.5s ease-in-out",
      marginTop: 0,
      paddingTop: "env(safe-area-inset-top)",
    }}
  />
);
export default NavBar
