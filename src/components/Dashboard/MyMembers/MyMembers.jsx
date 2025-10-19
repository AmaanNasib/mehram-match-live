import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import {
  AiOutlineFilter,
  AiOutlineRedo,
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineCheck,
  AiOutlineCloseCircle,
  AiOutlineInfoCircle,
} from "react-icons/ai"; // Import icons
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchDataObjectV2, fetchDataV2, fetchDataWithTokenV2 } from "../../../apiUtils";
import { format } from "date-fns";
import { HiOutlineDotsHorizontal  } from "react-icons/hi";

// Age is handled by the backend age field

// Match Details Modal Component
const MatchDetailsModal = ({ isOpen, onClose, member, currentUser }) => {
  if (!isOpen || !member) return null;

  // Match analysis function
  const analyzeMatches = (member, currentUser) => {
    const matches = [];
    const totalFields = 8; // Total number of fields to compare
    let matchCount = 0;

    // Age compatibility (within 5 years range)
    if (member.age && currentUser.age) {
      const ageDiff = Math.abs(member.age - currentUser.age);
      if (ageDiff <= 5) {
        matches.push({
          field: "Age Compatibility",
          status: "excellent",
          description: `Age difference of ${ageDiff} years is ideal`,
          icon: "🎯",
          score: 100
        });
        matchCount++;
      } else if (ageDiff <= 10) {
        matches.push({
          field: "Age Compatibility", 
          status: "good",
          description: `Age difference of ${ageDiff} years is acceptable`,
          icon: "✅",
          score: 75
        });
        matchCount++;
      } else {
        matches.push({
          field: "Age Compatibility",
          status: "fair",
          description: `Age difference of ${ageDiff} years`,
          icon: "⚠️",
          score: 50
        });
      }
    }

    // Location compatibility
    if (member.location && currentUser.location) {
      if (member.location.toLowerCase() === currentUser.location.toLowerCase()) {
        matches.push({
          field: "Location",
          status: "excellent",
          description: "Same city - perfect for meetings",
          icon: "🏠",
          score: 100
        });
        matchCount++;
      } else {
        matches.push({
          field: "Location",
          status: "good",
          description: `Different locations: ${member.location} vs ${currentUser.location}`,
          icon: "🌍",
          score: 60
        });
      }
    }

    // Sect compatibility
    if (member.sect && currentUser.sect) {
      if (member.sect.toLowerCase() === currentUser.sect.toLowerCase()) {
        matches.push({
          field: "Religious Sect",
          status: "excellent",
          description: "Same sect - religious compatibility",
          icon: "🕌",
          score: 100
        });
        matchCount++;
      } else {
        matches.push({
          field: "Religious Sect",
          status: "fair",
          description: `Different sects: ${member.sect} vs ${currentUser.sect}`,
          icon: "🕋",
          score: 40
        });
      }
    }

    // Marital status compatibility
    if (member.martial_status && currentUser.martial_status) {
      const compatibleStatuses = {
        'single': ['single', 'divorced', 'widowed'],
        'divorced': ['single', 'divorced', 'widowed'],
        'widowed': ['single', 'divorced', 'widowed']
      };
      
      if (compatibleStatuses[member.martial_status.toLowerCase()]?.includes(currentUser.martial_status.toLowerCase())) {
        matches.push({
          field: "Marital Status",
          status: "excellent",
          description: "Compatible marital status",
          icon: "💍",
          score: 100
        });
        matchCount++;
      } else {
        matches.push({
          field: "Marital Status",
          status: "poor",
          description: "Marital status incompatibility",
          icon: "❌",
          score: 20
        });
      }
    }

    // Profession compatibility
    if (member.profession && currentUser.profession) {
      const professionCategories = {
        'business': ['business', 'entrepreneur', 'self-employed'],
        'education': ['teacher', 'professor', 'education', 'academic'],
        'healthcare': ['doctor', 'nurse', 'healthcare', 'medical'],
        'tech': ['software', 'engineer', 'developer', 'it', 'technology'],
        'finance': ['banking', 'finance', 'accounting', 'financial']
      };

      let isCompatible = false;
      for (const [category, professions] of Object.entries(professionCategories)) {
        if (professions.some(p => member.profession.toLowerCase().includes(p)) &&
            professions.some(p => currentUser.profession.toLowerCase().includes(p))) {
          isCompatible = true;
          break;
        }
      }

      if (isCompatible) {
        matches.push({
          field: "Profession",
          status: "excellent",
          description: "Similar professional background",
          icon: "💼",
          score: 90
        });
        matchCount++;
      } else {
        matches.push({
          field: "Profession",
          status: "good",
          description: "Different professional backgrounds",
          icon: "📊",
          score: 70
        });
      }
    }

    // Education level compatibility
    if (member.education && currentUser.education) {
      const educationLevels = {
        'phd': 5,
        'masters': 4,
        'bachelors': 3,
        'diploma': 2,
        'high school': 1
      };

      const memberLevel = educationLevels[member.education.toLowerCase()] || 0;
      const userLevel = educationLevels[currentUser.education.toLowerCase()] || 0;
      const levelDiff = Math.abs(memberLevel - userLevel);

      if (levelDiff === 0) {
        matches.push({
          field: "Education Level",
          status: "excellent",
          description: "Same education level",
          icon: "🎓",
          score: 100
        });
        matchCount++;
      } else if (levelDiff <= 1) {
        matches.push({
          field: "Education Level",
          status: "good",
          description: "Similar education levels",
          icon: "📚",
          score: 80
        });
        matchCount++;
      } else {
        matches.push({
          field: "Education Level",
          status: "fair",
          description: "Different education levels",
          icon: "📖",
          score: 60
        });
      }
    }

    // Family background compatibility
    if (member.family_background && currentUser.family_background) {
      if (member.family_background.toLowerCase() === currentUser.family_background.toLowerCase()) {
        matches.push({
          field: "Family Background",
          status: "excellent",
          description: "Similar family background",
          icon: "👨‍👩‍👧‍👦",
          score: 100
        });
        matchCount++;
      } else {
        matches.push({
          field: "Family Background",
          status: "good",
          description: "Different family backgrounds",
          icon: "🏘️",
          score: 70
        });
      }
    }

    // Lifestyle compatibility
    if (member.lifestyle && currentUser.lifestyle) {
      const lifestyleMatch = member.lifestyle.toLowerCase() === currentUser.lifestyle.toLowerCase();
      matches.push({
        field: "Lifestyle",
        status: lifestyleMatch ? "excellent" : "good",
        description: lifestyleMatch ? "Same lifestyle preferences" : "Different lifestyle preferences",
        icon: lifestyleMatch ? "🌟" : "⭐",
        score: lifestyleMatch ? 100 : 70
      });
      if (lifestyleMatch) matchCount++;
    }

    const overallScore = matches.length > 0 ? Math.round(matches.reduce((sum, match) => sum + match.score, 0) / matches.length) : 0;
    const matchPercentage = Math.round((matchCount / totalFields) * 100);

    return {
      matches,
      overallScore,
      matchPercentage,
      matchCount,
      totalFields
    };
  };

  const matchAnalysis = analyzeMatches(member, currentUser);

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
      case 'poor': return <AiOutlineCloseCircle className="text-red-500" />;
      default: return <AiOutlineInfoCircle className="text-gray-500" />;
    }
  };

  return (
    <div className="match-details-modal-overlay">
      <div className="match-details-modal">
        <div className="modal-header">
          <div className="header-content">
            <div className="member-info-header">
              <img
                src={(() => {
                  const photoUrl = member?.profile_photo?.upload_photo || 
                                  member?.user_profilephoto?.upload_photo ||
                                  member?.profile_image ||
                                  member?.avatar ||
                                  member?.photo ||
                                  member?.image;
                  const fullUrl = photoUrl ? `${process.env.REACT_APP_API_URL}${photoUrl}` : null;
                  
                  if (fullUrl) {
                    return fullUrl;
                  } else {
                    return member?.gender === "male"
                      ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDNy41ODE3MiAxNCA0IDE3LjU4MTcgNCAyMkgxMkMxNi40MTgzIDE0IDEyIDE0IDEyIDE0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo="
                      : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNFQzQ4OTkiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDNy41ODE3MiAxNCA0IDE3LjU4MTcgNCAyMkgxMkMxNi40MTgzIDE0IDEyIDE0IDEyIDE0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo=";
                  }
                })()}
                alt={member?.name}
                className="member-avatar-modal"
              />
              <div className="member-details-header">
                <h3 className="member-name-modal">{member?.name || "N/A"}</h3>
                <p className="member-id-modal">{member?.member_id || "N/A"}</p>
                <div className="match-score-header">
                  <div className="score-circle">
                    <span className="score-number">{matchAnalysis.overallScore}%</span>
                  </div>
                  <div className="score-info">
                    <span className="score-label">Overall Match</span>
                    <span className="score-detail">{matchAnalysis.matchCount}/{matchAnalysis.totalFields} fields match</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="close-modal-btn" onClick={onClose}>
              <AiOutlineClose />
            </button>
          </div>
        </div>

        <div className="modal-content">
          <div className="match-analysis-section">
            <h4 className="section-title">Match Analysis</h4>
            <div className="matches-grid">
              {matchAnalysis.matches.map((match, index) => (
                <div key={index} className="match-item">
                  <div className="match-header">
                    <div className="match-icon">{match.icon}</div>
                    <div className="match-field">{match.field}</div>
                    <div className="match-status" style={{ color: getStatusColor(match.status) }}>
                      {getStatusIcon(match.status)}
                    </div>
                  </div>
                  <div className="match-description">{match.description}</div>
                  <div className="match-score-bar">
                    <div 
                      className="score-fill" 
                      style={{ 
                        width: `${match.score}%`,
                        backgroundColor: getStatusColor(match.status)
                      }}
                    ></div>
                  </div>
                  <div className="match-score-text">{match.score}% compatibility</div>
                </div>
              ))}
            </div>
          </div>

          <div className="recommendations-section">
            <h4 className="section-title">Recommendations</h4>
            <div className="recommendations-list">
              {matchAnalysis.overallScore >= 80 && (
                <div className="recommendation-item excellent">
                  <div className="rec-icon">🌟</div>
                  <div className="rec-text">
                    <strong>Excellent Match!</strong> This profile shows high compatibility across multiple areas.
                  </div>
                </div>
              )}
              {matchAnalysis.overallScore >= 60 && matchAnalysis.overallScore < 80 && (
                <div className="recommendation-item good">
                  <div className="rec-icon">✅</div>
                  <div className="rec-text">
                    <strong>Good Match!</strong> This profile has good potential with some areas to explore.
                  </div>
                </div>
              )}
              {matchAnalysis.overallScore < 60 && (
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
            color: #1f2937;
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
          }
        `}
      </style>
    </div>
  );
};

// Add this new component for the marital status dropdown
const MaritalStatusDropdown = ({ value, onChange, userGender }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState(value || []);

  // Gender-based marital status options
  const getMaritalStatusOptions = (gender) => {
    const baseOptions = ["Single", "Divorced", "Khula", "Widowed"];
    
    if (gender === "female") {
      return [...baseOptions, "Married"];
    }
    
    return baseOptions;
  };

  const maritalStatusOptions = getMaritalStatusOptions(userGender);

  useEffect(() => {
    if (value) {
      setSelectedStatuses(Array.isArray(value) ? value : [value]);
    }
  }, [value]);

  const toggleStatus = (status) => {
    const newSelected = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];

    setSelectedStatuses(newSelected);
    onChange(newSelected);
  };

  return (
    <div className="marital-status-dropdown-container">
      <div
        className="marital-status-dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        Marital Status
      </div>

      {isOpen && (
        <div className="marital-status-dropdown-menu">
          <h6>Select Marital Status</h6>

          <div className="marital-status-grid">
            {maritalStatusOptions.map((status) => (
              <div
                key={status}
                className={`marital-status-option ${
                  selectedStatuses.includes(status) ? "selected" : ""
                }`}
                onClick={() => toggleStatus(status)}
              >
                {status}
              </div>
            ))}
          </div>
          <div className="marital-status-note">
            *You can choose multiple Marital Status
          </div>
          <button className="apply-now-btn" onClick={() => setIsOpen(false)}>
            Apply Now
          </button>
        </div>
      )}

      <style>
        {`
          .marital-status-dropdown-container {
            position: relative;
            width: 200px;
          }
          
          .marital-status-dropdown-toggle {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background: #fff;
            cursor: pointer;
            font-size: 14px;
            min-height: 36px;
            display: flex;
            align-items: center;
            font-weight: 600; /* Bold */
            color: #333; /* Dark gray */
          }
          
          .marital-status-dropdown-menu {
            position: absolute;
            top: 105%;
            left: 0;
            width: 400px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 15px;
            padding: 15px;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          
          .marital-status-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 10px;
          }
          
          .marital-status-option {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 50px;
            text-align: center;
            cursor: pointer;
            font-size: 13px;
          }
          
          .marital-status-option.selected {
            background-color: #FF1493;
            color: white;
            border-color: #FF1493;
          }

            .marital-status-option:hover {
          background-color: rgb(20, 255, 134);
          border-color:rgb(20, 255, 134);
        }

          .apply-now-btn:hover {
          background-color: rgb(20, 255, 134);
        }
          
          .marital-status-note {
            font-size: 12px;
            color: #666;
            margin-bottom: 10px;
          }
          
          .apply-now-btn {
            width: 100%;
            padding: 8px;
            background-color: #FF1493;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          
          .selected-status-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 5px;
          }
          
          .status-tag {
            display: flex;
            align-items: center;
            background-color: #e9ecef;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 12px;
          }
          
          .remove-tag-icon {
            margin-left: 5px;
            cursor: pointer;
            font-size: 10px;
          }
        `}
      </style>
    </div>
  );
};

const StatusDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState(value || []);

  const statusOptions = ["Sent", "Received"];

  useEffect(() => {
    if (value) {
      setSelectedStatuses(Array.isArray(value) ? value : [value]);
    }
  }, [value]);

  const toggleStatus = (status) => {
    const newSelected = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];

    setSelectedStatuses(newSelected);
    onChange(newSelected);
  };

  return (
    <div className="status-dropdown-container">
      <div
        className="status-dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        Status
      </div>

      {isOpen && (
        <div className="status-dropdown-menu">
          <h6>Select Status</h6>
          <div className="status-grid">
            {statusOptions.map((status) => (
              <div
                key={status}
                className={`status-option ${
                  selectedStatuses.includes(status) ? "selected" : ""
                } ${status.toLowerCase()}`}
                onClick={() => toggleStatus(status)}
              >
                {status}
              </div>
            ))}
          </div>
          <div className="status-note">*You can choose multiple Statuses</div>
          <button className="apply-now-btn" onClick={() => setIsOpen(false)}>
            Apply Now
          </button>
        </div>
      )}

      <style>
        {`
          .status-dropdown-container {
            position: relative;
            width: 150px;
          }

          .status-dropdown-toggle {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background: #fff;
            cursor: pointer;
            font-size: 14px;
            min-height: 36px;
            display: flex;
            align-items: center;
            font-weight: 600;
            color: #333;
          }

          .status-dropdown-menu {
            position: absolute;
            top: 105%;
            left: 0;
            width: 300px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 15px;
            padding: 15px;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }

          .status-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 10px;
          }

          .status-option {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 50px;
            text-align: center;
            cursor: pointer;
            font-size: 13px;
            transition: background-color 0.2s, color 0.2s;
          }

          .status-option.selected {
            background-color: #FF1493;
            color: white;
            border-color: #FF1493;
          }

          .status-option.sent:hover {
            background-color: #90EE90; /* Light green */
            color: #000;
          }

          .status-option.received:hover {
            background-color: #8A2BE2; /* Blueberry */
            color: #fff;
          }

          .status-note {
            font-size: 12px;
            color: #666;
            margin-bottom: 10px;
          }

          .apply-now-btn {
            width: 100%;
            padding: 8px;
            background-color: #FF1493;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};

const CustomDatePicker = ({ selectedDate, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [internalDate, setInternalDate] = useState(
    selectedDate ? new Date(selectedDate) : null
  );

  // Generate calendar days for the current month/year
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    // Previous month's days
    const prevMonthDays = [];
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      prevMonthDays.push(prevMonthLastDay - i);
    }

    // Current month's days
    const currentMonthDays = Array.from(
      { length: daysInMonth },
      (_, i) => i + 1
    );

    // Next month's days
    const nextMonthDays = [];
    const daysToShow = 42 - (prevMonthDays.length + currentMonthDays.length);
    for (let i = 1; i <= daysToShow; i++) {
      nextMonthDays.push(i);
    }

    return { prevMonthDays, currentMonthDays, nextMonthDays };
  };

  const { prevMonthDays, currentMonthDays, nextMonthDays } =
    generateCalendarDays();

  const handleDateClick = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setInternalDate(newDate);
    onChange(format(newDate, "yyyy-MM-dd"));
    setIsOpen(false);
  };

  const isDateSelected = (day) => {
    if (!internalDate) return false;
    return (
      internalDate.getDate() === day &&
      internalDate.getMonth() === currentMonth &&
      internalDate.getFullYear() === currentYear
    );
  };

  const changeMonth = (increment) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="custom-date-picker-container">
      <div
        className="custom-date-picker-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedDate || placeholder}
      </div>

      {isOpen && (
        <div className="custom-date-picker-menu">
          <div className="month-navigation">
            <button className="nav-button" onClick={() => changeMonth(-1)}>
              &lt;
            </button>
            <h6>
              {monthNames[currentMonth]} {currentYear}
            </h6>
            <button className="nav-button" onClick={() => changeMonth(1)}>
              &gt;
            </button>
          </div>

          <div className="calendar-grid">
            {/* Day headers */}
            <div className="day-header">S</div>
            <div className="day-header">M</div>
            <div className="day-header">T</div>
            <div className="day-header">W</div>
            <div className="day-header">T</div>
            <div className="day-header">F</div>
            <div className="day-header">S</div>

            {/* Previous month days */}
            {prevMonthDays.map((day) => (
              <div key={`prev-${day}`} className="calendar-day other-month">
                {day}
              </div>
            ))}

            {/* Current month days */}
            {currentMonthDays.map((day) => (
              <div
                key={`current-${day}`}
                className={`calendar-day ${
                  isDateSelected(day) ? "selected" : ""
                }`}
                onClick={() => handleDateClick(day)}
              >
                {day}
              </div>
            ))}

            {/* Next month days */}
            {nextMonthDays.map((day) => (
              <div key={`next-${day}`} className="calendar-day other-month">
                {day}
              </div>
            ))}
          </div>

          <div className="date-picker-note">*You can choose a date</div>

          <button className="apply-now-btn" onClick={() => setIsOpen(false)}>
            Apply Now
          </button>
        </div>
      )}

      <style>
        {`
          .custom-date-picker-container {
            position: relative;
            width: 120px;
          }
          
          .custom-date-picker-toggle {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background: #fff;
            cursor: pointer;
            font-size: 14px;
            min-height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            color: #333;
          }
          
          .custom-date-picker-menu {
            position: absolute;
            top: 105%;
            left: 0;
            width: 300px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 15px;
            padding: 15px;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          
          .month-navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          
          .month-navigation h6 {
            margin: 0;
            font-size: 16px;
          }
          
          .nav-button {
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 4px;
          }
          
          .nav-button:hover {
            background-color: #f0f0f0;
          }
          
          .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 5px;
            margin-bottom: 10px;
          }
          
          .day-header {
            text-align: center;
            font-weight: bold;
            font-size: 12px;
            color: #666;
          }
          
          .calendar-day {
            padding: 8px;
            text-align: center;
            cursor: pointer;
            font-size: 13px;
            border-radius: 50%;
          }
          
          .calendar-day:hover {
            background-color: #f0f0f0;
          }
          
          .calendar-day.selected {
            background-color: #FF1493;
            color: white;
          }
          
          .other-month {
            color: #ccc;
          }
          
          .date-picker-note {
            font-size: 12px;
            color: #666;
            margin-bottom: 10px;
          }
          
          .apply-now-btn {
            width: 100%;
            padding: 8px;
            background-color: #FF1493;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          
          .apply-now-btn:hover {
            background-color: rgb(20, 255, 134);
          }
        `}
      </style>
    </div>
  );
};

const MyMembers = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate1, setSelectedDate1] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDatePicker1, setShowDatePicker1] = useState(false);
  const [userId] = useState(localStorage.getItem("userId"));
  const [gender] = useState(localStorage.getItem("gender"));
  const [apiData, setApiData] = useState({ member: [] });
  const [loading, setLoading] = useState(false);
  // console.log(selectedDate, "selectedDate", apiData);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const role = localStorage.getItem("role");
    const token = localStorage.getItem('token');


  let [filters, setFilters] = useState({
    id: "",
    name: "",
    city: "",
    date: "",
    sectSchoolInfo: "",
    profession: "",
    status: "",
    martialStatus: "",
    startDate: "",
    endDate: "",
  });
  // Handle change in the search input

  const handleClick = () => {
    navigate("/memstepone", {
      state: { 
        isNewMember: true,
        clearForm: true 
      },
    });
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };
  useEffect(() => {
    if (role !== "agent") return;
    if (userId) {
      const parameter = {
        url: `/api/agent/user_agent/?agent_id=${userId}`,
        setterFunction: setApiData,
        setLoading: setLoading,
        setErrors: setErrors,
      };
      fetchDataObjectV2(parameter);
    }
  }, [userId]);
  const matchDetails = [
    {
      id: "00001",
      name: "Christine Brooks",
      location: "089 Kutch Green Apt. 448",
      date: "04 Sep 2019",
      sect: "Sunni-Hanafi",
      profession: "Software-Designer",
      status: "Sent",
      maritalStatus: "Never Married",
    },
    {
      id: "00002",
      name: "Rosie Pearson",
      location: "979 Immanuel Ferry Suite 526",
      date: "28 May 2019",
      sect: "Sunni-Hanafi",
      profession: "Software-Designer",
      status: "Received",
      maritalStatus: "Divorced",
    },
    {
      id: "00003",
      name: "Darrell Caldwell",
      location: "8587 Frida Ports",
      date: "23 Nov 2019",
      sect: "Sunni-Hanafi",
      profession: "Software-Designer",
      status: "Sent",
      maritalStatus: "Never Married",
    },
    {
      id: "00004",
      name: "Gilbert Johnston",
      location: "768 Destiny Lake Suite 600",
      date: "05 Feb 2019",
      sect: "Sunni-Hanafi",
      profession: "Software-Designer",
      status: "Received",
      maritalStatus: "Widowed",
    },
    {
      id: "00005",
      name: "Alan Cain",
      location: "042 Mylene Throughway",
      date: "29 Jul 2019",
      sect: "Sunni-Hanafi",
      profession: "Software-Designer",
      status: "Received",
      maritalStatus: "Married",
    },
    {
      id: "00006",
      name: "Alfred Murray",
      location: "543 Weinmann Mountain",
      date: "15 Aug 2019",
      sect: "Sunni-Hanafi",
      profession: "Software-Designer",
      status: "Received",
      maritalStatus: "Awaiting Divorce",
    },
    {
      id: "00007",
      name: "Maggie Sullivan",
      location: "New Scottieberg",
      date: "21 Dec 2019",
      sect: "Sunni-Hanafi",
      profession: "Software-Designer",
      status: "Sent",
      maritalStatus: "Never Married",
    },
    {
      id: "00008",
      name: "Rosie Todd",
      location: "New Jon",
      date: "30 Apr 2019",
      sect: "Sunni-Hanafi",
      profession: "Software-Designer",
      status: "Received",
      maritalStatus: "Khula",
    },
    {
      id: "00009",
      name: "Dollie Hines",
      location: "124 Lyla Forge Suite 975",
      date: "09 Jan 2019",
      sect: "Sunni-Hanafi",
      profession: "Software-Designer",
      status: "Sent",
      maritalStatus: "Never Married",
    },
  ];

  // Pagination
  // Extract distinct values for each filter (IDs, Names, etc.)
  const distinctIds = [...new Set(apiData?.member?.map((match) => match?.id))];
  const distinctNames = [
    ...new Set(apiData?.member?.map((match) => match?.name)),
  ];
  const distinctCities = [
    ...new Set(apiData?.member?.map((match) => match?.city)),
  ];
  const distinctDobs = [
    ...new Set(apiData?.member?.map((match) => match?.dob)),
  ];
  const distinctSchoolInfo = [
    ...new Set(apiData?.member?.map((match) => match?.sect_school_info)),
  ];
  const distinctProfessions = [
    ...new Set(apiData?.member?.map((match) => match?.profession)),
  ];
  const distinctStatuses = [
    ...new Set(apiData?.member?.map((match) => match?.status)),
  ];
  const distinctMaritalStatuses = [
    ...new Set(apiData?.member?.map((match) => match?.martial_status)),
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const handleFilterChange = (column, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [column]: value };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };
  const onClearFilterClick = () => {
    let clear = {
      id: "",
      name: "",
      city: "",
      date: "",
      sectSchoolInfo: "",
      profession: "",
      status: "",
      martialStatus: "",
      startDate: "",
      endDate: "",
    };
    setFilters(clear);
    applyFilters(clear);
  };
  // Apply filters to the data based on selected filter values
  const applyFilters = (updatedFilters) => {
    // console.log(updatedFilters.id, ">>>");

    setFilteredItems(
      apiData?.member?.filter((match) => {
        return (
          (updatedFilters.id ? match?.id == updatedFilters.id : true) &&
          (updatedFilters.name
            ? match?.name
                ?.toLowerCase()
                .includes(updatedFilters.name.toLowerCase())
            : true) &&
          (updatedFilters.city
            ? match?.city
                ?.toLowerCase()
                .includes(updatedFilters.city.toLowerCase())
            : true) &&
          (updatedFilters.startDate && updatedFilters.endDate
            ? new Date(match?.date) >= new Date(updatedFilters.startDate) &&
              new Date(match?.date) <= new Date(updatedFilters.endDate)
            : true) &&
          (updatedFilters.sectSchoolInfo
            ? match?.sect_school_info
                ?.toLowerCase()
                .includes(updatedFilters.sectSchoolInfo.toLowerCase())
            : true) &&
          (updatedFilters.profession
            ? match?.profession
                ?.toLowerCase()
                .includes(updatedFilters.profession.toLowerCase())
            : true) &&
          (updatedFilters.status
            ? match?.status
                ?.toLowerCase()
                .includes(updatedFilters.status.toLowerCase())
            : true) &&
          (updatedFilters.martialStatus
            ? match?.martial_status
                ?.toLowerCase()
                .includes(updatedFilters.martialStatus.toLowerCase())
            : true)
        );
      })
    );
  };
  const currentItems = filteredItems?.slice(indexOfFirstItem, indexOfLastItem);
  // Total pages
  const totalPages = Math.ceil(filteredItems?.length / itemsPerPage);

  // Handle Page Change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    // Apply filters when `currentItems` or filters change
    // console.log(apiData, ">>>okk");

    setFilteredItems(apiData?.member);
  }, [apiData]);
  // Function to handle sorting
  const handleSort = (column) => {
    let direction = "asc";
    if (sortConfig.key === column && sortConfig.direction === "asc") {
      direction = "desc"; // Toggle sorting direction
    }
    setSortConfig({ key: column, direction });
  };

  // Function to sort the data based on the current sortConfig

  useEffect(() => {
    const sortedData = [...filteredItems]?.sort((a, b) => {
      // Sorting by user field or date
      if (sortConfig?.key === "date") {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA < dateB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (dateA > dateB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      } else {
        // Sorting by user field
        if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      }
    });
    setFilteredItems(sortedData);
  }, [sortConfig.direction]);

  const handleMaritalStatusChange = (selectedStatuses) => {
    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        martialStatus: selectedStatuses.join(","),
      };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };

  const [highlightAddButton, setHighlightAddButton] = useState(false);
  const [showBulkMemberPopup, setShowBulkMemberPopup] = useState(false);

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [sidebarVisible, setSidebarVisible] = useState(true);

  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); 

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRefs = useRef({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest('.actions-dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);


const handleMenuClick = (e, memberId) => {
  e.stopPropagation(); // Prevent row navigation
  console.log("Menu clicked for member:", memberId, "Current openMenuId:", openMenuId);
  setOpenMenuId(prev => {
    const newValue = prev === memberId ? null : memberId;
    console.log("Setting openMenuId to:", newValue);
    return newValue;
  });
};

// Handle click outside to close the menu
useEffect(() => {
  const handleClickOutside = (event) => {
    // Check if click is outside any open menu
    if (openMenuId && menuRefs.current[openMenuId] && !menuRefs.current[openMenuId].contains(event.target)) {
      setOpenMenuId(null);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [openMenuId]);


  const [showAllMembers, setShowAllMembers] = useState(false);
  const [allMembers, setAllMembers] = useState([]);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [isLoading, setIsLoading] = useState(true);
  
  // Match details modal state
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  
  // Current user data for match analysis
  const [currentUser, setCurrentUser] = useState({
    age: 25,
    location: "Karachi",
    sect: "Sunni-Hanafi",
    martial_status: "single",
    profession: "Software Engineer",
    education: "bachelors",
    family_background: "middle class",
    lifestyle: "moderate"
  });

  useEffect(() => {
    // Only fetch agent members if role is agent (not when impersonating user)
    if (role !== "agent") return;
    
    const parameter = {
      url: `/api/agent/user_agent/?agent_id=${userId}`,
      setterFunction: (data) => {
        // API response received
        
        // Handle different data structures
        let members = [];
        if (Array.isArray(data)) {
          members = data;
        } else if (data.member && Array.isArray(data.member)) {
          members = data.member;
        } else if (data.members && Array.isArray(data.members)) {
          members = data.members;
        } else if (data.results && Array.isArray(data.results)) {
          members = data.results;
        }
        
        console.log("Final members array:", members);
        console.log("First member in final array:", members[0]);
        if (members[0]) {
          console.log("First member member_id:", members[0].member_id);
          console.log("First member id:", members[0].id);
          console.log("First member profile_photo:", members[0].profile_photo);
          console.log("First member user_profilephoto:", members[0].user_profilephoto);
          console.log("First member user_profilephoto?.upload_photo:", members[0].user_profilephoto?.upload_photo);
        }
        
        // Ensure each member has a member_id field
        const membersWithMemberId = members.map((member) => {
          if (!member.member_id && member.id) {
            // If member_id is not present, generate one in the proper format
            const currentYear = new Date().getFullYear();
            const memberIdNumber = String(member.id).padStart(3, '0');
            const generatedMemberId = `MM${currentYear}${memberIdNumber}`;
            
            return {
              ...member,
              member_id: generatedMemberId
            };
          }
          return member;
        });
        
        // console.log("Members with member_id:", membersWithMemberId);
        
        // If no members found, add sample data for testing
        if (membersWithMemberId.length === 0) {
          // console.log("No members found, adding sample data for testing");
          const sampleMembers = [
            {
              id: 10,
              member_id: "MM2025001",
              name: "anas khan",
              age: 23,
              gender: "male",
              location: "Aizawl",
              sect: "Ahle Qur'an",
              profession: "Business Person",
              martial_status: "single",
              notifications: 0,
              email: "anas@example.com"
            }
          ];
          setAllMembers(sampleMembers);
        } else {
          setAllMembers(membersWithMemberId);
        }
        
        setIsLoading(false);
        // console.log("=== END DEBUG ===");
      },
      setErrors: setErrors,
    };
    fetchDataWithTokenV2(parameter);
  }, [userId]);



  const loginAsUser = async (userId) => {
    try {
      const currentToken = localStorage.getItem('token');
      console.log('Login as user - Current token:', currentToken ? 'Token exists' : 'No token');
      console.log('Login as user - User ID:', userId);
      console.log('Login as user - API URL:', `${process.env.REACT_APP_API_URL}/api/agent/access-agent-as-user/${userId}/`);
      
      if (!currentToken) {
        throw new Error('No authentication token found. Please login again.');
      }
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/agent/access-agent-as-user/${userId}/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login as user failed:', response.status, errorData);
        throw new Error(errorData.error || `Failed to login as user (${response.status})`);
      }

      const data = await response.json();
      console.log('Successfully logged in as user:', data);
      console.log('User token received:', data.access ? 'Token exists' : 'No token');
      console.log('User ID:', data.impersonating);

      // Store user tokens and session data
      localStorage.setItem('user_access_token', data.access);
      localStorage.setItem('user_refresh_token', data.refresh);
      localStorage.setItem('impersonating_user_id', data.impersonating);
      localStorage.setItem('is_agent_impersonating', 'true');
      localStorage.setItem('user_name', data.user_name);
      localStorage.setItem('agent_name', data.agent_name);
      
      // Store original agent token and role for later restoration
      localStorage.setItem('original_agent_token', currentToken);
      localStorage.setItem('original_agent_role', localStorage.getItem('role'));
      
      // Switch to user role and token - actually login as user
      localStorage.setItem('token', data.access);
      localStorage.setItem('role', 'user');
      localStorage.setItem('userId', data.impersonating);

      // Show success message
      alert(`Successfully logged in as ${data.user_name}`);

      // Navigate to user dashboard
      navigate('/user-dashboard');

    } catch (error) {
      console.error('Error logging in as user:', error.message);
      alert(`Error: ${error.message}`);
    }
  };



  return (
    <>
     

      <DashboardLayout
        onAddMember={() => setHighlightAddButton(true)}
        onToggleSidebar={setSidebarVisible}
      >
        <div className="flex-col p-[24px] w-[100%]">

          {/* View Toggle and Stats Section */}
          <div className="view-stats-section">
            {/* View Toggle Buttons */}
            <div className="view-toggle-section">
              <div className="view-toggle-buttons">
                <button
                  className={`view-toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
                  onClick={() => setViewMode('cards')}
                  title="Card View"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Cards
                </button>
                <button
                  className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                  title="Table View"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3H21V21H3V3Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M3 9H21" stroke="currentColor" strokeWidth="2"/>
                    <path d="M3 15H21" stroke="currentColor" strokeWidth="2"/>
                    <path d="M9 3V21" stroke="currentColor" strokeWidth="2"/>
                    <path d="M15 3V21" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Table
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-section">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <span className="stat-number">{allMembers.length}</span>
                  <span className="stat-label">Total Members</span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🔔</div>
                <div className="stat-info">
                  <span className="stat-number">{allMembers.reduce((sum, m) => sum + (m.notifications || 0), 0)}</span>
                  <span className="stat-label">Notifications</span>
                </div>
              </div>
            </div>

            {/* Add New Member Button */}
            <div className="add-member-section">
              <button 
                className="add-member-btn"
                onClick={handleClick}
              >
                <span className="btn-icon">+</span>
                Add New Member
              </button>
            </div>
          </div>

          {/* Filters Section */}
          <div className="filter-container">
            <button className="filter-button">
              <AiOutlineFilter className="icon" /> Filter
            </button>
            <input
              className="filter-dropdown"
              type="text"
              value={filters.id}
              onChange={(e) => handleFilterChange("id", e.target.value)}
              placeholder="Enter ID"
              list="distinct-ids"
              style={{ width: "70px" }}
            />

            <input
              className="filter-dropdown"
              type="text"
              value={filters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
              placeholder="Location"
              list="distinct-ids"
              style={{ width: "70px" }}
            />

            {/* Replace your current date picker implementation with this */}
            <div className="date-filters-container">
              <CustomDatePicker
                selectedDate={filters.startDate}
                onChange={(date) => handleFilterChange("startDate", date)}
                placeholder="Start Date"
              />

              <CustomDatePicker
                selectedDate={filters.endDate}
                onChange={(date) => handleFilterChange("endDate", date)}
                placeholder="End Date"
              />
            </div>

            <style>
              {`
  .date-filters-container {
    display: flex;
    gap: 10px;
  }
`}
            </style>

            <select
              className="filter-dropdown"
              value={filters.sectSchoolInfo}
              onChange={(e) =>
                handleFilterChange("sectSchoolInfo", e.target.value)
              }
            >
              <option value="">Sect</option>
              {distinctSchoolInfo?.map((info, index) => (
                <option key={index} value={info}>
                  {info}
                </option>
              ))}
            </select>

            <select
              className="filter-dropdown"
              value={filters.profession}
              onChange={(e) => handleFilterChange("profession", e.target.value)}
            >
              <option value="">Profession</option>
              {distinctProfessions?.map((profession, index) => (
                <option key={index} value={profession}>
                  {profession}
                </option>
              ))}
            </select>

            <MaritalStatusDropdown
              value={
                filters.martialStatus ? filters.martialStatus.split(",") : []
              }
              userGender={gender}
              onChange={handleMaritalStatusChange}
            />

            <StatusDropdown
              value={filters.status ? filters.status.split(",") : []}
              onChange={(selectedStatuses) => {
                setFilters((prevFilters) => {
                  const updatedFilters = {
                    ...prevFilters,
                    status: selectedStatuses.join(","),
                  };
                  applyFilters(updatedFilters);
                  return updatedFilters;
                });
              }}
            />

            <button
              type="button"
              className="reset-filter"
              onClick={onClearFilterClick}
            >
              <AiOutlineRedo className="icon" /> Reset
            </button>

            <button
              onClick={handleClick}
              type="button"
              className={`m-[12px] ${
                highlightAddButton ? "ring-2 ring-black rounded-full" : ""
              }`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 108 108"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="54" cy="54" r="54" fill="#0fd357" />
                <path
                  d="M77 54.5H32"
                  stroke="#fff"
                  stroke-width="4.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M54.5 77V32"
                  stroke="#fff"
                  stroke-width="4.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Loading Skeleton */}
          {isLoading ? (
            <div className="loading-container">
              <div className="skeleton-grid">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="skeleton-card">
                    <div className="skeleton-header">
                      <div className="skeleton-badge"></div>
                      <div className="skeleton-button"></div>
                    </div>
                    <div className="skeleton-profile">
                      <div className="skeleton-avatar"></div>
                      <div className="skeleton-info">
                        <div className="skeleton-name"></div>
                        <div className="skeleton-email"></div>
                      </div>
                    </div>
                    <div className="skeleton-details">
                      <div className="skeleton-detail"></div>
                      <div className="skeleton-detail"></div>
                      <div className="skeleton-detail"></div>
                      <div className="skeleton-detail"></div>
                    </div>
                    <div className="skeleton-footer"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Members Section - Cards or Table View */
            viewMode === 'cards' ? (
            <div className="members-cards-container">
              <div className="cards-grid">
              {allMembers.map((member) => {
                // console.log("Rendering member:", member);
                // console.log("Member member_id:", member?.member_id);
                // console.log("Member id:", member?.id);
                // Age is now handled by the backend age field
                return (
                  <div
                    key={member.id}
                    className="member-card"
                    onClick={() => navigate(`/details/${member?.id}`)}
                  >
                    {/* Card Header */}
                    <div className="card-header">
                      <div className="member-id-section">
                        <span className="id-badge">{member?.member_id || "N/A"}</span>
                        {member?.notifications > 0 && (
                          <span className="notification-indicator">
                            {member.notifications}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Member Profile Section */}
                    <div className="card-profile-section">
                      <div className="profile-avatar-large">
                        <img
                          src={(() => {
                            // Check multiple possible field names for profile photo
                            const photoUrl = member?.profile_photo?.upload_photo || 
                                            member?.user_profilephoto?.upload_photo ||
                                            member?.profile_image ||
                                            member?.avatar ||
                                            member?.photo ||
                                            member?.image ||
                                            member?.user_profilephoto?.photo ||
                                            member?.user_profilephoto?.image;
                            
                            const fullUrl = photoUrl ? `${process.env.REACT_APP_API_URL}${photoUrl}` : null;
                            
                            if (fullUrl) {
                              return fullUrl;
                            } else {
                              return member?.gender === "male"
                                ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDNy41ODE3MiAxNCA0IDE3LjU4MTcgNCAyMkgxMkMxNi40MTgzIDE0IDEyIDE0IDEyIDE0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo="
                                : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNFQzQ4OTkiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDNy41ODE3MiAxNCA0IDE3LjU4MTcgNCAyMkgxMkMxNi40MTgzIDE0IDEyIDE0IDEyIDE0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo=";
                            }
                          })()}
                          alt={member?.name || "Member"}
                          className="avatar-large-img"
                          onError={(e) => {
                            e.target.src = member?.gender === "male"
                              ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDNy41ODE3MiAxNCA0IDE3LjU4MTcgNCAyMkgxMkMxNi40MTgzIDE0IDEyIDE0IDEyIDE0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo="
                              : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNFQzQ4OTkiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDNy41ODE3MiAxNCA0IDE3LjU4MTcgNCAyMkgxMkMxNi40MTgzIDE0IDEyIDE0IDEyIDE0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo=";
                          }}
                        />
                      </div>
                      <div className="profile-info-large">
                        <h3 className="member-name-large">{member?.name || "N/A"}</h3>
                        <p className="member-email-large">{member?.email || ""}</p>
                      </div>
                    </div>

                    {/* Member Details Grid */}
                    <div className="card-details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Age</span>
                        <span className="detail-value">
                          {member?.age || "N/A"}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Gender</span>
                        <span className="detail-value">{member?.gender || "N/A"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Location</span>
                        <span className="detail-value">{member?.location || member?.city || "N/A"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Sect</span>
                        <span className="detail-value">{member?.sect || member?.sect_school_info || "N/A"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Profession</span>
                        <span className="detail-value">{member?.profession || "N/A"}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Marital Status</span>
                        <span className={`marital-badge ${member?.martial_status ? member?.martial_status?.toLowerCase()?.replace(" ", "-") : "not-mentioned"}`}>
                          {member?.martial_status || "Not mentioned"}
                        </span>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="card-footer">
                      <div className="notifications-info">
                        <span className="notifications-icon">🔔</span>
                        <span className="notifications-text">
                          {member?.notifications > 0 
                            ? `${member.notifications} notification${member.notifications > 1 ? 's' : ''}`
                            : "No notifications"
                          }
                        </span>
                      </div>
                      <div className="card-action-buttons">
                        <button
                          className="card-action-btn view-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/details/${member?.id}`);
                          }}
                          title="View Profile"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>
                        
                        <button
                          className="card-action-btn edit-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/memstepone`, { state: { editMode: true, memberId: member.id } });
                          }}
                          title="Edit Profile"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        
                        <button
                          className="card-action-btn match-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMember(member);
                            setShowMatchModal(true);
                          }}
                          title="View Match Details"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12l2 2 4-4"/>
                            <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                            <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                            <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/>
                            <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"/>
                          </svg>
                        </button>
                        
                        <button
                          className="card-action-btn delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add delete functionality
                          }}
                          title="Delete Profile"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          ) : (
            /* Table View */
            <div className="members-table-container">
              <div className="table-wrapper">
                <table className="members-table">
                  <thead>
                    <tr>
                      <th>Member ID</th>
                      <th>Photo</th>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Location</th>
                      <th>Sect</th>
                      <th>Profession</th>
                      <th>Martial Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allMembers.map((member) => (
                      <tr key={member.id} className="table-row">
                        <td>
                          <span className="member-id-badge">{member?.member_id || "N/A"}</span>
                        </td>
                        <td>
                          <div className="member-photo-cell">
                            <div className="member-avatar">
                              <img
                                src={(() => {
                                  // Check multiple possible field names for profile photo
                                  const photoUrl = member?.profile_photo?.upload_photo || 
                                                  member?.user_profilephoto?.upload_photo ||
                                                  member?.profile_image ||
                                                  member?.avatar ||
                                                  member?.photo ||
                                                  member?.image ||
                                                  member?.user_profilephoto?.photo ||
                                                  member?.user_profilephoto?.image;
                                  
                                  const fullUrl = photoUrl ? `${process.env.REACT_APP_API_URL}${photoUrl}` : null;
                                  
                                  console.log(`Member ${member?.name} - All photo fields:`, {
                                    'profile_photo.upload_photo': member?.profile_photo?.upload_photo,
                                    'user_profilephoto.upload_photo': member?.user_profilephoto?.upload_photo,
                                    profile_image: member?.profile_image,
                                    avatar: member?.avatar,
                                    photo: member?.photo,
                                    image: member?.image
                                  });
                                  console.log(`Member ${member?.name} - Selected Photo URL:`, photoUrl);
                                  console.log(`Member ${member?.name} - Full URL:`, fullUrl);
                                  console.log(`Member ${member?.name} - API URL:`, process.env.REACT_APP_API_URL);
                                  
                                  if (fullUrl) {
                                    return fullUrl;
                                  } else {
                                    return member?.gender === "male"
                                      ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDNy41ODE3MiAxNCA0IDE3LjU4MTcgNCAyMkgxMkMxNi40MTgzIDE0IDEyIDE0IDEyIDE0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo="
                                      : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFQzQ4OTkiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDNy41ODE3MiAxNCA0IDE3LjU4MTcgNCAyMkgxMkMxNi40MTgzIDE0IDEyIDE0IDEyIDE0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo=";
                                  }
                                })()}
                                alt={member?.name || "Member"}
                                className="avatar-img"
                                onError={(e) => {
                                  e.target.src = member?.gender === "male"
                                    ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2MzY2RjEiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDNy41ODE3MiAxNCA0IDE3LjU4MTcgNCAyMkgxMkMxNi40MTgzIDE0IDEyIDE0IDEyIDE0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo="
                                    : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNFQzQ4OTkiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDNy41ODE3MiAxNCA0IDE3LjU4MTcgNCAyMkgxMkMxNi40MTgzIDE0IDEyIDE0IDEyIDE0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo=";
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="member-name-cell">
                            <div className="member-info">
                              <span className="member-name">{member?.name || "N/A"}</span>
                              <span className="member-email">{member?.email || ""}</span>
                            </div>
                          </div>
                        </td>
                        <td>{member?.age || "N/A"}</td>
                        <td>{member?.gender || "N/A"}</td>
                        <td>{member?.location || member?.city || "N/A"}</td>
                        <td>{member?.sect || member?.sect_school_info || "N/A"}</td>
                        <td>{member?.profession || "N/A"}</td>
                        <td>
                          <span className={`marital-badge ${member?.martial_status ? member?.martial_status?.toLowerCase()?.replace(" ", "-") : "not-mentioned"}`}>
                            {member?.martial_status || "Not mentioned"}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions" style={{ 
                            display: "flex", 
                            gap: "8px", 
                            alignItems: "center", 
                            flexWrap: "nowrap", 
                            justifyContent: "center",
                            minWidth: "120px",
                            padding: "4px"
                          }}>
                            <button
                              className="action-btn view-btn modern-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("View button clicked for member:", member?.id);
                                navigate(`/details/${member?.id}`);
                              }}
                              title="View Profile"
                              style={{
                                width: "36px",
                                height: "36px",
                                minWidth: "36px",
                                minHeight: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                              </svg>
                            </button>
                            
                            <button
                              className="action-btn edit-btn modern-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/memstepone`, { state: { editMode: true, memberId: member.id } });
                              }}
                              title="Edit Profile"
                              style={{
                                width: "36px",
                                height: "36px",
                                minWidth: "36px",
                                minHeight: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </button>
                            
                            <button
                              className="action-btn match-btn modern-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMember(member);
                                setShowMatchModal(true);
                              }}
                              title="View Match Details"
                              style={{
                                width: "36px",
                                height: "36px",
                                minWidth: "36px",
                                minHeight: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 12l2 2 4-4"/>
                                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                                <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                                <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/>
                                <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"/>
                              </svg>
                            </button>
                            
                            <button
                              className="action-btn delete-btn modern-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Add delete functionality
                              }}
                              title="Delete Profile"
                              style={{
                                width: "36px",
                                height: "36px",
                                minWidth: "36px",
                                minHeight: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3,6 5,6 21,6"/>
                                <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                                <line x1="10" y1="11" x2="10" y2="17"/>
                                <line x1="14" y1="11" x2="14" y2="17"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
          )}

          {/* Pagination */}
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo; Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`pagination-btn ${
                  currentPage === i + 1 ? "active" : ""
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next &raquo;
            </button>
          </div>
        </div>

        <style>
          {`
          /* Total Requests Exact Styling */
          .total-interest-container {
            padding: 20px;
            background: #f8f9fa;
          }
          
          .page-title {
            color: #1f2937;
            font-weight: 600;
            font-size: 24px;
            text-align: left;
            margin-bottom: 24px;
            line-height: 1.2;
          }

          .interest-table {
            width: 100%;
            border-collapse: collapse;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          .interest-table th {
            background: #f9fafb;
            color: #374151;
            font-weight: 600;
            padding: 12px 16px;
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            cursor: pointer;
            transition: background-color 0.2s ease;
            border-bottom: 1px solid #e5e7eb;
            border-right: 1px solid #e5e7eb;
          }
          
          .interest-table th:hover {
            background: #f3f4f6;
          }
          
          .interest-table th:last-child {
            border-right: none;
          }
          
          .interest-table td {
            padding: 12px 16px;
            border-bottom: 1px solid #f3f4f6;
            border-right: 1px solid #f3f4f6;
            font-size: 14px;
            color: #1f2937;
            background: #ffffff;
          }
          
          .interest-table td:last-child {
            border-right: none;
          }
          
          .interest-table tr:hover {
            background: #f9fafb;
          }
          
          .interest-table tr:last-child td {
            border-bottom: none;
          }

          .table-row {
            cursor: pointer;
          }
          .table-row:hover {
            background: #f1f1f1;
          }

          .status-badge {
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
          .status-badge.sent {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            border-color: #047857;
          }
          .status-badge.pending {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: #ffffff;
            border-color: #b45309;
          }
          .status-badge.received {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: #ffffff;
            border-color: #1e40af;
          }
          .status-badge.approved, .status-badge.accepted {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            border-color: #047857;
          }
          .status-badge.rejected {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: #ffffff;
            border-color: #b91c1c;
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

          /* Action buttons styling */
          .action-btn {
            border: none;
            border-radius: 8px;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
          }
          
          .action-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
          }
          
          .action-btn:hover::before {
            left: 100%;
          }
          
          .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          
          .action-btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          
          .action-btn svg {
            transition: transform 0.2s ease;
            z-index: 1;
            position: relative;
          }
          
          .action-btn:hover svg {
            transform: scale(1.1);
          }
          
          .modern-btn {
            border-radius: 8px !important;
            width: 36px !important;
            height: 36px !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
            transition: all 0.2s ease !important;
          }
          
          .modern-btn:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          }
          
          .modern-btn svg {
            transition: transform 0.2s ease;
          }
          
          .modern-btn:hover svg {
            transform: scale(1.1);
          }
          
          .view-btn {
            background-color: #28a745;
            color: white;
          }
          
          .view-btn:hover {
            background-color: #218838;
          }
          
          .edit-btn {
            background-color: #ffc107;
            color: #212529;
          }
          
          .edit-btn:hover {
            background-color: #e0a800;
          }
          
          .delete-btn {
            background-color: #dc3545;
            color: white;
          }
          
          .delete-btn:hover {
            background-color: #c82333;
          }
          
          .match-btn {
            background-color: #6f42c1;
            color: white;
          }
          
          .match-btn:hover {
            background-color: #5a32a3;
          }

          /* Pagination Styling */
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

          /* View Toggle and Stats Section */
          .view-stats-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
          }

          .view-toggle-section {
            display: flex;
            align-items: center;
          }

          .view-toggle-buttons {
            display: flex;
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 12px;
            padding: 6px;
            gap: 4px;
          }

          .view-toggle-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            border: none;
            background: transparent;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            color: rgba(255,255,255,0.8);
            transition: all 0.3s ease;
          }

          .view-toggle-btn:hover {
            background: rgba(255,255,255,0.1);
            color: white;
            transform: translateY(-1px);
          }

          .view-toggle-btn.active {
            background: rgba(255,255,255,0.25);
            color: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateY(-1px);
          }

          .stats-section {
            display: flex;
            gap: 20px;
            align-items: center;
          }

          .stat-card {
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            min-width: 120px;
            transition: all 0.3s ease;
          }

          .stat-card:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-2px);
          }

          .stat-number {
            display: block;
            font-size: 1.8rem;
            font-weight: 700;
            color: white;
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 0.9rem;
            color: rgba(255,255,255,0.8);
            font-weight: 500;
          }

          .filter-container {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 12px;
            margin-bottom: 24px;
            padding: 20px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .filter-button, .reset-filter {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            background: #ffffff;
            color: #374151;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          }

          .filter-button:hover, .reset-filter:hover {
            border-color: #9ca3af;
            background: #f9fafb;
          }

          .reset-filter {
            color: #dc2626;
            border-color: #fecaca;
            background: #fef2f2;
          }

          .reset-filter:hover {
            border-color: #f87171;
            background: #fee2e2;
          }

          .icon {
            font-size: 14px;
          }

          .filter-dropdown {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background: #fff;
            font-size: 14px;
            font-weight: 500;
          }
              .date-filter {
            border-radius: 5px;
            background: #fff;
            font-size: 14px;
            font-weight: 500;

          }
          .date-picker-btn {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
            cursor: pointer;
            background: #fff;
          }
          .date-picker-btn:hover {
            background: #007bff;
            color: #fff;
          }
          .react-datepicker {
            position: absolute;
            z-index: 999;
            background: white;
            border: 1px solid #ccc;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          }
          .page-title {
            font-weight: 700;
            font-size: 24px;
            text-align: left;
            margin-bottom: 20px;
          }
          .filter-container {
            display: flex;
            flex-wrap:wrap;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;

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
              width: auto;

          }
          .reset-filter {
            color: red;
          }
              .icon {
            font-size: 14px;
            
          }
          .filter-dropdown {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background: #fff;
            font-size: 14px;
            font-weight: 500;
          }
          .interest-table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            border-radius: 10px;
            overflow: hidden;
          }
               .interest-table th {
      background: #f0f0f0; /* Light Gray */
      color: #333;
      font-weight: bold;
      text-transform: uppercase;
    }
          .interest-table th, .interest-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          /* Modern Pagination */
          .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 32px;
            gap: 8px;
            padding: 20px 0;
          }
          
          .pagination-btn {
            padding: 12px 16px;
            border: 2px solid #e2e8f0;
            background: white;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 500;
            color: #4a5568;
            min-width: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .pagination-btn:hover:not(:disabled) {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-color: #667eea;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
          }
          
          .pagination-btn.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-color: #667eea;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          }
          
          .pagination-btn:disabled {
            background: #f7fafc;
            color: #a0aec0;
            border-color: #e2e8f0;
            cursor: not-allowed;
            opacity: 0.6;
          }

          /* Enhanced Agent Members Dashboard Styles */
          .agent-members-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 24px;
            color: white;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }

          .header-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
          }

          .title-section h1 {
            font-size: 28px;
            font-weight: 700;
            margin: 0 0 8px 0;
            color: white;
          }

          .page-subtitle {
            font-size: 16px;
            opacity: 0.9;
            margin: 0;
          }

          .stats-section {
            display: flex;
            gap: 20px;
          }

          .stat-card {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 140px;
          }

          .stat-icon {
            font-size: 24px;
            opacity: 0.9;
          }

          .stat-info {
            display: flex;
            flex-direction: column;
          }

          .stat-number {
            font-size: 20px;
            font-weight: 700;
            line-height: 1;
          }

          .stat-label {
            font-size: 12px;
            opacity: 0.8;
            margin-top: 2px;
          }

          .quick-actions {
            display: flex;
            gap: 12px;
          }

          .action-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            border-radius: 8px;
            border: none;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .action-btn.primary {
            background: #4CAF50;
            color: white;
          }

          .action-btn.primary:hover {
            background: #45a049;
            transform: translateY(-2px);
          }

          .action-btn.secondary {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
          }

          .action-btn.secondary:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
          }

          .btn-icon {
            font-size: 16px;
          }

          /* View Stats Section */
          .view-stats-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding: 16px 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            border: 1px solid #e9ecef;
            gap: 20px;
          }

          .view-toggle-buttons {
            display: flex;
            gap: 8px;
          }

          .view-toggle-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            background: white;
            color: #6c757d;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .view-toggle-btn:hover {
            border-color: #667eea;
            color: #667eea;
            background: #f8f9ff;
          }

          .view-toggle-btn.active {
            border-color: #667eea;
            background: #667eea;
            color: white;
          }

          .view-toggle-btn svg {
            width: 18px;
            height: 18px;
          }

          .stats-section {
            display: flex;
            gap: 16px;
          }

          .stat-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e9ecef;
            min-width: 140px;
          }

          .stat-icon {
            font-size: 20px;
          }

          .stat-info {
            display: flex;
            flex-direction: column;
          }

          .stat-number {
            font-size: 18px;
            font-weight: 700;
            color: #212529;
            line-height: 1;
          }

          .stat-label {
            font-size: 12px;
            color: #6c757d;
            margin-top: 2px;
          }

          /* Add Member Section */
          .add-member-section {
            display: flex;
            align-items: center;
          }

          .add-member-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
          }

          .add-member-btn:hover {
            background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
          }

          .add-member-btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
          }

          .add-member-btn .btn-icon {
            font-size: 18px;
            font-weight: bold;
          }

          /* ===== COMPREHENSIVE RESPONSIVE DESIGN ===== */
          
          /* Large Desktop (1200px and up) */
          @media (min-width: 1200px) {
            .view-stats-section {
              padding: 20px 24px;
            }
            
            .members-table-container {
              margin-bottom: 40px;
            }
            
            .filter-container {
              padding: 16px 20px;
            }
          }

          /* Desktop (992px to 1199px) */
          @media (max-width: 1199px) and (min-width: 992px) {
            .view-stats-section {
              gap: 16px;
            }
            
            .stat-card {
              min-width: 120px;
            }
            
            .action-btn {
              min-width: 100px;
              padding: 8px 12px;
            }
          }

          /* Tablet (768px to 991px) */
          @media (max-width: 991px) and (min-width: 768px) {
            .view-stats-section {
              flex-direction: column;
              gap: 16px;
              align-items: stretch;
              padding: 16px;
            }

            .view-toggle-buttons {
              justify-content: center;
            }

            .stats-section {
              justify-content: center;
              gap: 12px;
            }

            .add-member-section {
              justify-content: center;
            }
            
            .stat-card {
              min-width: 100px;
            }
            
            .filter-container {
              flex-wrap: wrap;
              gap: 8px;
              padding: 12px 16px;
            }
            
            .filter-dropdown {
              min-width: 100px;
            }
            
            .action-btn {
              min-width: 90px;
              padding: 8px 10px;
              font-size: 12px;
            }
            
            .action-btn span {
              font-size: 11px;
            }
            
            .members-table th,
            .members-table td {
              padding: 12px 8px;
            }
            
            .member-photo-cell {
              min-width: 60px;
            }
            
            .member-name-cell {
              min-width: 120px;
            }
          }

          /* Mobile Large (576px to 767px) */
          @media (max-width: 767px) and (min-width: 576px) {
            .flex-col {
              padding: 16px !important;
            }
            
            .view-stats-section {
              flex-direction: column;
              gap: 16px;
              align-items: stretch;
              padding: 16px;
              margin-bottom: 16px;
            }

            .view-toggle-buttons {
              justify-content: center;
              gap: 6px;
            }
            
            .view-toggle-btn {
              padding: 8px 12px;
              font-size: 13px;
            }

            .stats-section {
              justify-content: center;
              gap: 12px;
              flex-wrap: wrap;
            }

            .add-member-section {
              justify-content: center;
            }
            
            .stat-card {
              min-width: 90px;
              padding: 10px 12px;
            }
            
            .stat-number {
              font-size: 16px;
            }
            
            .stat-label {
              font-size: 11px;
            }
            
            .filter-container {
              flex-direction: column;
              gap: 12px;
              padding: 12px;
              align-items: stretch;
            }
            
            .filter-button,
            .reset-filter {
              width: 100%;
              justify-content: center;
            }
            
            .filter-dropdown {
              width: 100%;
              min-width: auto;
            }
            
            .date-filters-container {
              flex-direction: column;
              gap: 8px;
            }
            
            .table-actions {
              flex-direction: column;
              gap: 8px;
            }
            
            .action-btn {
              width: 100%;
              min-width: auto;
              justify-content: center;
            }
            
            .members-table-container {
              margin-bottom: 20px;
              border-radius: 12px;
            }
            
            .members-table th,
            .members-table td {
              padding: 10px 6px;
              font-size: 12px;
            }
            
            .members-table th {
              font-size: 11px;
              padding: 12px 6px;
            }
            
            .member-photo-cell {
              min-width: 50px;
            }
            
            .member-name-cell {
              min-width: 100px;
            }
            
            .avatar-img {
              width: 36px;
              height: 36px;
            }
            
            .member-name {
              font-size: 13px;
            }
            
            .member-email {
              font-size: 11px;
            }
            
            .member-id-badge {
              font-size: 10px;
              padding: 4px 8px;
              min-width: 80px;
            }
            
            .gender-badge,
            .profession-badge,
            .status-badge.enhanced {
              font-size: 10px;
              padding: 4px 8px;
              min-width: 60px;
            }
          }

          /* Mobile Small (up to 575px) */
          @media (max-width: 575px) {
            .flex-col {
              padding: 12px !important;
            }
            
            .view-stats-section {
              flex-direction: column;
              gap: 12px;
              align-items: stretch;
              padding: 12px;
              margin-bottom: 12px;
            }

            .view-toggle-buttons {
              justify-content: center;
              gap: 4px;
            }
            
            .view-toggle-btn {
              padding: 6px 10px;
              font-size: 12px;
              flex: 1;
            }
            
            .view-toggle-btn svg {
              width: 16px;
              height: 16px;
            }

            .stats-section {
              justify-content: center;
              gap: 8px;
              flex-wrap: wrap;
            }

            .add-member-section {
              justify-content: center;
            }
            
            .stat-card {
              min-width: 80px;
              padding: 8px 10px;
              flex: 1;
            }
            
            .stat-icon {
              font-size: 16px;
            }
            
            .stat-number {
              font-size: 14px;
            }
            
            .stat-label {
              font-size: 10px;
            }
            
            .add-member-btn {
              padding: 10px 16px;
              font-size: 13px;
            }
            
            .filter-container {
              flex-direction: column;
              gap: 10px;
              padding: 10px;
              align-items: stretch;
            }
            
            .filter-button,
            .reset-filter {
              width: 100%;
              justify-content: center;
              padding: 10px;
            }
            
            .filter-dropdown {
              width: 100%;
              min-width: auto;
              padding: 10px;
            }
            
            .date-filters-container {
              flex-direction: column;
              gap: 6px;
            }
            
            .table-actions {
              flex-direction: column;
              gap: 6px;
            }
            
            .action-btn {
              width: 100%;
              min-width: auto;
              justify-content: center;
              padding: 8px 12px;
              font-size: 12px;
            }
            
            .action-btn span {
              font-size: 11px;
            }
            
            .members-table-container {
              margin-bottom: 16px;
              border-radius: 8px;
            }
            
            .table-wrapper {
              border-radius: 8px;
            }
            
            .members-table th,
            .members-table td {
              padding: 8px 4px;
              font-size: 11px;
            }
            
            .members-table th {
              font-size: 10px;
              padding: 10px 4px;
            }
            
            .member-photo-cell {
              min-width: 40px;
            }
            
            .member-name-cell {
              min-width: 80px;
            }
            
            .avatar-img {
              width: 32px;
              height: 32px;
            }
            
            .member-name {
              font-size: 12px;
            }
            
            .member-email {
              font-size: 10px;
            }
            
            .member-id-badge {
              font-size: 9px;
              padding: 3px 6px;
              min-width: 70px;
            }
            
            .gender-badge,
            .profession-badge,
            .status-badge.enhanced {
              font-size: 9px;
              padding: 3px 6px;
              min-width: 50px;
            }
            
            .pagination {
              margin-top: 20px;
              gap: 4px;
            }
            
            .pagination-btn {
              padding: 8px 10px;
              font-size: 12px;
              min-width: 36px;
            }
          }

          /* Extra Small Mobile (up to 375px) */
          @media (max-width: 375px) {
            .flex-col {
              padding: 8px !important;
            }
            
            .view-stats-section {
              padding: 8px;
              margin-bottom: 8px;
            }
            
            .view-toggle-btn {
              padding: 4px 8px;
              font-size: 11px;
            }
            
            .stat-card {
              padding: 6px 8px;
            }
            
            .stat-number {
              font-size: 12px;
            }
            
            .stat-label {
              font-size: 9px;
            }
            
            .add-member-btn {
              padding: 8px 12px;
              font-size: 12px;
            }
            
            .filter-container {
              padding: 8px;
            }
            
            .members-table th,
            .members-table td {
              padding: 6px 2px;
              font-size: 10px;
            }
            
            .members-table th {
              font-size: 9px;
              padding: 8px 2px;
            }
            
            .avatar-img {
              width: 28px;
              height: 28px;
            }
            
            .member-name {
              font-size: 11px;
            }
            
            .member-email {
              font-size: 9px;
            }
            
            .member-id-badge {
              font-size: 8px;
              padding: 2px 4px;
              min-width: 60px;
            }
            
            .gender-badge,
            .profession-badge,
            .status-badge.enhanced {
              font-size: 8px;
              padding: 2px 4px;
              min-width: 40px;
            }
            
            .action-btn {
              padding: 6px 8px;
              font-size: 11px;
            }
            
            .action-btn span {
              font-size: 10px;
            }
          }

          /* Landscape Mobile */
          @media (max-height: 500px) and (orientation: landscape) {
            .view-stats-section {
              flex-direction: row;
              gap: 12px;
              padding: 8px 16px;
            }
            
            .stats-section {
              gap: 8px;
            }
            
            .stat-card {
              padding: 6px 10px;
            }
            
            .members-table th,
            .members-table td {
              padding: 6px 4px;
            }
          }

          /* Modern Professional Table Styles */
          .members-table-container {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
            margin-bottom: 32px;
            border: 1px solid #f1f3f4;
          }

          .table-wrapper {
            overflow-x: auto;
            border-radius: 16px;
          }

          .members-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            background: #fff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          .members-table thead {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            position: relative;
          }

          .members-table thead::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: #dee2e6;
          }

          .members-table th {
            color: #1a202c;
            font-weight: 600;
            padding: 20px 16px;
            text-align: left;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            position: relative;
            white-space: nowrap;
          }

          .members-table th:first-child {
            border-top-left-radius: 16px;
            padding-left: 24px;
          }

          .members-table th:last-child {
            border-top-right-radius: 16px;
            padding-right: 24px;
          }

          .members-table tbody tr {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-bottom: 1px solid #f8f9fa;
            position: relative;
          }

          .members-table tbody tr:hover {
            background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
            border-color: #e3f2fd;
          }

          .members-table tbody tr:last-child {
            border-bottom: none;
          }

          .members-table tbody tr:last-child td:first-child {
            border-bottom-left-radius: 16px;
          }

          .members-table tbody tr:last-child td:last-child {
            border-bottom-right-radius: 16px;
          }

          .members-table td {
            padding: 20px 16px;
            vertical-align: middle;
            font-size: 14px;
            color: #2d3748;
            border: none;
          }

          .members-table td:first-child {
            padding-left: 24px;
          }

          .members-table td:last-child {
            padding-right: 24px;
          }

          /* Modern Member Photo Column */
          .member-photo-cell {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 80px;
          }

          /* Modern Member Name Column */
          .member-name-cell {
            display: flex;
            align-items: center;
            min-width: 150px;
          }

          .member-avatar {
            position: relative;
            flex-shrink: 0;
          }

          .avatar-img {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            object-fit: cover;
            border: 3px solid #f1f3f4;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }

          .member-avatar:hover .avatar-img {
            border-color: #667eea;
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
            transform: scale(1.05);
          }

          .member-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
            min-width: 0;
          }

          .member-name {
            font-weight: 600;
            color: #1a202c;
            font-size: 15px;
            line-height: 1.3;
            margin: 0;
          }

          .member-email {
            font-size: 13px;
            color: #718096;
            line-height: 1.2;
            margin: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          /* Modern Badge Styles */
          .member-id-badge {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
            display: inline-block;
            min-width: 100px;
            text-align: center;
          }

          .gender-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: capitalize;
            display: inline-block;
            min-width: 60px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(203, 59, 139, 0.2);
            font-family: 'Poppins', sans-serif;
          }

          .gender-badge.male {
            background: linear-gradient(135deg, #FF59B6 0%, #CB3B8B 100%);
            color: white;
          }

          .gender-badge.female {
            background: linear-gradient(135deg, #FFA4D6 0%, #EB53A7 100%);
            color: white;
          }

          .gender-badge.unknown {
            background: linear-gradient(135deg, #FFC0E3 0%, #DA73AD 100%);
            color: white;
          }

          .profession-badge {
            background: linear-gradient(135deg, #F971BC 0%, #EB53A7 100%);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
            min-width: 80px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(249, 113, 188, 0.3);
            font-family: 'Poppins', sans-serif;
          }

          .status-badge.enhanced {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: capitalize;
            display: inline-block;
            min-width: 80px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(203, 59, 139, 0.2);
            font-family: 'Poppins', sans-serif;
          }

          .status-badge.enhanced.single {
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            color: white;
          }

          .status-badge.enhanced.married {
            background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
            color: white;
          }

          .status-badge.enhanced.divorced {
            background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
            color: white;
          }

          .status-badge.enhanced.khula {
            background: linear-gradient(135deg, #feb2b2 0%, #fc8181 100%);
            color: white;
          }

          .status-badge.enhanced.not-mentioned {
            background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
            color: white;
          }

          /* Clean Professional Action Buttons */
          .table-actions {
            display: flex;
            gap: 12px;
            align-items: center;
            justify-content: center;
            padding: 8px 0;
            flex-wrap: wrap;
          }

          .action-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            background: white;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 14px;
            font-weight: 500;
            color: #4a5568;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            min-width: 120px;
            justify-content: center;
          }

          .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-color: #cbd5e0;
          }

          .action-btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }

          .action-btn svg {
            flex-shrink: 0;
            transition: all 0.3s ease;
          }

          .action-btn:hover svg {
            transform: scale(1.1);
          }

          .action-btn span {
            white-space: nowrap;
            font-size: 13px;
          }

          /* View Button - Clean Blue */
          .view-btn {
            border-color: #4299e1;
            color: #4299e1;
          }

          .view-btn:hover {
            background: #4299e1;
            color: white;
            border-color: #4299e1;
            box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
          }

          /* Edit Button - Clean Orange */
          .edit-btn {
            border-color: #ed8936;
            color: #ed8936;
          }

          .edit-btn:hover {
            background: #ed8936;
            color: white;
            border-color: #ed8936;
            box-shadow: 0 4px 12px rgba(237, 137, 54, 0.3);
          }

          /* Delete Button - Clean Red */
          .delete-btn {
            border-color: #e53e3e;
            color: #e53e3e;
          }

          .delete-btn:hover {
            background: #e53e3e;
            color: white;
            border-color: #e53e3e;
            box-shadow: 0 4px 12px rgba(229, 62, 62, 0.3);
          }

          /* Match Button - Clean Purple */
          .match-btn {
            border-color: #6f42c1;
            color: #6f42c1;
          }

          .match-btn:hover {
            background: #6f42c1;
            color: white;
            border-color: #6f42c1;
            box-shadow: 0 4px 12px rgba(111, 66, 193, 0.3);
          }


          /* Button Loading State */
          .action-btn.loading {
            pointer-events: none;
            opacity: 0.7;
          }

          .action-btn.loading svg {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          /* Responsive Button Sizing */
          @media (max-width: 768px) {
            .action-btn {
              width: 40px;
              height: 40px;
            }
            
            .table-actions {
              gap: 8px;
            }
          }

          /* Member Cards Layout */
          .members-cards-container {
            margin-bottom: 24px;
          }

          .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 24px;
            padding: 0;
          }

          .member-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            border: 1px solid #f1f3f4;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            font-family: 'Poppins', sans-serif;
          }

          .member-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            border-color: #e3f2fd;
          }

          /* Card Header */
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
          }

          .member-id-section {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .id-badge {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
          }

          .notification-indicator {
            background: #ff4444;
            color: white;
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: 600;
            min-width: 16px;
            text-align: center;
          }

          .card-action-btn {
            background: white;
            border: 1px solid #e2e8f0;
            padding: 8px;
            border-radius: 6px;
            cursor: pointer;
            color: #4a5568;
            transition: all 0.2s ease;
          }

          .card-action-btn:hover {
            background: #f7fafc;
            border-color: #cbd5e0;
          }

          .card-action-menu {
            position: absolute;
            top: 100%;
            right: 20px;
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            border-radius: 12px;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(102, 126, 234, 0.1);
            z-index: 1000;
            min-width: 180px;
            overflow: hidden;
            backdrop-filter: blur(10px);
            animation: menuSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          @keyframes menuSlideIn {
            from {
              opacity: 0;
              transform: translateY(-10px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          /* Modern Menu Items */
          .menu-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 18px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-size: 14px;
            font-weight: 500;
            color: #2d3748;
            position: relative;
            overflow: hidden;
          }

          .menu-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            transition: left 0.3s ease;
          }

          .menu-item:hover {
            background: linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%);
            color: #667eea;
            transform: translateX(4px);
          }

          .menu-item:hover::before {
            left: 0;
          }

          .menu-item.danger {
            color: #e53e3e;
          }

          .menu-item.danger:hover {
            background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
            color: #c53030;
          }

          .menu-icon {
            font-size: 16px;
            position: relative;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .menu-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%);
            margin: 8px 0;
          }

          /* Card Profile Section */
          .card-profile-section {
            padding: 24px 20px;
            text-align: center;
            background: white;
          }

          .profile-avatar-large {
            margin-bottom: 16px;
            display: inline-block;
          }

          .avatar-large-img {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #e9ecef;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          .profile-info-large {
            text-align: center;
          }

          .member-name-large {
            font-size: 20px;
            font-weight: 700;
            color: #212529;
            margin: 0 0 4px 0;
            line-height: 1.2;
          }

          .member-email-large {
            font-size: 14px;
            color: #6c757d;
            margin: 0;
          }

          /* Card Details Grid */
          .card-details-grid {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 20px;
            background: #f8f9fa;
          }

          .detail-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
          }

          .detail-label {
            font-size: 12px;
            font-weight: 600;
            color: #6c757d;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .detail-value {
            font-size: 14px;
            font-weight: 500;
            color: #212529;
          }

          /* Card Footer */
          .card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
          }

          .notifications-info {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #6c757d;
            font-size: 12px;
          }

          .notifications-icon {
            font-size: 14px;
          }

          .notifications-text {
            font-size: 12px;
            color: #6c757d;
          }

          .view-profile-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .view-profile-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .cards-grid {
              grid-template-columns: 1fr;
              gap: 16px;
            }

            .card-details-grid {
              grid-template-columns: 1fr;
              gap: 12px;
            }

            .card-header,
            .card-profile-section,
            .card-details-grid,
            .card-footer {
              padding-left: 16px;
              padding-right: 16px;
            }
          }
          .pagination-btn:disabled {
            cursor: not-allowed;
            opacity: 0.6;
          }
          .status-badge {
            padding: 5px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            text-transform: capitalize;
            display: inline-block;
          }
          .status-badge.sent {
            background: #e3f7f0;
            color: #18a558;
          }
          .status-badge.received {
            background: #f3e8ff;
            color: #8e44ad;
          }
          .status-badge.unspecified {
            background: #ffc0cb;
            color: #c4002b;
          }
          .marital-badge {
            padding: 5px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            display: inline-block;
          }
          .marital-badge.never-married {
            background: #d1f8d1;
            color: #2c7a2c;
          }.marital-badge.unmarried {
            background: #d1f8d1;
            color: #2c7a2c;
          }.marital-badge.single {
            background: #d1f8d1;
            color: #2c7a2c;
          }
          .marital-badge.divorced {
            background: #ffc0cb;
            color: #c4002b;
          }
          .marital-badge.widowed {
            background: #ffe4b5;
            color: #b8860b;
          }
          .marital-badge.not-mentioned {
            background: #ff6666;
            color: #800000;
          }.marital-badge.married {
            background: #ff6666;
            color: #800000;
          }
          .marital-badge.awaiting-divorce {
            background: #ffdd99;
            color: #a35400;
          }
          .marital-badge.khula {
            background: #e6ccff;
            color: #6a0dad;
          }
            .accept-btn, .reject-btn {
            padding: 5px 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 5px;
          }
          .accept-btn {
            background-color: #4CAF50;
            color: white;
          }
          .reject-btn {
            background-color: #f44336;
            color: white;
          }
          .accept-btn:hover {
            background-color: #45a049;
          }
          .reject-btn:hover {
            background-color: #e53935;
          }
        `}
        </style>
      </DashboardLayout>

      {/* Match Details Modal */}
      <MatchDetailsModal
        isOpen={showMatchModal}
        onClose={() => {
          setShowMatchModal(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        currentUser={currentUser}
      />
    </>
  );
};

export default MyMembers;