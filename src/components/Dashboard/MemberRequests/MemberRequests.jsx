import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import { fetchDataWithTokenV2 } from "../../../apiUtils";
import { AiOutlineFilter, AiOutlineRedo } from "react-icons/ai";
import './MemberRequests.css';

const MemberRequests = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('impersonating_user_id') || localStorage.getItem("userId");
  const [tabActive, setTabActive] = useState("sent"); // 'sent' or 'received'
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc', table: null }); // table: 'sent' or 'received'
  const [filters, setFilters] = useState({
    id: '',
    name: '',
    city: '',
    sectSchoolInfo: '',
    profession: '',
    martialStatus: '',
    gender: '',
  });
  const [filteredSentRequests, setFilteredSentRequests] = useState([]);
  const [filteredReceivedRequests, setFilteredReceivedRequests] = useState([]);
  
  // Photo modal states
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedUserPhotos, setSelectedUserPhotos] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState("");

  // Fetch all member photo requests for the agent
  useEffect(() => {
    if (userId) {
      setLoading(true);
      
      // Step 1: Fetch all members for this agent
      fetch(`${process.env.REACT_APP_API_URL}/api/agent/user_agent/?agent_id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        const members = data.member || [];
        
        // Step 2: Fetch photo requests for each member
        if (members.length > 0) {
          const fetchPromises = members.map(member => {
            return fetch(`${process.env.REACT_APP_API_URL}/api/agent/member/photo-requests/?member_id=${member.id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            })
            .then(res => res.json())
            .then(requestsData => ({
              member: member,
              requests: requestsData
            }))
            .catch(err => {
              console.error(`Error fetching photo requests for member ${member.id}:`, err);
              return { member: member, requests: null };
            });
          });
          
          Promise.all(fetchPromises)
            .then(results => {
              const allSentRequests = [];
              const allReceivedRequests = [];
              
              results.forEach(result => {
                if (result.requests) {
                  if (result.requests.sent_requests && result.requests.sent_requests.length > 0) {
                    allSentRequests.push(...result.requests.sent_requests.map(request => ({
                      ...request,
                      member_name: result.member.name || result.member.first_name || "N/A",
                      member_id: result.member.id,
                      member_photo: result.member.profile_photo,
                      // Recipient details from request.user
                      recipient_name: request.user?.name || request.user?.first_name || request.user?.username || "N/A",
                      recipient_id: request.user?.id || "N/A",
                      recipient_photo: request.user?.profile_photo || request.user?.upload_photo || null
                    })));
                  }
                  if (result.requests.received_requests && result.requests.received_requests.length > 0) {
                    allReceivedRequests.push(...result.requests.received_requests.map(request => ({
                      ...request,
                      member_name: result.member.name || result.member.first_name || "N/A",
                      member_id: result.member.id,
                      member_photo: result.member.profile_photo,
                      // Sender details from request.user
                      sender_name: request.user?.name || request.user?.first_name || request.user?.username || "N/A",
                      sender_id: request.user?.id || "N/A",
                      sender_photo: request.user?.profile_photo || request.user?.upload_photo || null,
                      // Request ID for accept/reject actions
                      request_id: request.request_id || request.id || request.photo_request_id
                    })));
                  }
                }
              });
              
              setSentRequests(allSentRequests);
              setReceivedRequests(allReceivedRequests);
              setFilteredSentRequests(allSentRequests);
              setFilteredReceivedRequests(allReceivedRequests);
              setLoading(false);
            })
            .catch(err => {
              console.error('Error processing photo requests:', err);
              setLoading(false);
              setError(true);
            });
        } else {
          setSentRequests([]);
          setReceivedRequests([]);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Error fetching members:', err);
        setLoading(false);
        setError(true);
      });
    }
  }, [userId]);

  const getProfileImageUrl = (photoUrl) => {
    // Check if photoUrl exists and is a string
    if (!photoUrl || typeof photoUrl !== 'string') {
      return "https://via.placeholder.com/60";
    }
    
    // Check if it's already a complete URL
    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      // Check if URL is malformed (contains ! or other invalid characters)
      if (photoUrl.includes('!') || photoUrl.includes('undefined') || photoUrl.length < 10) {
        return "https://via.placeholder.com/60";
      }
      return photoUrl;
    }
    
    // For relative paths, prepend the API URL
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

  // Sort data function - case insensitive
  const getSortedData = (data, tableType) => {
    if (!sortConfig.key || !data || data.length === 0 || sortConfig.table !== tableType) {
      return data;
    }

    return [...data].sort((a, b) => {
      let aValue, bValue;

      // Get the value based on sort key
      switch (sortConfig.key) {
        case 'member_name':
          aValue = ((a.member_name || '').toString()).toLowerCase();
          bValue = ((b.member_name || '').toString()).toLowerCase();
          break;
        case 'recipient_name':
          aValue = ((a.recipient_name || '').toString()).toLowerCase();
          bValue = ((b.recipient_name || '').toString()).toLowerCase();
          break;
        case 'sender_name':
          aValue = ((a.sender_name || '').toString()).toLowerCase();
          bValue = ((b.sender_name || '').toString()).toLowerCase();
          break;
        case 'member_id':
          aValue = parseInt(a.member_id || 0);
          bValue = parseInt(b.member_id || 0);
          if (sortConfig.direction === 'asc') {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        case 'recipient_id':
          aValue = parseInt(a.recipient_id || 0);
          bValue = parseInt(b.recipient_id || 0);
          if (sortConfig.direction === 'asc') {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        case 'sender_id':
          aValue = parseInt(a.sender_id || 0);
          bValue = parseInt(b.sender_id || 0);
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
      if (sortConfig.key === 'date' || sortConfig.key.includes('_id')) {
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

  // Filter functionality
  const handleFilterChange = (column, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [column]: value };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };

  const onClearFilterClick = () => {
    const clear = {
      id: '',
      name: '',
      city: '',
      sectSchoolInfo: '',
      profession: '',
      martialStatus: '',
      gender: '',
    };
    setFilters(clear);
    applyFilters(clear);
  };

  const applyFilters = (updatedFilters) => {
    // Filter sent requests
    const filteredSent = sentRequests.filter((item) => {
      const memberName = item.member_name || '';
      const recipientName = item.recipient_name || '';
      const memberId = item.member_id || '';
      const recipientId = item.recipient_id || '';
      
      return (
        (updatedFilters.id ? 
          updatedFilters.id.split(' ').every(word => {
            const w = String(word).toLowerCase();
            const idMatch = String(memberId).toLowerCase().includes(w) || 
                          String(recipientId).toLowerCase().includes(w);
            return idMatch;
          }) : true) &&
        (updatedFilters.name
          ? memberName.toLowerCase().includes(updatedFilters.name.toLowerCase()) ||
            recipientName.toLowerCase().includes(updatedFilters.name.toLowerCase())
          : true)
      );
    });

    // Filter received requests
    const filteredReceived = receivedRequests.filter((item) => {
      const memberName = item.member_name || '';
      const senderName = item.sender_name || '';
      const memberId = item.member_id || '';
      const senderId = item.sender_id || '';
      
      return (
        (updatedFilters.id ? 
          updatedFilters.id.split(' ').every(word => {
            const w = String(word).toLowerCase();
            const idMatch = String(memberId).toLowerCase().includes(w) || 
                          String(senderId).toLowerCase().includes(w);
            return idMatch;
          }) : true) &&
        (updatedFilters.name
          ? memberName.toLowerCase().includes(updatedFilters.name.toLowerCase()) ||
            senderName.toLowerCase().includes(updatedFilters.name.toLowerCase())
          : true)
      );
    });

    setFilteredSentRequests(filteredSent);
    setFilteredReceivedRequests(filteredReceived);
  };

  useEffect(() => {
    applyFilters(filters);
  }, [sentRequests, receivedRequests]);

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
        window.location.reload();
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
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Failed to reject photo request: ${errorData.error || errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Error rejecting photo request: ' + error.message);
    }
  };

  // Handle photo click - fetch and show user photos
  const handlePhotoClick = async (userId, userName) => {
    try {
      setLoading(true);
      
      // Fetch user photos from user_userphoto table
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/add_photo/?user_id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const photoData = await response.json();
      console.log('User photos fetched:', photoData);
      
      // Get photos from user_userphoto table
      const photos = [];
      
      // Check if response is an array
      if (Array.isArray(photoData)) {
        photoData.forEach(photoItem => {
          if (photoItem.upload_photo) {
            const processedUrl = getProfileImageUrl(photoItem.upload_photo);
            // Only add if it's a valid URL (not placeholder)
            if (!processedUrl.includes('placeholder')) {
              photos.push(processedUrl);
            }
          }
        });
      } else if (photoData && typeof photoData === 'object') {
        // If it's a single object or has a nested structure
        if (photoData.upload_photo) {
          const processedUrl = getProfileImageUrl(photoData.upload_photo);
          if (!processedUrl.includes('placeholder')) {
            photos.push(processedUrl);
          }
        }
        // Check for array inside the object
        if (photoData.photos && Array.isArray(photoData.photos)) {
          photoData.photos.forEach(photo => {
            if (photo.upload_photo) {
              const processedUrl = getProfileImageUrl(photo.upload_photo);
              if (!processedUrl.includes('placeholder')) {
                photos.push(processedUrl);
              }
            }
          });
        }
      }
      
      console.log('Processed photos:', photos);
      
      setSelectedUserPhotos(photos);
      setSelectedUserName(userName);
      setShowPhotoModal(true);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user photos:', err);
      setLoading(false);
      alert('Error loading photos. Please try again.');
    }
  };

  return (
    <DashboardLayout>
      <div className="member-requests-container">
        <div className="member-requests-header">
          <h2>Member Photo Requests</h2>
          <p className="subtitle">View photo requests sent and received by your members</p>
        </div>

        {/* Tabs */}
        <div className="requests-tabs">
          <button
            className={`tab-button ${tabActive === "sent" ? "active" : ""}`}
            onClick={() => {
              setTabActive("sent");
              setSortConfig({ key: null, direction: 'asc', table: null });
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 2L11 13" strokeWidth="2" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2" />
            </svg>
            Sent ({sentRequests.length})
          </button>
          <button
            className={`tab-button ${tabActive === "received" ? "active" : ""}`}
            onClick={() => {
              setTabActive("received");
              setSortConfig({ key: null, direction: 'asc', table: null });
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" />
              <polyline points="17 8 12 3 7 8" strokeWidth="2" />
              <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" />
            </svg>
            Received ({receivedRequests.length})
          </button>
        </div>

        {/* Content */}
        <div className="requests-content">
          {loading && <div className="loading">Loading...</div>}
          
          {!loading && tabActive === "sent" && (
            <div className="requests-list">
              {sentRequests.length === 0 ? (
                <div className="empty-state">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 2L11 13" strokeWidth="2" />
                    <path d="M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2" />
                  </svg>
                  <h3>No Sent Requests</h3>
                  <p>Your members haven't sent any photo requests yet</p>
                </div>
              ) : (
                <div className="requests-table-container">
                  <table className="requests-table">
                    <thead>
                      <tr>
                        <th 
                          className={sortConfig.table === 'sent' && sortConfig.key === 'member_name' ? 'sortable-header active' : 'sortable-header'}
                          onClick={() => handleSort('member_name', 'sent')}
                          style={{ cursor: 'pointer', textAlign: 'center' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            Sent By
                            <span className="sort-indicator">
                              {sortConfig.table === 'sent' && sortConfig.key === 'member_name' ? (
                                sortConfig.direction === 'asc' ? '↑' : '↓'
                              ) : (
                                '⇅'
                              )}
                            </span>
                          </div>
                        </th>
                        <th 
                          className={sortConfig.table === 'sent' && sortConfig.key === 'recipient_name' ? 'sortable-header active' : 'sortable-header'}
                          onClick={() => handleSort('recipient_name', 'sent')}
                          style={{ cursor: 'pointer', textAlign: 'center' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            Sent To
                            <span className="sort-indicator">
                              {sortConfig.table === 'sent' && sortConfig.key === 'recipient_name' ? (
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
                            Date
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
                      {getSortedData(filteredSentRequests, 'sent').map((request, index) => (
                        <tr key={index}>
                          <td style={{ textAlign: 'center' }}>
                            <div className="table-member-info">
                              <img
                                src={getProfileImageUrl(request.member_photo)}
                                alt={request.member_name}
                                className="table-avatar"
                              />
                              <div>
                                <div className="table-name">{request.member_name || "N/A"}</div>
                                <div className="table-id">ID: {request.member_id}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div className="table-member-info">
                              <img
                                src={getProfileImageUrl(request.recipient_photo)}
                                alt={request.recipient_name}
                                className="table-avatar"
                              />
                              <div>
                                <div className="table-name">{request.recipient_name || "N/A"}</div>
                                <div className="table-id">ID: {request.recipient_id}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center' }}>{formatDate(request.created_at)}</td>
                          <td style={{ textAlign: 'center' }}>
                            {request.status?.toLowerCase() === 'accepted' ? (
                              <button
                                className={`status clickable-status ${request.status?.toLowerCase() || 'open'}`}
                                onClick={() => handlePhotoClick(request.recipient_id, request.recipient_name)}
                                title="Click to view photos"
                              >
                                {request.status || "Open"}
                              </button>
                            ) : (
                              <span className={`status ${request.status?.toLowerCase() || 'open'}`}>
                                {request.status || "Open"}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {!loading && tabActive === "received" && (
            <div className="requests-list">
              {receivedRequests.length === 0 ? (
                <div className="empty-state">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" />
                    <polyline points="17 8 12 3 7 8" strokeWidth="2" />
                    <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" />
                  </svg>
                  <h3>No Received Requests</h3>
                  <p>Your members haven't received any photo requests yet</p>
                </div>
              ) : (
                <div className="requests-table-container">
                  <table className="requests-table">
                    <thead>
                      <tr>
                        <th 
                          className={sortConfig.table === 'received' && sortConfig.key === 'member_name' ? 'sortable-header active' : 'sortable-header'}
                          onClick={() => handleSort('member_name', 'received')}
                          style={{ cursor: 'pointer', textAlign: 'center' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            Received By
                            <span className="sort-indicator">
                              {sortConfig.table === 'received' && sortConfig.key === 'member_name' ? (
                                sortConfig.direction === 'asc' ? '↑' : '↓'
                              ) : (
                                '⇅'
                              )}
                            </span>
                          </div>
                        </th>
                        <th 
                          className={sortConfig.table === 'received' && sortConfig.key === 'sender_name' ? 'sortable-header active' : 'sortable-header'}
                          onClick={() => handleSort('sender_name', 'received')}
                          style={{ cursor: 'pointer', textAlign: 'center' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            Received From
                            <span className="sort-indicator">
                              {sortConfig.table === 'received' && sortConfig.key === 'sender_name' ? (
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
                            Date
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
                      {getSortedData(filteredReceivedRequests, 'received').map((request, index) => {
                        const status = request.status?.toLowerCase() || 'open';
                        const isPending = status === 'open' || status === 'requested';
                        const senderUserId = request.sender_id || request.user?.id;
                        
                        return (
                          <tr key={index}>
                            <td style={{ textAlign: 'center' }}>
                              <div className="table-member-info">
                                <img
                                  src={getProfileImageUrl(request.member_photo)}
                                  alt={request.member_name}
                                  className="table-avatar"
                                />
                                <div>
                                  <div className="table-name">{request.member_name || "N/A"}</div>
                                  <div className="table-id">ID: {request.member_id}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <div className="table-member-info">
                                <img
                                  src={getProfileImageUrl(request.sender_photo)}
                                  alt={request.sender_name}
                                  className="table-avatar"
                                />
                                <div>
                                  <div className="table-name">{request.sender_name || "N/A"}</div>
                                  <div className="table-id">ID: {request.sender_id}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ textAlign: 'center' }}>{formatDate(request.created_at)}</td>
                            <td style={{ textAlign: 'center' }}>
                              {request.status?.toLowerCase() === 'accepted' ? (
                                <button
                                  className={`status clickable-status ${request.status?.toLowerCase() || 'open'}`}
                                  onClick={() => handlePhotoClick(request.sender_id, request.sender_name)}
                                  title="Click to view photos"
                                >
                                  {request.status || "Open"}
                                </button>
                              ) : (
                                <span className={`status ${request.status?.toLowerCase() || 'open'}`}>
                                  {request.status || "Open"}
                                </span>
                              )}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {isPending && senderUserId && request.member_id ? (
                                <div className="action-buttons" style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                                  <button
                                    className="member-interest-agent-accept-btn"
                                    onClick={() => handleAcceptPhotoRequest(senderUserId, request.member_id)}
                                    title="Accept Photo Request"
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                      <path d="M20 6 9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Accept
                                  </button>
                                  <button
                                    className="member-interest-agent-reject-btn"
                                    onClick={() => handleRejectPhotoRequest(senderUserId, request.member_id)}
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
              )}
            </div>
          )}
        </div>

        {/* Photo Modal */}
        {showPhotoModal && (
          <div className="photo-modal-overlay" onClick={() => setShowPhotoModal(false)}>
            <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="photo-modal-header">
                <h3>{selectedUserName}'s Photos</h3>
                <button className="close-modal-btn" onClick={() => setShowPhotoModal(false)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="photo-modal-body">
                {selectedUserPhotos.length > 0 ? (
                  <div className="photo-grid">
                    {selectedUserPhotos.map((photo, index) => (
                      <div key={index} className="photo-item">
                        <img 
                          src={photo} 
                          alt={`Photo ${index + 1}`}
                          onError={(e) => {
                            console.error('Image failed to load:', photo);
                            e.target.src = 'https://via.placeholder.com/200x200?text=Image+Not+Found';
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', photo);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-photos">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="2" />
                      <polyline points="21 15 16 10 5 21" strokeWidth="2" />
                    </svg>
                    <h3>No Photos Found</h3>
                    <p>This user hasn't uploaded any photos yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MemberRequests;
