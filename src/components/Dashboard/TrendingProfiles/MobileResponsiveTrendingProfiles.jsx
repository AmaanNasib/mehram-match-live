import React, { useState, useEffect, useRef } from 'react';
import DashboadrCard from '../dashboardCard/DashboardCard';
import './MobileResponsiveTrendingProfiles.css';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiTrendingUp, FiEye } from 'react-icons/fi';

// Shimmer Loading Component for Mobile Trending Profiles
const ShimmerTrendingCard = () => (
  <div className="shimmer-trending-card">
    <div className="shimmer-card-image"></div>
    <div className="shimmer-card-content">
      <div className="shimmer-card-header">
        <div className="shimmer-avatar"></div>
        <div className="shimmer-name"></div>
      </div>
      <div className="shimmer-card-details">
        <div className="shimmer-detail-row">
          <div className="shimmer-detail-left"></div>
          <div className="shimmer-detail-right"></div>
        </div>
        <div className="shimmer-detail-row">
          <div className="shimmer-detail-left"></div>
          <div className="shimmer-detail-right"></div>
        </div>
        <div className="shimmer-detail-row">
          <div className="shimmer-detail-left"></div>
          <div className="shimmer-detail-right"></div>
        </div>
      </div>
      <div className="shimmer-card-actions">
        <div className="shimmer-action-btn"></div>
        <div className="shimmer-action-btn"></div>
      </div>
    </div>
  </div>
);

const MobileResponsiveTrendingProfiles = ({ profiles, setApiData, url, activeUser }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Filter profiles based on gender
  const filteredProfiles = profiles && profiles.length > 0 ? profiles.filter(profile => {
    const currentUserGender = activeUser?.gender;
    const profileGender = profile.user?.gender || profile?.gender;
    
    if (currentUserGender === 'male' && profileGender === 'female') return true;
    if (currentUserGender === 'female' && profileGender === 'male') return true;
    if (!currentUserGender || !profileGender) return true;
    
    return false;
  }) : [];

  // Auto-scroll functionality
  useEffect(() => {
    if (filteredProfiles.length <= 1) return;
    
    const interval = setInterval(() => {
      if (!isScrolling) {
        setCurrentIndex((prevIndex) => 
          prevIndex >= filteredProfiles.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [filteredProfiles.length, isScrolling]);

  // Scroll to specific index
  const scrollToIndex = (index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.children[0]?.offsetWidth || 280;
      const gap = 16;
      const scrollPosition = index * (cardWidth + gap);
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
    setCurrentIndex(index);
  };

  // Navigation functions
  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : filteredProfiles.length - 1;
    scrollToIndex(newIndex);
  };

  const goToNext = () => {
    const newIndex = currentIndex < filteredProfiles.length - 1 ? currentIndex + 1 : 0;
    scrollToIndex(newIndex);
  };

  // Handle scroll events
  const handleScroll = () => {
    setIsScrolling(true);
    clearTimeout(handleScroll.timeout);
    handleScroll.timeout = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  };

  // Handle view all click
  const handleViewAll = () => {
    navigate('/viewalltrendingprofiles');
  };

  return (
    <section className="mobile-trending-section">
      {/* Section Header */}
      <div className="trending-header">
        <div className="trending-title-section">
          <div className="trending-icon-wrapper">
            <FiTrendingUp className="trending-icon" />
          </div>
          <div className="trending-title-content">
            <h2 className="trending-title">Top Trending Profiles</h2>
            <p className="trending-subtitle">To achieve more personalized suggestion complete your profile.</p>
          </div>
        </div>
        <button 
          className="view-all-btn"
          onClick={handleViewAll}
        >
          <FiEye className="view-all-icon" />
          <span>View All</span>
        </button>
      </div>

      {/* Profile Cards Container */}
      <div className="trending-content">
        {isLoading ? (
          <div className="shimmer-trending-container">
            {[...Array(4)].map((_, index) => (
              <ShimmerTrendingCard key={index} />
            ))}
          </div>
        ) : (
          <>
            {/* Navigation Arrows - Desktop Only */}
            {filteredProfiles.length > 1 && (
              <>
                <button 
                  className="nav-arrow nav-arrow-left"
                  onClick={goToPrevious}
                  aria-label="Previous profile"
                >
                  <FiChevronLeft className="arrow-icon" />
                </button>
                <button 
                  className="nav-arrow nav-arrow-right"
                  onClick={goToNext}
                  aria-label="Next profile"
                >
                  <FiChevronRight className="arrow-icon" />
                </button>
              </>
            )}

            {/* Profile Cards Scroll Container */}
            <div 
              className="trending-cards-container"
              ref={scrollContainerRef}
              onScroll={handleScroll}
            >
              <div className="trending-cards-wrapper">
                {filteredProfiles.length > 0 ? (
                  filteredProfiles.map((profile, index) => {
                    const user = profile && profile.user ? profile.user : profile;
                    const keyId = user?.id || profile?.id;
                    return (
                      <div 
                        key={keyId}
                        className="trending-card-item"
                      >
                        <DashboadrCard 
                          profile={user}
                          url={url}
                          interested_id={profile?.interested_id}
                          setApiData={setApiData}
                          IsInterested={profile?.is_interested}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="no-profiles-message">
                    <div className="no-profiles-icon">
                      <FiTrendingUp />
                    </div>
                    <h3>No Trending Profiles</h3>
                    <p>Complete your profile to see personalized trending profiles.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Dots Indicator - Mobile Only */}
            {filteredProfiles.length > 1 && (
              <div className="trending-dots-indicator">
                {filteredProfiles.map((_, index) => (
                  <button
                    key={index}
                    className={`trending-dot ${index === currentIndex ? 'active' : ''}`}
                    onClick={() => scrollToIndex(index)}
                    aria-label={`Go to profile ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Progress Bar */}
      {filteredProfiles.length > 1 && (
        <div className="trending-progress-bar">
          <div 
            className="trending-progress-fill"
            style={{ 
              width: `${((currentIndex + 1) / filteredProfiles.length) * 100}%` 
            }}
          />
        </div>
      )}
    </section>
  );
};

export default MobileResponsiveTrendingProfiles;
