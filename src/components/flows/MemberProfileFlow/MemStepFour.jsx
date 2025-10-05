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
  const [showSkipPopup, setShowSkipPopup] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState("");
  
  userId = localStorage.getItem("member_id") || userId;

  // Surname options from Flutter app
  const surnameOptions = [
    { value: "Al-Haqq", label: "Al-Haqq" },
    { value: "Al-Hakim", label: "Al-Hakim" },
    { value: "Al-Khalifa", label: "Al-Khalifa" },
    { value: "Al-Mahdi", label: "Al-Mahdi" },
    { value: "Al-Mansoor", label: "Al-Mansoor" },
    { value: "Al-Muqaddam", label: "Al-Muqaddam" },
    { value: "Al-Nasser", label: "Al-Nasser" },
    { value: "Al-Sabah", label: "Al-Sabah" },
    { value: "Al-Siddiq", label: "Al-Siddiq" },
    { value: "Al-Sham", label: "Al-Sham" },
    { value: "Al-Sharif", label: "Al-Sharif" },
    { value: "Al-Tariq", label: "Al-Tariq" },
    { value: "Ahmed", label: "Ahmed" },
    { value: "Ahamadi", label: "Ahamadi" },
    { value: "Azzam", label: "Azzam" },
    { value: "Ansari", label: "Ansari" },
    { value: "Asghar", label: "Asghar" },
    { value: "Aslami", label: "Aslami" },
    { value: "Awan", label: "Awan" },
    { value: "Baghdadi", label: "Baghdadi" },
    { value: "Bakhshi", label: "Bakhshi" },
    { value: "Bedi", label: "Bedi" },
    { value: "Bashir", label: "Bashir" },
    { value: "Barakat", label: "Barakat" },
    { value: "Barqi", label: "Barqi" },
    { value: "Bukhari", label: "Bukhari" },
    { value: "Chishti", label: "Chishti" },
    { value: "Chaudhary", label: "Chaudhary" },
    { value: "Choudhury", label: "Choudhury" },
    { value: "Chaudhari", label: "Chaudhari" },
    { value: "Chowdhary", label: "Chowdhary" },
    { value: "Chauhan", label: "Chauhan" },
    { value: "Chaurasiya", label: "Chaurasiya" },
    { value: "Darvesh", label: "Darvesh" },
    { value: "Durrani", label: "Durrani" },
    { value: "Elahi", label: "Elahi" },
    { value: "Farooqi", label: "Farooqi" },
    { value: "Fayazi", label: "Fayazi" },
    { value: "Feroze", label: "Feroze" },
    { value: "Faiz", label: "Faiz" },
    { value: "Fadl", label: "Fadl" },
    { value: "Falah", label: "Falah" },
    { value: "Ghani", label: "Ghani" },
    { value: "Gul", label: "Gul" },
    { value: "Gulzar", label: "Gulzar" },
    { value: "Ghulam", label: "Ghulam" },
    { value: "Hashim", label: "Hashim" },
    { value: "Hashmi", label: "Hashmi" },
    { value: "Hassan", label: "Hassan" },
    { value: "Imam", label: "Imam" },
    { value: "Jafari", label: "Jafari" },
    { value: "Jameel", label: "Jameel" },
    { value: "Jilani", label: "Jilani" },
    { value: "Jazairi", label: "Jazairi" },
    { value: "Javed", label: "Javed" },
    { value: "Kadir", label: "Kadir" },
    { value: "Kamal", label: "Kamal" },
    { value: "Kamar", label: "Kamar" },
    { value: "Kashani", label: "Kashani" },
    { value: "Kazi", label: "Kazi" },
    { value: "Khan", label: "Khan" },
    { value: "Kirmani", label: "Kirmani" },
    { value: "Khattak", label: "Khattak" },
    { value: "Kabbani", label: "Kabbani" },
    { value: "Madhani", label: "Madhani" },
    { value: "Madani", label: "Madani" },
    { value: "Malik", label: "Malik" },
    { value: "Maalik", label: "Maalik" },
    { value: "Malick", label: "Malick" },
    { value: "Maulana", label: "Maulana" },
    { value: "Maani", label: "Maani" },
    { value: "Mehdi", label: "Mehdi" },
    { value: "Mir", label: "Mir" },
    { value: "Mirza", label: "Mirza" },
    { value: "Mansoor", label: "Mansoor" },
    { value: "Mandi", label: "Mandi" },
    { value: "Mowla", label: "Mowla" },
    { value: "Nazir", label: "Nazir" },
    { value: "Najmi", label: "Najmi" },
    { value: "Niazi", label: "Niazi" },
    { value: "Nawab", label: "Nawab" },
    { value: "Noori", label: "Noori" },
    { value: "Osman", label: "Osman" },
    { value: "Othman", label: "Othman" },
    { value: "Qadri", label: "Qadri" },
    { value: "Qamar", label: "Qamar" },
    { value: "Qazi", label: "Qazi" },
    { value: "Qutub", label: "Qutub" },
    { value: "Rauf", label: "Rauf" },
    { value: "Rehman", label: "Rehman" },
    { value: "Rizvi", label: "Rizvi" },
    { value: "Raza", label: "Raza" },
    { value: "Sabri", label: "Sabri" },
    { value: "Shaikh", label: "Shaikh" },
    { value: "Sheikh", label: "Sheikh" },
    { value: "Shams", label: "Shams" },
    { value: "Shamsi", label: "Shamsi" },
    { value: "Shah", label: "Shah" },
    { value: "Shahi", label: "Shahi" },
    { value: "Shakir", label: "Shakir" },
    { value: "Shazad", label: "Shazad" },
    { value: "Siddiq", label: "Siddiq" },
    { value: "Siddiqi", label: "Siddiqi" },
    { value: "Siddiqui", label: "Siddiqui" },
    { value: "Sulaiman", label: "Sulaiman" },
    { value: "Sulaimani", label: "Sulaimani" },
    { value: "Sufi", label: "Sufi" },
    { value: "Syed", label: "Syed" },
    { value: "Sayed", label: "Sayed" },
    { value: "Sayyed", label: "Sayyed" },
    { value: "Saiyed", label: "Saiyed" },
    { value: "Taj", label: "Taj" },
    { value: "Tanashah", label: "Tanashah" },
    { value: "Thakur", label: "Thakur" },
    { value: "Tayyab", label: "Tayyab" },
    { value: "Tayyari", label: "Tayyari" },
    { value: "Tirmizi", label: "Tirmizi" },
    { value: "Uddin", label: "Uddin" },
    { value: "Usmani", label: "Usmani" },
    { value: "Wahid", label: "Wahid" },
    { value: "Wali", label: "Wali" },
    { value: "Yassin", label: "Yassin" },
    { value: "Zaidi", label: "Zaidi" },
    { value: "Zaki", label: "Zaki" },
    { value: "Other", label: "Other" },
    { value: "Not Applicable", label: "Not Applicable" },
    { value: "Prefer not to say", label: "Prefer not to say" },
    { value: "Surname does not matter.", label: "Surname does not matter." }
  ];

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
    // Check if any field is filled
    const hasAnyFieldFilled = 
      profileData.preferred_surname?.trim() ||
      profileData.preferred_sect?.trim() ||
      (profileData.preferred_dargah_fatiha_niyah && profileData.preferred_dargah_fatiha_niyah.length > 0) ||
      profileData.desired_practicing_level?.trim() ||
      profileData.preferred_family_type?.trim() ||
      profileData.preferred_family_background?.trim() ||
      profileData.preferred_education?.trim() ||
      profileData.preferred_occupation_profession?.trim() ||
      profileData.preferred_country?.trim() ||
      profileData.preferred_state?.trim() ||
      profileData.preferred_city?.trim();

    // If no field is filled, show skip popup
    if (!hasAnyFieldFilled) {
      setShowSkipPopup(true);
      return false;
    }

    // If at least one field is filled, proceed without validation
    setFormErrors({});
    return true;
  };

  const handleSkipConfirm = () => {
    setShowSkipPopup(false);
    // Navigate to next step without saving any data
    navigate(`/memstepfive`);
  };

  const handleSkipCancel = () => {
    setShowSkipPopup(false);
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
      navigate(`/memstepfive/`);
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
          className={`w-full h-12 px-4 pr-10 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CB3B8B] focus:border-transparent transition-all duration-200 text-sm font-medium appearance-none ${
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
                className="h-4 w-4 text-pink-600 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
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
                className={`group relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border-2 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#CB3B8B] focus:ring-offset-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] text-white border-[#CB3B8B] shadow-lg shadow-[#FFC0E3]'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-[#FFA4D6] hover:bg-[#FFC0E3] hover:text-[#CB3B8B] shadow-sm hover:shadow-md'
                }`}
              >
                <span className="relative z-10">{option.label}</span>
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] rounded-xl opacity-90"></div>
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
    { value: "Ahle Qur'an", label: "Ahle Qur'an" },
    { value: "ahmadi", label: "Ahamadi" },
    { value: "barelvi", label: "Barelvi" },
    { value: "bohra", label: "Bohra" },
    { value: "deobandi", label: "Deobandi" },
    { value: "hanabali", label: "Hanabali" },
    { value: "hanafi", label: "Hanafi" },
    { value: "ibadi", label: "Ibadi" },
    { value: "ismaili", label: "Ismaili" },
    { value: "Jamat e Islami", label: "Jamat e Islami" },
    { value: "maliki", label: "Maliki" },
    { value: "pathan", label: "Pathan" },
    { value: "salafi", label: "Salafi" },
    { value: "Salafi/Ahle Hadees", label: "Salafi/Ahle Hadees" },
    { value: "sayyid", label: "Sayyid" },
    { value: "shafi", label: "Shafi" },
    { value: "shia", label: "Shia" },
    { value: "sunni", label: "Sunni" },
    { value: "sufism", label: "Sufism" },
    { value: "Tableeghi Jama'at", label: "Tableeghi Jama'at" },
    { value: "zahiri", label: "Zahiri" },
    { value: "muslim", label: "Muslim" },
    { value: "other", label: "Other" },
    { value: "Prefer not to say", label: "Prefer not to say" },
  ];

  // Practicing level options
  const practicingLevelOptions = [
    { value: "devout", label: "Devout" },
    { value: "Very Religious", label: "Very Religious" },
    { value: "religious", label: "Religious" },
    { value: "Moderately Religious", label: "Moderately Religious" },
    { value: "Occasionally Religious", label: "Occasionally Religious" },
    { value: "Cultural but non-practicing", label: "Cultural but non-practicing" },
    { value: "Spiritual but not religious", label: "Spiritual but not religious" },
    { value: "Religious but not practicing", label: "Religious but not practicing" },
    { value: "Open to exploring religion", label: "Open to exploring religion" },
    { value: "agnostic", label: "Agnostic" },
    { value: "atheist", label: "Atheist" },
    { value: "secular", label: "Secular" },
    { value: "Open to all beliefs", label: "Open to all beliefs" },
    { value: "Not religious", label: "Not religious" },
    { value: "Prefer not to say", label: "Prefer not to say" },
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
    { value: "boa", label: "BOA (Bachelor of Optometry & Ophthalmic Technology)" },
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
  ];

  // Yes/No options
  const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  // Dargah/Fatiha/Niyaz options
  const dargahOptions = [
    { value: "Yes (Dargah, Fatiha, and Niyaz)", label: "Yes (Dargah, Fatiha, and Niyaz)" },
    { value: "Yes (Dargah and Fatiha)", label: "Yes (Dargah and Fatiha)" },
    { value: "Yes (Dargah and Niyaz)", label: "Yes (Dargah and Niyaz)" },
    { value: "Yes (Fatiha and Niyaz)", label: "Yes (Fatiha and Niyaz)" },
    { value: "Yes (Only Dargah)", label: "Yes (Only Dargah)" },
    { value: "Yes (Only Fatiha)", label: "Yes (Only Fatiha)" },
    { value: "Yes (Only Niyaz)", label: "Yes (Only Niyaz)" },
    { value: "No (No Dargah, No Fatiha, No Niyaz)", label: "No (No Dargah, No Fatiha, No Niyaz)" },
    { value: "sometimes", label: "Sometimes" },
    { value: "Prefer not to say", label: "Prefer not to say" },
  ];

  // Comprehensive profession options
  const professionOptions = [
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
              <div className="bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] px-8 py-6">
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
                        <span className="bg-[#FFC0E3] text-[#CB3B8B] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">1</span>
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
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                        <Dropdown
                          options={surnameOptions}
                          name="preferred_surname"
                          value={profileData.preferred_surname}
                          onChange={(e) => updateField("preferred_surname", e.target.value)}
                        />
                </div>

                      {/* Preferred Sect */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Preferred Sect</span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                          <span>Believe in Dargah/Fatiha/Niyah?</span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                          <span>Desired Practicing Level</span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                          <span>Preferred Family Type</span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                              Select your preferred profession or occupation for your partner
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                          </div>
                        </label>
                        <Dropdown
                          options={professionOptions}
                          name="preferred_occupation_profession"
                          value={profileData.preferred_occupation_profession}
                          onChange={(e) => updateField("preferred_occupation_profession", e.target.value)}
                        />
                    </div>
                  </div>
                </div>

                  {/* Preferred Location Section */}
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <span className="bg-[#FFC0E3] text-[#CB3B8B] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">2</span>
                    Preferred Location
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Country */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Country</span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                          <span>State</span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                          <span>City</span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                        <span className="bg-[#FFC0E3] text-[#CB3B8B] rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3">3</span>
                        Additional Preferences
                      </h3>
              </div>

                    {/* Partner's Family Background */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>Partner's Family Background</span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
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
                        className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CB3B8B] focus:border-transparent transition-all duration-200 text-sm font-medium resize-none"
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
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-pink-600 font-semibold">4</span>
                  </div>
                  <span>of 6 steps</span>
                </div>
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

      {/* Skip Popup */}
      {showSkipPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Skip Preferences?
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                You haven't filled any preferences. You can skip this step and continue, or go back to fill your preferences for better matches.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleSkipCancel}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={handleSkipConfirm}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] rounded-lg hover:from-[#F971BC] hover:to-[#DA73AD] focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
                >
                  Skip & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemStepFour;
