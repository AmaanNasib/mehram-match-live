import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchDataObjectV2, updateDataV2 } from "../../../apiUtils";
import StepTracker from "../../StepTracker/StepTracker";

const MemStepFour = () => {
  const navigate = useNavigate();
  let [userId] = useState(localStorage.getItem("userId"));
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showTooltip, setShowTooltip] = useState(null);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState("");
  
  userId = localStorage.getItem("member_id") || userId;
  const [profileData, setProfileData] = useState({
    preferred_surname: "",
    preferred_dargah_fatiha_niyah: [],
    preferred_sect: "",
    desired_practicing_level: "",
    preferred_city_state: "",
    preferred_family_type: "",
    preferred_family_background: "",
    preferred_education: "",
    preferred_occupation_profession: "",
    preferred_city: "",
    preferred_country: "",
    preferred_state: "",
  });

  // useEffect(() => {
  //   setTimeout(() => {
  //     setErrors(null);
  //   }, 5000);
  // }, [errors]);
  useEffect(() => {
    if (userId) {
      const parameter = {
        url: `/api/user/${userId}/`,
        setterFunction: setApiData,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataObjectV2(parameter);
    }
  }, [userId]);
  useEffect(() => {
    if (apiData) {
      setProfileData({
        preferred_surname: apiData.preferred_surname,
        preferred_dargah_fatiha_niyah: apiData.preferred_dargah_fatiha_niyah ? 
          (Array.isArray(apiData.preferred_dargah_fatiha_niyah) ? 
            apiData.preferred_dargah_fatiha_niyah : 
            (typeof apiData.preferred_dargah_fatiha_niyah === 'string' && apiData.preferred_dargah_fatiha_niyah.includes(',')) ?
            apiData.preferred_dargah_fatiha_niyah.split(',') :
            [apiData.preferred_dargah_fatiha_niyah]) : [],
        preferred_sect: apiData.preferred_sect,
        desired_practicing_level: apiData.desired_practicing_level,
        preferred_city_state: apiData.preferred_city_state,
        preferred_family_type: apiData.preferred_family_type,
        preferred_family_background: apiData.preferred_family_background,
        preferred_education: apiData.preferred_education,
        preferred_city: apiData.preferred_city,
        preferred_country: apiData.preferred_country,
        preferred_state: apiData.preferred_state,
        preferred_occupation_profession:
          apiData.preferred_occupation_profession,
      });
    }
  }, [apiData]);

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
      'preferred_sect', 'preferred_dargah_fatiha_niyah', 'desired_practicing_level', 'preferred_family_type',
      'preferred_country', 'preferred_state', 'preferred_city'
    ];

    // Validate Preferred Sect
    if (!profileData.preferred_sect?.trim()) {
      newErrors.preferred_sect = "Preferred sect is required";
    }

    // Validate Dargah/Fatiha/Niyah
    if (!profileData.preferred_dargah_fatiha_niyah || profileData.preferred_dargah_fatiha_niyah.length === 0) {
      newErrors.preferred_dargah_fatiha_niyah = "Please select at least one option for Dargah/Fatiha/Niyah";
    }

    // Validate Desired Practicing Level
    if (!profileData.desired_practicing_level) {
      newErrors.desired_practicing_level = "Desired practicing level is required";
    }

    // Validate Preferred Family Type
    if (!profileData.preferred_family_type) {
      newErrors.preferred_family_type = "Preferred family type is required";
    }

    // Validate Preferred Country
    if (!profileData.preferred_country) {
      newErrors.preferred_country = "Preferred country is required";
    }

    // Validate Preferred State
    if (!profileData.preferred_state) {
      newErrors.preferred_state = "Preferred state is required";
    }

    // Validate Preferred City
    if (!profileData.preferred_city) {
      newErrors.preferred_city = "Preferred city is required";
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
    const parameters = {
      url: `/api/user/${userId}`,
      payload: {
        preferred_surname: profileData.preferred_surname,
        preferred_dargah_fatiha_niyah: Array.isArray(profileData.preferred_dargah_fatiha_niyah) 
          ? profileData.preferred_dargah_fatiha_niyah.join(',') 
          : profileData.preferred_dargah_fatiha_niyah,
        preferred_sect: profileData.preferred_sect,
        desired_practicing_level: profileData.desired_practicing_level,
        preferred_city_state: profileData.preferred_city_state,
        preferred_family_type: profileData.preferred_family_type,
        preferred_family_background: profileData.preferred_family_background,
        preferred_education: profileData.preferred_education,
        preferred_occupation_profession:
          profileData.preferred_occupation_profession,
        preferred_city: profileData.preferred_city,
        preferred_country: profileData.preferred_country,
        preferred_state: profileData.preferred_state,
      },
      navigate: navigate,
      navUrl: `/memstepfive`,
      setErrors: setErrors,
    };

    console.log(validateForm());

    if (validateForm()) {
      updateDataV2(parameters);
    }
  };

  const updateField = (field, value) => {
    setProfileData((prevState) => {
      const newState = {
        ...prevState,
        [field]: value,
      };

      // Handle cascading dropdown logic for preferred location
      if (field === 'preferred_country') {
        // Reset state and city when country changes
        newState.preferred_state = '';
        newState.preferred_city = '';
      } else if (field === 'preferred_state') {
        // Reset city when state changes
        newState.preferred_city = '';
      }

      return newState;
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

  const skip = () => {
    if (
      profileData.preferred_dargah_fatiha_niyah &&
      profileData.preferred_sect &&
      profileData.desired_practicing_level &&
      profileData.preferred_family_type
    ) {
      navigate(`/memstepfive/${userId}`);
    } else {
      setErrors("Please fill all the required fields");
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
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 focus:border-pink-500"
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
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-500 shadow-lg shadow-pink-200'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 shadow-sm hover:shadow-md'
                }`}
              >
                <span className="relative z-10">{option.label}</span>
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl opacity-90"></div>
                )}
              </button>
            );
          })}
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
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

  // Practicing level options
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

  // Family type options
  const familyTypeOptions = [
    { value: "Nuclear Family", label: "Nuclear Family" },
    { value: "Joint Family", label: "Joint Family" },
    { value: "Extended Family", label: "Extended Family" },
    { value: "Single-Parent Family", label: "Single-Parent Family" },
    { value: "Blended Family", label: "Blended Family" },
    { value: "Living Alone", label: "Living Alone" },
    { value: "Prefer not to say", label: "Prefer not to say" },
  ];

  // Education options
  const educationOptions = [
    { value: "High School", label: "High School" },
    { value: "Undergraduate", label: "Undergraduate" },
    { value: "Postgraduate", label: "Postgraduate" },
    { value: "Doctorate", label: "Doctorate" },
    { value: "Professional Degree", label: "Professional Degree" },
    { value: "Other", label: "Other" },
  ];

  // Yes/No options
  const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
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
    usa: {
      label: "USA",
      states: {
        california: {
          label: "California",
          cities: [
            { value: "los_angeles", label: "Los Angeles" },
            { value: "san_francisco", label: "San Francisco" },
            { value: "san_diego", label: "San Diego" },
            { value: "sacramento", label: "Sacramento" }
          ]
        },
        new_york: {
          label: "New York",
          cities: [
            { value: "new_york_city", label: "New York City" },
            { value: "buffalo", label: "Buffalo" },
            { value: "rochester", label: "Rochester" }
          ]
        },
        texas: {
          label: "Texas",
          cities: [
            { value: "houston", label: "Houston" },
            { value: "dallas", label: "Dallas" },
            { value: "austin", label: "Austin" }
          ]
        },
        florida: {
          label: "Florida",
          cities: [
            { value: "miami", label: "Miami" },
            { value: "orlando", label: "Orlando" },
            { value: "tampa", label: "Tampa" }
          ]
        }
      }
    },
    canada: {
      label: "Canada",
      states: {
        ontario: {
          label: "Ontario",
          cities: [
            { value: "toronto", label: "Toronto" },
            { value: "ottawa", label: "Ottawa" },
            { value: "hamilton", label: "Hamilton" }
          ]
        },
        quebec: {
          label: "Quebec",
          cities: [
            { value: "montreal", label: "Montreal" },
            { value: "quebec_city", label: "Quebec City" }
          ]
        },
        british_columbia: {
          label: "British Columbia",
          cities: [
            { value: "vancouver", label: "Vancouver" },
            { value: "victoria", label: "Victoria" }
          ]
        }
      }
    },
    australia: {
      label: "Australia",
      states: {
        new_south_wales: {
          label: "New South Wales",
          cities: [
            { value: "sydney", label: "Sydney" },
            { value: "newcastle", label: "Newcastle" },
            { value: "wollongong", label: "Wollongong" }
          ]
        },
        victoria: {
          label: "Victoria",
          cities: [
            { value: "melbourne", label: "Melbourne" },
            { value: "geelong", label: "Geelong" }
          ]
        },
        queensland: {
          label: "Queensland",
          cities: [
            { value: "brisbane", label: "Brisbane" },
            { value: "gold_coast", label: "Gold Coast" }
          ]
        }
      }
    },
    uk: {
      label: "United Kingdom",
      states: {
        england: {
          label: "England",
          cities: [
            { value: "london", label: "London" },
            { value: "manchester", label: "Manchester" },
            { value: "birmingham", label: "Birmingham" }
          ]
        },
        scotland: {
          label: "Scotland",
          cities: [
            { value: "edinburgh", label: "Edinburgh" },
            { value: "glasgow", label: "Glasgow" }
          ]
        },
        wales: {
          label: "Wales",
          cities: [
            { value: "cardiff", label: "Cardiff" },
            { value: "swansea", label: "Swansea" }
          ]
        }
      }
    }
  };

  // Helper functions for location dropdowns
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
    return locationData[country].states[state].cities;
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
            <StepTracker percentage={75} />
          </div>

          {/* Desktop and Form Container */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Step Tracker - Professional sidebar layout */}
            <div className="lg:block hidden">
              <StepTracker percentage={75} />
            </div>

            {/* Main Form Container */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex-1">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100 text-sm font-medium uppercase tracking-wide">
                      Step 4 of 6
                    </p>
                    <h2 className="text-2xl font-bold text-white mt-1">
                      Partner Expectations
                    </h2>
                  </div>
                  <div className="bg-white/20 rounded-full p-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <form className="space-y-8">
                  {/* Partner Expectations Section */}
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
                        Partner Preferences
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">
                        Share your expectations and preferences for your ideal partner
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Preferred Surname */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Preferred Surname</span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                              fill="none"
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('preferred_surname');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'preferred_surname' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Enter your preferred surname for your partner
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <input
                          type="text"
                          name="preferred_surname"
                          value={profileData.preferred_surname || ""}
                          placeholder="Enter preferred surname"
                          className="w-full h-12 px-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-sm font-medium"
                          onChange={(e) => updateField("preferred_surname", e.target.value)}
                        />
                      </div>

                      {/* Preferred Sect */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Preferred Sect <span className="text-red-500">*</span></span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                              fill="none"
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('preferred_sect');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'preferred_sect' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Select your preferred Islamic sect for your partner
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <Dropdown
                          options={sectOptions}
                          name="preferred_sect"
                          value={profileData.preferred_sect}
                          onChange={(e) => updateField("preferred_sect", e.target.value)}
                        />
                        {formErrors.preferred_sect && (
                          <p className="text-red-500 text-sm">{formErrors.preferred_sect}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Believe in Dargah/Fatiha/Niyah */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Believe in Dargah/Fatiha/Niyah? <span className="text-red-500">*</span></span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                              fill="none"
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('preferred_dargah_fatiha_niyah');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'preferred_dargah_fatiha_niyah' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Do you believe in visiting dargahs, offering fatiha, or making niyah?
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <MultiSelectPills
                          name="preferred_dargah_fatiha_niyah"
                          values={profileData.preferred_dargah_fatiha_niyah || []}
                          onChange={handleMultiSelectChange}
                          options={dargahOptions}
                          error={formErrors.preferred_dargah_fatiha_niyah}
                        />
                      </div>

                      {/* Desired Practicing Level */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Desired Practicing Level <span className="text-red-500">*</span></span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                              fill="none"
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('desired_practicing_level');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'desired_practicing_level' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Select your desired level of Islamic practice for your partner
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <Dropdown
                          options={practicingLevelOptions}
                          name="desired_practicing_level"
                          value={profileData.desired_practicing_level}
                          onChange={(e) => updateField("desired_practicing_level", e.target.value)}
                        />
                        {formErrors.desired_practicing_level && (
                          <p className="text-red-500 text-sm">{formErrors.desired_practicing_level}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Preferred Family Type */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Preferred Family Type <span className="text-red-500">*</span></span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                              fill="none"
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('preferred_family_type');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'preferred_family_type' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Select your preferred family structure for your partner
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <Dropdown
                          options={familyTypeOptions}
                          name="preferred_family_type"
                          value={profileData.preferred_family_type}
                          onChange={(e) => updateField("preferred_family_type", e.target.value)}
                        />
                        {formErrors.preferred_family_type && (
                          <p className="text-red-500 text-sm">{formErrors.preferred_family_type}</p>
                        )}
                      </div>

                      {/* Education Level */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Education Level</span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                              fill="none"
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('preferred_education');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'preferred_education' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Select your preferred education level for your partner
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <Dropdown
                          options={educationOptions}
                          name="preferred_education"
                          value={profileData.preferred_education}
                          onChange={(e) => updateField("preferred_education", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Profession / Occupation */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Profession / Occupation</span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                              fill="none"
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('preferred_occupation_profession');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'preferred_occupation_profession' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Enter your preferred profession or occupation for your partner
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <input
                          type="text"
                          name="preferred_occupation_profession"
                          value={profileData.preferred_occupation_profession || ""}
                          placeholder="Enter profession or occupation"
                          className="w-full h-12 px-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-sm font-medium"
                          onChange={(e) => updateField("preferred_occupation_profession", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preferred Location Section */}
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
                        Preferred Location
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                handleTooltipClick('preferred_country');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'preferred_country' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Select your preferred country for your partner
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <Dropdown
                          options={getCountries()}
                          name="preferred_country"
                          value={profileData.preferred_country}
                          onChange={(e) => updateField("preferred_country", e.target.value)}
                        />
                        {formErrors.preferred_country && (
                          <p className="text-red-500 text-sm">{formErrors.preferred_country}</p>
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
                                handleTooltipClick('preferred_state');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'preferred_state' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Select your preferred state/province for your partner
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <Dropdown
                          options={getStates(profileData.preferred_country)}
                          name="preferred_state"
                          value={profileData.preferred_state}
                          onChange={(e) => updateField("preferred_state", e.target.value)}
                        />
                        {formErrors.preferred_state && (
                          <p className="text-red-500 text-sm">{formErrors.preferred_state}</p>
                        )}
                      </div>

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
                                handleTooltipClick('preferred_city');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'preferred_city' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Select your preferred city for your partner
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </label>
                        <Dropdown
                          options={getCities(profileData.preferred_country, profileData.preferred_state)}
                          name="preferred_city"
                          value={profileData.preferred_city}
                          onChange={(e) => updateField("preferred_city", e.target.value)}
                        />
                        {formErrors.preferred_city && (
                          <p className="text-red-500 text-sm">{formErrors.preferred_city}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Partner's Family Background Section */}
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</span>
                        Additional Preferences
                      </h3>
                    </div>

                    {/* Partner's Family Background */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>Partner's Family Background</span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-pink-500 cursor-help transition-colors" 
                            fill="none"
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTooltipClick('preferred_family_background');
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'preferred_family_background' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            Describe your preferred family background for your partner
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </label>
                      <textarea
                        name="preferred_family_background"
                        rows="4"
                        value={profileData.preferred_family_background || ""}
                        placeholder="Describe your preferred family background for your partner..."
                        className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-sm font-medium resize-none"
                        onChange={(e) => updateField("preferred_family_background", e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Navigation Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center pt-8 border-t border-gray-200">
                    {/* Back Button */}
                    <button
                      onClick={() => navigate("/memstepthree")}
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
                      className="group w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 min-h-[48px] relative overflow-hidden"
                    >
                      {/* Gradient overlay for hover effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      
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

export default MemStepFour;
