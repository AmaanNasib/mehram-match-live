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
                if (result.interests) {
                  if (result.interests.sent_interests && result.interests.sent_interests.length > 0) {
                    allSentInterests.push(...result.interests.sent_interests.map(interest => ({
                      ...interest,
                      interest_id: interest.interest_id,
                      member_name: result.member.name || result.member.first_name || "N/A",
                      member_id: result.member.id,
                      member_photo: result.member.profile_photo,
                      // Recipient details from interest.user (the person who received the interest)
                      recipient_name: interest.user?.name || interest.user?.first_name || interest.user?.username || "N/A",
                      recipient_id: interest.user?.id || "N/A",
                      recipient_photo: interest.user?.profile_photo || interest.user?.upload_photo || null,
                      // Add target_user_id for withdraw API
                      target_user_id: interest.user?.id || null,
                      // Add status if available, default to 'Pending'
                      status: interest.status || 'Pending'
                    })));
                  }
                  if (result.interests.received_interests && result.interests.received_interests.length > 0) {
                    allReceivedInterests.push(...result.interests.received_interests.map(interest => ({
                      ...interest,
                      interest_id: interest.interest_id,
                      member_name: result.member.name || result.member.first_name || "N/A",
                      member_id: result.member.id,
                      member_photo: result.member.profile_photo,
                      // Sender details from interest.user (the person who sent the interest)
                      sender_name: interest.user?.name || interest.user?.first_name || interest.user?.username || "N/A",
                      sender_id: interest.user?.id || "N/A",
                      sender_photo: interest.user?.profile_photo || interest.user?.upload_photo || null,
                      // Add status if available, default to 'Pending'
                      status: interest.status || 'Pending'
                    })));
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
    if (!photoUrl) {
      return "https://via.placeholder.com/60";
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

  // Handle withdraw interest
  const handleWithdrawInterest = async (rowData) => {
    if (!window.confirm('Are you sure you want to withdraw this interest?')) {
      return;
    }

    try {
      // Debug logging
      console.log('Withdrawing interest with:', {
        member_id: rowData.member_id,
        target_user_id: rowData.target_user_id,
        member_id_type: typeof rowData.member_id,
        target_user_id_type: typeof rowData.target_user_id
      });

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

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        alert('Interest withdrawn successfully');
        // Refresh the data
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert(`Failed to withdraw interest: ${errorData.error || errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error withdrawing interest:', error);
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

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        alert('Interest accepted successfully');
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert(`Failed to accept interest: ${errorData.error || errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error accepting interest:', error);
      alert('Error accepting interest: ' + error.message);
    }
  };

  // Handle reject interest
  const handleRejectInterest = async (interestId, memberId) => {
    if (!window.confirm('Are you sure you want to reject this interest?')) {
      return;
    }

    try {
      console.log('Rejecting interest with:', {
        member_id: memberId,
        interest_id: interestId,
        action: 'reject'
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
          action: 'reject'
        })
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        alert('Interest rejected successfully');
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert(`Failed to reject interest: ${errorData.error || errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error rejecting interest:', error);
      alert('Error rejecting interest: ' + error.message);
    }
  };

  // Define columns for sent interests table
  const sentColumns = [
    {
      key: 'member-info',
      label: 'Sent By',
      photoKey: 'member_photo',
      nameKey: 'member_name',
      idKey: 'member_id'
    },
    {
      key: 'member-info',
      label: 'Sent To',
      photoKey: 'recipient_photo',
      nameKey: 'recipient_name',
      idKey: 'recipient_id'
    },
    {
      key: 'date',
      label: 'Date',
      dataKey: 'created_at'
    },
    {
      key: 'status',
      label: 'Status',
      dataKey: 'status'
    },
    {
      key: 'custom',
      label: 'Action',
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
      idKey: 'member_id'
    },
    {
      key: 'member-info',
      label: 'Received From',
      photoKey: 'sender_photo',
      nameKey: 'sender_name',
      idKey: 'sender_id'
    },
    {
      key: 'date',
      label: 'Date',
      dataKey: 'created_at'
    },
    {
      key: 'status',
      label: 'Status',
      dataKey: 'status'
    },
    {
      key: 'custom',
      label: 'Action',
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
            onClick={() => setTabActive("sent")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 2L11 13" strokeWidth="2" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2" />
            </svg>
            Sent ({sentInterests.length})
          </button>
          <button
            className={`tab-button ${tabActive === "received" ? "active" : ""}`}
            onClick={() => setTabActive("received")}
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
              data={sentInterests}
              columns={sentColumns}
              loading={loading}
              getProfileImageUrl={getProfileImageUrl}
              formatDate={formatDate}
              emptyMessage={{
                title: "No Sent Interests",
                description: "Your members haven't sent any interests yet"
              }}
            />
          )}

          {tabActive === "received" && (
            <MemberCommonTable
              data={receivedInterests}
              columns={receivedColumns}
              loading={loading}
              getProfileImageUrl={getProfileImageUrl}
              formatDate={formatDate}
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
