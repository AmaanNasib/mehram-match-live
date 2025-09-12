import React, { useState, useEffect } from 'react';

// Profile Details Modal - Exact Profile Details Screen Style
const ProfileDetailsModal = ({ isOpen, onClose, userData, currentUserGender, currentUserId }) => {
  const [isSendingInterest, setIsSendingInterest] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [galleryHeight, setGalleryHeight] = useState(350);
  const [isGalleryCollapsed, setIsGalleryCollapsed] = useState(false);

  // Initialize gallery photos - moved before early return
  useEffect(() => {
    if (isOpen && userData) {
      const photos = [];
      const profilePhoto = userData.upload_photo || userData.profile_image || (userData.gender === 'female' ? '/images/hijab-woman.png' : '/images/muslim-man.png');
      if (profilePhoto) photos.push({ id: 1, url: profilePhoto, type: 'profile' });
      if (userData.additional_photos) {
        const additionalPhotos = Array.isArray(userData.additional_photos) ? userData.additional_photos : [userData.additional_photos];
        additionalPhotos.forEach((photo, index) => {
          if (photo) photos.push({ id: index + 2, url: photo, type: 'additional' });
        });
      }
      setGalleryPhotos(photos);
    }
  }, [isOpen, userData]);

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

  if (!isOpen || !userData) return null;

  // Extract data exactly like profile_details_screen.dart
  const fullName = userData.name || userData.first_name || userData.username || "User";
  const age = userData.age || "Not specified";
  const profession = userData.profession || "Not specified";
  const city = userData.city || "";
  const state = userData.state || "";
  const location = [city, state].filter(s => s.length > 0).join(', ') || "Location not specified";
  const marital = userData.marital_status || userData.martial_status || "Not specified";
  const religion = userData.religion || "Not specified";
  const education = userData.education || "Not specified";
  const memberId = userData.id || userData.user_id || "N/A";
  const profilePhoto = userData.upload_photo || userData.profile_image || (userData.gender === 'female' ? '/images/hijab-woman.png' : '/images/muslim-man.png');
  const isAgentVerified = userData.agent_verified === true;
  const isVerified = userData.is_verified === true;

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
      // API call to send interest
      console.log('Sending interest to:', userData.id);
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
      console.log('Starting chat with:', userData.id);
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
                  {userData.about_me || userData.introduction || "No introduction provided yet."}
                </p>
              </div>
            </div>

            {/* Basic Information Card - Exact profile_details_screen.dart style */}
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
                {buildInfoRow("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", "Full Name", fullName)}
                {buildInfoRow("M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z", "Gender", userData.gender ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : null)}
                {buildInfoRow("M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", "Profile Created For", userData.onbehalf)}
                {buildInfoRow("M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.5 1.5 0 003 15.546V12a9 9 0 0118 0v3.546z", "Date of Birth", userData.dob)}
                {buildInfoRow("M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", "Marital Status", marital)}
                {buildInfoRow("M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4", "Height", userData.height)}
                {buildInfoRow("M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", "Location", location)}
                {buildInfoRow("M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6", "Profession", profession)}
                {buildInfoRow("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", "Education", education)}
              </div>
            </div>

            {/* Religious Information Card - Exact profile_details_screen.dart style */}
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
                {buildInfoRow("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", "Sect/School Information", userData.sect_school_info)}
                {buildInfoRow("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", "Believe in Dargah/Fatiha/Niyah", userData.believe_in_dargah_fatiha_niyah)}
                {buildInfoRow("M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", "Islamic Practicing Level", userData.islamic_practicing_level)}
                {userData.gender?.toLowerCase() === 'female' && buildInfoRow("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", "Hijab/Niqab Preference", userData.hijab_niqab_prefer)}
                {buildInfoRow("M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", "Perform Namaz", userData.perform_namaz)}
                {buildInfoRow("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", "Recite Quran", userData.recite_quran)}
              </div>
            </div>

            {/* Family Information Card - Exact profile_details_screen.dart style */}
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
                {buildInfoRow("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", "Father Name", userData.father_name)}
                {buildInfoRow("M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", "Is Father Step Father?", userData.step_father)}
                {buildInfoRow("M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", "Is Father Alive?", userData.father_alive)}
                {buildInfoRow("M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6", "Father Occupation", userData.father_occupation)}
                {buildInfoRow("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", "Mother Name", userData.mother_name)}
                {buildInfoRow("M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", "Is Mother Alive?", userData.mother_alive)}
                {buildInfoRow("M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6", "Mother Occupation", userData.mother_occupation)}
                {buildInfoRow("M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z", "Family Type", userData.family_type)}
                {buildInfoRow("M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", "Family Practicing Level", userData.family_practicing_level)}
                {buildInfoRow("M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z", "Number of Brothers", userData.number_of_brothers || userData.number_of_brother)}
                {buildInfoRow("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", "Number of Sisters", userData.number_of_sisters || userData.number_of_sister)}
                {buildInfoRow("M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z", "Number of Children", userData.number_of_children)}
                {buildInfoRow("M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z", "Number of Sons", userData.number_of_son)}
                {buildInfoRow("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", "Number of Daughters", userData.number_of_daughter)}
              </div>
            </div>

            {/* Partner Preference Card - Exact profile_details_screen.dart style */}
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
                {buildInfoRow("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", "Preferred Surname", userData.preferred_surname)}
                {buildInfoRow("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", "Preferred Dargah/Fatiha/Niyah", userData.preferred_dargah_fatiha_niyah)}
                {buildInfoRow("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", "Preferred Sect", userData.preferred_sect)}
                {buildInfoRow("M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z", "Desired Practicing Level", userData.desired_practicing_level)}
                {buildInfoRow("M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", "Preferred City/State", userData.preferred_city_state)}
                {buildInfoRow("M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z", "Preferred Family Type", userData.preferred_family_type)}
                {buildInfoRow("M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z", "Preferred Family Background", userData.preferred_family_background)}
                {buildInfoRow("M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", "Preferred Education", userData.preferred_education)}
                {buildInfoRow("M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6", "Preferred Occupation/Profession", userData.preferred_occupation_profession)}
                {buildInfoRow("M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", "Marriage Plan", userData.marriage_plan)}
                {buildInfoRow("M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", "Smoking/Cigarette/Sheesha", userData.smoking_cigarette_sheesha)}
                {buildInfoRow("M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", "Drinking/Alcohol/Wine", userData.drinking_alcohol_wine)}
              </div>
            </div>

            {/* Expectations & Preferences Card - Exact profile_details_screen.dart style */}
            {(userData.expectations || userData.additional_info || userData.deal_breakers) && (
              <div className="info-card">
                <div className="info-card-header">
                  <div className="info-card-icon">
                    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="info-card-title">Expectations & Preferences</h3>
                </div>
                <div className="info-card-content">
                  {userData.expectations && buildInfoRow("M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", "Expectations", userData.expectations)}
                  {userData.deal_breakers && buildInfoRow("M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z", "Deal Breakers", userData.deal_breakers)}
                  {userData.additional_info && buildInfoRow("M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", "Additional Info", userData.additional_info)}
                </div>
              </div>
            )}

            {/* Social Details Card - Exact profile_details_screen.dart style */}
            <div className="info-card">
              <div className="info-card-header">
                <div className="info-card-icon">
                  <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="info-card-title">Social Details</h3>
              </div>
              <div className="info-card-content">
                {buildInfoRow("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", "About Me", userData.about_me || userData.about_you)}
                {buildInfoRow("M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z", "Cultural Background", userData.cultural_background)}
                {buildInfoRow("M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1", "Income", userData.income)}
                {buildInfoRow("M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", "Disability", userData.disability)}
                {buildInfoRow("M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4", "Height", userData.height)}
                {buildInfoRow("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", "Skin Tone", userData.skin_tone)}
                {buildInfoRow("M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", "Body Type", userData.body_type)}
                {buildInfoRow("M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1", "Financial Status", userData.financial_status)}
              </div>
            </div>
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
