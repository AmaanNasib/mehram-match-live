import React, { useState } from "react";
import "./SimpleProfileCard.css";

const SimpleProfileCard = ({ profile, onInterested, onShortlist, onIgnore, onMessage, onViewProfile, isInterested }) => {
  const [loading, setLoading] = useState(false);
  const [loadingShortlist, setLoadingShortlist] = useState(false);

  // Handle shortlist button click - for regular users
  const handleShortlistClick = async () => {
    console.log('Shortlist button clicked', { profile, onShortlist });
    
    // If onShortlist callback is provided, use it (e.g., for agents)
    if (onShortlist) {
      console.log('Using onShortlist callback');
      onShortlist(profile);
      return;
    }

    console.log('Making direct API call for shortlist');
    
    // Direct API call for regular users
    try {
      setLoadingShortlist(true);
      
      const currentUserId = localStorage.getItem('userId');
      const targetUserId = profile?.id;

      console.log('Shortlist API payload:', { currentUserId, targetUserId });

      if (!currentUserId || !targetUserId) {
        alert('Error: User information not available');
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/recieved/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action_by_id: parseInt(currentUserId),
            action_on_id: parseInt(targetUserId),
            shortlisted: true
          })
        }
      );

      console.log('Shortlist API response:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Shortlist error:', errorData);
        alert(errorData.detail || 'Failed to shortlist user');
        return;
      }

      const data = await response.json();
      console.log('Shortlist success:', data);
      alert('User shortlisted successfully! ✅');
      
    } catch (error) {
      console.error('Error shortlisting user:', error);
      alert('An error occurred while shortlisting user');
    } finally {
      setLoadingShortlist(false);
    }
  };

  // Handle interest button click - for regular users
  const handleInterestClick = async () => {
    // If onInterested callback is provided, use it (e.g., for agents)
    if (onInterested) {
      onInterested(profile);
      return;
    }

    // Direct API call for regular users
    try {
      setLoading(true);
      
      const currentUserId = localStorage.getItem('userId');
      const targetUserId = profile?.id;

      if (!currentUserId || !targetUserId) {
        alert('Error: User information not available');
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/recieved/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action_by_id: parseInt(currentUserId),
            action_on_id: parseInt(targetUserId),
            interest: true
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle specific errors
        if (errorData.detail && errorData.detail.includes('Gender')) {
          alert('Gender compatibility required: Male can only send interest to Female and vice versa');
        } else if (errorData.detail && errorData.detail.includes('blocked')) {
          alert('Cannot send interest. User interaction is blocked.');
        } else if (errorData.already_sent) {
          alert('Interest already sent to this user');
        } else {
          alert(errorData.detail || 'Failed to send interest');
        }
        return;
      }

      const data = await response.json();
      
      if (data.already_sent) {
        alert('Interest already sent to this user!');
      } else {
        alert('Interest sent successfully! ✅');
        // Optionally refresh the data or update UI
      }
      
    } catch (error) {
      console.error('Error sending interest:', error);
      alert('An error occurred while sending interest');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="simple-profile-card">
      {/* Agent Verified Ribbon - Like the CSS example */}
      {profile?.agent_id && (
        <div className="ribbon">
          <h3>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Agent Verified
          </h3>
        </div>
      )}
      
      {/* Profile Photo with Online Badge */}
      <div className="simple-profile-photo">
        <img 
          src={profile?.profile_photo || "https://via.placeholder.com/200"} 
          alt={profile?.name || "Profile"} 
        />
        <div className="online-badge"></div>
      </div>

      {/* Profile Info Section */}
      <div className="simple-profile-content">
        {/* Name and Marital Status Header */}
        <div className="simple-profile-header">
          <h3>{profile?.name || "Not Mentioned"}</h3>
          <span className={`simple-marital-badge ${profile?.martial_status?.toLowerCase()}`}>
            {profile?.martial_status || "Not Mentioned"}
          </span>
        </div>

        {/* Member ID */}
        <div className="simple-member-id">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" fill="#FF1493"/>
            <path d="M8 10C3.58172 10 0 11.7909 0 14V16H16V14C16 11.7909 12.4183 10 8 10Z" fill="#FF1493"/>
          </svg>
          <span>ID: {profile?.member_id || profile?.id}</span>
        </div>

        {/* Info Grid */}
        <div className="simple-info-grid">
          {/* Age */}
          <div className="simple-info-item">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 15.5C3 12.1863 5.68629 9.5 9 9.5C12.3137 9.5 15 12.1863 15 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>{profile?.age || "N/A"} years</span>
          </div>

          {/* Location */}
          <div className="simple-info-item">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 9.5C10.3807 9.5 11.5 8.38071 11.5 7C11.5 5.61929 10.3807 4.5 9 4.5C7.61929 4.5 6.5 5.61929 6.5 7C6.5 8.38071 7.61929 9.5 9 9.5Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M2.75 7C2.75 11.0041 5.74594 14 9.75 14C10.3679 14 10.966 13.9315 11.5387 13.8029C12.6216 13.5801 13.75 13.316 13.75 13.25V7C13.75 2.99594 10.7541 0 6.75 0C2.74594 0 -0.25 2.99594 -0.25 7H2.75Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
            <span>{profile?.location || "Location N/A"}</span>
          </div>

          {/* Profession */}
          <div className="simple-info-item">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 6.5H15M9 2.5V6.5M4.5 15.5H13.5C14.3284 15.5 15 14.8284 15 14V10.5C15 9.67157 14.3284 9 13.5 9H4.5C3.67157 9 3 9.67157 3 10.5V14C3 14.8284 3.67157 15.5 4.5 15.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{profile?.profession || "Not Mentioned"}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="simple-action-buttons">
        {/* Quick Actions Row */}
        <div className="simple-quick-actions">
          {/* Interest/Heart Button */}
          <button 
            className={`simple-icon-btn interest-btn ${isInterested ? 'interested' : ''}`}
            onClick={handleInterestClick}
            title={loading ? "Sending..." : isInterested ? "Interest Sent" : "Send Interest"}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Shortlist Button */}
          <button 
            className="simple-icon-btn shortlist-btn"
            onClick={handleShortlistClick}
            title="Shortlist"
            disabled={loadingShortlist}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
            </svg>
          </button>

          {/* View Profile Button */}
          <button 
            className="simple-icon-btn view-btn"
            onClick={() => onViewProfile && onViewProfile(profile)}
            title="View Profile"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>

          {/* Ignore Button */}
          <button 
            className="simple-icon-btn ignore-btn"
            onClick={() => onIgnore && onIgnore(profile)}
            title="Ignore"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Message Button - Primary Action */}
        <button 
          className="simple-message-btn"
          onClick={() => onMessage && onMessage(profile)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Message</span>
        </button>
      </div>
    </div>
  );
};

export default SimpleProfileCard;
