import React, { useState, useEffect } from 'react';
import './AgentMessageSidebar.css';

const AgentMessageSidebar = ({ isOpen, onClose, targetUserId, targetUserName, targetUserPhoto, targetUserGender, targetUserData }) => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchAgentMembers();
    }
  }, [isOpen]);

  // Filter members based on gender compatibility
  useEffect(() => {
    console.log('=== GENDER FILTERING ===');
    console.log('Total members:', members.length);
    console.log('Target user gender:', targetUserGender);
    
    if (members.length > 0 && targetUserGender) {
      const compatibleMembers = members.filter(member => {
        const memberGender = member.gender?.toLowerCase();
        const targetGender = targetUserGender?.toLowerCase();
        
        console.log(`Member: ${member.name} (${memberGender}) -> Target: ${targetGender}`);
        
        // Male members can only message Female profiles
        // Female members can only message Male profiles
        if (memberGender === 'male' && targetGender === 'female') {
          console.log('✅ Compatible: Male member can message Female target');
          return true;
        }
        if (memberGender === 'female' && targetGender === 'male') {
          console.log('✅ Compatible: Female member can message Male target');
          return true;
        }
        
        console.log('❌ Not compatible');
        return false;
      });
      
      console.log('Compatible members found:', compatibleMembers.length);
      console.log('Compatible members:', compatibleMembers);
      setFilteredMembers(compatibleMembers);
      console.log('State updated with compatible members');
    } else {
      console.log('No gender filtering - showing all members');
      setFilteredMembers(members);
    }
  }, [members, targetUserGender]);

  // Debug: Track filteredMembers state changes
  useEffect(() => {
    console.log('=== FILTERED MEMBERS STATE CHANGED ===');
    console.log('filteredMembers length:', filteredMembers.length);
    console.log('filteredMembers:', filteredMembers);
  }, [filteredMembers]);

  // Search filter - this should work on the already filtered members, not all members
  const [searchFilteredMembers, setSearchFilteredMembers] = useState([]);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchFilteredMembers(filteredMembers);
    } else {
      const filtered = filteredMembers.filter(member => {
        const name = `${member.name || member.first_name || ''} ${member.last_name || ''}`.toLowerCase();
        const memberId = member.member_id || member.id || '';
        return name.includes(searchTerm.toLowerCase()) || 
               memberId.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setSearchFilteredMembers(filtered);
    }
  }, [searchTerm, filteredMembers]);

  const fetchAgentMembers = async () => {
    setLoading(true);
    try {
      const currentUserId = localStorage.getItem('userId');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/agent/user_agent/?agent_id=${currentUserId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Handle different API response formats
        const membersArray = data.member || data.members || data || [];
        setMembers(Array.isArray(membersArray) ? membersArray : []);
        console.log('Agent members fetched:', data);
        console.log('Members array:', membersArray);
      } else {
        console.error('Failed to fetch agent members');
        alert('Failed to fetch members');
      }
    } catch (error) {
      console.error('Error fetching agent members:', error);
      alert('Error fetching members');
    } finally {
      setLoading(false);
    }
  };

  const handleMemberSelection = (member) => {
    setSelectedMember(member);
  };

  const handleSendMessage = () => {
    if (!selectedMember) {
      alert('Please select a member first');
      return;
    }

    if (!targetUserId) {
      alert('Target user not found');
      return;
    }

    console.log('=== NAVIGATING TO INBOX ===');
    console.log('Selected member:', selectedMember);
    console.log('Target user ID:', targetUserId);
    
    // Close sidebar first
    onClose();
    
    // Navigate to inbox with selected member and target user info
    const meId = localStorage.getItem('userId');
    if (meId) {
      // Store the selected member and target user info for the inbox to use
      localStorage.setItem('selectedMemberForMessage', JSON.stringify(selectedMember));
      localStorage.setItem('targetUserForMessage', JSON.stringify({
        id: targetUserId,
        name: targetUserName,
        photo: targetUserPhoto,
        gender: targetUserGender
      }));
      
      // Navigate to inbox and open the specific conversation
      window.location.href = `/${meId}/inbox/?openUserId=${targetUserId}&agentMessage=true`;
    } else {
      window.location.href = '/inbox/';
    }
  };

  const getProfileImageUrl = (photo) => {
    if (!photo) return 'https://via.placeholder.com/200';
    
    // Handle different photo formats
    let photoUrl = '';
    if (typeof photo === 'string') {
      photoUrl = photo;
    } else if (photo && typeof photo === 'object') {
      // If photo is an object, try to get the URL from common properties
      photoUrl = photo.url || photo.profile_photo || photo.upload_photo || photo.image || '';
    }
    
    if (!photoUrl) return 'https://via.placeholder.com/200';
    if (photoUrl.startsWith('http')) return photoUrl;
    return `${process.env.REACT_APP_API_URL}${photoUrl}`;
  };

  if (!isOpen) return null;

  return (
    <div className="agent-message-sidebar-overlay">
      <div className="agent-message-sidebar">
        <div className="agent-message-sidebar-header">
          <h3>Select Member to Message</h3>
          <button className="close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="agent-message-sidebar-content">
          {/* Target User Info */}
          <div className="target-user-info">
            <img 
              src={getProfileImageUrl(targetUserPhoto)} 
              alt={targetUserName}
              className="target-user-photo"
            />
            <div className="target-user-details">
              <h4>{targetUserName}</h4>
              <p>Select a member to message this user</p>
            </div>
          </div>

          {/* Search */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Members List */}
          <div className="members-list">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading members...</p>
              </div>
            ) : (() => {
              console.log('=== RENDER CHECK ===');
              console.log('searchFilteredMembers length:', searchFilteredMembers.length);
              console.log('searchFilteredMembers:', searchFilteredMembers);
              console.log('isArray:', Array.isArray(searchFilteredMembers));
              
              if (searchFilteredMembers.length === 0) {
                console.log('Showing empty state');
                return (
                  <div className="empty-state">
                    <p>No compatible members found</p>
                    <small>Members must be opposite gender to message this user</small>
                  </div>
                );
              } else if (Array.isArray(searchFilteredMembers)) {
                console.log('Rendering members list');
                return searchFilteredMembers.map((member) => (
                <div
                  key={member.id}
                  className={`member-card ${selectedMember?.id === member.id ? 'selected' : ''}`}
                  onClick={() => handleMemberSelection(member)}
                >
                  <img
                    src={getProfileImageUrl(member.profile_photo)}
                    alt={member.name || member.first_name}
                    className="member-photo"
                  />
                  <div className="member-details">
                    <h5 className="member-name">{member.name || `${member.first_name} ${member.last_name}`}</h5>
                    <div className="member-info-row">
                      <span className="member-age">{member.age} years</span>
                      <span className="member-location">{member.city}</span>
                    </div>
                  </div>
                  {selectedMember?.id === member.id && (
                    <div className="selected-indicator">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  )}
                </div>
                ));
              } else {
                console.log('Error: filteredMembers is not an array');
                return (
                  <div className="empty-state">
                    <p>Error loading members</p>
                  </div>
                );
              }
            })()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="agent-message-sidebar-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="send-message-btn"
            onClick={handleSendMessage}
            disabled={!selectedMember}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentMessageSidebar;
