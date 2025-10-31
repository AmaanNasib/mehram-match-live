import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postDataWithFetchV2, putDataWithFetchV2, fetchDataWithTokenV2 } from '../../apiUtils'; // Adjust import path
import heart from "../../images/colorHeart.svg";
import hamburger from "../../images/hamburger.svg";
import notAllowed from "../../images/notAllowed.svg";
import men1 from "../../images/men1.jpg";
import profileStart from "../../images/profileStar.svg";
import start1 from "../../images/iconoir_star-solid.svg";
import strat2 from "../../images/iconoir_bright-star.svg";
import "./UserSectionOne.css";

const UserSetionOne = ({ apiData, setApiData ,setMessage,setErrors, profileOwnerId}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem('role');
  const gender = localStorage.getItem('gender');
  const [interestStatus, setInterestStatus] = useState(false);
  const [shortlistStatus, setShortlistStatus] = useState(false);
  const [shortlistMessage, setShortlistMessage] = useState('');
  const [showShortlistMessage, setShowShortlistMessage] = useState(false);
  const [blockMessage, setBlockMessage] = useState('');
  const [showBlockMessage, setShowBlockMessage] = useState(false);
  const [blockStatus, setBlockStatus] = useState(false);
  
  // Check if current user is viewing their own profile
  const isOwnProfile = userId && profileOwnerId && userId.toString() === profileOwnerId.toString();

  // Profile Completion Stats Function with Stepwise Breakdown
  const getProfileCompletionStats = (userData) => {
    if (!userData) {
      return {
        steps: [],
        totalMandatory: 0,
        totalOptional: 0,
        totalCompleted: 0,
        totalMissing: 0
      };
    }

    const userGender = userData.gender?.toString().toLowerCase() || '';
    const maritalStatus = userData.martial_status?.toString().toLowerCase() || '';
    
    // Helper function to check if field is completed
    const isFieldCompleted = (field, value) => {
      if (field.includes('number_of_') || field === 'age') {
        return value !== null && value !== undefined && value !== '';
      }
      return value !== null && value !== undefined && value !== '' && value !== 0;
    };

    // Step 1: Basic Information
    const step1Mandatory = [
      { key: 'name', label: 'Full Name' },
      { key: 'gender', label: 'Gender' },
      { key: 'age', label: 'Age' },
      { key: 'martial_status', label: 'Marital Status' },
      { key: 'city', label: 'Current City' },
      { key: 'state', label: 'Current State' },
      { key: 'country', label: 'Current Country' },
      { key: 'Education', label: 'Education' },
      { key: 'profession', label: 'Profession' }
    ];

    const step1Optional = [
      { key: 'height', label: 'Height' },
      { key: 'weight', label: 'Weight' },
      { key: 'skin_tone', label: 'Skin Tone' },
      { key: 'about_you', label: 'About You' },
      { key: 'income', label: 'Annual Income' },
      { key: 'disability', label: 'Disability' },
      { key: 'describe_job_business', label: 'Job/Business Description' }
    ];

    // Step 2: Religious Information
    const step2Mandatory = [
      { key: 'sect_school_info', label: 'Sect/School of Thought' },
      { key: 'believe_in_dargah_fatiha_niyah', label: 'Belief in Dargah/Fatiha/Niyah' }
    ];

    // Step 2: Religious Information - Gender specific optional fields
    const step2Optional = userData?.gender?.toLowerCase() === 'female' ? [
      { key: 'islamic_practicing_level', label: 'Islamic Practice Level' },
      { key: 'hijab_niqab_prefer', label: 'Hijab/Niqab Preference' },
      { key: 'perform_namaz', label: 'Namaz Performance' },
      { key: 'recite_quran', label: 'Quran Recitation' },
      { key: 'marriage_plan', label: 'Marriage Plan' }
    ] : [
      { key: 'islamic_practicing_level', label: 'Islamic Practice Level' },
      { key: 'perform_namaz', label: 'Namaz Performance' },
      { key: 'recite_quran', label: 'Quran Recitation' },
      { key: 'marriage_plan', label: 'Marriage Plan' }
    ];

    // Step 3: Family Background
    const step3Mandatory = [
      { key: 'father_name', label: 'Father\'s Name' },
      { key: 'mother_name', label: 'Mother\'s Name' },
      { key: 'family_type', label: 'Family Type' }
    ];

    const step3Optional = [
      { key: 'father_occupation', label: 'Father\'s Occupation' },
      { key: 'mother_occupation', label: 'Mother\'s Occupation' },
      { key: 'family_practicing_level', label: 'Family Practice Level' },
      { key: 'number_of_siblings', label: 'Number of Siblings' },
      { key: 'number_of_brothers', label: 'Number of Brothers' },
      { key: 'number_of_sisters', label: 'Number of Sisters' }
    ];

    // Gender-specific fields for females
    if (userGender === 'female') {
      step3Optional.push(
        { key: 'wali_name', label: 'Wali Name' },
        { key: 'wali_contact_number', label: 'Wali Contact' },
        { key: 'wali_blood_relation', label: 'Wali Relation' }
      );
    }

    // Marital status specific fields
    if (maritalStatus === 'divorced' || maritalStatus === 'widowed' || maritalStatus === 'khula') {
      step3Optional.push(
        { key: 'number_of_children', label: 'Number of Children' },
        { key: 'number_of_son', label: 'Number of Sons' },
        { key: 'number_of_daughter', label: 'Number of Daughters' }
      );
    }

    // Step 4: Partner Expectations
    const step4Mandatory = [
      { key: 'preferred_sect', label: 'Preferred Sect' },
      { key: 'desired_practicing_level', label: 'Desired Practice Level' },
      { key: 'preferred_city', label: 'Preferred City' },
      { key: 'preferred_family_type', label: 'Preferred Family Type' }
    ];

    const step4Optional = [
      { key: 'preferred_surname', label: 'Preferred Surname' },
      { key: 'preferred_dargah_fatiha_niyah', label: 'Preferred Spiritual Beliefs' },
      { key: 'preferred_education', label: 'Preferred Education' },
      { key: 'preferred_occupation_profession', label: 'Preferred Profession' }
    ];

    // Calculate completion for each step
    const steps = [
      {
        title: 'Step 1: Basic Information',
        mandatory: step1Mandatory,
        optional: step1Optional,
        mandatoryCompleted: step1Mandatory.filter(field => isFieldCompleted(field.key, userData[field.key])).length,
        optionalCompleted: step1Optional.filter(field => isFieldCompleted(field.key, userData[field.key])).length
      },
      {
        title: 'Step 2: Religious Information',
        mandatory: step2Mandatory,
        optional: step2Optional,
        mandatoryCompleted: step2Mandatory.filter(field => isFieldCompleted(field.key, userData[field.key])).length,
        optionalCompleted: step2Optional.filter(field => isFieldCompleted(field.key, userData[field.key])).length
      },
      {
        title: 'Step 3: Family Background',
        mandatory: step3Mandatory,
        optional: step3Optional,
        mandatoryCompleted: step3Mandatory.filter(field => isFieldCompleted(field.key, userData[field.key])).length,
        optionalCompleted: step3Optional.filter(field => isFieldCompleted(field.key, userData[field.key])).length
      },
      {
        title: 'Step 4: Partner Expectations',
        mandatory: step4Mandatory,
        optional: step4Optional,
        mandatoryCompleted: step4Mandatory.filter(field => isFieldCompleted(field.key, userData[field.key])).length,
        optionalCompleted: step4Optional.filter(field => isFieldCompleted(field.key, userData[field.key])).length
      }
    ];

    // Define the 12 specific fields for match calculation
    const matchFields = [
      { key: 'age', label: 'Age' },
      { key: 'gender', label: 'Gender' },
      { key: 'martial_status', label: 'Marital Status' },
      { key: 'city', label: 'Current City' },
      { key: 'state', label: 'Current State' },
      { key: 'country', label: 'Current Country' },
      { key: 'Education', label: 'Education' },
      { key: 'profession', label: 'Profession' },
      { key: 'sect_school_info', label: 'Sect/School of Thought' },
      { key: 'believe_in_dargah_fatiha_niyah', label: 'Belief in Dargah/Fatiha/Niyah' },
      { key: 'father_name', label: 'Father\'s Name' },
      { key: 'mother_name', label: 'Mother\'s Name' }
    ];

    // Calculate match-specific completion (12 fields total)
    const matchFieldsCompleted = matchFields.filter(field => isFieldCompleted(field.key, userData[field.key])).length;
    const matchPercentage = Math.round((matchFieldsCompleted / 12) * 100);

    // Calculate totals for all fields (existing logic)
    const totalMandatory = steps.reduce((sum, step) => sum + step.mandatory.length, 0);
    const totalOptional = steps.reduce((sum, step) => sum + step.optional.length, 0);
    const totalCompleted = steps.reduce((sum, step) => sum + step.mandatoryCompleted + step.optionalCompleted, 0);
    const totalMissing = (totalMandatory + totalOptional) - totalCompleted;

    return {
      steps,
      totalMandatory,
      totalOptional,
      totalCompleted,
      totalMissing,
      // New match-specific calculations
      matchFields,
      matchFieldsCompleted,
      matchPercentage,
      totalMatchFields: 12
    };
  };


  // Set loading state from API data
  useEffect(() => {
    if (apiData) {
      setLoading(false);
    }
  }, [apiData]);

  // Check interest, shortlist, and block status for other users' profiles
  useEffect(() => {
    if (apiData && !isOwnProfile && userId) {
      const checkActionStatus = async () => {
        try {
          const response = await fetchDataWithTokenV2({
            url: `/api/recieved/?action_by_id=${userId}&action_on_id=${apiData.id}`,
            setterFunction: (data) => {
              let hasInterest = false;
              let hasShortlist = false;
              let hasBlock = false;

              if (Array.isArray(data)) {
                // Check each item in the array
                data.forEach(item => {
                  const isCurrentUserAction = 
                    (item.action_by && item.action_by.id === Number(userId)) ||
                    (item.action_by_id === Number(userId));
                  
                  const isTargetUser = 
                    (item.action_on && item.action_on.id === Number(apiData.id)) ||
                    (item.action_on_id === Number(apiData.id));

                  if (isCurrentUserAction && isTargetUser) {
                    // Check interest status
                    if (item.interest === true || item.interest === "true") {
                      hasInterest = true;
                    }
                    // Check shortlist status
                    if (item.shortlisted === true || item.shortlisted === "true") {
                      hasShortlist = true;
                    }
                    // Check block status
                    if (item.blocked === true || item.blocked === "true") {
                      hasBlock = true;
                    }
                  }
                });
              } else if (data && typeof data === 'object') {
                const isCurrentUserAction = 
                  (data.action_by && data.action_by.id === Number(userId)) ||
                  (data.action_by_id === Number(userId));
                
                const isTargetUser = 
                  (data.action_on && data.action_on.id === Number(apiData.id)) ||
                  (data.action_on_id === Number(apiData.id));

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
              // Fallback: set all to false if API call fails
              setInterestStatus(false);
              setShortlistStatus(false);
              setBlockStatus(false);
            }
          });
        } catch (error) {
          // Fallback: set all to false if error occurs
          setInterestStatus(false);
          setShortlistStatus(false);
          setBlockStatus(false);
        }
      };

      checkActionStatus();
    }
  }, [apiData, isOwnProfile, userId]);

  const handleInterest = () => {
    // Check if already interested using local state
    if (interestStatus === true) {
      // Show withdraw confirmation
      if (window.confirm('Are you sure you want to withdraw your interest?')) {
        handleWithdrawInterest();
      }
      return;
    }

    const payload = {
      action_by_id: userId,
      action_on_id: apiData.id,
      interest: true
    };

    const url = apiData.interested_id 
      ? `/api/recieved/${apiData.interested_id}/` 
      : `/api/recieved/`;

    const parameter = {
      url,
      payload,
      setErrors: setErrors,
      tofetch: {
        items: [{
          fetchurl: `/api/user/${userId}/`,
          dataset: setApiData,
          setSuccessMessage: setMessage,
          setErrors: setErrors
        }],
        setErrors: setErrors
      }
    };

    if (apiData.interested_id) {
      putDataWithFetchV2(parameter);
    } else {
      postDataWithFetchV2(parameter);
    }

    // Update local state
    setInterestStatus(true);
  };

  const handleWithdrawInterest = () => {
    const payload = {
      action_by_id: userId,
      action_on_id: apiData.id,
      interest: false
    };

    const url = apiData.interested_id 
      ? `/api/recieved/${apiData.interested_id}/` 
      : `/api/recieved/`;

    const parameter = {
      url,
      payload,
      setErrors: setErrors,
      tofetch: {
        items: [{
          fetchurl: `/api/user/${userId}/`,
          dataset: setApiData,
          setSuccessMessage: setMessage,
          setErrors: setErrors
        }],
        setErrors: setErrors
      }
    };

    if (apiData.interested_id) {
      putDataWithFetchV2(parameter);
    } else {
      postDataWithFetchV2(parameter);
    }

    // Update local state
    setInterestStatus(false);
  };

  const handleShortlist = () => {
    // Toggle shortlist status based on current state
    const newShortlistStatus = !shortlistStatus;

    const parameter = {
      url: role === 'agent' ? `/api/agent/shortlist/` : `/api/recieved/`,
      payload: {
        action_by_id: userId,
        action_on_id: apiData.id,
        shortlisted: newShortlistStatus
      },
      setErrors: setErrors,
      tofetch: {
        items: [{
          fetchurl: `/api/user/${userId}/`,
          dataset: setApiData,
          setSuccessMessage: setMessage,
          setErrors: setErrors
        }],
        setErrors: setErrors
      }
    };

    // Show success message near button
    setShortlistMessage(newShortlistStatus ? 'Added to Shortlist' : 'Removed from Shortlist');
    setShowShortlistMessage(true);

    // Update local state immediately for better UX
    setShortlistStatus(newShortlistStatus);

    // Hide message after 3 seconds
    setTimeout(() => {
      setShowShortlistMessage(false);
    }, 3000);

    postDataWithFetchV2(parameter);
  };

  const handleBlock = () => {
    // Check if already blocked, if yes then unblock, if no then block
    const isCurrentlyBlocked = blockStatus;

    const parameter = {
      url: isCurrentlyBlocked ? `/api/recieved/unblock/` : `/api/recieved/block/`,
      
      payload: {
        action_by_id: userId,
        action_on_id: apiData.id
      },
      setErrors: setErrors,
      tofetch: {
        items: [{
          fetchurl: `/api/user/${userId}/`,
          dataset: setApiData,
          setSuccessMessage: setMessage,
          setErrors: setErrors
        }],
        setErrors: setErrors
      }
    };

    // Show success message near button
    setBlockMessage(isCurrentlyBlocked ? 'User Unblocked' : 'User Blocked');
    setShowBlockMessage(true);

    // Update local state immediately for better UX
    setBlockStatus(!isCurrentlyBlocked);

    // Hide message after 3 seconds
    setTimeout(() => {
      setShowBlockMessage(false);
    }, 3000);

    postDataWithFetchV2(parameter);
  };

  return (
    <div className='sectionOne'>

      <div className='upper'>
        <div style={{ position: "relative" }}>
          <div className='blurImg'></div>
          <div className={gender === 'female' && !apiData?.photo_upload_privacy_option ? 'profileImg' : ''}>
            {loading ? (
              <div className="shimmer shimmer-img" />
            ) : (
              <img 
                src={
                    apiData?.profile_photo
                      ? `${process.env.REACT_APP_API_URL}${apiData.profile_photo}`
                      : `data:image/svg+xml;utf8,${encodeURIComponent(
                          apiData?.gender === "male"
                            ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6">
                <circle cx="12" cy="8" r="5" fill="#bfdbfe"/>
                <path d="M12 14c-4.42 0-8 2.69-8 6v1h16v-1c0-3.31-3.58-6-8-6z" fill="#bfdbfe"/>
              </svg>`
                            : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ec4899">
                <circle cx="12" cy="8" r="5" fill="#fbcfe8"/>
                <path d="M12 14c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6z" fill="#fbcfe8"/>
                <circle cx="12" cy="8" r="2" fill="#ec4899"/>
              </svg>`
                        )}`
                  } 
                alt="Profile" 
                className='profile-picture'
                style={{ height: "33vh", width: "33vh", borderRadius: "50%", margin: "auto", border: "8px solid pink" }}
              />
            )}
            <div className='blurImg1'>
              <img src={profileStart} alt="" />
            </div>
          </div>
        </div>
        
        {loading ? <div className="shimmer shimmer-text shimmer-title" /> : <h1>{apiData?.name}</h1>}
        {loading ? <div className="shimmer shimmer-text" /> : <h5 className='userId'>{apiData?.id}</h5>}
        
        {/* <div className='firstdetail'>
          {loading ? (
            <div className="shimmer shimmer-text shimmer-paragraph" />
          ) : (
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
          )}
        </div> */}
        
        <>
          {isOwnProfile ? (
            // Show profile completion progress for own profile
            <>
          <div className="percentMatch">
            <h6 className="cardText">{(() => {
              const completionStats = getProfileCompletionStats(apiData);
              return `${completionStats.matchPercentage}% Match Complete`;
            })()}</h6>
          </div>
          
          <div className="filled" style={{
            '--progress-width': `${(() => {
              const completionStats = getProfileCompletionStats(apiData);
              return completionStats.matchPercentage;
            })()}%`
          }}></div>
          
          {/* Profile Completion Details */}
          <div className="completion-details">
            {(() => {
              const completionStats = getProfileCompletionStats(apiData);
              return (
                <>
                  <div className="completion-summary">
                    <div className="completion-row">
                      <span className="completion-label">Match Fields:</span>
                      <span className="completion-value">
                        {completionStats.matchFieldsCompleted}/{completionStats.totalMatchFields} fields
                      </span>
                    </div>
                    <div className="completion-row">
                      <span className="completion-label">Match Percentage:</span>
                      <span className="completion-value">
                        {completionStats.matchPercentage}%
                      </span>
                    </div>
                    <div className="completion-row">
                      <span className="completion-label">Total Profile Fields:</span>
                      <span className="completion-value">
                        {completionStats.totalCompleted}/{completionStats.totalMandatory + completionStats.totalOptional} fields
                      </span>
                    </div>
                  </div>
                  
                  {/* Stepwise Breakdown */}
                  <div className="steps-breakdown">
                    {completionStats.steps.map((step, index) => (
                      <div key={index} className="step-card">
                        <div className="step-header">
                          <h4 className="step-title">{step.title}</h4>
                          <div className="step-progress">
                            <span className="step-percentage">
                              {Math.round(((step.mandatoryCompleted + step.optionalCompleted) / (step.mandatory.length + step.optional.length)) * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="step-details">
                          <div className="step-row mandatory">
                            <span className="step-label">Mandatory:</span>
                            <span className="step-value">
                              {step.mandatoryCompleted}/{step.mandatory.length} completed
                            </span>
                          </div>
                          <div className="step-row optional">
                            <span className="step-label">Optional:</span>
                            <span className="step-value">
                              {step.optionalCompleted}/{step.optional.length} completed
                            </span>
                          </div>
                          <div className="step-row remaining">
                            <span className="step-label">Remaining:</span>
                            <span className="step-value">
                              {(step.mandatory.length + step.optional.length) - (step.mandatoryCompleted + step.optionalCompleted)} fields
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
            </>
          ) : (
            // Show basic information (no inner card wrapper)
            <>
              <div className="basic-info-header">
                <h6 className="cardText">Basic Information</h6>
              </div>
              <div className="basic-info-content">
                <div className="info-row">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{apiData?.name || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Age:</span>
                  <span className="info-value">{apiData?.age || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Location:</span>
                  <span className="info-value">
                    {apiData?.city && apiData?.state 
                      ? `${apiData.city}, ${apiData.state}` 
                      : apiData?.city || apiData?.state || 'Not provided'
                    }
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Education:</span>
                  <span className="info-value">{apiData?.Education || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Profession:</span>
                  <span className="info-value">{apiData?.profession || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Marital Status:</span>
                  <span className="info-value">{apiData?.martial_status || 'Not provided'}</span>
                </div>
                {apiData?.about_you && (
                  <div className="info-row about-section">
                    <span className="info-label">About:</span>
                    <span className="info-value about-text">{apiData.about_you}</span>
                  </div>
                )}
              </div>
            </>
          )}
          
          {/* Action Buttons - Only show for other users' profiles */}
          {!isOwnProfile && (
            <div className='matchedIcondDiv'>
              {/* Interest Button */}
              <button 
                className='matchedIcond' 
                onClick={()=>handleInterest()}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          
          
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
            fill={interestStatus === true ? "#ff4081" : "none"}
                  stroke="#ff4081"
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
          <p>{interestStatus === true ? "Withdraw" : "Interest"}</p>
              </button>
              
              {/* Shortlist Button */}
              <button
                className='matchedIcond'
                onClick={()=>handleShortlist()}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                {/* Shortlist Success Message */}
                {showShortlistMessage && (
                  <div className="shortlist-message">
                    {shortlistMessage}
                  </div>
                )}


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
                <p>{shortlistStatus === true ?"Shortlisted":"Shortlist"}</p>
              </button>
              
              {/* Block Button */}
              <button 
                className='matchedIcond' 
                onClick={()=>handleBlock()}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                {/* Block Success Message */}
                {showBlockMessage && (
                  <div className="block-message">
                    {blockMessage}
                  </div>
                )}


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
                <p>{blockStatus === true ?"Blocked":"Ignore"}</p>
              </button>
            </div>
          )}

          </>
      </div>
    </div>
  );
};

export default UserSetionOne;