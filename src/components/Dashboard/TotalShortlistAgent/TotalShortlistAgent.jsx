import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import { fetchDataWithTokenV2 } from "../../../apiUtils";
import './TotalShortlistAgent.css';

const TotalShortlistAgent = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('impersonating_user_id') || localStorage.getItem("userId");
  const [shortlistData, setShortlistData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch agent shortlist data
  useEffect(() => {
    if (userId) {
      setLoading(true);
      const parameter = {
        url: `/api/agent/shortlist/?agent_id=${userId}`,
        setterFunction: (data) => {
          console.log('Agent shortlist data received:', data);
          // Filter only shortlisted items and map the data structure
          const shortlistedItems = (data || []).filter(item => item.shortlisted === true);
          setShortlistData(shortlistedItems);
          setFilteredData(shortlistedItems);
          setLoading(false);
        },
        setErrors: (error) => {
          console.error('Agent shortlist API error:', error);
          setError(true);
          setLoading(false);
        },
        setLoading: setLoading,
      };
      fetchDataWithTokenV2(parameter);
    }
  }, [userId]);


  const getProfileImageUrl = (photoUrl) => {
    if (!photoUrl || typeof photoUrl !== 'string') {
      return "https://via.placeholder.com/60";
    }
    
    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      if (photoUrl.includes('!') || photoUrl.includes('undefined') || photoUrl.length < 10) {
        return "https://via.placeholder.com/60";
      }
      return photoUrl;
    }
    
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

  const handleRemoveFromShortlist = async (shortlistId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/agent/shortlist/${shortlistId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Remove from local state
        setShortlistData(prev => prev.filter(item => item.id !== shortlistId));
        setFilteredData(prev => prev.filter(item => item.id !== shortlistId));
        alert('Removed from shortlist successfully');
      } else {
        alert('Failed to remove from shortlist');
      }
    } catch (error) {
      console.error('Error removing from shortlist:', error);
      alert('Error removing from shortlist');
    }
  };

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  return (
    <DashboardLayout>
      <div className="total-shortlist-agent-container">
        <div className="shortlist-header">
          <h2>Total Shortlist</h2>
          <p className="subtitle">Manage your shortlisted members</p>
        </div>


        {/* Content */}
        <div className="shortlist-content">
          {loading && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading shortlist...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <line x1="15" y1="9" x2="9" y2="15" strokeWidth="2"/>
                <line x1="9" y1="9" x2="15" y2="15" strokeWidth="2"/>
              </svg>
              <h3>Error Loading Data</h3>
              <p>Failed to load shortlist data. Please try again.</p>
            </div>
          )}

          {!loading && !error && filteredData.length === 0 && (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" strokeWidth="2"/>
              </svg>
              <h3>No Shortlisted Members</h3>
              <p>You haven't shortlisted any members yet</p>
            </div>
          )}

          {!loading && !error && filteredData.length > 0 && (
            <table className="members-table">
                  <thead>
                    <tr>
                      <th>Member ID</th>
                      <th>Photo</th>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Marital Status</th>
                      <th>Profession</th>
                      <th>Sect</th>
                      <th>Location</th>
                      <th>Shortlisted Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr key={item.id || index} className="table-row">
                        <td>
                          <span className="member-id-badge">
                            {item.action_on?.member_id || "N/A"}
                          </span>
                        </td>
                        <td>
                          <div className="member-photo-cell">
                            <div className="member-avatar">
                              <img
                                src={getProfileImageUrl(item.action_on?.profile_photo)}
                                alt={item.action_on?.name || "Member"}
                                className="avatar-img"
                                onError={(e) => {
                                  e.target.src = "https://via.placeholder.com/50";
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="simple-member-name">
                            {item.action_on?.name || "N/A"}
                          </span>
                        </td>
                        <td>{item.action_on?.age || "N/A"}</td>
                        <td>
                          <span className={`marital-badge ${item.action_on?.martial_status ? item.action_on?.martial_status?.toLowerCase()?.replace(" ", "-") : "not-mentioned"}`}>
                            {item.action_on?.martial_status || "Not mentioned"}
                          </span>
                        </td>
                        <td>{item.action_on?.profession || "N/A"}</td>
                        <td>{item.action_on?.sect_school_info || "N/A"}</td>
                        <td>{item.action_on?.city || "N/A"}</td>
                        <td>{formatDate(item.created_at)}</td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="action-btn view-btn modern-btn"
                              onClick={() => handleViewUserDetails(item.action_on)}
                              title="View User Details"
                              style={{
                                width: "36px",
                                height: "36px",
                                minWidth: "36px",
                                minHeight: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                              </svg>
                            </button>
                            
                            <button
                              className="action-btn remove-btn modern-btn"
                              onClick={() => handleRemoveFromShortlist(item.id)}
                              title="Remove from shortlist"
                              style={{
                                width: "36px",
                                height: "36px",
                                minWidth: "36px",
                                minHeight: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
          )}
        </div>

        {/* Stats */}
        {!loading && !error && filteredData.length > 0 && (
          <div className="stats-section">
            <div className="stats-card">
              <div className="stats-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" strokeWidth="2"/>
                </svg>
              </div>
              <div className="stats-content">
                <h3>Total Shortlisted</h3>
                <p className="stats-number">{filteredData.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {showUserModal && selectedUser && (
          <div className="user-modal-overlay" onClick={closeUserModal}>
            <div className="user-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="user-modal-header">
                <h3>User Details</h3>
                <button className="close-modal-btn" onClick={closeUserModal}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
              <div className="user-modal-body">
                <div className="user-profile-section">
                  <div className="user-avatar-container">
                    <img
                      src={getProfileImageUrl(selectedUser?.profile_photo)}
                      alt={selectedUser?.name || 'User'}
                      className="user-modal-avatar"
                    />
                  </div>
                  
                  <div className="user-basic-info">
                    <h2 className="user-name">
                      {selectedUser?.name || 'N/A'}
                    </h2>
                    <p className="user-email">{selectedUser?.email || 'N/A'}</p>
                    <p className="user-id">Member ID: {selectedUser?.member_id || 'N/A'}</p>
                  </div>
                </div>

                <div className="user-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Age:</span>
                    <span className="detail-value">{selectedUser?.age || 'N/A'}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Gender:</span>
                    <span className="detail-value">{selectedUser?.gender || 'N/A'}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">City:</span>
                    <span className="detail-value">{selectedUser?.city || 'N/A'}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Profession:</span>
                    <span className="detail-value">{selectedUser?.profession || 'N/A'}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Sect/School:</span>
                    <span className="detail-value">{selectedUser?.sect_school_info || 'N/A'}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Marital Status:</span>
                    <span className="detail-value">{selectedUser?.martial_status || 'N/A'}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">User ID:</span>
                    <span className="detail-value">{selectedUser?.id || 'N/A'}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">Shortlisted</span>
                  </div>
                </div>

                {selectedUser?.bio && (
                  <div className="user-bio-section">
                    <h4>About</h4>
                    <p className="user-bio">{selectedUser.bio}</p>
                  </div>
                )}

                {selectedUser?.interests && selectedUser.interests.length > 0 && (
                  <div className="user-interests-section">
                    <h4>Interests</h4>
                    <div className="interests-list">
                      {selectedUser.interests.map((interest, index) => (
                        <span key={index} className="interest-tag">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="user-modal-footer">
                  <button
                    className="view-full-profile-btn"
                    onClick={() => {
                      closeUserModal();
                      navigate(`/user/${selectedUser.id}`);
                    }}
                  >
                    View Full Profile
                  </button>
                  <button
                    className="close-btn"
                    onClick={closeUserModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TotalShortlistAgent;
