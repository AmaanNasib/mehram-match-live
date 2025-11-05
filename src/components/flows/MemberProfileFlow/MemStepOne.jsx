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

// Production-safe logging helper
const isDevelopment = process.env.NODE_ENV === 'development';
const devLog = (...args) => {
  if (isDevelopment) {
    devLog(...args);
  }
};
const devWarn = (...args) => {
  if (isDevelopment) {
    devWarn(...args);
  }
};

const MemStepOne = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [setErrors, setsetErrors] = useState(null);
  const [member_id, setmemErrors] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false); // Track if form was successfully submitted
  const location = useLocation();
  const { username, age, isNewMember, clearForm, editMode, memberId } = location.state || {};
  devLog(username, ">>>>>>>");
  devLog("Edit Mode:", editMode, "Member ID:", memberId);
  
  // Determine userId based on the context - use params first if available
  let userId;
  if (editMode && memberId) {
    // When editing a member, use the memberId from the state
    userId = memberId;
    devLog("MemStepOne: Using memberId for edit mode:", userId);
  } else if (params.userId && params.userId !== '0' && params.userId !== 'null') {
    // Use userId from URL params if available and valid
    userId = params.userId;
    devLog("MemStepOne: Using userId from URL params:", userId);
  } else if (username == "memberCreation") {
    userId = localStorage.getItem("member_id");
  } else if (isNewMember && clearForm) {
    userId = null; // This will prevent fetching existing user data
  } else {
    userId = localStorage.getItem("userId");
  }
  
  // Store the created member ID for cleanup if needed
  const createdMemberIdRef = React.useRef(userId);
  const profileDataRef = React.useRef(null); // Will be initialized after profileData is declared
  const formSubmittedRef = React.useRef(false);
  const isNewMemberRef = React.useRef(isNewMember);
  const editModeRef = React.useRef(editMode);
  const fetchTimeoutRef = React.useRef(null); // For cleanup of setTimeout
  
  // Update refs whenever they change (profileData ref will be updated after profileData is declared)
  
  React.useEffect(() => {
    formSubmittedRef.current = formSubmitted;
  }, [formSubmitted]);
  
  React.useEffect(() => {
    isNewMemberRef.current = isNewMember;
  }, [isNewMember]);
  
  React.useEffect(() => {
    editModeRef.current = editMode;
  }, [editMode]);
  
  // Debug: Log userId determination
  devLog("MemStepOne: Determined userId:", userId);
  devLog("Edit Mode:", editMode, "Member ID:", memberId, "Is New Member:", isNewMember);

  useEffect(() => {
    devLog("Current userId:", userId, "Edit Mode:", editMode, "Member ID:", memberId);
    
    // Debug localStorage state
    devLog("=== LOCALSTORAGE DEBUG ===");
    devLog("Token in localStorage:", localStorage.getItem("token"));
    devLog("UserId in localStorage:", localStorage.getItem("userId"));
    devLog("Name in localStorage:", localStorage.getItem("name"));
    devLog("LoginTime in localStorage:", localStorage.getItem("loginTime"));
    devLog("Role in localStorage:", localStorage.getItem("role"));
    devLog("=== END LOCALSTORAGE DEBUG ===");
    
    // Handle case where userId is null, undefined, or 'undefined'
    if (!userId || userId === 'undefined' || userId === 'null') {
      devLog("No valid userId found, checking localStorage...");
      const fallbackUserId = localStorage.getItem("userId");
      if (fallbackUserId && fallbackUserId !== 'undefined') {
        devLog("Using fallback userId from localStorage:", fallbackUserId);
        // Update the userId for this component
        userId = fallbackUserId;
      } else {
        console.error("No valid userId available anywhere!");
        setLoading(false);
        return;
      }
    }
    
    if (userId) {
      // Check if this is a back navigation for a newly created member
      const isBackNavigation = location.state?.isNewMember || location.state?.member_id;
      const recentlyCreatedMemberId = localStorage.getItem("member_id");
      const isRecentlyCreated = recentlyCreatedMemberId && recentlyCreatedMemberId === String(userId);
      
      // Check if this is a Google sign up user (temporary token)
      const token = localStorage.getItem("token");
      const isGoogleSignup = token && token.startsWith("google_");
      
      if (isGoogleSignup) {
        devLog("Google sign up user - skipping API call, using form data");
        
        // Get stored Google user data
        const googleUserData = JSON.parse(localStorage.getItem("googleUserData") || "{}");
        devLog("Using Google user data:", googleUserData);
        
        // For Google sign up users, don't fetch from API, use the data from registration
        setApiData({
          id: userId,
          first_name: googleUserData.first_name || localStorage.getItem("name")?.split(" ")[0] || "",
          last_name: googleUserData.last_name || localStorage.getItem("name")?.split(" ")[1] || "",
          name: localStorage.getItem("name") || "",
          email: googleUserData.email || "",
          contact_number: googleUserData.contact_number || "",
          onbehalf: googleUserData.onbehalf || "Self",
          gender: googleUserData.gender || "", // Don't set default gender, let user choose
          dob: "", // DOB will be filled manually in MemStepOne
          // Add other default fields as needed
          profile_started: true,
          profile_completed: false,
          profile_percentage: 0
        });
        setLoading(false);
      } else {
        // Regular user or Google login user - fetch from API
        devLog("Fetching user data from API for userId:", userId);
        devLog("Token type:", localStorage.getItem("token")?.startsWith("google_") ? "Google Signup" : "Regular/Google Login");
        
        const parameter = {
          url: `/api/user/${userId}/`,
          setterFunction: (data) => {
            devLog("API setterFunction called with data:", data);
            devLog("=== API RESPONSE DEBUG ===");
            devLog("Raw API response data:", data);
            devLog("Data type:", typeof data);
            devLog("Data is null/undefined:", data === null || data === undefined);
            devLog("Data is array:", Array.isArray(data));
            devLog("Data length:", data?.length);
            devLog("Available fields in API response:", Object.keys(data || {}));
            
            // Check if data is an empty array
            if (Array.isArray(data) && data.length === 0) {
              console.error("API returned empty array! This might be an API issue.");
              devLog("API URL:", `/api/user/${userId}/`);
              devLog("Token:", localStorage.getItem("token"));
              devLog("User ID:", userId);
            }
            
            if (data) {
              devLog("Key fields check:");
              devLog("- first_name:", data.first_name);
              devLog("- last_name:", data.last_name);
              devLog("- email:", data.email);
              devLog("- onbehalf:", data.onbehalf);
              devLog("- gender:", data.gender);
              devLog("- dob:", data.dob);
              devLog("- city:", data.city);
              devLog("- state:", data.state);
              devLog("- country:", data.country);
            }
            
            // Check if data is an empty array (API issue)
            if (Array.isArray(data) && data.length === 0) {
              console.error("API returned empty array - this is likely an API issue");
              devLog("Using fallback data for empty array response");
              const fallbackData = {
                id: userId,
                first_name: localStorage.getItem("name")?.split(" ")[0] || "",
                last_name: localStorage.getItem("name")?.split(" ")[1] || "",
                name: localStorage.getItem("name") || "",
                email: "",
                contact_number: "",
                onbehalf: "Self",
                gender: "",
                dob: "",
                profile_started: true,
                profile_completed: false,
                profile_percentage: 0
              };
              devLog("Using fallback data for empty array:", fallbackData);
              setApiData(fallbackData);
            }
            // Check if this is a Google login user with incomplete profile
            else if (data && typeof data === 'object' && (!data.onbehalf || !data.gender)) {
              devLog("Google login user with incomplete profile detected");
              devLog("onbehalf:", data.onbehalf, "gender:", data.gender);
              // Set default values for Google login users
              const updatedData = {
                ...data,
                onbehalf: data.onbehalf || "Self",
                gender: data.gender || "", // Let user choose gender
              };
              devLog("Updated data for Google login user:", updatedData);
              setApiData(updatedData);
            } else if (data && typeof data === 'object' && Object.keys(data).length > 0) {
              // Regular user or complete Google user data
              devLog("Using complete user data from API");
              setApiData(data);
            } else {
              // Fallback: API returned empty or null data
              devWarn("API returned empty/null data, using fallback data");
              const fallbackData = {
                id: userId,
                first_name: localStorage.getItem("name")?.split(" ")[0] || "",
                last_name: localStorage.getItem("name")?.split(" ")[1] || "",
                name: localStorage.getItem("name") || "",
                email: "",
                contact_number: "",
                onbehalf: "Self",
                gender: "",
                dob: "",
                profile_started: true,
                profile_completed: false,
                profile_percentage: 0
              };
              devLog("Using fallback data:", fallbackData);
              setApiData(fallbackData);
            }
            devLog("=== END API RESPONSE DEBUG ===");
          },
          setLoading: setLoading,
          setErrors: (error) => {
            console.error("API Error:", error);
            setsetErrors(error);
          },
        };
        devLog("About to call fetchDataObjectV2 with parameter:", parameter);
        
        // Debug: Test API call directly
        devLog("=== DIRECT API TEST ===");
        devLog("API URL:", `${process.env.REACT_APP_API_URL}/api/user/${userId}/`);
        const token = localStorage.getItem("token");
        devLog("Token:", token);
        devLog("Token type:", typeof token);
        devLog("Token length:", token?.length);
        devLog("Token starts with 'Bearer':", token?.startsWith("Bearer"));
        devLog("Token starts with 'google_':", token?.startsWith("google_"));
        devLog("User ID:", userId);
        
        // Check if token is valid
        if (!token) {
          console.error("No token found in localStorage!");
        } else if (token.startsWith("google_")) {
          devWarn("Google signup token detected - this might not work with regular API calls");
        } else if (token.length < 10) {
          console.error("Token seems too short:", token);
        } else {
          // Check JWT token format
          devLog("JWT Token format check:");
          devLog("- Starts with 'eyJ':", token.startsWith("eyJ"));
          devLog("- Contains dots:", token.includes("."));
          devLog("- Split by dots:", token.split(".").length);
          if (token.includes(".")) {
            devLog("- First part (header):", token.split(".")[0]);
            devLog("- Second part (payload):", token.split(".")[1]);
            devLog("- Third part (signature):", token.split(".")[2]);
          }
        }
        
        // Make a direct API call for debugging
        const authToken = localStorage.getItem("token");
        const authHeader = authToken?.startsWith("Bearer") ? authToken : `Bearer ${authToken}`;
        devLog("Auth header:", authHeader);
        
        fetch(`${process.env.REACT_APP_API_URL}/api/user/${userId}/`, {
          method: 'GET',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          devLog("Direct API response status:", response.status);
          devLog("Direct API response headers:", response.headers);
          return response.json();
        })
        .then(data => {
          devLog("Direct API response data:", data);
          devLog("Direct API data type:", typeof data);
          devLog("Direct API is array:", Array.isArray(data));
        })
        .catch(error => {
          console.error("Direct API error:", error);
        });
        
        // For recently created members, add a small delay before fetching to allow backend to process
        if (isRecentlyCreated || isBackNavigation) {
          // Clear any existing timeout
          if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
          }
          fetchTimeoutRef.current = setTimeout(() => {
            fetchDataObjectV2(parameter);
            fetchTimeoutRef.current = null;
          }, 1000); // 1 second delay for backend to process new member
        } else {
          fetchDataObjectV2(parameter);
        }
        
        // Cleanup timeout on unmount or dependency change
        return () => {
          if (fetchTimeoutRef.current) {
            clearTimeout(fetchTimeoutRef.current);
            fetchTimeoutRef.current = null;
          }
        };
      }
    }
  }, [userId, editMode, memberId, location.state]);

  useEffect(() => {
    if (apiData && !(isNewMember && clearForm)) {
      devLog("=== FORM DATA SETTING DEBUG ===");
      devLog("Setting form data for user:", apiData.id, "Edit Mode:", editMode);
      devLog("API Data received:", apiData);
      devLog("onbehalf:", apiData.onbehalf, "gender:", apiData.gender);
      
      // Auto-determine gender based on on_behalf if not already set
      let autoGender = apiData.gender;
      if (apiData.onbehalf) {
        if (apiData.onbehalf === 'Brother' || apiData.onbehalf === 'Son') {
          autoGender = 'male';
        } else if (apiData.onbehalf === 'Sister' || apiData.onbehalf === 'Daughter') {
          autoGender = 'female';
        } else {
          // For Self/Friend, keep existing gender or leave empty
          autoGender = apiData.gender || '';
        }
      } else {
        // If no onbehalf info (like Google sign-in), keep gender empty for user to choose
        autoGender = apiData.gender || '';
      }
      
      devLog("Final autoGender:", autoGender);

      const formDataToSet = {
        first_name: apiData.first_name || null,
        last_name: apiData.last_name || null,
        dob: apiData.dob || null,
        gender: autoGender || null,
        on_behalf: apiData.onbehalf || null,
        marital_status: apiData.martial_status || null,
        city: apiData.city || false,
        state: apiData.state || false,
        country: apiData.country || null,
        native_country: apiData.native_country || null,
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
        contact_number: apiData.contact_number || null,
      };
      
      devLog("Form data to be set:", formDataToSet);
      devLog("Key form fields:");
      devLog("- first_name:", formDataToSet.first_name);
      devLog("- last_name:", formDataToSet.last_name);
      devLog("- gender:", formDataToSet.gender);
      devLog("- on_behalf:", formDataToSet.on_behalf);
      devLog("- dob:", formDataToSet.dob);
      devLog("- city:", formDataToSet.city);
      devLog("- state:", formDataToSet.state);
      devLog("- country:", formDataToSet.country);
      
      setProfileData(formDataToSet);
      devLog("=== END FORM DATA SETTING DEBUG ===");
    }
  }, [apiData, isNewMember, clearForm]);

  const naviagteNextStep = () => {
    if (handleValidForm()) {
      devLog(profileData.hieght, "valid");
      devLog("Navigation context:", { username, isNewMember, editMode, memberId, userId });
      devLog("Profile data before submission:", profileData);
      let mem = {};
      if (username == "memberCreation" || isNewMember) {
        // No additional validation needed for agent member creation
        mem = {
          agent_id: localStorage.getItem("userId") || "",
        };
        devLog("Member creation payload:", mem);
      }

      const parameters = {
        url:
          (username == "memberCreation" || isNewMember)
            ? "/api/user/"  // Always use POST for new member creation
            : editMode
            ? `/api/user/${memberId}/`
            : `/api/user/${userId}/`,
        payload: {
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          dob: profileData.dob,
          gender: profileData.gender,
          onbehalf: profileData.on_behalf,
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
          contact_number: profileData.contact_number,
          ...mem,
        },
        navigate: navigate,
        useracreate: "memberCreation",
        navUrl: `/memsteptwo/${userId}`,
        setErrors: setsetErrors,
      };
      devLog("MemStepOne: Navigating to MemStepTwo with userId:", userId);
      if (username == "memberCreation" || isNewMember) {
        devLog("Creating new member - using POST request");
        // Clear any existing member_id to ensure new member creation
        localStorage.removeItem("member_id");
        // Mark form as submitted to prevent cleanup deletion
        setFormSubmitted(true);
        // Always use POST for new member creation
        updatePostDataReturnId(parameters);
      } else if (editMode) {
        devLog("Editing existing member - using PUT request");
        // Use PUT for editing existing member
        updateDataReturnId(parameters);
      } else {
        // Use PUT for regular user updates
        updateDataReturnId(parameters);
      }
    }
  };

  // Cleanup effect: Delete member if user navigates away without filling form
  useEffect(() => {
    // Store member ID for cleanup
    if (userId && isNewMember && !editMode) {
      createdMemberIdRef.current = userId;
    }
  }, [userId, isNewMember, editMode]);

  // Separate cleanup effect that only runs on unmount
  useEffect(() => {
    // Cleanup function - runs when component unmounts
    return () => {
      // Skip cleanup if:
      // 1. Form was submitted successfully (navigation to next step)
      // 2. It's a back navigation (isNewMember flag from location state)
      // 3. Edit mode (editing existing member)
      // 4. Member was recently created (check localStorage for member_id)
      const isBackNavigation = location.state?.isNewMember || location.state?.member_id;
      const recentlyCreatedMemberId = localStorage.getItem("member_id");
      const isRecentlyCreated = recentlyCreatedMemberId && recentlyCreatedMemberId === String(createdMemberIdRef.current);
      
      // Don't cleanup if form was submitted OR it's a back navigation OR member was recently created
      if (formSubmittedRef.current || isBackNavigation || isRecentlyCreated || editModeRef.current) {
        devLog("Skipping cleanup - form submitted or back navigation or recently created member");
        return;
      }
      
      // Only cleanup if:
      // 1. Form was not submitted successfully
      // 2. It's a new member (not edit mode)
      // 3. Member ID exists
      // 4. Form appears to be empty (no meaningful data entered)
      if (isNewMemberRef.current && createdMemberIdRef.current) {
        const memberIdToCleanup = createdMemberIdRef.current;
        
        // Check if form has any meaningful data using ref (always current)
        const currentProfileData = profileDataRef.current;
        // Check if profileData exists and has any meaningful data
        const hasFormData = currentProfileData && (
          currentProfileData.first_name?.trim() || 
          currentProfileData.last_name?.trim() ||
          currentProfileData.gender?.trim() ||
          currentProfileData.dob?.trim() ||
          currentProfileData.city?.trim() ||
          currentProfileData.profession?.trim()
        );
        
        if (!hasFormData) {
          devLog("Cleaning up empty member:", memberIdToCleanup);
          
          // Delete the member via API
          fetch(`${process.env.REACT_APP_API_URL}/api/user/${memberIdToCleanup}/`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          })
          .then(response => {
            if (response.ok) {
              devLog("Empty member deleted successfully:", memberIdToCleanup);
            } else {
              devWarn("Failed to delete empty member:", memberIdToCleanup);
            }
          })
          .catch(error => {
            console.error("Error deleting empty member:", error);
          });
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]); // Run on mount/unmount or when location state changes

  const handleFieldChange = (field, value) => {
    devLog(field, value, ">>>>>");
    
    // Clear any existing errors when user starts typing
    if (setErrors) {
      setsetErrors(null);
    }

    setProfileData((prevState) => {
      const newState = {
        ...prevState,
        [field]: value,
      };

      // Handle cascading dropdown logic for current address
      if (field === 'country') {
        // Reset state and city when country changes
        newState.state = '';
        newState.city = '';
      } else if (field === 'state') {
        // Reset city when state changes
        newState.city = '';
      }

      // Handle cascading dropdown logic for native place
      if (field === 'native_country') {
        // Reset native state and city when native country changes
        newState.native_state = '';
        newState.native_city = '';
      } else if (field === 'native_state') {
        // Reset native city when native state changes
        newState.native_city = '';
      }

      // Handle gender-based marital status logic
      if (field === 'gender') {
        // Reset marital status when gender changes to ensure valid options
        newState.marital_status = '';
      }

      // Auto-select gender based on on_behalf selection
      if (field === 'on_behalf') {
        if (value === 'Brother' || value === 'Son') {
          newState.gender = 'male';
        } else if (value === 'Sister' || value === 'Daughter') {
          newState.gender = 'female';
        } else {
          // For Self/Friend, reset gender to allow manual selection
          newState.gender = '';
        }
      }

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

  const handleValidForm = () => {
    const newErrors = {};

    // Regex patterns for validation
    const nameRegex = /^[A-Za-z]+$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
    const numberRegex = /^\d+$/; // Only numbers
    const heightWeightRegex = /^\d{1,3}(\.\d{1,3})?$/; // limit 3

    // Field order for scrolling (top to bottom)
    const fieldOrder = [
      'first_name', 'last_name', 'dob', 'gender', 'marital_status',
      'country', 'state', 'city', 'native_country', 'native_state', 'native_city',
      'Education', 'profession', 'describe_job_business',
      'disability', 'type_of_disability', 'incomeRange', 'about_you', 'contact_number',
    ];

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
    } else {
      // Validate gender based on relationship type
      if (profileData.on_behalf) {
        if ((profileData.on_behalf === 'Brother' || profileData.on_behalf === 'Son') && profileData.gender !== 'male') {
          newErrors.gender = "Gender must be Male for Brother/Son relationship";
        } else if ((profileData.on_behalf === 'Sister' || profileData.on_behalf === 'Daughter') && profileData.gender !== 'female') {
          newErrors.gender = "Gender must be Female for Sister/Daughter relationship";
        }
      }
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

    // Validate describe_job_business - Only required if profession OR education is "other" (case insensitive)
    devLog("Validation Debug - profession:", profileData.profession, "Education:", profileData.Education, "describe_job_business:", profileData.describe_job_business);
    if ((profileData.profession?.toLowerCase() === 'other' || profileData.Education?.toLowerCase() === 'other') && !profileData.describe_job_business?.trim()) {
      newErrors.describe_job_business = "Please describe your education & job/business";
    }

    // Income Range is now optional - not mandatory for profile completion
    // if (!profileData.incomeRange) {
    //   newErrors.incomeRange = "Income Range is required";
    // }

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

    // Validate Contact Number (mandatory only for agents adding new members or in edit mode)
    const role = localStorage.getItem('role');
    const shouldValidateContact = (role === 'agent' && isNewMember) || editMode;
    
    if (shouldValidateContact) {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/; // Supports various phone formats
      if (!profileData.contact_number?.trim()) {
        newErrors.contact_number = "Contact Number is required";
      } else if (!phoneRegex.test(profileData.contact_number.replace(/\s/g, ''))) {
        newErrors.contact_number = "Please enter a valid contact number";
      }
    }

    devLog("newErrors", newErrors);

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

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    gender: "",
    on_behalf: "",
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
    contact_number: "",
  });

  // Update profileDataRef after profileData is declared
  React.useEffect(() => {
    profileDataRef.current = profileData;
  }, [profileData]);

  // Auto-populate agent's contact number when agent adds a new member
  React.useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'agent' && isNewMember && !editMode && !profileData.contact_number) {
      // Fetch agent's contact number
      const agentParameter = {
        url: `/api/agent/`,
        setterFunction: (agentData) => {
          const agentContactNumber = Array.isArray(agentData) 
            ? (agentData.find(a => a.id == localStorage.getItem('userId'))?.contact_number || agentData[0]?.contact_number)
            : agentData?.contact_number;
          
          if (agentContactNumber) {
            devLog("Auto-populating agent contact number:", agentContactNumber);
            setProfileData(prev => ({
              ...prev,
              contact_number: agentContactNumber
            }));
          }
        },
        setErrors: () => {},
        setLoading: () => {},
      };
      fetchDataObjectV2(agentParameter);
    }
  }, [isNewMember, editMode]); // Run when isNewMember or editMode changes

  // Function to get marital status options based on gender
  const getMaritalStatusOptions = (gender) => {
    const baseOptions = [
      { value: "single", label: "Single" },
      { value: "divorced", label: "Divorced" },
      { value: "khula", label: "Khula" },
      { value: "widowed", label: "Widowed" },
    ];

    // If gender is Male, insert 'Married' at position 1 (after Single)
    if (gender === 'male') {
      baseOptions.splice(1, 0, { value: "married", label: "Married" });
    }

    return baseOptions;
  };

  const genders = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    // { value: "other", label: "Other" },
  ];

  // Function to determine if gender should be readonly
  const isGenderReadonly = () => {
    return profileData.on_behalf === 'Brother' || 
           profileData.on_behalf === 'Sister' || 
           profileData.on_behalf === 'Son' || 
           profileData.on_behalf === 'Daughter';
  };

  // Function to get gender options based on on_behalf selection
  const getGenderOptions = () => {
    if (profileData.on_behalf === 'Brother' || profileData.on_behalf === 'Son') {
      return [{ value: "male", label: "Male" }];
    } else if (profileData.on_behalf === 'Sister' || profileData.on_behalf === 'Daughter') {
      return [{ value: "female", label: "Female" }];
    } else {
      return genders; // Full options for Self/Friend
    }
  };

  // Comprehensive country-state-city data structure
  const locationData = {
  india: {
    label: "India",
    states: {
      "Andhra Pradesh": {
        label: "Andhra Pradesh",
        cities: [
          { value: "Visakhapatnam", label: "Visakhapatnam" },
          { value: "Vijayawada", label: "Vijayawada" },
          { value: "Tirupati", label: "Tirupati" },
          { value: "Guntur", label: "Guntur" },
          { value: "Nellore", label: "Nellore" }
        ]
      },
      "Arunachal Pradesh": {
        label: "Arunachal Pradesh",
        cities: [
          { value: "Itanagar", label: "Itanagar" },
          { value: "Pasighat", label: "Pasighat" },
          { value: "Ziro", label: "Ziro" }
        ]
      },
      assam: {
        label: "Assam",
        cities: [
          { value: "Guwahati", label: "Guwahati" },
          { value: "Silchar", label: "Silchar" },
          { value: "Dibrugarh", label: "Dibrugarh" },
          { value: "Jorhat", label: "Jorhat" }
        ]
      },
      bihar: {
        label: "Bihar",
        cities: [
          { value: "Patna", label: "Patna" },
          { value: "Gaya", label: "Gaya" },
          { value: "Bhagalpur", label: "Bhagalpur" },
          { value: "Muzaffarpur", label: "Muzaffarpur" }
        ]
      },
      chhattisgarh: {
        label: "Chhattisgarh",
        cities: [
          { value: "Raipur", label: "Raipur" },
          { value: "Bilaspur", label: "Bilaspur" },
          { value: "Durg", label: "Durg" }
        ]
      },
      goa: {
        label: "Goa",
        cities: [
          { value: "Panaji", label: "Panaji" },
          { value: "Margao", label: "Margao" },
          { value: "Vasco da Gama", label: "Vasco da Gama" }
        ]
      },
      gujarat: {
        label: "Gujarat",
        cities: [
          { value: "Ahmedabad", label: "Ahmedabad" },
          { value: "Surat", label: "Surat" },
          { value: "Vadodara", label: "Vadodara" },
          { value: "Rajkot", label: "Rajkot" },
          { value: "Bhavnagar", label: "Bhavnagar" }
        ]
      },
      haryana: {
        label: "Haryana",
        cities: [
          { value: "Gurgaon", label: "Gurgaon" },
          { value: "Faridabad", label: "Faridabad" },
          { value: "Panipat", label: "Panipat" },
          { value: "Ambala", label: "Ambala" }
        ]
      },
      "Himachal Pradesh": {
        label: "Himachal Pradesh",
        cities: [
          { value: "Shimla", label: "Shimla" },
          { value: "Dharamshala", label: "Dharamshala" },
          { value: "Manali", label: "Manali" }
        ]
      },
      jharkhand: {
        label: "Jharkhand",
        cities: [
          { value: "Ranchi", label: "Ranchi" },
          { value: "Jamshedpur", label: "Jamshedpur" },
          { value: "Dhanbad", label: "Dhanbad" }
        ]
      },
      karnataka: {
        label: "Karnataka",
        cities: [
          { value: "Bangalore", label: "Bangalore" },
          { value: "Mysore", label: "Mysore" },
          { value: "Hubli", label: "Hubli" },
          { value: "Mangalore", label: "Mangalore" }
        ]
      },
      kerala: {
        label: "Kerala",
        cities: [
          { value: "Thiruvananthapuram", label: "Thiruvananthapuram" },
          { value: "Kochi", label: "Kochi" },
          { value: "Kozhikode", label: "Kozhikode" },
          { value: "Thrissur", label: "Thrissur" }
        ]
      },
      "Madhya Pradesh": {
        label: "Madhya Pradesh",
        cities: [
          { value: "Bhopal", label: "Bhopal" },
          { value: "Indore", label: "Indore" },
          { value: "Gwalior", label: "Gwalior" },
          { value: "Jabalpur", label: "Jabalpur" }
        ]
      },
      maharashtra: {
        label: "Maharashtra",
        cities: [
          { value: "Mumbai", label: "Mumbai" },
          { value: "Pune", label: "Pune" },
          { value: "Nagpur", label: "Nagpur" },
          { value: "Nashik", label: "Nashik" },
          { value: "Aurangabad", label: "Aurangabad" }
        ]
      },
      manipur: {
        label: "Manipur",
        cities: [
          { value: "Imphal", label: "Imphal" },
          { value: "Thoubal", label: "Thoubal" }
        ]
      },
      meghalaya: {
        label: "Meghalaya",
        cities: [
          { value: "Shillong", label: "Shillong" },
          { value: "Tura", label: "Tura" }
        ]
      },
      mizoram: {
        label: "Mizoram",
        cities: [
          { value: "Aizawl", label: "Aizawl" },
          { value: "Lunglei", label: "Lunglei" }
        ]
      },
      nagaland: {
        label: "Nagaland",
        cities: [
          { value: "Kohima", label: "Kohima" },
          { value: "Dimapur", label: "Dimapur" }
        ]
      },
      odisha: {
        label: "Odisha",
        cities: [
          { value: "Bhubaneswar", label: "Bhubaneswar" },
          { value: "Cuttack", label: "Cuttack" },
          { value: "Rourkela", label: "Rourkela" }
        ]
      },
      punjab: {
        label: "Punjab",
        cities: [
          { value: "Ludhiana", label: "Ludhiana" },
          { value: "Amritsar", label: "Amritsar" },
          { value: "Jalandhar", label: "Jalandhar" },
          { value: "Patiala", label: "Patiala" }
        ]
      },
      rajasthan: {
        label: "Rajasthan",
        cities: [
          { value: "Jaipur", label: "Jaipur" },
          { value: "Jodhpur", label: "Jodhpur" },
          { value: "Udaipur", label: "Udaipur" },
          { value: "Kota", label: "Kota" },
          { value: "Bikaner", label: "Bikaner" }
        ]
      },
      sikkim: {
        label: "Sikkim",
        cities: [
          { value: "Gangtok", label: "Gangtok" },
          { value: "Namchi", label: "Namchi" }
        ]
      },
      "Tamil Nadu": {
        label: "Tamil Nadu",
        cities: [
          { value: "Chennai", label: "Chennai" },
          { value: "Coimbatore", label: "Coimbatore" },
          { value: "Madurai", label: "Madurai" },
          { value: "Tiruchirappalli", label: "Tiruchirappalli" }
        ]
      },
      telangana: {
        label: "Telangana",
        cities: [
          { value: "Hyderabad", label: "Hyderabad" },
          { value: "Warangal", label: "Warangal" },
          { value: "Nizamabad", label: "Nizamabad" },
          { value: "Khammam", label: "Khammam" }
        ]
      },
      tripura: {
        label: "Tripura",
        cities: [
          { value: "Agartala", label: "Agartala" },
          { value: "Dharamnagar", label: "Dharamnagar" }
        ]
      },
      "Uttar Pradesh": {
        label: "Uttar Pradesh",
        cities: [
          { value: "Lucknow", label: "Lucknow" },
          { value: "Kanpur", label: "Kanpur" },
          { value: "Agra", label: "Agra" },
          { value: "Varanasi", label: "Varanasi" },
          { value: "Meerut", label: "Meerut" },
          { value: "Prayagraj", label: "Prayagraj" }
        ]
      },
      uttarakhand: {
        label: "Uttarakhand",
        cities: [
          { value: "Dehradun", label: "Dehradun" },
          { value: "Haridwar", label: "Haridwar" },
          { value: "Roorkee", label: "Roorkee" },
          { value: "Nainital", label: "Nainital" }
        ]
      },
      "West Bengal": {
        label: "West Bengal",
        cities: [
          { value: "Kolkata", label: "Kolkata" },
          { value: "Asansol", label: "Asansol" },
          { value: "Siliguri", label: "Siliguri" },
          { value: "Durgapur", label: "Durgapur" },
          { value: "Howrah", label: "Howrah" }
        ]
      }
    }
  },

    // usa: {
    //   label: "USA",
    //   states: {
    //     california: {
    //       label: "California",
    //       cities: [
    //         { value: "los_angeles", label: "Los Angeles" },
    //         { value: "san_francisco", label: "San Francisco" },
    //         { value: "san_diego", label: "San Diego" },
    //         { value: "sacramento", label: "Sacramento" }
    //       ]
    //     },
    //     new_york: {
    //       label: "New York",
    //       cities: [
    //         { value: "new_york_city", label: "New York City" },
    //         { value: "buffalo", label: "Buffalo" },
    //         { value: "rochester", label: "Rochester" }
    //       ]
    //     },
    //     texas: {
    //       label: "Texas",
    //       cities: [
    //         { value: "houston", label: "Houston" },
    //         { value: "dallas", label: "Dallas" },
    //         { value: "austin", label: "Austin" }
    //       ]
    //     },
    //     florida: {
    //       label: "Florida",
    //       cities: [
    //         { value: "miami", label: "Miami" },
    //         { value: "orlando", label: "Orlando" },
    //         { value: "tampa", label: "Tampa" }
    //       ]
    //     }
    //   }
    // },
    // canada: {
    //   label: "Canada",
    //   states: {
    //     ontario: {
    //       label: "Ontario",
    //       cities: [
    //         { value: "toronto", label: "Toronto" },
    //         { value: "ottawa", label: "Ottawa" },
    //         { value: "hamilton", label: "Hamilton" }
    //       ]
    //     },
    //     quebec: {
    //       label: "Quebec",
    //       cities: [
    //         { value: "montreal", label: "Montreal" },
    //         { value: "quebec_city", label: "Quebec City" }
    //       ]
    //     },
    //     british_columbia: {
    //       label: "British Columbia",
    //       cities: [
    //         { value: "vancouver", label: "Vancouver" },
    //         { value: "victoria", label: "Victoria" }
    //       ]
    //     }
    //   }
    // },
    // australia: {
    //   label: "Australia",
    //   states: {
    //     new_south_wales: {
    //       label: "New South Wales",
    //       cities: [
    //         { value: "sydney", label: "Sydney" },
    //         { value: "newcastle", label: "Newcastle" }
    //       ]
    //     },
    //     victoria: {
    //       label: "Victoria",
    //       cities: [
    //         { value: "melbourne", label: "Melbourne" },
    //         { value: "geelong", label: "Geelong" }
    //       ]
    //     },
    //     queensland: {
    //       label: "Queensland",
    //       cities: [
    //         { value: "brisbane", label: "Brisbane" },
    //         { value: "gold_coast", label: "Gold Coast" }
    //       ]
    //     }
    //   }
    // },
    // uk: {
    //   label: "UK",
    //   states: {
    //     england: {
    //       label: "England",
    //       cities: [
    //         { value: "london", label: "London" },
    //         { value: "manchester", label: "Manchester" },
    //         { value: "birmingham", label: "Birmingham" }
    //       ]
    //     },
    //     scotland: {
    //       label: "Scotland",
    //       cities: [
    //         { value: "edinburgh", label: "Edinburgh" },
    //         { value: "glasgow", label: "Glasgow" }
    //       ]
    //     },
    //     wales: {
    //       label: "Wales",
    //       cities: [
    //         { value: "cardiff", label: "Cardiff" },
    //         { value: "swansea", label: "Swansea" }
    //       ]
    //     }
    //   }
    // }
  };

  // Helper functions to get countries, states, and cities
  const getCountries = () => {
    return Object.keys(locationData).map(key => ({
      value: key,
      label: locationData[key].label
    }));
  };

  const getStates = (country) => {
    if (!country || !locationData[country]) return [];
    return Object.keys(locationData[country].states).map(key => ({
      value: key,
      label: locationData[country].states[key].label
    }));
  };

  const getCities = (country, state) => {
    if (!country || !state || !locationData[country] || !locationData[country].states[state]) return [];
    const cities = locationData[country].states[state].cities;
    // Add "Other" option to every state
    return [...cities, { value: "other", label: "Other" }];
  };

  const getHeightOptions = () => {
    const options = [];
    // Generate height options from 4'0" to 7'0"
    for (let feet = 4; feet <= 7; feet++) {
      for (let inches = 0; inches < 12; inches++) {
        const heightInInches = feet * 12 + inches;
        const heightInCm = Math.round(heightInInches * 2.54);
        options.push({
          value: `${feet}'${inches}"`,
          label: `${feet}'${inches}" (${heightInCm}cm)`
        });
      }
    }
    return options;
  };

  const Professions = [
    { value: "accountant", label: "Accountant" },
    { value: "Acting Professional", label: "Acting Professional" },
    { value: "actor", label: "Actor" },
    { value: "administrator", label: "Administrator" },
    { value: "Advertising Professional", label: "Advertising Professional" },
    { value: "air_hostess", label: "Air Hostess" },
    { value: "airline_professional", label: "Airline Professional" },
    { value: "airforce", label: "Airforce" },
    { value: "architect", label: "Architect" },
    { value: "artist", label: "Artist" },
    { value: "Assistant Professor", label: "Assistant Professor" },
    { value: "audiologist", label: "Audiologist" },
    { value: "auditor", label: "Auditor" },
    { value: "Bank Officer", label: "Bank Officer" },
    { value: "Bank Staff", label: "Bank Staff" },
    { value: "beautician", label: "Beautician" },
    { value: "Biologist / Botanist", label: "Biologist / Botanist" },
    { value: "Business Person", label: "Business Person" },
    { value: "captain", label: "Captain" },
    { value: "CEO / CTO / President", label: "CEO / CTO / President" },
    { value: "chemist", label: "Chemist" },
    { value: "Civil Engineer", label: "Civil Engineer" },
    { value: "Clerical Official", label: "Clerical Official" },
    { value: "Clinical Pharmacist", label: "Clinical Pharmacist" },
    { value: "Company Secretary", label: "Company Secretary" },
    { value: "Computer Engineer", label: "Computer Engineer" },
    { value: "Computer Programmer", label: "Computer Programmer" },
    { value: "consultant", label: "Consultant" },
    { value: "contractor", label: "Contractor" },
    { value: "Content Creator", label: "Content Creator" },
    { value: "counsellor", label: "Counsellor" },
    { value: "Creative Person", label: "Creative Person" },
    { value: "Customer Support Professional", label: "Customer Support Professional" },
    { value: "Data Analyst", label: "Data Analyst" },
    { value: "Defence Employee", label: "Defence Employee" },
    { value: "dentist", label: "Dentist" },
    { value: "designer", label: "Designer" },
    { value: "Director / Chairman", label: "Director / Chairman" },
    { value: "doctor", label: "Doctor" },
    { value: "economist", label: "Economist" },
    { value: "Electrical Engineer", label: "Electrical Engineer" },
    { value: "engineer", label: "Engineer" },
    { value: "Entertainment Professional", label: "Entertainment Professional" },
    { value: "Event Manager", label: "Event Manager" },
    { value: "executive", label: "Executive" },
    { value: "Factory Worker", label: "Factory Worker" },
    { value: "farmer", label: "Farmer" },
    { value: "Fashion Designer", label: "Fashion Designer" },
    { value: "Finance Professional", label: "Finance Professional" },
    { value: "Food Technologist", label: "Food Technologist" },
    { value: "Government Employee", label: "Government Employee" },
    { value: "Graphic Designer", label: "Graphic Designer" },
    { value: "Hair Dresser", label: "Hair Dresser" },
    { value: "Health Care Professional", label: "Health Care Professional" },
    { value: "Hospitality Professional", label: "Hospitality Professional" },
    { value: "Hotel & Restaurant Professional", label: "Hotel & Restaurant Professional" },
    { value: "Human Resource Professional", label: "Human Resource Professional" },
    { value: "HSE Officer", label: "HSE Officer" },
    { value: "influencer", label: "Influencer" },
    { value: "Insurance Advisor", label: "Insurance Advisor" },
    { value: "Insurance Agent", label: "Insurance Agent" },
    { value: "Interior Designer", label: "Interior Designer" },
    { value: "Investment Professional", label: "Investment Professional" },
    { value: "IT / Telecom Professional", label: "IT / Telecom Professional" },
    { value: "Islamic Scholar", label: "Islamic Scholar" },
    { value: "Islamic Teacher", label: "Islamic Teacher" },
    { value: "journalist", label: "Journalist" },
    { value: "lawyer", label: "Lawyer" },
    { value: "lecturer", label: "Lecturer" },
    { value: "Legal Professional", label: "Legal Professional" },
    { value: "librarian", label: "Librarian" },
    { value: "Logistics Professional", label: "Logistics Professional" },
    { value: "manager", label: "Manager" },
    { value: "Marketing Professional", label: "Marketing Professional" },
    { value: "Mechanical Engineer", label: "Mechanical Engineer" },
    { value: "Medical Representative", label: "Medical Representative" },
    { value: "Medical Transcriptionist", label: "Medical Transcriptionist" },
    { value: "Merchant Naval Officer", label: "Merchant Naval Officer" },
    { value: "microbiologist", label: "Microbiologist" },
    { value: "military", label: "Military" },
    { value: "Nanny / Child Care Worker", label: "Nanny / Child Care Worker" },
    { value: "Navy Officer", label: "Navy Officer" },
    { value: "nurse", label: "Nurse" },
    { value: "Occupational Therapist", label: "Occupational Therapist" },
    { value: "Office Staff", label: "Office Staff" },
    { value: "optician", label: "Optician" },
    { value: "optometrist", label: "Optometrist" },
    { value: "pharmacist", label: "Pharmacist" },
    { value: "physician", label: "Physician" },
    { value: "Physician Assistant", label: "Physician Assistant" },
    { value: "pilot", label: "Pilot" },
    { value: "Police Officer", label: "Police Officer" },
    { value: "priest", label: "Priest" },
    { value: "Product Manager / Professional", label: "Product Manager / Professional" },
    { value: "professor", label: "Professor" },
    { value: "Project Manager", label: "Project Manager" },
    { value: "Public Relations Professional", label: "Public Relations Professional" },
    { value: "Real Estate Professional", label: "Real Estate Professional" },
    { value: "Research Scholar", label: "Research Scholar" },
    { value: "Retail Professional", label: "Retail Professional" },
    { value: "Sales Professional", label: "Sales Professional" },
    { value: "scientist", label: "Scientist" },
    { value: "Self-Employed", label: "Self-Employed" },
    { value: "Social Worker", label: "Social Worker" },
    { value: "Software Consultant", label: "Software Consultant" },
    { value: "Software Developer", label: "Software Developer" },
    { value: "Speech Therapist", label: "Speech Therapist" },
    { value: "sportsman", label: "Sportsman" },
    { value: "supervisor", label: "Supervisor" },
    { value: "teacher", label: "Teacher" },
    { value: "technician", label: "Technician" },
    { value: "Tour Guide", label: "Tour Guide" },
    { value: "trainer", label: "Trainer" },
    { value: "Transportation Professional", label: "Transportation Professional" },
    { value: "tutor", label: "Tutor" },
    { value: "Veterinary Doctor", label: "Veterinary Doctor" },
    { value: "videographer", label: "Videographer" },
    { value: "Web Designer", label: "Web Designer" },
    { value: "Web Developer", label: "Web Developer" },
    { value: "Wholesale Businessman", label: "Wholesale Businessman" },
    { value: "writer", label: "Writer" },
    { value: "zoologist", label: "Zoologist" },
    { value: "other", label: "Other" },
  ];

  const educationLevels = [
    { value: "Secondary School (10th)", label: "Secondary School (10th)" },
    { value: "Higher Secondary School (12th)", label: "Higher Secondary School (12th)" },
    { value: "ITI (Industrial Training Institute) / Trade School", label: "ITI (Industrial Training Institute) / Trade School" },
    { value: "Diploma (General)", label: "Diploma (General)" },
    { value: "Diploma in Engineering (Polytechnic)", label: "Diploma in Engineering (Polytechnic)" },
    { value: "Diploma in Computer Applications (DCA)", label: "Diploma in Computer Applications (DCA)" },
    { value: "D.Pharm (Diploma in Pharmacy)", label: "D.Pharm (Diploma in Pharmacy)" },
    { value: "D.Ed (Diploma in Education)", label: "D.Ed (Diploma in Education)" },
    { value: "Diploma in Nursing", label: "Diploma in Nursing" },
    { value: "Diploma in Hotel Management", label: "Diploma in Hotel Management" },
    { value: "Diploma in Fashion Design", label: "Diploma in Fashion Design" },
    { value: "Diploma in Interior Design", label: "Diploma in Interior Design" },
    { value: "Diploma in Multimedia/Animation/Design", label: "Diploma in Multimedia/Animation/Design" },
    { value: "Diploma in Early Childhood Education", label: "Diploma in Early Childhood Education" },
    { value: "Diploma in Special Education", label: "Diploma in Special Education" },
    { value: "Culinary Arts (Diploma/Degree)", label: "Culinary Arts (Diploma/Degree)" },
    { value: "Event Management (Diploma/MBA Specialization)", label: "Event Management (Diploma/MBA Specialization)" },
    { value: "Digital Marketing (PG Diploma/Certification)", label: "Digital Marketing (PG Diploma/Certification)" },
    { value: "Cybersecurity (Degree/Certification)", label: "Cybersecurity (Degree/Certification)" },
    { value: "Data Science (Degree/Certification)", label: "Data Science (Degree/Certification)" },
    { value: "Artificial Intelligence (Degree/Certification)", label: "Artificial Intelligence (Degree/Certification)" },
    { value: "Animation (Degree/Certification)", label: "Animation (Degree/Certification)" },
    { value: "Game Development (Degree/Certification)", label: "Game Development (Degree/Certification)" },
    { value: "Graphic Design (Degree/Certification)", label: "Graphic Design (Degree/Certification)" },
    { value: "Robotics (Degree/Certification)", label: "Robotics (Degree/Certification)" },
    { value: "Interior Design (Degree/Certification)", label: "Interior Design (Degree/Certification)" },
    { value: "Nursery/Primary Education", label: "Nursery/Primary Education" },
    { value: "Islamic Education (Diploma/Degree)", label: "Islamic Education (Diploma/Degree)" },
    { value: "Aalim / Aalimah", label: "Aalim / Aalimah" },
    { value: "Hafiz / Hafizah", label: "Hafiz / Hafizah" },
    { value: "ba", label: "BA (Bachelor of Arts)" },
    { value: "bsc", label: "BSc (Bachelor of Science)" },
    { value: "bcom", label: "BCom (Bachelor of Commerce)" },
    { value: "bba", label: "BBA (Bachelor of Business Administration)" },
    { value: "bca", label: "BCA (Bachelor of Computer Applications)" },
    { value: "BTech / BE (Bachelor of Technology / Engineering)", label: "BTech / BE (Bachelor of Technology / Engineering)" },
    { value: "Software Engineering (B.Tech/BE)", label: "Software Engineering (B.Tech/BE)" },
    { value: "Electronics & Communication Engineering (B.Tech/BE)", label: "Electronics & Communication Engineering (B.Tech/BE)" },
    { value: "Environmental Engineering (B.Tech/BE)", label: "Environmental Engineering (B.Tech/BE)" },
    { value: "Robotics Engineering (B.Tech/BE)", label: "Robotics Engineering (B.Tech/BE)" },
    { value: "barch", label: "B.Arch (Bachelor of Architecture)" },
    { value: "bds", label: "BDS (Bachelor of Dental Surgery)" },
    { value: "bed", label: "BEd (Bachelor of Education)" },
    { value: "bfa", label: "BFA (Bachelor of Fine Arts)" },
    { value: "bhm", label: "BHM (Bachelor of Hotel Management)" },
    { value: "BL / LLB (Bachelor of Law)", label: "BL / LLB (Bachelor of Law)" },
    { value: "BOT (Bachelor of Occupational Therapy)", label: "BOT (Bachelor of Occupational Therapy)" },
    { value: "BOA (Bachelor of Optometry & Ophthalmic Technology)", label: "BOA (Bachelor of Optometry & Ophthalmic Technology)" },
    { value: "bpharm", label: "BPharm (Bachelor of Pharmacy)" },
    { value: "bpt", label: "BPT (Bachelor of Physiotherapy)" },
    { value: "bsw", label: "BSW (Bachelor of Social Work)" },
    { value: "bttm", label: "BTTM (Bachelor of Travel & Tourism Management)" },
    { value: "bvsc", label: "BVSc (Bachelor of Veterinary Science)" },
    { value: "Hospitality Management (BHM/MHM)", label: "Hospitality Management (BHM/MHM)" },
    { value: "journalism", label: "Journalism (BA/MA Journalism & Mass Comm.)" },
    { value: "film_studies", label: "Film Studies (BA/MA)" },
    { value: "Sports Management (BBA/MBA Specialization)", label: "Sports Management (BBA/MBA Specialization)" },
    { value: "ca", label: "CA (Chartered Accountancy)" },
    { value: "cfa", label: "CFA (Chartered Financial Analyst)" },
    { value: "CMA / ICWA (Cost & Management Accounting)", label: "CMA / ICWA (Cost & Management Accounting)" },
    { value: "Company Secretary (CS)", label: "Company Secretary (CS)" },
    { value: "Actuarial Science (Professional Certification)", label: "Actuarial Science (Professional Certification)" },
    { value: "ma", label: "MA (Master of Arts)" },
    { value: "msc", label: "MSc (Master of Science)" },
    { value: "mcom", label: "MCom (Master of Commerce)" },
    { value: "mba", label: "MBA (Master of Business Administration)" },
    { value: "mca", label: "MCA (Master of Computer Applications)" },
    { value: "march", label: "M.Arch (Master of Architecture)" },
    { value: "mds", label: "MDS (Master of Dental Surgery)" },
    { value: "med", label: "MEd (Master of Education)" },
    { value: "mfa", label: "MFA (Master of Fine Arts)" },
    { value: "mhm", label: "MHM (Master of Hotel Management)" },
    { value: "llm", label: "LLM (Master of Laws)" },
    { value: "mot", label: "MOT (Master of Occupational Therapy)" },
    { value: "mpharm", label: "MPharm (Master of Pharmacy)" },
    { value: "mpt", label: "MPT (Master of Physiotherapy)" },
    { value: "MSc Nursing", label: "MSc Nursing" },
    { value: "msw", label: "MSW (Master of Social Work)" },
    { value: "mtm", label: "MTM (Master of Tourism Management)" },
    { value: "mvsc", label: "MVSc (Master of Veterinary Science)" },
    { value: "mphil", label: "MPhil (Master of Philosophy)" },
    { value: "MD/MS (Doctor of Medicine / Master of Surgery)", label: "MD/MS (Doctor of Medicine / Master of Surgery)" },
    { value: "mch", label: "MCh (Master of Chirurgiae – Super Specialty Surgery)" },
    { value: "dm", label: "DM (Doctorate of Medicine – Super Specialty)" },
    { value: "phd", label: "PhD (Doctor of Philosophy – All Subjects)" },
    { value: "PhD in Islamic Studies / Theology", label: "PhD in Islamic Studies / Theology" },
    { value: "Pharm.D (Doctor of Pharmacy)", label: "Pharm.D (Doctor of Pharmacy)" },
    { value: "Ed.D (Doctor of Education)", label: "Ed.D (Doctor of Education)" },
    { value: "other", label: "Other" },
  ];

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

  const [showTooltip, setShowTooltip] = useState(null);

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
            <div className="bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] px-8 py-6">
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
                      <span className="bg-[#FFC0E3] text-[#CB3B8B] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
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
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-white"
                              : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B] bg-white"
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
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-white"
                              : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B] bg-white"
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
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-white"
                              : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B] bg-white"
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
                        {isGenderReadonly() && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                            Auto-selected
                          </span>
                        )}
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                            {isGenderReadonly() 
                              ? "Gender is automatically selected based on the profile type (Brother/Son = Male, Sister/Daughter = Female)"
                              : "Select your gender from the dropdown"
                            }
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </label>
                      <Dropdown
                        options={getGenderOptions()}
                        name="gender"
                        value={profileData.gender}
                        onChange={(e) => handleFieldChange("gender", e.target.value)}
                        disabled={isGenderReadonly()}
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
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                      options={getMaritalStatusOptions(profileData.gender)}
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
                      <span className="bg-[#FFC0E3] text-[#CB3B8B] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
                      Current Address
                    </h3>
                </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Country */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>Country <span className="text-red-500">*</span></span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                        options={getCountries()}
                        name="country"
                        value={profileData.country}
                        onChange={(e) => handleFieldChange("country", e.target.value)}
                      />
                      {formErrors.country && (
                        <p className="text-red-500 text-sm">{formErrors.country}</p>
                      )}
                    </div>

                    {/* State */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>State <span className="text-red-500">*</span></span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                        options={getStates(profileData.country)}
                        name="state"
                        value={profileData.state}
                        onChange={(e) => handleFieldChange("state", e.target.value)}
                      />
                      {formErrors.state && (
                        <p className="text-red-500 text-sm">{formErrors.state}</p>
                      )}
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>City <span className="text-red-500">*</span></span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                        options={getCities(profileData.country, profileData.state)}
                        name="city"
                        value={profileData.city}
                        onChange={(e) => handleFieldChange("city", e.target.value)}
                      />
                      {formErrors.city && (
                        <p className="text-red-500 text-sm">{formErrors.city}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Native Place Section */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="bg-[#FFC0E3] text-[#CB3B8B] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</span>
                      Native Place
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Native Country */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>Native Country <span className="text-red-500">*</span></span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                        options={getCountries()}
                        name="native_country"
                        value={profileData.native_country}
                        onChange={(e) => handleFieldChange("native_country", e.target.value)}
                      />
                      {formErrors.native_country && (
                        <p className="text-red-500 text-sm">{formErrors.native_country}</p>
                      )}
                    </div>

                    {/* Native State */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>Native State <span className="text-red-500">*</span></span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                        options={getStates(profileData.native_country)}
                        name="native_state"
                        value={profileData.native_state}
                        onChange={(e) => handleFieldChange("native_state", e.target.value)}
                      />
                      {formErrors.native_state && (
                        <p className="text-red-500 text-sm">{formErrors.native_state}</p>
                      )}
                    </div>

                    {/* Native City */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>Native City <span className="text-red-500">*</span></span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                        options={getCities(profileData.native_country, profileData.native_state)}
                        name="native_city"
                        value={profileData.native_city}
                        onChange={(e) => handleFieldChange("native_city", e.target.value)}
                      />
                      {formErrors.native_city && (
                        <p className="text-red-500 text-sm">{formErrors.native_city}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Education & Profession Section */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="bg-[#FFC0E3] text-[#CB3B8B] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">4</span>
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
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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

                  {/* Job Description - Only show if profession or education is "other" (case insensitive) */}
                  {devLog("Debug - profession:", profileData.profession, "Education:", profileData.Education)}
                  {(profileData.profession?.toLowerCase() === 'other' || profileData.Education?.toLowerCase() === 'other') && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>Please describe your education & job/business <span className="text-red-500">*</span></span>
                      <div className="group relative tooltip-container">
                        <svg 
                          className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                          Provide a detailed description of your education and job role or business activities
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
                          : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                      }`}
                      placeholder="Describe your education and job or business in detail..."
                    />
                      {formErrors.describe_job_business && (
                          <p className="text-red-500 text-sm">{formErrors.describe_job_business}</p>
                      )}
                    </div>
                  )}

                </div>

                {/* Personal Details Section */}
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="bg-[#FFC0E3] text-[#CB3B8B] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">5</span>
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
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                    <div className="relative">
                      <select
                        value={profileData.disability || ""}
                        onChange={(e) => handleFieldChange("disability", e.target.value)}
                        className={`w-full h-12 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium appearance-none cursor-pointer ${
                            formErrors.disability
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                        }`}
                      >
                        <option value="">Select Disability Status</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  {formErrors.disability && (
                        <p className="text-red-500 text-sm">{formErrors.disability}</p>
                  )}
                </div>

                {/* Income Range */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>Income Range</span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                    <div className="relative">
                      <select
                        value={profileData.incomeRange || ""}
                        onChange={(e) => handleFieldChange("incomeRange", e.target.value)}
                        className={`w-full h-12 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium appearance-none cursor-pointer ${
                            formErrors.incomeRange
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                        }`}
                      >
                        <option value="">Select Income Range</option>
                        <option value="Below ₹2,00,000">Below ₹2,00,000</option>
                        <option value="₹2,00,000 - ₹5,00,000">₹2,00,000 - ₹5,00,000</option>
                        <option value="₹5,00,000 - ₹10,00,000">₹5,00,000 - ₹10,00,000</option>
                        <option value="₹10,00,000 - ₹20,00,000">₹10,00,000 - ₹20,00,000</option>
                        <option value="₹20,00,000 - ₹50,00,000">₹20,00,000 - ₹50,00,000</option>
                        <option value="Above ₹50,00,000">Above ₹50,00,000</option>
                        <option value="no_preference">No preference</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  {formErrors.incomeRange && (
                        <p className="text-red-500 text-sm">{formErrors.incomeRange}</p>
                  )}
                </div>

                    {/* Height */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        Height
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTooltipClick('height');
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-10 ${showTooltip === 'height' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            Select your height
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </label>
                      <select
                        name="height"
                        value={profileData.height || ""}
                        onChange={(e) => handleFieldChange("height", e.target.value)}
                        className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium ${
                          formErrors.height
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                        }`}
                      >
                        <option value="">Select your height</option>
                        {getHeightOptions().map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
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
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                            : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
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
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                            : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
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
                          className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                          : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                      }`}
                      placeholder="Tell us about yourself, your values, and what you're looking for..."
                    />
                    {formErrors.about_you && (
                      <p className="text-red-500 text-sm">{formErrors.about_you}</p>
                    )}
                  </div>

                  {/* Contact Number - Only show for agents adding new members or in edit mode */}
                  {(() => {
                    const role = localStorage.getItem('role');
                    // Show field if: agent is adding new member OR in edit mode
                    const shouldShowContactField = (role === 'agent' && isNewMember) || editMode;
                    
                    if (!shouldShowContactField) {
                      return null; // Hide field for regular users who registered
                    }
                  })()}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-pink-600 font-semibold">1</span>
                  </div>
                  <span>of 6 steps</span>
                </div>
                
                {/* Error Display */}
                {setErrors && typeof setErrors === 'string' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-red-700 text-sm font-medium">{setErrors}</p>
                    </div>
                  </div>
                )}
                
                {/* Submit Button */}
                <div className="flex justify-end pt-8 border-t border-gray-200">
                <button
                  onClick={naviagteNextStep}
                  type="button"
                    className="bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] text-white px-8 py-3 rounded-lg font-semibold hover:from-[#F971BC] hover:to-[#DA73AD] transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
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
