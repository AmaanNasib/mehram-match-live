import React, { memo, useCallback, useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './MemberCard.css';
import '../../../shared-styles.css';

// Constants
const API_BASE_URL = process.env.REACT_APP_API_URL;
const FALLBACK_IMAGE = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTJaIiBmaWxsPSIjOWNhM2FmIi8+CjxwYXRoIGQ9Ik0xMiAxNEM3LjU4MTcyIDE0IDQgMTcuNTgxNyA0IDIySDEyQzE2LjQxODMgMTQgMTIgMTQgMTIgMTRaIiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo8L3N2Zz4K";

// Helper Functions
const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

const formatDateTime = (iso) => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso || '';
  }
};

const getTypeStyle = (type) => {
  const t = (type || '').toLowerCase();
  const styles = {
    accepted: { bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
    rejected: { bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
    message: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
    request: { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
    interest: { bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe' },
    default: { bg: '#f1f5f9', color: '#334155', border: '#e2e8f0' }
  };
  
  if (t.includes('accepted')) return styles.accepted;
  if (t.includes('rejected')) return styles.rejected;
  if (t.includes('message')) return styles.message;
  if (t.includes('request')) return styles.request;
  if (t.includes('interest')) return styles.interest;
  return styles.default;
};

const getDecisionStatus = (n) => {
  const raw = String(n?.status || n?.request_status || n?.interest_status || '').toLowerCase();
  const accepted = raw === 'accepted' || raw === 'approve' || raw === 'approved' || n?.accepted === true || n?.is_accepted === true;
  const rejected = raw === 'rejected' || raw === 'decline' || raw === 'declined' || n?.rejected === true || n?.is_rejected === true;
  
  if (accepted) return 'accepted';
  if (rejected) return 'rejected';
  return 'pending';
};

const getInterestStatus = (n) => {
  const val = String(n?.interest_status || '').toLowerCase();
  if (val === 'accepted') return 'accepted';
  if (val === 'rejected') return 'rejected';
  if (val === 'pending' || val === 'none' || val === '') return 'pending';
  return getDecisionStatus(n);
};

const getInitials = (name) => {
  return (name || 'U')
    .split(' ')
    .map(s => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

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
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifTotal, setNotifTotal] = useState(0);
  const [notifCounts, setNotifCounts] = useState({});
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [notifItems, setNotifItems] = useState([]);
  const [notifActionLoading, setNotifActionLoading] = useState(null);

  // Memoized member ID
  const memberId = useMemo(() => member?.id || member?.member_id, [member?.id, member?.member_id]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch per-member notifications (agent)
  // Don't auto-mark as viewed when just fetching count for badge
  useEffect(() => {
    if (!memberId) return;
    fetchNotifications(memberId, false, false); // loadItems=false, markAsViewed=false
    
    // Periodically refresh count (every 30 seconds) when modal is not open
    const intervalId = setInterval(() => {
      if (!showNotifModal && memberId) {
        fetchNotifications(memberId, false, false);
      }
    }, 30000); // 30 seconds
    
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId, showNotifModal]);

  // API Helper - Optimized for production
  const apiFetch = useCallback(async (url, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: { ...getAuthHeaders(), ...options.headers }
      });
      
      if (!response.ok) {
        return null;
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return null;
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  }, []);

  const apiPost = useCallback(async (url, body) => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        return null;
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return null;
    } catch (error) {
      console.error('API POST Error:', error);
      return null;
    }
  }, []);

  const fetchNotifications = useCallback(async (id, loadItems = true, markAsViewed = true) => {
    try {
      setNotifLoading(true);
      // Auto-mark as viewed by default (standard behavior like WhatsApp/Gmail)
      const url = markAsViewed 
        ? `/api/agent/member/${id}/notifications/`
        : `/api/agent/member/${id}/notifications/?mark_as_viewed=false`;
      
      const data = await apiFetch(url);
      
      if (data) {
        // Use unviewed_count instead of total for badge
        const unviewedCount = data?.unviewed_count || 0;
        setNotifTotal(unviewedCount);
        setNotifCounts(data?.counts || {});
        if (loadItems) setNotifItems(Array.isArray(data?.notifications) ? data.notifications : []);
      } else {
        setNotifTotal(0);
        setNotifCounts({});
        if (loadItems) setNotifItems([]);
      }
    } catch (error) {
      console.error('Fetch notifications error:', error);
      setNotifTotal(0);
      setNotifCounts({});
      if (loadItems) setNotifItems([]);
    } finally {
      setNotifLoading(false);
    }
  }, [apiFetch]);

  // Resolve interest_id for a member and sender - optimized for production
  const resolveInterestId = useCallback(async (memId, senderId) => {
    if (!memId || !senderId) return null;
    
    // Try pending interests first
    const pendingData = await apiFetch(`/api/agent/member/${memId}/pending-interests/`);
    if (pendingData) {
      const arr = Array.isArray(pendingData?.pending_interests) 
        ? pendingData.pending_interests 
        : Array.isArray(pendingData) ? pendingData : [];
      
      const hit = arr.find(it => {
        const userId = parseInt(it?.user?.id);
        const senderUserId = parseInt(it?.sender_user_id);
        return userId === senderId || senderUserId === senderId;
      });
      
      if (hit?.interest_id) return parseInt(hit.interest_id);
      if (hit?.id) return parseInt(hit.id);
    }

    // Fallback: search all interests
    const allData = await apiFetch(`/api/agent/member/interests/?member_id=${memId}`);
    if (allData) {
      const received = Array.isArray(allData?.received_interests) 
        ? allData.received_interests 
        : Array.isArray(allData) ? allData : [];
      
      const hit = received.find(it => {
        const userId = parseInt(it?.user?.id);
        const senderUserId = parseInt(it?.sender_user_id);
        return userId === senderId || senderUserId === senderId;
      });
      
      if (hit?.interest_id) return parseInt(hit.interest_id);
      if (hit?.id) return parseInt(hit.id);
    }

    return null;
  }, [apiFetch]);

  const openNotifications = useCallback(async (e) => {
    e.stopPropagation();
    if (!memberId) return;
    setShowNotifModal(true);
    // Auto-mark as viewed when opening modal (standard behavior)
    await fetchNotifications(memberId, true, true); // loadItems=true, markAsViewed=true
  }, [memberId, fetchNotifications]);

  const handleInterestAction = useCallback(async (notif, action) => {
    if (!memberId) return;
    
    const senderUserId = parseInt(notif?.from_user?.id);
    const memId = parseInt(notif?.to_member?.id || memberId);
    const loadingKey = `${action}-interest-${notif?.id || senderUserId}`;
    
    try {
      setNotifActionLoading(loadingKey);
      const resolvedInterestId = await resolveInterestId(memId, senderUserId);
      
      const body = resolvedInterestId
        ? { member_id: memId, sender_user_id: senderUserId, action, interest_id: resolvedInterestId }
        : { member_id: memId, sender_user_id: senderUserId, action };

      const result = await apiPost('/api/agent/member/interest-action/', body);
      if (result) {
        await fetchNotifications(memberId, true);
      }
    } catch (error) {
      console.error('Interest action error:', error);
    } finally {
      setNotifActionLoading(null);
    }
  }, [memberId, resolveInterestId, apiPost, fetchNotifications]);

  const handlePhotoRequestAction = useCallback(async (notif, action) => {
    if (!memberId) return;
    
    const senderUserId = parseInt(notif?.from_user?.id);
    const memId = parseInt(notif?.to_member?.id || memberId);
    const loadingKey = `${action}-photo-${notif?.id || senderUserId}`;
    
    try {
      setNotifActionLoading(loadingKey);
      const result = await apiPost('/api/agent/member/photo-request-action/', {
        member_id: memId,
        sender_user_id: senderUserId,
        action
      });
      if (result) {
        await fetchNotifications(memberId, true);
      }
    } catch (error) {
      console.error('Photo request action error:', error);
    } finally {
      setNotifActionLoading(null);
    }
  }, [memberId, apiPost, fetchNotifications]);

  const handleMarkAsRead = useCallback(async (notif) => {
    if (!memberId || !notif?.from_user?.id) {
      console.error('Mark as read: Missing memberId or sender_user_id', { memberId, senderUserId: notif?.from_user?.id, notification: notif });
      return;
    }
    
    const memId = parseInt(notif?.to_member?.id || memberId);
    const senderUserId = parseInt(notif.from_user.id);
    const notifId = notif.id;
    const loadingKey = `mark-read-${notifId || senderUserId}`;
    
    if (!memId || !senderUserId || isNaN(memId) || isNaN(senderUserId)) {
      console.error('Mark as read: Invalid memberId or senderUserId', { memId, senderUserId, notification: notif });
      return;
    }
    
    try {
      setNotifActionLoading(loadingKey);
      
      // Update local state immediately for better UX
      setNotifItems(prevItems => 
        prevItems.map(item => 
          item.id === notifId && item.from_user?.id === senderUserId
            ? { ...item, message_status: 'read' }
            : item
        )
      );
      
      // Update count immediately
      setNotifTotal(prev => Math.max(0, prev - 1));
      
      // Use inbox message read endpoint (not notification read)
      // This marks actual inbox messages as read, not just the notification
      const url = `/api/agent/member/${memId}/mark-read/`;
      const body = { other_user_id: senderUserId };
      
      // Use direct fetch for better error handling
      // PATCH method for inbox message read (not POST)
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(body)
      });
      
      if (response.ok) {
        await response.json(); // Parse response but don't log
        // Refresh notifications to get updated count and status
        await fetchNotifications(memberId, true, false);
      } else {
        // Revert local state on error
        setNotifItems(prevItems => 
          prevItems.map(item => 
            item.id === notifId && item.from_user?.id === senderUserId
              ? { ...item, message_status: 'unread' }
              : item
          )
        );
        setNotifTotal(prev => prev + 1);
        
        const errorData = await response.json().catch(() => ({}));
        console.error('Mark inbox message as read failed:', {
          status: response.status,
          statusText: response.statusText,
          url,
          body,
          error: errorData
        });
      }
    } catch (error) {
      // Revert local state on error
      setNotifItems(prevItems => 
        prevItems.map(item => 
          item.id === notifId && item.from_user?.id === senderUserId
            ? { ...item, message_status: 'unread' }
            : item
        )
      );
      setNotifTotal(prev => prev + 1);
      
      console.error('Mark inbox message as read error:', error);
    } finally {
      setNotifActionLoading(null);
    }
  }, [memberId, fetchNotifications]);

  const handleMarkAllAsRead = useCallback(async () => {
    if (!memberId) return;
    
    try {
      setNotifActionLoading('mark-all-read');
      const result = await apiPost(`/api/agent/member/${memberId}/notifications/mark-all-read/`, {});
      
      if (result) {
        await fetchNotifications(memberId, true, false); // Don't auto-mark as we just marked all
      }
    } catch (error) {
      // Error logged in apiPost helper
    } finally {
      setNotifActionLoading(null);
    }
  }, [memberId, apiPost, fetchNotifications]);

  // Memoized profile image URL
  const profileImageUrl = useMemo(() => {
    const photoUrl = member?.profile_photo?.upload_photo || 
                    member?.user_profilephoto?.upload_photo ||
                    member?.profile_image ||
                    member?.avatar ||
                    member?.photo ||
                    member?.image ||
                    member?.user_profilephoto?.photo ||
                    member?.user_profilephoto?.image;
    
    return photoUrl ? `${API_BASE_URL}${photoUrl}` : FALLBACK_IMAGE;
  }, [member?.profile_photo, member?.user_profilephoto, member?.profile_image, member?.avatar, member?.photo, member?.image]);

  // Memoized event handlers
  const handleCardClick = useCallback(() => {
    onViewProfile ? onViewProfile(member?.id) : navigate(`/details/${member?.id}`);
  }, [member?.id, onViewProfile, navigate]);

  const handleEditClick = useCallback((e) => {
    e.stopPropagation();
    onEdit ? onEdit(member) : navigate(`/memstepone/${member.id}`, { state: { editMode: true, memberId: member.id } });
  }, [member, onEdit, navigate]);

  const handleMatchesClick = useCallback((e) => {
    e.stopPropagation();
    onViewMatches ? onViewMatches(member) : navigate(`/member-matches/${member.member_id}`);
  }, [member, onViewMatches, navigate]);

  const handleDeleteClick = useCallback((e) => {
    e.stopPropagation();
    onDelete?.(member);
  }, [member, onDelete]);

  const handleInterestClick = useCallback((e) => {
    e.stopPropagation();
    navigate(`/member-interests/${memberId}`);
  }, [memberId, navigate]);

  const handleRequestClick = useCallback((e) => {
    e.stopPropagation();
    navigate(`/member-request-send-received?memberId=${memberId}`);
  }, [memberId, navigate]);

  // Trigger animation when isDeleting prop becomes true
  useEffect(() => {
    if (isDeleting) setIsAnimatingOut(true);
  }, [isDeleting]);

  const handleImageError = useCallback((e) => {
    e.target.src = FALLBACK_IMAGE;
  }, []);

  const handleMenuToggle = useCallback((e) => {
    e.stopPropagation();
    setShowMenu(prev => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setShowMenu(false);
  }, []);

  return (
    <>
    <div
      className={`member-card ${isAnimatingOut ? 'animate-out' : ''} ${isDeleting ? 'is-deleting' : ''}`}
      onClick={handleCardClick}
      style={{ position: 'relative' }}
    >
      {/* Card Header */}
      <div className="card-header">
        <div className="member-id-section">
          <span className="id-badge">{member?.member_id || "N/A"}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className="notifications-info" onClick={openNotifications}>
            <span className="notifications-icon">🔔</span>
            <span className="notifications-text">
              {notifLoading ? '' : notifTotal}
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

      {/* Notifications Panel (inside card) */}
      {showNotifModal && (
        <div 
          className="notif-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="notif-modal-header">
            <h3 className="notif-modal-title">Notifications ({notifTotal})</h3>
            <div className="notif-modal-actions">
              {notifTotal > 0 && (
                <button
                  className="notif-mark-all-btn"
                  onClick={handleMarkAllAsRead}
                  disabled={notifActionLoading === 'mark-all-read' || notifLoading}
                  title="Mark all notifications as read"
                >
                  {notifActionLoading === 'mark-all-read' ? '...' : 'Mark All as Read'}
                </button>
              )}
              <button
                className="notif-modal-close"
                onClick={() => setShowNotifModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
          </div>
          {notifLoading ? (
            <div className="notif-loading">Loading...</div>
          ) : notifItems.length === 0 ? (
            <div className="notif-empty">No notifications</div>
          ) : (
            <ul className="notif-list">
              {notifItems.map((n) => {
                const notifStyle = getTypeStyle(n.type);
                const initials = getInitials(n.from_user?.name || n.from_user?.first_name);
                const typeLower = (n.type || '').toLowerCase();
                const isInterest = typeLower === 'interest';
                const isPhotoRequest = typeLower === 'request_photo';
                const isMessageReceived = typeLower === 'message_received' || typeLower.includes('message');
                const isActionableType = isInterest || isPhotoRequest; // Only Interest and Photo Request can have Accept/Reject
                
                // Check message status for Message Received notifications
                // Only show as unread if explicitly marked as unread
                // If message_status is 'read' or null/undefined, consider it as read
                const messageStatus = (n.message_status || '').toLowerCase();
                const isUnreadMessage = isMessageReceived && messageStatus === 'unread';
                
                // Only check status for actionable types (Interest/Photo Request)
                const interestStatus = isActionableType ? getInterestStatus(n) : null;
                const decision = isActionableType ? getDecisionStatus(n) : null;
                const isAccepted = isActionableType && (typeLower.includes('accepted') || decision === 'accepted' || interestStatus === 'accepted');
                const isRejected = isActionableType && (typeLower.includes('rejected') || decision === 'rejected' || interestStatus === 'rejected');
                const isPending = isActionableType && interestStatus === 'pending';
                
                const showActions = isActionableType && isPending && n.can_accept_reject !== false;
                const acceptKey = `accept-${isInterest ? 'interest' : 'photo'}-${n.id}`;
                const rejectKey = `reject-${isInterest ? 'interest' : 'photo'}-${n.id}`;
                const isAcceptLoading = notifActionLoading === acceptKey;
                const isRejectLoading = notifActionLoading === rejectKey;
                
                // Status text logic: Only show Accepted/Rejected/Pending for actionable types
                const statusText = isActionableType 
                  ? (isAccepted ? 'Accepted' : isRejected ? 'Rejected' : isPending ? 'Pending' : 'Responded')
                  : 'Responded'; // For Message Received and other types, always show "Responded"
                
                return (
                  <li
                    key={n.id}
                    className={`notif-item ${isUnreadMessage ? 'notif-unread' : ''}`}
                    style={{
                      borderColor: notifStyle.border,
                      borderLeft: `4px solid ${notifStyle.color}`
                    }}
                  >
                    <div className="notif-content">
                      <div className="notif-avatar" style={{ background: notifStyle.bg, color: notifStyle.color }}>
                        {initials}
                      </div>
                      <div className="notif-body">
                        <div className="notif-header-row">
                          <div className="notif-header-left">
                            <span className="notif-type-badge" style={{ background: notifStyle.bg, color: notifStyle.color, borderColor: notifStyle.border }}>
                              {n.type?.replace(/_/g, ' ')}
                            </span>
                            {isUnreadMessage && (
                              <span className="notif-unread-badge" title="Unread message"></span>
                            )}
                            {n.from_user?.name && (
                              <span className="notif-sender">from <strong>{n.from_user.name}</strong></span>
                            )}
                          </div>
                          <span className="notif-time">{formatDateTime(n.created_at)}</span>
                        </div>
                        <div className="notif-message">{n.message}</div>
                        {showActions ? (
                          <div className="notif-actions">
                            <button
                              className="notif-btn accept"
                              onClick={() => isInterest ? handleInterestAction(n, 'accept') : handlePhotoRequestAction(n, 'accept')}
                              disabled={isAcceptLoading || isRejectLoading}
                            >
                              {isAcceptLoading ? '...' : 'Accept'}
                            </button>
                            <button
                              className="notif-btn reject"
                              onClick={() => isInterest ? handleInterestAction(n, 'reject') : handlePhotoRequestAction(n, 'reject')}
                              disabled={isAcceptLoading || isRejectLoading}
                            >
                              {isRejectLoading ? '...' : 'Reject'}
                            </button>
                          </div>
                        ) : isUnreadMessage ? (
                          <div className="notif-actions">
                            <button
                              className="notif-btn mark-read"
                              onClick={() => handleMarkAsRead(n)}
                              disabled={notifActionLoading === `mark-read-${n.id || n.from_user?.id}`}
                            >
                              {notifActionLoading === `mark-read-${n.id || n.from_user?.id}` ? '...' : 'Mark as Read'}
                            </button>
                          </div>
                        ) : (
                          <div className="notif-status">
                            <span className={`notif-status-badge ${
                              isActionableType 
                                ? (isAccepted ? 'accepted' : isRejected ? 'rejected' : isPending ? 'pending' : 'responded')
                                : 'responded'
                            }`}>
                              {statusText}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Member Profile Section */}
      <div className="card-profile-section">
        <div className="profile-avatar-large">
          <img
            src={profileImageUrl}
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
            <span className={`mm-marital-badge ${member?.martial_status ? member?.martial_status?.toLowerCase()?.replace(" ", "-") : "not-mentioned"}`}>
              {member?.martial_status || "Not mentioned"}
            </span>
          </div>
      </div>

      {/* Card Footer */}
      <div className="card-footer">
        <div className="card-action-buttons" style={{ justifyContent: 'space-between' }}>
          
          {/* Interest Button */}
          <button
            className="card-action-btn interest-btn"
            title="View Member Interests"
            onClick={handleInterestClick}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          {/* Request Button */}
          <button
            className="card-action-btn request-btn"
            title="View Member Photo Requests"
            onClick={handleRequestClick}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
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
  </>
  );
});

MemberCard.displayName = 'MemberCard';

export default MemberCard;
