import React, { useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const HeroSection = ({ 
  formData, 
  errors, 
  isOtpFormVisible, 
  handleInputChange, 
  showPassword, 
  setShowPassword,
  selectedCountryCode,
  handleCountryCodeChange,
  countryCodes,
  posstData,
  verifyOtpAndCaptcha,
  otpErrors,
  setFormData,
  setOtpErrors,
  captchaImage,
  refreshCaptcha,
  lastSegment,
  images,
  currentSlide,
  showTooltip,
  handleTooltipClick,
  onGoogleSignUp
}) => {
  // Google Sign Up Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleUserData, setGoogleUserData] = useState(null);
  const [googleFormData, setGoogleFormData] = useState({
    on_behalf: 'Self',
    gender: '',
    dob: '',
    password: '',
    confirm_password: ''
  });

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
      setGoogleUserData(userData);
      
      // Generate a random password for Google users
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      
      // Set initial form data with Google info
      setGoogleFormData({
        on_behalf: 'Self',
        gender: '',
        dob: userData.birthdate || '', // Google might provide birthdate
        password: generatedPassword,
        confirm_password: generatedPassword
      });
      
      setShowGoogleModal(true);
    } catch (error) {
      console.error('Error decoding Google token:', error);
    }
  };

  // Google OAuth Error Handler
  const handleGoogleError = () => {
    console.error('Google OAuth failed');
  };

  // Handle On Behalf Selection
  const handleGoogleOnBehalfChange = (e) => {
    const value = e.target.value;
    let autoGender = '';
    let dob = googleFormData.dob;
    let password = googleFormData.password;
    let confirm_password = googleFormData.confirm_password;
    
    if (value === 'Brother' || value === 'Son') {
      autoGender = 'male';
    } else if (value === 'Sister' || value === 'Daughter') {
      autoGender = 'female';
    }
    
    // Handle DOB and Password based on selection
    if (value === 'Self') {
      // For Self: Use Google DOB and generated password
      dob = googleUserData?.birthdate || '';
      // Keep the generated password
    } else if (value === 'Friend') {
      // For Friend: Clear DOB, keep generated password
      dob = '';
      // Keep the generated password
    } else {
      // For family members: Clear DOB and password
      dob = '';
      password = '';
      confirm_password = '';
    }
    
    setGoogleFormData({
      on_behalf: value,
      gender: autoGender,
      dob: dob,
      password: password,
      confirm_password: confirm_password
    });
  };

  // Handle Google Sign Up Submit
  const handleGoogleSignUpSubmit = () => {
    if (!googleUserData) return;

    let registrationData;
    
    if (googleFormData.on_behalf === 'Self' || googleFormData.on_behalf === 'Friend') {
      // Use Google name data for Self/Friend
      registrationData = {
        name: googleUserData.name,
        first_name: googleUserData.given_name,
        last_name: googleUserData.family_name,
        email: googleUserData.email,
        on_behalf: googleFormData.on_behalf,
        gender: googleFormData.gender || 'male', // Default if not auto-selected
        dob: googleFormData.dob, // Use DOB from form
        password: googleFormData.password, // Use generated password
        confirm_password: googleFormData.confirm_password,
        terms_condition: true
      };
    } else {
      // Clear name data for family members
      registrationData = {
        name: '',
        first_name: '',
        last_name: '',
        email: googleUserData.email,
        on_behalf: googleFormData.on_behalf,
        gender: googleFormData.gender,
        dob: googleFormData.dob, // Use DOB from form (empty for family members)
        password: googleFormData.password, // Use password from form
        confirm_password: googleFormData.confirm_password,
        terms_condition: true
      };
    }

    // Call the parent component's Google sign up handler
    if (onGoogleSignUp) {
      onGoogleSignUp(registrationData);
    }
    
    setShowGoogleModal(false);
  };
  return (
    <section
      className="py-12 md:py-20 lg:py-24 pt-20 md:pt-24 min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${images[currentSlide]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "background-image 1s ease-in-out",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
          {/* Hero Image/Video Section - Hidden on mobile, visible on lg+ */}
          <div className="hidden lg:block lg:w-1/2 max-w-xl">
            <div className="rounded-3xl shadow-2xl bg-white/10 backdrop-blur p-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Find Your Halal Partner with Confidence
              </h1>
              <p className="mt-4 text-white/90 text-sm sm:text-base lg:text-lg">
                MehramMatch par apni values, preferences aur privacy ke saath profile banayein.
                Smart recommendations aur secure communication ke through apna perfect match dhundhein.
              </p>
              <ul className="mt-6 space-y-3 text-white/90 text-xs sm:text-sm lg:text-base list-disc list-inside">
                <li>Faith-centered matchmaking</li>
                <li>Privacy-first profiles & photo controls</li>
                <li>Detailed preferences for better compatibility</li>
              </ul>
            </div>
          </div>

          {/* Registration Form Section */}
          <div className="w-full lg:w-1/2 max-w-2xl" id="registration-form">
            <div
              className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl border border-gray-200 w-full mx-2 sm:mx-0"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-[#FF28A0] text-center mb-2">
                {!isOtpFormVisible ? "Create Your Account" : "Verify Your Account"}
              </h2>
              <h3 className="text-xs sm:text-sm md:text-base text-[#6D6E6F] text-center mb-6">
                {lastSegment === "agent" ? `Agent Registration` : `Fill out the form to get started.`}
              </h3>

              {!isOtpFormVisible ? (
                <RegistrationForm 
                  formData={formData}
                  errors={errors}
                  handleInputChange={handleInputChange}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  selectedCountryCode={selectedCountryCode}
                  handleCountryCodeChange={handleCountryCodeChange}
                  countryCodes={countryCodes}
                  posstData={posstData}
                  lastSegment={lastSegment}
                  showTooltip={showTooltip}
                  handleTooltipClick={handleTooltipClick}
                  handleGoogleSuccess={handleGoogleSuccess}
                  handleGoogleError={handleGoogleError}
                />
              ) : (
                <OTPForm 
                  formData={formData}
                  setFormData={setFormData}
                  otpErrors={otpErrors}
                  setOtpErrors={setOtpErrors}
                  captchaImage={captchaImage}
                  refreshCaptcha={refreshCaptcha}
                  verifyOtpAndCaptcha={verifyOtpAndCaptcha}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Google Sign Up Modal */}
      <GoogleSignUpModal
        showModal={showGoogleModal}
        setShowModal={setShowGoogleModal}
        googleUserData={googleUserData}
        googleFormData={googleFormData}
        setGoogleFormData={setGoogleFormData}
        handleGoogleOnBehalfChange={handleGoogleOnBehalfChange}
        handleGoogleSignUpSubmit={handleGoogleSignUpSubmit}
      />
    </section>
  );
};

// Registration Form Component
const RegistrationForm = ({ 
  formData, 
  errors, 
  handleInputChange, 
  showPassword, 
  setShowPassword,
  selectedCountryCode,
  handleCountryCodeChange,
  countryCodes,
  posstData,
  lastSegment,
  showTooltip,
  handleTooltipClick,
  handleGoogleSuccess,
  handleGoogleError
}) => (
  <form className="space-y-4 px-1 sm:px-0">
    {/* On Behalf Field */}
    {lastSegment !== 'agent' && (
      <FormField label="Profile Creating For" required tooltip="Select who this profile is for. Brother/Son will auto-set gender as Male, Daughter/Sister as Female. For Self/Friend, you'll need to select gender manually." showTooltip={showTooltip} handleTooltipClick={handleTooltipClick} fieldName="on_behalf">
        <select
          id="on_behalf"
          className="w-full h-11 px-4 text-[#898B92] font-semibold rounded-lg border border-[#898B92] focus:outline-none focus:ring-2 focus:ring-[#CB3B8B]"
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
      </FormField>
    )}

    {/* First Name & Last Name */}
    {/* First Name and Last Name fields removed */}

    {/* Gender and Date of Birth fields removed */}

    {/* Email */}
    <FormField label="Email" required error={errors.email} tooltip="Enter a valid email address. This will be used for account verification and communication." showTooltip={showTooltip} handleTooltipClick={handleTooltipClick} fieldName="email">
        <input
          id="email"
          type="email"
          className={`w-full h-11 px-3 sm:px-4 text-[#6D6E6F] font-semibold rounded-lg border ${errors.email ? "border-red-500" : "border-[#898B92]"} focus:outline-none focus:ring-2 focus:ring-[#CB3B8B]`}
          placeholder="Enter your email"
          onChange={handleInputChange}
          value={formData.email}
        />
    </FormField>

    {/* Phone */}
    <FormField label="Phone" required error={errors.mobile_no} tooltip="Enter your 10-digit phone number. This will be used for OTP verification." showTooltip={showTooltip} handleTooltipClick={handleTooltipClick} fieldName="mobile_no">
      <div className="flex gap-1 sm:gap-2">
        <div className="flex items-center h-11 px-1 sm:px-2 border border-[#898B92] rounded-lg min-w-0 flex-shrink-0">
          <ReactCountryFlag
            countryCode={countryCodes.find((country) => country.code === selectedCountryCode)?.iso}
            svg
            style={{ width: '20px', height: '14px', marginRight: '4px' }}
          />
          <select
            value={selectedCountryCode}
            onChange={handleCountryCodeChange}
            className="bg-transparent focus:outline-none text-xs sm:text-sm min-w-0"
          >
            {countryCodes.map((country) => (
              <option key={country.code} value={country.code}>
                {country.code}
              </option>
            ))}
          </select>
        </div>
        <input
          id="mobile_no"
          type="text"
          inputMode="numeric"
          className={`flex-1 h-11 px-2 sm:px-3 text-[#6D6E6F] font-semibold rounded-lg border ${errors.mobile_no ? "border-red-500" : "border-[#898B92]"} focus:outline-none focus:ring-2 focus:ring-[#CB3B8B] min-w-0`}
          placeholder="Phone number"
          onChange={handleInputChange}
          value={formData.mobile_no}
        />
      </div>
    </FormField>

    {/* Password & Confirm Password */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <PasswordField 
        id="password"
        label="Password"
        value={formData.password}
        error={errors.password}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        handleInputChange={handleInputChange}
        showTooltip={showTooltip}
        handleTooltipClick={handleTooltipClick}
      />
      <PasswordField 
        id="conform_password"
        label="Confirm Password"
        value={formData.conform_password}
        error={errors.conform_password}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        handleInputChange={handleInputChange}
        showTooltip={showTooltip}
        handleTooltipClick={handleTooltipClick}
      />
    </div>

    {/* Terms & Conditions */}
    <div className="flex items-start gap-3 pt-2">
      <input
        id="terms_condition"
        type="checkbox"
        className="w-5 h-5 mt-0.5 text-[#CB3B8B] focus:ring-[#CB3B8B] rounded border-[#898B92]"
        onChange={handleInputChange}
        checked={formData.terms_condition}
      />
      <label htmlFor="terms_condition" className="text-xs sm:text-sm text-[#6D6E6F]">
        By signing up you agree to our <a href="/terms-conditions" className="text-[#FF28A0] font-medium hover:underline cursor-pointer">terms and conditions.</a>
      </label>
    </div>
    {errors.terms_condition && <p className="text-red-500 text-sm">{errors.terms_condition}</p>}

    {/* Submit Button */}
    <button
      onClick={posstData}
      type="button"
      className="w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 hover:shadow-lg"
      style={{ background: 'linear-gradient(45deg, rgb(210, 53, 53), rgb(225, 43, 104))' }}
    >
      Create Account
    </button>

    {/* Divider */}
    <div className="flex items-center gap-4 py-2">
      <div className="flex-1 border-t border-gray-300" />
      <span className="text-xs sm:text-sm text-[#6D6E6F] font-medium">Or Join With</span>
      <div className="flex-1 border-t border-gray-300" />
    </div>

    {/* Google Sign In */}
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || "your-google-client-id"}>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        theme="outline"
        size="large"
        text="signup_with"
        shape="rectangular"
        width="100%"
        className="w-full"
      />
    </GoogleOAuthProvider>
  </form>
);

// OTP Form Component
const OTPForm = ({ formData, setFormData, otpErrors, setOtpErrors, captchaImage, refreshCaptcha, verifyOtpAndCaptcha }) => (
  <form className="space-y-6">
    <FormField label="Enter OTP" error={otpErrors.otp}>
      <input
        id="otp"
        type="text"
        className="w-full h-11 px-4 text-[#6D6E6F] font-semibold rounded-lg border border-[#898B92] focus:outline-none focus:ring-2 focus:ring-[#CB3B8B]"
        placeholder="123456"
        value={formData.otp}
        onChange={(e) => {
          setFormData({ ...formData, otp: e.target.value });
          setOtpErrors((prev) => ({ ...prev, otp: '' }));
        }}
      />
    </FormField>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField label="CAPTCHA" error={otpErrors.captcha}>
        <input
          id="captcha"
          type="text"
          className="w-full h-11 px-4 text-[#6D6E6F] font-semibold rounded-lg border border-[#898B92] focus:outline-none focus:ring-2 focus:ring-[#CB3B8B]"
          placeholder="Enter CAPTCHA"
          value={formData.captcha}
          onChange={(e) => {
            setFormData({ ...formData, captcha: e.target.value });
            setOtpErrors((prev) => ({ ...prev, captcha: '' }));
          }}
        />
      </FormField>

      <div className="flex gap-2">
        <button
          type="button"
          className="h-11 px-4 text-sm font-medium text-[#6D6E6F] bg-white border border-[#898B92] rounded-lg hover:bg-gray-50"
          onClick={refreshCaptcha}
        >
          Refresh
        </button>
        <div className="flex items-center justify-center flex-1 border border-[#898B92] rounded-lg bg-gray-50">
          <img
            className="h-8"
            src={`${process.env.REACT_APP_API_URL}${captchaImage.captcha_image}`}
            alt="CAPTCHA"
          />
        </div>
      </div>
    </div>

    <button
      onClick={verifyOtpAndCaptcha}
      type="button"
      className="w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 hover:shadow-lg"
      style={{ background: 'linear-gradient(45deg, rgb(210, 53, 53), rgb(225, 43, 104))' }}
    >
      Submit
    </button>
  </form>
);

// Form Field Component
const FormField = ({ label, required, error, children, tooltip, showTooltip, handleTooltipClick, fieldName }) => (
  <div>
    <div className="flex items-center gap-2 mb-2">
      <label className="text-xs sm:text-sm font-medium text-[#6D6E6F]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {tooltip && (
        <div 
          className="group relative tooltip-container"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleTooltipClick(fieldName);
          }}
        >
          <svg 
            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-all duration-300 z-[9999] shadow-lg pointer-events-none ${showTooltip === fieldName ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`} style={{ width: '200px', wordWrap: 'break-word' }}>
            {tooltip}
            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      )}
    </div>
    {children}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Password Field Component
const PasswordField = ({ id, label, value, error, showPassword, setShowPassword, handleInputChange, showTooltip, handleTooltipClick }) => (
  <FormField 
    label={label} 
    required 
    error={error}
    tooltip={id === "password" ? "Password must be at least 6 characters with 1 uppercase letter, 1 number, and 1 special character." : "Re-enter your password to confirm. Must match the password above exactly."}
    showTooltip={showTooltip}
    handleTooltipClick={handleTooltipClick}
    fieldName={id}
  >
    <div className="relative">
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        className={`w-full h-11 px-4 pr-12 text-[#6D6E6F] font-semibold rounded-lg border ${error ? "border-red-500" : "border-[#898B92]"} focus:outline-none focus:ring-2 focus:ring-[#CB3B8B]`}
        placeholder="************"
        onChange={handleInputChange}
        value={value}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <svg className="w-5 h-5 text-[#6D6E6F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-[#6D6E6F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        )}
      </button>
    </div>
  </FormField>
);

// Google Sign Up Modal Component
const GoogleSignUpModal = ({ 
  showModal, 
  setShowModal, 
  googleUserData, 
  googleFormData, 
  setGoogleFormData,
  handleGoogleOnBehalfChange, 
  handleGoogleSignUpSubmit 
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Complete Your Profile</h3>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {googleUserData && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Signed in as:</p>
            <p className="font-medium text-gray-900">{googleUserData.name}</p>
            <p className="text-sm text-gray-500">{googleUserData.email}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Creating For <span className="text-red-500">*</span>
            </label>
            <select
              value={googleFormData.on_behalf}
              onChange={handleGoogleOnBehalfChange}
              className="w-full h-11 px-4 text-gray-700 font-semibold rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CB3B8B]"
            >
              <option value="Self">Self</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Daughter">Daughter</option>
              <option value="Son">Son</option>
              <option value="Friend">Friend</option>
            </select>
          </div>

          {googleFormData.gender && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Gender will be automatically set to: <span className="font-medium capitalize">{googleFormData.gender}</span>
              </p>
            </div>
          )}

          {/* DOB Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={googleFormData.dob}
              onChange={(e) => setGoogleFormData({...googleFormData, dob: e.target.value})}
              className="w-full h-11 px-4 text-gray-700 font-semibold rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CB3B8B]"
              required
              disabled={googleFormData.on_behalf === 'Self' && googleUserData?.birthdate}
            />
            {googleFormData.on_behalf === 'Self' && googleUserData?.birthdate && (
              <p className="text-xs text-green-600 mt-1">
                ✓ DOB pre-filled from Google account (read-only)
              </p>
            )}
            {googleFormData.on_behalf === 'Friend' && (
              <p className="text-xs text-blue-600 mt-1">
                ℹ️ Please enter your friend's date of birth
              </p>
            )}
            {googleFormData.on_behalf !== 'Self' && googleFormData.on_behalf !== 'Friend' && (
              <p className="text-xs text-orange-600 mt-1">
                ℹ️ Please enter the {googleFormData.on_behalf.toLowerCase()}'s date of birth
              </p>
            )}
          </div>

          {/* Password Fields - Only show for Self and Friend */}
          {(googleFormData.on_behalf === 'Self' || googleFormData.on_behalf === 'Friend') && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={googleFormData.password}
                  onChange={(e) => setGoogleFormData({...googleFormData, password: e.target.value})}
                  className="w-full h-11 px-4 text-gray-700 font-semibold rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CB3B8B]"
                  required
                  disabled={googleFormData.on_behalf === 'Self'}
                />
                {googleFormData.on_behalf === 'Self' && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Password auto-generated for Google account
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={googleFormData.confirm_password}
                  onChange={(e) => setGoogleFormData({...googleFormData, confirm_password: e.target.value})}
                  className="w-full h-11 px-4 text-gray-700 font-semibold rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#CB3B8B]"
                  required
                  disabled={googleFormData.on_behalf === 'Self'}
                />
              </div>
            </>
          )}

          {/* Family Member Info */}
          {googleFormData.on_behalf !== 'Self' && googleFormData.on_behalf !== 'Friend' && (
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-xs text-yellow-800">
                ℹ️ For {googleFormData.on_behalf.toLowerCase()}, you'll need to complete the profile creation form with their details.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGoogleSignUpSubmit}
              className="flex-1 py-2 px-4 bg-[#CB3B8B] text-white rounded-lg font-medium hover:bg-[#A8327A] transition-colors"
            >
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

