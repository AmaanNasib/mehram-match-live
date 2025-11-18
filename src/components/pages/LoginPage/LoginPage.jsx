import React, { useEffect, useState } from "react";
import hero1 from "../../../images/herobg2.png";
import logo from "../../../images/footerLogo.svg";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../../../apiUtils";

const LoginPage = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role) localStorage.setItem("role", role || "");
  }, [role]);

  useEffect(() => {
    if (!serverMessage) return;
    const t = setTimeout(() => setServerMessage(""), 5000);
    return () => clearTimeout(t);
  }, [serverMessage]);

  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());

  const validateForm = () => {
    const e = {};
    if (!role) e.role = "Please select a role.";
    if (!email) e.email = "Email / Profile ID is required.";
    else if (!validateEmail(email)) e.email = "Please enter a valid email.";
    if (!password) e.password = "Password is required.";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev?.preventDefault();
    setServerMessage("");
    const v = validateForm();
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    try {
      const endpoint =
        role === "agent"
          ? `${process.env.REACT_APP_API_URL}/api/agent/login_agent/`
          : `${process.env.REACT_APP_API_URL}/api/token/`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, email, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg =
          body?.detail ||
          body?.message ||
          "The email or password you entered is incorrect. Please try again.";
        setServerMessage(msg);
        setLoading(false);
        return;
      }

      const data = await res.json();
      const { access, refresh } = data;

      localStorage.setItem("token", access || "");
      if (refresh) localStorage.setItem("refresh", refresh || "");
      localStorage.setItem("loginTime", new Date().toISOString());

      let profileCompleted = false;
      let profilePercentage = 0;

      if (access) {
        try {
          const decoded = jwtDecode(access);
          if (decoded?.user_id) localStorage.setItem("userId", decoded.user_id);
          const name = `${decoded?.first_name || ""} ${decoded?.last_name || ""}`.trim();
          if (name) localStorage.setItem("name", name);
          profileCompleted = decoded?.profile_completed ?? profileCompleted;
          profilePercentage = decoded?.profile_percentage ?? profilePercentage;
        } catch (err) {
          console.warn("JWT decode failed", err);
        }
      }

      // prefer server response values if present
      if (data.profile_completed !== undefined) profileCompleted = data.profile_completed;
      if (data.profile_percentage !== undefined) profilePercentage = data.profile_percentage;

      console.log("Profile completed:", profileCompleted, "percentage:", profilePercentage);

      // navigation logic
      let navUrl = "/newdashboard";
      if (role === "agent") {
        navUrl = "/newdashboard";
      } else {
        // place custom logic for incomplete profiles if needed:
        // if (!profileCompleted) navUrl = "/complete-profile";
        navUrl = "/newdashboard";
      }

      navigate(navUrl, { state: { data: "reload" } });
    } catch (err) {
      console.error(err);
      setServerMessage("Unable to connect. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Google OAuth handlers
  const handleGoogleSuccess = (credentialResponse) => {
    if (!credentialResponse?.credential) {
      setServerMessage("Google login failed. Please try again.");
      return;
    }

    try {
      // decode JWT (Google credential)
      const base64Url = credentialResponse.credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const userData = JSON.parse(jsonPayload);

      if (!role) {
        setErrors((p) => ({ ...p, role: "Select role before Google login." }));
        setServerMessage("Please select a role before continuing with Google login.");
        return;
      }

      const loginData = {
        email: userData.email,
        google_id: userData.sub,
        auth_provider: "google",
        role,
      };

      localStorage.setItem("role", role);

      const loginUrl = role === "agent" ? "/api/agent/login/" : "/api/user/login/";

      const parameter = {
        url: loginUrl,
        payload: loginData,
        setErrors: (msg) => setServerMessage(msg),
        navigate,
        navUrl: "/newdashboard",
        showSuccessMessage: (msg) => console.log("Google login success:", msg),
        showErrorMessage: (msg) => {
          console.log("Google login failed:", msg);
          setServerMessage(msg);
        },
      };

      // call your API helper for google login
      googleLogin(parameter);
    } catch (err) {
      console.error("Error decoding Google token:", err);
      setServerMessage("Google login failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    setServerMessage("Google login failed. Please try again.");
  };

  const handleOtpLogin = () => navigate("/login-otp");

  const isFormValid = Object.keys(validateForm()).length === 0;

  return (
    <>
      {serverMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-50 text-red-700 px-4 py-2 rounded shadow">{serverMessage}</div>
        </div>
      )}

      <div
        className="flex flex-col justify-center items-center min-h-screen w-full px-4 sm:px-6 lg:px-8 py-8"
        style={{
          backgroundImage: `url(${hero1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-white">
          <img
            src={logo}
            className="w-32 h-16 sm:w-40 sm:h-20 md:w-48 md:h-24 lg:w-56 lg:h-28 mx-auto mb-4 sm:mb-6"
            alt="Logo"
          />
          <h2 className="text-center text-lg sm:text-xl md:text-2xl font-bold text-black mb-4 sm:mb-6">
            Welcome Back! Please Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4" onKeyDown={handleKeyDown} noValidate>
            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-xs sm:text-sm font-medium text-black mb-1 sm:mb-2">
                Role
              </label>
              <div className="relative">
                <select
                  id="role"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    setErrors((p) => ({ ...p, role: "" }));
                  }}
                  className={`h-10 sm:h-12 px-3 text-xs sm:text-sm text-black font-semibold mt-1 w-full rounded-lg border ${
                    errors.role ? "border-red-400" : "border-gray-300"
                  } bg-white focus:outline-none focus:ring-1 focus:ring-gray-500`}
                >
                  <option value="">Select a role</option>
                  <option value="individual">Individual</option>
                  <option value="agent">Agent</option>
                </select>
              </div>
              {errors.role && <p className="text-red-500 font-medium text-xs mt-1">{errors.role}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-black mb-1 sm:mb-2">
                User Name
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((p) => ({ ...p, email: "" }));
                  }}
                  placeholder="Profile ID / Mobile Number / Email Address"
                  className={`h-10 sm:h-12 px-3 text-xs sm:text-sm text-black font-semibold mt-1 w-full rounded-lg border ${
                    errors.email ? "border-red-400" : "border-gray-300"
                  } bg-white focus:outline-none focus:ring-1 focus:ring-gray-500`}
                />
              </div>
              {errors.email && <p className="text-red-500 font-medium text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-black mb-1 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((p) => ({ ...p, password: "" }));
                  }}
                  placeholder="Password"
                  className={`h-10 sm:h-12 px-3 text-xs sm:text-sm text-black font-semibold mt-1 w-full rounded-lg border ${
                    errors.password ? "border-red-400" : "border-gray-300"
                  } bg-white focus:outline-none focus:ring-2 focus:ring-gray-500`}
                />
              </div>
              {errors.password && <p className="text-red-500 font-medium text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="text-right">
              <a href="#" className="text-xs sm:text-sm text-[#ec57ac] hover:underline font-[500]" onClick={(e) => e.preventDefault()}>
                Forgot Password?
              </a>
            </div>

            {/* Login button */}
            <div>
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className={`w-full py-2 sm:py-3 rounded-[20px] shadow border-none text-white font-medium transition duration-300 hover:shadow-lg text-sm sm:text-base ${
                  loading || !isFormValid ? "bg-gray-300 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
                }`}
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-2 sm:mx-4 text-pink-500 font-semibold text-xs sm:text-sm">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* OTP */}
            <div>
              <button
                type="button"
                onClick={handleOtpLogin}
                className="w-full py-2 sm:py-3 bg-white rounded-[20px] shadow border border-gray-300 text-pink-500 font-medium transition duration-300 hover:shadow-lg hover:border-pink-500 text-sm sm:text-base"
              >
                Login with Mobile OTP
              </button>
            </div>

            {/* Google */}
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
                  className="w-full"
                />
              </GoogleOAuthProvider>
            </div>
          </form>

          <div className="mt-3 sm:mt-4 font-medium text-center text-xs sm:text-sm text-black">
            New Here?{" "}
            <a href="/" className="font-medium text-sky-500 no-underline font-[400]">
              Register Free
            </a>
          </div>

          <div className="mt-3 sm:mt-4 font-medium text-center text-xs sm:text-sm text-black pb-2">
            Need Help in Login? Call{" "}
            <a href="tel:+919898989898" className="text-sky-500 no-underline">
              📞 +91 9898989898
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
