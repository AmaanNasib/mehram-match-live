import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDataObjectV2, postDataWithFetchV2, fetchDataWithTokenV2 } from '../../apiUtils';
import Header from '../Dashboard/header/Header';
import MemberSendInterest from '../Dashboard/AgentActions/MemberSendInterest';
import './UserDetailProfessional.css';
import Footer from '../sections/Footer';

const UserDetailProfessional = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  
  // Action states
  const [interestStatus, setInterestStatus] = useState(false);
  const [shortlistStatus, setShortlistStatus] = useState(false);
  const [blockStatus, setBlockStatus] = useState(false);

  // Agent member selection modal
  const [showMemberSendInterest, setShowMemberSendInterest] = useState(false);

  const isOwnProfile = currentUserId && userId && currentUserId.toString() === userId.toString();
  const isAgent = role === "agent";

  useEffect(() => {
    if (userId) {
      const parameter = {
        url: `/api/user/${userId}/`,
        setterFunction: setUserData,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataObjectV2(parameter);
    }
  }, [userId]);

  // Check interest, shortlist, and block status for other users' profiles
  useEffect(() => {
    if (userData && !isOwnProfile && currentUserId) {
      const checkActionStatus = async () => {
        try {
          // For agent, check shortlist separately from agent API
          if (isAgent) {
            // Check shortlist status from agent API
            try {
              await fetchDataWithTokenV2({
                url: `/api/agent/shortlist/?agent_id=${currentUserId}`,
                setterFunction: (data) => {
                  // Find if this user is in agent's shortlist
                  const shortlistItem = (data || []).find(item => 
                    item.action_on && item.action_on.id === Number(userId) && item.shortlisted === true
                  );
                  setShortlistStatus(shortlistItem ? true : false);
                },
                setErrors: (error) => {
                  setShortlistStatus(false);
                }
              });
            } catch (error) {
              setShortlistStatus(false);
            }

            // Check interest and block from regular API
            await fetchDataWithTokenV2({
              url: `/api/recieved/?action_by_id=${currentUserId}&action_on_id=${userId}`,
              setterFunction: (data) => {
                let hasInterest = false;
                let hasBlock = false;

                if (Array.isArray(data)) {
                  data.forEach(item => {
                    const isCurrentUserAction = 
                      (item.action_by && item.action_by.id === Number(currentUserId)) ||
                      (item.action_by_id === Number(currentUserId));
                    
                    const isTargetUser = 
                      (item.action_on && item.action_on.id === Number(userId)) ||
                      (item.action_on_id === Number(userId));

                    if (isCurrentUserAction && isTargetUser) {
                      if (item.interest === true || item.interest === "true") {
                        hasInterest = true;
                      }
                      if (item.blocked === true || item.blocked === "true") {
                        hasBlock = true;
                      }
                    }
                  });
                } else if (data && typeof data === 'object') {
                  const isCurrentUserAction = 
                    (data.action_by && data.action_by.id === Number(currentUserId)) ||
                    (data.action_by_id === Number(currentUserId));
                  
                  const isTargetUser = 
                    (data.action_on && data.action_on.id === Number(userId)) ||
                    (data.action_on_id === Number(userId));

                  if (isCurrentUserAction && isTargetUser) {
                    hasInterest = data.interest === true || data.interest === "true";
                    hasBlock = data.blocked === true || data.blocked === "true";
                  }
                }

                setInterestStatus(hasInterest);
                setBlockStatus(hasBlock);
              },
              setErrors: (error) => {
                setInterestStatus(false);
                setBlockStatus(false);
              }
            });
          } else {
            // Regular user - check all from regular API
            await fetchDataWithTokenV2({
              url: `/api/recieved/?action_by_id=${currentUserId}&action_on_id=${userId}`,
              setterFunction: (data) => {
                let hasInterest = false;
                let hasShortlist = false;
                let hasBlock = false;

                if (Array.isArray(data)) {
                  data.forEach(item => {
                    const isCurrentUserAction = 
                      (item.action_by && item.action_by.id === Number(currentUserId)) ||
                      (item.action_by_id === Number(currentUserId));
                    
                    const isTargetUser = 
                      (item.action_on && item.action_on.id === Number(userId)) ||
                      (item.action_on_id === Number(userId));

                    if (isCurrentUserAction && isTargetUser) {
                      if (item.interest === true || item.interest === "true") {
                        hasInterest = true;
                      }
                      if (item.shortlisted === true || item.shortlisted === "true") {
                        hasShortlist = true;
                      }
                      if (item.blocked === true || item.blocked === "true") {
                        hasBlock = true;
                      }
                    }
                  });
                } else if (data && typeof data === 'object') {
                  const isCurrentUserAction = 
                    (data.action_by && data.action_by.id === Number(currentUserId)) ||
                    (data.action_by_id === Number(currentUserId));
                  
                  const isTargetUser = 
                    (data.action_on && data.action_on.id === Number(userId)) ||
                    (data.action_on_id === Number(userId));

                  if (isCurrentUserAction && isTargetUser) {
                    hasInterest = data.interest === true || data.interest === "true";
                    hasShortlist = data.shortlisted === true || data.shortlisted === "true";
                    hasBlock = data.blocked === true || data.blocked === "true";
                  }
                }

                setInterestStatus(hasInterest);
                setShortlistStatus(hasShortlist);
                setBlockStatus(hasBlock);
              },
              setErrors: (error) => {
                setInterestStatus(false);
                setShortlistStatus(false);
                setBlockStatus(false);
              }
            });
          }
        } catch (error) {
          // Fallback: set all to false if error occurs
          setInterestStatus(false);
          setShortlistStatus(false);
          setBlockStatus(false);
        }
      };

      checkActionStatus();
    }
  }, [userData, isOwnProfile, currentUserId, userId, isAgent]);

  // Profile Image
  const getProfileImage = () => {
    if (userData?.profile_photo) {
      return `${process.env.REACT_APP_API_URL}${userData.profile_photo}`;
    }
    return userData?.gender === "male" 
      ? `data:image/svg+xml;utf8,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6">
            <circle cx="12" cy="8" r="5" fill="#bfdbfe"/>
            <path d="M12 14c-4.42 0-8 2.69-8 6v1h16v-1c0-3.31-3.58-6-8-6z" fill="#bfdbfe"/>
          </svg>`
        )}`
      : `data:image/svg+xml;utf8,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ec4899">
            <circle cx="12" cy="8" r="5" fill="#fbcfe8"/>
            <path d="M12 14c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6z" fill="#fbcfe8"/>
          </svg>`
        )}`;
  };

  // Action Handlers
  const handleInterest = () => {
    if (interestStatus) {
      if (window.confirm('Are you sure you want to withdraw your interest?')) {
        sendAction('interest', false);
      }
    } else {
      // If agent, open MemberSendInterest modal
      if (isAgent) {
        setShowMemberSendInterest(true);
      } else {
        // Regular user - send directly
        sendAction('interest', true);
      }
    }
  };

  const handleShortlist = () => {
    const newShortlistStatus = !shortlistStatus;
    
    // For agent, use agent shortlist API endpoint
    // For regular user, use regular shortlist API
    if (isAgent) {
      // Agent shortlist API
      const parameter = {
        url: `/api/agent/shortlist/`,
        payload: {
          action_on_id: parseInt(userId),
          shortlisted: newShortlistStatus
        },
        setErrors: setErrors,
        tofetch: {
          items: [{
            fetchurl: `/api/user/${userId}/`,
            dataset: setUserData,
            setErrors: setErrors
          }],
          setErrors: setErrors
        }
      };

      postDataWithFetchV2(parameter);
    } else {
      // Regular user shortlist API
      const parameter = {
        url: `/api/recieved/`,
        payload: {
          action_by_id: currentUserId,
          action_on_id: userId,
          shortlisted: newShortlistStatus
        },
        setErrors: setErrors,
        tofetch: {
          items: [{
            fetchurl: `/api/user/${userId}/`,
            dataset: setUserData,
            setErrors: setErrors
          }],
          setErrors: setErrors
        }
      };

      postDataWithFetchV2(parameter);
    }
    
    // Update local state
    setShortlistStatus(newShortlistStatus);
    
    if (newShortlistStatus) {
      alert(isAgent ? 'Added to your shortlist successfully!' : 'Added to shortlist successfully!');
    } else {
      alert(isAgent ? 'Removed from your shortlist!' : 'Removed from shortlist!');
    }
  };

  const handleBlock = () => {
    const isCurrentlyBlocked = blockStatus;
    
    const parameter = {
      url: isCurrentlyBlocked ? `/api/recieved/unblock/` : `/api/recieved/block/`,
      payload: {
        action_by_id: currentUserId,
        action_on_id: userId
      },
      setErrors: setErrors,
      tofetch: {
        items: [{
          fetchurl: `/api/user/${userId}/`,
          dataset: setUserData,
          setErrors: setErrors
        }],
        setErrors: setErrors
      }
    };

    postDataWithFetchV2(parameter);
    
    // Update local state
    setBlockStatus(!isCurrentlyBlocked);
  };

  const sendAction = (actionType, value) => {
    const payload = {
      action_by_id: currentUserId,
      action_on_id: userId,
      [actionType]: value
    };

    const parameter = {
      url: `/api/recieved/`,
      payload,
      setErrors: setErrors,
      tofetch: {
        items: [{
          fetchurl: `/api/user/${userId}/`,
          dataset: setUserData,
          setErrors: setErrors
        }],
        setErrors: setErrors
      }
    };

    postDataWithFetchV2(parameter);

    // Update local state
    if (actionType === 'interest') setInterestStatus(value);
  };

  if (loading) {
    return (
      <div className="professional-profile">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (errors || !userData) {
    return (
      <div className="professional-profile">
        <Header />
        <div className="error-container">
          <h2>Profile not found</h2>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="professional-profile">
      <Header />
      
      <div className="profile-container">
        {/* Hero Section */}
        <div className="profile-hero">
          <div className="hero-content">
            <div className="profile-image-wrapper">
              <img 
                src={getProfileImage()} 
                alt={userData.name}
                className="profile-image"
              />
              <div className="profile-status online"></div>
            </div>
            
            <div className="profile-header-info">
              <div className="profile-name-section">
                <h1 className="profile-name">{userData.name}</h1>
                <p className="profile-id">Member ID: {userData.member_id}</p>
              </div>
              
              <div className="profile-location">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>{userData.city}, {userData.state}</span>
              </div>
              
              <div className="profile-meta">
                <span className="meta-item">
                  <strong>{userData.age}</strong> years
                </span>
                <span className="meta-divider">•</span>
                <span className="meta-item">
                  <strong>{userData.martial_status}</strong>
                </span>
                <span className="meta-divider">•</span>
                <span className="meta-item">
                  <strong>{userData.Education}</strong>
                </span>
              </div>
            </div>

            {/* Action Buttons for Other Profiles */}
            {!isOwnProfile && (
              <div className="profile-actions">
                <button 
                  className={`action-btn ${interestStatus ? 'active' : ''}`}
                  onClick={handleInterest}
                  title={interestStatus ? 'Withdraw Interest' : 'Send Interest'}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={interestStatus ? "currentColor" : "none"} stroke="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2"/>
                  </svg>
                </button>
                
                <button 
                  className={`action-btn ${shortlistStatus ? 'active' : ''}`}
                  onClick={handleShortlist}
                  title={shortlistStatus ? 'Remove from Shortlist' : 'Add to Shortlist'}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={shortlistStatus ? "currentColor" : "none"} stroke="currentColor">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" strokeWidth="2"/>
                  </svg>
                </button>
                
                <button 
                  className={`action-btn ${blockStatus ? 'blocked' : ''}`}
                  onClick={handleBlock}
                  title={blockStatus ? 'Unblock User' : 'Block User'}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <path d="M4.93 4.93l14.14 14.14" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Info
          </button>
          <button 
            className={`tab-btn ${activeTab === 'religious' ? 'active' : ''}`}
            onClick={() => setActiveTab('religious')}
          >
            Religious Info
          </button>
          <button 
            className={`tab-btn ${activeTab === 'family' ? 'active' : ''}`}
            onClick={() => setActiveTab('family')}
          >
            Family Background
          </button>
          <button 
            className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            Partner Preferences
          </button>
        </div>

        {/* Tab Content */}
        <div className="profile-content">
          
          {/* Basic Information */}
          {activeTab === 'basic' && (
            <div className="tab-content">
              <div className="info-grid">
                {/* Row 1: Personal Details + Location */}
                <InfoCard title="Personal Details">
                  <InfoRow label="Full Name" value={userData.name} />
                  <InfoRow label="Gender" value={userData.gender} />
                  <InfoRow label="Age" value={userData.age} />
                  <InfoRow label="Date of Birth" value={userData.dob} />
                  <InfoRow label="Marital Status" value={userData.martial_status} />
                  <InfoRow label="Height" value={userData.height} />
                  <InfoRow label="Weight" value={userData.weight} />
                  <InfoRow label="Skin Tone" value={userData.skin_tone} />
                  <InfoRow label="Disability" value={userData.disability || 'None'} />
                </InfoCard>

                <InfoCard title="Location">
                  <InfoRow label="Current City" value={userData.city} />
                  <InfoRow label="Current State" value={userData.state} />
                  <InfoRow label="Current Country" value={userData.country} />
                  <InfoRow label="Native City" value={userData.native_city} />
                  <InfoRow label="Native State" value={userData.native_state} />
                  <InfoRow label="Native Country" value={userData.native_country} />
                </InfoCard>

                {/* Row 2: Professional Details + About */}
                <InfoCard title="Professional Details">
                  <InfoRow label="Education" value={userData.Education} />
                  <InfoRow label="Profession" value={userData.profession} />
                  <InfoRow label="Job Description" value={userData.describe_job_business} />
                  <InfoRow label="Annual Income" value={userData.income} />
                </InfoCard>

                {userData.about_you ? (
                  <InfoCard title="About">
                    <p className="about-text">{userData.about_you}</p>
                  </InfoCard>
                ) : (
                  <InfoCard title="About">
                    <p className="about-text">No description provided yet.</p>
                  </InfoCard>
                )}
              </div>
            </div>
          )}

          {/* Religious Information */}
          {activeTab === 'religious' && (
            <div className="tab-content">
              <div className="info-grid">
                <InfoCard title="Religious Beliefs">
                  <InfoRow label="Sect/School of Thought" value={userData.sect_school_info} />
                  <InfoRow label="Belief in Dargah/Fatiha/Niyah" value={userData.believe_in_dargah_fatiha_niyah} />
                  <InfoRow label="Islamic Practice Level" value={userData.islamic_practicing_level} />
                  <InfoRow label="Namaz Performance" value={userData.perform_namaz} />
                  <InfoRow label="Quran Recitation" value={userData.recite_quran} />
                  {userData.gender === 'female' && (
                    <InfoRow label="Hijab/Niqab Preference" value={userData.hijab_niqab_prefer} />
                  )}
                </InfoCard>

                <InfoCard title="Marriage Plans">
                  <InfoRow label="Marriage Timeline" value={userData.marriage_plan} />
                  <InfoRow label="Cultural Background" value={userData.cultural_background} />
                </InfoCard>
              </div>
            </div>
          )}

          {/* Family Background */}
          {activeTab === 'family' && (
            <div className="tab-content">
              <div className="info-grid">
                <InfoCard title="Parents">
                  <InfoRow label="Father's Name" value={userData.father_name} />
                  <InfoRow label="Father's Occupation" value={userData.father_occupation} />
                  <InfoRow label="Mother's Name" value={userData.mother_name} />
                  <InfoRow label="Mother's Occupation" value={userData.mother_occupation} />
                </InfoCard>

                <InfoCard title="Family Details">
                  <InfoRow label="Family Type" value={userData.family_type} />
                  <InfoRow label="Family Practice Level" value={userData.family_practicing_level} />
                  <InfoRow label="Number of Siblings" value={userData.number_of_siblings} />
                  <InfoRow label="Number of Brothers" value={userData.number_of_brothers} />
                  <InfoRow label="Number of Sisters" value={userData.number_of_sisters} />
                </InfoCard>

                {userData.gender === 'female' && (
                  <InfoCard title="Wali Information">
                    <InfoRow label="Wali Name" value={userData.wali_name} />
                    <InfoRow label="Wali Contact" value={userData.wali_contact_number} />
                    <InfoRow label="Wali Relation" value={userData.wali_blood_relation} />
                  </InfoCard>
                )}

                {(userData.martial_status === 'divorced' || userData.martial_status === 'widowed') && (
                  <InfoCard title="Children">
                    <InfoRow label="Number of Children" value={userData.number_of_children} />
                    <InfoRow label="Sons" value={userData.number_of_son} />
                    <InfoRow label="Daughters" value={userData.number_of_daughter} />
                  </InfoCard>
                )}
              </div>
            </div>
          )}

          {/* Partner Preferences */}
          {activeTab === 'preferences' && (
            <div className="tab-content">
              <div className="info-grid">
                <InfoCard title="Religious Preferences">
                  <InfoRow label="Preferred Sect" value={userData.preferred_sect} />
                  <InfoRow label="Desired Practice Level" value={userData.desired_practicing_level} />
                  <InfoRow label="Preferred Spiritual Beliefs" value={userData.preferred_dargah_fatiha_niyah} />
                </InfoCard>

                <InfoCard title="Location & Family">
                  <InfoRow label="Preferred City/State" value={userData.preferred_city_state || userData.preferred_city} />
                  <InfoRow label="Preferred Family Type" value={userData.preferred_family_type} />
                  <InfoRow label="Preferred Family Background" value={userData.preferred_family_background} />
                  <InfoRow label="Preferred Surname" value={userData.preferred_surname} />
                </InfoCard>

                <InfoCard title="Educational & Professional">
                  <InfoRow label="Preferred Education" value={userData.preferred_education} />
                  <InfoRow label="Preferred Profession" value={userData.preferred_occupation_profession} />
                </InfoCard>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Member Send Interest Modal for Agent */}
      {isAgent && (
        <MemberSendInterest
          isOpen={showMemberSendInterest}
          onClose={() => setShowMemberSendInterest(false)}
          targetUserId={userId}
          targetUserName={userData?.name || userData?.first_name || 'N/A'}
          targetUserPhoto={userData?.profile_photo}
          targetUserGender={userData?.gender}
          targetUserData={userData}
        />
      )}

      <Footer />
    </div>
  );
};

// Helper Components
const InfoCard = ({ title, children }) => (
  <div className="info-card">
    <h3 className="card-title">{title}</h3>
    <div className="card-content">
      {children}
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="info-row">
    <span className="info-label">{label}:</span>
    <span className="info-value">{value || 'Not specified'}</span>
  </div>
);

export default UserDetailProfessional;

