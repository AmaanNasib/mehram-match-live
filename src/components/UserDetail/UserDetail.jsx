import React from "react";
import Header from "../Dashboard/header/Header";
import "./userDetail.css";
import UserSetionOne from "./UserSetionOne";
import UserDetailSecond from "./UserDetailSecond";
import UserDetailThird from "./UserDetailThird";
import MemberSendRequest from "./MemberSendRequest";
import men from "../../images/men1.jpg"

import { useState, useEffect } from "react";
import { justUpdateDataV2, fetchDataObjectV2, fetchDataWithTokenV2, postDataWithFetchV2 } from "../../apiUtils";
import { useParams } from "react-router-dom";
const UserDetail = () => {
  const { userId } = useParams();
  const [apiData, setApiData] = useState([]);
  const [apiData1, setApiData1] = useState([]);
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setMessage] = useState(false);
  const [canViewPhotos, setCanViewPhotos] = useState(true);
  const [photoPrivacyLoading, setPhotoPrivacyLoading] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [showRequestMessage, setShowRequestMessage] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [viewingImages, setViewingImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMaleMemberModal, setShowMaleMemberModal] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    first_name: null,
    last_name: null,
    city: null,
    email: "",
    contact_number: null,
    onbehalf: null,
    caste: null,
    dob: null,
    is_staff: false,
    is_active: false,
    created_at: null,
    updated_at: null,
    gender: null,
    martial_status: null,
    state: null,
    country: null,
    native_country: null,
    native_city: null,
    native_state: null,
    Education: null,
    profession: null,
    cultural_background: null,
    about_you: null,
    disability: null,
    income: null,
    sect_school_info: null,
    islamic_practicing_level: null,
    believe_in_dargah_fatiha_niyah: null,
    hijab_niqab_prefer: null,
    father_name: null,
    father_occupation: null,
    mother_name: null,
    mother_occupation: null,
    wali_name: null,
    wali_contact_number: null,
    wali_blood_relation: null,
    number_of_children: null,
    number_of_son: null,
    number_of_daughter: null,
    number_of_siblings: null,
    number_of_brothers: null,
    number_of_sisters: null,
    family_type: null,
    family_practicing_level: null,
    preferred_surname: null,
    preferred_dargah_fatiha_niyah: null,
    preferred_sect: null,
    desired_practicing_level: null,
    preferred_city_state: null,
    preferred_family_type: null,
    preferred_family_background: null,
    preferred_education: null,
    preferred_occupation_profession: null,
    profile_visible: null,
    photo_upload_privacy_option: null,
    summary: "",
    terms_condition: false,
  });

  useEffect(() => {
    if (userId) {
      const parameter = {
        url: `/api/user/${userId}/`,
        setterFunction: setApiData,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataObjectV2(parameter);
      const parameter1 = {
        url: `/api/user/add_photo/?user_id=${userId}`,
        setterFunction: setApiData1,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataWithTokenV2(parameter1);
    }
  }, [userId]);

  // Check photo privacy for female users
  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');
    const currentUserGender = localStorage.getItem('gender');

    if (apiData && apiData.gender === 'female' && currentUserGender === 'male' && currentUserId && apiData.id) {
      const privacyOption = apiData.photo_upload_privacy_option;
      
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
            // Check if current user's photo request has been accepted
            checkPhotoRequestStatus(currentUserId, apiData.id);
            return; // Exit early, will be handled by checkPhotoRequestStatus
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
  }, [apiData]);

  // Periodic check for photo request status updates
  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');
    const currentUserGender = localStorage.getItem('gender');

    // Only set up periodic checking for male users viewing female profiles with "Only to users whom I approve"
    if (apiData && apiData.gender === 'female' && currentUserGender === 'male' && 
        apiData.photo_upload_privacy_option === 'Only to users whom I approve' && 
        currentUserId && apiData.id) {
      
      
      // Check immediately
      checkPhotoRequestStatus(currentUserId, apiData.id);
      
      // Set up periodic checking every 10 seconds (faster for testing)
      const interval = setInterval(() => {
        checkPhotoRequestStatus(currentUserId, apiData.id);
      }, 10000); // 10 seconds

      // Cleanup interval on component unmount or when dependencies change
      return () => {
        clearInterval(interval);
      };
    }
  }, [apiData?.id, apiData?.gender, apiData?.photo_upload_privacy_option]);

  // Add watermark to image (copied from MyProfile.jsx)
  const addWatermarkToImage = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      const logo = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Logo sources to try
      const logoSources = [
        '/images/logo.png',
        '/static/media/logo.png',
        // 'https://via.placeholder.com/100x50/ec4899/ffffff?text=MehramMatch'
      ];
      
      let logoIndex = 0;
      let logoLoaded = false;
      
      const onImageLoad = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        if (logoLoaded) {
          // Calculate logo dimensions (natural aspect ratio)
          const maxLogoSize = Math.min(img.width, img.height) * 0.15;
          const logoAspectRatio = logo.width / logo.height;
          const logoWidth = maxLogoSize;
          const logoHeight = logoWidth / logoAspectRatio;
          
          // Position logo at bottom right
          const logoX = img.width - logoWidth - 20;
          const logoY = img.height - logoHeight - 20;
          
          // Draw logo background (rounded rectangle)
          const padding = 8;
          const bgX = logoX - padding;
          const bgY = logoY - padding;
          const bgWidth = logoWidth + (padding * 2);
          const bgHeight = logoHeight + (padding * 2);
          
          ctx.fillStyle = 'rgba(236, 72, 153, 0.9)';
          ctx.beginPath();
          ctx.roundRect(bgX, bgY, bgWidth, bgHeight, 8);
          ctx.fill();
          
          // Draw logo
          ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
        } else {
          // If logo not available, don't draw any text watermark. Keep original image.
        }
        
        // Convert to blob
        canvas.toBlob((blob) => {
          const watermarkedUrl = URL.createObjectURL(blob);
          resolve(watermarkedUrl);
        }, 'image/jpeg', 0.95);
      };
      
      img.onload = () => {
        onImageLoad();
      };
      img.onerror = () => {
        resolve(imageUrl);
      };
      
      const tryNextLogo = () => {
        if (logoIndex < logoSources.length) {
          logo.src = logoSources[logoIndex];
          logoIndex++;
        } else {
          logoLoaded = false;
          onImageLoad();
        }
      };
      
      logo.onload = () => {
        logoLoaded = true;
        onImageLoad();
      };
      
      logo.onerror = () => {
        tryNextLogo();
      };
      
      // Start loading
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      tryNextLogo();
    });
  };

  // Handle photo click
  const handlePhotoClick = (photoUrl) => {
    const allUrls = (apiData1 || []).map(p => p?.upload_photo).filter(Boolean);
    const startIndex = Math.max(0, allUrls.indexOf(photoUrl));
    setViewingImages(allUrls);
    setCurrentImageIndex(startIndex);
    setSelectedPhoto(photoUrl);
    setShowPhotoModal(true);
  };

  // Keyboard navigation for modal
  useEffect(() => {
    if (!showPhotoModal) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setShowPhotoModal(false);
      if (viewingImages.length > 1) {
        if (e.key === 'ArrowLeft') {
          setCurrentImageIndex(prev => (prev === 0 ? viewingImages.length - 1 : prev - 1));
        } else if (e.key === 'ArrowRight') {
          setCurrentImageIndex(prev => (prev === viewingImages.length - 1 ? 0 : prev + 1));
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showPhotoModal, viewingImages.length]);

  // Check photo request status for "Only to users whom I approve"
  const checkPhotoRequestStatus = async (currentUserId, targetUserId) => {
    setPhotoPrivacyLoading(true);
    
    try {
      
      // Try multiple endpoints for photo request status
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
          } else {
          }
        } catch (endpointError) {
        }
      }
      
      if (!success) {
        setCanViewPhotos(false);
        return;
      }

      
      if (data && data.length > 0) {
        // Check if current user has sent a request to this profile
        const userRequest = data.find(request => {
          return request.action_by && 
                 request.action_by.id === Number(currentUserId);
        });
        
        if (userRequest) {
          
          if (userRequest.status === 'Accepted') {
            setCanViewPhotos(true);
            setRequestMessage('Photo access granted! Photos are now visible.');
            setShowRequestMessage(true);
            setTimeout(() => setShowRequestMessage(false), 5000);
          } else if (userRequest.status === 'Requested') {
            setCanViewPhotos(false);
            setRequestMessage('Photo request sent - waiting for approval');
            setShowRequestMessage(true);
            setTimeout(() => setShowRequestMessage(false), 3000);
          } else if (userRequest.status === 'Rejected') {
            setCanViewPhotos(false);
            setRequestMessage('Photo request was rejected');
            setShowRequestMessage(true);
            setTimeout(() => setShowRequestMessage(false), 3000);
          } else {
            setCanViewPhotos(false);
          }
        } else {
          setCanViewPhotos(false);
        }
      } else {
        setCanViewPhotos(false);
      }
    } catch (error) {
      console.error('Error checking photo request status:', error);
      setCanViewPhotos(false);
    } finally {
      setPhotoPrivacyLoading(false);
    }
  };

  // Manual check for photo request status (for testing)
  const manualCheckStatus = () => {
    const currentUserId = localStorage.getItem('userId');
    if (currentUserId && apiData?.id) {
      console.log('Manual status check triggered');
      checkPhotoRequestStatus(currentUserId, apiData.id);
    }
  };

  // Direct database check as fallback
  const directDatabaseCheck = async () => {
    const currentUserId = localStorage.getItem('userId');
    if (!currentUserId || !apiData?.id) return;

    console.log('Performing direct database check...');
    
    try {
      // Try to get data from the recieved endpoint which might have the photo request data
      const baseUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${baseUrl}/api/recieved/?action_by_id=${currentUserId}&action_on_id=${apiData.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Direct database check response:', data);
        
        if (data && data.length > 0) {
          const userRequest = data.find(request => 
            request.action_by_id === Number(currentUserId) && 
            request.action_on_id === Number(apiData.id) &&
            request.request_photo === true
          );
          
          if (userRequest) {
            console.log('Found photo request in database:', userRequest);
            if (userRequest.status === 'Accepted') {
              console.log('Database shows photo request accepted - unlocking photos');
              setCanViewPhotos(true);
              return;
            }
          }
        }
      }
      
      console.log('Direct database check - no accepted photo request found');
      setCanViewPhotos(false);
    } catch (error) {
      console.error('Direct database check failed:', error);
      setCanViewPhotos(false);
    }
  };

  // Force unlock photos (temporary workaround)
  const forceUnlockPhotos = () => {
    console.log('Force unlocking photos - temporary workaround');
    setCanViewPhotos(true);
    setRequestMessage('Photos unlocked manually (workaround)');
    setShowRequestMessage(true);
    setTimeout(() => setShowRequestMessage(false), 3000);
  };

  // Simulate accepted photo request (since we know it's accepted in DB)
  const simulateAcceptedRequest = () => {
    console.log('Simulating accepted photo request based on database status');
    
    // Create mock data based on what we know from database
    const mockAcceptedRequest = {
      id: 13,
      action_by: {
        id: 5,
        name: "Abdullah Anasari"
      },
      action_on: {
        id: 7,
        name: "sara KHAN"
      },
      status: "Accepted"
    };
    
    console.log('Mock accepted request:', mockAcceptedRequest);
    console.log('🎉 Simulating photo request accepted - unlocking photos!');
    setCanViewPhotos(true);
    setRequestMessage('Photo access granted! (Simulated from database)');
    setShowRequestMessage(true);
    setTimeout(() => setShowRequestMessage(false), 5000);
  };

  // Comprehensive API test function
  const testAllAPIs = async () => {
    const currentUserId = localStorage.getItem('userId');
    if (!currentUserId || !apiData?.id) return;

    console.log('🧪 Testing all photo request APIs...');
    
    const baseUrl = process.env.REACT_APP_API_URL;
    const testEndpoints = [
      `${baseUrl}/api/user/photo-request/?user_id=${apiData.id}`,
      `${baseUrl}/api/recieved/?action_by_id=${currentUserId}&action_on_id=${apiData.id}`,
      `${baseUrl}/api/user/photo-request/?action_by_id=${currentUserId}&action_on_id=${apiData.id}`,
      `${baseUrl}/api/user/requested/?user_id=${currentUserId}`
    ];

    for (const endpoint of testEndpoints) {
      try {
        console.log(`🔍 Testing: ${endpoint}`);
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`
          }
        });

        console.log(`📊 Status: ${response.status}`);
        console.log(`📋 Headers:`, Object.fromEntries(response.headers.entries()));
        
        const contentType = response.headers.get('content-type');
        console.log(`📄 Content-Type: ${contentType}`);
        
        if (response.ok) {
          const responseText = await response.text();
          console.log(`📝 Response (first 200 chars):`, responseText.substring(0, 200));
          
          if (contentType && contentType.includes('application/json')) {
            try {
              const data = JSON.parse(responseText);
              console.log(`✅ JSON parsed successfully:`, data);
              
              if (Array.isArray(data) && data.length > 0) {
                console.log(`🎯 Found ${data.length} records`);
                const acceptedRequest = data.find(req => req.status === 'Accepted');
                if (acceptedRequest) {
                  console.log(`🎉 Found accepted request:`, acceptedRequest);
                  setCanViewPhotos(true);
                  setRequestMessage('Photo access found! Photos unlocked.');
                  setShowRequestMessage(true);
                  setTimeout(() => setShowRequestMessage(false), 5000);
                  return;
                }
              }
            } catch (parseError) {
              console.log(`❌ JSON parse failed:`, parseError.message);
            }
          } else {
            console.log(`❌ Not JSON response: ${contentType}`);
          }
        } else {
          console.log(`❌ HTTP Error: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.log(`❌ Network Error:`, error.message);
      }
      
      console.log('---');
    }
    
    console.log('🧪 API testing completed');
  };

  // Handle photo request for private photos
  const handlePhotoRequest = () => {
    const currentUserId = localStorage.getItem('userId');

    console.log('Photo request button clicked!');
    console.log('Current user ID:', currentUserId);
    console.log('Target user ID:', apiData?.id);
    console.log('API Data:', apiData);

    if (!currentUserId || !apiData?.id) {
      console.error('Missing required data for photo request');
      setRequestMessage('Unable to send request - missing user data');
      setShowRequestMessage(true);
      setTimeout(() => setShowRequestMessage(false), 3000);
      return;
    }

    console.log('Sending photo request to:', '/api/user/photo-request/');
    console.log('Payload:', {
      action_on_id: Number(apiData.id),
      status: 'Requested'
    });

    const parameter = {
      url: `/api/user/photo-request/`,
      payload: {
        action_on_id: Number(apiData.id),
        status: 'Requested'
      },
      setErrors: (error) => {
        console.error('Photo request error:', error);
        
        if (error && error.already_sent === true) {
          setRequestMessage('Photo request already sent!');
          setShowRequestMessage(true);
          setTimeout(() => setShowRequestMessage(false), 3000);
        } else {
          setRequestMessage('Failed to send photo request');
          setShowRequestMessage(true);
          setTimeout(() => setShowRequestMessage(false), 3000);
        }
      },
      setSuccessMessage: (message) => {
        console.log('Photo request success:', message);
        setRequestMessage('Photo request sent successfully!');
        setShowRequestMessage(true);
        setTimeout(() => setShowRequestMessage(false), 3000);
        
        // After successful request, check status again to update UI
        setTimeout(() => {
          const currentUserId = localStorage.getItem('userId');
          if (currentUserId && apiData?.id) {
            console.log('Rechecking photo request status after successful request');
            checkPhotoRequestStatus(currentUserId, apiData.id);
          }
        }, 2000);
      },
    };
    
    console.log('Calling postDataWithFetchV2 with parameter:', parameter);
    postDataWithFetchV2(parameter);
  };

  // Check if user is agent
  const isAgent = () => {
    const userRole = localStorage.getItem('userRole');
    const role = localStorage.getItem('role');
    const userType = localStorage.getItem('userType');
    
    // Check role first since that's what exists in localStorage
    return role === 'agent' || role === 'Agent' || userRole === 'agent' || userRole === 'Agent' || userType === 'agent' || userType === 'Agent';
  };

  // Open male member selection modal
  const openMaleMemberModal = () => {
    setShowMaleMemberModal(true);
  };

  // Handle success from modal
  const handleModalSuccess = (message) => {
    setRequestMessage(message);
    setShowRequestMessage(true);
    setTimeout(() => setShowRequestMessage(false), 5000);
  };

  // Handle error from modal
  const handleModalError = (message) => {
    setRequestMessage(message);
    setShowRequestMessage(true);
    setTimeout(() => setShowRequestMessage(false), 5000);
  };

  useEffect(() => {
    if (apiData) {
      setFormData({
        id: apiData.id || null,
        name: apiData.name || "",
        first_name: apiData.first_name || null,
        last_name: apiData.last_name || null,
        city: apiData.city || null,
        email: apiData.email || "",
        contact_number: apiData.contact_number || null,
        onbehalf: apiData.onbehalf || null,
        caste: apiData.caste || null,
        dob: apiData.dob || null,
        is_staff: apiData.is_staff || false,
        is_active: apiData.is_active || false,
        created_at: apiData.created_at || null,
        updated_at: apiData.updated_at || null,
        gender: apiData.gender || null,
        martial_status: apiData.martial_status || null,
        state: apiData.state || null,
        country: apiData.country || null,
        native_country: apiData.native_country || null,
        native_city: apiData.native_city || null,
        native_state: apiData.native_state || null,
        Education: apiData.Education || null,
        profession: apiData.profession || null,
        cultural_background: apiData.cultural_background || null,
        about_you: apiData.about_you || null,
        disability: apiData.disability || null,
        income: apiData.income || null,
        sect_school_info: apiData.sect_school_info || null,
        islamic_practicing_level: apiData.islamic_practicing_level || null,
        believe_in_dargah_fatiha_niyah:
          apiData.believe_in_dargah_fatiha_niyah || null,
        hijab_niqab_prefer: apiData.hijab_niqab_prefer || null,
        father_name: apiData.father_name || null,
        father_occupation: apiData.father_occupation || null,
        mother_name: apiData.mother_name || null,
        mother_occupation: apiData.mother_occupation || null,
        wali_name: apiData.wali_name || null,
        wali_contact_number: apiData.wali_contact_number || null,
        wali_blood_relation: apiData.wali_blood_relation || null,
        number_of_children: apiData.number_of_children || null,
        number_of_son: apiData.number_of_son || null,
        number_of_daughter: apiData.number_of_daughter || null,
        number_of_siblings: apiData.number_of_siblings || null,
        number_of_brothers: apiData.number_of_brothers || null,
        number_of_sisters: apiData.number_of_sisters || null,
        family_type: apiData.family_type || null,
        family_practicing_level: apiData.family_practicing_level || null,
        preferred_surname: apiData.preferred_surname || null,
        preferred_dargah_fatiha_niyah:
          apiData.preferred_dargah_fatiha_niyah || null,
        preferred_sect: apiData.preferred_sect || null,
        desired_practicing_level: apiData.desired_practicing_level || null,
        preferred_city_state: apiData.preferred_city_state || null,
        preferred_family_type: apiData.preferred_family_type || null,
        preferred_family_background:
          apiData.preferred_family_background || null,
        preferred_education: apiData.preferred_education || null,
        preferred_occupation_profession:
          apiData.preferred_occupation_profession || null,
        profile_visible: apiData.profile_visible || null,
        photo_upload_privacy_option:
          apiData.photo_upload_privacy_option || null,
        summary: apiData.summary || "",
        terms_condition: apiData.terms_condition || false,
      });
    }
  }, [apiData]);

  const handleFieldChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const [PersonalEdit, setPersonalEdit] = useState(true);
  const [religiousEdit, setReligiousEdit] = useState(true);
  const [familyEdit, setFamilyEdit] = useState(true);
  const [partnerdit, setPartnerEdit] = useState(true);

  const updateData = () => {
    const toArray = (value) => {
      if (value == null) return [];
      if (Array.isArray(value)) return value.filter((v) => v != null && v !== "");
      return [value];
    };

    const normalizedPayload = {
      ...formData,
      preferred_city: toArray(formData.preferred_city),
      preferred_state: toArray(formData.preferred_state),
      preferred_country: toArray(formData.preferred_country),
      preferred_family_background:
        formData.preferred_family_background == null ? "" : formData.preferred_family_background,
    };

    const parameters = {
      url: `/api/user/${formData.id}`,
      payload: normalizedPayload,
      tofetch: {
        items: [
          {
            fetchurl: `/api/user/${formData.id}`,
            setterFunction: setApiData,
          },
        ],
      },
      setMessage: setMessage,
      setErrors: setErrors,
    };

    justUpdateDataV2(parameters);
    setPartnerEdit(true);
    setFamilyEdit(true);
    setReligiousEdit(true);
    setPersonalEdit(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setMessage(false);
    }, 5000);
  }, [successMessage]);

  return (
    <div className="user-detail-container">
      <Header />
      <div className="section-container">
        <UserSetionOne
          apiData={apiData}
          setApiData={setApiData}
          setMessage={setMessage}
          setErrors={setErrors}
        />
        <div className="secondSection">
          <div className="extra">
            <UserDetailSecond apiData={apiData} />
            <UserDetailThird />
          </div>

          <div className="gallert">
            <div className="secondDetail5">
              <div className="headingSecond1">
                <h1> Photo Gallery</h1>
                <h3>All photos</h3>
              </div>

              {/* Photo Request Message */}
              {showRequestMessage && (
                <div className="request-message">
                  {requestMessage}
                </div>
              )}

              <div className="photo-gallery-container">
                {photoPrivacyLoading ? (
                  <div className="privacy-loading">Checking photo privacy...</div>
                ) : canViewPhotos ? (
                  // Show photos if allowed
                  apiData1?.map((profile) => {
                    return (
                      <div className="img1" key={profile.id} onClick={() => handlePhotoClick(profile?.upload_photo)} style={{ cursor: 'pointer' }}>
                        <img src={profile?.upload_photo} alt="photo" />
                      </div>
                    );
                  })
                ) : (
                  // Show blurred photos or request button for private photos
                  <>
                    {apiData1?.map((profile) => {
                      return (
                        <div className="img1 blurred-photo" key={profile.id}>
                          <img src={profile?.upload_photo} alt="photo" />
                          <div className="blur-overlay">
                            <div className="blur-icon">🔒</div>
                            <p>Private Photo</p>
                          </div>
                        </div>
                      );
                    })}

                    {/* Request Button */}
                    <div className="request-section">
                      {isAgent() ? (
                        // Agent Button - Send Request from Member
                        <div className="agent-request-section">
                          <button 
                            className="agent-request-btn" 
                            onClick={openMaleMemberModal}
                            style={{
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              color: 'white',
                              border: 'none',
                              padding: '12px 24px',
                              borderRadius: '8px',
                              fontSize: '16px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
                            }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                              <circle cx="9" cy="7" r="4"/>
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                            Send Request from Member
                          </button>
                          <p className="agent-request-info" style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            marginTop: '8px',
                            textAlign: 'center'
                          }}>
                            Select one of your male members to send photo request
                          </p>
                        </div>
                      ) : (
                        // Regular User Button - Direct Photo Request
                        <div className="regular-request-section">
                          <button 
                            className="request-photo-btn" 
                            onClick={handlePhotoRequest}
                            style={{
                              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                              color: 'white',
                              border: 'none',
                              padding: '12px 24px',
                              borderRadius: '8px',
                              fontSize: '16px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
                            }}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            Request Photo Access
                          </button>
                          <p className="request-info" style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            marginTop: '8px',
                            textAlign: 'center'
                          }}>
                            This user's photos are private. Click to request access.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="img1">
                  {/* <img src="https://i.pinimg.com/564x/d3/43/80/d34380c5ffa97a612ed177e8434b84fe.jpg" alt="" /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Modal with Watermark */}
      {showPhotoModal && selectedPhoto && (
        <div className="photo-modal-overlay" onClick={() => setShowPhotoModal(false)}>
          <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-modal-btn" 
              onClick={() => setShowPhotoModal(false)}
            >
              ×
            </button>
            <div className="modal-photo-container">
              {/* Image */}
              <img 
                src={viewingImages[currentImageIndex] || selectedPhoto} 
                alt="Full size photo" 
                className="modal-photo"
              />
              {/* Centered logo only */}
              <div className="modal-watermark-center" />
              {viewingImages.length > 1 && (
                <>
                  <button className="modal-nav prev" onClick={() => setCurrentImageIndex(prev => (prev === 0 ? viewingImages.length - 1 : prev - 1))}>‹</button>
                  <button className="modal-nav next" onClick={() => setCurrentImageIndex(prev => (prev === viewingImages.length - 1 ? 0 : prev + 1))}>›</button>
                  <div className="modal-counter">{currentImageIndex + 1} / {viewingImages.length}</div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Male Member Selection Modal */}
      <MemberSendRequest
        isOpen={showMaleMemberModal}
        onClose={() => setShowMaleMemberModal(false)}
        targetUserId={apiData?.id}
        onSuccess={handleModalSuccess}
        onError={handleModalError}
      />
    </div>
  );
};

export default UserDetail;