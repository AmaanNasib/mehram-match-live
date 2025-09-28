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
import MobileDashboard from "./MobileDashboard";

// Shimmer Loading Component
const ShimmerCard = () => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] rounded"></div>
        <div className="h-3 bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] rounded w-5/6"></div>
        <div className="h-3 bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] rounded w-4/6"></div>
      </div>
    </div>
  </div>
);

// Shimmer Loading for Profile Cards - Exact Flutter Homepage Style
  const ShimmerProfileCard = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-pulse w-full">
      <div className="h-64 bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] relative">
        <div className="absolute top-4 right-4 w-20 h-6 bg-white/30 rounded-full"></div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] rounded w-1/3"></div>
          <div className="h-7 w-7 bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] rounded-full"></div>
        </div>
        <div className="space-y-3 mb-5">
          <div className="h-4 bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] rounded w-2/3"></div>
          <div className="h-4 bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] rounded w-1/2"></div>
          <div className="h-4 bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] rounded w-3/4"></div>
        </div>
        <div className="h-10 bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] rounded-full"></div>
      </div>
    </div>
  );

const NewDashboard = () => {
  const location = useLocation();
  const lastSegment = location.pathname.split("/").pop();
  // Baseline datasets from backend
  const [apiData, setApiData] = useState([]); // trending baseline
  const [apiRecommend, setApiDataRecommend] = useState([]); // recommended baseline
  const [apiMember, setApiDataMember] = useState([]);
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [userDetail, setUserDetail] = useState([]); // all profiles baseline
  // Display datasets (what UI renders)
  const [displayTrending, setDisplayTrending] = useState([]);
  const [displayRecommended, setDisplayRecommended] = useState([]);
  const [displayAll, setDisplayAll] = useState([]);
  const [activeUser, setactiveUser] = useState({});
  const [successMessage, setMessage] = useState(false);
  const [userId] = useState(localStorage.getItem("userId"));
  const userData = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showWelcomeSection, setShowWelcomeSection] = useState(false);
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

  // When filters are applied from Sidebar, partition results into sections
  const handleFilterResults = (results) => {
    // If results is null, it means clear filters - reset to baseline data
    if (results === null) {
      setDisplayTrending(apiData);
      setDisplayRecommended(apiRecommend);
      setDisplayAll(userDetail);
      setFilterActive(false);
      setNoResults(false);
      return;
    }

    const rawList = Array.isArray(results) ? results : [];

    // Helpers: normalize user object and get id from any shape
    const normalize = (item) => (item && item.user ? item.user : item);
    const getId = (item) => normalize(item)?.id;

    const list = rawList.map(normalize).filter(Boolean);

    // Build baseline maps id -> baselineItem (keep original shape used by sections)
    const trendingMap = new Map();
    apiData.forEach((base) => {
      const id = getId(base);
      if (id != null) trendingMap.set(id, base);
    });
    const recommendedMap = new Map();
    apiRecommend.forEach((base) => {
      const id = getId(base);
      if (id != null) recommendedMap.set(id, base);
    });

    const inTrending = [];
    const inRecommended = [];
    const inAll = [];

    list.forEach((user) => {
      const id = user?.id;
      if (id == null) return;
      if (trendingMap.has(id)) {
        // Use baseline item (preserves props like profile_photo expected by cards)
        inTrending.push(trendingMap.get(id));
      } else if (recommendedMap.has(id)) {
        inRecommended.push(recommendedMap.get(id));
      } else {
        // All section expects plain user object
        inAll.push(user);
      }
    });

    setDisplayTrending(inTrending);
    setDisplayRecommended(inRecommended);
    setDisplayAll(inAll);

    setFilterActive(true);
    setNoResults(list.length === 0);
  };

  const [isOpenWindow, setIsModalOpen] = useState(false);
  const closeWindow = () => {
    setIsModalOpen(false);
  };

  // Commented out profile incomplete popup logic for now
  // const handPopup = () => {
  //   if (activeUser?.update_later === false) {
  //     if (
  //       activeUser?.profile_started === false ||
  //       activeUser?.profile_completed === false
  //     ) {
  //       setIsModalOpen(true);
  //     }
  //   }
  // };
  useEffect(() => {
    // handPopup(); // Commented out for now
    localStorage.setItem("gender", activeUser?.gender);
    localStorage.setItem("profile_completed", activeUser?.profile_completed);
  }, [activeUser]);

  // Check if user has seen welcome section before
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem(`welcome_seen_${userId}`);
    if (!hasSeenWelcome) {
      setShowWelcomeSection(true);
    }
  }, [userId]);

  // Function to hide welcome section permanently
  const hideWelcomeSection = () => {
    setShowWelcomeSection(false);
    localStorage.setItem(`welcome_seen_${userId}`, 'true');
  };

  useEffect(() => {
    const parameter = {
      url: role == "agent" ? `/api/agent/user_list/` : `/api/user/`,
      setterFunction: (data) => {
        setUserDetail(data);
        if (!filterActive) setDisplayAll(data);
      },
      setErrors: setErrors,
      setLoading: setLoading,
    };
    fetchDataWithTokenV2(parameter);
  }, []);

  useEffect(() => {
    const parameter = {
      url: role==="agent"?`/api/trending_profiles_by_interest/`:`/api/trending_profile/?user_id=${userId}`,
      setterFunction: (data) => {
        setApiData(data);
        if (!filterActive) setDisplayTrending(data);
      },
      setErrors: setErrors,
      setLoading: setLoading,
    };
    fetchDataWithTokenV2(parameter);
    }, [userId]);

useEffect(() => {
  if (role === "agent") return;
    const parameter1 = {
      url: `/api/user/recommend/?user_id=${userId}`,
      setterFunction: (data) => {
        setApiDataRecommend(data);
        if (!filterActive) setDisplayRecommended(data);
      },
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
  // Commented out navigation prevention logic for now
  // useEffect(() => {
  //   const handleButtonClick = (event) => {
  //     const link = event.target.closest("a");
  //     const button = event.target.closest("button");
  //     if ((link || button) && !activeUser?.profile_completed) {
  //       event.preventDefault();
  //       event.stopPropagation();
  //       setIsModalOpen(true);
  //     }
  //   };
  //   const navEventContainer = document.querySelector(".nav-event");
  //   const dashboardContainer = document.querySelector(".dashboard-container");

  //   if (navEventContainer) {
  //     navEventContainer?.addEventListener("click", handleButtonClick);
  //   }
  //   if (dashboardContainer) {
  //     dashboardContainer?.addEventListener("click", handleButtonClick);
  //   }
  //   return () => {
  //     if (navEventContainer) {
  //       navEventContainer?.removeEventListener("click", handleButtonClick);
  //     }
  //     if (dashboardContainer) {
  //       dashboardContainer?.removeEventListener("click", handleButtonClick);
  //     }
  //   };
  // }, [activeUser]);
  // Mobile responsive check
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // For mobile devices, render MobileDashboard component
  if (isMobile) {
    return <MobileDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins'] overflow-x-hidden">
      {/* Header Section */}
      <Header
        apiData={activeUser}
        members={apiMember?.member || []}
        subNavActive={"newdashboard"}
      />
      
      {/* User Profile Completion Modal - Commented out for now */}
      {/* <UserPop
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
      /> */}

      {/* Main Dashboard Container - Desktop Style */}
      <div className="w-full px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Mobile Filter Toggle Button */}
          <div className="xl:hidden fixed top-24 right-4 z-50">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              {isSidebarOpen ? (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div 
              className="xl:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}

          {/* Sidebar Section */}
          <div className={`xl:w-80 w-full xl:relative fixed xl:translate-x-0 transition-transform duration-300 z-50 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } xl:block xl:top-auto top-0 left-0 h-full xl:h-auto xl:flex-shrink-0`}>
            <div className="xl:block h-full xl:h-auto">
              <Sidebar 
                setApiData={handleFilterResults} 
                onClose={() => setIsSidebarOpen(false)}
              />
            </div>
          </div>
          
          {/* Main Content Section - Exact Flutter Homepage Style */}
          <div className="flex-1 space-y-6 min-w-0 w-full">
            
            {/* Welcome Section - Flutter Homepage Style - Only show for first time */}
            {showWelcomeSection && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-xl font-bold text-white">
                        Welcome to Your Dashboard
                      </h1>
                      <p className="text-pink-100 text-sm mt-1">
                        Discover your perfect match with Mehram Match
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 rounded-full p-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      {/* Close Button */}
                      <button
                        onClick={hideWelcomeSection}
                        className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200"
                        title="Dismiss welcome message"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Content Sections */}
            {role !== "agent" && (
              <>
                {/* Trending Profiles Section - Exact Flutter Homepage Style */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#CB3B8B] to-[#F971BC] px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-white flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Trending Profiles
                      </h2>
                      
                    </div>
                  </div>
                  <div className="p-6">
                    {loading ? (
                      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                        {[...Array(4)].map((_, index) => (
                          <div key={index} className="flex-shrink-0 w-72">
                            <ShimmerProfileCard />
                          </div>
                        ))}
                      </div>
                    ) : (
                      noResults && filterActive ? (
                        <div className="text-center text-gray-500 py-8">
                          No profiles found for selected filters.
                        </div>
                      ) : (
                      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                <TrendingProfiles
                  setApiData={setApiData}
                  setIsModalOpen={setIsModalOpen}
                  isOpenWindow={isOpenWindow}
                  url={`/api/trending_profile/?user_id=${userId}`}
                  profiles={
                    Array.isArray(displayTrending) &&
                    displayTrending.every(
                      (item) => typeof item === "object" && item !== null
                    )
                      ? displayTrending
                      : []
                  }
                />
                      </div>
                      )
                    )}
                  </div>
                </div>

                {/* Recommended Profiles Section - Exact Flutter Homepage Style */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#DA73AD] to-[#FFA4D6] px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-white flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Recommended for You
                      </h2>
                   
                    </div>
                  </div>
                  <div className="p-6">
                    {loading ? (
                      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                        {[...Array(4)].map((_, index) => (
                          <div key={index} className="flex-shrink-0 w-72">
                            <ShimmerProfileCard />
                          </div>
                        ))}
                      </div>
                    ) : (
                      noResults && filterActive ? (
                        <div className="text-center text-gray-500 py-8">
                          No profiles found for selected filters.
                        </div>
                      ) : (
                      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                <RecommendedProfiles
                  setApiData={setApiDataRecommend}
                  setIsModalOpen={setIsModalOpen}
                  isOpenWindow={isOpenWindow}
                  url={`/api/user/recommend/?user_id=${userId}`}
                  profiles={
                    Array.isArray(displayRecommended) &&
                    displayRecommended.every(
                      (item) => typeof item === "object" && item !== null
                    )
                      ? displayRecommended
                      : []
                  }
                />
                      </div>
                      )
                    )}
                  </div>
                </div>
              </>
            )}

            {/* All Users Section - Exact Flutter Homepage Style */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#EB53A7] to-[#FF59B6] px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Browse All Profiles
                  </h2>
                 
                </div>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(12)].map((_, index) => (
                      <ShimmerProfileCard key={index} />
                    ))}
                  </div>
                ) : (
                  noResults && filterActive ? (
                    <div className="text-center text-gray-500 py-8">
                      No profiles found for selected filters.
                    </div>
                  ) : (
          <AllUser
            profiles={displayAll}
            setApiData={setUserDetail}
            isOpenWindow={isOpenWindow}
            url={`/api/user/`}
            setIsModalOpen={setIsModalOpen}
          />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default NewDashboard;
