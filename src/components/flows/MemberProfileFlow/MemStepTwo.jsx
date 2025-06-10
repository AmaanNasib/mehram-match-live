// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { updateDataV2 } from "../../../apiUtils";
// import { useParams } from "react-router-dom";
// import TopBar from "../../sections/TopBar";
// import Sidebar from "../../sections/Sidebar";
// import ProfileSection from "../../sections/ProfileSection";
// import StepTracker from "../../StepTracker/StepTracker";
// import findUser from "../../../images/findUser.svg";
// import { fetchDataObjectV2 } from "../../../apiUtils";

// const MemStepTwo = () => {
//   const [userId] = useState(localStorage.getItem('userId'));
//   const [apiData, setApiData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const [profileData, setProfileData] = useState({
//     sect_school_info: "",
//     islamic_practicing_level: null,
//     believe_in_dargah_fatiha_niyah: "",
//     hijab_niqab_prefer: "",
//     percentage: "",
//     gender: "",
//   });

//   useEffect(() => {
//     if (userId) {
//       const parameter = {
//         url: `/api/user/${userId}/`,
//         setterFunction: setApiData,
//         setErrors: setErrors,
//         setLoading: setLoading,
//       };
//       fetchDataObjectV2(parameter);
//     }
//   }, [userId]);

//   useEffect(() => {
//     if (apiData) {
//       setProfileData({
//         percentage: apiData.profile_percentage || null,
//         gender: apiData.gender || null,
//       });
//     }
//   }, [apiData]);

//   const [errors, setErrors] = useState();

//   const naviagteNextStep = () => {
//     const parameters = {
//       url: `/api/user/${userId}`,
//       payload: {
//         sect_school_info: profileData.sect_school_info,
//         islamic_practicing_level: profileData.islamic_practicing_level,
//         believe_in_dargah_fatiha_niyah:
//           profileData.believe_in_dargah_fatiha_niyah,
//         hijab_niqab_prefer: profileData.hijab_niqab_prefer,
//       },
//       navigate: navigate,
//       navUrl: `/memstepthree/${userId}`,
//       setErrors: setErrors,
//     };
//     if (
//       profileData.gender === "femail"
//         ? profileData.sect_school_info &&
//         profileData.believe_in_dargah_fatiha_niyah &&
//         profileData.hijab_niqab_prefer
//         : profileData.sect_school_info &&
//         profileData.believe_in_dargah_fatiha_niyah
//     ) {
//       updateDataV2(parameters);
//     } else {
//       setErrors(true);
//       console.log(JSON.stringify(parameters.payload));
//       setMessage("Plese fill all the required fields");
//     }
//   };

//   const updateField = (field, value) => {
//     setProfileData((prevState) => ({
//       ...prevState,
//       [field]: value,
//     }));
//   };

//   const skip = () => {
//     if (
//       profileData.gender === "femail"
//         ? profileData.sect_school_info &&
//         profileData.believe_in_dargah_fatiha_niyah &&
//         profileData.hijab_niqab_prefer
//         : profileData.sect_school_info &&
//         profileData.believe_in_dargah_fatiha_niyah
//     ) {
//       navigate(`/memstepthree/${userId}`);
//     } else {
//       setErrors(true);
//       setMessage("Plese fill all the required fields");
//     }
//   };

//   useEffect(() => {
//     setTimeout(() => {
//       setErrors(null);
//     }, 5000);
//   }, [errors]);

//   return (
//     <div className="flex h-screen">
//       <main className="flex-1 bg-white">
//         {errors && (
//           <div
//             style={{
//               zIndex: "10000",
//               height: "17vh",
//               width: "33vw",
//               backgroundColor: "#F8BF00",
//               display: "flex",
//               flexDirection: "row",
//               // alignItems: "center",
//               padding: "2vh 3vh",
//               gap: "10px",
//               position: "absolute",
//               left: "35%",
//               borderRadius: "1vh",
//               cursor: "pointer"

//             }}
//           >
//             <div>
//               <svg width="27" height="27" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path fill-rule="evenodd" clip-rule="evenodd" d="M8.77348 1.90259C9.14789 1.69179 9.57031 1.58105 9.99998 1.58105C10.4296 1.58105 10.8521 1.69179 11.2265 1.90259C11.6009 2.11338 11.9146 2.41712 12.1375 2.78448L12.1399 2.78844L19.1982 14.5718L19.205 14.5833C19.4233 14.9613 19.5388 15.3899 19.54 15.8264C19.5412 16.263 19.4281 16.6922 19.2119 17.0714C18.9958 17.4507 18.6841 17.7667 18.3078 17.9881C17.9316 18.2095 17.504 18.3285 17.0675 18.3333L17.0583 18.3334L2.93248 18.3333C2.49598 18.3285 2.06834 18.2095 1.69212 17.9881C1.31589 17.7667 1.00419 17.4507 0.788018 17.0714C0.571848 16.6922 0.458748 16.263 0.459971 15.8264C0.461193 15.3899 0.576695 14.9613 0.794985 14.5833L0.801754 14.5718L7.86247 2.78448C8.0853 2.41711 8.39908 2.11338 8.77348 1.90259ZM9.99998 3.24772C9.85675 3.24772 9.71595 3.28463 9.59115 3.3549C9.46691 3.42485 9.3627 3.52549 9.28849 3.64721L2.23555 15.4215C2.16457 15.5464 2.12703 15.6874 2.12663 15.8311C2.12622 15.9766 2.16392 16.1197 2.23598 16.2461C2.30804 16.3725 2.41194 16.4779 2.53735 16.5517C2.66166 16.6248 2.80281 16.6644 2.94697 16.6667H17.053C17.1971 16.6644 17.3383 16.6248 17.4626 16.5517C17.588 16.4779 17.6919 16.3725 17.764 16.2461C17.836 16.1197 17.8737 15.9766 17.8733 15.8311C17.8729 15.6875 17.8354 15.5464 17.7644 15.4216L10.7125 3.64886C10.7121 3.64831 10.7118 3.64776 10.7115 3.64721C10.6373 3.52549 10.533 3.42485 10.4088 3.3549C10.284 3.28463 10.1432 3.24772 9.99998 3.24772Z" fill="white" />
//                 <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0001 6.6665C10.4603 6.6665 10.8334 7.0396 10.8334 7.49984V10.8332C10.8334 11.2934 10.4603 11.6665 10.0001 11.6665C9.53984 11.6665 9.16675 11.2934 9.16675 10.8332V7.49984C9.16675 7.0396 9.53984 6.6665 10.0001 6.6665Z" fill="white" />
//                 <path fill-rule="evenodd" clip-rule="evenodd" d="M9.16675 14.1668C9.16675 13.7066 9.53984 13.3335 10.0001 13.3335H10.0084C10.4687 13.3335 10.8417 13.7066 10.8417 14.1668C10.8417 14.6271 10.4687 15.0002 10.0084 15.0002H10.0001C9.53984 15.0002 9.16675 14.6271 9.16675 14.1668Z" fill="white" />
//               </svg>
//             </div>

//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 color: "white",
//                 width: "100%",
//                 paddingLeft: "5%"
//               }}
//             >
//               <h2 style={{ margin: 0, fontSize: "3vh", fontWeight: "500" }}>
//                 Missing Information
//               </h2>
//               <p style={{ margin: 0, width: "100%", fontSize: "2.2vh" }}>
//                 Please fill out all required fields to proceed to the next step
//               </p>
//             </div>
//             <div onClick={() => setErrors(!errors)}>
//               <svg width="27" height="27" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5893 4.41058C15.9148 4.73602 15.9148 5.26366 15.5893 5.58909L5.58934 15.5891C5.2639 15.9145 4.73626 15.9145 4.41083 15.5891C4.08539 15.2637 4.08539 14.736 4.41083 14.4106L14.4108 4.41058C14.7363 4.08514 15.2639 4.08514 15.5893 4.41058Z" fill="white" />
//                 <path fill-rule="evenodd" clip-rule="evenodd" d="M4.41083 4.41058C4.73626 4.08514 5.2639 4.08514 5.58934 4.41058L15.5893 14.4106C15.9148 14.736 15.9148 15.2637 15.5893 15.5891C15.2639 15.9145 14.7363 15.9145 14.4108 15.5891L4.41083 5.58909C4.08539 5.26366 4.08539 4.73602 4.41083 4.41058Z" fill="white" />
//               </svg>
//             </div>
//           </div>
//         )}
//         <h3
//           style={{
//             fontSize: "1.8rem",
//             padding: "3vh 0 0 10vh",
//             fontWeight: "400",
//             color: "#ec4899",
//           }}
//         >
//           Create Your Mehram Match Profile
//         </h3>
//         <h5
//           style={{
//             fontSize: "1rem",
//             padding: "0 1vh 3vh 10vh",
//             fontWeight: "100",
//           }}
//         >
//           Follow these 6 simple step to complete your profile and find the
//           perfect match
//         </h5>

//         <div
//           style={{
//             height: "1px",
//             width: "91.5%",
//             backgroundColor: "#ccc",
//             marginLeft: "10vh",
//           }}
//         ></div>

//         <div className="form_container_user_creation h-auto bg-white pb-[12px] w-[100vw] ">
//           <div
//             style={{
//               width: "33.8%",
//               display: "flex",
//               justifyContent: "flex-end",
//               alignItems: "center",
//             }}
//           >
//             <StepTracker percentage={45} />
//           </div>

//           <div style={{ width: "86.1%", marginLeft: "19.5%" }}>
//             <form
//               style={{
//                 borderLeft: "0.5px solid #ccc",
//                 padding: "1rem",
//                 width: "70%",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "1rem",
//                 padding: "1% 4%",
//                 margin: "auto",
//                 height: "auto",
//                 position: "absolute",
//                 left: "24.2rem",
//                 zIndex: "0"
//               }}
//             >
//               <p
//                 style={{
//                   fontSize: "small",
//                   color: "gray",
//                   margin: "0",
//                   padding: "0",
//                 }}
//               >
//                 step 2/6
//               </p>
//               <h4 className="col-span-3 m-0 p-0" style={{ fontWeight: "bold" }}>
//                 Religious Information
//               </h4>
//               <p
//                 style={{
//                   fontSize: "small",
//                   color: "gray",
//                   marginBottom: "1vh",
//                   padding: "0",
//                 }}
//               >
//                 Please provide your religious details to help us create a
//                 profile that aligns with your values and preferences
//               </p>
//               <div
//                 style={{
//                   height: "0.7px",
//                   width: "100%",
//                   backgroundColor: "#ccc",
//                 }}
//               ></div>
//               <div style={{ display: "flex", gap: "2rem" }}>
//                 {/* First Name */}
//                 <div className="w-[50%]">
//                   <label
//                     htmlFor="firstName"
//                     className="block text-sm font-medium text-[#000000]"
//                   >
//                     Sect / School of Thought{" "}
//                     <span style={{ color: "red" }}>*</span>
//                   </label>
//                   <select
//                     id="sect"
//                     name="sect"
//                     required
//                     className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
//                     onChange={(e) =>
//                       updateField("sect_school_info", e.target.value)
//                     }
//                   >
//                     <option value="">Select Sect</option>
//                     <option value="Sunni">Sunni</option>
//                     <option value="Shia">Shia</option>
//                     <option value="Others">Others</option>
//                   </select>
//                 </div>

//                 {/* Last Name */}
//                 <div className="w-[50%]">
//                   <label
//                     htmlFor="lastName"
//                     className="block text-sm font-medium text-[#000000]"
//                   >
//                     Islam Practicing Level
//                   </label>
//                   <input
//                     type="text"
//                     id="islamPracticingLevel"
//                     name="islamPracticingLevel"
//                     className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
//                     onChange={(e) =>
//                       updateField("islamic_practicing_level", e.target.value)
//                     }
//                   />
//                 </div>
//               </div>

//               <div style={{ display: "flex", gap: "2rem" }}>
//                 <div className="w-[50%]  ">
//                   <label className="block text-sm font-medium text-[#000000]">
//                     Believe in Dargah/Fatiha/Niyah?{" "}
//                     <span style={{ color: "red" }}>*</span>
//                   </label>
//                   <div className="mt-1 flex space-x-4">
//                     <div className="flex items-center ">
//                       <input
//                         type="radio"
//                         id="believeYes"
//                         name="believeInDargah"
//                         value="Yes"
//                         required
//                         className="h-4 w-4 text-[#000000] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
//                         onChange={(e) =>
//                           updateField(
//                             "believe_in_dargah_fatiha_niyah",
//                             e.target.value
//                           )
//                         }
//                       />
//                       <label
//                         htmlFor="male"
//                         className="ml-2 text-sm text-[#000000]"
//                       >
//                         Yes
//                       </label>
//                     </div>
//                     <div className="flex items-center ">
//                       <input
//                         type="radio"
//                         id="believeNo"
//                         name="believeInDargah"
//                         value="No"
//                         required
//                         className="h-4 w-4 text-[#000000] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
//                         onChange={(e) =>
//                           updateField(
//                             "believe_in_dargah_fatiha_niyah",
//                             e.target.value
//                           )
//                         }
//                       />
//                       <label
//                         htmlFor="male"
//                         className="ml-2 text-sm text-[#000000]"
//                       >
//                         No
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="w-[50%]">
//                   <label className="block text-sm font-medium text-[#000000]">
//                     Hijab/Niqab Preference?{" "}
//                     <span style={{ color: "#ED58AC" }}>*</span>
//                   </label>
//                   <div className="mt-1 flex space-x-4">
//                     {/* Yes Option */}
//                     <div className="flex items-center">
//                       <input
//                         type="radio"
//                         id="hijabNiqabYes"
//                         name="hijab_niqab_prefer"
//                         value="Yes"
//                         required
//                         className="h-4 w-4 text-[#000000] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
//                         onChange={(e) =>
//                           updateField("hijab_niqab_prefer", e.target.value)
//                         }
//                       />
//                       <label
//                         htmlFor="hijabNiqabYes"
//                         className="ml-2 text-sm text-[#000000]"
//                       >
//                         Yes
//                       </label>
//                     </div>
//                     {/* No Option */}
//                     <div className="flex items-center">
//                       <input
//                         type="radio"
//                         id="hijabNiqabNo"
//                         name="hijab_niqab_prefer"
//                         value="No"
//                         required
//                         className="h-4 w-4 text-[#000000] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
//                         onChange={(e) =>
//                           updateField("hijab_niqab_prefer", e.target.value)
//                         }
//                       />
//                       <label
//                         htmlFor="hijabNiqabNo"
//                         className="ml-2 text-sm text-[#000000]"
//                       >
//                         No
//                       </label>
//                     </div>
//                   </div>
//                 </div>

//               </div>
//               <div style={{ display: "flex", justifyContent: "space-between" }}>
//                 <button
//                   onClick={() => {
//                     navigate(-1);
//                   }}
//                   className="text-[black] bg-[white] mt-[24px] h-[40px] w-[150px]   "
//                   style={{
//                     borderRadius: "5vh",
//                     Color: "#fff !important",
//                     fontWeight: "400",
//                     border: "1px solid black",
//                   }}
//                 >
//                   Back
//                 </button>
//                 <button
//                   type="button"
//                   onClick={naviagteNextStep}
//                   className="text-[white] bg-[#0fd357] mt-[24px] h-[40px] w-[150px]  "
//                   style={{
//                     borderRadius: "5vh",
//                     Color: "#fff !important",
//                     fontWeight: "400",
//                   }}
//                 >
//                   Next Step
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default MemStepTwo;
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { updateDataV2 } from "../../../apiUtils";
import { fetchDataObjectV2 } from "../../../apiUtils";
import StepTracker from "../../StepTracker/StepTracker";

const MemStepTwo = () => {
  let [userId] = useState(localStorage.getItem("userId"));
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { useracreate, age, member_id } = location.state || {};
  const [profileData, setProfileData] = useState({
    sect_school_info: "",
    islamic_practicing_level: "",
    believe_in_dargah_fatiha_niyah: "",
    hijab_niqab_prefer: "",
    percentage: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  userId = localStorage.getItem("member_id") || userId;
  let mem = {
    state: { username: "", age: 30 },
  };

  useEffect(() => {
    if (userId) {
      const parameter = {
        url: `/api/user/${localStorage.getItem("member_id") || userId}/`,
        setterFunction: setApiData,
        setLoading: setLoading,
        setErrors: setError,
      };
      fetchDataObjectV2(parameter);
    }
  }, [userId, useracreate]);

  useEffect(() => {
    if (apiData) {
      setProfileData({
        percentage: apiData.profile_percentage || null,
        gender: apiData.gender || null,
        believe_in_dargah_fatiha_niyah:
          apiData.believe_in_dargah_fatiha_niyah || null,
        sect_school_info: apiData.sect_school_info || null,
        islamic_practicing_level: apiData.islamic_practicing_level || null,
        hijab_niqab_prefer: apiData.hijab_niqab_prefer || null,
      });
    }
  }, [apiData]);

  const validateForm = () => {
    const newErrors = {};

    // Validate Sect / School of Thought
    if (!profileData.sect_school_info?.trim()) {
      newErrors.sect_school_info = "Sect / School of Thought is required";
    }

    // Validate Believe in Dargah/Fatiha/Niyah
    if (!profileData.believe_in_dargah_fatiha_niyah) {
      newErrors.believe_in_dargah_fatiha_niyah =
        "Please select an option for Dargah/Fatiha/Niyah";
    }

    // Validate Hijab/Niqab Preference (only for females)
    if (profileData.gender === "female" && !profileData.hijab_niqab_prefer) {
      newErrors.hijab_niqab_prefer =
        "Hijab/Niqab Preference is required for females";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const naviagteNextStep = () => {
    if (validateForm()) {
      const parameters = {
        url: `/api/user/${userId}`,
        payload: {
          sect_school_info: profileData.sect_school_info,
          islamic_practicing_level: profileData.islamic_practicing_level,
          believe_in_dargah_fatiha_niyah:
            profileData.believe_in_dargah_fatiha_niyah,
          hijab_niqab_prefer: profileData.hijab_niqab_prefer,
        },
        navigate: navigate,
        navUrl: `/memstepthree`,
      };
      updateDataV2(parameters);
    } else {
      console.log("Form has errors. Please fix them.");
    }
  };

  const updateField = (field, value) => {
    setProfileData((prevState) => ({
      ...prevState,
      [field]: value,
    }));

    // Clear the error for the field when it is updated
    if (errors[field]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
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
          Follow these 6 simple steps to complete your profile and find the
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

        <div className="form_container_user_creation h-auto bg-white pb-[12px] w-[100vw]">
          <div
            style={{
              width: "33.8%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <StepTracker percentage={45} />
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
                step 2/6
              </p>
              <h4 className="col-span-3 m-0 p-0" style={{ fontWeight: "bold" }}>
                Religious Information
              </h4>
              <p
                style={{
                  fontSize: "small",
                  color: "gray",
                  marginBottom: "1vh",
                  padding: "0",
                }}
              >
                Please provide your religious details to help us create a
                profile that aligns with your values and preferences
              </p>
              <div
                style={{
                  height: "0.7px",
                  width: "100%",
                  backgroundColor: "#ccc",
                }}
              ></div>

              {/* Sect / School of Thought */}
              <div style={{ display: "flex", gap: "2rem" }}>
                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label
                    htmlFor="sect"
                    className="block text-sm font-medium text-[#000000] mb-0"
                  >
                    Sect / School of Thought{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="sect"
                      name="sect"
                      value={profileData.sect_school_info || null}
                      required
                      className={`h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] ${
                            errors.sect_school_info
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                              : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                          } focus:outline-none focus:ring-2`}
                      onChange={(e) =>
                        updateField("sect_school_info", e.target.value)
                      }
                    >
                      <option value="">Select Sect</option>
                      <option value="Sunni">Sunni</option>
                      <option value="Shia">Shia</option>
                      <option value="Others">Others</option>
                    </select>
                    {/* Information icon positioned at right corner of input */}
                    <div
                      className="absolute right-4 bottom-1 transform -translate-y-1/2 group z-20"
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
                      <div className="absolute z-10 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-2 top-full">
                        This is additional information about the Sect field.
                      </div>
                    </div>
                  </div>
                  {errors.sect_school_info && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.sect_school_info}
                    </p>
                  )}
                </div>

                {/* Islam Practicing Level */}
                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label
                    htmlFor="islamPracticingLevel"
                    className="block text-sm font-medium text-[#000000] mb-0"
                  >
                    Islam Practicing Level
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="islamPracticingLevel"
                      name="islamPracticingLevel"
                      value={profileData.islamic_practicing_level || ""}
                      className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92]"
                      onChange={(e) =>
                        updateField("islamic_practicing_level", e.target.value)
                      }
                    />
                  </div>
                  {/* Information icon positioned at right corner of input */}
                  <div className="absolute right-2 bottom-1 mt-2.5 transform -translate-y-1/2 group z-20">
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
                      This is additional information about the Islam Practicing
                      Level field.
                    </div>
                  </div>
                </div>
              </div>

              {/* Believe in Dargah/Fatiha/Niyah */}
              <div style={{ display: "flex", gap: "2rem" }}>
                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <div className="relative">
                    <label className="block text-sm font-medium text-[#000000] mb-0">
                      Believe in Dargah/Fatiha/Niyah?{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
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
                        This is additional information about the Believe in
                        Dargah/Fatiha/Niyah field.
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="believeYes"
                        name="believeInDargah"
                        value="Yes"
                        required
                        checked={
                          profileData.believe_in_dargah_fatiha_niyah === "Yes"
                        }
                        className="h-4 w-4 text-[#000000] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                        onChange={(e) =>
                          updateField(
                            "believe_in_dargah_fatiha_niyah",
                            e.target.value
                          )
                        }
                      />
                      <label
                        htmlFor="believeYes"
                        className="ml-2 text-sm text-[#6d6e6f] font-medium"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="believeNo"
                        name="believeInDargah"
                        value="No"
                        checked={
                          profileData.believe_in_dargah_fatiha_niyah === "No"
                        }
                        required
                        className="h-4 w-4 text-[#6d6e6f] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                        onChange={(e) =>
                          updateField(
                            "believe_in_dargah_fatiha_niyah",
                            e.target.value
                          )
                        }
                      />
                      <label
                        htmlFor="believeNo"
                        className="ml-2 text-sm text-[#000000] font-medium"
                      >
                        No
                      </label>
                    </div>
                  </div>

                  {errors.believe_in_dargah_fatiha_niyah && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.believe_in_dargah_fatiha_niyah}
                    </p>
                  )}
                </div>

                {/* Hijab/Niqab Preference */}
                {profileData.gender === "female" && (
                  <div className="w-[50%] relative">
                    <div className="relative">
                      <label className="block text-sm font-medium text-[#000000]">
                        Hijab/Niqab Preference?{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
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
                          This is additional information about the Hijab/Niqab
                          Preference field.
                        </div>
                      </div>
                    </div>
                    <div className="mt-1 flex space-x-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="hijabNiqabYes"
                          name="hijab_niqab_prefer"
                          value="Yes"
                          checked={profileData.hijab_niqab_prefer == "Yes"}
                          required
                          className="h-4 w-4 text-[#000000] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                          onChange={(e) =>
                            updateField("hijab_niqab_prefer", e.target.value)
                          }
                        />
                        <label
                          htmlFor="hijabNiqabYes"
                          className="ml-2 text-sm text-[#000000]"
                        >
                          Yes
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="hijabNiqabNo"
                          name="hijab_niqab_prefer"
                          value="No"
                          checked={profileData.hijab_niqab_prefer == "No"}
                          required
                          className="h-4 w-4 text-[#000000] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                          onChange={(e) =>
                            updateField("hijab_niqab_prefer", e.target.value)
                          }
                        />
                        <label
                          htmlFor="hijabNiqabNo"
                          className="ml-2 text-sm text-[#000000]"
                        >
                          No
                        </label>
                      </div>
                    </div>
                    {errors.hijab_niqab_prefer && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.hijab_niqab_prefer}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  onClick={() =>
                    navigate(
                      "/memstepone",
                      member_id
                        ? {
                            state: {
                              username: "memberCreation",
                              age: 30,
                              member_id,
                            },
                          }
                        : {
                            state: { username: "", age: 30 },
                          }
                    )
                  }
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

export default MemStepTwo;
