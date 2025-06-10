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
    // const heightWeightRegex = /^\d{2,3}$/; // 2-3 digits for height/weight
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

    // Validate Height
    console.log(profileData.hieght);

    // if (!profileData.hieght) {
    //   newErrors.height = 'Height is required';
    // } else if (!heightWeightRegex.test(profileData.hieght)) {
    //   newErrors.height = 'Any number upto 3 digit ';
    // }

    // Validate Weight
    // if (!profileData.weight) {
    //   newErrors.weight = 'Weight is required';
    // } else if (!heightWeightRegex.test(profileData.weight)) {
    //   newErrors.weight = 'Weight should be a number (2-3 digits)';
    // }

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
        className="text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] h-full w-full border-none border-[#ccc] rounded-lg border-1 focus:outline-none focus:ring-0 focus:border-none"
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

  return (
    <div className="flex h-screen">
      <main className="flex-1 bg-white">
        <h3
          style={{
            fontSize: "1.8rem",
            padding: "3vh 0 0 10vh",
            fontWeight: "400",
            color: "#ec4899",
          }}
        >
          Create Your Mehram Match Profile
        </h3>
        <h5
          style={{
            fontSize: "1rem",
            padding: "0 1vh 3vh 10vh",
            fontWeight: "100",
          }}
        >
          Follow these 6 simple step to complete your profile and find the
          perfect match
        </h5>

        <div
          style={{
            height: "1px",
            width: "91.5%",
            backgroundColor: "#ccc",
            marginLeft: "10vh",
          }}
        ></div>

        <div className="form_container_user_creation h-auto bg-white pb-[12px] w-[100vw] ">
          <div
            style={{
              width: "33.8%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <StepTracker percentage={25} />
          </div>

          <div style={{ width: "86.1%", marginLeft: "19.5%" }}>
            <form
              style={{
                borderLeft: "0.5px solid #ccc",
                padding: "1rem",
                width: "70%",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                padding: "1% 4%",
                margin: "auto",
                height: "auto",
                position: "absolute",
                left: "24.2rem",
                zIndex: "0",
              }}
            >
              <p
                style={{
                  fontSize: "small",
                  color: "gray",
                  margin: "0",
                  padding: "0",
                }}
              >
                step 1/6
              </p>
              <h4 className="col-span-3 m-0 p-0" style={{ fontWeight: "bold" }}>
                Let's start with your personal details
              </h4>
              <p
                style={{
                  fontSize: "small",
                  color: "gray",
                  marginBottom: "1vh",
                  padding: "0",
                }}
              >
                Please fill information below to create your Mehram Match
                Profile
              </p>
              <div
                style={{
                  height: "0.7px",
                  width: "100%",
                  backgroundColor: "#ccc",
                }}
              ></div>
              <div style={{ display: "flex", gap: "2rem" }}>
                {/* First Name */}
                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-[#000000] mb-0"
                  >
                    First Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={profileData.first_name || ""}
                      className={
                        `h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] ${
                          formErrors.first_name
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                        } focus:outline-none focus:ring-2 pr-8` // Added pr-8 for icon space
                      }
                      onChange={(e) =>
                        handleFieldChange("first_name", e.target.value)
                      }
                    />
                    {/* Information icon positioned at right corner of input */}
                    <div
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 group z-20"
                      style={{ zIndex: "1000" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-red-500 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {/* Tooltip text */}
                      <div className="absolute z-10 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                        This is additional information about the First Name
                        field.
                      </div>
                    </div>
                  </div>
                  {formErrors.first_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.first_name}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-[#000000] mb-0"
                  >
                    Last Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={profileData.last_name || ""}
                      className={`h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] ${
                        formErrors.last_name
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                      } focus:outline-none focus:ring-2`}
                      onChange={(e) =>
                        handleFieldChange("last_name", e.target.value)
                      }
                    />
                    {/* Information icon positioned at right corner of input */}
                    <div
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 group"
                      style={{ zIndex: "1000" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-red-500 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {/* Tooltip text */}
                      <div className="absolute z-10 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                        This is additional information about the Last Name
                        field.
                      </div>
                    </div>
                  </div>
                  {formErrors.last_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.last_name}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: "2rem" }}>
                {/* Date of Birth */}
                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label
                    htmlFor="dob"
                    className="block text-sm font-medium text-[#000000] mb-0"
                  >
                    Date of Birth <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      required
                      value={profileData.dob || ""}
                      className={`h-10 pl-[12px] pr-[24px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] ${
                        formErrors.dob
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                      } focus:outline-none focus:ring-2`}
                      onChange={(e) => handleFieldChange("dob", e.target.value)}
                    />
                    {/* Information icon positioned at right corner of input */}
                    <div
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 group"
                      style={{ zIndex: "1000" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-red-500 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {/* Tooltip text */}
                      <div className="absolute z-10 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                        This is additional information about the Date of Birth
                        field.
                      </div>
                    </div>
                  </div>
                  {formErrors.dob && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.dob}
                    </p>
                  )}
                </div>
                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-[#000000] mb-0"
                  >
                    Gender <span style={{ color: "red" }}>*</span>
                  </label>

<div className="relative">
                  <div
                    className={`h-10 w-[100%]  text-[#6D6E6F] font-semibold placeholder-[#898B92] rounded-lg border-1 border-[#898B92] ${
                      formErrors.gender
                        ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500"
                        : "border-[#898B92] focus-within:border-[#898B92] focus-within:ring-[#898B92]"
                    } focus-within:outline-none focus-within:ring-2`}
                  >
                    <Dropdown
                      options={genders}
                      name="gender"
                      value={profileData.gender}
                      onChange={(e) =>
                        handleFieldChange("gender", e.target.value)
                      }
                      className="h-10 text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full bg-transparent outline-none"
                    />
                  </div>
                  {/* Information icon positioned at right corner of input */}
                  <div className="absolute right-4 bottom-1 transform -translate-y-1/2 group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-red-500 cursor-pointer"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {/* Tooltip text */}
                    <div className="absolute z-10 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                      This is additional information about the Gender field.
                    </div>
                  </div>
</div>
                  {formErrors.gender && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.gender}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: "2rem" }}>
                {/* First Name */}
                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label
                    htmlFor="maritalStatus"
                    className="block text-sm font-medium text-[#000000] mb-0"
                  >
                    Marital Status <span style={{ color: "red" }}>*</span>
                  </label>

                  <div
                    className={`relative h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] ${
                      formErrors.marital_status
                        ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500"
                        : "border-[#898B92] focus-within:border-[#898B92] focus-within:ring-[#898B92]"
                    } focus-within:outline-none focus-within:ring-2`}
                  >
                    <Dropdown
                      options={marital_statuses}
                      name="marital_status"
                      value={profileData.marital_status}
                      onChange={(e) =>
                        handleFieldChange("marital_status", e.target.value)
                      }
                      className="h-10 text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full bg-transparent outline-none"
                    />
                  </div>
                  {/* Information icon positioned at right corner of input */}
                  <div
                    className="absolute right-4 bottom-1 transform -translate-y-1/2 group"
                    style={{ zIndex: "1000" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-red-500 cursor-pointer"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {/* Tooltip text */}
                    <div className="absolute z-1000 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                      This is additional information about the Marital Status
                      field.
                    </div>
                  </div>

                  {formErrors.marital_status && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.marital_status}
                    </p>
                  )}
                </div>

                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label
                    htmlFor="maritalStatus"
                    className="block text-sm font-medium text-[#000000] mb-0"
                  >
                    Current Address <span style={{ color: "red" }}>*</span>
                  </label>
                  <div style={{ display: "flex", width: "100%", gap: "1%" }}>
                    {/* City Dropdown with Tooltip */}
                    <div className="w-1/2 relative">
                      <div
                        className={`relative h-10 w-[100%]  placeholder-[#898B92] text-[#6D6E6F] rounded-lg border-1 border-[#898B92] ${
                          formErrors.city
                            ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500"
                            : "border-[#898B92] focus-within:border-[#898B92] focus-within:ring-[#898B92]"
                        } focus-within:outline-none focus-within:ring-2`}
                      >
                        <Dropdown
                          options={citys}
                          name="city"
                          value={profileData.city}
                          onChange={(e) =>
                            handleFieldChange("city", e.target.value)
                          }
                          className="h-10 text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full bg-transparent outline-none"
                        />
                        {/* Tooltip inside dropdown */}
                        <div
                          className="absolute right-4 bottom-1 transform -translate-y-1/2 group"
                          style={{ zIndex: "1000" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-red-500 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <div className="absolute z-1000 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                            Please select your current city of residence.
                          </div>
                        </div>
                      </div>

                      {formErrors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.city}
                        </p>
                      )}
                    </div>

                    {/* State Dropdown with Tooltip */}
                    <div className="w-1/2 relative">
                      <div
                        className={`relative h-10 w-[100%]  placeholder-[#898B92] text-[#6D6E6F] rounded-lg border-1 border-[#898B92] ${
                          formErrors.state
                            ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500"
                            : "border-[#898B92] focus-within:border-[#898B92] focus-within:ring-[#898B92]"
                        } focus-within:outline-none focus-within:ring-2`}
                      >
                        <Dropdown
                          options={statues}
                          name="state"
                          value={profileData.state}
                          onChange={(e) =>
                            handleFieldChange("state", e.target.value)
                          }
                          className="h-10 text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full bg-transparent outline-none"
                        />
                        {/* Tooltip inside dropdown */}
                        <div
                          className="absolute right-4 bottom-1 transform -translate-y-1/2 group"
                          style={{ zIndex: "1000" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-red-500 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <div className="absolute z-1000 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                            Please select your current state.
                          </div>
                        </div>
                      </div>

                      {formErrors.state && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.state}
                        </p>
                      )}
                    </div>

                    {/* Country Dropdown with Tooltip */}
                    <div className="w-1/2 relative">
                      <div
                        className={`relative h-10 w-[100%]  placeholder-[#898B92] text-[#6D6E6F] rounded-lg border-1 border-[#898B92] ${
                          formErrors.country
                            ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500"
                            : "border-[#898B92] focus-within:border-[#898B92] focus-within:ring-[#898B92]"
                        } focus-within:outline-none focus-within:ring-2`}
                      >
                        <Dropdown
                          options={countries}
                          name="country"
                          value={profileData.country}
                          onChange={(e) =>
                            handleFieldChange("country", e.target.value)
                          }
                          className="h-10 text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full bg-transparent outline-none"
                        />
                        {/* Tooltip inside dropdown */}
                        <div
                          className="absolute right-4 bottom-1 transform -translate-y-1/2 group"
                          style={{ zIndex: "1000" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-red-500 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <div className="absolute z-1000 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                            Please select your country.
                          </div>
                        </div>
                      </div>

                      {formErrors.country && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.country}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "2rem" }}>
                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label
                    htmlFor="maritalStatus"
                    className="block text-sm font-medium text-[#000000] mb-0"
                  >
                    Native Place <span style={{ color: "red" }}>*</span>
                  </label>
                  <div style={{ display: "flex", width: "100%", gap: "1%" }}>
                    {/* Native City Dropdown with Tooltip */}
                    <div className="w-1/2 relative">
                      <div
                        className={`relative h-10 w-[100%]  placeholder-[#898B92] text-[#6D6E6F] rounded-lg border-1 border-[#898B92] ${
                          formErrors.native_city
                            ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500"
                            : "border-[#898B92] focus-within:border-[#898B92] focus-within:ring-[#898B92]"
                        } focus-within:outline-none focus-within:ring-2`}
                      >
                        <Dropdown
                          options={citys}
                          name="native_city"
                          value={profileData.native_city}
                          onChange={(e) =>
                            handleFieldChange("native_city", e.target.value)
                          }
                          className="h-10 text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full bg-transparent outline-none"
                        />
                        {/* Tooltip inside dropdown */}
                        <div
                          className="absolute right-4 bottom-1 transform -translate-y-1/2 group"
                          style={{ zIndex: "1000" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-red-500 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <div className="absolute z-1000 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                            Please select your native city.
                          </div>
                        </div>
                      </div>

                      {formErrors.native_city && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.native_city}
                        </p>
                      )}
                    </div>

                    {/* Native State Dropdown with Tooltip */}
                    <div className="w-1/2 relative">
                      <div
                        className={`relative h-10 w-[100%]  placeholder-[#898B92] text-[#6D6E6F] rounded-lg border-1 border-[#898B92] ${
                          formErrors.native_state
                            ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500"
                            : "border-[#898B92] focus-within:border-[#898B92] focus-within:ring-[#898B92]"
                        } focus-within:outline-none focus-within:ring-2`}
                      >
                        <Dropdown
                          options={statues}
                          name="native_state"
                          value={profileData.native_state}
                          onChange={(e) =>
                            handleFieldChange("native_state", e.target.value)
                          }
                          className="h-10 text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full bg-transparent outline-none"
                        />
                        {/* Tooltip inside dropdown */}
                        <div
                          className="absolute right-4 bottom-1 transform -translate-y-1/2 group"
                          style={{ zIndex: "1000" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-red-500 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <div className="absolute z-1000 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                            Please select your native state.
                          </div>
                        </div>
                      </div>

                      {formErrors.native_state && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.native_state}
                        </p>
                      )}
                    </div>

                    {/* Native Country Dropdown with Tooltip */}
                    <div className="w-1/2 relative">
                      <div
                        className={`relative h-10 w-[100%]  placeholder-[#898B92] text-[#6D6E6F] rounded-lg border-1 border-[#898B92] ${
                          formErrors.native_country
                            ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500"
                            : "border-[#898B92] focus-within:border-[#898B92] focus-within:ring-[#898B92]"
                        } focus-within:outline-none focus-within:ring-2`}
                      >
                        <Dropdown
                          options={countries}
                          name="native_country"
                          value={profileData.native_country}
                          onChange={(e) =>
                            handleFieldChange("native_country", e.target.value)
                          }
                          className="h-10 text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full bg-transparent outline-none"
                        />
                        {/* Tooltip inside dropdown */}
                        <div
                          className="absolute right-4 bottom-1 transform -translate-y-1/2 group"
                          style={{ zIndex: "1000" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-red-500 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <div className="absolute z-1000 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                            Please select your native country.
                          </div>
                        </div>
                      </div>

                      {formErrors.native_country && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.native_country}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Last Name */}
                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-[#000000] mb-0"
                  >
                    Education
                  </label>

                  <div
                    className={`relative h-10 w-[100%]  text-[#6D6E6F] font-semibold placeholder-[#898B92] rounded-lg border-1 border-[#898B92] ${
                      formErrors.Education
                        ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500"
                        : "border-[#898B92] focus-within:border-[#898B92] focus-within:ring-[#898B92]"
                    } focus-within:outline-none focus-within:ring-2`}
                  >
                    <Dropdown
                      options={educationLevels}
                      name="Education"
                      value={profileData.Education}
                      onChange={(e) =>
                        handleFieldChange("Education", e.target.value)
                      }
                      className="h-10 text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full bg-transparent outline-none"
                    />
                  </div>
                  {/* Information icon positioned at right corner of input */}
                  <div
                    className="absolute right-4 bottom-1 transform -translate-y-1/2 group"
                    style={{ zIndex: "1000" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-red-500 cursor-pointer"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {/* Tooltip text */}
                    <div className="absolute z-1000 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                      This is additional information about the Education field.
                    </div>
                  </div>

                  {formErrors.Education && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.Education}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: "2rem" }}>
                {/* Profession */}

                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label
                    htmlFor="profession"
                    className="block text-sm font-medium text-[#000000] mb-0"
                  >
                    Profession
                  </label>

                  <div
                    className={`relative h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] ${
                      formErrors.city
                        ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500"
                        : "border-[#898B92] focus-within:border-[#898B92] focus-within:ring-[#898B92]"
                    } focus-within:outline-none focus-within:ring-2`}
                  >
                    <Dropdown
                      options={Professions}
                      name="profession"
                      value={profileData.profession}
                      onChange={(e) =>
                        handleFieldChange("profession", e.target.value)
                      }
                      className="h-10 text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full bg-transparent outline-none"
                    />
                    {/* Information icon positioned at right corner of input */}
                    <div
                      className="absolute right-4  bottom-1 transform -translate-y-1/2 group"
                      style={{ zIndex: "1000" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-red-500 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {/* Tooltip text */}
                      <div className="absolute z-1000 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                        This is additional information about the Profession
                        field.
                      </div>
                    </div>
                  </div>

                  {formErrors.profession && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.profession}
                    </p>
                  )}
                </div>

                {/* About You */}
                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label
                    htmlFor="describe_job_business"
                    className="block text-sm font-medium text-[#000000] mb-0"
                  >
                    Please describe your job/business
                  </label>
                  <div className="relative">
                    <textarea
                      id="describe_job_business"
                      name="describe_job_business"
                      value={profileData.describe_job_business || ""}
                      className={`h-[100px] py-[8px] px-[12px] resize-none text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] ${
                        formErrors.describe_job_business
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                      } focus:outline-none focus:ring-2`}
                      onChange={(e) =>
                        handleFieldChange(
                          "describe_job_business",
                          e.target.value
                        )
                      }
                    />
                    {/* Information icon positioned at right corner of input */}
                    <div
                      className="absolute right-4 top-5 transform -translate-y-1/2 group"
                      style={{ zIndex: "1000" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-red-500 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {/* Tooltip text */}
                      <div className="absolute z-1000 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                        This is additional information about the job/business
                        field.
                      </div>
                    </div>
                  </div>
                  {formErrors.describe_job_business && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.describe_job_business}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: "2rem" }}>
                {/* Disability */}

                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label
                    htmlFor="disability"
                    className="block text-sm font-medium text-[#000000] mb-0"
                  >
                    Disability (if any?)
                  </label>
                  <div className="relative">
                    <select
                      id="disability"
                      name="disability"
                      value={profileData.disability || ""}
                      className={`relative h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] ${
                            formErrors.disability
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                          } focus:outline-none focus:ring-2`}
                      onChange={(e) =>
                        handleFieldChange("disability", e.target.value)
                      }
                    >
                      <option value="">Select Disability Status</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                    {/* Information icon positioned at right corner of input */}
                    <div
                      className="absolute right-4 bottom-1 transform -translate-y-1/2 group"
                      style={{ zIndex: "1000" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-red-500 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {/* Tooltip text */}
                      <div className="absolute z-1000 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                        This is additional information about the Disability
                        Status field.
                      </div>
                    </div>
                  </div>
                  {formErrors.disability && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.disability}
                    </p>
                  )}
                </div>

                {/* Disability Type */}
                <div className="w-[50%] relative flex flex-col gap-[10px]">
                {profileData.disability == "yes" && (
                  <>
                    <label
                      htmlFor="disability_type"
                      className="block text-sm font-medium text-[#000000] mb-0"
                    >
                      What type of disability?
                    </label>
                    <div className="relative">
                      <textarea
                        id="disability_type"
                        name="disability_type"
                        value={profileData.type_of_disability || ""}
                        className={`h-[100px] py-[8px] px-[12px] resize-none text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] ${
                          formErrors.type_of_disability
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                        } focus:outline-none focus:ring-2`}
                        onChange={(e) =>
                          handleFieldChange(
                            "type_of_disability",
                            e.target.value
                          )
                        }
                      />
                      {/* Information icon positioned at right corner of input */}
                      <div
                        className="absolute right-4 top-5 transform -translate-y-1/2 group"
                        style={{ zIndex: "1000" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-red-500 cursor-pointer"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {/* Tooltip text */}
                        <div className="absolute z-1000 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                          This is additional information about the disability
                          field.
                        </div>
                      </div>
                    </div>
                    {formErrors.type_of_disability && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.type_of_disability}
                      </p>
                    )}
                  
                  </>
                )}
                </div>
              </div>

              <div style={{ display: "flex", gap: "2rem" }}>
                {/* Income Range */}
                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label
                    htmlFor="incomeRange"
                    className="block text-sm font-medium text-[#000000] mb-0"
                  >
                    Income Range
                  </label>
                  <div className="relative">
                    <select
                      id="incomeRange"
                      name="incomeRange"
                      value={profileData.incomeRange || ""}
                      className={` h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] ${
                            formErrors.incomeRange
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                          } focus:outline-none focus:ring-2`}
                      onChange={(e) =>
                        handleFieldChange("incomeRange", e.target.value)
                      }
                    >
                      <option value="">Select Income Range</option>
                      <option value="below_10k">Below 10,000</option>
                      <option value="10k_to_50k">10,000 - 50,000</option>
                      <option value="50k_to_1lac">50,000 - 1,00,000</option>
                      <option value="above_1lac">Above 1,00,000</option>
                    </select>
                    {/* Information icon positioned at right corner of input */}
                    <div
                      className="absolute right-4 bottom-1 transform -translate-y-1/2 group"
                      style={{ zIndex: "1000" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-red-500 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {/* Tooltip text */}
                      <div className="absolute z-1000 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                        This is additional information about the Income Range
                        field.
                      </div>
                    </div>
                  </div>
                  {formErrors.incomeRange && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.incomeRange}
                    </p>
                  )}
                </div>

                {/* Cultural Background */}
                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label
                    htmlFor="about_you"
                    className="block text-sm font-medium text-[#000000] mb-0"
                  >
                    Personal Values/About You
                  </label>
                  <div className="relative">
                    <textarea
                      id="about_you"
                      name="about_you"
                      value={profileData.about_you || ""}
                      className={`h-[100px] py-[8px] px-[12px] resize-none text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] ${
                        formErrors.about_you
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                      } focus:outline-none focus:ring-2`}
                      onChange={(e) =>
                        handleFieldChange("about_you", e.target.value)
                      }
                    />
                    {/* Information icon positioned at right corner of input */}
                    <div
                      className="absolute right-4 top-5 transform -translate-y-1/2 group"
                      style={{ zIndex: "1000" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-red-500 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {/* Tooltip text */}
                      <div className="absolute z-1000 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                        This is additional information about the Personal
                        Values/About You field.
                      </div>
                    </div>
                  </div>
                  {formErrors.about_you && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.about_you}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: "2rem" }}>
                {/* First Name */}
                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label
                    htmlFor="height"
                    className="block text-sm font-medium text-[#000000] mb-0"
                  >
                    Height(M)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="height"
                      name="height"
                      required
                      value={profileData?.hieght || ""}
                      className={
                        `h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] ${
                          formErrors.hieght
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                        } focus:outline-none focus:ring-2 pr-8` // Added pr-8 for icon space
                      }
                      onChange={(e) =>
                        handleFieldChange("hieght", e.target.value)
                      }
                    />
                    {/* Information icon positioned at right corner of input */}
                    <div
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 group"
                      style={{ zIndex: "1000" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-red-500 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {/* Tooltip text */}
                      <div className="absolute z-1000 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                        This is additional information about the Height field.
                      </div>
                    </div>
                  </div>
                  {formErrors.height && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.height}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label
                    htmlFor="weight"
                    className="block text-sm font-medium text-[#000000] mb-0"
                  >
                    Weight(Kg)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="weight"
                      name="weight"
                      required
                      value={profileData?.weight || ""}
                      className={
                        `h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] ${
                          formErrors.weight
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                        } focus:outline-none focus:ring-2 pr-8` // Added pr-8 for icon space
                      }
                      onChange={(e) =>
                        handleFieldChange("weight", e.target.value)
                      }
                    />
                    {/* Information icon positioned at right corner of input */}
                    <div
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 group"
                      style={{ zIndex: "1000" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-red-500 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {/* Tooltip text */}
                      <div className="absolute z-1000 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                        This is additional information about the Weight field.
                      </div>
                    </div>
                  </div>
                  {formErrors.weight && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.weight}
                    </p>
                  )}
                </div>

                {username == "memberCreation" && (
                  <>
                    <div className="w-[50%] relative flex flex-col gap-[10px]">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-[#000000] mb-0"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="password"
                          name="password"
                          required
                          value={profileData?.password || ""}
                          className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92]"
                          onChange={(e) =>
                            handleFieldChange("password", e.target.value)
                          }
                        />
                        {/* Information icon positioned at right corner of input */}
                        <div
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 group"
                          style={{ zIndex: "1000" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-red-500 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {/* Tooltip text */}
                          <div className="absolute z-1000 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                            This is additional information about the password
                            field.
                          </div>
                        </div>
                      </div>
                      {formErrors.password && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.password}
                        </p>
                      )}
                    </div>

                    <div className="w-[50%] relative flex flex-col gap-[10px]">
                      <label
                        htmlFor="confirm_password"
                        className="block text-sm font-medium text-[#000000] mb-0"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="confirm_password"
                          name="confirm_password"
                          required
                          value={profileData?.confirm_password || ""}
                          className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92]"
                          onChange={(e) =>
                            handleFieldChange(
                              "confirm_password",
                              e.target.value
                            )
                          }
                        />
                        {/* Information icon positioned at right corner of input */}
                        <div
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 group"
                          style={{ zIndex: "1000" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-red-500 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {/* Tooltip text */}
                          <div className="absolute z-1000 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                            This is additional information about the
                            confirm_password field.
                          </div>
                        </div>
                      </div>
                      {formErrors.confirm_password && (
                        <p className="text-red-500 text-sm mt-1">
                          {formErrors.confirm_password}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
              {username == "memberCreation" && (
                <>
                  {" "}
                  <div className="w-[50%] relative flex flex-col gap-[10px]">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[#000000] mb-0"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="email"
                        name="email"
                        required
                        value={profileData?.email || ""}
                        className={
                        `h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] ${
                          formErrors.email
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                        } focus:outline-none focus:ring-2 pr-8` // Added pr-8 for icon space
                      }
                        onChange={(e) =>
                          handleFieldChange("email", e.target.value)
                        }
                      />
                      {/* Information icon positioned at right corner of input */}
                      <div
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 group"
                        style={{ zIndex: "1000" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-red-500 cursor-pointer"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {/* Tooltip text */}
                        <div className="absolute z-1000 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-1 top-full">
                          This is additional information about the email field.
                        </div>
                      </div>
                    </div>
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.email}
                      </p>
                    )}
                  </div>
                </>
              )}
              <div style={{ display: "flex", gap: "2rem" }}></div>
              <div style={{ display: "flex", gap: "2rem" }}></div>
              <div style={{ display: "flex", justifyContent: "end" }}>
                <button
                  onClick={naviagteNextStep}
                  type="button"
                  className="text-[white] bg-[#0fd357] mt-[24px] h-[40px] w-[150px]  "
                  style={{
                    borderRadius: "5vh",
                    Color: "#fff !important",
                    fontWeight: "400",
                  }}
                >
                  Next Step
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemStepOne;
