import { useState, useEffect, useRef } from "react";
import hero_left_bg from "../../../images/b9f7c5e8-c835-403b-8029-47dcb0f0172c.jpg";

import { Navigate, useNavigate } from "react-router-dom";
import Footer from "../../sections/Footer";
import Navbar from "../../sections/Navbar";
import { justpostDataWithoutToken } from "../../../apiUtils";
const RegisterPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [contact_number, setContactNumber] = useState("");

  const [fullName, setFullName] = useState("");
  const [onBehalf, setBeHalf] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setCpassword] = useState("");
  const [date_of_birth, setDob] = useState("");
  const [caste, setCaste] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState(false);

  const [userNameError, setUserNameError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [onBehalfError, setBeHalfError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirm_passwordError, setCpasswordError] = useState("");
  const [date_of_birthError, setDobError] = useState("");
  const [casteError, setCasteError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [cityError, setCityError] = useState("");

  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const posstData = () => {
    console.log("i am here to check");
    const parameter = {
      url: "/api/user/",
      payload: {
        name: userName,
        contact_number,
        password,
        dob: date_of_birth,
        caste: caste,
        city,
        on_behalf: onBehalf,
        gender,
        email,
      },
      setErrors: setErrors,
      navigate: navigate,
      navUrl: `/login`,
    };

    justpostDataWithoutToken(parameter);
  };
  return (
    <>
      <Navbar />

      <div className="bg-dark relative text-white font-sans overflow-hidden ">
        <svg
          className=" absolute top-0 "
          width="2200"
          height="1200"
          viewBox="0 0 3057 1612"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.4" filter="url(#filter0_f_2513_5037)">
            <path
              d="M792.911 1177.39C2161.93 1205.37 2687.91 1336.3 2676.83 1053.46C2665.75 770.607 2531.75 162.933 1919.78 608.194C1307.81 1053.46 -348.73 258.382 744.376 396.308C1618.86 506.649 1812.51 859.393 1800.02 1021.97"
              stroke="url(#paint0_linear_2513_5037)"
              stroke-width="191"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_2513_5037"
              x="0.503906"
              y="0.507812"
              width="3055.99"
              height="1610.99"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="142"
                result="effect1_foregroundBlur_2513_5037"
              />
            </filter>
            <linearGradient
              id="paint0_linear_2513_5037"
              x1="722.914"
              y1="380"
              x2="2586.83"
              y2="1256.18"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#F998CE" />
              <stop offset="1" stop-color="#A188EE" />
            </linearGradient>
          </defs>
        </svg>

        {/* Hero Section */}
        <section className="container mx-auto h-screen flex items-start justify-center overflow-visible relative">
          {/* Right Section (65%) */}
          <div className="md:col-span-3 flex flex-col justify-between items-start py-20">
            {/* Register Form Section */}
            <div
              className="w-full max-w-3xl bg-blue-400 p-4 md:p-6 rounded-lg shadow-lg shadow-[#FFCEE9] border border-[#FFC1E4]"
              style={{
                background: "radial-gradient(at bottom left, #FFBCE1, #FFE0F1)",
              }}
            >
              <h3 className="text-base font-medium text-[#9E286A] mb-4 text-center">
                Fill out the fields—your perfect Nikah partner could be just a
                step away.
              </h3>

              <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {/* Name Field */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-[#9E286A]">
                    Gender
                  </label>
                  <div className="mt-2 flex items-center space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        className="text-[#ec57ac] accent-[#ec57ac] focus:ring-[#FBD7ED]"
                        onChange={(e) => setGender(e.target.value)}
                      />
                      <span className="ml-2 text-sm text-[#9E286A]">Male</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        className="text-[#ec57ac] accent-[#ec57ac] focus:ring-[#FBD7ED]"
                        onChange={(e) => setGender(e.target.value)}
                      />
                      <span className="ml-2 text-sm text-[#9E286A]">
                        Female
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-span-1">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[#9E286A]"
                  >
                    First Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="h-12 px-4 text-[#ec57ac] font-semibold placeholder-[#f5bddd] mt-2 w-full rounded-lg border border-[#FFC1E4] bg-[#FFF5FB] focus:outline-none focus:ring-2 focus:ring-[#FBD7ED]"
                    placeholder="Abdullah Afridi"
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-[#9E286A]"
                  >
                    Last Namev
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="h-12 px-4 text-[#ec57ac] font-semibold placeholder-[#f5bddd] mt-2 w-full rounded-lg border border-[#FFC1E4] bg-[#FFF5FB] focus:outline-none focus:ring-2 focus:ring-[#FBD7ED]"
                    placeholder="Abdullah Afridi"
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                {/* DOB Field */}
                <div className="col-span-1">
                  <label
                    htmlFor="dob"
                    className="block text-sm font-medium text-[#9E286A]"
                  >
                    Date Of Birth
                  </label>
                  <input
                    id="dob"
                    type="date"
                    className="h-12 px-4 text-[#ec57ac] font-semibold placeholder-[#f5bddd] mt-2 w-full rounded-lg border border-[#FFC1E4] bg-[#FFF5FB] focus:outline-none focus:ring-2 focus:ring-[#FBD7ED]"
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
 {/* Caste Field */}
 <div className="col-span-1">
                  <label
                    htmlFor="caste"
                    className="block text-sm font-medium text-[#9E286A]"
                  >
                    Caste
                  </label>
                  <input
                    id="caste"
                    type="text"
                    className="h-12 px-4 text-[#ec57ac] font-semibold placeholder-[#f5bddd] mt-2 w-full rounded-lg border border-[#FFC1E4] bg-[#FFF5FB] focus:outline-none focus:ring-2 focus:ring-[#FBD7ED]"
                    placeholder="-----------"
                    onChange={(e) => setCaste(e.target.value)}
                  />
                </div>

                {/* City Field */}
                <div className="col-span-1">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-[#9E286A]"
                  >
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    className="h-12 px-4 text-[#ec57ac] font-semibold placeholder-[#f5bddd] mt-2 w-full rounded-lg border border-[#FFC1E4] bg-[#FFF5FB] focus:outline-none focus:ring-2 focus:ring-[#FBD7ED]"
                    placeholder="Pune"
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                {/* On Behalf Field */}
                <div className="col-span-1">
                  <label
                    htmlFor="behalf"
                    className="block text-sm font-medium text-[#9E286A]"
                  >
                    On Behalf
                  </label>
                  <input
                    id="behalf"
                    type="text"
                    className="h-12 px-4 text-[#ec57ac] font-semibold placeholder-[#f5bddd] mt-2 w-full rounded-lg border border-[#FFC1E4] bg-[#FFF5FB] focus:outline-none focus:ring-2 focus:ring-[#FBD7ED]"
                    placeholder="Brother / Self / Sister"
                    onChange={(e) => setBeHalf(e.target.value)}
                  />
                </div>

                {/* Contact Field */}
                <div className="col-span-1">
                  <label
                    htmlFor="contact"
                    className="block text-sm font-medium text-[#9E286A]"
                  >
                    Contact Number
                  </label>
                  <input
                    id="contact"
                    type="number"
                    className="h-12 px-4 text-[#ec57ac] font-semibold placeholder-[#f5bddd] mt-2 w-full rounded-lg border border-[#FFC1E4] bg-[#FFF5FB] focus:outline-none focus:ring-2 focus:ring-[#FBD7ED]"
                    placeholder="+91 1234567890"
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                </div>

                {/* Email Field */}
                <div className="col-span-1 sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#9E286A]"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="h-12 px-4 text-[#ec57ac] font-semibold placeholder-[#f5bddd] mt-2 w-full rounded-lg border border-[#FFC1E4] bg-[#FFF5FB] focus:outline-none focus:ring-2 focus:ring-[#FBD7ED]"
                    placeholder="abdullahafridi@email.com"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password Field */}
                <div className="col-span-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#9E286A]"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="h-12 px-4 text-[#ec57ac] font-semibold placeholder-[#f5bddd] mt-2 w-full rounded-lg border border-[#FFC1E4] bg-[#FFF5FB] focus:outline-none focus:ring-2 focus:ring-[#FBD7ED]"
                    placeholder="************"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* Confirm Password Field */}
                <div className="col-span-1">
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-[#9E286A]"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    className="h-12 px-4 text-[#ec57ac] font-semibold placeholder-[#f5bddd] mt-2 w-full rounded-lg border border-[#FFC1E4] bg-[#FFF5FB] focus:outline-none focus:ring-2 focus:ring-[#FBD7ED]"
                    placeholder="************"
                    onChange={(e) => setCpassword(e.target.value)}
                  />
                </div>

               
                {/* Submit Button */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-center">
                  <button
                    onClick={(e) => posstData(e)}
                    type="button"
                    className="py-3 mt-4 px-8 bg-gradient-to-r from-[#EE68B3] to-[#FF8DCD] rounded-md shadow border border-[#ffb5de] text-white font-medium transition duration-300 hover:shadow-lg hover:from-[#D7599E] hover:to-[#F27EB5]"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default RegisterPage;
