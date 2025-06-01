import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { updateDataV2 } from "../../../apiUtils";
import { useParams } from "react-router-dom";
import Sidebar from "../../sections/Sidebar";
import TopBar from "../../sections/TopBar";
import ProfileSection from "../../sections/ProfileSection";
import StepTracker from "../../StepTracker/StepTracker";
import findUser from "../../../images/findUser.svg";
import { fetchDataObjectV2 } from "../../../apiUtils";

const MemStepThree = () => {
  const navigate = useNavigate();
  let [userId] = useState(localStorage.getItem('userId'));
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);
  const [flag, setflag] = useState(false);
  userId =  localStorage.getItem("member_id")||userId
  const [profileData, setProfileData] = useState({
    father_name: "",
    father_occupation: "",
    mother_name: "",
    mother_occupation: "",
    wali_name: "",
    wali_contact_number: "",
    wali_blood_relation: "",
    father_alive: "",
    mother_alive: "",
    number_of_children: null,
    number_of_brother: null,
    number_of_sister: null,
    number_of_son: null,
    number_of_daughter: null,
    number_of_siblings: null,
    number_of_brothers: null,
    number_of_sisters: null,
    step_father: "",
    step_mother: "",
    family_type: "",
    family_practicing_level: "",
    percentage: "",
    gender: "",
    martial_status: "",
    weight: "",
    hieght: "",

  });
 
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
        percentage: apiData.profile_percentage || null,
        gender: apiData.gender || null,
        martial_status: apiData.martial_status || null,
        father_name: apiData.father_name || '',
        father_occupation: apiData.father_occupation || '',
        mother_name: apiData.mother_name || '',
        mother_occupation: apiData.mother_occupation || '',
        wali_name: apiData.wali_name || '',
        wali_contact_number: apiData.wali_contact_number || '',
        wali_blood_relation: apiData.wali_blood_relation || '',
        number_of_children: apiData.number_of_children || 0,
        number_of_son: apiData.number_of_son || 0,
        number_of_daughter: apiData.number_of_daughter || 0,
        number_of_siblings: apiData.number_of_siblings ||0,
        number_of_brothers: apiData.number_of_brothers || 0,
        number_of_sisters: apiData.number_of_sisters || 0,
        family_type: apiData.family_type || '',
        family_practicing_level: apiData.family_practicing_level || '',
        father_alive: apiData.father_alive,
        mother_alive: apiData.mother_alive,
        step_father: apiData.step_father,
        step_mother: apiData.step_mother,
      });
    }
  }, [apiData]);
  const validateForm = () => {
    const newErrors = {};

    // Validate Sect / School of Thought
    if (!profileData.father_name?.trim()) {
      newErrors.father_name = "Father's name required";
    }
    if (!profileData.family_type) {
      newErrors.family_type =
        "Family type required";
    }
    // Validate Believe in Dargah/Fatiha/Niyah
    if (!profileData.mother_name) {
      newErrors.mother_name =
        "Mother's name required";
    }
    if (!profileData.family_practicing_level) {
      newErrors.family_practicing_level =
        "Family Practicing Level required";
    }
    // if (!profileData.number_of_brothers) {
    //   newErrors.mother_name =
    //     "Mother's name required";
    // }
    if (!profileData.number_of_siblings) {
      newErrors.number_of_siblings =
        "Number of Siblings required";
    }
   else if (profileData.number_of_siblings) {
     let sibcon= Number(profileData.number_of_siblings)==Number(profileData.number_of_brothers)+Number(profileData.number_of_sisters)
     if (!sibcon) {
newErrors.number_of_siblings = "Number of Siblings doesn't match"
     }
    }
   if (profileData.number_of_children) {
     let chicon= Number(profileData.number_of_children)==Number(profileData.number_of_son)+Number(profileData.number_of_daughter)
     if (!chicon) {
newErrors.number_of_children = "Number of Children doesn't match"
     }
    }
 
 
    if (profileData.gender === "female" && !profileData.wali_blood_relation) {
      newErrors.wali_blood_relation =
        "Blood Relation is required";
    }
    if (profileData.gender === "female" && !profileData.wali_name) {
      newErrors.wali_name =
        "Wali Name is required";
    }
    if (profileData.gender === "female" && !profileData.wali_contact_number) {
      newErrors.wali_contact_number =
        "Wali Phone Number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  const naviagteNextStep = () => {
    const parameters = {
      url: `/api/user/${userId}`,
      payload: {
        father_name: profileData.father_name,
        father_occupation: profileData.father_occupation,
        mother_name: profileData.mother_name,
        mother_occupation: profileData.mother_occupation,
        wali_name: profileData.wali_name,
        wali_contact_number: profileData.wali_contact_number,
        wali_blood_relation: profileData.wali_blood_relation,
        number_of_children: profileData.number_of_children,
        number_of_son: profileData.number_of_son,
        number_of_daughter: profileData.number_of_daughter,
        number_of_siblings: profileData.number_of_siblings,
        number_of_brothers: profileData.number_of_brothers,
        number_of_sisters: profileData.number_of_sisters,
        family_type: profileData.family_type,
        family_practicing_level: profileData.family_practicing_level,
        father_alive: profileData.father_alive,
        mother_alive: profileData.mother_alive,
        step_father: profileData.step_father,
        step_mother: profileData.step_mother,
      },
      navigate: navigate,
      navUrl: `/memstepfour`,
      setErrors: setErrors,
    };

    // if (
    //   profileData.father_name &&
    //   profileData.mother_name &&
    //   profileData.number_of_siblings &&
    //   profileData.family_type &&
    //   profileData.family_practicing_level
    // ) {
    //   const hasSiblings =
    //     profileData.number_of_siblings > 0 &&
    //     profileData.number_of_brother &&
    //     profileData.number_of_sister;

    //   const isFemaleWithWali =
    //     profileData.gender === "femail" &&
    //     profileData.wali_name &&
    //     profileData.wali_contact_number &&
    //     profileData.wali_blood_relation;

    //   const isMaritalStatusValid =
    //     ["Divocer", "Widowed"].includes(profileData.martial_status) ||
    //     profileData.number_of_children > 0;

    //   const hasChildren =
    //     profileData.number_of_son && profileData.number_of_daughter;
    //     console.log(hasSiblings,hasChildren,isMaritalStatusValid);
    //   if (hasSiblings) {
    //     updateDataV2(parameters);
    //   } else if (isFemaleWithWali) {
    //     updateDataV2(parameters);
    //   } else if (isMaritalStatusValid && hasChildren) {
    //     updateDataV2(parameters);
    //   } else {
    //     setErrors(true);
    //     setMessage("Please Fill the required Field");
    //   }
    // } else {
    //   setErrors(true);
    //   setMessage("Please Fill the required Field");
    // }
    if (validateForm()) {
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
console.log(hasSiblings,hasChildren,isMaritalStatusValid);

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

  // useEffect(() => {
  //   setTimeout(() => {
  //     setErrors(null);
  //   }, 5000);
  // }, [errors]);

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
              borderRadius: "1vh",
              cursor: "pointer"

            }}
          >
            <div>
              <svg width="27" height="27" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.77348 1.90259C9.14789 1.69179 9.57031 1.58105 9.99998 1.58105C10.4296 1.58105 10.8521 1.69179 11.2265 1.90259C11.6009 2.11338 11.9146 2.41712 12.1375 2.78448L12.1399 2.78844L19.1982 14.5718L19.205 14.5833C19.4233 14.9613 19.5388 15.3899 19.54 15.8264C19.5412 16.263 19.4281 16.6922 19.2119 17.0714C18.9958 17.4507 18.6841 17.7667 18.3078 17.9881C17.9316 18.2095 17.504 18.3285 17.0675 18.3333L17.0583 18.3334L2.93248 18.3333C2.49598 18.3285 2.06834 18.2095 1.69212 17.9881C1.31589 17.7667 1.00419 17.4507 0.788018 17.0714C0.571848 16.6922 0.458748 16.263 0.459971 15.8264C0.461193 15.3899 0.576695 14.9613 0.794985 14.5833L0.801754 14.5718L7.86247 2.78448C8.0853 2.41711 8.39908 2.11338 8.77348 1.90259ZM9.99998 3.24772C9.85675 3.24772 9.71595 3.28463 9.59115 3.3549C9.46691 3.42485 9.3627 3.52549 9.28849 3.64721L2.23555 15.4215C2.16457 15.5464 2.12703 15.6874 2.12663 15.8311C2.12622 15.9766 2.16392 16.1197 2.23598 16.2461C2.30804 16.3725 2.41194 16.4779 2.53735 16.5517C2.66166 16.6248 2.80281 16.6644 2.94697 16.6667H17.053C17.1971 16.6644 17.3383 16.6248 17.4626 16.5517C17.588 16.4779 17.6919 16.3725 17.764 16.2461C17.836 16.1197 17.8737 15.9766 17.8733 15.8311C17.8729 15.6875 17.8354 15.5464 17.7644 15.4216L10.7125 3.64886C10.7121 3.64831 10.7118 3.64776 10.7115 3.64721C10.6373 3.52549 10.533 3.42485 10.4088 3.3549C10.284 3.28463 10.1432 3.24772 9.99998 3.24772Z" fill="white" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0001 6.6665C10.4603 6.6665 10.8334 7.0396 10.8334 7.49984V10.8332C10.8334 11.2934 10.4603 11.6665 10.0001 11.6665C9.53984 11.6665 9.16675 11.2934 9.16675 10.8332V7.49984C9.16675 7.0396 9.53984 6.6665 10.0001 6.6665Z" fill="white" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.16675 14.1668C9.16675 13.7066 9.53984 13.3335 10.0001 13.3335H10.0084C10.4687 13.3335 10.8417 13.7066 10.8417 14.1668C10.8417 14.6271 10.4687 15.0002 10.0084 15.0002H10.0001C9.53984 15.0002 9.16675 14.6271 9.16675 14.1668Z" fill="white" />
              </svg>
            </div>


            <div
              style={{
                display: "flex",
                flexDirection: "column",
                color: "white",
                width: "100%",
                paddingLeft: "5%"
              }}
            >
              <h2 style={{ margin: 0, fontSize: "3vh", fontWeight: "500" }}>
                Missing Information
              </h2>
              <p style={{ margin: 0, width: "100%", fontSize: "2.2vh" }}>
                Please fill out all required fields to proceed to the next step
              </p>
            </div>
            <div onClick={() => setErrors(!errors)}>
              <svg width="27" height="27" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5893 4.41058C15.9148 4.73602 15.9148 5.26366 15.5893 5.58909L5.58934 15.5891C5.2639 15.9145 4.73626 15.9145 4.41083 15.5891C4.08539 15.2637 4.08539 14.736 4.41083 14.4106L14.4108 4.41058C14.7363 4.08514 15.2639 4.08514 15.5893 4.41058Z" fill="white" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.41083 4.41058C4.73626 4.08514 5.2639 4.08514 5.58934 4.41058L15.5893 14.4106C15.9148 14.736 15.9148 15.2637 15.5893 15.5891C15.2639 15.9145 14.7363 15.9145 14.4108 15.5891L4.41083 5.58909C4.08539 5.26366 4.08539 4.73602 4.41083 4.41058Z" fill="white" />
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
            <StepTracker percentage={55} />
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
                Family Background
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
                  <label htmlFor="fatherName" className="block text-sm font-medium text-[#000000]">
                    Father’s Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="relative">

                  <input
                    type="text"
                    id="fatherName"
                    name="fatherName"
                    required
                    value={profileData.father_name || ''}
                    placeholder="Enter full name"
                    className={
                      `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${
                        errors.father_name ? 
                          "border-red-500 focus:border-red-500 focus:ring-red-500" 
                          : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                      } focus:outline-none focus:ring-2`
                    }                     onChange={(e) => updateField("father_name", e.target.value)}
                  />
                    {/* Information icon positioned at right corner of input */}
    <div className="absolute right-2 top-1/2 mt-1 transform -translate-y-1/2 group z-20">
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
        This is additional information about the Father’s Name field.
      </div>
    </div>
    </div>
                   {errors.father_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.father_name}
                    </p>
                  )}
                </div>
                <div className="w-[50%] relative">
                  <label htmlFor="fatherOccupation" className="block text-sm font-medium text-[#000000]">
                    Father’s Occupation
                  </label>
                  <div className="relative">

                  <input
                    type="text"
                    id="fatherOccupation"
                    name="fatherOccupation"
                    value={profileData.father_occupation || ''}
                    placeholder="Enter occupation"
                    className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                    onChange={(e) => updateField("father_occupation", e.target.value)}
                  />
                </div>
                  {/* Information icon positioned at right corner of input */}
    <div className="absolute right-2 top-1/2 mt-2.5 transform -translate-y-1/2 group z-20">
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
        This is additional information about the Father’s Occupation field.
      </div>
    </div>
    </div>
              </div>

              {/* Mother's Name and Occupation */}
              <div style={{ display: "flex", gap: "2rem" }}>
                <div className="w-[50%] relative">
                  <label htmlFor="motherName" className="block text-sm font-medium text-[#000000]">
                    Mother’s Name <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="relative">

                  <input
                    type="text"
                    id="motherName"
                    name="motherName"
                    value={profileData.mother_name || ''}
                    required
                    placeholder="Enter full name"
                    className={
                      `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${
                        errors.mother_name ? 
                          "border-red-500 focus:border-red-500 focus:ring-red-500" 
                          : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                      } focus:outline-none focus:ring-2`
                    }                     onChange={(e) => updateField("mother_name", e.target.value)}
                  />
                    {/* Information icon positioned at right corner of input */}
    <div className="absolute right-2 top-1/2 mt-1 transform -translate-y-1/2 group z-20">
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
        This is additional information about the Mother’s Name field.
      </div>
    </div>
    </div>
                     {errors.mother_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.mother_name}
                    </p>
                  )}
                </div>
                <div className="w-[50%] relative">
                  <label htmlFor="motherOccupation" className="block text-sm font-medium text-[#000000]">
                    Mother’s Occupation
                  </label>
                  <div className="relative">

                  <input
                    type="text"
                    id="motherOccupation"
                    name="motherOccupation"
                    value={profileData.mother_occupation || ''}
                    placeholder="Enter occupation"
                    className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                    onChange={(e) => updateField("mother_occupation", e.target.value)}
                  />
                </div>
                  {/* Information icon positioned at right corner of input */}
    <div className="absolute right-2 top-1/2 mt-2.5 transform -translate-y-1/2 group z-20">
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
        This is additional information about the Mother’s Occupation field.
      </div>
    </div>
    </div>
              </div>

              {/* Is Father Alive and Is Mother Alive */}
              {/* <div style={{ display: "flex", gap: "2rem" }}>
                <div className="w-[50%]">
                  <label htmlFor="isFatherAlive" className="block text-sm font-medium text-[#000000]">
                    Is Father Alive <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    id="isFatherAlive"
                    name="isFatherAlive"
                    value={profileData.father_alive || ''}
                    required
                    className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                    onChange={(e) => updateField("father_alive", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div className="w-[50%]">
                  <label htmlFor="isMotherAlive" className="block text-sm font-medium text-[#000000]">
                    Is Mother Alive <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    id="isMotherAlive"
                    name="isMotherAlive"
                    value={profileData.mother_alive || ''}
                    required
                    className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                    onChange={(e) => updateField("mother_alive", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div> */}

              {/* Is Father a Stepfather and Is Mother a Stepmother */}
              {/* <div style={{ display: "flex", gap: "2rem" }}>
                <div className="w-[50%]">
                  <label htmlFor="isFatherStepfather" className="block text-sm font-medium text-[#000000]">
                    Is Father a Stepfather? <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    id="isFatherStepfather"
                    name="isFatherStepfather"
                    value={profileData.step_father || ''}
                    required
                    className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                    onChange={(e) => updateField("step_father", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div className="w-[50%]">
                  <label htmlFor="isMotherStepmother" className="block text-sm font-medium text-[#000000]">
                    Is Mother a Stepmother? <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    id="isMotherStepmother"
                    name="isMotherStepmother"
                    value={profileData.step_mother || ''}
                    required
                    className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                    onChange={(e) => updateField("step_mother", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div> */}

              {/* Number of Siblings and Family Type */}
              <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                <div className="w-[50%] relative">
                  <label htmlFor="numSiblings" className="block text-sm font-medium text-[#000000]">
                    Number of Siblings <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="relative">

                  <select
                    id="numSiblings"
                    name="numSiblings"
                    value={profileData.number_of_siblings || ''}
                    required
                    className={
                      `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${
                        errors.number_of_siblings ? 
                          "border-red-500 focus:border-red-500 focus:ring-red-500" 
                          : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                      } focus:outline-none focus:ring-2`
                    }                     onChange={(e) => updateField("number_of_siblings", e.target.value)}
                  >
                    <option value="">Select Number</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4+</option>
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
                  {errors.number_of_siblings && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.number_of_siblings}
                    </p>
                  )}
                </div>
                <div className="w-[50%] relative">
                  <label htmlFor="familyType" className="block text-sm font-medium text-[#000000]">
                    Family Type <span style={{ color: "#ED58AC" }}>*</span>
                  </label>
                  <div className="relative">

                  <select
                    id="familyType"
                    name="familyType"
                    value={profileData.family_type || ''}
                    required
                    className={
                      `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${
                        errors.family_type ? 
                          "border-red-500 focus:border-red-500 focus:ring-red-500" 
                          : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                      } focus:outline-none focus:ring-2`
                    }                     onChange={(e) => updateField("family_type", e.target.value)}
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
        This is additional information about the Family Type field.
      </div>
    </div>
    </div>
                  {errors.family_type && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.family_type}
                    </p>
                  )}
                </div>
                
              </div>

              {/* Conditional Fields for Siblings */}
              {profileData.number_of_siblings > 0 && (
                <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                  <div className="w-[50%] relative">
                    <label htmlFor="numBrothers" className="block text-sm font-medium text-[#000000]">
                      Number of Brothers <span style={{ color: "#ED58AC" }}>*</span>
                    </label>
                    <div className="relative">

                    <select
                      id="numBrothers"
                      name="numBrothers"
                      value={profileData.number_of_brothers || ''}
                      required
                      className={
                        `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${
                          errors.number_of_brothers ? 
                            "border-red-500 focus:border-red-500 focus:ring-red-500" 
                            : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                        } focus:outline-none focus:ring-2`
                      }                       
                      onChange={(e) => updateField("number_of_brothers", e.target.value)}
                    >
                      <option value="">Select Number</option>
                      <option value={0}>0</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4+</option>
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
        This is additional information about the Number of Brothers field.
      </div>
    </div>
    </div>
                  </div>
                  <div className="w-[50%] relative">
                    <label htmlFor="numSisters" className="block text-sm font-medium text-[#000000]">
                      Number of Sisters <span style={{ color: "red" }}>*</span>
                    </label>
                    <div className="relative">

                    <select
                      id="numSisters"
                      name="numSisters"
                      value={profileData.number_of_sisters || ''}
                      required
                      className={
                        `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${
                          errors.number_of_sisters ? 
                            "border-red-500 focus:border-red-500 focus:ring-red-500" 
                            : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                        } focus:outline-none focus:ring-2`
                      }                       
                      onChange={(e) => updateField("number_of_sisters", e.target.value)}
                    >
                      <option value="">Select Number</option>
                      <option value={0}>0</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4+</option>
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
        This is additional information about the Number of Sisters field.
      </div>
    </div>
    </div>
                  </div>
                </div>
              )}

              {/* Family Practicing Level and Number of Children */}
              <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                <div className="w-[50%] relative">
                  <label htmlFor="familyPracticingLevel" className="block text-sm font-medium text-[#000000]">
                    Family Practicing Level <span style={{ color: "#ED58AC" }}>*</span>
                  </label>
                  <div className="relative">

                  <select
                    id="familyPracticingLevel"
                    name="familyPracticingLevel"
                    value={profileData.family_practicing_level || ''}
                    required
                    className={
                      `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${
                        errors.family_practicing_level ? 
                          "border-red-500 focus:border-red-500 focus:ring-red-500" 
                          : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                      } focus:outline-none focus:ring-2`
                    }                     onChange={(e) => updateField("family_practicing_level", e.target.value)}
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
        This is additional information about the Family Practicing Level field.
      </div>
    </div>
    </div>
                  {errors.family_practicing_level && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.family_practicing_level}
                    </p>
                  )}
                </div>
                {(profileData.martial_status === "Divorced" || profileData.martial_status === "Widowed") && (
                <div className="w-[50%] relative">
                  
                    <>
                      <label htmlFor="numChildren" className="block text-sm font-medium text-[#000000]">
                        Number of Children <span style={{ color: "#ED58AC" }}>*</span>
                      </label>
                                        <div className="relative">

                      <select
                        id="numChildren"
                        name="numChildren"
                        value={profileData.number_of_children || ''}
                        className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                        onChange={(e) => updateField("number_of_children", e.target.value)}
                      >
                        <option value="">Select Number</option>
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4+</option>
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
        This is additional information about the Number of Children field.
      </div>
    </div>
    </div>
                    </>
               
                  {errors.number_of_children && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.number_of_children}
                    </p>
                  )}
                </div>
              )}
              </div>
           
              {/* Conditional Fields for Children */}
              {((profileData.martial_status === "Divorced" || profileData.martial_status === "Widowed"))&&profileData.number_of_children > 0 && (
                <div style={{ display: "flex", gap: "2rem" }}>
                  <div className="w-[50%]">
                    <label htmlFor="numSons" className="block text-sm font-medium text-[#000000]">
                      Number of Sons <span style={{ color: "#ED58AC" }}>*</span>
                    </label>
                    <select
                      id="numSons"
                      name="numSons"
                      value={profileData.number_of_son || ''}
                      className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      onChange={(e) => updateField("number_of_son", e.target.value)}
                    >
                      <option value="">Select Number</option>
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                  <div className="w-[50%]">
                    <label htmlFor="numDaughters" className="block text-sm font-medium text-[#000000]">
                      Number of Daughters <span style={{ color: "#ED58AC" }}>*</span>
                    </label>
                    <select
                      id="numDaughters"
                      name="numDaughters"
                      value={profileData.number_of_daughter || ''}
                      className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      onChange={(e) => updateField("number_of_daughter", e.target.value)}
                    >
                      <option value="">Select Number</option>
                      <option value="0">0</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Wali Information (for females) */}
              {profileData.gender === "female" && (
                <>
                  <h4 className="col-span-3 mb-4" style={{ fontWeight: "bold" }}>
                    Wali Information
                  </h4>
                  <div style={{ display: "flex", gap: "2rem" }}>
                    <div className="w-[50%] relative">
                      <label htmlFor="waliName" className="block text-sm font-medium text-[#000000]">
                        Wali Name <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="relative">

                      <input
                        type="text"
                        id="waliName"
                        name="waliName"
                        value={profileData.wali_name || ''}
                        placeholder="Enter full name"
                        required
                        className={
                          `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${
                            errors.wali_name ? 
                              "border-red-500 focus:border-red-500 focus:ring-red-500" 
                              : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                          } focus:outline-none focus:ring-2`
                        }                         onChange={(e) => updateField("wali_name", e.target.value)}
                      />
                        {/* Information icon positioned at right corner of input */}
    <div className="absolute right-2 mt-1 top-1/2 transform -translate-y-1/2 group z-20">
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
        This is additional information about the Wali Name field.
      </div>
    </div>
    </div>
                       {errors.wali_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.wali_name}
                    </p>
                  )}
                    </div>
                    <div className="w-[50%] relative">
                      <label htmlFor="waliPhone" className="block text-sm font-medium text-[#000000]">
                        Wali Phone Number <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="relative">

                      <input
                        type="tel"
                        id="waliPhone"
                        name="waliPhone"
                        value={profileData.wali_contact_number || ''}
                        placeholder="Enter phone number"
                        required
                         className={
                      `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${
                        errors.wali_contact_number ? 
                          "border-red-500 focus:border-red-500 focus:ring-red-500" 
                          : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                      } focus:outline-none focus:ring-2`
                    } 
                        onChange={(e) => updateField("wali_contact_number", e.target.value)}
                      />
                        {/* Information icon positioned at right corner of input */}
    <div className="absolute right-2 mt-1 top-1/2 transform -translate-y-1/2 group z-20">
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
        This is additional information about the Wali Phone Number field.
      </div>
    </div>
    </div>
                        {errors.wali_contact_number && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.wali_contact_number}
                    </p>
                  )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "2rem" }}>
                    <div className="w-[50%] relative">
                      <label htmlFor="waliRelation" className="block text-sm font-medium text-[#000000]">
                        Blood Relation <span style={{ color: "red" }}>*</span>
                      </label>
                      <div className="relative">

                      <select
                        id="waliRelation"
                        name="waliRelation"
                        value={profileData.wali_blood_relation || ''}
                        required
                         className={
                      `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${
                        errors.wali_blood_relation ? 
                          "border-red-500 focus:border-red-500 focus:ring-red-500" 
                          : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                      } focus:outline-none focus:ring-2`
                    } 
                        onChange={(e) => updateField("wali_blood_relation", e.target.value)}
                      >
                        <option value="">Select Relation</option>
                        <option value="Father">Father</option>
                        <option value="Brother">Brother</option>
                        <option value="Uncle">Uncle</option>
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
        This is additional information about the Blood Relation field.
      </div>
      </div>
    </div>
                        {errors.wali_blood_relation && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.wali_blood_relation}
                    </p>
                  )}
                    </div>
                    <div className="w-[50%]"></div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  onClick={() => navigate("/memsteptwo")}
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
