import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { postDataReturnId } from "../../../apiUtils"; import TopBar from "../../sections/TopBar"
import Sidebar from "../../sections/Sidebar";
import dp_image from "../../../images/dp_image.png"
import ProfileSection from "../../sections/ProfileSection";

const Settings = () => {
    const navigate = useNavigate();
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
    });
    const [userId, setUserId] = useState();

    const [errors, setErrors] = useState();

    const naviagteNextStep = () => {
        const parameters = {
            url: "/api/user_profile/",
            payload: {
                first_name: profileData.first_name,
                last_name: profileData.last_name,
                dob: profileData.dob,
                gender: profileData.gender,
                martial_status: profileData.martial_status,
                city: profileData.city,
                state: profileData.state,
                country: profileData.country,
                native_country: profileData.native_country,
                native_city: profileData.native_city,
                native_state: profileData.native_state,
                Education: profileData.Education,
                profession: profileData.profession,
                about_you: profileData.about_you,
            },
            navigate: navigate,
            setUserId: setUserId,
            navUrl: `/memsteptwo`,
            setErrors: setErrors,
        };

        console.log(profileData.first_name + profileData.last_name + profileData.dob + profileData.gender + profileData.profession + profileData.about_you)
        //|| !profileData.city || !profileData.state || !profileData.country || !profileData.native_country || !profileData.native_city || !profileData.native_state || !profileData.Education ||  !profileData.martial_status 
        if (profileData.first_name && profileData.last_name && profileData.dob && profileData.gender && profileData.profession && profileData.about_you) {

            postDataReturnId(parameters);
        } else {
            alert("Make Sure you Filled All The Field");
        }


    };

    const skip = () => {
        if (profileData.first_name && profileData.last_name && profileData.dob && profileData.gender && profileData.profession && profileData.about_you) {

            navigate(`/memsteptwo/${userId}`)
        } else {
            alert("Make Sure you Filled All The Field");
        }
    }

    const updateField = (field, value) => {
        setProfileData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
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
                    <div className="form_container_user_creation h-auto bg-white pb-[12px]">

                        <div className="mem_form_con h-auto border-[1px] border-pink-200 rounded-md p-4 max-w-[600px] mx-auto relative ">


                            <form className=" grid grid-cols-3 gap-2 ">

                                <h4 className='col-span-3 mb-4' > Privacy & Security Settings </h4>

                                {/* Profile Visibility */}
                                <div className="w-[180px]">
                                    <label htmlFor="profileVisibility" className="block text-sm font-medium text-[#ED58AC]">
                                        Profile Visibility
                                    </label>
                                    <select
                                        id="profileVisibility"
                                        name="profileVisibility"
                                        required
                                        className="mt-1 px-[12px] text-[12px] h-[28px] w-full border rounded-[4px] border-[#FFC1E4] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                        onChange={(e) => updateField("profile_visible", e.target.value)}
                                    >
                                        <option value="">Select Visibility</option>
                                        <option value="Public">Public</option>
                                        <option value="Private">Private</option>
                                        <option value="Restricted">Restricted</option>
                                    </select>
                                </div>

                                {/* Photo Upload & Privacy Options */}
                                <div className="w-full col-span-3 ">
                                    <label className="block text-sm font-medium text-[#ED58AC]">
                                        Photo Upload & Privacy Options
                                    </label>
                                    <div className="mt-2 space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="photoPrivacy"
                                                value="Visible to Everyone"
                                                required
                                                className="mr-2"
                                                onChange={(e) => updateField("photo_upload_privacy_option", e.target.value)}
                                            />
                                            Visible to Everyone
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="photoPrivacy"
                                                value="Visible to Connections Only"
                                                required
                                                className="mr-2"
                                                onChange={(e) => updateField("photo_upload_privacy_option", e.target.value)}
                                            />
                                            Visible to Connections Only
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="photoPrivacy"
                                                value="Hidden from Everyone"
                                                required
                                                className="mr-2"
                                                onChange={(e) => updateField("photo_upload_privacy_option", e.target.value)}
                                            />
                                            Hidden from Everyone
                                        </label>
                                    </div>
                                </div>


                            </form>

                            <button
                                onClick={naviagteNextStep}
                                className="button_base mt-[24px] mr-[20px]"
                                disabled
                            >
                                Save Changes
                            </button>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;
