import React, { useState, useEffect, useRef } from "react";
import "./MobileResponsiveHeader.css";
import bell from "../../../images/bell.svg";
import time from "../../../images/time.svg";
import grayHeart from "../../../images/grayHeart.svg";
import hamburger from "../../../images/grayHamburger.svg";
import eye from "../../../images/eye.svg";
import people from "../../../images/userGray.svg";
import notAllowed from "../../../images/notAllowed2.svg";
import multiPeople from "../../../images/multiPeople.svg";
import grayEnv from "../../../images/envol.svg";
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
  FiMenu,
  FiX,
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
    event.stopPropagation();
    setSelectedNotification(selectedNotification === index ? null : index);
  };

  const handleAccept = (id) => {
    const formData = new FormData();
    formData.append("status", "Accepted");
    const parameter = {
      url: `/api/recieved/${id}/status/`,
      formData: formData,
      setterFunction: setNotificationsSingle,
      setLoading: setLoading,
      setErrors: setError,
    };
    ReturnPutResponseFormdataWithoutToken(parameter);
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  const handleReject = (id) => {
    const formData = new FormData();
    formData.append("status", "Rejected");
    const parameter = {
      url: `/api/recieved/${id}/status/`,
      setterFunction: setNotificationsSingle,
      formData: formData,
      setLoading: setLoading,
      setErrors: setError,
    };
    ReturnPutResponseFormdataWithoutToken(parameter);
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  return (
    <div className="notification-dropdown-mobile">
      <div className="notification-header-mobile">
        <span>Notifications ({notifications.length})</span>
        <div className="notification-settings-mobile">
          <FiSettings size={20} />
        </div>
      </div>
      <div className="notification-list-mobile">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className="notification-item-mobile"
            onClick={(event) => handleToggleButtons(index, event)}
          >
            <div className="notification-content-wrapper-mobile">
              <img
                src="https://st3.depositphotos.com/15648834/17930/v/450/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  marginRight: 8,
                }}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <div className="notification-content-mobile">
                <strong>{notification?.action_by_id?.name || "-"}</strong>
                <span>{notification?.message}</span>
              </div>
              <span className="notification-time-mobile">
                {notification?.created_at || "-"}
              </span>
            </div>

            {selectedNotification === index && (
              <div className="notification-actions-mobile">
                <button
                  className="reject-btn-mobile"
                  onClick={() => handleReject(notification.id)}
                >
                  Reject
                </button>
                <button
                  className="accept-btn-mobile"
                  onClick={() => handleAccept(notification.id)}
                >
                  Accept
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="notification-footer-mobile">
        <Link to="/notifications">View All Notifications</Link>
      </div>
    </div>
  );
};

const MobileResponsiveHeader = ({ subNavActive, apiData: propApiData, members, onFilterToggle }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const notificationsRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [apiData, setApiData] = useState(propApiData || {});
  const [loading, setLoading] = useState(false);
  const [error, setErrors] = useState("");
  const [role] = useState(localStorage.getItem("role"));
  const [token] = useState(localStorage.getItem("token"));
  const [userId] = useState(localStorage.getItem("userId"));

  // Toggle Dropdown
  const toggleUserDropdown = (event) => {
    event.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
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
      url: role === "agent" ? `/api/agent/${userId}/` : `/api/user/${userId}/`,
      setterFunction: setApiData,
      setErrors: setErrors,
      setLoading: setLoading,
    };
    fetchDataWithTokenV2(parameter8);

    // Fetch user profile photo separately
    const parameterPhoto = {
      url: `/api/user/profile_photo/?user_id=${userId}`,
      setterFunction: (data) => {
        if (Array.isArray(data) && data.length > 0) {
          setApiData(prev => ({
            ...prev,
            user_profilephoto: data[data.length - 1]
          }));
        } else if (data && typeof data === 'object' && !Array.isArray(data)) {
          setApiData(prev => ({
            ...prev,
            user_profilephoto: data
          }));
        } else {
          setApiData(prev => ({ ...prev, user_profilephoto: null }));
        }
      },
      setErrors: setErrors,
      setLoading: setLoading,
    };
    fetchDataV2(parameterPhoto);

    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
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
    setIsMobileMenuOpen(false);
  };

  const handleSubNavClickLogout = (item) => {
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
      navigate("/login");
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };

  return (
    <>
      {deleteAccountPopup && (
        <div className="delete-account-overlay">
          <div className="delete-account-modal">
            <p className="delete-account-title">
              Do you want to delete this account?
            </p>
            <div className="delete-account-buttons">
              <button
                onClick={() => handleDeleteAccount(userId)}
                className="delete-btn"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteAccountPopup(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="mobile-responsive-header">
        {/* Top Bar */}
        <div className="header-top-bar">
          <div className="welcome-text-mobile">
            Welcome to Active Mehram Match
          </div>
          <div className="top-right-mobile">
            <div className="help-line-mobile">Help Line +01 112 352 666</div>
            <div className="user-section-mobile">
              <div className="notifications-mobile">
                <div
                  className={`notification-container-mobile ${
                    showNotifications ? "notification-open-mobile" : ""
                  }`}
                  onClick={() => setShowNotifications(!showNotifications)}
                  aria-expanded={showNotifications}
                  aria-haspopup="true"
                  ref={notificationsRef}
                >
                  <span className="notification-badge-mobile">
                    {notificationCount}
                  </span>
                  <svg
                    width="20"
                    height="20"
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
              </div>
              
              {token && userId && (
                <div
                  className="user-profile-mobile"
                  onClick={toggleUserDropdown}
                  ref={dropdownRef}
                >
                  <img
                    src={
                      (apiData?.profile_photo || apiData?.user_profilephoto?.upload_photo)
                        ? `${process.env.REACT_APP_API_URL}${apiData.profile_photo || apiData.user_profilephoto?.upload_photo}`
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
                    className="user-avatar-mobile"
                  />
                  <div className="user-info-mobile">
                    <span className="username-mobile">{apiData?.name}</span>
                    <span className="user-role-mobile">
                      {role === "agent" ? "Agent" : "User"}
                    </span>
                  </div>
                  <span className="dropdown-arrow-mobile">&#9660;</span>
                  
                  {isDropdownOpen && token && userId && (
                    <div className="dropdown-content-mobile">
                      <div
                        className="dropdown-item-mobile"
                        onClick={() => navigate(`/myprofile/${userId}`)}
                      >
                        <FiUser className="dropdown-icon-mobile" />
                        My Profile
                      </div>
                      <div
                        className="dropdown-item-mobile"
                        onClick={() => navigate(`/user-dashboard/`)}
                      >
                        <FiHome className="dropdown-icon-mobile" />
                        Dashboard
                      </div>
                      
                      {role == "agent" && (
                        <>
                          <div
                            className="dropdown-item-mobile"
                            onClick={toggleMemberDropdown}
                          >
                            <FiUsers className="dropdown-icon-mobile" />
                            Members
                            <FiChevronDown className="dropdown-chevron-mobile" />
                          </div>

                          {isMemberDropdownOpen && (
                            <div className="member-dropdown-mobile">
                              {members.map((member) => (
                                <div
                                  key={member?.id}
                                  className="member-item-mobile"
                                >
                                  <div className="member-avatar-mobile">
                                    {member?.profile_photo ? (
                                      <img
                                        src={member?.profile_photo.upload_photo}
                                        style={{
                                          width: "20px",
                                          height: "20px",
                                          borderRadius: "50%",
                                        }}
                                        alt={member.name}
                                      />
                                    ) : (
                                      <div className="member-placeholder-mobile" />
                                    )}
                                  </div>
                                  <span>{member?.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                      
                      <div
                        className="dropdown-item-mobile logout-item-mobile"
                        onClick={() => handleSubNavClickLogout("/login")}
                      >
                        <FiLogOut className="dropdown-icon-mobile" />
                        Logout
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="header-main-nav">
          <nav className="main-nav-mobile">
            <div className="logo-mobile">
              <img
                src={logo}
                style={{ height: "2rem", width: "auto" }}
                alt="Mehram Match"
                className="logo-img-mobile"
              />
            </div>
            
            {/* Desktop Navigation */}
            <div className="nav-links-desktop">
              <a href="/newdashboard" className="nav-link-desktop active">
                HOME
              </a>
              <a 
                href="/my-memberss" 
                className={`nav-link-desktop ${role === "individual" ? "hidden" : ""}`}
              >
                MEMBERS
              </a>
              <a href="/contact-us" className="nav-link-desktop">
                CONTACT US
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="mobile-menu-btn"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <FiX className="menu-icon-mobile" />
              ) : (
                <FiMenu className="menu-icon-mobile" />
              )}
            </button>
          </nav>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="mobile-menu-overlay"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
          )}

          {/* Mobile Navigation Menu */}
          <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            <div className="mobile-menu-content">
              {/* Mobile Menu Header */}
              <div className="mobile-menu-header">
                <div className="mobile-menu-logo">
                  <img
                    src={logo}
                    style={{ height: "2rem", width: "auto" }}
                    alt="Mehram Match"
                  />
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mobile-menu-close"
                >
                  <FiX className="close-icon-mobile" />
                </button>
              </div>

              {/* Mobile Menu Navigation */}
              <div className="mobile-menu-nav">
                <div className="mobile-nav-section">
                  <h3 className="mobile-nav-title">Main Menu</h3>
                  <div className="mobile-nav-links">
                    <a 
                      href="/newdashboard" 
                      className="mobile-nav-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FiHome className="mobile-nav-icon" />
                      HOME
                    </a>
                    <a 
                      href="/my-memberss" 
                      className={`mobile-nav-link ${role === "individual" ? "hidden" : ""}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FiUsers className="mobile-nav-icon" />
                      MEMBERS
                    </a>
                    <a 
                      href="/guidance" 
                      className="mobile-nav-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg className="mobile-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      GUIDANCE
                    </a>
                    <a 
                      href="/contact-us" 
                      className="mobile-nav-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg className="mobile-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      CONTACT US
                    </a>
                  </div>
                </div>

                {/* Quick Access */}
                <div className="mobile-nav-section">
                  <h3 className="mobile-nav-title">Quick Access</h3>
                  <div className="mobile-nav-links">
                    <a 
                      href="user-dashboard"
                      className={`mobile-nav-link ${activeSubNav === "user-dashboard" ? "active" : ""}`}
                      onClick={() => handleSubNavClick("/user-dashboard")}
                    >
                      <img src={time} alt="" className="mobile-nav-icon" />
                      Dashboard
                    </a>
                    <a 
                      href={`/myprofile/${userId}`}
                      className={`mobile-nav-link ${activeSubNav === "My Profile" ? "active" : ""}`}
                      onClick={() => handleSubNavClick("/newdashboard")}
                    >
                      <img src={people} alt="" className="mobile-nav-icon" />
                      My Profile
                    </a>
                    <a 
                      href="#"
                      className={`mobile-nav-link ${activeSubNav === "Shortlist" ? "active" : ""}`}
                      onClick={() => handleSubNavClick("/total-shortlist")}
                    >
                      <img src={hamburger} alt="" className="mobile-nav-icon" />
                      Shortlist
                    </a>
                    
                    {role != "agent" && (
                      <>
                        <a 
                          href="#"
                          className={`mobile-nav-link ${activeSubNav === "myInterest" ? "active" : ""}`}
                          onClick={() => handleSubNavClick("/total-interest")}
                        >
                          <img src={grayHeart} alt="" className="mobile-nav-icon" />
                          My Interest
                        </a>
                        <a 
                          href="#"
                          className={`mobile-nav-link ${activeSubNav === "Messaging" ? "active" : ""}`}
                          onClick={() => handleSubNavClick(`/${userId}/inbox`)}
                        >
                          <img src={grayEnv} alt="" className="mobile-nav-icon" />
                          Messaging
                        </a>
                        <a 
                          href="#"
                          className={`mobile-nav-link ${activeSubNav === "Ignored User List" ? "active" : ""}`}
                          onClick={() => handleSubNavClick("/total-ignored")}
                        >
                          <img src={notAllowed} alt="" className="mobile-nav-icon" />
                          Ignored User List
                        </a>
                        <a 
                          href="#"
                          className={`mobile-nav-link ${activeSubNav === "Matched profile" ? "active" : ""}`}
                          onClick={() => handleSubNavClick("/matches")}
                        >
                          <img src={multiPeople} alt="" className="mobile-nav-icon" />
                          Matched profile
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {/* User Profile Section */}
                <div className="mobile-nav-section">
                  <h3 className="mobile-nav-title">Profile</h3>
                  <div className="mobile-user-profile">
                    <img
                      src={
                        (apiData?.profile_photo || apiData?.user_profilephoto?.upload_photo)
                          ? `${process.env.REACT_APP_API_URL}${apiData.profile_photo || apiData.user_profilephoto?.upload_photo}`
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
                      className="mobile-user-avatar"
                    />
                    <div className="mobile-user-info">
                      <p className="mobile-user-name">{apiData?.name}</p>
                      <p className="mobile-user-role">{role === "agent" ? "Agent" : "User"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="header-sub-nav">
          <div className="sub-nav-desktop">
            <a
              href="user-dashboard"
              className={activeSubNav === "user-dashboard" ? "activeSubNav" : ""}
              onClick={() => handleSubNavClick("/user-dashboard")}
            >
              <i className="icon">
                <img src={time} alt="" />
              </i>
              Dashboard
            </a>
            <a
              href={`/myprofile/${userId}`}
              className={activeSubNav === "My Profile" ? "activeSubNav" : ""}
              onClick={() => handleSubNavClick("/newdashboard")}
            >
              <i className="icon">
                <img src={people} alt="" />
              </i>
              My Profile
            </a>
            <a
              href="#"
              className={activeSubNav === "Shortlist" ? "activeSubNav" : ""}
              onClick={() => handleSubNavClick("/total-shortlist")}
            >
              <i className="icon">
                <img src={hamburger} alt="" />
              </i>
              Shortlist
            </a>
            {role != "agent" && (
              <>
                <a
                  href="#"
                  className={activeSubNav === "myInterest" ? "activeSubNav" : ""}
                  onClick={() => handleSubNavClick("/total-interest")}
                >
                  <i className="icon">
                    <img src={grayHeart} alt="" />
                  </i>
                  My Interest
                </a>
                <a
                  href="#"
                  className={activeSubNav === "Messaging" ? "activeSubNav" : ""}
                  onClick={() => handleSubNavClick(`/${userId}/inbox`)}
                >
                  <i className="icon">
                    <img src={grayEnv} alt="" />
                  </i>
                  Messaging
                </a>
                <a
                  href="#"
                  className={activeSubNav === "Ignored User List" ? "activeSubNav" : ""}
                  onClick={() => handleSubNavClick("/total-ignored")}
                >
                  <i className="icon">
                    <img src={notAllowed} alt="" />
                  </i>
                  Ignored User List
                </a>
                <a
                  href="#"
                  className={activeSubNav === "Matched profile" ? "activeSubNav" : ""}
                  onClick={() => handleSubNavClick("/matches")}
                >
                  <i className="icon">
                    <img src={multiPeople} alt="" />
                  </i>
                  Matched profile
                </a>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default MobileResponsiveHeader;
