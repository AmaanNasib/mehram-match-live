import React, { useState, useEffect } from 'react';
import './MemberSendInterest.css';

const MemberSendInterest = ({ isOpen, onClose, targetUserId, targetUserName, targetUserPhoto, targetUserGender, targetUserData }) => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [sending, setSending] = useState(false);
  const [compatibilityScores, setCompatibilityScores] = useState({});
  const [loadingScores, setLoadingScores] = useState(false);
  const [interestStatuses, setInterestStatuses] = useState({}); // Track interest status for each member
  const [loadingInterestStatus, setLoadingInterestStatus] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAgentMembers();
    }
  }, [isOpen]);

  // Fetch compatibility scores for all members
  useEffect(() => {
    if (filteredMembers.length > 0 && targetUserId) {
      fetchCompatibilityScores();
    }
  }, [filteredMembers, targetUserId]);

  // Filter members based on gender compatibility
  useEffect(() => {
    if (members.length > 0 && targetUserGender) {
      const compatibleMembers = members.filter(member => {
        const memberGender = member.gender?.toLowerCase();
        const targetGender = targetUserGender?.toLowerCase();
        
        // Male members can only send interest to Female profiles
        // Female members can only send interest to Male profiles
        if (memberGender === 'male' && targetGender === 'female') return true;
        if (memberGender === 'female' && targetGender === 'male') return true;
        
        return false;
      });
      
      setFilteredMembers(compatibleMembers);
    } else {
      setFilteredMembers(members);
    }
  }, [members, targetUserGender]);

  const fetchAgentMembers = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('impersonating_user_id') || localStorage.getItem('userId');
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/agent/user_agent/?agent_id=${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }

      const data = await response.json();
      setMembers(data.member || []);
    } catch (error) {
      console.error('Error fetching agent members:', error);
      alert('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  // Fetch interest statuses for all members using existing API structure
  const fetchInterestStatuses = async () => {
    try {
      setLoadingInterestStatus(true);
      const statuses = {};
      
      // Fetch interest status for each member using existing /api/recieved/ endpoint
      const promises = filteredMembers.map(async (member) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/recieved/?action_by_id=${member.id}&action_on_id=${targetUserId}`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.ok) {
            const data = await response.json();
            
            // API response structure: Array of interest records
            // Filter for interest=true records only for this specific member AND target user
            const interestRecords = data.filter(record => 
              record.interest === true && 
              record.action_by_id === parseInt(member.id) &&
              record.action_on_id === parseInt(targetUserId)
            );
            
            if (interestRecords.length > 0) {
              const latestRecord = interestRecords[0]; // Get the latest interest record
              statuses[member.id] = {
                hasInterest: true,
                status: latestRecord.status || 'Pending', // null means Pending
                interestId: latestRecord.id || null,
                createdAt: latestRecord.created_at || null
              };
            } else {
              // No interest found - explicitly set hasInterest to false
              statuses[member.id] = {
                hasInterest: false,
                status: null,
                interestId: null,
                createdAt: null
              };
            }
          } else {
            console.warn(`Failed to fetch interest status for member ${member.id}`);
            statuses[member.id] = {
              hasInterest: false,
              status: null,
              interestId: null,
              createdAt: null
            };
          }
        } catch (error) {
          console.error(`Error fetching interest status for member ${member.id}:`, error);
          statuses[member.id] = {
            hasInterest: false,
            status: null,
            interestId: null,
            createdAt: null
          };
        }
      });

      await Promise.all(promises);
      setInterestStatuses(statuses);
    } catch (error) {
      console.error('Error fetching interest statuses:', error);
    } finally {
      setLoadingInterestStatus(false);
    }
  };

  // Fetch compatibility scores from API
  const fetchCompatibilityScores = async () => {
    try {
      setLoadingScores(true);
      const scores = {};
      
      // Fetch scores for each member
      const promises = filteredMembers.map(async (member) => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/agent/user/detailed-matches/?member_id=${member.id}&target_user_id=${targetUserId}`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log('API Response for member', member.id, ':', data);
            
            // API response structure: { detailed_matches: [{ matches: [{ compatibility_score: 50, matched_user: { id: 14, name: "John Doe" } }] }] }
            let score = 0;
            
            if (data.detailed_matches && data.detailed_matches.length > 0) {
              const detailedMatch = data.detailed_matches[0];
              if (detailedMatch.matches && detailedMatch.matches.length > 0) {
                // Find the match where matched_user.id equals targetUserId
                const targetMatch = detailedMatch.matches.find(match => 
                  match.matched_user && match.matched_user.id === parseInt(targetUserId)
                );
                if (targetMatch) {
                  score = targetMatch.compatibility_score || 0;
                }
              }
            }
            
            scores[member.id] = score;
            console.log('Extracted score for member', member.id, ':', score);
          } else {
            console.warn(`Failed to fetch score for member ${member.id}`);
            scores[member.id] = 0;
          }
        } catch (error) {
          console.error(`Error fetching score for member ${member.id}:`, error);
          scores[member.id] = 0;
        }
      });

      await Promise.all(promises);
      setCompatibilityScores(scores);
    } catch (error) {
      console.error('Error fetching compatibility scores:', error);
    } finally {
      setLoadingScores(false);
    }
  };

  // Check gender compatibility before sending
  const isGenderCompatible = (memberGender, targetGender) => {
    const member = memberGender?.toLowerCase();
    const target = targetGender?.toLowerCase();
    
    if (member === 'male' && target === 'female') return true;
    if (member === 'female' && target === 'male') return true;
    
    return false;
  };

  // Get compatibility score from API data
  const getCompatibilityScore = (memberId) => {
    return compatibilityScores[memberId] || 0;
  };

  // Get compatibility score color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Yellow
    if (score >= 40) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  // Get compatibility level text
  const getCompatibilityLevel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Low Match';
  };

  // Get interest status for a member
  const getInterestStatus = (memberId) => {
    // Only return status if it exists in state, otherwise return null to indicate not checked yet
    return interestStatuses[memberId] || null;
  };

  // Check if member can send interest (not already sent)
  const canSendInterest = (memberId) => {
    const status = getInterestStatus(memberId);
    // If status not checked yet, allow sending
    if (!status) return true;
    // If status exists, check if interest was sent
    return !status.hasInterest;
  };

  // Handle member selection with immediate status check
  const handleMemberSelection = (member) => {
    setSelectedMember(member);
    
    // Always check interest status for selected member
    checkSingleMemberInterestStatus(member.id);
  };

  // Check interest status for a single member
  const checkSingleMemberInterestStatus = async (memberId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/recieved/?action_by_id=${memberId}&action_on_id=${targetUserId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

          if (response.ok) {
            const data = await response.json();
            
            // Filter for interest=true records only for this specific member AND target user
            const interestRecords = data.filter(record => 
              record.interest === true && 
              record.action_by_id === parseInt(memberId) &&
              record.action_on_id === parseInt(targetUserId)
            );
            
            
            if (interestRecords.length > 0) {
              const latestRecord = interestRecords[0];
              const newStatus = {
                hasInterest: true,
                status: latestRecord.status || 'Pending',
                interestId: latestRecord.id || null,
                createdAt: latestRecord.created_at || null
              };
              
              // Update status for this specific member
              setInterestStatuses(prev => ({
                ...prev,
                [memberId]: newStatus
              }));
            } else {
              // No interest found - explicitly set hasInterest to false
              setInterestStatuses(prev => ({
                ...prev,
                [memberId]: {
                  hasInterest: false,
                  status: null,
                  interestId: null,
                  createdAt: null
                }
              }));
            }
      }
    } catch (error) {
      console.error(`Error checking interest status for member ${memberId}:`, error);
    }
  };

  // Get status badge color and text based on your explained structure
  const getStatusInfo = (status, hasInterest = false) => {
    // If no status checked yet or no interest sent, show default
    if (!status || !hasInterest) {
      return { 
        text: 'Send Interest', 
        bg: '#f1f5f9', 
        textColor: '#475569', 
        border: '#e2e8f0',
        buttonStyle: { backgroundColor: '#3B82F6', color: 'white', cursor: 'pointer' }
      };
    }
    
    // Handle null status as Pending (as per your explanation)
    const actualStatus = status === null ? 'Pending' : status;
    
    switch (actualStatus?.toLowerCase()) {
      case 'accepted':
        return { 
          text: 'Accepted', 
          bg: '#dcfce7', 
          textColor: '#166534', 
          border: '#bbf7d0',
          buttonStyle: { backgroundColor: '#10B981', color: 'white', cursor: 'not-allowed' }
        };
      case 'pending':
        return { 
          text: 'Pending', 
          bg: '#fef3c7', 
          textColor: '#d97706', 
          border: '#fde68a',
          buttonStyle: { backgroundColor: '#F59E0B', color: 'white', cursor: 'not-allowed' }
        };
      case 'rejected':
        return { 
          text: 'Rejected', 
          bg: '#fef2f2', 
          textColor: '#dc2626', 
          border: '#fecaca',
          buttonStyle: { backgroundColor: '#EF4444', color: 'white', cursor: 'not-allowed' }
        };
      default:
        return { 
          text: 'Send Interest', 
          bg: '#f1f5f9', 
          textColor: '#475569', 
          border: '#e2e8f0',
          buttonStyle: { backgroundColor: '#3B82F6', color: 'white', cursor: 'pointer' }
        };
    }
  };

  const handleSendInterest = async () => {
    if (!selectedMember) {
      alert('Please select a member');
      return;
    }

    if (!targetUserId) {
      alert('Target user ID is missing');
      return;
    }

    // Pre-validate gender compatibility
    if (!isGenderCompatible(selectedMember.gender, targetUserGender)) {
      alert('Gender compatibility required: Male can only send interest to Female and vice versa');
      return;
    }

    try {
      setSending(true);
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/agent/member/send-interest/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            member_id: selectedMember.id,
            target_user_id: parseInt(targetUserId)
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        alert('Interest sent successfully on behalf of member!');
        onClose();
        window.location.reload();
      } else {
        const errorData = await response.json();
        
        // Handle specific error cases
        if (errorData.error && errorData.error.includes('Gender')) {
          alert(`Gender compatibility error: ${errorData.error}`);
        } else {
          alert(errorData.error || 'Failed to send interest');
        }
      }
    } catch (error) {
      console.error('Error sending interest:', error);
      alert('Error sending interest');
    } finally {
      setSending(false);
    }
  };

  const getProfileImageUrl = (photoUrl) => {
    if (!photoUrl) return "https://via.placeholder.com/60";
    return `${process.env.REACT_APP_API_URL}${photoUrl}`;
  };

  if (!isOpen) return null;

  return (
    <div className="member-send-interest-overlay" onClick={onClose}>
      <div className="member-send-interest-bottom-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="member-send-interest-header">
          <h2>Send Interest on Behalf</h2>
          <button className="member-send-interest-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Target User Info */}
        <div className="member-send-interest-target-info">
          <img 
            src={getProfileImageUrl(targetUserPhoto)} 
            alt={targetUserName}
            className="member-send-interest-target-photo"
          />
          <div>
            <h3>Send interest to:</h3>
            <p className="member-send-interest-target-name">{targetUserName}</p>
            
            {/* Selected Member Status Display */}
            {selectedMember && (
              <div className="selected-member-status" style={{
                marginTop: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef'
              }}>
                <strong>Selected: {selectedMember.name || selectedMember.first_name}</strong>
                {(() => {
                  const status = getInterestStatus(selectedMember.id);
                  
                  if (status && status.hasInterest) {
                    const statusInfo = getStatusInfo(status.status, status.hasInterest);
                    return (
                      <div style={{
                        marginTop: '4px',
                        fontSize: '14px',
                        color: statusInfo.textColor,
                        fontWeight: 'bold'
                      }}>
                        Status: {statusInfo.text}
                      </div>
                    );
                  } else if (status && !status.hasInterest) {
                    return (
                      <div style={{
                        marginTop: '4px',
                        fontSize: '14px',
                        color: '#6c757d'
                      }}>
                        No interest sent yet
                      </div>
                    );
                  } else {
                    return (
                      <div style={{
                        marginTop: '4px',
                        fontSize: '14px',
                        color: '#6c757d'
                      }}>
                        Checking status...
                      </div>
                    );
                  }
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Members List */}
        <div className="member-send-interest-content">
          {loading ? (
            <div className="member-send-interest-loading">
              <div className="loading-spinner"></div>
              <p>Loading members...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="member-send-interest-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2"/>
                <circle cx="9" cy="7" r="4" strokeWidth="2"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth="2"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2"/>
              </svg>
              <h3>No Compatible Members Found</h3>
              <p>You don't have any members of the opposite gender to send interest from.</p>
            </div>
          ) : (
            <>
              <h3 className="member-send-interest-subtitle">Select a member:</h3>
              <div className="member-send-interest-members-list">
                {filteredMembers.map((member) => {
                  const interestStatus = getInterestStatus(member.id);
                  const canSend = canSendInterest(member.id);
                  const statusInfo = getStatusInfo(interestStatus?.status, interestStatus?.hasInterest);
                  
                  
                  return (
                    <div
                      key={member.id}
                      className={`member-send-interest-member-card ${
                        selectedMember?.id === member.id ? 'selected' : ''
                      } ${!canSend ? 'disabled' : ''}`}
                      onClick={() => canSend && handleMemberSelection(member)}
                      style={{ 
                        opacity: canSend ? 1 : 0.6,
                        cursor: canSend ? 'pointer' : 'not-allowed'
                      }}
                    >
                    <img
                      src={getProfileImageUrl(member.profile_photo)}
                      alt={member.name || member.first_name}
                      className="member-send-interest-member-photo"
                    />
                    <div className="member-send-interest-member-details">
                      <h4>{member.name || member.first_name || 'N/A'}</h4>
                      <p>ID: {member.member_id || member.id}</p>
                      {member.email && <p className="member-send-interest-member-email">{member.email}</p>}
                      
                      {/* Interest Status - Only show if interest actually sent */}
                      {interestStatus && interestStatus.hasInterest && (
                        <div className="interest-status-badge" style={{
                          backgroundColor: statusInfo.bg,
                          color: statusInfo.textColor,
                          border: `1px solid ${statusInfo.border}`,
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          textTransform: 'capitalize',
                          display: 'inline-block',
                          marginBottom: '8px'
                        }}>
                          {statusInfo.text}
                        </div>
                      )}
                      
                      {/* Show "No Interest Sent" only for selected member */}
                      {selectedMember?.id === member.id && interestStatus && !interestStatus.hasInterest && (
                        <div className="no-interest-badge" style={{
                          backgroundColor: '#f8f9fa',
                          color: '#6c757d',
                          border: '1px solid #e9ecef',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          textTransform: 'capitalize',
                          display: 'inline-block',
                          marginBottom: '8px'
                        }}>
                          No Interest Sent
                        </div>
                      )}
                      
                      {/* Compatibility Score */}
                      <div className="compatibility-score-container">
                        {loadingScores ? (
                          <div className="score-loading">
                            <div className="score-loading-spinner"></div>
                            <span>Calculating compatibility...</span>
                          </div>
                        ) : (
                          <div className="compatibility-score">
                            <div 
                              className="score-circle"
                              style={{ 
                                background: `conic-gradient(${getScoreColor(getCompatibilityScore(member.id))} 0deg, ${getScoreColor(getCompatibilityScore(member.id))} ${getCompatibilityScore(member.id) * 3.6}deg, #e5e7eb ${getCompatibilityScore(member.id) * 3.6}deg, #e5e7eb 360deg)`
                              }}
                            >
                              <div className="score-inner">
                                <span className="score-number">{getCompatibilityScore(member.id).toFixed(1)}%</span>
                              </div>
                            </div>
                            <div className="score-details">
                              <span className="score-level" style={{ color: getScoreColor(getCompatibilityScore(member.id)) }}>
                                {getCompatibilityLevel(getCompatibilityScore(member.id))}
                              </span>
                              <span className="score-label">Compatibility</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {selectedMember?.id === member.id && (
                      <div className="member-send-interest-check">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="member-send-interest-footer">
          <button
            className="member-send-interest-cancel-btn"
            onClick={onClose}
            disabled={sending}
          >
            Cancel
          </button>
          <button
            className="member-send-interest-send-btn"
            onClick={handleSendInterest}
            disabled={!selectedMember || sending || (selectedMember && !canSendInterest(selectedMember.id))}
            style={selectedMember ? getStatusInfo(getInterestStatus(selectedMember.id)?.status, getInterestStatus(selectedMember.id)?.hasInterest).buttonStyle : {}}
          >
            {sending ? 'Sending...' : 
             selectedMember && !canSendInterest(selectedMember.id) ? 
             getStatusInfo(getInterestStatus(selectedMember.id)?.status, getInterestStatus(selectedMember.id)?.hasInterest).text : 
             selectedMember ? 'Send Interest' : 'Select a Member'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberSendInterest;
