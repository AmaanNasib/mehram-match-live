import { useState, useEffect } from "react";
import hero1 from "../../../images/herobg2.png";
import logo from "../../../images/footerLogo.svg";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { googleLogin } from '../../../apiUtils';

const LoginPage = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleError, setRoleError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  }, [errorMessage]);
  useEffect(() => {
    if (role) {
      localStorage.setItem("role", role ||'');
    }
  }, [role]);

  useEffect(() => {
    const isEmailValid = email && validateEmail(email);
    const isPasswordValid = password;
    setIsFormValid(isEmailValid && isPasswordValid);
  }, [email, password]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const login = async () => {
    setEmailError("");
    setPasswordError("");
    setErrorMessage("");

    if (!email) {
      setEmailError("Email cannot be empty. Please enter your email address.");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Email format is incorrect. Please check and try again.");
      return;
    }

    if (!password) {
      setPasswordError("Password cannot be empty. Please enter your password.");
      return;
    }

    if (!role) {
      setRoleError("Select role.");
      return;
    }

    try {
      const response = await fetch(role=='agent'?`${process.env.REACT_APP_API_URL}/api/agent/login_agent/`:`${process.env.REACT_APP_API_URL}/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email, password }),
      });

      if (!response.ok) {
        setErrorMessage("The email or password you entered is incorrect. Please try again.");
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      const { access, refresh } = data;

      localStorage.setItem("token", access ||'');
      localStorage.setItem("refresh", refresh ||'');
      localStorage.setItem("loginTime", new Date().toISOString());

      let userId = "";
      let profileCompleted = false;
      let profilePercentage = 0;

      if (access) {
        const decoded = jwtDecode(access);
        userId = decoded.user_id || "";
        localStorage.setItem("userId", userId);
        localStorage.setItem("name", `${decoded.first_name ||''} ${decoded.last_name ||""}` || "");
        
        // Check if profile completion info is in the JWT token
        profileCompleted = decoded.profile_completed || false;
        profilePercentage = decoded.profile_percentage || 0;
      }

      // Check profile completion from API response if available
      if (data.profile_completed !== undefined) {
        profileCompleted = data.profile_completed;
      }
      if (data.profile_percentage !== undefined) {
        profilePercentage = data.profile_percentage;
      }

      console.log("Regular login - Profile completed:", profileCompleted);
      console.log("Regular login - Profile percentage:", profilePercentage);

      // Navigate based on profile completion status
      let navUrl;
      if (profileCompleted === true || profilePercentage >= 100) {
        // Profile is complete, go to dashboard
        navUrl = "/newdashboard";
        console.log("Profile complete - navigating to dashboard");
      } else {
        // Profile incomplete, go to MemStepOne
        navUrl = `/memstepone/${userId}`;
        console.log("Profile incomplete - navigating to MemStepOne");
      }

      navigate(navUrl, { state: { data: "reload" } });
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleOtpLogin = () => {
    navigate("/login-otp");
  };

  // Google OAuth Success Handler
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      // Decode the JWT token to get user info
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const userData = JSON.parse(jsonPayload);
      
      // Prepare login data for Google OAuth API
      const loginData = {
        email: userData.email,
        google_id: userData.sub, // Google user ID
        auth_provider: 'google'
      };
      
      // Call Google login API
      const parameter = {
        url: "/api/user/login/",
        payload: loginData,
        setErrors: setErrorMessage,
        navigate: navigate,
        navUrl: "/newdashboard",
        showSuccessMessage: (message) => {
          console.log("Google login successful:", message);
        },
        showErrorMessage: (message) => {
          console.log("Google login failed:", message);
          setErrorMessage(message);
        },
      };
      googleLogin(parameter);
    } catch (error) {
      console.error('Error decoding Google token:', error);
      setErrorMessage('Google login failed. Please try again.');
    }
  };

  // Google OAuth Error Handler
  const handleGoogleError = () => {
    console.error('Google OAuth failed');
    setErrorMessage('Google login failed. Please try again.');
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      login();
    }
  };

  return (
    <>
      {errorMessage && <p className="errormessage">{errorMessage}</p>}
      <div
        className="flex flex-col justify-center items-center min-h-screen w-full px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `url(${hero1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-white">
          <img src={logo} className="w-32 h-16 sm:w-40 sm:h-20 md:w-48 md:h-24 lg:w-56 lg:h-28 mx-auto mb-4 sm:mb-6" alt="Logo" />
          <h2 className="text-center text-lg sm:text-xl md:text-2xl font-bold text-black mb-4 sm:mb-6">
            Welcome Back! Please Login
          </h2>

          <form className="space-y-3 sm:space-y-4" onKeyDown={handleKeyDown}>
            {/* Role Field */}
            <div>
              <label htmlFor="role" className="block text-xs sm:text-sm font-medium text-black font-[400] mb-1 sm:mb-2">
                Role
              </label>
              <div className="relative">
                <select
                  id="role"
                  className={`h-10 sm:h-12 px-3 py-1 text-xs sm:text-sm text-black font-semibold mt-1 w-full rounded-lg border ${roleError ? "border-[#FF4646]" : "border-gray-300"
                    } bg-white focus:outline-none focus:ring-1 focus:ring-gray-500`}
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    setRoleError("");
                  }}
                >
                  <option value="" disabled>Select a role</option>
                  <option value="individual">Individual</option>
                  <option value="agent">Agent</option>
                </select>
                {roleError && (
                  <span className="absolute inset-y-0 right-3 flex items-center text-red-500 text-sm sm:text-lg">
                    ❗
                  </span>
                )}
              </div>
              {roleError && (
                <p className="text-red-500 font-medium text-xs mt-1">{roleError}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-black font-[400] mb-1 sm:mb-2">
                User Name
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  className={`h-10 sm:h-12 px-3 py-1 text-xs sm:text-sm text-black font-semibold placeholder-gray-500 mt-1 w-full rounded-lg border ${
                    emailError ? "border-[#FF4646]" : "border-gray-300"
                  } bg-white focus:outline-none focus:ring-1 focus:ring-gray-500`}
                  placeholder="Profile ID / Mobile Number / Email Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                />
                {emailError && (
                  <span className="absolute inset-y-0 right-3 flex items-center text-red-500 text-sm sm:text-lg">
                    ❗
                  </span>
                )}
              </div>
              {emailError && (
                <p className="text-red-500 font-medium text-xs mt-1">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-black font-[400] mb-1 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  className={`h-10 sm:h-12 px-3 py-1 text-xs sm:text-sm text-black font-semibold placeholder-gray-500 mt-1 w-full rounded-lg border ${
                    passwordError ? "border-[#FF4646]" : "border-gray-300"
                  } bg-white focus:outline-none focus:ring-2 focus:ring-gray-500`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                />
                {passwordError && (
                  <span className="absolute inset-y-0 right-3 flex items-center text-red-500 text-sm sm:text-lg">
                    ❗
                  </span>
                )}
              </div>
              {passwordError && (
                <p className="text-red-500 font-medium text-xs mt-1">{passwordError}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <a href="#" className="text-xs sm:text-sm text-[#ec57ac] hover:underline font-[500]">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="button"
                className={`w-full py-2 sm:py-3 rounded-[20px] shadow border-none text-white font-medium transition duration-300 hover:shadow-lg text-sm sm:text-base ${
                  isFormValid ? "bg-pink-500 hover:bg-pink-600" : "bg-[#D3D3D3] hover:bg-[#C0C0C0]"
                }`}
                onClick={login}
              >
                Login
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-2 sm:mx-4 text-pink-500 font-semibold text-xs sm:text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* OTP Login Button */}
            <div>
              <button
                type="button"
                className="w-full py-2 sm:py-3 bg-white rounded-[20px] shadow border border-gray-300 text-pink-500 font-medium transition duration-300 hover:shadow-lg hover:border-pink-500 text-sm sm:text-base"
                onClick={handleOtpLogin}
              >
                Login with Mobile OTP
              </button>
            </div>

            {/* Google Login Button */}
            <div>
              <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || "your-google-client-id"}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap={false}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width="100%"
                  className="w-full"
                />
              </GoogleOAuthProvider>
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-3 sm:mt-4 font-medium text-center text-xs sm:text-sm text-black">
            New Here?{" "}
            <a href="/" className="font-medium text-sky-500 no-underline font-[400]">
              Register Free
            </a>
          </div>

          {/* Help Text */}
          <div className="mt-3 sm:mt-4 font-medium text-center text-xs sm:text-sm text-black pb-2">
            Need Help in Login? Call 📞
            <a href="tel:+919898989898" className="text-sky-500 no-underline">
              +91 9898989898
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;













// import { useState, useEffect } from "react";
// import hero_left_bg from "../../../images/b9f7c5e8-c835-403b-8029-47dcb0f0172c.jpg";
// import Navbar from "../../sections/Navbar";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import logo from "../../../images/footerLogo.svg";
// import hero1 from "../../../images/herobg2.png";

// const LoginPage = () => {
//   const navigate = useNavigate();

//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [emailError, setEmailError] = useState("");
//   const [passwordError, setPasswordError] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   useEffect(() => {
//     if (errorMessage) {
//       setTimeout(() => {
//         setErrorMessage("");
//       }, 5000);
//     }
//   }, [errorMessage]);

//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const login = async (e) => {
//     setEmailError("");
//     setPasswordError("");
//     setErrorMessage("");

//     if (!email) {
//       setEmailError("Email cannot be empty. Please enter your email address.");
//       return;
//     }

//     if (!validateEmail(email)) {
//       setEmailError("Email format is incorrect. Please check and try again.");
//       return;
//     }

//     if (!password) {
//       setPasswordError("Password cannot be empty. Please enter your password.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_URL}/api/token/`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ email, password }),
//         }
//       );

//       if (!response.ok) {
//         setErrorMessage("The email or password you entered is incorrect. Please try again.");
//         throw new Error("Invalid credentials");
//       }

//       const data = await response.json();
//       const { access, refresh } = data;

//       const currentDate = new Date().toISOString();
//       localStorage.setItem("token", access);
//       localStorage.setItem("refresh", refresh);
//       localStorage.setItem("loginTime", currentDate);

//       if (access) {
//         const decoded = jwtDecode(access);
//         const userId = decoded.user_id || "";
//         localStorage.setItem("userId", userId);
//       }

//       navigate("/newdashboard", { state: { data: "reload" } });
//     } catch (error) {
//       console.error(error.message);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault(); // Prevent default form submission behavior
//       login();
//     }
//   };

//   return (
//     <>
//       {errorMessage && <p className="errormessage">{errorMessage}</p>}
//       <div
//         className="flex flex-col justify-center items-center min-h-screen w-full"
//         style={{
//           backgroundImage: `url(${hero1})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <div className="w-[80%] max-w-[550px]  bg-white p-16 rounded-3xl shadow-2xl border-2 border-white">
//           <img src={logo} className="w-[220px] h-[120px] mx-auto" alt="Logo" />
//           <h2 className="text-center text-xl font-bold text-black mb-4">
//             Welcome Back! Please Login
//           </h2>

//           <form className="space-y-4" onKeyDown={handleKeyDown}>
//             {/* Email Field */}
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-black font-[400]"
//               >
//                 User Name
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 className="h-10 px-3 py-1 text-sm text-black font-semibold placeholder-gray-500 mt-1 w-full rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-gray-500 focus:bg-white"
//                 placeholder="Profile ID / Mobile Number / Email Address"
//                 value={email}
//                 style={{
//                   border: emailError ? "1px solid #FF4646" : "",
//                 }}
//                 onChange={(e) => {
//                   setEmail(e.target.value);
//                   setEmailError("");
//                 }}
//               />
//               {emailError && (
//                 <p className="text-red-500 font-medium text-xs mt-1">{emailError}</p>
//               )}
//             </div>

//             {/* Password Field */}
//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-black font-[400]"
//               >
//                 Password
//               </label>
//               <input
//                 id="password"
//                 type="password"
//                 className="h-10 px-3 py-1 text-sm text-black font-semibold placeholder-gray-500 mt-1 w-full rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500"
//                 placeholder="Password"
//                 value={password}
//                 style={{
//                   border: passwordError ? "1px solid #FF4646" : "",
//                 }}
//                 onChange={(e) => {
//                   setPassword(e.target.value);
//                   setPasswordError("");
//                 }}
//               />
//               {passwordError && (
//                 <p className="text-red-500 font-medium text-xs mt-1">{passwordError}</p>
//               )}
//             </div>

//             {/* Forgot Password Link */}
//             <div className="text-right">
//               <a
//                 href="#"
//                 className="text-sm text-[#ec57ac] hover:underline font-[500]"
//               >
//                 Forgot Password?
//               </a>
//             </div>

//             {/* Submit Button */}
//             <div>
//               <button
//                 type="button"
//                 className="w-full py-2 bg-[#D3D3D3] rounded-[20px] shadow border-none text-gray-700 font-medium transition duration-300 hover:shadow-lg hover:bg-[#C0C0C0]"
//                 onClick={login}
//               >
//                 Login
//               </button>
//             </div>

//             {/* Divider */}
//             <div className="flex items-center">
//               <div className="flex-grow border-t border-gray-300"></div>
//               <span className="mx-4 text-pink-500 font-semibold">OR</span>
//               <div className="flex-grow border-t border-gray-300"></div>
//             </div>

//             {/* OTP Login Button */}
//             <div>
//               <button
//                 type="button"
//                 className="w-full py-2 bg-white rounded-[20px] shadow border border-gray-300 text-pink-500 font-medium transition duration-300 hover:shadow-lg hover:border-pink-500"
//                 onClick={login}
//               >
//                 Login with Mobile OTP
//               </button>
//             </div>
//           </form>

//           {/* Register Link */}
//           <div className="mt-4 font-medium text-center text-sm text-black">
//             New Here?{" "}
//             <a
//               href="/"
//               className="font-medium text-sky-500 font-[400]"
//             >
//               Register Free
//             </a>
//           </div>

//           {/* Help Text */}
//           <div className="mt-4 font-medium text-center text-sm text-black pb-2">
//             Need Help in Login? Call 📞 +91 9898989898
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default LoginPage;