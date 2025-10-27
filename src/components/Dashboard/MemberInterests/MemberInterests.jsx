import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import { fetchDataWithTokenV2 } from "../../../apiUtils";
import './MemberInterests.css';

const MemberInterests = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [memberData, setMemberData] = useState(null);
  const [interestStats, setInterestStats] = useState({
    sent: 0,
    received: 0,
    total: 0
  });
  const [sentInterests, setSentInterests] = useState([]);
  const [receivedInterests, setReceivedInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [withdrawingInterest, setWithdrawingInterest] = useState(null);
  const [processingInterest, setProcessingInterest] = useState(null);

  // Fetch member details and interest statistics
  useEffect(() => {
    if (memberId) {
      fetchMemberInterestData();
    }
  }, [memberId]);

  const fetchMemberInterestData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch member interests using new API endpoint
      const interestParameter = {
        url: `/api/agent/member/${memberId}/interests/`,
        setterFunction: (data) => {
          console.log('Interest data received:', data);
          
          if (data.success) {
            // Set member data from API response
            setMemberData(data.member);
            
            // Process interest statistics from summary
            const summary = data.summary || {};
            setInterestStats({
              sent: summary.total_sent || 0,
              received: summary.total_received || 0,
              total: summary.total_interests || 0
            });
            
            // Process interests array and separate sent/received
            const interests = data.interests || [];
            const sentInterests = interests.filter(interest => interest.type === 'sent');
            const receivedInterests = interests.filter(interest => interest.type === 'received');
            
            console.log('Processed interests:', {
              total: interests.length,
              sent: sentInterests.length,
              received: receivedInterests.length
            });
            
            setSentInterests(sentInterests);
            setReceivedInterests(receivedInterests);
          } else {
            setError('Failed to load member interest data');
          }
        },
        setErrors: setError
      };

      // Execute API call
      await fetchDataWithTokenV2(interestParameter);

    } catch (err) {
      console.error('Error fetching member interest data:', err);
      setError('Failed to load member interest data');
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  const handleWithdrawInterest = async (interestId) => {
    try {
      setWithdrawingInterest(interestId);
      
      const parameter = {
        url: `/api/agent/interest/`,
        payload: {
          interest_id: interestId,
          interest: false, // false means withdraw
        },
        setErrors: setError
      };

      // Import the API function
      const { postDataWithFetchV2 } = await import('../../../apiUtils');
      
      await postDataWithFetchV2(parameter);
      
      // Refresh the data after successful withdrawal
      await fetchMemberInterestData();
      
    } catch (err) {
      console.error('Error withdrawing interest:', err);
      setError('Failed to withdraw interest');
    } finally {
      setWithdrawingInterest(null);
    }
  };

  const handleAcceptInterest = async (interestId) => {
    try {
      setProcessingInterest(interestId);
      
      const parameter = {
        url: `/api/agent/interest/action/`,
        payload: {
          member_id: parseInt(memberId),
          interest_id: interestId,
          action: 'accept'
        },
        setErrors: setError
      };

      const { postDataWithFetchV2 } = await import('../../../apiUtils');
      
      await postDataWithFetchV2(parameter);
      
      // Refresh the data after successful acceptance
      await fetchMemberInterestData();
      
    } catch (err) {
      console.error('Error accepting interest:', err);
      setError('Failed to accept interest');
    } finally {
      setProcessingInterest(null);
    }
  };

  const handleRejectInterest = async (interestId) => {
    try {
      setProcessingInterest(interestId);
      
      const parameter = {
        url: `/api/agent/interest/action/`,
        payload: {
          member_id: parseInt(memberId),
          interest_id: interestId,
          action: 'reject'
        },
        setErrors: setError
      };

      const { postDataWithFetchV2 } = await import('../../../apiUtils');
      
      await postDataWithFetchV2(parameter);
      
      // Refresh the data after successful rejection
      await fetchMemberInterestData();
      
    } catch (err) {
      console.error('Error rejecting interest:', err);
      setError('Failed to reject interest');
    } finally {
      setProcessingInterest(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="member-interests-container">
          <div className="member-interests-loading-container">
            <div className="member-interests-loading-spinner"></div>
            <p>Loading member interest data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="member-interests-container">
          <div className="member-interests-error-container">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={handleBackClick} className="member-interests-back-btn">
              Go Back
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="member-interests-container">
        {/* Header */}
        <div className="member-interests-header">
          <button onClick={handleBackClick} className="member-interests-back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
          <h1>Member Interest Statistics</h1>
        </div>

        {/* Member Info */}
        {memberData && (
          <div className="member-info-card">
            <div className="member-avatar">
              <img 
                src={memberData.profile_photo?.upload_photo ? 
                  `${process.env.REACT_APP_API_URL}${memberData.profile_photo.upload_photo}` : 
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTJaIiBmaWxsPSIjOWNhM2FmIi8+CjxwYXRoIGQ9Ik0xMiAxNEM3LjU4MTcyIDE0IDQgMTcuNTgxNyA0IDIySDEyQzE2LjQxODMgMTQgMTIgMTQgMTIgMTRaIiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo8L3N2Zz4K"
                } 
                alt={memberData.name || "Member"}
                onError={(e) => {
                  e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTJaIiBmaWxsPSIjOWNhM2FmIi8+CjxwYXRoIGQ9Ik0xMiAxNEM3LjU4MTcyIDE0IDQgMTcuNTgxNyA0IDIySDEyQzE2LjQxODMgMTQgMTIgMTQgMTIgMTRaIiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo8L3N2Zz4K";
                }}
              />
            </div>
            <div className="member-details">
              <h2>{memberData.name || "N/A"}</h2>
              <p className="member-id">Member ID: {memberData.member_id || "N/A"}</p>
              <p className="member-email">{memberData.email || "N/A"}</p>
            </div>
          </div>
        )}

        {/* Interest Statistics Card */}
        <div className="member-interests-stats-card">
          <div className="member-interests-stats-header">
            <div className="member-interests-stats-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h2>Interest Statistics</h2>
          </div>
          
          <div className="member-interests-stats-content">
            <div className="member-interests-stats-row">
              <div className="member-interests-stat-item">
                <div className="member-interests-stat-label">Total Interests</div>
                <div className="member-interests-stat-value total">{interestStats.total}</div>
              </div>
              <div className="member-interests-stat-item">
                <div className="member-interests-stat-label">Sent Interests</div>
                <div className="member-interests-stat-value sent">{interestStats.sent}</div>
              </div>
              <div className="member-interests-stat-item">
                <div className="member-interests-stat-label">Received Interests</div>
                <div className="member-interests-stat-value received">{interestStats.received}</div>
              </div>
            </div>
            
            <div className="member-interests-breakdown-section">
              <div className="member-interests-breakdown-column">
                <h4>Sent Breakdown</h4>
                <div className="member-interests-breakdown-items">
                  <span className="member-interests-breakdown-item pending">
                    <span className="member-interests-breakdown-label">Pending:</span>
                    <span className="member-interests-breakdown-count">{sentInterests.filter(i => i.status === 'Pending').length}</span>
                  </span>
                  <span className="member-interests-breakdown-item accepted">
                    <span className="member-interests-breakdown-label">Accepted:</span>
                    <span className="member-interests-breakdown-count">{sentInterests.filter(i => i.status === 'Accepted').length}</span>
                  </span>
                  <span className="member-interests-breakdown-item rejected">
                    <span className="member-interests-breakdown-label">Rejected:</span>
                    <span className="member-interests-breakdown-count">{sentInterests.filter(i => i.status === 'Rejected').length}</span>
                  </span>
                </div>
              </div>
              
              <div className="member-interests-breakdown-column">
                <h4>Received Breakdown</h4>
                <div className="member-interests-breakdown-items">
                  <span className="member-interests-breakdown-item pending">
                    <span className="member-interests-breakdown-label">Pending:</span>
                    <span className="member-interests-breakdown-count">{receivedInterests.filter(i => i.status === 'Pending').length}</span>
                  </span>
                  <span className="member-interests-breakdown-item accepted">
                    <span className="member-interests-breakdown-label">Accepted:</span>
                    <span className="member-interests-breakdown-count">{receivedInterests.filter(i => i.status === 'Accepted').length}</span>
                  </span>
                  <span className="member-interests-breakdown-item rejected">
                    <span className="member-interests-breakdown-label">Rejected:</span>
                    <span className="member-interests-breakdown-count">{receivedInterests.filter(i => i.status === 'Rejected').length}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Interest Tables */}
        <div className="member-interests-tables-container">
          {/* Sent Interests Table */}
          <div className="member-interests-table-section">
            <h3>Sent Interests ({sentInterests.length})</h3>
            {sentInterests.length > 0 ? (
              <div className="member-interests-table-container">
                <table className="member-interests-table">
                   <thead>
                     <tr>
                       <th>Target User</th>
                       <th>Member ID</th>
                       <th>Date Sent</th>
                       <th>Status</th>
                       <th>Action</th>
                     </tr>
                   </thead>
                  <tbody>
                    {sentInterests.map((interest, index) => (
                      <tr key={index}>
                        <td>{interest.target_user?.name || "N/A"}</td>
                        <td>{interest.target_user?.member_id || "N/A"}</td>
                        <td>{interest.date ? new Date(interest.date).toLocaleDateString() : "N/A"}</td>
                        <td>
                          <span className={`member-interests-table-status-badge member-interests-table-status-${interest.status?.toLowerCase() || 'pending'}`}>
                            {interest.status || "Pending"}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleWithdrawInterest(interest.id)}
                            disabled={withdrawingInterest === interest.id}
                            className="member-interests-withdraw-btn"
                            title="Withdraw Interest"
                          >
                            {withdrawingInterest === interest.id ? (
                              <div className="member-interests-withdraw-spinner"></div>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                              </svg>
                            )}
                            {withdrawingInterest === interest.id ? 'Withdrawing...' : 'Withdraw'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="member-interests-no-data">
                <p>No sent interests found</p>
              </div>
            )}
          </div>

          {/* Received Interests Table */}
          <div className="member-interests-table-section">
            <h3>Received Interests ({receivedInterests.length})</h3>
            {receivedInterests.length > 0 ? (
              <div className="member-interests-table-container">
                <table className="member-interests-table">
                   <thead>
                     <tr>
                       <th>From User</th>
                       <th>Member ID</th>
                       <th>Date Received</th>
                       <th>Status</th>
                       <th>Action</th>
                     </tr>
                   </thead>
                  <tbody>
                    {receivedInterests.map((interest, index) => (
                      <tr key={index}>
                        <td>{interest.from_user?.name || "N/A"}</td>
                        <td>{interest.from_user?.member_id || "N/A"}</td>
                        <td>{interest.date ? new Date(interest.date).toLocaleDateString() : "N/A"}</td>
                        <td>
                          <span className={`member-interests-table-status-badge member-interests-table-status-${interest.status?.toLowerCase() || 'pending'}`}>
                            {interest.status || "Pending"}
                          </span>
                        </td>
                        <td>
                          <div className="member-interests-action-buttons">
                            {interest.status === 'Pending' ? (
                              <>
                                <button
                                  onClick={() => handleAcceptInterest(interest.id)}
                                  disabled={processingInterest === interest.id}
                                  className="member-interests-accept-btn"
                                  title="Accept Interest"
                                >
                                  {processingInterest === interest.id ? (
                                    <div className="member-interests-action-spinner"></div>
                                  ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M20 6L9 17l-5-5"/>
                                    </svg>
                                  )}
                                  {processingInterest === interest.id ? 'Accepting...' : 'Accept'}
                                </button>
                                <button
                                  onClick={() => handleRejectInterest(interest.id)}
                                  disabled={processingInterest === interest.id}
                                  className="member-interests-reject-btn"
                                  title="Reject Interest"
                                >
                                  {processingInterest === interest.id ? (
                                    <div className="member-interests-action-spinner"></div>
                                  ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M18 6L6 18M6 6l12 12"/>
                                    </svg>
                                  )}
                                  {processingInterest === interest.id ? 'Rejecting...' : 'Reject'}
                                </button>
                              </>
                            ) : (
                              <span className="member-interests-no-action">
                                {interest.status === 'Accepted' ? 'Accepted' : 'Rejected'}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="member-interests-no-data">
                <p>No received interests found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MemberInterests;
