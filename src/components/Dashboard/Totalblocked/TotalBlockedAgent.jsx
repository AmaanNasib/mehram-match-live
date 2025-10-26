import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import { fetchDataWithTokenV2 } from "../../../apiUtils";
import { AiOutlineReload } from "react-icons/ai";
import "./TotalBlockedAgent.css";

const TotalBlockedAgent = () => {
  const navigate = useNavigate();
  const [matchDetails, setMatchDetails] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
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

  const handleUnblock = async (user) => {
    if (window.confirm(`Are you sure you want to unblock ${user?.user?.name || 'this user'}?`)) {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/agent/unblock/user/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            user_id: user?.user?.id || user?.id
          })
        });

        if (response.ok) {
          alert('User unblocked successfully!');
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
    }
  };

  const handleViewProfile = (user) => {
    const userId = user?.user?.id || user?.id;
    if (userId) {
      navigate(`/dashboard/member-profile/${userId}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="total-interest-container">
        <div className="page-header">
          <h1 className="page-title">Blocked Users List</h1>
          <div className="header-actions">
            <button
              className="refresh-btn"
              onClick={refreshData}
              title="Refresh"
            >
              <AiOutlineReload />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">{matchDetails?.total_blocked_users || 0}</div>
            <div className="stat-label">Total Blocked Users</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name, ID, location, profession..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="data-table">
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
                    <div className="loading-spinner">Loading...</div>
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
                      <span className={`marital-badge ${match?.user?.martial_status ? match?.user?.martial_status?.toLowerCase()?.replace(" ", "-") : "not-mentioned"}`}>
                        {match?.user?.martial_status || "Not mentioned"}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="action-buttons">
                        <button 
                          className="action-btn unblock-btn"
                          onClick={() => handleUnblock(match)}
                          title="Unblock User"
                        >
                          Unblock
                        </button>
                        <button 
                          className="action-btn view-btn"
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

      </div>
    </DashboardLayout>
  );
};

export default TotalBlockedAgent;
