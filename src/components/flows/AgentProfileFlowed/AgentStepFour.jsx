import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDataV2, justputDataWithoutToken, ReturnPutResponseFormdataWithoutToken, ReturnResponseFormdataWithoutToken } from "../../../apiUtils";
import StepTrackerAgent from "../../StepTracker/StepTrackerAgent";
import './AgentStepOne.css'

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
    console.log('handleSave called, image:', image);
    if (!image) {
      setError("Please upload an image before saving.");
      return;
    }
    const formData = new FormData();
    formData.append('upload_photo', image);
    formData.append('agent_id', userId);

    // Check if there's already a photo in imagedata (from profile photo table)
    console.log('Current imagedata when saving:', imagedata);
    console.log('imagedata length:', imagedata?.length);
    console.log('profileData.upload_photo:', profileData?.upload_photo);
    console.log('apiData.profile_photo:', apiData?.profile_photo);

    const existingPhotoId = imagedata?.[imagedata.length - 1]?.id;
    const hasExistingPhoto = existingPhotoId && imagedata.length > 0;

    // Fallback: If imagedata is empty but main profile has a photo, we should update
    const hasPhotoInMainProfile = apiData?.profile_photo || profileData?.upload_photo;
    const shouldUpdate = hasExistingPhoto || hasPhotoInMainProfile;

    console.log('existingPhotoId:', existingPhotoId);
    console.log('hasExistingPhoto:', hasExistingPhoto);
    console.log('hasPhotoInMainProfile:', hasPhotoInMainProfile);
    console.log('shouldUpdate:', shouldUpdate);

    let updateurl = `/api/agent/profile_photo/${existingPhotoId}/`;
    const parameter = {
      url: hasExistingPhoto ? updateurl : '/api/agent/profile_photo/',
      setUserId: (responseData) => {
        console.log('Photo upload response:', responseData);
        // Convert single response to array format for imagedata
        setImagedateset([responseData]);

        // Update agent profile with the new photo URL
        if (responseData?.upload_photo) {
          console.log('Updating agent profile with new photo URL:', responseData.upload_photo);
          const updateParameter = {
            url: `/api/agent/${userId}/`,
            payload: {
              profile_photo: responseData.upload_photo,
              // Don't send upload_photo to main agent profile, only profile_photo
            },
            setErrors: setError,
          };
          justputDataWithoutToken(updateParameter);
        }
      },
      formData: formData,
      setErrors: setError,
      setLoading: setLoading,
    };
    console.log("Existing photo ID:", existingPhotoId);
    console.log("Has existing photo:", hasExistingPhoto);
    console.log("Uploading photo to:", parameter.url);

    if (hasExistingPhoto) {
      console.log("Using PUT request for update");
      ReturnPutResponseFormdataWithoutToken(parameter)
    } else {
      console.log("Using POST request for new upload");
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

      // Also fetch the profile photo data
      const photoParameter = {
        url: `/api/agent/profile_photo/?agent_id=${userId}`,
        setterFunction: setImagedateset,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      console.log('Fetching profile photos for agent_id:', userId);
      // This endpoint returns a list (array). Use list-aware fetch helper.
      fetchDataV2(photoParameter);
    }


    // }


  }, [userId]);

  useEffect(() => {
    if (apiData) {
      console.log(apiData, "apiData loaded");
      console.log(apiData.profile_photo, "apiData.profile_photo");
      console.log(apiData.upload_photo, "apiData.upload_photo");

      setProfileData({
        expierience_in_business: apiData.expierience_in_business,
        marraige_fixed_in_pass: apiData.marraige_fixed_in_pass,
        full_time_marraige_agent: apiData.full_time_marraige_agent,
        upload_photo: apiData.upload_photo
      });
    }

  }, [apiData]);
  useEffect(() => {
    console.log('imagedata updated:', imagedata);
    console.log('imagedata length:', imagedata?.length);
    if (imagedata && imagedata.length > 0) {
      const latestPhoto = imagedata[imagedata.length - 1];
      console.log('Latest photo from imagedata:', latestPhoto);
      if (latestPhoto?.upload_photo) {
        console.log('Loading photo from imagedata:', latestPhoto.upload_photo);

        // Construct full URL if it's a relative path
        const fullPhotoUrl = latestPhoto.upload_photo.startsWith('http')
          ? latestPhoto.upload_photo
          : `${process.env.REACT_APP_API_URL}${latestPhoto.upload_photo}`;

        setPreview(fullPhotoUrl);

        // Create a mock file object for the existing photo
        const mockFile = {
          name: 'existing-photo.jpg',
          type: 'image/jpeg',
          size: 0
        };
        setImage(mockFile);
      }
    }
  }, [imagedata]);

  const naviagteNextStep = () => {
    console.log('Next Step clicked, image:', image);

    // If there's an image to upload, save it first
    if (image) {
      console.log('Image found, calling handleSave first');
      handleSave();

      // Wait for photo upload to complete, then proceed
      setTimeout(() => {
        console.log('Photo upload completed, proceeding to next step');
        proceedToNextStep();
      }, 2000);
    } else {
      console.log('No image to upload, proceeding directly');
      proceedToNextStep();
    }
  };

  const proceedToNextStep = () => {
    if (validateForm()) {
      const parameters = {
        url: `/api/agent/${userId}/`,
        payload: {
          expierience_in_business: profileData?.expierience_in_business,
          marraige_fixed_in_pass: profileData?.marraige_fixed_in_pass,
          full_time_marraige_agent: profileData?.full_time_marraige_agent,
          upload_photo: profileData?.upload_photo
        },
        navigate: navigate,
        navUrl: `/agentstepfiv/${userId}`,
        setErrors: setErrors,
      };

      justputDataWithoutToken(parameters);
    } else {
      setMessage("Please fill all the required fields");
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
      <main className="flex-1 bg-white steps-title">

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
            className="step-tracker"
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
                      className={`h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] ${errors.expierience_in_business
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
                      className={`h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] ${errors.mar_fixed
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
                      {/* <button
                        onClick={(e) =>
                          updateField("full_time_marraige_agent", "yes")
                        }
                        type="button"
                        className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${profileData?.full_time_marraige_agent === "yes"
                          ? "bg-green-500"
                          : "bg-gray-300"
                          }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${profileData?.full_time_marraige_agent === "yes"
                            ? "translate-x-6"
                            : "translate-x-0"
                            }`}
                        ></div>
                      </button>
                      <span className="ml-2 text-sm text-[#6d6e6f] font-medium">Yes</span> */}

                      <button
                        onClick={(e) =>
                          updateField("full_time_marraige_agent", "yes")
                        }
                        type="button"
                        aria-pressed={profileData.full_time_marraige_agent === "no"}
                        className={`px-4 py-2 rounded-full border ${profileData.full_time_marraige_agent === "no" ? "bg-green-500 text-white border-green-500" : "bg-white text-gray-700"}`}
                      >
                        No
                      </button>


                      <button
                        onClick={(e) =>
                          updateField("full_time_marraige_agent", "no")
                        }
                        type="button"
                        aria-pressed={profileData.full_time_marraige_agent === "yes"}
                        className={`px-4 py-2 rounded-full border ${profileData.full_time_marraige_agent === "yes" ? "bg-green-500 text-white border-green-500" : "bg-white text-gray-700"}`}
                      >
                        Yes
                      </button>
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
