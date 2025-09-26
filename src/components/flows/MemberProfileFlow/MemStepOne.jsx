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
      'disability', 'type_of_disability', 'incomeRange', 'about_you'
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

  // Comprehensive country-state-city data structure
  const locationData = {
  india: {
    label: "India",
    states: {
      andhra_pradesh: {
        label: "Andhra Pradesh",
        cities: [
          { value: "visakhapatnam", label: "Visakhapatnam" },
          { value: "vijayawada", label: "Vijayawada" },
          { value: "tirupati", label: "Tirupati" },
          { value: "guntur", label: "Guntur" },
          { value: "nellore", label: "Nellore" }
        ]
      },
      arunachal_pradesh: {
        label: "Arunachal Pradesh",
        cities: [
          { value: "itanagar", label: "Itanagar" },
          { value: "pasighat", label: "Pasighat" },
          { value: "ziro", label: "Ziro" }
        ]
      },
      assam: {
        label: "Assam",
        cities: [
          { value: "guwahati", label: "Guwahati" },
          { value: "silchar", label: "Silchar" },
          { value: "dibrugarh", label: "Dibrugarh" },
          { value: "jorhat", label: "Jorhat" }
        ]
      },
      bihar: {
        label: "Bihar",
        cities: [
          { value: "patna", label: "Patna" },
          { value: "gaya", label: "Gaya" },
          { value: "bhagalpur", label: "Bhagalpur" },
          { value: "muzaffarpur", label: "Muzaffarpur" }
        ]
      },
      chhattisgarh: {
        label: "Chhattisgarh",
        cities: [
          { value: "raipur", label: "Raipur" },
          { value: "bilaspur", label: "Bilaspur" },
          { value: "durg", label: "Durg" }
        ]
      },
      goa: {
        label: "Goa",
        cities: [
          { value: "panaji", label: "Panaji" },
          { value: "margao", label: "Margao" },
          { value: "vasco_da_gama", label: "Vasco da Gama" }
        ]
      },
      gujarat: {
        label: "Gujarat",
        cities: [
          { value: "ahmedabad", label: "Ahmedabad" },
          { value: "surat", label: "Surat" },
          { value: "vadodara", label: "Vadodara" },
          { value: "rajkot", label: "Rajkot" },
          { value: "bhavnagar", label: "Bhavnagar" }
        ]
      },
      haryana: {
        label: "Haryana",
        cities: [
          { value: "gurgaon", label: "Gurgaon" },
          { value: "faridabad", label: "Faridabad" },
          { value: "panipat", label: "Panipat" },
          { value: "ambala", label: "Ambala" }
        ]
      },
      himachal_pradesh: {
        label: "Himachal Pradesh",
        cities: [
          { value: "shimla", label: "Shimla" },
          { value: "dharamshala", label: "Dharamshala" },
          { value: "manali", label: "Manali" }
        ]
      },
      jharkhand: {
        label: "Jharkhand",
        cities: [
          { value: "ranchi", label: "Ranchi" },
          { value: "jamshedpur", label: "Jamshedpur" },
          { value: "dhanbad", label: "Dhanbad" }
        ]
      },
      karnataka: {
        label: "Karnataka",
        cities: [
          { value: "bangalore", label: "Bangalore" },
          { value: "mysore", label: "Mysore" },
          { value: "hubli", label: "Hubli" },
          { value: "mangalore", label: "Mangalore" }
        ]
      },
      kerala: {
        label: "Kerala",
        cities: [
          { value: "thiruvananthapuram", label: "Thiruvananthapuram" },
          { value: "kochi", label: "Kochi" },
          { value: "kozhikode", label: "Kozhikode" },
          { value: "thrissur", label: "Thrissur" }
        ]
      },
      madhya_pradesh: {
        label: "Madhya Pradesh",
        cities: [
          { value: "bhopal", label: "Bhopal" },
          { value: "indore", label: "Indore" },
          { value: "gwalior", label: "Gwalior" },
          { value: "jabalpur", label: "Jabalpur" }
        ]
      },
      maharashtra: {
        label: "Maharashtra",
        cities: [
          { value: "mumbai", label: "Mumbai" },
          { value: "pune", label: "Pune" },
          { value: "nagpur", label: "Nagpur" },
          { value: "nashik", label: "Nashik" },
          { value: "aurangabad", label: "Aurangabad" }
        ]
      },
      manipur: {
        label: "Manipur",
        cities: [
          { value: "imphal", label: "Imphal" },
          { value: "thoubal", label: "Thoubal" }
        ]
      },
      meghalaya: {
        label: "Meghalaya",
        cities: [
          { value: "shillong", label: "Shillong" },
          { value: "tura", label: "Tura" }
        ]
      },
      mizoram: {
        label: "Mizoram",
        cities: [
          { value: "aizawl", label: "Aizawl" },
          { value: "lunglei", label: "Lunglei" }
        ]
      },
      nagaland: {
        label: "Nagaland",
        cities: [
          { value: "kohima", label: "Kohima" },
          { value: "dimapur", label: "Dimapur" }
        ]
      },
      odisha: {
        label: "Odisha",
        cities: [
          { value: "bhubaneswar", label: "Bhubaneswar" },
          { value: "cuttack", label: "Cuttack" },
          { value: "rourkela", label: "Rourkela" }
        ]
      },
      punjab: {
        label: "Punjab",
        cities: [
          { value: "ludhiana", label: "Ludhiana" },
          { value: "amritsar", label: "Amritsar" },
          { value: "jalandhar", label: "Jalandhar" },
          { value: "patiala", label: "Patiala" }
        ]
      },
      rajasthan: {
        label: "Rajasthan",
        cities: [
          { value: "jaipur", label: "Jaipur" },
          { value: "jodhpur", label: "Jodhpur" },
          { value: "udaipur", label: "Udaipur" },
          { value: "kota", label: "Kota" },
          { value: "bikaner", label: "Bikaner" }
        ]
      },
      sikkim: {
        label: "Sikkim",
        cities: [
          { value: "gangtok", label: "Gangtok" },
          { value: "namchi", label: "Namchi" }
        ]
      },
      tamil_nadu: {
        label: "Tamil Nadu",
        cities: [
          { value: "chennai", label: "Chennai" },
          { value: "coimbatore", label: "Coimbatore" },
          { value: "madurai", label: "Madurai" },
          { value: "tiruchirappalli", label: "Tiruchirappalli" }
        ]
      },
      telangana: {
        label: "Telangana",
        cities: [
          { value: "hyderabad", label: "Hyderabad" },
          { value: "warangal", label: "Warangal" },
          { value: "nizamabad", label: "Nizamabad" },
          { value: "khammam", label: "Khammam" }
        ]
      },
      tripura: {
        label: "Tripura",
        cities: [
          { value: "agartala", label: "Agartala" },
          { value: "dharamnagar", label: "Dharamnagar" }
        ]
      },
      uttar_pradesh: {
        label: "Uttar Pradesh",
        cities: [
          { value: "lucknow", label: "Lucknow" },
          { value: "kanpur", label: "Kanpur" },
          { value: "agra", label: "Agra" },
          { value: "varanasi", label: "Varanasi" },
          { value: "meerut", label: "Meerut" },
          { value: "prayagraj", label: "Prayagraj" }
        ]
      },
      uttarakhand: {
        label: "Uttarakhand",
        cities: [
          { value: "dehradun", label: "Dehradun" },
          { value: "haridwar", label: "Haridwar" },
          { value: "roorkee", label: "Roorkee" },
          { value: "nainital", label: "Nainital" }
        ]
      },
      west_bengal: {
        label: "West Bengal",
        cities: [
          { value: "kolkata", label: "Kolkata" },
          { value: "asansol", label: "Asansol" },
          { value: "siliguri", label: "Siliguri" },
          { value: "durgapur", label: "Durgapur" },
          { value: "howrah", label: "Howrah" }
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
    { value: "acting_professional", label: "Acting Professional" },
    { value: "actor", label: "Actor" },
    { value: "administrator", label: "Administrator" },
    { value: "advertising_professional", label: "Advertising Professional" },
    { value: "air_hostess", label: "Air Hostess" },
    { value: "airline_professional", label: "Airline Professional" },
    { value: "airforce", label: "Airforce" },
    { value: "architect", label: "Architect" },
    { value: "artist", label: "Artist" },
    { value: "assistant_professor", label: "Assistant Professor" },
    { value: "audiologist", label: "Audiologist" },
    { value: "auditor", label: "Auditor" },
    { value: "bank_officer", label: "Bank Officer" },
    { value: "bank_staff", label: "Bank Staff" },
    { value: "beautician", label: "Beautician" },
    { value: "biologist_botanist", label: "Biologist / Botanist" },
    { value: "business_person", label: "Business Person" },
    { value: "captain", label: "Captain" },
    { value: "ceo_cto_president", label: "CEO / CTO / President" },
    { value: "chemist", label: "Chemist" },
    { value: "civil_engineer", label: "Civil Engineer" },
    { value: "clerical_official", label: "Clerical Official" },
    { value: "clinical_pharmacist", label: "Clinical Pharmacist" },
    { value: "company_secretary", label: "Company Secretary" },
    { value: "computer_engineer", label: "Computer Engineer" },
    { value: "computer_programmer", label: "Computer Programmer" },
    { value: "consultant", label: "Consultant" },
    { value: "contractor", label: "Contractor" },
    { value: "content_creator", label: "Content Creator" },
    { value: "counsellor", label: "Counsellor" },
    { value: "creative_person", label: "Creative Person" },
    { value: "customer_support_professional", label: "Customer Support Professional" },
    { value: "data_analyst", label: "Data Analyst" },
    { value: "defence_employee", label: "Defence Employee" },
    { value: "dentist", label: "Dentist" },
    { value: "designer", label: "Designer" },
    { value: "director_chairman", label: "Director / Chairman" },
    { value: "doctor", label: "Doctor" },
    { value: "economist", label: "Economist" },
    { value: "electrical_engineer", label: "Electrical Engineer" },
    { value: "engineer", label: "Engineer" },
    { value: "entertainment_professional", label: "Entertainment Professional" },
    { value: "event_manager", label: "Event Manager" },
    { value: "executive", label: "Executive" },
    { value: "factory_worker", label: "Factory Worker" },
    { value: "farmer", label: "Farmer" },
    { value: "fashion_designer", label: "Fashion Designer" },
    { value: "finance_professional", label: "Finance Professional" },
    { value: "food_technologist", label: "Food Technologist" },
    { value: "government_employee", label: "Government Employee" },
    { value: "graphic_designer", label: "Graphic Designer" },
    { value: "hair_dresser", label: "Hair Dresser" },
    { value: "health_care_professional", label: "Health Care Professional" },
    { value: "hospitality_professional", label: "Hospitality Professional" },
    { value: "hotel_restaurant_professional", label: "Hotel & Restaurant Professional" },
    { value: "human_resource_professional", label: "Human Resource Professional" },
    { value: "hse_officer", label: "HSE Officer" },
    { value: "influencer", label: "Influencer" },
    { value: "insurance_advisor", label: "Insurance Advisor" },
    { value: "insurance_agent", label: "Insurance Agent" },
    { value: "interior_designer", label: "Interior Designer" },
    { value: "investment_professional", label: "Investment Professional" },
    { value: "it_telecom_professional", label: "IT / Telecom Professional" },
    { value: "islamic_scholar", label: "Islamic Scholar" },
    { value: "islamic_teacher", label: "Islamic Teacher" },
    { value: "journalist", label: "Journalist" },
    { value: "lawyer", label: "Lawyer" },
    { value: "lecturer", label: "Lecturer" },
    { value: "legal_professional", label: "Legal Professional" },
    { value: "librarian", label: "Librarian" },
    { value: "logistics_professional", label: "Logistics Professional" },
    { value: "manager", label: "Manager" },
    { value: "marketing_professional", label: "Marketing Professional" },
    { value: "mechanical_engineer", label: "Mechanical Engineer" },
    { value: "medical_representative", label: "Medical Representative" },
    { value: "medical_transcriptionist", label: "Medical Transcriptionist" },
    { value: "merchant_naval_officer", label: "Merchant Naval Officer" },
    { value: "microbiologist", label: "Microbiologist" },
    { value: "military", label: "Military" },
    { value: "nanny_child_care_worker", label: "Nanny / Child Care Worker" },
    { value: "navy_officer", label: "Navy Officer" },
    { value: "nurse", label: "Nurse" },
    { value: "occupational_therapist", label: "Occupational Therapist" },
    { value: "office_staff", label: "Office Staff" },
    { value: "optician", label: "Optician" },
    { value: "optometrist", label: "Optometrist" },
    { value: "pharmacist", label: "Pharmacist" },
    { value: "physician", label: "Physician" },
    { value: "physician_assistant", label: "Physician Assistant" },
    { value: "pilot", label: "Pilot" },
    { value: "police_officer", label: "Police Officer" },
    { value: "priest", label: "Priest" },
    { value: "product_manager_professional", label: "Product Manager / Professional" },
    { value: "professor", label: "Professor" },
    { value: "project_manager", label: "Project Manager" },
    { value: "public_relations_professional", label: "Public Relations Professional" },
    { value: "real_estate_professional", label: "Real Estate Professional" },
    { value: "research_scholar", label: "Research Scholar" },
    { value: "retail_professional", label: "Retail Professional" },
    { value: "sales_professional", label: "Sales Professional" },
    { value: "scientist", label: "Scientist" },
    { value: "self_employed", label: "Self-Employed" },
    { value: "social_worker", label: "Social Worker" },
    { value: "software_consultant", label: "Software Consultant" },
    { value: "software_developer", label: "Software Developer" },
    { value: "speech_therapist", label: "Speech Therapist" },
    { value: "sportsman", label: "Sportsman" },
    { value: "supervisor", label: "Supervisor" },
    { value: "teacher", label: "Teacher" },
    { value: "technician", label: "Technician" },
    { value: "tour_guide", label: "Tour Guide" },
    { value: "trainer", label: "Trainer" },
    { value: "transportation_professional", label: "Transportation Professional" },
    { value: "tutor", label: "Tutor" },
    { value: "veterinary_doctor", label: "Veterinary Doctor" },
    { value: "videographer", label: "Videographer" },
    { value: "web_designer", label: "Web Designer" },
    { value: "web_developer", label: "Web Developer" },
    { value: "wholesale_businessman", label: "Wholesale Businessman" },
    { value: "writer", label: "Writer" },
    { value: "zoologist", label: "Zoologist" },
    { value: "other", label: "Other" },
  ];

  const educationLevels = [
    { value: "secondary_school_10th", label: "Secondary School (10th)" },
    { value: "higher_secondary_12th", label: "Higher Secondary School (12th)" },
    { value: "iti_trade_school", label: "ITI (Industrial Training Institute) / Trade School" },
    { value: "diploma_general", label: "Diploma (General)" },
    { value: "diploma_engineering", label: "Diploma in Engineering (Polytechnic)" },
    { value: "diploma_computer_applications", label: "Diploma in Computer Applications (DCA)" },
    { value: "diploma_pharmacy", label: "D.Pharm (Diploma in Pharmacy)" },
    { value: "diploma_education", label: "D.Ed (Diploma in Education)" },
    { value: "diploma_nursing", label: "Diploma in Nursing" },
    { value: "diploma_hotel_management", label: "Diploma in Hotel Management" },
    { value: "diploma_fashion_design", label: "Diploma in Fashion Design" },
    { value: "diploma_interior_design", label: "Diploma in Interior Design" },
    { value: "diploma_multimedia_animation", label: "Diploma in Multimedia/Animation/Design" },
    { value: "diploma_early_childhood_education", label: "Diploma in Early Childhood Education" },
    { value: "diploma_special_education", label: "Diploma in Special Education" },
    { value: "diploma_culinary_arts", label: "Culinary Arts (Diploma/Degree)" },
    { value: "diploma_event_management", label: "Event Management (Diploma/MBA Specialization)" },
    { value: "diploma_digital_marketing", label: "Digital Marketing (PG Diploma/Certification)" },
    { value: "diploma_cybersecurity", label: "Cybersecurity (Degree/Certification)" },
    { value: "diploma_data_science", label: "Data Science (Degree/Certification)" },
    { value: "diploma_artificial_intelligence", label: "Artificial Intelligence (Degree/Certification)" },
    { value: "diploma_animation", label: "Animation (Degree/Certification)" },
    { value: "diploma_game_development", label: "Game Development (Degree/Certification)" },
    { value: "diploma_graphic_design", label: "Graphic Design (Degree/Certification)" },
    { value: "diploma_robotics", label: "Robotics (Degree/Certification)" },
    { value: "diploma_interior_design_degree", label: "Interior Design (Degree/Certification)" },
    { value: "nursery_primary_education", label: "Nursery/Primary Education" },
    { value: "islamic_education", label: "Islamic Education (Diploma/Degree)" },
    { value: "aalim_aalimah", label: "Aalim / Aalimah" },
    { value: "hafiz_hafizah", label: "Hafiz / Hafizah" },
    { value: "ba", label: "BA (Bachelor of Arts)" },
    { value: "bsc", label: "BSc (Bachelor of Science)" },
    { value: "bcom", label: "BCom (Bachelor of Commerce)" },
    { value: "bba", label: "BBA (Bachelor of Business Administration)" },
    { value: "bca", label: "BCA (Bachelor of Computer Applications)" },
    { value: "btech_be", label: "BTech / BE (Bachelor of Technology / Engineering)" },
    { value: "software_engineering", label: "Software Engineering (B.Tech/BE)" },
    { value: "electronics_communication_engineering", label: "Electronics & Communication Engineering (B.Tech/BE)" },
    { value: "environmental_engineering", label: "Environmental Engineering (B.Tech/BE)" },
    { value: "robotics_engineering", label: "Robotics Engineering (B.Tech/BE)" },
    { value: "barch", label: "B.Arch (Bachelor of Architecture)" },
    { value: "bds", label: "BDS (Bachelor of Dental Surgery)" },
    { value: "bed", label: "BEd (Bachelor of Education)" },
    { value: "bfa", label: "BFA (Bachelor of Fine Arts)" },
    { value: "bhm", label: "BHM (Bachelor of Hotel Management)" },
    { value: "bl_llb", label: "BL / LLB (Bachelor of Law)" },
    { value: "bot", label: "BOT (Bachelor of Occupational Therapy)" },
    { value: "boa", label: "BOA (Bachelor of Optometry & Ophthalmic Technology)" },
    { value: "bpharm", label: "BPharm (Bachelor of Pharmacy)" },
    { value: "bpt", label: "BPT (Bachelor of Physiotherapy)" },
    { value: "bsw", label: "BSW (Bachelor of Social Work)" },
    { value: "bttm", label: "BTTM (Bachelor of Travel & Tourism Management)" },
    { value: "bvsc", label: "BVSc (Bachelor of Veterinary Science)" },
    { value: "hospitality_management", label: "Hospitality Management (BHM/MHM)" },
    { value: "journalism", label: "Journalism (BA/MA Journalism & Mass Comm.)" },
    { value: "film_studies", label: "Film Studies (BA/MA)" },
    { value: "sports_management", label: "Sports Management (BBA/MBA Specialization)" },
    { value: "ca", label: "CA (Chartered Accountancy)" },
    { value: "cfa", label: "CFA (Chartered Financial Analyst)" },
    { value: "cma_icwa", label: "CMA / ICWA (Cost & Management Accounting)" },
    { value: "company_secretary", label: "Company Secretary (CS)" },
    { value: "actuarial_science", label: "Actuarial Science (Professional Certification)" },
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
    { value: "msc_nursing", label: "MSc Nursing" },
    { value: "msw", label: "MSW (Master of Social Work)" },
    { value: "mtm", label: "MTM (Master of Tourism Management)" },
    { value: "mvsc", label: "MVSc (Master of Veterinary Science)" },
    { value: "mphil", label: "MPhil (Master of Philosophy)" },
    { value: "md_ms", label: "MD/MS (Doctor of Medicine / Master of Surgery)" },
    { value: "mch", label: "MCh (Master of Chirurgiae – Super Specialty Surgery)" },
    { value: "dm", label: "DM (Doctorate of Medicine – Super Specialty)" },
    { value: "phd", label: "PhD (Doctor of Philosophy – All Subjects)" },
    { value: "phd_islamic_studies", label: "PhD in Islamic Studies / Theology" },
    { value: "pharm_d", label: "Pharm.D (Doctor of Pharmacy)" },
    { value: "ed_d", label: "Ed.D (Doctor of Education)" },
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
                          className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium bg-gray-100 cursor-not-allowed ${
                          formErrors.first_name
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                          }`}
                          placeholder="Enter your first name"
                          disabled
                          readOnly
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
                          className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium bg-gray-100 cursor-not-allowed ${
                        formErrors.last_name
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                          }`}
                          placeholder="Enter your last name"
                          disabled
                          readOnly
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
                          className={`w-full h-12 px-4 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium bg-gray-100 cursor-not-allowed ${
                            formErrors.dob
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                          }`}
                          disabled
                          readOnly
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
                        disabled={true}
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
                        <option value="below_2lac">Below ₹2,00,000</option>
                        <option value="2lac_to_5lac">₹2,00,000 - ₹5,00,000</option>
                        <option value="5lac_to_10lac">₹5,00,000 - ₹10,00,000</option>
                        <option value="10lac_to_20lac">₹10,00,000 - ₹20,00,000</option>
                        <option value="20lac_to_50lac">₹20,00,000 - ₹50,00,000</option>
                        <option value="above_50lac">Above ₹50,00,000</option>
                        <option value="no_preference">No preference</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
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
