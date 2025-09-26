import { FcGoogle } from "react-icons/fc";

import { React, useState, useEffect, useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import hero_left_bg from "../../../images/b9f7c5e8-c835-403b-8029-47dcb0f0172c.jpg";
// import video from "../../../images/6554025-uhd_3840_2160_24fps.mp4";
import Footer from "../../sections/Footer";
import Navbar from "../../sections/Navbar";
import PlanCard from "./PlanCard";
import ProfileCardList from "./ProfileCardList";
import { useLocation } from "react-router-dom";
import hero1 from "../../../images/hh1.jpg";
import hero2 from "../../../images/hero2.jpeg";
import hero3 from "../../../images/hero3.avif";
// import img from "../../../images/img1.jpg";
// import herobg from "../../../images/herobg2.png";
import Analytics from "../../sections/Analytics/Analytics";

import {
  registration,
  justpostDataWithoutToken,
  fetchDataV2,
} from "../../../apiUtils";
import AgentPlanCards from "./AgentPlanCards";
import Loginwindow from "./Loginwindow";
import LoginPopup from "../LoginPage/Loginpop";
import ReactCountryFlag from "react-country-flag";

const LandingPage = () => {
  const pathname = window.location.pathname;
  const lastSegment = pathname.split("/").pop();

  // Handle hash navigation on page load and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    // Handle initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Cleanup
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  const [isOpenWindow, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [hero1, hero2, hero3]; // Array of background images
  const [cardActiveTab, setcardActiveTab] = useState("individual");
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpFormVisible, setOtpFormVisible] = useState(false);
  const [captchaImage, setCaptchaImage] = useState("");
  const [login, setLogin] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1");


  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    on_behalf: 'Self',
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    email: '',
    mobile_no: '',
    password: '',
    conform_password: '',
    referral_code: '',
    terms_condition: false,
    otp: '',
    captcha: '',
  });

  const [apiErrors, setApiErrors] = useState({});
  const [errors, setErrors] = useState({});
  const [apiData, setApiData] = useState({});
  const [apiData1, setApiData1] = useState({});

  const [otpErrors, setOtpErrors] = useState({
    otp: '',
    captcha: '',
  });

  const [showTooltip, setShowTooltip] = useState(null);

  const handleTooltipClick = (field) => {
    setShowTooltip(showTooltip === field ? null : field);
  };

  const countryCodes = [
    { code: "+1", iso: "US" },
    { code: "+91", iso: "IN" },
    { code: "+44", iso: "GB" },
    { code: "+61", iso: "AU" },
  ];

  const testimonials = [
    {
      quote: "This platform brought us together, and we couldn't be happier!",
      name: "Aisha & Zaid",
    },
    {
      quote: "Thank you for creating such an amazing platform.",
      name: "Fatima & Ahmed",
    },
    {
      quote: "The features made everything easy. Highly recommended!",
      name: "Sarah & Yusuf",
    },
  ];


  const handleInputChange = (e) => {
    const { id, type, value, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value; // Handle checkbox separately

    console.log(id, newValue); // For debugging

    // Real-time filtering for first name and last name
    if (id === 'first_name' || id === 'last_name') {
      // Only allow alphabets and spaces, remove numbers and symbols
      newValue = newValue.replace(/[^A-Za-z\s]/g, '');
    }

    // Update form data
    setFormData((prevState) => ({
      ...prevState,
      [id]: newValue,
    }));

    // Auto-assign gender based on on_behalf selection
    if (id === 'on_behalf') {
      let autoGender = '';
      if (newValue === 'Brother' || newValue === 'Son') {
        autoGender = 'male';
      } else if (newValue === 'Daughter' || newValue === 'Sister') {
        autoGender = 'female';
      }
      
      setFormData((prevState) => ({
        ...prevState,
        [id]: newValue,
        gender: autoGender, // Auto-assign or clear gender field
      }));
    }

    // Clear the error for the current field
    if (errors[id]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[id]; // Remove the error for the current field
        return newErrors;
      });
    }
  };

  const handlePasswordShow = () => {
    setShowPassword(!showPassword);
  };
  const handleCountryCodeChange = (e) => {
    setSelectedCountryCode(e.target.value);
  };

  const handleValidForm = () => {
    const newErrors = {};

    // Regex patterns for validation
    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/; // Assumes 10-digit phone numbers
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format

    // Validate First Name
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First Name is required';
    } else if (!nameRegex.test(formData.first_name)) {
      newErrors.first_name = 'First Name should contain only letters';
    }

    // Validate Last Name
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last Name is required';
    } else if (!nameRegex.test(formData.last_name)) {
      newErrors.last_name = 'Last Name should contain only letters';
    }

    // Validate Gender - Only required for Self or Friend
    if ((formData.on_behalf === 'Self' || formData.on_behalf === 'Friend') && !formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    // Validate Date of Birth
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of Birth is required';
    } else if (!dateRegex.test(formData.date_of_birth)) {
      newErrors.date_of_birth = 'Invalid date format (YYYY-MM-DD)';
    }

    // Validate Email/Phone
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Validate Phone
    if (!formData.mobile_no.trim()) {
      newErrors.mobile_no = 'Phone number is required';
    } else if (!phoneRegex.test(formData.mobile_no)) {
      newErrors.mobile_no = 'Invalid phone number (10 digits required)';
    }

    // // Validate Password
    // if (!formData.password.trim()) {
    //   newErrors.password = 'Password is required';
    // } else if (!passwordRegex.test(formData.password)) {
    //   newErrors.password = 'Password must be at least 8 characters long and contain at least one letter and one number';
    // }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters long and contain at least one uppercase letter, one number, and one special character';
    }

    // Validate Confirm Password
    if (!formData.conform_password.trim()) {
      newErrors.conform_password = 'Confirm Password is required';
    } else if (formData.conform_password !== formData.password) {
      newErrors.conform_password = 'Passwords do not match';
    }

    // Validate Referral Code (optional)
    if (formData.referral_code.trim() && !/^\d+$/.test(formData.referral_code)) {
      newErrors.referral_code = 'Referral Code should contain only numbers';
    }

    // Validate Terms and Conditions
    if (!formData.terms_condition) {
      newErrors.terms_condition = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleValidOtp = () => {
    const newErrors = {};

    // Validate OTP
    if (!formData.otp.trim()) {
      newErrors.otp = 'OTP is required';
    } else if (formData.otp !== '1234') {
      newErrors.otp = 'Invalid OTP';
    }

    // Validate CAPTCHA
    if (!formData.captcha.trim()) {
      newErrors.captcha = 'CAPTCHA is required';
    }

    // Set errors
    setOtpErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const posstData = () => {
    const isValid = handleValidForm();
    if (isValid) {
      setOtpFormVisible(true);
      const parameter = {
        url: "/api/otp/",
        payload: {
          contact_number: formData.mobile_no,
          email: formData.email,
        },
        setApiErrors,
      };

      justpostDataWithoutToken(parameter);

      console.log('Form Data:', formData);
    } else {
      console.log('Form has errors');
    }
  };

  // const verifyOtpAndCaptcha = (e) => {
  //   e.preventDefault(); // Prevent form submission

  //   const isValid = handleValidOtp();
  //   if (isValid) {
  //     const parameter = {
  //       url: lastSegment === "agent" ? "/api/agent/verify-otp-captcha/" : "/api/verify-otp-captcha/",
  //       payload: {
  //         captcha_key: captchaImage.captcha_key,
  //         captcha_text: formData.captcha,
  //         otp: formData.otp,
  //         email: formData.email,
  //         contact_number: formData.mobile_no,
  //         first_name: formData.first_name,
  //         last_name: formData.last_name,
  //         onbehalf: formData.on_behalf,
  //         password: formData.password,
  //         dob: formData.date_of_birth,
  //         gender: formData.gender,
  //         confirm_password: formData.conform_password,
  //         terms_condition: formData.terms_condition,
  //       },
  //       setErrors: setApiErrors,
  //       navigate: navigate,
  //       navUrl: lastSegment === "agent" ? "/newdashboard" : "/newdashboard",
  //     };
  //     registration(parameter);

  //     console.log('OTP and CAPTCHA are valid');
  //   } else {
  //     console.log('Validation failed');
  //   }
  // };

  // const verifyOtpAndCaptcha = () => {
  //   const parameter = {
  //     url:
  //       lastSegment === "agent"
  //         ? "/api/agent/verify-otp-captcha/"
  //         : "/api/verify-otp-captcha/",
  //     payload: {
  //       captcha_key: captchaImage.captcha_key,
  //       captcha_text: captcha,
  //       otp,
  //       email,
  //       contact_number,
  //       first_name,
  //       last_name,
  //       onbehalf,
  //       password,
  //       dob,
  //       gender,
  //       confirm_password,
  //       terms_condition,
  //     },
  //     setErrors: setErrors,
  //     navigate: navigate,
  //     navUrl: lastSegment === "agent" ? "/newdashboard" : "/newdashboard",
  //   };
  //   registration(parameter);
  // };

  const verifyOtpAndCaptcha = (e) => {
    e.preventDefault(); // Prevent form submission

    const isValid = handleValidOtp();
    if (isValid) {
      const parameter = {
        url: lastSegment === "agent" ? "/api/agent/verify-otp-captcha/" : "/api/verify-otp-captcha/",
        payload: {
          captcha_key: captchaImage.captcha_key,
          captcha_text: formData.captcha,
          otp: formData.otp,
          email: formData.email,
          contact_number: formData.mobile_no,
          first_name: formData.first_name,
          last_name: formData.last_name,
          onbehalf: formData.on_behalf,
          password: formData.password,
          dob: formData.date_of_birth,
          gender: formData.gender,
          confirm_password: formData.conform_password,
          terms_condition: formData.terms_condition,
        },
        setErrors: setApiErrors,
        navigate: navigate,
        navUrl: lastSegment === "agent" ? "/newdashboard" : "/newdashboard",
        showSuccessMessage: (message) => {
          // Display success message (e.g., using a toast or alert)
          alert(message); // Replace with your preferred notification system
        },
        showErrorMessage: (message) => {
          // Display error message (e.g., using a toast or alert)
          alert(message); // Replace with your preferred notification system
        },
      };
      registration(parameter);

      console.log("OTP and CAPTCHA are valid");
    } else {
      console.log("Validation failed");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Tooltip functionality
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showTooltip && !event.target.closest('.tooltip-container')) {
        setShowTooltip(null);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showTooltip) {
        setShowTooltip(null);
      }
    };

    if (showTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showTooltip]);
  const [isLogIn, setIsLogIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogIn(false);
  }, []);

  const [refreshCaptchaIMg, setRefreshCaptcha] = useState(false);
  const refreshCaptcha = () => {
    setRefreshCaptcha(!refreshCaptchaIMg);
  };

  useEffect(() => {
    const parameter = {
      url: `/api/get-captcha/`,
      setterFunction: setCaptchaImage,
      setErrors: setErrors,
    };
    const parameter1 = {
      url: "api/user/latest_profile/",
      setterFunction: setApiData,
      setErrors: setErrors,
    };
    fetchDataV2(parameter);
    fetchDataV2(parameter1);
  }, [refreshCaptchaIMg]);
  useEffect(() => {

    const parameter1 = {
      url: `/api/user/latest_profile/`,
      setterFunction: setApiData,
      setErrors: setErrors,
    };

    fetchDataV2(parameter1);
    const parameter2 = {
      url: `/api/analytics/`,
      setterFunction: setApiData1,
      setErrors: setErrors,
    };

    fetchDataV2(parameter2);
  }, []);

  const closeWindow = () => {
    setIsModalOpen(false);
  };

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      <Loginwindow
        isOpenWindow={isOpenWindow}
        closeWindow={closeWindow}
        showText={"You have to login first"}
        navTo={"/login"}
      />
      <Navbar isLogIn={isLogIn} setLogin={setLogin} login={login} />
      {login && <LoginPopup />}


      <div className="relative text-white overflow-hidden ">
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

        <section
          className="py-24 pt-4 lg:h-auto flex flex-wrap items-center justify-center gap-12 overflow-visible relative md:h-auto md:flex-wrap"
          style={{
            margin: "auto",
            paddingTop: "5rem",
            marginTopTop: "5rem",
            width: "100vw",
            backgroundImage: `url(${images[currentSlide]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            transition: "background-image 1s ease-in-out",
          }}
        >
          {/* Overlay to make content readable */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 0,
          }}></div>
          <div
            style={{
              display: "flex",
              gap: "3rem",
              margin: "auto",
              justifyContent: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              className="w-[300px] sm:w-[350px] md:w-[50%] h-[450px] sm:h-[525px] md:h-[562px] flex-shrink-0 rounded-3xl overflow-hidden relative bg-cover bg-center"
              style={{
                backgroundSize: "100%",
                borderRadius: "1%",
                height: "60vh",
                width: "60vh",
              }}
            >

            </div>

            <div className="md:col-span-3 flex flex-col gap-8 justify-between items-start  w-[50%]  ">
              <div
                className={`max-w-[530px] w-[${!isOtpFormVisible ? "85%" : "100%"
                  }] m-auto min-w-[250px] bg-blue-400 p-4 md:p-6 shadow-lg shadow-[#FFCEE9] border border-[##898B92]`}
                style={{
                  background: "white",
                  borderRadius: "10px"
                }}
              >
                <h2
                  style={{
                    color: " #FF28A0",
                    fontSize: "1.8rem",
                    fontWeight: "500",
                    textAlign: "center",
                    marginBottom: "0",
                    paddingBottom: "0vh",
                    lineHeight: "4vh",
                  }}
                >
                  {!isOtpFormVisible ? "Create Your Account" : "Verify Your Account"}
                </h2>
                <h3 className="text-[#6D6E6F]  text-black mb-4 text-center mt-2 pt-0" style={{ fontSize: "0.8rem" }}>
                  {lastSegment === "agent" ? `Agent Registration` : `Fill out the form to get started.`}
                </h3>

                {!isOtpFormVisible ? (
                  <form className="flex flex-wrap gap-2" style={{ width: '100%' }}>
                    {/* On Behalf Field */}
                    <div className="w-full flex gap-2 pb-2">
                      {lastSegment !== 'agent' && (
                        <div className="w-[100%]">
                          <div className="flex items-center gap-2 mb-2">
                            <label htmlFor="on_behalf" className="text-sm font-medium text-[#6D6E6F] cursor-pointer">
                              Profile Creating For {<span style={{ color: 'red' }}>*</span>}
                          </label>
                            <div 
                              className="group relative tooltip-container"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleTooltipClick('on_behalf');
                              }}
                              onTouchStart={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                handleTooltipClick('on_behalf');
                              }}
                            >
                              <svg 
                                className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors duration-200" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-all duration-300 z-[9999] shadow-lg pointer-events-none ${showTooltip === 'on_behalf' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'}`} style={{ width: '200px', wordWrap: 'break-word' }}>
                                Select who this profile is for. Brother/Son will auto-set gender as Male, Daughter/Sister as Female. For Self/Friend, you'll need to select gender manually.
                                <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </div>
                          <select
                            id="on_behalf"
                            className="h-10 px-4 text-[#898B92] font-semibold mt-2 w-full rounded-lg border-1 border-[#898B92] focus:outline-none focus:ring-2 focus:ring-[#898B92] placeholder:font-[1vh]"
                            onChange={handleInputChange}
                            value={formData.on_behalf}
                          >
                            <option value="Self">Self</option>
                            <option value="Brother">Brother</option>
                            <option value="Sister">Sister</option>
                            <option value="Daughter">Daughter</option>
                            <option value="Son">Son</option>
                            <option value="Friend">Friend</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* First Name Field */}
                    <div className="w-[49%] pb-1">
                      <div className="flex items-center gap-2 mb-2">
                        <label htmlFor="first_name" className="text-sm font-medium text-[#6D6E6F] cursor-pointer">
                        First Name {<span style={{ color: 'red' }}>*</span>}
                      </label>
                        <div 
                          className="group relative tooltip-container"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleTooltipClick('first_name');
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleTooltipClick('first_name');
                          }}
                        >
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors duration-200" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-all duration-300 z-[9999] shadow-lg pointer-events-none ${showTooltip === 'first_name' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'}`} style={{ width: '180px', wordWrap: 'break-word' }}>
                            Enter your first name. Only letters and spaces allowed. Numbers and symbols will be automatically removed.
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                      <input
                        id="first_name"
                        type="text"
                        className={
                          `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${errors.first_name ?
                            "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                          } focus:outline-none focus:ring-2`
                        }
                        placeholder="First Name"
                        onChange={handleInputChange}
                        value={formData?.first_name || ''}
                      />
                      {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                    </div>

                    {/* Last Name Field */}
                    <div className="w-[49%] pb-1">
                      <div className="flex items-center gap-2 mb-2">
                        <label htmlFor="last_name" className="text-sm font-medium text-[#6D6E6F] cursor-pointer">
                        Last Name {<span style={{ color: 'red' }}>*</span>}
                      </label>
                        <div 
                          className="group relative tooltip-container"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleTooltipClick('last_name');
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleTooltipClick('last_name');
                          }}
                        >
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors duration-200" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-all duration-300 z-[9999] shadow-lg pointer-events-none ${showTooltip === 'last_name' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'}`} style={{ width: '180px', wordWrap: 'break-word' }}>
                            Enter your last name (surname). Only letters and spaces allowed. Numbers and symbols will be automatically removed.
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                      <input
                        id="last_name"
                        type="text"
                        className={
                          `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${errors.last_name ?
                            "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                          } focus:outline-none focus:ring-2`
                        }
                        placeholder="Last Name"
                        onChange={handleInputChange}
                        value={formData.last_name}
                      />
                      {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                    </div>

                    {/* Gender Field - Only show for Self or Friend */}
                    {(formData.on_behalf === 'Self' || formData.on_behalf === 'Friend') && (
                      <div className="w-[49%] pb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <label htmlFor="gender" className="text-sm font-medium text-[#6D6E6F] cursor-pointer">
                        Gender {<span style={{ color: 'red' }}>*</span>}
                      </label>
                          <div 
                            className="group relative tooltip-container"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleTooltipClick('gender');
                            }}
                            onTouchStart={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleTooltipClick('gender');
                            }}
                          >
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors duration-200" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-all duration-300 z-[9999] shadow-lg pointer-events-none ${showTooltip === 'gender' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'}`} style={{ width: '200px', wordWrap: 'break-word' }}>
                              Select the gender. This field only appears when creating profile for Self or Friend.
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                      <select
                        id="gender"
                        className={
                          `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${errors.gender ?
                            "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                          } focus:outline-none focus:ring-2`
                        }
                        onChange={handleInputChange}
                        value={formData.gender}
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                    </div>
                    )}

                    {/* Date of Birth Field */}
                    <div className={`${(formData.on_behalf === 'Self' || formData.on_behalf === 'Friend') ? 'w-[49%]' : 'w-[100%]'} pb-1`}>
                      <div className="flex items-center gap-2 mb-2">
                        <label htmlFor="date_of_birth" className="text-sm font-medium text-[#6D6E6F] cursor-pointer">
                        Date of Birth {<span style={{ color: 'red' }}>*</span>}
                      </label>
                        <div 
                          className="group relative tooltip-container"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleTooltipClick('date_of_birth');
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleTooltipClick('date_of_birth');
                          }}
                        >
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors duration-200" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-all duration-300 z-[9999] shadow-lg pointer-events-none ${showTooltip === 'date_of_birth' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'}`} style={{ width: '200px', wordWrap: 'break-word' }}>
                            Select your date of birth. Age limit: Male (18+), Female (21+). Format: DD-MM-YYYY
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                      <input
                        id="date_of_birth"
                        type="date"
                        className={
                          `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${errors.date_of_birth ?
                            "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                          } focus:outline-none focus:ring-2`
                        }
                        onChange={handleInputChange}
                        value={formData.date_of_birth}
                        max={formData.gender == 'male' ? '2005-12-28' : '2007-12-28'}

                      />
                      {errors.date_of_birth && <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>}
                    </div>

                    {/* Email/Phone Field */}
                    <div className="w-[100%] pb-1">
                      {/* Email Input */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <label htmlFor="email" className="text-sm font-medium text-[#6D6E6F] cursor-pointer">
                          Email {<span style={{ color: 'red' }}>*</span>}
                        </label>
                          <div 
                            className="group relative tooltip-container"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleTooltipClick('email');
                            }}
                            onTouchStart={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleTooltipClick('email');
                            }}
                          >
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors duration-200" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-all duration-300 z-[9999] shadow-lg pointer-events-none ${showTooltip === 'email' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'}`} style={{ width: '200px', wordWrap: 'break-word' }}>
                              Enter a valid email address. This will be used for account verification and communication.
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                        <input
                          id="email"
                          type="email"
                          className={
                            `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${errors.email ?
                              "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                            } focus:outline-none focus:ring-2`
                          }
                          placeholder="Enter your email"
                          onChange={handleInputChange}
                          value={formData.email}
                          required // Make the field required
                          style={{ border: errors.email ? '1px solid red' : '' }}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>

                      {/* Phone Input */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <label htmlFor="mobile_no" className="text-sm font-medium text-[#6D6E6F] cursor-pointer">
                          Phone {<span style={{ color: 'red' }}>*</span>}
                        </label>
                          <div 
                            className="group relative tooltip-container"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleTooltipClick('mobile_no');
                            }}
                            onTouchStart={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleTooltipClick('mobile_no');
                            }}
                          >
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors duration-200" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-all duration-300 z-[9999] shadow-lg pointer-events-none ${showTooltip === 'mobile_no' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'}`} style={{ width: '180px', wordWrap: 'break-word' }}>
                              Enter your 10-digit phone number. This will be used for OTP verification.
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center mt-2">
                          <div className="flex items-center h-10 px-2 text-[#6D6E6F] font-semibold border-1 border-[#898B92] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#898B92]">
                            <ReactCountryFlag
                              countryCode={countryCodes.find((country) => country.code === selectedCountryCode)?.iso}
                              svg
                              style={{ width: '40px', height: '15px', marginRight: '8px', paddingRight: '2px' }}
                            />
                            <select
                              value={selectedCountryCode}
                              onChange={handleCountryCodeChange}
                              className="bg-transparent focus:outline-none"
                            >
                              {countryCodes.map((country) => (
                                <option key={country.code} value={country.code}>
                                  {country.name} ({country.code})
                                </option>
                              ))}
                            </select>
                          </div>
                          <input
                            id="mobile_no"
                            type="text"
                            inputMode="numeric"
                            className={
                              `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mx-2 w-full rounded-lg border-1 border-[#898B92] ${errors.mobile_no ?
                                "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                              } focus:outline-none focus:ring-2`
                            }
                            placeholder="Enter your phone number"
                            onChange={handleInputChange}
                            value={formData.mobile_no}
                            required // Make the field required
                            style={{ border: errors.mobile_no ? '1px solid red' : '' }}
                          />
                        </div>
                        {errors.mobile_no && <p className="text-red-500 text-sm mt-1">{errors.mobile_no}</p>}
                      </div>
                    </div>
                    {/* Password Field */}
                    <div className="w-[49%] pb-1">
                      <div className="flex items-center gap-2 mb-2">
                        <label htmlFor="password" className="text-sm font-medium text-[#6D6E6F] cursor-pointer">
                        Password {<span style={{ color: "red" }}>*</span>}
                      </label>
                        <div 
                          className="group relative tooltip-container"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleTooltipClick('password');
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleTooltipClick('password');
                          }}
                        >
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors duration-200" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-all duration-300 z-[9999] shadow-lg pointer-events-none ${showTooltip === 'password' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'}`} style={{ width: '220px', wordWrap: 'break-word' }}>
                            Password must be at least 6 characters with 1 uppercase letter, 1 number, and 1 special character.
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          id="password"
                          type={!showPassword ? "password" : 'text'}
                          className={
                            `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${errors.password ?
                              "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                            } focus:outline-none focus:ring-2`
                          }
                          placeholder="************"
                          onChange={handleInputChange}
                          value={formData.password}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center mt-2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#6D6E6F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#6D6E6F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="w-[49%] pb-1">
                      <div className="flex items-center gap-2 mb-2">
                        <label htmlFor="conform_password" className="text-sm font-medium text-[#6D6E6F] cursor-pointer">
                        Confirm Password {<span style={{ color: 'red' }}>*</span>}
                      </label>
                        <div 
                          className="group relative tooltip-container"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleTooltipClick('conform_password');
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleTooltipClick('conform_password');
                          }}
                        >
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors duration-200" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-all duration-300 z-[9999] shadow-lg pointer-events-none ${showTooltip === 'conform_password' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'}`} style={{ width: '200px', wordWrap: 'break-word' }}>
                            Re-enter your password to confirm. Must match the password above exactly.
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <input
                          id="conform_password"
                          type={!showPassword ? "password" : 'text'}
                          className={
                            `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 ${errors.conform_password ?
                              "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                            } focus:outline-none focus:ring-2`
                          }
                          placeholder="************"
                          onChange={handleInputChange}
                          value={formData.conform_password}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center mt-2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#6D6E6F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#6D6E6F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          )}
                        </button>
                      </div>
                      {errors.conform_password && <p className="text-red-500 text-sm mt-1">{errors.conform_password}</p>}
                    </div>

                    {/* Referral Code Field */}
                    {/* <div className="w-[49%] pb-1">
                      <label htmlFor="referral_code" className="block text-sm font-medium text-[#6D6E6F]">
                        Referral Code { <span style={{ color: 'red' }}></span>}
                      </label>
                      <input
                        id="referral_code"
                        type="number"
                        className="h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] focus:outline-none focus:ring-2 focus:ring-[#898B92] placeholder:font-[1vh]"
                        placeholder="Referral Code"
                        onChange={handleInputChange}
                        value={formData.referral_code}
                      />
                      {errors.referral_code && <p className="text-red-500 text-sm mt-1">{errors.referral_code}</p>}
                    </div> */}

                    {/* Terms and Conditions Field */}
                    <div className="w-full sm:col-span-2 lg:col-span-4 flex items-center mt-4">
                      <input
                        id="terms_condition"
                        type="checkbox"
                        className="w-5 h-5 text-[#6D6E6F] focus:ring-[#898B92] rounded border-[#898B92]"
                        onChange={(e) => {
                          // Only set to true if not already true

                          // Check this condition
                          handleInputChange(e);

                        }}
                        checked={formData.terms_condition}

                      />
                      <label htmlFor="terms_condition" className="ml-3 text-sm font-medium text-[#6D6E6F] pt-1">
                        By signing up you agree to our <span className="text-[#FF28A0]">terms and conditions.</span>
                        {/* {formData.terms_condition && (
                          <span className="text-xs text-gray-500 block mt-1">(Accepted)</span>
                        )} */}
                      </label>
                      {errors.terms_condition && <p className="text-red-500 text-sm mt-1">{errors.terms_condition}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="w-[100%] sm:col-span-2 lg:col-span-1 flex justify-start item-center">
                      <button
                        onClick={posstData}
                        type="button"
                        className="py-2 mt-4 px-8 w-[100%] rounded-md shadow border border-[none] text-[white] font-medium transition duration-300 hover:bg-[#FF28A0] hover:text-[white] hover:shadow-lg hover:from-[#D7599E] hover:to-[#F27EB5]"
                        style={{ backgroundImage: 'linear-gradient(45deg,rgb(210, 53, 53),rgb(225, 43, 104))' }}
                      >
                        Create Account
                      </button>
                    </div>

                    {/* Or Join With Section */}
                    <div className="flex items-center">
                      <div className="flex-grow border-t border-gray-200 w-[10vw]"></div>
                      <span className="text-[#6D6E6F] text-[1.6vh] font-semibold">Or Join With</span>
                      <div className="flex-grow border-t border-gray-200 w-[10vw]"></div>
                    </div>

                    {/* Google Sign In Button */}
                    <div className="w-[100%] sm:col-span-2 lg:col-span-1 flex justify-start item-center">
                      <button
                        type="button"
                        className="py-2 mt-4 px-8 w-[100%] rounded-md shadow border border-gray-300 text-[#6D6E6F] font-medium transition duration-300 hover:bg-gray-50 hover:shadow-lg bg-white flex items-center justify-center gap-3"
                        onClick={() => {
                          // Google sign-in logic will be implemented here
                          console.log('Google Sign In clicked');
                        }}
                      >
                        {/* Google Logo SVG */}
                        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Sign in with Google
                      </button>
                    </div>

                  </form>
                ) : (
                  <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4" style={{ width: "100%" }}>
                    {/* OTP Input */}
                    <div className="sm:col-span-4">
                      <label htmlFor="otp" className="block text-sm font-medium text-[#6D6E6F]">
                        Enter OTP
                      </label>
                      <input
                        id="otp"
                        type="text"
                        className="h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border border-[#898B92] bg-[#FFF5FB] focus:outline-none focus:ring-2 focus:ring-[#898B92]"
                        placeholder="123456"
                        value={formData.otp}
                        onChange={(e) => {
                          setFormData({ ...formData, otp: e.target.value });
                          setOtpErrors((prevErrors) => ({ ...prevErrors, otp: '' })); // Clear OTP error on change
                        }}
                      />
                      {otpErrors.otp && <p className="text-red-500 text-sm mt-1">{otpErrors.otp}</p>}
                    </div>

                    {/* CAPTCHA Section */}
                    <div className="sm:col-span-2">
                      <label htmlFor="captcha" className="block text-sm font-medium text-[#6D6E6F]">
                        CAPTCHA
                      </label>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          id="captcha"
                          type="text"
                          className="h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border border-[#898B92] bg-[#FFF5FB] focus:outline-none focus:ring-2 focus:ring-[#898B92]"
                          placeholder="Enter CAPTCHA"
                          value={formData.captcha}
                          onChange={(e) => {
                            setFormData({ ...formData, captcha: e.target.value });
                            setOtpErrors((prevErrors) => ({ ...prevErrors, captcha: '' })); // Clear CAPTCHA error on change
                          }}
                        />
                      </div>
                      {otpErrors.captcha && <p className="text-red-500 text-sm mt-1">{otpErrors.captcha}</p>}
                    </div>

                    {/* Refresh Button */}
                    <button
                      style={{ marginTop: '27px' }}
                      type="button"
                      className="h-10 px-3 text-sm font-medium text-[#6D6E6F] bg-[#FFF5FB] border border-[#898B92] rounded-lg hover:bg-[#FFE5F5] transition duration-300"
                      onClick={refreshCaptcha}
                    >
                      Refresh
                    </button>

                    {/* CAPTCHA Image */}
                    <div
                      style={{ marginTop: '27px' }}
                      className="flex items-center justify-center w-[100px] h-10 border border-[#898B92] rounded-lg bg-[#FFF5FB]"
                    >
                      <img
                        className="w-[80px] h-[30px]"
                        src={`${process.env.REACT_APP_API_URL}${captchaImage.captcha_image}`}
                        alt="CAPTCHA"
                      />
                    </div>

                    {/* Submit Button (Full Width) */}
                    <div className="sm:col-span-4 flex justify-start">
                      <button
                        onClick={verifyOtpAndCaptcha}
                        type="button"
                        className="w-full py-2 mt-4 px-8 bg-gradient-to-r from-[#EE68B3] to-[#FF8DCD] rounded-md shadow border border-[#ffb5de] text-white font-medium transition duration-300 hover:shadow-lg hover:from-[#D7599E] hover:to-[#F27EB5]"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        <Analytics apiData={apiData1} />




        {/* Package and Pricing Section */}
        <section id="packages" className="container mx-auto pt-44 pb-24 px-6 bg-[#ffffff] relative">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold font-['Poppins'] bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text pb-2 leading-tight">
              Packages & Pricing
            </h2>
            <p className="text-lg sm:text-xl text-[#6D6E6F] mt-4">
              Choose a plan that fits your needs and start your journey toward a
              blessed union.
            </p>
          </div>

          <div className="flex space-x-4 mt-8 justify-center">
            <button
              className={`py-2 px-6 text-sm font-semibold rounded-full shadow-md transition-all ${cardActiveTab === "individual"
                ? "bg-gradient-to-r from-[#EE68B3] to-[#FF8DCD] text-white"
                : "bg-gray-200 text-gray-600"
                }`}
              onClick={() => setcardActiveTab("individual")}
            >
              Individual
            </button>
            {/* <button
              className={`py-2 px-6 text-sm font-semibold rounded-full shadow-md transition-all ${cardActiveTab === "agent"
                ? "bg-gradient-to-r from-[#EE68B3] to-[#FF8DCD] text-white"
                : "bg-gray-200 text-gray-600"
                }`}
              onClick={() => setcardActiveTab("agent")}
            >
              Agent
            </button> */}
          </div>

          {/* Tab Switch */}
          <div className="flex flex-col items-center pt-16">
            {cardActiveTab === "agent" ? <AgentPlanCards /> : <PlanCard />}
          </div>
        </section>

        {/* How it works Section */}
        <section id="how-it-works" className="container m-auto py-44 px-6 bg-[#ffffff]">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold font-['Poppins'] bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-[#6D6E6F] mt-4">
              Follow these simple steps to understand the process and get
              started today!
            </p>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Side - Video */}
            {/* <div className="w-full lg:w-1/2">
              <div className="aspect-[16/9]">
                <video
                  controls
                  autoPlay
                  muted
                  loop
                  poster="thumbnail.jpg"
                  src={video}
                ></video>
              </div>
            </div> */}

            {/* Right Side - Steps */}
            <div className="w-full lg:w-1/2 grid grid-cols-2 gap-6">
              {/* Step 1 */}
              <div className="flex flex-col items-start justify-start gap-4">
                <div className="flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.4899 2.23006L5.49991 4.11006C4.34991 4.54006 3.40991 5.90006 3.40991 7.12006V14.5501C3.40991 15.7301 4.18991 17.2801 5.13991 17.9901L9.43991 21.2001C10.8499 22.2601 13.1699 22.2601 14.5799 21.2001L18.8799 17.9901C19.8299 17.2801 20.6099 15.7301 20.6099 14.5501V7.12006C20.6099 5.89006 19.6699 4.53006 18.5199 4.10006L13.5299 2.23006C12.6799 1.92006 11.3199 1.92006 10.4899 2.23006Z"
                      stroke="#D64294"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.05005 11.8701L10.66 13.4801L14.96 9.18005"
                      stroke="#D64294"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-[#CB3B8B]">
                    Register and Verify
                  </h4>
                  <p className="text-sm text-gray-600">
                    Sign up by filling in the registration form and verify your
                    account with OTP.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-start justify-start gap-4">
                <div className="flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.86 8.08997C19.86 8.50997 19.83 8.91997 19.78 9.30997C19.32 9.10997 18.82 8.99997 18.29 8.99997C17.07 8.99997 15.99 9.58996 15.32 10.49C14.64 9.58996 13.56 8.99997 12.34 8.99997C10.29 8.99997 8.63 10.67 8.63 12.74C8.63 15.42 10.05 17.47 11.63 18.86C11.58 18.89 11.53 18.9 11.48 18.92C11.18 19.03 10.68 19.03 10.38 18.92C7.79 18.03 2 14.35 2 8.08997C2 5.32997 4.21999 3.09998 6.95999 3.09998C8.58999 3.09998 10.03 3.87997 10.93 5.08997C11.84 3.87997 13.28 3.09998 14.9 3.09998C17.64 3.09998 19.86 5.32997 19.86 8.08997Z"
                      stroke="#D64294"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M21.9999 12.74C21.9999 17.42 17.6699 20.18 15.7299 20.84C15.4999 20.92 15.1299 20.92 14.8999 20.84C14.0699 20.56 12.7999 19.89 11.6299 18.86C10.0499 17.47 8.62988 15.42 8.62988 12.74C8.62988 10.67 10.2899 9 12.3399 9C13.5599 9 14.6399 9.58999 15.3199 10.49C15.9899 9.58999 17.0699 9 18.2899 9C18.8199 9 19.3199 9.11 19.7799 9.31C21.0899 9.89 21.9999 11.2 21.9999 12.74Z"
                      stroke="#D64294"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#CB3B8B]">
                    Complete Your Profile
                  </h4>
                  <p className="text-sm text-gray-600">
                    Add essential details like preferences, biodata, and
                    photographs to enhance visibility.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-start justify-start gap-4">
                <div className="flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.0001 7.16C17.9401 7.15 17.8701 7.15 17.8101 7.16C16.4301 7.11 15.3301 5.98 15.3301 4.58C15.3301 3.15 16.4801 2 17.9101 2C19.3401 2 20.4901 3.16 20.4901 4.58C20.4801 5.98 19.3801 7.11 18.0001 7.16Z"
                      stroke="#D64294"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M16.9702 14.44C18.3402 14.67 19.8502 14.43 20.9102 13.72C22.3202 12.78 22.3202 11.24 20.9102 10.3C19.8402 9.59004 18.3102 9.35003 16.9402 9.59003"
                      stroke="#D64294"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M5.96998 7.16C6.02998 7.15 6.09998 7.15 6.15998 7.16C7.53998 7.11 8.63998 5.98 8.63998 4.58C8.63998 3.15 7.48998 2 6.05998 2C4.62998 2 3.47998 3.16 3.47998 4.58C3.48998 5.98 4.58998 7.11 5.96998 7.16Z"
                      stroke="#D64294"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6.99994 14.44C5.62994 14.67 4.11994 14.43 3.05994 13.72C1.64994 12.78 1.64994 11.24 3.05994 10.3C4.12994 9.59004 5.65994 9.35003 7.02994 9.59003"
                      stroke="#D64294"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12.0001 14.63C11.9401 14.62 11.8701 14.62 11.8101 14.63C10.4301 14.58 9.33008 13.45 9.33008 12.05C9.33008 10.62 10.4801 9.46997 11.9101 9.46997C13.3401 9.46997 14.4901 10.63 14.4901 12.05C14.4801 13.45 13.3801 14.59 12.0001 14.63Z"
                      stroke="#D64294"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.08997 17.78C7.67997 18.72 7.67997 20.26 9.08997 21.2C10.69 22.27 13.31 22.27 14.91 21.2C16.32 20.26 16.32 18.72 14.91 17.78C13.32 16.72 10.69 16.72 9.08997 17.78Z"
                      stroke="#D64294"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#CB3B8B]">
                    Browse Profiles
                  </h4>
                  <p className="text-sm text-gray-600">
                    Explore potential matches based on your preferences. Use
                    filters to refine your search.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-start justify-start gap-4">
                <div className="flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.5 19H8C4 19 2 18 2 13V8C2 4 4 2 8 2H16C20 2 22 4 22 8V13C22 17 20 19 16 19H15.5C15.19 19 14.89 19.15 14.7 19.4L13.2 21.4C12.54 22.28 11.46 22.28 10.8 21.4L9.3 19.4C9.14 19.18 8.77 19 8.5 19Z"
                      stroke="#D64294"
                      stroke-width="1.5"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7 8H17"
                      stroke="#D64294"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7 13H13"
                      stroke="#D64294"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#CB3B8B]">
                    Connect and Communicate
                  </h4>
                  <p className="text-sm text-gray-600">
                    Send messages or initiate contact with users you are
                    interested in. Agents can assist if needed.
                  </p>
                </div>
              </div>

              {/* Step 5 - Full Width */}
              <div className="col-span-2 flex flex-col items-start justify-start gap-4">
                <div className="flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.86 8.08997C19.86 8.50997 19.83 8.91997 19.78 9.30997C19.32 9.10997 18.82 8.99997 18.29 8.99997C17.07 8.99997 15.99 9.58996 15.32 10.49C14.64 9.58996 13.56 8.99997 12.34 8.99997C10.29 8.99997 8.63 10.67 8.63 12.74C8.63 15.42 10.05 17.47 11.63 18.86C11.58 18.89 11.53 18.9 11.48 18.92C11.18 19.03 10.68 19.03 10.38 18.92C7.79 18.03 2 14.35 2 8.08997C2 5.32997 4.21999 3.09998 6.95999 3.09998C8.58999 3.09998 10.03 3.87997 10.93 5.08997C11.84 3.87997 13.28 3.09998 14.9 3.09998C17.64 3.09998 19.86 5.32997 19.86 8.08997Z"
                      stroke="#D64294"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M21.9999 12.74C21.9999 17.42 17.6699 20.18 15.7299 20.84C15.4999 20.92 15.1299 20.92 14.8999 20.84C14.0699 20.56 12.7999 19.89 11.6299 18.86C10.0499 17.47 8.62988 15.42 8.62988 12.74C8.62988 10.67 10.2899 9 12.3399 9C13.5599 9 14.6399 9.58999 15.3199 10.49C15.9899 9.58999 17.0699 9 18.2899 9C18.8199 9 19.3199 9.11 19.7799 9.31C21.0899 9.89 21.9999 11.2 21.9999 12.74Z"
                      stroke="#D64294"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#CB3B8B]">
                    Nikah
                  </h4>
                  <p className="text-sm text-gray-600">
                    Use the platform’s tools and services to finalize your match
                    and begin your journey.
                  </p>

                </div>

              </div>

            </div>
            <div className="w-full lg:w-1/2">
              <div className="aspect-[16/9]">
                <img
                  controls
                  autoPlay
                  muted
                  loop
                  poster="thumbnail.jpg"
                  src={hero3}
                ></img>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics */}
        {/* <section className="container mx-auto py-44 px-6 bg-transparent relative">
          <h2 className="text-4xl text-center sm:text-5xl font-bold font-['Poppins'] bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text">
            Analytics
          </h2>
        </section> */}


        {/* Updated Bento Grid Section */}
        <section id="premium-members" className="py-4 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-center text-5xl font-bold my-20 leading-tight bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text">
              Why Choose Us?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Row 1 - Block 1 (50%) */}
              <div className="relative bg-[#FFF5FB] rounded-2xl p-6 flex flex-col justify-end h-[250px] border border-[#898B92] hover:shadow-xl shadow-md transition-all duration-300 transform hover:scale-105">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text">
                  Faith-Centered
                </h3>
                <p className="mt-2 text-[#EC80BC]">
                  We understand the importance of aligning with Islamic values
                  in your search for a life partner.
                </p>
              </div>

              {/* Row 1 - Block 2 (50%) */}
              <div className="relative bg-[#FFF5FB] rounded-2xl p-6 flex flex-col justify-end h-[250px] border border-[#898B92] hover:shadow-xl shadow-md transition-all duration-300 transform hover:scale-105">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text">
                  Confidential & Secure
                </h3>
                <p className="mt-2 text-[#EC80BC]">
                  Your privacy is our priority. We offer secure communication
                  and profile protection, ensuring a safe and trusted platform
                  for your journey.
                </p>
              </div>

              {/* Row 2 - Block 1 (50%) */}
              <div className="relative bg-[#FFF5FB] rounded-2xl p-6 flex flex-col justify-end h-[250px] border border-[#898B92] hover:shadow-xl shadow-md transition-all duration-300 transform hover:scale-105">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text">
                  Personalized Matches
                </h3>
                <p className="mt-2 text-[#EC80BC]">
                  We use detailed preferences to recommend the best matches
                  tailored to your needs, ensuring compatibility and a
                  meaningful connection.
                </p>
              </div>

              {/* Row 2 - Block 2 (50%) */}
              <div className="relative bg-[#FFF5FB] rounded-2xl p-6 flex flex-col justify-end h-[250px] border border-[#898B92] hover:shadow-xl shadow-md transition-all duration-300 transform hover:scale-105">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text">
                  Community Support
                </h3>
                <p className="mt-2 text-[#EC80BC]">
                  Join a community that supports you in your journey toward a
                  blessed Nikah.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section id="reviews" className="relative bg-white py-40 px-6">
          <div className="container mx-auto">
            {/* Section Title */}
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-bold font-['Poppins'] text-[#6D6E6F]">
                What Our Users Say
              </h2>
              <p className="mt-4 text-lg sm:text-xl font-medium text-[#EC80BC]">
                Hear from happy couples who found their destinies with us.
              </p>
            </div>

            {/* Testimonial Slider */}
            <div className=" w-full relative overflow-visible py-20">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {/* Testimonial Card 1 */}
                <div className="flex-shrink-0 w-full md:w-1/3 px-4">
                  <div className="relative bg-white p-6 rounded-lg overflow-visible shadow-md">
                    {/* Profile Picture */}
                    <div className="absolute left-6 -top-12 w-24 h-24 rounded-full overflow-hidden border-4 border-[#6D6E6F]">
                      <img
                        src="path_to_profile_image.jpg" // Replace with dynamic image path
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Comment Section */}
                    <p className="text-sm sm:text-base text-gray-600 mt-12 mb-4">
                      "This platform brought us together, and we couldn't be
                      happier! The process was seamless and so meaningful."
                    </p>

                    {/* Horizontal Line */}
                    <hr className="my-4 border-[#6D6E6F]" />

                    {/* Name & Profession and Rating */}
                    <div className="flex justify-between items-center">
                      {/* Name and Profession */}
                      <div>
                        <h4 className="text-lg font-semibold text-[#6D6E6F]">
                          Aisha & Zaid
                        </h4>
                        <p className="text-sm text-gray-500">
                          Software Engineer & Doctor
                        </p>
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-gray-300"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-gray-300"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial Card 1 */}
                <div className="flex-shrink-0 w-full md:w-1/3 px-4">
                  <div className="relative bg-white p-6 rounded-lg overflow-visible shadow-md">
                    {/* Profile Picture */}
                    <div className="absolute left-6 -top-12 w-24 h-24 rounded-full overflow-hidden border-4 border-[#6D6E6F]">
                      <img
                        src="path_to_profile_image.jpg" // Replace with dynamic image path
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Comment Section */}
                    <p className="text-sm sm:text-base text-gray-600 mt-12 mb-4">
                      "This platform brought us together, and we couldn't be
                      happier! The process was seamless and so meaningful."
                    </p>

                    {/* Horizontal Line */}
                    <hr className="my-4 border-[#6D6E6F]" />

                    {/* Name & Profession and Rating */}
                    <div className="flex justify-between items-center">
                      {/* Name and Profession */}
                      <div>
                        <h4 className="text-lg font-semibold text-[#6D6E6F]">
                          Aisha & Zaid
                        </h4>
                        <p className="text-sm text-gray-500">
                          Software Engineer & Doctor
                        </p>
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-gray-300"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-gray-300"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial Card 1 */}
                <div className="flex-shrink-0 w-full md:w-1/3 px-4">
                  <div className="relative bg-white p-6 rounded-lg overflow-visible shadow-md">
                    {/* Profile Picture */}
                    <div className="absolute left-6 -top-12 w-24 h-24 rounded-full overflow-hidden border-4 border-[#6D6E6F]">
                      <img
                        src="path_to_profile_image.jpg" // Replace with dynamic image path
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Comment Section */}
                    <p className="text-sm sm:text-base text-gray-600 mt-12 mb-4">
                      "This platform brought us together, and we couldn't be
                      happier! The process was seamless and so meaningful."
                    </p>

                    {/* Horizontal Line */}
                    <hr className="my-4 border-[#6D6E6F]" />

                    {/* Name & Profession and Rating */}
                    <div className="flex justify-between items-center">
                      {/* Name and Profession */}
                      <div>
                        <h4 className="text-lg font-semibold text-[#6D6E6F]">
                          Aisha & Zaid
                        </h4>
                        <p className="text-sm text-gray-500">
                          Software Engineer & Doctor
                        </p>
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-gray-300"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-gray-300"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial Card 1 */}
                <div className="flex-shrink-0 w-full md:w-1/3 px-4">
                  <div className="relative bg-white p-6 rounded-lg overflow-visible shadow-md">
                    {/* Profile Picture */}
                    <div className="absolute left-6 -top-12 w-24 h-24 rounded-full overflow-hidden border-4 border-[#6D6E6F]">
                      <img
                        src="path_to_profile_image.jpg" // Replace with dynamic image path
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Comment Section */}
                    <p className="text-sm sm:text-base text-gray-600 mt-12 mb-4">
                      "This platform brought us together, and we couldn't be
                      happier! The process was seamless and so meaningful."
                    </p>

                    {/* Horizontal Line */}
                    <hr className="my-4 border-[#6D6E6F]" />

                    {/* Name & Profession and Rating */}
                    <div className="flex justify-between items-center">
                      {/* Name and Profession */}
                      <div>
                        <h4 className="text-lg font-semibold text-[#6D6E6F]">
                          Aisha & Zaid
                        </h4>
                        <p className="text-sm text-gray-500">
                          Software Engineer & Doctor
                        </p>
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-gray-300"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-gray-300"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial Card 1 */}
                <div className="flex-shrink-0 w-full md:w-1/3 px-4">
                  <div className="relative bg-white p-6 rounded-lg overflow-visible shadow-md">
                    {/* Profile Picture */}
                    <div className="absolute left-6 -top-12 w-24 h-24 rounded-full overflow-hidden border-4 border-[#6D6E6F]">
                      <img
                        src="path_to_profile_image.jpg" // Replace with dynamic image path
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Comment Section */}
                    <p className="text-sm sm:text-base text-gray-600 mt-12 mb-4">
                      "This platform brought us together, and we couldn't be
                      happier! The process was seamless and so meaningful."
                    </p>

                    {/* Horizontal Line */}
                    <hr className="my-4 border-[#6D6E6F]" />

                    {/* Name & Profession and Rating */}
                    <div className="flex justify-between items-center">
                      {/* Name and Profession */}
                      <div>
                        <h4 className="text-lg font-semibold text-[#6D6E6F]">
                          Aisha & Zaid
                        </h4>
                        <p className="text-sm text-gray-500">
                          Software Engineer & Doctor
                        </p>
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-gray-300"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-gray-300"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial Card 1 */}
                <div className="flex-shrink-0 w-full md:w-1/3 px-4">
                  <div className="relative bg-white p-6 rounded-lg overflow-visible shadow-md">
                    {/* Profile Picture */}
                    <div className="absolute left-6 -top-12 w-24 h-24 rounded-full overflow-hidden border-4 border-[#6D6E6F]">
                      <img
                        src="path_to_profile_image.jpg" // Replace with dynamic image path
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Comment Section */}
                    <p className="text-sm sm:text-base text-gray-600 mt-12 mb-4">
                      "This platform brought us together, and we couldn't be
                      happier! The process was seamless and so meaningful."
                    </p>

                    {/* Horizontal Line */}
                    <hr className="my-4 border-[#6D6E6F]" />

                    {/* Name & Profession and Rating */}
                    <div className="flex justify-between items-center">
                      {/* Name and Profession */}
                      <div>
                        <h4 className="text-lg font-semibold text-[#6D6E6F]">
                          Aisha & Zaid
                        </h4>
                        <p className="text-sm text-gray-500">
                          Software Engineer & Doctor
                        </p>
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-gray-300"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-gray-300"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial Card 1 */}
                <div className="flex-shrink-0 w-full md:w-1/3 px-4">
                  <div className="relative bg-white p-6 rounded-lg overflow-visible shadow-md">
                    {/* Profile Picture */}
                    <div className="absolute left-6 -top-12 w-24 h-24 rounded-full overflow-hidden border-4 border-[#6D6E6F]">
                      <img
                        src="path_to_profile_image.jpg" // Replace with dynamic image path
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Comment Section */}
                    <p className="text-sm sm:text-base text-gray-600 mt-12 mb-4">
                      "This platform brought us together, and we couldn't be
                      happier! The process was seamless and so meaningful."
                    </p>

                    {/* Horizontal Line */}
                    <hr className="my-4 border-[#6D6E6F]" />

                    {/* Name & Profession and Rating */}
                    <div className="flex justify-between items-center">
                      {/* Name and Profession */}
                      <div>
                        <h4 className="text-lg font-semibold text-[#6D6E6F]">
                          Aisha & Zaid
                        </h4>
                        <p className="text-sm text-gray-500">
                          Software Engineer & Doctor
                        </p>
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-gray-300"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-gray-300"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial Card 1 */}
                <div className="flex-shrink-0 w-full md:w-1/3 px-4">
                  <div className="relative bg-white p-6 rounded-lg overflow-visible shadow-md">
                    {/* Profile Picture */}
                    <div className="absolute left-6 -top-12 w-24 h-24 rounded-full overflow-hidden border-4 border-[#6D6E6F]">
                      <img
                        src="path_to_profile_image.jpg" // Replace with dynamic image path
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Comment Section */}
                    <p className="text-sm sm:text-base text-gray-600 mt-12 mb-4">
                      "This platform brought us together, and we couldn't be
                      happier! The process was seamless and so meaningful."
                    </p>

                    {/* Horizontal Line */}
                    <hr className="my-4 border-[#6D6E6F]" />

                    {/* Name & Profession and Rating */}
                    <div className="flex justify-between items-center">
                      {/* Name and Profession */}
                      <div>
                        <h4 className="text-lg font-semibold text-[#6D6E6F]">
                          Aisha & Zaid
                        </h4>
                        <p className="text-sm text-gray-500">
                          Software Engineer & Doctor
                        </p>
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-gray-300"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-gray-300"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial Card 1 */}
                <div className="flex-shrink-0 w-full md:w-1/3 px-4">
                  <div className="relative bg-white p-6 rounded-lg overflow-visible shadow-md">
                    {/* Profile Picture */}
                    <div className="absolute left-6 -top-12 w-24 h-24 rounded-full overflow-hidden border-4 border-[#6D6E6F]">
                      <img
                        src="path_to_profile_image.jpg" // Replace with dynamic image path
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Comment Section */}
                    <p className="text-sm sm:text-base text-gray-600 mt-12 mb-4">
                      "This platform brought us together, and we couldn't be
                      happier! The process was seamless and so meaningful."
                    </p>

                    {/* Horizontal Line */}
                    <hr className="my-4 border-[#6D6E6F]" />

                    {/* Name & Profession and Rating */}
                    <div className="flex justify-between items-center">
                      {/* Name and Profession */}
                      <div>
                        <h4 className="text-lg font-semibold text-[#6D6E6F]">
                          Aisha & Zaid
                        </h4>
                        <p className="text-sm text-gray-500">
                          Software Engineer & Doctor
                        </p>
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-yellow-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-gray-300"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        <svg
                          className="w-5 h-5 text-gray-300"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dots for Sliding */}
              <div className="flex justify-center mt-8 space-x-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-4 h-4 rounded-full ${index === currentSlide ? "bg-[#6D6E6F]" : "bg-gray-300"
                      }`}
                    onClick={() => setCurrentSlide(index)} // Change slide dynamically
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mobile App Section */}
        <section className="flex flex-col lg:flex-row items-center justify-between p-40 bg-white">
          {/* Image Section */}
          <div className="col-span-2 flex justify-center relative">
            <div
              className="w-[350px] h-[500px] rounded-3xl overflow-hidden relative bg-cover bg-center shadow-md border-2 border-[#FFCEE9]"
              style={{
                // backgroundImage: `url(${about_image_url})`,
                backgroundSize: "150%",
              }}
            >
              <div className="h-[300px] w-[250px] transform rotate-[45deg] bg-[##898B92] absolute -bottom-12 right-12 blur-3xl"></div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text leading-tight">
              Mobile App
            </h2>
            <h3 className="text-xl font-semibold text-gray-600 mt-2 ">
              Available for iOS and Android
            </h3>
            {/* <p className="text-5xl font-semibold mt-6 bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text leading-tight">
              Coming Soon
            </p> */}

            {/* Badges for iOS and PlayStore */}
            <div className="flex justify-center lg:justify-start gap-4 mt-8"></div>

            {/* Gradient Text */}
            <p className="mt-4 text-2xl ">Your text here</p>
          </div>
        </section>

        {/* Profile Cards */}
        <section>
          <h2 className="text-3xl sm:text-4xl font-semibold text-center bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text mb-12">
            Recently Added <br /> Profiles
          </h2>

          <ProfileCardList setIsModalOpen={setIsModalOpen} profiles={apiData} />
        </section>

        {/* FAQs */}
        <section id="faqs" className="py-20 bg-gradient-to-br from-[#FFF5FB] to-[#F8F9FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold font-['Poppins'] bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text mb-4">
                Frequently Asked Questions
            </h2>
              <p className="text-lg text-[#6D6E6F] max-w-2xl mx-auto">
                Get answers to common questions about MehramMatch and how our platform works.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid gap-6">
              {/* FAQ 1 */}
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[#2D3748] mb-4">
                  What is MehramMatch?
                        </h3>
                        <p className="text-[#6D6E6F] leading-relaxed">
                  MehramMatch is a SaaS platform designed to help individuals
                  and families find the right match for Nikah. It combines
                  advanced matchmaking algorithms, robust security features, and
                  a user-friendly interface to ensure a seamless and halal
                  experience.
                </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">Q</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              {/* FAQ 2 */}
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[#2D3748] mb-4">
                  How does MehramMatch work?
                        </h3>
                        <p className="text-[#6D6E6F] leading-relaxed">
                  MehramMatch uses advanced algorithms to match profiles based
                  on compatibility, values, and preferences. Users can register,
                  complete their profiles, and explore potential matches while
                  maintaining privacy and cultural values.
                </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">Q</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              {/* FAQ 3 */}
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[#2D3748] mb-4">
                  Is MehramMatch secure?
                        </h3>
                        <p className="text-[#6D6E6F] leading-relaxed">
                  Yes, security and privacy are our top priorities. MehramMatch
                  uses encrypted data, secure authentication, and profile
                  verification to ensure a safe platform for all users.
                </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">Q</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              {/* FAQ 4 */}
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[#2D3748] mb-4">
                  What makes MehramMatch unique?
                        </h3>
                        <p className="text-[#6D6E6F] leading-relaxed">
                  MehramMatch is a SaaS-based solution specifically designed
                  with Islamic principles in mind. It seamlessly combines
                  technology with tradition to offer a modern approach to
                  finding compatible matches while adhering to halal standards.
                </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">Q</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FAQ 5 */}
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[#2D3748] mb-4">
                  Can I use MehramMatch on mobile devices?
                        </h3>
                        <p className="text-[#6D6E6F] leading-relaxed">
                  As a SaaS platform, MehramMatch is accessible on desktops and
                  tablets. We are excited to announce that our mobile app is
                  launching soon, allowing users to enjoy a seamless experience
                  on their mobile devices in the near future.
                </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">Q</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact CTA */}
              <div className="mt-16 text-center">
                <div className="bg-[#FED5EC] rounded-2xl p-8 text-[#333]">
                  <h3 className="text-2xl font-bold mb-4 text-[#d63384]">Still have questions?</h3>
                  <p className="text-lg mb-6 text-[#6D6E6F]">
                    Our support team is here to help you with any questions you might have.
                  </p>
                  <a 
                    href="mailto:contact@mehrammatch.com"
                    className="inline-block bg-[#d63384] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#CB3B8B] transition-colors duration-300"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />

      </div>
    </>
  );
};

export default LandingPage;
