import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import { fetchDataWithTokenV2 } from "../../../apiUtils";
import { AiOutlineFilter, AiOutlineRedo } from "react-icons/ai";
import './TotalShortlistAgent.css';
import '../../../shared-styles.css';

const TotalShortlistAgent = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('impersonating_user_id') || localStorage.getItem("userId");
  const [shortlistData, setShortlistData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({
    id: '',
    name: '',
    city: '',
    sectSchoolInfo: '',
    profession: '',
    martialStatus: '',
    gender: '',
  });

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

  // Handle navigation to member profile
  const handleMemberProfileClick = (userId) => {
    if (userId) {
      navigate(`/details/${userId}`);
    }
  };

  const handleRemoveFromShortlist = async (item) => {
    if (window.confirm(`Are you sure you want to unshortlist ${item.action_on?.name || 'this user'}?`)) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/agent/shortlist/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action_on_id: item.action_on?.id,
            shortlisted: false
          })
        });

        if (response.ok) {
          // Remove from local state
          setShortlistData(prev => prev.filter(shortlistItem => shortlistItem.id !== item.id));
          setFilteredData(prev => prev.filter(shortlistItem => shortlistItem.id !== item.id));
          alert('User unshortlisted successfully');
        } else {
          alert('Failed to unshortlist user');
        }
      } catch (error) {
        console.error('Error unshortlisting user:', error);
        alert('Error unshortlisting user');
      }
    }
  };

  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

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
    const filteredResults = shortlistData.filter((item) => {
      const user = item.action_on || {};
      return (
        (updatedFilters.id ?
          updatedFilters.id.split(' ').every(word => {
            const w = String(word).toLowerCase();
            const idStr = user?.id != null ? String(user.id) : '';
            const mid = user?.member_id || '';
            const idMatch = idStr.toLowerCase().includes(w);
            const memberIdMatch = mid.toLowerCase().includes(w);
            return idMatch || memberIdMatch;
          }) : true) &&
        (updatedFilters.name
          ? user?.name?.toLowerCase().includes(updatedFilters.name.toLowerCase())
          : true) &&
        (updatedFilters.city
          ? (() => {
            const haystack = [
              user?.location,
              user?.city,
              user?.state,
              user?.country
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();
            const words = String(updatedFilters.city).trim().split(/\s+/);
            return words.every((w) => haystack.includes(w.toLowerCase()));
          })()
          : true) &&
        (updatedFilters.sectSchoolInfo
          ? user?.sect_school_info?.toLowerCase().includes(updatedFilters.sectSchoolInfo.toLowerCase())
          : true) &&
        (updatedFilters.profession
          ? user?.profession?.toLowerCase().includes(updatedFilters.profession.toLowerCase())
          : true) &&
        (updatedFilters.martialStatus
          ? user?.martial_status?.toLowerCase().includes(updatedFilters.martialStatus.toLowerCase())
          : true) &&
        (updatedFilters.gender
          ? user?.gender?.toLowerCase() === updatedFilters.gender.toLowerCase()
          : true)
      );
    });
    setFilteredData(filteredResults);
  };

  const handleSort = (column) => {
    let direction = 'asc';
    if (sortConfig.key === column && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: column, direction });
  };

  // Apply filters when shortlistData or filters change
  useEffect(() => {
    applyFilters(filters);
  }, [shortlistData]);

  // Sort functionality
  useEffect(() => {
    if (!sortConfig.key) {
      applyFilters(filters);
      return;
    }

    const sortedData = [...filteredData].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case 'member_id':
          aValue = a.action_on?.member_id || '';
          bValue = b.action_on?.member_id || '';
          break;
        case 'name':
          aValue = a.action_on?.name || '';
          bValue = b.action_on?.name || '';
          break;
        case 'age':
          aValue = parseInt(a.action_on?.age) || 0;
          bValue = parseInt(b.action_on?.age) || 0;
          break;
        case 'marital_status':
          aValue = a.action_on?.martial_status || '';
          bValue = b.action_on?.martial_status || '';
          break;
        case 'profession':
          aValue = a.action_on?.profession || '';
          bValue = b.action_on?.profession || '';
          break;
        case 'sect':
          aValue = a.action_on?.sect_school_info || '';
          bValue = b.action_on?.sect_school_info || '';
          break;
        case 'location':
          aValue = a.action_on?.city || '';
          bValue = b.action_on?.city || '';
          break;
        case 'shortlisted_date':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        default:
          return 0;
      }

      if (sortConfig.key === 'shortlisted_date') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Case-insensitive string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const aLower = aValue.toLowerCase();
        const bLower = bValue.toLowerCase();
        if (aLower < bLower) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aLower > bLower) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      }

      // Numeric or other comparison
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredData(sortedData);
  }, [sortConfig]);

  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  return (
    <DashboardLayout>
      <div className="total-shortlist-agent-container overflow-x-hidden">
        <div className="shortlist-header">
          <h2>Total Shortlist</h2>
          <p className="subtitle">Manage your shortlisted members</p>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading shortlist...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <line x1="15" y1="9" x2="9" y2="15" strokeWidth="2" />
              <line x1="9" y1="9" x2="15" y2="15" strokeWidth="2" />
            </svg>
            <h3>Error Loading Data</h3>
            <p>Failed to load shortlist data. Please try again.</p>
          </div>
        )}

        {!loading && !error && filteredData.length === 0 && (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" strokeWidth="2" />
            </svg>
            <h3>No Shortlisted Members</h3>
            <p>You haven't shortlisted any members yet</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stats Card */}
            <div className="shortlist-agent-stats-section">
              <div className="shortlist-agent-stat-card !w-full">
                <span className="shortlist-agent-stat-number">{filteredData.length}</span>
                <span className="shortlist-agent-stat-label">TOTAL SHORTLISTED USERS</span>
              </div>
            </div>

            {/* Filters Section */}
            <div className="shortlist-agent-filter-container">
              <button className="shortlist-agent-filter-button">
                <AiOutlineFilter className="icon" /> Filter
              </button>
              <input
                className="shortlist-agent-filter-dropdown"
                type="text"
                value={filters.id}
                onChange={(e) => handleFilterChange("id", e.target.value)}
                placeholder="Enter ID"
                style={{ width: "70px" }}
              />
              <input
                className="shortlist-agent-filter-dropdown"
                type="text"
                value={filters.name}
                onChange={(e) => handleFilterChange("name", e.target.value)}
                placeholder="Name"
                style={{ width: "100px" }}
              />
              <input
                className="shortlist-agent-filter-dropdown"
                type="text"
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                placeholder="Location"
                style={{ width: "100px" }}
              />
              <select
                className="shortlist-agent-filter-dropdown"
                value={filters.sectSchoolInfo}
                onChange={(e) => handleFilterChange('sectSchoolInfo', e.target.value)}
              >
                <option value="">Sect</option>
                <option value="Ahle Qur'an">Ahle Qur'an</option>
                <option value="Ahamadi">Ahamadi</option>
                <option value="Barelvi">Barelvi</option>
                <option value="Bohra">Bohra</option>
                <option value="Deobandi">Deobandi</option>
                <option value="Hanabali">Hanabali</option>
                <option value="Hanafi">Hanafi</option>
                <option value="Ibadi">Ibadi</option>
                <option value="Ismaili">Ismaili</option>
                <option value="Jamat e Islami">Jamat e Islami</option>
                <option value="Maliki">Maliki</option>
                <option value="Pathan">Pathan</option>
                <option value="Salafi">Salafi</option>
                <option value="Salafi/Ahle Hadees">Salafi/Ahle Hadees</option>
                <option value="Sayyid">Sayyid</option>
                <option value="Shafi">Shafi</option>
                <option value="Shia">Shia</option>
                <option value="Sunni">Sunni</option>
                <option value="Sufism">Sufism</option>
                <option value="Tableeghi Jama'at">Tableeghi Jama'at</option>
                <option value="Zahiri">Zahiri</option>
                <option value="Muslim">Muslim</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              <select
                className="shortlist-agent-filter-dropdown"
                value={filters.profession}
                onChange={(e) => handleFilterChange('profession', e.target.value)}
              >
                <option value="">Profession</option>
                <option value="accountant">Accountant</option>
                <option value="Acting Professional">Acting Professional</option>
                <option value="actor">Actor</option>
                <option value="administrator">Administrator</option>
                <option value="Advertising Professional">Advertising Professional</option>
                <option value="air_hostess">Air Hostess</option>
                <option value="airline_professional">Airline Professional</option>
                <option value="airforce">Airforce</option>
                <option value="architect">Architect</option>
                <option value="artist">Artist</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="audiologist">Audiologist</option>
                <option value="auditor">Auditor</option>
                <option value="Bank Officer">Bank Officer</option>
                <option value="Bank Staff">Bank Staff</option>
                <option value="beautician">Beautician</option>
                <option value="Biologist / Botanist">Biologist / Botanist</option>
                <option value="Business Person">Business Person</option>
                <option value="captain">Captain</option>
                <option value="CEO / CTO / President">CEO / CTO / President</option>
                <option value="chef">Chef</option>
                <option value="civil_servant">Civil Servant</option>
                <option value="clerk">Clerk</option>
                <option value="coach">Coach</option>
                <option value="consultant">Consultant</option>
                <option value="counselor">Counselor</option>
                <option value="dentist">Dentist</option>
                <option value="designer">Designer</option>
                <option value="doctor">Doctor</option>
                <option value="engineer">Engineer</option>
                <option value="entrepreneur">Entrepreneur</option>
                <option value="farmer">Farmer</option>
                <option value="fashion_designer">Fashion Designer</option>
                <option value="freelancer">Freelancer</option>
                <option value="government_employee">Government Employee</option>
                <option value="graphic_designer">Graphic Designer</option>
                <option value="homemaker">Homemaker</option>
                <option value="interior_designer">Interior Designer</option>
                <option value="journalist">Journalist</option>
                <option value="lawyer">Lawyer</option>
                <option value="manager">Manager</option>
                <option value="marketing_professional">Marketing Professional</option>
                <option value="nurse">Nurse</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="photographer">Photographer</option>
                <option value="pilot">Pilot</option>
                <option value="police">Police</option>
                <option value="professor">Professor</option>
                <option value="psychologist">Psychologist</option>
                <option value="researcher">Researcher</option>
                <option value="sales_executive">Sales Executive</option>
                <option value="scientist">Scientist</option>
                <option value="social_worker">Social Worker</option>
                <option value="software_consultant">Software Consultant</option>
                <option value="sportsman">Sportsman</option>
                <option value="teacher">Teacher</option>
                <option value="technician">Technician</option>
                <option value="therapist">Therapist</option>
                <option value="veterinarian">Veterinarian</option>
                <option value="writer">Writer</option>
                <option value="other">Other</option>
              </select>
              <select
                className="shortlist-agent-filter-dropdown"
                value={filters.martialStatus}
                onChange={(e) => handleFilterChange('martialStatus', e.target.value)}
              >
                <option value="">Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Khula">Khula</option>
                <option value="Widowed">Widowed</option>
              </select>
              <select
                className="shortlist-agent-filter-dropdown"
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <button
                type="button"
                className="shortlist-agent-reset-filter"
                onClick={onClearFilterClick}
              >
                <AiOutlineRedo className="icon" /> Reset
              </button>
            </div>
          </>
        )}

        {!loading && !error && filteredData.length > 0 && (
          <div class="w-full overflow-x-auto">

            <table className="interest-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('member_id')} className="sortable-header">
                    MEMBER ID
                    {sortConfig.key === 'member_id' && (
                      <span className="sort-indicator">
                        {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => handleSort('name')} className="sortable-header">
                    Photo
                    {sortConfig.key === 'name' && (
                      <span className="sort-indicator">
                        {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => handleSort('name')} className="sortable-header">
                    Name
                    {sortConfig.key === 'name' && (
                      <span className="sort-indicator">
                        {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => handleSort('location')} className="sortable-header">
                    Location
                    {sortConfig.key === 'location' && (
                      <span className="sort-indicator">
                        {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => handleSort('shortlisted_date')} className="sortable-header">
                    Date
                    {sortConfig.key === 'shortlisted_date' && (
                      <span className="sort-indicator">
                        {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => handleSort('sect')} className="sortable-header">
                    Sect
                    {sortConfig.key === 'sect' && (
                      <span className="sort-indicator">
                        {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => handleSort('profession')} className="sortable-header">
                    Profession
                    {sortConfig.key === 'profession' && (
                      <span className="sort-indicator">
                        {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => handleSort('marital_status')} className="sortable-header">
                    Marital Status
                    {sortConfig.key === 'marital_status' && (
                      <span className="sort-indicator">
                        {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.id || index} style={{ cursor: "pointer" }} onClick={() => handleViewUserDetails(item.action_on)}>
                    <td>{item.action_on?.member_id || "N/A"}</td>
                    <td>
                      <img
                        src={getProfileImageUrl(item.action_on?.profile_photo)}
                        alt={item.action_on?.name || "Member"}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "2px solid #e0e0e0",
                          cursor: "pointer"
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMemberProfileClick(item.action_on?.id);
                        }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/50";
                        }}
                      />
                    </td>
                    <td>
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMemberProfileClick(item.action_on?.id);
                        }}
                      >
                        {item.action_on?.name || "N/A"}
                      </span>
                    </td>
                    <td>{item.action_on?.city || "N/A"}</td>
                    <td>{formatDate(item.created_at)}</td>
                    <td>{item.action_on?.sect_school_info || "N/A"}</td>
                    <td>{item.action_on?.profession || "N/A"}</td>
                    <td>
                      <span className={`mm-marital-badge ${item.action_on?.martial_status ? item.action_on?.martial_status?.toLowerCase()?.replace(" ", "-") : "not-mentioned"}`}>
                        {item.action_on?.martial_status || "Not mentioned"}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        className="action-btn remove-btn modern-btn"
                        onClick={() => handleRemoveFromShortlist(item)}
                        title="Remove from shortlist"
                        style={{
                          width: "32px",
                          height: "32px",
                          minWidth: "32px",
                          maxWidth: "32px",
                          minHeight: "32px",
                          maxHeight: "32px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0"
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
