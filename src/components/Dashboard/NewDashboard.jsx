import React, { useEffect } from "react";
import Sidebar from "./DSidebar/Sidebar";
import TrendingProfiles from "./TrendingProfiles/TrendingProfiles";
import Footer from "../sections/Footer";
import "./NewDashboard.css";
import Header from "./header/Header";
import { useState } from "react";
import {
  fetchDataV2,
  justUpdateDataV2,
  fetchDataWithTokenV2,
} from "../../apiUtils";
import { useLocation, useNavigate } from "react-router-dom";
import UserPop from "../sections/UserPop";
import DashboadrCard from "./dashboardCard/DashboardCard";

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
  const navigate = useNavigate();
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
    // Clear first-time login flag when user chooses to update later
    localStorage.setItem("isFirstTimeLogin", "false");
    localStorage.setItem("profileComplete", "false");
    
    // Use impersonated user ID if available, otherwise use current userId
    const currentUserId = localStorage.getItem('impersonating_user_id') || userId;
    const currentRole = localStorage.getItem('role');
    const isImpersonating = localStorage.getItem('is_agent_impersonating') === 'true';
    
    const parameters = {
      url: (currentRole == "agent" && !isImpersonating) ? `/api/agent/${currentUserId}/` : `/api/user/${currentUserId}/`,
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
    // Use impersonated user ID if available, otherwise use current userId
    const currentUserId = localStorage.getItem('impersonating_user_id') || userId;
    const currentRole = localStorage.getItem('role');
    const isImpersonating = localStorage.getItem('is_agent_impersonating') === 'true';
    
    const parameter = {
      url:
        (currentRole  === "agent" && !isImpersonating)
          ? `/api/agent/${currentUserId}/`
          : `/api/user/${currentUserId}/`,
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
    // Clear first-time login flag when popup is closed
    localStorage.setItem("isFirstTimeLogin", "false");
    setIsModalOpen(false);
  };

  // Profile incomplete popup logic for new users
  const handPopup = () => {
    // Check if user just registered/logged in for first time
    const isFirstTimeLogin = localStorage.getItem("isFirstTimeLogin");
    const profileComplete = localStorage.getItem("profileComplete") || activeUser?.profile_completed;
    
    console.log("Checking popup conditions:", {
      isFirstTimeLogin,
      profileComplete,
      updateLater: activeUser?.update_later,
      profileStarted: activeUser?.profile_started,
      activeUser
    });
    
    // Show popup for new users or users with incomplete profiles
    if (isFirstTimeLogin === "true" || 
        (activeUser?.update_later === false && 
         (activeUser?.profile_started === false || 
          activeUser?.profile_completed === false || 
          profileComplete === false || 
          profileComplete === "false"))) {
      console.log("Showing profile completion popup");
      setIsModalOpen(true);
    }
  };
  useEffect(() => {
    if (activeUser && Object.keys(activeUser).length > 0) {
      handPopup(); // Check if popup should be shown
      localStorage.setItem("gender", activeUser?.gender || "");
      localStorage.setItem("profile_completed", activeUser?.profile_completed?.toString() || "false");
      
      // Auto-close popup if profile becomes complete
      if (activeUser?.profile_completed === true && isOpenWindow) {
        console.log("Profile completed, closing popup");
        setIsModalOpen(false);
        localStorage.setItem("isFirstTimeLogin", "false");
        localStorage.setItem("profileComplete", "true");
      }
    }
  }, [activeUser, isOpenWindow]);

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
    const currentRole = localStorage.getItem('role');
    const isImpersonating = localStorage.getItem('is_agent_impersonating') === 'true';
    
    const parameter = {
      url: (currentRole == "agent" && !isImpersonating) ? `/api/agent/user_list/` : `/api/user/`,
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
    // Use impersonated user ID if available, otherwise use current userId
    const currentUserId = localStorage.getItem('impersonating_user_id') || userId;
    const currentRole = localStorage.getItem('role');
    const isImpersonating = localStorage.getItem('is_agent_impersonating') === 'true';
    
    // If impersonating, use user endpoints; if agent, use agent endpoints
    const parameter = {
      url: (currentRole==="agent" && !isImpersonating) ? `/api/trending_profiles_by_interest/` : `/api/trending_profile/?user_id=${currentUserId}`,
      setterFunction: (data) => {
        console.log('Trending profiles data received:', data);
        console.log('Trending profiles count:', Array.isArray(data) ? data.length : 'Not an array');
        setApiData(data);
        if (!filterActive) setDisplayTrending(data);
      },
      setErrors: setErrors,
      setLoading: setLoading,
    };
    fetchDataWithTokenV2(parameter);
    }, [userId]);

useEffect(() => {
  const currentRole = localStorage.getItem('role');
  const isImpersonating = localStorage.getItem('is_agent_impersonating') === 'true';
  
  // Only skip if role is agent AND not impersonating
  if (currentRole === "agent" && !isImpersonating) return;
  
  // Use impersonated user ID if available, otherwise use current userId
  const currentUserId = localStorage.getItem('impersonating_user_id') || userId;
  
    const parameter1 = {
      url: `/api/user/recommend/?user_id=${currentUserId}`,
      setterFunction: (data) => {
        console.log('Recommended profiles data received:', data);
        console.log('Recommended profiles count:', Array.isArray(data) ? data.length : 'Not an array');
        setApiDataRecommend(data);
        if (!filterActive) setDisplayRecommended(data);
      },
      setErrors: setErrors,
      setLoading: setLoading,
    };
    fetchDataWithTokenV2(parameter1);
    }, [userId]);

    useEffect(() => {
        if (role === "individual" || role === "user") return;   // check with backend developer for unauthorized error
        
        // Only fetch agent members if role is agent (not when impersonating user)
        if (role === "agent") {
          const parameter2 = {
            url: `/api/agent/user_agent/?agent_id=${userId}`,
            setterFunction: setApiDataMember,
            setErrors: setErrors,
            setLoading: setLoading,
          };
          fetchDataWithTokenV2(parameter2);
        }
  }, [userId, role]);
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
  // Mobile responsive check removed - now using responsive design within the same component

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins'] overflow-x-hidden">
      {/* Header Section */}
      <Header
        apiData={activeUser}
        members={apiMember?.member || []}
        subNavActive={"newdashboard"}
      />
      
      {/* User Profile Completion Modal */}
      <UserPop
        updateLater={updateLater}
        isOpenWindow={isOpenWindow}
        closeWindow={closeWindow}
        showText={
          activeUser?.profile_started == true
            ? "You have not completed your profile"
            : "Complete your profile first to get better matches"
        }
        navTo={
          activeUser?.profile_started == true
            ? `/memstepone/`
            : (localStorage.getItem('role') || lastSegment) === "agent"
            ? `/agentstepone/${localStorage.getItem('impersonating_user_id') || userData}`
            : `/memstepone/`
        }
      />

      {/* Main Dashboard Container - Desktop Style */}
      <div className="w-full px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Mobile Filter Toggle Button */}
          <div className="xl:hidden fixed bottom-4 right-4 z-50">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-2 border-white"
              title={isSidebarOpen ? "Close Filters" : "Open Filters"}
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
                      <h1 className="text-lg sm:text-xl font-bold text-white">
                        Welcome to Your Dashboard
                      </h1>
                      <p className="text-pink-100 text-xs sm:text-sm mt-1">
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

            {/* Content Sections - Now available for both agents and regular users */}
            
            {/* Trending Profiles Section - Exact Flutter Homepage Style */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#CB3B8B] to-[#F971BC] px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Trending Profiles
                  </h2>
                  <button 
                    onClick={() => navigate('/viewalltrendingprofiles')}
                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm"
                  >
                    View All
                  </button>
                </div>
              </div>
              <div className="p-3 sm:p-4 md:p-6">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-h-[800px] overflow-y-auto scrollbar-hide">
                    {[...Array(8)].map((_, index) => (
                      <div key={index} className="h-fit">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-h-[800px] overflow-y-auto scrollbar-hide">
                    {displayTrending && displayTrending.length > 0 ? (
                      displayTrending.filter(profile => {
                        // Gender filtering: show opposite gender
                        const currentUserGender = activeUser?.gender;
                        const profileGender = profile.user?.gender || profile?.gender;
                        
                        // If current user is male, show female profiles and vice versa
                        if (currentUserGender === 'male' && profileGender === 'female') return true;
                        if (currentUserGender === 'female' && profileGender === 'male') return true;
                        
                        // If gender is not specified, show all profiles
                        if (!currentUserGender || !profileGender) return true;
                        
                        return false;
                      }).map((profile) => {
                        const user = profile && profile.user ? profile.user : profile;
                        const keyId = user?.id || profile?.id;
                        
                        return (
                          <div key={keyId} className="h-fit">
                            <DashboadrCard 
                              profile={user}
                              url={`/api/trending_profile/?user_id=${localStorage.getItem('impersonating_user_id') || userId}`}
                              interested_id={profile?.interested_id}
                              setApiData={setApiData}
                              IsInterested={profile?.is_interested}
                              activeUser={activeUser}
                            />
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center text-gray-500 py-8">No trending profiles found</p>
                    )}
                  </div>
                  )
                )}
              </div>
            </div>

            {/* Recommended Profiles Section - Only for regular users, not agents */}
            {role !== "agent" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-[#DA73AD] to-[#FFA4D6] px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Recommended for You
                  </h2>
                  <button 
                    onClick={() => navigate('/viewallrecommendedprofiles')}
                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm"
                  >
                    View All
                  </button>
                </div>
                </div>
                <div className="p-3 sm:p-4 md:p-6">
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-h-[800px] overflow-y-auto scrollbar-hide">
                      {[...Array(8)].map((_, index) => (
                        <div key={index} className="h-fit">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-h-[800px] overflow-y-auto scrollbar-hide">
                      {displayRecommended && displayRecommended.length > 0 ? (
                        displayRecommended.filter(profile => {
                          // Gender filtering: show opposite gender
                          const currentUserGender = activeUser?.gender;
                          const profileGender = profile.user?.gender || profile?.gender;
                          
                          // If current user is male, show female profiles and vice versa
                          if (currentUserGender === 'male' && profileGender === 'female') return true;
                          if (currentUserGender === 'female' && profileGender === 'male') return true;
                          
                          // If gender is not specified, show all profiles
                          if (!currentUserGender || !profileGender) return true;
                          
                          return false;
                        }).map((profile) => {
                          const user = profile && profile.user ? profile.user : profile;
                          const keyId = user?.id || profile?.id;
                          
                          return (
                            <div key={keyId} className="h-fit">
                              <DashboadrCard 
                                profile={user}
                                url={`/api/user/recommend/?user_id=${localStorage.getItem('impersonating_user_id') || userId}`}
                                interested_id={profile?.interested_id}
                                setApiData={setApiDataRecommend}
                                IsInterested={profile?.is_interested}
                                activeUser={activeUser}
                              />
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-center text-gray-500 py-8">No recommended profiles found</p>
                      )}
                    </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* All Users Section - Exact Flutter Homepage Style */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#EB53A7] to-[#FF59B6] px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Browse All Profiles
                  </h2>
                  <button 
                    onClick={() => navigate('/viewalluser')}
                    className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm"
                  >
                    View All
                  </button>
                </div>
              </div>
              <div className="p-3 sm:p-4 md:p-6">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-h-[800px] overflow-y-auto scrollbar-hide">
                    {[...Array(8)].map((_, index) => (
                      <div key={index} className="h-fit">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-h-[800px] overflow-y-auto scrollbar-hide">
                      {displayAll && displayAll.length > 0 ? (
                        displayAll.filter(profile => {
                          // Gender filtering: show opposite gender
                          const currentUserGender = activeUser?.gender;
                          const profileGender = profile.user?.gender || profile?.gender;
                          
                          // If current user is male, show female profiles and vice versa
                          if (currentUserGender === 'male' && profileGender === 'female') return true;
                          if (currentUserGender === 'female' && profileGender === 'male') return true;
                          
                          // If gender is not specified, show all profiles
                          if (!currentUserGender || !profileGender) return true;
                          
                          return false;
                        }).map((profile) => {
                          const user = profile && profile.user ? profile.user : profile;
                          const keyId = user?.id || profile?.id;
                          
                          return (
                            <div key={keyId} className="h-fit">
                              <DashboadrCard 
                                profile={user}
                                url={`/api/user/`}
                                interested_id={profile?.interested_id}
                                setApiData={setUserDetail}
                                IsInterested={profile?.is_interested}
                                activeUser={activeUser}
                                setIsModalOpen={setIsModalOpen}
                                isOpenWindow={isOpenWindow}
                              />
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-center text-gray-500 py-8">No profiles found</p>
                      )}
                    </div>
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
