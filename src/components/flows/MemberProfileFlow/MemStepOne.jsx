import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { updateDataReturnId, updatePostDataReturnId } from "../../../apiUtils";
import TopBar from "../../sections/TopBar";
import Sidebar from "../../sections/Sidebar";
import ProfileSection from "../../sections/ProfileSection";
import { fetchDataObjectV2 } from "../../../apiUtils";
import StepTracker from "../../StepTracker/StepTracker";
import findUser from "../../../images/findUser.svg";
import { useLocation } from "react-router-dom";

const MemStepOne = () => {
  const navigate = useNavigate();
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  let [userId] = useState(localStorage.getItem("userId"));
  const [formErrors, setFormErrors] = useState({});
  const [setErrors, setsetErrors] = useState({});
  const [member_id, setmemErrors] = useState({});
  const location = useLocation();
  const { username, age } = location.state || {};
  console.log(username, ">>>>>>>");
  userId =
    username == "memberCreation" ? localStorage.getItem("member_id") : userId;

  useEffect(() => {
    if (userId) {
      const parameter = {
        url: `/api/user/${userId}/`,
        setterFunction: setApiData,
        setLoading: setLoading,
        setErrors: setsetErrors,
      };
      fetchDataObjectV2(parameter);
    }
  }, [userId]);

  useEffect(() => {
    if (apiData) {
      setProfileData({
        first_name: apiData.first_name || null,
        last_name: apiData.last_name || null,
        dob: apiData.dob || null,
        gender: apiData.gender || null,
        marital_status: apiData.martial_status || null,
        dob: apiData.dob || null,
        city: apiData.city || false,
        state: apiData.state || false,
        country: apiData.country || null,
        native_country: apiData.native_country || null,
        native_city: apiData.native_city || null,
        native_state: apiData.native_state || null,
        Education: apiData.Education || null,
        profession: apiData.profession || null,
        native_city: apiData.native_city || null,
        native_state: apiData.native_state || null,
        Education: apiData.Education || null,
        profession: apiData.profession || null,
        describe_job_business: apiData.describe_job_business || null,
        disability: apiData.disability || null,
        percentage: apiData.percentage || null,
        weight: apiData.weight || null,
        hieght: apiData.hieght || null,
        type_of_disability: apiData.type_of_disability,
        incomeRange: apiData.income,
        about_you: apiData.about_you,
      });
    }
  }, [apiData]);

  const naviagteNextStep = () => {
    if (handleValidForm()) {
      console.log(profileData.hieght, "valid");
      let mem = {};
      if (username == "memberCreation") {
        mem = {
          agent_id: localStorage.getItem("userId") || "",
          confirm_password: profileData.confirm_password || "",
          password: profileData.password || "",
          email: profileData.email || "",
        };
      }

      const parameters = {
        url:
          username == "memberCreation"
            ? localStorage.getItem("member_id")
              ? `/api/user/${userId}/`
              : "/api/user/"
            : `/api/user/${userId}/`,
        payload: {
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          dob: profileData.dob,
          gender: profileData.gender,
          martial_status: profileData.marital_status,
          city: profileData.city,
          state: profileData.state,
          country: profileData.country,
          native_country: profileData.native_country,
          native_city: profileData.native_city,
          native_state: profileData.native_state,
          Education: profileData.Education,
          profession: profileData.profession,
          describe_job_business: profileData.describe_job_business,
          about_you: profileData.about_you,
          disability: profileData.disability,
          type_of_disability: profileData.type_of_disability,
          income: profileData.income,
          hieght: profileData.hieght,
          weight: profileData.weight,
          income: profileData.incomeRange,
          ...mem,
        },
        navigate: navigate,
        useracreate: "memberCreation",
        navUrl: `/memsteptwo`,
        setErrors: setsetErrors,
      };
      if (username == "memberCreation") {
        if (localStorage.getItem("member_id")) {
          updateDataReturnId(parameters);
        } else {
          updatePostDataReturnId(parameters);
        }
      } else {
        updateDataReturnId(parameters);
      }
    }
  };

  const handleFieldChange = (field, value) => {
    console.log(field, value, ">>>>>");

    setProfileData((prevState) => ({
      ...prevState,
      [field]: value,
    }));

    if (formErrors[field]) {
      setFormErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleValidForm = () => {
    const newErrors = {};

    // Regex patterns for validation
    const nameRegex = /^[A-Za-z]+$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
    const numberRegex = /^\d+$/; // Only numbers
    const heightWeightRegex = /^\d{1,3}(\.\d{1,3})?$/; // limit 3

    // Validate First Name
    if (!profileData.first_name?.trim()) {
      newErrors.first_name = "First Name is required";
    } else if (!nameRegex.test(profileData.first_name)) {
      newErrors.first_name = "First Name should contain only letters";
    }

    // Validate Last Name
    if (!profileData.last_name?.trim()) {
      newErrors.last_name = "Last Name is required";
    } else if (!nameRegex.test(profileData.last_name)) {
      newErrors.last_name = "Last Name should contain only letters";
    }

    // Validate Gender
    if (!profileData.gender) {
      newErrors.gender = "Gender is required";
    }

    // Validate Date of Birth
    if (!profileData.dob) {
      newErrors.dob = "Date of Birth is required";
    } else if (!dateRegex.test(profileData.dob)) {
      newErrors.dob = "Invalid date format (YYYY-MM-DD)";
    }

    // Validate Marital Status
    if (!profileData.marital_status) {
      newErrors.marital_status = "Marital Status is required";
    }

    // Validate City
    if (!profileData.city) {
      newErrors.city = "City is required";
    }

    // Validate State
    if (!profileData.state) {
      newErrors.state = "State is required";
    }

    // Validate Country
    if (!profileData.country) {
      newErrors.country = "Country is required";
    }

    // Validate Native City
    if (!profileData.native_city) {
      newErrors.native_city = "Native City is required";
    }

    // Validate Native State
    if (!profileData.native_state) {
      newErrors.native_state = "Native State is required";
    }

    // Validate Native Country
    if (!profileData.native_country) {
      newErrors.native_country = "Native Country is required";
    }

    // Validate Education
    if (!profileData.Education) {
      newErrors.Education = "Education is required";
    }

    // Validate Profession
    if (!profileData.profession) {
      newErrors.profession = "Profession is required";
    }

    // Validate Disability
    if (!profileData.disability) {
      newErrors.disability = "Disability status is required";
    }

    // Validate About You
    if (!profileData.describe_job_business?.trim()) {
      newErrors.describe_job_business = "Please describe your job/business";
    }

    // Validate Income Range
    if (!profileData.incomeRange) {
      newErrors.incomeRange = "Income Range is required";
    }

    if (
      profileData.disability === "yes" &&
      !profileData.type_of_disability?.trim()
    ) {
      newErrors.type_of_disability = "Please specify the type of disability";
    }

    // Validate Cultural Background
    if (!profileData.about_you?.trim()) {
      newErrors.about_you = "Personal Values/About You is required";
    }

    console.log("newErrors", newErrors);

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    gender: "",
    marital_status: "",
    city: "",
    state: "",
    country: "",
    native_city: "",
    native_state: "",
    native_country: "",
    Education: "",
    profession: "",
    disability_type: "",
    disability: "",
    describe_job_business: "",
    incomeRange: "",
    about_you: "",
    height: "",
    weight: "",
  });

  const marital_statuses = [
    { value: "Unmarried", label: "Unmarried" },
    { value: "Married", label: "Married" },
    { value: "Divorced", label: "Divorced" },
    { value: "Widowed", label: "Widowed" },
  ];

  const genders = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const countries = [
    { value: "india", label: "India" },
    { value: "usa", label: "USA" },
    { value: "canada", label: "Canada" },
    { value: "australia", label: "Australia" },
    { value: "uk", label: "UK" },
    { value: "china", label: "China" },
    { value: "japan", label: "Japan" },
    { value: "germany", label: "Germany" },
    { value: "france", label: "France" },
    { value: "italy", label: "Italy" },
    { value: "brazil", label: "Brazil" },
    { value: "south_africa", label: "South Africa" },
    { value: "russia", label: "Russia" },
    { value: "mexico", label: "Mexico" },
    { value: "new_zealand", label: "New Zealand" },
  ];

  const citys = [
    { value: "mumbai", label: "Mumbai" },
    { value: "delhi", label: "Delhi" },
    { value: "bangalore", label: "Bangalore" },
    { value: "hyderabad", label: "Hyderabad" },
    { value: "chennai", label: "Chennai" },
    { value: "kolkata", label: "Kolkata" },
    { value: "pune", label: "Pune" },
    { value: "ahmedabad", label: "Ahmedabad" },
    { value: "jaipur", label: "Jaipur" },
    { value: "lucknow", label: "Lucknow" },
  ];

  const statues = [
    { value: "andhra_pradesh", label: "Andhra Pradesh" },
    { value: "arunachal_pradesh", label: "Arunachal Pradesh" },
    { value: "assam", label: "Assam" },
    { value: "bihar", label: "Bihar" },
    { value: "chhattisgarh", label: "Chhattisgarh" },
    { value: "goa", label: "Goa" },
    { value: "gujarat", label: "Gujarat" },
    { value: "haryana", label: "Haryana" },
    { value: "himachal_pradesh", label: "Himachal Pradesh" },
    { value: "jharkhand", label: "Jharkhand" },
    { value: "karnataka", label: "Karnataka" },
    { value: "kerala", label: "Kerala" },
    { value: "madhya_pradesh", label: "Madhya Pradesh" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "manipur", label: "Manipur" },
    { value: "meghalaya", label: "Meghalaya" },
    { value: "mizoram", label: "Mizoram" },
    { value: "nagaland", label: "Nagaland" },
    { value: "odisha", label: "Odisha" },
    { value: "punjab", label: "Punjab" },
    { value: "rajasthan", label: "Rajasthan" },
    { value: "sikkim", label: "Sikkim" },
    { value: "tamil_nadu", label: "Tamil Nadu" },
    { value: "telangana", label: "Telangana" },
    { value: "tripura", label: "Tripura" },
    { value: "uttar_pradesh", label: "Uttar Pradesh" },
    { value: "uttarakhand", label: "Uttarakhand" },
    { value: "west_bengal", label: "West Bengal" },
  ];

  const Professions = [
    { value: "engineer", label: "Engineer" },
    { value: "doctor", label: "Doctor" },
    { value: "teacher", label: "Teacher" },
    { value: "lawyer", label: "Lawyer" },
    { value: "artist", label: "Artist" },
  ];

  const educationLevels = [
    { value: "primary", label: "Primary" },
    { value: "secondary", label: "Secondary" },
    { value: "highschool", label: "High School" },
    { value: "undergraduate", label: "Undergraduate" },
    { value: "postgraduate", label: "Postgraduate" },
    { value: "doctorate", label: "Doctorate" },
  ];

  const Dropdown = ({ options, name, value, onChange }) => {
    return (
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full h-12 px-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-sm font-medium"
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  };

  const [showTooltip, setShowTooltip] = useState(null);

  const handleTooltipClick = (field) => {
    setShowTooltip(field);
  };

  const handleTooltipLeave = () => {
    setShowTooltip(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
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
            <StepTracker percentage={25} />
          </div>

          {/* Desktop and Form Container */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Step Tracker - Professional sidebar layout */}
            <div className="lg:block hidden">
            <StepTracker percentage={25} />
          </div>

            {/* Main Form Container */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex-1">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm font-medium uppercase tracking-wide">
                    Step 1 of 6
                  </p>
                  <h2 className="text-2xl font-bold text-white mt-1">
                    Personal Details
                  </h2>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <form className="space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
                      Basic Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>First Name <span className="text-red-500">*</span></span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTooltipClick('first_name');
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'first_name' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            Enter your first name as it appears on official documents
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </label>
                    <input
                      type="text"
                      value={profileData.first_name || ""}
                          onChange={(e) => handleFieldChange("first_name", e.target.value)}
                          className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium ${
                          formErrors.first_name
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                          }`}
                          placeholder="Enter your first name"
                        />
                  {formErrors.first_name && (
                        <p className="text-red-500 text-sm">{formErrors.first_name}</p>
                  )}
                </div>

                {/* Last Name */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>Last Name <span className="text-red-500">*</span></span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTooltipClick('last_name');
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'last_name' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            Enter your last name as it appears on official documents
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </label>
                    <input
                      type="text"
                      value={profileData.last_name || ""}
                          onChange={(e) => handleFieldChange("last_name", e.target.value)}
                          className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium ${
                        formErrors.last_name
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                          }`}
                          placeholder="Enter your last name"
                        />
                  {formErrors.last_name && (
                        <p className="text-red-500 text-sm">{formErrors.last_name}</p>
                  )}
              </div>

                {/* Date of Birth */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>Date of Birth <span className="text-red-500">*</span></span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTooltipClick('dob');
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'dob' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            Select your date of birth (DD-MM-YYYY format)
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </label>
                    <input
                      type="date"
                      value={profileData.dob || ""}
                      onChange={(e) => handleFieldChange("dob", e.target.value)}
                          className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium ${
                            formErrors.dob
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                          }`}
                        />
                  {formErrors.dob && (
                        <p className="text-red-500 text-sm">{formErrors.dob}</p>
                  )}
                </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>Gender <span className="text-red-500">*</span></span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTooltipClick('gender');
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'gender' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            Select your gender from the dropdown
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </label>
                    <Dropdown
                      options={genders}
                      name="gender"
                      value={profileData.gender}
                        onChange={(e) => handleFieldChange("gender", e.target.value)}
                      />
                  {formErrors.gender && (
                        <p className="text-red-500 text-sm">{formErrors.gender}</p>
                  )}
              </div>

                    {/* Marital Status */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>Marital Status <span className="text-red-500">*</span></span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTooltipClick('marital_status');
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'marital_status' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            Select your current marital status
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </label>
                    <Dropdown
                      options={marital_statuses}
                      name="marital_status"
                      value={profileData.marital_status}
                        onChange={(e) => handleFieldChange("marital_status", e.target.value)}
                    />
                      {formErrors.marital_status && (
                        <p className="text-red-500 text-sm">{formErrors.marital_status}</p>
                      )}
                  </div>
                    </div>
                  </div>

                {/* Address Section */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
                      Current Address
                    </h3>
                </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* City */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>City <span className="text-red-500">*</span></span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTooltipClick('city');
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'city' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            Select your current city of residence
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </label>
                      <Dropdown
                        options={citys}
                        name="city"
                        value={profileData.city}
                        onChange={(e) => handleFieldChange("city", e.target.value)}
                      />
                      {formErrors.city && (
                        <p className="text-red-500 text-sm">{formErrors.city}</p>
                      )}
                    </div>

                    {/* State */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>State <span className="text-red-500">*</span></span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTooltipClick('state');
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'state' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            Select your current state/province
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </label>
                      <Dropdown
                        options={statues}
                        name="state"
                        value={profileData.state}
                        onChange={(e) => handleFieldChange("state", e.target.value)}
                      />
                      {formErrors.state && (
                        <p className="text-red-500 text-sm">{formErrors.state}</p>
                      )}
                    </div>

                    {/* Country */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>Country <span className="text-red-500">*</span></span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTooltipClick('country');
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'country' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            Select your current country of residence
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </label>
                      <Dropdown
                        options={countries}
                        name="country"
                        value={profileData.country}
                        onChange={(e) => handleFieldChange("country", e.target.value)}
                      />
                      {formErrors.country && (
                        <p className="text-red-500 text-sm">{formErrors.country}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Native Place Section */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</span>
                      Native Place
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Native City */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>Native City <span className="text-red-500">*</span></span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTooltipClick('native_city');
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'native_city' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            Select your native/original city
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </label>
                      <Dropdown
                        options={citys}
                        name="native_city"
                        value={profileData.native_city}
                        onChange={(e) => handleFieldChange("native_city", e.target.value)}
                      />
                      {formErrors.native_city && (
                        <p className="text-red-500 text-sm">{formErrors.native_city}</p>
                      )}
                    </div>

                    {/* Native State */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>Native State <span className="text-red-500">*</span></span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTooltipClick('native_state');
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'native_state' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            Select your native/original state
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </label>
                      <Dropdown
                        options={statues}
                        name="native_state"
                        value={profileData.native_state}
                        onChange={(e) => handleFieldChange("native_state", e.target.value)}
                      />
                      {formErrors.native_state && (
                        <p className="text-red-500 text-sm">{formErrors.native_state}</p>
                      )}
                    </div>

                    {/* Native Country */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>Native Country <span className="text-red-500">*</span></span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTooltipClick('native_country');
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'native_country' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            Select your native/original country
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </label>
                      <Dropdown
                        options={countries}
                        name="native_country"
                        value={profileData.native_country}
                        onChange={(e) => handleFieldChange("native_country", e.target.value)}
                      />
                      {formErrors.native_country && (
                        <p className="text-red-500 text-sm">{formErrors.native_country}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Education & Profession Section */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">4</span>
                      Education & Profession
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Education */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>Education <span className="text-red-500">*</span></span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTooltipClick('education');
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'education' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            Select your highest education level
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </label>
                      <Dropdown
                        options={educationLevels}
                        name="Education"
                        value={profileData.Education}
                        onChange={(e) => handleFieldChange("Education", e.target.value)}
                      />
                      {formErrors.Education && (
                        <p className="text-red-500 text-sm">{formErrors.Education}</p>
                      )}
                    </div>

                    {/* Profession */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>Profession <span className="text-red-500">*</span></span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTooltipClick('profession');
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'profession' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            Select your current profession or occupation
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </label>
                      <Dropdown
                        options={Professions}
                        name="profession"
                        value={profileData.profession}
                        onChange={(e) => handleFieldChange("profession", e.target.value)}
                      />
                      {formErrors.profession && (
                        <p className="text-red-500 text-sm">{formErrors.profession}</p>
                      )}
                    </div>
                  </div>

                  {/* Job Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <span>Please describe your job/business <span className="text-red-500">*</span></span>
                      <div className="group relative tooltip-container">
                        <svg 
                          className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTooltipClick('describe_job_business');
                          }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'describe_job_business' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                          Provide a detailed description of your job role or business activities
                          <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </label>
                    <textarea
                      value={profileData.describe_job_business || ""}
                      onChange={(e) => handleFieldChange("describe_job_business", e.target.value)}
                      className={`w-full h-32 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium resize-none ${
                        formErrors.describe_job_business
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                      }`}
                      placeholder="Describe your job or business in detail..."
                    />
                  {formErrors.describe_job_business && (
                      <p className="text-red-500 text-sm">{formErrors.describe_job_business}</p>
                  )}
                </div>
              </div>

                {/* Personal Details Section */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">5</span>
                      Personal Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Disability */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>Disability (if any?) <span className="text-red-500">*</span></span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTooltipClick('disability');
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'disability' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            Select whether you have any disability or not
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </label>
                    <select
                      value={profileData.disability || ""}
                        onChange={(e) => handleFieldChange("disability", e.target.value)}
                        className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium ${
                            formErrors.disability
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                        }`}
                    >
                      <option value="">Select Disability Status</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  {formErrors.disability && (
                        <p className="text-red-500 text-sm">{formErrors.disability}</p>
                  )}
                </div>

                {/* Income Range */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>Income Range <span className="text-red-500">*</span></span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTooltipClick('incomeRange');
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'incomeRange' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            Select your monthly/annual income range
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </label>
                    <select
                      value={profileData.incomeRange || ""}
                        onChange={(e) => handleFieldChange("incomeRange", e.target.value)}
                        className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium ${
                            formErrors.incomeRange
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                        }`}
                    >
                      <option value="">Select Income Range</option>
                      <option value="below_10k">Below 10,000</option>
                      <option value="10k_to_50k">10,000 - 50,000</option>
                      <option value="50k_to_1lac">50,000 - 1,00,000</option>
                      <option value="above_1lac">Above 1,00,000</option>
                    </select>
                  {formErrors.incomeRange && (
                        <p className="text-red-500 text-sm">{formErrors.incomeRange}</p>
                  )}
                </div>

                    {/* Height */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        Height (M)
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTooltipClick('hieght');
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-10 ${showTooltip === 'hieght' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            Enter your height in meters (e.g., 1.75)
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </label>
                      <input
                        type="text"
                        value={profileData?.hieght || ""}
                        onChange={(e) => handleFieldChange("hieght", e.target.value)}
                        className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium ${
                          formErrors.hieght
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                        }`}
                        placeholder="Enter height in meters"
                      />
                      {formErrors.height && (
                        <p className="text-red-500 text-sm">{formErrors.height}</p>
                      )}
                    </div>

                    {/* Weight */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        Weight (Kg)
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTooltipClick('weight');
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-10 ${showTooltip === 'weight' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            Enter your weight in kilograms (e.g., 70)
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </label>
                      <input
                        type="text"
                        value={profileData?.weight || ""}
                        onChange={(e) => handleFieldChange("weight", e.target.value)}
                        className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium ${
                          formErrors.weight
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                        }`}
                        placeholder="Enter weight in kg"
                      />
                      {formErrors.weight && (
                        <p className="text-red-500 text-sm">{formErrors.weight}</p>
                      )}
                    </div>
                  </div>

                  {/* Disability Type */}
                  {profileData.disability === "yes" && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        What type of disability? <span className="text-red-500">*</span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTooltipClick('type_of_disability');
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-10 ${showTooltip === 'type_of_disability' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            Please describe the type and nature of your disability
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </label>
                      <textarea
                        value={profileData.type_of_disability || ""}
                        onChange={(e) => handleFieldChange("type_of_disability", e.target.value)}
                        className={`w-full h-32 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium resize-none ${
                          formErrors.type_of_disability
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                        }`}
                        placeholder="Please describe the type of disability..."
                      />
                      {formErrors.type_of_disability && (
                        <p className="text-red-500 text-sm">{formErrors.type_of_disability}</p>
                      )}
                    </div>
                  )}

                  {/* About You */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      Personal Values/About You <span className="text-red-500">*</span>
                      <div className="group relative tooltip-container">
                        <svg 
                          className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTooltipClick('about_you');
                          }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-10 ${showTooltip === 'about_you' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                          Share your values, interests, and what you're looking for
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </label>
                    <textarea
                      value={profileData.about_you || ""}
                      onChange={(e) => handleFieldChange("about_you", e.target.value)}
                      className={`w-full h-32 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium resize-none ${
                        formErrors.about_you
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                      }`}
                      placeholder="Tell us about yourself, your values, and what you're looking for..."
                    />
                    {formErrors.about_you && (
                      <p className="text-red-500 text-sm">{formErrors.about_you}</p>
                    )}
                  </div>
                </div>

                {/* Member Creation Fields */}
                {username === "memberCreation" && (
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">6</span>
                        Account Details
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Email */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          Email <span className="text-red-500">*</span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('email');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-10 ${showTooltip === 'email' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Enter a valid email address for account creation
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <input
                          type="email"
                          value={profileData?.email || ""}
                          onChange={(e) => handleFieldChange("email", e.target.value)}
                          className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium ${
                            formErrors.email
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                          }`}
                          placeholder="Enter your email address"
                        />
                        {formErrors.email && (
                          <p className="text-red-500 text-sm">{formErrors.email}</p>
                        )}
                      </div>

                      {/* Password */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          Password <span className="text-red-500">*</span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('password');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-10 ${showTooltip === 'password' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Create a strong password (min 8 characters)
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <input
                          type="password"
                          value={profileData?.password || ""}
                          onChange={(e) => handleFieldChange("password", e.target.value)}
                          className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-sm font-medium"
                          placeholder="Enter your password"
                        />
                        {formErrors.password && (
                          <p className="text-red-500 text-sm">{formErrors.password}</p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          Confirm Password <span className="text-red-500">*</span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('confirm_password');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-10 ${showTooltip === 'confirm_password' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Re-enter your password to confirm
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <input
                          type="password"
                          value={profileData?.confirm_password || ""}
                          onChange={(e) => handleFieldChange("confirm_password", e.target.value)}
                          className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200 text-sm font-medium"
                          placeholder="Confirm your password"
                        />
                        {formErrors.confirm_password && (
                          <p className="text-red-500 text-sm">{formErrors.confirm_password}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end pt-8 border-t border-gray-200">
                <button
                  onClick={naviagteNextStep}
                  type="button"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <span>Next Step</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default MemStepOne;
