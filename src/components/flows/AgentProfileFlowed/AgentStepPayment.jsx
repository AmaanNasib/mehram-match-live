// import React from 'react';
// import { useNavigate } from 'react-router-dom';
import AgentPlanCards from '../../pages/LandingPage/AgentPlanCards';
// import TopBar from "../../sections/TopBar"
// import Sidebar from "../../sections/Sidebar"
// import ProfileSection from "../../sections/ProfileSection";


// const AgnStepFive = () => {

//     const navigate = useNavigate();

//     const naviagteNextStep = () => {
//         navigate("/agnstep-payment")
//     }

//     return (
//         <div className="flex h-screen">

//             <Sidebar/>


//             {/* Main Content Area */}
//             <main className="flex-1 bg-white">

//                 <TopBar/>

//                 <div className="main_section overflow-y-scroll ">

//                     <ProfileSection/>

//                     {/* Empty Section */}
//                     <div className="form_container_user_creation h-auto bg-white pb-[12px]">


//                         <div className="mem_form_con h-auto border-[1px] border-pink-200 rounded-md p-4 max-w-[600px] mx-auto relative ">

//                             <div className='h-auto w-auto absolute top-4 right-4 flex gap-2 ' >
//                                 <input type="checkbox" />
//                                 <label htmlFor="photo" className="block text-sm font-medium text-[#ED58AC]">
//                                     Skip
//                                 </label>
//                             </div>

//                             <form className="grid grid-cols-3 gap-2 ">

//                                 <h4 className='col-span-3 mb-4' >Choose Plan, Pay & Use</h4>

//                                 <AgentPlanCards />

//                             </form>

//                             <button onClick={naviagteNextStep} className="button_base mt-[24px]">
//                                 Save & Next
//                             </button>

//                         </div>

//                     </div>

//                 </div>



//             </main>

//         </div>
//     );
// };

// export default AgnStepFive;






import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { updateDataReturnId } from "../../../apiUtils";
import TopBar from "../../sections/TopBar";
import Sidebar from "../../sections/Sidebar";
import ProfileSection from "../../sections/ProfileSection";
import { fetchDataObjectV2 } from "../../../apiUtils";
import StepTracker from "../../StepTracker/StepTracker";
import findUser from "../../../images/findUser.svg";

const MemStepPayment = () => {
  const navigate = useNavigate();
  const [apiData, setApiData] = useState([]);
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const { agentId } = useParams();

  useEffect(() => {
    if (agentId) {
      const parameter = {
        url: `/api/user/${agentId}/`,
        setterFunction: setApiData,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataObjectV2(parameter);
    }
  }, [agentId]);

  useEffect(() => {
    if (apiData) {
      setProfileData({
        Education: apiData.Education || null,
        profession: apiData.profession || null,

      
      });
    }
  }, [apiData]);

  const naviagteNextStep = () => {
  
  };

  const skip = () => {
    navigate(`/dashboard`);
  };

  const handleFieldChange = (field, value) => {
    setProfileData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const [profileData, setProfileData] = useState({
    Education: "B.E",
    profession: "",
   
  });

  return (
    <div className="flex h-screen">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 bg-white">
        <TopBar />

        <div className="main_section overflow-y-scroll ">
          <ProfileSection />

          {/* Empty Section */}
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
              <StepTracker percentage={100} />
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
              <div style={{ width: "100%" }}>
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
                    Choose Plan
                  </h4>

                 
                   
<div style={{marginRight : '2rem'}}>
                  <AgentPlanCards />

</div>












                    

                </form>
                <div style={{ display: "flex", justifyContent: "end" }}>
                  <button
                    onClick={skip}
                    className="button_base mt-[24px] h-[40px] w-[200px] rounded-[1rem]"
                  >
                    Save & continue
                  </button>
                </div>
                {/* <button onClick={skip} className="button_base mt-[24px]">
                  Skip
                </button> */}
              </div>
              {/* <div
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
              </div> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemStepPayment;
