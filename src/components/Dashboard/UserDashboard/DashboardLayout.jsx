import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./DashboardLayout.css";
import logo from "../../../images/newLogo.jpg";
import { HiChevronRight } from "react-icons/hi"
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
import { FaSearch, } from "react-icons/fa"; // Import the search icon
import {
  fetchDataObjectV2,
  fetchDataWithTokenV2,
  ReturnPutResponseFormdataWithoutToken,
} from "../../../apiUtils";
import { useNavigate, useLocation } from "react-router-dom";
import ManageProfileModal from "./ManageProfileModal.jsx";
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

const DashboardLayout = ({
  subNavActive,
  children,
  onAddMember,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  
  // Search functionality states
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  
  const notificationsRef = useRef(null);
  const searchRef = useRef(null);
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

  // Search functionality
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 0) {
      setShowSearchResults(true);
      // Generate search suggestions based on query
      const suggestions = generateSearchSuggestions(query);
      setSearchSuggestions(suggestions);
    } else {
      setShowSearchResults(false);
      setSearchSuggestions([]);
    }
  };

  const generateSearchSuggestions = (query) => {
    const suggestions = [
      { type: 'profile', text: `Search profiles matching "${query}"`, action: () => navigate(`/search?q=${query}`) },
      { type: 'dashboard', text: 'Dashboard', action: () => navigate('/user-dashboard') },
      { type: 'profile', text: 'My Profile', action: () => navigate(`/myprofile/${userId}`) },
      { type: 'settings', text: 'Settings', action: () => navigate('/settings') },
      { type: 'help', text: 'Help & Support', action: () => navigate('/help') },
      { type: 'matches', text: 'My Matches', action: () => navigate('/matches') },
      { type: 'interests', text: 'My Interests', action: () => navigate('/total-interest') },
      { type: 'requests', text: 'My Requests', action: () => navigate('/total-request') },
      { type: 'shortlist', text: 'My Shortlist', action: () => navigate('/total-shortlist') },
      { type: 'blocked', text: 'Blocked Users', action: () => navigate('/blocked-users') }
    ];
    
    return suggestions.filter(suggestion => 
      suggestion.text.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setSearchQuery("");
    }
  };

  const handleSuggestionClick = (suggestion) => {
    suggestion.action();
    setShowSearchResults(false);
    setSearchQuery("");
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (role === "agent") return;

    const parameter8 = {
      url: role === "agent" ? `/api/agent/${userId}/` : `/api/user/${userId}/`,
      setterFunction: (data) => {
        console.log("API Response Data:", data);
        setApiData(data);
      },
      setErrors: setErrors,
      setLoading: setLoading,
    };
    fetchDataWithTokenV2(parameter8);

    // Fetch user profile photo separately (same logic as Header.jsx)
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
    fetchDataWithTokenV2(parameterPhoto);

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

  const toggleSettingsDropdown = () => {
    
    setIsSettingsDropdownOpen((prev) => !prev);
  };

  const [isManageProfileModalOpen, setIsManageProfileModalOpen] = useState(
    false
  );

  const [isMembersMenuOpen, setIsMembersMenuOpen] = useState(false);

  const handleMembersClick = () => {
    setIsMembersMenuOpen((prev) => !prev);
  };

  const [showAllMembers, setShowAllMembers] = useState(false);
  const [showBulkMemberPopup, setShowBulkMemberPopup] = useState(false);
  const [showDeactivateMemberPopup, setShowDeactivateMemberPopup] = useState(false);
  const [allMembers, setAllMembers] = useState([]);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
            if (role === "individual") return; 
    const parameter = {
      url: `/api/agent/user_agent/?agent_id=${userId}`,
      setterFunction: (data) => {
        setAllMembers(data.member || []);
      },
      setErrors: setErrors,
    };
    fetchDataWithTokenV2(parameter);
  }, [userId]);

  const handleExcelUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select an Excel file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);

      const token = localStorage.getItem("token"); // or wherever you store your auth token

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/user-create-from-excel/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Upload failed");
      }

      alert("Users uploaded successfully!");
      setShowBulkMemberPopup(false);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeactivateAccount = async (e) => {
 e.preventDefault();
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/deactivate-account/${userId}`, {
      method: 'POST',
      headers: {
            Authorization: `Bearer ${token}`,
          }
    });

    if (response.ok) {
      alert('Account deactivated successfully');
      window.location.href = '/login'; 
    } else {
      const errorData = await response.json();
      alert(`Deactivation failed: ${errorData.message || response.statusText}`);
    }
  } catch (error) {
    console.error('Deactivation error:', error);
    alert('Failed to deactivate account. Please try again later.');
  }
};

  return (
    <>
      {" "}
      {showAllMembers && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-xl w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setShowAllMembers(false)}
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold mb-4">All Members</h2>

            {Array.isArray(allMembers) && allMembers.length > 0 ? (
              <div className="overflow-auto">
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                    <tr>
                      <th className="p-3 border-b">Photo</th>
                      <th className="p-3 border-b">Name</th>
                      <th className="p-3 border-b">Profession</th>
                      <th className="p-3 border-b">Gender</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="p-3 border-b">
                          <img
                            src={
                              member?.profile_photo
                                ? member?.profile_photo.upload_photo
                                : `data:image/svg+xml;utf8,${encodeURIComponent(
                                    member?.gender === "male"
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
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover bg-gray-200"
                          />
                        </td>
                        <td className="p-3 border-b font-medium">
                          {member.name}
                        </td>
                        <td className="p-3 border-b text-sm text-gray-600">
                          {member.profession || "No profession listed"}
                        </td>
                        <td className="p-3 border-b capitalize text-sm text-gray-500">
                          {member.gender}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No members found.</p>
            )}
          </div>
        </div>
      )}

      {showBulkMemberPopup && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4">Add Bulk Members</h2>

            <form onSubmit={handleExcelUpload}>
              <div className="relative mb-4">
                {/* Hidden file input */}
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  id="file-upload"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  required
                />

                {/* File name display */}
                <input
                  type="text"
                  value={file ? file.name : ""}
                  placeholder="Choose Excel file"
                  disabled
                  className="w-full px-3 py-2 border rounded text-sm pr-20"
                />

                {/* Overlapping 'Add' button */}
                <label
                  htmlFor="file-upload"
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-white text-xs px-3 py-1 rounded cursor-pointer"
                  style={{
                    backgroundColor: "#FF1493",
                    hover: { backgroundColor: "#e01384" },
                  }}
                >
                  Add
                </label>
              </div>

              <div className="flex justify-start gap-2">
                <button
                  type="submit"
                  disabled={isUploading}
                  className={`text-white px-4 py-2 rounded ${
                    isUploading ? "bg-gray-400" : ""
                  }`}
                  style={{
                    backgroundColor: isUploading ? "#d1d5db" : "#FF1493",
                    cursor: isUploading ? "not-allowed" : "pointer",
                  }}
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowBulkMemberPopup(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

{showDeactivateMemberPopup && (
        <div className="absolute top-0 left-0 w-full h-[120vh] flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <p className="text-lg font-medium text-gray-800 mb-4">
              Do you want to deactivate this account?
            </p>
            <div className="flex justify-start gap-4">
              <button
                onClick={() => handleDeactivateAccount(userId)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeactivateMemberPopup(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteAccountPopup && (
        <div className="absolute top-0 left-0 w-full h-[120vh] flex items-center justify-center bg-black bg-opacity-50 z-50">
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
        <header
          className="dashboard-header"
          style={{ padding: "12px 24px", height: "70px" }}
        >
          <div className="header-left">
            {/* Logo */}
            <Link to="/" className="logo">
              <img src={logo} alt="Mehram Match" />
            </Link>

            {/* Navbar Icon (Hamburger Menu) */}

            {/* Search Bar */}
            <div className="search-bar" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <svg className="search-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#9aa0a6" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search profiles, settings, help, interests, matches..." 
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSearchResults(true)}
                />
              </form>
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchSuggestions.length > 0 && (
                <div className="search-results-dropdown">
                  {searchSuggestions.map((suggestion, index) => (
                    <div 
                      key={index}
                      className="search-suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <svg className="suggestion-icon" viewBox="0 0 24 24" width="20" height="20">
                        <path fill="#9aa0a6" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                      </svg>
                      <span>{suggestion.text}</span>
                    </div>
                  ))}
                </div>
              )}
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
              {console.log("apiData:", apiData)}
              {console.log("profile_photo:", apiData?.profile_photo)}
              {console.log("upload_photo:", apiData?.profile_photo?.upload_photo)}
              {console.log("user_profilephoto:", apiData?.user_profilephoto)}
              {console.log("Final image URL:", (apiData?.profile_photo || apiData?.user_profilephoto?.upload_photo) ? `${process.env.REACT_APP_API_URL || 'https://mehram-match.onrender.com'}${apiData.profile_photo || apiData.user_profilephoto?.upload_photo}` : 'Using fallback SVG')}
              <img
                src={
                  (apiData?.profile_photo || apiData?.user_profilephoto?.upload_photo)
                    ? `${process.env.REACT_APP_API_URL || 'https://mehram-match.onrender.com'}${apiData.profile_photo || apiData.user_profilephoto?.upload_photo}`
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
                onError={(e) => {
                  console.log("Image failed to load, using fallback");
                  e.target.src = `data:image/svg+xml;utf8,${encodeURIComponent(
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
                }}
                onLoad={() => {
                  console.log("Image loaded successfully");
                }}
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
          <aside
            className={`dashboard-sidebar bg-gray-800 text-white
      transition-all duration-300 ease-in-out 
      ${showSidebar ? "w-[250px]" : "w-[90px]"}
      overflow-hidden flex flex-col`}
          >
            <div
              className="w-full p-[12px] cursor-pointer flex justify-end"
              onClick={() => setShowSidebar((prev) => !prev)}
            >
              

    <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                  style={{
                    transform: showSidebar
                      ? "rotate(90deg)"
                      : "rotate(270deg)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              
            </div>
            <nav style={{display:"flex",flexDirection:"column",alignItems:"start",overflowY:"scroll"}}>
              <Link
                to="/user-dashboard"
                title={!showSidebar ? "Dashboard" : ""}
                className={`nav-item ${
                  isActive("/user-dashboard") ? "active" : ""
                }`}
              >
                <div className="nav-item-icon">
                  <svg
                    width="20"
                    height="20"
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
                </div>
                {showSidebar && <span className="nav-item-text">Dashboard</span>}
              </Link>

              {role === "agent" && (
                <>
                  <div
                    className={`nav-item ${
                      isActive("/my-memberss") ? "active" : ""
                    }`}
                    title={!showSidebar ? "Members" : ""}
                    onClick={handleMembersClick}
                    style={{
                      justifyContent: "space-between",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div className="nav-item-icon">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      {showSidebar && <span className="nav-item-text">Members</span>}
                    </div>

                    {showSidebar && (
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
                          flexShrink: 0
                        }}
                      >
                        <polyline points="6 8 10 12 14 8" strokeWidth="2" />
                      </svg>
                    )}
                  </div>

                  {/* Slide-down submenu */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isMembersMenuOpen
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div
                      className="nav-item"
                      style={{
                        paddingLeft: showSidebar ? "52px" : "16px",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate("/my-memberss")}
                    >
                      <span className="nav-item-text">Add Member</span>
                    </div>
                    <div
                      className="nav-item"
                      style={{
                        paddingLeft: showSidebar ? "52px" : "16px",
                        cursor: "pointer",
                      }}
                      onClick={() => setShowBulkMemberPopup(true)}
                    >
                      <span className="nav-item-text">Add Bulk Member</span>
                    </div>
                    <div
                      className="nav-item"
                      style={{
                        paddingLeft: showSidebar ? "52px" : "16px",
                        cursor: "pointer",
                      }}
                      onClick={() => setShowAllMembers(true)}
                    >
                      <span className="nav-item-text">View All Members</span>
                    </div>
                  </div>
                </>
              )}
{/* 
              {role === "individual" && (
                <Link
                  to="/total-interaction"
                  title={!showSidebar ? "Total Interaction" : ""}
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
                  {showSidebar && "Total Interaction"}
                </Link>
              )} */}

              {role === "individual" && (
                <Link
                  to="/total-interest"
                  title={!showSidebar ? "Total Interest" : ""}
                  className={`nav-item ${
                    isActive("/total-interest") ? "active" : ""
                  }`}
                >
                  <div className="nav-item-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  {showSidebar && <span className="nav-item-text">Total Interest</span>}
                </Link>
              )}

              {role === "individual" && (
                <Link
                  to="/total-request"
                  title={!showSidebar ? "Total Request" : ""}
                  className={`nav-item ${
                    isActive("/total-request") ? "active" : ""
                  }`}
                >
                  <div className="nav-item-icon">
                    <svg
                      width="20"
                      height="20"
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
                  </div>
                  {showSidebar && <span className="nav-item-text">Total Request</span>}
                </Link>
              )}

              {role === "individual" && (
                <Link
                  to="/total-ignored"
                  title={!showSidebar ? "Ignored User List" : ""}
                  className={`nav-item ${
                    isActive("/total-ignored") ? "active" : ""
                  }`}
                >
                  <div className="nav-item-icon">
                    <svg
                      width="20"
                      height="20"
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
                  </div>
                  {showSidebar && <span className="nav-item-text">Ignored User List</span>}
                </Link>
              )}

              {role === "individual" && (
                <Link
                  to={route}
                  title={!showSidebar ? "My Shortlist" : ""}
                  className={`nav-item ${
                    isActive("/total-shortlist") ? "active" : ""
                  }`}
                >
                  <div className="nav-item-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  {showSidebar && <span className="nav-item-text">My Shortlist</span>}
                </Link>
              )}

              {role === "individual" && (
                <Link
                  to="/blocked-list"
                  title={!showSidebar ? "Blocked User List" : ""}
                  className={`nav-item ${
                    isActive("/blocked-list") ? "active" : ""
                  }`}
                >
                  <div className="nav-item-icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  {showSidebar && <span className="nav-item-text">Blocked User List</span>}
                </Link>
              )}

              {role === "individual" && (
                <Link
                  to={`/${userId}/inbox`}
                  title={!showSidebar ? "Inbox" : ""}
                  className={`nav-item ${isActive("/inbox") ? "active" : ""}`}
                >
                  <div className="nav-item-icon">
                    <svg
                      width="20"
                      height="20"
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
                  </div>
                  {showSidebar && <span className="nav-item-text">Inbox</span>}
                </Link>
              )}

              {role === "individual" && (
                <Link
                  to="/matches"
                  title={!showSidebar ? "Matches" : ""}
                  className={`nav-item ${isActive("/matches") ? "active" : ""}`}
                >
                  <div className="nav-item-icon">
                    <svg
                      width="20"
                      height="20"
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
                  </div>
                  {showSidebar && <span className="nav-item-text">Matches</span>}
                </Link>
              )}

              <p className="pagetext">Pages</p>

              <Link
                to="/newdashboard"
                title={!showSidebar ? "Home" : ""}
                className="nav-item"
              >
                <div className="nav-item-icon">
                  <svg
                    width="20"
                    height="20"
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
                </div>
                {showSidebar && <span className="nav-item-text">Home</span>}
              </Link>

              <Link to="/guidance" 
              title={!showSidebar ? "Guidance" : ""}
              className="nav-item">
                <div className="nav-item-icon">
                  <svg
                    width="20"
                    height="20"
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
                </div>
                {showSidebar && <span className="nav-item-text">Guidance</span>}
              </Link>
              <Link to="" 
              title={!showSidebar ? "Contact" : ""}
              className="nav-item">
                <div className="nav-item-icon">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                {showSidebar && <span className="nav-item-text">Contact</span>}
              </Link>
              <Link to="/premium" 
              title={!showSidebar ? "Packages" : ""}
              className="nav-item">
                <div className="nav-item-icon">
                  <svg
                    width="20"
                    height="20"
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
                </div>
                {showSidebar && <span className="nav-item-text">Packages</span>}
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main
            className="main-content"
            style={{
              width: showSidebar ? "calc(100% - 250px)" : "calc(100% - 90px)",
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
