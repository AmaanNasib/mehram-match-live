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
      url: `/api/agent/interactions/`,
      setterFunction: (data) => {
        console.log('Agent interaction data received:', data);
        setInteractionData(data || []);
        setFilteredData(data || []);
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
        item.action_on?.member_id?.toString().includes(filters.memberId)
      );
    }

    if (filters.name) {
      filtered = filtered.filter(item => 
        item.action_on?.name?.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.city) {
      filtered = filtered.filter(item => 
        item.action_on?.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.profession) {
      filtered = filtered.filter(item => 
        item.action_on?.profession?.toLowerCase().includes(filters.profession.toLowerCase())
      );
    }

    if (filters.sect) {
      filtered = filtered.filter(item => 
        item.action_on?.sect_school_info?.toLowerCase().includes(filters.sect.toLowerCase())
      );
    }

    if (filters.maritalStatus) {
      filtered = filtered.filter(item => 
        item.action_on?.martial_status?.toLowerCase().includes(filters.maritalStatus.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(item => 
        item.interaction_type?.toLowerCase().includes(filters.status.toLowerCase())
      );
    }

    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.created_at);
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
  const uniqueCities = [...new Set(interactionData.map(item => item.action_on?.city).filter(Boolean))];
  const uniqueProfessions = [...new Set(interactionData.map(item => item.action_on?.profession).filter(Boolean))];
  const uniqueSects = [...new Set(interactionData.map(item => item.action_on?.sect_school_info).filter(Boolean))];
  const uniqueMaritalStatuses = [...new Set(interactionData.map(item => item.action_on?.martial_status).filter(Boolean))];
  const uniqueStatuses = [...new Set(interactionData.map(item => item.interaction_type).filter(Boolean))];

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
                    <th>Interaction Type</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
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
                      <td>
                        <span className={`interaction-badge ${item.interaction_type?.toLowerCase()}`}>
                          {item.interaction_type || "N/A"}
                        </span>
                      </td>
                      <td>{formatDate(item.created_at)}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="action-btn view-btn modern-btn"
                            onClick={() => handleViewUserDetails(item.action_on)}
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
                  ))}
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
