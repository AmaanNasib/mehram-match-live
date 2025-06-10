import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchDataV2,
  ReturnPutResponseFormdataWithoutToken,
  ReturnResponseFormdataWithoutToken,
  updateDataV2,
} from "../../../apiUtils";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../../sections/TopBar";
import Sidebar from "../../sections/Sidebar";
import ProfileSection from "../../sections/ProfileSection";
import StepTracker from "../../StepTracker/StepTracker";
import findUser from "../../../images/findUser.svg";
import { fetchDataObjectV2 } from "../../../apiUtils";

const MemStepSix = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let { userId } = useParams();
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState();
  const [isAccordionOpen, setIsAccordionOpen] = useState(false); // State for accordion
  const [isPersonalInfoAccordionOpen, setIsPersonalInfoAccordionOpen] =
    useState(false); // State for accordion
  const [isFamilyInfoAccordionOpen, setIsFamilyInfoAccordionOpen] =
    useState(false); // State for accordion
  const [
    isPartnerExpectationAccordionOpen,
    setIsPartnerExpectationAccordionOpen,
  ] = useState(false); // State for accordion
  const [isPrivacyAccordionOpen, setIsPrivacyAccordionOpen] = useState(false); // State for accordion
  const [isAdditionalInfoOpen, setIsAdditionalInfoOpen] = useState(false); // State for accordion
  const [imagedata, setImagedateset] = useState([]);
  const [lastSegment,setLastSegment]= useState("");

   userId = localStorage.getItem("member_id") || userId;

  useEffect(() => {
  const segments = location.pathname.split("/").filter(Boolean);
   setLastSegment(segments[segments.length - 2]);
}, [location.pathname]);
  

  useEffect(() => {
    if (userId) {
      const parameter = {
        url: `/api/user/${userId}/`,
        setterFunction: setApiData,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataObjectV2(parameter);
      const parameter1 = {
        url: `/api/user/profile_photo/?user_id=${userId}`,
        setterFunction: setImagedateset,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataV2(parameter1);
    }
  }, [userId]);
  useEffect(() => {
    if (imagedata?.[imagedata.length - 1]?.upload_photo) {
      setPreview(imagedata?.[imagedata.length - 1]?.upload_photo);
    }
  }, [imagedata]);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    gender: "",
    martial_status: "",
    city: "mumbai",
    state: "maharashtra",
    country: "india",
    native_country: "india",
    native_city: "mumbai",
    native_state: "maharashtra",
    Education: "B.E",
    profession: "",
    about_you: "",
    cultural_background: "",
    disability: "",
    income: "",
    percentage: "",
    sect_school_info: "",
    islamic_practicing_level: null,
    believe_in_dargah_fatiha_niyah: "",
    hijab_niqab_prefer: "",
    percentage: "",
    gender: "",
    father_name: "",
    father_occupation: "",
    mother_name: "",
    mother_occupation: "",
    wali_name: "",
    wali_contact_number: "",
    wali_blood_relation: "",
    number_of_children: null,
    number_of_brother: null,
    number_of_sister: null,
    number_of_son: null,
    number_of_daughter: null,
    number_of_siblings: null,
    number_of_brothers: null,
    number_of_sisters: null,
    family_type: "",
    family_practicing_level: "",
    percentage: "",
    gender: "",
    martial_status: "",
    preferred_surname: "",
    preferred_dargah_fatiha_niyah: "",
    preferred_sect: "",
    desired_practicing_level: "",
    preferred_city_state: "",
    preferred_family_type: "",
    preferred_family_background: "",
    preferred_education: "",
    preferred_occupation_profession: "",
    profile_visible: "",
    photo_upload_privacy_option: "",
    hieght: "",
    father_name: "",
    skin_tone: "",
    body_type: "",
    financial_status: "",
    father_alive: "",
    mother_alive: "",
    perform_namaz: "",
    recite_quran: "",
    marriage_plan: "",
    smoking_cigarette_sheesha: "",
    drinking_alcohol_wine: "",
  });

  useEffect(() => {
    if (apiData) {
      setProfileData({
        first_name: apiData.first_name || "",
        last_name: apiData.last_name || "",
        dob: apiData.dob || "",
        gender: apiData.gender || "",
        martial_status: apiData.martial_status || "",
        city: apiData.city || "mumbai",
        state: apiData.state || "maharashtra",
        country: apiData.country || "india",
        native_country: apiData.native_country || "india",
        native_city: apiData.native_city || "mumbai",
        native_state: apiData.native_state || "maharashtra",
        Education: apiData.Education || "B.E",
        profession: apiData.profession || "",
        about_you: apiData.about_you || "",
        cultural_background: apiData.cultural_background || "",
        disability: apiData.disability || "",
        income: apiData.income || "",
        percentage: apiData.percentage || "",
        sect_school_info: apiData.sect_school_info || "",
        islamic_practicing_level: apiData.islamic_practicing_level || null,
        believe_in_dargah_fatiha_niyah:
          apiData.believe_in_dargah_fatiha_niyah || "",
        hijab_niqab_prefer: apiData.hijab_niqab_prefer || "",
        father_name: apiData.father_name || "",
        father_occupation: apiData.father_occupation || "",
        mother_name: apiData.mother_name || "",
        mother_occupation: apiData.mother_occupation || "",
        wali_name: apiData.wali_name || "",
        wali_contact_number: apiData.wali_contact_number || "",
        wali_blood_relation: apiData.wali_blood_relation || "",
        number_of_children: apiData.number_of_children || null,
        number_of_brother: apiData.number_of_brother || null,
        number_of_sister: apiData.number_of_sister || null,
        number_of_son: apiData.number_of_son || null,
        number_of_daughter: apiData.number_of_daughter || null,
        number_of_siblings: apiData.number_of_siblings || null,
        number_of_brothers: apiData.number_of_brothers || null,
        number_of_sisters: apiData.number_of_sisters || null,
        family_type: apiData.family_type || "",
        family_practicing_level: apiData.family_practicing_level || "",
        preferred_surname: apiData.preferred_surname || "",
        preferred_dargah_fatiha_niyah:
          apiData.preferred_dargah_fatiha_niyah || "",
        preferred_sect: apiData.preferred_sect || "",
        desired_practicing_level: apiData.desired_practicing_level || "",
        preferred_city_state: apiData.preferred_city_state || "",
        preferred_family_type: apiData.preferred_family_type || "",
        preferred_family_background: apiData.preferred_family_background || "",
        preferred_education: apiData.preferred_education || "",
        preferred_occupation_profession:
          apiData.preferred_occupation_profession || "",
        profile_visible: apiData.profile_visible || "",
        photo_upload_privacy_option: apiData.photo_upload_privacy_option || "",
        hieght: apiData.hieght || "",
        weight: apiData.weight || "",
        step_father: apiData.step_father || "",
        step_mother: apiData.step_mother || "",
        type_of_disability: apiData.type_of_disability || "",
        describe_job_business: apiData.describe_job_business || "",
        preferred_state: apiData.preferred_state || "",
        preferred_city: apiData.preferred_city || "",
        preferred_country: apiData.preferred_country || "",
        upload_photo: apiData.profile_photo || "",
        skin_tone: apiData.skin_tone || "",
        body_type: apiData.body_type || "",
        financial_status: apiData.financial_status || "",
        father_alive: apiData.father_alive || "",
        mother_alive: apiData.mother_alive || "",
        perform_namaz: apiData.perform_namaz || "",
        recite_quran: apiData.recite_quran || "",
        marriage_plan: apiData.marriage_plan || "",
        smoking_cigarette_sheesha: apiData.smoking_cigarette_sheesha || "",
        drinking_alcohol_wine: apiData.drinking_alcohol_wine || "",
      });
    }
  }, [apiData]);

  const naviagteNextStep = () => {
    const parameters = {
      url: `/api/user/${userId}`,
      payload: {
        first_name: profileData.first_name || "",
        last_name: profileData.last_name || "",
        dob: profileData.dob || "",
        gender: profileData.gender || "",
        martial_status: profileData.martial_status || "",
        city: profileData.city || "mumbai",
        state: profileData.state || "maharashtra",
        country: profileData.country || "india",
        native_country: profileData.native_country || "india",
        native_city: profileData.native_city || "mumbai",
        native_state: profileData.native_state || "maharashtra",
        Education: profileData.Education || "B.E",
        profession: profileData.profession || "",
        about_you: profileData.about_you || "",
        cultural_background: profileData.cultural_background || "",
        disability: profileData.disability || "",
        income: profileData.income || "",
        percentage: profileData.percentage || "",
        sect_school_info: profileData.sect_school_info || "",
        islamic_practicing_level: profileData.islamic_practicing_level || null,
        believe_in_dargah_fatiha_niyah:
          profileData.believe_in_dargah_fatiha_niyah || "",
        hijab_niqab_prefer: profileData.hijab_niqab_prefer || "",
        father_name: profileData.father_name || "",
        father_occupation: profileData.father_occupation || "",
        mother_name: profileData.mother_name || "",
        mother_occupation: profileData.mother_occupation || "",
        wali_name: profileData.wali_name || "",
        wali_contact_number: profileData.wali_contact_number || "",
        wali_blood_relation: profileData.wali_blood_relation || "",
        number_of_children: profileData.number_of_children || null,
        number_of_brother: profileData.number_of_brother || null,
        number_of_sister: profileData.number_of_sister || null,
        number_of_son: profileData.number_of_son || null,
        number_of_daughter: profileData.number_of_daughter || null,
        number_of_siblings: profileData.number_of_siblings || null,
        number_of_brothers: profileData.number_of_brothers || null,
        number_of_sisters: profileData.number_of_sisters || null,
        family_type: profileData.family_type || "",
        family_practicing_level: profileData.family_practicing_level || "",
        preferred_surname: profileData.preferred_surname || "",
        preferred_dargah_fatiha_niyah:
          profileData.preferred_dargah_fatiha_niyah || "",
        preferred_sect: profileData.preferred_sect || "",
        desired_practicing_level: profileData.desired_practicing_level || "",
        preferred_city_state: profileData.preferred_city_state || "",
        preferred_family_type: profileData.preferred_family_type || "",
        preferred_family_background:
          profileData.preferred_family_background || "",
        preferred_education: profileData.preferred_education || "",
        preferred_occupation_profession:
          profileData.preferred_occupation_profession || "",
        profile_visible: profileData.profile_visible || "",
        photo_upload_privacy_option:
          profileData.photo_upload_privacy_option || "",
        hieght: profileData.hieght || "",
        weight: profileData.weight || "",
        step_father: profileData.step_father || "",
        step_mother: profileData.step_mother || "",
        type_of_disability: profileData.type_of_disability || "",
        describe_job_business: profileData.describe_job_business || "",
        preferred_state: profileData.preferred_state || "",
        preferred_city: profileData.preferred_city || "",
        preferred_country: profileData.preferred_country || "",
        preferred_country: profileData.preferred_country || "",
        profile_completed: true,
        skin_tone: profileData.skin_tone || "",
        body_type: profileData.body_type || "",
        financial_status: profileData.financial_status || "",
        father_alive: profileData.father_alive || "",
        mother_alive: profileData.mother_alive || "",
        perform_namaz: profileData.perform_namaz || "",
        recite_quran: profileData.recite_quran || "",
        marriage_plan: profileData.marriage_plan || "",
        smoking_cigarette_sheesha: profileData.smoking_cigarette_sheesha || "",
        drinking_alcohol_wine: profileData.drinking_alcohol_wine || "",
      },
      navigate: navigate,
      navUrl: `/newdashboard`,
      setErrors: setErrors,
    };
    console.log(parameters.payload.profile_completed, "profile_completed");

    updateDataV2(parameters);
    handleSave();
    localStorage.setItem("member_id", "");
  };

  const updateField = (field, value) => {
    setProfileData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const skip = () => {
    navigate(`/memstep-payment/${userId}`);
  };

  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);

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
    formData.append("upload_photo", image);
    formData.append("user_id", userId);
    let updateurl = `/api/user/profile_photo/${
      imagedata?.[imagedata.length - 1]?.id
    }/`;
    const parameter = {
      url: `${
        profileData.upload_photo ? updateurl : "/api/user/profile_photo/"
      }`,
      setUserId: setImagedateset,
      formData: formData,
      setErrors: setError,
      setLoading: setLoading,
    };
    console.log("profileData.profile_photo", profileData.profile_photo);

    if (profileData.upload_photo) {
      ReturnPutResponseFormdataWithoutToken(parameter);
    } else {
      ReturnResponseFormdataWithoutToken(parameter);
    }
    setError("");
    console.log("Image saved:", image);
    alert("Image saved successfully!");
  };

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const togglePersonalInfoAccordion = () => {
    setIsPersonalInfoAccordionOpen(!isPersonalInfoAccordionOpen);
  };

  const toggleFamilyInfoAccordion = () => {
    setIsFamilyInfoAccordionOpen(!isFamilyInfoAccordionOpen);
  };

  const togglePartnerExpectationAccordion = () => {
    setIsPartnerExpectationAccordionOpen(!isPartnerExpectationAccordionOpen);
  };

  const togglePrivacyAccordion = () => {
    setIsPrivacyAccordionOpen(!isPrivacyAccordionOpen);
  };

  const toggleAdditionalInfo = () => {
    setIsAdditionalInfoOpen(!isAdditionalInfoOpen);
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
              borderRadius: "1vh",
              cursor: "pointer",
            }}
          >
            <div>
              <svg
                width="27"
                height="27"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.77348 1.90259C9.14789 1.69179 9.57031 1.58105 9.99998 1.58105C10.4296 1.58105 10.8521 1.69179 11.2265 1.90259C11.6009 2.11338 11.9146 2.41712 12.1375 2.78448L12.1399 2.78844L19.1982 14.5718L19.205 14.5833C19.4233 14.9613 19.5388 15.3899 19.54 15.8264C19.5412 16.263 19.4281 16.6922 19.2119 17.0714C18.9958 17.4507 18.6841 17.7667 18.3078 17.9881C17.9316 18.2095 17.504 18.3285 17.0675 18.3333L17.0583 18.3334L2.93248 18.3333C2.49598 18.3285 2.06834 18.2095 1.69212 17.9881C1.31589 17.7667 1.00419 17.4507 0.788018 17.0714C0.571848 16.6922 0.458748 16.263 0.459971 15.8264C0.461193 15.3899 0.576695 14.9613 0.794985 14.5833L0.801754 14.5718L7.86247 2.78448C8.0853 2.41711 8.39908 2.11338 8.77348 1.90259ZM9.99998 3.24772C9.85675 3.24772 9.71595 3.28463 9.59115 3.3549C9.46691 3.42485 9.3627 3.52549 9.28849 3.64721L2.23555 15.4215C2.16457 15.5464 2.12703 15.6874 2.12663 15.8311C2.12622 15.9766 2.16392 16.1197 2.23598 16.2461C2.30804 16.3725 2.41194 16.4779 2.53735 16.5517C2.66166 16.6248 2.80281 16.6644 2.94697 16.6667H17.053C17.1971 16.6644 17.3383 16.6248 17.4626 16.5517C17.588 16.4779 17.6919 16.3725 17.764 16.2461C17.836 16.1197 17.8737 15.9766 17.8733 15.8311C17.8729 15.6875 17.8354 15.5464 17.7644 15.4216L10.7125 3.64886C10.7121 3.64831 10.7118 3.64776 10.7115 3.64721C10.6373 3.52549 10.533 3.42485 10.4088 3.3549C10.284 3.28463 10.1432 3.24772 9.99998 3.24772Z"
                  fill="white"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.0001 6.6665C10.4603 6.6665 10.8334 7.0396 10.8334 7.49984V10.8332C10.8334 11.2934 10.4603 11.6665 10.0001 11.6665C9.53984 11.6665 9.16675 11.2934 9.16675 10.8332V7.49984C9.16675 7.0396 9.53984 6.6665 10.0001 6.6665Z"
                  fill="white"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M9.16675 14.1668C9.16675 13.7066 9.53984 13.3335 10.0001 13.3335H10.0084C10.4687 13.3335 10.8417 13.7066 10.8417 14.1668C10.8417 14.6271 10.4687 15.0002 10.0084 15.0002H10.0001C9.53984 15.0002 9.16675 14.6271 9.16675 14.1668Z"
                  fill="white"
                />
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
              <svg
                width="27"
                height="27"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M15.5893 4.41058C15.9148 4.73602 15.9148 5.26366 15.5893 5.58909L5.58934 15.5891C5.2639 15.9145 4.73626 15.9145 4.41083 15.5891C4.08539 15.2637 4.08539 14.736 4.41083 14.4106L14.4108 4.41058C14.7363 4.08514 15.2639 4.08514 15.5893 4.41058Z"
                  fill="white"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M4.41083 4.41058C4.73626 4.08514 5.2639 4.08514 5.58934 4.41058L15.5893 14.4106C15.9148 14.736 15.9148 15.2637 15.5893 15.5891C15.2639 15.9145 14.7363 15.9145 14.4108 15.5891L4.41083 5.58909C4.08539 5.26366 4.08539 4.73602 4.41083 4.41058Z"
                  fill="white"
                />
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
            <StepTracker percentage={100} />
          </div>

          <div style={{ width: "86.1%", marginLeft: "19.5%", height: "auto" }}>
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
                Review & Confirm – Final Check
              </h4>
              <p
                style={{
                  fontSize: "small",
                  color: "gray",
                  marginBottom: "1vh",
                  padding: "0",
                }}
              >
                You're almost there! Please take a moment to review all the
                details you've provided. This is your chance to ensure
                everything is accurate and as per your preference before
                proceeding. If any information needs to be updated, feel free to
                go back and make the necessary changes. Once you're confident
                that everything is correct, confirm your profile to move forward
                in your journey to finding the right partner.
              </p>
              <div
                style={{
                  height: "0.7px",
                  width: "100%",
                  backgroundColor: "#ccc",
                  margin: "2vh",
                }}
              ></div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  margin: "0.5rem auto",
                  justifyContent: "start",
                  gap: "3rem",
                  padding: "0",
                }}
              >
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      border: "1.7px solid #ED58AC",
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={togglePersonalInfoAccordion}
                    >
                      <h4
                        className="col-span-3 mb-4"
                        style={{ fontWeight: "bold" }}
                      >
                        Personal Information
                      </h4>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          transform: isPersonalInfoAccordionOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        <path
                          d="M19 9L12 16L5 9"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    {isPersonalInfoAccordionOpen && (
                      <form className="flex flex-col gap-[20px]">
                        <div style={{ display: "flex", gap: "2rem" }}>
                          {/* First Name */}
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="firstName"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              First Name <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              required
                              value={profileData.first_name || ""}
                              className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[gray] focus:border-[gray]"
                              onChange={(e) =>
                                updateField("first_name", e.target.value)
                              }
                            />
                          </div>

                          {/* Last Name */}
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="lastName"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Last Name <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              required
                              value={profileData.last_name || ""}
                              className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[gray] focus:border-[gray]"
                              onChange={(e) =>
                                updateField("last_name", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "2rem" }}>
                          {/* Date of Birth */}
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="dob"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Date of Birth{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="date"
                              id="dob"
                              name="dob"
                              required
                              value={profileData.dob || ""}
                              className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[gray] focus:border-[gray]"
                              onChange={(e) =>
                                updateField("dob", e.target.value)
                              }
                            />
                          </div>
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label className="block text-sm font-medium text-[#000000] mb-0">
                              Gender <span style={{ color: "red" }}>*</span>
                            </label>
                            <select
                              id="gender"
                              name="gender"
                              value={profileData.gender || ""}
                              className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[gray] focus:border-[gray]"
                              onChange={(e) =>
                                updateField("gender", e.target.value)
                              }
                            >
                              <option value="">Select Gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "2rem" }}>
                          <div style={{ display: "block", width: "50%" }}>
                            <div>
                              <label
                                htmlFor="profession"
                                className="block text-sm font-medium text-[#000000] mb-0"
                              >
                                Profession
                              </label>
                              <select
                                id="profession"
                                name="profession"
                                value={profileData.profession || ""}
                                className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[gray] focus:border-[gray]"
                                onChange={(e) =>
                                  updateField("profession", e.target.value)
                                }
                              >
                                <option value="">Select Profession</option>
                                <option value="engineer">Engineer</option>
                                <option value="doctor">Doctor</option>
                                <option value="teacher">Teacher</option>
                                <option value="lawyer">Lawyer</option>
                                <option value="artist">Artist</option>
                              </select>
                            </div>

                            <div style={{ display: "flex", gap: "2rem" }}>
                              {/* First Name */}
                              <div className="w-[50%] flex flex-col gap-[10px]">
                                <label
                                  htmlFor="maritalStatus"
                                  className="block text-sm font-medium text-[#000000] mb-0"
                                >
                                  Marital Status{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </label>
                                <select
                                  id="maritalStatus"
                                  name="maritalStatus"
                                  required
                                  value={profileData.martial_status || ""}
                                  onChange={(e) =>
                                    updateField(
                                      "martial_status",
                                      e.target.value
                                    )
                                  }
                                  className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[gray] focus:border-[gray]"
                                >
                                  <option value="">Select Status</option>
                                  <option value="Unmarried">Unmarried</option>
                                  <option value="Married">Married</option>
                                  <option value="Divorced">Divorced</option>
                                  <option value="Khula">Khula</option>
                                  <option value="Widowed">Widow</option>
                                </select>
                              </div>

                              <div className="w-[50%] flex flex-col gap-[10px]">
                                <label
                                  htmlFor="lastName"
                                  className="block text-sm font-medium text-[#000000] mb-0"
                                >
                                  Education
                                </label>
                                <select
                                  id="education"
                                  name="education"
                                  value={profileData.Education || ""}
                                  className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[gray] focus:border-[gray]"
                                  onChange={(e) =>
                                    updateField("Education", e.target.value)
                                  }
                                >
                                  <option value="">Select Education</option>
                                  <option value="primary">
                                    Primary Education
                                  </option>
                                  <option value="secondary">
                                    Secondary Education
                                  </option>
                                  <option value="highschool">
                                    High School
                                  </option>
                                  <option value="undergraduate">
                                    Undergraduate
                                  </option>
                                  <option value="postgraduate">
                                    Postgraduate
                                  </option>
                                  <option value="doctorate">Doctorate</option>
                                </select>
                              </div>
                            </div>

                            
                          </div>
                          {/* Personal Values / About You */}
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="personalValues"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Please describe your job/business
                            </label>
                            <textarea
                              id="personalValues"
                              name="personalValues"
                              value={profileData.describe_job_business || ""}
                              className="h-[100px] py-[8px] px-[12px] resize-none text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[gray] focus:border-[gray]"
                              onChange={(e) =>
                                updateField(
                                  "describe_job_business",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>

                       <div style={{ display: "flex", gap: "2rem" }}>
                              <div className="w-[50%] flex flex-col gap-[10px]">
                                <label
                                  htmlFor="maritalStatus"
                                  className="block text-sm font-medium text-[#000000] mb-0"
                                >
                                  Current Address{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </label>
                                <div
                                  style={{
                                    display: "flex",
                                    width: "100%",
                                    gap: "1%",
                                  }}
                                >
                                  <div className="w-1/2">
                                    <select
                                      id="city"
                                      name="city"
                                      required
                                      value={profileData.city || ""}
                                      className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[gray] focus:border-[gray]"
                                      onChange={(e) =>
                                        updateField("city", e.target.value)
                                      }
                                    >
                                      <option value="">City</option>
                                      <option value="mumbai">Mumbai</option>
                                      <option value="delhi">Delhi</option>
                                      <option value="bangalore">
                                        Bangalore
                                      </option>
                                      <option value="hyderabad">
                                        Hyderabad
                                      </option>
                                      <option value="chennai">Chennai</option>
                                      <option value="kolkata">Kolkata</option>
                                      <option value="pune">Pune</option>
                                      <option value="ahmedabad">
                                        Ahmedabad
                                      </option>
                                      <option value="jaipur">Jaipur</option>
                                      <option value="lucknow">Lucknow</option>
                                    </select>
                                  </div>

                                  <div className="w-1/2">
                                    <select
                                      id="state"
                                      name="state"
                                      required
                                      value={profileData.state || ""}
                                      className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[gray] focus:border-[gray]"
                                      onChange={(e) =>
                                        updateField("state", e.target.value)
                                      }
                                    >
                                      <option value="">State</option>
                                      <option value="andhra_pradesh">
                                        Andhra Pradesh
                                      </option>
                                      <option value="arunachal_pradesh">
                                        Arunachal Pradesh
                                      </option>
                                      <option value="assam">Assam</option>
                                      <option value="bihar">Bihar</option>
                                      <option value="chhattisgarh">
                                        Chhattisgarh
                                      </option>
                                      <option value="goa">Goa</option>
                                      <option value="gujarat">Gujarat</option>
                                      <option value="haryana">Haryana</option>
                                      <option value="himachal_pradesh">
                                        Himachal Pradesh
                                      </option>
                                      <option value="jharkhand">
                                        Jharkhand
                                      </option>
                                      <option value="karnataka">
                                        Karnataka
                                      </option>
                                      <option value="kerala">Kerala</option>
                                      <option value="madhya_pradesh">
                                        Madhya Pradesh
                                      </option>
                                      <option value="maharashtra">
                                        Maharashtra
                                      </option>
                                      <option value="manipur">Manipur</option>
                                      <option value="meghalaya">
                                        Meghalaya
                                      </option>
                                      <option value="mizoram">Mizoram</option>
                                      <option value="nagaland">Nagaland</option>
                                      <option value="odisha">Odisha</option>
                                      <option value="punjab">Punjab</option>
                                      <option value="rajasthan">
                                        Rajasthan
                                      </option>
                                      <option value="sikkim">Sikkim</option>
                                      <option value="tamil_nadu">
                                        Tamil Nadu
                                      </option>
                                      <option value="telangana">
                                        Telangana
                                      </option>
                                      <option value="tripura">Tripura</option>
                                      <option value="uttar_pradesh">
                                        Uttar Pradesh
                                      </option>
                                      <option value="uttarakhand">
                                        Uttarakhand
                                      </option>
                                      <option value="west_bengal">
                                        West Bengal
                                      </option>
                                    </select>
                                  </div>

                                  <div className="w-1/2">
                                    <select
                                      id="country"
                                      name="country"
                                      required
                                      value={profileData.country || ""}
                                      className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[gray] focus:border-[gray]"
                                      onChange={(e) =>
                                        updateField("country", e.target.value)
                                      }
                                    >
                                      <option value="">Country</option>
                                      <option value="india">India</option>
                                      <option value="usa">United States</option>
                                      <option value="canada">Canada</option>
                                      <option value="australia">
                                        Australia
                                      </option>
                                      <option value="uk">United Kingdom</option>
                                      <option value="china">China</option>
                                      <option value="japan">Japan</option>
                                      <option value="germany">Germany</option>
                                      <option value="france">France</option>
                                      <option value="italy">Italy</option>
                                      <option value="brazil">Brazil</option>
                                      <option value="south_africa">
                                        South Africa
                                      </option>
                                      <option value="russia">Russia</option>
                                      <option value="mexico">Mexico</option>
                                      <option value="new_zealand">
                                        New Zealand
                                      </option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              <div className="w-[50%] flex flex-col gap-[10px]">
                                <label
                                  htmlFor="maritalStatus"
                                  className="block text-sm font-medium text-[#000000] mb-0"
                                >
                                  Native Place{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </label>
                                <div
                                  style={{
                                    display: "flex",
                                    width: "100%",
                                    gap: "1%",
                                  }}
                                >
                                  <div className="w-1/2">
                                    <select
                                      id="nativeCity"
                                      name="nativeCity"
                                      required
                                      value={profileData.native_city || ""}
                                      className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[gray] focus:border-[gray]"
                                      onChange={(e) =>
                                        updateField(
                                          "native_city",
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">City</option>
                                      <option value="mumbai">Mumbai</option>
                                      <option value="delhi">Delhi</option>
                                      <option value="bangalore">
                                        Bangalore
                                      </option>
                                      <option value="hyderabad">
                                        Hyderabad
                                      </option>
                                      <option value="chennai">Chennai</option>
                                      <option value="kolkata">Kolkata</option>
                                      <option value="pune">Pune</option>
                                      <option value="ahmedabad">
                                        Ahmedabad
                                      </option>
                                      <option value="jaipur">Jaipur</option>
                                      <option value="lucknow">Lucknow</option>
                                    </select>
                                  </div>

                                  <div className="w-1/2">
                                    <select
                                      id="nativeState"
                                      name="nativeState"
                                      required
                                      value={profileData.native_state || ""}
                                      className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[gray] focus:border-[gray]"
                                      onChange={(e) =>
                                        updateField(
                                          "native_state",
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">State</option>
                                      <option value="andhra_pradesh">
                                        Andhra Pradesh
                                      </option>
                                      <option value="arunachal_pradesh">
                                        Arunachal Pradesh
                                      </option>
                                      <option value="assam">Assam</option>
                                      <option value="bihar">Bihar</option>
                                      <option value="chhattisgarh">
                                        Chhattisgarh
                                      </option>
                                      <option value="goa">Goa</option>
                                      <option value="gujarat">Gujarat</option>
                                      <option value="haryana">Haryana</option>
                                      <option value="himachal_pradesh">
                                        Himachal Pradesh
                                      </option>
                                      <option value="jharkhand">
                                        Jharkhand
                                      </option>
                                      <option value="karnataka">
                                        Karnataka
                                      </option>
                                      <option value="kerala">Kerala</option>
                                      <option value="madhya_pradesh">
                                        Madhya Pradesh
                                      </option>
                                      <option value="maharashtra">
                                        Maharashtra
                                      </option>
                                      <option value="manipur">Manipur</option>
                                      <option value="meghalaya">
                                        Meghalaya
                                      </option>
                                      <option value="mizoram">Mizoram</option>
                                      <option value="nagaland">Nagaland</option>
                                      <option value="odisha">Odisha</option>
                                      <option value="punjab">Punjab</option>
                                      <option value="rajasthan">
                                        Rajasthan
                                      </option>
                                      <option value="sikkim">Sikkim</option>
                                      <option value="tamil_nadu">
                                        Tamil Nadu
                                      </option>
                                      <option value="telangana">
                                        Telangana
                                      </option>
                                      <option value="tripura">Tripura</option>
                                      <option value="uttar_pradesh">
                                        Uttar Pradesh
                                      </option>
                                      <option value="uttarakhand">
                                        Uttarakhand
                                      </option>
                                      <option value="west_bengal">
                                        West Bengal
                                      </option>
                                    </select>
                                  </div>

                                  <div className="w-1/2">
                                    <select
                                      id="nativeCountry"
                                      name="nativeCountry"
                                      required
                                      value={profileData.native_country || ""}
                                      className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[gray] focus:border-[gray]"
                                      onChange={(e) =>
                                        updateField(
                                          "native_country",
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">Country</option>
                                      <option value="india">India</option>
                                      <option value="usa">United States</option>
                                      <option value="canada">Canada</option>
                                      <option value="australia">
                                        Australia
                                      </option>
                                      <option value="uk">United Kingdom</option>
                                      <option value="china">China</option>
                                      <option value="japan">Japan</option>
                                      <option value="germany">Germany</option>
                                      <option value="france">France</option>
                                      <option value="italy">Italy</option>
                                      <option value="brazil">Brazil</option>
                                      <option value="south_africa">
                                        South Africa
                                      </option>
                                      <option value="russia">Russia</option>
                                      <option value="mexico">Mexico</option>
                                      <option value="new_zealand">
                                        New Zealand
                                      </option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                              {/* Last Name */}
                            </div>

                        <div style={{ display: "flex", gap: "2rem" }}>
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="disability"
                              className=" block text-sm font-medium text-[#000000] mb-0"
                            >
                              Disability (if any?)
                            </label>
                            <select
                              id="disability"
                              name="disability"
                              value={profileData.disability || ""}
                              className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[gray] focus:border-[gray]"
                              onChange={(e) =>
                                updateField("disability", e.target.value)
                              }
                            >
                              <option value="">Select Disability Status</option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </select>
                          </div>

                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="personalValues"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              What type of disability?
                            </label>
                            <textarea
                              id="personalValues"
                              name="personalValues"
                              value={profileData.type_of_disability || ""}
                              className="h-[100px] py-[8px] px-[12px] resize-none text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[gray] focus:border-[gray]"
                              onChange={(e) =>
                                updateField(
                                  "type_of_disability",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "2rem" }}>
                          {/* Cultural Background */}
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="income"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Income Range
                            </label>
                            <select
                              id="income"
                              name="income"
                              value={profileData.income || ""}
                              className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[gray] focus:border-[gray]"
                              onChange={(e) =>
                                updateField("income", e.target.value)
                              }
                            >
                              <option value="">Select Income Range</option>
                              <option value="below_10k">Below 10,000</option>
                              <option value="10k_to_50k">
                                10,000 - 50,000
                              </option>
                              <option value="50k_to_1lac">
                                50,000 - 1,00,000
                              </option>
                              <option value="above_1lac">Above 1,00,000</option>
                            </select>
                          </div>

                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="about_you"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Personal Values/About You
                            </label>
                            <textarea
                              id="about_you"
                              name="about_you"
                              value={profileData.about_you || ""}
                              className="h-[100px] py-[8px] px-[12px] resize-none text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[gray] focus:border-[gray]"
                              onChange={(e) =>
                                updateField("about_you", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "2rem" }}>
                          {/* Height */}
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="height"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Height
                            </label>
                            <input
                              type="text"
                              id="height"
                              name="height"
                              required
                              value={profileData?.hieght || ""}
                              className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[gray] focus:border-[gray]"
                              onChange={(e) =>
                                updateField("hieght", e.target.value)
                              }
                            />
                          </div>

                          {/* Weight */}
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="weight"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Weight
                            </label>
                            <input
                              type="text"
                              id="weight"
                              name="weight"
                              required
                              value={profileData?.weight || ""}
                              className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[gray] focus:border-[gray]"
                              onChange={(e) =>
                                updateField("weight", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  margin: "0.5rem auto",
                  justifyContent: "start",
                  gap: "3rem",
                  padding: " 0",
                }}
              >
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      border: "1.7px solid #ED58AC",
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={toggleAccordion}
                    >
                      <h4
                        className="col-span-3 mb-4"
                        style={{ fontWeight: "bold" }}
                      >
                        Religious Information
                      </h4>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          transform: isAccordionOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        <path
                          d="M19 9L12 16L5 9"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    {isAccordionOpen && (
                      <form className="flex flex-col gap-[20px]">
                        <div style={{ display: "flex", gap: "2rem" }}>
                          {/* First Name */}
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="firstName"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Sect / School of Thought{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <select
                              id="sect"
                              name="sect"
                              value={profileData.sect_school_info}
                              required
                              className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                              onChange={(e) =>
                                updateField("sect_school_info", e.target.value)
                              }
                            >
                              <option value="">Select Sect</option>
                              <option value="Sunni">Sunni</option>
                              <option value="Shia">Shia</option>
                              <option value="Others">Others</option>
                            </select>
                          </div>

                          {/* Last Name */}
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="lastName"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Islam Practicing Level
                            </label>
                            <input
                              type="text"
                              id="islamPracticingLevel"
                              name="islamPracticingLevel"
                              value={profileData.islamic_practicing_level}
                              className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                              onChange={(e) =>
                                updateField(
                                  "islamic_practicing_level",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "2rem" }}>
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label className="block text-sm font-medium text-[#000000] mb-0">
                              Believe in Dargah/Fatiha/Niyah?{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <div className="flex space-x-4">
                              <div className="flex items-center ">
                                <input
                                  type="radio"
                                  id="believeYes"
                                  name="believeInDargah"
                                  value="Yes"
                                  checked={
                                    profileData.believe_in_dargah_fatiha_niyah ===
                                    "Yes"
                                  }
                                  required
                                  className="h-4 w-4 text-[#000000] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                  onChange={(e) =>
                                    updateField(
                                      "believe_in_dargah_fatiha_niyah",
                                      e.target.value
                                    )
                                  }
                                />
                                <label
                                  htmlFor="male"
                                  className="ml-2 text-sm text-[#6d6e6f] font-medium"
                                >
                                  Yes
                                </label>
                              </div>
                              <div className="flex items-center ">
                                <input
                                  type="radio"
                                  id="believeNo"
                                  name="believeInDargah"
                                  value="No"
                                  checked={
                                    profileData.believe_in_dargah_fatiha_niyah ===
                                    "No"
                                  }
                                  required
                                  className="h-4 w-4 text-[#000000] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                  onChange={(e) =>
                                    updateField(
                                      "believe_in_dargah_fatiha_niyah",
                                      e.target.value
                                    )
                                  }
                                />
                                <label
                                  htmlFor="male"
                                  className="ml-2 text-sm text-[#6d6e6f] font-medium"
                                >
                                  No
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label className="block text-sm font-medium text-[#000000] mb-0">
                              Hijab/Niqab Preference?{" "}
                              <span style={{ color: "#ED58AC" }}>*</span>
                            </label>
                            <div className="mt-1 flex space-x-4">
                              {/* Yes Option */}
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id="hijabNiqabYes"
                                  name="hijab_niqab_prefer"
                                  value="Yes"
                                  required
                                  className="h-4 w-4 text-[#000000] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                  onChange={(e) =>
                                    updateField(
                                      "hijab_niqab_prefer",
                                      e.target.value
                                    )
                                  }
                                />
                                <label
                                  htmlFor="hijabNiqabYes"
                                  className="ml-2 text-sm text-[#6d6e6f] font-medium"
                                >
                                  Yes
                                </label>
                              </div>
                              {/* No Option */}
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id="hijabNiqabNo"
                                  name="hijab_niqab_prefer"
                                  value="No"
                                  required
                                  className="h-4 w-4 text-[#000000] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                  onChange={(e) =>
                                    updateField(
                                      "hijab_niqab_prefer",
                                      e.target.value
                                    )
                                  }
                                />
                                <label
                                  htmlFor="hijabNiqabNo"
                                  className="ml-2 text-sm text-[#6d6e6f] font-medium"
                                >
                                  No
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  margin: "0.5rem auto",
                  justifyContent: "start",
                  gap: "3rem",
                  padding: "0",
                }}
              >
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      border: "1.7px solid #ED58AC",
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={toggleFamilyInfoAccordion}
                    >
                      <h4
                        className="col-span-3 mb-4"
                        style={{ fontWeight: "bold" }}
                      >
                        Family Information
                      </h4>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          transform: isFamilyInfoAccordionOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        <path
                          d="M19 9L12 16L5 9"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    {isFamilyInfoAccordionOpen && (
                      <form className="flex flex-col gap-[20px]">
                        <div style={{ display: "flex", gap: "2rem" }}>
                          {/* Father’s Name */}
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="fatherName"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Father’s Name{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              id="fatherName"
                              name="fatherName"
                              value={profileData.father_name}
                              required
                              placeholder="Enter full name"
                              className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                              onChange={(e) =>
                                updateField("father_name", e.target.value)
                              }
                            />
                          </div>

                          {/* Father’s Occupation */}
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="fatherOccupation"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Father’s Occupation
                            </label>
                            <input
                              type="text"
                              id="fatherOccupation"
                              name="fatherOccupation"
                              placeholder="Enter occupation"
                              value={profileData.father_occupation}
                              className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                              onChange={(e) =>
                                updateField("father_occupation", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "2rem" }}>
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="dob"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Mother’s Name{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <input
                              type="text"
                              id="motherName"
                              name="motherName"
                              value={profileData.mother_name}
                              required
                              placeholder="Enter full name"
                              className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                              onChange={(e) =>
                                updateField("mother_name", e.target.value)
                              }
                            />
                          </div>
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="dob"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Mother’s Occupation
                            </label>
                            <input
                              type="text"
                              id="motherOccupation"
                              name="motherOccupation"
                              value={profileData.mother_occupation}
                              placeholder="Enter occupation"
                              className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                              onChange={(e) =>
                                updateField("mother_occupation", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        {profileData.wali_name && (
                          <div style={{ display: "flex", gap: "2rem" }}>
                            <div className="w-[50%] flex flex-col gap-[10px]">
                              <label
                                htmlFor="dob"
                                className="block text-sm font-medium text-[#000000] mb-0"
                              >
                                Wali’s Name{" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="text"
                                id="motherName"
                                name="motherName"
                                required
                                placeholder="Enter name"
                                className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                onChange={(e) =>
                                  updateField("mother_name", e.target.value)
                                }
                              />
                            </div>
                            <div className="w-[50%] flex flex-col gap-[10px]">
                              <label
                                htmlFor="dob"
                                className="block text-sm font-medium text-[#000000] mb-0"
                              >
                                Wali’s Phone Number{" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="number"
                                id="motherOccupation"
                                name="motherOccupation"
                                placeholder="Enter Phone Number"
                                className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                onChange={(e) =>
                                  updateField(
                                    "mother_occupation",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="w-[50%] flex flex-col gap-[10px]">
                              <label
                                htmlFor="maritalStatus"
                                className="block text-sm font-medium text-[#000000] mb-0"
                              >
                                Wali’s Blood Relaton{" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <select
                                id="numSiblings"
                                name="numSiblings"
                                required
                                className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                onChange={(e) =>
                                  updateField(
                                    "number_of_siblings",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Select Number</option>
                                <option value="0">Yes</option>
                                <option value="0">No</option>
                              </select>
                            </div>
                          </div>
                        )}

                        <div
                          style={{
                            display: "flex",
                            gap: "2rem",
                            alignItems: "center",
                          }}
                        >
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="maritalStatus"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Number of Siblings{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <select
                              id="numSiblings"
                              name="numSiblings"
                              value={profileData.number_of_siblings}
                              required
                              className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                              onChange={(e) =>
                                updateField(
                                  "number_of_siblings",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select Number</option>
                              <option value="0">0</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4+">4+</option>
                            </select>
                          </div>
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="maritalStatus"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Family Type{" "}
                              <span style={{ color: "#ED58AC" }}>*</span>
                            </label>
                            <select
                              id="familyType"
                              name="familyType"
                              value={profileData.family_type}
                              required
                              className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                              onChange={(e) =>
                                updateField("family_type", e.target.value)
                              }
                            >
                              <option value="">Select Family Type</option>
                              <option value="Nuclear">Nuclear</option>
                              <option value="Joint">Joint</option>
                              <option value="Extended">Extended</option>
                            </select>
                          </div>
                          
                        </div>

                        {profileData.number_of_siblings > 0 && (
                          <div
                            style={{
                              display: "flex",
                              gap: "2rem",
                              alignItems: "center",
                            }}
                          >
                            <div className="w-[50%] flex flex-col gap-[10px]">
                              <label
                                htmlFor="maritalStatus"
                                className="block text-sm font-medium text-[#000000] mb-0"
                              >
                                Number of Brothers{" "}
                                <span style={{ color: "#ED58AC" }}>*</span>
                              </label>
                              <select
                                id="familyType"
                                name="familyType"
                                value={profileData.number_of_brothers}
                                required
                                className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                onChange={(e) =>
                                  updateField(
                                    "number_of_brothers",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Select Number</option>
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4+">4+</option>
                              </select>
                            </div>
                            <div className="w-[50%] flex flex-col gap-[10px]">
                              <label
                                htmlFor="maritalStatus"
                                className="block text-sm font-medium text-[#000000] mb-0"
                              >
                                Number of Sisters{" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <select
                                id="numSiblings"
                                name="numSiblings"
                                value={profileData.number_of_sisters}
                                required
                                className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                onChange={(e) =>
                                  updateField(
                                    "number_of_sisters",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Select Number</option>
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4+">4+</option>
                              </select>
                            </div>
                          </div>
                        )}

                        <div
                          style={{
                            display: "flex",
                            gap: "2rem",
                            alignItems: "center",
                          }}
                        >
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="maritalStatus"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Family Practicing Level{" "}
                              <span style={{ color: "#ED58AC" }}>*</span>
                            </label>
                            <select
                              id="familyPracticingLevel"
                              name="familyPracticingLevel"
                              value={profileData.family_practicing_level}
                              required
                              className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                              onChange={(e) =>
                                updateField(
                                  "family_practicing_level",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select Practicing Level</option>
                              <option value="High">High</option>
                              <option value="Moderate">Moderate</option>
                              <option value="Low">Low</option>
                            </select>
                          </div>

                          <div className="w-[50%] flex flex-col gap-[10px]">
                            {(profileData.martial_status === "Divorced" ||
                              profileData.martial_status === "Widowed") && (
                              <>
                                <label
                                  htmlFor="numChildren"
                                  className="block text-sm font-medium text-[#000000] mb-0"
                                >
                                  Number of Children{" "}
                                  <span style={{ color: "#ED58AC" }}>*</span>
                                </label>
                                <select
                                  id="numChildren"
                                  name="numChildren"
                                  className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                  value={profileData.number_of_children}
                                  onChange={(e) =>
                                    updateField(
                                      "number_of_children",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">Select Number</option>
                                  <option value="0">0</option>
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                  <option value="4+">4+</option>
                                </select>
                              </>
                            )}
                          </div>
                        </div>

                        {profileData.number_of_children > 0 && (
                          <div style={{ display: "flex", gap: "2rem" }}>
                            <div className="w-[50%] flex flex-col gap-[10px]">
                              <label
                                htmlFor="lastName"
                                className="block text-sm font-medium text-[#000000] mb-0"
                              >
                                Number of Sons{" "}
                                <span style={{ color: "#ED58AC" }}>*</span>
                              </label>
                              <select
                                id="numSons"
                                name="numSons"
                                className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                value={profileData.number_of_son}
                                onChange={(e) =>
                                  updateField("number_of_son", e.target.value)
                                }
                              >
                                <option value="">Select Number</option>
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4+">4+</option>
                              </select>
                            </div>
                            <div className="w-[50%] flex flex-col gap-[10px]">
                              <label
                                htmlFor="maritalStatus"
                                className="block text-sm font-medium text-[#000000] mb-0"
                              >
                                Number of Daughters{" "}
                                <span style={{ color: "#ED58AC" }}>*</span>
                              </label>
                              <select
                                id="numDaughters"
                                name="numDaughters"
                                value={profileData.number_of_daughter}
                                className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                onChange={(e) =>
                                  updateField(
                                    "number_of_daughter",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Select Number</option>
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4+">4+</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {profileData.gender === "female" && (
                          <>
                            <h4
                              className="col-span-3 mb-4"
                              style={{ fontWeight: "bold" }}
                            >
                              Wali Information
                            </h4>
                            <div style={{ display: "flex", gap: "2rem" }}>
                              <div className="w-[50%] flex flex-col gap-[10px]">
                                <label
                                  htmlFor="waliName"
                                  className="block text-sm font-medium text-[#000000] mb-0"
                                >
                                  Wali Name{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                  type="text"
                                  id="waliName"
                                  name="waliName"
                                  placeholder="Enter full name"
                                  required
                                  className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                  onChange={(e) =>
                                    updateField("wali_name", e.target.value)
                                  }
                                />
                              </div>

                              <div className="w-[50%] flex flex-col gap-[10px]">
                                <label
                                  htmlFor="waliPhone"
                                  className="block text-sm font-medium text-[#000000] mb-0"
                                >
                                  Wali Phone Number{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                  type="tel"
                                  id="waliPhone"
                                  name="waliPhone"
                                  placeholder="Enter phone number"
                                  required
                                  className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                  onChange={(e) =>
                                    updateField(
                                      "wali_contact_number",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: "2rem" }}>
                              <div className="w-[50%] flex flex-col gap-[10px]">
                                <label
                                  htmlFor="maritalStatus"
                                  className="block text-sm font-medium text-[#000000] mb-0"
                                >
                                  Blood Relation{" "}
                                  <span style={{ color: "red" }}>*</span>
                                </label>
                                <select
                                  id="waliRelation"
                                  name="waliRelation"
                                  required
                                  className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                  onChange={(e) =>
                                    updateField(
                                      "wali_blood_relation",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">Select Relation</option>
                                  <option value="Father">Father</option>
                                  <option value="Brother">Brother</option>
                                  <option value="Uncle">Uncle</option>
                                </select>
                              </div>

                              <div className="w-[50%]"></div>
                            </div>
                          </>
                        )}
                      </form>
                    )}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  margin: "0.5rem auto",
                  justifyContent: "start",
                  gap: "3rem",
                  padding: "0",
                }}
              >
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      border: "1.7px solid #ED58AC",
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={togglePartnerExpectationAccordion}
                    >
                      <h4
                        className="col-span-3 mb-4"
                        style={{ fontWeight: "bold" }}
                      >
                        Partner Expectation
                      </h4>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          transform: isPartnerExpectationAccordionOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        <path
                          d="M19 9L12 16L5 9"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    {isPartnerExpectationAccordionOpen && (
                      <form className="flex flex-col gap-[20px]">
                        <div style={{ display: "flex", gap: "2rem" }}>
                          {/* Preferred Surname */}
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="preferredSurname"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Preferred Surname
                            </label>
                            <input
                              type="text"
                              id="preferredSurname"
                              name="preferredSurname"
                              value={profileData.preferred_surname || ""}
                              className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                              placeholder="Enter surname"
                              onChange={(e) =>
                                updateField("preferred_surname", e.target.value)
                              }
                            />
                          </div>

                          {/* Preferred Sect */}
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="preferredSect"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Preferred Sect{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <select
                              id="preferredSect"
                              name="preferredSect"
                              value={profileData.preferred_sect || ""}
                              required
                              className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                              onChange={(e) =>
                                updateField("preferred_sect", e.target.value)
                              }
                            >
                              <option value="">Select Sect</option>
                              <option value="Sunni">Sunni</option>
                              <option value="Shia">Shia</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "2rem" }}>
                          {/* Believes in Dargah/Fatiha/Niyah? */}
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label className="block text-sm font-medium text-[#000000] mb-0">
                              Believes in Dargah/Fatiha/Niyah?{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={(e) =>
                                  updateField(
                                    "preferred_dargah_fatiha_niyah",
                                    "yes"
                                  )
                                }
                                type="button"
                                className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
                                  profileData.preferred_dargah_fatiha_niyah ===
                                  "yes"
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              >
                                <div
                                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                    profileData.preferred_dargah_fatiha_niyah ===
                                    "yes"
                                      ? "translate-x-6"
                                      : "translate-x-0"
                                  }`}
                                ></div>
                              </button>
                              <span className="ml-2 text-sm text-[#6d6e6f] font-medium">Yes</span>

                              <button
                                onClick={(e) =>
                                  updateField(
                                    "preferred_dargah_fatiha_niyah",
                                    "no"
                                  )
                                }
                                type="button"
                                className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
                                  profileData.preferred_dargah_fatiha_niyah ===
                                  "no"
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              >
                                <div
                                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                                    profileData.preferred_dargah_fatiha_niyah ===
                                    "no"
                                      ? "translate-x-6"
                                      : "translate-x-0"
                                  }`}
                                ></div>
                              </button>
                              <span className="ml-2 text-sm text-[#6d6e6f] font-medium">No</span>
                            </div>
                          </div>

                          {/* Desired Practicing Level */}
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="desiredPracticingLevel"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Desired Practicing Level{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <select
                              id="desiredPracticingLevel"
                              name="desiredPracticingLevel"
                              value={profileData.desired_practicing_level}
                              required
                              className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                              onChange={(e) =>
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
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "2rem" }}>
                          {/* Preferred Family Type */}
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="preferredFamilyType"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Preferred Family Type{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                            <select
                              id="preferredFamilyType"
                              name="preferredFamilyType"
                              value={profileData.preferred_family_type}
                              required
                              className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                              onChange={(e) =>
                                updateField(
                                  "preferred_family_type",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select Family Type</option>
                              <option value="Nuclear">Nuclear</option>
                              <option value="Joint">Joint</option>
                              <option value="Extended">Extended</option>
                            </select>
                          </div>

                          {/* Education Level */}
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="educationLevel"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Education Level
                            </label>
                            <select
                              id="educationLevel"
                              name="educationLevel"
                              value={profileData.preferred_education}
                              className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                              onChange={(e) =>
                                updateField(
                                  "preferred_education",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select Education Level</option>
                              <option value="High School">High School</option>
                              <option value="Undergraduate">
                                Undergraduate
                              </option>
                              <option value="Postgraduate">Postgraduate</option>
                              <option value="Doctorate">Doctorate</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: "2rem" }}>
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="firstName"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Profession / Occupation
                            </label>
                            <input
                              type="text"
                              id="preferredSurname"
                              name="preferredSurname"
                              value={
                                profileData.preferred_occupation_profession
                              }
                              className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                              placeholder="Profession / Occupation"
                              onChange={(e) =>
                                updateField(
                                  "preferred_occupation_profession",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="maritalStatus"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Preferred Location
                            </label>
                            <div style={{ display: "flex", width: "100%",gap:"1%" }}>
                              <div className="w-1/3">
                                <select
                                  id="city"
                                  name="city"
                                  required
                                  value={profileData.preferred_city || ""}
                                  className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                  onChange={(e) =>
                                    updateField(
                                      "preferred_city",
                                      e.target.value
                                    )
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
                              </div>

                              <div className="w-1/3">
                                <select
                                  id="state"
                                  name="state"
                                  required
                                  value={profileData.preferred_state || ""}
                                  className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                  onChange={(e) =>
                                    updateField(
                                      "preferred_state",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">State</option>
                                  <option value="andhra_pradesh">
                                    Andhra Pradesh
                                  </option>
                                  <option value="arunachal_pradesh">
                                    Arunachal Pradesh
                                  </option>
                                  <option value="assam">Assam</option>
                                  <option value="bihar">Bihar</option>
                                  <option value="chhattisgarh">
                                    Chhattisgarh
                                  </option>
                                  <option value="goa">Goa</option>
                                  <option value="gujarat">Gujarat</option>
                                  <option value="haryana">Haryana</option>
                                  <option value="himachal_pradesh">
                                    Himachal Pradesh
                                  </option>
                                  <option value="jharkhand">Jharkhand</option>
                                  <option value="karnataka">Karnataka</option>
                                  <option value="kerala">Kerala</option>
                                  <option value="madhya_pradesh">
                                    Madhya Pradesh
                                  </option>
                                  <option value="maharashtra">
                                    Maharashtra
                                  </option>
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
                                  <option value="uttar_pradesh">
                                    Uttar Pradesh
                                  </option>
                                  <option value="uttarakhand">
                                    Uttarakhand
                                  </option>
                                  <option value="west_bengal">
                                    West Bengal
                                  </option>
                                </select>
                              </div>

                              <div className="w-1/3">
                                <select
                                  id="country"
                                  name="country"
                                  required
                                  value={profileData.preferred_country || ""}
                                  className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                  onChange={(e) =>
                                    updateField(
                                      "preferred_country",
                                      e.target.value
                                    )
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
                                  <option value="south_africa">
                                    South Africa
                                  </option>
                                  <option value="russia">Russia</option>
                                  <option value="mexico">Mexico</option>
                                  <option value="new_zealand">
                                    New Zealand
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                          
                        </div>

                        <div style={{ display: "flex", gap: "2rem" }}>
                          {/* Partner's Family Background */}
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="partnerFamilyBackground"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Partner's Family Background
                            </label>
                            <textarea
                              id="partnerFamilyBackground"
                              name="partnerFamilyBackground"
                              rows="3"
                              className="h-[100px] py-[8px] px-[12px] resize-none text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                              placeholder="Describe family background"
                              value={
                                profileData.preferred_family_background || ""
                              }
                              onChange={(e) =>
                                updateField(
                                  "preferred_family_background",
                                  e.target.value
                                )
                              }
                            ></textarea>
                          </div>

                          <div className="w-[50%]">
                            <label
                              htmlFor="lastName"
                              className="block text-sm font-medium text-[#000000]"
                            ></label>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  margin: "0.5rem auto",
                  justifyContent: "start",
                  gap: "3rem",
                  padding: "0",
                }}
              >
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      border: "1.7px solid #ED58AC",
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={togglePrivacyAccordion}
                    >
                      <h4
                        className="col-span-3 mb-4"
                        style={{ fontWeight: "bold" }}
                      >
                        Privacy & Security Settings
                      </h4>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          transform: isPrivacyAccordionOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        <path
                          d="M19 9L12 16L5 9"
                          stroke="#000000"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    {isPrivacyAccordionOpen && (
                      <form className="flex flex-col gap-[20px]">
                        <div style={{ display: "flex", gap: "2rem" }}>
                          {/* Drag and Drop File Upload */}
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
                                <p className="text-red-500 text-sm mb-2">
                                  {error}
                                </p>
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
                          {/* Photo Privacy Option */}
                          {apiData.gender == "female" && (
                            <div className="w-[50%] flex flex-col gap-[10px]">
                              <label
                                htmlFor="photo_privacy"
                                className="block text-sm font-medium text-[#000000] mb-0"
                              >
                                Photo Privacy Option{" "}
                                <span style={{ color: "red" }}>*</span>{" "}
                              </label>
                              <select
                                id="photo_privacy"
                                name="photo_privacy"
                                value={
                                  profileData.photo_upload_privacy_option || ""
                                }
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
                            </div>
                          )}
                          {/* Profile Visibility */}
                          <div className="w-[50%] flex flex-col gap-[10px]">
                            <label
                              htmlFor="profile_visibility"
                              className="block text-sm font-medium text-[#000000] mb-0"
                            >
                              Profile Visibility{" "}
                              <span style={{ color: "red" }}>*</span>{" "}
                            </label>
                            <select
                              id="profile_visibility"
                              name="profile_visibility"
                              value={profileData.profile_visible || ""}
                              required
                              className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                              onChange={(e) =>
                                updateField("profile_visible", e.target.value)
                              }
                            >
                              <option value="">Select Visibility</option>
                              <option value="yes">Yes</option>
                              <option value="no">No</option>
                            </select>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>

              {lastSegment === "manageprofile" && (
                <>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      margin: "0.5rem auto",
                      justifyContent: "start",
                      gap: "3rem",
                      padding: "0",
                    }}
                  >
                    <div style={{ width: "100%" }}>
                      <div
                        style={{
                          border: "1.7px solid #ED58AC",
                          padding: "1rem",
                          borderRadius: "0.5rem",
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={toggleAdditionalInfo}
                        >
                          <h4
                            className="col-span-3 mb-4"
                            style={{ fontWeight: "bold" }}
                          >
                            Additional Information
                          </h4>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                              transform: isAdditionalInfoOpen
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                              transition: "transform 0.3s ease",
                            }}
                          >
                            <path
                              d="M19 9L12 16L5 9"
                              stroke="#000000"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        {isAdditionalInfoOpen && (
                          <form>
                            <div style={{ display: "flex", gap: "2rem" }}>
                              <div className="w-[50%]">
                                <label
                                  htmlFor="maritalStatus"
                                  className="block text-sm font-medium text-[#000000]"
                                >
                                  Skin Color
                                </label>
                                <select
                                  id="preferredSurname"
                                  name="preferredSurname"
                                  value={profileData.skin_tone}
                                  required
                                  className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                  onChange={(e) =>
                                    updateField("skin_tone", e.target.value)
                                  }
                                >
                                  <option value="">Select Skin Color</option>
                                  <option value="Very Fair">Very Fair</option>
                                  <option value="Fair">Fair</option>
                                  <option value="Light Brown">
                                    Light Brown
                                  </option>
                                  <option value="Dark Brown">Dark Brown</option>
                                  <option value="Wheatish">Wheatish</option>
                                  <option value="Wheatish Brown">
                                    Wheatish Brown
                                  </option>
                                  <option value="Brown">Brown</option>
                                  <option value="Dark">Dark</option>
                                  <option value="Very Dark">Very Dark</option>
                                  <option value="Prefer not to say">
                                    Prefer not to say
                                  </option>
                                </select>
                              </div>

                              <div className="w-[50%]">
                                <label
                                  htmlFor="maritalStatus"
                                  className="block text-sm font-medium text-[#000000]"
                                >
                                  Body Type
                                </label>
                                <select
                                  id="preferredSurname"
                                  name="preferredSurname"
                                  value={profileData.body_type}
                                  required
                                  className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                  onChange={(e) =>
                                    updateField("body_type", e.target.value)
                                  }
                                >
                                  <option value="">Select Body Type</option>
                                  <option value="Slim">Slim</option>
                                  <option value="Lean">Lean</option>
                                  <option value="Average">Average</option>
                                  <option value="Athletic">Athletic</option>
                                  <option value="Heavyset">Heavyset</option>
                                  <option value="Tall and Lean">
                                    Tall and Lean
                                  </option>
                                  <option value="Short and Lean">
                                    Short and Lean
                                  </option>
                                  <option value="Muscular">Muscular</option>
                                  <option value="Fit">Fit</option>
                                  <option value="Toned">Toned</option>
                                  <option value="Broad-shouldered">
                                    Broad-shouldered
                                  </option>
                                  <option value="Plus size">Plus size</option>
                                  <option value="Chubby">Chubby</option>
                                  <option value="Big and Tall">
                                    Big and Tall
                                  </option>
                                  <option value="Tall and Full-bodied">
                                    Tall and Full-bodied
                                  </option>
                                  <option value="Short and Full-bodied">
                                    Short and Full-bodied
                                  </option>
                                  <option value="Stocky">Stocky</option>
                                  <option value="Tall">Tall</option>
                                  <option value="Short">Short</option>
                                  <option value="Other">Other</option>
                                  <option value="Prefer not to say">
                                    Prefer not to say
                                  </option>
                                </select>
                              </div>
                            </div>

                            <div style={{ display: "flex", gap: "2rem" }}>
                              <div className="w-[50%]">
                                <label
                                  htmlFor="maritalStatus"
                                  className="block text-sm font-medium text-[#000000]"
                                >
                                  Financial Status
                                </label>
                                <select
                                  id="preferredSurname"
                                  name="preferredSurname"
                                  value={profileData.financial_status}
                                  required
                                  className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                  onChange={(e) =>
                                    updateField(
                                      "financial_status",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">
                                    Select Financial Status
                                  </option>
                                  <option value="Wealthy/Affluent">
                                    Wealthy/Affluent
                                  </option>
                                  <option value="Upper Middle Class">
                                    Upper Middle Class
                                  </option>
                                  <option value="Middle Class">
                                    Middle Class
                                  </option>
                                  <option value="Lower Middle Class">
                                    Lower Middle Class
                                  </option>
                                  <option value="Struggling Financially">
                                    Struggling Financially
                                  </option>
                                  <option value="High net worth family">
                                    High net worth family
                                  </option>
                                  <option value="Established Family">
                                    Established Family
                                  </option>
                                  <option value="Financially Stable">
                                    Financially Stable
                                  </option>
                                  <option value="Prefer not to say">
                                    Prefer not to say
                                  </option>
                                </select>
                              </div>

                              <div className="w-[25%]">
                                <label
                                  htmlFor="maritalStatus"
                                  className="block text-sm font-medium text-[#000000]"
                                >
                                  Father Alive
                                </label>
                                <select
                                  id="preferredSurname"
                                  name="preferredSurname"
                                  value={profileData.father_alive}
                                  required
                                  className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                  onChange={(e) =>
                                    updateField("father_alive", e.target.value)
                                  }
                                >
                                  <option value="">Select </option>
                                  <option value="Alive">Alive</option>
                                  <option value="Not Alive">Not Alive</option>
                                </select>
                              </div>

                              <div className="w-[25%]">
                                <label
                                  htmlFor="maritalStatus"
                                  className="block text-sm font-medium text-[#000000]"
                                >
                                  Mother Alive
                                </label>
                                <select
                                  id="preferredSurname"
                                  name="preferredSurname"
                                  value={profileData.mother_alive}
                                  required
                                  className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                  onChange={(e) =>
                                    updateField("mother_alive", e.target.value)
                                  }
                                >
                                  <option value="">Select </option>
                                  <option value="Alive">Alive</option>
                                  <option value="Not Alive">Not Alive</option>
                                </select>
                              </div>
                            </div>

                            <div style={{ display: "flex", gap: "2rem" }}>
                              <div className="w-[50%]">
                                <label
                                  htmlFor="maritalStatus"
                                  className="block text-sm font-medium text-[#000000]"
                                >
                                  Perform Namaz
                                </label>
                                <select
                                  id="preferredSurname"
                                  name="preferredSurname"
                                  value={profileData.perform_namaz}
                                  required
                                  className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                  onChange={(e) =>
                                    updateField("perform_namaz", e.target.value)
                                  }
                                >
                                  <option value="">
                                    Select Namaz Practice
                                  </option>
                                  <option value="Yes, five times daily">
                                    Yes, five times daily
                                  </option>
                                  <option value="Yes, regularly">
                                    Yes, regularly
                                  </option>
                                  <option value="Yes, occasionally">
                                    Yes, occasionally
                                  </option>
                                  <option value="Only on special occasions (e.g: Eid)">
                                    Only on special occasions (e.g: Eid)
                                  </option>
                                  <option value="Only during Ramadan">
                                    Only during Ramadan
                                  </option>
                                  <option value="Only on Fridays">
                                    Only on Fridays
                                  </option>
                                  <option value="Rarely">Rarely</option>
                                  <option value="No, but open to it">
                                    No, but open to it
                                  </option>
                                  <option value="No, but I respect it">
                                    No, but I respect it
                                  </option>
                                  <option value="No">No</option>
                                  <option value="Prefer not to say">
                                    Prefer not to say
                                  </option>
                                </select>
                              </div>

                              <div className="w-[50%]">
                                <label
                                  htmlFor="maritalStatus"
                                  className="block text-sm font-medium text-[#000000]"
                                >
                                  Recite Qur'an
                                </label>
                                <select
                                  id="preferredSurname"
                                  name="preferredSurname"
                                  value={profileData.recite_quran}
                                  required
                                  className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                  onChange={(e) =>
                                    updateField("recite_quran", e.target.value)
                                  }
                                >
                                  <option value="">
                                    Select Quran Recitation Habit
                                  </option>
                                  <option value="Yes, regularly">
                                    Yes, regularly
                                  </option>
                                  <option value="Yes, occasionally">
                                    Yes, occasionally
                                  </option>
                                  <option value="Only during Ramadan">
                                    Only during Ramadan
                                  </option>
                                  <option value="Rarely">Rarely</option>
                                  <option value="Never, but open to it">
                                    Never, but open to it
                                  </option>
                                  <option value="Never, but I respect it">
                                    Never, but I respect it
                                  </option>
                                  <option value="Read translated version">
                                    Read translated version
                                  </option>
                                  <option value="Never">Never</option>
                                  <option value="Prefer not to say">
                                    Prefer not to say
                                  </option>
                                </select>
                              </div>
                            </div>

                            <div style={{ display: "flex", gap: "2rem" }}>
                              <div className="w-[50%]">
                                <label
                                  htmlFor="maritalStatus"
                                  className="block text-sm font-medium text-[#000000]"
                                >
                                  Marriage Plan
                                </label>
                                <select
                                  id="preferredSurname"
                                  name="preferredSurname"
                                  value={profileData.marriage_plan}
                                  required
                                  className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                  onChange={(e) =>
                                    updateField("marriage_plan", e.target.value)
                                  }
                                >
                                  <option value="">Select Marriage Plan</option>
                                  <option value="As soon as possible">
                                    As soon as possible
                                  </option>
                                  <option value="Within 1 year">
                                    Within 1 year
                                  </option>
                                  <option value="Within 2-3 years">
                                    Within 2-3 years
                                  </option>
                                  <option value="Open to the right time">
                                    Open to the right time
                                  </option>
                                  <option value="Not sure yet">
                                    Not sure yet
                                  </option>
                                  <option value="After finding a proper match">
                                    After finding a proper match
                                  </option>
                                  <option value="No immediate plans">
                                    No immediate plans
                                  </option>
                                  <option value="Flexible about timing">
                                    Flexible about timing
                                  </option>
                                </select>
                              </div>
                            </div>

                            <div style={{ display: "flex", gap: "2rem" }}>
                              <div className="w-[50%]">
                                <label
                                  htmlFor="maritalStatus"
                                  className="block text-sm font-medium text-[#000000]"
                                >
                                  Smoking Cigarette or Sheesha?
                                </label>
                                <select
                                  id="preferredSurname"
                                  name="preferredSurname"
                                  value={profileData.smoking_cigarette_sheesha}
                                  required
                                  className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                  onChange={(e) =>
                                    updateField(
                                      "smoking_cigarette_sheesha",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">Select Smoking Habit</option>
                                  <option value="Never Smoked">
                                    Never Smoked
                                  </option>
                                  <option value="Current Smoker">
                                    Current Smoker
                                  </option>
                                  <option value="Occasional Smoker">
                                    Occasional Smoker
                                  </option>
                                  <option value="Quit Smoking">
                                    Quit Smoking
                                  </option>
                                  <option value="Smoke Occasionally">
                                    Smoke Occasionally
                                  </option>
                                  <option value="Smoke Regularly">
                                    Smoke Regularly
                                  </option>
                                  <option value="Prefer not to say">
                                    Prefer not to say
                                  </option>
                                </select>
                              </div>
                              <div className="w-[50%]">
                                <label
                                  htmlFor="maritalStatus"
                                  className="block text-sm font-medium text-[#000000]"
                                >
                                  Smoking Cigarette or Sheesha?
                                </label>
                                <select
                                  id="preferredSurname"
                                  name="preferredSurname"
                                  value={profileData.drinking_alcohol_wine}
                                  required
                                  className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                  onChange={(e) =>
                                    updateField(
                                      "drinking_alcohol_wine",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">
                                    Select Drinking Habit
                                  </option>
                                  <option value="Never Drank">
                                    Never Drank
                                  </option>
                                  <option value="Occasionally Drink">
                                    Occasionally Drink
                                  </option>
                                  <option value="Regular Drinker">
                                    Regular Drinker
                                  </option>
                                  <option value="Social Drinker">
                                    Social Drinker
                                  </option>
                                  <option value="Former Drinker">
                                    Former Drinker
                                  </option>
                                  <option value="Drink Occasionally">
                                    Drink Occasionally
                                  </option>
                                  <option value="No History of Drinking">
                                    No History of Drinking
                                  </option>
                                  <option value="Prefer not to say">
                                    Prefer not to say
                                  </option>
                                </select>
                              </div>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  onClick={() => {
                    navigate("/memstepfive");
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

export default MemStepSix;
