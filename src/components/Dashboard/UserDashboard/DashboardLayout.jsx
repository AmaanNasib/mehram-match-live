import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./DashboardLayout.css";
import logo from "../../../images/newLogo.jpg";
import {
  FiSettings,
  FiKey,
  FiEdit,
  FiUserMinus,
  FiTrash2,
  FiLogOut,
  FiChevronDown,
  FiUserPlus,
  FiUser,
  FiHome,
} from "react-icons/fi";
import { FaSearch, FaBars } from "react-icons/fa"; // Import the search icon
import {
  fetchDataObjectV2,
  fetchDataWithTokenV2,
  ReturnPutResponseFormdataWithoutToken,
} from "../../../apiUtils";
import { useNavigate ,useLocation} from "react-router-dom";
import ManageProfileModal from "./ManageProfileModal.jsx"
let notificationCount = 0;

const NotificationDropdown = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [apiData, setApiData] = useState([]);
  const [useError, setError] = useState(false);
  const [useLoading, setLoading] = useState(false);
  const [userId] = useState(localStorage.getItem("userId"));
  const [notifications, setNotifications] = useState([]);
  const [notificationsSingle, setNotificationsSingle] = useState([]);
  const location = useLocation();
  
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

const DashboardLayout = ({ subNavActive, children,onAddMember, onAddBulkMember,onToggleSidebar,onViewAllMembers  }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true); // State to control sidebar visibility
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const notificationsRef = useRef(null);
  const [apiData, setApiData] = useState({});
  const [useLoading, setLoading] = useState({});
  const [useError, setErrors] = useState({});
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const location = useLocation(); // Get current location
  let route = role == "agent" ? "/total-shortlist-agent" : "/total-shortlist";
  // Helper function to determine if a nav item is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    onToggleSidebar?.(showSidebar); // call only if passed
  }, [showSidebar]);

  useEffect(() => {
  if (role === "agent") return;

  const parameter8 = {
    url:  role  === "agent"
          ? `/api/agent/${userId}/`
          : `/api/user/${userId}/`,
    setterFunction: setApiData,
    setErrors: setErrors,
    setLoading: setLoading,
  };
  fetchDataWithTokenV2(parameter8);

  const handleClickOutside = (event) => {
    if (
      notificationsRef.current &&
      !notificationsRef.current.contains(event.target)
    ) {
      setShowNotifications(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  const navigate = useNavigate();
  const [activeSubNav, setActiveSubNav] = useState(subNavActive);
  const handleSubNavClick = (item) => {
    setActiveSubNav(item);
    navigate(item);
  };
  const handleSubNavClickLogout = (item) => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setActiveSubNav(item);
    navigate(item);
  };

  const toggleLanguageDropdown = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
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

  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  

  const toggleSettingsDropdown = (event) => { 
    event.stopPropagation();
    setIsSettingsDropdownOpen((prev) => !prev);
  };

  const [isManageProfileModalOpen, setIsManageProfileModalOpen] = useState(false);

const [isMembersMenuOpen, setIsMembersMenuOpen] = useState(false);

const handleMembersClick = () => {
  setIsMembersMenuOpen((prev) => !prev);
};

  return (
    <>
      {" "}
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
      <ManageProfileModal
        isOpen={isManageProfileModalOpen}
        onClose={() => setIsManageProfileModalOpen(false)}
      />
      <div className="dashboard-layout">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            {/* Logo */}
            <Link to="/" className="logo">
              <img src={logo} alt="Mehram Match" />
            </Link>

            {/* Navbar Icon (Hamburger Menu) */}
            <div
              className="navbar-icon"
              onClick={() => setShowSidebar((prev) => !prev)}
            >
              <FaBars />
            </div>

            {/* Search Bar */}
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Search" />
            </div>
          </div>
          <div className="header-right">
            <div
              className={`notifications ${
                showNotifications ? "notification-open" : ""
              }`}
              onClick={() => setShowNotifications(!showNotifications)}
              aria-expanded={showNotifications}
              aria-haspopup="true"
              ref={notificationsRef}
            >
              <span className="notification-badge">{notificationCount}</span>
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
            <div className="language-select" onClick={toggleLanguageDropdown}>
              <img
                src="https://cdn.vectorstock.com/i/500p/07/62/australia-flag-blowig-in-the-wind-vector-22440762.jpg"
                alt="User"
              />
              <span>English</span>
              <FiChevronDown style={{ fontSize: "14px" }} />
              {showLanguageDropdown && (
                <div className="dropdown-content">
                  <div className="dropdown-item">English</div>
                  <div className="dropdown-item">Spanish</div>
                  <div className="dropdown-item">French</div>
                </div>
              )}
            </div>

            <div className="user-profile" onClick={toggleUserDropdown}>
              {console.log(
                `${"https://mehram-match.onrender.com"}${
                  apiData?.profile_photo
                }`
              )}
              {console.log("Test gen:", apiData?.gender)}
              <img
                src={
                  apiData.profile_photo
                    ? apiData.profile_photo.upload_photo
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
                alt="User"
              />
              <div className="user_role_info">
                <span className="username">{apiData?.name}</span>
                <span className="user-role">
                  {role === "agent" ? "Agent" : "User"}
                </span>
              </div>
              <FiChevronDown style={{ fontSize: "14px" }} />
              {showUserDropdown && (
                <div className="dropdown-content">
                  <div
                    className="dropdown-item"
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={() => navigate(`/myprofile/${userId}`)}
                  >
                    <FiUser style={{ marginRight: "12px", fontSize: "16px" }} />
                    My Profile
                  </div>
                  <div
                    className="dropdown-item"
                    style={{ display: "flex", alignItems: "center" }}
                    onClick={() => navigate(`/user-dashboard/`)}
                  >
                    <FiHome style={{ marginRight: "12px", fontSize: "16px" }} />
                    Dashboard
                  </div>

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
          </div>
        </header>

        <div className="dashboard-content">
          {/* Sidebar */}
          <aside className={`dashboard-sidebar ${showSidebar ? "open" : ""}`}>
            <nav>
              <Link
                to="/user-dashboard"
                className={`nav-item ${
                  isActive("/user-dashboard") ? "active" : ""
                }`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect
                    x="3"
                    y="3"
                    width="7"
                    height="7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="14"
                    y="3"
                    width="7"
                    height="7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="14"
                    y="14"
                    width="7"
                    height="7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="3"
                    y="14"
                    width="7"
                    height="7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Dashboard
              </Link>

              {role === "agent" && (
                <>
                  <div
                    className={`nav-item ${
                      isActive("/my-memberss") ? "active" : ""
                    }`}
                    onClick={handleMembersClick}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                          strokeWidth="2"
                        />
                      </svg>
                      Members
                    </div>


                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      style={{
                        transition: "transform 0.3s ease",
                        transform: isMembersMenuOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    >
                      <polyline points="6 8 10 12 14 8" strokeWidth="2" />
                    </svg>
                  </div>

                  {/* Slide-down submenu */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isMembersMenuOpen
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                    style={{ paddingLeft: "2rem" }}
                  >
                    <div
                      className="nav-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => 
                        navigate("/my-memberss")}
                    >
                      Add Member
                    </div>
                    <div
                      className="nav-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={onAddBulkMember}
                    >
                      Add Bulk Member
                    </div>
                    <div
                      className="nav-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={onViewAllMembers}
                    >
                      View All Members
                    </div>
                  </div>
                </>
              )}

              {role === "individual" && (
                <Link
                  to="/total-interaction"
                  className={`nav-item ${
                    isActive("/total-interaction") ? "active" : ""
                  }`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                      strokeWidth="2"
                    />
                  </svg>
                  Total Interaction
                </Link>
              )}

              {role === "individual" && (
                <Link
                  to="/total-interest"
                  className={`nav-item ${
                    isActive("/total-interest") ? "active" : ""
                  }`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                      strokeWidth="2"
                    />
                  </svg>
                  Total Interest
                </Link>
              )}

              {role === "individual" && (
                <Link
                  to="/total-request"
                  className={`nav-item ${
                    isActive("/total-request") ? "active" : ""
                  }`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                      strokeWidth="2"
                    />
                    <circle cx="9" cy="7" r="4" strokeWidth="2" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth="2" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" />
                  </svg>
                  Total Request
                </Link>
              )}

              {role === "individual" && (
                <Link
                  to="/total-ignored"
                  className={`nav-item ${
                    isActive("/total-ignored") ? "active" : ""
                  }`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <line
                      x1="4.93"
                      y1="4.93"
                      x2="19.07"
                      y2="19.07"
                      strokeWidth="2"
                    />
                  </svg>
                  Ignored User List
                </Link>
              )}

              {role === "individual" && (
                <Link
                  to={route}
                  className={`nav-item ${
                    isActive("/total-shortlist") ? "active" : ""
                  }`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                      strokeWidth="2"
                    />
                  </svg>
                  My Shortlist
                </Link>
              )}

              {role === "individual" && (
                <Link
                  to="/blocked-list"
                  className={`nav-item ${
                    isActive("/blocked-list") ? "active" : ""
                  }`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                      strokeWidth="2"
                    />
                  </svg>
                  Blocked User List
                </Link>
              )}

              {role === "individual" && (
                <Link
                  to={`/${userId}/inbox`}
                  className={`nav-item ${isActive("/inbox") ? "active" : ""}`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                      strokeWidth="2"
                    />
                    <polyline points="22,6 12,13 2,6" strokeWidth="2" />
                  </svg>
                  Inbox
                </Link>
              )}

              {role === "individual" && (
                <Link
                  to="/matches"
                  className={`nav-item ${isActive("/matches") ? "active" : ""}`}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                      strokeWidth="2"
                    />
                    <circle cx="9" cy="7" r="4" strokeWidth="2" />
                    <line x1="19" y1="8" x2="19" y2="14" strokeWidth="2" />
                    <line x1="22" y1="11" x2="16" y2="11" strokeWidth="2" />
                  </svg>
                  Matches
                </Link>
              )}

              <p className="pagetext">Pages</p>

              <Link to="/newdashboard" className="nav-item">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                    strokeWidth="2"
                  />
                  <polyline points="9 22 9 12 15 12 15 22" strokeWidth="2" />
                </svg>
                Home
              </Link>
              {/* <Link to="" className="nav-item">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                    strokeWidth="2"
                  />
                  <circle cx="9" cy="7" r="4" strokeWidth="2" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth="2" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" />
                </svg>
                Members
              </Link> */}
              <div
                className="nav-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "none",
                }}
                onClick={toggleSettingsDropdown}
              >
                <FiSettings style={{ fontSize: "16px" }} />
                Settings{" "}
                <FiChevronDown
                  style={{
                    marginLeft: "auto",
                    fontSize: "14px",
                    transform: isSettingsDropdownOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                />
              </div>

              {isSettingsDropdownOpen && (
                <>
                  <div
                    className="nav-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px",
                    }}
                    onClick={() => navigate(`/${userId}/changepassword`)}
                  >
                    <FiKey style={{ fontSize: "16px" }} />
                    Change Password
                  </div>
                  <div
                    className="nav-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px",
                    }}
                    onClick={() => setIsManageProfileModalOpen(true)}
                  >
                    <FiEdit style={{ fontSize: "16px" }} />
                    Manage Profile
                  </div>
                  <div
                    className="nav-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px",
                    }}
                  >
                    <FiUserMinus style={{ fontSize: "16px" }} />
                    Deactivate Account
                  </div>
                  <div
                    className="nav-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px",
                    }}
                    onClick={() => setDeleteAccountPopup(true)}
                  >
                    <FiTrash2 style={{ fontSize: "16px" }} />
                    Delete Account
                  </div>
                </>
              )}
              <Link to="" className="nav-item">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                    strokeWidth="2"
                  />
                  <path d="M12 8v4" strokeWidth="2" />
                  <path d="M12 16h.01" strokeWidth="2" />
                </svg>
                Guidance
              </Link>
              <Link to="" className="nav-item">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                    strokeWidth="2"
                  />
                </svg>
                Contact
              </Link>
              <Link to="/premium" className="nav-item">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    ry="2"
                    strokeWidth="2"
                  />
                  <path d="M12 8v8" strokeWidth="2" />
                  <path d="M8 12h8" strokeWidth="2" />
                </svg>
                Packages
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="main-content">{children}</main>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;

// import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import './DashboardLayout.css';
// import logo from '../../../images/newLogo.jpg'
// import { FiSettings } from 'react-icons/fi';
// import { FaSearch, FaBars } from "react-icons/fa"; // Import the search icon
// import { fetchDataObjectV2, fetchDataWithTokenV2, ReturnPutResponseFormdataWithoutToken } from '../../../apiUtils';

// let notificationCount = 0

// const NotificationDropdown = () => {
//   const [selectedNotification, setSelectedNotification] = useState(null);
//   const [apiData, setApiData] = useState([]);
//   const [useError, setError] = useState(false);
//   const [useLoading, setLoading] = useState(false);
//   const [userId] = useState(localStorage.getItem("userId"));
//   const [notifications, setNotifications] = useState([]);
//   const [notificationsSingle, setNotificationsSingle] = useState([]);
//   // Function to handle delete action
//   notificationCount = notifications.length
//   useEffect(() => {
//     if (userId) {
//       const parameter = {
//         url: `/api/notification/?action_on_id=${userId}`,
//         setterFunction: setNotifications,
//         setLoading: setLoading,
//         setErrors: setError,
//       };
//       fetchDataWithTokenV2(parameter);
//     }
//   }, [userId])
//   const handleToggleButtons = (index, event) => {
//     event.stopPropagation(); // Stop event propagation
//     setSelectedNotification(selectedNotification === index ? null : index);
//   };

//   const handleAccept = (id) => {
//     const formData = new FormData();
//     // formData.append('upload_photo', image);
//     formData.append('status', "Accepted");
//     const parameter = {
//       url: `/api/recieved/${id}/status/`,
//       formData: formData,
//       setterFunction: setNotificationsSingle,
//       setLoading: setLoading,
//       setErrors: setError,
//     };

//     ReturnPutResponseFormdataWithoutToken(parameter);
//     console.log(`Accepted notification with id: ${id}`);
//     setNotifications(notifications.filter(notification => notification.id !== id));
//   };

//   const handleReject = (id) => {
//     const formData = new FormData();
//     // formData.append('upload_photo', image);
//     formData.append('status', "Rejected");
//     const parameter = {
//       url: `/api/recieved/${id}/status/`,
//       setterFunction: setNotificationsSingle,
//       formData: formData,
//       setLoading: setLoading,
//       setErrors: setError,
//     };

//     ReturnPutResponseFormdataWithoutToken(parameter);
//     console.log(`Rejected notification with id: ${id}`);
//     setNotifications(notifications.filter(notification => notification.id !== id));
//   };

//   return (
//     <div className="notification-dropdown">

//       <div className="notification-header">
//         <span>Notifications ({notifications.length})</span>
//         <div className="notification-settings">
//           <FiSettings size={24} />
//         </div>
//       </div>
//       <div className="notification-list">
//         {notifications.map((notification, index) => (
//           <div
//             key={notification.id}
//             className="notification-item"
//             onClick={(event) => handleToggleButtons(index, event)}
//           >
//             <div className="notification-content-wrapper">
//               <img
//                 src="https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
//                 style={{ width: 40, height: 40, borderRadius: "50%", marginRight: 10 }}
//                 alt="Profile"
//                 className="w-10 h-10 rounded-full"
//               />
//               <div className="notification-content">
//                 <strong>{notification?.action_by_id?.name || '-'}</strong>
//                 <span>{notification?.message}</span>
//               </div>
//               <span className="notification-time">{notification?.created_at || '-'}</span>
//             </div>

//             {selectedNotification === index && (
//               <div className="notification-actions">

//                 <button
//                   className="reject-btn"
//                   onClick={() => handleReject(notification.id)}
//                 >
//                   Reject
//                 </button>

//                 <button
//                   className="accept-btn"
//                   onClick={() => handleAccept(notification.id)}
//                 >
//                   Accept
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//       <div className="notification-footer">
//         <Link to="/notifications">View All Notifications</Link>
//       </div>
//     </div>

//   );
// };

// const DashboardLayout = ({ children }) => {
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showSidebar, setShowSidebar] = useState(true); // State to control sidebar visibility
//   const notificationsRef = useRef(null);
//   const [apiData, setApiData] = useState({});
//   const [useLoading, setLoading] = useState({});
//   const [useError, setErrors] = useState({});
//   const userId = localStorage.getItem('userId');

//   useEffect(() => {
//     const parameter8 = {
//       url: `/api/user/${userId}/`,
//       setterFunction: setApiData,
//       setErrors: setErrors,
//       setLoading: setLoading,
//     };
//     fetchDataWithTokenV2(parameter8);
//     const handleClickOutside = (event) => {
//       if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
//         setShowNotifications(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };

//   }, []);
//   return (
//     <div className="dashboard-layout">
//       {/* Header */}
//       <header className="dashboard-header">
//         <div className="header-left">
//           {/* Logo */}
//           <Link to="/" className="logo">
//             <img src={logo} alt="Mehram Match" />
//           </Link>

//           {/* Navbar Icon (Hamburger Menu) */}
//           <div className="navbar-icon" onClick={() => setShowSidebar(!showSidebar)}>
//             <FaBars />
//           </div>

//           {/* Search Bar */}
//           <div className="search-bar">
//             <FaSearch className="search-icon" />
//             <input type="text" placeholder="Search" />
//           </div>
//         </div>
//         <div className="header-right">
//           <div
//             className={`notifications ${showNotifications ? "notification-open" : ""}`}
//             onClick={() => setShowNotifications(!showNotifications)}
//             aria-expanded={showNotifications}
//             aria-haspopup="true"
//             ref={notificationsRef}
//           >
//             <span className="notification-badge">{notificationCount}</span>
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//               <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//               <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//             </svg>
//             {showNotifications && <NotificationDropdown />}
//           </div>
//           <div className="language-select" onclick="toggleDropdown()">
//             <img src="https://cdn.vectorstock.com/i/500p/07/62/australia-flag-blowig-in-the-wind-vector-22440762.jpg" alt="User" />
//             <span>English</span>
//             <span className="arrow">&#9660;</span>
//             <div className="dropdown-content">
//               <div className="dropdown-item">English</div>
//               <div className="dropdown-item">Spanish</div>
//               <div className="dropdown-item">French</div>
//             </div>
//           </div>
//           {/* <div className="settings-icon">
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//               <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <circle cx="12" cy="12" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div> */}
//           <div className="user-profile" onclick="toggleUserDropdown()">
//             {console.log(`${'https://mehram-match.onrender.com'}${apiData?.profile_photo}`)}
//             <img src={apiData?.profile_photo ? `${'https://mehram-match.onrender.com'}${apiData?.profile_photo}` : "https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4866.jpg"} alt="User" />
//             <div className="user-info">
//               <span className="username">{apiData?.name}</span>
//               <span className="user-role">Admin</span>
//             </div>
//             <span className="arrow">&#9660;</span>
//             <div className="dropdown-content">
//               <div className="dropdown-item">Profile</div>
//               <div className="dropdown-item">Settings</div>
//               <div className="dropdown-item">Logout</div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="dashboard-content">
//         {/* Sidebar */}
//         <aside className={`dashboard-sidebar ${showSidebar ? 'open' : ''}`}>
//           <nav>
//             <Link to="/user-dashboard" className="nav-item active">
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                 <rect x="3" y="3" width="7" height="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                 <rect x="14" y="3" width="7" height="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                 <rect x="14" y="14" width="7" height="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//                 <rect x="3" y="14" width="7" height="7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//               </svg>
//               Dashboard
//             </Link>
//             <Link to="/total-interest" className="nav-item">
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                 <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2" />
//               </svg>
//               Total Interest
//             </Link>
//             <Link to="/total-request" className="nav-item">
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                 <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2" />
//                 <circle cx="9" cy="7" r="4" strokeWidth="2" />
//                 <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth="2" />
//                 <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" />
//               </svg>
//               Total Request
//             </Link>
//             <Link to="/total-ignored" className="nav-item">
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                 <circle cx="12" cy="12" r="10" strokeWidth="2" />
//                 <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" strokeWidth="2" />
//               </svg>
//               Ignored User List
//             </Link>
//             <Link to="/total-shortlist" className="nav-item">
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                 <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" strokeWidth="2" />
//               </svg>
//               My Shortlist
//             </Link>
//             <Link to="/blocked-list" className="nav-item">
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" />
//               </svg>
//               Blocked User List
//             </Link>
//             <Link to="/inbox" className="nav-item">
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                 <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="2" />
//                 <polyline points="22,6 12,13 2,6" strokeWidth="2" />
//               </svg>
//               Inbox
//             </Link>
//             <Link to="/matches" className="nav-item">
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                 <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeWidth="2" />
//                 <circle cx="9" cy="7" r="4" strokeWidth="2" />
//                 <line x1="19" y1="8" x2="19" y2="14" strokeWidth="2" />
//                 <line x1="22" y1="11" x2="16" y2="11" strokeWidth="2" />
//               </svg>
//               Matches
//             </Link>
//             <Link to="/change-password" className="nav-item">
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                 <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2" />
//                 <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2" />
//               </svg>
//               Change Password
//             </Link>
//             <Link to="/manage-profile" className="nav-item">
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                 <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" />
//                 <circle cx="12" cy="7" r="4" strokeWidth="2" />
//               </svg>
//               Manage Profile
//             </Link>
//             <Link to="/deactivate" className="nav-item">
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                 <path d="M18.36 6.64a9 9 0 1 1-12.73 0" strokeWidth="2" />
//                 <line x1="12" y1="2" x2="12" y2="12" strokeWidth="2" />
//               </svg>
//               Deactivate Account
//             </Link>
//             <Link to="/delete" className="nav-item">
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                 <polyline points="3 6 5 6 21 6" strokeWidth="2" />
//                 <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeWidth="2" />
//               </svg>
//               Delete Account
//             </Link>

//             <p className='pagetext'>Pages</p>

//             <Link to="/newdashboard" className="nav-item">
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                 <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeWidth="2" />
//                 <polyline points="9 22 9 12 15 12 15 22" strokeWidth="2" />
//               </svg>
//               Home
//             </Link>
//             <Link to="/members" className="nav-item">
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                 <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2" />
//                 <circle cx="9" cy="7" r="4" strokeWidth="2" />
//                 <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth="2" />
//                 <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" />
//               </svg>
//               Members
//             </Link>
//             <Link to="/guidance" className="nav-item">
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" />
//                 <path d="M12 8v4" strokeWidth="2" />
//                 <path d="M12 16h.01" strokeWidth="2" />
//               </svg>
//               Guidance
//             </Link>
//             <Link to="/contact" className="nav-item">
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                 <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeWidth="2" />
//               </svg>
//               Contact
//             </Link>
//             <Link to="/packages" className="nav-item">
//               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                 <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
//                 <path d="M12 8v8" strokeWidth="2" />
//                 <path d="M8 12h8" strokeWidth="2" />
//               </svg>
//               Packages
//             </Link>
//           </nav>
//         </aside>

//         {/* Main Content */}
//         <main className="main-content">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;
