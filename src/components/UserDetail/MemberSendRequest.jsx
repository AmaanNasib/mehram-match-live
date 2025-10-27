import React, { useState, useEffect } from 'react';
import { fetchDataWithTokenV2, postDataWithFetchV2 } from '../../apiUtils';

const MemberSendRequest = ({ 
  isOpen, 
  onClose, 
  targetUserId, 
  onSuccess, 
  onError 
}) => {
  const [maleMembers, setMaleMembers] = useState([]);
  const [selectedMaleMember, setSelectedMaleMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoRequestLoading, setPhotoRequestLoading] = useState(false);

  // Fetch male members when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchMaleMembers();
    }
  }, [isOpen]);

  // Fetch male members for agent
  const fetchMaleMembers = async () => {
    try {
      setLoading(true);
      const parameter = {
        url: `/api/agent/male-members/`,
        setterFunction: (data) => {
          if (data.success) {
            // API returns male_members, not members
            setMaleMembers(data.male_members || []);
          } else {
            onError('Failed to fetch male members');
          }
        },
        setErrors: onError
      };
      
      fetchDataWithTokenV2(parameter);
    } catch (err) {
      onError('Failed to fetch male members');
    } finally {
      setLoading(false);
    }
  };

  // Handle photo request from male member
  const handlePhotoRequestFromMaleMember = async (maleMemberId) => {
    try {
      setPhotoRequestLoading(true);
      
      const parameter = {
        url: `/api/agent/photo-request/send/`,
        payload: {
          action_by_id: maleMemberId,
          action_on_id: targetUserId
        },
        setterFunction: (data) => {
          if (data.success) {
            onSuccess('Photo request sent successfully!');
            onClose();
          } else {
            onError(data.message || 'Failed to send photo request');
          }
        },
        setErrors: onError
      };
      
      postDataWithFetchV2(parameter);
    } catch (err) {
      onError('Failed to send photo request');
    } finally {
      setPhotoRequestLoading(false);
    }
  };

  // Handle send request
  const handleSendRequest = () => {
    if (selectedMaleMember) {
      handlePhotoRequestFromMaleMember(selectedMaleMember.id);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setSelectedMaleMember(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="member-send-request-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="member-send-request-modal" style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
      }}>
        {/* Modal Header */}
        <div className="modal-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827'
          }}>
            Select Male Member
          </h2>
          <button 
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>
        
        {/* Modal Content */}
        <div className="modal-content">
          <p style={{
            margin: '0 0 16px 0',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            Choose a male member to send photo request on behalf of:
          </p>
          
          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6b7280'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid #f3f4f6',
                borderTop: '3px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px'
              }}></div>
              <p>Loading male members...</p>
            </div>
          ) : maleMembers.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6b7280'
            }}>
              <p>No male members found</p>
            </div>
          ) : (
            <div className="male-members-list" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {maleMembers.map((member) => (
                <div 
                  key={member.id}
                  className="male-member-item"
                  style={{
                    padding: '16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: selectedMaleMember?.id === member.id ? '#f0f9ff' : 'white',
                    borderColor: selectedMaleMember?.id === member.id ? '#3b82f6' : '#e5e7eb'
                  }}
                  onClick={() => setSelectedMaleMember(member)}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                          <h3 style={{
                            margin: '0 0 4px 0',
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#111827'
                          }}>
                            {member.name || `${member.first_name} ${member.last_name}`}
                          </h3>
                          <p style={{
                            margin: '0 0 4px 0',
                            fontSize: '14px',
                            color: '#6b7280'
                          }}>
                            ID: {member.id || 'N/A'}
                          </p>
                          <p style={{
                            margin: '0 0 4px 0',
                            fontSize: '12px',
                            color: '#9ca3af'
                          }}>
                            {member.city}, {member.state}
                          </p>
                          <p style={{
                            margin: 0,
                            fontSize: '11px',
                            color: '#9ca3af'
                          }}>
                            {member.profession} • {member.martial_status}
                          </p>
                    </div>
                    {selectedMaleMember?.id === member.id && (
                      <div style={{
                        color: '#3b82f6',
                        fontSize: '20px'
                      }}>
                        ✓
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Modal Footer */}
        <div className="modal-footer" style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <button 
            onClick={handleClose}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white',
              color: '#374151',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSendRequest}
            disabled={!selectedMaleMember || photoRequestLoading}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: selectedMaleMember && !photoRequestLoading ? '#3b82f6' : '#9ca3af',
              color: 'white',
              cursor: selectedMaleMember && !photoRequestLoading ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {photoRequestLoading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Sending...
              </>
            ) : (
              'Send Request'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberSendRequest;
