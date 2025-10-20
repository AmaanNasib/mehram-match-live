import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import hero1 from "../../../images/hh1.jpg";
import hero2 from "../../../images/hero2.jpeg";
import hero3 from "../../../images/hero3.avif";
import Footer from "../../sections/Footer";
import Navbar from "../../sections/Navbar";
import Analytics from "../../sections/Analytics/Analytics";
import Loginwindow from "./Loginwindow";
import LoginPopup from "../LoginPage/Loginpop";
import HeroSection from "./HeroSection";
import PackagesSection from "./PackagesSection";
import HowItWorksSection from "./HowItWorksSection";
import WhyChooseUsSection from "./WhyChooseUsSection";
import TestimonialsSection from "./TestimonialsSection";
import MobileAppSection from "./MobileAppSection";
import ProfilesSection from "./ProfilesSection";
import FAQSection from "./FAQSection";

import {
  registration,
  justpostDataWithoutToken,
  fetchDataV2,
} from "../../../apiUtils";

const LandingPage = () => {
  const pathname = window.location.pathname;
  const lastSegment = pathname.split("/").pop();
  const navigate = useNavigate();

  const [isOpenWindow, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [hero1, hero2, hero3];
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpFormVisible, setOtpFormVisible] = useState(false);
  const [captchaImage, setCaptchaImage] = useState("");
  const [login, setLogin] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1");
  const [showTooltip, setShowTooltip] = useState(null);
  const [isLogIn, setIsLogIn] = useState(false);

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

  const countryCodes = [
    { code: "+1", iso: "US" },
    { code: "+91", iso: "IN" },
    { code: "+44", iso: "GB" },
    { code: "+61", iso: "AU" },
  ];

  const handleTooltipClick = (field) => {
    setShowTooltip(showTooltip === field ? null : field);
  };

  const handleInputChange = (e) => {
    const { id, type, value, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (id === 'first_name' || id === 'last_name') {
      newValue = newValue.replace(/[^A-Za-z\s]/g, '');
    }

    setFormData((prevState) => ({
      ...prevState,
      [id]: newValue,
    }));

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
        gender: autoGender,
      }));
    }

    if (errors[id]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleCountryCodeChange = (e) => {
    setSelectedCountryCode(e.target.value);
  };

  const handleValidForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First Name is required';
    } else if (!nameRegex.test(formData.first_name)) {
      newErrors.first_name = 'First Name should contain only letters';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last Name is required';
    } else if (!nameRegex.test(formData.last_name)) {
      newErrors.last_name = 'Last Name should contain only letters';
    }

    if ((formData.on_behalf === 'Self' || formData.on_behalf === 'Friend') && !formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of Birth is required';
    } else if (!dateRegex.test(formData.date_of_birth)) {
      newErrors.date_of_birth = 'Invalid date format (YYYY-MM-DD)';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.mobile_no.trim()) {
      newErrors.mobile_no = 'Phone number is required';
    } else if (!phoneRegex.test(formData.mobile_no)) {
      newErrors.mobile_no = 'Invalid phone number (10 digits required)';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters long and contain at least one uppercase letter, one number, and one special character';
    }

    if (!formData.conform_password.trim()) {
      newErrors.conform_password = 'Confirm Password is required';
    } else if (formData.conform_password !== formData.password) {
      newErrors.conform_password = 'Passwords do not match';
    }

    if (formData.referral_code.trim() && !/^\d+$/.test(formData.referral_code)) {
      newErrors.referral_code = 'Referral Code should contain only numbers';
    }

    if (!formData.terms_condition) {
      newErrors.terms_condition = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleValidOtp = () => {
    const newErrors = {};

    if (!formData.otp.trim()) {
      newErrors.otp = 'OTP is required';
    } else if (formData.otp !== '1234') {
      newErrors.otp = 'Invalid OTP';
    }

    if (!formData.captcha.trim()) {
      newErrors.captcha = 'CAPTCHA is required';
    }

    setOtpErrors(newErrors);
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
    }
  };

  const verifyOtpAndCaptcha = (e) => {
    e.preventDefault();
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
        navUrl: lastSegment === "agent" ? "/agentstepone/" : "/newdashboard",
        showSuccessMessage: (message) => alert(message),
        showErrorMessage: (message) => alert(message),
      };
      registration(parameter);
    }
  };

  const closeWindow = () => {
    setIsModalOpen(false);
  };

  const [refreshCaptchaIMg, setRefreshCaptcha] = useState(false);
  const refreshCaptcha = () => {
    setRefreshCaptcha(!refreshCaptchaIMg);
  };

  // Hash navigation
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

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Tooltip outside click
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

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogIn(false);
  }, []);

  // Fetch captcha and profile data
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

  // Fetch analytics data
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

  // Auto-slide for images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);

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

      <div className="relative overflow-hidden">
        {/* Background Gradient SVG */}
        <svg
          className="absolute top-0 left-0 w-full h-auto pointer-events-none hidden lg:block"
          viewBox="0 0 3057 1612"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <g opacity="0.4" filter="url(#filter0_f_2513_5037)">
            <path
              d="M792.911 1177.39C2161.93 1205.37 2687.91 1336.3 2676.83 1053.46C2665.75 770.607 2531.75 162.933 1919.78 608.194C1307.81 1053.46 -348.73 258.382 744.376 396.308C1618.86 506.649 1812.51 859.393 1800.02 1021.97"
              stroke="url(#paint0_linear_2513_5037)"
              strokeWidth="191"
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
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
              <stop stopColor="#F998CE" />
              <stop offset="1" stopColor="#A188EE" />
            </linearGradient>
          </defs>
        </svg>

        {/* Hero Section */}
        <HeroSection
          formData={formData}
          errors={errors}
          isOtpFormVisible={isOtpFormVisible}
          handleInputChange={handleInputChange}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          selectedCountryCode={selectedCountryCode}
          handleCountryCodeChange={handleCountryCodeChange}
          countryCodes={countryCodes}
          posstData={posstData}
          verifyOtpAndCaptcha={verifyOtpAndCaptcha}
          otpErrors={otpErrors}
          setFormData={setFormData}
          setOtpErrors={setOtpErrors}
          captchaImage={captchaImage}
          refreshCaptcha={refreshCaptcha}
          lastSegment={lastSegment}
          images={images}
          currentSlide={currentSlide}
          showTooltip={showTooltip}
          handleTooltipClick={handleTooltipClick}
        />

        {/* Analytics Section */}
        <Analytics apiData={apiData1} />

        {/* Packages Section */}
        <PackagesSection />

        {/* How It Works Section */}
        <HowItWorksSection hero3={hero3} />

        {/* Why Choose Us Section */}
        <WhyChooseUsSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Mobile App Section */}
        <MobileAppSection />

        {/* Recently Added Profiles */}
        <ProfilesSection profiles={apiData} setIsModalOpen={setIsModalOpen} />

        {/* FAQs Section */}
        <FAQSection />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;

