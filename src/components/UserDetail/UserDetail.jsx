import React from "react";
import Header from "../Dashboard/header/Header";
import "./userDetail.css";
import UserSetionOne from "./UserSetionOne";
import UserDetailSecond from "./UserDetailSecond";
import UserDetailThird from "./UserDetailThird";
import men from "../../images/men1.jpg"

import { useState, useEffect } from "react";
import { justUpdateDataV2, fetchDataObjectV2, fetchDataWithTokenV2 } from "../../apiUtils";
import { useParams } from "react-router-dom";
const UserDetail = () => {
  const { userId } = useParams();
  const [apiData, setApiData] = useState([]);
  const [apiData1, setApiData1] = useState([]);
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
      const parameter1 = {
        url: `/api/user/add_photo/?user_id=${userId}`,
        setterFunction: setApiData1,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataWithTokenV2(parameter1);
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
        preferred_family_background:
          apiData.preferred_family_background || null,
        preferred_education: apiData.preferred_education || null,
        preferred_occupation_profession:
          apiData.preferred_occupation_profession || null,
        profile_visible: apiData.profile_visible || null,
        photo_upload_privacy_option:
          apiData.photo_upload_privacy_option || null,
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
    <div className="h-full w-full flex flex-col justify-between gap-[20px] bg-[#f5f5f5]">
      <Header />
      <div className="section-container">
        <UserSetionOne
          apiData={apiData}
          setApiData={setApiData}
          setMessage={setMessage}
          setErrors={setErrors}
        />
        <div className="secondSection">
          <div className="extra">
            <UserDetailSecond apiData={apiData} />
            <UserDetailThird />
          </div>

          <div className="gallert">
            <div className="secondDetail5">
              <div className="headingSecond1">
                <h1> Photo Gallery</h1>
                <h3>All photos</h3>
              </div>
              <div className="basic">
                {apiData1?.map((profile) => {
                  return (
                    <div className="img1">
                      <img src={profile?.upload_photo} alt="photo" />
                    </div>
                  );
                })}
                <div className="img1">
                  {/* <img src="https://i.pinimg.com/564x/d3/43/80/d34380c5ffa97a612ed177e8434b84fe.jpg" alt="" /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;