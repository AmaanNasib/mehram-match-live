import { useState, useEffect, useRef } from "react";
import hero_left_bg from "../../../images/b9f7c5e8-c835-403b-8029-47dcb0f0172c.jpg";
import Navbar from "../../sections/Navbar";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../../../images/footerLogo.png";
import hero1 from "../../../images/herobg2.png";

const LoginPopup = () => {
 const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();
  const [errors, setErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setTimeout(() => {
      setErrors(null);
    }, 5000);
  }, [errors]);

  const login = async (e) => {
    if (!email || !password) {
      setEmailError(email ? false : true);
      setPasswordError(password ? false : true);
      setErrors(true);
      setErrorMessage("Please Fill The Input");
    } else {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/token/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
        );

        if (!response.ok) {
          setErrors(true);
          setErrorMessage("Invalid credentials");
          setTimeout(() => {
            setErrors(null);
          }, 5000);
          throw new Error("Invalid credentials");
        }

        const data = await response.json();
        const { access, refresh } = data;

        const currentDate = new Date().toISOString();
        localStorage.setItem("token", access);
        localStorage.setItem("refresh", refresh);
        localStorage.setItem("loginTime", currentDate);
        if (access) {
          const decoded = jwtDecode(access);
          const userId = decoded.user_id ? decoded.user_id : "";
          localStorage.setItem("userId", userId ? userId : "");
        }

        navigate("/newdashboard", { state: { data: "reload" } });
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission behavior
      login();
    }
  };
  return (
    <div
className="w-[35vw] h-[87vh]  m-[auto] bg-blue-400 p-0 md:p-0 md:px-8 rounded-lg shadow-2xl shadow-[#FFCEE9] border-2 border-[white]"
style={{ background: "white", position : "fixed",zIndex:"2", left : "32.5%", top : "10%" , paddingTop :"1vh"}}
    >
      <img
        src={logo}
        style={{ width: "7vw",height : "7vw", margin: "auto", padding :"0.5vw"}}
        alt="Logo"
      />
      <h2 className="text-center text-x font-[500] text-[black] mb-3">
        Welcome Back! Please Login
      </h2>

      <form className="space-y-4" onKeyDown={handleKeyDown}>
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-[2.1vh] text-[black] font-[300]"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className="h-10 px-4 py-2 text-[black] font-semibold placeholder-[gray] placeholder:text-[2vh] placeholder:font-[300] mt-1 w-full rounded-lg border border-[gray] bg-[white] focus:outline-none focus:ring-1 focus:ring-[gray]"
            placeholder="example@email.com"
            value={email}
            style={{ border: emailError ? "1px solid #FF4646" : "" }}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(false);
            }}
          />
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-[2.1vh] font-[300] text-[black]"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className="h-10 px-4 text-[black] font-semibold placeholder-[gray] placeholder-[gray] placeholder:text-[2vh] placeholder:font-[300] mt-1 w-full rounded-lg border border-[gray] bg-[white] focus:outline-none focus:ring-2 focus:ring-[gray]"
            placeholder="************"
            value={password}
            style={{ border: passwordError ? "1px solid #FF4646" : "" }}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(false);
            }}
          />
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <a
            href="#"
            className="text-[1.9vh] text-[#ec57ac] hover:underline font-[300]"
          >
            Forgot your password?
          </a>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="button"
            className="w-full h-10 py-1  bg-[#D3D3D3] rounded-[5vw] shadow border border-none text-[gray] font-medium transition duration-300 hover:shadow-lg hover:text-[white] hover:bg-[#ec4899]"
            onClick={login}
          >
            Login
          </button>
        </div>

        <div className="flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-pink-500 font-semibold">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div>
          <button
            type="button"
            className="w-full h-10 bg-[white] py-1 rounded-[5vw] shadow border border-[gray] text-pink-500 font-medium transition duration-300 hover:shadow-lg hover:from-[#D7599E] hover:to-[#F27EB5]"
            onClick={login}
          >
            Login with Mobile OTP
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="mt-10 text-center text-[1.7vh] text-[black]">
        New Here?{" "}
        <a href="/" className="text-[lightblue] text-[1.7vh] font-[400] hover:underline">
          Register Free
        </a>
      </div>

      <div className=" text-center text-[1.7vh] text-[black] pb-10 pt-4">
        Need Help in Login? Call 📞 +91 9898989898
      </div>
    </div>
  );
};

export default LoginPopup;
