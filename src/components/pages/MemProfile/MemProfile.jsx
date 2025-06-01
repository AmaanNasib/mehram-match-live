import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { postDataReturnId } from "../../../apiUtils";
import TopBar from "../../sections/TopBar";
import Sidebar from "../../sections/Sidebar";
import dp_image from "../../../images/dp_image.png";
import ProfileSection from "../../sections/ProfileSection";
import { useParams } from "react-router-dom";
import { fetchDataObjectV2 } from "../../../apiUtils";
const MemProfile = () => {
  const { userId } = useParams();
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

  const [apiData, setApiData] = useState([]);
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(false);

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
      [field]: value, // Update the specific field
    }));
  };

  const [activeForm, setActiveForm] = useState(null);

  const showForm = (formName) => {
    setActiveForm(formName === activeForm ? null : formName);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 bg-white">
        <TopBar />

        <div className="main_section overflow-y-scroll ">
          <ProfileSection />

          {/* Empty Section */}
          <div className="form_container_user_creation h-auto w-[75vw] bg-white pb-[12px] flex m-auto">
            <div className="flex flex-col w-[100%] gap-2.5">
              <div className="mem_form_con h-auto border-[1px] border-pink-200 rounded-md p-4  relative ">
                <form className="grid grid-cols-3 gap-2">
                  <h4 className="col-span-3 mb-4">Personal Information</h4>

                  {/* First Name */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.first_name || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("first_name", e.target.value)
                      }
                    />
                  </div>

                  {/* Last Name */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.last_name || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("last_name", e.target.value)
                      }
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="dob"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      required
                      value={formData.dob || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) => handleFieldChange("dob", e.target.value)}
                    />
                  </div>

                  {/* Marital Status */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="maritalStatus"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Marital Status
                    </label>
                    <select
                      id="maritalStatus"
                      name="maritalStatus"
                      required
                      value={formData.marital_status || ""}
                      disabled
                      onChange={(e) =>
                        handleFieldChange("marital_status", e.target.value)
                      }
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Khula">Khula</option>
                      <option value="Widow">Widow</option>
                    </select>
                  </div>

                  {/* Education */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="education"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Education
                    </label>
                    <select
                      id="education"
                      name="education"
                      value={formData.education || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                    >
                      <option value="">Select Education</option>
                      {/* Add more options as needed */}
                    </select>
                  </div>

                  {/* Profession */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="profession"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Profession
                    </label>
                    <input
                      type="text"
                      id="profession"
                      name="profession"
                      value={formData.profession || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("profession", e.target.value)
                      }
                    />
                  </div>

                  {/* Cultural Background */}
                  <div className="col-span-3">
                    <label
                      htmlFor="culturalBackground"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Cultural Background
                    </label>
                    <textarea
                      id="culturalBackground"
                      name="culturalBackground"
                      value={formData.cultural_background || ""}
                      className="mt-1 resize-none min-h-[70px] p-[12px] text-[12px] h-[28px] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("cultural_background", e.target.value)
                      }
                    />
                  </div>

                  {/* Personal Values / About You */}
                  <div className="col-span-3">
                    <label
                      htmlFor="personalValues"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Personal Values / About You
                    </label>
                    <textarea
                      id="personalValues"
                      name="personalValues"
                      value={formData.about_you || ""}
                      className="mt-1 resize-none min-h-[70px] p-[12px] text-[12px] h-[28px] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("about_you", e.target.value)
                      }
                    />
                  </div>

                  <label className="block col-span-3 my-4 text-sm font-medium text-[#ED58AC]">
                    Current Address
                  </label>

                  {/* Current Address */}
                  {/* City */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="city"
                      className="text-sm font-medium text-[#ED58AC]"
                    >
                      City
                    </label>
                    <select
                      id="city"
                      name="city"
                      required
                      value={formData.city || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("city", e.target.value)
                      }
                    >
                      <option value="">Select a City</option>
                    </select>
                  </div>

                  {/* State/Province */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="state"
                      className="text-sm font-medium text-[#ED58AC]"
                    >
                      State/Province
                    </label>
                    <select
                      id="state"
                      name="state"
                      required
                      value={formData.state || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("state", e.target.value)
                      }
                    >
                      <option value="">Select a State/Province</option>
                    </select>
                  </div>

                  {/* Country */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="country"
                      className="text-sm font-medium text-[#ED58AC]"
                    >
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      required
                      value={formData.country || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("country", e.target.value)
                      }
                    >
                      <option value="">Select a Country</option>
                    </select>
                  </div>

                  <label className="block col-span-3 my-4 text-sm font-medium text-[#ED58AC]">
                    Native Place
                  </label>

                  {/* Native Place */}
                  {/* Native State/Province */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="nativeState"
                      className="text-sm font-medium text-[#ED58AC]"
                    >
                      State/Province
                    </label>
                    <select
                      id="nativeState"
                      name="nativeState"
                      required
                      value={formData.native_state || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("native_state", e.target.value)
                      }
                    >
                      <option value="">Select Native State/Province</option>
                    </select>
                  </div>

                  {/* Native City */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="nativeCity"
                      className="text-sm font-medium text-[#ED58AC]"
                    >
                      City
                    </label>
                    <select
                      id="nativeCity"
                      name="nativeCity"
                      required
                      value={formData.native_city || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("native_city", e.target.value)
                      }
                    >
                      <option value="">Select Native City</option>
                    </select>
                  </div>

                  {/* Native Country */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="nativeCountry"
                      className="text-sm font-medium text-[#ED58AC]"
                    >
                      Country
                    </label>
                    <select
                      id="nativeCountry"
                      name="nativeCountry"
                      required
                      value={formData.native_country || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("native_country", e.target.value)
                      }
                    >
                      <option value="">Select Native Country</option>
                    </select>
                  </div>
                </form>

                <form className="grid grid-cols-3 gap-2">
                  <h4 className="col-span-3 mt-12 mb-4">
                    Religious Information
                  </h4>

                  {/* Sect / School of Thought */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="sect"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Sect / School of Thought
                    </label>
                    <select
                      id="sect"
                      name="sect"
                      required
                      value={formData.sect_school_info || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("sect_school_info", e.target.value)
                      }
                    >
                      <option value="">Select Sect</option>
                      <option value="Sunni">Sunni</option>
                      <option value="Shia">Shia</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  {/* Islam Practicing Level */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="islamPracticingLevel"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Islam Practicing Level
                    </label>
                    <input
                      type="text"
                      id="islamPracticingLevel"
                      name="islamPracticingLevel"
                      value={formData.islamic_practicing_level || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange(
                          "islamic_practicing_level",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* Believe in Dargah/Fatiha/Niyah */}
                  <div className="w-full col-span-3">
                    <label className="block text-sm font-medium text-[#ED58AC]">
                      Believe in Dargah/Fatiha/Niyah?
                    </label>
                    <div className="mt-1 flex space-x-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="believeYes"
                          name="believeInDargah"
                          value="Yes"
                          checked={
                            formData.believe_in_dargah_fatiha_niyah === "Yes"
                          }
                          required
                          className="h-4 w-4 text-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                          disabled
                          onChange={(e) =>
                            handleFieldChange(
                              "believe_in_dargah_fatiha_niyah",
                              e.target.value
                            )
                          }
                        />
                        <label
                          htmlFor="believeYes"
                          className="ml-2 text-sm text-[#ED58AC]"
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
                            formData.believe_in_dargah_fatiha_niyah === "No"
                          }
                          required
                          className="h-4 w-4 text-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                          disabled
                          onChange={(e) =>
                            handleFieldChange(
                              "believe_in_dargah_fatiha_niyah",
                              e.target.value
                            )
                          }
                        />
                        <label
                          htmlFor="believeNo"
                          className="ml-2 text-sm text-[#ED58AC]"
                        >
                          No
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Hijab/Niqab Preference (Visible only for females) */}
                  <div className="w-[80%]">
                    <label className="block text-sm font-medium text-[#ED58AC]">
                      Hijab/Niqab Preference
                    </label>
                    <div className="mt-1 flex space-x-4">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="hijabYes"
                          name="hijabPreference"
                          value="Yes"
                          checked={formData.hijab_niqab_prefer === "Yes"}
                          required
                          className="h-4 w-4 text-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                          disabled
                          onChange={(e) =>
                            handleFieldChange(
                              "hijab_niqab_prefer",
                              e.target.value
                            )
                          }
                        />
                        <label
                          htmlFor="hijabYes"
                          className="ml-2 text-sm text-[#ED58AC]"
                        >
                          Yes
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="hijabNo"
                          name="hijabPreference"
                          value="No"
                          checked={formData.hijab_niqab_prefer === "No"}
                          required
                          className="h-4 w-4 text-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                          disabled
                          onChange={(e) =>
                            handleFieldChange(
                              "hijab_niqab_prefer",
                              e.target.value
                            )
                          }
                        />
                        <label
                          htmlFor="hijabNo"
                          className="ml-2 text-sm text-[#ED58AC]"
                        >
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                </form>

                <form className="grid grid-cols-3 gap-2">
                  <h4 className="col-span-3 mt-12 mb-4">Family Information</h4>

                  {/* Father's Name */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="fatherName"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Father’s Name
                    </label>
                    <input
                      type="text"
                      id="fatherName"
                      name="fatherName"
                      required
                      placeholder="Enter full name"
                      value={formData.father_name || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("father_name", e.target.value)
                      }
                    />
                  </div>

                  {/* Father's Occupation */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="fatherOccupation"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Father’s Occupation
                    </label>
                    <input
                      type="text"
                      id="fatherOccupation"
                      name="fatherOccupation"
                      placeholder="Enter occupation"
                      value={formData.father_occupation || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("father_occupation", e.target.value)
                      }
                    />
                  </div>

                  {/* Mother's Name */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="motherName"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Mother’s Name
                    </label>
                    <input
                      type="text"
                      id="motherName"
                      name="motherName"
                      required
                      placeholder="Enter full name"
                      value={formData.mother_name || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("mother_name", e.target.value)
                      }
                    />
                  </div>

                  {/* Mother's Occupation */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="motherOccupation"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Mother’s Occupation
                    </label>
                    <input
                      type="text"
                      id="motherOccupation"
                      name="motherOccupation"
                      placeholder="Enter occupation"
                      value={formData.mother_occupation || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("mother_occupation", e.target.value)
                      }
                    />
                  </div>

                  {/* Blood Relation */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="waliRelation"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Blood Relation
                    </label>
                    <select
                      id="waliRelation"
                      name="waliRelation"
                      required
                      value={formData.wali_blood_relation || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("wali_blood_relation", e.target.value)
                      }
                    >
                      <option value="">Select Relation</option>
                      <option value="Father">Father</option>
                      <option value="Brother">Brother</option>
                      <option value="Uncle">Uncle</option>
                    </select>
                  </div>

                  {/* Number of Children */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="numChildren"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Number of Children
                    </label>
                    <select
                      id="numChildren"
                      name="numChildren"
                      value={formData.number_of_children || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("number_of_children", e.target.value)
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

                  {/* Number of Sons */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="numSons"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Number of Sons
                    </label>
                    <select
                      id="numSons"
                      name="numSons"
                      value={formData.number_of_son || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("number_of_son", e.target.value)
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

                  {/* Number of Daughters */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="numDaughters"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Number of Daughters
                    </label>
                    <select
                      id="numDaughters"
                      name="numDaughters"
                      value={formData.number_of_daughter || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("number_of_daughter", e.target.value)
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

                  {/* Number of Siblings */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="numSiblings"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Number of Siblings
                    </label>
                    <select
                      id="numSiblings"
                      name="numSiblings"
                      required
                      value={formData.number_of_siblings || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("number_of_siblings", e.target.value)
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

                  {/* Number of Brothers */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="numBrothers"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Number of Brothers
                    </label>
                    <select
                      id="numBrothers"
                      name="numBrothers"
                      value={formData.number_of_brothers || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("number_of_brothers", e.target.value)
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

                  {/* Number of Sisters */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="numSisters"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Number of Sisters
                    </label>
                    <select
                      id="numSisters"
                      name="numSisters"
                      value={formData.number_of_sisters || ""}
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      disabled
                      onChange={(e) =>
                        handleFieldChange("number_of_sisters", e.target.value)
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
                </form>

                <form className=" grid grid-cols-3 gap-2 ">
                  <h4 className="col-span-3 mt-12 mb-4">
                    Partner Expectations
                  </h4>

                  {/* Preferred Surname */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="preferredSurname"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Preferred Surname
                    </label>
                    <input
                      type="text"
                      id="preferredSurname"
                      name="preferredSurname"
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      placeholder="Enter surname"
                      value={formData.preferred_surname || ""}
                      disabled
                      onChange={(e) =>
                        handleFieldChange("preferred_surname", e.target.value)
                      }
                    />
                  </div>

                  {/* Preferred Sect */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="preferredSect"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Preferred Sect
                    </label>
                    <select
                      id="preferredSect"
                      name="preferredSect"
                      required
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      value={formData.preferred_sect || ""}
                      disabled
                      onChange={(e) =>
                        handleFieldChange("preferred_sect", e.target.value)
                      }
                    >
                      <option value="">Select Sect</option>
                      <option value="Sunni">Sunni</option>
                      <option value="Shia">Shia</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Desired Practicing Level */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="desiredPracticingLevel"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Desired Practicing Level
                    </label>
                    <select
                      id="desiredPracticingLevel"
                      name="desiredPracticingLevel"
                      required
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      value={formData.desired_practicing_level || ""}
                      disabled
                      onChange={(e) =>
                        handleFieldChange(
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

                  {/* Preferred City/State */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="preferredCity"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Preferred City/State
                    </label>
                    <input
                      type="text"
                      id="preferredCity"
                      name="preferredCity"
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      placeholder="Enter city/state"
                      value={formData.preferred_city_state || ""}
                      disabled
                      onChange={(e) =>
                        handleFieldChange(
                          "preferred_city_state",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* Preferred Family Type */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="preferredFamilyType"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Preferred Family Type
                    </label>
                    <select
                      id="preferredFamilyType"
                      name="preferredFamilyType"
                      required
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      value={formData.preferred_family_type || ""}
                      disabled
                      onChange={(e) =>
                        handleFieldChange(
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
                  <div className="w-[80%]">
                    <label
                      htmlFor="educationLevel"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Education Level
                    </label>
                    <select
                      id="educationLevel"
                      name="educationLevel"
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      value={formData.preferred_education || ""}
                      disabled
                      onChange={(e) =>
                        handleFieldChange("preferred_education", e.target.value)
                      }
                    >
                      <option value="">Select Education Level</option>
                      <option value="High School">High School</option>
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                      <option value="Doctorate">Doctorate</option>
                    </select>
                  </div>

                  {/* Profession / Occupation */}
                  <div className="w-[80%]">
                    <label
                      htmlFor="profession"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Profession / Occupation
                    </label>
                    <input
                      type="text"
                      id="profession"
                      name="profession"
                      className="mt-1 px-[12px] text-[12px] h-[2.3rem] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      placeholder="Enter profession"
                      value={formData.preferred_occupation_profession || ""}
                      disabled
                      onChange={(e) =>
                        handleFieldChange(
                          "preferred_occupation_profession",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* Partner's Family Background */}
                  <div className="w-full col-span-3">
                    <label
                      htmlFor="partnerFamilyBackground"
                      className="block text-sm font-medium text-[#ED58AC] h-[1.5rem]"
                    >
                      Partner's Family Background
                    </label>
                    <textarea
                      id="partnerFamilyBackground"
                      name="partnerFamilyBackground"
                      rows="3"
                      className="mt-1 resize-none min-h-[70px] p-[12px] text-[12px] h-[28px] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      placeholder="Describe family background"
                      value={formData.preferred_family_background || ""}
                      disabled
                      onChange={(e) =>
                        handleFieldChange(
                          "preferred_family_background",
                          e.target.value
                        )
                      }
                    ></textarea>
                  </div>

                  {/* Believe in Dargah/Fatiha/Niyah? */}
                  <div className="w-full col-span-3">
                    <label className="block text-sm font-medium text-[#ED58AC]">
                      Believe in Dargah/Fatiha/Niyah?
                    </label>
                    <div className="flex gap-4 mt-2">
                      <label>
                        <input
                          type="radio"
                          name="believeInDargah"
                          value="Yes"
                          required
                          className="mr-1"
                          checked={
                            formData.preferred_dargah_fatiha_niyah === "Yes"
                          }
                          disabled
                          onChange={(e) =>
                            handleFieldChange(
                              "preferred_dargah_fatiha_niyah",
                              e.target.value
                            )
                          }
                        />
                        Yes
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="believeInDargah"
                          value="No"
                          required
                          className="mr-1"
                          checked={
                            formData.preferred_dargah_fatiha_niyah === "No"
                          }
                          disabled
                          onChange={(e) =>
                            handleFieldChange(
                              "preferred_dargah_fatiha_niyah",
                              e.target.value
                            )
                          }
                        />
                        No
                      </label>
                    </div>
                  </div>
                </form>
              </div>

             
            </div>

         
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemProfile;
