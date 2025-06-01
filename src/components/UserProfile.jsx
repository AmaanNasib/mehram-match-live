import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../components/sections/TopBar";
import Sidebar from "../components/sections/Sidebar";
import ProfileSection from "../components/sections/ProfileSection";
import { fetchDataObjectV2, justUpdateDataV2 } from "../apiUtils";
import edit from "../images/edit1.svg"
import Cancel  from "../images/cancle.svg";
import save from "../images/save1.svg"

const UserProfile = () => {
  const { userId } = useParams();
  const [apiData, setApiData] = useState([]);
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setMessage] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    first_name: null,
    last_name: null,
    city: null,
    email: "",
    contact_number: null,
    onbehalf: null,
    caste: null,
    dob: null,
    is_staff: false,
    is_active: false,
    created_at: null,
    updated_at: null,
    gender: null,
    martial_status: null,
    state: null,
    country: null,
    native_country: null,
    native_city: null,
    native_state: null,
    Education: null,
    profession: null,
    cultural_background: null,
    about_you: null,
    disability: null,
    income: null,
    sect_school_info: null,
    islamic_practicing_level: null,
    believe_in_dargah_fatiha_niyah: null,
    hijab_niqab_prefer: null,
    father_name: null,
    father_occupation: null,
    mother_name: null,
    mother_occupation: null,
    wali_name: null,
    wali_contact_number: null,
    wali_blood_relation: null,
    number_of_children: null,
    number_of_son: null,
    number_of_daughter: null,
    number_of_siblings: null,
    number_of_brothers: null,
    number_of_sisters: null,
    family_type: null,
    family_practicing_level: null,
    preferred_surname: null,
    preferred_dargah_fatiha_niyah: null,
    preferred_sect: null,
    desired_practicing_level: null,
    preferred_city_state: null,
    preferred_family_type: null,
    preferred_family_background: null,
    preferred_education: null,
    preferred_occupation_profession: null,
    profile_visible: null,
    photo_upload_privacy_option: null,
    summary: "",
    terms_condition: false,
  });

  useEffect(() => {
    if (userId) {
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
      setFormData({
        id: apiData.id || null,
        name: apiData.name || "",
        first_name: apiData.first_name || null,
        last_name: apiData.last_name || null,
        city: apiData.city || null,
        email: apiData.email || "",
        contact_number: apiData.contact_number || null,
        onbehalf: apiData.onbehalf || null,
        caste: apiData.caste || null,
        dob: apiData.dob || null,
        is_staff: apiData.is_staff || false,
        is_active: apiData.is_active || false,
        created_at: apiData.created_at || null,
        updated_at: apiData.updated_at || null,
        gender: apiData.gender || null,
        martial_status: apiData.martial_status || null,
        state: apiData.state || null,
        country: apiData.country || null,
        native_country: apiData.native_country || null,
        native_city: apiData.native_city || null,
        native_state: apiData.native_state || null,
        Education: apiData.Education || null,
        profession: apiData.profession || null,
        cultural_background: apiData.cultural_background || null,
        about_you: apiData.about_you || null,
        disability: apiData.disability || null,
        income: apiData.income || null,
        sect_school_info: apiData.sect_school_info || null,
        islamic_practicing_level: apiData.islamic_practicing_level || null,
        believe_in_dargah_fatiha_niyah:
          apiData.believe_in_dargah_fatiha_niyah || null,
        hijab_niqab_prefer: apiData.hijab_niqab_prefer || null,
        father_name: apiData.father_name || null,
        father_occupation: apiData.father_occupation || null,
        mother_name: apiData.mother_name || null,
        mother_occupation: apiData.mother_occupation || null,
        wali_name: apiData.wali_name || null,
        wali_contact_number: apiData.wali_contact_number || null,
        wali_blood_relation: apiData.wali_blood_relation || null,
        number_of_children: apiData.number_of_children || null,
        number_of_son: apiData.number_of_son || null,
        number_of_daughter: apiData.number_of_daughter || null,
        number_of_siblings: apiData.number_of_siblings || null,
        number_of_brothers: apiData.number_of_brothers || null,
        number_of_sisters: apiData.number_of_sisters || null,
        family_type: apiData.family_type || null,
        family_practicing_level: apiData.family_practicing_level || null,
        preferred_surname: apiData.preferred_surname || null,
        preferred_dargah_fatiha_niyah:
          apiData.preferred_dargah_fatiha_niyah || null,
        preferred_sect: apiData.preferred_sect || null,
        desired_practicing_level: apiData.desired_practicing_level || null,
        preferred_city_state: apiData.preferred_city_state || null,
        preferred_family_type: apiData.preferred_family_type || null,
        preferred_family_background: apiData.preferred_family_background || null,
        preferred_education: apiData.preferred_education || null,
        preferred_occupation_profession:
          apiData.preferred_occupation_profession || null,
        profile_visible: apiData.profile_visible || null,
        photo_upload_privacy_option: apiData.photo_upload_privacy_option || null,
        summary: apiData.summary || "",
        terms_condition: apiData.terms_condition || false,
      });
    }
  }, [apiData]);

  const handleFieldChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const [PersonalEdit, setPersonalEdit] = useState(true);
  const [religiousEdit, setReligiousEdit] = useState(true);
  const [familyEdit, setFamilyEdit] = useState(true);
  const [partnerdit, setPartnerEdit] = useState(true);

  const updateData = () => {
    const parameters = {
      url: `/api/user/${formData.id}`,
      payload: formData,
      tofetch: {
        items: [
          {
            fetchurl: `/api/user/${formData.id}`,
            setterFunction: setApiData,
          },
        ],
      },
      setMessage: setMessage,
      setErrors: setErrors,
    };

    justUpdateDataV2(parameters);
    setPartnerEdit(true);
    setFamilyEdit(true);
    setReligiousEdit(true);
    setPersonalEdit(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setMessage(false);
    }, 5000);
  }, [successMessage]);

  return (
    <div className="flex h-screen">
      {successMessage && (
        <p className="successmessage">Profile Updated Successfully</p>
      )}

      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 bg-white">
        <TopBar />

        <div className="main_section overflow-y-scroll">
          <ProfileSection
            userName={formData.name}
            userProfession={formData.profession}
          />

          {/* Form Container */}
          <div className="form_container_user_creation h-auto bg-white pb-[12px]">
            <div className="mem_form_con h-auto border-[1px] border-pink-200 rounded-md p-4 max-w-[90%] mx-auto relative">
              {/* Personal Information Section */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "1rem 0",
              }}>
                <h4 className="col-span-3" style={{fontSize:"1.2rem"}}>Personal Information</h4>
                <div className="flex">
                  <button
                    className="bg-blue-500 text-white flex items-center"
                    onClick={(e) => setPersonalEdit(false)}
                    style={{borderRadius:"50%", height:"2rem", width:"2rem", margin:"0 1rem", display:"flex", justifyContent:"center", alignItems:"center"}}
                  >
                    <img src={edit} alt="" style={{borderRadius:"50%", height:"2rem", width:"2rem", padding:"0.2rem"}} />
                  </button>
                  <button
                    className="bg-red-500 text-white flex items-center"
                    onClick={(e) => setPersonalEdit(true)}
                    style={{borderRadius:"50%", height:"2rem", width:"2rem", margin:"0 1rem", display:"flex", justifyContent:"center", alignItems:"center"}}
                  >
                    <img src={Cancel} style={{borderRadius:"50%", height:"2rem", width:"2rem", padding:"0rem"}} alt="" />
                  </button>
                  <button
                    className="bg-green-500 text-white flex items-center"
                    onClick={(e) => updateData()}
                    style={{borderRadius:"50%", height:"2rem", width:"2rem", margin:"0 1rem", display:"flex", justifyContent:"center", alignItems:"center"}}
                  >
                    <img src={save} style={{borderRadius:"50%", height:"2rem", width:"2rem", padding:"0.2rem"}} alt="" />
                  </button>
                </div>
              </div>

              {/* Personal Information Form */}
              <form className="grid grid-cols-3 gap-2">
                {/* Form fields for personal information */}
                {/* ... rest of your form fields ... */}
              </form>

              {/* Religious Information Section */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "1rem 0",
              }}>
                <h4 className="col-span-3" style={{fontSize:"1.2rem"}}>Religious Information</h4>
                <div className="flex">
                  {/* Edit buttons for religious information */}
                </div>
              </div>

              {/* Religious Information Form */}
              <form className="grid grid-cols-3 gap-2">
                {/* Form fields for religious information */}
                {/* ... rest of your form fields ... */}
              </form>

              {/* Family Information Section */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "1rem 0",
              }}>
                <h4 className="col-span-3" style={{fontSize:"1.2rem"}}>Family Information</h4>
                <div className="flex">
                  {/* Edit buttons for family information */}
                </div>
              </div>

              {/* Family Information Form */}
              <form className="grid grid-cols-3 gap-2">
                {/* Form fields for family information */}
                {/* ... rest of your form fields ... */}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
