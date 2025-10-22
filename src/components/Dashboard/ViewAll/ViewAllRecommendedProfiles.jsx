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
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 15;

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

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
          <div className="xl:block h-full xl:h-auto xl:ml-4 xl:mt-4 xl:mb-8">
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
                  console.log('Filtering recommended profiles - Role:', role);
                  console.log('Total profiles before filtering:', recommendedProfiles?.length);
                  console.log('Ignored users:', Array.from(ignoredUsers));
                  
                  const filteredProfiles = recommendedProfiles.filter(profile => {
                    // Filter out ignored users
                    if (ignoredUsers.has(profile.user?.id)) return false;
                    
                    // Check if user is agent and not impersonating
                    const currentRole = localStorage.getItem('role');
                    const isImpersonating = localStorage.getItem('is_agent_impersonating') === 'true';
                    
                    if (currentRole === 'agent' && !isImpersonating) {
                      return true; // Show all profiles for agents
                    }
                    
                    // Gender filtering: show opposite gender for regular users
                    const currentUserGender = activeUser?.gender;
                    const profileGender = profile.user?.gender || profile?.gender;
                    
                    // If current user is male, show female profiles and vice versa
                    if (currentUserGender === 'male' && profileGender === 'female') return true;
                    if (currentUserGender === 'female' && profileGender === 'male') return true;
                    
                    // If gender is not specified, show all profiles
                    if (!currentUserGender || !profileGender) return true;
                    
                    return false;
                  });
                  
                  console.log('Total profiles after filtering:', filteredProfiles?.length);

                  // Pagination calculation
                  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);
                  const startIndex = (currentPage - 1) * profilesPerPage;
                  const endIndex = startIndex + profilesPerPage;
                  const currentProfiles = filteredProfiles.slice(startIndex, endIndex);

                  return (
                    <>
                      {/* Profile Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {currentProfiles.map((profile, index) => {
                          const user = profile && profile.user ? profile.user : profile;
                          const keyId = user?.id || profile?.id;
                          return (
                            <div key={keyId} className="transform transition-all duration-300 hover:scale-105 h-fit">
                              <DashboadrCard
                                profile={user}
                                url={`/api/user/recommend/?user_id=${userId}`}
                                interested_id={profile?.interested_id}
                                setApiData={setRecommendedProfiles}
                                IsInterested={profile?.is_interested}
                                activeUser={activeUser}
                              />
                            </div>
                          );
                        })}
                      </div>

                    </>
                  );
                })()}
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
                
                /* Custom scrollbar for main content */
                .main-content-scroll {
                  scrollbar-width: thin;
                  scrollbar-color: #FF59B6 #f1f1f1;
                }
                
                .main-content-scroll::-webkit-scrollbar {
                  width: 12px;
                }
                
                .main-content-scroll::-webkit-scrollbar-track {
                  background: #f1f1f1;
                  border-radius: 6px;
                  margin: 4px;
                }
                
                .main-content-scroll::-webkit-scrollbar-thumb {
                  background: #FF59B6;
                  border-radius: 6px;
                  border: 2px solid #f1f1f1;
                }
                
                .main-content-scroll::-webkit-scrollbar-thumb:hover {
                  background: #EB53A7;
                }
                
                .main-content-scroll::-webkit-scrollbar-corner {
                  background: #f1f1f1;
                }
              `}</style>
            </div>
          )}

          </div>
      </div>

      {/* Pagination - Outside main content area for full page centering */}
      {!loading && recommendedProfiles && recommendedProfiles.length > 0 && (() => {
        const filteredProfiles = recommendedProfiles.filter(profile => {
          if (ignoredUsers.has(profile.user?.id)) return false;
          
          // Check if user is agent and not impersonating
          const currentRole = localStorage.getItem('role');
          const isImpersonating = localStorage.getItem('is_agent_impersonating') === 'true';
          
          if (currentRole === 'agent' && !isImpersonating) {
            return true; // Show all profiles for agents
          }
          
          const currentUserGender = activeUser?.gender;
          const profileGender = profile.user?.gender || profile?.gender;
          
          if (currentUserGender === 'male' && profileGender === 'female') return true;
          if (currentUserGender === 'female' && profileGender === 'male') return true;
          if (!currentUserGender || !profileGender) return true;
          return false;
        });
        
        const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);
        const startIndex = (currentPage - 1) * profilesPerPage;
        const endIndex = startIndex + profilesPerPage;
        
        return totalPages > 1 ? (
          <div className="w-full flex flex-col items-center py-8 bg-gray-50">
            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => {
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                  scrollToTop();
                }}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] text-white hover:from-[#F971BC] hover:to-[#DA73AD] shadow-lg hover:shadow-xl'
                }`}
              >
                <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => {
                      setCurrentPage(page);
                      scrollToTop();
                    }}
                    className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => {
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  scrollToTop();
                }}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] text-white hover:from-[#F971BC] hover:to-[#DA73AD] shadow-lg hover:shadow-xl'
                }`}
              >
                Next
                <svg className="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Pagination Info */}
            <div className="text-center mt-4 text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredProfiles.length)} of {filteredProfiles.length} profiles
            </div>
          </div>
        ) : null;
      })()}
      
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

