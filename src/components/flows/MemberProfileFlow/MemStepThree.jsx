import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { updateDataV2 } from "../../../apiUtils";
import { useParams } from "react-router-dom";
import StepTracker from "../../StepTracker/StepTracker";
import { fetchDataObjectV2 } from "../../../apiUtils";

const MemStepThree = () => {
  const navigate = useNavigate();
  const { userId: paramUserId } = useParams(); // Get userId from URL params
  
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [showTooltip, setShowTooltip] = useState(null);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState("");
  const [flag, setflag] = useState(false);

  // Parent Occupations dropdown options
  const ParentOccupations = [
    { value: "businessman", label: "Businessman" },
    { value: "businesswoman", label: "Businesswoman" },
    { value: "engineer", label: "Engineer" },
    { value: "doctor", label: "Doctor" },
    { value: "teacher", label: "Teacher" },
    { value: "lawyer", label: "Lawyer" },
    { value: "Government Employee", label: "Government Employee" },
    { value: "Private Employee", label: "Private Employee" },
    { value: "farmer", label: "Farmer" },
    { value: "shopkeeper", label: "Shopkeeper" },
    { value: "driver", label: "Driver" },
    { value: "homemaker", label: "Homemaker" },
    { value: "retired", label: "Retired" },
    { value: "Not Working", label: "Not Working" },
    { value: "other", label: "Other" }
  ];
  
  // Determine the correct userId - prioritize URL param, then member_id, then userId
  const currentUserId = paramUserId || localStorage.getItem("member_id") || userId;
  const [profileData, setProfileData] = useState({
    father_name: "",
    father_occupation: "",
    mother_name: "",
    mother_occupation: "",
    wali_name: "",
    wali_contact_number: "",
    wali_blood_relation: "",
    father_alive: "",
    mother_alive: "",
    number_of_children: null,
    number_of_brother: null,
    number_of_sister: null,
    number_of_son: null,
    number_of_daughter: null,
    number_of_siblings: null,
    number_of_brothers: null,
    number_of_sisters: null,
    step_father: "",
    step_mother: "",
    family_type: "",
    family_practicing_level: "",
    percentage: "",
    gender: "",
    martial_status: "",
    weight: "",
    hieght: "",
  });

  useEffect(() => {
    if (currentUserId) {
      const parameter = {
        url: `/api/user/${currentUserId}/`,
        setterFunction: setApiData,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataObjectV2(parameter);
    }
  }, [currentUserId]);

  // Tooltip click outside and escape key handling
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

  useEffect(() => {
    if (apiData) {
      setProfileData({
        percentage: apiData.profile_percentage || null,
        gender: apiData.gender || null,
        martial_status: apiData.martial_status || null,
        father_name: apiData.father_name || "",
        father_occupation: apiData.father_occupation || "",
        mother_name: apiData.mother_name || "",
        mother_occupation: apiData.mother_occupation || "",
        wali_name: apiData.wali_name || "",
        wali_contact_number: apiData.wali_contact_number || "",
        wali_blood_relation: apiData.wali_blood_relation || "",
        number_of_children: apiData.number_of_children || 0,
        number_of_siblings: apiData.number_of_siblings || 0,
        number_of_brothers: apiData.number_of_brothers || 0,
        number_of_sisters: apiData.number_of_sisters || 0,
        family_type: apiData.family_type || "",
        family_practicing_level: apiData.family_practicing_level || "",
        father_alive: apiData.father_alive,
        mother_alive: apiData.mother_alive,
        step_father: apiData.step_father,
        step_mother: apiData.step_mother,
      });
    }
  }, [apiData]);
  const handleTooltipClick = (field) => {
    setShowTooltip(showTooltip === field ? null : field);
  };

  const handleTooltipLeave = () => {
    setShowTooltip(null);
  };

  const validateForm = () => {
    const newErrors = {};

    // Regex pattern for name validation
    const nameRegex = /^[A-Za-z\s]+$/; // Allows letters and spaces

    // Validate required fields
    if (!profileData.father_name?.trim()) {
      newErrors.father_name = "Father's name is required";
    } else if (!nameRegex.test(profileData.father_name)) {
      newErrors.father_name = "Father's name should contain only letters and spaces";
    }
    if (!profileData.mother_name?.trim()) {
      newErrors.mother_name = "Mother's name is required";
    } else if (!nameRegex.test(profileData.mother_name)) {
      newErrors.mother_name = "Mother's name should contain only letters and spaces";
    }
    if (!profileData.father_alive) {
      newErrors.father_alive = "Father's alive status is required";
    }
    if (!profileData.mother_alive) {
      newErrors.mother_alive = "Mother's alive status is required";
    }
    // Step father and step mother are now optional
    // if (!profileData.step_father) {
    //   newErrors.step_father = "Father's stepfather status is required";
    // }
    // if (!profileData.step_mother) {
    //   newErrors.step_mother = "Mother's stepmother status is required";
    // }
    // Family type and family practicing level are MANDATORY for profile completion
    if (!profileData.family_type) {
      newErrors.family_type = "Family type is required";
    }
    if (!profileData.family_practicing_level) {
      newErrors.family_practicing_level = "Family practicing level is required";
    }
    // Number of siblings is optional - not mandatory for profile completion
    // if (!profileData.number_of_siblings) {
    //   newErrors.number_of_siblings = "Number of siblings is required";
    // }
    if (profileData.number_of_siblings > 0) {
      const totalSiblings = Number(profileData.number_of_brothers || 0) + Number(profileData.number_of_sisters || 0);
      if (totalSiblings !== Number(profileData.number_of_siblings)) {
        newErrors.number_of_siblings = "Number of siblings doesn't match brothers + sisters";
      }
    }

    // if (profileData.number_of_children > 0) {
    //   const totalChildren = Number(profileData.number_of_son || 0) + Number(profileData.number_of_daughter || 0);
    //   if (totalChildren !== Number(profileData.number_of_children)) {
    //     newErrors.number_of_children = "Number of children doesn't match sons + daughters";
    //   }
    // }

    // Wali validation for females - NOW OPTIONAL (not mandatory for profile completion)
    // if (profileData.gender === "female") {
    //   if (!profileData.wali_name?.trim()) {
    //     newErrors.wali_name = "Wali name is required";
    //   } else if (!nameRegex.test(profileData.wali_name)) {
    //     newErrors.wali_name = "Wali name should contain only letters and spaces";
    //   }
    //   if (!profileData.wali_contact_number?.trim()) {
    //     newErrors.wali_contact_number = "Wali contact number is required";
    //   }
    //   if (!profileData.wali_blood_relation) {
    //     newErrors.wali_blood_relation = "Blood relation is required";
    //   }
    // }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleValidForm = () => {
    const newErrors = {};

    // Regex pattern for name validation
    const nameRegex = /^[A-Za-z\s]+$/; // Allows letters and spaces

    // Validate required fields
    if (!profileData.father_name?.trim()) {
      newErrors.father_name = "Father's name is required";
    } else if (!nameRegex.test(profileData.father_name)) {
      newErrors.father_name = "Father's name should contain only letters and spaces";
    }
    if (!profileData.mother_name?.trim()) {
      newErrors.mother_name = "Mother's name is required";
    } else if (!nameRegex.test(profileData.mother_name)) {
      newErrors.mother_name = "Mother's name should contain only letters and spaces";
    }
    if (!profileData.father_alive) {
      newErrors.father_alive = "Father's alive status is required";
    }
    if (!profileData.mother_alive) {
      newErrors.mother_alive = "Mother's alive status is required";
    }
    // Step father and step mother are now optional
    // if (!profileData.step_father) {
    //   newErrors.step_father = "Father's stepfather status is required";
    // }
    // if (!profileData.step_mother) {
    //   newErrors.step_mother = "Mother's stepmother status is required";
    // }
    // Family type and family practicing level are MANDATORY for profile completion
    if (!profileData.family_type) {
      newErrors.family_type = "Family type is required";
    }
    if (!profileData.family_practicing_level) {
      newErrors.family_practicing_level = "Family practicing level is required";
    }
    // Number of siblings is optional - not mandatory for profile completion
    // if (!profileData.number_of_siblings) {
    //   newErrors.number_of_siblings = "Number of siblings is required";
    // }
    if (profileData.number_of_siblings > 0) {
      const totalSiblings = Number(profileData.number_of_brothers || 0) + Number(profileData.number_of_sisters || 0);
      if (totalSiblings !== Number(profileData.number_of_siblings)) {
        newErrors.number_of_siblings = "Number of siblings doesn't match brothers + sisters";
      }
    }

    // if (profileData.number_of_children > 0) {
    //   const totalChildren = Number(profileData.number_of_son || 0) + Number(profileData.number_of_daughter || 0);
    //   if (totalChildren !== Number(profileData.number_of_children)) {
    //     newErrors.number_of_children = "Number of children doesn't match sons + daughters";
    //   }
    // }

    // Wali validation for females - NOW OPTIONAL (not mandatory for profile completion)
    // if (profileData.gender === "female") {
    //   if (!profileData.wali_name?.trim()) {
    //     newErrors.wali_name = "Wali name is required";
    //   } else if (!nameRegex.test(profileData.wali_name)) {
    //     newErrors.wali_name = "Wali name should contain only letters and spaces";
    //   }
    //   if (!profileData.wali_contact_number?.trim()) {
    //     newErrors.wali_contact_number = "Wali contact number is required";
    //   }
    //   if (!profileData.wali_blood_relation) {
    //     newErrors.wali_blood_relation = "Blood relation is required";
    //   }
    // }

    setFormErrors(newErrors);

    // Auto-scroll to first error field
    if (Object.keys(newErrors).length > 0) {
      const fieldOrder = [
        'father_name', 'mother_name', 'father_occupation', 'mother_occupation',
        'father_alive', 'mother_alive', 'step_father', 'step_mother',
        'family_type', 'family_practicing_level', 'number_of_siblings',
        'number_of_brothers', 'number_of_sisters', 'number_of_children', 'wali_name', 'wali_contact_number',
        'wali_blood_relation'
      ];

      const firstErrorField = fieldOrder.find(field => newErrors[field]);
      if (firstErrorField) {
        setTimeout(() => {
          const element = document.querySelector(`[name="${firstErrorField}"]`) ||
            document.querySelector(`input[name="${firstErrorField}"]`) ||
            document.querySelector(`select[name="${firstErrorField}"]`) ||
            document.querySelector(`textarea[name="${firstErrorField}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
          }
        }, 100);
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  const naviagteNextStep = () => {
    if (handleValidForm()) {
      const parameters = {
        url: `/api/user/${userId}`,
        payload: {
          father_name: profileData.father_name,
          father_occupation: profileData.father_occupation,
          mother_name: profileData.mother_name,
          mother_occupation: profileData.mother_occupation,
          wali_name: profileData.wali_name,
          wali_contact_number: profileData.wali_contact_number,
          wali_blood_relation: profileData.wali_blood_relation,
          number_of_children: profileData.number_of_children,
          // number_of_son: profileData.number_of_son,
          // number_of_daughter: profileData.number_of_daughter,
          number_of_siblings: profileData.number_of_siblings,
          number_of_brothers: profileData.number_of_brothers,
          number_of_sisters: profileData.number_of_sisters,
          family_type: profileData.family_type,
          family_practicing_level: profileData.family_practicing_level,
          father_alive: profileData.father_alive,
          mother_alive: profileData.mother_alive,
          step_father: profileData.step_father,
          step_mother: profileData.step_mother,
        },
        navigate: navigate,
        navUrl: `/memstepfour/${currentUserId}`,
        setErrors: setErrors,
      };
      updateDataV2(parameters);
    } else {
      console.log("Form has errors. Please fix them.");
    }
  };

  const updateField = (field, value) => {
    // Real-time filtering for name fields - only allow alphabets and spaces
    if (field === 'father_name' || field === 'mother_name' || field === 'wali_name') {
      // Only allow alphabets and spaces, remove numbers and symbols
      value = value.replace(/[^A-Za-z\s]/g, '');
    }

    setProfileData((prevState) => {
      const newState = {
        ...prevState,
        [field]: value,
      };

      // Reset brothers and sisters when siblings count changes
      if (field === 'number_of_siblings') {
        newState.number_of_brothers = "";
        newState.number_of_sisters = "";
      }

      // Auto-calculate siblings logic
      if (field === 'number_of_brothers' && prevState.number_of_siblings) {
        const totalSiblings = parseInt(prevState.number_of_siblings) || 0;
        const brothers = parseInt(value) || 0;
        const calculatedSisters = totalSiblings - brothers;
        if (calculatedSisters >= 0) {
          newState.number_of_sisters = calculatedSisters.toString();
        }
      } else if (field === 'number_of_sisters' && prevState.number_of_siblings) {
        const totalSiblings = parseInt(prevState.number_of_siblings) || 0;
        const sisters = parseInt(value) || 0;
        const calculatedBrothers = totalSiblings - sisters;
        if (calculatedBrothers >= 0) {
          newState.number_of_brothers = calculatedBrothers.toString();
        }
      }

      // // Auto-calculate children logic
      // if (field === 'number_of_son' && prevState.number_of_children) {
      //   const totalChildren = parseInt(prevState.number_of_children) || 0;
      //   const sons = parseInt(value) || 0;
      //   const calculatedDaughters = totalChildren - sons;
      //   if (calculatedDaughters >= 0) {
      //     newState.number_of_daughter = calculatedDaughters.toString();
      //   }
      // } else if (field === 'number_of_daughter' && prevState.number_of_children) {
      //   const totalChildren = parseInt(prevState.number_of_children) || 0;
      //   const daughters = parseInt(value) || 0;
      //   const calculatedSons = totalChildren - daughters;
      //   if (calculatedSons >= 0) {
      //     newState.number_of_son = calculatedSons.toString();
      //   }
      // }

      return newState;
    });

    if (formErrors[field]) {
      setFormErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Generate dynamic options based on siblings count
  const generateSiblingOptions = (maxCount) => {
    const options = [{ value: "", label: "Select Number" }];
    for (let i = 0; i <= maxCount; i++) {
      options.push({ value: i.toString(), label: i.toString() });
    }
    return options;
  };

  const skip = () => {
    if (
      profileData.father_name &&
      profileData.mother_name
      // number_of_siblings, family_type, and family_practicing_level are now optional
    ) {
      const hasSiblings =
        profileData.number_of_siblings > 0 &&
        profileData.number_of_brothers &&
        profileData.number_of_sisters;

      const isFemaleWithWali =
        profileData.gender === "female" &&
        profileData.wali_name &&
        profileData.wali_contact_number &&
        profileData.wali_blood_relation;

      const isMaritalStatusValid =
        ["Divorced", "Widowed"].includes(profileData.martial_status) ||
        (profileData.gender === "male" && profileData.martial_status === "Married") ||
        profileData.number_of_children > 0;

      const hasChildren =
        profileData.number_of_son && profileData.number_of_daughter;
      console.log(hasSiblings, hasChildren, isMaritalStatusValid);

      if (hasSiblings) {
        navigate(`/memstepfour/${currentUserId}`);
      } else if (isFemaleWithWali) {
        navigate(`/memstepfour/${currentUserId}`);
      } else if (isMaritalStatusValid && hasChildren) {
        navigate(`/memstepfour/${currentUserId}`);
      } else {
        setErrors(true);
        setMessage("Please Fill the required Field");
      }
    } else {
      setErrors(true);
      setMessage("Please Fill the required Field");
    }
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     setErrors(null);
  //   }, 5000);
  // }, [errors]);

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
            <StepTracker percentage={55} />
          </div>

          {/* Desktop and Form Container */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Step Tracker - Professional sidebar layout */}
            <div className="lg:block hidden">
              <StepTracker percentage={55} />
            </div>

            {/* Main Form Container */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex-1">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100 text-sm font-medium uppercase tracking-wide">
                      Step 3 of 6
                    </p>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      Family Background
                    </h2>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <form className="space-y-8">
                  {/* Family Information Section */}
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <span className="bg-[#FFC0E3] text-[#CB3B8B] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
                        Family Information
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">
                        Share details about your family to help us better understand your background and preferences
                      </p>
                    </div>

                    {/* Father's Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Father's Name <span className="text-red-500">*</span></span>
                          <div className="group relative tooltip-container">
                            <svg
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('father_name');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'father_name' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Enter your father's full name as it appears on official documents
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <input
                          type="text"
                          id="father_name"
                          name="father_name"
                          value={profileData.father_name || ""}
                          placeholder="Enter father's full name"
                          className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium ${formErrors.father_name
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                            }`}
                          onChange={(e) => updateField("father_name", e.target.value)}
                        />
                        {formErrors.father_name && (
                          <p className="text-red-500 text-sm">{formErrors.father_name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Father's Occupation</span>
                          <div className="group relative tooltip-container">
                            <svg
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('father_occupation');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'father_occupation' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Enter your father's current profession or job title
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <div className="relative">
                          <select
                            id="father_occupation"
                            name="father_occupation"
                            value={profileData.father_occupation || ""}
                            className="w-full h-12 px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CB3B8B] focus:border-[#CB3B8B] transition-all duration-200 text-sm font-medium appearance-none cursor-pointer"
                            onChange={(e) => updateField("father_occupation", e.target.value)}
                          >
                            <option value="">Select Father's Occupation</option>
                            {ParentOccupations.map((option) => (
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
                      </div>
                    </div>

                    {/* Mother's Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Mother's Name <span className="text-red-500">*</span></span>
                          <div className="group relative tooltip-container">
                            <svg
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('mother_name');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'mother_name' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Enter your mother's full name as it appears on official documents
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <input
                          type="text"
                          id="mother_name"
                          name="mother_name"
                          value={profileData.mother_name || ""}
                          placeholder="Enter mother's full name"
                          className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium ${formErrors.mother_name
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                            }`}
                          onChange={(e) => updateField("mother_name", e.target.value)}
                        />
                        {formErrors.mother_name && (
                          <p className="text-red-500 text-sm">{formErrors.mother_name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Mother's Occupation</span>
                          <div className="group relative tooltip-container">
                            <svg
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('mother_occupation');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'mother_occupation' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Enter your mother's current profession or job title
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <div className="relative">
                          <select
                            id="mother_occupation"
                            name="mother_occupation"
                            value={profileData.mother_occupation || ""}
                            className="w-full h-12 px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CB3B8B] focus:border-[#CB3B8B] transition-all duration-200 text-sm font-medium appearance-none cursor-pointer"
                            onChange={(e) => updateField("mother_occupation", e.target.value)}
                          >
                            <option value="">Select Mother's Occupation</option>
                            {ParentOccupations.map((option) => (
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
                      </div>
                    </div>

                    {/* Is Father Alive and Is Mother Alive */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Is Father Alive */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Is Father Alive? <span className="text-red-500">*</span></span>
                          <div className="group relative tooltip-container">
                            <svg
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('father_alive');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'father_alive' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Select whether your father is alive or not
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <div className="relative">
                          <select
                            id="father_alive"
                            name="father_alive"
                            value={profileData.father_alive || ""}
                            className={`w-full h-12 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium appearance-none cursor-pointer ${formErrors.father_alive
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                              }`}
                            onChange={(e) => updateField("father_alive", e.target.value)}
                          >
                            <option value="">Select Status</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {formErrors.father_alive && (
                          <p className="text-red-500 text-sm">{formErrors.father_alive}</p>
                        )}
                      </div>

                      {/* Is Mother Alive */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Is Mother Alive? <span className="text-red-500">*</span></span>
                          <div className="group relative tooltip-container">
                            <svg
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('mother_alive');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'mother_alive' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Select whether your mother is alive or not
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <div className="relative">
                          <select
                            id="mother_alive"
                            name="mother_alive"
                            value={profileData.mother_alive || ""}
                            className={`w-full h-12 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium appearance-none cursor-pointer ${formErrors.mother_alive
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                              }`}
                            onChange={(e) => updateField("mother_alive", e.target.value)}
                          >
                            <option value="">Select Status</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {formErrors.mother_alive && (
                          <p className="text-red-500 text-sm">{formErrors.mother_alive}</p>
                        )}
                      </div>
                    </div>

                    {/* Is Father a Stepfather and Is Mother a Stepmother - COMMENTED OUT FOR NOW */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span>Is Father a Stepfather?</span>
                    <div className="group relative tooltip-container">
                      <svg 
                        className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTooltipClick('step_father');
                        }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'step_father' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        Select whether your father is a stepfather or biological father
                        <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </label>
                  <div className="relative">
                    <select
                      id="step_father"
                      name="step_father"
                      value={profileData.step_father || ""}
                      className={`w-full h-12 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium appearance-none cursor-pointer ${
                        formErrors.step_father
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                      }`}
                      onChange={(e) => updateField("step_father", e.target.value)}
                    >
                      <option value="">Select Status</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {formErrors.step_father && (
                    <p className="text-red-500 text-sm">{formErrors.step_father}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <span>Is Mother a Stepmother?</span>
                    <div className="group relative tooltip-container">
                      <svg 
                        className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTooltipClick('step_mother');
                        }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'step_mother' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        Select whether your mother is a stepmother or biological mother
                        <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </label>
                  <div className="relative">
                    <select
                      id="step_mother"
                      name="step_mother"
                      value={profileData.step_mother || ""}
                      className={`w-full h-12 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium appearance-none cursor-pointer ${
                        formErrors.step_mother
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                      }`}
                      onChange={(e) => updateField("step_mother", e.target.value)}
                    >
                      <option value="">Select Status</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {formErrors.step_mother && (
                    <p className="text-red-500 text-sm">{formErrors.step_mother}</p>
                  )}
                </div>
              </div> */}

                    {/* Family Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Number of Siblings</span>
                          <div className="group relative tooltip-container">
                            <svg
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('number_of_siblings');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'number_of_siblings' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Total number of brothers and sisters you have
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <div className="relative">
                          <select
                            id="number_of_siblings"
                            name="number_of_siblings"
                            value={profileData.number_of_siblings || ""}
                            className={`w-full h-12 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium appearance-none cursor-pointer ${formErrors.number_of_siblings
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                              }`}
                            onChange={(e) => updateField("number_of_siblings", e.target.value)}
                          >
                            <option value="">Select Number</option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="10+">10+</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {formErrors.number_of_siblings && (
                          <p className="text-red-500 text-sm">{formErrors.number_of_siblings}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Family Type</span>
                          <div className="group relative tooltip-container">
                            <svg
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('family_type');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'family_type' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Select the type of family structure you belong to
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <div className="relative">
                          <select
                            id="family_type"
                            name="family_type"
                            value={profileData.family_type || ""}
                            className={`w-full h-12 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium appearance-none cursor-pointer ${formErrors.family_type
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                              }`}
                            onChange={(e) => updateField("family_type", e.target.value)}
                          >
                            <option value="">Select Family Type</option>
                            <option value="Nuclear Family">Nuclear Family</option>
                            <option value="Joint Family">Joint Family</option>
                            <option value="Extended Family">Extended Family</option>
                            <option value="Single-Parent Family">Single-Parent Family</option>
                            <option value="Blended Family">Blended Family</option>
                            <option value="Living Alone">Living Alone</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {formErrors.family_type && (
                          <p className="text-red-500 text-sm">{formErrors.family_type}</p>
                        )}
                      </div>
                    </div>

                    {/* Conditional Siblings Details */}
                    {profileData.number_of_siblings > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <span>Number of Brothers <span className="text-red-500">*</span></span>
                            <div className="group relative tooltip-container">
                              <svg
                                className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTooltipClick('number_of_brothers');
                                }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'number_of_brothers' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                Number of brothers you have
                                <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </label>
                          <div className="relative">
                            <select
                              id="number_of_brothers"
                              name="number_of_brothers"
                              value={profileData.number_of_brothers || ""}
                              className={`w-full h-12 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium appearance-none ${!profileData.number_of_siblings
                                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                                  : "cursor-pointer"
                                } ${formErrors.number_of_brothers
                                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                                }`}
                              onChange={(e) => updateField("number_of_brothers", e.target.value)}
                              disabled={!profileData.number_of_siblings}
                            >
                              {generateSiblingOptions(parseInt(profileData.number_of_siblings) || 0).map((option) => (
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
                          {formErrors.number_of_brothers && (
                            <p className="text-red-500 text-sm">{formErrors.number_of_brothers}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <span>Number of Sisters <span className="text-red-500">*</span></span>
                            <div className="group relative tooltip-container">
                              <svg
                                className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTooltipClick('number_of_sisters');
                                }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'number_of_sisters' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                Number of sisters you have
                                <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          </label>
                          <div className="relative">
                            <select
                              id="number_of_sisters"
                              name="number_of_sisters"
                              value={profileData.number_of_sisters || ""}
                              className={`w-full h-12 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium appearance-none ${!profileData.number_of_siblings
                                  ? "cursor-not-allowed bg-gray-100 text-gray-400"
                                  : "cursor-pointer"
                                } ${formErrors.number_of_sisters
                                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                                }`}
                              onChange={(e) => updateField("number_of_sisters", e.target.value)}
                              disabled={!profileData.number_of_siblings}
                            >
                              {generateSiblingOptions(parseInt(profileData.number_of_siblings) || 0).map((option) => (
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
                          {formErrors.number_of_sisters && (
                            <p className="text-red-500 text-sm">{formErrors.number_of_sisters}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Family Practicing Level */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Family Practicing Level</span>
                          <div className="group relative tooltip-container">
                            <svg
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('family_practicing_level');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'family_practicing_level' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Select your family's religious or spiritual orientation and practice level
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <div className="relative">
                          <select
                            id="family_practicing_level"
                            name="family_practicing_level"
                            value={profileData.family_practicing_level || ""}
                            className={`w-full h-12 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium appearance-none cursor-pointer ${formErrors.family_practicing_level
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                              }`}
                            onChange={(e) => updateField("family_practicing_level", e.target.value)}
                          >
                            <option value="">Select Practicing Level</option>
                            <option value="Devout">Devout</option>
                            <option value="Very Religious">Very Religious</option>
                            <option value="Religious">Religious</option>
                            <option value="Moderately Religious">Moderately Religious</option>
                            <option value="Occasionally Religious">Occasionally Religious</option>
                            <option value="Cultural but non-practicing">Cultural but non-practicing</option>
                            <option value="Spiritual but not religious">Spiritual but not religious</option>
                            <option value="Religious but not practicing">Religious but not practicing</option>
                            <option value="Open to exploring religion">Open to exploring religion</option>
                            <option value="Agnostic">Agnostic</option>
                            <option value="Atheist">Atheist</option>
                            <option value="Secular">Secular</option>
                            <option value="Open to all beliefs">Open to all beliefs</option>
                            <option value="Not religious">Not religious</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {formErrors.family_practicing_level && (
                          <p className="text-red-500 text-sm">{formErrors.family_practicing_level}</p>
                        )}
                      </div>

                      {/* Conditional Children Field - For Divorced/Widowed and Married Males */}
                      {((profileData.martial_status === "Divorced" || profileData.martial_status === "divorced" || profileData.martial_status === "Widowed" || profileData.martial_status === "widowed" || profileData.martial_status === "Khula" || profileData.martial_status === "khula") ||
                        (profileData.gender === "male" && (profileData.martial_status === "Married" || profileData.martial_status === "married"))) && (
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <span>Number of Children <span className="text-red-500">*</span></span>
                              <div className="group relative tooltip-container">
                                <svg
                                  className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTooltipClick('number_of_children');
                                  }}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'number_of_children' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                  Total number of children from previous marriage
                                  <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                </div>
                              </div>
                            </label>
                            <div className="relative">
                              <select
                                id="number_of_children"
                                name="number_of_children"
                                value={profileData.number_of_children || ""}
                                className={`w-full h-12 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium appearance-none cursor-pointer ${formErrors.number_of_children
                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                                  }`}
                                onChange={(e) => updateField("number_of_children", e.target.value)}
                              >
                                <option value="">Select Number</option>
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="10+">10+</option>
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                            {formErrors.number_of_children && (
                              <p className="text-red-500 text-sm">{formErrors.number_of_children}</p>
                            )}
                          </div>
                        )}
                    </div>



                    {/* Wali Information (for females) */}
                    {profileData.gender === "female" && (
                      <div className="mb-6">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">Wali Information</h3>
                          <p className="text-sm text-gray-600">Please provide your Wali's details for marriage purposes</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <span>Wali Name</span>
                              <div className="group relative tooltip-container">
                                <svg
                                  className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTooltipClick('wali_name');
                                  }}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'wali_name' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                  Enter your Wali's full name (guardian for marriage)
                                  <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                </div>
                              </div>
                            </label>
                            <input
                              type="text"
                              id="wali_name"
                              name="wali_name"
                              value={profileData.wali_name || ""}
                              placeholder="Enter wali's full name"
                              className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium ${formErrors.wali_name
                                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                                }`}
                              onChange={(e) => updateField("wali_name", e.target.value)}
                            />
                            {formErrors.wali_name && (
                              <p className="text-red-500 text-sm">{formErrors.wali_name}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <span>Wali Contact Number</span>
                              <div className="group relative tooltip-container">
                                <svg
                                  className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTooltipClick('wali_contact_number');
                                  }}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'wali_contact_number' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                  Enter your Wali's contact number
                                  <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                </div>
                              </div>
                            </label>
                            <input
                              type="tel"
                              id="wali_contact_number"
                              name="wali_contact_number"
                              value={profileData.wali_contact_number || ""}
                              placeholder="Enter wali's phone number"
                              className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium ${formErrors.wali_contact_number
                                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                  : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                                }`}
                              onChange={(e) => updateField("wali_contact_number", e.target.value)}
                            />
                            {formErrors.wali_contact_number && (
                              <p className="text-red-500 text-sm">{formErrors.wali_contact_number}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                              <span>Blood Relation</span>
                              <div className="group relative tooltip-container">
                                <svg
                                  className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTooltipClick('wali_blood_relation');
                                  }}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'wali_blood_relation' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                  Select your relationship with the Wali
                                  <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                </div>
                              </div>
                            </label>
                            <div className="relative">
                              <select
                                id="wali_blood_relation"
                                name="wali_blood_relation"
                                value={profileData.wali_blood_relation || ""}
                                className={`w-full h-12 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium appearance-none cursor-pointer ${formErrors.wali_blood_relation
                                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                    : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                                  }`}
                                onChange={(e) => updateField("wali_blood_relation", e.target.value)}
                              >
                                <option value="">Select Relation</option>
                                <option value="Father">Father</option>
                                <option value="Brother">Brother</option>
                                <option value="Son">Son</option>

                                <option value="Grandfather">Grandfather</option>
                                <option value="Father-in-law">Maternal Uncle</option>
                                <option value="Brother-in-law">Paternal Uncle</option>
                                <option value="Son-in-law">Grandsons</option>
                                <option value="Male Guardian">Male Guardian</option>
                                <option value="Other">Other</option>
                              </select>
                              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                            {formErrors.wali_blood_relation && (
                              <p className="text-red-500 text-sm">{formErrors.wali_blood_relation}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="pt-8 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                        <button
                          onClick={() => navigate(`/memsteptwo/${currentUserId}`)}
                          className="w-full sm:w-auto px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2 group"
                        >
                          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Back
                        </button>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                            <span className="text-pink-600 font-semibold">3</span>
                          </div>
                          <span>of 6 steps</span>
                        </div>

                        <button
                          type="button"
                          onClick={naviagteNextStep}
                          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] text-white rounded-xl font-medium hover:from-[#F971BC] hover:to-[#DA73AD] transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl"
                        >
                          Next Step
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
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

export default MemStepThree;
