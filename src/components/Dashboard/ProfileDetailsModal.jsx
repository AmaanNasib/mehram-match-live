import React, { useState, useEffect } from 'react';
import { fetchDataObjectV2, fetchDataWithTokenV2 } from '../../apiUtils';

// Profile Details Modal - Exact Profile Details Screen Style
const ProfileDetailsModal = ({ isOpen, onClose, userData, currentUserGender, currentUserId }) => {
  const [isSendingInterest, setIsSendingInterest] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [galleryHeight, setGalleryHeight] = useState(350);
  const [isGalleryCollapsed, setIsGalleryCollapsed] = useState(false);
  
  // Real data fetching states
  const [profileData, setProfileData] = useState(null);
  const [photosData, setPhotosData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  // Fetch real profile data from database
  useEffect(() => {
    if (isOpen && userData?.id) {
      setIsLoading(true);
      setErrors(null);
      
      // Fetch user profile data
      const profileParameter = {
        url: `/api/user/${userData.id}/`,
        setterFunction: setProfileData,
        setErrors: setErrors,
        setLoading: setIsLoading,
      };
      fetchDataObjectV2(profileParameter);
      
      // Fetch user photos
      const photosParameter = {
        url: `/api/user/add_photo/?user_id=${userData.id}`,
        setterFunction: setPhotosData,
        setErrors: setErrors,
        setLoading: setIsLoadingGallery,
      };
      fetchDataWithTokenV2(photosParameter);
    }
  }, [isOpen, userData?.id]);

  // Initialize gallery photos from real data
  useEffect(() => {
    if (isOpen && (profileData || userData)) {
      const photos = [];
      const currentData = profileData || userData;
      
      // Profile photo
      const profilePhoto = currentData.upload_photo || 
                          currentData.profile_image || 
                          currentData.profile_photo ||
                          (currentData.gender === 'female' ? '/images/hijab-woman.png' : '/images/muslim-man.png');
      
      if (profilePhoto) {
        photos.push({ 
          id: 1, 
          url: profilePhoto, 
          type: 'profile',
          alt: `${currentData.first_name || currentData.name}'s profile photo`
        });
      }
      
      // Additional photos from API or userData
      if (photosData && photosData.length > 0) {
        photosData.forEach((photo, index) => {
          if (photo && photo.photo_url) {
            photos.push({ 
              id: index + 2, 
              url: photo.photo_url, 
              type: 'additional',
              alt: `Photo ${index + 1}`
            });
          }
        });
      } else if (currentData.additional_photos) {
        const additionalPhotos = Array.isArray(currentData.additional_photos) ? 
                                currentData.additional_photos : 
                                [currentData.additional_photos];
        additionalPhotos.forEach((photo, index) => {
          if (photo) {
            photos.push({ 
              id: index + 2, 
              url: photo, 
              type: 'additional',
              alt: `Photo ${index + 1}`
            });
          }
        });
      }
      
      setGalleryPhotos(photos);
    }
  }, [isOpen, profileData, photosData, userData]);

  // Disable background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Add CSS class to body
      document.body.classList.add('modal-open');
      
      // Disable body scroll with inline styles as backup
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // Handle mobile browser viewport height for full page feel
      const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        const vw = window.innerWidth * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        document.documentElement.style.setProperty('--vw', `${vw}px`);
      };
      
      setViewportHeight();
      window.addEventListener('resize', setViewportHeight);
      window.addEventListener('orientationchange', setViewportHeight);
      
      // Cleanup function to restore scroll
      return () => {
        // Remove CSS class
        document.body.classList.remove('modal-open');
        
        // Restore inline styles
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // Remove event listeners
        window.removeEventListener('resize', setViewportHeight);
        window.removeEventListener('orientationchange', setViewportHeight);
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Use real profile data if available, otherwise fallback to userData
  const currentProfileData = profileData || userData;
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="profile-details-overlay">
        <div className="profile-details-container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div className="loading-spinner"></div>
            <p>Loading profile details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProfileData) return null;

  // Extract data exactly like profile_details_screen.dart using real data
  const fullName = currentProfileData.name || currentProfileData.first_name || currentProfileData.username || "User";
  const age = currentProfileData.age || "Not specified";
  const profession = currentProfileData.profession || "Not specified";
  const city = currentProfileData.city || "";
  const state = currentProfileData.state || "";
  const location = [city, state].filter(s => s.length > 0).join(', ') || "Location not specified";
  const marital = currentProfileData.marital_status || currentProfileData.martial_status || "Not specified";
  const religion = currentProfileData.religion || "Not specified";
  const education = currentProfileData.education || currentProfileData.Education || "Not specified";
  const memberId = currentProfileData.id || currentProfileData.user_id || "N/A";
  const profilePhoto = currentProfileData.upload_photo || currentProfileData.profile_image || (currentProfileData.gender === 'female' ? '/images/hijab-woman.png' : '/images/muslim-man.png');
  const isAgentVerified = currentProfileData.agent_verified === true;
  const isVerified = currentProfileData.is_verified === true;

  // Helper function to build info tags exactly like profile_details_screen.dart
  const buildInfoTag = (icon, label, color) => (
    <div className="info-tag" style={{ borderColor: `${color}20`, backgroundColor: `${color}10` }}>
      <svg className="info-tag-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: color }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
      <span className="info-tag-label" style={{ color: color }}>{label}</span>
    </div>
  );

  // Helper function to build info rows exactly like profile_details_screen.dart _buildSocialField
  const buildInfoRow = (iconPath, label, value) => (
    <div className="info-row">
      <svg className="info-row-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
      </svg>
      <div className="info-row-content">
        <span className="info-label">{label}</span>
        <span className="info-value">{value || 'Not Provided'}</span>
      </div>
    </div>
  );

  const handleSendInterest = async () => {
    setIsSendingInterest(true);
    try {
      // API call to send interest using real data
      console.log('Sending interest to:', currentProfileData?.id);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Interest sent successfully! 🎉');
    } catch (error) {
      console.error('Error sending interest:', error);
      alert('Failed to send interest. Please try again.');
    } finally {
      setIsSendingInterest(false);
    }
  };

  const handleChatNow = async () => {
    try {
      console.log('Starting chat with:', currentProfileData?.id);
      // API call to start chat
      alert('Chat started! 💬');
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Failed to start chat. Please try again.');
    }
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % galleryPhotos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
  };

  return (
    <div 
      className="profile-details-overlay" 
      onClick={onClose}
      onTouchMove={(e) => e.preventDefault()}
      onWheel={(e) => e.preventDefault()}
    >
      <div className="profile-details-container" onClick={(e) => e.stopPropagation()}>
        {/* Top Back Button Bar - Exact profile_details_screen.dart style */}
        <div className="profile-details-header">
          <button className="back-button" onClick={onClose}>
            <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="profile-details-title">{fullName}</h1>
          <div className="header-spacer"></div>
        </div>

        {/* Scrollable content with exact structure */}
        <div className="profile-details-content">
          {/* Gallery Section - Exact profile_details_screen.dart style */}
          <div className="profile-gallery-section" style={{ height: `${galleryHeight}px` }}>
            {galleryHeight > 50 ? (
              <div className="gallery-container">
                <img 
                  src={galleryPhotos.length > 0 ? galleryPhotos[currentPhotoIndex]?.url : profilePhoto} 
                  alt={fullName}
                  className="gallery-main-image"
                  onError={(e) => {
                    e.target.src = userData.gender === 'female' ? '/images/hijab-woman.png' : '/images/muslim-man.png';
                  }}
                />
                {galleryPhotos.length > 1 && (
                  <>
                    <button className="gallery-nav-button prev" onClick={prevPhoto}>
                      <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button className="gallery-nav-button next" onClick={nextPhoto}>
                      <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div className="gallery-indicators">
                      {galleryPhotos.map((_, index) => (
                        <div 
                          key={index}
                          className={`gallery-indicator ${index === currentPhotoIndex ? 'active' : ''}`}
                          onClick={() => setCurrentPhotoIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </div>

          {/* Content Cards - Exact profile_details_screen.dart structure */}
          <div className="profile-content-cards">
            {/* Main Info Card - Exact structure */}
            <div className="main-info-card">
              <div className="main-info-content">
                {/* Name with verified badge */}
                <div className="name-badge-row">
                  <h2 className="profile-name">{fullName}</h2>
                  {isAgentVerified ? (
                    <div className="verified-badge agent-verified">
                      <svg className="verified-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span>Agent Verified</span>
                    </div>
                  ) : isVerified ? (
                    <div className="verified-badge regular-verified">
                      <svg className="verified-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Verified</span>
                    </div>
                  ) : null}
                </div>

                {/* Member ID */}
                <div className="member-id-row">
                  <svg className="member-id-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                  <span className="member-id-text">ID: {memberId}</span>
                </div>

                {/* Info Tags Row - Exact profile_details_screen.dart style */}
                <div className="info-tags-row">
                  {buildInfoTag("M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", `${age} years`, "#8B5CF6")}
                  {buildInfoTag("M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", marital, "#EC4899")}
                  {buildInfoTag("M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", city || "Location not specified", "#10B981")}
                </div>
              </div>
            </div>

            {/* Introduction Card - Exact profile_details_screen.dart style */}
            <div className="intro-card">
              <div className="intro-card-header">
                <div className="intro-card-icon">
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="intro-card-title">Introduction</h3>
              </div>
              <div className="intro-card-content">
                <p className="intro-text">
                  {currentProfileData.about_you || currentProfileData.about_me || currentProfileData.introduction || "No introduction provided yet."}
                </p>
              </div>
            </div>

            {/* MemStepOne - Basic Information Card */}
            <div className="info-card">
              <div className="info-card-header">
                <div className="info-card-icon">
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="info-card-title">Basic Information</h3>
              </div>
              <div className="info-card-content">
                {/* MemStepOne Fields */}
                {buildInfoRow("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", "First Name", currentProfileData.first_name)}
                {buildInfoRow("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", "Last Name", currentProfileData.last_name)}
                {buildInfoRow("M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.5 1.5 0 003 15.546V12a9 9 0 0118 0v3.546z", "Date of Birth", currentProfileData.dob)}
                {buildInfoRow("M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z", "Gender", currentProfileData.gender ? currentProfileData.gender.charAt(0).toUpperCase() + currentProfileData.gender.slice(1) : null)}
                {buildInfoRow("M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", "Marital Status", marital)}
                {buildInfoRow("M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", "Current Location", `${currentProfileData.city || ''}, ${currentProfileData.state || ''}, ${currentProfileData.country || ''}`)}
                {buildInfoRow("M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", "Native Location", `${currentProfileData.native_city || ''}, ${currentProfileData.native_state || ''}, ${currentProfileData.native_country || ''}`)}
                {buildInfoRow("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", "Education", currentProfileData.Education)}
                {buildInfoRow("M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6", "Profession", currentProfileData.profession)}
                {buildInfoRow("M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", "Job/Business Description", currentProfileData.describe_job_business)}
                {buildInfoRow("M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", "Disability", currentProfileData.disability)}
                {currentProfileData.disability === 'yes' && buildInfoRow("M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", "Type of Disability", currentProfileData.type_of_disability)}
                {buildInfoRow("M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1", "Income Range", currentProfileData.incomeRange)}
                {buildInfoRow("M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", "Personal Values/About You", currentProfileData.about_you)}
                {/* Optional fields from MemStepOne */}
                {currentProfileData.height && buildInfoRow("M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4", "Height", currentProfileData.height)}
                {currentProfileData.weight && buildInfoRow("M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1", "Weight", currentProfileData.weight)}
              </div>
            </div>

            {/* MemStepTwo - Religious Information Card */}
            <div className="info-card">
              <div className="info-card-header">
                <div className="info-card-icon">
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="info-card-title">Religious Information</h3>
              </div>
              <div className="info-card-content">
                {/* MemStepTwo Fields */}
                {buildInfoRow("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", "Sect/School Information", currentProfileData.sect_school_info)}
                {buildInfoRow("M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", "Islamic Practicing Level", currentProfileData.islamic_practicing_level)}
                {buildInfoRow("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", "Believe in Dargah/Fatiha/Niyah", Array.isArray(currentProfileData.believe_in_dargah_fatiha_niyah) ? currentProfileData.believe_in_dargah_fatiha_niyah.join(', ') : currentProfileData.believe_in_dargah_fatiha_niyah)}
                {/* Show Hijab/Niqab preference only for female users - MemStepTwo logic */}
                {currentProfileData.gender?.toLowerCase() === 'female' && buildInfoRow("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", "Hijab/Niqab Preference", currentProfileData.hijab_niqab_prefer)}
              </div>
            </div>

            {/* MemStepThree - Family Information Card */}
            <div className="info-card">
              <div className="info-card-header">
                <div className="info-card-icon">
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                  </svg>
                </div>
                <h3 className="info-card-title">Family Information</h3>
              </div>
              <div className="info-card-content">
                {/* MemStepThree Fields */}
                {buildInfoRow("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", "Father Name", currentProfileData.father_name)}
                {buildInfoRow("M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6", "Father Occupation", currentProfileData.father_occupation)}
                {buildInfoRow("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", "Mother Name", currentProfileData.mother_name)}
                {buildInfoRow("M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6", "Mother Occupation", currentProfileData.mother_occupation)}
                
                {/* Wali information only for female users */}
                {currentProfileData.gender?.toLowerCase() === 'female' && (
                  <>
                    {buildInfoRow("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", "Wali Name", currentProfileData.wali_name)}
                    {buildInfoRow("M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", "Wali Contact Number", currentProfileData.wali_contact_number)}
                    {buildInfoRow("M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z", "Wali Blood Relation", currentProfileData.wali_blood_relation)}
                  </>
                )}
                
                {buildInfoRow("M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z", "Number of Siblings", currentProfileData.number_of_siblings !== null && currentProfileData.number_of_siblings !== undefined ? currentProfileData.number_of_siblings : "Not Provided")}
                {buildInfoRow("M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z", "Number of Brothers", (currentProfileData.number_of_brothers !== null && currentProfileData.number_of_brothers !== undefined) ? currentProfileData.number_of_brothers : (currentProfileData.number_of_brother !== null && currentProfileData.number_of_brother !== undefined) ? currentProfileData.number_of_brother : "Not Provided")}
                {buildInfoRow("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", "Number of Sisters", (currentProfileData.number_of_sisters !== null && currentProfileData.number_of_sisters !== undefined) ? currentProfileData.number_of_sisters : (currentProfileData.number_of_sister !== null && currentProfileData.number_of_sister !== undefined) ? currentProfileData.number_of_sister : "Not Provided")}
                {buildInfoRow("M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z", "Family Type", currentProfileData.family_type)}
                {buildInfoRow("M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", "Family Practicing Level", currentProfileData.family_practicing_level)}
                
                {/* Show children information only for married/divorced/widowed users - MemStepThree logic */}
                {['Married', 'Divorced', 'Khula', 'Widowed', 'Widow'].includes(marital) && (
                  <>
                    {buildInfoRow("M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z", "Number of Children", currentProfileData.number_of_children !== null && currentProfileData.number_of_children !== undefined ? currentProfileData.number_of_children : "Not Provided")}
                    {buildInfoRow("M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z", "Number of Sons", currentProfileData.number_of_son !== null && currentProfileData.number_of_son !== undefined ? currentProfileData.number_of_son : "Not Provided")}
                    {buildInfoRow("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", "Number of Daughters", currentProfileData.number_of_daughter !== null && currentProfileData.number_of_daughter !== undefined ? currentProfileData.number_of_daughter : "Not Provided")}
                  </>
                )}
              </div>
            </div>

            {/* MemStepFour - Partner Preference Card */}
            <div className="info-card">
              <div className="info-card-header">
                <div className="info-card-icon">
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="info-card-title">Partner Preference</h3>
              </div>
              <div className="info-card-content">
                {/* MemStepFour Fields */}
                {buildInfoRow("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", "Preferred Surname", currentProfileData.preferred_surname)}
                {buildInfoRow("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", "Preferred Dargah/Fatiha/Niyah", Array.isArray(currentProfileData.preferred_dargah_fatiha_niyah) ? currentProfileData.preferred_dargah_fatiha_niyah.join(', ') : currentProfileData.preferred_dargah_fatiha_niyah)}
                {buildInfoRow("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", "Preferred Sect", currentProfileData.preferred_sect)}
                {buildInfoRow("M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", "Desired Practicing Level", currentProfileData.desired_practicing_level)}
                {buildInfoRow("M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", "Preferred City/State", currentProfileData.preferred_city_state)}
                {buildInfoRow("M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z", "Preferred Family Type", currentProfileData.preferred_family_type)}
                {buildInfoRow("M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z", "Preferred Family Background", currentProfileData.preferred_family_background)}
                {buildInfoRow("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", "Preferred Education", currentProfileData.preferred_education)}
                {buildInfoRow("M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6", "Preferred Occupation/Profession", currentProfileData.preferred_occupation_profession)}
              </div>
            </div>

            {/* MemStepFive - Privacy Settings Card */}
            <div className="info-card">
              <div className="info-card-header">
                <div className="info-card-icon">
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="info-card-title">Privacy Settings</h3>
              </div>
              <div className="info-card-content">
                {/* MemStepFive Fields */}
                {buildInfoRow("M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z", "Profile Visibility", currentProfileData.profile_visible)}
                {/* Photo Privacy Option only for female users - MemStepFive logic */}
                {currentProfileData.gender?.toLowerCase() === 'female' && buildInfoRow("M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", "Photo Upload Privacy Option", currentProfileData.photo_upload_privacy_option)}
              </div>
            </div>

            {/* MemStepSix - Additional Information Card (Optional Fields) */}
            {(currentProfileData.expectations || currentProfileData.additional_info || currentProfileData.deal_breakers) && (
              <div className="info-card">
                <div className="info-card-header">
                  <div className="info-card-icon">
                    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="info-card-title">Additional Information</h3>
                </div>
                <div className="info-card-content">
                  {/* MemStepSix Fields (Optional) */}
                  {currentProfileData.expectations && buildInfoRow("M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", "Expectations", currentProfileData.expectations)}
                  {currentProfileData.deal_breakers && buildInfoRow("M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z", "Deal Breakers", currentProfileData.deal_breakers)}
                  {currentProfileData.additional_info && buildInfoRow("M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", "Additional Info", currentProfileData.additional_info)}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Bottom Action Buttons - Exact profile_details_screen.dart style */}
        <div className="profile-details-actions">
          <button className="action-button secondary" onClick={handleChatNow}>
            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat Now
          </button>
          <button 
            className="action-button primary" 
            onClick={handleSendInterest}
            disabled={isSendingInterest}
          >
            {isSendingInterest ? (
              <div className="loading-spinner"></div>
            ) : (
              <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
            {isSendingInterest ? 'Sending...' : 'Send Interest'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetailsModal;
