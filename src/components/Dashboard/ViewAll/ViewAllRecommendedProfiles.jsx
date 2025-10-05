import React, { useEffect, useState } from "react";
import {
  fetchDataV2,
  fetchDataWithTokenV2,
  postDataWithFetchV2,
  putDataWithFetchV2,
} from "../../../apiUtils";
import { FiHeart } from "react-icons/fi";
import { BsPerson } from "react-icons/bs";
import { FaListUl } from "react-icons/fa";
import { PiProhibitBold } from "react-icons/pi";
import Header from "../header/Header";
import Sidebar from "../DSidebar/Sidebar";
import Footer from "../../sections/Footer";
import { useNavigate } from "react-router-dom";
import DashboadrCard from "../dashboardCard/DashboardCard";

const ViewAllRecommendedProfiles = () => {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const [recommendedProfiles, setRecommendedProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [interestStatus, setInterestStatus] = useState({}); // Track interest status for each user
  const [shortlistStatus, setShortlistStatus] = useState({}); // Track shortlist status for each user
  const [ignoredUsers, setIgnoredUsers] = useState(new Set()); // Track ignored users (lifetime block)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showIgnoreModal, setShowIgnoreModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  const [activeUser, setactiveUser] = useState({});
  const [apiMember, setApiDataMember] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Function to reload original data
  const reloadOriginalData = () => {
    console.log('Reloading original recommended data - clearing filters');
    setLoading(true);
    setErrors(null);
    const parameter = {
      url: `/api/user/recommend/?user_id=${userId}`,
      setterFunction: (data) => {
        console.log('Original recommended data reloaded:', data);
        setRecommendedProfiles(data);
        setLoading(false);
      },
      setErrors: setErrors,
      setLoading: setLoading,
    };
    fetchDataWithTokenV2(parameter);
  };

  useEffect(() => {
    const parameter = {
      url: `/api/user/recommend/?user_id=${userId}`,
      setterFunction: setRecommendedProfiles,
      setErrors: setErrors,
      setLoading: setLoading,
    };
    fetchDataWithTokenV2(parameter);
  }, [userId, role]);

  useEffect(() => {
    const parameter = {
      url: role === "agent" ? `/api/agent/${userId}/` : `/api/user/${userId}/`,
      setterFunction: setactiveUser,
      setErrors: setErrors,
    };
    fetchDataV2(parameter);
  }, []);

  useEffect(() => {
    if (role === "individual") return; // check with backend developer for unauthorized error
    const parameter2 = {
      url: `/api/agent/user_agent/?agent_id=${userId}`,
      setterFunction: setApiDataMember,
      setErrors: setErrors,
      setLoading: setLoading,
    };
    fetchDataWithTokenV2(parameter2);
  }, []);

  const handleInterestClick = (actionOnId) => {
    // Check if interest already sent
    if (interestStatus[actionOnId]) {
      // Show withdraw modal
      setSelectedUserId(actionOnId);
      setShowWithdrawModal(true);
      return;
    }

    const parameter = {
      url: role === "agent" ? "/api/agent/interest/" : `/api/recieved/`,
      payload: {
        action_by_id: userId,
        action_on_id: actionOnId,
        interest: true,
      },
      setErrors: setErrors,
      tofetch: {
        items: [
          {
            fetchurl: `/api/user/recommend/?user_id=${userId}`,
            dataset: setRecommendedProfiles,
            setSuccessMessage: setSuccessMessage,
            setErrors: setErrors,
          },
        ],
        setSuccessMessage: setSuccessMessage,
        setErrors: setErrors,
      },
    };

    // Update interest status immediately
    setInterestStatus(prev => ({
      ...prev,
      [actionOnId]: true
    }));

    postDataWithFetchV2(parameter);
  };

  const handleWithdrawInterest = () => {
    if (!selectedUserId) return;

    const parameter = {
      url: role === "agent" ? "/api/agent/interest/" : `/api/recieved/`,
      payload: {
        action_by_id: userId,
        action_on_id: selectedUserId,
        interest: false,
      },
      setErrors: setErrors,
      tofetch: {
        items: [
          {
            fetchurl: `/api/user/recommend/?user_id=${userId}`,
            dataset: setRecommendedProfiles,
            setSuccessMessage: setSuccessMessage,
            setErrors: setErrors,
          },
        ],
        setSuccessMessage: setSuccessMessage,
        setErrors: setErrors,
      },
    };

    // Update interest status
    setInterestStatus(prev => ({
      ...prev,
      [selectedUserId]: false
    }));

      postDataWithFetchV2(parameter);

    // Close modal
    setShowWithdrawModal(false);
    setSelectedUserId(null);
  };

  const handleShortlistClick = (actionOnId) => {
    // Check if already shortlisted
    if (shortlistStatus[actionOnId]) {
      // Remove from shortlist
      setShortlistStatus(prev => ({
        ...prev,
        [actionOnId]: false
      }));
    } else {
      // Add to shortlist
      setShortlistStatus(prev => ({
        ...prev,
        [actionOnId]: true
      }));
    }

    const parameter = {
      url: role === "agent" ? "/api/agent/shortlist/" : `/api/recieved/`,
      payload: {
        action_by_id: userId,
        action_on_id: actionOnId,
        shortlisted: !shortlistStatus[actionOnId],
      },
      setErrors: setErrors,
      tofetch: {
        items: [
          {
            fetchurl: `/api/user/recommend/?user_id=${userId}`,
            dataset: setRecommendedProfiles,
            setSuccessMessage: setSuccessMessage,
            setErrors: setErrors,
          },
        ],
        setSuccessMessage: setSuccessMessage,
        setErrors: setErrors,
      },
    };

    postDataWithFetchV2(parameter);
  };

  const handleIgnoreClick = (actionOnId) => {
    // Show ignore confirmation modal
    setSelectedUserId(actionOnId);
    setShowIgnoreModal(true);
  };

  const handleConfirmIgnore = () => {
    if (!selectedUserId) return;

    // Add to ignored users (lifetime block)
    setIgnoredUsers(prev => new Set([...prev, selectedUserId]));

    const parameter = {
      url: role === "agent" ? "/api/agent/ignore/" : `/api/ignore/`,
      payload: {
        action_by_id: userId,
        action_on_id: selectedUserId,
        ignored: true,
      },
      setErrors: setErrors,
      tofetch: {
        items: [
          {
            fetchurl: `/api/user/recommend/?user_id=${userId}`,
            dataset: setRecommendedProfiles,
            setSuccessMessage: setSuccessMessage,
            setErrors: setErrors,
          },
        ],
        setSuccessMessage: setSuccessMessage,
        setErrors: setErrors,
      },
    };

    postDataWithFetchV2(parameter);

    // Close modal
    setShowIgnoreModal(false);
    setSelectedUserId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Header
        apiData={activeUser}
        members={apiMember?.member || []}
        subNavActive={"newdashboard"}
      />
      
      {/* Main Content with Sidebar */}
      <div className="flex flex-col lg:flex-row gap-4 w-full max-w-full overflow-hidden">
        
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
          <div className="xl:block h-full xl:h-auto xl:ml-4 xl:mt-4 xl:mb-8" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            <Sidebar 
              setApiData={setRecommendedProfiles} 
              onClose={() => setIsSidebarOpen(false)}
              reloadOriginalData={reloadOriginalData}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 xl:ml-4 overflow-hidden">
          {/* Header Section */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Browse Recommended Profiles
            </h1>
            <p className="text-gray-600 text-sm">
              Discover recommended profiles and find your perfect match from our community
            </p>
          </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              <p className="text-gray-600 font-medium">Loading recommended profiles...</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-8">
            <div className="text-green-600 font-semibold text-lg mb-2">Success!</div>
            <p className="text-green-500">{successMessage}</p>
          </div>
        )}

        {/* Error State */}
      {errors && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-8">
            <div className="text-red-600 font-semibold text-lg mb-2">Oops! Something went wrong</div>
            <p className="text-red-500">{errors.message || "An error occurred while loading recommended profiles"}</p>
          </div>
      )}

        {/* Empty State */}
      {!loading && recommendedProfiles && recommendedProfiles.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No recommended profiles found</h3>
              <p className="text-gray-600">We couldn't find any recommended profiles matching your criteria. Try adjusting your filters.</p>
            </div>
          </div>
        )}

          {/* Professional Profile Cards Grid */}
          {!loading && recommendedProfiles && recommendedProfiles.length > 0 && (
            <div className="space-y-8">
            

              {/* Multi-Row Profile Grid */}
              <div className="space-y-6">
                {(() => {
                  const filteredProfiles = recommendedProfiles.filter(profile => {
                    // Filter out ignored users
                    if (ignoredUsers.has(profile.user?.id)) return false;
                    
                    // Gender filtering: show opposite gender
                    const currentUserGender = activeUser?.gender;
                    const profileGender = profile.user?.gender || profile?.gender;
                    
                    // If current user is male, show female profiles and vice versa
                    if (currentUserGender === 'male' && profileGender === 'female') return true;
                    if (currentUserGender === 'female' && profileGender === 'male') return true;
                    
                    // If gender is not specified, show all profiles
                    if (!currentUserGender || !profileGender) return true;
                    
                    return false;
                  });

                  // Create chunks of profiles for multiple rows (5 profiles per row)
                  const profilesPerRow = 5;
                  const rows = [];
                  for (let i = 0; i < filteredProfiles.length; i += profilesPerRow) {
                    rows.push(filteredProfiles.slice(i, i + profilesPerRow));
                  }

                  return rows.map((rowProfiles, rowIndex) => (
                    <div key={rowIndex} className="relative">
                      {/* Profile Cards Frame Container */}
                      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
                        {/* Frame Header */}
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-lg font-semibold text-gray-800">Profiles</h4>
                          </div>
                          <div className="text-sm text-gray-500">
                            {rowProfiles.length} profiles
                          </div>
                        </div>

                        {/* Horizontal Scrollable Row */}
                        <div className="relative group">
                        <div
                          className="horizontal-scroll-row flex gap-12 overflow-x-auto overflow-y-hidden scroll-smooth pb-4"
                          style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            WebkitOverflowScrolling: 'touch',
                            maxWidth: '100%',
                            width: '100%'
                          }}
                          onScroll={(e) => {
                            e.stopPropagation();

                            const container = e.target;
                            const scrollLeft = container.scrollLeft;
                            const scrollWidth = container.scrollWidth;
                            const clientWidth = container.clientWidth;

                            // Show/hide navigation buttons for this row
                            const leftBtn = container.parentElement.querySelector('.scroll-btn-left');
                            const rightBtn = container.parentElement.querySelector('.scroll-btn-right');

                            if (leftBtn) {
                              leftBtn.style.opacity = scrollLeft > 0 ? '1' : '0.3';
                              leftBtn.style.pointerEvents = scrollLeft > 0 ? 'auto' : 'none';
                            }

                            if (rightBtn) {
                              const canScrollRight = scrollLeft < scrollWidth - clientWidth - 10;
                              rightBtn.style.opacity = canScrollRight ? '1' : '0.3';
                              rightBtn.style.pointerEvents = canScrollRight ? 'auto' : 'none';
                            }
                          }}
                          onWheel={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            const container = e.currentTarget;
                            const scrollAmount = e.deltaY * 1.5;
                            container.scrollLeft += scrollAmount;
                          }}
                          onTouchStart={(e) => {
                            e.stopPropagation();
                          }}
                          onTouchMove={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {rowProfiles.map((profile, index) => {
                            const user = profile && profile.user ? profile.user : profile;
                            const keyId = user?.id || profile?.id;
                            return (
                              <div key={keyId} className="flex-shrink-0 w-72 max-w-72 transform transition-all duration-300 hover:scale-105 hover:z-10">
                                <div className="relative">
                                  {/* Profile Number Badge */}
                                  <div className="absolute top-3 left-3 z-10">
                                    <span className="bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                                      #{rowIndex * profilesPerRow + index + 1}
                                    </span>
                                  </div>
                                  
                                  <DashboadrCard
                                    profile={user}
                                    url={`/api/user/recommend/?user_id=${userId}`}
                                    interested_id={profile?.interested_id}
                                    setApiData={setRecommendedProfiles}
                                    IsInterested={profile?.is_interested}
                                    activeUser={activeUser}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Row Navigation Buttons */}
                        <button
                          className="scroll-btn-left absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-3 shadow-xl transition-all duration-300 z-20 opacity-30 pointer-events-none group-hover:opacity-100"
                          style={{
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                            backdropFilter: 'blur(10px)'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const container = e.target.closest('.relative').querySelector('.horizontal-scroll-row');
                            if (container) {
                              container.scrollBy({ left: -320, behavior: 'smooth' });
                            }
                          }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6"/>
                          </svg>
                        </button>

                        <button
                          className="scroll-btn-right absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-3 shadow-xl transition-all duration-300 z-20 opacity-30 pointer-events-none group-hover:opacity-100"
                          style={{
                            width: '48px',
                            height: '48px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                            backdropFilter: 'blur(10px)'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const container = e.target.closest('.relative').querySelector('.horizontal-scroll-row');
                            if (container) {
                              container.scrollBy({ left: 320, behavior: 'smooth' });
                            }
                          }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6"/>
                          </svg>
                        </button>

                          {/* Row Scroll Indicator */}
                          <div className="flex justify-center mt-4 space-x-2">
                            {Array.from({ length: Math.ceil(rowProfiles.length / 4) }, (_, i) => (
                              <div key={i} className="w-2 h-2 bg-gray-300 rounded-full"></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-600 mb-1">
                      {recommendedProfiles.length}
                    </div>
                    <div className="text-gray-600">Total Profiles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      {Math.ceil(recommendedProfiles.length / 4)}
                    </div>
                    <div className="text-gray-600">Profile Rows</div>
                  </div>
                </div>
              </div>

              {/* Custom Styles */}
              <style jsx>{`
                .horizontal-scroll-row::-webkit-scrollbar {
                  display: none;
                }
                .horizontal-scroll-row {
                  -webkit-overflow-scrolling: touch;
                }
                
                /* Smooth hover effects */
                .horizontal-scroll-row > div {
                  transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .horizontal-scroll-row > div:hover {
                  transform: translateY(-5px);
                  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                }
              `}</style>
            </div>
          )}

          </div>
      </div>
      
      {/* Footer */}
      <Footer />

      {/* Withdraw Interest Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-pink-100 mb-4">
                <svg className="h-6 w-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Withdraw Interest</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to withdraw your interest? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowWithdrawModal(false);
                    setSelectedUserId(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdrawInterest}
                  className="flex-1 bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-700 transition-colors"
                >
                  Withdraw Interest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ignore Confirmation Modal */}
      {showIgnoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ignore User</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to ignore this user? This action will permanently hide their profile from you and cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowIgnoreModal(false);
                    setSelectedUserId(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmIgnore}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Ignore User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllRecommendedProfiles;

