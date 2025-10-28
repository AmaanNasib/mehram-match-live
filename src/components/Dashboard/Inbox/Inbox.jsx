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
  FiChevronDown,
} from "react-icons/fi";
import { MdEdit } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import api from "../../../api";
import axios from "axios";
import { convertDateTime } from "../../../apiUtils";
import ContextMenu from "./ContextMenu";
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
  const chatMessagesRef = React.useRef(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [userScrolling, setUserScrolling] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const location = useLocation();
  // Only honor the target user passed via navigation state; do not use route param (which is current user id)
  const requestedOpenUserId = location.state?.openUserId ? Number(location.state.openUserId) : null;

  // Format relative time like WhatsApp/Instagram
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Active recently";
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (seconds < 60) return "Active just now";
    if (minutes < 60) return `Active ${minutes} min ago`;
    if (hours < 24) return `Active ${hours} hr${hours > 1 ? 's' : ''} ago`;
    if (days === 1) return "Active yesterday";
    if (days < 7) return `Active ${days} days ago`;
    // For older than a week, show date
    return `Active on ${then.toLocaleDateString()}`;
  };

  const getUserStatusText = (user) => {
    if (!user) return "";
    if (user.is_online) return "Active now";
    // Prefer explicit last_seen if available, else fallback to last_message_time
    const last = user.last_seen || user.last_message_time || null;
    return formatTimeAgo(last);
  };

  // Show only time under each message (HH:MM)
  const formatTimeOnly = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Message status helper (sent/delivered/read)
  const getMessageStatus = (msg) => {
    if (!msg) return 'sent';
    if (msg.is_read === true || msg.read === true || !!msg.read_at) return 'read';
    if (msg.delivered === true || !!msg.delivered_at) return 'delivered';
    return 'sent';
  };

  // Chat date label helpers
  const isSameDay = (a, b) => {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  };

  const formatChatDateLabel = (ts) => {
    if (!ts) return "";
    const date = new Date(ts);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (isSameDay(date, today)) return "Today";
    if (isSameDay(date, yesterday)) return "Yesterday";
    return date.toLocaleDateString();
  };

  const buildChatTimeline = (messages) => {
    const items = [];
    let lastLabel = null;
    for (const msg of messages) {
      const label = formatChatDateLabel(msg.timestamp || msg.created_at || msg.time);
      if (label && label !== lastLabel) {
        items.push({ type: 'separator', label });
        lastLabel = label;
      }
      items.push({ type: 'message', data: msg });
    }
    return items;
  };

  // Removed floating date chip and arrow button per request
  
  // Context Menu States
  const [contextMenu, setContextMenu] = useState({
    isVisible: false,
    position: { x: 0, y: 0 },
    message: null
  });
  const [replyToMessage, setReplyToMessage] = useState(null);

  const token = localStorage.getItem("token");
  const EMOJI_API_KEY = '855ca2a096c697a0c8e2da3a525e509acd7d1847';

  // Load member conversation messages
  const loadMemberConversation = async (user) => {
    if (!user.member_id) return;
    
    try {
      console.log('=== LOADING MEMBER CONVERSATION ===');
      console.log('User:', user);
      console.log('Member ID:', user.member_id);
      
      // Get messages for this member
      const messagesResponse = await api.get(`/api/agent/member/${user.member_id}/messages/`);
      const messages = messagesResponse.data.messages || [];
      
      console.log('Member messages:', messages);
      
      // Filter messages for this specific conversation
      const conversationMessages = messages.filter(
        msg => msg.other_user.id === user.id
      );
      
      console.log('Filtered conversation messages:', conversationMessages);
      
      // Convert to inbox format
      const formattedMessages = conversationMessages.map(msg => ({
        id: msg.id,
        content: msg.content,
        timestamp: msg.timestamp,
        is_sent_by_member: msg.is_sent_by_member,
        sender: {
          ...msg.sender,
          id: msg.is_sent_by_member ? user.member_id : user.id
        },
        receiver: {
          ...msg.other_user,
          id: msg.is_sent_by_member ? user.id : user.member_id
        },
        file: msg.file,
        created_at: msg.timestamp,
        time: msg.timestamp
      }));
      
      console.log('Formatted messages for inbox:', formattedMessages);
      setUserInteraction(formattedMessages);
      
      // Set the selected member for message rendering
      setSelectedMember({
        id: user.member_id,
        name: user.member_name
      });
      
    } catch (error) {
      console.error('Error loading member conversation:', error);
      setErrors('Error loading conversation. Please try again.');
    }
  };

  // Keep selection stable across refreshes
  const initialSelectionDoneRef = React.useRef(false);
  // Right-side user info panel with smooth transitions
  const [showInfoPanel, setShowInfoPanel] = useState(false); // mounted
  const [infoVisible, setInfoVisible] = useState(false); // for animation
  // More menu
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreBtnRef = React.useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (showMoreMenu && moreBtnRef.current && !moreBtnRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMoreMenu]);

  const blockUser = async () => {
    try {
      const receiverId = recentUsers[selectedMessage]?.id;
      if (!receiverId) return;
      await api.post(
        `/api/recieved/`,
        {
          action_by_id: userId,
          action_on_id: receiverId,
          blocked: true,
        },
      );
      setErrors('User blocked');
    } catch (err) {
      console.error('Block user failed', err);
      setErrors('Failed to block user');
    } finally {
      setShowMoreMenu(false);
    }
  };

  const reportUser = async () => {
    try {
      const receiverId = recentUsers[selectedMessage]?.id;
      if (!receiverId) return;
      await api.post(
        `/api/recieved/`,
        {
          action_by_id: userId,
          action_on_id: receiverId,
          blocked: true,
          status: 'Reported',
        },
      );
      setErrors('User reported');
    } catch (err) {
      console.error('Report user failed', err);
      setErrors('Failed to report');
    } finally {
      setShowMoreMenu(false);
    }
  };

  const clearLocalChat = () => {
    setUserInteraction([]);
    setShowMoreMenu(false);
  };

  useEffect(() => {
    if (errors) {
      const timer = setTimeout(() => {
        setErrors(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  // Handle agent inbox loading
  useEffect(() => {
    const loadAgentInbox = async () => {
      const currentRole = localStorage.getItem('role');
      const isImpersonating = localStorage.getItem('is_agent_impersonating') === 'true';
      
      // Check if user is an agent and not impersonating
      if (currentRole === 'agent' && !isImpersonating) {
        console.log('=== AGENT INBOX LOADING ===');
        console.log('Agent role detected, loading member conversations');
        
        try {
          // Get agent's members
          const membersResponse = await api.get('/api/agent/user_agent/?agent_id=' + userId);
          const members = membersResponse.data.member || [];
          
          console.log('Agent members:', members);
          
          if (members.length > 0) {
            // Get conversations for each member
            const allConversations = [];
            
            for (const member of members) {
              try {
                const conversationsResponse = await api.get(`/api/agent/member/${member.id}/conversations/`);
                const conversations = conversationsResponse.data.conversations || [];
                
                console.log(`Conversations for member ${member.name}:`, conversations);
                
                // Add member info to each conversation
                const conversationsWithMember = conversations.map(conv => ({
                  ...conv,
                  member: member,
                  member_id: member.id,
                  member_name: member.name
                }));
                
                allConversations.push(...conversationsWithMember);
              } catch (error) {
                console.error(`Error fetching conversations for member ${member.id}:`, error);
              }
            }
            
            console.log('All member conversations:', allConversations);
            
            // Convert to inbox format
            const inboxUsers = allConversations.map(conv => ({
              id: conv.other_user.id,
              name: conv.other_user.name,
              profile_photo: conv.other_user.profile_photo,
              gender: conv.other_user.gender,
              last_message: conv.last_message?.content || 'No messages',
              last_message_time: conv.last_message?.timestamp || conv.created_at,
              unread_count: conv.unread_count || 0,
              is_online: false,
              member_id: conv.member_id,
              member_name: conv.member_name
            }));
            
            console.log('Formatted inbox users:', inboxUsers);
            
            // Remove duplicates based on user ID
            const uniqueUsers = inboxUsers.reduce((acc, user) => {
              const existing = acc.find(u => u.id === user.id);
              if (!existing) {
                acc.push(user);
              } else if (new Date(user.last_message_time) > new Date(existing.last_message_time)) {
                // Keep the user with more recent message
                const index = acc.indexOf(existing);
                acc[index] = user;
              }
              return acc;
            }, []);
            
            console.log('Unique users for inbox:', uniqueUsers);
            
            setRecentUsers(uniqueUsers);
            
            // If there are conversations, select the first one
            if (uniqueUsers.length > 0) {
              setSelectedMessage(0);
              // Load messages for the first conversation
              loadMemberConversation(uniqueUsers[0]);
            }
          } else {
            console.log('No members found for agent');
            setRecentUsers([]);
          }
        } catch (error) {
          console.error('Error loading agent inbox:', error);
          setErrors('Error loading conversations. Please try again.');
        }
      }
    };
    
    loadAgentInbox();
  }, [userId]);

  // Handle agent message functionality
  useEffect(() => {
    const handleAgentMessage = async () => {
      // Check if coming from agent message
      const urlParams = new URLSearchParams(window.location.search);
      const isAgentMessage = urlParams.get('agentMessage') === 'true';
      
      if (isAgentMessage) {
        try {
          // Get stored data from localStorage
          const selectedMemberData = localStorage.getItem('selectedMemberForMessage');
          const targetUserData = localStorage.getItem('targetUserForMessage');
          
          if (selectedMemberData && targetUserData) {
            const selectedMember = JSON.parse(selectedMemberData);
            const targetUser = JSON.parse(targetUserData);
            
            console.log('=== AGENT MESSAGE DETECTED ===');
            console.log('Selected Member:', selectedMember);
            console.log('Target User:', targetUser);
            console.log('Expected conversation with:', targetUser.name, 'ID:', targetUser.id);
            
            // Set the selected member for message rendering
            setSelectedMember(selectedMember);
            
            // Send message using agent API
            const response = await api.post('/api/agent/member/send-message/', {
              member_id: selectedMember.id,
              receiver_id: targetUser.id,
              content: `Hi! I'm ${selectedMember.name || selectedMember.first_name}. I'd like to connect with you.`
            });
            
            console.log('Agent message sent successfully:', response.data);
            
            // Clear stored data
            localStorage.removeItem('selectedMemberForMessage');
            localStorage.removeItem('targetUserForMessage');
            
            // Show success message
            setErrors('Message sent successfully on behalf of member!');
            
            // For agent, we need to use agent-specific APIs to get member's conversations
            setTimeout(async () => {
              try {
                console.log('=== FETCHING AGENT MEMBER CONVERSATIONS ===');
                console.log('Member ID:', selectedMember.id);
                
                // Get member's conversations using agent API
                const conversationsResponse = await api.get(`/api/agent/member/${selectedMember.id}/conversations/`);
                console.log('Member conversations:', conversationsResponse.data);
                
                // Find the conversation with target user
                const targetConversation = conversationsResponse.data.conversations.find(
                  conv => conv.other_user.id === targetUser.id
                );
                
                if (targetConversation) {
                  console.log('Found target conversation:', targetConversation);
                  
                  // Get messages for this specific conversation
                  const messagesResponse = await api.get(`/api/agent/member/${selectedMember.id}/messages/`);
                  console.log('Member messages:', messagesResponse.data);
                  
                  // Filter messages for this specific conversation
                  const conversationMessages = messagesResponse.data.messages.filter(
                    msg => msg.other_user.id === targetUser.id
                  );
                  
                  console.log('Conversation messages with target user:', conversationMessages);
                  
                  // Create a user object for the conversation list
                  const conversationUser = {
                    id: targetUser.id,
                    name: targetUser.name || `User ${targetUser.id}`,
                    profile_photo: targetUser.photo || null,
                    gender: targetUser.gender || null,
                    last_message: conversationMessages.length > 0 ? conversationMessages[conversationMessages.length - 1].content : 'New conversation',
                    last_message_time: conversationMessages.length > 0 ? conversationMessages[conversationMessages.length - 1].timestamp : new Date().toISOString(),
                    unread_count: 0,
                    is_online: false,
                  };
                  
                  // Update the conversation list
                  setRecentUsers([conversationUser]);
                  setSelectedMessage(0);
                  
                  // Convert agent messages to inbox format and set as user interaction
                  const formattedMessages = conversationMessages.map(msg => ({
                    id: msg.id,
                    content: msg.content,
                    timestamp: msg.timestamp,
                    is_sent_by_member: msg.is_sent_by_member,
                    sender: {
                      ...msg.sender,
                      id: msg.is_sent_by_member ? selectedMember.id : targetUser.id
                    },
                    receiver: {
                      ...msg.other_user,
                      id: msg.is_sent_by_member ? targetUser.id : selectedMember.id
                    },
                    file: msg.file,
                    created_at: msg.timestamp,
                    time: msg.timestamp
                  }));
                  
                  console.log('Formatted messages for inbox:', formattedMessages);
                  setUserInteraction(formattedMessages);
                  
                } else {
                  console.log('No existing conversation found, creating new one');
                  
                  // Create new conversation entry
                  const newUser = {
                    id: targetUser.id,
                    name: targetUser.name || `User ${targetUser.id}`,
                    profile_photo: targetUser.photo || null,
                    gender: targetUser.gender || null,
                    last_message: `Hi! I'm ${selectedMember.name || selectedMember.first_name}. I'd like to connect with you.`,
                    last_message_time: new Date().toISOString(),
                    unread_count: 0,
                    is_online: false,
                  };
                  
                  setRecentUsers([newUser]);
                  setSelectedMessage(0);
                  
                  // Set the sent message as the conversation starter
                  const newMessage = {
                    id: Date.now(),
                    content: `Hi! I'm ${selectedMember.name || selectedMember.first_name}. I'd like to connect with you.`,
                    timestamp: new Date().toISOString(),
                    is_sent_by_member: true,
                    sender: {
                      id: selectedMember.id,
                      name: selectedMember.name || selectedMember.first_name,
                      is_member: true
                    },
                    receiver: targetUser,
                    file: null,
                    created_at: new Date().toISOString(),
                    time: new Date().toISOString()
                  };
                  
                  setUserInteraction([newMessage]);
                }
                
              } catch (error) {
                console.error('Error fetching agent conversations:', error);
                setErrors('Error loading conversation. Please try again.');
              }
            }, 1000);
            
          } else {
            console.log('No agent message data found in localStorage');
          }
        } catch (error) {
          console.error('Failed to send agent message:', error);
          setErrors(error.response?.data?.error || 'Failed to send message. Please try again.');
          
          // Clear stored data even on error
          localStorage.removeItem('selectedMemberForMessage');
          localStorage.removeItem('targetUserForMessage');
        }
      }
    };
    
    handleAgentMessage();
  }, []);

  useEffect(() => {
  const fetchRecentUsers = async () => {
    // Check if user is an agent and not impersonating
    const currentRole = localStorage.getItem('role');
    const isImpersonating = localStorage.getItem('is_agent_impersonating') === 'true';
    
    // Only run this for regular users, not for agents
    if (currentRole === 'agent' && !isImpersonating) {
      console.log('Skipping regular user inbox loading for agent');
      return;
    }
    
    try {
      const response = await api.get(
        `/api/chats/recent-users/`
      );
        // Filter users who have at least one message
        let usersWithMessages = response.data.filter(
          (user) => user.last_message && user.last_message.trim() !== ""
        );

        // If a specific user is requested but not present in list, fetch and include them
        if (requestedOpenUserId && !usersWithMessages.some(u => u.id === Number(requestedOpenUserId))) {
          try {
            const userResp = await api.get(
              `/api/user/${requestedOpenUserId}/`
            );
            const u = userResp.data || {};
            usersWithMessages = [
              {
                id: Number(requestedOpenUserId),
                name: u.name || u.full_name || u.username || `User ${requestedOpenUserId}`,
                profile_photo: u.profile_photo || u.upload_photo || null,
                gender: u.gender || null,
                last_message: "",
                last_message_time: null,
                unread_count: 0,
                is_online: false,
              },
              ...usersWithMessages,
            ];
          } catch (e) {
            // If user fetch fails, still allow opening empty thread by injecting minimal record
            usersWithMessages = [
              {
                id: Number(requestedOpenUserId),
                name: `User ${requestedOpenUserId}`,
                profile_photo: null,
                gender: null,
                last_message: "",
                last_message_time: null,
                unread_count: 0,
                is_online: false,
              },
              ...usersWithMessages,
            ];
          }
        }
        
        // Preserve unread_count = 0 for currently open conversation
        setRecentUsers((prevUsers) => {
          const updatedUsers = usersWithMessages.map((newUser) => {
            const existingUser = prevUsers.find((u) => u.id === newUser.id);
            // If this user was already read in current session, keep it 0
            if (existingUser && existingUser.unread_count === 0) {
              return { ...newUser, unread_count: 0 };
            }
            return newUser;
          });
          
          // Keep currently selected user pinned even if list order changes
          if (selectedMessage !== null && prevUsers[selectedMessage]) {
            const selectedId = prevUsers[selectedMessage].id;
            const newIndex = updatedUsers.findIndex(u => u.id === selectedId);
            if (newIndex !== -1 && newIndex !== selectedMessage) {
              setSelectedMessage(newIndex);
            }
          }

          // Preselect requested user only once on first load
          if (!initialSelectionDoneRef.current && selectedMessage === null && updatedUsers.length > 0) {
            let targetIndex = -1;
            if (requestedOpenUserId) {
              targetIndex = updatedUsers.findIndex(u => u.id === Number(requestedOpenUserId));
            }
            if (targetIndex === -1) {
              // Fallback: select latest conversation
              const latestConversation = updatedUsers.reduce((latest, current) => {
                const latestTime = new Date(latest.last_message_time || 0);
                const currentTime = new Date(current.last_message_time || 0);
                return currentTime > latestTime ? current : latest;
              });
              targetIndex = updatedUsers.findIndex(user => user.id === latestConversation.id);
            }
            if (targetIndex !== -1) {
              const receiverId = updatedUsers[targetIndex].id;
              setTimeout(() => {
                setSelectedMessage(targetIndex);
                markMessagesAsRead(receiverId);
                fetchUserInteraction(receiverId);
                initialSelectionDoneRef.current = true;
              }, 100);
            }
          }
          
          return updatedUsers;
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
      const response = await api.post(
        `/api/chats/${receiverId}/mark-read/`,
        {}
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
      const response = await api.get(
        `/api/chats/${receiverId}/messages/`
      );
      console.log("📩 Messages received:", response.data);
      // Log to check if file field exists
      const messagesWithFiles = response.data.filter(m => m.file || m.image);
      if (messagesWithFiles.length > 0) {
        console.log("📸 Messages with images:", messagesWithFiles);
      }
      
      // Check if new messages arrived
      const currentMessageCount = response.data.length;
      if (currentMessageCount > lastMessageCount && lastMessageCount > 0) {
        // New messages arrived, show scroll to bottom button
        setShowScrollToBottom(true);
      }
      setLastMessageCount(currentMessageCount);
      
      setUserInteraction(response.data);
      
      // Only auto scroll to bottom if user is not actively scrolling
      setTimeout(() => {
        if (chatMessagesRef.current && !userScrolling) {
          const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
          const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
          
          // Only auto scroll if user was already at bottom and not scrolling
          if (isAtBottom) {
            scrollToBottom();
          } else {
            // User is reading old messages, just show the scroll button
            setShowScrollToBottom(true);
          }
        }
      }, 100);
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

  // Scroll to bottom function with smooth animation
  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      // Check if smooth scrolling is supported
      if ('scrollBehavior' in document.documentElement.style) {
        chatMessagesRef.current.scrollTo({
          top: chatMessagesRef.current.scrollHeight,
          behavior: 'smooth'
        });
      } else {
        // Fallback for browsers that don't support smooth scroll
        const target = chatMessagesRef.current.scrollHeight;
        const start = chatMessagesRef.current.scrollTop;
        const distance = target - start;
        const duration = 500; // milliseconds
        let startTime = null;

        const animation = (currentTime) => {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);
          
          // Easing function for smooth animation
          const ease = progress * (2 - progress);
          
          chatMessagesRef.current.scrollTop = start + distance * ease;
          
          if (progress < 1) {
            requestAnimationFrame(animation);
          }
        };
        
        requestAnimationFrame(animation);
      }
      setShowScrollToBottom(false);
    }
  };

  // Handle scroll events to show/hide scroll to bottom button
  const handleScroll = () => {
    if (chatMessagesRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      
      // Mark that user is actively scrolling
      setUserScrolling(true);
      
      // Show/hide scroll to bottom button
      setShowScrollToBottom(!isAtBottom);
      
      // Reset userScrolling after a delay
      setTimeout(() => {
        setUserScrolling(false);
      }, 1000);
    }
  };

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && selectedImages.length === 0) || selectedMessage === null) return;

    const receiverId = recentUsers[selectedMessage]?.id;
    const currentRole = localStorage.getItem('role');
    const isImpersonating = localStorage.getItem('is_agent_impersonating') === 'true';
    const selectedUser = recentUsers[selectedMessage];

    try {
      // Check if this is an agent conversation
      if (currentRole === 'agent' && !isImpersonating && selectedUser?.member_id) {
        // Agent sending message on behalf of member
        if (selectedImages.length === 0) {
          await api.post('/api/agent/member/send-message/', {
            member_id: selectedUser.member_id,
            receiver_id: receiverId,
            content: newMessage,
          });
        } else {
          // Send each image as a separate message (WhatsApp style)
          const messageContent = newMessage.trim() || '📷 Photo';
          
          for (let i = 0; i < selectedImages.length; i++) {
            const formData = new FormData();
            formData.append('member_id', selectedUser.member_id);
            formData.append('receiver_id', receiverId);
            formData.append('content', i === 0 ? messageContent : '📷 Photo');
            formData.append('file', selectedImages[i]);

            await api.post('/api/agent/member/send-message/', formData);
          }
          
          console.log(`✅ Sent ${selectedImages.length} images as agent`);
        }
        
        // Reload member conversation after sending
        loadMemberConversation(selectedUser);
      } else {
        // Regular user message sending
        if (selectedImages.length === 0) {
          await api.post(
            `/api/user/messages/`,
            {
              receiver_id: receiverId,
              content: newMessage,
            },
          );
        } else {
          // Send each image as a separate message (WhatsApp style)
          const messageContent = newMessage.trim() || '📷 Photo';
          
          for (let i = 0; i < selectedImages.length; i++) {
            const formData = new FormData();
            formData.append('receiver_id', receiverId);
            formData.append('content', i === 0 ? messageContent : '📷 Photo');
            formData.append('file', selectedImages[i]);

            await api.post(
              `/api/user/messages/`,
              formData,
          );
          }
          
          console.log(`✅ Sent ${selectedImages.length} images`);
        }
        
        // Reload user interaction after sending
        fetchUserInteraction(receiverId);
      }

      setNewMessage("");
      setSelectedImages([]);
      setReplyToMessage(null); // Clear reply after sending
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      
      // Auto scroll to bottom after sending message
      setTimeout(() => {
        scrollToBottom();
      }, 200);
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

  // Context Menu Functions
  const showContextMenu = (e, message) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    // Adjust position if menu would go off screen
    const menuWidth = 250;
    const menuHeight = 300;
    const adjustedX = x + menuWidth > window.innerWidth ? x - menuWidth : x;
    const adjustedY = y + menuHeight > window.innerHeight ? y - menuHeight : y;
    
    setContextMenu({
      isVisible: true,
      position: { x: adjustedX, y: adjustedY },
      message: message
    });
  };

  const hideContextMenu = () => {
    setContextMenu({
      isVisible: false,
      position: { x: 0, y: 0 },
      message: null
    });
  };

  const handleContextMenuAction = {
    reply: (message) => {
      setReplyToMessage(message);
      // Don't pre-fill message content for reply
      setNewMessage("");
    },
    
    copy: (message) => {
      navigator.clipboard.writeText(message.content);
      setErrors("Message copied to clipboard!");
    },
    
    forward: (message) => {
      setErrors("Forward feature coming soon!");
    },
    
    star: (message) => {
      setErrors("Star feature coming soon!");
    },
    
    pin: (message) => {
      setErrors("Pin feature coming soon!");
    },
    
    delete: (message) => {
      if (window.confirm("Are you sure you want to delete this message?")) {
        // TODO: Implement delete message API call
        setErrors("Delete feature coming soon!");
      }
    },
    
    select: (message) => {
      setErrors("Select feature coming soon!");
    },
    
    share: (message) => {
      if (navigator.share) {
        navigator.share({
          title: 'Shared Message',
          text: message.content
        });
      } else {
        navigator.clipboard.writeText(message.content);
        setErrors("Message copied to clipboard!");
      }
    },
    
    emojiReact: (emoji) => {
      // TODO: Implement emoji reaction API call
      setErrors(`Reacted with ${emoji}!`);
    }
  };

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
                      
                      // Check if this is an agent conversation
                      const currentRole = localStorage.getItem('role');
                      const isImpersonating = localStorage.getItem('is_agent_impersonating') === 'true';
                      
                      if (currentRole === 'agent' && !isImpersonating && user.member_id) {
                        // Load member conversation
                        loadMemberConversation(user);
                      } else {
                        // Regular user conversation
                        // Immediately clear unread count
                        markMessagesAsRead(user.id);
                        
                        // Fetch messages
                        fetchUserInteraction(user.id);
                      }
                      
                      // Auto scroll to bottom when switching conversation
                      setTimeout(() => {
                        scrollToBottom();
                      }, 300);

                      // Clear any existing polling
                        if (pollingIntervalId) {
                          clearInterval(pollingIntervalId);
                        }

                      // Start new polling for this conversation (only for regular users)
                      if (!(currentRole === 'agent' && !isImpersonating)) {
                        const intervalId = setInterval(() => {
                          fetchUserInteraction(user.id);
                        }, 5000);
                        setPollingIntervalId(intervalId);
                      }
                      }}
                    >
                    <div className="inbox-user-avatar">
                      <img
                        src={
                          user.profile_photo
                            ? `${process.env.REACT_APP_API_URL}${user.profile_photo}`
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
                      <div className="inbox-user-name">
                        {user.name}
                        {user.member_name && (
                          <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
                            (via {user.member_name})
                          </span>
                        )}
                      </div>
                      <div className="inbox-user-last-message">
                        {user.last_message && user.last_message.trim() !== "" ? user.last_message : getUserStatusText(user)}
                      </div>
                          </div>
                    <div className="inbox-user-meta">
                      <span className="inbox-user-time">
                        {getUserStatusText(user)}
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
                  <div className="inbox-chat-header-left" style={{ cursor: 'pointer' }} onClick={() => navigate(`/details/${recentUsers[selectedMessage]?.id}`)}>
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
                      <span className="inbox-chat-status">{getUserStatusText(recentUsers[selectedMessage])}</span>
                    </div>
                  </div>
                  <div className="inbox-chat-header-actions">
                    <button className="inbox-action-btn" title="Voice Call">
                      <FaPhone size={18} />
                    </button>
                    <button className="inbox-action-btn" title="Video Call">
                      <FaVideo size={18} />
                    </button>
                    <button className="inbox-action-btn" title="User Info" onClick={() => { setShowInfoPanel(true); setTimeout(() => setInfoVisible(true), 10); }}>
                      <FaInfoCircle size={18} />
                    </button>
              </div>
            </div>

                {/* Chat Messages */}
                <div 
                  className="inbox-chat-messages"
                  ref={chatMessagesRef}
                  onScroll={handleScroll}
                >
                  {userInteraction.length === 0 ? (
                    <div className="inbox-no-messages">
                      <FiMessageCircle size={48} />
                      <p>No messages yet</p>
                      <small>Send a message to start the conversation</small>
                    </div>
                  ) : (
                    buildChatTimeline(userInteraction).map((item, idx) => (
                      item.type === 'separator' ? (
                        <div
                          key={`sep-${idx}`}
                          className="inbox-date-separator"
                          style={{ display: 'flex', justifyContent: 'center', margin: '14px 0' }}
                        >
                          <span style={{ background: '#e5e7eb', color: '#374151', fontSize: '12px', fontWeight: 600, padding: '6px 10px', borderRadius: '12px' }}>
                            {item.label}
                          </span>
                        </div>
                      ) : (
                <div
                  key={idx}
                        className={`inbox-message ${
                          item.data.sender?.id === (selectedMember?.id || userId)
                            ? "inbox-message-sent"
                            : "inbox-message-received"
                        }`}
                        onContextMenu={(e) => showContextMenu(e, item.data)}
                        onTouchStart={(e) => {
                          // For mobile long press
                          e.currentTarget.longPressTimer = setTimeout(() => {
                            showContextMenu(e, item.data);
                          }, 500);
                        }}
                        onTouchEnd={(e) => {
                          if (e.currentTarget.longPressTimer) {
                            clearTimeout(e.currentTarget.longPressTimer);
                          }
                        }}
                        onTouchMove={(e) => {
                          if (e.currentTarget.longPressTimer) {
                            clearTimeout(e.currentTarget.longPressTimer);
                          }
                        }}
                >
                  {item.data.sender?.id !== (selectedMember?.id || userId) && (
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
                          {/* Reply Preview */}
                          {replyToMessage && replyToMessage.id === item.data.id && (
                            <div className="reply-preview">
                              <div className="reply-line"></div>
                              <div className="reply-content">
                                <div className="reply-sender">
                                  {replyToMessage.sender?.id === (selectedMember?.id || userId) ? 'You' : recentUsers[selectedMessage]?.name}
                                </div>
                                <div className="reply-text">
                                   {(replyToMessage.file_url || replyToMessage.file) ? (
                                    <div className="reply-image-preview">
                                      <img 
                                        src={
                                          replyToMessage.file_url || 
                                          (replyToMessage.file?.startsWith('http') 
                                            ? replyToMessage.file 
                                            : `${process.env.REACT_APP_API_URL}/media/${replyToMessage.file}`)
                                        }
                                        alt="Reply preview"
                                        className="reply-thumbnail"
                                      />
                                      <span className="reply-image-text">📷 Image</span>
                                    </div>
                                  ) : (
                                    replyToMessage.content || 'Message'
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="inbox-message-bubble">
                            {/* Display image if exists - Backend returns file_url */}
                            {(item.data.file_url || item.data.file) && (
                              <img
                                src={
                                  item.data.file_url || 
                                  (item.data.file?.startsWith('http') 
                                    ? item.data.file 
                                    : `${process.env.REACT_APP_API_URL}/media/${item.data.file}`)
                                }
                                alt="Shared image"
                                className="inbox-message-image"
                                onClick={() => {
                                  const imageUrl = item.data.file_url || 
                                    (item.data.file?.startsWith('http') 
                                      ? item.data.file 
                                      : `${process.env.REACT_APP_API_URL}/media/${item.data.file}`);
                                  
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
                                    file: item.data.file,
                                    file_url: item.data.file_url,
                                    content: item.data.content
                                  });
                                  e.target.style.display = 'none';
                                }}
                              />
                            )}
                            {/* Display text content */}
                            {item.data.content && item.data.content !== '📷 Photo' && (
                    <p>{item.data.content}</p>
                            )}
                          </div>
                          <span className="inbox-message-time" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {formatTimeOnly(item.data.timestamp)}
                            {item.data.sender?.id === (selectedMember?.id || userId) && (
                              <span
                                className={`msg-status ${getMessageStatus(item.data)}`}
                                title={getMessageStatus(item.data)}
                                style={{ display: 'inline-flex', alignItems: 'center' }}
                              >
                                {getMessageStatus(item.data) === 'read' ? (
                                  // double check blue
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M1 14l5 5L20 5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9 14l5 5L23 5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                ) : getMessageStatus(item.data) === 'delivered' ? (
                                  // double check gray
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M1 14l5 5L20 5" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9 14l5 5L23 5" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                ) : (
                                  // single check gray (sent)
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M1 14l5 5L20 5" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </span>
                            )}
                          </span>
                  </div>
                      </div>
                      )
                    ))
                  )}
                  
                  {/* Scroll to Bottom Button */}
                  {false && showScrollToBottom && (
                    <button 
                      className="scroll-to-bottom-btn"
                      onClick={scrollToBottom}
                      title="Scroll to latest messages"
                    >
                      <FiChevronDown size={20} />
                    </button>
                  )}
                </div>

                {/* User Info Side Panel */}
                {showInfoPanel && (
                  <>
                    <div
                      onClick={() => { setInfoVisible(false); setTimeout(() => setShowInfoPanel(false), 220); }}
                      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 40, opacity: infoVisible ? 1 : 0, transition: 'opacity 220ms ease', pointerEvents: infoVisible ? 'auto' : 'none' }}
                    />
                    <div
                      style={{
                        position: 'fixed', top: 0, right: 0, height: '100vh', width: '360px', background: '#fff',
                        zIndex: 41, boxShadow: '-8px 0 24px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column',
                        transform: `translateX(${infoVisible ? '0' : '100%'})`, transition: 'transform 220ms ease'
                      }}
                    >
                      <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Profile Info</h3>
                        <button onClick={() => { setInfoVisible(false); setTimeout(() => setShowInfoPanel(false), 220); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '18px' }}>✕</button>
                      </div>
                      <div style={{ padding: '16px', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={
                              recentUsers[selectedMessage]?.profile_photo
                                ? `${process.env.REACT_APP_API_URL}${recentUsers[selectedMessage].profile_photo}`
                                : `data:image/svg+xml;utf8,${encodeURIComponent(
                                  recentUsers[selectedMessage]?.gender === 'male'
                                    ? `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"#3b82f6\"><circle cx=\"12\" cy=\"8\" r=\"5\" fill=\"#bfdbfe\"/><path d=\"M12 14c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6z\" fill=\"#fbcfe8\"/></svg>`
                                    : `<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"#ec4899\"><circle cx=\"12\" cy=\"8\" r=\"5\" fill=\"#fbcfe8\"/><path d=\"M12 14c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6z\" fill=\"#fbcfe8\"/><circle cx=\"12\" cy=\"8\" r=\"2\" fill=\"#ec4899\"/></svg>`
                                )}`
                            }
                            alt={recentUsers[selectedMessage]?.name}
                            style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700 }}>{recentUsers[selectedMessage]?.name || 'User'}</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{getUserStatusText(recentUsers[selectedMessage])}</div>
                          </div>
                        </div>
                        <div style={{ marginTop: '16px', borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Conversation</div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '8px' }}>
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>Total messages</div>
                              <div style={{ fontWeight: 700 }}>{userInteraction?.length || 0}</div>
                            </div>
                            <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '8px' }}>
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>Last active</div>
                              <div style={{ fontWeight: 700 }}>{recentUsers[selectedMessage]?.last_message_time ? new Date(recentUsers[selectedMessage].last_message_time).toLocaleString() : '-'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Shared Media */}
                        <div style={{ marginTop: '16px', borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Shared Media</span>
                            <span style={{ fontSize: '11px', color: '#9ca3af' }}>{userInteraction.filter(m => m.file_url || m.file).length}</span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                            {userInteraction.filter(m => m.file_url || m.file).slice(0, 30).map((m, idx) => {
                              const src = m.file_url || (m.file?.startsWith('http') ? m.file : `${process.env.REACT_APP_API_URL}/media/${m.file}`);
                              return (
                                <img
                                  key={idx}
                                  src={src}
                                  alt={`media-${idx}`}
                                  style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px', cursor: 'pointer' }}
                                  onClick={() => {
                                    const allImages = userInteraction
                                      .filter(mm => mm.file_url || mm.file)
                                      .map(mm => mm.file_url || (mm.file?.startsWith('http') ? mm.file : `${process.env.REACT_APP_API_URL}/media/${mm.file}`));
                                    const currentIndex = allImages.indexOf(src);
                                    setViewingImages(allImages);
                                    setCurrentImageIndex(currentIndex >= 0 ? currentIndex : 0);
                                  }}
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              );
                            })}
                            {userInteraction.filter(m => m.file_url || m.file).length === 0 && (
                              <div style={{ fontSize: '12px', color: '#9ca3af' }}>No media shared yet</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}


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

                {/* Reply Preview */}
                {replyToMessage && (
                  <div className="reply-input-preview">
                    <div className="reply-preview-content">
                      <div className="reply-preview-header">
                        <span className="reply-label">Replying to:</span>
                        <button 
                          className="reply-cancel-btn"
                          onClick={() => setReplyToMessage(null)}
                        >
                          ✕
                        </button>
                      </div>
                      <div className="reply-preview-text">
                        {(replyToMessage.file_url || replyToMessage.file) ? (
                          <div className="reply-image-preview">
                            <img 
                              src={
                                replyToMessage.file_url || 
                                (replyToMessage.file?.startsWith('http') 
                                  ? replyToMessage.file 
                                  : `${process.env.REACT_APP_API_URL}/media/${replyToMessage.file}`)
                              }
                              alt="Reply preview"
                              className="reply-thumbnail"
                            />
                            <span className="reply-image-text">📷 Image</span>
                          </div>
                        ) : (
                          replyToMessage.content || 'Message'
                        )}
                      </div>
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
                    <div style={{ position: 'relative' }}>
                      <button
                        className="inbox-input-action-btn"
                        title="More"
                        onClick={() => setShowMoreMenu((s) => !s)}
                        ref={moreBtnRef}
                      >
                        <FiMoreHorizontal size={20} />
                      </button>
                      <div
                        style={{
                          position: 'absolute',
                          right: 0,
                          bottom: '42px',
                          background: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                          width: '220px',
                          transform: `translateY(${showMoreMenu ? '0' : '10px'})`,
                          opacity: showMoreMenu ? 1 : 0,
                          pointerEvents: showMoreMenu ? 'auto' : 'none',
                          transition: 'opacity 160ms ease, transform 160ms ease',
                          zIndex: 20
                        }}
                      >
                        <button onClick={() => navigate(`/details/${recentUsers[selectedMessage]?.id}`)} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', border: 'none', background: 'transparent', cursor: 'pointer' }}>View Profile</button>
                        <button onClick={reportUser} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', border: 'none', background: 'transparent', cursor: 'pointer' }}>Report</button>
                        <button onClick={blockUser} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#dc2626' }}>Block</button>
                        <div style={{ height: '1px', background: '#f3f4f6' }} />
                        <button onClick={clearLocalChat} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', border: 'none', background: 'transparent', cursor: 'pointer' }}>Clear Chat (local)</button>
                      </div>
                    </div>
                  )}
            </div>
              </>
            )}
          </div>
        </div>
        </div>

        {/* Context Menu */}
        <ContextMenu
          position={contextMenu.position}
          isVisible={contextMenu.isVisible}
          onClose={hideContextMenu}
          message={contextMenu.message}
          onReply={handleContextMenuAction.reply}
          onCopy={handleContextMenuAction.copy}
          onForward={handleContextMenuAction.forward}
          onStar={handleContextMenuAction.star}
          onPin={handleContextMenuAction.pin}
          onDelete={handleContextMenuAction.delete}
          onSelect={handleContextMenuAction.select}
          onShare={handleContextMenuAction.share}
          onEmojiReact={handleContextMenuAction.emojiReact}
        />
      </DashboardLayout>
  );
};

export default Inbox;
