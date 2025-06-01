import React, { useEffect } from "react";
import Sidebar from "./DSidebar/Sidebar";
import TrendingProfiles from "./TrendingProfiles/TrendingProfiles";
import RecommendedProfiles from "./Recommended/RecommendedProfiles";
import Footer from "../sections/Footer";
import "./NewDashboard.css";
import Header from "./header/Header";
import { useState } from "react";
import {
  fetchDataV2,
  justUpdateDataV2,
  fetchDataWithTokenV2,
} from "../../apiUtils";
import AllUser from "./AllUsers/AllUser";
import { useLocation } from "react-router-dom";
import UserPop from "../sections/UserPop";

const NewDashboard = () => {
  const location = useLocation();
  const lastSegment = location.pathname.split("/").pop();
  const [apiData, setApiData] = useState([]);
  const [apiRecommend, setApiDataRecommend] = useState([]);
  const [apiMember, setApiDataMember] = useState([]);
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState([]);
  const [activeUser, setactiveUser] = useState({});
  const [successMessage, setMessage] = useState(false);
  const [userId] = useState(localStorage.getItem("userId"));
  const userData = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  // console.log(activeUser);

  const updateLater = () => {
    const parameters = {
      url: role == "agent" ? `/api/agent/${userId}/` : `/api/user/${userData}`,
      payload: { update_later: true },
      tofetch: {
        items: [
          {
            fetchurl: `/api/user/`,
            setterFunction: setApiData,
          },
        ],
      },
      setMessage: setMessage,
      setErrors: setErrors,
    };
    justUpdateDataV2(parameters);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const parameter = {
      url:
        role  === "agent"
          ? `/api/agent/${userId}/`
          : `/api/user/${userId}/`,
      setterFunction: setactiveUser,
      setErrors: setErrors,
    };
    fetchDataV2(parameter);
  }, []);

  const [isOpenWindow, setIsModalOpen] = useState(false);
  const closeWindow = () => {
    setIsModalOpen(false);
  };

  const handPopup = () => {
    if (activeUser?.update_later === false) {
      if (
        activeUser?.profile_started === false ||
        activeUser?.profile_completed === false
      ) {
        setIsModalOpen(true);
      }
    }
  };
  useEffect(() => {
    handPopup();
    localStorage.setItem("gender", activeUser?.gender);
    localStorage.setItem("profile_completed", activeUser?.profile_completed);
  }, [activeUser]);

  useEffect(() => {
    const parameter = {
      url: role == "agent" ? `/api/agent/user_list/` : `/api/user/`,
      setterFunction: setUserDetail,
      setErrors: setErrors,
      setLoading: setLoading,
    };
    fetchDataWithTokenV2(parameter);
  }, []);

  useEffect(() => {
    const parameter = {
      url: role==="agent"?`/api/trending_profiles_by_interest/`:`/api/trending_profile/?user_id=${userId}`,
      setterFunction: setApiData,
      setErrors: setErrors,
      setLoading: setLoading,
    };
    fetchDataWithTokenV2(parameter);
    }, [userId]);

useEffect(() => {
  if (role === "agent") return;
    const parameter1 = {
      url: `/api/user/recommend/?user_id=${userId}`,
      setterFunction: setApiDataRecommend,
      setErrors: setErrors,
      setLoading: setLoading,
    };
    fetchDataWithTokenV2(parameter1);
    }, [userId]);

    useEffect(() => {
        if (role === "individual") return;   // check with backend developer for unauthorized error
    const parameter2 = {
      url: `/api/agent/user_agent/?agent_id=${userId}`,
      setterFunction: setApiDataMember,
      setErrors: setErrors,
      setLoading: setLoading,
    };
    fetchDataWithTokenV2(parameter2);
  }, [userId]);
  useEffect(() => {
    const handleButtonClick = (event) => {
      const link = event.target.closest("a");
      const button = event.target.closest("button");
      if ((link || button) && !activeUser?.profile_completed) {
        event.preventDefault();
        event.stopPropagation();
        setIsModalOpen(true);
      }
    };
    const navEventContainer = document.querySelector(".nav-event");
    const dashboardContainer = document.querySelector(".dashboard-container");

    if (navEventContainer) {
      navEventContainer?.addEventListener("click", handleButtonClick);
    }
    if (dashboardContainer) {
      dashboardContainer?.addEventListener("click", handleButtonClick);
    }
    return () => {
      if (navEventContainer) {
        navEventContainer?.removeEventListener("click", handleButtonClick);
      }
      if (dashboardContainer) {
        dashboardContainer?.removeEventListener("click", handleButtonClick);
      }
    };
  }, [activeUser]);
  return (
    <div className="dashboard" style={{display:"flex",flexDirection:"column",gap:"20px"}}>
      <Header
        apiData={activeUser}
        members={apiMember?.member || []}
        subNavActive={"newdashboard"}
      />
      <UserPop
        updateLater={updateLater}
        isOpenWindow={isOpenWindow}
        closeWindow={closeWindow}
        showText={
          activeUser?.profile_started == true
            ? "you have not completed your profile "
            : "complete your profile first"
        }
        navTo={
          activeUser?.profile_started == true
            ? `/memstepone/`
            : (role || lastSegment) === "agent"
            ? `/agentstepone/${userData}`
            : `/memstepone/`
        }
      />

      <div className="dashboard-container" style={{height:"auto",padding:"0",width:"100%",gap:"20px"}}>
        
          <Sidebar setApiData={setUserDetail} />
        
        <div className="users" style={{height:"auto",display:"flex",flexDirection:"column",gap:"20px",width:"calc(100% - 300px)"}} >
          <>
            {role !== "agent" && (
              <>
                <TrendingProfiles
                  setApiData={setApiData}
                  setIsModalOpen={setIsModalOpen}
                  isOpenWindow={isOpenWindow}
                  url={`/api/trending_profile/?user_id=${userId}`}
                  profiles={
                    Array.isArray(apiData) &&
                    apiData.every(
                      (item) => typeof item === "object" && item !== null
                    )
                      ? apiData
                      : []
                  }
                />

                <RecommendedProfiles
                  setApiData={setApiDataRecommend}
                  setIsModalOpen={setIsModalOpen}
                  isOpenWindow={isOpenWindow}
                  url={`/api/user/recommend/?user_id=${userId}`}
                  profiles={
                    Array.isArray(apiRecommend) &&
                    apiRecommend.every(
                      (item) => typeof item === "object" && item !== null
                    )
                      ? apiRecommend
                      : []
                  }
                />
              </>
            )}
          </>

          <AllUser
            profiles={userDetail}
            setApiData={setUserDetail}
            isOpenWindow={isOpenWindow}
            url={`/api/user/`}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      </div>
      <div style={{ marginTop: "4vh" }}>
        <Footer />
      </div>
    </div>
  );
};

export default NewDashboard;
