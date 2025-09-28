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

const ViewAllTrendingProfiles = () => {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const [trendingProfiles, setTrendingProfiles] = useState([]);
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
    console.log('Reloading original trending data - clearing filters');
    setLoading(true);
    setErrors(null);
    const parameter = {
      url:
        role === "agent"
          ? `/api/trending_profiles_by_interest/`
          : `/api/trending_profile/?user_id=${userId}`,
      setterFunction: (data) => {
        console.log('Original trending data reloaded:', data);
        setTrendingProfiles(data);
        setLoading(false);
      },
      setErrors: setErrors,
      setLoading: setLoading,
    };
    fetchDataWithTokenV2(parameter);
  };

  useEffect(() => {
    const parameter = {
      url:
        role === "agent"
          ? `/api/trending_profiles_by_interest/`
          : `/api/trending_profile/?user_id=${userId}`,
      setterFunction: setTrendingProfiles,
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
            fetchurl:
              role === "agent"
                ? `/api/trending_profiles_by_interest/`
                : `/api/trending_profile/?user_id=${userId}`,
            dataset: setTrendingProfiles,
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
            fetchurl:
              role === "agent"
                ? `/api/trending_profiles_by_interest/`
                : `/api/trending_profile/?user_id=${userId}`,
            dataset: setTrendingProfiles,
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
            fetchurl:
              role === "agent"
                ? `/api/trending_profiles_by_interest/`
                : `/api/trending_profile/?user_id=${userId}`,
            dataset: setTrendingProfiles,
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
            fetchurl:
              role === "agent"
                ? `/api/trending_profiles_by_interest/`
                : `/api/trending_profile/?user_id=${userId}`,
            dataset: setTrendingProfiles,
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
    <div className="min-h-screen bg-gray-50">
      <Header
        apiData={activeUser}
        members={apiMember?.member || []}
        subNavActive={"newdashboard"}
      />
      
      {/* Main Content with Sidebar */}
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
              setApiData={setTrendingProfiles} 
              onClose={() => setIsSidebarOpen(false)}
              reloadOriginalData={reloadOriginalData}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 xl:ml-4">
          {/* Header Section */}
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Browse Trending Profiles
            </h1>
            <p className="text-gray-600 text-sm">
              Discover trending profiles and find your perfect match from our community
            </p>
          </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              <p className="text-gray-600 font-medium">Loading trending profiles...</p>
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
            <p className="text-red-500">{errors.message || "An error occurred while loading trending profiles"}</p>
          </div>
      )}

        {/* Empty State */}
      {!loading && trendingProfiles && trendingProfiles.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No trending profiles found</h3>
              <p className="text-gray-600">We couldn't find any trending profiles matching your criteria. Try adjusting your filters.</p>
            </div>
          </div>
        )}

          {/* Profiles Grid */}
          {!loading && trendingProfiles && trendingProfiles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
        {trendingProfiles && trendingProfiles.filter(profile => !ignoredUsers.has(profile.user?.id)).map((profile, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border border-gray-100 overflow-hidden w-full"
          >
                {/* Profile Image Section - Same as NewDashboard */}
                <div className="profile-image" style={{ height: '30vh' }}>
                  <img
                    src={(() => {
                      // Try all possible photo field combinations
                      let photoUrl = null;
                      
                      if (profile?.profile_photo) {
                        photoUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${profile.profile_photo}`;
                      } else if (profile?.user_profilephoto?.upload_photo) {
                        photoUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${profile.user_profilephoto.upload_photo}`;
                      } else if (profile?.user?.profile_photo) {
                        photoUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${profile.user.profile_photo}`;
                      } else if (profile?.user?.user_profilephoto?.upload_photo) {
                        photoUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${profile.user.user_profilephoto.upload_photo}`;
                      } else if (profile?.upload_photo) {
                        photoUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${profile.upload_photo}`;
                      }
                      
                      if (!photoUrl) {
                        photoUrl = `data:image/svg+xml;utf8,${encodeURIComponent(
                          profile?.gender === "male"
                            ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6">
                <circle cx="12" cy="8" r="5" fill="#bfdbfe"/>
                <path d="M12 14c-4.42 0-8 2.69-8 6v1h16v-1c0-3.31-3.58-6-8-6z" fill="#bfdbfe"/>
              </svg>`
                            : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ec4899">
                <circle cx="12" cy="8" r="5" fill="#fbcfe8"/>
                <path d="M12 14c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6z" fill="#fbcfe8"/>
                <circle cx="12" cy="8" r="2" fill="#ec4899"/>
              </svg>`
                          )}`;
                  }
                      
                      return photoUrl;
                    })()}
                  alt="Profile Photo"
                  style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      console.log('Image failed to load:', e.target.src);
                    }}
                  />
            </div>

            {/* Profile Details */}
            <div className="p-4">
              <div className="text-center mb-3">
                <h3 className="text-base font-bold text-gray-800 mb-1">
                  {profile.user?.name || "No Name"}
                </h3>
                <div className="text-gray-600 text-xs mb-3">
                  <span className="text-pink-600 font-semibold">
                    {profile.user?.age || "N/A"}
                  </span>
                  <span className="mx-1">|</span>
                  <span>{profile.user?.martial_status || profile?.martial_status || "Never Married"}</span>
                  <span className="mx-1">|</span>
                  <span>{profile.user?.city || "Not Mentioned"}</span>
            </div>
            </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {/* Send Interest Button */}
                    <button
                  onClick={() => handleInterestClick(profile.user.id)}
                      className={`w-full flex items-center justify-center px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        interestStatus[profile.user.id] || profile?.is_interested === true
                          ? 'bg-pink-100 text-pink-600 border border-pink-200'
                          : 'bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white hover:from-[#FF5722] hover:to-[#FF9800] shadow-md hover:shadow-lg'
                      }`}
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                      {interestStatus[profile.user.id] || profile?.is_interested === true ? "Interest Sent" : "Send Interest"}
                    </button>

                    {/* Secondary Buttons Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                  onClick={() => navigate(`/details/${profile?.user?.id}`)}
                        className="flex items-center justify-center px-2 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 font-medium transition-all duration-200 text-xs"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                        Profile
                      </button>

                      <button
                  onClick={() => handleShortlistClick(profile.user.id)}
                        className={`flex items-center justify-center px-2 py-1 rounded-md font-medium transition-all duration-200 text-xs ${
                          shortlistStatus[profile.user.id] || profile?.is_shortlisted === true
                            ? 'bg-green-100 text-green-600 border border-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600 border border-gray-200'
                        }`}
                      >
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M2.68945 3.62109V7.37109H6.43945V3.62109H2.68945ZM3.93945 4.87109H5.18945V6.12109H3.93945V4.87109ZM7.68945 4.87109V6.12109H17.0645V4.87109H7.68945ZM2.68945 8.62109V12.3711H6.43945V8.62109H2.68945ZM3.93945 9.87109H5.18945V11.1211H3.93945V9.87109ZM7.68945 9.87109V11.1211H17.0645V9.87109H7.68945ZM2.68945 13.6211V17.3711H6.43945V13.6211H2.68945ZM3.93945 14.8711H5.18945V16.1211H3.93945V14.8711ZM7.68945 14.8711V16.1211H17.0645V14.8711H7.68945Z" />
                  </svg>
                        {shortlistStatus[profile.user.id] || profile?.is_shortlisted === true ? "Shortlisted" : "Shortlist"}
                      </button>
                </div>

                    {/* Bottom Row Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                  onClick={() => handleIgnoreClick(profile.user.id)}
                        className={`flex items-center justify-center px-2 py-1 rounded-md font-medium transition-all duration-200 text-xs ${
                          profile?.is_blocked === true
                            ? 'bg-red-100 text-red-600 border border-red-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-200'
                        }`}
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                        </svg>
                        {profile?.is_blocked === true ? "Blocked" : "Block"}
                      </button>

                      <button
                        onClick={() => navigate(`/chat/${profile?.user?.id}`)}
                        className="flex items-center justify-center px-2 py-1 rounded-md bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200 font-medium transition-all duration-200 text-xs"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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

export default ViewAllTrendingProfiles;