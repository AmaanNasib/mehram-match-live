import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import MemberCommonTable from "./MemberCommonTable/MemberCommonTable";
import './Member_Interest.css';

const Member_Interest = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('impersonating_user_id') || localStorage.getItem("userId");
  const [tabActive, setTabActive] = useState("sent"); // 'sent' or 'received'
  const [sentInterests, setSentInterests] = useState([]);
  const [receivedInterests, setReceivedInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Fetch all member interests for the agent
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
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            // Unauthorized - redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
            return { member: [] };
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const members = data.member || [];
        
        // Step 2: Fetch interests for each member
        if (members.length > 0) {
          const fetchPromises = members.map(member => {
            return fetch(`${process.env.REACT_APP_API_URL}/api/agent/member/interests/?member_id=${member.id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            })
            .then(res => res.json())
            .then(interestsData => ({
              member: member,
              interests: interestsData
            }))
            .catch(err => {
              console.error(`Error fetching interests for member ${member.id}:`, err);
              return { member: member, interests: null };
            });
          });
          
          Promise.all(fetchPromises)
            .then(results => {
              const allSentInterests = [];
              const allReceivedInterests = [];
              
              results.forEach(result => {
                // Debug: Log member object structure to understand API response
                if (result.member && !result.member.member_id) {
                  console.log('Member object structure:', {
                    id: result.member.id,
                    member_id: result.member.member_id,
                    user: result.member.user,
                    user_member_id: result.member.user?.member_id,
                    all_keys: Object.keys(result.member)
                  });
                }
                
                if (result.interests) {
                  if (result.interests.sent_interests && result.interests.sent_interests.length > 0) {
                    allSentInterests.push(...result.interests.sent_interests.map(interest => {
                      // Extract member_id from multiple possible locations
                      let memberId = result.member?.member_id || 
                                    result.member?.user?.member_id ||
                                    result.member?.user_id?.member_id;
                      
                      // If member_id is not found, generate one in MM2025XXX format
                      if (!memberId && result.member?.id) {
                        const currentYear = new Date().getFullYear();
                        const memberIdNumber = String(result.member.id).padStart(3, '0');
                        memberId = `MM${currentYear}${memberIdNumber}`;
                      } else if (!memberId) {
                        memberId = result.member?.id || "N/A";
                      }
                      
                      return {
                      ...interest,
                      interest_id: interest.interest_id,
                      member_name: result.member.name || result.member.first_name || "N/A",
                      // Use member_id field (MM2025018 format) - check multiple possible locations
                      member_id: memberId,
                      // Store numeric id for navigation
                      member_numeric_id: result.member?.id || null,
                      // Extract member photo properly - handle both object and string formats
                      member_photo: result.member?.profile_photo?.upload_photo || 
                                  result.member?.user_profilephoto?.upload_photo ||
                                  result.member?.profile_photo ||
                                  result.member?.profile_image ||
                                  result.member?.avatar ||
                                  result.member?.photo ||
                                  result.member?.image ||
                                  null,
                      // Recipient details from interest.user (the person who received the interest)
                      recipient_name: interest.user?.name || interest.user?.first_name || interest.user?.username || "N/A",
                      // Use member_id field (MM2025018 format) if available, otherwise fallback to id
                      recipient_id: interest.user?.member_id || interest.user?.id || "N/A",
                      // Store numeric id for navigation
                      recipient_numeric_id: interest.user?.id || null,
                      // Extract recipient photo properly - handle both object and string formats
                      recipient_photo: interest.user?.profile_photo?.upload_photo ||
                                     interest.user?.user_profilephoto?.upload_photo ||
                                     interest.user?.profile_photo ||
                                     interest.user?.upload_photo ||
                                     interest.user?.profile_image ||
                                     interest.user?.avatar ||
                                     interest.user?.photo ||
                                     interest.user?.image ||
                                     null,
                      // Add target_user_id for withdraw API
                      target_user_id: interest.user?.id || null,
                      // Add status if available, default to 'Pending'
                      status: interest.status || 'Pending'
                      };
                    }));
                  }
                  if (result.interests.received_interests && result.interests.received_interests.length > 0) {
                    allReceivedInterests.push(...result.interests.received_interests.map(interest => {
                      // Extract member_id from multiple possible locations
                      let memberId = result.member?.member_id || 
                                    result.member?.user?.member_id ||
                                    result.member?.user_id?.member_id;
                      
                      // If member_id is not found, generate one in MM2025XXX format
                      if (!memberId && result.member?.id) {
                        const currentYear = new Date().getFullYear();
                        const memberIdNumber = String(result.member.id).padStart(3, '0');
                        memberId = `MM${currentYear}${memberIdNumber}`;
                      } else if (!memberId) {
                        memberId = result.member?.id || "N/A";
                      }
                      
                      return {
                      ...interest,
                      interest_id: interest.interest_id,
                      member_name: result.member.name || result.member.first_name || "N/A",
                      // Use member_id field (MM2025018 format) - check multiple possible locations
                      member_id: memberId,
                      // Store numeric id for navigation
                      member_numeric_id: result.member?.id || null,
                      // Extract member photo properly - handle both object and string formats
                      member_photo: result.member?.profile_photo?.upload_photo || 
                                  result.member?.user_profilephoto?.upload_photo ||
                                  result.member?.profile_photo ||
                                  result.member?.profile_image ||
                                  result.member?.avatar ||
                                  result.member?.photo ||
                                  result.member?.image ||
                                  null,
                      // Sender details from interest.user (the person who sent the interest)
                      sender_name: interest.user?.name || interest.user?.first_name || interest.user?.username || "N/A",
                      // Use member_id field (MM2025018 format) if available, otherwise fallback to id
                      sender_id: interest.user?.member_id || interest.user?.id || "N/A",
                      // Store numeric id for navigation
                      sender_numeric_id: interest.user?.id || null,
                      // Extract sender photo properly - handle both object and string formats
                      sender_photo: interest.user?.profile_photo?.upload_photo ||
                                   interest.user?.user_profilephoto?.upload_photo ||
                                   interest.user?.profile_photo ||
                                   interest.user?.upload_photo ||
                                   interest.user?.profile_image ||
                                   interest.user?.avatar ||
                                   interest.user?.photo ||
                                   interest.user?.image ||
                                   null,
                      // Add status if available, default to 'Pending'
                      status: interest.status || 'Pending'
                      };
                    }));
                  }
                }
              });
              
              setSentInterests(allSentInterests);
              setReceivedInterests(allReceivedInterests);
              setLoading(false);
            })
            .catch(err => {
              console.error('Error processing interests:', err);
              setLoading(false);
              setError(true);
            });
        } else {
          setSentInterests([]);
          setReceivedInterests([]);
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
    // Handle null, undefined, or empty values
    if (!photoUrl) {
      return "https://via.placeholder.com/60";
    }
    
    // If photoUrl is already a full URL (starts with http), return as is
    if (typeof photoUrl === 'string' && (photoUrl.startsWith('http://') || photoUrl.startsWith('https://'))) {
      return photoUrl;
    }
    
    // If photoUrl is an object, try to extract the actual photo path
    if (typeof photoUrl === 'object') {
      const extractedUrl = photoUrl?.upload_photo || 
                          photoUrl?.photo || 
                          photoUrl?.image ||
                          photoUrl?.profile_image ||
                          photoUrl?.avatar;
      if (extractedUrl) {
        // If extracted URL is already full URL, return as is
        if (typeof extractedUrl === 'string' && (extractedUrl.startsWith('http://') || extractedUrl.startsWith('https://'))) {
          return extractedUrl;
        }
        // Otherwise prepend API URL
        return `${process.env.REACT_APP_API_URL}${extractedUrl}`;
      }
      return "https://via.placeholder.com/60";
    }
    
    // If photoUrl is a string (relative path), prepend API URL
    // Ensure it starts with / if it doesn't already
    const normalizedPath = photoUrl.startsWith('/') ? photoUrl : `/${photoUrl}`;
    return `${process.env.REACT_APP_API_URL}${normalizedPath}`;
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
  const handleMemberClick = (row, column) => {
    // Determine which numeric ID to use based on column
    let numericId = null;
    
    if (column.label === 'Sent By' || column.label === 'Received By') {
      // For member columns, use member_numeric_id
      numericId = row.member_numeric_id;
    } else if (column.label === 'Sent To') {
      // For recipient columns, use recipient_numeric_id
      numericId = row.recipient_numeric_id;
    } else if (column.label === 'Received From') {
      // For sender columns, use sender_numeric_id
      numericId = row.sender_numeric_id;
    }
    
    // Navigate to profile page if numeric ID is available
    if (numericId) {
      navigate(`/details/${numericId}`);
    }
  };

  // Handle withdraw interest
  const handleWithdrawInterest = async (rowData) => {
    if (!window.confirm('Are you sure you want to withdraw this interest?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/agent/member/withdraw-interest/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          member_id: parseInt(rowData.member_id),
          target_user_id: parseInt(rowData.target_user_id)
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('Interest withdrawn successfully');
        // Refresh the data
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Failed to withdraw interest: ${errorData.error || errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Error withdrawing interest: ' + error.message);
    }
  };

  // Handle accept interest
  const handleAcceptInterest = async (interestId, memberId) => {
    if (!window.confirm('Are you sure you want to accept this interest?')) {
      return;
    }

    try {
      console.log('Accepting interest with:', {
        member_id: memberId,
        interest_id: interestId,
        action: 'accept'
      });

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/agent/member/interest-action/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          member_id: parseInt(memberId),
          interest_id: parseInt(interestId),
          action: 'accept'
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('Interest accepted successfully');
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Failed to accept interest: ${errorData.error || errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Error accepting interest: ' + error.message);
    }
  };

  // Handle reject interest
  const handleRejectInterest = async (interestId, memberId) => {
    if (!window.confirm('Are you sure you want to reject this interest?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/agent/member/interest-action/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          member_id: parseInt(memberId),
          interest_id: parseInt(interestId),
          action: 'reject'
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('Interest rejected successfully');
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Failed to reject interest: ${errorData.error || errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert('Error rejecting interest: ' + error.message);
    }
  };

  // Handle sorting
  const handleSort = (columnKey) => {
    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  // Sort data function - case insensitive
  const getSortedData = (data) => {
    if (!sortConfig.key || !data || data.length === 0) {
      return data;
    }

    return [...data].sort((a, b) => {
      let aValue, bValue;

      // Get the value based on sort key
      switch (sortConfig.key) {
        case 'member_name':
          aValue = (a.member_name || '').toString().toLowerCase();
          bValue = (b.member_name || '').toString().toLowerCase();
          break;
        case 'recipient_name':
          aValue = (a.recipient_name || '').toString().toLowerCase();
          bValue = (b.recipient_name || '').toString().toLowerCase();
          break;
        case 'sender_name':
          aValue = (a.sender_name || '').toString().toLowerCase();
          bValue = (b.sender_name || '').toString().toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.created_at || 0);
          bValue = new Date(b.created_at || 0);
          if (sortConfig.direction === 'asc') {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        case 'status':
          aValue = (a.status || '').toString().toLowerCase();
          bValue = (b.status || '').toString().toLowerCase();
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
        default:
          return 0;
      }

      // For string comparisons (case insensitive)
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

  // Define columns for sent interests table
  const sentColumns = [
    {
      key: 'member-info',
      label: 'Sent By',
      photoKey: 'member_photo',
      nameKey: 'member_name',
      idKey: 'member_id',
      sortKey: 'member_name',
      sortable: true
    },
    {
      key: 'member-info',
      label: 'Sent To',
      photoKey: 'recipient_photo',
      nameKey: 'recipient_name',
      idKey: 'recipient_id',
      sortKey: 'recipient_name',
      sortable: true
    },
    {
      key: 'date',
      label: 'Date',
      dataKey: 'created_at',
      sortKey: 'date',
      sortable: true
    },
    {
      key: 'status',
      label: 'Status',
      dataKey: 'status',
      sortKey: 'status',
      sortable: true
    },
    {
      key: 'custom',
      label: 'Action',
      sortable: false,
      render: (row, index) => {
        // Show withdraw button if status is pending or if status is not present (assume pending)
        const isPending = !row.status || row.status?.toLowerCase() === 'pending';
        
        if (isPending) {
          return (
            <button
              className="member-interest-agent-withdraw-btn"
              onClick={() => handleWithdrawInterest(row)}
              title="Withdraw Interest"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeWidth="2"/>
                <path d="M12 12h.01" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 3v4" strokeWidth="2" strokeLinecap="round"/>
                <path d="M16 3v4" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 21h8" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Withdraw
            </button>
          );
        }
        return <span className="no-action">-</span>;
      }
    }
  ];

  // Define columns for received interests table
  const receivedColumns = [
    {
      key: 'member-info',
      label: 'Received By',
      photoKey: 'member_photo',
      nameKey: 'member_name',
      idKey: 'member_id',
      sortKey: 'member_name',
      sortable: true
    },
    {
      key: 'member-info',
      label: 'Received From',
      photoKey: 'sender_photo',
      nameKey: 'sender_name',
      idKey: 'sender_id',
      sortKey: 'sender_name',
      sortable: true
    },
    {
      key: 'date',
      label: 'Date',
      dataKey: 'created_at',
      sortKey: 'date',
      sortable: true
    },
    {
      key: 'status',
      label: 'Status',
      dataKey: 'status',
      sortKey: 'status',
      sortable: true
    },
    {
      key: 'custom',
      label: 'Action',
      sortable: false,
      render: (row, index) => {
        // Show accept/reject buttons if status is pending
        if (row.status?.toLowerCase() === 'pending') {
          return (
            <div className="action-buttons">
              <button
                className="member-interest-agent-accept-btn"
                onClick={() => handleAcceptInterest(row.interest_id, row.member_id)}
                title="Accept Interest"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 6 9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Accept
              </button>
              <button
                className="member-interest-agent-reject-btn"
                onClick={() => handleRejectInterest(row.interest_id, row.member_id)}
                title="Reject Interest"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6 6 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Reject
              </button>
            </div>
          );
        }
        return <span className="no-action">-</span>;
      }
    }
  ];

  return (
    <DashboardLayout>
      <div className="member-interest-container">
        <div className="member-interest-header">
          <h2>Member Interest</h2>
          <p className="subtitle">View interests sent and received by your members</p>
        </div>

        {/* Tabs */}
        <div className="interest-tabs">
          <button
            className={`tab-button ${tabActive === "sent" ? "active" : ""}`}
            onClick={() => {
              setTabActive("sent");
              setSortConfig({ key: null, direction: 'asc' });
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 2L11 13" strokeWidth="2" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2" />
            </svg>
            Sent ({sentInterests.length})
          </button>
          <button
            className={`tab-button ${tabActive === "received" ? "active" : ""}`}
            onClick={() => {
              setTabActive("received");
              setSortConfig({ key: null, direction: 'asc' });
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" />
              <polyline points="17 8 12 3 7 8" strokeWidth="2" />
              <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" />
            </svg>
            Received ({receivedInterests.length})
          </button>
        </div>

        {/* Content */}
        <div className="interest-content">
          {tabActive === "sent" && (
            <MemberCommonTable
              data={getSortedData(sentInterests)}
              columns={sentColumns}
              loading={loading}
              getProfileImageUrl={getProfileImageUrl}
              formatDate={formatDate}
              sortConfig={sortConfig}
              onSort={handleSort}
              onMemberClick={handleMemberClick}
              emptyMessage={{
                title: "No Sent Interests",
                description: "Your members haven't sent any interests yet"
              }}
            />
          )}

          {tabActive === "received" && (
            <MemberCommonTable
              data={getSortedData(receivedInterests)}
              columns={receivedColumns}
              loading={loading}
              getProfileImageUrl={getProfileImageUrl}
              formatDate={formatDate}
              sortConfig={sortConfig}
              onSort={handleSort}
              onMemberClick={handleMemberClick}
              emptyMessage={{
                title: "No Received Interests",
                description: "Your members haven't received any interests yet"
              }}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Member_Interest;
