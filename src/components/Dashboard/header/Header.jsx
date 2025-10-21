import React, { useState, useEffect, useRef } from "react";
import "./header.css";
import bell from "../../../images/bell.svg";
import time from "../../../images/time.svg";
import grayHeart from "../../../images/grayHeart.svg";
import hamburger from "../../../images/grayHamburger.svg";
import eye from "../../../images/eye.svg";
import people from "../../../images/userGray.svg";
import notAllowed from "../../../images/notAllowed2.svg";
import multiPeople from "../../../images/multiPeople.svg";
import grayEnv from "../../../images/envol.svg";
import men from "../../../images/men4.jpg";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  fetchDataObjectV2,
  fetchDataV2,
  fetchDataWithTokenV2,
  ReturnPutResponseFormdataWithoutToken,
} from "../../../apiUtils";
import {
  FiSettings,
  FiKey,
  FiEdit,
  FiUserMinus,
  FiUserPlus,
  FiUsers,
  FiTrash2,
  FiLogOut,
  FiChevronDown,
  FiUser,
  FiHome,
} from "react-icons/fi";

let notificationCount = 0;

const NotificationDropdown = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [useError, setError] = useState(false);
  const [useLoading, setLoading] = useState(false);
  const [userId] = useState(localStorage.getItem("userId"));
  const { id } = useParams();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [notificationsSingle, setNotificationsSingle] = useState([]);
  // Function to handle delete action
  notificationCount = notifications.length;
  useEffect(() => {
    if (userId) {
      const parameter = {
        url: `/api/notification/?action_on_id=${userId}`,
        setterFunction: setNotifications,
        setLoading: setLoading,
        setErrors: setError,
      };
      fetchDataWithTokenV2(parameter);
    }
  }, [userId]);
  const handleToggleButtons = (index, event) => {
    event.stopPropagation(); // Stop event propagation
    setSelectedNotification(selectedNotification === index ? null : index);
  };

  const handleAccept = (id) => {
    const formData = new FormData();
    // formData.append('upload_photo', image);
    formData.append("status", "Accepted");
    const parameter = {
      url: `/api/recieved/${id}/status/`,
      formData: formData,
      setterFunction: setNotificationsSingle,
      setLoading: setLoading,
      setErrors: setError,
    };

    ReturnPutResponseFormdataWithoutToken(parameter);
    console.log(`Accepted notification with id: ${id}`);
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const handleReject = (id) => {
    const formData = new FormData();
    // formData.append('upload_photo', image);
    formData.append("status", "Rejected");
    const parameter = {
      url: `/api/recieved/${id}/status/`,
      setterFunction: setNotificationsSingle,
      formData: formData,
      setLoading: setLoading,
      setErrors: setError,
    };

    ReturnPutResponseFormdataWithoutToken(parameter);
    console.log(`Rejected notification with id: ${id}`);
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className="notification-dropdown">
      <div className="notification-header">
        <span>Notifications ({notifications.length})</span>
        <div className="notification-settings">
          <FiSettings size={24} />
        </div>
      </div>
      <div className="notification-list">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className="notification-item"
            onClick={(event) => handleToggleButtons(index, event)}
          >
            <div className="notification-content-wrapper">
              <img
                src="https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  marginRight: 10,
                }}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="notification-content">
                <strong>{notification?.action_by_id?.name || "-"}</strong>
                <span>{notification?.message}</span>
              </div>
              <span className="notification-time">
                {notification?.created_at || "-"}
              </span>
            </div>

            {selectedNotification === index && (
              <div className="notification-actions">
                <button
                  className="reject-btn"
                  onClick={() => handleReject(notification.id)}
                >
                  Reject
                </button>

                <button
                  className="accept-btn"
                  onClick={() => handleAccept(notification.id)}
                >
                  Accept
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="notification-footer">
        <Link to="/notifications">View All Notifications</Link>
      </div>
    </div>
  );
};

const Header = ({ subNavActive, apiData: propApiData, members }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const notificationsRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [apiData, setApiData] = useState(propApiData || {});
  const [agentProfilePhoto, setAgentProfilePhoto] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setErrors] = useState("");
  const [role] = useState(localStorage.getItem("role"));
  const [token] = useState(localStorage.getItem("token"));

  // Toggle Dropdown
  const toggleUserDropdown = (event) => {
    event.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
    console.log("Dropdown Clicked!", isDropdownOpen); // Debugging
  };

  const toggleSettingsDropdown = (event) => {
    event.stopPropagation();
    setIsSettingsDropdownOpen((prev) => !prev);
  };

  const toggleMemberDropdown = (event) => {
    event.stopPropagation();
    setIsMemberDropdownOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const parameter8 = {
      url:  role  === "agent"
          ? `/api/agent/`
          : `/api/user/${userId}/`,
      setterFunction: (data) => {
        if (role === "agent") {
          // For agents, this is the agent profile data
          console.log("Agent profile data:", data);
          console.log("Agent profile data type:", typeof data, "Is array:", Array.isArray(data));
          
          // According to API docs, GET /api/agent/ returns current authenticated agent as single object
          if (data && typeof data === 'object' && !Array.isArray(data)) {
            // Single object response - this is the expected format
            console.log("Setting agent profile (single object):", data);
            console.log("Agent first_name:", data.first_name);
            console.log("Agent last_name:", data.last_name);
            console.log("Agent name:", data.name);
            setApiData(data);
          } else if (Array.isArray(data) && data.length > 0) {
            // Fallback: if it's an array, get the first item or find by ID
            const agentData = data.find(agent => agent.id == userId) || data[0];
            console.log("Setting agent profile (from array):", agentData);
            setApiData(agentData);
          } else {
            console.log("No agent profile data found");
            setApiData({});
          }
        } else {
          // For regular users
          setApiData(data);
        }
      },
      setErrors: setErrors,
      setLoading: setLoading,
    };
    fetchDataWithTokenV2(parameter8);

    // Fetch user profile photo separately
    const parameterPhoto = {
      url: `/api/user/profile_photo/?user_id=${userId}`,
      setterFunction: (data) => {
        console.log("Profile photo data:", data);
        console.log("Data type:", typeof data, "Is array:", Array.isArray(data));
        if (Array.isArray(data) && data.length > 0) {
          console.log("Setting user_profilephoto:", data[data.length - 1]);
          setApiData(prev => ({
            ...prev,
            user_profilephoto: data[data.length - 1] // Get the latest photo
          }));
        } else if (data && typeof data === 'object' && !Array.isArray(data)) {
          console.log("Setting user_profilephoto (object):", data);
          setApiData(prev => ({
            ...prev,
            user_profilephoto: data
          }));
        } else {
          console.log("No photo data found or unexpected format:", data);
          setApiData(prev => ({ ...prev, user_profilephoto: null }));
        }
      },
      setErrors: setErrors,
      setLoading: setLoading,
    };
    fetchDataV2(parameterPhoto);

    // Fetch agent profile photo if user is an agent
    if (role === "agent") {
      // Try the specific agent photo endpoint first
      const agentPhotoParam = {
        url: `/api/agent/profile_photo/?agent_id=${userId}`,
        setterFunction: (data) => {
          console.log("Agent profile photo data (specific):", data);
          console.log("Agent photo data type:", typeof data, "Is array:", Array.isArray(data));
          if (Array.isArray(data) && data.length > 0) {
            // Find the photo for the current agent
            const currentAgentPhoto = data.find(photo => photo.agent?.id == userId);
            if (currentAgentPhoto) {
              console.log("Setting agentProfilePhoto:", currentAgentPhoto);
              setAgentProfilePhoto(currentAgentPhoto);
            } else {
              console.log("No photo found for current agent, trying fallback");
              // Try fallback endpoint
              fetchAgentPhotoFallback();
            }
          } else if (data && typeof data === 'object' && !Array.isArray(data)) {
            // Single object response
            console.log("Setting agentProfilePhoto (object):", data);
            setAgentProfilePhoto(data);
          } else {
            console.log("No agent photo data found, trying fallback");
            // Try fallback endpoint
            fetchAgentPhotoFallback();
          }
        },
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataWithTokenV2(agentPhotoParam);
      
      // Fallback function to try general agent photo endpoint
      const fetchAgentPhotoFallback = () => {
        const fallbackParam = {
          url: `/api/agent/profile_photo/`,
          setterFunction: (data) => {
            console.log("Agent profile photo data (fallback):", data);
            if (Array.isArray(data) && data.length > 0) {
              const currentAgentPhoto = data.find(photo => photo.agent?.id == userId);
              if (currentAgentPhoto) {
                console.log("Setting agentProfilePhoto (fallback):", currentAgentPhoto);
                setAgentProfilePhoto(currentAgentPhoto);
              } else {
                console.log("No photo found in fallback either");
                setAgentProfilePhoto(null);
              }
            } else {
              console.log("No fallback photo data found");
              setAgentProfilePhoto(null);
            }
          },
          setErrors: setErrors,
          setLoading: setLoading,
        };
        fetchDataWithTokenV2(fallbackParam);
      };
    }

    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        console.log("Clicked outside dropdown"); // Debugging
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const user = {
    name: localStorage.getItem("name"),
    avatar: "https://placehold.co/30x30",
  };
  const navigate = useNavigate();
  const [activeSubNav, setActiveSubNav] = useState(subNavActive);
  const [userId] = useState(localStorage.getItem("userId"));
  const handleSubNavClick = (item) => {
    setActiveSubNav(item);
    navigate(item);
  };

  const handleSubNavClickLogout = (item) => {
    console.log(item);

    if (localStorage?.getItem("userId")) {
      localStorage.removeItem("userId");
    }
    if (localStorage?.getItem("token")) {
      localStorage.removeItem("token");
    }

    setActiveSubNav(item);
    navigate(item);
  };

  const [deleteAccountPopup, setDeleteAccountPopup] = useState(false);

  const handleDeleteAccount = async (userId) => {
    console.log("UserId:", userId);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/${userId}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete user. Status: ${response.status}`);
      }
      console.log(`User ${userId} deactivated successfully.`);
      navigate("/login");
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };

  return (
    <>
      {deleteAccountPopup && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <p className="text-lg font-medium text-gray-800 mb-4">
              Do you want to delete this account?
            </p>
            <div className="flex justify-start gap-4">
              <button
                onClick={() => handleDeleteAccount(userId)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteAccountPopup(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="main-header">
        <div className="top-bar">
          <div
          >
          </div>
          <div className="top-right">
            <div ></div>
            <div className="user-section">
              <div className="notifications">
                <div
                  className={`notifications ${
                    showNotifications ? "notification-open" : ""
                  }`}
                  onClick={() => setShowNotifications(!showNotifications)}
                  aria-expanded={showNotifications}
                  aria-haspopup="true"
                  ref={notificationsRef}
                >
                  <span className="notification-badge">
                    {notificationCount}
                  </span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.73 21a2 2 0 0 1-3.46 0"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {showNotifications && <NotificationDropdown />}
                </div>
                {/* <span
                  style={{ fontSize: "1.2rem", cursor: "pointer" }}
                  onClick={() => navigate("/inbox")}
                >
                  ✉️
                </span> */}
              </div>
{token && userId && (
              <div
                className="user-profile"
                onClick={toggleUserDropdown}
                ref={dropdownRef}
                style={{ position: "relative", cursor: "pointer" }}
              >
                {console.log("=== HEADER DEBUG ===")}
                {console.log("Role:", role)}
                {console.log("userId:", userId)}
                {console.log("apiData:", apiData)}
                {console.log("apiData.first_name:", apiData?.first_name)}
                {console.log("apiData.last_name:", apiData?.last_name)}
                {console.log("apiData.name:", apiData?.name)}
                {console.log("agentProfilePhoto:", agentProfilePhoto)}
                {console.log("profile_photo:", apiData?.profile_photo)}
                {console.log("upload_photo:", apiData?.profile_photo?.upload_photo)}
                {console.log("user_profilephoto:", apiData?.user_profilephoto)}
                {console.log("=== END HEADER DEBUG ===")}
                <img
                  src={
                    (() => {
                      // For agents, prioritize agent_profilephoto
                      if (role === "agent") {
                        const agentPhotoUrl = agentProfilePhoto?.upload_photo;
                        console.log("Agent photo URL found:", agentPhotoUrl);
                        
                        if (agentPhotoUrl) {
                          const fullUrl = agentPhotoUrl.startsWith('http') 
                            ? agentPhotoUrl 
                            : `${process.env.REACT_APP_API_URL}${agentPhotoUrl}`;
                          console.log("Agent full URL constructed:", fullUrl);
                          return fullUrl;
                        }
                        
                        // For agents, use SVG placeholder if no agent photo uploaded
                        console.log("No agent photo found, using SVG placeholder");
                        return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNGMTI1N0YiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDNy41ODE3MiAxNCA0IDE3LjU4MTcgNCAyMkgxMkMxNi40MTgzIDE0IDEyIDE0IDEyIDE0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo=";
                      }
                      
                      // For regular users, use regular user photo sources
                      const photoUrl = apiData?.profile_photo || apiData?.user_profilephoto?.upload_photo;
                      
                      if (photoUrl) {
                        const fullUrl = photoUrl.startsWith('http') 
                          ? photoUrl 
                          : `${process.env.REACT_APP_API_URL}${photoUrl}`;
                        return fullUrl;
                      }
                      
                      // Fallback for regular users
                      return `data:image/svg+xml;utf8,${encodeURIComponent(
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
                      )}`;
                    })()
                  }
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover border-2 border-white"
                  onError={(e) => {
                    console.log("Image failed to load, using fallback");
                    if (role === "agent") {
                      e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNGMTI1N0YiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDNy41ODE3MiAxNCA0IDE3LjU4MTcgNCAyMkgxMkMxNi40MTgzIDE0IDEyIDE0IDEyIDE0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo=";
                    } else {
                      e.target.src = "https://w7.pngwing.com/pngs/832/40/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png";
                    }
                  }}
                />
                <div className="user_role_info">
                  <span className="username">
                    {role === "agent" 
                      ? (() => {
                          const firstName = apiData?.first_name || "";
                          const lastName = apiData?.last_name || "";
                          const fullName = `${firstName} ${lastName}`.trim();
                          const name = apiData?.name || "";
                          const localStorageName = localStorage.getItem("name") || "";
                          
                          console.log("Name resolution for agent:");
                          console.log("firstName:", firstName);
                          console.log("lastName:", lastName);
                          console.log("fullName:", fullName);
                          console.log("name:", name);
                          console.log("localStorageName:", localStorageName);
                          
                          return fullName || name || localStorageName || "Agent";
                        })()
                      : apiData?.name || localStorage.getItem("name") || "User"
                    }
                  </span>
                  <span className="user-role">
                    {role === "agent" ? "Agent" : "User"}
                  </span>
                </div>
                <span
                  className="arrow"
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                  onClick={toggleUserDropdown}
                >
                  &#9660;
                </span>
                {isDropdownOpen && token && userId && (
                  <div
                    className="dropdown-content"
                    style={{
                      position: "absolute",
                      top: "120%",
                      right: "0",
                      backgroundColor: "#fff",
                      boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    <div
                      className="dropdown-item"
                      style={{ display: "flex", alignItems: "center" }}
                      onClick={() => navigate(`/myprofile/${userId}`)}
                    >
                      <FiUser
                        style={{ marginRight: "12px", fontSize: "16px" }}
                      />
                      My Profile
                    </div>
                    <div
                      className="dropdown-item"
                      style={{ display: "flex", alignItems: "center" }}
                      onClick={() => navigate(`/user-dashboard/`)}
                    >
                      <FiHome
                        style={{ marginRight: "12px", fontSize: "16px" }}
                      />
                      Dashboard
                    </div>

                    {/* <div
                      className="dropdown-item"
                      style={{ display: "flex", alignItems: "center" }}
                      onClick={toggleSettingsDropdown}
                    >
                      <FiSettings
                        style={{ marginRight: "12px", fontSize: "16px" }}
                      />
                      Settings <FiChevronDown style={{ fontSize: "14px" }} />
                    </div> */}

                    {/* {isSettingsDropdownOpen && (
                      <div
                        className="settings-dropdown"
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: "0",
                          backgroundColor: "#fff",
                          padding: "10px",
                          boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                          borderRadius: "5px",
                        }}
                      >
                        <div
                          className="dropdown-item"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 0",
                          }}
                          onClick={() => navigate(`/${userId}/changepassword`)}
                        >
                          <FiKey
                            style={{ marginRight: "12px", fontSize: "16px" }}
                          />
                          <span>Change Password</span>
                        </div>
                        <div
                          className="dropdown-item"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 0",
                          }}
                          onClick={() => navigate(`/manageprofile/${userId}`)}
                        >
                          <FiEdit
                            style={{ marginRight: "12px", fontSize: "16px" }}
                          />
                          <span>Manage Profile</span>
                        </div>
                        <div
                          className="dropdown-item"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 0",
                          }}
                        >
                          <FiUserMinus
                            style={{ marginRight: "12px", fontSize: "16px" }}
                          />
                          <span>Deactivate Account</span>
                        </div>
                        <div
                          className="dropdown-item"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 0",
                          }}
                          onClick={() => setDeleteAccountPopup(true)}
                        >
                          <FiTrash2
                            style={{ marginRight: "12px", fontSize: "16px" }}
                          />
                          <span>Delete Account</span>
                        </div>
                      </div>
                    )} */}
                    <div
                      className="dropdown-item"
                      style={{ display: "flex", alignItems: "center" }}
                      onClick={() => handleSubNavClickLogout("/login")}
                    >
                      <FiLogOut
                        style={{ marginRight: "12px", fontSize: "16px" }}
                      />
                      Logout
                    </div>
                  </div>
                )}
              </div>
              )}
            </div>
          </div>
        </div>
        <div className="nav-event">
          <nav className={`main-nav ${window.location.pathname === '/contact-us' ? 'contact-nav' : 'dashboard-nav'}`}>
            {/* Logo - Left Side */}
            <div className="logo flex-shrink-0" style={{ marginLeft: "1rem" }}>
              <img
                href="/"
                src="/images/MM LOGO.png"
                style={{ height: "3rem", width: "auto" }}
                alt="MM Logo"
                className="logo-img"
              />
            </div>
            
            {/* Desktop Navigation - Hidden on Mobile */}
            <div className="nav-links hidden lg:flex">
              <a href="/newdashboard" className="active">
                HOME
              </a>
              {/* <a href="/my-memberss" style={{display:role === "individual"? "none ":""}}>MEMBERS</a> */}
              {/* <a href="/guidance">GUIDANCE</a> */}
              <a href="/contact-us">CONTACT US</a>
            </div>

            {/* Mobile Hamburger Button - Right Side */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden flex flex-col items-center justify-center w-10 h-10 space-y-1.5 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 ml-auto"
              aria-label="Toggle mobile menu"
            >
              <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}></span>
              <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-0' : ''
              }`}></span>
              <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}></span>
            </button>
          </nav>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
          )}

          {/* Mobile Navigation Menu */}
          <div className={`lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <img
                    src="/images/MM LOGO.png"
                    style={{ height: "3rem", width: "auto" }}
                    alt="MM Logo"
                    className="logo-img"
                  />
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Menu Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Main Navigation */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Main Menu</h3>
                    <div className="space-y-2">
                      <a 
                        href="/newdashboard" 
                        className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-[#FFC0E3] hover:to-[#FFA4D6] hover:text-[#CB3B8B] transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        HOME
                      </a>
                      <a 
                        href="/my-memberss" 
                        className={`flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-[#FFC0E3] hover:to-[#FFA4D6] hover:text-[#CB3B8B] transition-all duration-200 ${role === "individual" ? "hidden" : ""}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        MEMBERS
                      </a>
                      <a 
                        href="/guidance" 
                        className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-[#FFC0E3] hover:to-[#FFA4D6] hover:text-[#CB3B8B] transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        GUIDANCE
                      </a>
                      <a 
                        href="#" 
                        className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-[#FFC0E3] hover:to-[#FFA4D6] hover:text-[#CB3B8B] transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        CONTACT US
                      </a>
                    </div>
                  </div>

                  {/* Sub Navigation */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Access</h3>
                    <div className="space-y-2">
                      <a 
                        href="user-dashboard"
                        className={`flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-[#FFC0E3] hover:to-[#FFA4D6] hover:text-[#CB3B8B] transition-all duration-200 ${
                          activeSubNav === "user-dashboard" ? "bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] text-[#CB3B8B]" : ""
                        }`}
                        onClick={() => {
                          handleSubNavClick("/user-dashboard");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <img src={time} alt="" className="w-5 h-5 mr-3" />
                        Dashboard
                      </a>
                      <a 
                        href={`/myprofile/${userId}`}
                        className={`flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-[#FFC0E3] hover:to-[#FFA4D6] hover:text-[#CB3B8B] transition-all duration-200 ${
                          activeSubNav === "My Profile" ? "bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] text-[#CB3B8B]" : ""
                        }`}
                        onClick={() => {
                          handleSubNavClick("/newdashboard");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <img src={people} alt="" className="w-5 h-5 mr-3" />
                        My Profile
                      </a>
                      <a 
                        href="#"
                        className={`flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-[#FFC0E3] hover:to-[#FFA4D6] hover:text-[#CB3B8B] transition-all duration-200 ${
                          activeSubNav === "Shortlist" ? "bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] text-[#CB3B8B]" : ""
                        }`}
                        onClick={() => {
                          handleSubNavClick("/total-shortlist");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <img src={hamburger} alt="" className="w-5 h-5 mr-3" />
                        Shortlist
                      </a>
                      {role != "agent" && (
                        <>
                          <a 
                            href="#"
                            className={`flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-[#FFC0E3] hover:to-[#FFA4D6] hover:text-[#CB3B8B] transition-all duration-200 ${
                              activeSubNav === "myInterest" ? "bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] text-[#CB3B8B]" : ""
                            }`}
                            onClick={() => {
                              handleSubNavClick("/total-interest");
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <img src={grayHeart} alt="" className="w-5 h-5 mr-3" />
                            My Interest
                          </a>
                          <a 
                            href="#"
                            className={`flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-[#FFC0E3] hover:to-[#FFA4D6] hover:text-[#CB3B8B] transition-all duration-200 ${
                              activeSubNav === "Messaging" ? "bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] text-[#CB3B8B]" : ""
                            }`}
                            onClick={() => {
                              handleSubNavClick("/${userId}/inbox");
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <img src={grayEnv} alt="" className="w-5 h-5 mr-3" />
                            Messaging
                          </a>
                          <a 
                            href="#"
                            className={`flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-[#FFC0E3] hover:to-[#FFA4D6] hover:text-[#CB3B8B] transition-all duration-200 ${
                              activeSubNav === "Ignored User List" ? "bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] text-[#CB3B8B]" : ""
                            }`}
                            onClick={() => {
                              handleSubNavClick("/total-ignored");
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <img src={notAllowed} alt="" className="w-5 h-5 mr-3" />
                            Ignored User List
                          </a>
                          <a 
                            href="#"
                            className={`flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gradient-to-r hover:from-[#FFC0E3] hover:to-[#FFA4D6] hover:text-[#CB3B8B] transition-all duration-200 ${
                              activeSubNav === "Matched profile" ? "bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] text-[#CB3B8B]" : ""
                            }`}
                            onClick={() => {
                              handleSubNavClick("/matches");
                              setIsMobileMenuOpen(false);
                            }}
                          >
                            <img src={multiPeople} alt="" className="w-5 h-5 mr-3" />
                            Matched profile
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* User Profile Section */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Profile</h3>
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] rounded-lg">
                      <img
                        src={
                          (() => {
                            // For agents, prioritize agent_profilephoto
                            if (role === "agent") {
                              const agentPhotoUrl = agentProfilePhoto?.upload_photo;
                              
                              if (agentPhotoUrl) {
                                const fullUrl = agentPhotoUrl.startsWith('http') 
                                  ? agentPhotoUrl 
                                  : `${process.env.REACT_APP_API_URL}${agentPhotoUrl}`;
                                return fullUrl;
                              }
                              
                              // For agents, use SVG placeholder if no agent photo uploaded
                              return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNGMTI1N0YiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDNy41ODE3MiAxNCA0IDE3LjU4MTcgNCAyMkgxMkMxNi40MTgzIDE0IDEyIDE0IDEyIDE0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo=";
                            }
                            
                            // For regular users, use regular user photo sources
                            const photoUrl = apiData?.profile_photo || apiData?.user_profilephoto?.upload_photo;
                            
                            if (photoUrl) {
                              const fullUrl = photoUrl.startsWith('http') 
                                ? photoUrl 
                                : `${process.env.REACT_APP_API_URL}${photoUrl}`;
                              return fullUrl;
                            }
                            
                            // Fallback for regular users
                            return `data:image/svg+xml;utf8,${encodeURIComponent(
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
                            )}`;
                          })()
                        }
                        alt="User"
                        className="w-12 h-12 rounded-full border-2 border-white object-cover"
                      />
                      <div>
                        <p className="font-semibold text-[#CB3B8B]">
                          {role === "agent" 
                            ? (() => {
                                const firstName = apiData?.first_name || "";
                                const lastName = apiData?.last_name || "";
                                const fullName = `${firstName} ${lastName}`.trim();
                                const name = apiData?.name || "";
                                const localStorageName = localStorage.getItem("name") || "";
                                
                                return fullName || name || localStorageName || "Agent";
                              })()
                            : apiData?.name || localStorage.getItem("name") || "User"
                          }
                        </p>
                        <p className="text-sm text-gray-600">{role === "agent" ? "Agent" : "User"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Sub Navigation */}
          <div className="sub-nav hidden lg:flex">
            <a
              href="user-dashboard"
              className={
                activeSubNav === "user-dashboard" ? "activeSubNav" : ""
              }
              onClick={() => handleSubNavClick("/user-dashboard")}
            >
              <i className="icon">
                <img src={time} alt="" />
              </i>{" "}
              Dashboard
            </a>
            <a
              href={`/my-memberss/${userId}`}
              className={activeSubNav === "My Members" ? "activeSubNav" : ""}
              onClick={() => handleSubNavClick("/my-memberss")}
            >
              <i className="icon">
                <img src={people} alt="" />
              </i>{" "}
              My Members
            </a>
            <a
              href="#"
              className={activeSubNav === "Shortlist" ? "activeSubNav" : ""}
              onClick={() => handleSubNavClick("/total-shortlist")}
            >
              <i className="icon">
                <img src={hamburger} alt="" />
              </i>{" "}
              Shortlist
            </a>
            {role != "agent" && (
              <>
                <a
                  href="#"
                  className={
                    activeSubNav === "myInterest" ? "activeSubNav" : ""
                  }
                  onClick={() => handleSubNavClick("/total-interest")}
                >
                  <i className="icon">
                    <img src={grayHeart} alt="" />
                  </i>{" "}
                  My Interest
                </a>

                <a
                  href="#"
                  className={activeSubNav === "Messaging" ? "activeSubNav" : ""}
                  onClick={() => handleSubNavClick("/${userId}/inbox")}
                >
                  <i className="icon">
                    <img src={grayEnv} alt="" />
                  </i>{" "}
                  Messaging
                </a>
                <a
                  href="#"
                  className={
                    activeSubNav === "Ignored User List" ? "activeSubNav" : ""
                  }
                  onClick={() => handleSubNavClick("/total-ignored")}
                >
                  <i className="icon">
                    <img src={notAllowed} alt="" />
                  </i>{" "}
                  Ignored User List
                </a>
                <a
                  href="#"
                  className={
                    activeSubNav === "Matched profile" ? "activeSubNav" : ""
                  }
                  onClick={() => handleSubNavClick("/matches")}
                >
                  <i className="icon">
                    <img src={multiPeople} alt="" />
                  </i>{" "}
                  Matched profile
                </a>
              </>
            )}
          </div>

          {/* Mobile Sub Navigation - Add to Mobile Menu */}
          <div className="lg:hidden">
            {/* Mobile Sub Navigation will be added to the mobile menu content */}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

// import React, { useState } from 'react';
// import './header.css';
// import logo from "../../../images/logo.png";
// import bell from "../../../images/bell.svg";
// import time from "../../../images/time.svg";
// import grayHeart from "../../../images/grayHeart.svg";
// import hamburger from "../../../images/grayHamburger.svg";
// import eye from "../../../images/eye.svg";
// import people from "../../../images/userGray.svg";
// import notAllowed from "../../../images/notAllowed2.svg";
// import multiPeople from "../../../images/multiPeople.svg";
// import grayEnv from "../../../images/envol.svg";
// import men from "../../../images/men4.jpg";
// import { useNavigate } from 'react-router-dom';

// const Header = ({subNavActive,apiData}) => {
//   const user = {
//     name:  localStorage.getItem("name"),
//     avatar: 'https://placehold.co/30x30',
//   };
// const navigate = useNavigate()
//   const [activeSubNav, setActiveSubNav] = useState(subNavActive);
//   const [userId] = useState(localStorage.getItem("userId"));
//   const handleSubNavClick = (item) => {
//     setActiveSubNav(item);
//     navigate(item)
//   };
//   const handleSubNavClickLogout = (item) => {
//     localStorage.removeItem("userId")
//     localStorage.removeItem("token")
//     setActiveSubNav(item);
//     navigate(item)
//   };

//   return (
//     <header className="main-header">
//       <div className="top-bar">
//         <div className="welcome-text" style={{ color: "gray", fontSize: "0.8rem" }}>
//           Welcome to Active Mehram Match
//         </div>
//         <div className="top-right">
//           <div className="help-line">Help Line +01 112 352 666</div>
//           <div className="user-section">
//             <div className="notifications">
//               <span className="notification-icon">🔔</span>
//               <span className="mail-icon">✉️</span>
//             </div>
//             <div className="user-profile">

//               <img  src={apiData?.profile_photo?`${'https://mehram-match.onrender.com'}${apiData?.profile_photo}` : men} alt="Profile" className="profile-pic" />
//               <span>Hi, {user.name}</span>
//             </div>
//             <button className="logout-btn"  onClick={() => handleSubNavClickLogout('/login')}>Logout</button>
//           </div>
//         </div>
//       </div>

//       <nav className="main-nav">
//         <div className="logo" >
//           <img href="/" src={logo} style={{ width: "12rem" , height:"3rem" }} alt="Mehram Match" className="logo-img" />
//         </div>
//         <div className="nav-links">
//           <a href="/newdashboard" className="active">HOME</a>
//           <a href="#">MEMBERS</a>
//           <a href="#">PREMIUM PLANS</a>
//           <a href="#">GUIDANCE</a>
//           <a href="#">CONTACT US</a>
//         </div>
//       </nav>

//       <div className="sub-nav">
//         <a
//           href="user-dashboard"
//           className={activeSubNav === 'user-dashboard' ? 'activeSubNav' : ''}
//           onClick={() => handleSubNavClick('/user-dashboard')}
//         >
//           <i className="icon"><img src={time} alt="" /></i> Dashboard
//         </a>
//         <a
//           href={`/details/${userId}`}
//           className={activeSubNav === 'My Profile' ? 'activeSubNav' : ''}
//           onClick={() => handleSubNavClick('/newdashboard')}
//         >
//           <i className="icon"><img src={people} alt="" /></i> My Profile
//         </a>
//         <a
//           href="#"
//           className={activeSubNav === 'myInterest' ? 'activeSubNav' : ''}
//           onClick={() => handleSubNavClick('/total-interest')}
//         >
//           <i className="icon"><img src={grayHeart} alt="" /></i> My Interest
//         </a>
//         <a
//           href="#"
//           className={activeSubNav === 'Shortlist' ? 'activeSubNav' : ''}
//           onClick={() => handleSubNavClick('/total-shortlist')}
//         >
//           <i className="icon"><img src={hamburger} alt="" /></i> Shortlist
//         </a>
//         <a
//           href="#"
//           className={activeSubNav === 'Messaging' ? 'activeSubNav' : ''}
//           onClick={() => handleSubNavClick('/inbox')}
//         >
//           <i className="icon"><img src={grayEnv} alt="" /></i> Messaging
//         </a>
//         <a
//           href="#"
//           className={activeSubNav === 'Ignored User List' ? 'activeSubNav' : ''}
//           onClick={() => handleSubNavClick('/total-ignored')}
//         >
//           <i className="icon"><img src={notAllowed} alt="" /></i> Ignored User List
//         </a>
//         <a
//           href="#"
//           className={activeSubNav === 'Matched profile' ? 'activeSubNav' : ''}
//           // onClick={() => handleSubNavClick('Matched profile')}
//         >
//           <i className="icon"><img src={multiPeople} alt="" /></i> Matched profile
//         </a>
//         <a
//           href="#"
//           className={activeSubNav === 'Profile Viewers' ? 'activeSubNav' : ''}
//           // onClick={() => handleSubNavClick('Profile Viewers')}
//         >
//           <i className="icon"><img src={eye} alt="" /></i> Profile Viewers
//         </a>
//       </div>
//     </header>
//   );
// };

// export default Header;
