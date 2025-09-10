import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { updateDataV2 } from "../../../apiUtils";
import { fetchDataObjectV2 } from "../../../apiUtils";
import StepTracker from "../../StepTracker/StepTracker";

const MemStepTwo = () => {
  let [userId] = useState(localStorage.getItem("userId"));
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { useracreate, age, member_id } = location.state || {};
  
  const [profileData, setProfileData] = useState({
    sect_school_info: "",
    islamic_practicing_level: "",
    believe_in_dargah_fatiha_niyah: [],
    hijab_niqab_prefer: "",
    percentage: "",
    gender: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [showTooltip, setShowTooltip] = useState(null);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState("");
  
  userId = localStorage.getItem("member_id") || userId;

  useEffect(() => {
    if (userId) {
      const parameter = {
        url: `/api/user/${localStorage.getItem("member_id") || userId}/`,
        setterFunction: setApiData,
        setLoading: setLoading,
        setErrors: setErrors,
      };
      fetchDataObjectV2(parameter);
    }
  }, [userId, useracreate]);

  useEffect(() => {
    if (apiData) {
      setProfileData({
        percentage: apiData.profile_percentage || null,
        gender: apiData.gender || null,
        believe_in_dargah_fatiha_niyah: apiData.believe_in_dargah_fatiha_niyah ? 
          (Array.isArray(apiData.believe_in_dargah_fatiha_niyah) ? 
            apiData.believe_in_dargah_fatiha_niyah : 
            (typeof apiData.believe_in_dargah_fatiha_niyah === 'string' && apiData.believe_in_dargah_fatiha_niyah.includes(',')) ?
            apiData.believe_in_dargah_fatiha_niyah.split(',') :
            [apiData.believe_in_dargah_fatiha_niyah]) : [],
        sect_school_info: apiData.sect_school_info || null,
        islamic_practicing_level: apiData.islamic_practicing_level || null,
        hijab_niqab_prefer: apiData.hijab_niqab_prefer || null,
      });
    }
  }, [apiData]);

  const handleFieldChange = (field, value) => {
    setProfileData((prevState) => ({
      ...prevState,
      [field]: value,
    }));

    // Clear the error for the field when it is updated
    if (formErrors[field]) {
      setFormErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleMultiSelectChange = (field, value) => {
    setProfileData((prevState) => {
      const currentValues = prevState[field] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      
      return {
        ...prevState,
        [field]: newValues,
      };
    });

    // Clear the error for the field when it is updated
    if (formErrors[field]) {
      setFormErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleTooltipClick = (field) => {
    setShowTooltip(showTooltip === field ? null : field);
  };

  const handleTooltipLeave = () => {
    setShowTooltip(null);
  };

  // Close tooltip when clicking outside or pressing escape
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
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [showTooltip]);


  const validateForm = () => {
    const newErrors = {};

    // Field order for scrolling (top to bottom)
    const fieldOrder = [
      'sect_school_info', 'believe_in_dargah_fatiha_niyah', 'hijab_niqab_prefer'
    ];

    // Validate Sect / School of Thought
    if (!profileData.sect_school_info?.trim()) {
      newErrors.sect_school_info = "Sect / School of Thought is required";
    }

    // Validate Believe in Dargah/Fatiha/Niyah
    if (!profileData.believe_in_dargah_fatiha_niyah || profileData.believe_in_dargah_fatiha_niyah.length === 0) {
      newErrors.believe_in_dargah_fatiha_niyah = "Please select at least one option for Dargah/Fatiha/Niyah";
    }

    // Validate Hijab/Niqab Preference (only for females)
    if (profileData.gender === "female" && !profileData.hijab_niqab_prefer) {
      newErrors.hijab_niqab_prefer = "Hijab/Niqab Preference is required for females";
    }

    setFormErrors(newErrors);

    // If there are errors, scroll to the first error field
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = fieldOrder.find(field => newErrors[field]);
      if (firstErrorField) {
        setTimeout(() => {
          const element = document.querySelector(`[name="${firstErrorField}"]`) || 
                         document.querySelector(`input[name="${firstErrorField}"]`) ||
                         document.querySelector(`select[name="${firstErrorField}"]`) ||
                         document.querySelector(`textarea[name="${firstErrorField}"]`);
          
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
            element.focus();
          }
        }, 100);
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  const naviagteNextStep = () => {
    if (validateForm()) {
      const parameters = {
        url: `/api/user/${userId}`,
        payload: {
          sect_school_info: profileData.sect_school_info,
          islamic_practicing_level: profileData.islamic_practicing_level,
          believe_in_dargah_fatiha_niyah: Array.isArray(profileData.believe_in_dargah_fatiha_niyah) 
            ? profileData.believe_in_dargah_fatiha_niyah.join(',') 
            : profileData.believe_in_dargah_fatiha_niyah,
          hijab_niqab_prefer: profileData.hijab_niqab_prefer,
        },
        navigate: navigate,
        navUrl: `/memstepthree`,
      };
      updateDataV2(parameters);
    } else {
      console.log("Form has errors. Please fix them.");
    }
  };

  // Dropdown component
  const Dropdown = ({ options, name, value, onChange, disabled = false }) => {
    return (
      <div className="relative">
        <select
          name={name}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          className={`w-full h-12 px-4 pr-10 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-sm font-medium appearance-none ${
            disabled 
              ? "bg-gray-100 cursor-not-allowed" 
              : "bg-white cursor-pointer"
          }`}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  };

  // Enhanced Multi-select pills component
  const MultiSelectPills = ({ name, values, onChange, options, error }) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {options.map((option) => {
            const isSelected = values.includes(option.value);
  return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(name, option.value)}
                className={`group relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border-2 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] text-white border-[#CB3B8B] shadow-lg shadow-[#FFC0E3]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#FFA4D6] hover:bg-[#FFC0E3] hover:text-[#CB3B8B] shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-center leading-tight">{option.label}</span>
                  {isSelected && (
                    <svg 
                      className="w-4 h-4 text-white animate-pulse" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        d="M5 13l4 4L19 7" 
                        />
                      </svg>
                  )}
                </div>

                {/* Hover effect overlay */}
                <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                  isSelected 
                    ? 'bg-gradient-to-r from-[#F971BC] to-[#DA73AD] opacity-0 group-hover:opacity-20' 
                    : 'bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] opacity-0 group-hover:opacity-100'
                }`}></div>
              </button>
            );
          })}
        </div>
        
        {/* Selected count indicator */}
        {values.length > 0 && (
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-[#CB3B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{values.length} option{values.length !== 1 ? 's' : ''} selected</span>
          </div>
        )}
        
        {error && (
          <div className="flex items-center space-x-2 text-red-500 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  };

  // Radio button component
  const RadioGroup = ({ name, value, onChange, options, error }) => {
    return (
      <div className="space-y-2">
        <div className="flex space-x-6">
          {options.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                id={`${name}_${option.value}`}
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                className="h-4 w-4 text-[#CB3B8B] focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
              />
                  <label
                htmlFor={`${name}_${option.value}`}
                className="ml-2 text-sm font-medium text-gray-700"
                  >
                {option.label}
                  </label>
            </div>
          ))}
        </div>
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    );
  };

  // Sect options
  const sectOptions = [
    { value: "ahle_quran", label: "Ahle Qur'an" },
    { value: "ahmadi", label: "Ahamadi" },
    { value: "barelvi", label: "Barelvi" },
    { value: "bohra", label: "Bohra" },
    { value: "deobandi", label: "Deobandi" },
    { value: "hanabali", label: "Hanabali" },
    { value: "hanafi", label: "Hanafi" },
    { value: "ibadi", label: "Ibadi" },
    { value: "ismaili", label: "Ismaili" },
    { value: "jamat_e_islami", label: "Jamat e Islami" },
    { value: "maliki", label: "Maliki" },
    { value: "pathan", label: "Pathan" },
    { value: "salafi", label: "Salafi" },
    { value: "salafi_ahle_hadees", label: "Salafi/Ahle Hadees" },
    { value: "sayyid", label: "Sayyid" },
    { value: "shafi", label: "Shafi" },
    { value: "shia", label: "Shia" },
    { value: "sunni", label: "Sunni" },
    { value: "sufism", label: "Sufism" },
    { value: "tableeghi_jamaat", label: "Tableeghi Jama'at" },
    { value: "zahiri", label: "Zahiri" },
    { value: "muslim", label: "Muslim" },
    { value: "other", label: "Other" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
  ];

  // Islamic practicing level options
  const practicingLevelOptions = [
    { value: "devout", label: "Devout" },
    { value: "very_religious", label: "Very Religious" },
    { value: "religious", label: "Religious" },
    { value: "moderately_religious", label: "Moderately Religious" },
    { value: "occasionally_religious", label: "Occasionally Religious" },
    { value: "cultural_but_non_practicing", label: "Cultural but non-practicing" },
    { value: "spiritual_but_not_religious", label: "Spiritual but not religious" },
    { value: "religious_but_not_practicing", label: "Religious but not practicing" },
    { value: "open_to_exploring_religion", label: "Open to exploring religion" },
    { value: "agnostic", label: "Agnostic" },
    { value: "atheist", label: "Atheist" },
    { value: "secular", label: "Secular" },
    { value: "open_to_all_beliefs", label: "Open to all beliefs" },
    { value: "not_religious", label: "Not religious" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
  ];

  // Dargah/Fatiha/Niyaz options
  const dargahOptions = [
    { value: "dargah_fatiha_niyaz", label: "Yes (Dargah, Fatiha, and Niyaz)" },
    { value: "dargah_fatiha", label: "Yes (Dargah and Fatiha)" },
    { value: "dargah_niyaz", label: "Yes (Dargah and Niyaz)" },
    { value: "fatiha_niyaz", label: "Yes (Fatiha and Niyaz)" },
    { value: "only_dargah", label: "Yes (Only Dargah)" },
    { value: "only_fatiha", label: "Yes (Only Fatiha)" },
    { value: "only_niyaz", label: "Yes (Only Niyaz)" },
    { value: "no_all", label: "No (No Dargah, No Fatiha, No Niyaz)" },
    { value: "sometimes", label: "Sometimes" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
  ];

  // Yes/No options
  const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0E3] via-white to-[#FFA4D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-[#CB3B8B] to-[#F971BC] bg-clip-text text-transparent">
          Create Your Mehram Match Profile
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Follow these 6 simple steps to complete your profile and find the perfect match
          </p>
        </div>

        {/* Main Content Container */}
        <div className="flex flex-col gap-6">
          {/* Mobile Step Tracker - Separate container above form */}
          <div className="lg:hidden block">
            <StepTracker percentage={33} />
          </div>

          {/* Desktop and Form Container */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Step Tracker - Professional sidebar layout */}
            <div className="lg:block hidden">
              <StepTracker percentage={33} />
            </div>

            {/* Main Form Container */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex-1">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100 text-sm font-medium uppercase tracking-wide">
                      Step 2 of 6
                    </p>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      Religious Information
                    </h2>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <form className="space-y-8">
                  {/* Religious Information Section */}
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <span className="bg-[#FFC0E3] text-[#CB3B8B] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
                        Religious Background
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">
                        Please provide your religious details to help us create a profile that aligns with your values and preferences
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Sect / School of Thought */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Sect / School of Thought <span className="text-red-500">*</span></span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
                        fill="none"
                              stroke="currentColor" 
                        viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('sect_school_info');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'sect_school_info' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Select your Islamic sect or school of thought
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <Dropdown
                          options={sectOptions}
                          name="sect_school_info"
                          value={profileData.sect_school_info}
                          onChange={(e) => handleFieldChange("sect_school_info", e.target.value)}
                        />
                        {formErrors.sect_school_info && (
                          <p className="text-red-500 text-sm">{formErrors.sect_school_info}</p>
                        )}
                      </div>

                      {/* Islamic Practicing Level */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Islamic Practicing Level</span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('islamic_practicing_level');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'islamic_practicing_level' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Select your level of Islamic practice and observance
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                        </label>
                        <Dropdown
                          options={practicingLevelOptions}
                          name="islamic_practicing_level"
                          value={profileData.islamic_practicing_level}
                          onChange={(e) => handleFieldChange("islamic_practicing_level", e.target.value)}
                        />
                    </div>
                    </div>
                  </div>

                  {/* Religious Beliefs Section */}
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <span className="bg-[#FFC0E3] text-[#CB3B8B] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
                        Religious Beliefs & Practices
                      </h3>
                </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Believe in Dargah/Fatiha/Niyah */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Believe in Dargah/Fatiha/Niyah? <span className="text-red-500">*</span></span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
                          fill="none"
                              stroke="currentColor" 
                          viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('believe_in_dargah_fatiha_niyah');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'believe_in_dargah_fatiha_niyah' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Do you believe in visiting dargahs, offering fatiha, or making niyah?
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                        </label>
                        <MultiSelectPills
                          name="believe_in_dargah_fatiha_niyah"
                          values={profileData.believe_in_dargah_fatiha_niyah || []}
                          onChange={handleMultiSelectChange}
                          options={dargahOptions}
                          error={formErrors.believe_in_dargah_fatiha_niyah}
                        />
                      </div>

                      {/* Hijab/Niqab Preference (only for females) */}
                      {profileData.gender === "female" && (
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <span>Hijab/Niqab Preference? <span className="text-red-500">*</span></span>
                            <div className="group relative tooltip-container">
                              <svg 
                                className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTooltipClick('hijab_niqab_prefer');
                                }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'hijab_niqab_prefer' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                Do you prefer to wear hijab or niqab?
                                <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </label>
                          <RadioGroup
                            name="hijab_niqab_prefer"
                            value={profileData.hijab_niqab_prefer}
                            onChange={(e) => handleFieldChange("hijab_niqab_prefer", e.target.value)}
                            options={yesNoOptions}
                            error={formErrors.hijab_niqab_prefer}
                          />
                        </div>
                      )}
                    </div>
              </div>

                  {/* Navigation Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center pt-8 border-t border-gray-200">
                    {/* Back Button */}
                <button
                  onClick={() =>
                    navigate(
                      "/memstepone",
                      member_id
                        ? {
                            state: {
                              username: "memberCreation",
                              age: 30,
                              member_id,
                            },
                          }
                        : {
                            state: { username: "", age: 30 },
                          }
                    )
                  }
                      type="button"
                      className="group w-full sm:w-auto bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transform hover:scale-[1.02] transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center space-x-2 min-h-[48px]"
                    >
                      <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="text-sm sm:text-base">Back</span>
                </button>
                    
                    {/* Next Step Button */}
                <button
                      onClick={naviagteNextStep}
                  type="button"
                      className="group w-full sm:w-auto bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#F971BC] hover:to-[#DA73AD] transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 min-h-[48px] relative overflow-hidden"
                    >
                      {/* Gradient overlay for hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#F971BC] to-[#DA73AD] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      
                      <span className="relative text-sm sm:text-base font-medium">Next Step</span>
                      <svg className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemStepTwo;