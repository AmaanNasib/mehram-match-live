import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Use NavLink instead of Link
import logo from "../../images/newLogo.jpg";

// Add custom CSS for smooth animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
      max-height: 0;
    }
    to {
      opacity: 1;
      transform: translateY(0);
      max-height: 100vh;
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateY(0);
      max-height: 100vh;
    }
    to {
      opacity: 0;
      transform: translateY(-20px);
      max-height: 0;
    }
  }
  
  .animate-slideDown {
    animation: slideDown 0.4s ease-out forwards;
  }
  
  .animate-slideUp {
    animation: slideUp 0.4s ease-in forwards;
  }
`;
document.head.appendChild(style);

const Navbar = ({ isLogIn, setLogin, login }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const registerDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  // Handle login button click
  const handleLoginClick = () => {
    setLogin(!login); // Toggle login state
    navigate("/login"); // Navigate to the login page
    setIsDropdownVisible(false); // Close dropdown if open

  };

  // Handle logout button click
  const handleLogoutClick = () => {
    localStorage.clear(); // Clear local storage
    setLogin(false); // Update login state
    navigate("/"); // Navigate to the home page
    setIsDropdownVisible(false); // Close dropdown if open

  };

  const closeDropdown = (role) => {
    localStorage.setItem("role",role||'')
 
    
    setIsDropdownVisible(false);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        registerDropdownRef.current &&
        !registerDropdownRef.current.contains(event.target)
      ) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-3">
        {/* Mobile Layout */}
        <div className="lg:hidden flex items-center justify-between">
          {/* Logo on the left */}
          <NavLink to="/" className="flex-shrink-0">
            <div className="logo">
              <img 
                src={logo} 
                style={{ width: "8rem", height: "2rem" }} 
                alt="Mehram Match" 
                className="logo-img" 
              />
            </div>
          </NavLink>

          {/* Mobile Hamburger Menu Button - Right aligned */}
          <button
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between">
          {/* Logo on the left */}
          <NavLink to="/" className="flex-shrink-0">
            <div className="logo">
              <img 
                src={logo} 
                style={{ width: "12rem", height: "3rem" }} 
                alt="Mehram Match" 
                className="logo-img" 
              />
            </div>
          </NavLink>

          {/* Desktop Navigation links */}
          <div className="nav-links space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Home
            </NavLink>
            <NavLink
              to="/about-us"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              About
            </NavLink>
            <NavLink
              to="/guidance"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Guidance
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Services
            </NavLink>
            <NavLink
              to="/contact-us"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Contact Us
            </NavLink>
          </div>

          {/* Desktop Buttons */}
          <div className="flex space-x-4">
            {/* Login Button */}
            <button
              onClick={handleLoginClick}
              className="text-white px-4 py-2 rounded-md bg-gradient-to-r from-[#EE68B3] to-[#FF8DCD] shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Login
            </button>

            {/* Register Button */}
            <div className="relative group">
              <button
                className="text-white px-4 py-2 rounded-md bg-gradient-to-r from-[#833E8D] to-[#FF59B6] shadow-lg hover:shadow-xl"
                onClick={toggleDropdown}
              >
                Register
              </button>

              {isDropdownVisible && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-100">
                  <NavLink
                    to="/individual"
                    onClick={()=>{closeDropdown("member")}}
                    className={({ isActive }) =>
                      `block px-6 py-3 text-center font-medium no-underline rounded-b-md transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-[#833E8D] to-[#FF59B6] text-white"
                          : "bg-white text-[#833E8D] hover:bg-gradient-to-r hover:from-[#FF59B6] hover:to-[#833E8D] hover:text-white"
                      }`
                    }
                  >
                    Individual
                  </NavLink>
                </div>
              )}
            </div>

            {/* Log Out Button */}
            {isLogIn && (
              <button
                className="text-white px-4 py-2 rounded-md bg-gradient-to-r from-[#833E8D] to-[#FF59B6] shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleLogoutClick}
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div 
          className="lg:hidden bg-white/98 backdrop-blur-xl border-t border-gray-200 shadow-2xl"
          style={{
            animation: 'slideDown 0.4s ease-out forwards'
          }}
        >
          <div className="px-4 py-4 space-y-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-[#FF59B6]/10 hover:text-[#FF59B6] rounded-lg transition-all duration-200 font-medium ${
                  isActive ? "bg-[#FF59B6] text-white" : ""
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                isMenuOpen ? "bg-[#FF59B6] text-white" : "bg-gray-100"
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-sm">Home</span>
            </NavLink>

            <NavLink
              to="/about-us"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-[#FF59B6]/10 hover:text-[#FF59B6] rounded-lg transition-all duration-200 font-medium ${
                  isActive ? "bg-[#FF59B6] text-white" : ""
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                isMenuOpen ? "bg-[#FF59B6] text-white" : "bg-gray-100"
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-sm">About Us</span>
            </NavLink>

            <NavLink
              to="/guidance"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-[#FF59B6]/10 hover:text-[#FF59B6] rounded-lg transition-all duration-200 font-medium ${
                  isActive ? "bg-[#FF59B6] text-white" : ""
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                isMenuOpen ? "bg-[#FF59B6] text-white" : "bg-gray-100"
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-sm">Guidance</span>
            </NavLink>

            <NavLink
              to="/services"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-[#FF59B6]/10 hover:text-[#FF59B6] rounded-lg transition-all duration-200 font-medium ${
                  isActive ? "bg-[#FF59B6] text-white" : ""
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                isMenuOpen ? "bg-[#FF59B6] text-white" : "bg-gray-100"
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="text-sm">Services</span>
            </NavLink>

            <NavLink
              to="/contact-us"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-[#FF59B6]/10 hover:text-[#FF59B6] rounded-lg transition-all duration-200 font-medium ${
                  isActive ? "bg-[#FF59B6] text-white" : ""
                }`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                isMenuOpen ? "bg-[#FF59B6] text-white" : "bg-gray-100"
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="text-sm">Contact Us</span>
            </NavLink>
            
            {/* Mobile Buttons */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <button
                onClick={() => {
                  handleLoginClick();
                  setIsMenuOpen(false);
                }}
                className="w-full text-white px-4 py-2 rounded-md bg-gradient-to-r from-[#EE68B3] to-[#FF8DCD] shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
              >
                Login
              </button>

              <NavLink
                to="/individual"
                onClick={() => {
                  closeDropdown("member");
                  setIsMenuOpen(false);
                }}
                className="block w-full text-center text-white px-4 py-2 rounded-md bg-gradient-to-r from-[#833E8D] to-[#FF59B6] shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
              >
                Register
              </NavLink>

              {isLogIn && (
                <button
                  onClick={() => {
                    handleLogoutClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-white px-4 py-2 rounded-md bg-gradient-to-r from-[#833E8D] to-[#FF59B6] shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                >
                  Log Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;