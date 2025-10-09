import React, { useState, useEffect } from "react";
import "./mobileProfileCard.css";
import { useNavigate } from "react-router-dom";
import { postDataWithFetchV2, fetchDataV2, justUpdateDataV2, putDataWithFetchV2 } from "../../../apiUtils";

const MobileProfileCard = ({ profile, setApiData, IsInterested, url, interested_id, activeUser }) => {
  const navigate = useNavigate();
  const [userId] = useState(localStorage.getItem("userId"));
  const [Error, setErrors] = useState("");
  const [message, setSuccessMessage] = useState();
  const [userDetail, setUserDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [photoRequestStatus, setPhotoRequestStatus] = useState(null);
  const [loadingPhotoStatus, setLoadingPhotoStatus] = useState(false);
  const role = localStorage.getItem('role');

  // Function to get marital status badge color
  const getMaritalStatusColor = (maritalStatus) => {
    switch (maritalStatus?.toLowerCase()) {
      case "single":
        return { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" };
      case "married":
        return { bg: "#dbeafe", text: "#1e40af", border: "#bfdbfe" };
      case "divorced":
        return { bg: "#fef2f2", text: "#dc2626", border: "#fecaca" };
      case "widowed":
        return { bg: "#fef3c7", text: "#d97706", border: "#fde68a" };
      case "khula":
        return { bg: "#f3e8ff", text: "#7c3aed", border: "#ddd6fe" };
      case "awaiting divorce":
        return { bg: "#fef3c7", text: "#d97706", border: "#fde68a" };
      case "never married":
        return { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" };
      default:
        return { bg: "#f1f5f9", text: "#475569", border: "#e2e8f0" };
    }
  };

  // Build image URL function
  const buildImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    if (typeof imagePath === 'string') {
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      return `${process.env.REACT_APP_API_URL || process.env.VITE_API_BASE_URL || 'http://localhost:8000'}${imagePath}`;
    }
    
    if (typeof imagePath === 'object' && imagePath.url) {
      return buildImageUrl(imagePath.url);
    }
    
    return null;
  };

  const interested = ({ action_on_id, interested_id }) => {
    const parameter = {
      url: Number(interested_id) ? `/api/recieved/${interested_id}/` : `/api/recieved/`,
      payload: {
        action_by_id: Number(userId),
        action_on_id: Number(action_on_id),
        action: "interested",
      },
    };
    postDataWithFetchV2(parameter, setApiData, setErrors, setSuccessMessage);
  };

  const shortlist = (action_on_id) => {
    const parameter = {
      url: `/api/shortlist/`,
      payload: {
        action_by_id: Number(userId),
        action_on_id: Number(action_on_id),
        action: "shortlist",
      },
    };
    postDataWithFetchV2(parameter, setApiData, setErrors, setSuccessMessage);
  };

  const blocked = (action_on_id) => {
    const parameter = {
      url: `/api/blocked/`,
      payload: {
        action_by_id: Number(userId),
        action_on_id: Number(action_on_id),
        action: "blocked",
      },
    };
    postDataWithFetchV2(parameter, setApiData, setErrors, setSuccessMessage);
  };

  return (
    <div className="mobile-profile-card">
      {/* Profile Image */}
      <div className="mobile-profile-image">
        <img
          src={buildImageUrl(profile?.profile_photo) || 
            `data:image/svg+xml;base64,${btoa(`
              <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="#3B82F6"/>
                <circle cx="50" cy="35" r="15" fill="white"/>
                <path d="M25 75 Q25 60 50 60 Q75 60 75 75 L75 85 L25 85 Z" fill="white"/>
              </svg>
            `)}`}
          alt={profile?.name || "Profile"}
          onError={(e) => {
            e.target.src = `data:image/svg+xml;base64,${btoa(`
              <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="#3B82F6"/>
                <circle cx="50" cy="35" r="15" fill="white"/>
                <path d="M25 75 Q25 60 50 60 Q75 60 75 75 L75 85 L25 85 Z" fill="white"/>
              </svg>
            `)}`;
          }}
        />
        <div className="mobile-status-badge">
          {profile?.martial_status || "Not Mentioned"}
        </div>
      </div>

      {/* Profile Info */}
      <div className="mobile-profile-info">
        <div className="mobile-profile-header">
          <h3 className="mobile-profile-name">
            {profile?.name ? profile.name.split(" ").slice(0, 1).join(" ") : "Not Mentioned"}
          </h3>
          <span className="mobile-profile-id">{profile?.member_id || profile?.id}</span>
        </div>

        <div className="mobile-profile-details">
          <div className="mobile-detail-row">
            <span className="mobile-detail-label">Age:</span>
            <span className="mobile-detail-value">{profile?.age || "Not Mentioned"}</span>
          </div>
          <div className="mobile-detail-row">
            <span className="mobile-detail-label">Education:</span>
            <span className="mobile-detail-value">{profile?.education || "Not Mentioned"}</span>
          </div>
          <div className="mobile-detail-row">
            <span className="mobile-detail-label">Profession:</span>
            <span className="mobile-detail-value">{profile?.profession || "Not Mentioned"}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mobile-action-buttons">
          <button 
            className="mobile-action-btn mobile-heart-btn"
            onClick={() => interested({action_on_id: profile.id, interested_id: interested_id})}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={IsInterested ? "#ff4081" : "none"} stroke="#ff4081">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2"/>
            </svg>
          </button>
          <button 
            className="mobile-action-btn mobile-profile-btn"
            onClick={() => navigate(`/details/${profile.id}`)}
          >
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="#ff4081">
              <path d="M6.59961 2.60039C6.09128 2.60039 5.62253 2.72539 5.19336 2.97539C4.76419 3.22539 4.42461 3.56497 4.17461 3.99414C3.92461 4.42331 3.79961 4.89206 3.79961 5.40039C3.79961 5.87539 3.91003 6.31706 4.13086 6.72539C4.35169 7.13372 4.65378 7.46706 5.03711 7.72539C4.56211 7.93372 4.13919 8.22122 3.76836 8.58789C3.39753 8.95456 3.11211 9.37539 2.91211 9.85039C2.70378 10.3421 2.59961 10.8587 2.59961 11.4004H3.39961C3.39961 10.8171 3.54336 10.2816 3.83086 9.79414C4.11836 9.30664 4.50586 8.91914 4.99336 8.63164C5.48086 8.34414 6.01628 8.20039 6.59961 8.20039C7.18294 8.20039 7.71836 8.34414 8.20586 8.63164C8.69336 8.91914 9.08086 9.30664 9.36836 9.79414C9.65586 10.2816 9.79961 10.8171 9.79961 11.4004H10.5996C10.5996 10.8587 10.4954 10.3421 10.2871 9.85039C10.0871 9.37539 9.80169 8.95456 9.43086 8.58789C9.06003 8.22122 8.63711 7.93372 8.16211 7.72539C8.54544 7.46706 8.84753 7.13372 9.06836 6.72539C9.28919 6.31706 9.39961 5.87539 9.39961 5.40039C9.39961 4.89206 9.27461 4.42331 9.02461 3.99414C8.77461 3.56497 8.43503 3.22539 8.00586 2.97539C7.57669 2.72539 7.10794 2.60039 6.59961 2.60039ZM6.59961 3.40039C6.96628 3.40039 7.30169 3.48997 7.60586 3.66914C7.91003 3.84831 8.15169 4.08997 8.33086 4.39414C8.51003 4.69831 8.59961 5.03372 8.59961 5.40039C8.59961 5.76706 8.51003 6.10247 8.33086 6.40664C8.15169 6.71081 7.91003 6.95247 7.60586 7.13164C7.30169 7.31081 6.96628 7.40039 6.59961 7.40039C6.23294 7.40039 5.89753 7.31081 5.59336 7.13164C5.28919 6.95247 5.04753 6.71081 4.86836 6.40664C4.68919 6.10247 4.59961 5.76706 4.59961 5.40039C4.59961 5.03372 4.68919 4.69831 4.86836 4.39414C5.04753 4.08997 5.28919 3.84831 5.59336 3.66914C5.89753 3.48997 6.23294 3.40039 6.59961 3.40039Z" fill="#6D6E6F" strokeWidth="0.5"/>
            </svg>
          </button>
          <button 
            className="mobile-action-btn mobile-message-btn"
            onClick={() => navigate(`/${userId}/inbox/`, { state: { openUserId: profile.id } })}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff4081">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileProfileCard;
