import React, { useEffect, useMemo, useRef, useState } from 'react';
import './MobileResponsiveSidebar.css';
import RangeSlider from './AgeFilter/RangeSlider';
import { postDataReturnResponse, fetchDataObjectV2 } from '../../../apiUtils';
import { FiX, FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';

// Shimmer Loading Component for Mobile Sidebar
const ShimmerFormField = () => (
  <div className="animate-pulse">
    <div className="h-3 bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] rounded w-1/3 mb-2"></div>
    <div className="h-10 bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] rounded-lg"></div>
  </div>
);

const ShimmerButton = () => (
  <div className="animate-pulse">
    <div className="h-10 bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] rounded-xl"></div>
  </div>
);

const MobileResponsiveSidebar = ({ setApiData, onClose, reloadOriginalData }) => {
  const [rangeText, setRangeText] = useState('18-23');
  const [rangeText1, setRangeText1] = useState({});
  const [userId] = useState(localStorage.getItem("userId"));
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Options state
  const [maritalOptions, setMaritalOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([
    { value: 'india', label: 'India' },
    { value: 'usa', label: 'United States' },
    { value: 'canada', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'australia', label: 'Australia' },
    { value: 'other', label: 'Other' },
  ]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [professionOptions, setProfessionOptions] = useState([
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
  ]);
  
  const sectOptions = useMemo(() => ([
    { value: "ahle_quran", label: "Ahle Qur'an" },
    { value: "ahamadi", label: "Ahamadi" },
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
  ]), []);
  
  const [formData, setFormData] = useState({
    memberID: '',
    maritalStatus: '',
    sect: '',
    profession: '',
    country: '',
    state: '',
    city: '', 
  });

  // Check if any filter is applied
  const hasActiveFilters = () => {
    return formData.memberID || 
           formData.maritalStatus || 
           formData.sect || 
           formData.profession || 
           formData.country || 
           formData.state || 
           formData.city ||
           (rangeText && rangeText !== '18-23');
  };

  // Clear all filters
  const clearFilters = () => {
    setFormData({
      memberID: '',
      maritalStatus: '',
      sect: '',
      profession: '',
      country: '',
      state: '',
      city: '', 
    });
    setRangeText('18-23');
    setStateOptions([]);
    setCityOptions([]);
    
    // Reset filter state and refresh all data from database
    if (reloadOriginalData) {
      reloadOriginalData();
    } else if (setApiData) {
      setApiData([]);
    }
    
    // Force page refresh to get latest data from database
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  // Comprehensive location data and helpers (aligned with MemStepOne structure)
  const locationData = useMemo(() => ({
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
            { value: "nellore", label: "Nellore" },
            { value: "other", label: "Other" }
          ]
        },
        arunachal_pradesh: {
          label: "Arunachal Pradesh",
          cities: [
            { value: "itanagar", label: "Itanagar" },
            { value: "pasighat", label: "Pasighat" },
            { value: "ziro", label: "Ziro" },
            { value: "other", label: "Other" }
          ]
        },
        assam: {
          label: "Assam",
          cities: [
            { value: "guwahati", label: "Guwahati" },
            { value: "silchar", label: "Silchar" },
            { value: "dibrugarh", label: "Dibrugarh" },
            { value: "jorhat", label: "Jorhat" },
            { value: "other", label: "Other" }
          ]
        },
        bihar: {
          label: "Bihar",
          cities: [
            { value: "patna", label: "Patna" },
            { value: "gaya", label: "Gaya" },
            { value: "bhagalpur", label: "Bhagalpur" },
            { value: "muzaffarpur", label: "Muzaffarpur" },
            { value: "other", label: "Other" }
          ]
        },
        chhattisgarh: {
          label: "Chhattisgarh",
          cities: [
            { value: "raipur", label: "Raipur" },
            { value: "bilaspur", label: "Bilaspur" },
            { value: "durg", label: "Durg" },
            { value: "other", label: "Other" }
          ]
        },
        goa: {
          label: "Goa",
          cities: [
            { value: "panaji", label: "Panaji" },
            { value: "margao", label: "Margao" },
            { value: "vasco_da_gama", label: "Vasco da Gama" },
            { value: "other", label: "Other" }
          ]
        },
        gujarat: {
          label: "Gujarat",
          cities: [
            { value: "ahmedabad", label: "Ahmedabad" },
            { value: "surat", label: "Surat" },
            { value: "vadodara", label: "Vadodara" },
            { value: "rajkot", label: "Rajkot" },
            { value: "bhavnagar", label: "Bhavnagar" },
            { value: "other", label: "Other" }
          ]
        },
        haryana: {
          label: "Haryana",
          cities: [
            { value: "gurgaon", label: "Gurgaon" },
            { value: "faridabad", label: "Faridabad" },
            { value: "panipat", label: "Panipat" },
            { value: "ambala", label: "Ambala" },
            { value: "other", label: "Other" }
          ]
        },
        himachal_pradesh: {
          label: "Himachal Pradesh",
          cities: [
            { value: "shimla", label: "Shimla" },
            { value: "dharamshala", label: "Dharamshala" },
            { value: "manali", label: "Manali" },
            { value: "other", label: "Other" }
          ]
        },
        jharkhand: {
          label: "Jharkhand",
          cities: [
            { value: "ranchi", label: "Ranchi" },
            { value: "jamshedpur", label: "Jamshedpur" },
            { value: "dhanbad", label: "Dhanbad" },
            { value: "other", label: "Other" }
          ]
        },
        karnataka: {
          label: "Karnataka",
          cities: [
            { value: "bangalore", label: "Bangalore" },
            { value: "mysore", label: "Mysore" },
            { value: "hubli", label: "Hubli" },
            { value: "mangalore", label: "Mangalore" },
            { value: "other", label: "Other" }
          ]
        },
        kerala: {
          label: "Kerala",
          cities: [
            { value: "thiruvananthapuram", label: "Thiruvananthapuram" },
            { value: "kochi", label: "Kochi" },
            { value: "kozhikode", label: "Kozhikode" },
            { value: "thrissur", label: "Thrissur" },
            { value: "other", label: "Other" }
          ]
        },
        madhya_pradesh: {
          label: "Madhya Pradesh",
          cities: [
            { value: "bhopal", label: "Bhopal" },
            { value: "indore", label: "Indore" },
            { value: "gwalior", label: "Gwalior" },
            { value: "jabalpur", label: "Jabalpur" },
            { value: "other", label: "Other" }
          ]
        },
        maharashtra: {
          label: "Maharashtra",
          cities: [
            { value: "mumbai", label: "Mumbai" },
            { value: "pune", label: "Pune" },
            { value: "nagpur", label: "Nagpur" },
            { value: "nashik", label: "Nashik" },
            { value: "aurangabad", label: "Aurangabad" },
            { value: "other", label: "Other" }
          ]
        },
        manipur: {
          label: "Manipur",
          cities: [
            { value: "imphal", label: "Imphal" },
            { value: "thoubal", label: "Thoubal" },
            { value: "other", label: "Other" }
          ]
        },
        meghalaya: {
          label: "Meghalaya",
          cities: [
            { value: "shillong", label: "Shillong" },
            { value: "tura", label: "Tura" },
            { value: "other", label: "Other" }
          ]
        },
        mizoram: {
          label: "Mizoram",
          cities: [
            { value: "aizawl", label: "Aizawl" },
            { value: "lunglei", label: "Lunglei" },
            { value: "other", label: "Other" }
          ]
        },
        nagaland: {
          label: "Nagaland",
          cities: [
            { value: "kohima", label: "Kohima" },
            { value: "dimapur", label: "Dimapur" },
            { value: "other", label: "Other" }
          ]
        },
        odisha: {
          label: "Odisha",
          cities: [
            { value: "bhubaneswar", label: "Bhubaneswar" },
            { value: "cuttack", label: "Cuttack" },
            { value: "rourkela", label: "Rourkela" },
            { value: "other", label: "Other" }
          ]
        },
        punjab: {
          label: "Punjab",
          cities: [
            { value: "ludhiana", label: "Ludhiana" },
            { value: "amritsar", label: "Amritsar" },
            { value: "jalandhar", label: "Jalandhar" },
            { value: "patiala", label: "Patiala" },
            { value: "other", label: "Other" }
          ]
        },
        rajasthan: {
          label: "Rajasthan",
          cities: [
            { value: "jaipur", label: "Jaipur" },
            { value: "jodhpur", label: "Jodhpur" },
            { value: "udaipur", label: "Udaipur" },
            { value: "kota", label: "Kota" },
            { value: "bikaner", label: "Bikaner" },
            { value: "other", label: "Other" }
          ]
        },
        sikkim: {
          label: "Sikkim",
          cities: [
            { value: "gangtok", label: "Gangtok" },
            { value: "namchi", label: "Namchi" },
            { value: "other", label: "Other" }
          ]
        },
        tamil_nadu: {
          label: "Tamil Nadu",
          cities: [
            { value: "chennai", label: "Chennai" },
            { value: "coimbatore", label: "Coimbatore" },
            { value: "madurai", label: "Madurai" },
            { value: "tiruchirappalli", label: "Tiruchirappalli" },
            { value: "other", label: "Other" }
          ]
        },
        telangana: {
          label: "Telangana",
          cities: [
            { value: "hyderabad", label: "Hyderabad" },
            { value: "warangal", label: "Warangal" },
            { value: "nizamabad", label: "Nizamabad" },
            { value: "khammam", label: "Khammam" },
            { value: "other", label: "Other" }
          ]
        },
        tripura: {
          label: "Tripura",
          cities: [
            { value: "agartala", label: "Agartala" },
            { value: "dharamnagar", label: "Dharamnagar" },
            { value: "other", label: "Other" }
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
            { value: "prayagraj", label: "Prayagraj" },
            { value: "other", label: "Other" }
          ]
        },
        uttarakhand: {
          label: "Uttarakhand",
          cities: [
            { value: "dehradun", label: "Dehradun" },
            { value: "haridwar", label: "Haridwar" },
            { value: "roorkee", label: "Roorkee" },
            { value: "nainital", label: "Nainital" },
            { value: "other", label: "Other" }
          ]
        },
        west_bengal: {
          label: "West Bengal",
          cities: [
            { value: "kolkata", label: "Kolkata" },
            { value: "asansol", label: "Asansol" },
            { value: "siliguri", label: "Siliguri" },
            { value: "durgapur", label: "Durgapur" },
            { value: "howrah", label: "Howrah" },
            { value: "other", label: "Other" }
          ]
        }
      }
    },
    usa: {
      label: 'United States',
      states: {
        new_york: { label: 'New York', cities: [
          { value: 'new_york_city', label: 'New York City' },
          { value: 'buffalo', label: 'Buffalo' },
          { value: 'other', label: 'Other' },
        ]},
        california: { label: 'California', cities: [
          { value: 'los_angeles', label: 'Los Angeles' },
          { value: 'san_francisco', label: 'San Francisco' },
          { value: 'other', label: 'Other' },
        ]},
      }
    }
  }), []);

  const getStates = (country) => {
    if (!country || !locationData[country]) return [];
    return Object.keys(locationData[country].states).map((key) => ({
      value: key,
      label: locationData[country].states[key].label,
    }));
  };

  const getCities = (country, state) => {
    if (!country || !state || !locationData[country] || !locationData[country].states[state]) return [];
    return locationData[country].states[state].cities;
  };

  // Build marital options based on gender (similar to MemStepOne)
  const computeMaritalOptions = (gender) => {
    const base = [
      { value: 'Single', label: 'Single' },
      { value: 'Divorced', label: 'Divorced' },
      { value: 'KhulaA', label: 'Khula' },
      { value: 'Widowed', label: 'Widowed' },
    ];
    
    // Add "MARRIED" option only for female users
    if (gender === 'female') {
      base.splice(1, 0, { value: 'Married', label: 'Married' });
    }
    
    return base;
  };

  // Fetch logged-in user profile to infer gender and defaults
  useEffect(() => {
    if (!userId) return;
    const parameter = {
      url: `/api/user/${userId}/`,
      setterFunction: setUserProfile,
      setLoading,
      setErrors,
    };
    fetchDataObjectV2(parameter);
  }, [userId]);

  // Update marital options on gender fetch
  useEffect(() => {
    const gender = userProfile?.gender || null;
    setMaritalOptions(computeMaritalOptions(gender));
  }, [userProfile]);

  // Cascading: when country changes, reset states/cities
  useEffect(() => {
    setStateOptions(getStates(formData.country));
    setFormData((prev) => ({ ...prev, state: '', city: '' }));
    setCityOptions([]);
  }, [formData.country]);

  // Cascading: when state changes, reset cities
  useEffect(() => {
    setCityOptions(getCities(formData.country, formData.state));
    setFormData((prev) => ({ ...prev, city: '' }));
  }, [formData.state]);

  // Debounced live search by Member ID
  const debounceRef = useRef(null);
  useEffect(() => {
    if (!formData.memberID) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const parameter = {
        url: '/api/user/filter/',
        payload: {
          member_id: formData.memberID,
          age_min: parseInt(rangeText?.split('-')?.[0]),
          age_max: parseInt(rangeText?.split('-')?.[1]),
          user_id: userId,
          // For agents: show both male and female profiles when age range is set
          ...(role === 'agent' && (rangeText && rangeText !== '18-23') && {
            show_both_genders: true,
            include_male: true,
            include_female: true
          }),
          // For agents: priority-based filtering based on agent's city/state
          ...(role === 'agent' && userProfile && {
            agent_city: userProfile.city,
            agent_state: userProfile.state,
            priority_based_filtering: true,
            same_city_priority: 1,
            same_state_priority: 1
          }),
        },
        setUserId: setApiData,
        setErrors,
      };
      postDataReturnResponse(parameter);
    }, 500);
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [formData.memberID, role, userProfile, rangeText]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    setIsSearching(true);
    
    const parameter = {
      url: "/api/user/filter/",
      payload: {
        member_id: formData.memberID || undefined,
        martial_status: formData.maritalStatus || undefined,
        sect_school_info: formData.sect || undefined,
        profession: formData.profession || undefined,
        country: formData.country || undefined,
        state: formData.state || undefined,
        city: formData.city || undefined,
        memberID: undefined,
        maritalStatus: undefined,
        sect: undefined,
        age_min: parseInt(rangeText?.split("-")?.[0]),  
        age_max: parseInt(rangeText?.split("-")?.[1]),  
        user_id: userId,
        // For agents: show both male and female profiles when age range is set
        ...(role === 'agent' && (rangeText && rangeText !== '18-23') && {
          show_both_genders: true,
          include_male: true,
          include_female: true
        }),
        // For agents: priority-based filtering based on agent's city/state
        ...(role === 'agent' && userProfile && {
          agent_city: userProfile.city,
          agent_state: userProfile.state,
          priority_based_filtering: true,
          same_city_priority: 1,
          same_state_priority: 1
        }),
        include_trending: true,
        include_recommended: true,
        include_all_profiles: true
      },
      setUserId: setApiData,
      setErrors: setErrors,
    };
    
    postDataReturnResponse(parameter);
    
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };

  return (
    <div className={`mobile-responsive-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="header-content">
          <div className="header-title">
            <FiFilter className="header-icon" />
            <div>
              <h2 className="header-text">Advanced Search</h2>
              <p className="header-subtitle">Filter profiles by your preferences</p>
            </div>
          </div>
          <div className="header-actions">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="collapse-btn"
              title={isCollapsed ? "Expand filters" : "Collapse filters"}
            >
              <FiFilter className="collapse-icon" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="close-btn"
                title="Close filters"
              >
                <FiX className="close-icon" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="sidebar-content">
        {loading ? (
          <div className="shimmer-container">
            <ShimmerFormField />
            <ShimmerFormField />
            <ShimmerFormField />
            <ShimmerFormField />
            <ShimmerFormField />
            <ShimmerFormField />
            <ShimmerFormField />
            <ShimmerFormField />
            <ShimmerButton />
          </div>
        ) : (
          <form className="filter-form">
            {/* Age Range */}
            <div className="form-group">
              <label className="form-label">
                <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Age Range
              </label>
              <div className="age-range-container">
                <RangeSlider rangeText={rangeText} setRangeText={setRangeText}/>
              </div>
            </div>

            {/* Member ID */}
            <div className="form-group">
              <label className="form-label">
                <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
                Member ID
              </label>
              <input
                type="text"
                name="memberID"
                placeholder="Enter Member ID"
                value={formData.memberID}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Marital Status */}
            <div className="form-group">
              <label className="form-label">
                <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Marital Status
              </label>
              <select 
                name="maritalStatus" 
                value={formData.maritalStatus} 
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select One</option>
                {maritalOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Sect */}
            <div className="form-group">
              <label className="form-label">
                <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Sect
              </label>
              <select 
                name="sect" 
                value={formData.sect} 
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Choose One</option>
                {sectOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Profession */}
            <div className="form-group">
              <label className="form-label">
                <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
                Profession
              </label>
              <select 
                name="profession" 
                value={formData.profession} 
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Choose One</option>
                {professionOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div className="form-group">
              <label className="form-label">
                <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Country
              </label>
              <select 
                name="country" 
                value={formData.country} 
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Choose One</option>
                {countryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* State */}
            <div className="form-group">
              <label className="form-label">
                <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                State
              </label>
              <select 
                name="state" 
                value={formData.state} 
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Choose One</option>
                {stateOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="form-group">
              <label className="form-label">
                <svg className="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                City
              </label>
              <select 
                name="city" 
                value={formData.city} 
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Choose One</option>
                {cityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button 
              type="button"
              onClick={handleSearch}
              disabled={isSearching}
              className={`search-btn ${isSearching ? 'searching' : ''}`}
            >
              {isSearching ? (
                <>
                  <FiRefreshCw className="search-icon spinning" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <FiSearch className="search-icon" />
                  <span>Search Profiles</span>
                </>
              )}
            </button>

            {/* Clear Filters Button */}
            {hasActiveFilters() && (
              <button 
                type="button"
                onClick={clearFilters}
                className="clear-btn"
              >
                <FiX className="clear-icon" />
                <span>Clear All Filters</span>
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default MobileResponsiveSidebar;
