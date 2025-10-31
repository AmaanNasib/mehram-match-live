import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import { AiOutlineFilter, AiOutlineRedo } from "react-icons/ai";
import { fetchDataWithTokenV2 } from "../../../apiUtils";
import './TotalInteractionAgent.css';

const TotalInteractionAgent = () => {
  const navigate = useNavigate();
  const [interactionData, setInteractionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [memberDetails, setMemberDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});
  const itemsPerPage = 10;

  // Filter states
  const [filters, setFilters] = useState({
    memberId: '',
    name: '',
    city: '',
    profession: '',
    sect: '',
    maritalStatus: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  // Fetch agent interaction data
  useEffect(() => {
    setLoading(true);
    const parameter = {
      url: `/api/agent/members/interaction-table/`,
      setterFunction: (data) => {
        console.log('Agent interaction data received:', data);
        // Extract interaction_table from response
        const interactionTable = data?.interaction_table || [];
        setInteractionData(interactionTable);
        setFilteredData(interactionTable);
        setLoading(false);
      },
      setErrors: (error) => {
        console.error('Agent interaction API error:', error);
        setError(true);
        setLoading(false);
      },
      setLoading: setLoading,
    };
    fetchDataWithTokenV2(parameter);
  }, []);

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

  // Fetch individual member details
  const fetchMemberDetails = async (memberId) => {
    if (memberDetails[memberId] || loadingDetails[memberId]) return;
    
    setLoadingDetails(prev => ({ ...prev, [memberId]: true }));
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${memberId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMemberDetails(prev => ({ ...prev, [memberId]: data }));
      }
    } catch (error) {
      console.error(`Error fetching details for member ${memberId}:`, error);
    } finally {
      setLoadingDetails(prev => ({ ...prev, [memberId]: false }));
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    try {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age > 0 ? age : "N/A";
    } catch (e) {
      return "N/A";
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const applyFilters = () => {
    let filtered = [...interactionData];

    if (filters.memberId) {
      filtered = filtered.filter(item => 
        item.member?.member_id?.toString().includes(filters.memberId)
      );
    }

    if (filters.name) {
      filtered = filtered.filter(item => 
        item.member?.name?.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.city) {
      filtered = filtered.filter(item => 
        item.member?.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.profession) {
      filtered = filtered.filter(item => 
        item.member?.profession?.toLowerCase().includes(filters.profession.toLowerCase())
      );
    }

    if (filters.sect) {
      filtered = filtered.filter(item => 
        item.member?.sect_school_info?.toLowerCase().includes(filters.sect.toLowerCase())
      );
    }

    if (filters.maritalStatus) {
      filtered = filtered.filter(item => 
        item.member?.martial_status?.toLowerCase().includes(filters.maritalStatus.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(item => 
        item.interaction_summary?.total_interactions?.toString().includes(filters.status)
      );
    }

    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.member?.created_at);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      memberId: '',
      name: '',
      city: '',
      profession: '',
      sect: '',
      maritalStatus: '',
      status: '',
      startDate: '',
      endDate: ''
    });
    setFilteredData(interactionData);
    setCurrentPage(1);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, interactionData]);

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get unique values for filter dropdowns
  const uniqueCities = [...new Set(interactionData.map(item => item.member?.city).filter(Boolean))];
  const uniqueProfessions = [...new Set(interactionData.map(item => item.member?.profession).filter(Boolean))];
  const uniqueSects = [...new Set(interactionData.map(item => item.member?.sect_school_info).filter(Boolean))];
  const uniqueMaritalStatuses = [...new Set(interactionData.map(item => item.member?.martial_status).filter(Boolean))];
  const uniqueStatuses = [...new Set(interactionData.map(item => item.interaction_summary?.total_interactions).filter(Boolean))];

  return (
    <DashboardLayout>
      <div className="total-interaction-agent-container">
        <div className="interaction-header">
          <h2>Total Interactions</h2>
          <p className="subtitle">Manage all member interactions</p>
        </div>

        {/* Filters Section */}
        <div className="filter-container">
          <button className="filter-button">
            <AiOutlineFilter className="icon" /> Filter By
          </button>
          
          <input
            className="filter-input"
            type="text"
            value={filters.memberId}
            onChange={(e) => handleFilterChange('memberId', e.target.value)}
            placeholder="Member ID"
          />

          <input
            className="filter-input"
            type="text"
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            placeholder="Name"
          />

          <select
            className="filter-select"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
          >
            <option value="">All Cities</option>
            {uniqueCities.map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.profession}
            onChange={(e) => handleFilterChange('profession', e.target.value)}
          >
            <option value="">All Professions</option>
            {uniqueProfessions.map((profession, index) => (
              <option key={index} value={profession}>{profession}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.sect}
            onChange={(e) => handleFilterChange('sect', e.target.value)}
          >
            <option value="">All Sects</option>
            {uniqueSects.map((sect, index) => (
              <option key={index} value={sect}>{sect}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.maritalStatus}
            onChange={(e) => handleFilterChange('maritalStatus', e.target.value)}
          >
            <option value="">All Marital Status</option>
            {uniqueMaritalStatuses.map((status, index) => (
              <option key={index} value={status}>{status}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            {uniqueStatuses.map((status, index) => (
              <option key={index} value={status}>{status}</option>
            ))}
          </select>

          <input
            className="filter-input"
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            placeholder="Start Date"
          />

          <input
            className="filter-input"
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            placeholder="End Date"
          />

          <button type="button" className="reset-filter" onClick={clearFilters}>
            <AiOutlineRedo className="icon" /> Reset Filter
          </button>
        </div>

        {/* Content */}
        <div className="interaction-content">
          {loading && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading interactions...</p>
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
              <p>Failed to load interaction data. Please try again.</p>
            </div>
          )}

          {!loading && !error && filteredData.length === 0 && (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" strokeWidth="2"/>
              </svg>
              <h3>No Interactions Found</h3>
              <p>No interactions match your current filters</p>
            </div>
          )}

          {!loading && !error && filteredData.length > 0 && (
            <>
              <table className="interactions-table">
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
                    <th>Total Interactions</th>
                    <th>Sent</th>
                    <th>Received</th>
                    <th>Last Activity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => {
                    const memberId = item.member?.id;
                    const details = memberDetails[memberId];
                    const isLoadingDetail = loadingDetails[memberId];
                    
                    // Fetch member details if not already loaded
                    if (memberId && !details && !isLoadingDetail) {
                      fetchMemberDetails(memberId);
                    }
                    
                    // Get last activity date from interactions
                    const lastActivity = item.sent_interactions?.length > 0 || item.received_interactions?.length > 0
                      ? Math.max(
                          ...(item.sent_interactions?.map(i => new Date(i.last_message_time).getTime()) || []),
                          ...(item.received_interactions?.map(i => new Date(i.last_message_time).getTime()) || [])
                        )
                      : null;
                    
                    return (
                      <tr key={item.member?.id || index} className="table-row">
                      <td>
                        <span className="tia-member-id-badge">
                          {item.member?.member_id || "N/A"}
                        </span>
                      </td>
                      <td>
                        <div className="tia-member-photo-cell">
                          <div className="tia-member-avatar">
                            <img
                              src={getProfileImageUrl(details?.profile_photo || item.member?.profile_photo)}
                              alt={item.member?.name || "Member"}
                              className="tia-avatar-img"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/50";
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="tia-simple-member-name">
                          {item.member?.name || "N/A"}
                        </span>
                      </td>
                        <td>
                          {isLoadingDetail ? (
                            <span className="tia-loading-text">Loading...</span>
                          ) : (
                            calculateAge(details?.dob)
                          )}
                        </td>
                        <td>
                          <span className={`tia-marital-badge ${details?.martial_status ? details?.martial_status?.toLowerCase()?.replace(" ", "-") : "not-mentioned"}`}>
                            {details?.martial_status || "Not mentioned"}
                          </span>
                        </td>
                        <td>
                          {isLoadingDetail ? (
                            <span className="tia-loading-text">Loading...</span>
                          ) : (
                            details?.profession || "N/A"
                          )}
                        </td>
                        <td>
                          {isLoadingDetail ? (
                            <span className="tia-loading-text">Loading...</span>
                          ) : (
                            details?.sect_school_info || "N/A"
                          )}
                        </td>
                        <td>{item.member?.city || "N/A"}</td>
                        <td>
                          <span className="tia-interaction-count tia-total">
                            {item.interaction_summary?.total_interactions || 0}
                          </span>
                        </td>
                        <td>
                          <span className="tia-interaction-count tia-sent">
                            {item.interaction_summary?.sent_count || 0}
                          </span>
                        </td>
                        <td>
                          <span className="tia-interaction-count tia-received">
                            {item.interaction_summary?.received_count || 0}
                          </span>
                        </td>
                        <td>
                          {lastActivity ? formatDate(new Date(lastActivity).toISOString()) : "N/A"}
                        </td>
                        <td>
                          <div className="tia-table-actions">
                            <button
                              className="tia-action-btn tia-view-btn tia-modern-btn"
                              onClick={() => handleViewUserDetails(item.member)}
                              title="View User Details"
                            >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className="pagination-btn" 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                  >
                    &laquo; Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button 
                    className="pagination-btn" 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                  >
                    Next &raquo;
                  </button>
                </div>
              )}
            </>
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
                <h3>Total Interactions</h3>
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
                </div>

                {selectedUser?.bio && (
                  <div className="user-bio-section">
                    <h4>About</h4>
                    <p className="user-bio">{selectedUser.bio}</p>
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

export default TotalInteractionAgent;
