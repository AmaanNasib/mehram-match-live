import React from 'react';
import ReactCountryFlag from 'react-country-flag';

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
  handleTooltipClick
}) => {
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
          <div className="w-full lg:w-1/2 max-w-2xl">
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
  handleTooltipClick
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField label="First Name" required error={errors.first_name} tooltip="Enter your first name. Only letters and spaces allowed. Numbers and symbols will be automatically removed." showTooltip={showTooltip} handleTooltipClick={handleTooltipClick} fieldName="first_name">
        <input
          id="first_name"
          type="text"
          className={`w-full h-11 px-4 text-[#6D6E6F] font-semibold rounded-lg border ${errors.first_name ? "border-red-500" : "border-[#898B92]"} focus:outline-none focus:ring-2 focus:ring-[#CB3B8B]`}
          placeholder="First Name"
          onChange={handleInputChange}
          value={formData?.first_name || ''}
        />
      </FormField>

      <FormField label="Last Name" required error={errors.last_name} tooltip="Enter your last name (surname). Only letters and spaces allowed. Numbers and symbols will be automatically removed." showTooltip={showTooltip} handleTooltipClick={handleTooltipClick} fieldName="last_name">
        <input
          id="last_name"
          type="text"
          className={`w-full h-11 px-4 text-[#6D6E6F] font-semibold rounded-lg border ${errors.last_name ? "border-red-500" : "border-[#898B92]"} focus:outline-none focus:ring-2 focus:ring-[#CB3B8B]`}
          placeholder="Last Name"
          onChange={handleInputChange}
          value={formData.last_name}
        />
      </FormField>
    </div>

    {/* Gender Field - Conditional */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {(formData.on_behalf === 'Self' || formData.on_behalf === 'Friend') && (
        <FormField label="Gender" required error={errors.gender} tooltip="Select the gender. This field only appears when creating profile for Self or Friend." showTooltip={showTooltip} handleTooltipClick={handleTooltipClick} fieldName="gender">
          <select
            id="gender"
            className={`w-full h-11 px-4 text-[#6D6E6F] font-semibold rounded-lg border ${errors.gender ? "border-red-500" : "border-[#898B92]"} focus:outline-none focus:ring-2 focus:ring-[#CB3B8B]`}
            onChange={handleInputChange}
            value={formData.gender}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </FormField>
      )}

      <FormField label="Date of Birth" required error={errors.date_of_birth} tooltip="Select your date of birth. Age limit: Male (18+), Female (21+). Format: DD-MM-YYYY" showTooltip={showTooltip} handleTooltipClick={handleTooltipClick} fieldName="date_of_birth">
        <input
          id="date_of_birth"
          type="date"
          className={`w-full h-11 px-4 text-[#6D6E6F] font-semibold rounded-lg border ${errors.date_of_birth ? "border-red-500" : "border-[#898B92]"} focus:outline-none focus:ring-2 focus:ring-[#CB3B8B]`}
          onChange={handleInputChange}
          value={formData.date_of_birth}
          max={formData.gender === 'male' ? '2005-12-28' : '2007-12-28'}
        />
      </FormField>
    </div>

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
    <button
      type="button"
      className="w-full py-3 rounded-lg border border-gray-300 text-[#6D6E6F] font-medium bg-white hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-3"
    >
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Sign in with Google
    </button>
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

export default HeroSection;

