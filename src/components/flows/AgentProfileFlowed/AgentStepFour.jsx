import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDataObjectV2, fetchDataV2, justputDataWithoutToken, postDataReturnResponse, ReturnPutResponseFormdataWithoutToken, ReturnResponseFormdataWithoutToken, updateDataV2 } from "../../../apiUtils";
import TopBar from "../../sections/TopBar";
import Sidebar from "../../sections/Sidebar";
import ProfileSection from "../../sections/ProfileSection";
import StepTrackerAgent from "../../StepTracker/StepTrackerAgent";
import findUser from "../../../images/findUser.svg";

const AgentStepFour = () => {
  const navigate = useNavigate();
  const [userId] = useState(localStorage.getItem('userId'));
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [profileData, setProfileData] = useState({
    expierience_in_business: '',
    marraige_fixed_in_pass: '',
    full_time_marraige_agent: '',
    upload_photo: ''
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [imagedata, setImagedateset] = useState([]);


  const validateForm = () => {
    const newErrors = {};

    // Validate Sect / School of Thought

    if (!profileData?.expierience_in_business) {
      newErrors.expierience_in_business = "Experience in Business is required";
    }
    if (!profileData?.marraige_fixed_in_pass) {
      newErrors.marraige_fixed_in_pass = "Marriage Fixed in Past is required";
    }
    if (!profileData?.full_time_marraige_agent) {
      newErrors.full_time_marraige_agent = "Full-time Marriage Agent status is required";
    }
    // if (!profileData?.upload_photo) {
    //   newErrors.upload_photo = "Photo upload is required";
    // }
    


    setErrors(newErrors);
    console.log(Object.keys(newErrors).length, ">>>");

    return Object.keys(newErrors).length === 0; // Return true if no errors
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
    let updateurl = `/api/user/profile_photo/${imagedata?.[imagedata.length - 1]?.id}/`
    const parameter = {
      url: `${profileData?.upload_photo ? updateurl : '/api/user/profile_photo/'}`,
      setUserId: setImagedateset,
      formData: formData,
      setErrors: setError,
      setLoading: setLoading,
    };
    console.log("profileData?.profile_photo", profileData?.profile_photo);

    if (profileData?.upload_photo) {
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

      // const parameter = {
      //   url: `/api/user/${userId}/`,
      //   setterFunction: setApiData,
      //   setErrors: setErrors,
      //   setLoading: setLoading,
      // };
      // const parameter1 = {
      //   url: `/api/user/profile_photo/?user_id=${userId}`,
      //   setterFunction: setImagedateset,
      //   setErrors: setErrors,
      //   setLoading: setLoading,
      // };
      // fetchDataObjectV2(parameter);
      // fetchDataV2(parameter1);
      // console.log(imagedata,"pics");

         const parameter = {
              url: `/api/agent/${userId}/`,
              setterFunction: setApiData,
              setErrors: setErrors,
            };
            fetchDataV2(parameter);
          }
      

    // }


  }, [userId]);

  useEffect(() => {
    if (apiData) {
      // console.log(apiData, "apiData.profile_photo");
      // console.log(apiData.profile_photo, "apiData.profile_photo");

      setProfileData({
        expierience_in_business: apiData.expierience_in_business ,
        marraige_fixed_in_pass: apiData.marraige_fixed_in_pass ,
        full_time_marraige_agent: apiData.full_time_marraige_agent ,
        upload_photo: apiData.upload_photo 
      })
    }

  }, [apiData]);
  useEffect(() => {
    if (imagedata?.[imagedata.length - 1]?.upload_photo) {
      setPreview(imagedata?.[imagedata.length - 1]?.upload_photo)
    }

  }, [imagedata]);

  const naviagteNextStep = () => {
    // if (validateForm()) {
    if (true) {
      const parameters = {
        url: `/api/agent/${userId}/`,
        payload: {
          expierience_in_business: profileData?.expierience_in_business ,
          marraige_fixed_in_pass: profileData?.marraige_fixed_in_pass ,
          full_time_marraige_agent: profileData?.full_time_marraige_agent ,
          upload_photo: profileData?.upload_photo 
        },
        navigate: navigate,
        navUrl: `/agentstepfiv/${userId}`,
        setErrors: setErrors,
      };

      // if (profileData?.profile_visible && profileData?.photo_upload_privacy_option) {
      if (validateForm()) {
        // updateDataV2(parameters);
        justputDataWithoutToken(parameters);
        // handleSave()
      } else {
        // setErrors(true);
        setMessage("Please fill all the required fields");
      }
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
    if (profileData?.profile_visible && profileData?.photo_upload_privacy_option) {
      navigate(`/memstepsix/${userId}`);
    } else {
      setErrors(true);
      setMessage("Please fill all the required fields");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setError(null);
    }, 5000);
  }, [error]);

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
              padding: "2vh 3vh",
              gap: "10px",
              position: "absolute",
              left: "35%",
              borderRadius: "1vh",
              cursor: "pointer",
            }}
          >
            <div>
              <svg width="27" height="27" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.77348 1.90259C9.14789 1.69179 9.57031 1.58105 9.99998 1.58105C10.4296 1.58105 10.8521 1.69179 11.2265 1.90259C11.6009 2.11338 11.9146 2.41712 12.1375 2.78448L12.1399 2.78844L19.1982 14.5718L19.205 14.5833C19.4233 14.9613 19.5388 15.3899 19.54 15.8264C19.5412 16.263 19.4281 16.6922 19.2119 17.0714C18.9958 17.4507 18.6841 17.7667 18.3078 17.9881C17.9316 18.2095 17.504 18.3285 17.0675 18.3333L17.0583 18.3334L2.93248 18.3333C2.49598 18.3285 2.06834 18.2095 1.69212 17.9881C1.31589 17.7667 1.00419 17.4507 0.788018 17.0714C0.571848 16.6922 0.458748 16.263 0.459971 15.8264C0.461193 15.3899 0.576695 14.9613 0.794985 14.5833L0.801754 14.5718L7.86247 2.78448C8.0853 2.41711 8.39908 2.11338 8.77348 1.90259ZM9.99998 3.24772C9.85675 3.24772 9.71595 3.28463 9.59115 3.3549C9.46691 3.42485 9.3627 3.52549 9.28849 3.64721L2.23555 15.4215C2.16457 15.5464 2.12703 15.6874 2.12663 15.8311C2.12622 15.9766 2.16392 16.1197 2.23598 16.2461C2.30804 16.3725 2.41194 16.4779 2.53735 16.5517C2.66166 16.6248 2.80281 16.6644 2.94697 16.6667H17.053C17.1971 16.6644 17.3383 16.6248 17.4626 16.5517C17.588 16.4779 17.6919 16.3725 17.764 16.2461C17.836 16.1197 17.8737 15.9766 17.8733 15.8311C17.8729 15.6875 17.8354 15.5464 17.7644 15.4216L10.7125 3.64886C10.7121 3.64831 10.7118 3.64776 10.7115 3.64721C10.6373 3.52549 10.533 3.42485 10.4088 3.3549C10.284 3.28463 10.1432 3.24772 9.99998 3.24772Z" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M10.0001 6.6665C10.4603 6.6665 10.8334 7.0396 10.8334 7.49984V10.8332C10.8334 11.2934 10.4603 11.6665 10.0001 11.6665C9.53984 11.6665 9.16675 11.2934 9.16675 10.8332V7.49984C9.16675 7.0396 9.53984 6.6665 10.0001 6.6665Z" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M9.16675 14.1668C9.16675 13.7066 9.53984 13.3335 10.0001 13.3335H10.0084C10.4687 13.3335 10.8417 13.7066 10.8417 14.1668C10.8417 14.6271 10.4687 15.0002 10.0084 15.0002H10.0001C9.53984 15.0002 9.16675 14.6271 9.16675 14.1668Z" fill="white" />
              </svg>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                color: "white",
                width: "100%",
                paddingLeft: "5%",
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
                <path fillRule="evenodd" clipRule="evenodd" d="M15.5893 4.41058C15.9148 4.73602 15.9148 5.26366 15.5893 5.58909L5.58934 15.5891C5.2639 15.9145 4.73626 15.9145 4.41083 15.5891C4.08539 15.2637 4.08539 14.736 4.41083 14.4106L14.4108 4.41058C14.7363 4.08514 15.2639 4.08514 15.5893 4.41058Z" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M4.41083 4.41058C4.73626 4.08514 5.2639 4.08514 5.58934 4.41058L15.5893 14.4106C15.9148 14.736 15.9148 15.2637 15.5893 15.5891C15.2639 15.9145 14.7363 15.9145 14.4108 15.5891L4.41083 5.58909C4.08539 5.26366 4.08539 4.73602 4.41083 4.41058Z" fill="white" />
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
            <StepTrackerAgent percentage={70} />
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
                step 4/6
              </p>
              <h4 className="col-span-3 m-0 p-0" style={{ fontWeight: "bold" }}>
                Verification
              </h4>
              <p
                style={{
                  fontSize: "small",
                  color: "gray",
                  marginBottom: "1vh",
                  padding: "0",
                }}
              >
                At MehramMatch, we respect your privacy and allow you to control
                the information you share with potential partners. Select your
                privacy preferences below to ensure that your details are only
                visible to the right people. You can choose to keep certain
                information private or make it visible according to your comfort
                level. Your privacy settings can be updated at any time to suit
                your needs.
              </p>
              <div
                style={{
                  height: "0.7px",
                  width: "100%",
                  backgroundColor: "#ccc",
                }}
              ></div>
              <div style={{ display: "flex", gap: "2rem" }}>
                <div className="w-[60%] mx-auto">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      style={{
                        border: isDragging
                          ? "2px dashed #000"
                          : "2px dashed #ccc",
                        borderRadius: "4px",
                        padding: "20px",
                        textAlign: "center",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      <p>Drag and Drop file here or Choose file</p>
                      <p>Supported formats: JPG, PNG, or JPEG</p>
                      <p>Maximum file size: 5MB</p>
                      <input
                        type="file"
                        accept="image/jpeg, image/png, image/jpg"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                        id="fileInput"
                      />
                      <label
                        htmlFor="fileInput"
                        style={{
                          color: "#0fd357",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        Choose file
                      </label>
                    </div>
                    {error && (
                      <p className="text-red-500 text-sm mb-2">{error}</p>
                    )}
                    {preview && (
                      <img
                        src={preview}
                        alt="Preview"
                        className="mt-4 w-32 h-32 object-cover border rounded"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "2rem" }}>
                {apiData.gender == "female" && (
                  <div className="w-[50%] relative flex flex-col gap-[10px]">
                    <label
                      htmlFor="photo_privacy"
                      className="block text-sm font-medium text-[#000000] mb-0"
                    >
                      Photo Privacy Option{" "}
                      <span style={{ color: "red" }}>*</span>{" "}
                    </label>
                    <div className="relative">
                      <select
                        id="photo_privacy"
                        name="photo_privacy"
                        value={profileData?.photo_upload_privacy_option}
                        required
                        className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                        onChange={(e) =>
                          updateField(
                            "photo_upload_privacy_option",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select Visibility</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                      {/* Information icon positioned at right corner of input */}
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 group z-20">
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
                          This is additional information about the Photo Privacy
                          Option field.
                        </div>
                      </div>
                    </div>
                    {errors.photo_upload_privacy_option && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.photo_upload_privacy_option}
                      </p>
                    )}
                  </div>
                )}

                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label
                    htmlFor="expyears"
                    className="block text-sm font-medium text-[#000000] mb-0"
                  >
                    Experience in Business{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="expyears"
                      name="expyears"
                      required
                      value={profileData?.expierience_in_business || ""}
                      className={`h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] ${
                        errors.expierience_in_business
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                      } focus:outline-none focus:ring-2`}
                      onChange={(e) =>
                        updateField("expierience_in_business", e.target.value)
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
                  {errors.expierience_in_business && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.expierience_in_business}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: "2rem" }}>
                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label
                    htmlFor="marfixed"
                    className="block text-sm font-medium text-[#000000] mb-0"
                  >
                    Marriages Fixed in the Past{" "}
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="marfixed"
                      name="marfixed"
                      required
                      value={profileData?.marraige_fixed_in_pass || ""}
                      className={`h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] ${
                        errors.mar_fixed
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                          : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
                      } focus:outline-none focus:ring-2`}
                      onChange={(e) =>
                        updateField("marraige_fixed_in_pass", e.target.value)
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
                  {errors.marraige_fixed_in_pass && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.marraige_fixed_in_pass}
                    </p>
                  )}
                </div>

                <div className="w-[50%] relative ">
                  <div className="relative flex flex-col gap-[20px]">
                    <label className="block text-sm font-medium text-[#000000] mb-0">
                      Full-time Marriage Agent
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    {/* Information icon positioned at right corner of input */}
                    <div className="absolute left-60 top-3 transform -translate-y-1/2 group z-20">
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
                        This is additional information about the Belives in
                        Dargah/Fatiha/Niyah field.
                      </div>
                    </div>
                  

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={(e) =>
                        updateField("full_time_marraige_agent", "yes")
                      }
                      type="button"
                      className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
                        profileData?.full_time_marraige_agent === "yes"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                          profileData?.full_time_marraige_agent === "yes"
                            ? "translate-x-6"
                            : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                    <span className="ml-2 text-sm text-[#6d6e6f] font-medium">Yes</span>

                    <button
                      onClick={(e) =>
                        updateField("full_time_marraige_agent", "no")
                      }
                      type="button"
                      className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
                        profileData?.full_time_marraige_agent === "no"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                          profileData?.full_time_marraige_agent === "no"
                            ? "translate-x-6"
                            : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                    <span className="ml-2 text-sm text-[#6d6e6f] font-medium">No</span>
                  </div>
                  {errors.full_time_marraige_agent && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.full_time_marraige_agent}
                    </p>
                  )}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  onClick={() => {
                    navigate(`/agentstepthr/${userId}`);
                  }}
                  className="text-[black] bg-[white] mt-[24px] h-[40px] w-[150px]"
                  style={{
                    borderRadius: "5vh",
                    color: "#fff !important",
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
                    color: "#fff !important",
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

export default AgentStepFour;
