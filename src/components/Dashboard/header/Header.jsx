import React, { useState, useEffect, useRef } from "react";
import "./header.css";
import logo from "../../../images/newLogo.jpg";
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

const Header = ({ subNavActive, apiData, members }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);
  const notificationsRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [setApiData] = useState({});
  const [useLoading, setLoading] = useState({});
  const [useError, setErrors] = useState({});
  const [role] = useState(localStorage.getItem("role"));

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

  useEffect(() => {
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
            className="welcome-text"
            style={{ color: "gray", fontSize: "0.8rem" }}
          >
            Welcome to Active Mehram Match
          </div>
          <div className="top-right">
            <div className="help-line">Help Line +01 112 352 666</div>
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
                <span
                  style={{ fontSize: "1.2rem", cursor: "pointer" }}
                  onClick={() => navigate("/inbox")}
                >
                  ✉️
                </span>
              </div>
              <div
                className="user-profile"
                onClick={toggleUserDropdown}
                ref={dropdownRef}
                style={{ position: "relative", cursor: "pointer" }}
              >
                {console.log("User profile clicked!")}
                {console.log(
                  `${"https://mehram-match.onrender.com"}${
                    apiData?.profile_photo
                  }`
                )}
                <img
                  src={
                    apiData?.profile_photo
                      ? apiData?.profile_photo.upload_photo
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
                <span
                  className="arrow"
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                  onClick={toggleUserDropdown}
                >
                  &#9660;
                </span>
                {isDropdownOpen && (
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

                    <div>
                      {role == "agent" && (
                        <>
                          <div
                            className="dropdown-item"
                            style={{ display: "flex", alignItems: "center" }}
                            onClick={toggleMemberDropdown}
                          >
                            <FiUsers
                              style={{ marginRight: "12px", fontSize: "16px" }}
                            />
                            Members
                            <FiChevronDown style={{ fontSize: "14px" }} />
                          </div>

                          {isMemberDropdownOpen && (
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
                              {members.map((member) => (
                                <div
                                  key={member?.id}
                                  className="dropdown-item"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "8px 0",
                                  }}
                                >
                                  <div style={{ marginRight: "12px" }}>
                                    {member?.profile_photo ? (
                                      <>
                                        <img
                                          src={
                                            member?.profile_photo.upload_photo
                                          }
                                          // alt={member.name}
                                          style={{
                                            width: "24px",
                                            height: "24px",
                                            borderRadius: "50%",
                                          }}
                                        />
                                      </>
                                    ) : (
                                      <div
                                        style={{
                                          width: "24px",
                                          height: "24px",
                                          borderRadius: "50%",
                                          backgroundColor: "#ccc",
                                        }}
                                      />
                                    )}
                                  </div>
                                  <span>{member?.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
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
          </div>
        </div>
        <div className="nav-event">
          <nav className="main-nav">
            <div className="logo">
              <img
                href="/"
                src={logo}
                style={{ width: "12rem", height: "3rem" }}
                alt="Mehram Match"
                className="logo-img"
              />
            </div>
            <div className="nav-links">
              <a href="/newdashboard" className="active">
                HOME
              </a>
              <a href="/my-memberss" style={{display:role === "individual"? "none ":""}}>MEMBERS</a>
              {/* <a href="#">PREMIUM PLANS</a> */}
              <a href="/guidance">GUIDANCE</a>
              <a href="#">CONTACT US</a>
            </div>
          </nav>

          <div className="sub-nav">
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
              href={`/myprofile/${userId}`}
              className={activeSubNav === "My Profile" ? "activeSubNav" : ""}
              onClick={() => handleSubNavClick("/newdashboard")}
            >
              <i className="icon">
                <img src={people} alt="" />
              </i>{" "}
              My Profile
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
        </div>
      </header>
    </>
  );
};

export default Header;

// import React, { useState } from 'react';
// import './header.css';
// import logo from "../../../images/newLogo.jpg";
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
