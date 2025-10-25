import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import { fetchDataWithTokenV2 } from "../../../apiUtils";
import './MemberRequests.css';

const MemberRequests = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('impersonating_user_id') || localStorage.getItem("userId");
  const [tabActive, setTabActive] = useState("sent"); // 'sent' or 'received'
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Fetch all member photo requests for the agent
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
      .then(response => response.json())
      .then(data => {
        const members = data.member || [];
        
        // Step 2: Fetch photo requests for each member
        if (members.length > 0) {
          const fetchPromises = members.map(member => {
            return fetch(`${process.env.REACT_APP_API_URL}/api/agent/member/photo-requests/?member_id=${member.id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            })
            .then(res => res.json())
            .then(requestsData => ({
              member: member,
              requests: requestsData
            }))
            .catch(err => {
              console.error(`Error fetching photo requests for member ${member.id}:`, err);
              return { member: member, requests: null };
            });
          });
          
          Promise.all(fetchPromises)
            .then(results => {
              const allSentRequests = [];
              const allReceivedRequests = [];
              
              results.forEach(result => {
                if (result.requests) {
                  if (result.requests.sent_requests && result.requests.sent_requests.length > 0) {
                    allSentRequests.push(...result.requests.sent_requests.map(request => ({
                      ...request,
                      member_name: result.member.name || result.member.first_name || "N/A",
                      member_id: result.member.id,
                      member_photo: result.member.profile_photo,
                      // Recipient details from request.user
                      recipient_name: request.user?.name || request.user?.first_name || request.user?.username || "N/A",
                      recipient_id: request.user?.id || "N/A",
                      recipient_photo: request.user?.profile_photo || request.user?.upload_photo || null
                    })));
                  }
                  if (result.requests.received_requests && result.requests.received_requests.length > 0) {
                    allReceivedRequests.push(...result.requests.received_requests.map(request => ({
                      ...request,
                      member_name: result.member.name || result.member.first_name || "N/A",
                      member_id: result.member.id,
                      member_photo: result.member.profile_photo,
                      // Sender details from request.user
                      sender_name: request.user?.name || request.user?.first_name || request.user?.username || "N/A",
                      sender_id: request.user?.id || "N/A",
                      sender_photo: request.user?.profile_photo || request.user?.upload_photo || null
                    })));
                  }
                }
              });
              
              setSentRequests(allSentRequests);
              setReceivedRequests(allReceivedRequests);
              setLoading(false);
            })
            .catch(err => {
              console.error('Error processing photo requests:', err);
              setLoading(false);
              setError(true);
            });
        } else {
          setSentRequests([]);
          setReceivedRequests([]);
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

  return (
    <DashboardLayout>
      <div className="member-requests-container">
        <div className="member-requests-header">
          <h2>Member Photo Requests</h2>
          <p className="subtitle">View photo requests sent and received by your members</p>
        </div>

        {/* Tabs */}
        <div className="requests-tabs">
          <button
            className={`tab-button ${tabActive === "sent" ? "active" : ""}`}
            onClick={() => setTabActive("sent")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M22 2L11 13" strokeWidth="2" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2" />
            </svg>
            Sent ({sentRequests.length})
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
            Received ({receivedRequests.length})
          </button>
        </div>

        {/* Content */}
        <div className="requests-content">
          {loading && <div className="loading">Loading...</div>}
          
          {!loading && tabActive === "sent" && (
            <div className="requests-list">
              {sentRequests.length === 0 ? (
                <div className="empty-state">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 2L11 13" strokeWidth="2" />
                    <path d="M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2" />
                  </svg>
                  <h3>No Sent Requests</h3>
                  <p>Your members haven't sent any photo requests yet</p>
                </div>
              ) : (
                <div className="requests-table-container">
                  <table className="requests-table">
                    <thead>
                      <tr>
                        <th>Sent By</th>
                        <th>Sent To</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sentRequests.map((request, index) => (
                        <tr key={index}>
                          <td>
                            <div className="table-member-info">
                              <img
                                src={getProfileImageUrl(request.member_photo)}
                                alt={request.member_name}
                                className="table-avatar"
                              />
                              <div>
                                <div className="table-name">{request.member_name || "N/A"}</div>
                                <div className="table-id">ID: {request.member_id}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="table-member-info">
                              <img
                                src={getProfileImageUrl(request.recipient_photo)}
                                alt={request.recipient_name}
                                className="table-avatar"
                              />
                              <div>
                                <div className="table-name">{request.recipient_name || "N/A"}</div>
                                <div className="table-id">ID: {request.recipient_id}</div>
                              </div>
                            </div>
                          </td>
                          <td>{formatDate(request.created_at)}</td>
                          <td>
                            <span className={`status ${request.status?.toLowerCase() || 'open'}`}>
                              {request.status || "Open"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {!loading && tabActive === "received" && (
            <div className="requests-list">
              {receivedRequests.length === 0 ? (
                <div className="empty-state">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" />
                    <polyline points="17 8 12 3 7 8" strokeWidth="2" />
                    <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" />
                  </svg>
                  <h3>No Received Requests</h3>
                  <p>Your members haven't received any photo requests yet</p>
                </div>
              ) : (
                <div className="requests-table-container">
                  <table className="requests-table">
                    <thead>
                      <tr>
                        <th>Received By</th>
                        <th>Received From</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receivedRequests.map((request, index) => (
                        <tr key={index}>
                          <td>
                            <div className="table-member-info">
                              <img
                                src={getProfileImageUrl(request.member_photo)}
                                alt={request.member_name}
                                className="table-avatar"
                              />
                              <div>
                                <div className="table-name">{request.member_name || "N/A"}</div>
                                <div className="table-id">ID: {request.member_id}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="table-member-info">
                              <img
                                src={getProfileImageUrl(request.sender_photo)}
                                alt={request.sender_name}
                                className="table-avatar"
                              />
                              <div>
                                <div className="table-name">{request.sender_name || "N/A"}</div>
                                <div className="table-id">ID: {request.sender_id}</div>
                              </div>
                            </div>
                          </td>
                          <td>{formatDate(request.created_at)}</td>
                          <td>
                            <span className={`status ${request.status?.toLowerCase() || 'open'}`}>
                              {request.status || "Open"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MemberRequests;
