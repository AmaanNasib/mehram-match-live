import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchDataV2,
  justUpdateDataV2,
  fetchDataWithTokenV2,
} from "../../apiUtils";
import UserPop from "../sections/UserPop";
import "./MobileDashboard.css";

// Shimmer Loading for Profile Cards - Exact Flutter Homepage Style
const ShimmerProfileCard = () => (
  <div className="mobile-shimmer-card">
    <div className="mobile-shimmer-image"></div>
    <div className="mobile-shimmer-content">
      <div className="mobile-shimmer-header">
        <div className="mobile-shimmer-name"></div>
        <div className="mobile-shimmer-icon"></div>
      </div>
      <div className="mobile-shimmer-details">
        <div className="mobile-shimmer-line mobile-shimmer-line-1"></div>
        <div className="mobile-shimmer-line mobile-shimmer-line-2"></div>
        <div className="mobile-shimmer-line mobile-shimmer-line-3"></div>
      </div>
      <div className="mobile-shimmer-actions">
        <div className="mobile-shimmer-button"></div>
        <div className="mobile-shimmer-circle"></div>
      </div>
    </div>
  </div>
);

// Profile Completion Card - Exact Flutter Style
const ProfileCompletionCard = ({ profilePercentage, userName, userPhoto, userGender }) => {
  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "#10B981"; // Green
    if (percentage >= 70) return "#F59E0B"; // Yellow
    if (percentage >= 50) return "#EF4444"; // Red
    return "#6B7280"; // Gray
  };

  const getStatusText = (percentage) => {
    if (percentage >= 90) return "Complete";
    if (percentage >= 70) return "Almost Done";
    if (percentage >= 50) return "In Progress";
    return "Get Started";
  };

  const getMotivationText = (percentage) => {
    if (percentage >= 90) return "Your profile looks amazing!";
    if (percentage >= 70) return "Just a few more details to go!";
    if (percentage >= 50) return "You're making great progress!";
    return "Complete your profile to find better matches!";
  };

  const progressColor = getProgressColor(profilePercentage);
  const statusText = getStatusText(profilePercentage);
  const motivationText = getMotivationText(profilePercentage);

  return (
    <div className="mobile-profile-card">
      <div className="mobile-profile-background">
        <div className="mobile-profile-pattern"></div>
      </div>
      <div className="mobile-profile-content">
        <div className="mobile-profile-header">
          <div className="mobile-profile-icon-container">
            <div 
              className="mobile-profile-icon"
              style={{ backgroundColor: `${progressColor}20` }}
            >
              {profilePercentage >= 90 ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          <div className="mobile-profile-info">
            <div className="mobile-profile-title-row">
              <span className="mobile-profile-percentage">
                {profilePercentage.toFixed(0)}% Complete
              </span>
              <div 
                className="mobile-profile-status"
                style={{ backgroundColor: `${progressColor}20`, color: progressColor }}
              >
                {statusText}
              </div>
            </div>
            <p className="mobile-profile-motivation">{motivationText}</p>
          </div>
        </div>

        <div className="mobile-profile-progress-section">
          <div className="mobile-profile-progress-header">
            <span className="mobile-profile-progress-label">Profile Completion</span>
            <span className="mobile-profile-progress-percentage">
              {profilePercentage.toFixed(1)}%
            </span>
          </div>
          <div className="mobile-profile-progress-bar">
            <div 
              className="mobile-profile-progress-fill"
              style={{ 
                width: `${profilePercentage}%`,
                background: `linear-gradient(90deg, ${progressColor}, ${progressColor}CC)`
              }}
            ></div>
          </div>
        </div>

        <div className="mobile-profile-actions">
          <button 
            className="mobile-profile-continue-btn"
            style={{ 
              background: `linear-gradient(90deg, ${progressColor}, ${progressColor}CC)`,
              boxShadow: `0 3px 8px ${progressColor}30`
            }}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>{profilePercentage >= 90 ? 'VIEW PROFILE' : 'CONTINUE SETUP'}</span>
          </button>
          <button className="mobile-profile-steps-btn">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Modern Section Header - Exact Flutter Style
const ModernSectionHeader = ({ title, subtitle, themeColor }) => (
  <div className="mobile-section-header">
    <div className="mobile-section-header-content">
      <div 
        className="mobile-section-indicator"
        style={{ 
          background: `linear-gradient(180deg, ${themeColor}, ${themeColor}80)`
        }}
      ></div>
      <div className="mobile-section-text">
        <h2 className="mobile-section-title">{title}</h2>
        <p className="mobile-section-subtitle">{subtitle}</p>
      </div>
      <svg className="mobile-section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    </div>
  </div>
);

// Profile Card - Exact Flutter Style
const ProfileCard = ({ profile, themeColor, onInterest, onShortlist, onChat }) => {
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  
  // API Base URL for image handling
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mehram-match.onrender.com';

  // Extract profile data with fallbacks - Enhanced for database compatibility
  const profileName = profile.name || profile.first_name || profile.username || profile.full_name || "Unknown User";
  
  // Better age calculation
  let profileAge = "N/A";
  if (profile.age && !isNaN(profile.age)) {
    profileAge = profile.age;
  } else if (profile.date_of_birth) {
    try {
      const birthYear = new Date(profile.date_of_birth).getFullYear();
      const currentYear = new Date().getFullYear();
      profileAge = currentYear - birthYear;
    } catch (e) {
      profileAge = "N/A";
    }
  }
  
  const profileHeight = profile.height || profile.height_cm || profile.height_inches || "5'6\"";
  const profileCity = profile.city || profile.location_city || profile.current_city || profile.location || "City";
  const profileState = profile.state || profile.location_state || profile.current_state || "State";
  const profileEducation = profile.education || profile.education_level || profile.qualification || profile.degree || "Graduate";
  
  // Better image handling
  let profileImage = null;
  if (profile.upload_photo) {
    profileImage = profile.upload_photo.startsWith('http') ? profile.upload_photo : `${API_BASE_URL}${profile.upload_photo}`;
  } else if (profile.profile_image) {
    profileImage = profile.profile_image.startsWith('http') ? profile.profile_image : `${API_BASE_URL}${profile.profile_image}`;
  } else if (profile.profile_photo) {
    profileImage = profile.profile_photo.startsWith('http') ? profile.profile_photo : `${API_BASE_URL}${profile.profile_photo}`;
  } else {
    profileImage = profile.gender === 'female' ? '/images/hijab-woman.png' : '/images/muslim-man.png';
  }
  
  const isVerified = profile.is_verified || profile.verified || profile.verification_status || false;
  const isOnline = profile.is_online || profile.online || false;
  const matchPercentage = profile.match_percentage || profile.compatibility || profile.compatibility_score || 85;
  const profession = profile.profession || profile.occupation || profile.job_title || profile.work || "Professional";
  const maritalStatus = profile.marital_status || profile.marriage_status || profile.status || "Single";
  const religion = profile.religion || profile.religious_background || profile.faith || "Islam";

  // Debug profile data
  console.log("ProfileCard Debug:", {
    originalProfile: profile,
    profileName,
    profileAge,
    profileHeight,
    profileCity,
    profileState,
    profileEducation,
    profileImage,
    profession,
    maritalStatus
  });

  const handleInterest = () => {
    setIsInterested(!isInterested);
    onInterest && onInterest(profile);
  };

  const handleShortlist = () => {
    setIsShortlisted(!isShortlisted);
    onShortlist && onShortlist(profile);
  };

  const handleChat = () => {
    onChat && onChat(profile);
  };

  return (
    <div className="mobile-profile-card-item">
      <div className="mobile-profile-card-image">
        <img 
          src={profileImage} 
          alt={profileName}
          className="mobile-profile-image"
          onError={(e) => {
            e.target.src = profile.gender === 'female' ? '/images/hijab-woman.png' : '/images/muslim-man.png';
          }}
        />
        <div className="mobile-profile-badge">
          {isVerified ? 'Verified' : 'New'}
        </div>
      </div>
      
      <div className="mobile-profile-card-content">
        <div className="mobile-profile-card-header">
          <h3 className="mobile-profile-name">{profileName}</h3>
          <button 
            className={`mobile-profile-shortlist-btn ${isShortlisted ? 'active' : ''}`}
            onClick={handleShortlist}
          >
            <svg className="w-5 h-5" fill={isShortlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        <div className="mobile-profile-details">
          <div className="mobile-profile-detail-item">
            <span className="mobile-profile-age">{profileAge} years</span>
            <span className="mobile-profile-height">{profileHeight}</span>
          </div>
          <div className="mobile-profile-location">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{profileCity}, {profileState}</span>
          </div>
          <div className="mobile-profile-education">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
            <span>{profileEducation}</span>
          </div>
          <div className="mobile-profile-profession">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
            <span>{profession}</span>
          </div>
          <div className="mobile-profile-marital-status">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{maritalStatus}</span>
          </div>
        </div>

        <div className="mobile-profile-match">
          <div className="mobile-profile-match-info">
            <span className="mobile-profile-match-label">Match</span>
            <span className="mobile-profile-match-percentage">{matchPercentage}%</span>
          </div>
          <div className="mobile-profile-online-indicator">
            <div className={`mobile-profile-online-dot ${isOnline ? 'online' : 'offline'}`}></div>
          </div>
        </div>

        <div className="mobile-profile-actions">
          <button 
            className={`mobile-profile-interest-btn ${isInterested ? 'active' : ''}`}
            onClick={handleInterest}
            style={{ 
              background: isInterested 
                ? `linear-gradient(90deg, ${themeColor}, ${themeColor}CC)`
                : 'linear-gradient(90deg, #6B7280, #9CA3AF)'
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{isInterested ? 'Interested' : 'Send Interest'}</span>
          </button>
          <button 
            className="mobile-profile-chat-btn"
            onClick={handleChat}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Modern Section with Profiles - Exact Flutter Style
const ModernSection = ({ title, subtitle, profiles, themeColor, isLoading, onInterest, onShortlist, onChat }) => (
  <div className="mobile-section">
    <ModernSectionHeader title={title} subtitle={subtitle} themeColor={themeColor} />
    
    <div className="mobile-section-content">
      {isLoading ? (
        <div className="mobile-profiles-scroll">
          {[...Array(3)].map((_, index) => (
            <div key={`shimmer-${index}`} className="mobile-profile-scroll-item">
              <ShimmerProfileCard />
            </div>
          ))}
        </div>
      ) : profiles.length > 0 ? (
        <div className="mobile-profiles-scroll">
          {profiles.map((profile, index) => (
            <div key={profile.id || profile.user_id || `profile-${index}`} className="mobile-profile-scroll-item">
              <ProfileCard 
                profile={profile} 
                themeColor={themeColor}
                onInterest={onInterest}
                onShortlist={onShortlist}
                onChat={onChat}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mobile-empty-state">
          <div className="mobile-empty-icon">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="mobile-empty-title">No {title} Found</h3>
          <p className="mobile-empty-subtitle">Check back later for new profiles</p>
        </div>
      )}
    </div>

    {!isLoading && profiles.length > 0 && (
      <div className="mobile-section-footer">
        <button className="mobile-see-all-btn">
          <span>See All {title}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    )}
  </div>
);

const MobileDashboard = () => {
  const location = useLocation();
  const lastSegment = location.pathname.split("/").pop();
  
  // State management
  const [apiData, setApiData] = useState([]);
  const [apiRecommend, setApiDataRecommend] = useState([]);
  const [userDetail, setUserDetail] = useState([]);
  const [apiMember, setApiMember] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with true for initial load
  const [trendingLoading, setTrendingLoading] = useState(true); // Start with true
  const [recommendedLoading, setRecommendedLoading] = useState(true); // Start with true
  const [allUsersLoading, setAllUsersLoading] = useState(true); // Start with true
  const [errors, setErrors] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenWindow, setIsOpenWindow] = useState(false);

  // User data extraction
  // Extract user data from localStorage - Matching NewDashboard
  const [userId] = useState(localStorage.getItem("userId"));
  const userData = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  // API Base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mehram-match.onrender.com';

  // Debug logging
  console.log("MobileDashboard Debug:", {
    userId,
    role,
    userData,
    loading,
    trendingLoading,
    recommendedLoading,
    allUsersLoading,
    apiDataLength: apiData?.length || 0,
    apiRecommendLength: apiRecommend?.length || 0,
    userDetailLength: userDetail?.length || 0,
    activeUser,
    API_BASE_URL,
    rawApiData: apiData,
    rawApiRecommend: apiRecommend,
    rawUserDetail: userDetail
  });

  // Profile completion data with validation
  const profilePercentage = activeUser?.profile_completed ? 100 : (activeUser?.profile_percentage || 0);
  const userName = activeUser?.name || activeUser?.first_name || activeUser?.username || "User";
  const userPhoto = activeUser?.upload_photo || activeUser?.profile_image;
  const userGender = activeUser?.gender || "unknown";

  // Data validation and error handling
  const validateProfileData = (profiles) => {
    if (!Array.isArray(profiles)) return [];
    return profiles.filter(profile => profile && typeof profile === 'object');
  };

  // Transform database data to consistent format
  const transformProfileData = (profiles) => {
    if (!Array.isArray(profiles)) {
      console.log("transformProfileData: Not an array", profiles);
      return [];
    }
    
    if (profiles.length === 0) {
      console.log("transformProfileData: Empty array");
      return [];
    }
    
    const transformed = profiles.map((item, index) => {
      if (!item || typeof item !== 'object') {
        console.log(`transformProfileData: Invalid item at index ${index}`, item);
        return null;
      }
      
      // Handle nested structure like NewDashboard (profile.user)
      const profile = item.user || item; // Use nested user object if available
      
      if (!profile || typeof profile !== 'object') {
        console.log(`transformProfileData: Invalid profile at index ${index}`, profile);
        return null;
      }
      
      // Calculate age from date_of_birth if available
      let calculatedAge = 25; // Default age
      if (profile.date_of_birth) {
        const birthYear = new Date(profile.date_of_birth).getFullYear();
        const currentYear = new Date().getFullYear();
        calculatedAge = currentYear - birthYear;
      }
      
      // Handle profile photo URL
      let profilePhoto = null;
      if (profile.upload_photo) {
        profilePhoto = profile.upload_photo.startsWith('http') 
          ? profile.upload_photo 
          : `${API_BASE_URL}${profile.upload_photo}`;
      } else if (profile.profile_image) {
        profilePhoto = profile.profile_image.startsWith('http') 
          ? profile.profile_image 
          : `${API_BASE_URL}${profile.profile_image}`;
      } else if (profile.profile_photo) {
        profilePhoto = profile.profile_photo.startsWith('http') 
          ? profile.profile_photo 
          : `${API_BASE_URL}${profile.profile_photo}`;
      }
      
      const transformedProfile = {
        id: profile.id || profile.user_id || `profile-${index}`,
        user_id: profile.user_id || profile.id || `profile-${index}`,
        name: profile.name || profile.first_name || profile.username || "Unknown User",
        first_name: profile.first_name || profile.name || "Unknown",
        last_name: profile.last_name || "",
        age: profile.age || calculatedAge,
        height: profile.height || profile.height_cm || "5'6\"",
        city: profile.city || profile.location_city || profile.current_city || "City",
        state: profile.state || profile.location_state || profile.current_state || "State",
        education: profile.education || profile.education_level || profile.qualification || "Graduate",
        upload_photo: profilePhoto,
        gender: profile.gender || "unknown",
        is_verified: profile.is_verified || profile.verified || profile.verification_status || false,
        is_online: profile.is_online || profile.online || profile.last_seen ? 
          (new Date() - new Date(profile.last_seen)) < 300000 : false, // 5 minutes
        match_percentage: profile.match_percentage || profile.compatibility || profile.compatibility_score || 85,
        profession: profile.profession || profile.occupation || profile.job_title || "Professional",
        marital_status: profile.marital_status || profile.marriage_status || "Single",
        religion: profile.religion || profile.religious_background || "Islam",
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        // Additional fields from database
        phone: profile.phone || profile.phone_number,
        email: profile.email,
        bio: profile.bio || profile.about || profile.description,
        interests: profile.interests || profile.hobbies,
        family_background: profile.family_background,
        lifestyle: profile.lifestyle,
        partner_preferences: profile.partner_preferences,
        // Include original nested data if available
        interested_id: item.interested_id,
        is_interested: item.is_interested
      };
      
      console.log(`transformProfileData: Transformed profile ${index}`, transformedProfile);
      return transformedProfile;
    }).filter(profile => profile !== null);
    
    console.log("transformProfileData: Final transformed array", transformed);
    return transformed;
  };

  // Fallback data for testing
  const fallbackProfiles = [
    {
      id: 1,
      name: "Sample User 1",
      age: 25,
      height: "5'6\"",
      city: "Mumbai",
      state: "Maharashtra",
      education: "Bachelor's Degree",
      upload_photo: null,
      gender: "female",
      is_verified: true,
      is_online: true,
      match_percentage: 85
    },
    {
      id: 2,
      name: "Sample User 2", 
      age: 28,
      height: "5'8\"",
      city: "Delhi",
      state: "Delhi",
      education: "Master's Degree",
      upload_photo: null,
      gender: "male",
      is_verified: false,
      is_online: false,
      match_percentage: 78
    }
  ];

  // Transform and validate profile data
  const transformedApiData = transformProfileData(apiData);
  const transformedApiRecommend = transformProfileData(apiRecommend);
  const transformedUserDetail = transformProfileData(userDetail);

  // Debug transformed data
  console.log("Transformed Data Debug:", {
    originalApiData: apiData,
    transformedApiData: transformedApiData,
    originalApiRecommend: apiRecommend,
    transformedApiRecommend: transformedApiRecommend,
    originalUserDetail: userDetail,
    transformedUserDetail: transformedUserDetail
  });

  // Use original data if transformation fails or returns empty
  const trendingProfiles = transformedApiData.length > 0 ? transformedApiData : (apiData.length > 0 ? apiData : fallbackProfiles);
  const recommendedProfiles = transformedApiRecommend.length > 0 ? transformedApiRecommend : (apiRecommend.length > 0 ? apiRecommend : fallbackProfiles);
  const allUsersProfiles = transformedUserDetail.length > 0 ? transformedUserDetail : (userDetail.length > 0 ? userDetail : fallbackProfiles);

  console.log("Final Profiles Debug:", {
    trendingProfiles: trendingProfiles,
    recommendedProfiles: recommendedProfiles,
    allUsersProfiles: allUsersProfiles
  });

  // Theme colors for sections
  const themeColors = {
    trending: "#CB3B8B",
    recommended: "#DA73AD", 
    allUsers: "#EB53A7"
  };

  // API calls with proper loading states and error handling - Matching NewDashboard
  useEffect(() => {
    const parameter = {
      url: role === "agent" ? `/api/agent/${userId}/` : `/api/user/${userId}/`,
      setterFunction: (data) => {
        console.log("User data received:", data);
        setActiveUser(data);
        setLoading(false);
        // Store important user data in localStorage like NewDashboard
        localStorage.setItem("gender", data?.gender);
        localStorage.setItem("profile_completed", data?.profile_completed);
      },
      setErrors: (error) => {
        console.error("Error fetching user data:", error);
        setErrors(error);
        setLoading(false);
      },
      setLoading: setLoading,
    };
    fetchDataV2(parameter); // Using fetchDataV2 like NewDashboard
  }, []);

  useEffect(() => {
    if (!userId) {
      setTrendingLoading(false);
      return;
    }
    
    const parameter1 = {
      url: role === "agent" ? `/api/trending_profiles_by_interest/` : `/api/trending_profile/?user_id=${userId}`,
      setterFunction: (data) => {
        console.log("Trending profiles received:", data);
        console.log("Trending profiles type:", typeof data, Array.isArray(data));
        setApiData(data || []);
        setTrendingLoading(false);
      },
      setErrors: (error) => {
        console.error("Error fetching trending profiles:", error);
        setErrors(error);
        setTrendingLoading(false);
      },
      setLoading: () => {}, // We handle loading manually
    };
    fetchDataWithTokenV2(parameter1);
  }, [userId, role]);

  useEffect(() => {
    if (role === "agent") {
      setRecommendedLoading(false);
      return; // Skip recommendations for agents like NewDashboard
    }
    
    if (!userId) {
      setRecommendedLoading(false);
      return;
    }
    
    const parameter2 = {
      url: `/api/user/recommend/?user_id=${userId}`,
      setterFunction: (data) => {
        console.log("Recommended profiles received:", data);
        console.log("Recommended profiles type:", typeof data, Array.isArray(data));
        setApiDataRecommend(data || []);
        setRecommendedLoading(false);
      },
      setErrors: (error) => {
        console.error("Error fetching recommended profiles:", error);
        setErrors(error);
        setRecommendedLoading(false);
      },
      setLoading: () => {}, // We handle loading manually
    };
    fetchDataWithTokenV2(parameter2);
  }, [userId, role]);

  useEffect(() => {
    const parameter3 = {
      url: role === "agent" ? `/api/agent/user_list/` : `/api/user/`,
      setterFunction: (data) => {
        console.log("All users received:", data);
        console.log("All users type:", typeof data, Array.isArray(data));
        setUserDetail(data || []);
        setAllUsersLoading(false);
      },
      setErrors: (error) => {
        console.error("Error fetching all users:", error);
        setErrors(error);
        setAllUsersLoading(false);
      },
      setLoading: () => {}, // We handle loading manually
    };
    fetchDataWithTokenV2(parameter3);
  }, [role]);

  useEffect(() => {
    if (role === "individual") return; // Skip for individual users like NewDashboard
    const parameter4 = {
      url: `/api/agent/user_agent/?agent_id=${userId}`,
      setterFunction: (data) => {
        console.log("Agent members received:", data);
        setApiMember(data);
      },
      setErrors: (error) => {
        console.error("Error fetching agent members:", error);
        setErrors(error);
      },
      setLoading: () => {}, // We handle loading manually
    };
    fetchDataWithTokenV2(parameter4);
  }, [userId]);

  // Event handlers with real API calls
  const handleInterest = async (profile) => {
    try {
      console.log("Sending interest to:", profile.name);
      
      // Real API call for sending interest
      const response = await fetch(`${API_BASE_URL}/api/interest/send/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          from_user_id: userId,
          to_user_id: profile.id || profile.user_id,
          to_user_name: profile.name || profile.first_name,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log("Interest sent successfully:", result);
        // Show success message
        alert(`Interest sent to ${profile.name || profile.first_name}!`);
      } else {
        console.error("Failed to send interest:", result);
        alert(result.message || "Failed to send interest. Please try again.");
      }
    } catch (error) {
      console.error("Error sending interest:", error);
      alert("Network error. Please try again.");
    }
  };

  const handleShortlist = async (profile) => {
    try {
      console.log("Shortlisting:", profile.name);
      
      // Real API call for shortlisting
      const response = await fetch(`${API_BASE_URL}/api/shortlist/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          from_user_id: userId,
          to_user_id: profile.id || profile.user_id,
          to_user_name: profile.name || profile.first_name,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log("Shortlisted successfully:", result);
        // Show success message
        alert(`${profile.name || profile.first_name} added to shortlist!`);
      } else {
        console.error("Failed to shortlist:", result);
        alert(result.message || "Failed to shortlist. Please try again.");
      }
    } catch (error) {
      console.error("Error shortlisting:", error);
      alert("Network error. Please try again.");
    }
  };

  const handleChat = (profile) => {
    try {
      console.log("Opening chat with:", profile.name);
      
      // Navigate to chat or open chat modal
      const chatUrl = `/chat/${profile.id || profile.user_id}`;
      window.location.href = chatUrl;
      
    } catch (error) {
      console.error("Error opening chat:", error);
      alert("Error opening chat. Please try again.");
    }
  };

  const updateLater = () => {
    setIsOpenWindow(false);
  };

  const closeWindow = () => {
    setIsOpenWindow(false);
  };

  // Profile completion popup logic like NewDashboard
  const handPopup = () => {
    if (activeUser?.update_later === false) {
      if (
        activeUser?.profile_started === false ||
        activeUser?.profile_completed === false
      ) {
        setIsOpenWindow(true);
      }
    }
  };

  useEffect(() => {
    handPopup();
  }, [activeUser]);

  // Error display component
  const ErrorDisplay = ({ error }) => (
    <div className="mobile-error-display">
      <div className="mobile-error-icon">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="mobile-error-title">Something went wrong</h3>
      <p className="mobile-error-message">{error || "Please try again later"}</p>
      <button 
        className="mobile-error-retry-btn"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );

  // Show error if there's a critical error and no data
  if (errors && !loading && !activeUser) {
    return (
      <div className="mobile-dashboard">
        <ErrorDisplay error={errors} />
      </div>
    );
  }

  return (
    <div className="mobile-dashboard">
      {/* User Profile Completion Modal */}
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

      {/* Main Content */}
      <div className="mobile-dashboard-content">
        {/* Profile Completion Card */}
        <ProfileCompletionCard 
          profilePercentage={profilePercentage}
          userName={userName}
          userPhoto={userPhoto}
          userGender={userGender}
        />

        {/* Content Sections - Only for non-agents */}
        {role !== "agent" && (
          <>
            {/* Trending Profiles Section */}
            <ModernSection
              title="Trending Profiles"
              subtitle="Most viewed profiles this week"
              profiles={trendingProfiles}
              themeColor={themeColors.trending}
              isLoading={trendingLoading}
              onInterest={handleInterest}
              onShortlist={handleShortlist}
              onChat={handleChat}
            />

            {/* Recommended Profiles Section */}
            <ModernSection
              title="Recommended for You"
              subtitle="Based on your preferences and compatibility"
              profiles={recommendedProfiles}
              themeColor={themeColors.recommended}
              isLoading={recommendedLoading}
              onInterest={handleInterest}
              onShortlist={handleShortlist}
              onChat={handleChat}
            />
          </>
        )}

        {/* All Users Section */}
        <ModernSection
          title="Browse All Profiles"
          subtitle="Discover new connections and expand your network"
          profiles={allUsersProfiles}
          themeColor={themeColors.allUsers}
          isLoading={allUsersLoading}
          onInterest={handleInterest}
          onShortlist={handleShortlist}
          onChat={handleChat}
        />
      </div>
    </div>
  );
};

export default MobileDashboard;
