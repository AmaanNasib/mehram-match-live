import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchDataV2,
  ReturnPutResponseFormdataWithoutToken,
  ReturnResponseFormdataWithoutToken,
  updateDataV2,
} from "../../../apiUtils";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../../sections/TopBar";
import Sidebar from "../../sections/Sidebar";
import ProfileSection from "../../sections/ProfileSection";
import StepTracker from "../../StepTracker/StepTracker";
import findUser from "../../../images/findUser.svg";
import { fetchDataObjectV2 } from "../../../apiUtils";
import api from "../../../api";

const MemStepSix = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId: paramUserId } = useParams();
  
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState();
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isPersonalInfoAccordionOpen, setIsPersonalInfoAccordionOpen] = useState(false);
  const [isFamilyInfoAccordionOpen, setIsFamilyInfoAccordionOpen] = useState(false);
  const [isPartnerExpectationAccordionOpen, setIsPartnerExpectationAccordionOpen] = useState(false);
  const [isPrivacyAccordionOpen, setIsPrivacyAccordionOpen] = useState(false);
  const [isAdditionalInfoOpen, setIsAdditionalInfoOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [imagedata, setImagedateset] = useState([]);
  const [lastSegment, setLastSegment] = useState("");
  const [profileData, setProfileData] = useState({});

  // Determine the correct userId - prioritize URL param, then member_id, then userId
  const currentUserId = paramUserId || localStorage.getItem("member_id") || userId;

  useEffect(() => {
  const segments = location.pathname.split("/").filter(Boolean);
   setLastSegment(segments[segments.length - 2]);
}, [location.pathname]);

  useEffect(() => {
    if (currentUserId) {
      // console.log("MemStepSix: Fetching data for userId:", currentUserId);
      // console.log("MemStepSix: member_id from localStorage:", localStorage.getItem("member_id"));
      // console.log("MemStepSix: Token available:", !!localStorage.getItem("token"));
      // Fetch comprehensive user data from all previous steps
      const parameter = {
        url: `/api/user/${currentUserId}/`,
        setterFunction: setApiData,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataObjectV2(parameter);
    } else {
      // console.log("MemStepSix: No userId available");
    }
  }, [currentUserId]);

  useEffect(() => {
    if (apiData) {
      console.log("MemStepSix: Received apiData:", apiData);
      setProfileData(apiData);
    }
  }, [apiData]);

  useEffect(() => {
    if (profileData && Object.keys(profileData).length > 0) {
      console.log("MemStepSix: Profile data updated:", profileData);
      console.log("MemStepSix: Gender:", profileData.gender);
      console.log("MemStepSix: Marital Status:", profileData.martial_status);
      console.log("MemStepSix: Should show hijab field:", profileData.gender === "female");
      console.log("MemStepSix: Should show wali info:", profileData.gender === "female" && (profileData.wali_name || profileData.wali_contact_number || profileData.wali_blood_relation));
      console.log("MemStepSix: Should show children info:", (profileData.martial_status === "married" || profileData.martial_status === "divorced" || profileData.martial_status === "widowed") && (profileData.number_of_children !== undefined || profileData.number_of_son !== undefined || profileData.number_of_daughter !== undefined));
      console.log("MemStepSix: Religious fields available:", {
        sect_school_info: profileData.sect_school_info,
        islamic_practicing_level: profileData.islamic_practicing_level,
        believe_in_dargah_fatiha_niyah: profileData.believe_in_dargah_fatiha_niyah,
        hijab_niqab_prefer: profileData.hijab_niqab_prefer
      });
      console.log("MemStepSix: Family fields available:", {
        father_name: profileData.father_name,
        father_occupation: profileData.father_occupation,
        mother_name: profileData.mother_name,
        mother_occupation: profileData.mother_occupation,
        father_alive: profileData.father_alive,
        mother_alive: profileData.mother_alive,
        step_father: profileData.step_father,
        step_mother: profileData.step_mother,
        family_type: profileData.family_type,
        family_practicing_level: profileData.family_practicing_level,
        number_of_siblings: profileData.number_of_siblings,
        number_of_brothers: profileData.number_of_brothers,
        number_of_sisters: profileData.number_of_sisters,
        number_of_children: profileData.number_of_children,
        number_of_son: profileData.number_of_son,
        number_of_daughter: profileData.number_of_daughter,
        wali_name: profileData.wali_name,
        wali_contact_number: profileData.wali_contact_number,
        wali_blood_relation: profileData.wali_blood_relation
      });
      console.log("MemStepSix: All available fields:", Object.keys(profileData));
    } else {
      console.log("MemStepSix: Profile data is empty or not available");
    }
  }, [profileData]);

  useEffect(() => {
    if (currentUserId) {
      // console.log("MemStepSix: Fetching photo for userId:", currentUserId);
      // console.log("MemStepSix: Photo URL:", `/api/user/profile_photo/${currentUserId}/`);
      const parameter = {
        url: `/api/user/profile_photo/${currentUserId}/`,
        setterFunction: setImagedateset,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataV2(parameter);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (imagedata) {
      console.log("MemStepSix: Photo data received:", imagedata);
      console.log("MemStepSix: Photo data length:", imagedata.length);
      if (imagedata.length > 0) {
        console.log("MemStepSix: Latest photo URL:", imagedata[imagedata.length - 1]?.upload_photo);
      }
    }
  }, [imagedata]);

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const togglePersonalInfoAccordion = () => {
    setIsPersonalInfoAccordionOpen(!isPersonalInfoAccordionOpen);
  };

  const toggleFamilyInfoAccordion = () => {
    setIsFamilyInfoAccordionOpen(!isFamilyInfoAccordionOpen);
  };

  const togglePartnerExpectationAccordion = () => {
    setIsPartnerExpectationAccordionOpen(!isPartnerExpectationAccordionOpen);
  };

  const togglePrivacyAccordion = () => {
    setIsPrivacyAccordionOpen(!isPrivacyAccordionOpen);
  };

  const toggleAdditionalInfo = () => {
    setIsAdditionalInfoOpen(!isAdditionalInfoOpen);
  };

  const updateField = (field, value) => {
    setProfileData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const naviagteNextStep = async () => {
    // Check if terms are accepted
    if (!termsAccepted) {
      alert("Please accept the Terms and Conditions to continue.");
      return;
    }
    
    // Persist T&C acceptance on backend
    try {
      const uid = localStorage.getItem("member_id") || userId;
      await api.put(`/api/user/${uid}/`, { terms_condition: true });
    } catch (e) {
      // ignore, we'll still attempt completion check
    }

    // Check backend for any remaining incomplete step before finalizing
    try {
      const uid = localStorage.getItem("member_id") || userId;
      const { data } = await api.get(`/api/user/next_incomplete_step/`, { params: { user_id: uid } });
      // Expected: null/empty if complete, or an object/string indicating next step
      if (data && (data.step || data.path || data.url || typeof data === 'string')) {
        const target = data.step || data.path || data.url || String(data);
        // Basic normalization for known steps
        const normalized = target.toLowerCase();
        if (normalized.includes('stepfour')) return navigate(`/memstepfour/${currentUserId}`);
        if (normalized.includes('stepfive')) return navigate(`/memstepfive/${currentUserId}`);
        if (normalized.includes('stepthree')) return navigate(`/memstepthree/${currentUserId}`);
        if (normalized.includes('steptwo')) return navigate(`/memsteptwo/${currentUserId}`);
        if (normalized.includes('stepone')) return navigate(`/memstepone/${currentUserId}`);
        // Fallback: stay on current page but show hint
        alert('Some profile details are still pending. Please review previous steps.');
        return;
      }
    } catch (e) {
      // If API not available, proceed normally
    }

    // If everything is complete, navigate to dashboard or success page
    navigate(`/newdashboard`);
  };

  // Helper function to format display values
  const formatDisplayValue = (value) => {
    if (value === 0 || value === "0") return "0";
    if (!value) return "Not specified";
    if (typeof value === "string") {
      // Handle special cases for specific fields
      if (value === "male") return "Male";
      if (value === "female") return "Female";
      if (value === "single") return "Single";
      if (value === "married") return "Married";
      if (value === "divorced") return "Divorced";
      if (value === "widowed") return "Widowed";
      if (value === "religious") return "Religious";
      if (value === "moderate") return "Moderate";
      if (value === "liberal") return "Liberal";
      if (value === "conservative") return "Conservative";
      if (value === "ahle_quran") return "Ahle Quran";
      if (value === "sunni") return "Sunni";
      if (value === "shia") return "Shia";
      if (value === "ahmadi") return "Ahmadi";
      if (value === "Visible to all") return "Visible to all";
      if (value === "Visible to only matches") return "Visible to only matches";
      if (value === "hijab_required") return "Hijab Required";
      if (value === "niqab_required") return "Niqab Required";
      if (value === "no_hijab") return "No Hijab Required";
      if (value === "prefer_hijab") return "Prefer Hijab";
      if (value === "prefer_niqab") return "Prefer Niqab";
      if (value === "yes") return "Yes";
      if (value === "no") return "No";
      if (value === "true") return "Yes";
      if (value === "false") return "No";
      if (value === "nuclear") return "Nuclear Family";
      if (value === "joint") return "Joint Family";
      if (value === "extended") return "Extended Family";
      if (value === "business") return "Business";
      if (value === "service") return "Service";
      if (value === "professional") return "Professional";
      if (value === "student") return "Student";
      if (value === "housewife") return "Housewife";
      if (value === "retired") return "Retired";
      if (value === "unemployed") return "Unemployed";
      if (value === "alive") return "Alive";
      if (value === "deceased") return "Deceased";
      if (value === "nuclear_family") return "Nuclear Family";
      if (value === "joint_family") return "Joint Family";
      if (value === "extended_family") return "Extended Family";
      if (value === "single_parent") return "Single Parent";
      if (value === "step_father") return "Step Father";
      if (value === "step_mother") return "Step Mother";
      if (value === "biological_father") return "Biological Father";
      if (value === "biological_mother") return "Biological Mother";
      if (value === "adoptive_father") return "Adoptive Father";
      if (value === "adoptive_mother") return "Adoptive Mother";
      if (value === "guardian") return "Guardian";
      if (value === "uncle") return "Uncle";
      if (value === "aunt") return "Aunt";
      if (value === "brother") return "Brother";
      if (value === "sister") return "Sister";
      if (value === "grandfather") return "Grandfather";
      if (value === "grandmother") return "Grandmother";
      if (value === "businessman") return "Businessman";
      if (value === "businesswoman") return "Businesswoman";
      if (value === "engineer") return "Engineer";
      if (value === "doctor") return "Doctor";
      if (value === "teacher") return "Teacher";
      if (value === "lawyer") return "Lawyer";
      if (value === "government_employee") return "Government Employee";
      if (value === "private_employee") return "Private Employee";
      if (value === "farmer") return "Farmer";
      if (value === "shopkeeper") return "Shopkeeper";
      if (value === "driver") return "Driver";
      if (value === "homemaker") return "Homemaker";
      if (value === "not_working") return "Not Working";
      
      return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ");
    }
    return value;
  };

  // Helper function to format multi-select values
  const formatMultiSelectDisplay = (value) => {
    if (!value) return "Not specified";
    if (Array.isArray(value)) {
      if (value.length === 0) return "Not specified";
      // Handle special cases for religious beliefs
      const formattedValues = value.map(item => {
        if (item === "no_all") return "No, I don't believe in any of these";
        if (item === "yes_all") return "Yes, I believe in all of these";
        if (item === "dargah") return "Dargah";
        if (item === "fatiha") return "Fatiha";
        if (item === "niyah") return "Niyah";
        return item.charAt(0).toUpperCase() + item.slice(1).replace(/_/g, " ");
      });
      return formattedValues.join(", ");
    }
    if (typeof value === "string") {
      if (value.includes(',')) {
        return value.split(',').map(item => {
          const trimmed = item.trim();
          if (trimmed === "no_all") return "No, I don't believe in any of these";
          if (trimmed === "yes_all") return "Yes, I believe in all of these";
          if (trimmed === "dargah") return "Dargah";
          if (trimmed === "fatiha") return "Fatiha";
          if (trimmed === "niyah") return "Niyah";
          return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).replace(/_/g, " ");
        }).join(", ");
    } else {
        if (value === "no_all") return "No, I don't believe in any of these";
        if (value === "yes_all") return "Yes, I believe in all of these";
        if (value === "dargah") return "Dargah";
        if (value === "fatiha") return "Fatiha";
        if (value === "niyah") return "Niyah";
        return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ");
      }
    }
    return value;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };

  // Helper function to format location
  const formatLocation = (city, state, country) => {
    const parts = [city, state, country].filter(part => part && part !== "");
    return parts.length > 0 ? parts.join(", ") : "Not specified";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0E3] via-white to-[#FFA4D6]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 bg-gradient-to-r from-[#CB3B8B] to-[#F971BC] bg-clip-text text-transparent px-2">
            Create Your Mehram Match Profile
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Follow these 6 simple steps to complete your profile and find the perfect match
          </p>
            </div>

        {/* Main Content Container */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Mobile Step Tracker - Separate container above form */}
          <div className="lg:hidden block">
            <StepTracker percentage={100} />
          </div>

          {/* Desktop and Form Container */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Step Tracker - Professional sidebar layout */}
            <div className="lg:block hidden">
              <StepTracker percentage={100} />
            </div>

            {/* Main Form Container */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex-1">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100 text-xs sm:text-sm font-medium uppercase tracking-wide">
                      Step 6 of 6
                    </p>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mt-1">
                      Review & Confirm
                    </h2>
            </div>
                  <div className="bg-white/20 rounded-full p-2 sm:p-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          </div>

              {/* Form Content */}
              <div className="p-4 sm:p-6 lg:p-8">
                <form className="space-y-6 sm:space-y-8">
                  {/* Form Description */}
                  <div className="text-center space-y-3 sm:space-y-4">
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-3xl mx-auto px-2">
                      You're almost there! Please take a moment to review all the details you've provided. 
                      This is your chance to ensure everything is accurate and as per your preference before proceeding. 
                      If any information needs to be updated, feel free to go back and make the necessary changes. 
                      Once you're confident that everything is correct, confirm your profile to move forward in your journey to finding the right partner.
                    </p>
                    <div className="w-full h-px bg-gray-200"></div>
                  </div>

                  {/* Review Sections */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Personal Information Section */}
                    <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div
                        className="flex justify-between items-center cursor-pointer p-4 sm:p-6 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200"
                      onClick={togglePersonalInfoAccordion}
                    >
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                        Personal Information
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">Basic details and contact information</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                          <span className="text-xs sm:text-sm text-gray-500 font-medium hidden sm:block">
                            {isPersonalInfoAccordionOpen ? 'Hide Details' : 'View Details'}
                          </span>
                          <div className={`w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] rounded-full flex items-center justify-center transition-all duration-300 ${
                            isPersonalInfoAccordionOpen ? 'rotate-180' : ''
                          }`}>
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                          </div>
                        </div>
                    </div>
                    {isPersonalInfoAccordionOpen && (
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100">
                          <div className="pt-4 sm:pt-6 space-y-6 sm:space-y-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                              <div className="space-y-4 sm:space-y-6">
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">First Name</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.first_name)}
                          </div>
                          </div>
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Last Name</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.last_name)}
                        </div>
                          </div>
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Date of Birth</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDate(profileData.dob)}
                          </div>
                        </div>
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Gender</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.gender)}
                            </div>
                              </div>
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Height</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.hieght || profileData.height)}
                              </div>
                            </div>
                                {profileData.weight && (
                                  <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Weight</label>
                                    <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                      {formatDisplayValue(profileData.weight)}
                          </div>
                          </div>
                                )}
                        </div>

                              <div className="space-y-6">
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Marital Status</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.martial_status)}
                                  </div>
                                  </div>
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Education</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.Education)}
                                  </div>
                                </div>
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Profession</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.profession)}
                              </div>
                                  </div>
                                {profileData.describe_job_business && profileData.profession && (
                                  <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Job/Business Description</label>
                                    <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                      {formatDisplayValue(profileData.describe_job_business)}
                                  </div>
                                  </div>
                                )}
                                {profileData.disability && (
                                  <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Disability</label>
                                    <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                      {formatDisplayValue(profileData.disability)}
                                </div>
                              </div>
                                )}
                                {profileData.type_of_disability && (
                                  <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Type of Disability</label>
                                    <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                      {formatDisplayValue(profileData.type_of_disability)}
                            </div>
                          </div>
                                )}
                                {profileData.incomeRange && (
                                  <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Income Range</label>
                                    <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                      {formatDisplayValue(profileData.incomeRange)}
                          </div>
                        </div>
                                )}
                                {profileData.about_you && (
                                  <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">About You</label>
                                    <div className="w-full min-h-[56px] px-4 py-3 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-base font-semibold text-gray-800 shadow-sm">
                                      {formatDisplayValue(profileData.about_you)}
                          </div>
                                  </div>
                                )}
                          </div>
                        </div>

                            {/* Current Address */}
                            <div className="space-y-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  </div>
                                <h4 className="text-lg font-bold text-gray-800">Current Address</h4>
                                </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">City</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.city)}
                              </div>
                            </div>
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">State</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.state)}
                          </div>
                          </div>
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Country</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.country)}
                        </div>
                          </div>
                          </div>
                          </div>

                            {/* Native Place */}
                            <div className="space-y-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                  </svg>
                          </div>
                                <h4 className="text-lg font-bold text-gray-800">Native Place</h4>
                        </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Native City</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.native_city)}
                  </div>
                </div>
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Native State</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.native_state)}
                </div>
                                </div>
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Native Country</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.native_country)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
              </div>

                    {/* Religious Information Section */}
                    <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div
                        className="flex justify-between items-center cursor-pointer p-4 sm:p-6 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200"
                      onClick={toggleAccordion}
                    >
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                        Religious Information
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">Faith, beliefs and religious practices</p>
                          </div>
                          </div>
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                          <span className="text-xs sm:text-sm text-gray-500 font-medium hidden sm:block">
                            {isAccordionOpen ? 'Hide Details' : 'View Details'}
                          </span>
                          <div className={`w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] rounded-full flex items-center justify-center transition-all duration-300 ${
                            isAccordionOpen ? 'rotate-180' : ''
                          }`}>
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                        </div>
                              </div>
                              </div>
                      {isAccordionOpen && (
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100">
                          <div className="pt-4 sm:pt-6 space-y-6 sm:space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                              <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Sect / School of Thought</label>
                                <div className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-base font-semibold text-gray-800 shadow-sm">
                                  {formatDisplayValue(profileData.sect_school_info)}
                            </div>
                          </div>
                              <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Islam Practicing Level</label>
                                <div className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-base font-semibold text-gray-800 shadow-sm">
                                  {formatDisplayValue(profileData.islamic_practicing_level)}
                              </div>
                              </div>
                              <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Believe in Dargah/Fatiha/Niyah</label>
                                <div className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-base font-semibold text-gray-800 shadow-sm">
                                  {formatMultiSelectDisplay(profileData.believe_in_dargah_fatiha_niyah)}
                            </div>
                          </div>
                        </div>
                            {profileData.gender === "female" && (
                              <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Hijab/Niqab Preference</label>
                                <div className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-base font-semibold text-gray-800 shadow-sm">
                                  {formatDisplayValue(profileData.hijab_niqab_prefer)}
                        </div>
                              </div>
                    )}
                  </div>
                </div>
                      )}
              </div>

                    {/* Family Information Section */}
                    <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div
                        className="flex justify-between items-center cursor-pointer p-4 sm:p-6 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200"
                      onClick={toggleFamilyInfoAccordion}
                    >
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                        Family Information
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">Family details and background</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                          <span className="text-xs sm:text-sm text-gray-500 font-medium hidden sm:block">
                            {isFamilyInfoAccordionOpen ? 'Hide Details' : 'View Details'}
                          </span>
                          <div className={`w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] rounded-full flex items-center justify-center transition-all duration-300 ${
                            isFamilyInfoAccordionOpen ? 'rotate-180' : ''
                          }`}>
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                          </div>
                        </div>
                    </div>
                    {isFamilyInfoAccordionOpen && (
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100">
                          <div className="pt-4 sm:pt-6 space-y-6 sm:space-y-8">
                            {/* Parents Information */}
                            <div className="space-y-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                  </svg>
                          </div>
                                <h4 className="text-lg font-bold text-gray-800">Parents Information</h4>
                          </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Father's Name</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.father_name)}
                        </div>
                          </div>
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Father's Occupation</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.father_occupation)}
                          </div>
                        </div>
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Mother's Name</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.mother_name)}
                            </div>
                            </div>
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Mother's Occupation</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.mother_occupation)}
                            </div>
                          </div>
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Father Alive</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.father_alive)}
                          </div>
                          </div>
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Mother Alive</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.mother_alive)}
                            </div>
                            </div>
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Step Father</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.step_father)}
                            </div>
                            </div>
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Step Mother</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.step_mother)}
                            </div>
                            </div>
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Family Type</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.family_type)}
                            </div>
                            </div>
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Family Practicing Level</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.family_practicing_level)}
                            </div>
                            </div>
                          </div>
                        </div>

                            {/* Siblings Information */}
                            {(profileData.number_of_siblings !== undefined || profileData.number_of_brothers !== undefined || profileData.number_of_sisters !== undefined) && (
                              <div className="space-y-6">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                            </div>
                                  <h4 className="text-lg font-bold text-gray-800">Siblings Information</h4>
                            </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Total Siblings</label>
                                    <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                      {formatDisplayValue(profileData.number_of_siblings)}
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Brothers</label>
                                    <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                      {formatDisplayValue(profileData.number_of_brothers)}
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Sisters</label>
                                    <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                      {formatDisplayValue(profileData.number_of_sisters)}
                                    </div>
                                  </div>
                            </div>
                          </div>
                        )}

                            {/* Children Information (for married/divorced/widowed) */}
                            {((profileData.martial_status === "married" || profileData.martial_status === "divorced" || profileData.martial_status === "widowed") && 
                              (profileData.number_of_children !== undefined || profileData.number_of_son !== undefined || profileData.number_of_daughter !== undefined)) && (
                              <div className="space-y-6">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                          </div>
                                  <h4 className="text-lg font-bold text-gray-800">Children Information</h4>
                          </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Total Children</label>
                                    <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                      {formatDisplayValue(profileData.number_of_children)}
                        </div>
                            </div>
                                  <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Sons</label>
                                    <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                      {formatDisplayValue(profileData.number_of_son)}
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Daughters</label>
                                    <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                      {formatDisplayValue(profileData.number_of_daughter)}
                                    </div>
                                  </div>
                            </div>
                          </div>
                        )}

                            {/* Wali Information (for females) */}
                            {profileData.gender === "female" && (profileData.wali_name || profileData.wali_contact_number || profileData.wali_blood_relation) && (
                              <div className="space-y-6">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                              </div>
                                  <h4 className="text-lg font-bold text-gray-800">Wali Information</h4>
                              </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Wali Name</label>
                                    <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                      {formatDisplayValue(profileData.wali_name)}
                            </div>
                              </div>
                                  <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Contact Number</label>
                                    <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                      {formatDisplayValue(profileData.wali_contact_number)}
                            </div>
                                  </div>
                                  <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Blood Relation</label>
                                    <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                      {formatDisplayValue(profileData.wali_blood_relation)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                    )}
                  </div>
                </div>
                      )}
              </div>

                    {/* Partner Expectations Section */}
                    <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div
                        className="flex justify-between items-center cursor-pointer p-4 sm:p-6 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200"
                      onClick={togglePartnerExpectationAccordion}
                    >
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                              Partner Expectations
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">Your preferences for a life partner</p>
                          </div>
                          </div>
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                          <span className="text-xs sm:text-sm text-gray-500 font-medium hidden sm:block">
                            {isPartnerExpectationAccordionOpen ? 'Hide Details' : 'View Details'}
                          </span>
                          <div className={`w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] rounded-full flex items-center justify-center transition-all duration-300 ${
                            isPartnerExpectationAccordionOpen ? 'rotate-180' : ''
                          }`}>
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                            </div>
                          </div>
                      {isPartnerExpectationAccordionOpen && (
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100">
                          <div className="pt-4 sm:pt-6 space-y-6 sm:space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                              <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Preferred Surname</label>
                                <div className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-base font-semibold text-gray-800 shadow-sm">
                                  {formatDisplayValue(profileData.preferred_surname)}
                          </div>
                        </div>
                              <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Preferred Sect</label>
                                <div className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-base font-semibold text-gray-800 shadow-sm">
                                  {formatDisplayValue(profileData.preferred_sect)}
                          </div>
                          </div>
                              <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Desired Practicing Level</label>
                                <div className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-base font-semibold text-gray-800 shadow-sm">
                                  {formatDisplayValue(profileData.desired_practicing_level)}
                        </div>
                          </div>
                              <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Preferred Family Type</label>
                                <div className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-base font-semibold text-gray-800 shadow-sm">
                                  {formatDisplayValue(profileData.preferred_family_type)}
                              </div>
                              </div>
                              <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Preferred Education</label>
                                <div className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-base font-semibold text-gray-800 shadow-sm">
                                  {formatDisplayValue(profileData.preferred_education)}
                              </div>
                            </div>
                              <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Preferred Occupation</label>
                                <div className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-base font-semibold text-gray-800 shadow-sm">
                                  {formatDisplayValue(profileData.preferred_occupation_profession)}
                          </div>
                        </div>
                              {profileData.preferred_family_background && (
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Preferred Family Background</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.preferred_family_background)}
                          </div>
                          </div>
                    )}
                  </div>

                            {/* Preferred Dargah/Fatiha/Niyah */}
                            {profileData.preferred_dargah_fatiha_niyah && (
                              <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Preferred Dargah/Fatiha/Niyah</label>
                                <div className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-base font-semibold text-gray-800 shadow-sm">
                                  {formatMultiSelectDisplay(profileData.preferred_dargah_fatiha_niyah)}
                </div>
              </div>
                            )}

                            {/* Preferred Location */}
                            {(profileData.preferred_city || profileData.preferred_state || profileData.preferred_country) && (
                              <div className="space-y-6">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                                  <h4 className="text-lg font-bold text-gray-800">Preferred Location</h4>
                              </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Preferred City</label>
                                    <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                      {formatDisplayValue(profileData.preferred_city)}
                            </div>
                          </div>
                                  <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Preferred State</label>
                                    <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                      {formatDisplayValue(profileData.preferred_state)}
                        </div>
                            </div>
                                  <div className="space-y-3">
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Preferred Country</label>
                                    <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                      {formatDisplayValue(profileData.preferred_country)}
                          </div>
                        </div>
                                </div>
                            </div>
                    )}
                  </div>
                </div>
                    )}
              </div>

                    {/* Privacy Settings Section */}
                    <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div
                        className="flex justify-between items-center cursor-pointer p-4 sm:p-6 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200"
                        onClick={togglePrivacyAccordion}
                      >
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                              Privacy Settings
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">Profile visibility and photo privacy</p>
                              </div>
                              </div>
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                          <span className="text-xs sm:text-sm text-gray-500 font-medium hidden sm:block">
                            {isPrivacyAccordionOpen ? 'Hide Details' : 'View Details'}
                          </span>
                          <div className={`w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] rounded-full flex items-center justify-center transition-all duration-300 ${
                            isPrivacyAccordionOpen ? 'rotate-180' : ''
                          }`}>
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            </div>
                              </div>
                              </div>
                      {isPrivacyAccordionOpen && (
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100">
                          <div className="pt-4 sm:pt-6 space-y-6 sm:space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                              <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Profile Visibility</label>
                                <div className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-base font-semibold text-gray-800 shadow-sm">
                                  {profileData.profile_visible === 'Visible to all' ? 'Visible to all' : 
                                   profileData.profile_visible === 'Visible to only matches' ? 'Visible to only matches' : 
                                   profileData.profile_visible || "Not specified"}
                              </div>
                            </div>
                              {profileData.gender === "female" && (
                                <div className="space-y-2 sm:space-y-3">
                                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wide">Photo Privacy Option</label>
                                  <div className="w-full h-12 sm:h-14 px-3 sm:px-4 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white flex items-center text-sm sm:text-base font-semibold text-gray-800 shadow-sm">
                                    {formatDisplayValue(profileData.photo_upload_privacy_option)}
                              </div>
                              </div>
                              )}
                            </div>

                            {/* Photo Upload Section */}
                            <div className="space-y-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                              </div>
                                <h4 className="text-lg font-bold text-gray-800">Profile Photo</h4>
                            </div>
                              {imagedata && imagedata.length > 0 && imagedata[imagedata.length - 1]?.upload_photo ? (
                                <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-sm">
                                  <img
                                    src={imagedata[imagedata.length - 1]?.upload_photo}
                                    alt="Profile"
                                    className="w-20 h-20 object-cover rounded-xl border-2 border-green-300 shadow-md"
                                    onError={(e) => {
                                      console.log("MemStepSix: Image failed to load:", e.target.src);
                                      e.target.style.display = 'none';
                                    }}
                                    onLoad={() => {
                                      console.log("MemStepSix: Image loaded successfully");
                                    }}
                                  />
                                  <div>
                                    <p className="text-base font-bold text-green-800">Photo uploaded successfully</p>
                                    <p className="text-sm text-green-600 mt-1">Profile photo is ready</p>
                              </div>
                              </div>
                              ) : (
                                <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
                                  <p className="text-sm text-gray-500 font-medium">No photo uploaded</p>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
              )}

                    
                    </div>
                  </div>
                  {/* Terms and Conditions Section */}
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Terms and Conditions</h3>
                        
                        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-200">
                          <div className="text-sm text-gray-700 leading-relaxed">
                            <div className="text-center mb-4">
                              <h4 className="text-base font-semibold text-gray-800 mb-2">Mehram Match – Terms and Conditions</h4>
                              <div className="w-full h-px bg-gray-300"></div>
                            </div>

                            <div className="space-y-3">
                              <p><strong>1. Acceptance of Terms</strong><br/>
                              By accessing or using Mehram Match, you agree to be legally bound by these Terms and Conditions and our Privacy Policy. If you do not agree, please do not use our services.</p>

                              <p><strong>2. Eligibility</strong><br/>
                              • You must be at least 18 years old to register.<br/>
                              • Mehram Match is intended for Muslim individuals seeking matrimonial alliances.<br/>
                              • Users must provide accurate, truthful, and complete information during registration.</p>

                              <p><strong>3. User Conduct</strong><br/>
                              • You agree to use the platform in a respectful and honest manner.<br/>
                              • Harassment, discrimination, hate speech, or any offensive behavior is strictly prohibited.<br/>
                              • No content or behavior that violates Islamic ethics or the laws of your country is allowed.<br/>
                              • Users should avoid sharing explicit, misleading, or fraudulent information.</p>

                              <p><strong>4. Profile Information</strong><br/>
                              • Users are responsible for maintaining the accuracy of their profile information.<br/>
                              • Mehram Match does not verify the authenticity of user profiles but reserves the right to suspend or remove any profiles found to be fraudulent or inappropriate.</p>

                              <p><strong>5. Privacy</strong><br/>
                              • Mehram Match respects your privacy and handles your personal data in accordance with our Privacy Policy.<br/>
                              • Personal details shared on the platform should be treated with confidentiality by all users.</p>

                              <p><strong>6. Use of Services</strong><br/>
                              • Mehram Match provides a platform to connect Muslim singles but does not guarantee any marriage or relationship outcomes.<br/>
                              • Users are responsible for their own interactions, meetings, and decisions.<br/>
                              • The platform is not responsible for any disputes, damages, or losses arising from user interactions.</p>

                              <p><strong>7. Prohibited Activities</strong><br/>
                              • Use of Mehram Match for commercial, advertising, or solicitation purposes is forbidden.<br/>
                              • Creating fake profiles or impersonating others is strictly prohibited.<br/>
                              • Sharing offensive, defamatory, or illegal content is forbidden.</p>

                              <p><strong>8. Termination and Suspension</strong><br/>
                              • Mehram Match reserves the right to suspend or terminate accounts at its sole discretion for violating these terms or engaging in inappropriate conduct.<br/>
                              • Users can deactivate their accounts at any time.</p>

                              <p><strong>9. Intellectual Property</strong><br/>
                              • All content on Mehram Match, including logos, design, and text, is owned by Mehram Match or its licensors.<br/>
                              • Users may not copy, reproduce, or distribute content without permission.</p>

                              <p><strong>10. Disclaimer and Limitation of Liability</strong><br/>
                              • Mehram Match is provided "as is" without warranties of any kind.<br/>
                              • The platform does not guarantee the accuracy, completeness, or reliability of user-generated content.<br/>
                              • Mehram Match is not liable for any direct or indirect damages resulting from the use of the site or interactions with other users.</p>

                              <p><strong>11. Changes to Terms</strong><br/>
                              Mehram Match reserves the right to modify these Terms and Conditions at any time. Users will be notified of significant changes, and continued use after updates constitutes acceptance.</p>

                              <p><strong>12. Governing Law</strong><br/>
                              These Terms and Conditions shall be governed by and construed in accordance with the laws of India</p>

                              <p><strong>13. Contact Us</strong><br/>
                              For questions or concerns about these Terms, please contact us at:<br/>
                              Email: <br/>
                              Address: </p>
                            </div>
                          </div>
                        </div>

                        {/* Accept Button */}
                        <div className="mt-4">
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={termsAccepted}
                              onChange={(e) => setTermsAccepted(e.target.checked)}
                              className="w-4 h-4 text-[#FF59B6] bg-gray-100 border-gray-300 rounded focus:ring-[#FF59B6] focus:ring-2"
                            />
                            <span className="text-sm text-gray-700 font-medium">
                              I accept the Terms and Conditions
                              <span className="text-red-500 ml-1">*</span>
                            </span>
                          </label>
                          {!termsAccepted && (
                            <p className="text-red-500 text-xs mt-2">You must accept the Terms and Conditions to continue.</p>
                          )}
                        </div>
                      </div>
                    </div>

                  {/* Navigation Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between sm:justify-end gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-gray-200">
                <button
                      type="button"
                      onClick={() => navigate(`/memstepfive/${currentUserId}`)}
                      className="group w-full sm:w-auto bg-white text-gray-700 px-4 sm:px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transform hover:scale-[1.02] transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center space-x-2 min-h-[44px] sm:min-h-[48px]"
                    >
                      <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="text-sm sm:text-base">Back</span>
                </button>
                    
                <button
                  type="button"
                  onClick={naviagteNextStep}
                      className="group w-full sm:w-auto bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] text-white px-4 sm:px-6 py-3 rounded-xl font-semibold hover:from-[#F971BC] hover:to-[#DA73AD] transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 min-h-[44px] sm:min-h-[48px] relative overflow-hidden"
                    >
                      {/* Gradient overlay for hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#F971BC] to-[#DA73AD] opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      
                      <span className="relative text-sm sm:text-base font-medium">Confirm Profile</span>
                      <svg className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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

export default MemStepSix;
