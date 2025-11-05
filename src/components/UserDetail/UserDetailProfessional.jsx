import React, { useState, useEffect } from 'react';
import MemberSendInterest from '../Dashboard/AgentActions/MemberSendInterest';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDataObjectV2, postDataWithFetchV2, fetchDataWithTokenV2, ReturnResponseFormdataWithoutToken } from '../../apiUtils';
import { deletePhoto as apiDeletePhoto } from '../../services/mmApi';
import Header from '../Dashboard/header/Header';
import './UserDetailProfessional.css';
import Footer from '../sections/Footer';

const UserDetailProfessional = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  
  // Action states
  const [interestStatus, setInterestStatus] = useState(false);
  const [shortlistStatus, setShortlistStatus] = useState(false);
  const [blockStatus, setBlockStatus] = useState(false);

  // Agent member selection modal

  // Gallery states
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [viewingImages, setViewingImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Photo upload/delete states (only for own profile)
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState(null);

  // Photo privacy states (for female users)
  const [canViewPhotos, setCanViewPhotos] = useState(true);
  const [photoPrivacyLoading, setPhotoPrivacyLoading] = useState(false);
  const [photoRequestStatus, setPhotoRequestStatus] = useState(null); // 'pending', 'accepted', 'rejected', null
  const [acceptedMemberInfo, setAcceptedMemberInfo] = useState(null); // Info about which member's request was accepted

  // Agent photo request sidebar states
  const [showPhotoRequestSidebar, setShowPhotoRequestSidebar] = useState(false);
  const [agentMembers, setAgentMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(null);

  // Agent interest sidebar states
  const [showInterestSidebar, setShowInterestSidebar] = useState(false);
  const [agentInterestMembers, setAgentInterestMembers] = useState([]);
  const [loadingInterestMembers, setLoadingInterestMembers] = useState(false);
  const [sendingInterest, setSendingInterest] = useState(null);

  // Agent MemberSendInterest modal
  const [showMemberSendInterest, setShowMemberSendInterest] = useState(false);

  const isOwnProfile = currentUserId && userId && currentUserId.toString() === userId.toString();
  const isAgent = role === "agent";

  useEffect(() => {
    if (userId) {
      const parameter = {
        url: `/api/user/${userId}/`,
        setterFunction: setUserData,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataObjectV2(parameter);

      // Fetch gallery photos
      const galleryParameter = {
        url: `/api/user/add_photo/?user_id=${userId}`,
        setterFunction: setGalleryPhotos,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataWithTokenV2(galleryParameter);
    }
  }, [userId]);

  // Check interest, shortlist, and block status for other users' profiles
  useEffect(() => {
    if (userData && !isOwnProfile && currentUserId) {
      const checkActionStatus = async () => {
        try {
          // For agent, check shortlist separately from agent API
          if (isAgent) {
            // Check shortlist status from agent API
            try {
              await fetchDataWithTokenV2({
                url: `/api/agent/shortlist/?agent_id=${currentUserId}`,
                setterFunction: (data) => {
                  // Find if this user is in agent's shortlist
                  const shortlistItem = (data || []).find(item => 
                    item.action_on && item.action_on.id === Number(userId) && item.shortlisted === true
                  );
                  setShortlistStatus(shortlistItem ? true : false);
                },
                setErrors: (error) => {
                  setShortlistStatus(false);
                }
              });
            } catch (error) {
              setShortlistStatus(false);
            }

            // Check interest and block from regular API
            await fetchDataWithTokenV2({
              url: `/api/recieved/?action_by_id=${currentUserId}&action_on_id=${userId}`,
              setterFunction: (data) => {
                let hasInterest = false;
                let hasBlock = false;

                if (Array.isArray(data)) {
                  data.forEach(item => {
                    const isCurrentUserAction = 
                      (item.action_by && item.action_by.id === Number(currentUserId)) ||
                      (item.action_by_id === Number(currentUserId));
                    
                    const isTargetUser = 
                      (item.action_on && item.action_on.id === Number(userId)) ||
                      (item.action_on_id === Number(userId));

                    if (isCurrentUserAction && isTargetUser) {
                      if (item.interest === true || item.interest === "true") {
                        hasInterest = true;
                      }
                      if (item.blocked === true || item.blocked === "true") {
                        hasBlock = true;
                      }
                    }
                  });
                } else if (data && typeof data === 'object') {
                  const isCurrentUserAction = 
                    (data.action_by && data.action_by.id === Number(currentUserId)) ||
                    (data.action_by_id === Number(currentUserId));
                  
                  const isTargetUser = 
                    (data.action_on && data.action_on.id === Number(userId)) ||
                    (data.action_on_id === Number(userId));

                  if (isCurrentUserAction && isTargetUser) {
                    hasInterest = data.interest === true || data.interest === "true";
                    hasBlock = data.blocked === true || data.blocked === "true";
                  }
                }

                setInterestStatus(hasInterest);
                setBlockStatus(hasBlock);
              },
              setErrors: (error) => {
                setInterestStatus(false);
                setBlockStatus(false);
              }
            });
          } else {
            // Regular user - check all from regular API
            await fetchDataWithTokenV2({
              url: `/api/recieved/?action_by_id=${currentUserId}&action_on_id=${userId}`,
              setterFunction: (data) => {
                let hasInterest = false;
                let hasShortlist = false;
                let hasBlock = false;

                if (Array.isArray(data)) {
                  data.forEach(item => {
                    const isCurrentUserAction = 
                      (item.action_by && item.action_by.id === Number(currentUserId)) ||
                      (item.action_by_id === Number(currentUserId));
                    
                    const isTargetUser = 
                      (item.action_on && item.action_on.id === Number(userId)) ||
                      (item.action_on_id === Number(userId));

                    if (isCurrentUserAction && isTargetUser) {
                      if (item.interest === true || item.interest === "true") {
                        hasInterest = true;
                      }
                      if (item.shortlisted === true || item.shortlisted === "true") {
                        hasShortlist = true;
                      }
                      if (item.blocked === true || item.blocked === "true") {
                        hasBlock = true;
                      }
                    }
                  });
                } else if (data && typeof data === 'object') {
                  const isCurrentUserAction = 
                    (data.action_by && data.action_by.id === Number(currentUserId)) ||
                    (data.action_by_id === Number(currentUserId));
                  
                  const isTargetUser = 
                    (data.action_on && data.action_on.id === Number(userId)) ||
                    (data.action_on_id === Number(userId));

                  if (isCurrentUserAction && isTargetUser) {
                    hasInterest = data.interest === true || data.interest === "true";
                    hasShortlist = data.shortlisted === true || data.shortlisted === "true";
                    hasBlock = data.blocked === true || data.blocked === "true";
                  }
                }

                setInterestStatus(hasInterest);
                setShortlistStatus(hasShortlist);
                setBlockStatus(hasBlock);
              },
              setErrors: (error) => {
                setInterestStatus(false);
                setShortlistStatus(false);
                setBlockStatus(false);
              }
            });
          }
        } catch (error) {
          // Fallback: set all to false if error occurs
          setInterestStatus(false);
          setShortlistStatus(false);
          setBlockStatus(false);
        }
      };

      checkActionStatus();
    }
  }, [userData, isOwnProfile, currentUserId, userId, isAgent]);

  // Check photo request status for "Only to users whom I approve"
  const checkPhotoRequestStatus = async (currentUserId, targetUserId) => {
    setPhotoPrivacyLoading(true);
    
    try {
      const baseUrl = process.env.REACT_APP_API_URL;
      const endpoints = [
        `${baseUrl}/api/user/photo-request/?user_id=${targetUserId}`,
        `${baseUrl}/api/recieved/?action_by_id=${currentUserId}&action_on_id=${targetUserId}`,
        `${baseUrl}/api/user/photo-request/?action_by_id=${currentUserId}&action_on_id=${targetUserId}`
      ];
      
      let response;
      let data;
      let success = false;
      
      for (const endpoint of endpoints) {
        try {
          response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`
            }
          });
          
          if (response.ok) {
            const responseText = await response.text();
            
            // Check if response is HTML (error page)
            if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
              continue;
            }
            
            try {
              data = JSON.parse(responseText);
              success = true;
              break;
            } catch (parseError) {
              continue;
            }
          }
        } catch (endpointError) {
          // Continue to next endpoint
        }
      }
      
      if (!success) {
        setCanViewPhotos(false);
        setPhotoRequestStatus(null);
        return;
      }

      if (data && data.length > 0) {
        // Check if current user has sent a request to this profile
        const userRequest = data.find(request => {
          return (request.action_by && request.action_by.id === Number(currentUserId)) ||
                 (request.action_by_id === Number(currentUserId));
        });
        
        if (userRequest) {
          if (userRequest.status === 'Accepted' || userRequest.status === 'accepted') {
            setCanViewPhotos(true);
            setPhotoRequestStatus('accepted');
          } else if (userRequest.status === 'Requested' || userRequest.status === 'requested' || userRequest.status === 'pending') {
            setCanViewPhotos(false);
            setPhotoRequestStatus('pending');
          } else if (userRequest.status === 'Rejected' || userRequest.status === 'rejected') {
            setCanViewPhotos(false);
            setPhotoRequestStatus('rejected');
          } else {
            setCanViewPhotos(false);
            setPhotoRequestStatus(null);
          }
        } else {
          setCanViewPhotos(false);
          setPhotoRequestStatus(null);
        }
      } else {
        setCanViewPhotos(false);
        setPhotoRequestStatus(null);
      }
    } catch (error) {
      console.error('Error checking photo request status:', error);
      setCanViewPhotos(false);
      setPhotoRequestStatus(null);
    } finally {
      setPhotoPrivacyLoading(false);
    }
  };

  // Check agent's member photo requests status
  const checkAgentMemberPhotoRequests = async (targetUserId) => {
    if (!isAgent || !targetUserId) return false;
    
    try {
      setPhotoPrivacyLoading(true);
      const userId = localStorage.getItem('impersonating_user_id') || localStorage.getItem('userId');
      
      // Fetch agent's members
      const membersResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/agent/user_agent/?agent_id=${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!membersResponse.ok) {
        return false;
      }

      const membersData = await membersResponse.json();
      const members = membersData.member || [];
      
      // Check photo requests for each member
      for (const member of members) {
        try {
          const photoRequestResponse = await fetch(
            `${process.env.REACT_APP_API_URL}/api/agent/member/photo-requests/?member_id=${member.id}`,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (photoRequestResponse.ok) {
            const photoRequestData = await photoRequestResponse.json();
            const sentRequests = photoRequestData.sent_requests || [];
            
            // Check if any sent request to target user is accepted
            const acceptedRequest = sentRequests.find(request => {
              // Check multiple possible fields for target user ID
              const targetId = request.target_user_id || 
                              (request.target_user && request.target_user.id) ||
                              (request.action_on_id) ||
                              (request.action_on && request.action_on.id) ||
                              (request.user && request.user.id) ||
                              (request.recipient_id) ||
                              (request.recipient && request.recipient.id);
              
              const isTargetMatch = targetId && parseInt(targetId) === parseInt(targetUserId);
              
              // Check status in multiple possible fields
              const status = request.status || request.request_status || request.photo_request_status;
              const isAccepted = status === 'Accepted' || status === 'accepted' || status === 'Accepted' || status === 'approved';
              
              return isTargetMatch && isAccepted;
            });
            
            if (acceptedRequest) {
              // Check if receiver has blocked the sender (member)
              // Backend logic: if receiver blocked sender, photos should not be visible
              // Check multiple possible fields for block status
              const isBlocked = acceptedRequest.is_blocked || 
                               acceptedRequest.blocked || 
                               acceptedRequest.receiver_blocked_sender ||
                               acceptedRequest.user_blocked_member ||
                               (acceptedRequest.user && acceptedRequest.user.blocked === true) ||
                               (acceptedRequest.target_user && acceptedRequest.target_user.blocked === true);
              
              // Also check if receiver blocked member by checking block status
              // If blocked, don't show photos even if request was accepted
              if (isBlocked) {
                console.log(`Photo request accepted but receiver blocked sender (member ${member.id})`);
                setAcceptedMemberInfo(null);
                setCanViewPhotos(false);
                setPhotoRequestStatus(null);
                return false;
              }
              
              // Additional check: Verify if receiver blocked the member
              // Check via API if target user blocked the member
              try {
                const blockCheckResponse = await fetch(
                  `${process.env.REACT_APP_API_URL}/api/recieved/?action_by_id=${parseInt(targetUserId)}&action_on_id=${member.id}`,
                  {
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token')}`,
                      'Content-Type': 'application/json'
                    }
                  }
                );
                
                if (blockCheckResponse.ok) {
                  const blockData = await blockCheckResponse.json();
                  const blockRecord = Array.isArray(blockData) 
                    ? blockData.find(item => 
                        (item.action_by_id === parseInt(targetUserId) || 
                         (item.action_by && item.action_by.id === parseInt(targetUserId))) &&
                        (item.action_on_id === member.id || 
                         (item.action_on && item.action_on.id === member.id))
                      )
                    : blockData;
                  
                  if (blockRecord && (blockRecord.blocked === true || blockRecord.blocked === "true")) {
                    console.log(`Receiver (${targetUserId}) blocked member (${member.id})`);
                    setAcceptedMemberInfo(null);
                    setCanViewPhotos(false);
                    setPhotoRequestStatus(null);
                    return false;
                  }
                }
              } catch (blockCheckError) {
                console.error('Error checking block status:', blockCheckError);
                // Continue even if block check fails
              }
              
              const memberName = member.name || member.first_name || member.first_name || 'Member';
              
              setAcceptedMemberInfo({
                memberId: member.id,
                memberName: memberName,
                requestDate: acceptedRequest.date || acceptedRequest.created_at
              });
              setCanViewPhotos(true);
              setPhotoRequestStatus('accepted');
              return true;
            }
          }
        } catch (error) {
          console.error(`Error checking photo request for member ${member.id}:`, error);
          continue;
        }
      }
      
      // If no accepted request found but photos are visible, it might be set elsewhere
      // Don't clear acceptedMemberInfo if it's already set
      if (!acceptedMemberInfo) {
        setAcceptedMemberInfo(null);
      }
      
      return false;
    } catch (error) {
      console.error('Error checking agent member photo requests:', error);
      // Don't clear acceptedMemberInfo on error if it was already set
      return false;
    } finally {
      setPhotoPrivacyLoading(false);
    }
  };

  // Check photo privacy for female users
  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');
    const currentUserGender = localStorage.getItem('gender');

    if (userData && userData.gender === 'female' && 
        (currentUserGender === 'male' || isAgent) && 
        currentUserId && userData.id && !isOwnProfile) {
      
      const privacyOption = userData.photo_upload_privacy_option;
      
      let canView = true; // Default to visible
      if (privacyOption) {
        switch (privacyOption) {
          case 'All Member':
            canView = true;
            break;
          case 'Only Matches':
            canView = false; // For now, assume no match
            break;
          case 'Only to users whom I approve':
          case 'Yes':
            // For agents, check if any member's photo request was accepted
            if (isAgent) {
              checkAgentMemberPhotoRequests(userData.id);
              return; // Exit early, will be handled by checkAgentMemberPhotoRequests
            } else {
              // Regular user - check current user's photo request
              checkPhotoRequestStatus(currentUserId, userData.id);
              return; // Exit early, will be handled by checkPhotoRequestStatus
            }
          default:
            canView = true;
        }
      }
      
      setCanViewPhotos(canView);
      setPhotoPrivacyLoading(false);
    } else {
      setCanViewPhotos(true);
      setPhotoPrivacyLoading(false);
    }
  }, [userData, isOwnProfile, currentUserId, isAgent]);

  // Periodic check for photo request status updates
  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');
    const currentUserGender = localStorage.getItem('gender');

    // Only set up periodic checking for male/agent users viewing female profiles with "Only to users whom I approve"
    if (userData && userData.gender === 'female' && 
        (currentUserGender === 'male' || isAgent) && 
        (userData.photo_upload_privacy_option === 'Only to users whom I approve' || 
         userData.photo_upload_privacy_option === 'Yes') && 
        currentUserId && userData.id && !isOwnProfile) {
      
      // Check immediately
      if (isAgent) {
        checkAgentMemberPhotoRequests(userData.id);
      } else {
        checkPhotoRequestStatus(currentUserId, userData.id);
      }
      
      // Set up periodic checking every 10 seconds
      const interval = setInterval(() => {
        if (isAgent) {
          checkAgentMemberPhotoRequests(userData.id);
        } else {
          checkPhotoRequestStatus(currentUserId, userData.id);
        }
      }, 10000); // 10 seconds

      // Cleanup interval on component unmount or when dependencies change
      return () => {
        clearInterval(interval);
      };
    }
  }, [userData?.id, userData?.gender, userData?.photo_upload_privacy_option, isOwnProfile, isAgent]);

  // Profile Image
  const getProfileImage = () => {
    if (userData?.profile_photo) {
      return `${process.env.REACT_APP_API_URL}${userData.profile_photo}`;
    }
    return userData?.gender === "male" 
      ? `data:image/svg+xml;utf8,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6">
            <circle cx="12" cy="8" r="5" fill="#bfdbfe"/>
            <path d="M12 14c-4.42 0-8 2.69-8 6v1h16v-1c0-3.31-3.58-6-8-6z" fill="#bfdbfe"/>
          </svg>`
        )}`
      : `data:image/svg+xml;utf8,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ec4899">
            <circle cx="12" cy="8" r="5" fill="#fbcfe8"/>
            <path d="M12 14c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6z" fill="#fbcfe8"/>
          </svg>`
        )}`;
  };

  // Action Handlers
  const handleInterest = () => {
    if (interestStatus) {
      if (window.confirm('Are you sure you want to withdraw your interest?')) {
        sendAction('interest', false);
      }
    } else {
      // If agent, open MemberSendInterest modal (instead of custom sidebar)
      if (isAgent) {
        setShowMemberSendInterest(true);
        return;
      } else {
        // Regular user - send directly
        sendAction('interest', true);
      }
    }
  };

  const handleShortlist = () => {
    const newShortlistStatus = !shortlistStatus;
    
    // For agent, use agent shortlist API endpoint
    // For regular user, use regular shortlist API
    if (isAgent) {
      // Agent shortlist API
      const parameter = {
        url: `/api/agent/shortlist/`,
        payload: {
          action_on_id: parseInt(userId),
          shortlisted: newShortlistStatus
        },
        setErrors: setErrors,
        tofetch: {
          items: [{
            fetchurl: `/api/user/${userId}/`,
            dataset: setUserData,
            setErrors: setErrors
          }],
          setErrors: setErrors
        }
      };

      postDataWithFetchV2(parameter);
    } else {
      // Regular user shortlist API
      const parameter = {
        url: `/api/recieved/`,
        payload: {
          action_by_id: currentUserId,
          action_on_id: userId,
          shortlisted: newShortlistStatus
        },
        setErrors: setErrors,
        tofetch: {
          items: [{
            fetchurl: `/api/user/${userId}/`,
            dataset: setUserData,
            setErrors: setErrors
          }],
          setErrors: setErrors
        }
      };

      postDataWithFetchV2(parameter);
    }
    
    // Update local state
    setShortlistStatus(newShortlistStatus);
    
    if (newShortlistStatus) {
      alert(isAgent ? 'Added to your shortlist successfully!' : 'Added to shortlist successfully!');
    } else {
      alert(isAgent ? 'Removed from your shortlist!' : 'Removed from shortlist!');
    }
  };

  const handleBlock = () => {
    const isCurrentlyBlocked = blockStatus;
    
    const parameter = {
      url: isCurrentlyBlocked ? `/api/recieved/unblock/` : `/api/recieved/block/`,
      payload: {
        action_by_id: currentUserId,
        action_on_id: userId
      },
      setErrors: setErrors,
      tofetch: {
        items: [{
          fetchurl: `/api/user/${userId}/`,
          dataset: setUserData,
          setErrors: setErrors
        }],
        setErrors: setErrors
      }
    };

    postDataWithFetchV2(parameter);
    
    // Update local state
    setBlockStatus(!isCurrentlyBlocked);
  };

  const sendAction = (actionType, value) => {
    const payload = {
      action_by_id: currentUserId,
      action_on_id: userId,
      [actionType]: value
    };

    const parameter = {
      url: `/api/recieved/`,
      payload,
      setErrors: setErrors,
      tofetch: {
        items: [{
          fetchurl: `/api/user/${userId}/`,
          dataset: setUserData,
          setErrors: setErrors
        }],
        setErrors: setErrors
      }
    };

    postDataWithFetchV2(parameter);

    // Update local state
    if (actionType === 'interest') setInterestStatus(value);
  };

  // Helper function to get full photo URL
  const getPhotoUrl = (photoUrl) => {
    if (!photoUrl) return '';
    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      return photoUrl;
    }
    if (photoUrl.startsWith('/')) {
      return `${process.env.REACT_APP_API_URL || ''}${photoUrl}`;
    }
    return photoUrl;
  };

  // Refresh gallery photos
  const refreshGallery = () => {
    if (userId) {
      const galleryParameter = {
        url: `/api/user/add_photo/?user_id=${userId}`,
        setterFunction: setGalleryPhotos,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataWithTokenV2(galleryParameter);
    }
  };

  // Photo upload handlers
  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('Kuch files invalid hain. Sirf images aur videos allow hain aur maximum size 10MB hai.');
    }
    setSelectedFiles(validFiles);
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      alert('Pehle koi file select kariye');
      return;
    }

    setUploading(true);
    
    // Upload first file
    const firstFile = selectedFiles[0];
    const formData = new FormData();
    formData.append('upload_photo', firstFile);
    formData.append('user_id', userId);

    const parameter = {
      url: '/api/user/add_photo/',
      setUserId: () => {
        // Success callback
        if (selectedFiles.length > 1) {
          // Upload remaining files
          uploadRemainingFiles(1);
        } else {
          // All files uploaded
          alert('Photos successfully upload ho gayi!');
          setSelectedFiles([]);
          setShowUploadModal(false);
          setUploading(false);
          refreshGallery();
        }
      },
      formData: formData,
      setErrors: (error) => {
        alert('Upload mein koi problem aayi. Please try again.');
        setUploading(false);
      },
      setLoading: setLoading,
    };

    ReturnResponseFormdataWithoutToken(parameter);
  };

  const uploadRemainingFiles = (index) => {
    if (index >= selectedFiles.length) {
      // All files uploaded
      alert('Photos successfully upload ho gayi!');
      setSelectedFiles([]);
      setShowUploadModal(false);
      setUploading(false);
      refreshGallery();
      return;
    }

    const file = selectedFiles[index];
    const formData = new FormData();
    formData.append('upload_photo', file);
    formData.append('user_id', userId);

    const parameter = {
      url: '/api/user/add_photo/',
      setUserId: () => {
        uploadRemainingFiles(index + 1);
      },
      formData: formData,
      setErrors: (error) => {
        alert('Upload mein koi problem aayi. Please try again.');
        setUploading(false);
      },
      setLoading: setLoading,
    };

    ReturnResponseFormdataWithoutToken(parameter);
  };

  // Photo delete handlers
  const handleDeletePhoto = (photoId, photoUrl) => {
    setPhotoToDelete({ id: photoId, url: photoUrl });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!photoToDelete) return;

    setDeletingPhoto(photoToDelete.id);
    setShowDeleteModal(false);
    
    try {
      await apiDeletePhoto(photoToDelete.id);
      refreshGallery();
      setDeletingPhoto(null);
      alert('Photo successfully delete ho gayi!');
    } catch (error) {
      alert('Delete mein koi problem aayi. Please try again.');
      setDeletingPhoto(null);
    }
    
    setPhotoToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPhotoToDelete(null);
  };

  // Fetch agent's male members
  const fetchAgentMembers = async () => {
    if (!isAgent) return;
    
    try {
      setLoadingMembers(true);
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/agent/male-members/`,
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
      // Set male members directly from API response
      setAgentMembers(data.male_members || []);
    } catch (error) {
      console.error('Error fetching agent members:', error);
      alert('Failed to load members');
    } finally {
      setLoadingMembers(false);
    }
  };

  // Fetch agent's members for interest (with gender compatibility)
  const fetchAgentInterestMembers = async () => {
    if (!isAgent || !userData) return;
    
    try {
      setLoadingInterestMembers(true);
      const userId = localStorage.getItem('impersonating_user_id') || localStorage.getItem('userId');
      
      // Fetch all agent members
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
      const allMembers = data.member || [];
      
      // Filter based on target user gender
      // If target user is female, show male members
      // If target user is male, show female members
      const targetGender = userData.gender?.toLowerCase();
      
      let compatibleMembers = [];
      if (targetGender === 'female') {
        // Target is female, show male members
        compatibleMembers = allMembers.filter(member => 
          member.gender && member.gender.toLowerCase() === 'male'
        );
      } else if (targetGender === 'male') {
        // Target is male, show female members
        compatibleMembers = allMembers.filter(member => 
          member.gender && member.gender.toLowerCase() === 'female'
        );
      } else {
        // If gender not clear, show all members
        compatibleMembers = allMembers;
      }
      
      setAgentInterestMembers(compatibleMembers);
    } catch (error) {
      console.error('Error fetching agent interest members:', error);
      alert('Failed to load members');
    } finally {
      setLoadingInterestMembers(false);
    }
  };

  // Handle photo request
  const handlePhotoRequest = () => {
    if (!userData || !userData.id) {
      alert('User data not available');
      return;
    }

    const currentUserId = localStorage.getItem('userId');
    if (!currentUserId) {
      alert('Please login to request photos');
      return;
    }

    // For agents, open sidebar instead
    if (isAgent) {
      setShowPhotoRequestSidebar(true);
      fetchAgentMembers();
      return;
    }

    // Check if already requested (pending)
    if (photoRequestStatus === 'pending') {
      alert('Photo request already sent - waiting for approval');
      return;
    }

    // Allow sending request again if previously rejected

    const parameter = {
      url: `/api/user/photo-request/`,
      payload: {
        action_on_id: Number(userData.id),
        status: 'Requested'
      },
      setErrors: (error) => {
        console.error('Photo request error:', error);
        if (error && error.already_sent === true) {
          alert('Photo request already sent!');
          setPhotoRequestStatus('pending');
        } else {
          alert('Failed to send photo request. Please try again.');
        }
      },
      setSuccessMessage: (message) => {
        console.log('Photo request success:', message);
        alert('Photo request sent successfully!');
        setPhotoRequestStatus('pending');
        
        // After successful request, check status again to update UI
        setTimeout(() => {
          if (currentUserId && userData?.id) {
            checkPhotoRequestStatus(currentUserId, userData.id);
          }
        }, 2000);
      },
    };
    
    postDataWithFetchV2(parameter);
  };

  // Send interest on behalf of member (for agents)
  const handleSendInterestOnBehalf = async (member) => {
    if (!userData || !userData.id || !member) {
      alert('Invalid data');
      return;
    }

    // Gender compatibility check
    const memberGender = member.gender?.toLowerCase();
    const targetGender = userData.gender?.toLowerCase();
    
    if (memberGender === targetGender) {
      alert(`Gender compatibility error: ${memberGender === 'male' ? 'Male' : 'Female'} members can only send interest to ${memberGender === 'male' ? 'Female' : 'Male'} profiles.`);
      return;
    }

    try {
      setSendingInterest(member.id);
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/agent/member/send-interest/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            member_id: member.id,  // Agent ka member ID
            target_user_id: parseInt(userData.id)  // Target user ID
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const memberName = member.name || member.first_name || 'member';
        const targetUserName = userData.name || userData.first_name || 'user';
        alert(`Interest sent successfully from ${memberName} to ${targetUserName}!`);
        setShowInterestSidebar(false);
        // Refresh interest status
        setTimeout(() => {
          if (userData?.id) {
            // Refetch user data to update interest status
            const parameter = {
              url: `/api/user/${userId}/`,
              setterFunction: (data) => {
                // Update interest status if needed
              },
              setErrors: (error) => console.error(error),
            };
            fetchDataObjectV2(parameter);
          }
        }, 2000);
      } else {
        const errorData = await response.json();
        
        if (errorData.error && errorData.error.includes('Gender')) {
          alert(`Gender compatibility error: ${errorData.error}`);
        } else if (errorData.error && errorData.error.includes('already')) {
          alert('Interest already sent by this member!');
        } else if (errorData.error && errorData.error.includes('blocked')) {
          alert('Cannot send interest: User is blocked!');
        } else {
          alert(errorData.error || errorData.message || 'Failed to send interest');
        }
      }
    } catch (error) {
      console.error('Error sending interest:', error);
      alert('Failed to send interest. Please try again.');
    } finally {
      setSendingInterest(null);
    }
  };

  // Send photo request on behalf of member (for agents)
  const handleSendPhotoRequestOnBehalf = async (member) => {
    if (!userData || !userData.id || !member) {
      alert('Invalid data');
      return;
    }

    try {
      setSendingRequest(member.id);
      
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/agent/photo-request/send/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action_by_id: member.id,  // Agent ka male member ID
            action_on_id: parseInt(userData.id)  // Target user ID
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const memberName = member.name || member.first_name || 'member';
        const targetUserName = userData.name || userData.first_name || 'user';
        alert(`Photo request sent successfully from ${memberName} to ${targetUserName}!`);
        setShowPhotoRequestSidebar(false);
        // Refresh gallery to check if photos are now visible
        setTimeout(() => {
          if (userData?.id) {
            checkPhotoRequestStatus(member.id, userData.id);
          }
        }, 2000);
      } else {
        const errorData = await response.json();
        
        if (errorData.error && errorData.error.includes('Gender')) {
          alert(`Gender compatibility error: ${errorData.error}`);
        } else if (errorData.error && errorData.error.includes('already')) {
          alert('Photo request already sent by this member!');
        } else {
          alert(errorData.error || errorData.message || 'Failed to send photo request');
        }
      }
    } catch (error) {
      console.error('Error sending photo request:', error);
      alert('Failed to send photo request. Please try again.');
    } finally {
      setSendingRequest(null);
    }
  };

  // Gallery handlers
  const handlePhotoClick = (photoUrl) => {
    const allUrls = (galleryPhotos || []).map(p => getPhotoUrl(p?.upload_photo)).filter(Boolean);
    const currentIndex = allUrls.indexOf(getPhotoUrl(photoUrl));
    setViewingImages(allUrls);
    setCurrentImageIndex(currentIndex >= 0 ? currentIndex : 0);
  };

  const handleCloseLightbox = () => {
    setViewingImages([]);
    setCurrentImageIndex(0);
  };

  const handleNextPhoto = () => {
    setCurrentImageIndex((prev) => (prev + 1) % viewingImages.length);
  };

  const handlePrevPhoto = () => {
    setCurrentImageIndex((prev) => (prev - 1 + viewingImages.length) % viewingImages.length);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyboard = (e) => {
      if (viewingImages.length === 0) return;
      
      if (e.key === 'Escape') {
        handleCloseLightbox();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPhoto();
      } else if (e.key === 'ArrowRight') {
        handleNextPhoto();
      }
    };
    
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [viewingImages, currentImageIndex]);

  if (loading) {
    return (
      <div className="professional-profile">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (errors || !userData) {
    return (
      <div className="professional-profile">
        <Header />
        <div className="error-container">
          <h2>Profile not found</h2>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="professional-profile">
      <Header />
      
      <div className="profile-container">
        {/* Hero Section */}
        <div className="profile-hero">
          <div className="hero-content">
            <div className="profile-image-wrapper">
              <img 
                src={getProfileImage()} 
                alt={userData.name}
                className="profile-image"
              />
              <div className="profile-status online"></div>
            </div>
            
            <div className="profile-header-info">
              <div className="profile-name-section">
                <h1 className="profile-name">{userData.name}</h1>
                <p className="profile-id">Member ID: {userData.member_id}</p>
              </div>
              
              <div className="profile-location">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>{userData.city}, {userData.state}</span>
              </div>
              
              <div className="profile-meta">
                <span className="meta-item">
                  <strong>{userData.age}</strong> years
                </span>
                <span className="meta-divider">•</span>
                <span className="meta-item">
                  <strong>{userData.martial_status}</strong>
                </span>
                <span className="meta-divider">•</span>
                <span className="meta-item">
                  <strong>{userData.Education}</strong>
                </span>
              </div>
            </div>

            {/* Action Buttons for Other Profiles */}
            {!isOwnProfile && (
              <div className="profile-actions">
                <button 
                  className={`action-btn ${interestStatus ? 'active' : ''}`}
                  onClick={handleInterest}
                  title={interestStatus ? 'Withdraw Interest' : 'Send Interest'}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={interestStatus ? "currentColor" : "none"} stroke="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2"/>
                  </svg>
                </button>
                
                <button 
                  className={`action-btn ${shortlistStatus ? 'active' : ''}`}
                  onClick={handleShortlist}
                  title={shortlistStatus ? 'Remove from Shortlist' : 'Add to Shortlist'}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={shortlistStatus ? "currentColor" : "none"} stroke="currentColor">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" strokeWidth="2"/>
                  </svg>
                </button>
                
                <button 
                  className={`action-btn ${blockStatus ? 'blocked' : ''}`}
                  onClick={handleBlock}
                  title={blockStatus ? 'Unblock User' : 'Block User'}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <path d="M4.93 4.93l14.14 14.14" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
            )}

            {/* Edit Button for Own Profile */}
            {isOwnProfile && (
              <div className="profile-actions">
                <button 
                  className="action-btn edit-btn"
                  onClick={() => navigate(`/memstepone/${userId}`)}
                  title="Edit Profile"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  <span className="edit-btn-text">Edit Profile</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Info
          </button>
          <button 
            className={`tab-btn ${activeTab === 'religious' ? 'active' : ''}`}
            onClick={() => setActiveTab('religious')}
          >
            Religious Info
          </button>
          <button 
            className={`tab-btn ${activeTab === 'family' ? 'active' : ''}`}
            onClick={() => setActiveTab('family')}
          >
            Family Background
          </button>
          <button 
            className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            Partner Preferences
          </button>
          <button 
            className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            Gallery
          </button>
        </div>

        {/* Tab Content */}
        <div className="profile-content">
          
          {/* Basic Information */}
          {activeTab === 'basic' && (
            <div className="tab-content">
              <div className="info-grid">
                {/* Row 1: Personal Details + Location */}
                <InfoCard title="Personal Details">
                  <InfoRow label="Full Name" value={userData.name} />
                  <InfoRow label="Gender" value={userData.gender} />
                  <InfoRow label="Age" value={userData.age} />
                  <InfoRow label="Date of Birth" value={userData.dob} />
                  <InfoRow label="Marital Status" value={userData.martial_status} />
                  <InfoRow label="Height" value={userData.height} />
                  <InfoRow label="Weight" value={userData.weight} />
                  <InfoRow label="Skin Tone" value={userData.skin_tone} />
                  <InfoRow label="Disability" value={userData.disability || 'None'} />
                </InfoCard>

                <InfoCard title="Location">
                  <InfoRow label="Current City" value={userData.city} />
                  <InfoRow label="Current State" value={userData.state} />
                  <InfoRow label="Current Country" value={userData.country} />
                  <InfoRow label="Native City" value={userData.native_city} />
                  <InfoRow label="Native State" value={userData.native_state} />
                  <InfoRow label="Native Country" value={userData.native_country} />
                </InfoCard>

                {/* Row 2: Professional Details + About */}
                <InfoCard title="Professional Details">
                  <InfoRow label="Education" value={userData.Education} />
                  <InfoRow label="Profession" value={userData.profession} />
                  <InfoRow label="Job Description" value={userData.describe_job_business} />
                  <InfoRow label="Annual Income" value={userData.income} />
                </InfoCard>

                {userData.about_you ? (
                  <InfoCard title="About">
                    <p className="about-text">{userData.about_you}</p>
                  </InfoCard>
                ) : (
                  <InfoCard title="About">
                    <p className="about-text">No description provided yet.</p>
                  </InfoCard>
                )}
              </div>
            </div>
          )}

          {/* Religious Information */}
          {activeTab === 'religious' && (
            <div className="tab-content">
              <div className="info-grid">
                <InfoCard title="Religious Beliefs">
                  <InfoRow label="Sect/School of Thought" value={userData.sect_school_info} />
                  <InfoRow label="Belief in Dargah/Fatiha/Niyah" value={userData.believe_in_dargah_fatiha_niyah} />
                  <InfoRow label="Islamic Practice Level" value={userData.islamic_practicing_level} />
                  <InfoRow label="Namaz Performance" value={userData.perform_namaz} />
                  <InfoRow label="Quran Recitation" value={userData.recite_quran} />
                  {userData.gender === 'female' && (
                    <InfoRow label="Hijab/Niqab Preference" value={userData.hijab_niqab_prefer} />
                  )}
                </InfoCard>

                <InfoCard title="Marriage Plans">
                  <InfoRow label="Marriage Timeline" value={userData.marriage_plan} />
                  <InfoRow label="Cultural Background" value={userData.cultural_background} />
                </InfoCard>
              </div>
            </div>
          )}

          {/* Family Background */}
          {activeTab === 'family' && (
            <div className="tab-content">
              <div className="info-grid">
                <InfoCard title="Parents">
                  <InfoRow label="Father's Name" value={userData.father_name} />
                  <InfoRow label="Father's Occupation" value={userData.father_occupation} />
                  <InfoRow label="Mother's Name" value={userData.mother_name} />
                  <InfoRow label="Mother's Occupation" value={userData.mother_occupation} />
                </InfoCard>

                <InfoCard title="Family Details">
                  <InfoRow label="Family Type" value={userData.family_type} />
                  <InfoRow label="Family Practice Level" value={userData.family_practicing_level} />
                  <InfoRow label="Number of Siblings" value={userData.number_of_siblings} />
                  <InfoRow label="Number of Brothers" value={userData.number_of_brothers} />
                  <InfoRow label="Number of Sisters" value={userData.number_of_sisters} />
                </InfoCard>

                {userData.gender === 'female' && (
                  <InfoCard title="Wali Information">
                    <InfoRow label="Wali Name" value={userData.wali_name} />
                    <InfoRow label="Wali Contact" value={userData.wali_contact_number} />
                    <InfoRow label="Wali Relation" value={userData.wali_blood_relation} />
                  </InfoCard>
                )}

                {(userData.martial_status === 'divorced' || userData.martial_status === 'widowed') && (
                  <InfoCard title="Children">
                    <InfoRow label="Number of Children" value={userData.number_of_children} />
                    <InfoRow label="Sons" value={userData.number_of_son} />
                    <InfoRow label="Daughters" value={userData.number_of_daughter} />
                  </InfoCard>
                )}
              </div>
            </div>
          )}

          {/* Partner Preferences */}
          {activeTab === 'preferences' && (
            <div className="tab-content">
              <div className="info-grid">
                <InfoCard title="Religious Preferences">
                  <InfoRow label="Preferred Sect" value={userData.preferred_sect} />
                  <InfoRow label="Desired Practice Level" value={userData.desired_practicing_level} />
                  <InfoRow label="Preferred Spiritual Beliefs" value={userData.preferred_dargah_fatiha_niyah} />
                </InfoCard>

                <InfoCard title="Location & Family">
                  <InfoRow label="Preferred City/State" value={userData.preferred_city_state || userData.preferred_city} />
                  <InfoRow label="Preferred Family Type" value={userData.preferred_family_type} />
                  <InfoRow label="Preferred Family Background" value={userData.preferred_family_background} />
                  <InfoRow label="Preferred Surname" value={userData.preferred_surname} />
                </InfoCard>

                <InfoCard title="Educational & Professional">
                  <InfoRow label="Preferred Education" value={userData.preferred_education} />
                  <InfoRow label="Preferred Profession" value={userData.preferred_occupation_profession} />
                </InfoCard>
              </div>
            </div>
          )}

          {/* Gallery */}
          {activeTab === 'gallery' && (
            <div className="tab-content">
              <div className="gallery-section">
                <h2 className="gallery-title">📸 Photo Gallery</h2>
                
                {/* Photo Privacy Check - Show request button for private photos */}
                {!isOwnProfile && userData?.gender === 'female' && 
                 (localStorage.getItem('gender') === 'male' || isAgent) && 
                 (userData?.photo_upload_privacy_option === 'Only to users whom I approve' || 
                  userData?.photo_upload_privacy_option === 'Yes' || 
                  userData?.photo_upload_privacy_option === 'Only Matches') && 
                 !canViewPhotos && (
                  <div className="photo-request-section">
                    <div className="photo-request-icon">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
        </div>
                    <h3 className="photo-request-title">Private Photos</h3>
                    <p className="photo-request-description">
                      This user's photos are private. Request access to view their gallery.
                    </p>
                    {isAgent && (
                      <p className="photo-request-agent-note">
                        💡 You can send photo request on behalf of your members from the sidebar.
                      </p>
                    )}
                    <button
                      className="photo-request-btn"
                      onClick={handlePhotoRequest}
                      disabled={photoPrivacyLoading || photoRequestStatus === 'pending'}
                    >
                      {photoPrivacyLoading ? (
                        'Checking...'
                      ) : photoRequestStatus === 'pending' ? (
                        <>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          Request Sent
                        </>
                      ) : photoRequestStatus === 'rejected' ? (
                        <>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          Request Again
                        </>
                      ) : (
                        <>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          Request Photo Access
                        </>
                      )}
                    </button>
                    {photoRequestStatus === 'pending' && (
                      <p className="photo-request-status">Waiting for approval...</p>
                    )}
                    {photoRequestStatus === 'rejected' && (
                      <p className="photo-request-status rejected">Your request was rejected. You can request again.</p>
                    )}
      </div>
                )}

                {/* Gallery Content - Show only if can view photos or own profile */}
                {(canViewPhotos || isOwnProfile) && (
                  <>
                    {/* Show accepted member info for agents */}
                    {isAgent && acceptedMemberInfo && canViewPhotos && !isOwnProfile && userData?.gender === 'female' && (
                      <div className="photo-access-info">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 11l3 3L22 4"/>
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                        </svg>
                        <span>
                          Photos visible because <strong>{acceptedMemberInfo.memberName}</strong>'s photo request was accepted.
                        </span>
                      </div>
                    )}
                    {galleryPhotos && galleryPhotos.length > 0 ? (
                      <div className="photo-gallery-container">
                        {galleryPhotos.map((photo, index) => {
                          const fileUrl = getPhotoUrl(photo?.upload_photo);
                          const isVideo = fileUrl && (
                            fileUrl.toLowerCase().includes('.mp4') ||
                            fileUrl.toLowerCase().includes('.mov') ||
                            fileUrl.toLowerCase().includes('.avi') ||
                            fileUrl.toLowerCase().includes('.webm') ||
                            fileUrl.toLowerCase().includes('.mkv')
                          );
                          
                          return (
                            <div 
                              key={photo.id || index} 
                              className={`gallery-item ${isVideo ? 'video-container' : ''}`}
                              onClick={() => handlePhotoClick(photo?.upload_photo)}
                              style={{ cursor: 'pointer', position: 'relative' }}
                            >
                              {isVideo ? (
                                <video 
                                  src={fileUrl} 
                                  alt="video" 
                                  controls
                                  preload="metadata"
                                  className="gallery-media"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                <img src={fileUrl} alt={`Gallery photo ${index + 1}`} className="gallery-media" />
                              )}
                              
                              {/* Delete Button - Only for own profile */}
                              {isOwnProfile && (
                                <button
                                  className="delete-photo-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePhoto(photo.id, fileUrl);
                                  }}
                                  disabled={deletingPhoto === photo.id}
                                  title="Delete this photo"
                                >
                                  {deletingPhoto === photo.id ? '⏳' : '🗑️'}
                                </button>
                              )}
                            </div>
                          );
                        })}
                        
                        {/* Add Photo Button - Only for own profile */}
                        {isOwnProfile && (
                          <div className="gallery-item add-photo" onClick={() => setShowUploadModal(true)}>
                            <div className="add-photo-content">
                              <span>+</span>
                              <p>Add Media</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="gallery-empty">
                        <p>No photos in gallery yet.</p>
                        {/* Add Photo Button - Only for own profile */}
                        {isOwnProfile && (
                          <button className="add-photo-btn-primary" onClick={() => setShowUploadModal(true)}>
                            <span>+</span>
                            <span>Add Your First Photo</span>
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>


      {/* Image Gallery Lightbox Modal */}
      {viewingImages.length > 0 && (
        <div className="lightbox-modal" onClick={handleCloseLightbox}>
          <button className="lightbox-close" onClick={handleCloseLightbox}>
            ×
          </button>
          <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); handlePrevPhoto(); }}>
            ‹
          </button>
          <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); handleNextPhoto(); }}>
            ›
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={viewingImages[currentImageIndex]} 
              alt={`Gallery photo ${currentImageIndex + 1}`}
              className="lightbox-image"
            />
            <div className="lightbox-counter">
              {currentImageIndex + 1} / {viewingImages.length}
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal - Only for own profile */}
      {isOwnProfile && showUploadModal && (
        <div className="upload-modal-overlay" onClick={() => {
          setShowUploadModal(false);
          setSelectedFiles([]);
        }}>
          <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
            <div className="upload-modal-header">
              <h2>📸 Photo/Video Upload</h2>
              <button 
                className="close-upload-btn"
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFiles([]);
                }}
              >
                ×
              </button>
            </div>
            
            <div className="upload-modal-body">
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-upload" className="file-upload-label">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <p>Select Photos/Videos</p>
                  <span className="file-hint">Images and videos up to 10MB</span>
                </label>
              </div>

              {selectedFiles.length > 0 && (
                <div className="selected-files">
                  <h4>Selected Files ({selectedFiles.length}):</h4>
                  <ul>
                    {selectedFiles.map((file, index) => (
                      <li key={index}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="upload-modal-actions">
                <button
                  className="upload-btn"
                  onClick={handleUpload}
                  disabled={selectedFiles.length === 0 || uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  className="cancel-upload-btn"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                  }}
                  disabled={uploading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - Only for own profile */}
      {isOwnProfile && showDeleteModal && (
        <div className="delete-modal-overlay" onClick={cancelDelete}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-header">
              <h3>Delete Photo</h3>
            </div>
            <div className="delete-modal-body">
              <p>Kya aap is photo ko delete karna chahte hain?</p>
              {photoToDelete && (
                <img 
                  src={getPhotoUrl(photoToDelete.url)} 
                  alt="Photo to delete" 
                  className="delete-preview-img"
                />
              )}
            </div>
            <div className="delete-modal-actions">
              <button
                className="confirm-delete-btn"
                onClick={confirmDelete}
                disabled={deletingPhoto !== null}
              >
                {deletingPhoto !== null ? 'Deleting...' : 'Delete'}
              </button>
              <button
                className="cancel-delete-btn"
                onClick={cancelDelete}
                disabled={deletingPhoto !== null}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agent Photo Request Sidebar */}
      {isAgent && showPhotoRequestSidebar && (
        <>
          <div 
            className="photo-request-sidebar-overlay" 
            onClick={() => setShowPhotoRequestSidebar(false)}
          />
          <div className="photo-request-sidebar">
            <div className="photo-request-sidebar-header">
              <h3>Select Member for Photo Request</h3>
              <button
                className="close-sidebar-btn"
                onClick={() => setShowPhotoRequestSidebar(false)}
              >
                ×
              </button>
            </div>
            
            <div className="photo-request-sidebar-body">
              {loadingMembers ? (
                <div className="sidebar-loading">
                  <p>Loading members...</p>
                </div>
              ) : agentMembers.length === 0 ? (
                <div className="sidebar-empty">
                  <p>No male members found.</p>
                </div>
              ) : (
                <div className="sidebar-members-list">
                  {agentMembers.map((member) => (
                    <div 
                      key={member.id} 
                      className="sidebar-member-item"
                    >
                      <div className="member-card-header">
                        <div className="member-avatar">
                          {member.profile_photo ? (
                            <img 
                              src={`${process.env.REACT_APP_API_URL}${member.profile_photo}`} 
                              alt={member.name || member.first_name || 'Member'}
                            />
                          ) : (
                            <div className="member-avatar-placeholder">
                              {(member.name || member.first_name || 'M')[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="member-info">
                          <h4>{member.name || member.first_name || 'Member'}</h4>
                          <div className="member-details">
                            {member.age && (
                              <span className="member-detail-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <circle cx="12" cy="12" r="10"/>
                                  <polyline points="12 6 12 12 16 14"/>
                                </svg>
                                {member.age} years
                              </span>
                            )}
                            {(member.city || member.location) && (
                              <span className="member-detail-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                  <circle cx="12" cy="10" r="3"/>
                                </svg>
                                {member.city || member.location}
                                {member.state && `, ${member.state}`}
                              </span>
                            )}
                          </div>
                          {member.profession && (
                            <p className="member-profession">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                              </svg>
                              {member.profession}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        className="send-request-btn"
                        onClick={() => handleSendPhotoRequestOnBehalf(member)}
                        disabled={sendingRequest === member.id}
                      >
                        {sendingRequest === member.id ? (
                          <>
                            <span className="spinner"></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="17 8 12 3 7 8"/>
                              <line x1="12" y1="3" x2="12" y2="15"/>
                            </svg>
                            Send Photo Request
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Agent Interest Modal (MemberSendInterest) */}
      {isAgent && (
        <MemberSendInterest
          isOpen={showMemberSendInterest}
          onClose={() => setShowMemberSendInterest(false)}
          targetUserId={userId}
          targetUserName={userData?.name || userData?.first_name || 'N/A'}
          targetUserPhoto={userData?.profile_photo}
          targetUserGender={userData?.gender}
          targetUserData={userData}
        />
      )}

      <Footer />
    </div>
  );
};

// Helper Components
const InfoCard = ({ title, children }) => (
  <div className="info-card">
    <h3 className="card-title">{title}</h3>
    <div className="card-content">
      {children}
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="info-row">
    <span className="info-label">{label}:</span>
    <span className="info-value">{value || 'Not specified'}</span>
  </div>
);

export default UserDetailProfessional;

