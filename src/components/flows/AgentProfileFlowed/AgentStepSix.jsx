import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDataObjectV2, fetchDataV2, justputDataWithoutToken, postDataReturnResponse, ReturnPutResponseFormdataWithoutToken, ReturnResponseFormdataWithoutToken, updateDataV2 } from "../../../apiUtils";
import TopBar from "../../sections/TopBar";
import Sidebar from "../../sections/Sidebar";
import ProfileSection from "../../sections/ProfileSection";
import StepTrackerAgent from "../../StepTracker/StepTrackerAgent";
import findUser from "../../../images/findUser.svg";

const AgentStepSix = () => {
  const navigate = useNavigate();
  const [userId] = useState(localStorage.getItem('userId'));
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [profileData, setProfileData] = useState({
    profile_visible: "",
    photo_upload_privacy_option: "",
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [imagedata, setImagedateset] = useState([]);


  const validateForm = () => {
    const newErrors = {};

    // Validate Sect / School of Thought


    // if (!profileData.photo_upload_privacy_option) {
    //   newErrors.photo_upload_privacy_option =
    //     "Photo Privacy Option required";
    // }
    // if (!profileData.profile_visible) {
    //   newErrors.profile_visible =
    //     "Profile Visibility required";
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
      url: `${profileData.upload_photo ? updateurl : '/api/user/profile_photo/'}`,
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
        url: `/api/agent/${userId}/`,
        setterFunction: setApiData,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      // const parameter1 = {
      //   url: `/api/user/profile_photo/?user_id=${userId}`,
      //   setterFunction: setImagedateset,
      //   setErrors: setErrors,
      //   setLoading: setLoading,
      // };
      // fetchDataObjectV2(parameter);
      fetchDataV2(parameter);
      // console.log(imagedata,"pics");

    }


  }, [userId]);

  useEffect(() => {
    if (apiData) {
      console.log(apiData, "apiData.profile_photo");
      console.log(apiData.profile_photo, "apiData.profile_photo");

      setProfileData({
        billingdetails: apiData.billingdetails || '',
        photo_upload_privacy_option: apiData.paymentmethod || '',
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
        url:`/api/agent/${userId}/`,
        payload: {
          billingdetails: profileData.billingdetails,
          paymentmethod: profileData.paymentmethod,
        },
        navigate: navigate,
        navUrl: `/newdashboard`,
        setErrors: setErrors,
      };

      // if (profileData.profile_visible && profileData.photo_upload_privacy_option) {
      if (true) {
        // updateDataV2(parameters);
        justputDataWithoutToken(parameters)
        handleSave()
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
    if (profileData.profile_visible && profileData.photo_upload_privacy_option) {
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
            <StepTrackerAgent percentage={100} />
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
                step 6/6
              </p>
              <h4 className="col-span-3 m-0 p-0" style={{ fontWeight: "bold" }}>
              Payment Gateway
              </h4>
              <p
                style={{
                  fontSize: "small",
                  color: "gray",
                  marginBottom: "1vh",
                  padding: "0",
                }}
              >
                At MehramMatch, we respect your privacy and allow you to control the information you share with potential partners. Select your privacy
                preferences below to ensure that your details are only visible to the right people. You can choose to keep certain information private or make it
                visible according to your comfort level. Your privacy settings can be updated at any time to suit your needs.
              </p>
              <div
                style={{
                  height: "0.7px",
                  width: "100%",
                  backgroundColor: "#ccc",
                }}
              ></div>

<div style={{ display: "flex", gap: "2rem" }}>
  {/* Payment Method */}
  <div className="w-[50%] relative">
    <label
      htmlFor="paymentmethod"
      className="block text-sm font-medium text-[#000000]"
    >
      Payment Method {" "}
      <span style={{ color: "red" }}>*</span>
    </label>
    <div className="relative">
      <select
        id="paymentmethod"
        name="paymentmethod"
        value={profileData.paymentmethod || null}
        required
        className={
          `h-10 px-4 text-[#6D6E6F] font-semibold placeholder-[#898B92] mt-2 w-full rounded-lg border-1 border-[#898B92] ${errors.paymentmethod ?
            "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-[#898B92] focus:border-[#898B92] focus:ring-[#898B92]"
          } focus:outline-none focus:ring-2`
        }
        onChange={(e) =>
          updateField("paymentmethod", e.target.value)
        }
      >
        <option value="">Select payment method</option>
        <option value="Sunni">Credit Card </option>
        <option value="Shia">Debit Card </option>
        <option value="Others">PayPal </option>
        <option value="Others">UPI </option>
      </select>
      {/* Information icon positioned at right corner of input */}
      <div className="absolute right-4 top-1/2 mt-1 transform -translate-y-1/2 group z-20" style={{ zIndex: "1000" }}>
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
    {errors.paymentmethod && (
      <p className="text-red-500 text-sm mt-1">
        {errors.paymentmethod}
      </p>
    )}
  </div>

  {/* Billing Details */}
  <div className="w-[50%] relative">
    <label
      htmlFor="billingdetails"
      className="block text-sm font-medium text-[#000000]"
    >
      Billing Details 
    </label>
    <div className="relative">
      <input
        type="text"
        id="billingdetails"
        name="billingdetails"
        value={profileData.billingdetails || ''}
        className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
        onChange={(e) =>
          updateField("billingdetails", e.target.value)
        }
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
        This is additional information about the Islam Practicing Level field.
      </div>
    </div>
  </div>
</div>
                


              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  onClick={() => {
                    navigate(`/agentstepfiv/${userId}`);
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
                  Pay Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentStepSix;


