import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import { 
  AiOutlineFilter, 
  AiOutlineRedo, 
  AiOutlineArrowLeft,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineCloseCircle,
  AiOutlineInfoCircle
} from "react-icons/ai";
import { fetchDataWithTokenV2 } from "../../../apiUtils";

// Match Details Modal Component
const MatchDetailsModal = ({ isOpen, onClose, member, currentMember }) => {
  if (!isOpen || !member || !currentMember) return null;
  
  console.log('Current member data:', currentMember);

  // Simple function to get match data from backend only - no frontend calculations
  const getBackendMatchData = (member) => {
    return {
      overallScore: member.match_percentage || member.compatibility_score || 0,
      matchBreakdown: member.match_breakdown || member.compatibility_details || null,
      // matchQuality: member.match_quality || null
    };
  };

  const matchData = getBackendMatchData(member);

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return '#10B981';
      case 'good': return '#3B82F6';
      case 'fair': return '#F59E0B';
      case 'poor': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return <AiOutlineCheck className="text-green-500" />;
      case 'good': return <AiOutlineCheck className="text-blue-500" />;
      case 'fair': return <AiOutlineInfoCircle className="text-yellow-500" />;
      case 'poor': return <AiOutlineClose className="text-red-500" />;
      default: return <AiOutlineInfoCircle className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'excellent': return 'Excellent Match';
      case 'good': return 'Good Match';
      case 'fair': return 'Fair Match';
      case 'poor': return 'Poor Match';
      default: return 'Unknown';
    }
  };

  // Helper function to determine API field status
  const getApiFieldStatus = (value) => {
    if (typeof value === 'boolean') {
      return value ? 'matched' : 'not-matched';
    }
    if (typeof value === 'object' && value !== null) {
      if (value.matched !== undefined) {
        return value.matched ? 'matched' : 'not-matched';
      }
      if (value.match !== undefined) {
        return value.match ? 'matched' : 'not-matched';
      }
      return 'data';
    }
    if (typeof value === 'string' && value.toLowerCase() === 'true') {
      return 'matched';
    }
    if (typeof value === 'string' && value.toLowerCase() === 'false') {
      return 'not-matched';
    }
    return 'data';
  };

  // Helper function to extract user values from API response
  const extractUserValues = (fieldKey, fieldValue, currentUser, matchedUser) => {
    // Try multiple possible field names and structures
    const possibleUser1Fields = [
      fieldValue?.user1_value,
      fieldValue?.user1_preferences,
      fieldValue?.current_user_value,
      fieldValue?.USER1_PREFERENCES,
      fieldValue?.USER1_VALUE,
      fieldValue?.user1,
      fieldValue?.current_user,
      currentUser?.[fieldKey.toLowerCase()],
      currentUser?.[fieldKey],
      currentUser?.[fieldKey.toUpperCase()]
    ];

    const possibleUser2Fields = [
      fieldValue?.user2_value,
      fieldValue?.user2_preferences,
      fieldValue?.matched_user_value,
      fieldValue?.USER2_VALUE,
      fieldValue?.USER2_PREFERENCES,
      fieldValue?.user2,
      fieldValue?.matched_user,
      matchedUser?.[fieldKey.toLowerCase()],
      matchedUser?.[fieldKey],
      matchedUser?.[fieldKey.toUpperCase()]
    ];

    // Find first non-null/undefined value
    const user1Value = possibleUser1Fields.find(val => val !== null && val !== undefined && val !== '');
    const user2Value = possibleUser2Fields.find(val => val !== null && val !== undefined && val !== '');

    return {
      user1Value: user1Value || 'N/A',
      user2Value: user2Value || 'N/A'
    };
  };

  // Helper function to render API field values in professional table layout
  const renderApiFieldValue = (value, fieldName) => {
    if (typeof value === 'object' && value !== null) {
      if (value.matched !== undefined || value.match !== undefined) {
        const isMatched = value.matched || value.match;
        const user1Value = value.user1_value || currentMember?.[fieldName.toLowerCase()] || 'N/A';
        const user2Value = value.user2_value || member?.[fieldName.toLowerCase()] || 'N/A';
        
        return (
          <div className="professional-comparison-row">
            {/* Field Name Header - Center */}
            <div className="field-name-header">
              <span className="field-name-text">
                {fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
            
            {/* Three Column Layout */}
            <div className="three-column-layout">
              {/* Left Column - User 1 Values */}
              <div className="column-left">
                <div className="column-header">Your Preferences</div>
                <div className="column-content">
                  <div className="value-item">
                    <span className="value-label">USER1_PREFERENCES:</span>
                    <span className="value-text">{user1Value}</span>
                  </div>
                </div>
              </div>
              
              {/* Center Column - Match Status & Matching Values */}
              <div className="column-center">
                <div className="match-status-container">
                  <div className="match-status-header">Match Status</div>
                  <div className={`match-badge ${isMatched ? 'match-true' : 'match-false'}`}>
                    {isMatched ? '✓ TRUE' : '✗ FALSE'}
                  </div>
                </div>
                
                <div className="matching-values-container">
                  <div className="matching-values-header">Matching Values</div>
                  <div className="matching-values-content">
                    {value.matching_values ? value.matching_values : 'None'}
                  </div>
                </div>
              </div>
              
              {/* Right Column - User 2 Values */}
              <div className="column-right">
                <div className="column-header">Their Preferences</div>
                <div className="column-content">
                  <div className="value-item">
                    <span className="value-label">USER2_VALUE:</span>
                    <span className="value-text">{user2Value}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      
      // For other object types, show a clean summary
      if (Array.isArray(value)) {
        return (
          <div className="array-content">
            <span className="array-label">Values:</span>
            <div className="array-items">
              {value.map((item, index) => (
                <span key={index} className="array-item">{String(item)}</span>
                  ))}
                </div>
              </div>
        );
      }
      
      // For other objects, show as professional field cards
      const keys = Object.keys(value);
      if (keys.length > 0) {
        return (
          <div className="object-fields-container">
            <div className="object-fields-grid">
              {keys.map((key, index) => {
                const fieldValue = value[key];
                const isBoolean = typeof fieldValue === 'boolean';
                const isObject = typeof fieldValue === 'object' && fieldValue !== null;
                
                return (
                  <div key={index} className="object-field-card">
                    <div className="field-card-header">
                      <span className="field-card-label">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      {isBoolean && (
                        <span className={`field-status-indicator ${fieldValue ? 'true' : 'false'}`}>
                          {fieldValue ? '✓' : '✗'}
                        </span>
                      )}
                </div>
                    
                    <div className="field-card-content">
                      {isBoolean ? (
                        <span className={`boolean-value ${fieldValue ? 'true' : 'false'}`}>
                          {fieldValue ? 'Yes' : 'No'}
                        </span>
                      ) : isObject ? (
                        <div className="nested-object">
                          {Object.keys(fieldValue).map((nestedKey, nestedIndex) => (
                            <div key={nestedIndex} className="nested-field">
                              <span className="nested-key">{nestedKey}:</span>
                              <span className="nested-value">{String(fieldValue[nestedKey])}</span>
                  </div>
                          ))}
              </div>
                      ) : Array.isArray(fieldValue) ? (
                        <div className="array-field">
                          {fieldValue.map((item, itemIndex) => (
                            <span key={itemIndex} className="array-item-tag">
                              {String(item)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="field-value-text">{String(fieldValue)}</span>
                      )}
                    </div>
          </div>
        );
              })}
            </div>
        </div>
      );
    }
    }
    
    // For simple values
    return (
      <div className="simple-value-content">
        <span className="simple-value-text">{String(value)}</span>
      </div>
    );
  };

  return (
    <div className="match-details-modal-overlay">
      <div className="match-details-modal">
        {/* <div className="modal-header">
          <div className="header-content">
            <div className="member-info-header">
              <img
                src={member?.profile_photo || '/images/muslim-man.png'}
                alt={member?.name}
                className="member-avatar-modal"
              />
              <div className="member-details-header">
                <h3 className="member-name-modal">{member?.name || "N/A"}</h3>
                <p className="member-id-modal">{member?.member_id || member?.id || "N/A"}</p>
                 <div className="match-score-header">
                   <div className="score-circle">
                     <span className="score-number">{matchData.overallScore}%</span>
                   </div>
                   <div className="score-info">
                     <span className="score-label">Overall Match</span>
                     <span className="score-detail">
                       Backend Calculated Score
                     </span>
                   </div>
                 </div>
              </div>
            </div>
            <button className="close-modal-btn" onClick={onClose}>
              <AiOutlineClose />
            </button>
          </div>
        </div> */}

        <div className="modal-content">
          {/* <div className="backend-score-section">
            <h4 className="section-title">Backend Match Score</h4>
            <div className="score-display">
              <div className="main-score">
                <span className="score-number-large">{matchData.overallScore}%</span>
                <span className="score-label-large">Overall Compatibility</span>
                    </div>
              <div className="score-note">
                <p><strong>Note:</strong> This score is calculated by our backend algorithm based on comprehensive compatibility analysis.</p>
                  </div>
            </div>
          </div> */}

          {/* User Comparison Section */}
          <div className="user-comparison-section">
            <h4 className="section-title">User Comparison</h4>
            <div className="comparison-container">
              <div className="user-column">
                <div className="user-header">
                  <h5 className="user-title">Current User</h5>
                  <div className="user-info">
                    <img
                      src={currentMember?.profile_photo ? 
                        (currentMember.profile_photo.startsWith('http') ? 
                          currentMember.profile_photo : 
                          `${process.env.REACT_APP_API_URL || ''}${currentMember.profile_photo}`) : 
                        '/images/muslim-man.png'}
                      alt={currentMember?.name}
                      className="user-avatar"
                      onError={(e) => {
                        console.log('Current user photo error:', currentMember?.profile_photo);
                        e.target.src = '/images/muslim-man.png';
                      }}
                    />
                    <div className="user-details">
                      <span className="user-name">{currentMember?.name || "N/A"}</span>
                      <span className="user-id">{currentMember?.member_id || currentMember?.id || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="comparison-column">
                <div className="comparison-header">
                  <h5 className="comparison-title">Match Analysis</h5>
                </div>
              </div>
              
              <div className="user-column">
                <div className="user-header">
                  <h5 className="user-title">Matched User</h5>
                  <div className="user-info">
                    <img
                      src={member?.profile_photo || '/images/muslim-man.png'}
                      alt={member?.name}
                      className="user-avatar"
                    />
                    <div className="user-details">
                      <span className="user-name">{member?.name || "N/A"}</span>
                      <span className="user-id">{member?.member_id || member?.id || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Field-by-Field Comparison */}
          <div className="field-comparison-section">
            <h4 className="section-title">Field-by-Field Comparison</h4>
            <div className="comparison-table">
              <div className="comparison-header-row">
                <div className="header-cell user-header-cell">Current User</div>
                <div className="header-cell match-header-cell">Match Status</div>
                <div className="header-cell user-header-cell">Matched User</div>
              </div>

              {/* Surname/Last Name Comparison (field-to-field with robust fallbacks) */}
              <div className="comparison-row">
                {(() => {
                  const currentSurname = ((typeof currentMember?.name === 'string' ? currentMember.name.trim().split(/\s+/).slice(-1)[0] : '') || '').trim();
                  const matchedSurname = ((typeof member?.name === 'string' ? member.name.trim().split(/\s+/).slice(-1)[0] : '') || '').trim();

                  const showCurrent = currentSurname || 'N/A';
                  const showMatched = matchedSurname || 'N/A';
                  const comparableCurrent = currentSurname.toLowerCase();
                  const comparableMatched = matchedSurname.toLowerCase();
                  const haveValues = Boolean(currentSurname) && Boolean(matchedSurname);
                  const isEqual = haveValues && comparableCurrent === comparableMatched;

                  return (
                    <>
                      <div className="comparison-cell user-cell">
                        <span className="field-label">Surname</span>
                        <span className="field-value">{showCurrent}</span>
                      </div>
                      <div className="comparison-cell match-cell">
                        {haveValues ? (
                          <span className={`match-badge ${isEqual ? 'match' : 'no-match'}`}>
                            {isEqual ? '✓ MATCH' : '✗ NO MATCH'}
                          </span>
                        ) : (
                          <span className="match-badge unknown">? UNKNOWN</span>
                        )}
                      </div>
                      <div className="comparison-cell user-cell">
                        <span className="field-label">Surname</span>
                        <span className="field-value">{showMatched}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
              


              {/* Age Comparison (use backend decision) */}
              <div className="comparison-row">
                <div className="comparison-cell user-cell">
                  <span className="field-label">Age</span>
                  <span className="field-value">{currentMember?.age || "N/A"}</span>
                </div>
                <div className="comparison-cell match-cell">
                  {(() => {
                    const ageMatch = member?.match_details?.age_match;
                    if (ageMatch === true) {
                      return <span className="match-badge match">✓ MATCH</span>;
                    }
                    if (ageMatch === false) {
                      return <span className="match-badge no-match">✗ NO MATCH</span>;
                    }
                    // if (currentMember?.age && member?.age) {
                    //   // Fallback if backend flag missing
                    //   return (
                    //     <span className={`match-badge ${Math.abs(currentMember.age - member.age) <= 2 ? 'match' : 'no-match'}`}>
                    //       {Math.abs(currentMember.age - member.age) <= 2 ? '✓ MATCH' : '✗ NO MATCH'}
                    //     </span>
                    //   );
                    // }
                    return <span className="match-badge unknown">? UNKNOWN</span>;
                  })()}
                </div>
                <div className="comparison-cell user-cell">
                  <span className="field-label">Age</span>
                  <span className="field-value">{member?.age || "N/A"}</span>
                </div>
              </div>

              {/* Location Comparison */}
              <div className="comparison-row">
                <div className="comparison-cell user-cell">
                  <span className="field-label">Location</span>
                  <span className="field-value">{currentMember?.city || "N/A"}</span>
                </div>
                <div className="comparison-cell match-cell">
                  {currentMember?.city && member?.city ? (
                    <span className={`match-badge ${currentMember.city.toLowerCase() === member.city.toLowerCase() ? 'match' : 'no-match'}`}>
                      {currentMember.city.toLowerCase() === member.city.toLowerCase() ? '✓ MATCH' : '✗ NO MATCH'}
                    </span>
                  ) : (
                    <span className="match-badge unknown">? UNKNOWN</span>
                  )}
                </div>
                <div className="comparison-cell user-cell">
                  <span className="field-label">Location</span>
                  <span className="field-value">{member?.city || "N/A"}</span>
                </div>
              </div>

              {/* Sect Comparison */}
              <div className="comparison-row">
                <div className="comparison-cell user-cell">
                  <span className="field-label">Sect</span>
                  <span className="field-value">{currentMember?.sect_school_info || "N/A"}</span>
                </div>
                <div className="comparison-cell match-cell">
                  {currentMember?.sect_school_info && member?.sect_school_info ? (
                    <span className={`match-badge ${currentMember.sect_school_info.toLowerCase() === member.sect_school_info.toLowerCase() ? 'match' : 'no-match'}`}>
                      {currentMember.sect_school_info.toLowerCase() === member.sect_school_info.toLowerCase() ? '✓ MATCH' : '✗ NO MATCH'}
                    </span>
                  ) : (
                    <span className="match-badge unknown">? UNKNOWN</span>
                  )}
                </div>
                <div className="comparison-cell user-cell">
                  <span className="field-label">Sect</span>
                  <span className="field-value">{member?.sect_school_info || "N/A"}</span>
                </div>
              </div>

              {/* Profession Comparison */}
              <div className="comparison-row">
                <div className="comparison-cell user-cell">
                  <span className="field-label">Profession</span>
                  <span className="field-value">{currentMember?.profession || "N/A"}</span>
                </div>
                <div className="comparison-cell match-cell">
                  {currentMember?.profession && member?.profession ? (
                    <span className={`match-badge ${currentMember.profession.toLowerCase() === member.profession.toLowerCase() ? 'match' : 'no-match'}`}>
                      {currentMember.profession.toLowerCase() === member.profession.toLowerCase() ? '✓ MATCH' : '✗ NO MATCH'}
                    </span>
                  ) : (
                    <span className="match-badge unknown">? UNKNOWN</span>
                  )}
                </div>
                <div className="comparison-cell user-cell">
                  <span className="field-label">Profession</span>
                  <span className="field-value">{member?.profession || "N/A"}</span>
                </div>
              </div>

              {/* Marital Status Comparison */}
              <div className="comparison-row">
                <div className="comparison-cell user-cell">
                  <span className="field-label">Marital Status</span>
                  <span className="field-value">{currentMember?.martial_status || "N/A"}</span>
                </div>
                <div className="comparison-cell match-cell">
                  {currentMember?.martial_status && member?.martial_status ? (
                    <span className={`match-badge ${currentMember.martial_status.toLowerCase() === member.martial_status.toLowerCase() ? 'match' : 'no-match'}`}>
                      {currentMember.martial_status.toLowerCase() === member.martial_status.toLowerCase() ? '✓ MATCH' : '✗ NO MATCH'}
                    </span>
                  ) : (
                    <span className="match-badge unknown">? UNKNOWN</span>
                  )}
                </div>
                <div className="comparison-cell user-cell">
                  <span className="field-label">Marital Status</span>
                  <span className="field-value">{member?.martial_status || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Match Analysis Section */}
          {member.match_breakdown || member.compatibility_details ? (
            <div className="professional-analysis-section">
              {/* <div className="analysis-section-header">
                <div className="header-main">
                  <div className="header-icon-container">
                    <span className="header-icon">📊</span>
                  </div>
                  <div className="header-content">
                    <h4 className="section-title">Professional Match Analysis</h4>
                    <p className="section-subtitle">Detailed compatibility assessment across all preference categories</p>
                  </div>
                </div>
                <div className="header-actions">
                  <div className="analysis-badge">
                    <span className="badge-icon">🎯</span>
                    <span className="badge-text">AI Powered</span>
                  </div>
                </div>
              </div> */}
              
              {/* Comparison Header */}
              {/* <div className="comparison-header-info">
                <div className="header-description">
                  Comprehensive field-by-field analysis showing detailed compatibility between your preferences and their profile
                </div>
                <div className="comparison-legend">
                  <div className="legend-item">
                    <div className="legend-color blue"></div>
                    <span>Your Preferences</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color green"></div>
                    <span>Their Preferences</span>
                  </div>
                </div>
              </div> */}
              
              {/* Match Statistics Summary */}
              {/* <div className="match-stats-summary">
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">{matchData.overallScore}%</div>
                    <div className="stat-label">Overall Match</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">
                      {member.match_breakdown?.matched_fields || 0}
                    </div>
                    <div className="stat-label">Matching Fields</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">
                      {member.match_breakdown?.total_fields || 0}
                    </div>
                    <div className="stat-label">Total Fields</div>
                  </div>
                </div>
              </div> */}

              {/* Professional Match Breakdown */}
              {member.match_breakdown && (
                <div className="professional-match-table">
                  <div className="comparison-header-row">
                    <div className="header-cell user-header-cell">Current User</div>
                    <div className="header-cell match-header-cell">Match Status</div>
                    <div className="header-cell user-header-cell">Matched User</div>
                  </div>
                  {(() => {
                    // Get the actual field_matches object which contains the real field comparisons
                    const fieldMatches = member.match_breakdown.field_matches;
                    
                    if (!fieldMatches || typeof fieldMatches !== 'object') {
                      return <div className="no-data-message">No detailed field matches available</div>;
                    }
                    
                      return Object.entries(fieldMatches).map(([key, value]) => {
                        // Better field name formatting
                        const fieldNameMap = {
                          'preferred_surname': 'Preferred Surname',
                          'preferred_dargah_fatiha_niyah': 'Preferred Dargah Fatiha Niyah',
                          'preferred_city': 'Preferred City',
                          'preferred_education': 'Preferred Education',
                          'preferred_sect': 'Preferred Sect',
                          'desired_practicing_level': 'Desired Practicing Level',
                          'preferred_family_type': 'Preferred Family Type',
                          'preferred_occupation_profession': 'Preferred Profession',
                          'preferred_country': 'Preferred Country',
                          'preferred_state': 'Preferred State',
                          'preferred_family_background': 'Preferred Family Background'
                        };
                        
                        // Field names for matched user (without "Preferred")
                        const matchedUserFieldNameMap = {
                          'preferred_surname': 'Surname',
                          'preferred_dargah_fatiha_niyah': 'Dargah Fatiha Niyah',
                          'preferred_city': 'City',
                          'preferred_education': 'Education',
                          'preferred_sect': 'Sect',
                          'desired_practicing_level': 'Practicing Level',
                          'preferred_family_type': 'Family Type',
                          'preferred_occupation_profession': 'Profession',
                          'preferred_country': 'Country',
                          'preferred_state': 'State',
                          'preferred_family_background': 'Family Background'
                        };
                        
                        const fieldName = fieldNameMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        const matchedUserFieldName = matchedUserFieldNameMap[key] || fieldName;
                        const status = getApiFieldStatus(value);
                        const isMatched = status === 'matched';
                      
                      // Extract user values from the actual field data structure
                      const user1Value = value.user1_preferences ? 
                        (Array.isArray(value.user1_preferences) ? value.user1_preferences.join(', ') : value.user1_preferences) : 
                        'N/A';
                        
                      const user2Value = value.user2_value ? 
                        (Array.isArray(value.user2_value) ? value.user2_value.join(', ') : value.user2_value) : 
                        'N/A';
                    
                      return (
                        <div key={key} className="comparison-row">
                          <div className="comparison-cell user-cell">
                            <span className="field-label">{fieldName}</span>
                            <span className="field-value">{user1Value}</span>
                          </div>
                          <div className="comparison-cell match-cell">
                            <span className={`match-badge ${isMatched ? 'match' : 'no-match'}`}>
                              {isMatched ? '✓ MATCH' : '✗ NO MATCH'}
                            </span>
                          </div>
                          <div className="comparison-cell user-cell">
                            <span className="field-label">{matchedUserFieldName}</span>
                            <span className="field-value">{user2Value}</span>
                          </div>
                        </div>
                    );
                  });
                  })()}
                </div>
              )}
              
              {/* Compatibility Details */}
              {member.compatibility_details && (
                <div className="api-response-card">
                  <div className="api-card-header">
                    <h5 className="api-card-title">
                      <span className="api-icon">⚖️</span>
                      Compatibility Details
                    </h5>
                    <span className="api-badge">API Response</span>
                  </div>
                  
                  <div className="api-content-grid">
                    {Object.entries(member.compatibility_details).map(([key, value]) => (
                      <div key={key} className="api-field-card">
                        <div className="api-field-header">
                          <span className="api-field-label">{key.replace(/_/g, ' ').toUpperCase()}</span>
                          <span className={`api-field-status ${getApiFieldStatus(value)}`}>
                            {getApiFieldStatus(value)}
                          </span>
                        </div>
                        <div className="api-field-content">
                          {renderApiFieldValue(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Match Quality */}
              {/* {member.match_quality && (
                <div className="api-response-card">
                  <div className="api-card-header">
                    <h5 className="api-card-title">
                      <span className="api-icon">📊</span>
                      Match Quality
                    </h5>
                    <span className="api-badge">API Response</span>
                  </div>
                  
                  <div className="api-content-grid">
                    {Object.entries(member.match_quality).map(([key, value]) => (
                      <div key={key} className="api-field-card">
                        <div className="api-field-header">
                          <span className="api-field-label">{key.replace(/_/g, ' ').toUpperCase()}</span>
                          <span className={`api-field-status ${getApiFieldStatus(value)}`}>
                            {getApiFieldStatus(value)}
                          </span>
                        </div>
                        <div className="api-field-content">
                          {renderApiFieldValue(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}
            </div>
          ) : null}

          <div className="recommendations-section">
            <h4 className="section-title">Recommendations</h4>
            <div className="recommendations-list">
              {matchData.overallScore >= 80 && (
                <div className="recommendation-item excellent">
                  <div className="rec-icon">🌟</div>
                  <div className="rec-text">
                    <strong>Excellent Match!</strong> This profile shows high compatibility across multiple areas.
                  </div>
                </div>
              )}
              {matchData.overallScore >= 60 && matchData.overallScore < 80 && (
                <div className="recommendation-item good">
                  <div className="rec-icon">✅</div>
                  <div className="rec-text">
                    <strong>Good Match!</strong> This profile has good potential with some areas to explore.
                  </div>
                </div>
              )}
              {matchData.overallScore < 60 && (
                <div className="recommendation-item fair">
                  <div className="rec-icon">⚠️</div>
                  <div className="rec-text">
                    <strong>Consider Carefully</strong> This profile may require more discussion about compatibility.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="action-btn secondary" onClick={onClose}>
            Close
          </button>
          <button className="action-btn primary" onClick={() => {
            // Navigate to detailed profile or start conversation
            onClose();
          }}>
            View Full Profile
          </button>
        </div>
      </div>

      <style>
        {`
          .match-details-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
          }

          .match-details-modal {
            background: white;
            border-radius: 20px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow: hidden;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
            animation: modalSlideIn 0.3s ease-out;
          }

          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translateY(-50px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .modal-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 24px;
          }

          .header-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }

          .member-info-header {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .member-avatar-modal {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          }

          .member-details-header {
            flex: 1;
          }

          .member-name-modal {
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 4px 0;
            color: white;
          }

          .member-id-modal {
            font-size: 14px;
            opacity: 0.9;
            margin: 0 0 12px 0;
            font-family: 'SF Mono', 'Monaco', monospace;
          }

          .match-score-header {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .score-circle {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid rgba(255, 255, 255, 0.3);
          }

          .score-number {
            font-size: 18px;
            font-weight: 700;
            color: white;
          }

          .score-info {
            display: flex;
            flex-direction: column;
          }

          .score-label {
            font-size: 14px;
            font-weight: 600;
            color: white;
          }

          .score-detail {
            font-size: 12px;
            opacity: 0.8;
            color: white;
          }

          .close-modal-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .close-modal-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
          }

          .modal-content {
            padding: 24px;
            max-height: 60vh;
            overflow-y: auto;
          }

          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #000000;
            margin: 0 0 16px 0;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .matches-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
          }

          .match-item {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 16px;
            border: 1px solid #e9ecef;
            transition: all 0.3s ease;
          }

          .match-item:hover {
            background: #f1f3f4;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .match-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 8px;
          }

          .match-icon {
            font-size: 20px;
          }

          .match-field {
            flex: 1;
            font-weight: 600;
            color: #1f2937;
            font-size: 14px;
          }

          .match-status {
            font-size: 16px;
          }

          .match-description {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 12px;
            line-height: 1.4;
          }

          .match-score-bar {
            height: 6px;
            background: #e5e7eb;
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 6px;
          }

          .score-fill {
            height: 100%;
            border-radius: 3px;
            transition: width 0.3s ease;
          }

          .match-score-text {
            font-size: 12px;
            color: #6b7280;
            font-weight: 500;
          }

          .recommendations-section {
            margin-top: 24px;
          }

          .recommendations-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .recommendation-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 16px;
            border-radius: 12px;
            border-left: 4px solid;
          }

          .recommendation-item.excellent {
            background: #f0fdf4;
            border-left-color: #10b981;
          }

          .recommendation-item.good {
            background: #eff6ff;
            border-left-color: #3b82f6;
          }

          .recommendation-item.fair {
            background: #fffbeb;
            border-left-color: #f59e0b;
          }

          .rec-icon {
            font-size: 20px;
            flex-shrink: 0;
          }

          .rec-text {
            font-size: 14px;
            color: #374151;
            line-height: 1.5;
          }

          /* API Details Section */
          .api-details-section {
            margin-top: 24px;
            margin-bottom: 24px;
          }

          .api-details-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 16px;
            margin-bottom: 16px;
          }

          .api-detail-card {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 16px;
            border: 1px solid #e9ecef;
            transition: all 0.3s ease;
          }

          .api-detail-card:hover {
            background: #f1f3f4;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .detail-card-title {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 12px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid #e5e7eb;
          }

          .detail-content {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .detail-item {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 6px 0;
            border-bottom: 1px solid #f3f4f6;
          }

          .detail-item:last-child {
            border-bottom: none;
          }

          .detail-key {
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            min-width: 120px;
            flex-shrink: 0;
          }

          .detail-value {
            font-size: 13px;
            color: #374151;
            font-weight: 500;
            text-align: right;
            word-break: break-word;
            max-width: 200px;
          }

          /* Score Explanation Section */
          .score-explanation-section {
            margin-top: 24px;
            margin-bottom: 24px;
          }

          .score-explanation-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 16px;
          }

          .score-explanation-card {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 16px;
            border: 1px solid #e9ecef;
            text-align: center;
            transition: all 0.3s ease;
          }

          .score-explanation-card:hover {
            background: #f1f3f4;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .explanation-title {
            font-size: 14px;
            font-weight: 600;
            color: #6b7280;
            margin: 0 0 8px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .explanation-content {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .explanation-value {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
          }

          .explanation-desc {
            font-size: 12px;
            color: #6b7280;
            font-weight: 500;
          }

          .score-note {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 12px;
            margin-top: 16px;
          }

          .score-note p {
            margin: 0;
            font-size: 13px;
            color: #1e40af;
            line-height: 1.4;
          }

          /* User Comparison Section */
          .user-comparison-section {
            margin-top: 24px;
            margin-bottom: 24px;
          }

          .comparison-container {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 20px;
            align-items: center;
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            border: 1px solid #e9ecef;
          }

          .user-column {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .user-header {
            text-align: center;
          }

          .user-title {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 12px 0;
          }

          .user-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }

          .user-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #e5e7eb;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .user-details {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
          }

          .user-name {
            font-size: 14px;
            font-weight: 600;
            color: #1f2937;
          }

          .user-id {
            font-size: 12px;
            color: #6b7280;
            font-family: 'SF Mono', 'Monaco', monospace;
          }

          .comparison-column {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .comparison-title {
            font-size: 14px;
            font-weight: 600;
            color: #6b7280;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          /* Field Comparison Section */
          .field-comparison-section {
            margin-top: 24px;
            margin-bottom: 24px;
          }

          /* Professional Match Table */
          .professional-match-table {
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #e9ecef;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin-top: 24px;
          }

          .comparison-table {
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #e9ecef;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .comparison-header-row {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            background: #f8f9fa;
            border-bottom: 2px solid #e9ecef;
          }

          .header-cell {
            padding: 16px;
            font-size: 14px;
            font-weight: 600;
            color: #1f2937;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .user-header-cell {
            background: #e3f2fd;
            color: #1565c0;
          }

          .match-header-cell {
            background: #f3e5f5;
            color: #7b1fa2;
            min-width: 150px;
          }

          .comparison-row {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            border-bottom: 1px solid #f3f4f6;
            transition: background-color 0.2s ease;
          }

          .comparison-row:hover {
            background: #f8f9fa;
          }

          .comparison-row:last-child {
            border-bottom: none;
          }

          .comparison-cell {
            padding: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
          }

          .user-cell {
            background: #fafafa;
          }

          .match-cell {
            background: #fff;
            min-width: 150px;
            justify-content: center;
          }

          .field-label {
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .field-value {
            font-size: 14px;
            font-weight: 500;
            color: #1f2937;
            text-align: center;
          }

          .match-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: inline-block;
            border: 2px solid transparent;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .match-badge.match {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            border-color: #047857;
          }

          .match-badge.no-match {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: #ffffff;
            border-color: #b91c1c;
          }

          .match-badge.unknown {
            background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
            color: #ffffff;
            border-color: #374151;
          }

          /* API Response Cards */
          .api-response-card {
            background: #fff;
            border-radius: 16px;
            border: 1px solid #e9ecef;
            margin-bottom: 20px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }

          .api-response-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }

          .api-card-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .api-card-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 16px;
            font-weight: 600;
            margin: 0;
          }

          .api-icon {
            font-size: 18px;
          }

          .api-badge {
            background: rgba(255, 255, 255, 0.2);
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .api-content-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 16px;
            padding: 20px;
          }

          .api-field-card {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 16px;
            border: 1px solid #e9ecef;
            transition: all 0.3s ease;
          }

          .api-field-card:hover {
            background: #f1f3f4;
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .api-field-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e5e7eb;
          }

          .api-field-label {
            font-size: 13px;
            font-weight: 600;
            color: #374151;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .api-field-status {
            padding: 4px 8px;
            border-radius: 8px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .api-field-status.matched {
            background: #d1fae5;
            color: #065f46;
          }

          .api-field-status.not-matched {
            background: #fee2e2;
            color: #991b1b;
          }

          .api-field-status.data {
            background: #e0e7ff;
            color: #3730a3;
          }

          .api-field-content {
            font-size: 13px;
            line-height: 1.5;
          }

          /* API Object Content */
          .api-object-content {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .api-match-indicator {
            margin-bottom: 8px;
          }

          .api-match-badge {
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: inline-block;
          }

          .api-match-badge.matched {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
          }

          .api-match-badge.not-matched {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: #ffffff;
          }

          .api-details {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .api-details-label {
            font-size: 11px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .api-details-value {
            font-size: 13px;
            color: #374151;
            font-weight: 500;
          }

          .api-matching-values {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .api-matching-label {
            font-size: 11px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .api-values-list {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
          }

          .api-value-tag {
            background: #e0e7ff;
            color: #3730a3;
            padding: 2px 8px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 500;
          }

          .api-user-values {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .api-user-value {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 8px;
            background: #f3f4f6;
            border-radius: 6px;
          }

          .api-user-label {
            font-size: 11px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .api-user-data {
            font-size: 12px;
            color: #374151;
            font-weight: 500;
          }

          .api-json-content {
            background: #1f2937;
            border-radius: 8px;
            padding: 12px;
            overflow-x: auto;
          }

          .api-json-text {
            color: #e5e7eb;
            font-size: 12px;
            font-family: 'SF Mono', 'Monaco', monospace;
            margin: 0;
            white-space: pre-wrap;
            word-break: break-word;
          }

          .api-simple-value {
            padding: 8px 12px;
            background: #f3f4f6;
            border-radius: 8px;
            border-left: 4px solid #3b82f6;
          }

          .api-value-text {
            font-size: 13px;
            color: #374151;
            font-weight: 500;
            font-family: 'SF Mono', 'Monaco', monospace;
          }

          .modal-footer {
            padding: 20px 24px;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
          }

          .action-btn {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            border: none;
            font-size: 14px;
          }

          .action-btn.secondary {
            background: #6b7280;
            color: white;
          }

          .action-btn.secondary:hover {
            background: #4b5563;
            transform: translateY(-1px);
          }

          .action-btn.primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }

          .action-btn.primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          }

          @media (max-width: 768px) {
            .match-details-modal {
              margin: 10px;
              max-height: 95vh;
            }

            .modal-header {
              padding: 16px;
            }

            .member-info-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 12px;
            }

            .member-avatar-modal {
              width: 60px;
              height: 60px;
            }

            .member-name-modal {
              font-size: 20px;
            }

            .modal-content {
              padding: 16px;
            }

            .matches-grid {
              grid-template-columns: 1fr;
            }

            .modal-footer {
              padding: 16px;
              flex-direction: column;
            }

            .action-btn {
              width: 100%;
            }

            .comparison-container {
              grid-template-columns: 1fr;
              gap: 16px;
            }

            .comparison-header-row {
              grid-template-columns: 1fr;
            }

            .comparison-row {
              grid-template-columns: 1fr;
              gap: 8px;
            }

            .header-cell {
              padding: 12px;
            }

            .comparison-cell {
              padding: 12px;
            }

            .user-avatar {
              width: 50px;
              height: 50px;
            }

            .score-explanation-grid {
              grid-template-columns: 1fr;
            }

            .api-content-grid {
              grid-template-columns: 1fr;
              padding: 16px;
            }

            .api-field-card {
              padding: 12px;
            }

            .api-card-header {
              padding: 12px 16px;
            }

            .api-card-title {
              font-size: 14px;
            }

            .api-user-value {
              flex-direction: column;
              align-items: flex-start;
              gap: 4px;
            }
          }

          /* Backend Score Section Styles */
          .backend-score-section {
            margin-bottom: 24px;
            padding: 20px;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 12px;
            border: 1px solid #e2e8f0;
          }

          .score-display {
            text-align: center;
            padding: 20px 0;
          }

          .main-score {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
          }

          .score-number-large {
            font-size: 48px;
            font-weight: 700;
            color: #1e293b;
            line-height: 1;
          }

          .score-label-large {
            font-size: 16px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          /* Professional Analysis Section Styles */
          .professional-analysis-section {
            margin-top: 24px;
            padding: 20px;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 12px;
            border: 1px solid #e2e8f0;
          }

          /* Analysis Section Header */
          .analysis-section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            padding: 24px;
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            border-radius: 16px;
            color: white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }

          .header-main {
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .header-icon-container {
            width: 56px;
            height: 56px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
          }

          .header-icon {
            font-size: 28px;
          }

          .header-content {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .section-title {
            font-size: 24px;
            font-weight: 800;
            color: #000000;
            margin: 0;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          }

          .section-subtitle {
            font-size: 14px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.8);
            margin: 0;
            line-height: 1.4;
          }

          .header-actions {
            display: flex;
            align-items: center;
          }

          .analysis-badge {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: rgba(34, 197, 94, 0.2);
            border: 1px solid rgba(34, 197, 94, 0.3);
            border-radius: 20px;
            backdrop-filter: blur(10px);
          }

          .badge-icon {
            font-size: 14px;
          }

          .badge-text {
            font-size: 12px;
            font-weight: 600;
            color: #22c55e;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .comparison-header-info {
            background: #ffffff;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 20px;
            border: 1px solid #e5e7eb;
          }

          .header-description {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 12px;
            line-height: 1.5;
          }

          .comparison-legend {
            display: flex;
            gap: 20px;
            align-items: center;
          }

          .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .legend-color {
            width: 12px;
            height: 12px;
            border-radius: 3px;
          }

          .legend-color.blue {
            background: #3b82f6;
          }

          .legend-color.green {
            background: #10b981;
          }

          .legend-item span {
            font-size: 12px;
            font-weight: 500;
            color: #374151;
          }

          .match-stats-summary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            color: white;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }

          .stat-item {
            text-align: center;
            padding: 12px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            backdrop-filter: blur(10px);
          }

          .stat-number {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 4px;
            color: #ffffff;
          }

          .stat-label {
            font-size: 12px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.8);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .title-icon {
            font-size: 20px;
          }

          .analysis-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 16px;
            margin-top: 16px;
          }

          .analysis-card {
            background: white;
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
            transition: all 0.3s ease;
          }

          .analysis-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          }

          .analysis-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }

          .field-info {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .field-icon {
            font-size: 18px;
          }

          .field-name {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
          }

          .status-indicator {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
          }

          .analysis-card-content {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            color: white;
            text-align: center;
            width: fit-content;
          }

          .field-details {
            font-size: 13px;
            color: #6b7280;
            line-height: 1.4;
          }

          /* Professional Field Comparison Styles */
          .professional-comparison-row {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            margin-bottom: 16px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
            overflow: hidden;
          }

          .professional-comparison-row:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border-color: #d1d5db;
          }

          /* Field Name Header - Center */
          .field-name-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 12px 20px;
            text-align: center;
            border-bottom: 1px solid #e5e7eb;
          }

          .field-name-text {
            font-size: 16px;
            font-weight: 700;
            color: #ffffff;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          }

          /* Three Column Layout */
          .three-column-layout {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 0;
            min-height: 120px;
          }

          /* Left and Right Columns */
          .column-left,
          .column-right {
            padding: 16px;
            border-right: 1px solid #f3f4f6;
          }

          .column-right {
            border-right: none;
            border-left: 1px solid #f3f4f6;
          }

          .column-header {
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            text-align: center;
          }

          .column-content {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .value-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .value-label {
            font-size: 11px;
            font-weight: 500;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.025em;
          }

          .value-text {
            font-size: 13px;
            font-weight: 500;
            color: #111827;
            line-height: 1.4;
            word-break: break-word;
            background: #f9fafb;
            padding: 8px;
            border-radius: 6px;
            border-left: 3px solid #d1d5db;
          }

          /* Center Column */
          .column-center {
            padding: 16px;
            background: #f8fafc;
            border-left: 1px solid #f3f4f6;
            border-right: 1px solid #f3f4f6;
            min-width: 200px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 16px;
          }

          .match-status-container,
          .matching-values-container {
            text-align: center;
          }

          .match-status-header,
          .matching-values-header {
            font-size: 11px;
            font-weight: 600;
            color: #6b7280;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .match-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .match-true {
            background: #dcfce7;
            color: #16a34a;
            border: 2px solid #16a34a;
          }

          .match-false {
            background: #fef2f2;
            color: #dc2626;
            border: 2px solid #dc2626;
          }

          .matching-values-content {
            font-size: 12px;
            color: #374151;
            background: #ffffff;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
            min-height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            word-break: break-word;
          }

          /* Professional Match Grid */
          .professional-match-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
            margin-top: 20px;
          }

          .professional-match-card {
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid #e5e7eb;
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .professional-match-card:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            transform: translateY(-2px);
          }

          /* Match Card Header */
          .match-card-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: white;
          }

          .field-header-content {
            display: flex;
            align-items: center;
            gap: 16px;
          }

          .field-icon-container {
            width: 48px;
            height: 48px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
          }

          .field-icon {
            font-size: 24px;
          }

          .field-title-section {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .field-title {
            font-size: 18px;
            font-weight: 700;
            margin: 0;
            color: #ffffff;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          }

          .field-subtitle {
            font-size: 12px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.8);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .match-status-indicator {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
          }

          .match-status-indicator.matched {
            background: rgba(34, 197, 94, 0.3);
            border: 2px solid rgba(34, 197, 94, 0.5);
          }

          .match-status-indicator.not-matched {
            background: rgba(239, 68, 68, 0.3);
            border: 2px solid rgba(239, 68, 68, 0.5);
          }

          .status-circle {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            color: white;
          }

          /* Match Card Content */
          .match-card-content {
            padding: 24px;
          }

          .comparison-grid {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 24px;
            align-items: stretch;
          }

          /* User Columns */
          .user-column {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .user-column-header {
            text-align: center;
            padding-bottom: 16px;
            border-bottom: 2px solid #f3f4f6;
          }

          .user-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            margin: 0 auto 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: 700;
            color: white;
            margin-bottom: 8px;
          }

          .current-user .user-avatar {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          }

          .matched-user .user-avatar {
            background: linear-gradient(135deg, #10b981 0%, #047857 100%);
          }

          .avatar-text {
            font-size: 14px;
            font-weight: 600;
          }

          .user-label {
            font-size: 12px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .user-preference-box {
            background: #f8fafc;
            border-radius: 12px;
            padding: 16px;
            border: 1px solid #e5e7eb;
          }

          .preference-label {
            font-size: 11px;
            font-weight: 600;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 8px;
          }

          .preference-value {
            font-size: 14px;
            font-weight: 500;
            color: #111827;
            line-height: 1.5;
            word-break: break-word;
          }

          /* Match Status Column */
          .match-status-column {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 160px;
          }

          .match-status-box {
            text-align: center;
            padding: 20px;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 12px;
            border: 2px solid #e5e7eb;
            min-width: 140px;
          }

          .match-status-label {
            font-size: 11px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 12px;
          }

          .match-result-badge {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            padding: 12px 16px;
            border-radius: 8px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-size: 12px;
          }

          .match-result-badge.success {
            background: #dcfce7;
            color: #16a34a;
            border: 2px solid #16a34a;
          }

          .match-result-badge.failed {
            background: #fef2f2;
            color: #dc2626;
            border: 2px solid #dc2626;
          }

          .match-icon {
            font-size: 16px;
          }

          .no-data-message {
            text-align: center;
            padding: 40px 20px;
            color: #6b7280;
            font-size: 16px;
            font-weight: 500;
            background: #f9fafb;
            border-radius: 12px;
            border: 2px dashed #d1d5db;
          }

          .match-status-column {
            min-width: 120px;
          }

          .field-label {
            font-size: 11px;
            font-weight: 600;
            color: #374151;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }

          .field-value {
            font-size: 14px;
            font-weight: 600;
            color: #1f2937;
          }

          .match-status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            white-space: nowrap;
          }

          .match-status-badge.matched {
            background-color: #10b981;
            color: white;
          }

          .match-status-badge.not-matched {
            background-color: #ef4444;
            color: white;
          }

          /* Professional Object Fields Display */
          .object-fields-container {
            padding: 16px;
            background: #f8fafc;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
          }

          .object-fields-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
          }

          .object-field-card {
            background: white;
            border-radius: 10px;
            padding: 16px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
            transition: all 0.3s ease;
          }

          .object-field-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          }

          .field-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid #f3f4f6;
          }

          .field-card-label {
            font-size: 13px;
            font-weight: 700;
            color: #374151;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .field-status-indicator {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
          }

          .field-status-indicator.true {
            background-color: #10b981;
            color: white;
          }

          .field-status-indicator.false {
            background-color: #ef4444;
            color: white;
          }

          .field-card-content {
            min-height: 40px;
            display: flex;
            align-items: center;
          }

          .boolean-value {
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .boolean-value.true {
            background-color: #d1fae5;
            color: #065f46;
          }

          .boolean-value.false {
            background-color: #fee2e2;
            color: #991b1b;
          }

          .nested-object {
            display: flex;
            flex-direction: column;
            gap: 6px;
            width: 100%;
          }

          .nested-field {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 12px;
            background: #f9fafb;
            border-radius: 6px;
            border-left: 3px solid #3b82f6;
          }

          .nested-key {
            font-size: 11px;
            font-weight: 600;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .nested-value {
            font-size: 13px;
            color: #1f2937;
            font-weight: 500;
          }

          .array-field {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            width: 100%;
          }

          .array-item-tag {
            display: inline-block;
            padding: 6px 12px;
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            color: #1e40af;
            border-radius: 16px;
            font-size: 12px;
            font-weight: 600;
            border: 1px solid #93c5fd;
          }

          .field-value-text {
            font-size: 14px;
            color: #1f2937;
            font-weight: 600;
            padding: 8px 12px;
            background: #f3f4f6;
            border-radius: 8px;
            border-left: 4px solid #10b981;
          }

          /* Array Content Styles */
          .array-content {
            padding: 12px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }

          .array-label {
            font-size: 12px;
            font-weight: 600;
            color: #374151;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
            display: block;
          }

          .array-items {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }

          .array-item {
            display: inline-block;
            padding: 4px 8px;
            background: #e5e7eb;
            color: #374151;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
          }

          .simple-value-content {
            padding: 8px 12px;
            background: #f3f4f6;
            border-radius: 6px;
            text-align: center;
          }

          .simple-value-text {
            font-size: 14px;
            color: #374151;
            font-weight: 500;
          }

          /* Mobile Responsive */
          @media (max-width: 768px) {
            .analysis-grid {
              grid-template-columns: 1fr;
              gap: 12px;
            }

            .analysis-card {
              padding: 12px;
            }

            .professional-analysis-section {
              padding: 16px;
            }

            .analysis-section-header {
              flex-direction: column;
              gap: 16px;
              padding: 20px;
              margin-bottom: 20px;
            }

            .header-main {
              gap: 16px;
            }

            .header-icon-container {
              width: 48px;
              height: 48px;
            }

            .header-icon {
              font-size: 24px;
            }

            .section-title {
              font-size: 20px;
            }

            .section-subtitle {
              font-size: 13px;
            }

            .analysis-badge {
              padding: 6px 12px;
            }

            .badge-text {
              font-size: 11px;
            }

            .comparison-header-info {
              padding: 12px;
              margin-bottom: 16px;
            }

            .header-description {
              font-size: 13px;
            }

            .comparison-legend {
              flex-direction: column;
              gap: 8px;
              align-items: flex-start;
            }

            .match-stats-summary {
              padding: 16px;
              margin-bottom: 16px;
            }

            .stats-grid {
              grid-template-columns: 1fr;
              gap: 12px;
            }

            .stat-number {
              font-size: 20px;
            }

            .professional-comparison-row {
              margin-bottom: 12px;
            }

            .field-name-header {
              padding: 10px 16px;
            }

            .field-name-text {
              font-size: 14px;
            }

            .three-column-layout {
              grid-template-columns: 1fr;
              gap: 0;
              min-height: auto;
            }

            .column-left,
            .column-right,
            .column-center {
              padding: 12px;
              border-right: none;
              border-left: none;
              border-bottom: 1px solid #f3f4f6;
            }

            .column-center {
              background: #f8fafc;
              border-bottom: none;
              order: -1;
            }

            .column-header {
              font-size: 11px;
              margin-bottom: 8px;
            }

            .value-text {
              font-size: 12px;
              padding: 6px;
            }

            .match-badge {
              padding: 6px 12px;
              font-size: 11px;
            }

            .matching-values-content {
              font-size: 11px;
              padding: 6px 10px;
              min-height: 35px;
            }

            /* Professional Match Cards Mobile */
            .professional-match-grid {
              gap: 16px;
              margin-top: 16px;
            }

            .professional-match-card {
              border-radius: 12px;
            }

            .match-card-header {
              padding: 16px;
              flex-direction: column;
              gap: 12px;
              align-items: flex-start;
            }

            .field-header-content {
              gap: 12px;
            }

            .field-icon-container {
              width: 40px;
              height: 40px;
            }

            .field-icon {
              font-size: 20px;
            }

            .field-title {
              font-size: 16px;
            }

            .match-status-indicator {
              width: 40px;
              height: 40px;
              align-self: flex-end;
            }

            .match-card-content {
              padding: 16px;
            }

            .comparison-grid {
              grid-template-columns: 1fr;
              gap: 16px;
            }

            .match-status-column {
              order: -1;
              min-width: auto;
            }

            .match-status-box {
              padding: 16px;
              min-width: auto;
            }

            .user-avatar {
              width: 50px;
              height: 50px;
            }

            .avatar-text {
              font-size: 12px;
            }

            .user-preference-box {
              padding: 12px;
            }

            .preference-value {
              font-size: 13px;
            }

            .match-status-column {
              min-width: auto;
              order: -1;
            }

            .field-label {
              margin-bottom: 0;
              margin-right: 8px;
            }

            .object-fields-grid {
              grid-template-columns: 1fr;
              gap: 12px;
            }

            .object-field-card {
              padding: 12px;
            }

            .field-card-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 8px;
            }

            .field-status-indicator {
              align-self: flex-end;
            }
          }
        `}
      </style>
    </div>
  );
};

const MemberMatches = () => {
  const navigate = useNavigate();
  const { memberId } = useParams();
  const [memberInfo, setMemberInfo] = useState(null);
  const [matchDetails, setMatchDetails] = useState([]);
  const [useError, setError] = useState(false);
  const [useLoading, setLoading] = useState(false);
  
  // Match details modal state
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  
  // Filter and sort states
  const [filteredItems, setFilteredItems] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  let [filters, setFilters] = useState({
    id: '',
    name: '',
    agentName: '',
    city: '',
    age: '',
    sectSchoolInfo: '',
    profession: '',
    status: '',
    martialStatus: '',
    maxAge: '',
    minAge: '',
    minMatchPercentage: ''
  });
  let [gender] = useState(localStorage.getItem("gender"));

  // Filter functions
  const handleFilterChange = (column, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [column]: value };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };

  const onClearFilterClick = () => {
    let clear = {
      id: '',
      name: '',
      agentName: '',
      city: '',
      age: '',
      sectSchoolInfo: '',
      profession: '',
      status: '',
      martialStatus: '',
      // maxAge: '',
      // minAge: '',
      minMatchPercentage: ''
    };
    setFilters(clear);
    applyFilters(clear);
  };

  const applyFilters = (updatedFilters) => {
    if (!Array.isArray(matchDetails)) {
      setFilteredItems([]);
      return;
    }
    
    setFilteredItems(
      matchDetails?.filter((match) => {
        return (
          (updatedFilters.id ? 
            // Word-by-word search for id/member_id (case-insensitive)
            updatedFilters.id.split(' ').every(word => {
              const w = String(word).toLowerCase();
              const idStr = match?.id != null ? String(match.id) : '';
              const mid = match?.member_id || '';
              const idMatch = idStr.toLowerCase().includes(w);
              const memberIdMatch = mid.toLowerCase().includes(w);
              return idMatch || memberIdMatch;
            }) : true) &&
          (updatedFilters.name ? match?.name?.toLowerCase().includes(updatedFilters.name.toLowerCase()) : true) &&
          (updatedFilters.agentName ? match?.agent_name?.toLowerCase().includes(updatedFilters.agentName.toLowerCase()) : true) &&
          (updatedFilters.city ? match?.city?.toLowerCase().includes(updatedFilters.city.toLowerCase()) : true) &&
          // (updatedFilters.minAge && updatedFilters.maxAge ? (match?.age >= updatedFilters.minAge && match?.age <= updatedFilters.maxAge) : true) &&
          (updatedFilters.sectSchoolInfo ? match?.sect_school_info?.toLowerCase().includes(updatedFilters.sectSchoolInfo.toLowerCase()) : true) &&
          (updatedFilters.profession ? match?.profession?.toLowerCase().includes(updatedFilters.profession.toLowerCase()) : true) &&
          (updatedFilters.status ? match?.status?.toLowerCase().includes(updatedFilters.status.toLowerCase()) : true) &&
          (updatedFilters.martialStatus ? match?.martial_status?.toLowerCase().includes(updatedFilters.martialStatus.toLowerCase()) : true) &&
          (updatedFilters.minMatchPercentage ? calculateMatchPercentage(match) >= updatedFilters.minMatchPercentage : true)
        );
      })
    );
  };

  useEffect(() => {
    // Apply filters when `currentItems` or filters change
    if (Array.isArray(matchDetails)) {
      setFilteredItems(matchDetails);
    }
  }, [matchDetails]);

  // Function to handle sorting
  const handleSort = (column) => {
    let direction = 'asc';
    if (sortConfig.key === column && sortConfig.direction === 'asc') {
      direction = 'desc'; // Toggle sorting direction
    }
    setSortConfig({ key: column, direction });
  };

  useEffect(() => {
    if (Array.isArray(filteredItems)) {
      const sortedData = [...filteredItems].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
      setFilteredItems(sortedData);
    }
  }, [sortConfig.direction]);

  // Function to get match percentage from API data (no frontend calculation)
  const calculateMatchPercentage = (match) => {
    // Use API data directly - no frontend calculation needed
    // Backend already handles all matching logic including age tolerance
    
    // Use API data directly - no frontend calculation needed
    
    // First priority: Use compatibility_score from API (most accurate)
    if (match && match.compatibility_score) {
      const percentage = Math.round(match.compatibility_score);
      console.log('Using compatibility_score:', percentage);
      return percentage;
    }
    
    // Second priority: Use match_percentage from match_details
    if (match && match.match_details && match.match_details.match_percentage) {
      const percentage = Math.round(match.match_details.match_percentage);
      console.log('Using match_details.match_percentage:', percentage);
      return percentage;
    }
    
    // Third priority: Use match_percentage from main object
    if (match && match.match_percentage) {
      const percentage = Math.round(match.match_percentage);
      console.log('Using match_percentage:', percentage);
      return percentage;
    }
    
    // If no data available, return 0
    console.log('No match percentage data found, returning 0');
    return 0;
  };

  // Function to get progress bar color based on match percentage
  const getProgressBarColor = (matchPercentage) => {
    const percentage = parseFloat(matchPercentage) || 0;
    if (percentage >= 75) return "#10b981"; // Green for high match
    if (percentage >= 60) return "#3b82f6"; // Blue for good match
    if (percentage >= 45) return "#f59e0b"; // Orange for moderate match
    if (percentage >= 30) return "#f97316"; // Dark orange for low-moderate match
    return "#ef4444"; // Red for very low match
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(filteredItems) ? filteredItems.slice(indexOfFirstItem, indexOfLastItem) : [];

  // Total pages
  const totalPages = Math.ceil((Array.isArray(filteredItems) ? filteredItems.length : 0) / itemsPerPage);

  // Handle Page Change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Fetch member matches data
  useEffect(() => {
    if (memberId) {
      // First, get member info from the main matches endpoint
      const memberInfoParameter = {
        url: `/api/agent/user/matches/`,
        setterFunction: (data) => {
          console.log('Member Info API Response:', data);
          
          // Find the specific member info
          let members = [];
          if (data && data.members && Array.isArray(data.members)) {
            members = data.members;
          } else if (Array.isArray(data)) {
            members = data;
          }
          
          const targetMember = members.find(member => 
            (member.user?.member_id || member.user?.id) == memberId
          );
          
          if (targetMember) {
            setMemberInfo({
              member_id: targetMember.user?.member_id || targetMember.user?.id,
              name: targetMember.user?.first_name && targetMember.user?.last_name 
                ? `${targetMember.user.first_name} ${targetMember.user.last_name}`.trim()
                : targetMember.user?.name || targetMember.name || 'No Name',
              city: targetMember.user?.city || '-',
              age: targetMember.user?.age || '-',
              sect_school_info: targetMember.user?.sect_school_info || '-',
              profession: targetMember.user?.profession || '-',
              martial_status: targetMember.user?.martial_status || '-',
              profile_photo: targetMember.user?.profile_photo || targetMember.user?.profile_image || '/images/muslim-man.png'
            });
            
            // Now get detailed matches using the proper agent API
            const actualUserId = targetMember.user?.id;
            if (actualUserId) {
              const matchesParameter = {
                url: `/api/agent/user/detailed-matches/`,
                setterFunction: (matchesData) => {
                  // console.log('Agent Detailed Matches API Response:', matchesData);
                  // console.log('User ID:', actualUserId);
                  // console.log('Response structure:', typeof matchesData);
                  
                  // Check for API errors
                  if (matchesData && matchesData.error) {
                    console.error('API Error:', matchesData.error);
                    setError(true);
                    setMatchDetails([]);
                    return;
                  }
                  
                  // Handle agent detailed matches API response
                  let allMatches = [];
                  let matchAnalysis = null;
                  
                  if (matchesData && typeof matchesData === 'object') {
                    // Check for the new detailed matches structure
                    if (matchesData.detailed_matches && Array.isArray(matchesData.detailed_matches)) {
                      // Find the detailed matches for the specific user
                      const userDetailedMatches = matchesData.detailed_matches.find(dm => 
                        (dm.user?.id || dm.user_id) == actualUserId
                      );
                      
                      if (userDetailedMatches && userDetailedMatches.matches && Array.isArray(userDetailedMatches.matches)) {
                        allMatches = userDetailedMatches.matches;
                        // console.log('Found user-specific matches:', allMatches);
                      }
                    } else if (matchesData.matches && Array.isArray(matchesData.matches)) {
                      allMatches = matchesData.matches;
                    } else if (Array.isArray(matchesData)) {
                      allMatches = matchesData;
                    }
                    
                    // Get match analysis if available
                    if (matchesData.analysis) {
                      matchAnalysis = matchesData.analysis;
                    } else if (matchesData.match_analysis) {
                      matchAnalysis = matchesData.match_analysis;
                    }
                  }
                  
                  // Since we already filtered by user in the API response, use allMatches directly
                  const matches = allMatches;
                  
                  // console.log('All matches before filtering:', allMatches);
                  // console.log('Extracted matches after filtering:', matches);
                  // console.log('Match analysis:', matchAnalysis);
                  // console.log('Matches count:', matches.length);
                  
                  // If no matches found, try alternative filtering approach
                  if (matches.length === 0 && allMatches.length > 0) {
                    // console.log('No matches found with current filter, trying alternative approach...');
                    
                    // Try to find matches by checking all possible user ID fields
                    const alternativeMatches = allMatches.filter(match => {
                      const allUserIds = [
                        match.user?.id,
                        match.user_id,
                        match.id,
                        match.source_user?.id,
                        match.source_user_id,
                        match.source_id,
                        match.target_user?.id,
                        match.target_user_id,
                        match.target_id
                      ].filter(id => id != null);
                      
                      // console.log('Alternative filtering - Match user IDs:', allUserIds);
                      // console.log('Looking for user ID:', actualUserId);
                      
                      return allUserIds.includes(parseInt(actualUserId)) || allUserIds.includes(actualUserId);
                    });
                    
                    // console.log('Alternative matches found:', alternativeMatches);
                    
                    if (alternativeMatches.length > 0) {
                      // Use alternative matches
                      const processedMatches = alternativeMatches.map(match => {
                        const matchPercentage = match.match_percentage || 
                                              match.match_percent || 
                                              match.compatibility_score || 
                                              0;
                        
                        return {
                          id: match.user?.member_id || match.user?.id || match.id,
                          member_id: match.user?.member_id || match.user?.id || match.id,
                          name: match.user?.first_name && match.user?.last_name 
                            ? `${match.user.first_name} ${match.user.last_name}`.trim()
                            : match.user?.name || match.name || 'No Name',
                          profile_photo: (() => {
                            const photoUrl = match.user?.profile_photo || 
                                            match.user?.profile_image ||
                                            match.user?.avatar ||
                                            match.user?.photo ||
                                            match.user?.image ||
                                            match.profile_photo;
                            
                            const fullUrl = photoUrl ? `${process.env.REACT_APP_API_URL}${photoUrl}` : null;
                            return fullUrl || '/images/muslim-man.png';
                          })(),
                          city: match.user?.city || match.city || '-',
                          age: match.user?.age || match.age || '-',
                          sect_school_info: match.user?.sect_school_info || match.sect_school_info || '-',
                          profession: match.user?.profession || match.profession || '-',
                          martial_status: match.user?.martial_status || match.martial_status || 'Not mentioned',
                          match_percentage: matchPercentage, // Backend percentage for reference
                          compatibility_score: match.compatibility_score || 0, // Direct compatibility score from API
                          calculated_match_percentage: 0, // Will be calculated by calculateMatchPercentage function
                          match_breakdown: match.breakdown || match.detailed_breakdown || null,
                          match_details: match.match_details || null, // Complete match details from API
                          field_breakdown: match.field_breakdown || null, // Field-by-field breakdown from API
                          compatibility_details: match.compatibility_details || null
                        };
                      });
                      
                      // console.log('Processed alternative matches:', processedMatches);
                      setMatchDetails(processedMatches);
                      return;
                    }
                  }
                  
                  // Debug each match for percentage analysis
                  // matches.forEach((match, index) => {
                  //   console.log(`Match ${index + 1}:`, {
                  //     name: match.user?.name || match.name,
                  //     match_percentage: match.match_percentage,
                  //     match_percent: match.match_percent,
                  //     compatibility_score: match.compatibility_score,
                  //     detailed_breakdown: match.breakdown || match.detailed_breakdown,
                  //     all_fields: Object.keys(match)
                  //   });
                  // });
                  
                  // Process matches with proper data structure
                  const processedMatches = matches.map(match => {
                    // Process match data
                    
                    // Use the compatibility score from the new API structure
                    const matchPercentage = match.compatibility_score || 
                                          match.match_percentage || 
                                          match.match_percent || 
                                          0;
                    
                    // Extract matched user data
                    const matchedUser = match.matched_user || match.user;
                    // Extract agent info (who added the matched user)
                    const agentInfoRaw = match.matched_user_agent || match.agent_id || match.created_by_agent || null;
                    if (agentInfoRaw) {
                      try {
                        console.log('Agent for member', matchedUser?.member_id || matchedUser?.id, {
                          agent_id: agentInfoRaw.agent_id || agentInfoRaw.id,
                          agent_name: agentInfoRaw.agent_name || agentInfoRaw.name,
                          agent_email: agentInfoRaw.agent_email || agentInfoRaw.email,
                        });
                      } catch (e) {}
                    }
                    const agentInfo = agentInfoRaw || null;


                    return {
                      id: matchedUser?.member_id || matchedUser?.id || match.id,
                      member_id: matchedUser?.member_id || matchedUser?.id || match.id,
                      name: matchedUser?.first_name && matchedUser?.last_name 
                        ? `${matchedUser.first_name} ${matchedUser.last_name}`.trim()
                        : matchedUser?.name || match.name || 'No Name',
                      profile_photo: (() => {
                        const photoUrl = matchedUser?.profile_photo || 
                                        matchedUser?.profile_image ||
                                        matchedUser?.avatar ||
                                        matchedUser?.photo ||
                                        matchedUser?.image ||
                                        match.profile_photo;
                        
                        const fullUrl = photoUrl ? `${process.env.REACT_APP_API_URL}${photoUrl}` : null;
                        return fullUrl || '/images/muslim-man.png';
                      })(),
                      city: matchedUser?.city || match.city || '-',
                      age: matchedUser?.age || match.age || '-',
                      sect_school_info: matchedUser?.sect_school_info || match.sect_school_info || '-',
                      profession: matchedUser?.profession || match.profession || '-',
                      martial_status: matchedUser?.martial_status || match.martial_status || 'Not mentioned',
                      match_percentage: matchPercentage, // Backend percentage for reference
                      compatibility_score: match.compatibility_score || 0, // Direct compatibility score from API
                      calculated_match_percentage: 0, // Will be calculated by calculateMatchPercentage function
                      // Additional detailed match data if available
                      match_breakdown: match.match_details || match.breakdown || match.detailed_breakdown || null,
                      match_details: match.match_details || null, // Complete match details from API
                      field_breakdown: match.field_breakdown || null, // Field-by-field breakdown from API
                      compatibility_details: match.compatibility_details || null,
                      match_quality: match.match_quality || null,
                      agent_info: agentInfo
                    };
                  });
                  
                  // console.log('Processed matches with proper percentages:', processedMatches);
                  setMatchDetails(processedMatches);
                },
                setLoading: setLoading,
                setErrors: setError,
              };
              
              fetchDataWithTokenV2(matchesParameter);
            }
          }
        },
        setLoading: setLoading,
        setErrors: setError,
      };
      
      // Fetch member info first
      fetchDataWithTokenV2(memberInfoParameter);
    }
  }, [memberId]);

  return (
    <DashboardLayout>
      <div className="member-matches-container">
        {/* Header with back button */}
        <div className="header-section">
          <button 
            className="back-button"
            onClick={() => navigate('/member-analytics')}
          >
            <AiOutlineArrowLeft className="icon" /> Back to Members
          </button>
          <h1 className="page-title">
            Matches for {memberInfo?.name || `Member ${memberId}`}
          </h1>
          <p className="page-subtitle">Compatibility Analysis & Match Results</p>
        </div>

        {/* Member Info Cards */}
        {memberInfo && (
          <div className="member-info-section">
            <div className="member-info-cards">
              <div className="info-card">
                <span className="info-label">MEMBER ID:</span>
                <span className="info-value">{memberInfo.member_id || memberId}</span>
              </div>
              <div className="info-card">
                <span className="info-label">LOCATION:</span>
                <span className="info-value">{memberInfo.city || '-'}</span>
              </div>
              <div className="info-card">
                <span className="info-label">AGE:</span>
                <span className="info-value">{memberInfo.age || '-'}</span>
              </div>
              <div className="info-card">
                <span className="info-label">SECT:</span>
                <span className="info-value">{memberInfo.sect_school_info || '-'}</span>
              </div>
            </div>
            
            <div className="match-summary-cards">
              <div className="summary-card">
                <span className="summary-number">{filteredItems.length}</span>
                <span className="summary-label">TOTAL MATCHES</span>
              </div>
              <div className="summary-card">
                <span className="summary-number">
                  {filteredItems.length > 0 
                    ? Math.round(filteredItems.reduce((sum, match) => sum + calculateMatchPercentage(match), 0) / filteredItems.length)
                    : 0}%
                </span>
                <span className="summary-label">AVG COMPATIBILITY</span>
              </div>
            </div>
          </div>
        )}

        {/* Filters Section */}
        <div className="filter-container">
          <button className="filter-button">
            <AiOutlineFilter className="icon" /> Filter By
          </button>

          <input
            className="filter-dropdown"
            type="text"
            value={filters.id}
            onChange={(e) => handleFilterChange('id', e.target.value)}
            placeholder="Member ID"
            style={{ width: '120px' }}
          />

          <input
            className="filter-dropdown"
            type="text"
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            placeholder="Name"
            style={{ width: '120px' }}
          />

          <input
            className="filter-dropdown"
            type="text"
            value={filters.agentName}
            onChange={(e) => handleFilterChange('agentName', e.target.value)}
            placeholder="Agent Name"
            style={{ width: '120px' }}
          />

          <input
            className="filter-dropdown"
            type="text"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            placeholder="Location"
            style={{ width: '120px' }}
          />
          
          {/* <input
            className="filter-dropdown"
            type="number"
            value={filters.minAge || ''}
            onChange={(e) => handleFilterChange('minAge', e.target.value)}
            placeholder="Min age"
            min="18"
            max="50"
            style={{ width: '100px' }}
          />
          
          <input
            className="filter-dropdown"
            type="number"
            value={filters.maxAge || ''}
            onChange={(e) => handleFilterChange('maxAge', e.target.value)}
            placeholder="Max age"
            min="18"
            max="50"
            style={{ width: '100px' }}
          /> */}

          <select
            className="filter-dropdown"
            value={filters.sectSchoolInfo}
            onChange={(e) => handleFilterChange('sectSchoolInfo', e.target.value)}
          >
            <option value="">Sect</option>
            <option value="Ahle Qur'an">Ahle Qur'an</option>
            <option value="Ahamadi">Ahamadi</option>
            <option value="Barelvi">Barelvi</option>
            <option value="Bohra">Bohra</option>
            <option value="Deobandi">Deobandi</option>
            <option value="Hanabali">Hanabali</option>
            <option value="Hanafi">Hanafi</option>
            <option value="Ibadi">Ibadi</option>
            <option value="Ismaili">Ismaili</option>
            <option value="Jamat e Islami">Jamat e Islami</option>
            <option value="Maliki">Maliki</option>
            <option value="Pathan">Pathan</option>
            <option value="Salafi">Salafi</option>
            <option value="Salafi/Ahle Hadees">Salafi/Ahle Hadees</option>
            <option value="Sayyid">Sayyid</option>
            <option value="Shafi">Shafi</option>
            <option value="Shia">Shia</option>
            <option value="Sunni">Sunni</option>
            <option value="Sufism">Sufism</option>
            <option value="Tableeghi Jama'at">Tableeghi Jama'at</option>
            <option value="Zahiri">Zahiri</option>
            <option value="Muslim">Muslim</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>

          <select
            className="filter-dropdown"
            value={filters.profession}
            onChange={(e) => handleFilterChange('profession', e.target.value)}
          >
            <option value="">Profession</option>
            <option value="accountant">Accountant</option>
            <option value="Acting Professional">Acting Professional</option>
            <option value="actor">Actor</option>
            <option value="administrator">Administrator</option>
            <option value="Advertising Professional">Advertising Professional</option>
            <option value="air_hostess">Air Hostess</option>
            <option value="airline_professional">Airline Professional</option>
            <option value="airforce">Airforce</option>
            <option value="architect">Architect</option>
            <option value="artist">Artist</option>
            <option value="Assistant Professor">Assistant Professor</option>
            <option value="audiologist">Audiologist</option>
            <option value="auditor">Auditor</option>
            <option value="Bank Officer">Bank Officer</option>
            <option value="Bank Staff">Bank Staff</option>
            <option value="beautician">Beautician</option>
            <option value="Biologist / Botanist">Biologist / Botanist</option>
            <option value="Business Person">Business Person</option>
            <option value="captain">Captain</option>
            <option value="CEO / CTO / President">CEO / CTO / President</option>
            <option value="chef">Chef</option>
            <option value="civil_servant">Civil Servant</option>
            <option value="clerk">Clerk</option>
            <option value="coach">Coach</option>
            <option value="consultant">Consultant</option>
            <option value="counselor">Counselor</option>
            <option value="dentist">Dentist</option>
            <option value="designer">Designer</option>
            <option value="doctor">Doctor</option>
            <option value="engineer">Engineer</option>
            <option value="entrepreneur">Entrepreneur</option>
            <option value="farmer">Farmer</option>
            <option value="fashion_designer">Fashion Designer</option>
            <option value="freelancer">Freelancer</option>
            <option value="government_employee">Government Employee</option>
            <option value="graphic_designer">Graphic Designer</option>
            <option value="homemaker">Homemaker</option>
            <option value="interior_designer">Interior Designer</option>
            <option value="journalist">Journalist</option>
            <option value="lawyer">Lawyer</option>
            <option value="manager">Manager</option>
            <option value="marketing_professional">Marketing Professional</option>
            <option value="nurse">Nurse</option>
            <option value="pharmacist">Pharmacist</option>
            <option value="photographer">Photographer</option>
            <option value="pilot">Pilot</option>
            <option value="police">Police</option>
            <option value="professor">Professor</option>
            <option value="psychologist">Psychologist</option>
            <option value="researcher">Researcher</option>
            <option value="sales_executive">Sales Executive</option>
            <option value="scientist">Scientist</option>
            <option value="social_worker">Social Worker</option>
            <option value="software_consultant">Software Consultant</option>
            <option value="sportsman">Sportsman</option>
            <option value="teacher">Teacher</option>
            <option value="technician">Technician</option>
            <option value="therapist">Therapist</option>
            <option value="veterinarian">Veterinarian</option>
            <option value="writer">Writer</option>
            <option value="other">Other</option>
          </select>

          <select
            className="filter-dropdown"
            value={filters.martialStatus}
            onChange={(e) => handleFilterChange('martialStatus', e.target.value)}
          >
            <option value="">Marital Status</option>
            {gender === 'male' ? (
              <>
                <option value="Single">Single</option>
                <option value="Divorced">Divorced</option>
                <option value="Khula">Khula</option>
                <option value="Widowed">Widowed</option>
              </>
            ) : (
              <>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Khula">Khula</option>
                <option value="Widowed">Widowed</option>
              </>
            )}
          </select>

          <input
            className="filter-dropdown"
            type="number"
            value={filters.minMatchPercentage || ''}
            onChange={(e) => handleFilterChange('minMatchPercentage', e.target.value)}
            placeholder="Min %"
            min="0"
            max="100"
            style={{ width: '80px' }}
          />

          <button type="button" className="reset-filter" onClick={onClearFilterClick}>
            <AiOutlineRedo className="icon" /> Reset Filter
          </button>
        </div>

        {/* Error Display */}
        {useError && (
          <div className="error-message">
            <div className="error-content">
              <h3>⚠️ Backend Error</h3>
              <p>There's an issue with the backend API. Please contact the development team.</p>
              <p><strong>Error:</strong> 'MehramAgent' object has no attribute 'phone'</p>
              <button 
                className="retry-button"
                onClick={() => {
                  setError(false);
                  // Retry the API call
                  window.location.reload();
                }}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {!useError && (
          <div className="results-summary">
            <div className="summary-card-large">
              <span className="summary-number-large">{filteredItems.length}</span>
              <span className="summary-label-large">TOTAL MATCHES</span>
            </div>
            <div className="summary-card-large">
              <span className="summary-number-large">{filteredItems.length}</span>
              <span className="summary-label-large">FILTERED RESULTS</span>
            </div>
          </div>
        )}

        {/* Table Section */}
        {!useError && (
          <table className="matches-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>
                Member ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>MEMBER Name</th>
              <th>Agent Name</th>
              <th>Location</th>
              <th onClick={() => handleSort('age')}>Age {sortConfig.key === 'age' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th>Sect</th>
              <th>Profession</th>
              <th>Marital Status</th>
              <th>Match Per(%)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((match) => (
              <tr key={match?.id} onClick={() => navigate(`/details/${match?.id}`)} style={{ cursor: "pointer" }}>
                <td>{match?.member_id || match?.id}</td>
                <td>{match?.name || match?.user_name || "No Name"}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  {match?.agent_info?.agent_name ?? match?.agent_info?.name ? (
                    match?.agent_info?.agent_name ?? match?.agent_info?.name
                  ) : (
                    <span className="self-badge">Self</span>
                  )}
                </td>
                <td>{match?.city || "-"}</td>
                <td>{match?.age || "-"}</td>
                <td>{match?.sect_school_info || "-"}</td>
                <td>{match?.profession || "-"}</td>
                <td>
                  <span className={`marital-badge ${match?.martial_status ? match?.martial_status?.toLowerCase()?.replace(" ", "-") : "not-mentioned"}`}>
                    {match?.martial_status || "Not mentioned"}
                  </span>
                </td>
                <td>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${calculateMatchPercentage(match)}%`,
                        backgroundColor: getProgressBarColor(calculateMatchPercentage(match)),
                      }}
                    ></div>
                    <span className="progress-text">{calculateMatchPercentage(match)}%</span>
                  </div>
                </td>
                <td>
                  <button 
                    className="action-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMatch(match);
                      setShowMatchModal(true);
                    }}
                  >
                    Show Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}

        {/* Pagination */}
        {!useError && (
        <div className="pagination">
          <button className="pagination-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            &laquo; Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button className="pagination-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next &raquo;
          </button>
        </div>
        )}
      </div>

      <style>
        {`
          .member-matches-container {
            padding: 20px;
            background: #f8f9fa;
            min-height: 100vh;
          }
          
          .header-section {
            margin-bottom: 30px;
          }
          
          .back-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            color: #333;
            transition: all 0.2s ease;
            margin-bottom: 20px;
          }
          
          .back-button:hover {
            background: #f8f9fa;
            border-color: #007bff;
            color: #007bff;
          }
          
          .page-title {
            font-weight: 700;
            font-size: 28px;
            text-align: left;
            margin-bottom: 8px;
            color: #333;
          }
          
          .page-subtitle {
            font-size: 16px;
            color: #666;
            margin-bottom: 0;
          }
          
          .member-info-section {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
            flex-wrap: wrap;
          }
          
          .member-info-cards {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
          }
          
          .info-card {
            background: #fff;
            border: 2px solid #ff69b4;
            border-radius: 12px;
            padding: 16px 20px;
            min-width: 150px;
            text-align: center;
          }
          
          .info-label {
            display: block;
            font-size: 12px;
            font-weight: 600;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          
          .info-value {
            display: block;
            font-size: 16px;
            font-weight: 700;
            color: #333;
          }
          
          .match-summary-cards {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
          }
          
          .summary-card {
            background: #fff;
            border: 2px solid #ff69b4;
            border-radius: 12px;
            padding: 20px;
            min-width: 150px;
            text-align: center;
          }
          
          .summary-number {
            display: block;
            font-size: 24px;
            font-weight: 700;
            color: #ff69b4;
            margin-bottom: 4px;
          }
          
          .summary-label {
            display: block;
            font-size: 12px;
            font-weight: 600;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .filter-container {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            padding: 16px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .filter-button, .reset-filter {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 8px 12px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          }
          
          .reset-filter {
            color: red;
          }
          
          .icon {
            font-size: 14px;
          }
          
          .filter-dropdown {
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            background: #fff;
            font-size: 14px;
            font-weight: 500;
            min-width: 120px;
            transition: all 0.2s ease;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          }
          
          .filter-dropdown:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          
          .filter-dropdown:hover {
            border-color: #9ca3af;
          }
          
          .results-summary {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
          }
          
          .summary-card-large {
            background: #fff;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            flex: 1;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .summary-number-large {
            display: block;
            font-size: 32px;
            font-weight: 700;
            color: #333;
            margin-bottom: 8px;
          }
          
          .summary-label-large {
            display: block;
            font-size: 14px;
            font-weight: 600;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .matches-table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .matches-table th {
            background: #f0f0f0;
            color: #333;
            font-weight: bold;
            text-transform: uppercase;
            cursor: pointer;
            user-select: none;
            text-align: center;
          }
          
          .matches-table th, .matches-table td {
            padding: 12px;
            text-align: center;
            border-bottom: 1px solid #ddd;
          }
          
          .matches-table tr:hover {
            background: #f1f1f1;
          }

          /* Self badge styling */
          .self-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            font-weight: 700;
            font-size: 12px;
            color: #0f766e;
            background: #ccfbf1; /* teal-100 */
            border: 1px solid #99f6e4; /* teal-200 */
          }
          
          .marital-badge {
            padding: 6px 12px;
            border-radius: 16px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: inline-block;
            border: 1px solid transparent;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          .marital-badge.single {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            border-color: #047857;
          }
          
          .marital-badge.married {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: #ffffff;
            border-color: #1e40af;
          }
          
          .marital-badge.divorced {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: #ffffff;
            border-color: #b91c1c;
          }
          
          .marital-badge.khula {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: #ffffff;
            border-color: #b45309;
          }
          
          .marital-badge.widowed {
            background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
            color: #ffffff;
            border-color: #374151;
          }
          
          .marital-badge.not-mentioned {
            background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
            color: #6b7280;
            border-color: #9ca3af;
          }
          
          .progress-bar-container {
            width: 100%;
            background-color: #f3f4f6;
            border-radius: 8px;
            overflow: hidden;
            position: relative;
            height: 24px;
            border: 1px solid #e5e7eb;
          }
          
          .progress-bar {
            height: 100%;
            border-radius: 7px;
            transition: all 0.3s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          .progress-text {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            color: #374151;
            font-size: 11px;
            font-weight: 700;
            text-shadow: 0 1px 2px rgba(255,255,255,0.8);
            z-index: 1;
          }
          
          .action-button {
            padding: 6px 12px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.2s ease;
          }
          
          .action-button:hover {
            background: #0056b3;
            transform: translateY(-1px);
          }
          
          .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
            gap: 8px;
          }
          
          .pagination-btn {
            padding: 8px 12px;
            border: 1px solid #ccc;
            background: #fff;
            border-radius: 5px;
            cursor: pointer;
            transition: 0.3s;
          }
          
          .pagination-btn.active {
            background: #007bff;
            color: #fff;
            font-weight: bold;
          }
          
          .pagination-btn:hover {
            background: #007bff;
            color: #fff;
          }
          
          .pagination-btn:disabled {
            cursor: not-allowed;
            opacity: 0.6;
          }
          
          .error-message {
            background: #fee2e2;
            border: 1px solid #fecaca;
            border-radius: 12px;
            padding: 24px;
            margin: 20px 0;
            text-align: center;
          }
          
          .error-content h3 {
            color: #dc2626;
            margin-bottom: 12px;
            font-size: 18px;
          }
          
          .error-content p {
            color: #7f1d1d;
            margin-bottom: 8px;
            line-height: 1.5;
          }
          
          .retry-button {
            background: #dc2626;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            margin-top: 12px;
            transition: all 0.2s ease;
          }
          
          .retry-button:hover {
            background: #b91c1c;
            transform: translateY(-1px);
          }
          
          @media (max-width: 768px) {
            .member-info-section {
              flex-direction: column;
            }
            
            .member-info-cards, .match-summary-cards {
              justify-content: center;
            }
            
            .results-summary {
              flex-direction: column;
            }
            
            .filter-container {
              flex-direction: column;
              align-items: stretch;
            }
            
            .filter-dropdown {
              width: 100%;
            }
          }
        `}
      </style>

      {/* Match Details Modal */}
      <MatchDetailsModal
        isOpen={showMatchModal}
        onClose={() => {
          setShowMatchModal(false);
          setSelectedMatch(null);
        }}
        member={selectedMatch}
        currentMember={memberInfo}
      />
    </DashboardLayout>
  );
};

export default MemberMatches;
