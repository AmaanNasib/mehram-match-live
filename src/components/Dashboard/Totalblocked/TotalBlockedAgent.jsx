import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import { fetchDataWithTokenV2 } from "../../../apiUtils";
import { AiOutlineReload, AiOutlineFilter, AiOutlineRedo } from "react-icons/ai";
import "./TotalBlockedAgent.css";
import "../../../shared-styles.css";

const TotalBlockedAgent = () => {
  const navigate = useNavigate();
  const [matchDetails, setMatchDetails] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showUnblockModal, setShowUnblockModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({
    id: '',
    name: '',
    city: '',
    sectSchoolInfo: '',
    profession: '',
    martialStatus: '',
    gender: '',
  });
  const userId = localStorage.getItem('impersonating_user_id') || localStorage.getItem('userId');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (userId) {
      const parameter = {
        url: `/api/agent/blocked/users/`,
        setterFunction: (data) => {
          console.log('Blocked users data:', data);
          // Combine agent_direct_blocks and member_blocks arrays with block type
          const directBlocks = (data?.agent_direct_blocks || []).map(block => ({
            ...block,
            block_type: 'direct'
          }));
          const memberBlocks = (data?.member_blocks || []).map(block => ({
            ...block,
            block_type: 'member'
          }));
          const allBlockedUsers = [...directBlocks, ...memberBlocks];
          setMatchDetails({ 
            blocked_users: allBlockedUsers,
            total_direct_blocks: data?.total_direct_blocks || 0,
            total_member_blocks: data?.total_member_blocks || 0,
            total_blocked_users: data?.total_blocked_users || 0
          });
        },
        setLoading: setLoading,
        setErrors: setErrors
      };
      fetchDataWithTokenV2(parameter);
    }
  }, [userId]);

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
    const filteredResults = (matchDetails?.blocked_users || []).filter((item) => {
      const user = item.user || {};
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
    setFilteredItems(filteredResults);
  };

  useEffect(() => {
    applyFilters(filters);
  }, [matchDetails]);

  // Sort functionality
  useEffect(() => {
    if (!sortConfig.key) return;

    const sortedData = [...filteredItems].sort((a, b) => {
      let aValue, bValue;

      // Handle different sort keys
      switch (sortConfig.key) {
        case 'member_id':
          aValue = a?.user?.member_id || a?.member_id || '';
          bValue = b?.user?.member_id || b?.member_id || '';
          break;
        case 'name':
          aValue = a?.user?.name || '';
          bValue = b?.user?.name || '';
          break;
        case 'age':
          aValue = parseInt(a?.user?.age) || 0;
          bValue = parseInt(b?.user?.age) || 0;
          break;
        case 'city':
          aValue = a?.user?.city || a?.user?.location || '';
          bValue = b?.user?.city || b?.user?.location || '';
          break;
        case 'sect':
          aValue = a?.user?.sect || a?.user?.sect_school_info || '';
          bValue = b?.user?.sect || b?.user?.sect_school_info || '';
          break;
        case 'profession':
          aValue = a?.user?.profession || '';
          bValue = b?.user?.profession || '';
          break;
        case 'martial_status':
          aValue = a?.user?.martial_status || '';
          bValue = b?.user?.martial_status || '';
          break;
        case 'date':
          aValue = a.date;
          bValue = b.date;
          break;
        default:
          aValue = a?.user?.[sortConfig.key] || '';
          bValue = b?.user?.[sortConfig.key] || '';
      }

      // Handle date sorting
      if (sortConfig.key === 'date') {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }

      // Handle numeric sorting (age)
      if (sortConfig.key === 'age') {
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
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

      // Fallback comparison
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredItems(sortedData);
  }, [sortConfig]);

  const handleSort = (column) => {
    let direction = 'asc';
    if (sortConfig.key === column && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: column, direction });
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems?.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const refreshData = () => {
    if (userId) {
      const parameter = {
        url: `/api/agent/blocked/users/`,
        setterFunction: (data) => {
          console.log('Refreshed blocked users data:', data);
          // Combine agent_direct_blocks and member_blocks arrays with block type
          const directBlocks = (data?.agent_direct_blocks || []).map(block => ({
            ...block,
            block_type: 'direct'
          }));
          const memberBlocks = (data?.member_blocks || []).map(block => ({
            ...block,
            block_type: 'member'
          }));
          const allBlockedUsers = [...directBlocks, ...memberBlocks];
          setMatchDetails({ 
            blocked_users: allBlockedUsers,
            total_direct_blocks: data?.total_direct_blocks || 0,
            total_member_blocks: data?.total_member_blocks || 0,
            total_blocked_users: data?.total_blocked_users || 0
          });
        },
        setLoading: setLoading,
        setErrors: setErrors
      };
      fetchDataWithTokenV2(parameter);
    }
  };

  const handleUnblockClick = (user) => {
    setSelectedUser(user);
    setShowUnblockModal(true);
  };

  const handleUnblockConfirm = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/agent/unblock/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          action_on_id: selectedUser?.user?.id || selectedUser?.id
        })
      });

      if (response.ok) {
        setShowUnblockModal(false);
        setSelectedUser(null);
        refreshData(); // Refresh the data
      } else {
        alert('Failed to unblock user. Please try again.');
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      alert('An error occurred while unblocking the user.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnblockCancel = () => {
    setShowUnblockModal(false);
    setSelectedUser(null);
  };

  const handleViewProfile = (user) => {
    const userId = user?.user?.id || user?.id;
    if (userId) {
      // Navigate to user profile details page
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="tba-container">
        <div className="tba-page-header">
          <h1 className="tba-page-title">Blocked Users List</h1>
          <div className="tba-header-actions">
            <button
              className="tba-refresh-btn"
              onClick={refreshData}
              title="Refresh"
            >
              <AiOutlineReload />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="tba-stats-container">
          <div className="tba-stat-card">
            <div className="tba-stat-number">{matchDetails?.total_blocked_users || 0}</div>
            <div className="tba-stat-label">Total Blocked Users</div>
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

        {/* Search Bar */}
        <div className="tba-search-container">
          <input
            type="text"
            placeholder="Search by name, ID, location, profession..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="tba-search-input"
          />
        </div>

        {/* Table */}
        <div className="tba-table-container">
          <table className="tba-data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('member_id')} className="tba-sortable-header">
                  Member ID
                  {sortConfig.key === 'member_id' && (
                    <span className="tba-sort-indicator">{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('name')} className="tba-sortable-header">
                  Photo
                  {sortConfig.key === 'name' && (
                    <span className="tba-sort-indicator">{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('name')} className="tba-sortable-header">
                  Name
                  {sortConfig.key === 'name' && (
                    <span className="tba-sort-indicator">{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('age')} className="tba-sortable-header">
                  Age
                  {sortConfig.key === 'age' && (
                    <span className="tba-sort-indicator">{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('city')} className="tba-sortable-header">
                  Location
                  {sortConfig.key === 'city' && (
                    <span className="tba-sort-indicator">{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('sect')} className="tba-sortable-header">
                  Sect
                  {sortConfig.key === 'sect' && (
                    <span className="tba-sort-indicator">{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('profession')} className="tba-sortable-header">
                  Profession
                  {sortConfig.key === 'profession' && (
                    <span className="tba-sort-indicator">{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('martial_status')} className="tba-sortable-header">
                  Marital Status
                  {sortConfig.key === 'martial_status' && (
                    <span className="tba-sort-indicator">{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="tba-loading-spinner">Loading...</div>
                  </td>
                </tr>
              ) : currentItems?.length > 0 ? (
                currentItems.map((match, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: 'center' }}>{match?.user?.member_id || match?.member_id || "N/A"}</td>
                    <td style={{ textAlign: 'center' }}>
                      {match?.user?.profile_photo ? (
                        <img
                          src={`${process.env.REACT_APP_API_URL}${match.user.profile_photo}`}
                          alt={match?.user?.name}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          backgroundColor: '#e5e7eb',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          color: '#6b7280',
                          margin: '0 auto'
                        }}>
                          {match?.user?.name?.[0] || 'N'}
                        </div>
                      )}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: '500' }}>
                      {match?.user?.name || "N/A"}
                    </td>
                    <td style={{ textAlign: 'center' }}>{match?.user?.age || "N/A"}</td>
                    <td style={{ textAlign: 'center' }}>{match?.user?.city || match?.user?.location || "N/A"}</td>
                    <td style={{ textAlign: 'center' }}>{match?.user?.sect || match?.user?.sect_school_info || "N/A"}</td>
                    <td style={{ textAlign: 'center' }}>{match?.user?.profession || "N/A"}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`mm-marital-badge ${match?.user?.martial_status ? match?.user?.martial_status?.toLowerCase()?.replace(" ", "-") : "not-mentioned"}`}>
                        {match?.user?.martial_status || "Not mentioned"}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="tba-action-buttons">
                        <button 
                          className="tba-action-btn tba-unblock-btn"
                          onClick={() => handleUnblockClick(match)}
                          title="Unblock User"
                        >
                          Unblock
                        </button>
                        <button 
                          className="tba-action-btn tba-view-btn"
                          onClick={() => handleViewProfile(match)}
                          title="View Profile"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                    No blocked users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="tba-pagination">
            <button
              className="tba-pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo; Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`tba-pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="tba-pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next &raquo;
            </button>
          </div>
        )}

        {/* Unblock Confirmation Modal */}
        {showUnblockModal && (
          <div className="tba-modal-overlay">
            <div className="tba-modal-content">
              <div className="tba-modal-header">
                <h3>Confirm Unblock</h3>
              </div>
              <div className="tba-modal-body">
                <p>
                  Are you sure you want to unblock <strong>{selectedUser?.user?.name || 'this user'}</strong>?
                </p>
                <p className="tba-modal-warning">
                  This action will allow the user to interact with your members again.
                </p>
              </div>
              <div className="tba-modal-footer">
                <button 
                  className="tba-modal-btn tba-cancel-btn"
                  onClick={handleUnblockCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  className="tba-modal-btn tba-confirm-btn"
                  onClick={handleUnblockConfirm}
                  disabled={loading}
                >
                  {loading ? 'Unblocking...' : 'Yes, Unblock'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default TotalBlockedAgent;
