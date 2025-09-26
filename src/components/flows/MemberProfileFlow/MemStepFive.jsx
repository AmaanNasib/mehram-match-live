import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDataObjectV2, fetchDataV2, postDataReturnResponse, ReturnPutResponseFormdataWithoutToken, ReturnResponseFormdataWithoutToken, updateDataV2 } from "../../../apiUtils";
import TopBar from "../../sections/TopBar";
import Sidebar from "../../sections/Sidebar";
import ProfileSection from "../../sections/ProfileSection";
import StepTracker from "../../StepTracker/StepTracker";
import findUser from "../../../images/findUser.svg";

const MemStepFive = () => {
  const navigate = useNavigate();
  let [userId] = useState(localStorage.getItem('userId'));
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showTooltip, setShowTooltip] = useState(null);
  const [error, setError] = useState("");
  userId=localStorage.getItem("member_id")||userId
  const [profileData, setProfileData] = useState({
    profile_visible: "",
    photo_upload_privacy_option: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [imagedata, setImagedateset] = useState([]);


  const validateForm = () => {
    const newErrors = {};

    console.log("Validating form with profileData:", profileData);
    console.log("User gender:", apiData.gender);

    // Validate required fields
    // Photo Privacy Option is only required for females
    if (apiData.gender === "female" && !profileData.photo_upload_privacy_option) {
      newErrors.photo_upload_privacy_option = "Photo Privacy Option is required";
      console.log("Photo Privacy Option is missing (female user)");
    }
    
    // Profile Visibility is required for all users
    if (!profileData.profile_visible) {
      newErrors.profile_visible = "Profile Visibility is required";
      console.log("Profile Visibility is missing");
    }

    console.log("Validation errors:", newErrors);
    setFormErrors(newErrors);

    // Auto-scroll to first error field
    if (Object.keys(newErrors).length > 0) {
      const fieldOrder = apiData.gender === "female" 
        ? ['photo_upload_privacy_option', 'profile_visible']
        : ['profile_visible'];
      const firstErrorField = fieldOrder.find(field => newErrors[field]);
      if (firstErrorField) {
        setTimeout(() => {
          const element = document.querySelector(`[name="${firstErrorField}"]`) || 
                         document.querySelector(`select[name="${firstErrorField}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
          }
        }, 100);
      }
    }

    const isValid = Object.keys(newErrors).length === 0;
    console.log("Form is valid:", isValid);
    return isValid;
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Please upload an image less than 5MB.");
      return;
    }

    // Check file format (JPG, PNG, JPEG)
    const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedFormats.includes(file.type)) {
      setError("Supported formats: JPG, PNG, or JPEG.");
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {

      setError("");
      setImage(file);
      setPreview(img.src);
    };
  };

  const handleSave = () => {
    if (!image) {
      setError("Please upload an image before saving.");
      return;
    }
    const formData = new FormData();
    formData.append('upload_photo', image);
    formData.append('user_id', userId);
    let updateurl = `/api/user_profilephoto/${imagedata?.[imagedata.length - 1]?.id}/`
    const parameter = {
      url: `${profileData.upload_photo ? updateurl : '/api/user_profilephoto/'}`,
      setUserId: setImagedateset,
      formData: formData,
      setErrors: setError,
      setLoading: setLoading,
    };
    console.log("profileData.profile_photo", profileData.profile_photo);

    if (profileData.upload_photo) {
      ReturnPutResponseFormdataWithoutToken(parameter)
    } else {
      ReturnResponseFormdataWithoutToken(parameter)
    }

    setError("");
    console.log("Image saved:", image);
    // alert("Image saved successfully!");
  };
  useEffect(() => {
    if (userId) {
      const parameter = {
        url: `/api/user/${userId}/`,
        setterFunction: setApiData,
        setErrors: setError,
        setLoading: setLoading,
      };
      const parameter1 = {
        url: `/api/user_profilephoto/?user_id=${userId}`,
        setterFunction: setImagedateset,
        setErrors: setError,
        setLoading: setLoading,
      };
      fetchDataObjectV2(parameter);
      fetchDataV2(parameter1);
    }
  }, [userId]);

  // Tooltip handling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showTooltip && !event.target.closest('.tooltip-container')) {
        setShowTooltip(null);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
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

  const handleTooltipClick = (field) => {
    setShowTooltip(showTooltip === field ? null : field);
  };

  useEffect(() => {
    if (apiData) {
      console.log(apiData, "apiData.profile_photo");
      console.log(apiData.profile_photo, "apiData.profile_photo");

      setProfileData({
        profile_visible: apiData.profile_visible || '',
        photo_upload_privacy_option: apiData.photo_upload_privacy_option || '',
        gender: apiData.gender || '',
        upload_photo: apiData.profile_photo || ''
      })
    }

  }, [apiData]);
  useEffect(() => {
    if (imagedata?.[imagedata.length - 1]?.upload_photo) {
      setPreview(imagedata?.[imagedata.length - 1]?.upload_photo)
    }

  }, [imagedata]);

  const naviagteNextStep = () => {
    console.log("naviagteNextStep called");
    console.log("profileData:", profileData);
    console.log("image:", image);
    console.log("userId:", userId);
    console.log("member_id from localStorage:", localStorage.getItem("member_id"));
    console.log("userId from localStorage:", localStorage.getItem("userId"));
    
    if (validateForm()) {
      console.log("Form validation passed");
      
      // Update the profile data and navigate
      const payload = {
        profile_visible: profileData.profile_visible,
      };
      
      // Only include photo_upload_privacy_option for females
      if (apiData.gender === "female") {
        payload.photo_upload_privacy_option = profileData.photo_upload_privacy_option;
      }
      
      const parameters = {
        url: `/api/user/${userId}`,
        payload: payload,
        navigate: navigate,
        navUrl: `/memstepsix/${userId}`,
        setErrors: setFormErrors,
      };

      console.log("Calling updateDataV2 with parameters:", parameters);
        updateDataV2(parameters);
      
      // Save photo separately (don't block navigation)
      if (image) {
        console.log("Saving photo");
        handleSave();
      }
      } else {
      console.log("Form validation failed");
      }
  };

  const updateField = (field, value) => {
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

  const skip = () => {
    if (profileData.profile_visible && profileData.photo_upload_privacy_option) {
      navigate(`/memstepsix/${userId}`);
    } else {
      setFormErrors("Please fill all the required fields");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 5000);
  }, [error]);

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
            <StepTracker percentage={85} />
            </div>

          {/* Desktop and Form Container */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Step Tracker - Professional sidebar layout */}
            <div className="lg:block hidden">
            <StepTracker percentage={85} />
          </div>

            {/* Main Form Container */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex-1">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100 text-sm font-medium uppercase tracking-wide">
                      Step 5 of 6
                    </p>
                    <h2 className="text-2xl font-bold text-white mt-1">
                Privacy Selection
                    </h2>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <form className="space-y-8">
                {/* Form Description */}
                <div className="text-center space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed max-w-3xl mx-auto">
                    At MehramMatch, we respect your privacy and allow you to control the information you share with potential partners. 
                    Select your privacy preferences below to ensure that your details are only visible to the right people. 
                    You can choose to keep certain information private or make it visible according to your comfort level. 
                    Your privacy settings can be updated at any time to suit your needs.
                  </p>
                  <div className="w-full h-px bg-gray-200"></div>
                </div>
                {/* Photo Upload Section */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Profile Photo Upload</h3>
                    <div className="max-w-md mx-auto">
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                          isDragging 
                            ? "border-[#CB3B8B] bg-[#FFC0E3]" 
                            : "border-gray-300 hover:border-[#FFA4D6]"
                        }`}
                      >
                        <div className="space-y-2">
                          <p className="text-gray-600 font-medium">Drag and drop your photo here</p>
                          <p className="text-sm text-gray-500">or</p>
                      <input
                        type="file"
                        accept="image/jpeg, image/png, image/jpg"
                        onChange={handleImageChange}
                            className="hidden"
                        id="fileInput"
                      />
                      <label
                        htmlFor="fileInput"
                            className="inline-block px-4 py-2 bg-[#FF59B6] text-white rounded-lg hover:bg-[#F971BC] cursor-pointer transition-colors"
                          >
                            Choose File
                      </label>
                          <div className="text-xs text-gray-400 space-y-1">
                            <p>Supported formats: JPG, PNG, JPEG</p>
                            <p>Maximum file size: 5MB</p>
                    </div>
                        </div>
                      </div>
                      
                    {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                      
                    {preview && (
                        <div className="mt-6">
                      <img
                        src={preview}
                        alt="Preview"
                            className="w-32 h-32 object-cover border-2 border-gray-200 rounded-lg mx-auto"
                      />
                        </div>
                    )}
                  </div>
                </div>
              </div>

                {/* Privacy Options Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-700">Privacy Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Photo Privacy Option - Only for females */}
                    {apiData.gender === "female" && (
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>Photo Privacy Option <span className="text-red-500">*</span></span>
                          <div className="group relative tooltip-container">
                            <svg 
                              className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTooltipClick('photo_upload_privacy_option');
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'photo_upload_privacy_option' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                              Choose whether to allow photo sharing with potential matches
                              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                    </label>
                    <div className="relative">
                      <select
                            id="photo_upload_privacy_option"
                            name="photo_upload_privacy_option"
                        value={profileData.photo_upload_privacy_option}
                            className={`w-full h-12 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium appearance-none cursor-pointer ${
                              formErrors.photo_upload_privacy_option
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                            }`}
                            onChange={(e) => updateField("photo_upload_privacy_option", e.target.value)}
                      >
                        <option value="">Select Visibility</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {formErrors.photo_upload_privacy_option && (
                          <p className="text-red-500 text-sm">{formErrors.photo_upload_privacy_option}</p>
                        )}
                      </div>
                    )}

                    {/* Profile Visibility */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <span>Profile Visibility <span className="text-red-500">*</span></span>
                        <div className="group relative tooltip-container">
                          <svg 
                            className="w-4 h-4 text-gray-400 hover:text-[#CB3B8B] cursor-help transition-colors" 
                          fill="none"
                          stroke="currentColor"
                            viewBox="0 0 24 24"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTooltipClick('profile_visible');
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                          <div className={`absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg transition-opacity duration-200 whitespace-nowrap z-50 shadow-lg ${showTooltip === 'profile_visible' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            Choose whether your profile should be visible to other users
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                  </label>
                  <div className="relative">
                    <select
                      id="profile_visible"
                      name="profile_visible"
                      value={profileData.profile_visible}
                          className={`w-full h-12 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm font-medium appearance-none cursor-pointer ${
                            formErrors.profile_visible
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-[#CB3B8B] focus:border-[#CB3B8B]"
                          }`}
                          onChange={(e) => updateField("profile_visible", e.target.value)}
                    >
                      <option value="">Select Visibility</option>
                      <option value="visible_to_all">Visible to all</option>
                      <option value="visible_to_matches">Visible to only matches</option>
                    </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      </div>
                    </div>
                      {formErrors.profile_visible && (
                        <p className="text-red-500 text-sm">{formErrors.profile_visible}</p>
                  )}
                </div>
              </div>
                </div>
                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-between sm:justify-end gap-4 pt-8 border-t border-gray-200">
                <button
                      onClick={() => navigate("/memstepfour")}
                      type="button"
                      className="group w-full sm:w-auto bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transform hover:scale-[1.02] transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center space-x-2 min-h-[48px]"
                    >
                      <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="text-sm sm:text-base">Back</span>
                </button>
                  
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
    </div>
  );
};

export default MemStepFive;


















// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { updateDataV2 } from "../../../apiUtils";
// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import TopBar from "../../sections/TopBar";
// import Sidebar from "../../sections/Sidebar";
// import ProfileSection from "../../sections/ProfileSection";
// import StepTracker from "../../StepTracker/StepTracker";
// import findUser from "../../../images/findUser.svg";

// const MemStepFive = () => {
//   const navigate = useNavigate();
//   const { userId } = useParams();
//   const [apiData, setApiData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [errors, setErrors] = useState();

//   const [profileData, setProfileData] = useState({
//     profile_visible: "",
//     photo_upload_privacy_option: "",
//   });

//   const naviagteNextStep = () => {
//     const parameters = {
//       url: `/api/user/${userId}`,
//       payload: {
//         profile_visible: profileData.profile_visible,
//         photo_upload_privacy_option: profileData.photo_upload_privacy_option,
//       },
//       navigate: navigate,
//       navUrl: `/memstepsix/${userId}`,
//       setErrors: setErrors,
//     };

//     if (
//       profileData.profile_visible &&
//       profileData.photo_upload_privacy_option
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
//       profileData.profile_visible &&
//       profileData.photo_upload_privacy_option
//     ) {
//       navigate(`/memstepsix/${userId}`);
//     } else {
//       setErrors(true);
//       setMessage("Plese fill all the required fields");
//     }
//   };

//   const [image, setImage] = useState(null);
//   const [error, setError] = useState("");
//   const [preview, setPreview] = useState("");

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];

//     if (!file) return;

//     // Check file size
//     if (file.size > 100 * 1024) {
//       setError("Please upload an image less than 100KB.");
//       return;
//     }

//     const img = new Image();
//     img.src = URL.createObjectURL(file);

//     img.onload = () => {
//       // Check aspect ratio (square)
//       if (img.width !== img.height) {
//         setError("Please upload a square image.");
//         return;
//       }

//       setError("");
//       setImage(file);
//       setPreview(img.src); // Set preview image
//     };
//   };

//   const handleSave = () => {
//     if (!image) {
//       setError("Please upload an image before saving.");
//       return;
//     }

//     setError("");
//     console.log("Image saved:", image);
//     alert("Image saved successfully!");
//   };

//   useEffect(() => {
//     setTimeout(() => {
//       setErrors(null);
//     }, 5000);
//   }, [errors]);

//   return (

// <div className="flex h-screen">
//       <main className="flex-1 bg-white">
//       {errors && (
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
//               borderRadius :"1vh",
//               cursor : "pointer"
              
//             }}
//           >
//           <div>
//             <svg width="27" height="27" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path fill-rule="evenodd" clip-rule="evenodd" d="M8.77348 1.90259C9.14789 1.69179 9.57031 1.58105 9.99998 1.58105C10.4296 1.58105 10.8521 1.69179 11.2265 1.90259C11.6009 2.11338 11.9146 2.41712 12.1375 2.78448L12.1399 2.78844L19.1982 14.5718L19.205 14.5833C19.4233 14.9613 19.5388 15.3899 19.54 15.8264C19.5412 16.263 19.4281 16.6922 19.2119 17.0714C18.9958 17.4507 18.6841 17.7667 18.3078 17.9881C17.9316 18.2095 17.504 18.3285 17.0675 18.3333L17.0583 18.3334L2.93248 18.3333C2.49598 18.3285 2.06834 18.2095 1.69212 17.9881C1.31589 17.7667 1.00419 17.4507 0.788018 17.0714C0.571848 16.6922 0.458748 16.263 0.459971 15.8264C0.461193 15.3899 0.576695 14.9613 0.794985 14.5833L0.801754 14.5718L7.86247 2.78448C8.0853 2.41711 8.39908 2.11338 8.77348 1.90259ZM9.99998 3.24772C9.85675 3.24772 9.71595 3.28463 9.59115 3.3549C9.46691 3.42485 9.3627 3.52549 9.28849 3.64721L2.23555 15.4215C2.16457 15.5464 2.12703 15.6874 2.12663 15.8311C2.12622 15.9766 2.16392 16.1197 2.23598 16.2461C2.30804 16.3725 2.41194 16.4779 2.53735 16.5517C2.66166 16.6248 2.80281 16.6644 2.94697 16.6667H17.053C17.1971 16.6644 17.3383 16.6248 17.4626 16.5517C17.588 16.4779 17.6919 16.3725 17.764 16.2461C17.836 16.1197 17.8737 15.9766 17.8733 15.8311C17.8729 15.6875 17.8354 15.5464 17.7644 15.4216L10.7125 3.64886C10.7121 3.64831 10.7118 3.64776 10.7115 3.64721C10.6373 3.52549 10.533 3.42485 10.4088 3.3549C10.284 3.28463 10.1432 3.24772 9.99998 3.24772Z" fill="white"/>
// <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0001 6.6665C10.4603 6.6665 10.8334 7.0396 10.8334 7.49984V10.8332C10.8334 11.2934 10.4603 11.6665 10.0001 11.6665C9.53984 11.6665 9.16675 11.2934 9.16675 10.8332V7.49984C9.16675 7.0396 9.53984 6.6665 10.0001 6.6665Z" fill="white"/>
// <path fill-rule="evenodd" clip-rule="evenodd" d="M9.16675 14.1668C9.16675 13.7066 9.53984 13.3335 10.0001 13.3335H10.0084C10.4687 13.3335 10.8417 13.7066 10.8417 14.1668C10.8417 14.6271 10.4687 15.0002 10.0084 15.0002H10.0001C9.53984 15.0002 9.16675 14.6271 9.16675 14.1668Z" fill="white"/>
// </svg>
// </div>


//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 color: "white",
//                 width :"100%",
//                 paddingLeft : "5%"
//               }}
//             >
//               <h2 style={{ margin: 0, fontSize: "3vh", fontWeight: "500" }}>
//                 Missing Information
//               </h2>
//               <p style={{ margin: 0, width: "100%", fontSize :"2.2vh"}}>
//                 Please fill out all required fields to proceed to the next step
//               </p>
//             </div>
//               <div onClick={()=>setErrors(!errors)}>
//             <svg width="27" height="27" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5893 4.41058C15.9148 4.73602 15.9148 5.26366 15.5893 5.58909L5.58934 15.5891C5.2639 15.9145 4.73626 15.9145 4.41083 15.5891C4.08539 15.2637 4.08539 14.736 4.41083 14.4106L14.4108 4.41058C14.7363 4.08514 15.2639 4.08514 15.5893 4.41058Z" fill="white"/>
// <path fill-rule="evenodd" clip-rule="evenodd" d="M4.41083 4.41058C4.73626 4.08514 5.2639 4.08514 5.58934 4.41058L15.5893 14.4106C15.9148 14.736 15.9148 15.2637 15.5893 15.5891C15.2639 15.9145 14.7363 15.9145 14.4108 15.5891L4.41083 5.58909C4.08539 5.26366 4.08539 4.73602 4.41083 4.41058Z" fill="white"/>
// </svg>
// </div>
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
//         style={{
//           height: "1px",
//           width: "91.5%",
//           backgroundColor: "#ccc",
//           marginLeft: "10vh",
//         }}
//       ></div>

//         <div className="form_container_user_creation h-auto bg-white pb-[12px] w-[100vw] ">
//           <div
//             style={{
//               width: "33.8%",
//               display: "flex",
//               justifyContent: "flex-end",
//               alignItems: "center",
//             }}
//           >
//             <StepTracker percentage={85} />
//           </div>

//           <div style={{ width: "86.1%", marginLeft: "19.5%" }}>
//             <form
//               style={{
//                 borderLeft: "0.5px solid #ccc",
//               padding: "1rem",
//               width: "70%",
//               display: "flex",
//               flexDirection: "column",
//               gap: "1rem",
//               padding: "1% 4%",
//               margin: "auto",
//               height: "auto",
//               position:"absolute",
//               left:"24.2rem",
//               zIndex:"0"
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
//                 step 5/6
//               </p>
//               <h4 className="col-span-3 m-0 p-0" style={{ fontWeight: "bold" }}>
//               Privacy Selection
//               </h4>
//               <p
//                 style={{
//                   fontSize: "small",
//                   color: "gray",
//                   marginBottom: "1vh",
//                   padding: "0",
//                 }}
//               >
//               At MehramMatch, we respect your privacy and allow you to control the information you share with potential partners. Select your privacy
// preferences below to ensure that your details are only visible to the right people. You can choose to keep certain information private or make it
// visible according to your comfort level. Your privacy settings can be updated at any time to suit your needs.
//               </p>
//               <div
//                 style={{
//                   height: "0.7px",
//                   width: "100%",
//                   backgroundColor: "#ccc",
//                 }}
//               ></div>
//              <div style={{ display: "flex", gap: "2rem" }}>
//                     <div className="w-[60%] mx-auto">
//                       <div style={{ display: "flex", alignItems: "center" }}>
//                         <img
//                           src={preview}
//                           alt="Preview"
//                           className="w-[8rem] h-[8rem] object-cover border rounded mr-[1rem]"
//                         />
//                         <div
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             flexDirection: "column",
//                           }}
//                         >
//                           <label className="block text-[0.8rem] font-medium text-[#000000] mt-0 mb-[1.2rem]">
//                             Please upload square images (size less than 100KB)
//                           </label>
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             className="mb-4 w-full border rounded-[4px] p-2"
//                           />
//                           {error && (
//                             <p className="text-red-500 text-sm mb-2">{error}</p>
//                           )}
//                           {preview && (
//                             <img
//                               src={preview}
//                               alt="Preview"
//                               className="mb-4 w-32 h-32 object-cover border rounded"
//                             />
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div style={{ display: "flex", gap: "2rem" }}>
//                   <div className="w-[50%]">
//                       <label
//                         htmlFor="dob"
//                         className="block text-sm font-medium text-[#000000]"
//                       >
//                         Photo Privacy Option{" "}
//                         <span style={{ color: "red" }}>*</span>{" "}
//                       </label>
//                       <select
//                         id="profile_visible "
//                         name="profile_visible"
//                         required
//                         className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
//                         onChange={(e) =>
//                           updateField("profile_visible", e.target.value)
//                         }
//                       >
//                         <option value="">Select Visiblity</option>
//                         <option value="yes">Yes</option>
//                         <option value="no">No</option>
//                       </select>
//                     </div>

//                     <div className="w-[50%]">
//                       <label
//                         htmlFor="dob"
//                         className="block text-sm font-medium text-[#000000]"
//                       >
//                         Profile Visibility{" "}
//                         <span style={{ color: "red" }}>*</span>{" "}
//                       </label>
//                       <select
//                         id="profile_visible "
//                         name="profile_visible"
//                         required
//                         className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
//                         onChange={(e) =>
//                           updateField("profile_visible", e.target.value)
//                         }
//                       >
//                         <option value="">Select Visiblity</option>
//                         <option value="yes">Yes</option>
//                         <option value="no">No</option>
//                       </select>
//                     </div>
//                   </div>
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
//                 type="button"
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

// export default MemStepFive;
//Color Codes: #CB3B8B, #FF59B6, #FFC0E3, #FFA4D6, #DA73AD, #EB53A7, #F971BC
// Fonts: For Now Default Font Using "Poppins"
