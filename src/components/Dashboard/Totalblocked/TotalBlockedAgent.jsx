import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import { fetchDataWithTokenV2 } from "../../../apiUtils";
import { AiOutlineReload } from "react-icons/ai";
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

  useEffect(() => {
    setFilteredItems(matchDetails?.blocked_users || []);
  }, [matchDetails]);

  // Search functionality
  useEffect(() => {
    if (!searchQuery) {
      setFilteredItems(matchDetails?.blocked_users || []);
      return;
    }

    const filtered = (matchDetails?.blocked_users || []).filter(match => {
      const searchLower = searchQuery.toLowerCase();
      return (
        match?.user?.name?.toLowerCase().includes(searchLower) ||
        match?.user?.member_id?.toLowerCase().includes(searchLower) ||
        match?.user?.city?.toLowerCase().includes(searchLower) ||
        match?.user?.profession?.toLowerCase().includes(searchLower) ||
        match?.user?.sect?.toLowerCase().includes(searchLower) ||
        match?.user?.martial_status?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredItems(filtered);
  }, [searchQuery, matchDetails]);

  // Sort functionality
  useEffect(() => {
    if (!sortConfig.key) return;

    const sortedData = [...filteredItems].sort((a, b) => {
      const aValue = sortConfig.key === 'date' ? a.date : a?.user?.[sortConfig.key];
      const bValue = sortConfig.key === 'date' ? b.date : b?.user?.[sortConfig.key];

      if (sortConfig.key === 'date') {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }

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
                <th onClick={() => handleSort('member_id')}>
                  Member ID
                  {sortConfig.key === 'member_id' && (
                    <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th>Photo</th>
                <th onClick={() => handleSort('name')}>
                  Name
                  {sortConfig.key === 'name' && (
                    <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('age')}>
                  Age
                  {sortConfig.key === 'age' && (
                    <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('city')}>
                  Location
                  {sortConfig.key === 'city' && (
                    <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('sect')}>
                  Sect
                  {sortConfig.key === 'sect' && (
                    <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('profession')}>
                  Profession
                  {sortConfig.key === 'profession' && (
                    <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
                <th onClick={() => handleSort('martial_status')}>
                  Marital Status
                  {sortConfig.key === 'martial_status' && (
                    <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
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
