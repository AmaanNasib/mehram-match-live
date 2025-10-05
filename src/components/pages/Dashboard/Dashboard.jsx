import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { postDataReturnId } from "../../../apiUtils"; import TopBar from "../../sections/TopBar"
import Sidebar from "../../sections/Sidebar";
import ProfileCard from "../../elements&widgets/ProfileCard";
import ProfileCardYLM from "../../elements&widgets/ProfileCardYML";
import { fetchDataV2, justUpdateDataV2 } from "../../../apiUtils";
import Window from "./Window"
import UserPop from "../../sections/UserPop";
import StepTracker from "../../StepTracker/StepTracker";
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
    const lastSegment = location.pathname.split('/').pop(); // "agnstepfour"





 
  const [activeUser, setactiveUser] = useState();
  const [successMessage, setMessage] = useState(false);


  const [apiData, setApiData] = useState([]);
  const [errors, setErrors] = useState(false);
  



  const updateLater =()=>{
    const parameters = {
      url: `/api/user/${userData}`,
      payload: {
      
        update_later : true,
      },
      tofetch:{
        items : [
          {
            fetchurl :  `/api/user/`,
            setterFunction : setApiData
          }
        ]
          
      },
      setMessage: setMessage,
      setErrors: setErrors,
    };

    justUpdateDataV2(parameters);
    setIsModalOpen(false);
  }

const userData=localStorage.getItem("userId");
  useEffect(() => {
    const parameter = {
      url: `/api/user/${userData}/`,
      setterFunction: setactiveUser,
      setErrors : setErrors
    }
    fetchDataV2(parameter)
  }, [])



  useEffect(() => {
    const parameter = {
      url: "/api/user/",
      setterFunction: setApiData,
      setErrors : setErrors
    }
    fetchDataV2(parameter)
  }, [])

  const [isOpenWindow, setIsModalOpen] = useState(false);
  const closeWindow = () => {
    setIsModalOpen(false);
  };

  useEffect(()=>{
    if(activeUser?.update_later == false){
    if(activeUser?.profile_started == false || activeUser?.profile_completed == false){
      setIsModalOpen(true)
  }
}
  },[activeUser]);
  return (
    <div className="flex h-screen">

      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 bg-white overflow-hidden ">

        <TopBar />
        {/* <Window isOpenWindow={isOpenWindow} closeWindow={closeWindow} showText={activeUser?.profile_started == true ? "you have not completed you profile " : "complete your profile first"} navTo={activeUser?.profile_started == true ? `/users/${userData}` : `/memstepone/${userData}`}/> */}
          <UserPop updateLater ={updateLater} isOpenWindow={isOpenWindow} closeWindow={closeWindow} showText={activeUser?.profile_started == true ? "you have not completed your profile " : "complete your profile first"} navTo={activeUser?.profile_started == true ? `/users/${userData}` :lastSegment === "agent" ? `/agnstepone/${userData}`: `/memstepone/${userData}`} />
        <div className="main_section overflow-y-scroll ">

          <header className="flex flex-col justify-between items-start mb-6">
            <h1 className="text-lg font-bold text-black">Recommended Profiles</h1>

            <p className=" w-[350px] mt-2 text-sm font-medium text-black">The profile creation process leads you to better search results and recommended profiles.</p>
          </header>

          <section className=" min-h-[160px] w-full pr-4 bg-white flex items-center gap-4 overflow-y-scroll " >
            <ProfileCard/>
            <ProfileCard/>
            <ProfileCard/>
            <ProfileCard/>
            <ProfileCard/>
          </section>

          <header className="flex flex-col justify-between items-start my-6">
            <h1 className="text-lg font-bold text-black">Profile you may like</h1>
            <p className=" w-[350px] mt-2 text-sm font-medium text-black">To achieve more personalized suggestion complete your profile.</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
  {apiData.map((user) => (
    <ProfileCardYLM
      key={user.userId}
      userId={user.userId}
      name={user.name}
      age={user.age}
      city={user.city}
      activeUser={activeUser}
      profile={user}
    />
  ))}

         


            {/* <div className="bg-[#FFF3FA] min-w-[250px] min-h-[120px] rounded-lg shadow p-4 flex flex-col justify-between">
              <h3 className="font-semibold text-[#9E286A]">John Doe</h3>
              <p className="text-sm text-gray-600">01-01-1990</p>
              <p className="text-sm text-gray-600">Male</p>
              <p className="text-sm text-gray-600">Single</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
              <h3 className="font-semibold text-[#9E286A]">Jane Smith</h3>
              <p className="text-sm text-gray-600">15-05-1985</p>
              <p className="text-sm text-gray-600">Female</p>
              <p className="text-sm text-gray-600">Married</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
              <h3 className="font-semibold text-[#9E286A]">Alex Johnson</h3>
              <p className="text-sm text-gray-600">20-09-1992</p>
              <p className="text-sm text-gray-600">Non-binary</p>
              <p className="text-sm text-gray-600">Single</p>
            </div> */}

          </section>


        </div>
      </main>
    </div>
  );
};

export default Dashboard;
