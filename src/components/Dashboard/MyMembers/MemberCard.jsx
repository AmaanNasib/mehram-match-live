import React, { memo, useCallback, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MemberCard.css';

const MemberCard = memo(({ 
  member, 
  onDelete, 
  onEdit, 
  onViewMatches,
  onViewProfile,
  isDeleting = false
}) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Memoized profile image URL generation
  const getProfileImageUrl = useCallback(() => {
    const photoUrl = member?.profile_photo?.upload_photo || 
                    member?.user_profilephoto?.upload_photo ||
                    member?.profile_image ||
                    member?.avatar ||
                    member?.photo ||
                    member?.image ||
                    member?.user_profilephoto?.photo ||
                    member?.user_profilephoto?.image;
    
    const fullUrl = photoUrl ? `${process.env.REACT_APP_API_URL}${photoUrl}` : null;
    
    if (fullUrl) {
      return fullUrl;
    } else {
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTJaIiBmaWxsPSIjOWNhM2FmIi8+CjxwYXRoIGQ9Ik0xMiAxNEM3LjU4MTcyIDE0IDQgMTcuNTgxNyA0IDIySDEyQzE2LjQxODMgMTQgMTIgMTQgMTIgMTRaIiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo8L3N2Zz4K";
    }
  }, [member?.profile_photo, member?.user_profilephoto, member?.profile_image, member?.avatar, member?.photo, member?.image, member?.gender]);

  // Memoized fallback image
  const getFallbackImage = useCallback(() => {
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTJaIiBmaWxsPSIjOWNhM2FmIi8+CjxwYXRoIGQ9Ik0xMiAxNEM3LjU4MTcyIDE0IDQgMTcuNTgxNyA0IDIySDEyQzE2LjQxODMgMTQgMTIgMTQgMTIgMTRaIiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo8L3N2Zz4K";
  }, []);

  // Memoized event handlers
  const handleCardClick = useCallback(() => {
    if (onViewProfile) {
      onViewProfile(member?.id);
    } else {
      navigate(`/details/${member?.id}`);
    }
  }, [member?.id, onViewProfile, navigate]);

  const handleViewClick = useCallback((e) => {
    e.stopPropagation();
    if (onViewProfile) {
      onViewProfile(member?.id);
    } else {
      navigate(`/details/${member?.id}`);
    }
  }, [member?.id, onViewProfile, navigate]);

  const handleEditClick = useCallback((e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(member);
    } else {
      navigate(`/memstepone`, { state: { editMode: true, memberId: member.id } });
    }
  }, [member, onEdit, navigate]);

  const handleMatchesClick = useCallback((e) => {
    e.stopPropagation();
    if (onViewMatches) {
      onViewMatches(member);
    } else {
      navigate(`/member-matches/${member.member_id}`);
    }
  }, [member, onViewMatches, navigate]);

  const handleDeleteClick = useCallback((e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(member);
    }
  }, [member, onDelete]);

  // Trigger animation when isDeleting prop becomes true
  useEffect(() => {
    if (isDeleting) {
      setIsAnimatingOut(true);
    }
  }, [isDeleting]);

  const handleImageError = useCallback((e) => {
    e.target.src = getFallbackImage();
  }, [getFallbackImage]);

  const handleMenuToggle = useCallback((e) => {
    e.stopPropagation();
    setShowMenu(prev => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setShowMenu(false);
  }, []);

  return (
    <div
      className={`member-card ${isAnimatingOut ? 'animate-out' : ''} ${isDeleting ? 'is-deleting' : ''}`}
      onClick={handleCardClick}
    >
      {/* Card Header */}
      <div className="card-header">
        <div className="member-id-section">
          <span className="id-badge">{member?.member_id || "N/A"}</span>
          {member?.notifications > 0 && (
            <span className="notification-indicator">
              {member.notifications}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="notifications-info" onClick={(e) => e.stopPropagation()}>
            <span className="notifications-icon">🔔</span>
            <span className="notifications-text">
              {member?.notifications > 0 
                ? `${member.notifications} notification${member.notifications > 1 ? 's' : ''}`
                : "No notifications"
              }
            </span>
          </div>
          <div className="menu-container" ref={menuRef} onClick={handleMenuToggle}>
            <button className="menu-button" onClick={handleMenuToggle} title="More Options">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5" r="2"/>
                <circle cx="12" cy="12" r="2"/>
                <circle cx="12" cy="19" r="2"/>
              </svg>
            </button>
            {showMenu && (
              <div className="menu-dropdown" onClick={(e) => e.stopPropagation()}>
                <button className="menu-item" onClick={(e) => { e.stopPropagation(); handleMenuClose(); handleEditClick(e); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  <span>Edit Profile</span>
                </button>
                <div className="menu-divider"></div>
                <button className="menu-item menu-item-danger" onClick={(e) => { e.stopPropagation(); handleMenuClose(); handleDeleteClick(e); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                  </svg>
                  <span>Delete Profile</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Member Profile Section */}
      <div className="card-profile-section">
        <div className="profile-avatar-large">
          <img
            src={getProfileImageUrl()}
            alt={member?.name || "Member"}
            className="avatar-large-img"
            onError={handleImageError}
          />
        </div>
        <div className="profile-info-large">
          <h3 className="member-name-large">{member?.name || "N/A"}</h3>
          <p className="member-email-large">{member?.email || ""}</p>
        </div>
      </div>

      {/* Member Details Grid */}
      <div className="card-details-grid">
          <div className="detail-row">
            <span className="detail-label">Age</span>
            <span className="detail-value">{member?.age || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Gender</span>
            <span className="detail-value">{member?.gender || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Location</span>
            <span className="detail-value">{member?.location || member?.city || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Sect</span>
            <span className="detail-value">{member?.sect || member?.sect_school_info || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Profession</span>
            <span className="detail-value">{member?.profession || "N/A"}</span>
          </div>
          <div className="detail-row">
            <span className={`marital-badge ${member?.martial_status ? member?.martial_status?.toLowerCase()?.replace(" ", "-") : "not-mentioned"}`}>
              {member?.martial_status || "Not mentioned"}
            </span>
          </div>
      </div>

      {/* Card Footer */}
      <div className="card-footer">
        <div className="card-action-buttons" style={{ justifyContent: 'flex-end' }}>
          <button
            className="card-action-btn view-btn"
            onClick={handleViewClick}
            title="View Profile"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          
          <button
            className="card-action-btn match-btn"
            onClick={handleMatchesClick}
            title="View Match Details"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
              <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
              <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/>
              <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"/>
            </svg>
          </button>
  
        </div>
      </div>
    </div>
  );
});

MemberCard.displayName = 'MemberCard';

export default MemberCard;
