import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./SimpleProfileCard.css";

const SimpleProfileCard = ({ profile, onInterested, onShortlist, onIgnore, onBlock, onMessage, onViewProfile, isInterested }) => {
  const [loading, setLoading] = useState(false);
  const [loadingShortlist, setLoadingShortlist] = useState(false);
  const [actualInterestStatus, setActualInterestStatus] = useState(isInterested || false);
  const [interestStatus, setInterestStatus] = useState(null); // Track the actual interest status
  const [removing, setRemoving] = useState(false);
  const [inlineHeight, setInlineHeight] = useState(undefined);
  const [isBlocked, setIsBlocked] = useState(profile?.is_blocked || false);
  const cardRef = useRef(null);
  const navigate = useNavigate();

  // Get profile photo URL with proper API base URL
  const getProfilePhotoUrl = () => {
    const photoUrl = profile?.profile_photo?.upload_photo || 
                    profile?.user_profilephoto?.upload_photo ||
                    profile?.profile_photo ||
                    profile?.profile_image ||
                    profile?.avatar ||
                    profile?.photo ||
                    profile?.image ||
                    profile?.user_profilephoto?.photo ||
                    profile?.user_profilephoto?.image;
    
    if (!photoUrl) {
      return "https://via.placeholder.com/200";
    }
    
    // If it's already a full URL, return as is
    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      return photoUrl;
    }
    
    // Otherwise, prepend API base URL
    const fullUrl = `${process.env.REACT_APP_API_URL}${photoUrl}`;
    return fullUrl;
  };

  // Check actual interest status on component mount
  useEffect(() => {
    const checkInterestStatus = async () => {
      if (!profile?.id) return;
      
      const currentUserId = localStorage.getItem('userId');
      if (!currentUserId) return;

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/recieved/?action_by_id=${currentUserId}&action_on_id=${profile.id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          const interestRecords = data.filter(record => 
            record.interest === true && 
            record.action_by_id === parseInt(currentUserId) &&
            record.action_on_id === parseInt(profile.id)
          );
          
          if (interestRecords.length > 0) {
            const latestRecord = interestRecords[0];
            const status = latestRecord.status;
            
            console.log('Button state check - status:', status);
            
            // Show as interested if status is accepted, pending, or null (not rejected)
            if (status === 'accepted' || status === 'pending' || status === 'Pending' || status === null) {
              console.log('Setting button to FILLED - status:', status);
              setActualInterestStatus(true);
              setInterestStatus(status);
            } else if (status && status.toLowerCase() === 'rejected') {
              console.log('Setting button to UNFILLED - status:', status);
              setActualInterestStatus(false);
              setInterestStatus(status);
            } else {
              // For any other status, default to not interested
              console.log('Setting button to UNFILLED - unknown status:', status);
              setActualInterestStatus(false);
              setInterestStatus(status);
            }
          } else {
            console.log('No interest records found - setting button to UNFILLED');
            setActualInterestStatus(false);
          }
        }
      } catch (error) {
        console.error('Error checking interest status:', error);
        // Fallback to prop value
        setActualInterestStatus(isInterested || false);
      }
    };

    checkInterestStatus();
  }, [profile?.id, isInterested]);

  // Handle shortlist button click - for regular users and agents
  const handleShortlistClick = async () => {
    console.log('Shortlist button clicked', { profile, onShortlist });
    
    // If onShortlist callback is provided, use it (e.g., for custom handlers)
    if (onShortlist) {
      console.log('Using onShortlist callback');
      onShortlist(profile);
      return;
    }

    console.log('Making direct API call for shortlist');
    
    // Direct API call - check role first
    try {
      setLoadingShortlist(true);
      
      const currentUserId = localStorage.getItem('userId');
      const targetUserId = profile?.id;
      const role = localStorage.getItem('role');
      const isAgent = role === 'agent';

      console.log('Shortlist API payload:', { currentUserId, targetUserId, isAgent });

      if (!currentUserId || !targetUserId) {
        alert('Error: User information not available');
        return;
      }

      // For agent, use agent shortlist API
      // For regular user, use regular shortlist API
      const url = isAgent 
        ? `${process.env.REACT_APP_API_URL}/api/agent/shortlist/`
        : `${process.env.REACT_APP_API_URL}/api/recieved/`;
      
      const payload = isAgent
        ? {
            action_on_id: parseInt(targetUserId),
            shortlisted: true
          }
        : {
            action_by_id: parseInt(currentUserId),
            action_on_id: parseInt(targetUserId),
            shortlisted: true
          };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Shortlist API response:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Shortlist error:', errorData);
        alert(errorData.detail || errorData.error || 'Failed to shortlist user');
        return;
      }

      const data = await response.json();
      console.log('Shortlist success:', data);
      alert(isAgent ? 'User added to your shortlist successfully! ✅' : 'User shortlisted successfully! ✅');
      
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

      // Check current interest status using better endpoint
      const statusResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/interested/?user_id=${currentUserId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        console.log('API Response data:', statusData);
        
        // Use interest_status field if available, otherwise fallback to old method
        let interestRecords = [];
        
        if (statusData.sent_interests) {
          // New API format with sent_interests field
          interestRecords = statusData.sent_interests.filter(record => 
            record.user && record.user.id === parseInt(targetUserId)
          ).map(record => {
            console.log('Record details:', {
              id: record.id,
              status: record.status,
              interest_status: record.interest_status,
              user: record.user
            });
            return {
              interest: true,
              status: record.interest_status || record.status, // Use interest_status if available, fallback to status
              action_by_id: parseInt(currentUserId),
              action_on_id: parseInt(targetUserId)
            };
          });
        } else if (statusData.interest_status) {
          // Alternative API format with interest_status field
          const targetUserInterest = statusData.interest_status.find(item => 
            item.target_user_id === parseInt(targetUserId)
          );
          if (targetUserInterest) {
            interestRecords = [{
              interest: targetUserInterest.interest,
              status: targetUserInterest.status,
              action_by_id: parseInt(currentUserId),
              action_on_id: parseInt(targetUserId)
            }];
          }
        } else {
          // Fallback to old API format (direct array)
          interestRecords = Array.isArray(statusData) ? statusData.filter(record => 
            record.interest === true && 
            record.action_by_id === parseInt(currentUserId) &&
            record.action_on_id === parseInt(targetUserId)
          ) : [];
        }
        
        console.log('Found interest records:', interestRecords.length, interestRecords);
        
        if (interestRecords.length > 0) {
          const latestRecord = interestRecords[0];
          const status = latestRecord.status;
          
          console.log('Current interest status:', status, 'Full record:', latestRecord);
          
          // If interest exists and status is NOT rejected, show already sent
          const normalizedStatus = status ? status.toString().toLowerCase().trim() : '';
          console.log('Normalized status:', normalizedStatus, 'Original status:', status);
          
          // Only block if status is 'accepted' - allow re-send for 'pending', 'sent', and 'rejected'
          if (status && normalizedStatus === 'accepted') {
            console.log('Interest already accepted - status:', status, 'normalized:', normalizedStatus);
            alert('Interest already accepted by this user');
            return;
          }
          
          // Allow re-send for 'pending', 'sent', and 'rejected' statuses
          if (status && (normalizedStatus === 'pending' || normalizedStatus === 'sent' || normalizedStatus === 'rejected')) {
            console.log('Interest was pending/sent/rejected, allowing re-send - status:', status);
            // Continue to send new interest below
          }
        }
      }

      // Send interest (either new or after rejection)
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
        
        console.log('API Error Response:', errorData);
        
        // Handle specific errors
        if (errorData.detail && errorData.detail.includes('Gender')) {
          alert('Gender compatibility required: Male can only send interest to Female and vice versa');
        } else if (errorData.detail && errorData.detail.includes('blocked')) {
          alert('Cannot send interest. User interaction is blocked.');
        } else if (errorData.detail && errorData.detail.includes('interest accept')) {
          alert('Message bhejne ke liye pehle interest accept hona zaroori hai');
        } else if (errorData.already_sent) {
          // Backend says already sent, but we checked status above
          // If we reached here, it means status was rejected and we should allow
          console.log('Backend says already sent, but status was rejected - this should not happen');
          alert('Interest already sent to this user');
        } else {
          alert(errorData.detail || 'Failed to send interest');
        }
        return;
      }

      const data = await response.json();
      console.log('Interest API response:', data);
      
      if (data.already_sent) {
        console.log('Backend says already_sent is true');
        alert('Interest already sent to this user!');
      } else {
        console.log('Interest sent successfully');
        alert('Interest sent successfully! ✅');
        // Update local state to show as interested
        setActualInterestStatus(true);
      }
      
    } catch (error) {
      console.error('Error sending interest:', error);
      alert('An error occurred while sending interest');
    } finally {
      setLoading(false);
    }
  };

  // Handle ignore button click - set ignore true for regular users
  const handleIgnoreClick = async () => {
    // Agents may have custom flows; normal users should always hit API
    const currentRole = localStorage.getItem('role');
    const isImpersonating = localStorage.getItem('is_agent_impersonating') === 'true';
    const shouldUseProp = currentRole === 'agent' && !isImpersonating && typeof onIgnore === 'function';

    if (shouldUseProp) {
      onIgnore(profile);
      return;
    }

    try {
      const currentUserId = localStorage.getItem('userId');
      const targetUserId = profile?.id;

      if (!currentUserId || !targetUserId) {
        alert('Error: User information not available');
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/recieved/ignore/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action_by_id: parseInt(currentUserId),
            action_on_id: parseInt(targetUserId)
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.detail || 'Failed to ignore user');
        return;
      }

      // Immediately persist and notify so parent reflows grid instantly
      try {
        const key = 'ignoredUserIds';
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const targetIdNum = parseInt(targetUserId);
        if (!existing.includes(targetIdNum)) {
          localStorage.setItem(key, JSON.stringify([...existing, targetIdNum]));
        }
        window.dispatchEvent(new CustomEvent('userIgnored', { detail: { userId: targetIdNum } }));
      } catch (_) {}

      // Optional: brief visual hint (won't always show before unmount)
      setRemoving(true);
    } catch (error) {
      console.error('Error ignoring user:', error);
      alert('An error occurred while ignoring user');
    }
  };

  // Handle block/unblock button click - for agents only
  const handleBlockClick = async () => {
    const currentRole = localStorage.getItem('role');
    const isImpersonating = localStorage.getItem('is_agent_impersonating') === 'true';
    
    // Only agents (not impersonating) can block
    if (currentRole !== 'agent' || isImpersonating) {
      return;
    }

    // If already blocked, unblock it
    if (isBlocked) {
      await handleUnblockClick();
      return;
    }

    // If onBlock callback is provided, use it
    if (typeof onBlock === 'function') {
      try {
        await onBlock(profile);
        setIsBlocked(true);
      } catch (error) {
        console.error('Error blocking user:', error);
        alert('Failed to block user');
      }
      return;
    }

    // Otherwise, make direct API call - Agent Direct Block
    try {
      const targetUserId = profile?.id;

      if (!targetUserId) {
        alert('Error: User information not available');
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/agent/block/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action_on_id: parseInt(targetUserId)
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || errorData.detail || 'Failed to block user');
        return;
      }

      const result = await response.json();
      console.log('User blocked successfully:', result);
      
      setIsBlocked(true);
      alert(result.message || 'User blocked successfully by agent');
    } catch (error) {
      console.error('Error blocking user:', error);
      alert('An error occurred while blocking user');
    }
  };

  // Handle unblock button click - for agents only
  const handleUnblockClick = async () => {
    try {
      const targetUserId = profile?.id;

      if (!targetUserId) {
        alert('Error: User information not available');
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/agent/unblock/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action_on_id: parseInt(targetUserId)
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || errorData.detail || 'Failed to unblock user');
        return;
      }

      const result = await response.json();
      console.log('User unblocked successfully:', result);
      
      setIsBlocked(false);
      alert(result.message || 'User unblocked successfully');
    } catch (error) {
      console.error('Error unblocking user:', error);
      alert('An error occurred while unblocking user');
    }
  };

  // Handle message button click -> open Inbox and focus this user
  const handleMessageClick = () => {
    const meId = localStorage.getItem('userId');
    if (!meId) {
      alert('Login required');
      return;
    }
    if (!profile?.id) {
      alert('Receiver not found');
      return;
    }
    navigate(`/${meId}/inbox/`, { state: { openUserId: Number(profile.id) } });
  };
  
  return (
    <div
      ref={cardRef}
      className="simple-profile-card"
      style={removing ? {
        height: inlineHeight !== undefined ? inlineHeight : undefined,
        maxHeight: inlineHeight !== undefined ? inlineHeight : undefined,
        width: 0,
        flex: '0 0 0',
        margin: 0,
        padding: 0,
        borderWidth: 0,
        boxShadow: 'none',
        overflow: 'hidden',
        opacity: 0,
        transform: 'translateY(-8px) scale(0.98)',
        transition: 'height 240ms ease, max-height 240ms ease, width 240ms ease, margin 240ms ease, padding 240ms ease, border-width 240ms ease, opacity 200ms ease, transform 200ms ease'
      } : undefined}
    >
      {/* Agent Verified Badge - Simple */}
      {profile?.agent_id && (
        <div className="agent-verified-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Agent Verified
        </div>
      )}

      {/* Blocked Badge - For Agents */}
      {isBlocked && (
        <div className="blocked-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9l10.21 10.21C14.55 19.37 13.35 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
          </svg>
          BLOCKED
        </div>
      )}
      
      {/* Profile Photo with Online Badge */}
      <div className="simple-profile-photo">
        <img 
          src={getProfilePhotoUrl()} 
          alt={profile?.name || "Profile"}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/200";
          }}
        />
        {/* <div className="online-badge"></div>0*/}
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
            <span>{profile?.city || "Location N/A"}</span>
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
            className={`simple-icon-btn interest-btn ${actualInterestStatus ? 'interested' : ''}`}
            onClick={handleInterestClick}
            title={
              loading ? "Sending..." : 
              actualInterestStatus ? "Interest Sent" : 
              interestStatus === 'rejected' ? "Send Interest Again" : 
              "Send Interest"
            }
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

          {/* Ignore/Block Button - Changes based on role */}
          {(() => {
            const currentRole = localStorage.getItem('role');
            const isImpersonating = localStorage.getItem('is_agent_impersonating') === 'true';
            const isAgent = currentRole === 'agent' && !isImpersonating;

            if (isAgent) {
              // Show Block/Unblock button for agents
              return (
                <button 
                  className={`simple-icon-btn block-btn ${isBlocked ? 'blocked' : ''}`}
                  onClick={handleBlockClick}
                  title={isBlocked ? "Click to Unblock" : "Block User"}
                >
                  {isBlocked ? (
                    // Unblock icon (checkmark in circle)
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9 12l2 2 4-4"></path>
                    </svg>
                  ) : (
                    // Block icon (circle with slash)
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                    </svg>
                  )}
                </button>
              );
            } else {
              // Show Ignore button for regular users
              return (
                <button 
                  className="simple-icon-btn ignore-btn"
                  onClick={handleIgnoreClick}
                  title="Ignore"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              );
            }
          })()}
        </div>

        {/* Message Button - Primary Action */}
        <button 
          className="simple-message-btn"
          onClick={() => {
            console.log('=== MESSAGE BUTTON CLICKED ===');
            console.log('onMessage prop exists:', !!onMessage);
            console.log('Profile:', profile);
            
            // Always check for agent role first, regardless of onMessage prop
            const currentRole = localStorage.getItem('role');
            const isImpersonating = localStorage.getItem('is_agent_impersonating') === 'true';
            
            console.log('Agent check - currentRole:', currentRole);
            console.log('isImpersonating:', isImpersonating);
            console.log('All localStorage keys:', Object.keys(localStorage));
            
            if (currentRole === 'agent' && !isImpersonating) {
              console.log('✅ AGENT DETECTED - calling onMessage with agent flag');
              // Call onMessage with agent flag to open sidebar at page level
              if (onMessage) {
                console.log('Calling onMessage function...');
                console.log('onMessage function:', onMessage);
                console.log('onMessage function name:', onMessage.name);
                try {
                  onMessage(profile, { isAgent: true });
                  console.log('onMessage called successfully');
                } catch (error) {
                  console.error('Error calling onMessage:', error);
                }
              } else {
                console.log('❌ No onMessage prop - agent needs custom handling');
              }
              
              // Fallback: If onMessage doesn't work, try to trigger sidebar directly
              // This is a temporary solution to test if the issue is with the prop
              console.log('🔧 FALLBACK: Trying to trigger sidebar directly...');
              // We'll add a custom event or use a different approach here
            } else {
              console.log('❌ NORMAL USER - using original handler');
              if (onMessage) {
                console.log('Using onMessage prop');
                onMessage(profile);
              } else {
                console.log('Using handleMessageClick');
                handleMessageClick();
              }
            }
          }}
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
