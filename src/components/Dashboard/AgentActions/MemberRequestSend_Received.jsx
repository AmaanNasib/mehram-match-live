import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../UserDashboard/DashboardLayout';
import './MemberRequestSend_Received.css';

const MemberRequestSend_Received = ({ isOpen, onClose, targetUserId, targetUserName, targetUserPhoto, targetUserGender, targetUserData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [sending, setSending] = useState(false);
  const [requestStatuses, setRequestStatuses] = useState({}); // Track request status for each member
  const [loadingRequestStatus, setLoadingRequestStatus] = useState(false);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [tabActive, setTabActive] = useState("sent"); // 'sent' or 'received'
  const [memberId, setMemberId] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc', table: null }); // table: 'sent' or 'received'

  // Handle URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const memberIdParam = urlParams.get('memberId');
    if (memberIdParam) {
      setMemberId(memberIdParam);
      fetchMemberPhotoRequests(memberIdParam);
      fetchMemberDetails(memberIdParam);
    }
  }, [location.search]);

  useEffect(() => {
    if (isOpen) {
      fetchAgentMembers();
    }
  }, [isOpen]);

  // Filter members based on gender compatibility
  useEffect(() => {
    if (members.length > 0 && targetUserGender) {
      const compatibleMembers = members.filter(member => {
        const memberGender = member.gender?.toLowerCase();
        const targetGender = targetUserGender?.toLowerCase();
        
        // Male members can only send requests to Female profiles
        // Female members can only send requests to Male profiles
        if (memberGender === 'male' && targetGender === 'female') return true;
        if (memberGender === 'female' && targetGender === 'male') return true;
        
        return false;
      });
      
      setFilteredMembers(compatibleMembers);
    } else {
      setFilteredMembers(members);
    }
  }, [members, targetUserGender]);

  // Fetch member details
  const fetchMemberDetails = async (memberId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/agent/member/${memberId}/`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch member details');
      }

      const data = await response.json();
      setMemberData(data);
    } catch (error) {
      console.error('Error fetching member details:', error);
    }
  };

  // Fetch photo requests for a specific member
  const fetchMemberPhotoRequests = async (memberId) => {
    try {
      setLoading(true);
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/agent/member/photo-requests/?member_id=${memberId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch photo requests');
      }

      const data = await response.json();
      setSentRequests(data.sent_requests || []);
      setReceivedRequests(data.received_requests || []);
    } catch (error) {
      console.error('Error fetching photo requests:', error);
      alert('Failed to load photo requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentMembers = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('impersonating_user_id') || localStorage.getItem('userId');
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/agent/user_agent/?agent_id=${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }

      const data = await response.json();
      setMembers(data.member || []);
    } catch (error) {
      console.error('Error fetching agent members:', error);
      alert('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  // Fetch request statuses for all members
  const fetchRequestStatuses = async () => {
    try {
      setLoadingRequestStatus(true);
      const statuses = {};
      
      // Fetch request status for each member using photo requests API
      const promises = filteredMembers.map(async (member) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/agent/member/photo-requests/?member_id=${member.id}`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.ok) {
            const data = await response.json();
            
            // Check if there's a sent request to the target user
            const sentRequests = data.sent_requests || [];
            const requestToTarget = sentRequests.find(request => 
              request.user && request.user.id === parseInt(targetUserId)
            );
            
            if (requestToTarget) {
              statuses[member.id] = {
                hasRequest: true,
                status: requestToTarget.status || 'Open',
                requestId: requestToTarget.id || null,
                createdAt: requestToTarget.created_at || null
              };
            } else {
              statuses[member.id] = {
                hasRequest: false,
                status: null,
                requestId: null,
                createdAt: null
              };
            }
          } else {
            console.warn(`Failed to fetch request status for member ${member.id}`);
            statuses[member.id] = {
              hasRequest: false,
              status: null,
              requestId: null,
              createdAt: null
            };
          }
        } catch (error) {
          console.error(`Error fetching request status for member ${member.id}:`, error);
          statuses[member.id] = {
            hasRequest: false,
            status: null,
            requestId: null,
            createdAt: null
          };
        }
      });

      await Promise.all(promises);
      setRequestStatuses(statuses);
    } catch (error) {
      console.error('Error fetching request statuses:', error);
    } finally {
      setLoadingRequestStatus(false);
    }
  };

  // Check gender compatibility before sending
  const isGenderCompatible = (memberGender, targetGender) => {
    const member = memberGender?.toLowerCase();
    const target = targetGender?.toLowerCase();
    
    if (member === 'male' && target === 'female') return true;
    if (member === 'female' && target === 'male') return true;
    
    return false;
  };

  // Get request status for a member
  const getRequestStatus = (memberId) => {
    return requestStatuses[memberId] || null;
  };

  // Check if member can send request (not already sent)
  const canSendRequest = (memberId) => {
    const status = getRequestStatus(memberId);
    // If status not checked yet, allow sending
    if (!status) return true;
    // If status exists, check if request was sent
    return !status.hasRequest;
  };

  // Handle member selection with immediate status check
  const handleMemberSelection = (member) => {
    setSelectedMember(member);
    
    // Always check request status for selected member
    checkSingleMemberRequestStatus(member.id);
  };

  // Check request status for a single member
  const checkSingleMemberRequestStatus = async (memberId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/agent/member/photo-requests/?member_id=${memberId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        // Check if there's a sent request to the target user
        const sentRequests = data.sent_requests || [];
        const requestToTarget = sentRequests.find(request => 
          request.user && request.user.id === parseInt(targetUserId)
        );
        
        if (requestToTarget) {
          const newStatus = {
            hasRequest: true,
            status: requestToTarget.status || 'Open',
            requestId: requestToTarget.id || null,
            createdAt: requestToTarget.created_at || null
          };
          
          // Update status for this specific member
          setRequestStatuses(prev => ({
            ...prev,
            [memberId]: newStatus
          }));
        } else {
          // No request found - explicitly set hasRequest to false
          setRequestStatuses(prev => ({
            ...prev,
            [memberId]: {
              hasRequest: false,
              status: null,
              requestId: null,
              createdAt: null
            }
          }));
        }
      }
    } catch (error) {
      console.error(`Error checking request status for member ${memberId}:`, error);
    }
  };

  // Get status badge color and text
  const getStatusInfo = (status, hasRequest = false) => {
    // If no status checked yet or no request sent, show default
    if (!status || !hasRequest) {
      return { 
        text: 'Send Photo Request', 
        bg: '#f1f5f9', 
        textColor: '#475569', 
        border: '#e2e8f0',
        buttonStyle: { backgroundColor: '#3B82F6', color: 'white', cursor: 'pointer' }
      };
    }
    
    switch (status?.toLowerCase()) {
      case 'accepted':
        return { 
          text: 'Accepted', 
          bg: '#dcfce7', 
          textColor: '#166534', 
          border: '#bbf7d0',
          buttonStyle: { backgroundColor: '#10B981', color: 'white', cursor: 'not-allowed' }
        };
      case 'open':
        return { 
          text: 'Open', 
          bg: '#fef3c7', 
          textColor: '#d97706', 
          border: '#fde68a',
          buttonStyle: { backgroundColor: '#F59E0B', color: 'white', cursor: 'not-allowed' }
        };
      case 'rejected':
        return { 
          text: 'Rejected', 
          bg: '#fef2f2', 
          textColor: '#dc2626', 
          border: '#fecaca',
          buttonStyle: { backgroundColor: '#EF4444', color: 'white', cursor: 'not-allowed' }
        };
      default:
        return { 
          text: 'Send Photo Request', 
          bg: '#f1f5f9', 
          textColor: '#475569', 
          border: '#e2e8f0',
          buttonStyle: { backgroundColor: '#3B82F6', color: 'white', cursor: 'pointer' }
        };
    }
  };

  const handleSendRequest = async () => {
    if (!selectedMember) {
      alert('Please select a member');
      return;
    }

    if (!targetUserId) {
      alert('Target user ID is missing');
      return;
    }

    // Pre-validate gender compatibility
    if (!isGenderCompatible(selectedMember.gender, targetUserGender)) {
      alert('Gender compatibility required: Male can only send requests to Female and vice versa');
      return;
    }

    try {
      setSending(true);
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/agent/member/send-photo-request/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            member_id: selectedMember.id,
            target_user_id: parseInt(targetUserId)
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert('Photo request sent successfully on behalf of member!');
        onClose();
        window.location.reload();
      } else {
        const errorData = await response.json();
        
        // Handle specific error cases
        if (errorData.error && errorData.error.includes('Gender')) {
          alert(`Gender compatibility error: ${errorData.error}`);
        } else {
          alert(errorData.error || 'Failed to send photo request');
        }
      }
    } catch (error) {
      console.error('Error sending photo request:', error);
      alert('Error sending photo request');
    } finally {
      setSending(false);
    }
  };

  const getProfileImageUrl = (photoUrl) => {
    if (!photoUrl) return "https://via.placeholder.com/60";
    return `${process.env.REACT_APP_API_URL}${photoUrl}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Handle sorting
  const handleSort = (columnKey, tableType) => {
    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc' && sortConfig.table === tableType) {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction, table: tableType });
  };

  // Handle accept photo request
  const handleAcceptPhotoRequest = async (senderUserId, memberId) => {
    if (!window.confirm('Are you sure you want to accept this photo request?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/agent/member/photo-request-action/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          member_id: parseInt(memberId),
          sender_user_id: parseInt(senderUserId),
          action: 'accept'
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || 'Photo request accepted successfully');
        // Refresh the data
        if (memberId) {
          fetchMemberPhotoRequests(memberId);
        } else {
          window.location.reload();
        }
      } else {
        const errorData = await response.json();
        alert(`Failed to accept photo request: ${errorData.error || errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Error accepting photo request: ' + error.message);
    }
  };

  // Handle reject photo request
  const handleRejectPhotoRequest = async (senderUserId, memberId) => {
    if (!window.confirm('Are you sure you want to reject this photo request?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/agent/member/photo-request-action/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          member_id: parseInt(memberId),
          sender_user_id: parseInt(senderUserId),
          action: 'reject'
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || 'Photo request rejected successfully');
        // Refresh the data
        if (memberId) {
          fetchMemberPhotoRequests(memberId);
        } else {
          window.location.reload();
        }
      } else {
        const errorData = await response.json();
        alert(`Failed to reject photo request: ${errorData.error || errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Error rejecting photo request: ' + error.message);
    }
  };

  // Sort data function - case insensitive
  const getSortedData = (data, tableType) => {
    if (!sortConfig.key || !data || data.length === 0 || sortConfig.table !== tableType) {
      return data;
    }

    return [...data].sort((a, b) => {
      let aValue, bValue;

      // Get the value based on sort key
      switch (sortConfig.key) {
        case 'user_name':
          aValue = ((a.user?.name || a.user?.first_name || '').toString()).toLowerCase();
          bValue = ((b.user?.name || b.user?.first_name || '').toString()).toLowerCase();
          break;
        case 'user_id':
          aValue = parseInt(a.user?.id || 0);
          bValue = parseInt(b.user?.id || 0);
          if (sortConfig.direction === 'asc') {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        case 'date':
          aValue = new Date(a.created_at || 0);
          bValue = new Date(b.created_at || 0);
          if (sortConfig.direction === 'asc') {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        case 'status':
          aValue = ((a.status || '').toString()).toLowerCase();
          bValue = ((b.status || '').toString()).toLowerCase();
          break;
        default:
          return 0;
      }

      // For string comparisons (case insensitive) - already handled above
      if (sortConfig.key === 'date' || sortConfig.key === 'user_id') {
        return 0; // Already handled above
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // If memberId is provided, show as full page, otherwise show as modal
  const isModalMode = !memberId && isOpen;
  const isPageMode = memberId && !isOpen;

  if (isModalMode && !isOpen) return null;

  // Page mode - wrap with DashboardLayout
  if (isPageMode) {
    // Calculate statistics
    const totalRequests = sentRequests.length + receivedRequests.length;
    const sentPending = sentRequests.filter(req => req.status?.toLowerCase() === 'open' || req.status?.toLowerCase() === 'pending').length;
    const sentAccepted = sentRequests.filter(req => req.status?.toLowerCase() === 'accepted').length;
    const sentRejected = sentRequests.filter(req => req.status?.toLowerCase() === 'rejected').length;
    const receivedPending = receivedRequests.filter(req => req.status?.toLowerCase() === 'open' || req.status?.toLowerCase() === 'pending').length;
    const receivedAccepted = receivedRequests.filter(req => req.status?.toLowerCase() === 'accepted').length;
    const receivedRejected = receivedRequests.filter(req => req.status?.toLowerCase() === 'rejected').length;

    return (
      <DashboardLayout>
        <div className="member-interests-container">
          {/* Header */}
          <div className="member-interests-header">
            <button onClick={() => navigate(-1)} className="member-interests-back-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back
            </button>
            <h1>Member Request Statistics</h1>
          </div>

          {/* Member Info */}
          <div className="member-info-card">
            <div className="member-avatar">
              <img 
                src={memberData?.profile_photo?.upload_photo ? 
                  `${process.env.REACT_APP_API_URL}${memberData.profile_photo.upload_photo}` : 
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTJaIiBmaWxsPSIjOWNhM2FmIi8+CjxwYXRoIGQ9Ik0xMiAxNEM3LjU4MTcyIDE0IDQgMTcuNTgxNyA0IDIySDEyQzE2LjQxODMgMTQgMTIgMTQgMTIgMTRaIiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo8L3N2Zz4K"
                } 
                alt={memberData?.name || "Member"}
                onError={(e) => {
                  e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTJaIiBmaWxsPSIjOWNhM2FmIi8+CjxwYXRoIGQ9Ik0xMiAxNEM3LjU4MTcyIDE0IDQgMTcuNTgxNyA0IDIySDEyQzE2LjQxODMgMTQgMTIgMTQgMTIgMTRaIiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo8L3N2Zz4K";
                }}
              />
            </div>
            <div className="member-details">
              <h2>{memberData?.name || memberData?.first_name || "Member Name"}</h2>
              <p className="member-id">Member ID: {memberData?.member_id || memberData?.id || memberId || "N/A"}</p>
              <p className="member-email">{memberData?.email || "member@email.com"}</p>
            </div>
          </div>

          {/* Request Statistics Card */}
          <div className="member-interests-stats-card">
            <div className="member-interests-stats-header">
              <div className="member-interests-stats-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2"/>
                  <circle cx="8.5" cy="7" r="4" strokeWidth="2"/>
                  <line x1="20" y1="8" x2="20" y2="14" strokeWidth="2"/>
                  <line x1="23" y1="11" x2="17" y2="11" strokeWidth="2"/>
                </svg>
              </div>
              <h2>Request Statistics</h2>
            </div>
            
            <div className="member-interests-stats-content">
              <div className="member-interests-stats-row">
                <div className="member-interests-stat-item">
                  <div className="member-interests-stat-label">Total Requests</div>
                  <div className="member-interests-stat-value total">{totalRequests}</div>
                </div>
                <div className="member-interests-stat-item">
                  <div className="member-interests-stat-label">Sent Requests</div>
                  <div className="member-interests-stat-value sent">{sentRequests.length}</div>
                </div>
                <div className="member-interests-stat-item">
                  <div className="member-interests-stat-label">Received Requests</div>
                  <div className="member-interests-stat-value received">{receivedRequests.length}</div>
                </div>
              </div>
              
              <div className="member-interests-breakdown-section">
                <div className="member-interests-breakdown-column">
                  <h4>Sent Breakdown</h4>
                  <div className="member-interests-breakdown-items">
                    <span className="member-interests-breakdown-item pending">
                      <span className="member-interests-breakdown-label">Pending:</span>
                      <span className="member-interests-breakdown-count">{sentPending}</span>
                    </span>
                    <span className="member-interests-breakdown-item accepted">
                      <span className="member-interests-breakdown-label">Accepted:</span>
                      <span className="member-interests-breakdown-count">{sentAccepted}</span>
                    </span>
                    <span className="member-interests-breakdown-item rejected">
                      <span className="member-interests-breakdown-label">Rejected:</span>
                      <span className="member-interests-breakdown-count">{sentRejected}</span>
                    </span>
                  </div>
                </div>
                
                <div className="member-interests-breakdown-column">
                  <h4>Received Breakdown</h4>
                  <div className="member-interests-breakdown-items">
                    <span className="member-interests-breakdown-item pending">
                      <span className="member-interests-breakdown-label">Pending:</span>
                      <span className="member-interests-breakdown-count">{receivedPending}</span>
                    </span>
                    <span className="member-interests-breakdown-item accepted">
                      <span className="member-interests-breakdown-label">Accepted:</span>
                      <span className="member-interests-breakdown-count">{receivedAccepted}</span>
                    </span>
                    <span className="member-interests-breakdown-item rejected">
                      <span className="member-interests-breakdown-label">Rejected:</span>
                      <span className="member-interests-breakdown-count">{receivedRejected}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Request Tables */}
          <div className="member-interests-tables-container">
            {/* Sent Requests Table */}
            <div className="member-interests-table-section">
              <h3>Sent Requests ({sentRequests.length})</h3>
              {sentRequests.length > 0 ? (
                <div className="member-interests-table-container">
                  <table className="member-interests-table">
                     <thead>
                       <tr>
                         <th 
                           className={sortConfig.table === 'sent' && sortConfig.key === 'user_name' ? 'sortable-header active' : 'sortable-header'}
                           onClick={() => handleSort('user_name', 'sent')}
                           style={{ cursor: 'pointer', textAlign: 'center' }}
                         >
                           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                             Target User
                             <span className="sort-indicator">
                               {sortConfig.table === 'sent' && sortConfig.key === 'user_name' ? (
                                 sortConfig.direction === 'asc' ? '↑' : '↓'
                               ) : (
                                 '⇅'
                               )}
                             </span>
                           </div>
                         </th>
                         <th 
                           className={sortConfig.table === 'sent' && sortConfig.key === 'user_id' ? 'sortable-header active' : 'sortable-header'}
                           onClick={() => handleSort('user_id', 'sent')}
                           style={{ cursor: 'pointer', textAlign: 'center' }}
                         >
                           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                             Member ID
                             <span className="sort-indicator">
                               {sortConfig.table === 'sent' && sortConfig.key === 'user_id' ? (
                                 sortConfig.direction === 'asc' ? '↑' : '↓'
                               ) : (
                                 '⇅'
                               )}
                             </span>
                           </div>
                         </th>
                         <th 
                           className={sortConfig.table === 'sent' && sortConfig.key === 'date' ? 'sortable-header active' : 'sortable-header'}
                           onClick={() => handleSort('date', 'sent')}
                           style={{ cursor: 'pointer', textAlign: 'center' }}
                         >
                           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                             Date Sent
                             <span className="sort-indicator">
                               {sortConfig.table === 'sent' && sortConfig.key === 'date' ? (
                                 sortConfig.direction === 'asc' ? '↑' : '↓'
                               ) : (
                                 '⇅'
                               )}
                             </span>
                           </div>
                         </th>
                         <th 
                           className={sortConfig.table === 'sent' && sortConfig.key === 'status' ? 'sortable-header active' : 'sortable-header'}
                           onClick={() => handleSort('status', 'sent')}
                           style={{ cursor: 'pointer', textAlign: 'center' }}
                         >
                           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                             Status
                             <span className="sort-indicator">
                               {sortConfig.table === 'sent' && sortConfig.key === 'status' ? (
                                 sortConfig.direction === 'asc' ? '↑' : '↓'
                               ) : (
                                 '⇅'
                               )}
                             </span>
                           </div>
                         </th>
                       </tr>
                     </thead>
                    <tbody>
                      {getSortedData(sentRequests, 'sent').map((request, index) => (
                        <tr key={index}>
                          <td style={{ textAlign: 'center' }}>{request.user?.name || request.user?.first_name || "N/A"}</td>
                          <td style={{ textAlign: 'center' }}>{request.user?.id || "N/A"}</td>
                          <td style={{ textAlign: 'center' }}>{request.created_at ? new Date(request.created_at).toLocaleDateString() : "N/A"}</td>
                          <td style={{ textAlign: 'center' }}>
                            <span className={`member-interests-table-status-badge member-interests-table-status-${request.status?.toLowerCase() || 'pending'}`}>
                              {request.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="member-interests-no-data">
                  <p>No sent requests found</p>
                </div>
              )}
            </div>

            {/* Received Requests Table */}
            <div className="member-interests-table-section">
              <h3>Received Requests ({receivedRequests.length})</h3>
              {receivedRequests.length > 0 ? (
                <div className="member-interests-table-container">
                  <table className="member-interests-table">
                     <thead>
                       <tr>
                         <th 
                           className={sortConfig.table === 'received' && sortConfig.key === 'user_name' ? 'sortable-header active' : 'sortable-header'}
                           onClick={() => handleSort('user_name', 'received')}
                           style={{ cursor: 'pointer', textAlign: 'center' }}
                         >
                           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                             From User
                             <span className="sort-indicator">
                               {sortConfig.table === 'received' && sortConfig.key === 'user_name' ? (
                                 sortConfig.direction === 'asc' ? '↑' : '↓'
                               ) : (
                                 '⇅'
                               )}
                             </span>
                           </div>
                         </th>
                         <th 
                           className={sortConfig.table === 'received' && sortConfig.key === 'user_id' ? 'sortable-header active' : 'sortable-header'}
                           onClick={() => handleSort('user_id', 'received')}
                           style={{ cursor: 'pointer', textAlign: 'center' }}
                         >
                           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                             Member ID
                             <span className="sort-indicator">
                               {sortConfig.table === 'received' && sortConfig.key === 'user_id' ? (
                                 sortConfig.direction === 'asc' ? '↑' : '↓'
                               ) : (
                                 '⇅'
                               )}
                             </span>
                           </div>
                         </th>
                         <th 
                           className={sortConfig.table === 'received' && sortConfig.key === 'date' ? 'sortable-header active' : 'sortable-header'}
                           onClick={() => handleSort('date', 'received')}
                           style={{ cursor: 'pointer', textAlign: 'center' }}
                         >
                           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                             Date Received
                             <span className="sort-indicator">
                               {sortConfig.table === 'received' && sortConfig.key === 'date' ? (
                                 sortConfig.direction === 'asc' ? '↑' : '↓'
                               ) : (
                                 '⇅'
                               )}
                             </span>
                           </div>
                         </th>
                         <th 
                           className={sortConfig.table === 'received' && sortConfig.key === 'status' ? 'sortable-header active' : 'sortable-header'}
                           onClick={() => handleSort('status', 'received')}
                           style={{ cursor: 'pointer', textAlign: 'center' }}
                         >
                           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                             Status
                             <span className="sort-indicator">
                               {sortConfig.table === 'received' && sortConfig.key === 'status' ? (
                                 sortConfig.direction === 'asc' ? '↑' : '↓'
                               ) : (
                                 '⇅'
                               )}
                             </span>
                           </div>
                         </th>
                         <th style={{ textAlign: 'center' }}>
                           Action
                         </th>
                       </tr>
                     </thead>
                    <tbody>
                      {getSortedData(receivedRequests, 'received').map((request, index) => {
                        const status = request.status?.toLowerCase() || 'pending';
                        const isPending = status === 'pending' || status === 'open' || status === 'requested';
                        const senderUserId = request.user?.id || request.sender_id;
                        
                        return (
                          <tr key={index}>
                            <td style={{ textAlign: 'center' }}>{request.user?.name || request.user?.first_name || "N/A"}</td>
                            <td style={{ textAlign: 'center' }}>{request.user?.id || "N/A"}</td>
                            <td style={{ textAlign: 'center' }}>{request.created_at ? new Date(request.created_at).toLocaleDateString() : "N/A"}</td>
                            <td style={{ textAlign: 'center' }}>
                              <span className={`member-interests-table-status-badge member-interests-table-status-${status}`}>
                                {request.status || "Pending"}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {isPending && senderUserId && memberId ? (
                                <div className="action-buttons" style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                                  <button
                                    className="member-interest-agent-accept-btn"
                                    onClick={() => handleAcceptPhotoRequest(senderUserId, memberId)}
                                    title="Accept Photo Request"
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                      <path d="M20 6 9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Accept
                                  </button>
                                  <button
                                    className="member-interest-agent-reject-btn"
                                    onClick={() => handleRejectPhotoRequest(senderUserId, memberId)}
                                    title="Reject Photo Request"
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                      <path d="M18 6 6 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="no-action">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="member-interests-no-data">
                  <p>No received requests found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }


  // Modal mode
  if (!isModalMode) return null;

  return (
    <div className="member-request-send-received-overlay" onClick={onClose}>
      <div className="member-request-send-received-bottom-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="member-request-send-received-header">
          <h2>Send Photo Request on Behalf</h2>
          <button className="member-request-send-received-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Target User Info */}
        <div className="member-request-send-received-target-info">
          <img 
            src={getProfileImageUrl(targetUserPhoto)} 
            alt={targetUserName}
            className="member-request-send-received-target-photo"
          />
          <div>
            <h3>Send photo request to:</h3>
            <p className="member-request-send-received-target-name">{targetUserName}</p>
            
            {/* Selected Member Status Display */}
            {selectedMember && (
              <div className="selected-member-status" style={{
                marginTop: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef'
              }}>
                <strong>Selected: {selectedMember.name || selectedMember.first_name}</strong>
                {(() => {
                  const status = getRequestStatus(selectedMember.id);
                  
                  if (status && status.hasRequest) {
                    const statusInfo = getStatusInfo(status.status, status.hasRequest);
                    return (
                      <div style={{
                        marginTop: '4px',
                        fontSize: '14px',
                        color: statusInfo.textColor,
                        fontWeight: 'bold'
                      }}>
                        Status: {statusInfo.text}
                      </div>
                    );
                  } else if (status && !status.hasRequest) {
                    return (
                      <div style={{
                        marginTop: '4px',
                        fontSize: '14px',
                        color: '#6c757d'
                      }}>
                        No request sent yet
                      </div>
                    );
                  } else {
                    return (
                      <div style={{
                        marginTop: '4px',
                        fontSize: '14px',
                        color: '#6c757d'
                      }}>
                        Checking status...
                      </div>
                    );
                  }
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Members List */}
        <div className="member-request-send-received-content">
          {loading ? (
            <div className="member-request-send-received-loading">
              <div className="loading-spinner"></div>
              <p>Loading members...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="member-request-send-received-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2"/>
                <circle cx="9" cy="7" r="4" strokeWidth="2"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth="2"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2"/>
              </svg>
              <h3>No Compatible Members Found</h3>
              <p>You don't have any members of the opposite gender to send photo requests from.</p>
            </div>
          ) : (
            <>
              <h3 className="member-request-send-received-subtitle">Select a member:</h3>
              <div className="member-request-send-received-members-list">
                {filteredMembers.map((member) => {
                  const requestStatus = getRequestStatus(member.id);
                  const canSend = canSendRequest(member.id);
                  const statusInfo = getStatusInfo(requestStatus?.status, requestStatus?.hasRequest);
                  
                  return (
                    <div
                      key={member.id}
                      className={`member-request-send-received-member-card ${
                        selectedMember?.id === member.id ? 'selected' : ''
                      } ${!canSend ? 'disabled' : ''}`}
                      onClick={() => canSend && handleMemberSelection(member)}
                      style={{ 
                        opacity: canSend ? 1 : 0.6,
                        cursor: canSend ? 'pointer' : 'not-allowed'
                      }}
                    >
                    <img
                      src={getProfileImageUrl(member.profile_photo)}
                      alt={member.name || member.first_name}
                      className="member-request-send-received-member-photo"
                    />
                    <div className="member-request-send-received-member-details">
                      <h4>{member.name || member.first_name || 'N/A'}</h4>
                      <p>ID: {member.member_id || member.id}</p>
                      {member.email && <p className="member-request-send-received-member-email">{member.email}</p>}
                      
                      {/* Request Status - Only show if request actually sent */}
                      {requestStatus && requestStatus.hasRequest && (
                        <div className="request-status-badge" style={{
                          backgroundColor: statusInfo.bg,
                          color: statusInfo.textColor,
                          border: `1px solid ${statusInfo.border}`,
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          textTransform: 'capitalize',
                          display: 'inline-block',
                          marginBottom: '8px'
                        }}>
                          {statusInfo.text}
                        </div>
                      )}
                      
                      {/* Show "No Request Sent" only for selected member */}
                      {selectedMember?.id === member.id && requestStatus && !requestStatus.hasRequest && (
                        <div className="no-request-badge" style={{
                          backgroundColor: '#f8f9fa',
                          color: '#6c757d',
                          border: '1px solid #e9ecef',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          textTransform: 'capitalize',
                          display: 'inline-block',
                          marginBottom: '8px'
                        }}>
                          No Request Sent
                        </div>
                      )}
                    </div>
                    {selectedMember?.id === member.id && (
                      <div className="member-request-send-received-check">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="member-request-send-received-footer">
          <button
            className="member-request-send-received-cancel-btn"
            onClick={onClose}
            disabled={sending}
          >
            Cancel
          </button>
          <button
            className="member-request-send-received-send-btn"
            onClick={handleSendRequest}
            disabled={!selectedMember || sending || (selectedMember && !canSendRequest(selectedMember.id))}
            style={selectedMember ? getStatusInfo(getRequestStatus(selectedMember.id)?.status, getRequestStatus(selectedMember.id)?.hasRequest).buttonStyle : {}}
          >
            {sending ? 'Sending...' : 
             selectedMember && !canSendRequest(selectedMember.id) ? 
             getStatusInfo(getRequestStatus(selectedMember.id)?.status, getRequestStatus(selectedMember.id)?.hasRequest).text : 
             selectedMember ? 'Send Photo Request' : 'Select a Member'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberRequestSend_Received;
