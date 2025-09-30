import React, { useEffect, useState } from "react";
import { FaVideo, FaPhone, FaInfoCircle } from "react-icons/fa";
import {
  FiSend,
  FiSmile,
  FiImage,
  FiSearch,
  FiMoreHorizontal,
  FiHeart,
  FiMessageCircle,
} from "react-icons/fi";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import axios from "axios";
import { convertDateTime } from "../../../apiUtils";
import "./Inbox.css";

const Inbox = () => {
  const navigate = useNavigate();
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [userInteraction, setUserInteraction] = useState([]);
  const [errors, setErrors] = useState(null);
  const userId = parseInt(localStorage.getItem("userId"), 10);
  const [newMessage, setNewMessage] = useState("");
  const [pollingIntervalId, setPollingIntervalId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [emojis, setEmojis] = useState([]);
  const [emojiCategories, setEmojiCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('smileys-emotion');
  const [emojiSearch, setEmojiSearch] = useState('');
  const [loadingEmojis, setLoadingEmojis] = useState(false);
  const [viewingImages, setViewingImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageInputRef = React.useRef(null);

  const token = localStorage.getItem("token");
  const EMOJI_API_KEY = '855ca2a096c697a0c8e2da3a525e509acd7d1847';

  useEffect(() => {
    if (errors) {
      const timer = setTimeout(() => {
        setErrors(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
  const fetchRecentUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/chats/recent-users/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
        // Filter users who have at least one message
        const usersWithMessages = response.data.filter(
          (user) => user.last_message && user.last_message.trim() !== ""
        );
        
        // Preserve unread_count = 0 for currently open conversation
        setRecentUsers((prevUsers) => {
          return usersWithMessages.map((newUser) => {
            const existingUser = prevUsers.find((u) => u.id === newUser.id);
            // If this user was already read in current session, keep it 0
            if (existingUser && existingUser.unread_count === 0) {
              return { ...newUser, unread_count: 0 };
            }
            return newUser;
          });
        });
    } catch (error) {
      if (error.response?.data?.detail) {
        setErrors(error.response.data.detail);
      } else if (error.response?.data) {
        const errors = error.response.data;
        const firstError = Object.values(errors)[0];
        setErrors(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setErrors("An error occurred while fetching recent users.");
      }
      setRecentUsers([]);
    }
  };

  fetchRecentUsers();
    const interval = setInterval(fetchRecentUsers, 5000);

  return () => clearInterval(interval);
}, [token]);

  const markMessagesAsRead = async (receiverId) => {
    // Immediately update local state to remove unread count
    setRecentUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === receiverId ? { ...user, unread_count: 0 } : user
      )
    );

    // Update on backend with PATCH method
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/chats/${receiverId}/mark-read/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(`✓ Backend synced: ${response.data.messages_marked_read} messages marked as read`);
    } catch (error) {
      // Log error - backend sync failed
      console.error("⚠️ Backend sync failed - CORS issue. Count will reappear on refresh.");
      console.error("Backend team needs to add 'PATCH' to CORS_ALLOW_METHODS in settings.py");
    }
  };

  const fetchUserInteraction = async (receiverId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/chats/${receiverId}/messages/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("📩 Messages received:", response.data);
      // Log to check if file field exists
      const messagesWithFiles = response.data.filter(m => m.file || m.image);
      if (messagesWithFiles.length > 0) {
        console.log("📸 Messages with images:", messagesWithFiles);
      }
      setUserInteraction(response.data);
    } catch (error) {
      if (error.response?.data?.detail) {
        setErrors(error.response.data.detail);
      } else if (error.response?.data) {
        const errors = error.response.data;
        const firstError = Object.values(errors)[0];
        setErrors(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setErrors("An error occurred while fetching messages.");
      }
      setUserInteraction([]);
    }
  };

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && selectedImages.length === 0) || selectedMessage === null) return;

    const receiverId = recentUsers[selectedMessage]?.id;

    try {
      // If only text message, send as JSON
      if (selectedImages.length === 0) {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user/messages/`,
        {
          receiver_id: receiverId,
          content: newMessage,
        },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        // Send each image as a separate message (WhatsApp style)
        const messageContent = newMessage.trim() || '📷 Photo';
        
        for (let i = 0; i < selectedImages.length; i++) {
          const formData = new FormData();
          formData.append('receiver_id', receiverId);
          formData.append('content', i === 0 ? messageContent : '📷 Photo');
          formData.append('file', selectedImages[i]);

          await axios.post(
            `${process.env.REACT_APP_API_URL}/api/user/messages/`,
            formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
        }
        
        console.log(`✅ Sent ${selectedImages.length} images`);
      }

      setNewMessage("");
      setSelectedImages([]);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      fetchUserInteraction(receiverId);
    } catch (error) {
      console.error("Failed to send message:", error);
      console.error("Error details:", error.response?.data);
      setErrors(error.response?.data?.detail || error.response?.data?.error || "Failed to send message. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiClick = (emoji) => {
    const emojiChar = typeof emoji === 'string' ? emoji : emoji.character;
    setNewMessage((prev) => prev + emojiChar);
    setShowEmojiPicker(false);
    setEmojiSearch('');
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Validate each file
    const validFiles = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(`${file.name} is too large. Max 5MB per image.`);
        continue;
      }
      validFiles.push(file);
    }
    
    // Limit to 10 images max (WhatsApp allows 10)
    if (validFiles.length > 10) {
      setErrors("Maximum 10 images can be sent at once");
      setSelectedImages(validFiles.slice(0, 10));
    } else {
      setSelectedImages(validFiles);
    }
  };
  
  const removeSelectedImage = (index) => {
    setSelectedImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleImageUpload = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  // Fetch emoji categories on mount
  useEffect(() => {
    const fetchEmojiCategories = async () => {
      try {
        const response = await axios.get(
          `https://emoji-api.com/categories?access_key=${EMOJI_API_KEY}`
        );
        setEmojiCategories(response.data.slice(0, 8)); // First 8 categories
      } catch (error) {
        console.error("Failed to fetch emoji categories");
      }
    };
    fetchEmojiCategories();
  }, []);

  // Fetch emojis by category or search
  useEffect(() => {
    if (!showEmojiPicker) return;

    const fetchEmojis = async () => {
      setLoadingEmojis(true);
      try {
        let url;
        if (emojiSearch.trim()) {
          url = `https://emoji-api.com/emojis?search=${emojiSearch}&access_key=${EMOJI_API_KEY}`;
        } else {
          url = `https://emoji-api.com/categories/${selectedCategory}?access_key=${EMOJI_API_KEY}`;
        }
        
        const response = await axios.get(url);
        setEmojis(response.data.slice(0, 80)); // Limit to 80 emojis for performance
      } catch (error) {
        console.error("Failed to fetch emojis");
        // Fallback to common emojis
        setEmojis([
          { character: "😊" }, { character: "😂" }, { character: "❤️" }, 
          { character: "👍" }, { character: "🙏" }, { character: "😍" },
          { character: "🥰" }, { character: "😘" }, { character: "🤗" },
          { character: "😇" }, { character: "🌟" }, { character: "✨" },
          { character: "🎉" }, { character: "💕" }, { character: "💖" },
          { character: "🌹" }, { character: "😢" }, { character: "😅" }
        ]);
      } finally {
        setLoadingEmojis(false);
      }
    };

    fetchEmojis();
  }, [showEmojiPicker, selectedCategory, emojiSearch, EMOJI_API_KEY]);

  useEffect(() => {
  return () => {
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
    }
  };
}, [pollingIntervalId]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyboard = (e) => {
      if (viewingImages.length === 0) return;
      
      if (e.key === 'Escape') {
        setViewingImages([]);
        setCurrentImageIndex(0);
      } else if (e.key === 'ArrowLeft') {
        setCurrentImageIndex(prev => 
          prev === 0 ? viewingImages.length - 1 : prev - 1
        );
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex(prev => 
          prev === viewingImages.length - 1 ? 0 : prev + 1
        );
      }
    };
    
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [viewingImages, currentImageIndex]);

  const filteredUsers = recentUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="inbox-modern-container">
      {errors && (
          <div className="inbox-error-toast">
            <span>{errors}</span>
        </div>
      )}

        {/* Image Gallery Lightbox Modal */}
        {viewingImages.length > 0 && (
          <div className="inbox-image-lightbox" onClick={() => {
            setViewingImages([]);
            setCurrentImageIndex(0);
          }}>
            <div className="inbox-lightbox-content" onClick={(e) => e.stopPropagation()}>
              <button 
                className="inbox-lightbox-close"
                onClick={() => {
                  setViewingImages([]);
                  setCurrentImageIndex(0);
                }}
              >
                ✕
              </button>
              
              {/* Navigation Arrows */}
              {viewingImages.length > 1 && (
                <>
                  <button 
                    className="inbox-lightbox-prev"
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === 0 ? viewingImages.length - 1 : prev - 1
                    )}
                  >
                    ‹
                  </button>
                  <button 
                    className="inbox-lightbox-next"
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === viewingImages.length - 1 ? 0 : prev + 1
                    )}
                  >
                    ›
                  </button>
                </>
              )}
              
              <img 
                src={viewingImages[currentImageIndex]} 
                alt={`Image ${currentImageIndex + 1}`} 
                className="inbox-lightbox-image" 
              />
              
              {/* Image Counter */}
              {viewingImages.length > 1 && (
                <div className="inbox-lightbox-counter">
                  {currentImageIndex + 1} / {viewingImages.length}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="inbox-modern-wrapper">
          {/* Left Sidebar - Messages List */}
          <div className="inbox-sidebar">
            <div className="inbox-sidebar-header">
              <div className="inbox-header-user">
                <h2 className="inbox-username">Your Messages</h2>
              </div>
              <button className="inbox-compose-btn" title="New Message">
                <MdEdit size={20} />
              </button>
          </div>

            <div className="inbox-search-container">
              <FiSearch className="inbox-search-icon" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="inbox-search-input"
              />
            </div>

            <div className="inbox-users-list">
              {filteredUsers.length === 0 ? (
                <div className="inbox-empty-state-sidebar">
                  <FiMessageCircle size={48} />
                  <p>No messages yet</p>
                  <small>Start exploring profiles</small>
                </div>
              ) : (
                filteredUsers.map((user, index) => (
                  <div
                      key={user.id}
                    className={`inbox-user-item ${
                      selectedMessage === index ? "active" : ""
                      }`}
                      onClick={() => {
                      // Find the actual index in recentUsers array
                      const actualIndex = recentUsers.findIndex(
                        (u) => u.id === user.id
                      );
                      setSelectedMessage(actualIndex);
                      
                      // Immediately clear unread count
                      markMessagesAsRead(user.id);
                      
                      // Fetch messages
                      fetchUserInteraction(user.id);

                      // Clear any existing polling
                        if (pollingIntervalId) {
                          clearInterval(pollingIntervalId);
                        }

                      // Start new polling for this conversation
                        const intervalId = setInterval(() => {
                        fetchUserInteraction(user.id);
                      }, 5000);

                        setPollingIntervalId(intervalId);
                      }}
                    >
                    <div className="inbox-user-avatar">
                      <img
                        src={
                          user.profile_photo
                            ? `${
                                process.env.REACT_APP_API_URL ||
                                "http://localhost:8000"
                              }${user.profile_photo}`
                          : `data:image/svg+xml;utf8,${encodeURIComponent(
                              user?.gender === "male"
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
                            alt={user.name}
                      />
                      {user.is_online && (
                        <span className="inbox-user-online-dot"></span>
                      )}
                    </div>
                    <div className="inbox-user-info">
                      <div className="inbox-user-name">{user.name}</div>
                      <div className="inbox-user-last-message">
                        {user.last_message || "No messages yet"}
                        </div>
                          </div>
                    <div className="inbox-user-meta">
                      <span className="inbox-user-time">
                        {user.last_message_time
                          ? convertDateTime(user.last_message_time)
                          : ""}
                      </span>
                      {user.unread_count > 0 && (
                        <span className="inbox-unread-badge">
                          {user.unread_count}
                        </span>
                      )}
                          </div>
                        </div>
                ))
              )}
            </div>
          </div>

          {/* Right Side - Chat Area */}
          <div className="inbox-chat-area">
            {selectedMessage === null ? (
              <div className="inbox-empty-state">
                <div className="inbox-empty-icon">
                  <FiMessageCircle size={80} />
                </div>
                <h2>Your Messages</h2>
                <p>
                  Send private messages to profiles you're interested in or
                  received requests from.
                </p>
                <button 
                  className="inbox-explore-btn"
                  onClick={() => navigate('/newdashboard')}
                >
                  <FiHeart style={{ marginRight: "8px" }} />
                  Explore Profiles
                </button>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="inbox-chat-header">
                  <div className="inbox-chat-header-left">
              <img
                src={
                  recentUsers[selectedMessage]?.profile_photo
                    ? `${process.env.REACT_APP_API_URL}${recentUsers[selectedMessage].profile_photo}`
                          : `data:image/svg+xml;utf8,${encodeURIComponent(
                              recentUsers[selectedMessage]?.gender === "male"
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
                      alt={recentUsers[selectedMessage]?.name}
                      className="inbox-chat-avatar"
                    />
                    <div className="inbox-chat-user-info">
                      <h3>{recentUsers[selectedMessage]?.name}</h3>
                      <span className="inbox-chat-status">Active now</span>
                    </div>
                  </div>
                  <div className="inbox-chat-header-actions">
                    <button className="inbox-action-btn" title="Voice Call">
                      <FaPhone size={18} />
                    </button>
                    <button className="inbox-action-btn" title="Video Call">
                      <FaVideo size={18} />
                    </button>
                    <button className="inbox-action-btn" title="User Info">
                      <FaInfoCircle size={18} />
                    </button>
              </div>
            </div>

                {/* Chat Messages */}
                <div className="inbox-chat-messages">
                  {userInteraction.length === 0 ? (
                    <div className="inbox-no-messages">
                      <FiMessageCircle size={48} />
                      <p>No messages yet</p>
                      <small>Send a message to start the conversation</small>
                    </div>
                  ) : (
                    userInteraction.map((msg, idx) => (
                <div
                  key={idx}
                        className={`inbox-message ${
                          msg.sender?.id === userId
                            ? "inbox-message-sent"
                            : "inbox-message-received"
                        }`}
                >
                  {msg.sender?.id !== userId && (
                    <img
                            src={
                              recentUsers[selectedMessage]?.profile_photo
                                ? `${process.env.REACT_APP_API_URL}${recentUsers[selectedMessage].profile_photo}`
                                : `data:image/svg+xml;utf8,${encodeURIComponent(
                                    recentUsers[selectedMessage]?.gender === "male"
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
                      alt="Avatar"
                            className="inbox-message-avatar"
                          />
                        )}
                        <div className="inbox-message-content">
                          <div className="inbox-message-bubble">
                            {/* Display image if exists - Backend returns file_url */}
                            {(msg.file_url || msg.file) && (
                              <img
                                src={
                                  msg.file_url || 
                                  (msg.file?.startsWith('http') 
                                    ? msg.file 
                                    : `${process.env.REACT_APP_API_URL}/media/${msg.file}`)
                                }
                                alt="Shared image"
                                className="inbox-message-image"
                                onClick={() => {
                                  const imageUrl = msg.file_url || 
                                    (msg.file?.startsWith('http') 
                                      ? msg.file 
                                      : `${process.env.REACT_APP_API_URL}/media/${msg.file}`);
                                  
                                  // Collect all images from current conversation
                                  const allImages = userInteraction
                                    .filter(m => m.file_url || m.file)
                                    .map(m => m.file_url || 
                                      (m.file?.startsWith('http') 
                                        ? m.file 
                                        : `${process.env.REACT_APP_API_URL}/media/${m.file}`)
                                    );
                                  
                                  // Find current image index
                                  const currentIndex = allImages.indexOf(imageUrl);
                                  
                                  setViewingImages(allImages);
                                  setCurrentImageIndex(currentIndex >= 0 ? currentIndex : 0);
                                }}
                                onError={(e) => {
                                  console.error("❌ Image failed to load:", {
                                    file: msg.file,
                                    file_url: msg.file_url,
                                    content: msg.content
                                  });
                                  e.target.style.display = 'none';
                                }}
                              />
                            )}
                            {/* Display text content */}
                            {msg.content && msg.content !== '📷 Photo' && (
                    <p>{msg.content}</p>
                            )}
                          </div>
                          <span className="inbox-message-time">
                      {convertDateTime(msg.timestamp || "Time not available")}
                    </span>
                  </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Multiple Images Preview */}
                {selectedImages.length > 0 && (
                  <div className="images-preview-container">
                    <div className="images-preview-header">
                      <span>{selectedImages.length} image{selectedImages.length > 1 ? 's' : ''} selected</span>
                      <button 
                        className="images-clear-all"
                        onClick={() => {
                          setSelectedImages([]);
                          if (imageInputRef.current) {
                            imageInputRef.current.value = "";
                          }
                        }}
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="images-preview-grid">
                      {selectedImages.map((img, idx) => (
                        <div key={idx} className="image-preview-wrapper">
                          <img 
                            src={URL.createObjectURL(img)} 
                            alt={`Preview ${idx + 1}`} 
                            className="image-preview"
                          />
                          <button 
                            className="image-remove-btn"
                            onClick={() => removeSelectedImage(idx)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat Input */}
                <div className="inbox-chat-input-container">
                  <div className="emoji-picker-wrapper">
                    <button 
                      className="inbox-input-action-btn" 
                      title="Emoji"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <FiSmile size={20} />
                    </button>
                    
                    {showEmojiPicker && (
                      <div className="emoji-picker-popup">
                        {/* Search Bar */}
                        <div className="emoji-search-bar">
                          <FiSearch className="emoji-search-icon" />
                          <input
                            type="text"
                            placeholder="Search emojis..."
                            value={emojiSearch}
                            onChange={(e) => setEmojiSearch(e.target.value)}
                            className="emoji-search-input"
                          />
                        </div>

                        {/* Categories */}
                        {!emojiSearch && (
                          <div className="emoji-categories">
                            {emojiCategories.map((cat) => (
                              <button
                                key={cat.slug}
                                className={`emoji-category-btn ${
                                  selectedCategory === cat.slug ? 'active' : ''
                                }`}
                                onClick={() => setSelectedCategory(cat.slug)}
                                title={cat.slug.replace('-', ' ')}
                              >
                                {cat.slug === 'smileys-emotion' && '😊'}
                                {cat.slug === 'people-body' && '👋'}
                                {cat.slug === 'animals-nature' && '🐱'}
                                {cat.slug === 'food-drink' && '🍕'}
                                {cat.slug === 'travel-places' && '✈️'}
                                {cat.slug === 'activities' && '⚽'}
                                {cat.slug === 'objects' && '💡'}
                                {cat.slug === 'symbols' && '❤️'}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Emoji Grid */}
                        <div className="emoji-grid">
                          {loadingEmojis ? (
                            <div className="emoji-loading">Loading...</div>
                          ) : emojis.length > 0 ? (
                            emojis.map((emoji, idx) => (
                              <button
                                key={idx}
                                className="emoji-btn"
                                onClick={() => handleEmojiClick(emoji)}
                                title={emoji.unicodeName}
                              >
                                {emoji.character}
                              </button>
                            ))
                          ) : (
                            <div className="emoji-empty">No emojis found</div>
                          )}
                        </div>
                      </div>
                    )}
            </div>

              <input
                type="text"
                    id="inbox-message-input"
                    name="message"
                    placeholder="Message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="inbox-chat-input"
                    autoComplete="off"
                  />
                  
                  <input
                    ref={imageInputRef}
                    type="file"
                    id="inbox-image-upload"
                    name="image"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleImageSelect}
                  />
                  
                  <button 
                    className="inbox-input-action-btn" 
                    title="Add Photo"
                    onClick={handleImageUpload}
                  >
                    <FiImage size={20} />
                  </button>
                  
                  {newMessage.trim() || selectedImages.length > 0 ? (
              <button
                      onClick={handleSendMessage}
                      className="inbox-send-btn"
                    >
                      {selectedImages.length > 1 ? `Send (${selectedImages.length})` : 'Send'}
                    </button>
                  ) : (
                    <button className="inbox-input-action-btn" title="More">
                      <FiMoreHorizontal size={20} />
              </button>
                  )}
            </div>
              </>
            )}
          </div>
        </div>
        </div>
      </DashboardLayout>
  );
};

export default Inbox;
