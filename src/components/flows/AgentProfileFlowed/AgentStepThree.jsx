import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchDataV2, justputDataWithoutToken, updateDataV2 } from "../../../apiUtils";
import { useParams } from "react-router-dom";
import Sidebar from "../../sections/Sidebar";
import TopBar from "../../sections/TopBar";
import ProfileSection from "../../sections/ProfileSection";
import StepTrackerAgent from "../../StepTracker/StepTrackerAgent";
import findUser from "../../../images/findUser.svg";
import { fetchDataObjectV2 } from "../../../apiUtils";

const MemStepThree = () => {
  const navigate = useNavigate();
  const [userId] = useState(localStorage.getItem('userId'));
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);
  const [flag, setflag] = useState(false);

  const [profileData, setProfileData] = useState({
    education_level: "",
    profession: "",
  });

  useEffect(() => {

    if (userId) {
      const parameter = {
        url: `/api/agent/${userId}/`,
        setterFunction: setApiData,
        setErrors: setErrors,
      };
      fetchDataV2(parameter);
    }


  }, [userId]);

  useEffect(() => {
    if (apiData) {
      setProfileData({
        education_level: apiData.education_level || null,
        profession: apiData.profession || null,
      });
    }
  }, [apiData]);
  const validateForm = () => {
    const newErrors = {};

    // Validate Sect / School of Thought
    if (!profileData.education_level?.trim()) {
      newErrors.education_level = "education_level required";
    }
    if (!profileData.profession) {
      newErrors.profession =
        "profession required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  const naviagteNextStep = () => {
    const parameters = {
      url: `/api/agent/${userId}/`,
      payload: {
        education_level: profileData.education_level,
        profession: profileData.profession,
      },
      navigate: navigate,
      navUrl: `/agentstepfou/${userId}`,
      setErrors: setErrors,
    };
    // navigate(`/agentstepfou/${userId}`)
    if (validateForm()) {
      // updateDataV2(parameters);
      justputDataWithoutToken(parameters);
    }

  };

  const updateField = (field, value) => {
    setProfileData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const skip = () => {
    if (
      profileData.father_name &&
      profileData.mother_name &&
      profileData.number_of_siblings &&
      profileData.family_type &&
      profileData.family_practicing_level
    ) {
      const hasSiblings =
        profileData.number_of_siblings > 0 &&
        profileData.number_of_brother &&
        profileData.number_of_sister;

      const isFemaleWithWali =
        profileData.gender === "female" &&
        profileData.wali_name &&
        profileData.wali_contact_number &&
        profileData.wali_blood_relation;

      const isMaritalStatusValid =
        ["Divocer", "Widowed"].includes(profileData.martial_status) ||
        profileData.number_of_children > 0;

      const hasChildren =
        profileData.number_of_son && profileData.number_of_daughter;
      console.log(hasSiblings, hasChildren, isMaritalStatusValid);

      if (hasSiblings) {
        navigate(`/memstepfour/${userId}`);
      } else if (isFemaleWithWali) {
        navigate(`/memstepfour/${userId}`);
      } else if (isMaritalStatusValid && hasChildren) {
        navigate(`/memstepfour/${userId}`);
      } else {
        setErrors(true);
        setMessage("Please Fill the required Field");
      }
    } else {
      setErrors(true);
      setMessage("Please Fill the required Field");
    }
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
            <StepTrackerAgent percentage={55} />
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
              <p
                style={{
                  fontSize: "small",
                  color: "gray",
                  margin: "0",
                  padding: "0",
                }}
              >
                step 3/6
              </p>
              <h4 className="col-span-3 m-0 p-0" style={{ fontWeight: "bold" }}>
                Education and Profession
              </h4>
              <p
                style={{
                  fontSize: "small",
                  color: "gray",
                  marginBottom: "1vh",
                  padding: "0",
                }}
              >
                Share details about your family to help us better understand your background and preferences
              </p>
              <div
                style={{
                  height: "0.7px",
                  width: "100%",
                  backgroundColor: "#ccc",
                }}
              ></div>

              {/* Father's Name and Occupation */}
              <div style={{ display: "flex", gap: "2rem" }}>
              <div className="w-[50%] relative">
                  <label htmlFor="edulevel" className="block text-sm font-medium text-[#000000]">
                  Education Level  <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="relative">

                    <select
                      id="edulevel"
                      name="edulevel"
                      value={profileData.education_level || ''}
                      required
                      className={
                        `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${errors.education_level ?
                          "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                        } focus:outline-none focus:ring-2`
                      } onChange={(e) => updateField("education_level", e.target.value)}
                    >
                      <option value="">Select Level</option>
                      <option value="0">High School </option>
                      <option value="1">Bachelor’s Degree </option>
                      <option value="2">Master’s Degree </option>
                      <option value="3">Other (Specify) </option>
                    </select>
                    {/* Information icon positioned at right corner of input */}
                    <div className="absolute right-4 top-1/2 mt-1 transform -translate-y-1/2 group z-20">
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
                      <div className="absolute z-10 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-2 top-full">
                        This is additional information about the Number of Siblings field.
                      </div>
                    </div>
                  </div>
                  {errors.education_level && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.education_level}
                    </p>
                  )}
                </div>
                <div className="w-[50%] relative">
                  <label htmlFor="profession" className="block text-sm font-medium text-[#000000]">
                  Profession  <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="relative">

                    <select
                      id="edulevel"
                      name="edulevel"
                      value={profileData.profession || ''}
                      required
                      className={
                        `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${errors.profession ?
                          "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                        } focus:outline-none focus:ring-2`
                      } onChange={(e) => updateField("profession", e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="0">Full-time Agent  </option>
                      <option value="1">Part-time Agent </option>
                      <option value="3">Other (Specify) </option>
                    </select>
                    {/* Information icon positioned at right corner of input */}
                    <div className="absolute right-4 top-1/2 mt-1 transform -translate-y-1/2 group z-20">
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
                      <div className="absolute z-10 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-2 top-full">
                        This is additional information about the Number of Siblings field.
                      </div>
                    </div>
                  </div>
                  {errors.profession && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.profession}
                    </p>
                  )}
                </div>
              </div>


              {/* Navigation Buttons */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  onClick={() => navigate(`/agentsteptwo/${userId}`)}
                  className="text-[black] bg-[white] mt-[24px] h-[40px] w-[150px]"
                  style={{
                    borderRadius: "5vh",
                    fontWeight: "400",
                    border: "1px solid black",
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={naviagteNextStep}
                  className="text-[white] bg-[#0fd357] mt-[24px] h-[40px] w-[150px]"
                  style={{
                    borderRadius: "5vh",
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

export default MemStepThree;

