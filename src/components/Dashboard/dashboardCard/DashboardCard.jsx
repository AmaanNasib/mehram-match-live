import React, { useState, useEffect } from "react";
import "./dashboardCard.css";
import heart from "../../../images/colorHeart.svg";
import men1 from "../../../images/men8.jpg";
import { postDataWithFetchV2, fetchDataV2, justUpdateDataV2, putDataWithFetchV2 } from "../../../apiUtils";
import { useNavigate } from "react-router-dom";

const DashboardCard = ({ profile, setApiData, IsInterested, url, interested_id, activeUser }) => {
  
  const fillHeart = false;
  const navigate = useNavigate();
 const [userId] = useState(localStorage.getItem("userId"));
  const [Error, setErrors] = useState("");
  const [message, setSuccessMessage] = useState();

  const [userDetail, setUserDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [photoRequestStatus, setPhotoRequestStatus] = useState(null); // Track photo request status: 'pending', 'accepted', 'rejected', null
  const [loadingPhotoStatus, setLoadingPhotoStatus] = useState(false);
  const role =localStorage.getItem('role');

  // Function to get marital status badge color
  const getMaritalStatusColor = (maritalStatus) => {
    switch (maritalStatus?.toLowerCase()) {
      case "single":
        return { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" }; // Light Green
      case "married":
        return { bg: "#dbeafe", text: "#1e40af", border: "#bfdbfe" }; // Light Blue
      case "divorced":
        return { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" }; // Light Red
      case "widowed":
        return { bg: "#fef3c7", text: "#d97706", border: "#fde68a" }; // Light Orange
      case "khula":
        return { bg: "#f3e8ff", text: "#7c3aed", border: "#ddd6fe" }; // Light Purple
      case "awaiting divorce":
        return { bg: "#fef3c7", text: "#d97706", border: "#fde68a" }; // Light Yellow
      case "never married":
        return { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" }; // Light Green
      default:
        return { bg: "#f1f5f9", text: "#475569", border: "#e2e8f0" }; // Default Gray
    }
  };


  const interested = ({action_on_id,interested_id}) => {
    const parameter = {
      url:Number(interested_id)?`/api/recieved/${interested_id}/` :`/api/recieved/`,
      payload: {
        action_by_id: Number(userId),
        action_on_id: Number(action_on_id),
        interest	: IsInterested ? false : true,
      },
      setErrors: setErrors,
      tofetch: {
        items: [
          {
            fetchurl: url,
            dataset: setApiData,
            setSuccessMessage: setSuccessMessage,
            setErrors: setErrors,
          },
        ],
        setSuccessMessage: setSuccessMessage,
        setErrors: setErrors,
      },
    };
    if(Number(interested_id)){
      putDataWithFetchV2(parameter)
    }else{
      postDataWithFetchV2(parameter);
    }
   
  };

  const shortlist = (interestedId) => {
    const parameter = {
      url: role=='agent'?'/api/agent/shortlist/':`/api/recieved/`,
      payload: {
        action_by_id: userId,
        action_on_id: interestedId,
        shortlisted: true,
      },
      setErrors: setErrors,
      tofetch: {
        items: [
          {
            fetchurl: url,
            dataset: setApiData,
            setSuccessMessage: setSuccessMessage,
            setErrors: setErrors,
          },
        ],
        setSuccessMessage: setSuccessMessage,
        setErrors: setErrors,
      },
    };
    postDataWithFetchV2(parameter);
  };

  const blocked = (interestedId) => {
    const parameter = {
      url: `/api/recieved/`,
      payload: {
        action_by_id: userId,
        action_on_id: interestedId,
        blocked: true,
      },
      setErrors: setErrors,
      tofetch: {
        items: [
          {
            fetchurl: url,
            dataset: setApiData,
            setSuccessMessage: setSuccessMessage,
            setErrors: setErrors,
          },
        ],
        setSuccessMessage: setSuccessMessage,
        setErrors: setErrors,
      },
    };
    postDataWithFetchV2(parameter);
  };

  // Demo functions for testing photo request status updates
  const acceptPhotoRequest = () => {
    setPhotoRequestStatus('accepted');
    setSuccessMessage('Photo request accepted! You can now view photos.');
  };

  const rejectPhotoRequest = () => {
    setPhotoRequestStatus('rejected');
    setSuccessMessage('Photo request rejected.');
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
  };

    const requestPhoto = (targetUserId) => {
      const parameter = {
        url: `/api/user/photo-request/`,
        payload: {
          action_on_id: Number(targetUserId),
          status: 'Requested'
        },
        setErrors: (error) => {
          console.error('Photo request error:', error);
          
          // Check if it's a duplicate request error
          if (error && error.already_sent === true) {
            console.log('Photo request already sent');
            setSuccessMessage('Photo request already sent!');
            setPhotoRequestStatus('pending');
            // Refresh status to confirm
            setTimeout(() => {
              checkPhotoRequestStatus();
            }, 1000);
          } else {
            setErrors(error);
          }
        },
        setSuccessMessage: (message) => {
          console.log('Photo request success:', message);
          setSuccessMessage('Photo request sent successfully!');
          // Update status and refresh
          setPhotoRequestStatus('pending');
          setTimeout(() => {
            checkPhotoRequestStatus();
          }, 1000);
        },
      };
      postDataWithFetchV2(parameter);
    };

  const reportUser = (targetUserId) => {
    // Temporary: Use blocking as reporting
    const parameter = {
      url: `/api/recieved/`,
      payload: {
        action_by_id: Number(userId),
        action_on_id: Number(targetUserId),
        blocked: true,
        status: 'Reported'
      },
      setErrors: setErrors,
      tofetch: {
        items: [
          {
            fetchurl: url,
            dataset: setApiData,
            setSuccessMessage: setSuccessMessage,
            setErrors: setErrors,
          },
        ],
        setSuccessMessage: setSuccessMessage,
        setErrors: setErrors,
      },
    };
    postDataWithFetchV2(parameter);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.menu-container')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setSuccessMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Check existing photo request status on component mount
  useEffect(() => {
    if (profile?.id && userId) {
      checkPhotoRequestStatus();
    }
  }, [profile?.id, userId]);

  // Function to check existing photo request status
  const checkPhotoRequestStatus = async () => {
    setLoadingPhotoStatus(true);
    try {
      const parameter = {
        url: `/api/user/photo-request/?user_id=${profile.id}`,
        setterFunction: (data) => {
          
          if (data && data.length > 0) {
            // Check if current user has sent a request to this profile
            const userRequest = data.find(request => {
              return request.action_by && 
                     request.action_by.id === Number(userId);
            });
            
            if (userRequest) {
              if (userRequest.status === 'Requested') {
                setPhotoRequestStatus('pending');
              } else if (userRequest.status === 'Accepted') {
                setPhotoRequestStatus('accepted');
              } else if (userRequest.status === 'Rejected') {
                setPhotoRequestStatus('rejected');
              } else if (userRequest.status === 'Open') {
                setPhotoRequestStatus('rejected');
              } else {
                setPhotoRequestStatus(null);
              }
            } else {
              setPhotoRequestStatus(null);
            }
          } else {
            setPhotoRequestStatus(null);
          }
          setLoadingPhotoStatus(false);
        },
        setErrors: setErrors,
      };
      fetchDataV2(parameter);
    } catch (error) {
      setLoadingPhotoStatus(false);
    }
  };

  return (
    <div className="profile-card" style={{ width: "20rem", height: "60%" }}>
      {/* Success Message */}
      {message && (
        <div className="success-message" style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#4CAF50',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          animation: 'slideInOut 3s ease-in-out forwards'
        }}>
          {message}
        </div>
      )}
      <div className="profile-image">
        <button className="nav-btn prev">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <img
          src={profile?.profile_photo
                          ? `${process.env.REACT_APP_API_URL}${profile.profile_photo}`
                          : `data:image/svg+xml;utf8,${encodeURIComponent(
                              profile?.gender === "male"
                                ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6">
                <circle cx="12" cy="8" r="5" fill="#bfdbfe"/>
                <path d="M12 14c-4.42 0-8 2.69-8 6v1h16v-1c0-3.31-3.58-6-8-6z" fill="#bfdbfe"/>
              </svg>`
                                : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ec4899">
                <circle cx="12" cy="8" r="5" fill="#fbcfe8"/>
                <path d="M12 14c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6z" fill="#fbcfe8"/>
                <circle cx="12" cy="8" r="2" fill="#ec4899"/>
              </svg>`
                            )}`}
          alt="Profile Photo"
          style={{
            objectFit: "cover",
          }}
        />

        <button className="nav-btn next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill={IsInterested ? "#ff4081" : "none"}
>
            <path
              d="M9 18l6-6-6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="featured-tag">{}</div>
        
        {/* Three-dot menu button */}
        <div className="menu-container" style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10 }}>
          <button 
            className="menu-button" 
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 1)';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.9)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
              <circle cx="12" cy="12" r="1"/>
              <circle cx="19" cy="12" r="1"/>
              <circle cx="5" cy="12" r="1"/>
            </svg>
          </button>
          
          {/* Dropdown menu */}
          {showMenu && (
            <div 
              className="menu-dropdown" 
              onClick={handleMenuClick}
              style={{
                position: 'absolute',
                top: '36px',
                right: '0',
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                minWidth: '160px',
                zIndex: 1000,
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
              }}
            >
              {/* Common options for all users */}
              <div
                className="menu-item"
                onClick={() => {
                  setShowMenu(false);
                  navigate(`/details/${profile.id}`);
                }}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#374151',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                View Profile
              </div>

              {/* Conditional options based on user gender */}
              {activeUser?.gender === 'male' && (
                <>
                  {/* Photo Request - only show if target user is female and has photo privacy as "Yes" */}
                  {profile?.gender === 'female' && profile?.photo_upload_privacy_option === 'Yes' && (
                    <div
                      className="menu-item"
                      onClick={() => {
                        if (photoRequestStatus !== 'pending' && !loadingPhotoStatus && photoRequestStatus !== 'rejected') {
                          setShowMenu(false);
                          requestPhoto(profile.id);
                        }
                      }}
                      style={{
                        padding: '12px 16px',
                        cursor: (photoRequestStatus === 'pending' || loadingPhotoStatus || photoRequestStatus === 'rejected') ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        color: photoRequestStatus === 'rejected' ? '#9ca3af' : '#059669',
                        opacity: (photoRequestStatus === 'pending' || loadingPhotoStatus || photoRequestStatus === 'rejected') ? 0.5 : 1,
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (photoRequestStatus !== 'rejected') {
                          e.target.style.backgroundColor = '#f0fdf4';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                      </svg>
                    {(() => {
                      if (loadingPhotoStatus) return 'Checking...';
                      if (photoRequestStatus === 'pending') return 'Request Sent ✓';
                      if (photoRequestStatus === 'accepted') return 'Request Accepted ✓';
                      if (photoRequestStatus === 'rejected') return 'Request Rejected ✗';
                      return 'Request Photo';
                    })()}
                    </div>
                  )}

                  <div
                    className="menu-item"
                    onClick={() => {
                      setShowMenu(false);
                      shortlist(profile.id);
                    }}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#374151',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f3f4f6';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 21 21" fill="none">
                      <path
                        d="M2.68945 3.62109V7.37109H6.43945V3.62109H2.68945ZM3.93945 4.87109H5.18945V6.12109H3.93945V4.87109ZM7.68945 4.87109V6.12109H17.0645V4.87109H7.68945ZM2.68945 8.62109V12.3711H6.43945V8.62109H2.68945ZM3.93945 9.87109H5.18945V11.1211H3.93945V9.87109ZM7.68945 9.87109V11.1211H17.0645V9.87109H7.68945ZM2.68945 13.6211V17.3711H6.43945V13.6211H2.68945ZM3.93945 14.8711H5.18945V16.1211H3.93945V14.8711ZM7.68945 14.8711V16.1211H17.0645V14.8711H7.68945Z"
                        fill="#FD2C79"
                      />
                    </svg>
                    Shortlist
                  </div>

                  <div
                    className="menu-item"
                    onClick={() => {
                      setShowMenu(false);
                      blocked(profile.id);
                    }}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#dc2626',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#fef2f2';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 21 20" fill="none">
                      <path
                        d="M10.2598 1.87109C8.78841 1.87109 7.42122 2.24219 6.1582 2.98438C4.93424 3.70052 3.96419 4.67057 3.24805 5.89453C2.50586 7.15755 2.13477 8.52474 2.13477 9.99609C2.13477 11.4674 2.50586 12.8346 3.24805 14.0977C3.96419 15.3216 4.93424 16.2917 6.1582 17.0078C7.42122 17.75 8.78841 18.1211 10.2598 18.1211C11.7311 18.1211 13.0983 17.75 14.3613 17.0078C15.5853 16.2917 16.5553 15.3216 17.2715 14.0977C18.0137 12.8346 18.3848 11.4674 18.3848 9.99609C18.3848 8.52474 18.0137 7.15755 17.2715 5.89453C16.5553 4.67057 15.5853 3.70052 14.3613 2.98438C13.0983 2.24219 11.7311 1.87109 10.2598 1.87109ZM10.2598 3.12109C11.5098 3.12109 12.6686 3.43359 13.7363 4.05859C14.765 4.67057 15.5853 5.49089 16.1973 6.51953C16.8223 7.58724 17.1348 8.74609 17.1348 9.99609C17.1348 10.8294 16.9915 11.6367 16.7051 12.418C16.4186 13.1602 16.015 13.8372 15.4941 14.4492L5.9043 4.66406C6.50326 4.16927 7.17383 3.78841 7.91602 3.52148C8.6582 3.25456 9.43945 3.12109 10.2598 3.12109ZM5.02539 5.54297L14.6152 15.3281C14.0163 15.8229 13.3457 16.2038 12.6035 16.4707C11.8613 16.7376 11.0801 16.8711 10.2598 16.8711C9.00977 16.8711 7.85091 16.5586 6.7832 15.9336C5.75456 15.3216 4.93424 14.5013 4.32227 13.4727C3.69727 12.4049 3.38477 11.2461 3.38477 9.99609C3.38477 9.16276 3.52799 8.35547 3.81445 7.57422C4.10091 6.83203 4.50456 6.15495 5.02539 5.54297Z"
                        fill="#dc2626"
                      />
                    </svg>
                    Block User
                  </div>
                </>
              )}

              {/* Female user options - only Block and Report */}
              {activeUser?.gender === 'female' && (
                <>
                  <div
                    className="menu-item"
                    onClick={() => {
                      setShowMenu(false);
                      reportUser(profile.id);
                    }}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#dc2626',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#fef2f2';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                      <line x1="4" y1="22" x2="4" y2="15"/>
                    </svg>
                    Report User
                  </div>

                  <div
                    className="menu-item"
                    onClick={() => {
                      setShowMenu(false);
                      blocked(profile.id);
                    }}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#dc2626',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#fef2f2';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 21 20" fill="none">
                      <path
                        d="M10.2598 1.87109C8.78841 1.87109 7.42122 2.24219 6.1582 2.98438C4.93424 3.70052 3.96419 4.67057 3.24805 5.89453C2.50586 7.15755 2.13477 8.52474 2.13477 9.99609C2.13477 11.4674 2.50586 12.8346 3.24805 14.0977C3.96419 15.3216 4.93424 16.2917 6.1582 17.0078C7.42122 17.75 8.78841 18.1211 10.2598 18.1211C11.7311 18.1211 13.0983 17.75 14.3613 17.0078C15.5853 16.2917 16.5553 15.3216 17.2715 14.0977C18.0137 12.8346 18.3848 11.4674 18.3848 9.99609C18.3848 8.52474 18.0137 7.15755 17.2715 5.89453C16.5553 4.67057 15.5853 3.70052 14.3613 2.98438C13.0983 2.24219 11.7311 1.87109 10.2598 1.87109ZM10.2598 3.12109C11.5098 3.12109 12.6686 3.43359 13.7363 4.05859C14.765 4.67057 15.5853 5.49089 16.1973 6.51953C16.8223 7.58724 17.1348 8.74609 17.1348 9.99609C17.1348 10.8294 16.9915 11.6367 16.7051 12.418C16.4186 13.1602 16.015 13.8372 15.4941 14.4492L5.9043 4.66406C6.50326 4.16927 7.17383 3.78841 7.91602 3.52148C8.6582 3.25456 9.43945 3.12109 10.2598 3.12109ZM5.02539 5.54297L14.6152 15.3281C14.0163 15.8229 13.3457 16.2038 12.6035 16.4707C11.8613 16.7376 11.0801 16.8711 10.2598 16.8711C9.00977 16.8711 7.85091 16.5586 6.7832 15.9336C5.75456 15.3216 4.93424 14.5013 4.32227 13.4727C3.69727 12.4049 3.38477 11.2461 3.38477 9.99609C3.38477 9.16276 3.52799 8.35547 3.81445 7.57422C4.10091 6.83203 4.50456 6.15495 5.02539 5.54297Z"
                        fill="#dc2626"
                      />
                    </svg>
                    Block User
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="profile-info" style={{ padding: "16px 12px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "initial",
          }}
        >
          <div
            className="profile-details"
            style={{ display: "flex", flexDirection: "column", gap: "0rem" }}
          >
            <div
              className="profile-header"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <h3
                style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
              >
{profile?.name
  ? profile.name.split(" ").slice(0, 1).join(" ") + (profile.name.split(" ").length > 10 ? "..." : "")
  : "Not Mentioned"}
                <span
                  className="marital-status-badge"
                  style={{
                    height: "1.8rem",
                    fontSize: "0.6rem",
                    padding: "0.3rem 0.8rem",
                    backgroundColor: getMaritalStatusColor(profile?.martial_status).bg,
                    color: getMaritalStatusColor(profile?.martial_status).text,
                    border: `1px solid ${getMaritalStatusColor(profile?.martial_status).border}`,
                    margin: "auto",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "1.2rem",
                    whiteSpace: "nowrap",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.2s ease",
                  }}
                >
                {profile?.martial_status ||"Not Mentioned"}
                </span>
              </h3>
              <div className="profile-id-row">
                <span className="profile-id">{profile?.member_id || profile?.id}</span>
              </div>
            </div>

            <p className="sect">
              {profile?.age ? profile.age : "Not Mentioned"}
            </p>
            <p className="sect">
              {profile?.sect_school_info
                ? profile.sect_school_info
                : "Not Mentioned"}
            </p>

            <p className="education">
              {profile?.education ? profile.education : "Not Mentioned"}
            </p>
            <p className="profession">
              {profile?.profession ? profile.profession : "Not Mentioned"}
            </p>
            <button
              className="message-btn"
              style={{ marginTop: "0.5rem" }}
              onClick={() => {
                // Navigate to inbox and request opening this user's conversation
                navigate(`/${userId}/inbox/`, { state: { openUserId: profile.id } });
              }}
            >
              Message
            </button>
          </div>
          <div className="profile-actions" style={{ marginTop: "0" }}>
            <div
              className="action-buttons"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "initial",
              }}
            >
              <button
                type="button"
                onClick={() => interested({action_on_id:profile.id,interested_id:interested_id})}
                className="action-btn full-profile-btn"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={IsInterested ? "#ff4081" : "none"}
                  stroke="#ff4081"
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
               {''}
              </button>
              <button
onClick={() => navigate(`/details/${profile.id}`)}
className="action-btn full-profile-btn"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="#ff4081"
                >
                  <path
                    d="M6.59961 2.60039C6.09128 2.60039 5.62253 2.72539 5.19336 2.97539C4.76419 3.22539 4.42461 3.56497 4.17461 3.99414C3.92461 4.42331 3.79961 4.89206 3.79961 5.40039C3.79961 5.87539 3.91003 6.31706 4.13086 6.72539C4.35169 7.13372 4.65378 7.46706 5.03711 7.72539C4.56211 7.93372 4.13919 8.22122 3.76836 8.58789C3.39753 8.95456 3.11211 9.37539 2.91211 9.85039C2.70378 10.3421 2.59961 10.8587 2.59961 11.4004H3.39961C3.39961 10.8171 3.54336 10.2816 3.83086 9.79414C4.11836 9.30664 4.50586 8.91914 4.99336 8.63164C5.48086 8.34414 6.01628 8.20039 6.59961 8.20039C7.18294 8.20039 7.71836 8.34414 8.20586 8.63164C8.69336 8.91914 9.08086 9.30664 9.36836 9.79414C9.65586 10.2816 9.79961 10.8171 9.79961 11.4004H10.5996C10.5996 10.8587 10.4954 10.3421 10.2871 9.85039C10.0871 9.37539 9.80169 8.95456 9.43086 8.58789C9.06003 
8.22122 8.63711 7.93372 8.16211 7.72539C8.54544 7.46706 8.84753 7.13372 9.06836 6.72539C9.28919 6.31706 9.39961 5.87539 9.39961
 5.40039C9.39961 4.89206 9.27461 4.42331 9.02461 3.99414C8.77461 3.56497 8.43503 3.22539 8.00586 2.97539C7.57669 2.72539 7.10794 
 2.60039 6.59961 2.60039ZM6.59961 3.40039C6.96628 3.40039 7.30169 3.48997 7.60586 3.66914C7.91003 3.84831 8.15169 4.08997 8.33086
  4.39414C8.51003 4.69831 8.59961 5.03372 8.59961 5.40039C8.59961 5.76706 8.51003 6.10247 8.33086 6.40664C8.15169 6.71081 7.91003 6.95247 7.60586 7.13164C7.30169 7.31081 6.96628 7.40039 6.59961 7.40039C6.23294 7.40039 5.89753 7.31081 5.59336 7.13164C5.28919 6.95247 5.04753 6.71081 4.86836 6.40664C4.68919 6.10247 4.59961 5.76706 4.59961 5.40039C4.59961 5.03372 4.68919 4.69831 4.86836 4.39414C5.04753 4.08997 5.28919 3.84831 5.59336 3.66914C5.89753 3.48997 6.23294 3.40039 6.59961 3.40039Z"
                    fill="#6D6E6F"
                    strokeWidth="0.5"
                  />
                </svg>
                Full Profile
              </button>
              <button
                className="action-btn shortlist-btn"
                style={{ display: "flex", flexDirection: "column" }}
                onClick={() => shortlist(profile.id)}
              >
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.68945 3.62109V7.37109H6.43945V3.62109H2.68945ZM3.93945 4.87109H5.18945V6.12109H3.93945V4.87109ZM7.68945 4.87109V6.12109H17.0645V4.87109H7.68945ZM2.68945 8.62109V12.3711H6.43945V8.62109H2.68945ZM3.93945 9.87109H5.18945V11.1211H3.93945V9.87109ZM7.68945 9.87109V11.1211H17.0645V9.87109H7.68945ZM2.68945 13.6211V17.3711H6.43945V13.6211H2.68945ZM3.93945 14.8711H5.18945V16.1211H3.93945V14.8711ZM7.68945 14.8711V16.1211H17.0645V14.8711H7.68945Z"
                    fill="#FD2C79"
                  />
                </svg>
                Shortlist
              </button>
              <button
                className="action-btn ignore-btn"
                style={{ display: "flex", flexDirection: "column" }}
                onClick={() => blocked(profile.id)}
              >
                <svg
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.2598 1.87109C8.78841 1.87109 7.42122 2.24219 6.1582 2.98438C4.93424 3.70052 3.96419 4.67057 3.24805 5.89453C2.50586 7.15755 2.13477 8.52474 2.13477 9.99609C2.13477 11.4674 2.50586 12.8346 3.24805 14.0977C3.96419 15.3216 4.93424 16.2917 6.1582 17.0078C7.42122 17.75 8.78841 18.1211 10.2598 18.1211C11.7311 18.1211 13.0983 17.75 14.3613 17.0078C15.5853 16.2917 16.5553 15.3216 17.2715 14.0977C18.0137 12.8346 18.3848 11.4674 18.3848 9.99609C18.3848 8.52474 18.0137 7.15755 17.2715 5.89453C16.5553 4.67057 15.5853 3.70052 14.3613 2.98438C13.0983 2.24219 11.7311 1.87109 10.2598 1.87109ZM10.2598 3.12109C11.5098 3.12109 12.6686 3.43359 13.7363 4.05859C14.765 4.67057 15.5853 5.49089 16.1973 6.51953C16.8223 7.58724 17.1348 8.74609 17.1348 9.99609C17.1348 10.8294 16.9915 11.6367 16.7051 12.418C16.4186 13.1602 16.015 13.8372 15.4941 14.4492L5.9043 4.66406C6.50326 4.16927 7.17383 3.78841 7.91602 3.52148C8.6582 3.25456 9.43945 3.12109 10.2598 3.12109ZM5.02539 5.54297L14.6152 15.3281C14.0163 15.8229 13.3457 16.2038 12.6035 16.4707C11.8613 16.7376 11.0801 16.8711 10.2598 16.8711C9.00977 16.8711 7.85091 16.5586 6.7832 15.9336C5.75456 15.3216 4.93424 14.5013 4.32227 13.4727C3.69727 12.4049 3.38477 11.2461 3.38477 9.99609C3.38477 9.16276 3.52799 8.35547 3.81445 7.57422C4.10091 6.83203 4.50456 6.15495 5.02539 5.54297Z"
                    fill="#FD2C79"
                  />
                </svg>
                Ignore
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
