import React from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../sections/TopBar";
import { fetchDataObjectV2, updateDataV2 } from "../../../apiUtils";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../sections/Sidebar";
import ProfileSection from "../../sections/ProfileSection";
import StepTracker from "../../StepTracker/StepTracker";
import findUser from "../../../images/findUser.svg";

const MemStepFour = () => {
  const navigate = useNavigate();
 let [userId] = useState(localStorage.getItem('userId'));
  const [message, setMessage] = useState("");
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  userId=localStorage.getItem("member_id")||userId
  const [profileData, setProfileData] = useState({
    preferred_surname: "",
    preferred_dargah_fatiha_niyah: "",
    preferred_sect: "",
    desired_practicing_level: "",
    preferred_city_state: "",
    preferred_family_type: "",
    preferred_family_background: "",
    preferred_education: "",
    preferred_occupation_profession: "",
    preferred_city:"",
    preferred_country:  '',
    preferred_state: ''
  });

  // useEffect(() => {
  //   setTimeout(() => {
  //     setErrors(null);
  //   }, 5000);
  // }, [errors]);
  useEffect(() => {

    if (userId ) {

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
        preferred_dargah_fatiha_niyah:
          apiData.preferred_dargah_fatiha_niyah,
        preferred_sect: apiData.preferred_sect,
        desired_practicing_level: apiData.desired_practicing_level,
        preferred_city_state: apiData.preferred_city_state,
        preferred_family_type: apiData.preferred_family_type,
        preferred_family_background: apiData.preferred_family_background,
        preferred_education: apiData.preferred_education,
        preferred_city:apiData.preferred_city,
        preferred_country:  apiData.preferred_country,
        preferred_state: apiData.preferred_state,
        preferred_occupation_profession:apiData.preferred_occupation_profession

      });
    }
  }, [apiData]);


  const validateForm = () => {
    const newErrors = {};

    // Validate Sect / School of Thought
    if (!profileData.preferred_sect?.trim()) {
      newErrors.preferred_sect = "Preferred sect required";
    }
    // if (!profileData.family_type) {
    //   newErrors.family_type =
    //     "Family type required";
    // }
    if (!profileData.preferred_dargah_fatiha_niyah) {
      newErrors.preferred_dargah_fatiha_niyah =
        "Field required";
    }
    if (!profileData.desired_practicing_level) {
      newErrors.desired_practicing_level =
        "Desired Practicing Level required";
    }
    if (!profileData.preferred_family_type) {
      newErrors.preferred_family_type =
        "Preferred Family Type required";
    }
    // Validate Believe in Dargah/Fatiha/Niyah
    // if (!profileData.mother_name) {
    //   newErrors.mother_name =
    //     "Mother's name required";
    // }
    // if (!profileData.family_practicing_level) {
    //   newErrors.family_practicing_level =
    //     "Family Practicing Level required";
    // }

    setErrors(newErrors);
    console.log(Object.keys(newErrors).length,">>>");
    
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  const naviagteNextStep = () => {
    const parameters = {
      url: `/api/user/${userId}`,
      payload: {
        preferred_surname: profileData.preferred_surname,
        preferred_dargah_fatiha_niyah:
          profileData.preferred_dargah_fatiha_niyah,
        preferred_sect: profileData.preferred_sect,
        desired_practicing_level: profileData.desired_practicing_level,
        preferred_city_state: profileData.preferred_city_state,
        preferred_family_type: profileData.preferred_family_type,
        preferred_family_background: profileData.preferred_family_background,
        preferred_education: profileData.preferred_education,
        preferred_occupation_profession:
          profileData.preferred_occupation_profession,
          preferred_city:profileData.preferred_city,
          preferred_country:  profileData.preferred_country,
          preferred_state: profileData.preferred_state
      },
      navigate: navigate,
      navUrl: `/memstepfive`,
      setErrors: setErrors,
    };


console.log(validateForm());

    if (
      validateForm()
    ) {
      updateDataV2(parameters);
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
      profileData.preferred_dargah_fatiha_niyah &&
      profileData.preferred_sect &&
      profileData.desired_practicing_level &&
      profileData.preferred_family_type
    ) {
      navigate(`/memstepfive/${userId}`);
    } else {
      setErrors(true);
      setMessage("Plese fill all the required fields");
    }
  };

  return (

    <div className="flex h-screen">
      <main className="flex-1 bg-white">
      {/* {errors && (
          <div
            style={{
              zIndex: "10000",
              height: "17vh",
              width: "33vw",
              backgroundColor: "#F8BF00",
              display: "flex",
              flexDirection: "row",
              // alignItems: "center",
              padding: "2vh 3vh",
              gap: "10px",
              position: "absolute",
              left: "35%",
              borderRadius :"1vh",
              cursor : "pointer"
              
            }}
          >
          <div>
            <svg width="27" height="27" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.77348 1.90259C9.14789 1.69179 9.57031 1.58105 9.99998 1.58105C10.4296 1.58105 10.8521 1.69179 11.2265 1.90259C11.6009 2.11338 11.9146 2.41712 12.1375 2.78448L12.1399 2.78844L19.1982 14.5718L19.205 14.5833C19.4233 14.9613 19.5388 15.3899 19.54 15.8264C19.5412 16.263 19.4281 16.6922 19.2119 17.0714C18.9958 17.4507 18.6841 17.7667 18.3078 17.9881C17.9316 18.2095 17.504 18.3285 17.0675 18.3333L17.0583 18.3334L2.93248 18.3333C2.49598 18.3285 2.06834 18.2095 1.69212 17.9881C1.31589 17.7667 1.00419 17.4507 0.788018 17.0714C0.571848 16.6922 0.458748 16.263 0.459971 15.8264C0.461193 15.3899 0.576695 14.9613 0.794985 14.5833L0.801754 14.5718L7.86247 2.78448C8.0853 2.41711 8.39908 2.11338 8.77348 1.90259ZM9.99998 3.24772C9.85675 3.24772 9.71595 3.28463 9.59115 3.3549C9.46691 3.42485 9.3627 3.52549 9.28849 3.64721L2.23555 15.4215C2.16457 15.5464 2.12703 15.6874 2.12663 15.8311C2.12622 15.9766 2.16392 16.1197 2.23598 16.2461C2.30804 16.3725 2.41194 16.4779 2.53735 16.5517C2.66166 16.6248 2.80281 16.6644 2.94697 16.6667H17.053C17.1971 16.6644 17.3383 16.6248 17.4626 16.5517C17.588 16.4779 17.6919 16.3725 17.764 16.2461C17.836 16.1197 17.8737 15.9766 17.8733 15.8311C17.8729 15.6875 17.8354 15.5464 17.7644 15.4216L10.7125 3.64886C10.7121 3.64831 10.7118 3.64776 10.7115 3.64721C10.6373 3.52549 10.533 3.42485 10.4088 3.3549C10.284 3.28463 10.1432 3.24772 9.99998 3.24772Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.0001 6.6665C10.4603 6.6665 10.8334 7.0396 10.8334 7.49984V10.8332C10.8334 11.2934 10.4603 11.6665 10.0001 11.6665C9.53984 11.6665 9.16675 11.2934 9.16675 10.8332V7.49984C9.16675 7.0396 9.53984 6.6665 10.0001 6.6665Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.16675 14.1668C9.16675 13.7066 9.53984 13.3335 10.0001 13.3335H10.0084C10.4687 13.3335 10.8417 13.7066 10.8417 14.1668C10.8417 14.6271 10.4687 15.0002 10.0084 15.0002H10.0001C9.53984 15.0002 9.16675 14.6271 9.16675 14.1668Z" fill="white"/>
</svg>
</div>


            <div
              style={{
                display: "flex",
                flexDirection: "column",
                color: "white",
                width :"100%",
                paddingLeft : "5%"
              }}
            >
              <h2 style={{ margin: 0, fontSize: "3vh", fontWeight: "500" }}>
                Missing Information
              </h2>
              <p style={{ margin: 0, width: "100%", fontSize :"2.2vh"}}>
                Please fill out all required fields to proceed to the next step
              </p>
            </div>
              <div onClick={()=>setErrors(!errors)}>
            <svg width="27" height="27" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M15.5893 4.41058C15.9148 4.73602 15.9148 5.26366 15.5893 5.58909L5.58934 15.5891C5.2639 15.9145 4.73626 15.9145 4.41083 15.5891C4.08539 15.2637 4.08539 14.736 4.41083 14.4106L14.4108 4.41058C14.7363 4.08514 15.2639 4.08514 15.5893 4.41058Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M4.41083 4.41058C4.73626 4.08514 5.2639 4.08514 5.58934 4.41058L15.5893 14.4106C15.9148 14.736 15.9148 15.2637 15.5893 15.5891C15.2639 15.9145 14.7363 15.9145 14.4108 15.5891L4.41083 5.58909C4.08539 5.26366 4.08539 4.73602 4.41083 4.41058Z" fill="white"/>
</svg>
</div>
          </div>
        )} */}
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
            <StepTracker percentage={75} />
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
              position:"absolute",
              left:"24.2rem",
              zIndex:"0"
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
                step 4/6
              </p>
              <h4 className="col-span-3 m-0 p-0" style={{ fontWeight: "bold" }}>
              Partner Expectations
              </h4>
              <p
                style={{
                  fontSize: "small",
                  color: "gray",
                  marginBottom: "1vh",
                  padding: "0",
                }}
              >
               Fill in the details below to share your expectations and vision for your partnership.
              </p>
              <div
                style={{
                  height: "0.7px",
                  width: "100%",
                  backgroundColor: "#ccc",
                }}
              ></div>
                                <div style={{ display: "flex", gap: "2rem" }}>
                    <div className="w-[50%] relative">
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-[#000000]"
                      >
                        Preferred Surname
                      </label>
                      <div className="relative">

                      <input
                        type="text"
                        id="preferredSurname"
                        name="preferredSurname"
                        className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                        placeholder="Enter surname"
                        value={profileData.preferred_surname}
                        onChange={(e) =>
                          updateField("preferred_surname", e.target.value)
                        }
                      />
                        {/* Information icon positioned at right corner of input */}
    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 group z-20">
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
        This is additional information about the Preferred Surname field.
      </div>
    </div>
    </div>
                    </div>

                    <div className="w-[50%] relative">
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-[#000000]"
                      >
                        Preferred Sect <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="relative">

                      <select
                        id="preferredSect"
                        name="preferredSect"
                        required
                        className={
                          `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${
                            errors.preferred_sect ? 
                              "border-red-500 focus:border-red-500 focus:ring-red-500" 
                              : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                          } focus:outline-none focus:ring-2`
                        } 
                                                value={profileData.preferred_sect}
                        onChange={(e) =>
                          updateField("preferred_sect", e.target.value)
                        }
                      >
                        <option value="">Select Sect</option>
                        <option value="Sunni">Sunni</option>
                        <option value="Shia">Shia</option>
                        <option value="Other">Other</option>
                      </select>
                        {/* Information icon positioned at right corner of input */}
    <div className="absolute right-4 mt-1 top-1/2 transform -translate-y-1/2 group z-20">
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
        This is additional information about the Preferred Sect field.
      </div>
    </div>
    </div>
                      {errors.preferred_sect && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.preferred_sect}
                    </p>
                  )}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "2rem" }}>
                  <div className="w-[50%] relative">
                  <div className="relative">
                  <label className="block text-sm font-medium text-[#000000]">
                  Belives in Dargah/Fatiha/Niyah? <span style={{ color: "red" }}>*</span>
                  </label>
                    {/* Information icon positioned at right corner of input */}
    <div className="absolute left-60 top-1/2 transform -translate-y-1/2 group z-20">
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
        This is additional information about the Belives in Dargah/Fatiha/Niyah field.
      </div>
    </div>
    </div>
                  


                  <div className="flex items-center space-x-4">
                    <button
                      onClick={(e) => updateField("preferred_dargah_fatiha_niyah", "yes")}
                      type="button"
                      className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${profileData.preferred_dargah_fatiha_niyah === "yes" ? "bg-green-500" : "bg-gray-300"
                        }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${profileData.preferred_dargah_fatiha_niyah === "yes" ? "translate-x-6" : "translate-x-0"
                          }`}
                      ></div>
                    </button>
                    <span className="text-gray-700">Yes</span>

                    <button
                      onClick={(e) => updateField("preferred_dargah_fatiha_niyah", "no")}
                           type="button"
                      className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${profileData.preferred_dargah_fatiha_niyah === "no" ? "bg-green-500" : "bg-gray-300"
                        }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${profileData.preferred_dargah_fatiha_niyah === "no" ? "translate-x-6" : "translate-x-0"
                          }`}
                      ></div>
                    </button>
                    <span className="text-gray-700">No</span>
                  
                  </div>
                  {errors.preferred_dargah_fatiha_niyah && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.preferred_dargah_fatiha_niyah}
                    </p>
                  )}
                </div>

                    <div className="w-[50%] relative">
                      <label
                        htmlFor="dob"
                        className="block text-sm font-medium text-[#000000]"
                      >
                        Desired Practicing Level{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="relative">
                      <select
                        id="desiredPracticingLevel"
                        name="desiredPracticingLevel"
                        value={profileData.desired_practicing_level}
                        required
                        className={
                          `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${
                            errors.desired_practicing_level ? 
                              "border-red-500 focus:border-red-500 focus:ring-red-500" 
                              : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                          } focus:outline-none focus:ring-2`
                        }                         onChange={(e) =>
                          updateField(
                            "desired_practicing_level",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select Practicing Level</option>
                        <option value="High">High</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Low">Low</option>
                      </select>
                        {/* Information icon positioned at right corner of input */}
    <div className="absolute right-4 mt-1 top-1/2 transform -translate-y-1/2 group z-20">
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
        This is additional information about the Desired Practicing Level field.
      </div>
    </div>
    </div>
                      {errors.desired_practicing_level && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.desired_practicing_level}
                    </p>
                  )}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "2rem" }}>
                    <div className="w-[50%] relative">
                      <label
                        htmlFor="maritalStatus"
                        className="block text-sm font-medium text-[#000000]"
                      >
                        Preferred Family Type{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="relative">
                      <select
                        id="preferredFamilyType"
                        name="preferredFamilyType"
                        value={profileData.preferred_family_type}
                        required
                        className={
                          `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${
                            errors.preferred_family_type ? 
                              "border-red-500 focus:border-red-500 focus:ring-red-500" 
                              : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                          } focus:outline-none focus:ring-2`
                        }                         onChange={(e) =>
                          updateField("preferred_family_type", e.target.value)
                        }
                      >
                        <option value="">Select Family Type</option>
                        <option value="Nuclear">Nuclear</option>
                        <option value="Joint">Joint</option>
                        <option value="Extended">Extended</option>
                      </select>
                      {/* Information icon positioned at right corner of input */}
    <div className="absolute right-4 mt-1 top-1/2 transform -translate-y-1/2 group z-20">
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
        This is additional information about the Preferred Family Type field.
      </div>
    </div>
    </div>
                      {errors.preferred_family_type && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.preferred_family_type}
                    </p>
                  )}
                    </div>

                    <div className="w-[50%] relative">
                      <label
                        htmlFor="maritalStatus"
                        className="block text-sm font-medium text-[#000000]"
                      >
                        Education Level
                      </label>
                      <div className="relative">
                      <select
                        id="educationLevel"
                        name="educationLevel"
                        className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                        value={profileData.preferred_education}
                        onChange={(e) =>
                          updateField("preferred_education", e.target.value)
                        }
                      >
                        <option value="">Select Education Level</option>
                        <option value="High School">High School</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="Doctorate">Doctorate</option>
                      </select>
                      {/* Information icon positioned at right corner of input */}
    <div className="absolute right-4 mt-1 top-1/2 transform -translate-y-1/2 group z-20">
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
        This is additional information about the Education Level field.
      </div>
    </div>
    </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "2rem" }}>
                  <div className="w-[50%] relative">
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-[#000000]"
                      >
                        Profession / Occupation
                      </label>
                      <div className="relative">
                      <input
                        type="text"
                        id="preferredSurname"
                        name="preferredSurname"
                        value={profileData.preferred_occupation_profession}
                        className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                        placeholder="Profession / Occupation"
                        onChange={(e) =>
                          updateField("preferred_occupation_profession", e.target.value)
                        }
                      />
                      {/* Information icon positioned at right corner of input */}
    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 group z-20">
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
        This is additional information about the Profession / Occupation field.
      </div>
    </div>
    </div>
                    </div>

                    <div className="w-[50%] relative">
  <label
    htmlFor="maritalStatus"
    className="block text-sm font-medium text-[#000000]"
  >
    Preferred Location
  </label>

  <div style={{ display: "flex", width: "100%" }}>
    
    {/* City Dropdown with Tooltip */}
    <div className="w-1/3 relative">
      <div className="relative">
        <select
          id="preferred_city"
          name="preferred_city"
          required
          value={profileData.preferred_city || ""}
          className="mt-1 px-[12px] text-[12px] h-[38px] w-[90%] border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
          onChange={(e) =>
            updateField("preferred_city", e.target.value)
          }
        >
          <option value="">City</option>
          <option value="mumbai">Mumbai</option>
          <option value="delhi">Delhi</option>
          <option value="bangalore">Bangalore</option>
          <option value="hyderabad">Hyderabad</option>
          <option value="chennai">Chennai</option>
          <option value="kolkata">Kolkata</option>
          <option value="pune">Pune</option>
          <option value="ahmedabad">Ahmedabad</option>
          <option value="jaipur">Jaipur</option>
          <option value="lucknow">Lucknow</option>
        </select>

        {/* Tooltip */}
        <div className="absolute right-8 top-3.5 group">
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
          <div className="absolute z-10 hidden group-hover:block w-48 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-full ml-2 top-1/2 transform -translate-y-1/2">
            Please select your preferred city.
          </div>
        </div>
      </div>
    </div>

    {/* State Dropdown with Tooltip */}
    <div className="w-1/3 relative">
      <div className="relative">
        <select
          id="preferred_state"
          name="preferred_state"
          required
          value={profileData.preferred_state || ""}
          className="mt-1 px-[12px] text-[12px] h-[38px] w-[90%] border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
          onChange={(e) =>
            updateField("preferred_state", e.target.value)
          }
        >
          <option value="">State</option>
          <option value="andhra_pradesh">Andhra Pradesh</option>
          <option value="arunachal_pradesh">Arunachal Pradesh</option>
          <option value="assam">Assam</option>
          <option value="bihar">Bihar</option>
          <option value="chhattisgarh">Chhattisgarh</option>
          <option value="goa">Goa</option>
          <option value="gujarat">Gujarat</option>
          <option value="haryana">Haryana</option>
          <option value="himachal_pradesh">Himachal Pradesh</option>
          <option value="jharkhand">Jharkhand</option>
          <option value="karnataka">Karnataka</option>
          <option value="kerala">Kerala</option>
          <option value="madhya_pradesh">Madhya Pradesh</option>
          <option value="maharashtra">Maharashtra</option>
          <option value="manipur">Manipur</option>
          <option value="meghalaya">Meghalaya</option>
          <option value="mizoram">Mizoram</option>
          <option value="nagaland">Nagaland</option>
          <option value="odisha">Odisha</option>
          <option value="punjab">Punjab</option>
          <option value="rajasthan">Rajasthan</option>
          <option value="sikkim">Sikkim</option>
          <option value="tamil_nadu">Tamil Nadu</option>
          <option value="telangana">Telangana</option>
          <option value="tripura">Tripura</option>
          <option value="uttar_pradesh">Uttar Pradesh</option>
          <option value="uttarakhand">Uttarakhand</option>
          <option value="west_bengal">West Bengal</option>
        </select>

        {/* Tooltip */}
        <div className="absolute right-8 top-3.5 group">
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
          <div className="absolute z-10 hidden group-hover:block w-48 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-full ml-2 top-1/2 transform -translate-y-1/2">
            Please select your preferred state.
          </div>
        </div>
      </div>
    </div>

    {/* Country Dropdown with Tooltip */}
    <div className="w-1/3 relative">
      <div className="relative">
        <select
          id="preferred_country"
          name="preferred_country"
          required
          value={profileData.preferred_country || ""}
          className="mt-1 px-[12px] text-[12px] h-[38px] w-[90%] border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
          onChange={(e) =>
            updateField("preferred_country", e.target.value)
          }
        >
          <option value="">Country</option>
          <option value="india">India</option>
          <option value="usa">United States</option>
          <option value="canada">Canada</option>
          <option value="australia">Australia</option>
          <option value="uk">United Kingdom</option>
          <option value="china">China</option>
          <option value="japan">Japan</option>
          <option value="germany">Germany</option>
          <option value="france">France</option>
          <option value="italy">Italy</option>
          <option value="brazil">Brazil</option>
          <option value="south_africa">South Africa</option>
          <option value="russia">Russia</option>
          <option value="mexico">Mexico</option>
          <option value="new_zealand">New Zealand</option>
        </select>

        {/* Tooltip */}
        <div className="absolute right-8 top-3.5 group">
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
          <div className="absolute z-10 hidden group-hover:block w-48 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-full ml-2 top-1/2 transform -translate-y-1/2">
            Please select your preferred country.
          </div>
        </div>
      </div>
    </div>

  </div>
</div>

                  </div>

                  <div style={{ display: "flex", gap: "2rem" }}>
                    <div className="w-[50%] relative">
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-[#000000]"
                      >
                        Partner's Family Background
                      </label>
                      <div className="relative">
                      <textarea
                        id="partnerFamilyBackground"
                        name="partnerFamilyBackground"
                        rows="3"
                        value={profileData.preferred_family_background || ""}
                        className="mt-1 resize-none min-h-[70px] p-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                        placeholder="Describe family background"
                        onChange={(e) =>
                          updateField(
                            "preferred_family_background",
                            e.target.value
                          )
                        }
                      ></textarea>
                      {/* Information icon positioned at right corner of input */}
    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 group z-20">
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
        This is additional information about the Partner's Family Background field.
      </div>
    </div>
    </div>
                    </div>

                    <div className="w-[50%]">
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-[#000000]"
                      ></label>
                    </div>
                  </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  onClick={() => {
                    navigate("/memstepthree");
                  }}
                  className="text-[black] bg-[white] mt-[24px] h-[40px] w-[150px]   "
                  style={{
                    borderRadius: "5vh",
                    Color: "#fff !important",
                    fontWeight: "400",
                    border: "1px solid black",
                  }}
                >
                  Back
                </button>
                <button
                type="button"
                  onClick={naviagteNextStep}
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

export default MemStepFour;
