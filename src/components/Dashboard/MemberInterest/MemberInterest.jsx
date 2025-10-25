import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import { fetchDataWithTokenV2 } from "../../../apiUtils";
import './MemberInterest.css';

const MemberInterest = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('impersonating_user_id') || localStorage.getItem("userId");
  const [tabActive, setTabActive] = useState("sent"); // 'sent' or 'received'
  const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'table'
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
      .then(response => response.json())
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
                       member_name: result.member.name || result.member.first_name || "N/A",
                       member_id: result.member.id,
                       member_photo: result.member.profile_photo,
                       // Recipient details from interest.user (the person who received the interest)
                       recipient_name: interest.user?.name || interest.user?.first_name || interest.user?.username || "N/A",
                       recipient_id: interest.user?.id || "N/A",
                       recipient_photo: interest.user?.profile_photo || interest.user?.upload_photo || null
                     })));
                   }
                   if (result.interests.received_interests && result.interests.received_interests.length > 0) {
                     allReceivedInterests.push(...result.interests.received_interests.map(interest => ({
                       ...interest,
                       member_name: result.member.name || result.member.first_name || "N/A",
                       member_id: result.member.id,
                       member_photo: result.member.profile_photo,
                       // Sender details from interest.user (the person who sent the interest)
                       sender_name: interest.user?.name || interest.user?.first_name || interest.user?.username || "N/A",
                       sender_id: interest.user?.id || "N/A",
                       sender_photo: interest.user?.profile_photo || interest.user?.upload_photo || null
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

  return (
    <DashboardLayout>
      <div className="member-interest-container">
        <div className="member-interest-header">
          <h2>Member Interest</h2>
          <p className="subtitle">View interests sent and received by your members</p>
        </div>

        {/* Tabs and View Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
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
        </div>

        {/* Content */}
        <div className="interest-content">
          {loading && <div className="loading">Loading...</div>}
          
          {!loading && tabActive === "sent" && (
            <div className="interests-list">
              {sentInterests.length === 0 ? (
                <div className="empty-state">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 2L11 13" strokeWidth="2" />
                    <path d="M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2" />
                  </svg>
                  <h3>No Sent Interests</h3>
                  <p>Your members haven't sent any interests yet</p>
                </div>
              ) : (
                <div className="interest-table-container">
                  <table className="interest-table">
                    <thead>
                      <tr>
                        <th>Sent By</th>
                        <th>Sent To</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sentInterests.map((interest, index) => (
                        <tr key={index}>
                          <td>
                            <div className="table-member-info">
                              <img
                                src={getProfileImageUrl(interest.member_photo)}
                                alt={interest.member_name}
                                className="table-avatar"
                              />
                              <div>
                                <div className="table-name">{interest.member_name || "N/A"}</div>
                                <div className="table-id">ID: {interest.member_id}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="table-member-info">
                              <img
                                src={getProfileImageUrl(interest.recipient_photo)}
                                alt={interest.recipient_name}
                                className="table-avatar"
                              />
                              <div>
                                <div className="table-name">{interest.recipient_name || "N/A"}</div>
                                <div className="table-id">ID: {interest.recipient_id}</div>
                              </div>
                            </div>
                          </td>
                          <td>{formatDate(interest.created_at)}</td>
                          <td>
                            <span className={`status ${interest.status?.toLowerCase() || 'pending'}`}>
                              {interest.status || "Pending"}
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
            <div className="interests-list">
              {receivedInterests.length === 0 ? (
                <div className="empty-state">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" />
                    <polyline points="17 8 12 3 7 8" strokeWidth="2" />
                    <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" />
                  </svg>
                  <h3>No Received Interests</h3>
                  <p>Your members haven't received any interests yet</p>
                </div>
              ) : viewMode === 'cards' ? (
                <div className="interest-grid">
                  {receivedInterests.map((interest, index) => (
                    <div key={index} className="interest-card">
                      <div className="card-header">
                        <div className="member-info">
                          <img
                            src={getProfileImageUrl(interest.member_photo)}
                            alt={interest.member_name}
                            className="member-avatar"
                          />
                          <div>
                            <h4>{interest.member_name || "N/A"}</h4>
                            <span className="member-id">ID: {interest.member_id}</span>
                          </div>
                        </div>
                        <span className="received-badge">Received Interest</span>
                      </div>
                      
                      <div className="divider"></div>

                      <div className="card-body">
                        <div className="interest-from">
                          <div className="sender-info">
                            <img
                              src={getProfileImageUrl(interest.sender_photo)}
                              alt={interest.sender_name}
                              className="sender-avatar"
                            />
                            <div>
                              <h5>From: {interest.sender_name || "N/A"}</h5>
                              <span className="sender-id">ID: {interest.sender_id}</span>
                            </div>
                          </div>
                        </div>

                        <div className="interest-details">
                          <div className="detail-row">
                            <span className="label">Date:</span>
                            <span className="value">{formatDate(interest.created_at)}</span>
                          </div>
                          <div className="detail-row">
                            <span className="label">Status:</span>
                            <span className={`status ${interest.status?.toLowerCase() || 'pending'}`}>
                              {interest.status || "Pending"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="interest-table-container">
                  <table className="interest-table">
                    <thead>
                      <tr>
                        <th>Received By</th>
                        <th>Received From</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receivedInterests.map((interest, index) => (
                        <tr key={index}>
                          <td>
                            <div className="table-member-info">
                              <img
                                src={getProfileImageUrl(interest.member_photo)}
                                alt={interest.member_name}
                                className="table-avatar"
                              />
                              <div>
                                <div className="table-name">{interest.member_name || "N/A"}</div>
                                <div className="table-id">ID: {interest.member_id}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="table-member-info">
                              <img
                                src={getProfileImageUrl(interest.sender_photo)}
                                alt={interest.sender_name}
                                className="table-avatar"
                              />
                              <div>
                                <div className="table-name">{interest.sender_name || "N/A"}</div>
                                <div className="table-id">ID: {interest.sender_id}</div>
                              </div>
                            </div>
                          </td>
                          <td>{formatDate(interest.created_at)}</td>
                          <td>
                            <span className={`status ${interest.status?.toLowerCase() || 'pending'}`}>
                              {interest.status || "Pending"}
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

export default MemberInterest;
