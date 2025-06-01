import React from 'react';
import { useNavigate } from 'react-router-dom';
import { updateDataV2 } from '../../../apiUtils';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import TopBar from "../../sections/TopBar"
import Sidebar from "../../sections/Sidebar"
import ProfileSection from "../../sections/ProfileSection";
import StepTracker from '../../StepTracker/StepTracker';
import findUser from "../../../images/findUser.svg"

const MemStepFive = () => {

   

      const naviagteNextStep = () => {
        const parameters = {
            url: `/api/user/${userId}`,
            payload: {
        profile_visible: profileData.profile_visible,
        photo_upload_privacy_option: profileData.photo_upload_privacy_option
          },
          navigate: navigate,
          navUrl: `/memstepsix/${userId}`,
          setErrors: setErrors,
        };
    
        updateDataV2(parameters);
      };
    
      const updateField = (field, value) => {
        setProfileData((prevState) => ({
          ...prevState,
          [field]: value,
        }));
      };

      const skip = ()=>{
        navigate(`/memstepsix/${userId}`)
      }





      const [image, setImage] = useState(null);
      const [error, setError] = useState("");
      const [preview, setPreview] = useState("");
    
      const handleImageChange = (e) => {
        const file = e.target.files[0];
    
        if (!file) return;
    
        // Check file size
        if (file.size > 100 * 1024) {
          setError("Please upload an image less than 100KB.");
          return;
        }
    
        const img = new Image();
        img.src = URL.createObjectURL(file);
    
        img.onload = () => {
          // Check aspect ratio (square)
          if (img.width !== img.height) {
            setError("Please upload a square image.");
            return;
          }
    
          setError("");
          setImage(file);
          setPreview(img.src); // Set preview image
        };
      };
    
      const handleSave = () => {
        if (!image) {
          setError("Please upload an image before saving.");
          return;
        }
    
        setError("");
        console.log("Image saved:", image);
        alert("Image saved successfully!");
      };
    


    return (
        <div className="flex h-screen">

            <Sidebar/>

            {/* Main Content Area */}
            <main className="flex-1 bg-white">

                <TopBar/>




                
                <div className="main_section overflow-y-scroll ">
          <ProfileSection />

          <div className="form_container_user_creation h-auto bg-white pb-[12px] w-[83vw]">
            <div
              style={{
                height: "8rem",
                width: "95%",
                margin: "auto",
                border: "1.7px solid #ED58AC",
                borderRadius: "1rem",
                display: "flex",
                alignItems: "center",
                boxShadow: "0px 3px 3px gray",
              }}
            >
              <StepTracker percentage={20} />
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",
                margin: "2rem auto",
                justifyContent: "start",
                gap: "3rem",
                padding: " 0 2.5%",
              }}
            >
              <div style={{ width: "70%" }}>
                <form
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
                  <h4
                    className="col-span-3 mb-4"
                    style={{ fontWeight: "bold" }}
                  >
  Privacy & Security Settings             
   </h4>
   <div style={{ display: "flex", gap: "2rem" }}>
  <div className="w-[60%] mx-auto">
    <div style={{ display: "flex", alignItems: "center" }}>
      <img
        src={preview}
        alt="Preview"
        className="w-[8rem] h-[8rem] object-cover border rounded mr-[1rem]"
      />
      <div style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
        <label className="block text-[0.8rem] font-medium text-[#000000] mt-0 mb-[1.2rem]">
          Please upload square images (size less than 100KB)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4 w-full border rounded-[4px] p-2"
        />
        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mb-4 w-32 h-32 object-cover border rounded"
          />
        )}
      </div>
    </div>
    {/* <div className="flex justify-end">
      <button
        onClick={handleSave}
        className="bg-[#ED58AC] text-white px-4 py-2  rounded hover:bg-[#ffa4a4] focus:outline-none"
      >
        Save
      </button>
    </div> */}
  </div>
</div>

                  <div style={{ display: "flex", gap: "2rem" }}>
                  
                    <div className="w-[50%]  ">
                      <label className="block text-sm font-medium text-[#000000]">
                      Photo Privacy Option
                      </label>
                      <div className="mt-1 flex space-x-4">
                        <div className="flex items-center ">
                          <input
                            type="radio"
                            id="yes"
                            name="photoPrivacy"
                            value="yes"
                            required
                            checked={profileData.photo_privacy === "yes"}
                            className="h-4 w-4 text-[#000000] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                            onChange={(e) =>
                                updateField("photo_privacy", e.target.value)
                            }
                          />
                          <label
                            htmlFor="yes"
                            className="ml-2 text-sm text-[#000000]"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center ">
                          <input
                            type="radio"
                            id="no"
                            name="photoPrivacy"
                            value="no"
                            required
                            checked={profileData.photo_privacy === "no"}
                            className="h-4 w-4 text-[#000000] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                            onChange={(e) =>
                                updateField("photo_privacy", e.target.value)
                            }
                          />
                          <label
                            htmlFor="no"
                            className="ml-2 text-sm text-[#000000]"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </div>


<div className="w-[50%]">
                      <label
                        htmlFor="dob"
                        className="block text-sm font-medium text-[#000000]"
                      >
Profile Visibility                                        </label>
                                        <select
                                        id="profile_visibility "
                                        name="profile_visibility"
                                        required
                                        className="mt-1 px-[12px] text-[12px] h-[38px] w-full border rounded-[4px] border-[#ED58AC] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                                        onChange={(e) => updateField("profile_visibility", e.target.value)}

                                    >
                                        <option value="">Select Visiblity</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                    </div>

                 
                  </div>

             

                
                </form>
                <div style={{ display: "flex", justifyContent: "end" }}>
                  <button
                    onClick={naviagteNextStep}
                    className="button_base mt-[24px] h-[40px] w-[200px] rounded-[1rem]"
                  >
                    Save & continue
                  </button>
                </div>
                
              </div>
              <div
                style={{
                  border: "1.7px solid #ED58AC",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  height: "20rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                  width: "30%",
                }}
              >
                <button
                  style={{
                    height: "3.2rem",
                    width: "95%",
                    backgroundColor: "#ED58AC",
                    borderRadius: "0.3rem",
                    color: "white",
                    margin: "auto",
                  }}
                  onClick={skip}
                >
                  Save and Continue
                </button>
                <h4
                  style={{
                    textDecoration: "underline",
                    textUnderlineOffset: "0.5rem",
                    textDecorationColor: "gray",
                    textAlign: "center",
                    fontSize: "0.9rem",
                    color: "gray",
                  }}
                >
                  Why register with us?
                </h4>
                <div
                  style={{
                    fontSize: "0.9rem",
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    width: "80%",
                    margin: "auto",
                  }}
                >
                  <img
                    src={findUser}
                    alt=""
                    style={{ height: "2.5rem", width: "2.5rem" }}
                  />
                  <h4>All the profiles are verified personally</h4>
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    width: "80%",
                    margin: "auto",
                  }}
                >
                  <img
                    src={findUser}
                    alt=""
                    style={{ height: "2.5rem", width: "2.5rem" }}
                  />
                  <h4>All the profiles are verified personally</h4>
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    width: "80%",
                    margin: "auto",
                  }}
                >
                  <img
                    src={findUser}
                    alt=""
                    style={{ height: "2.5rem", width: "2.5rem" }}
                  />
                  <h4>All the profiles are verified personally</h4>
                </div>
              </div>
            </div>
          </div>
        </div>





               



            </main>

        </div>
    );
};

export default MemStepFive;