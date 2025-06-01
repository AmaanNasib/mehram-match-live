import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchDataV2, justputDataWithoutToken, updateDataReturnId } from "../../../apiUtils";
import TopBar from "../../sections/TopBar";
import Sidebar from "../../sections/Sidebar";
import ProfileSection from "../../sections/ProfileSection";
import { fetchDataObjectV2 } from "../../../apiUtils";
import StepTrackerAgent from "../../StepTracker/StepTrackerAgent";
import findUser from "../../../images/findUser.svg";

const AgentStepOne = () => {
  const navigate = useNavigate();
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId] = useState(localStorage.getItem('userId'));
  const [formErrors, setFormErrors] = useState({});
  const [useerror, setErrors] = useState({});
  const role = localStorage.getItem("role")


  useEffect(() => {
    if (userId) {

      if (role=='agent') {
        const parameter = {
          url:role =='agent'? `/api/agent/${userId}/`:`/api/user/${userId}/`,
          setterFunction: setApiData,
          setErrors: setErrors,
        };
        fetchDataV2(parameter);
      } else {
        const parameter = {
          url:   `/api/user/${userId}/`,
          setterFunction: setApiData,
          setLoading: setLoading,
        };
        fetchDataObjectV2(parameter);
      }
   
    }
  }, [userId]);

  useEffect(() => {
    if (apiData) {
      setProfileData({
        first_name: apiData.first_name || null,
        last_name: apiData.last_name || null,
        contact_number: apiData.contact_number || null,
        gender: apiData.gender || null,
        email: apiData.email || null,
      });
    }
  }, [apiData]);

  const naviagteNextStep = () => {
    if (handleValidForm()) {
      console.log(profileData.hieght, "valid");

      const parameters = {
        url:  `/api/agent/${userId}/`,
        payload: {
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          gender: profileData.gender,
          contact_number: profileData.contact_number,
        },
        navigate: navigate,
        navUrl: `/agentsteptwo/${userId}`,
        setErrors : setErrors ,
      };
      // navigate(`/agentsteptwo/${userId}`)
      justputDataWithoutToken(parameters);
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
    const heightWeightRegex = /^\d{1,3}(\.\d{1,3})?$/// limit 3

    // Validate First Name
    if (!profileData.first_name?.trim()) {
      newErrors.first_name = 'First Name is required';
    } else if (!nameRegex.test(profileData.first_name)) {
      newErrors.first_name = 'First Name should contain only letters';
    }

    // Validate Last Name
    if (!profileData.last_name?.trim()) {
      newErrors.last_name = 'Last Name is required';
    } else if (!nameRegex.test(profileData.last_name)) {
      newErrors.last_name = 'Last Name should contain only letters';
    }

    // Validate Gender
    if (!profileData.gender) {
      newErrors.gender = 'Gender is required';
    }

    console.log('newErrors', newErrors);

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    gender: '',
    contact_number: '',
  });


  const marital_statuses = [
    { value: "Unmarried", label: "Unmarried" },
    { value: "Married", label: "Married" },
    { value: "Divorced", label: "Divorced" },
    { value: "Widowed", label: "Widowed" }
  ];

  const genders = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" }
  ];

  const Dropdown = ({ options, name, value, onChange }) => {

    return (
      <select
        name={name}
        value={value || ''}
        onChange={onChange}
        className="mt-1 px-[12px] text-[12px] h-[38px] w-[100%] border rounded-[10px] border-[#ccc] focus:ring-[gray] focus:border-[gray]"
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
          }}></div>

        <div className="form_container_user_creation h-auto bg-white pb-[12px] w-[100vw] ">
          <div
            style={{
              width: "33.8%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <StepTrackerAgent percentage={25} />
          </div>

          <div style={{ width: "86.1%", marginLeft: "19.5%" }}>
            <form
              style={{
                borderLeft: "0.5px solid #ccc",
                padding: "1rem",
                width: "70%",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                padding: "1% 4%",
                margin: "auto",
                height: "auto",
                position: "absolute",
                left: "24.2rem",
                zIndex: "0"
              }}
            >
              <p style={{ fontSize: "small", color: "gray", margin: "0", padding: "0" }}>
                step 1/6
              </p>
              <h4 className="col-span-3 m-0 p-0" style={{ fontWeight: "bold" }}>
                Let's start with your personal details
              </h4>
              <p style={{ fontSize: "small", color: "gray", marginBottom: "1vh", padding: "0", }}>
                Please fill information below to create your Mehram Match Profile
              </p>
              <div style={{ height: "0.7px", width: "100%", backgroundColor: "#ccc", }}></div>
              <div style={{ display: "flex", gap: "2rem" }}>
                {/* First Name */}
                <div className="w-[50%] relative">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-[#000000]"
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
                        `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${formErrors.first_name ?
                          "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                        } focus:outline-none focus:ring-2 pr-8`  // Added pr-8 for icon space
                      }
                      onChange={(e) =>
                        handleFieldChange("first_name", e.target.value)
                      }
                    />
                    {/* Information icon positioned at right corner of input */}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 group z-20" style={{ zIndex: "1000" }}>
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
                        This is additional information about the First Name field.
                      </div>
                    </div>
                  </div>
                  {formErrors.first_name && <p className="text-red-500 text-sm mt-1">{formErrors.first_name}</p>}
                </div>

                {/* Last Name */}
                <div className="w-[50%] relative">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-[#000000]"
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
                      className={
                        `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${formErrors.last_name ?
                          "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                        } focus:outline-none focus:ring-2`
                      }
                      onChange={(e) => handleFieldChange("last_name", e.target.value)}
                    />
                    {/* Information icon positioned at right corner of input */}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 group" style={{ zIndex: "1000" }}>
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
                        This is additional information about the Last Name field.
                      </div>
                    </div>
                  </div>
                  {formErrors.last_name && <p className="text-red-500 text-sm mt-1">{formErrors.last_name}</p>}
                </div>
              </div>

              <div style={{ display: "flex", gap: "2rem" }}>
                <div className="w-[50%] relative">
                  <label htmlFor="gender" className="block text-sm font-medium text-[#000000]">
                    Gender <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="relative">
                    <div className={
                      `mt-2 rounded-lg border-1 ${formErrors.gender ?
                        "border-red-500 focus-within:border-red-500 focus-within:ring-red-500"
                        : "border-[#898B92] focus-within:border-[#898B92] focus-within:ring-[#898B92]"
                      } focus-within:outline-none focus-within:ring-2`
                    }>
                      <Dropdown
                        options={genders}
                        name="gender"
                        value={profileData.gender}
                        onChange={(e) => handleFieldChange('gender', e.target.value)}
                        className="h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full bg-transparent outline-none"
                      />
                    </div>
                    {/* Information icon positioned at right corner of input */}
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 group">
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
                  {formErrors.gender && <p className="text-red-500 text-sm mt-1">{formErrors.gender}</p>}
                </div>

                {/* Last Name */}
                <div className="w-[50%] relative">
                  <label
                    htmlFor="phonenumber"
                    className="block text-sm font-medium text-[#000000]"
                  >
                    Phone Number <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="phonenumber"
                      name="phonenumber"
                      required
                      value={profileData.contact_number || ""}
                      className={
                        `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${formErrors.contact_number ?
                          "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                        } focus:outline-none focus:ring-2`
                      }
                      onChange={(e) => handleFieldChange("contact_number", e.target.value)}
                    />
                    {/* Information icon positioned at right corner of input */}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 group" style={{ zIndex: "1000" }}>
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
                        This is additional information about the Last Name field.
                      </div>
                    </div>
                  </div>
                  {formErrors.contact_number && <p className="text-red-500 text-sm mt-1">{formErrors.contact_number}</p>}
                </div>
              </div>


              <div style={{ display: "flex", gap: "2rem" }}>
              <div className="w-[50%] relative">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#000000]"
                  >
                    Email <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="email"
                      name="email"
                      required
                      value={profileData.email || ""}
                      className={
                        `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${formErrors.email ?
                          "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                        } focus:outline-none focus:ring-2`
                      }
                      onChange={(e) => handleFieldChange("email", e.target.value)}
                    />
                    {/* Information icon positioned at right corner of input */}
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 group" style={{ zIndex: "1000" }}>
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
                        This is additional information about the Last Name field.
                      </div>
                    </div>
                  </div>
                  {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                </div>
              </div>

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
                  }}>
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

export default AgentStepOne;
