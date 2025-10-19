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
  const [formErrors, setFormErrors] = useState({});
  const [setErrors, setsetErrors] = useState(null);
  const [member_id, setmemErrors] = useState(null);
  const location = useLocation();
  const { username, age, isNewMember, clearForm, editMode, memberId } = location.state || {};
  console.log(username, ">>>>>>>");
  console.log("Edit Mode:", editMode, "Member ID:", memberId);
  
  // Determine userId based on the context
  let userId;
  if (editMode && memberId) {
    // When editing a member, use the memberId from the state
    userId = memberId;
    console.log("MemStepOne: Using memberId for edit mode:", userId);
  } else if (username == "memberCreation") {
    userId = localStorage.getItem("member_id");
  } else if (isNewMember && clearForm) {
    userId = null; // This will prevent fetching existing user data
  } else {
    userId = localStorage.getItem("userId");
  }

  useEffect(() => {
    console.log("Current userId:", userId, "Edit Mode:", editMode, "Member ID:", memberId);
    if (userId) {
      const parameter = {
        url: `/api/user/${userId}/`,
        setterFunction: setApiData,
        setLoading: setLoading,
        setErrors: setsetErrors,
      };
      fetchDataObjectV2(parameter);
    }
  }, [userId, editMode, memberId]);

  useEffect(() => {
    if (apiData && !(isNewMember && clearForm)) {
      console.log("Setting form data for user:", apiData.id, "Edit Mode:", editMode);
      // Auto-determine gender based on on_behalf if not already set
      let autoGender = apiData.gender;
      if (apiData.onbehalf && !apiData.gender) {
        if (apiData.onbehalf === 'Brother' || apiData.onbehalf === 'Son') {
          autoGender = 'male';
        } else if (apiData.onbehalf === 'Sister' || apiData.onbehalf === 'Daughter') {
          autoGender = 'female';
        }
      }

      setProfileData({
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
      });
    }
  }, [apiData, isNewMember, clearForm]);

  const naviagteNextStep = () => {
    if (handleValidForm()) {
      console.log(profileData.hieght, "valid");
      console.log("Navigation context:", { username, isNewMember, editMode, memberId, userId });
      console.log("Profile data before submission:", profileData);
      let mem = {};
      if (username == "memberCreation" || isNewMember) {
        // Additional validation before API call
        if (!profileData.email?.trim()) {
          setsetErrors("Email is required for member creation. Please fill in the email field.");
          // Auto-clear error after 5 seconds
          setTimeout(() => setsetErrors(null), 5000);
          return;
        }
        if (!profileData.password?.trim()) {
          setsetErrors("Password is required for member creation. Please fill in the password field.");
          setTimeout(() => setsetErrors(null), 5000);
          return;
        }
        if (!profileData.phone_number?.trim()) {
          setsetErrors("Phone number is required for member creation. Please fill in the phone number field.");
          setTimeout(() => setsetErrors(null), 5000);
          return;
        }
        if (!profileData.confirm_password?.trim()) {
          setsetErrors("Please confirm your password before creating the member.");
          setTimeout(() => setsetErrors(null), 5000);
          return;
        }
        if (profileData.password !== profileData.confirm_password) {
          setsetErrors("Passwords do not match. Please check your password and confirm password fields.");
          setTimeout(() => setsetErrors(null), 5000);
          return;
        }
        
        mem = {
          agent_id: localStorage.getItem("userId") || "",
          confirm_password: profileData.confirm_password || "",
          password: profileData.password || "",
          email: profileData.email || "",
          phone_number: profileData.phone_number || "",
        };
        console.log("Member creation payload:", mem);
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
          ...mem,
        },
        navigate: navigate,
        useracreate: "memberCreation",
        navUrl: `/memsteptwo/${userId}`,
        setErrors: setsetErrors,
      };
      console.log("MemStepOne: Navigating to MemStepTwo with userId:", userId);
      if (username == "memberCreation" || isNewMember) {
        console.log("Creating new member - using POST request");
        // Clear any existing member_id to ensure new member creation
        localStorage.removeItem("member_id");
        // Always use POST for new member creation
        updatePostDataReturnId(parameters);
      } else if (editMode) {
        console.log("Editing existing member - using PUT request");
        // Use PUT for editing existing member
        updateDataReturnId(parameters);
      } else {
        // Use PUT for regular user updates
        updateDataReturnId(parameters);
      }
    }
  };

  const handleFieldChange = (field, value) => {
    console.log(field, value, ">>>>>");
    
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
      'disability', 'type_of_disability', 'incomeRange', 'about_you',
      'email', 'phone_number', 'password', 'confirm_password'
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

    // Validate About You - Only required if profession or education is "other"
    if ((profileData.profession === 'other' || profileData.Education === 'other') && !profileData.describe_job_business?.trim()) {
      newErrors.describe_job_business = "Please describe your education & job/business";
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

    // Validate email, password fields for new member creation
    if (username === "memberCreation" || isNewMember) {
      // Validate Email
      if (!profileData.email?.trim()) {
        newErrors.email = "Email is required for member creation";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      // Validate Phone Number
      if (!profileData.phone_number?.trim()) {
        newErrors.phone_number = "Phone number is required for member creation";
      } else if (!/^[0-9+\-\s()]{10,15}$/.test(profileData.phone_number)) {
        newErrors.phone_number = "Please enter a valid phone number";
      }

      // Validate Password
      if (!profileData.password?.trim()) {
        newErrors.password = "Password is required for member creation";
      } else if (profileData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long";
      }

      // Validate Confirm Password
      if (!profileData.confirm_password?.trim()) {
        newErrors.confirm_password = "Please confirm your password";
      } else if (profileData.password !== profileData.confirm_password) {
        newErrors.confirm_password = "Passwords do not match";
      }
    }

    console.log("newErrors", newErrors);

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
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
  });

  // Initialize phone number with agent's phone number for new member creation
  useEffect(() => {
    if ((username === "memberCreation" || isNewMember) && !profileData.phone_number) {
      // Fetch agent's phone number and set it as default
      const agentId = localStorage.getItem("userId");
      if (agentId) {
        const parameter = {
          url: `/api/user/${agentId}/`,
          setterFunction: (agentData) => {
            if (agentData && agentData.phone_number) {
              setProfileData(prev => ({
                ...prev,
                phone_number: agentData.phone_number
              }));
            }
          },
          setLoading: () => {},
          setErrors: () => {},
        };
        fetchDataObjectV2(parameter);
      }
    }
  }, [username, isNewMember, profileData.phone_number]);

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
                        options={genders}
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

                  {/* Job Description - Only show if profession or education is "other" */}
                  {(profileData.profession === 'other' || profileData.Education === 'other') && (
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
                        <span>Income Range <span className="text-red-500">*</span></span>
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
                        Height (M)
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                            : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
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
                </div>

                {/* Member Creation Fields */}
                {(username === "memberCreation" || isNewMember) && (
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
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                          name="email"
                          value={profileData?.email || ""}
                          onChange={(e) => handleFieldChange("email", e.target.value)}
                          className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium ${
                            formErrors.email
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                          }`}
                          placeholder="Enter your email address"
                        />
                        {formErrors.email && (
                          <p className="text-red-500 text-sm">{formErrors.email}</p>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          Phone Number <span className="text-red-500">*</span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('phone_number');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-10 ${showTooltip === 'phone_number' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Phone number will be inherited from agent's account
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <input
                          type="tel"
                          name="phone_number"
                          value={profileData?.phone_number || ""}
                          onChange={(e) => handleFieldChange("phone_number", e.target.value)}
                          className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium ${
                            formErrors.phone_number
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                          }`}
                          placeholder="Enter phone number"
                        />
                        {formErrors.phone_number && (
                          <p className="text-red-500 text-sm">{formErrors.phone_number}</p>
                        )}
                      </div>

                      {/* Password */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          Password <span className="text-red-500">*</span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                          name="password"
                          value={profileData?.password || ""}
                          onChange={(e) => handleFieldChange("password", e.target.value)}
                          className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CB3B8B] focus:border-[#CB3B8B] transition-all duration-200 text-sm font-medium"
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
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                          name="confirm_password"
                          value={profileData?.confirm_password || ""}
                          onChange={(e) => handleFieldChange("confirm_password", e.target.value)}
                          className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CB3B8B] focus:border-[#CB3B8B] transition-all duration-200 text-sm font-medium"
                          placeholder="Confirm your password"
                        />
                        {formErrors.confirm_password && (
                          <p className="text-red-500 text-sm">{formErrors.confirm_password}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
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
