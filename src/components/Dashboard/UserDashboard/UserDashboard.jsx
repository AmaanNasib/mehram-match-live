import React from "react";
import "./UserDashboard.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import { fetchDataWithTokenV2 } from "../../../apiUtils";
import MatchDetailsComponents from "./MatchDetails";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const UserDashboard = () => {
    const navigate = useNavigate();

    const [apiData, setApiData] = useState([]);
  const [apiData1, setApiData1] = useState([]);
  const [apiData2, setApiData2] = useState([]);
  const [apiData3, setApiData3] = useState([]);
  const [apiData4, setApiData4] = useState([]);
  const [apiData5, setApiData5] = useState({
    total_interest: 0,
    sent_interest: 0,
    received_interest: 0,
    shortlisted: 0,
    total_requests: 0,
    total_interactions: 0,
    total_shortlisted: 0,
    total_blocked: 0
  });
  const [apiData6, setApiData6] = useState([]);
  const [apiData7, setApiData7] = useState({});
  const [apiData8, setApiData8] = useState({});
  const [userProfile, setUserProfile] = useState({});
  const [userProfilePhoto, setUserProfilePhoto] = useState({});
  const [agentProfilePhoto, setAgentProfilePhoto] = useState({});
  const [agentProfile, setAgentProfile] = useState({});
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem('impersonating_user_id') || localStorage.getItem('userId'));
  
  // Week filtering states
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('till_date');
  const [chartLoading, setChartLoading] = useState(false);
  const [role, setRole] = useState(localStorage.getItem('role'));

  // Week options for dropdown
  const weekOptions = [
    { value: 'this_week', label: 'This Week (Sunday to now)' },
    { value: 'last_week', label: 'Last Week (7 days ago)' },
    { value: 'week', label: 'Week (7 days ago)' },
    { value: 'month', label: 'Month (30 days ago)' },
    { value: '3month', label: '3 Months (90 days ago)' },
    { value: '6month', label: '6 Months (180 days ago)' },
    { value: 'year', label: 'Year (365 days ago)' },
    { value: 'till_date', label: 'Till Date (All time)' }
  ];

  // Function to fetch graph data based on selected time period
  const fetchGraphData = async (period) => {
    console.log('Fetching graph data for period:', period);
    console.log('Role:', role, 'UserID:', userId);
    setChartLoading(true);
    try {
      const url = role === "agent" 
        ? `/api/agent/graph/?agent_id=${userId}&based_on=${period}` 
        : `/api/user/graph/?user_id=${userId}&based_on=${period}`;
        
      console.log('Graph API URL:', url);
        
      const parameter = {
        url: url,
        setterFunction: (data) => {
          console.log('Graph API response for period', period, ':', data);
          console.log('Data type:', typeof data);
          console.log('Data keys:', data ? Object.keys(data) : 'No data');
          
          // Merge API data with default values to ensure all fields exist
          const defaultData = {
            total_interest: 0,
            sent_interest: 0,
            received_interest: 0,
            shortlisted: 0,
            total_requests: 0,
            total_interactions: 0,
            total_shortlisted: 0,
            total_blocked: 0
          };
          
          const mergedData = { ...defaultData, ...data };
          
          // Special handling for shortlist data - use the same value as card
          if (role === "agent" && apiData2?.total_shortlisted_count) {
            mergedData.shortlisted = apiData2.total_shortlisted_count;
            mergedData.total_shortlisted = apiData2.total_shortlisted_count;
            console.log('Using shortlist data from apiData2 for graph:', apiData2.total_shortlisted_count);
          }
          
          // Special handling for blocked data for agent - use agent_direct_blocks from apiData3
          if (role === "agent" && apiData3?.total_blocked_count) {
            mergedData.total_blocked = apiData3.total_blocked_count;
            console.log('Using blocked data from apiData3 for agent graph:', mergedData.total_blocked);
          } else if (role === "agent") {
            // Fallback to API response if apiData3 is not available
            mergedData.total_blocked = data?.agent_direct_blocks || data?.total_blocked_count || 0;
            console.log('Using blocked data from API response for agent graph:', mergedData.total_blocked, 'from data:', data);
          }
          
          console.log('Merged data:', mergedData);
          
          setApiData5(mergedData);
        },
        setLoading: setChartLoading,
        setErrors: setErrors,
      };
      
      await fetchDataWithTokenV2(parameter);
    } catch (error) {
      console.error('Error fetching graph data for period', period, ':', error);
      setErrors(true);
    } finally {
      setChartLoading(false);
    }
  };

  // Handle time period change
  const handleTimePeriodChange = (period) => {
    setSelectedTimePeriod(period);
    fetchGraphData(period);
  };

  // useEffect to fetch data when time period changes
  useEffect(() => {
    if (selectedTimePeriod) {
      fetchGraphData(selectedTimePeriod);
    }
  }, [selectedTimePeriod, userId, role]);


  // Update userId and role when localStorage changes
  useEffect(() => {
    const newUserId = localStorage.getItem('impersonating_user_id') || localStorage.getItem('userId');
    const newRole = localStorage.getItem('role');
    setUserId(newUserId);
    setRole(newRole);
  }, []);

  // Note: Removed useEffect to avoid double API calls
  // Graph data is now fetched only when user manually changes the dropdown

  // Function to refresh all dashboard data
  const refreshDashboardData = () => {
    console.log('Refreshing dashboard data...');
    const isImpersonating = localStorage.getItem('is_agent_impersonating') === 'true';
    const currentToken = localStorage.getItem('token');
    console.log('UserDashboard - Role:', role, 'UserID:', userId, 'Impersonating:', isImpersonating);
    console.log('UserDashboard - Current Token:', currentToken ? 'Token exists' : 'No token');

    // For user role, use the correct API endpoint with user_id parameter
    if (role === "user" || role === "individual") {
      const parameter = {
        url: `/api/user/requested/?user_id=${userId}`,
        setterFunction: (data) => {
          console.log('Request data received for user:', data);
          // Map API response to expected format - API returns object with sent_data
          const sentCount = data?.sent_data?.length || 0;
          const receivedCount = data?.received_data?.length || 0;
          const totalCount = sentCount + receivedCount;

          const mappedData = {
            total_request_count: totalCount,
            request_sent: sentCount,
            request_received: receivedCount
          };
          console.log('Mapped request data:', mappedData);
          setApiData(mappedData);
        },
        setErrors: setErrors,
        setLoading: setLoading,
      };
      console.log('UserDashboard - Request API URL for user:', parameter.url);
      fetchDataWithTokenV2(parameter);
    } else {
      // For agent role, use the photo request counts API
      const parameter = {
        url: `/api/agent/photo-request/counts/`,
        setterFunction: (data) => {
          console.log('Photo request count data received for agent:', data);
          
          // Map API response to expected format for photo requests
          const summary = data?.summary || {};
          const members = data?.members || [];
          
          // Calculate totals from all members
          let totalSentAccepted = 0;
          let totalSentRejected = 0;
          let totalReceivedAccepted = 0;
          let totalReceivedRejected = 0;
          
          members.forEach(member => {
            const photoRequests = member.photo_requests || {};
            const sent = photoRequests.sent || {};
            const received = photoRequests.received || {};
            
            totalSentAccepted += sent.breakdown?.accepted || 0;
            totalSentRejected += sent.breakdown?.rejected || 0;
            totalReceivedAccepted += received.breakdown?.accepted || 0;
            totalReceivedRejected += received.breakdown?.rejected || 0;
          });
          
          const mappedData = {
            total_request_count: summary.total_interactions || 0,
            request_sent: summary.total_sent_requests || 0,
            request_received: summary.total_received_requests || 0,
            sent_request_accepted: totalSentAccepted,
            sent_request_rejected: totalSentRejected,
            received_request_accepted: totalReceivedAccepted,
            received_request_rejected: totalReceivedRejected
          };
          
          console.log('Mapped agent photo request data:', mappedData);
          setApiData(mappedData);
        },
        setErrors: setErrors,
        setLoading: setLoading,
      };
      console.log('UserDashboard - Photo Request API URL for agent:', parameter.url);
      fetchDataWithTokenV2(parameter);
    }

    // For user role, use the correct API endpoint with user_id parameter
    if (role === "user" || role === "individual") {
      const parameter1 = {
        url: `/api/user/interested/?user_id=${userId}`,
        setterFunction: (data) => {
          console.log('Interest data received for user:', data);
          console.log('Sent interests array:', data?.sent_interests);
          console.log('Received interests array:', data?.received_interests);
          // Map API response to expected format - API returns object with sent_interests
          // But sent_interests array contains both sent and received items based on status
          const allInterests = data?.sent_interests || [];
          const receivedArray = data?.received_interests || [];
          
          console.log('All interests array:', allInterests);
          console.log('Received interests array:', receivedArray);
          
          // Separate sent and received based on status field
          const sentInterests = allInterests.filter(item => item.status === "Sent");
          const receivedInterests = allInterests.filter(item => item.status === "Recieved");
          
          // Also include any items from received_interests array if it exists
          const additionalReceived = receivedArray || [];
          
          const sentCount = sentInterests.length;
          const receivedCount = receivedInterests.length + additionalReceived.length;
          const totalCount = sentCount + receivedCount;
          
          console.log('Filtered counts - Sent:', sentCount, 'Received:', receivedCount, 'Total:', totalCount);
          console.log('Sent interests:', sentInterests);
          console.log('Received interests:', receivedInterests);
          
          const mappedData = {
            total_interest_count: totalCount,
            interest_sent: sentCount,
            interest_received: receivedCount
          };
          console.log('Mapped interest data:', mappedData);
          setApiData1(mappedData);
        },
        setErrors: setErrors,
        setLoading: setLoading,
      };
      console.log('UserDashboard - Interest API URL for user:', parameter1.url);
      fetchDataWithTokenV2(parameter1);
    } else {
      // For agent role, use the API
      const parameter1 = {
        url: `/api/agent/interest/count/`,
        setterFunction: (data) => {
          console.log('Interest count data received for agent:', data);
          setApiData1(data);
        },
        setErrors: setErrors,
        setLoading: setLoading,
      };
      console.log('UserDashboard - Interest API URL for agent:', parameter1.url);
      fetchDataWithTokenV2(parameter1);
    }

    // For user role, use the correct API endpoint with user_id parameter
    if (role === "user" || role === "individual") {
      const parameter2 = {
        url: `/api/user/shortlisted/?user_id=${userId}`,
        setterFunction: (data) => {
          console.log('Shortlisted data received for user:', data);
          console.log('Shortlisted data type:', typeof data);
          console.log('Shortlisted data is array:', Array.isArray(data));
          console.log('Shortlisted data length:', data?.length);
          console.log('Shortlisted data keys:', data ? Object.keys(data) : 'No data');

          // Map API response to expected format - handle different response formats
          let shortlistCount = 0;

          if (Array.isArray(data)) {
            // If API returns array directly
            shortlistCount = data.length;
          } else if (data && typeof data === 'object') {
            // If API returns object with array property
            if (data.shortlisted && Array.isArray(data.shortlisted)) {
              shortlistCount = data.shortlisted.length;
            } else if (data.sent_shortlisted && Array.isArray(data.sent_shortlisted)) {
              shortlistCount = data.sent_shortlisted.length;
            } else if (data.total_shortlisted_count) {
              shortlistCount = data.total_shortlisted_count;
            } else {
              // Try to find any array property
              const arrayKeys = Object.keys(data).filter(key => Array.isArray(data[key]));
              if (arrayKeys.length > 0) {
                shortlistCount = data[arrayKeys[0]].length;
              }
            }
          }

          // If API returns 0 but we have userProfile data, try to calculate from there
          if (shortlistCount === 0 && userProfile && Array.isArray(userProfile)) {
            const shortlistFromProfile = userProfile.filter(user => user.is_shortlisted).length;
            console.log('Shortlist count from userProfile:', shortlistFromProfile);
            if (shortlistFromProfile > 0) {
              shortlistCount = shortlistFromProfile;
              console.log('Using shortlist count from userProfile:', shortlistCount);
            }
          }

          const mappedData = {
            total_shortlisted_count: shortlistCount
          };
          console.log('Final mapped shortlisted data:', mappedData);
          setApiData2(mappedData);
        },
        setErrors: (error) => {
          console.error('Shortlisted API error:', error);
          setErrors(error);
        },
        setLoading: setLoading,
      };
      console.log('UserDashboard - Shortlisted API URL for user:', parameter2.url);
      console.log('UserDashboard - About to call shortlist API with userId:', userId);
      fetchDataWithTokenV2(parameter2);
    } else {
      // For agent role, use the API with proper agent_id parameter
      const parameter2 = {
        url: `/api/agent/shortlist/?agent_id=${userId}`,
        setterFunction: (data) => {
          console.log('Agent shortlist data received:', data);
          console.log('Agent shortlist data type:', typeof data);
          console.log('Agent shortlist data is array:', Array.isArray(data));
          console.log('Agent shortlist data keys:', data ? Object.keys(data) : 'No data');
          
          // Handle different response structures
          let shortlistCount = 0;
          if (Array.isArray(data)) {
            // Filter only shortlisted: true items
            shortlistCount = data.filter(item => item.shortlisted === true).length;
            console.log('Filtered shortlist count (true only):', shortlistCount);
          } else if (data && typeof data === 'object') {
            // Check for count property
            if (data.total_shortlisted_count !== undefined) {
              shortlistCount = data.total_shortlisted_count;
            } else if (data.shortlisted !== undefined) {
              if (Array.isArray(data.shortlisted)) {
                // Filter only shortlisted: true items
                shortlistCount = data.shortlisted.filter(item => item.shortlisted === true).length;
              } else {
                shortlistCount = data.shortlisted;
              }
            } else if (data.count !== undefined) {
              shortlistCount = data.count;
            } else {
              // Try to get length from first array property and filter
              const keys = Object.keys(data);
              if (keys.length > 0 && Array.isArray(data[keys[0]])) {
                shortlistCount = data[keys[0]].filter(item => item.shortlisted === true).length;
              }
            }
          }
          console.log('Agent shortlist count:', shortlistCount);
          const mappedData = {
            total_shortlisted_count: shortlistCount
          };
          console.log('Mapped agent shortlist data:', mappedData);
          setApiData2(mappedData);
        },
        setErrors: (error) => {
          console.error('Agent shortlist API error:', error);
          setErrors(error);
        },
        setLoading: setLoading,
      };
      fetchDataWithTokenV2(parameter2);
    }

    // For user role, use the correct API endpoint with user_id parameter
    if (role === "user" || role === "individual") {
      const parameter3 = {
        url: `/api/user/blocked/?user_id=${userId}`,
        setterFunction: (data) => {
          console.log('Blocked data received for user:', data);
          // Map API response to expected format - API returns array, count the length
          const mappedData = {
            total_blocked_count: data?.length || 0
          };
          console.log('Mapped blocked data:', mappedData);
          setApiData3(mappedData);
        },
        setErrors: setErrors,
        setLoading: setLoading,
      };
      console.log('UserDashboard - Blocked API URL for user:', parameter3.url);
      fetchDataWithTokenV2(parameter3);
    } else {
      // For agent role, use the API
      const parameter3 = {
        url: '/api/agent/blocked/count/',
        setterFunction: (data) => {
          console.log('Agent blocked count data received:', data);
          // Map API response to expected format - API returns object with counts
          const mappedData = {
            total_blocked_count: data?.agent_direct_blocks || data?.total_blocked_count || 0
          };
          console.log('Mapped agent blocked data:', mappedData);
          setApiData3(mappedData);
        },
        setErrors: setErrors,
        setLoading: setLoading,
      };
      console.log('UserDashboard - Blocked API URL for agent:', parameter3.url);
      fetchDataWithTokenV2(parameter3);
    }

    // For user role, fetch matches data
    if (role === "user" || role === "individual") {
      const parameter4 = {
        url: `/api/user/matches/?user_id=${userId}&min_threshold=25`,
        setterFunction: (data) => {
          console.log('Matches data received for user:', data);
          // API returns direct array of matches
          const mappedData = {
            matches: data || [],
            total_matches: data?.length || 0
          };
          console.log('Mapped matches data:', mappedData);
          setApiData6(mappedData);
        },
        setErrors: setErrors,
        setLoading: setLoading,
      };
      console.log('UserDashboard - Matches API URL for user:', parameter4.url);
      fetchDataWithTokenV2(parameter4);
    } else {
      // For agent role, use the agent matches API
      const parameter4 = {
        url: '/api/agent/matches/',
        setterFunction: (data) => {
          console.log('Matches data received for agent:', data);
          setApiData6(data);
        },
        setErrors: setErrors,
        setLoading: setLoading,
      };
      console.log('UserDashboard - Matches API URL for agent:', parameter4.url);
      fetchDataWithTokenV2(parameter4);
    }

    const parameter5 = {
      url: role == "agent" ? '/api/agent/graph/?based_on=6month' : `/api/user/graph/?user_id=${userId}&based_on=week`,
      setterFunction: setApiData5,
      setErrors: setErrors,
      setLoading: setLoading,
    };
    fetchDataWithTokenV2(parameter5);
    // For user role, fetch matches data (duplicate API call - removing this one)
    // This API call is already handled above in the user role section

    // Add API call for agent members count
    if (role === "agent") {
      const parameterMembers = {
        url: `/api/agent/user_agent/?agent_id=${userId}`,
        setterFunction: (data) => {
          console.log('Agent members data received:', data);
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

          const membersCount = members.length;
          console.log('Agent members count:', membersCount);

          // Update apiData6 with members count for agents
          setApiData6(prevData => ({
            ...prevData,
            total_matches: membersCount,
            total_members: membersCount
          }));
        },
        setErrors: setErrors,
        setLoading: setLoading,
      };
      console.log('UserDashboard - Agent Members API URL:', parameterMembers.url);
      fetchDataWithTokenV2(parameterMembers);
    }

    // For user role, use the correct API endpoint with user_id parameter
    if (role === "user" || role === "individual") {
      const parameter7 = {
        url: `/api/total_interaction/count/?user_id=${userId}`,
        setterFunction: (data) => {
          console.log('Total interaction data received:', data);
          setApiData7(data);
        },
        setErrors: setErrors,
        setLoading: setLoading,
      };
      console.log('UserDashboard - Total Interaction API URL for user:', parameter7.url);
      fetchDataWithTokenV2(parameter7);
    } else {
      // For agent role, use the agent API
      const parameter7 = {
        url: '/api/agent/total_interaction/count/',
        setterFunction: setApiData7,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      console.log('UserDashboard - Total Interaction API URL for agent:', parameter7.url);
      fetchDataWithTokenV2(parameter7);
    }

    // Fetch user profile data
    const userProfileParam = {
      url: role === "agent" ? `/api/agent/${userId}/` : `/api/user/`,
      setterFunction: (data) => {
        if (role === "agent") {
          // For agents, this is the agent profile data
          console.log("Agent profile data:", data);
          console.log("Agent profile data type:", typeof data, "Is array:", Array.isArray(data));
          if (Array.isArray(data) && data.length > 0) {
            // If it's an array, get the first item or find by ID
            const agentData = data.find(agent => agent.id == userId) || data[0];
            console.log("Setting agentProfile:", agentData);
            setAgentProfile(agentData);
            setUserProfile(agentData); // Also set as userProfile for compatibility
          } else if (data && typeof data === 'object' && !Array.isArray(data)) {
            // Single object response
            console.log("Setting agentProfile (object):", data);
            setAgentProfile(data);
            setUserProfile(data); // Also set as userProfile for compatibility
          } else {
            console.log("No agent profile data found");
            setAgentProfile({});
          }
        } else {
          // For regular users
          setUserProfile(data);
        }
      },
      setErrors: setErrors,
      setLoading: setLoading,
    };
    fetchDataWithTokenV2(userProfileParam);

    // Fetch user profile photo separately (same logic as Header.jsx)
    const parameterPhoto = {
      url: role === "agent" ? `/api/agent/profile_photo/?agent_id=${userId}` : `/api/user/profile_photo/`,
      setterFunction: (data) => {
        console.log("Profile photo data:", data);
        console.log("Data type:", typeof data, "Is array:", Array.isArray(data));
        if (Array.isArray(data) && data.length > 0) {
          console.log("Setting userProfilePhoto:", data[data.length - 1]);
          setUserProfilePhoto(data[data.length - 1]); // Get the latest photo
          // Also update userProfile with photo data
          setUserProfile(prev => ({
            ...prev,
            user_profilephoto: data[data.length - 1]
          }));
        } else if (data && typeof data === 'object' && !Array.isArray(data)) {
          console.log("Setting userProfilePhoto (object):", data);
          setUserProfilePhoto(data);
          // Also update userProfile with photo data
          setUserProfile(prev => ({
            ...prev,
            user_profilephoto: data
          }));
        } else {
          console.log("No photo data found or unexpected format:", data);
          setUserProfilePhoto(null);
          setUserProfile(prev => ({ ...prev, user_profilephoto: null }));
        }
      },
      setErrors: setErrors,
      setLoading: setLoading,
    };
    fetchDataWithTokenV2(parameterPhoto);

    // Fetch agent profile photo if user is an agent
    if (role === "agent") {
      const agentPhotoParam = {
        url: `/api/agent/profile_photo/?agent_id=${userId}`, // Try with agent_id filter first
        setterFunction: (data) => {
          console.log("Agent profile photo data:", data);
          console.log("Agent photo data type:", typeof data, "Is array:", Array.isArray(data));
          if (Array.isArray(data) && data.length > 0) {
            // If filtered by agent_id, should return only current agent's photo
            const currentAgentPhoto = data.find(photo => photo.agent?.id == userId) || data[0];
            console.log("Setting agentProfilePhoto:", currentAgentPhoto);
            setAgentProfilePhoto(currentAgentPhoto);
          } else if (data && typeof data === 'object' && !Array.isArray(data)) {
            // Single object response
            console.log("Setting agentProfilePhoto (object):", data);
            setAgentProfilePhoto(data);
          } else {
            console.log("No agent photo data found or unexpected format:", data);
            setAgentProfilePhoto(null);
          }
        },
        setErrors: (error) => {
          console.log("Agent photo API error, trying fallback:", error);
          // If the filtered API fails, try without filter
          const fallbackParam = {
            url: `/api/agent/profile_photo/`,
            setterFunction: (data) => {
              console.log("Fallback agent profile photo data:", data);
              if (Array.isArray(data) && data.length > 0) {
                const currentAgentPhoto = data.find(photo => photo.agent?.id == userId);
                if (currentAgentPhoto) {
                  console.log("Setting agentProfilePhoto from fallback:", currentAgentPhoto);
                  setAgentProfilePhoto(currentAgentPhoto);
                } else {
                  console.log("No photo found for current agent in fallback");
                  setAgentProfilePhoto(null);
                }
              } else {
                setAgentProfilePhoto(null);
              }
            },
            setErrors: setErrors,
            setLoading: setLoading,
          };
          fetchDataWithTokenV2(fallbackParam);
        },
        setLoading: setLoading,
      };
      fetchDataWithTokenV2(agentPhotoParam);
    }
  };

  // Call refresh function on component mount and when userId/role changes
  useEffect(() => {
    refreshDashboardData();
  }, [userId, role]);

  // Listen for interest sent events to refresh data
  useEffect(() => {
    const handleInterestSent = () => {
      console.log('Interest sent event received, refreshing dashboard data...');
      refreshDashboardData();
    };

    // Listen for custom event
    window.addEventListener('interestSent', handleInterestSent);

    // Also listen for storage changes (in case data is updated in localStorage)
    const handleStorageChange = () => {
      refreshDashboardData();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('interestSent', handleInterestSent);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  useEffect(() => {

  }, []);

  // Function to get marital status badge color (matches Matches.jsx colors)
  const getMaritalBadgeColor = (maritalStatus) => {
    switch (maritalStatus?.toLowerCase()) {
      case "single":
      case "never married":
      case "unmarried":
        return "linear-gradient(135deg, #10b981 0%, #059669 100%)";
      case "married":
        return "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)";
      case "divorced":
        return "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
      case "khula":
        return "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
      case "widowed":
        return "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)";
      case "awaiting divorce":
        return "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
      default:
        return "linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)";
    }
  };

  // Matches page ke jaise progress bar color (percentage-based)
  const getMatchProgressColor = (matchPercentage) => {
    const percentage = parseFloat(matchPercentage) || 0;
    if (percentage >= 75) return "#10b981"; // Green
    if (percentage >= 60) return "#3b82f6"; // Blue
    if (percentage >= 45) return "#f59e0b"; // Orange
    if (percentage >= 30) return "#f97316"; // Dark orange
    return "#ef4444"; // Red
  };




  // Mock data for the stats
  const stats = {
    totalInterests: { total: 50, sent: 0, received: 0 },
    totalRequests: {
      total: 10,
      sent: "05",
      received: "05",
      sent_details: { pending: "0", accepted: "0" },
      received_details: { rejected: "00" },
    },
    totalInteractions: { total: 10, sent: "05", received: "05" },
    totalShortlist: { total: 10 },
    totalVisitors: { total: "03" },
  };

  // Debug: Log current apiData5 structure
  console.log('Current apiData5 for chart:', apiData5);
  console.log('Role:', role);
  console.log('Selected time period:', selectedTimePeriod);
  
  // Force chart re-render when apiData5 changes
  const chartKey = `chart-${selectedTimePeriod}-${apiData5?.total_interest || 0}-${apiData5?.total_requests || 0}-${apiData5?.shortlisted || 0}`;

  // Helper function to get agent graph data with multiple possible field names
  const getAgentGraphValue = (fieldName, fallbackValue = 0) => {
    if (!apiData5 || role !== "agent") {
      console.log(`No apiData5 or not agent role for ${fieldName}, using fallback:`, fallbackValue);
      return fallbackValue;
    }
    
    console.log(`Looking for ${fieldName} in apiData5:`, apiData5);
    
    // Map field names to actual API response fields
    const fieldMapping = {
      'interests': ['total_interest', 'interests', 'interest_total', 'interest_count'],
      'requests': ['total_requests', 'requests', 'request_total', 'request_count'],
      'shortlists': ['shortlisted', 'shortlists', 'shortlist_total', 'shortlist_count'],
      'blocked': ['blocked', 'blocked_count', 'blocked_total'],
      'interactions': ['total_interactions', 'interactions', 'interaction_total', 'interaction_count']
    };
    
    const possibleFields = fieldMapping[fieldName] || [
      fieldName,
      fieldName.toLowerCase(),
      fieldName.toUpperCase(),
      `total_${fieldName}`,
      `${fieldName}_count`,
      `${fieldName}_total`
    ];
    
    for (const field of possibleFields) {
      if (apiData5[field] !== undefined) {
        console.log(`Found ${fieldName} data in field '${field}':`, apiData5[field]);
        return apiData5[field];
      }
    }
    
    console.log(`No ${fieldName} data found in apiData5, using fallback:`, fallbackValue);
    return fallbackValue;
  };

  // Chart data - using actual dashboard data
  const chartData = React.useMemo(() => {
    const data = role === "agent" ? [
      // Use graph API data (apiData5) for filtered results
      getAgentGraphValue('interests', 0),
      getAgentGraphValue('requests', 0),
      getAgentGraphValue('interactions', 0),
      // For shortlist, prioritize apiData2 (card data) over apiData5 (graph data)
      apiData2?.total_shortlisted_count || getAgentGraphValue('shortlists', 0),
      // For blocked, prioritize apiData3 (card data) over apiData5 (graph data)
      apiData3?.total_blocked_count || getAgentGraphValue('blocked', 0)
    ] : [
      // For regular users, use graph API data for filtered results
      apiData5?.total_interest || 0,
      apiData5?.total_requests || 0,
      apiData5?.total_interactions || (apiData5?.sent_interest || 0) + (apiData5?.received_interest || 0),
      apiData5?.shortlisted || apiData5?.total_shortlisted || 0,
      apiData5?.total_blocked || 0
    ];
    
    console.log('Chart data recalculated with apiData5:', apiData5);
    console.log('Breakdown: total_interest =', apiData5?.total_interest, '| total_requests =', apiData5?.total_requests, '| total_interactions =', apiData5?.total_interactions, '| sent_interest =', apiData5?.sent_interest, '| received_interest =', apiData5?.received_interest, '| calculated =', (apiData5?.sent_interest || 0) + (apiData5?.received_interest || 0));
    console.log('Chart data values:', data);
    
    return {
      labels: [
        "Total Interests",
        "Total Requests", 
        "Total Interactions",
        "Members Shortlisted",
        "Blocked Members",
      ],
      datasets: [
        {
          fill: true,
          label: role === "agent" ? "Member Activity" : "Activity Count",
          data: data,
          borderColor: "#4318FF",
          backgroundColor: "rgba(67, 24, 255, 0.1)",
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: "#4318FF",
          pointBorderColor: "white",
          pointBorderWidth: 2,
        },
      ],
    };
  }, [apiData5, apiData1, apiData, apiData2, apiData3, role, selectedTimePeriod]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#333",
        bodyColor: "#666",
        borderColor: "#e0e0e0",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return context.parsed.y + " matches";
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 30,
        grid: {
          color: "#f0f0f0",
          drawBorder: false,
        },
        ticks: {
          stepSize: 20,
          padding: 10,
          color: "#666",
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          padding: 10,
          color: "#666",
          font: {
            size: window.innerWidth < 768 ? 9 : 12,
          },
          maxRotation: window.innerWidth < 480 ? 45 : 0,
          minRotation: window.innerWidth < 480 ? 45 : 0,
        },
        border: {
          display: false,
        },
      },
    },
  };

  // Mock data for match details
  let men1 = 'https://w7.pngwing.com/pngs/832/40/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png'
  const matchDetails = [
    {
      name: "Fatima",
      location: "Mumbai-Maharashtra",
      age: 23,
      occupation: "Software-Designer",
      maritalStatus: "Never Married",
      image: "https://w7.pngwing.com/pngs/832/40/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png",
      matchPercentage: 80,
    },
    {
      name: "Ayesha",
      location: "Mumbai-Maharashtra",
      age: 20,
      occupation: "Software-Engineer",
      maritalStatus: "Never Married",
      image: "https://w7.pngwing.com/pngs/832/40/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png",
      matchPercentage: 90,
    },
    {
      name: "Sara",
      location: "Mumbai-Maharashtra",
      age: 21,
      occupation: "",
      maritalStatus: "Never Married",
      image: "https://w7.pngwing.com/pngs/832/40/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png",
      matchPercentage: 70,
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col p-3 md:p-6 w-full">
        {/* Dashboard Header with User Profile */}
        <div className="dashboard-header-section">
          <div className="header-left">
            <div className="user-profile-info">
              <div className="user-avatar">
                {console.log("=== USER DASHBOARD DEBUG ===")}
                {console.log("Role:", role)}
                {console.log("userId:", userId)}
                {console.log("userProfile:", userProfile)}
                {console.log("agentProfile:", agentProfile)}
                {console.log("agentProfile.first_name:", agentProfile?.first_name)}
                {console.log("agentProfile.last_name:", agentProfile?.last_name)}
                {console.log("agentProfile.name:", agentProfile?.name)}
                {console.log("userProfile.first_name:", userProfile?.first_name)}
                {console.log("userProfile.name:", userProfile?.name)}
                {console.log("userProfilePhoto:", userProfilePhoto)}
                {console.log("agentProfilePhoto:", agentProfilePhoto)}
                {console.log("userProfile.user_profilephoto:", userProfile?.user_profilephoto)}
                {console.log("userProfile.profile_photo:", userProfile?.profile_photo)}
                {console.log("userProfile.user_profilephoto?.upload_photo:", userProfile?.user_profilephoto?.upload_photo)}
                {console.log("userProfilePhoto?.upload_photo:", userProfilePhoto?.upload_photo)}
                {console.log("agentProfilePhoto?.upload_photo:", agentProfilePhoto?.upload_photo)}
                {console.log("Environment API URL:", process.env.REACT_APP_API_URL)}
                {console.log("=== END DEBUG ===")}
                <img
                  src={
                    (() => {
                      // For agents, prioritize agent_profilephoto
                      if (role === "agent") {
                        const agentPhotoUrl = agentProfilePhoto?.upload_photo;
                        console.log("Agent photo URL found:", agentPhotoUrl);
                        console.log("Agent profile photo object:", agentProfilePhoto);

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
                      const photoUrl = userProfile?.profile_photo ||
                        userProfile?.user_profilephoto?.upload_photo ||
                        userProfilePhoto?.upload_photo ||
                        userProfilePhoto?.profile_photo;

                      console.log("Photo URL found:", photoUrl);

                      if (photoUrl) {
                        const fullUrl = photoUrl.startsWith('http')
                          ? photoUrl
                          : `${process.env.REACT_APP_API_URL}${photoUrl}`;
                        console.log("Full URL constructed:", fullUrl);
                        return fullUrl;
                      }

                      console.log("No photo found, using fallback");
                      return "https://w7.pngwing.com/pngs/832/40/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png";
                    })()
                  }
                  alt="User Profile"
                  onError={(e) => {
                    console.log("Image failed to load, using fallback");
                    if (role === "agent") {
                      e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNGMTI1N0YiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDNy41ODE3MiAxNCA0IDE3LjU4MTcgNCAyMkgxMkMxNi40MTgzIDE0IDEyIDE0IDEyIDE0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo=";
                    } else {
                      e.target.src = "https://w7.pngwing.com/pngs/832/40/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png";
                    }
                  }}
                  onLoad={() => {
                    console.log("User profile image loaded successfully");
                  }}
                />
                {/* {role === "agent" && (
                  <div className="agent-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#FD2C79" />
                    </svg>
                  </div>
                )} */}
              </div>
              <div className="user-welcome">
                <h1 className="dashboard-title">
                  {(() => {
                    const storedName = (localStorage.getItem('name') || '').trim();
                    if (role === "agent") {
                      const full = `${agentProfile?.first_name || userProfile?.first_name || ''} ${agentProfile?.last_name || userProfile?.last_name || ''}`.trim();
                      const name = agentProfile?.name || full || storedName || 'Agent';
                      return `Welcome back, ${name}!`;
                    }
                    const full = `${userProfile?.first_name || ''} ${userProfile?.last_name || ''}`.trim();
                    const name = userProfile?.name || full || storedName || 'User';
                    return `Welcome back, ${name}!`;
                  })()}
                </h1>
                <p className="dashboard-subtitle">
                  {role === "agent"
                    ? "Manage your members and track their matching activities"
                    : "Here's your activity overview for today"
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="header-right">
            <button
              onClick={() => {
                console.log('=== MANUAL REFRESH DEBUG ===');
                console.log('Current role:', role);
                console.log('Current userId:', userId);
                console.log('Current userProfile:', userProfile);
                console.log('Current apiData2 (shortlist):', apiData2);
                console.log('=== END DEBUG ===');
                refreshDashboardData();
              }}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                marginRight: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
              Refresh Data
            </button>
            {/* <div className="user-stats-summary">
              <div className="stat-item">
                <span className="stat-label">
                  {role === "agent" ? "Total Members" : "Total Matches"}
                </span>
                <span className="stat-value">
                  {role === "agent" 
                    ? (apiData6?.total_members || apiData6?.total_matches || 0)
                    : (apiData6?.total_matches || 0)
                  }
                </span>
              </div>
               
            </div> */}
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-info">
                  <div className="dCardHeading">
                    <h3>{role === "agent" ? "Total Members" : "Total Matches"}</h3>
                    <svg
                      width="58"
                      height="52"
                      viewBox="0 0 60 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.21"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M0 30V37C0 49.7025 10.2975 60 23 60H30H37C49.7025 60 60 49.7025 60 37V30V23C60 10.2975 49.7025 0 37 0H30H23C10.2975 0 0 10.2975 0 23V30Z"
                        fill="#FD2C79"
                      />
                      <path
                        opacity="0.587821"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M20.668 23.3333C20.668 26.2789 23.0558 28.6667 26.0013 28.6667C28.9468 28.6667 31.3346 26.2789 31.3346 23.3333C31.3346 20.3878 28.9468 18 26.0013 18C23.0558 18 20.668 20.3878 20.668 23.3333ZM34 28.666C34 30.8752 35.7909 32.666 38 32.666C40.2091 32.666 42 30.8752 42 28.666C42 26.4569 40.2091 24.666 38 24.666C35.7909 24.666 34 26.4569 34 28.666Z"
                        fill="#FD2C79"
                      />
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M25.9778 31.334C19.6826 31.334 14.5177 34.5693 14.0009 40.9329C13.9727 41.2796 14.6356 42.0007 14.97 42.0007H36.9956C37.9972 42.0007 38.0128 41.1946 37.9972 40.934C37.6065 34.3916 32.3616 31.334 25.9778 31.334ZM45.2739 42.002H40.1335V42.0013C40.1335 39.0004 39.1421 36.231 37.4689 34.0028C42.0103 34.0529 45.7183 36.3493 45.9973 41.202C46.0086 41.3974 45.9973 42.002 45.2739 42.002Z"
                        fill="#FD2C79"
                      />
                    </svg>
                  </div>
                  <div className="stat-number">
                    {role === "agent"
                      ? (apiData6?.total_members || apiData6?.total_matches || 0)
                      : (apiData6?.total_matches || 0)
                    }
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>



        {/*  <div className="user-stats-summary">
              <div className="stat-item">
                <span className="stat-label">
                  {role === "agent" ? "Total Members" : "Total Matches"}
                </span>
                <span className="stat-value">
                  {role === "agent" 
                    ? (apiData6?.total_members || apiData6?.total_matches || 0)
                    : (apiData6?.total_matches || 0)
                  }
                </span>
              </div> */}
        {/* Agent Quick Actions */}
        {role === "agent" && (
          <div className="agent-quick-actions">
            <div className="quick-actions-header">
              <h3>Quick Actions</h3>
              <p>Manage your members efficiently</p>
            </div>
            <div className="quick-actions-grid">
              <div 
                className="quick-action-card cursor-pointer hover:shadow-lg transition-all duration-200"
                onClick={() => {
                  navigate('/memstepone', {
                    state: {
                      username: "memberCreation",
                      isNewMember: true,
                      clearForm: true
                    }
                  });
                }}
              >
                <div className="action-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#FD2C79" />
                    <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="#FD2C79" />
                  </svg>
                </div>
                <div className="action-content">
                  <h4>Add New Member</h4>
                  <p>Register a new member profile</p>
                </div>
              </div>
              <div 
                className="quick-action-card cursor-pointer hover:shadow-lg transition-all duration-200"
                onClick={() => {
                  navigate('/my-memberss');
                }}
              >
                <div className="action-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" fill="#10B981" />
                  </svg>
                </div>
                <div className="action-content">
                  <h4>View All Members</h4>
                  <p>Browse and manage all members</p>
                </div>
              </div>
              <div 
                className="quick-action-card cursor-pointer hover:shadow-lg transition-all duration-200"
                onClick={() => {
                  navigate('/member-analytics');
                }}
              >
                <div className="action-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#F59E0B" />
                  </svg>
                </div>
                <div className="action-content">
                  <h4>Member Analytics</h4>
                  <p>View detailed member statistics</p>
                </div>
              </div>

            </div>
          </div>
        )}



        <div className="stats-container">
          {/* Stats Section */}
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <div className="dCardHeading">
                  <h3>{role === "agent" ? "Total Interests" : "Total Interests"}</h3>
                  <svg
                    width="58"
                    height="52"
                    viewBox="0 0 58 52"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g filter="url(#filter0_d_167_10928)">
                      <path
                        d="M17.3929 0.975445C14.9747 0.975445 12.7426 1.57998 10.6964 2.78906C8.6503 3.99814 7.02269 5.62574 5.81362 7.67187C4.60454 9.718 4 11.9501 4 14.3683C4 16.4144 4.74405 18.535 6.23214 20.7299C6.93899 21.8088 7.66443 22.683 8.40848 23.3527L29 44L50.2612 22.683C50.8192 22.0878 51.34 21.4554 51.8237 20.7857C52.4561 19.8557 52.9583 18.907 53.3304 17.9397C53.7768 16.7121 54 15.5216 54 14.3683C54 11.9501 53.3955 9.718 52.1864 7.67187C50.9773 5.62574 49.3497 3.99814 47.3036 2.78906C45.2574 1.57998 43.0253 0.975445 40.6071 0.975445C36.2917 0.975445 32.4226 2.72396 29 6.22098C25.5774 2.72396 21.7083 0.975445 17.3929 0.975445ZM17.3929 4.54687C18.6205 4.54687 19.904 4.82589 21.2433 5.38393C22.3222 5.79315 23.4196 6.36979 24.5357 7.11384C25.317 7.67187 26.0796 8.26711 26.8237 8.89955L27.6607 9.73661L29 11.2433L30.3393 9.73661L31.1763 8.89955C31.9204 8.26711 32.683 7.67187 33.4643 7.11384C34.5804 6.36979 35.6778 5.79315 36.7567 5.38393C38.096 4.82589 39.3795 4.54687 40.6071 4.54687C42.3929 4.54687 44.0391 4.9933 45.5458 5.88616C47.0525 6.77901 48.2429 7.97879 49.1172 9.48549C49.9914 10.9922 50.4286 12.6198 50.4286 14.3683C50.4286 15.1868 50.131 16.154 49.5357 17.2701C49.1265 18.0885 48.6057 18.9256 47.9732 19.7812L47.0804 20.8415L29 38.9219L10.9196 20.8415L10.3616 20.2835C9.95238 19.7626 9.56176 19.2418 9.18973 18.721C8.7061 18.0141 8.33408 17.3073 8.07366 16.6004C7.73884 15.782 7.57143 15.0379 7.57143 14.3683C7.57143 12.6198 8.00856 10.9922 8.88281 9.48549C9.75707 7.97879 10.9475 6.77901 12.4542 5.88616C13.9609 4.9933 15.6071 4.54687 17.3929 4.54687Z"
                        fill="#FD2C79"
                      />
                    </g>
                    <defs>
                      <filter
                        id="filter0_d_167_10928"
                        x="0"
                        y="0.974609"
                        width="58"
                        height="51.0254"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                      >
                        <feFlood
                          flood-opacity="0"
                          result="BackgroundImageFix"
                        />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="2" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow_167_10928"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow_167_10928"
                          result="shape"
                        />
                      </filter>
                    </defs>
                  </svg>
                </div>
                <div className="stat-number">
                  {role === "agent" 
                    ? (apiData1?.interest_sent || 0) + (apiData1?.interest_received || 0)
                    : (apiData1?.total_interest_count || 0)
                  }
                </div>
                <div className="stat-details">
                  <div className="stat-row">
                    <span className="stat-label">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.0179 4.14297C19.0221 4.11395 19.0221 4.08449 19.0179 4.05547C19.0179 4.05547 19.0179 4.03984 19.0179 4.03047C19.0087 4.00948 18.9972 3.98956 18.9836 3.97109L18.9492 3.93672L18.9242 3.91172H18.9054L18.8617 3.88984L18.8086 3.87109H18.7617H18.6679L1.20545 7.65234C1.14305 7.66625 1.08643 7.69896 1.0432 7.74606C0.999979 7.79315 0.972238 7.85237 0.963723 7.91573C0.955207 7.97908 0.966326 8.04353 0.99558 8.10037C1.02483 8.1572 1.07081 8.2037 1.12732 8.23359L5.98982 10.768L6.7742 15.6836C6.77921 15.714 6.78869 15.7435 6.80232 15.7711V15.7898C6.81815 15.8177 6.83817 15.843 6.8617 15.8648C6.88261 15.8824 6.90572 15.8971 6.93045 15.9086H6.9492H6.96795C6.99902 15.9133 7.03062 15.9133 7.0617 15.9086C7.10097 15.9265 7.14354 15.9361 7.1867 15.9367H7.21482L7.25857 15.918L10.6711 13.818L14.1804 16.1242C14.2198 16.1502 14.2645 16.167 14.3112 16.1732C14.358 16.1795 14.4055 16.1751 14.4503 16.1603C14.4951 16.1456 14.536 16.1209 14.5699 16.0882C14.6038 16.0554 14.6298 16.0154 14.6461 15.9711L19.0211 4.27734C19.0327 4.24526 19.0391 4.21148 19.0398 4.17734C19.0398 4.17734 19.0179 4.14922 19.0179 4.14297ZM8.08045 11.6148C8.06336 11.6278 8.04766 11.6424 8.03357 11.6586C8.01025 11.6875 7.99226 11.7203 7.98045 11.7555L7.18045 14.2555L6.61795 10.7367L15.4086 6.20547L8.08045 11.6148ZM16.4523 4.96484L6.2742 10.2117L2.1867 8.07734L16.4523 4.96484ZM7.6367 14.9273L8.45545 12.3523L10.0836 13.4367L7.6367 14.9273ZM14.1992 15.3711L10.8617 13.1836L8.84295 11.8586L18.0461 5.03047L14.1992 15.3711Z"
                          fill="#0ABB75"
                        />
                      </svg>
                      Sent
                    </span>
                    <span className="stat-value">
                      {apiData1?.interest_sent ? apiData1?.interest_sent : 0}
                    </span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">
                      <svg
                        width="20"
                        height="24"
                        viewBox="0 0 20 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_167_10936)">
                          <path
                            d="M19.3 4.71041C19.2075 4.61771 19.0976 4.54416 18.9766 4.49398C18.8556 4.4438 18.726 4.41797 18.595 4.41797C18.464 4.41797 18.3343 4.4438 18.2134 4.49398C18.0924 4.54416 17.9825 4.61771 17.89 4.71041L7 15.5904V10.0004C7 9.45041 6.55 9.00041 6 9.00041C5.45 9.00041 5 9.45041 5 10.0004V18.0004C5 18.5504 5.45 19.0004 6 19.0004H14C14.55 19.0004 15 18.5504 15 18.0004C15 17.4504 14.55 17.0004 14 17.0004H8.41L19.3 6.11041C19.68 5.73041 19.68 5.09041 19.3 4.71041Z"
                            fill="#FD2C79"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_167_10936">
                            <rect width="20" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Received
                    </span>
                    <span className="stat-value">
                      {apiData1?.interest_received
                        ? apiData1?.interest_received
                        : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <div className="dCardHeading">
                  <h3>{role === "agent" ? "Photo Requests" : "Total Request"}</h3>
                  <svg
                    width="58"
                    height="52"
                    viewBox="0 0 60 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.21"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M0 30V37C0 49.7025 10.2975 60 23 60H30H37C49.7025 60 60 49.7025 60 37V30V23C60 10.2975 49.7025 0 37 0H30H23C10.2975 0 0 10.2975 0 23V30Z"
                      fill="#FD2C79"
                    />
                    <path
                      opacity="0.587821"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M20.668 23.3333C20.668 26.2789 23.0558 28.6667 26.0013 28.6667C28.9468 28.6667 31.3346 26.2789 31.3346 23.3333C31.3346 20.3878 28.9468 18 26.0013 18C23.0558 18 20.668 20.3878 20.668 23.3333ZM34 28.666C34 30.8752 35.7909 32.666 38 32.666C40.2091 32.666 42 30.8752 42 28.666C42 26.4569 40.2091 24.666 38 24.666C35.7909 24.666 34 26.4569 34 28.666Z"
                      fill="#FD2C79"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M25.9778 31.334C19.6826 31.334 14.5177 34.5693 14.0009 40.9329C13.9727 41.2796 14.6356 42.0007 14.97 42.0007H36.9956C37.9972 42.0007 38.0128 41.1946 37.9972 40.934C37.6065 34.3916 32.3616 31.334 25.9778 31.334ZM45.2739 42.002H40.1335V42.0013C40.1335 39.0004 39.1421 36.231 37.4689 34.0028C42.0103 34.0529 45.7183 36.3493 45.9973 41.202C46.0086 41.3974 45.9973 42.002 45.2739 42.002Z"
                      fill="#FD2C79"
                    />
                  </svg>
                </div>
                <div className="stat-number">
                  {apiData?.total_request_count}
                </div>
                <div className="stat-details">
                  <div className="stat-row">
                    <span className="stat-label">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.0179 4.14297C19.0221 4.11395 19.0221 4.08449 19.0179 4.05547C19.0179 4.05547 19.0179 4.03984 19.0179 4.03047C19.0087 4.00948 18.9972 3.98956 18.9836 3.97109L18.9492 3.93672L18.9242 3.91172H18.9054L18.8617 3.88984L18.8086 3.87109H18.7617H18.6679L1.20545 7.65234C1.14305 7.66625 1.08643 7.69896 1.0432 7.74606C0.999979 7.79315 0.972238 7.85237 0.963723 7.91573C0.955207 7.97908 0.966326 8.04353 0.99558 8.10037C1.02483 8.1572 1.07081 8.2037 1.12732 8.23359L5.98982 10.768L6.7742 15.6836C6.77921 15.714 6.78869 15.7435 6.80232 15.7711V15.7898C6.81815 15.8177 6.83817 15.843 6.8617 15.8648C6.88261 15.8824 6.90572 15.8971 6.93045 15.9086H6.9492H6.96795C6.99902 15.9133 7.03062 15.9133 7.0617 15.9086C7.10097 15.9265 7.14354 15.9361 7.1867 15.9367H7.21482L7.25857 15.918L10.6711 13.818L14.1804 16.1242C14.2198 16.1502 14.2645 16.167 14.3112 16.1732C14.358 16.1795 14.4055 16.1751 14.4503 16.1603C14.4951 16.1456 14.536 16.1209 14.5699 16.0882C14.6038 16.0554 14.6298 16.0154 14.6461 15.9711L19.0211 4.27734C19.0327 4.24526 19.0391 4.21148 19.0398 4.17734C19.0398 4.17734 19.0179 4.14922 19.0179 4.14297ZM8.08045 11.6148C8.06336 11.6278 8.04766 11.6424 8.03357 11.6586C8.01025 11.6875 7.99226 11.7203 7.98045 11.7555L7.18045 14.2555L6.61795 10.7367L15.4086 6.20547L8.08045 11.6148ZM16.4523 4.96484L6.2742 10.2117L2.1867 8.07734L16.4523 4.96484ZM7.6367 14.9273L8.45545 12.3523L10.0836 13.4367L7.6367 14.9273ZM14.1992 15.3711L10.8617 13.1836L8.84295 11.8586L18.0461 5.03047L14.1992 15.3711Z"
                          fill="#0ABB75"
                        />
                      </svg>
                      Sent
                    </span>
                    <span className="stat-value">{apiData.request_sent}</span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">
                      <svg
                        width="20"
                        height="24"
                        viewBox="0 0 20 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_167_10936)">
                          <path
                            d="M19.3 4.71041C19.2075 4.61771 19.0976 4.54416 18.9766 4.49398C18.8556 4.4438 18.726 4.41797 18.595 4.41797C18.464 4.41797 18.3343 4.4438 18.2134 4.49398C18.0924 4.54416 17.9825 4.61771 17.89 4.71041L7 15.5904V10.0004C7 9.45041 6.55 9.00041 6 9.00041C5.45 9.00041 5 9.45041 5 10.0004V18.0004C5 18.5504 5.45 19.0004 6 19.0004H14C14.55 19.0004 15 18.5504 15 18.0004C15 17.4504 14.55 17.0004 14 17.0004H8.41L19.3 6.11041C19.68 5.73041 19.68 5.09041 19.3 4.71041Z"
                            fill="#FD2C79"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_167_10936">
                            <rect width="20" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Received
                    </span>
                    <span className="stat-value">
                      {apiData.request_received}
                    </span>
                  </div>
                </div>
                <div className="stat-details stat-sub-details-margin">
                  <div className="stat-sub-details">
                    <span className="pending">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.99"
                          d="M6.44576 10.0582C6.36357 10.0584 6.28216 10.0423 6.20621 10.0109C6.13027 9.97944 6.06129 9.9333 6.00326 9.8751L4.24576 8.11697C4.13191 7.9991 4.06891 7.84122 4.07034 7.67735C4.07176 7.51348 4.13749 7.35672 4.25337 7.24084C4.36925 7.12496 4.52601 7.05923 4.68988 7.0578C4.85375 7.05638 5.01163 7.11938 5.12951 7.23322L6.44513 8.54947L9.87076 5.12447C9.98909 5.01336 10.146 4.95263 10.3083 4.95515C10.4706 4.95767 10.6256 5.02324 10.7404 5.13798C10.8552 5.25272 10.9209 5.40763 10.9235 5.56993C10.9262 5.73223 10.8655 5.88919 10.7545 6.0076L6.88701 9.8751C6.82905 9.93322 6.76017 9.97932 6.68434 10.0107C6.60851 10.0422 6.52784 10.0583 6.44576 10.0582Z"
                          fill="#FD2C79"
                        />
                        <path
                          d="M7.5 1.25C6.26387 1.25 5.0555 1.61656 4.02769 2.30331C2.99988 2.99007 2.1988 3.96619 1.72576 5.10823C1.25271 6.25027 1.12894 7.50693 1.37009 8.71931C1.61125 9.9317 2.20651 11.0453 3.08059 11.9194C3.95466 12.7935 5.06831 13.3888 6.28069 13.6299C7.49307 13.8711 8.74974 13.7473 9.89178 13.2742C11.0338 12.8012 12.0099 12.0001 12.6967 10.9723C13.3834 9.94451 13.75 8.73613 13.75 7.5C13.7482 5.84296 13.0891 4.2543 11.9174 3.08259C10.7457 1.91088 9.15705 1.25182 7.5 1.25ZM10.7544 6.00812L6.88688 9.87562C6.76967 9.99279 6.61073 10.0586 6.445 10.0586C6.27928 10.0586 6.12033 9.99279 6.00313 9.87562L4.24563 8.1175C4.13178 7.99962 4.06878 7.84175 4.07021 7.67787C4.07163 7.514 4.13736 7.35724 4.25324 7.24136C4.36912 7.12548 4.52588 7.05975 4.68975 7.05833C4.85362 7.0569 5.0115 7.1199 5.12938 7.23375L6.445 8.55L9.87063 5.125C9.98896 5.01388 10.1459 4.95316 10.3082 4.95568C10.4705 4.9582 10.6254 5.02377 10.7403 5.13851C10.8551 5.25324 10.9208 5.40815 10.9234 5.57046C10.926 5.73276 10.8654 5.88972 10.7544 6.00812Z"
                          fill="#FED2E2"
                        />
                      </svg>
                      {apiData.sent_request_accepted}
                    </span>
                    <span className="accepted">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="6" cy="6" r="6" fill="#FFAAAA" />
                        <path
                          d="M3.46531 9L3 8.5347L8.5347 3L9 3.4653L3.46531 9Z"
                          fill="#FF0000"
                        />
                        <path
                          d="M8.5347 9L3 3.4653L3.46531 3L9 8.5347L8.5347 9Z"
                          fill="#FF0000"
                        />
                      </svg>
                      {apiData.sent_request_rejected}
                    </span>
                  </div>
                  <div className="stat-sub-details">
                    <span className="pending">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.99"
                          d="M6.44576 10.0582C6.36357 10.0584 6.28216 10.0423 6.20621 10.0109C6.13027 9.97944 6.06129 9.9333 6.00326 9.8751L4.24576 8.11697C4.13191 7.9991 4.06891 7.84122 4.07034 7.67735C4.07176 7.51348 4.13749 7.35672 4.25337 7.24084C4.36925 7.12496 4.52601 7.05923 4.68988 7.0578C4.85375 7.05638 5.01163 7.11938 5.12951 7.23322L6.44513 8.54947L9.87076 5.12447C9.98909 5.01336 10.146 4.95263 10.3083 4.95515C10.4706 4.95767 10.6256 5.02324 10.7404 5.13798C10.8552 5.25272 10.9209 5.40763 10.9235 5.56993C10.9262 5.73223 10.8655 5.88919 10.7545 6.0076L6.88701 9.8751C6.82905 9.93322 6.76017 9.97932 6.68434 10.0107C6.60851 10.0422 6.52784 10.0583 6.44576 10.0582Z"
                          fill="#FD2C79"
                        />
                        <path
                          d="M7.5 1.25C6.26387 1.25 5.0555 1.61656 4.02769 2.30331C2.99988 2.99007 2.1988 3.96619 1.72576 5.10823C1.25271 6.25027 1.12894 7.50693 1.37009 8.71931C1.61125 9.9317 2.20651 11.0453 3.08059 11.9194C3.95466 12.7935 5.06831 13.3888 6.28069 13.6299C7.49307 13.8711 8.74974 13.7473 9.89178 13.2742C11.0338 12.8012 12.0099 12.0001 12.6967 10.9723C13.3834 9.94451 13.75 8.73613 13.75 7.5C13.7482 5.84296 13.0891 4.2543 11.9174 3.08259C10.7457 1.91088 9.15705 1.25182 7.5 1.25ZM10.7544 6.00812L6.88688 9.87562C6.76967 9.99279 6.61073 10.0586 6.445 10.0586C6.27928 10.0586 6.12033 9.99279 6.00313 9.87562L4.24563 8.1175C4.13178 7.99962 4.06878 7.84175 4.07021 7.67787C4.07163 7.514 4.13736 7.35724 4.25324 7.24136C4.36912 7.12548 4.52588 7.05975 4.68975 7.05833C4.85362 7.0569 5.0115 7.1199 5.12938 7.23375L6.445 8.55L9.87063 5.125C9.98896 5.01388 10.1459 4.95316 10.3082 4.95568C10.4705 4.9582 10.6254 5.02377 10.7403 5.13851C10.8551 5.25324 10.9208 5.40815 10.9234 5.57046C10.926 5.73276 10.8654 5.88972 10.7544 6.00812Z"
                          fill="#FED2E2"
                        />
                      </svg>
                      {apiData?.received_request_accepted || 0}
                    </span>
                    <span className="accepted">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="6" cy="6" r="6" fill="#FFAAAA" />
                        <path
                          d="M3.46531 9L3 8.5347L8.5347 3L9 3.4653L3.46531 9Z"
                          fill="#FF0000"
                        />
                        <path
                          d="M8.5347 9L3 3.4653L3.46531 3L9 8.5347L8.5347 9Z"
                          fill="#FF0000"
                        />
                      </svg>
                      {apiData?.received_request_rejected || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <div className="dCardHeading">
                  <h3>{role === "agent" ? "Total Interactions" : "Total Interaction"}</h3>
                  {/* <svg fill="#FD2C79" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 490.726 490.726" xml:space="preserve" stroke="#FD2C79"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M261.526,475.713c1.7,0.1,3.4,0.2,5,0.2c18.5,0,34-6.7,46.1-19.9c0.1-0.1,0.3-0.3,0.4-0.4c4-4.8,8.6-9.2,13.5-13.9 c3.4-3.2,6.8-6.6,10.1-10.1c16.4-17.1,16.3-39.6-0.2-56.1l-42.7-42.7c-7.9-8.3-17.5-12.6-27.6-12.6c-10,0-19.7,4.3-27.8,12.5 l-23.6,23.6c-1.6-0.9-3.3-1.7-4.9-2.5c-2.7-1.4-5.3-2.7-7.5-4.1c-22.9-14.5-43.7-33.5-63.5-57.9c-9.4-11.8-15.8-21.9-20.3-31.6 c6-5.6,11.7-11.3,17.2-16.9c2.2-2.2,4.4-4.4,6.6-6.6c8.4-8.4,12.8-18.1,12.8-28.1s-4.4-19.7-12.8-28.1l-21.2-21.2 c-2.4-2.4-4.8-4.9-7.2-7.3c-4.7-4.9-9.7-9.9-14.5-14.4c-7.9-7.9-17.4-12.1-27.4-12.1c-9.9,0-19.5,4.1-27.8,12.1l-26.6,26.6 c-10.2,10.3-16.1,22.8-17.3,37.2c-1.9,23,4.9,44.4,10.1,58.5c12.6,34.1,31.6,65.8,59.7,99.7c34.2,40.8,75.4,73.1,122.4,95.8 C210.426,463.913,234.526,474.013,261.526,475.713z M88.826,343.813c-26.3-31.6-43.9-61-55.6-92.5c-7.1-19.1-9.8-33.9-8.6-47.9 c0.7-8.6,4.1-15.8,10.5-22.2l26.2-26.2c2.4-2.3,6.2-5.1,10.7-5.1c4.3,0,7.9,2.7,10.4,5.2c4.7,4.4,9.2,9,14,13.9 c2.4,2.5,4.9,5,7.4,7.5l21.2,21.2c2.6,2.6,5.6,6.5,5.6,10.8s-3.1,8.2-5.6,10.8c-2.3,2.3-4.5,4.5-6.7,6.8 c-6.5,6.6-12.7,12.9-19.4,18.9c-0.2,0.2-0.3,0.3-0.5,0.5c-7.3,7.3-6,14.6-4.4,19.4c0.1,0.3,0.2,0.5,0.3,0.8 c5.6,13.5,13.4,26.3,25.5,41.5c21.6,26.6,44.3,47.3,69.4,63.2c3.2,2.1,6.5,3.7,9.7,5.3c2.7,1.4,5.3,2.7,7.5,4.1 c0.4,0.2,0.7,0.4,1.1,0.6c7.7,3.8,15.3,2.5,21.5-3.8l26.6-26.6c2.4-2.4,6.2-5.3,10.5-5.3c4.2,0,7.7,2.8,10.1,5.3l42.9,42.9 c7.1,7.1,7.1,14.2-0.3,21.9c-2.9,3.1-6.1,6.1-9.4,9.3c-5,4.9-10.3,9.9-15.1,15.6c-7.5,8-16.3,11.7-27.9,11.7c-1.2,0-2.3,0-3.5-0.1 c-22.8-1.5-44.1-10.4-60-18C159.226,412.113,120.826,382.013,88.826,343.813z"></path> <path d="M295.426,283.013c13.4,3.3,27.2,5,41.2,5c85,0,154.1-61.3,154.1-136.6s-69.1-136.6-154.1-136.6s-154.1,61.2-154.1,136.6 c0,28.9,10.4,57.1,29.4,80.3c-3.6,6.9-8.6,12.5-14.8,16.5c-5.7,3.8-8.4,10.5-6.9,17.1s6.8,11.4,13.5,12.4 c13.1,1.8,38.5,2.8,62.2-11.5c5.8-3.5,7.7-11,4.2-16.8c-3.5-5.8-11-7.7-16.8-4.2c-8.8,5.3-18.2,7.7-26.5,8.6 c4.6-5.8,8.2-12.5,11-20c1.6-4.3,0.6-9.2-2.5-12.6c-18.5-20.1-28.3-44.2-28.3-69.9c0-61.8,58.1-112.1,129.6-112.1 s129.6,50.3,129.6,112.1s-58.1,112.1-129.6,112.1c-12,0-23.9-1.4-35.4-4.2c-6.5-1.6-13.2,2.4-14.8,9 C284.826,274.813,288.826,281.413,295.426,283.013z"></path> <circle cx="336.626" cy="151.413" r="13"></circle> <circle cx="382.926" cy="151.413" r="13"></circle> <circle cx="290.326" cy="151.413" r="13"></circle> </g> </g> </g></svg> */}
                  <svg
                      width="58"
                      height="52"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FD2C79"
                      strokeWidth="2"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 21s-4-3-4-9 4-9 4-9"
                      />
                      <path
                        d="M12 21s-4-3-4-9 4-9 4-9"
                      />
                      <path
                        d="M16 21s4-3 4-9-4-9-4-9"
                      />
                    </svg>
                </div>
                <div className="stat-number">
                  {(apiData7?.sent_interactions || 0) + (apiData7?.received_interactions || 0)}
                </div>
                <div className="stat-details">
                  <div className="stat-row">
                    <span className="stat-label">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19.0179 4.14297C19.0221 4.11395 19.0221 4.08449 19.0179 4.05547C19.0179 4.05547 19.0179 4.03984 19.0179 4.03047C19.0087 4.00948 18.9972 3.98956 18.9836 3.97109L18.9492 3.93672L18.9242 3.91172H18.9054L18.8617 3.88984L18.8086 3.87109H18.7617H18.6679L1.20545 7.65234C1.14305 7.66625 1.08643 7.69896 1.0432 7.74606C0.999979 7.79315 0.972238 7.85237 0.963723 7.91573C0.955207 7.97908 0.966326 8.04353 0.99558 8.10037C1.02483 8.1572 1.07081 8.2037 1.12732 8.23359L5.98982 10.768L6.7742 15.6836C6.77921 15.714 6.78869 15.7435 6.80232 15.7711V15.7898C6.81815 15.8177 6.83817 15.843 6.8617 15.8648C6.88261 15.8824 6.90572 15.8971 6.93045 15.9086H6.9492H6.96795C6.99902 15.9133 7.03062 15.9133 7.0617 15.9086C7.10097 15.9265 7.14354 15.9361 7.1867 15.9367H7.21482L7.25857 15.918L10.6711 13.818L14.1804 16.1242C14.2198 16.1502 14.2645 16.167 14.3112 16.1732C14.358 16.1795 14.4055 16.1751 14.4503 16.1603C14.4951 16.1456 14.536 16.1209 14.5699 16.0882C14.6038 16.0554 14.6298 16.0154 14.6461 15.9711L19.0211 4.27734C19.0327 4.24526 19.0391 4.21148 19.0398 4.17734C19.0398 4.17734 19.0179 4.14922 19.0179 4.14297ZM8.08045 11.6148C8.06336 11.6278 8.04766 11.6424 8.03357 11.6586C8.01025 11.6875 7.99226 11.7203 7.98045 11.7555L7.18045 14.2555L6.61795 10.7367L15.4086 6.20547L8.08045 11.6148ZM16.4523 4.96484L6.2742 10.2117L2.1867 8.07734L16.4523 4.96484ZM7.6367 14.9273L8.45545 12.3523L10.0836 13.4367L7.6367 14.9273ZM14.1992 15.3711L10.8617 13.1836L8.84295 11.8586L18.0461 5.03047L14.1992 15.3711Z"
                          fill="#0ABB75"
                        />
                      </svg>
                      Sent
                    </span>
                    <span className="stat-value">
                      {(apiData7?.sent_interactions || 0)}
                    </span>
                  </div>
                  <div className="stat-row">
                    <span className="stat-label">
                      <svg
                        width="20"
                        height="24"
                        viewBox="0 0 20 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_167_10936)">
                          <path
                            d="M19.3 4.71041C19.2075 4.61771 19.0976 4.54416 18.9766 4.49398C18.8556 4.4438 18.726 4.41797 18.595 4.41797C18.464 4.41797 18.3343 4.4438 18.2134 4.49398C18.0924 4.54416 17.9825 4.61771 17.89 4.71041L7 15.5904V10.0004C7 9.45041 6.55 9.00041 6 9.00041C5.45 9.00041 5 9.45041 5 10.0004V18.0004C5 18.5504 5.45 19.0004 6 19.0004H14C14.55 19.0004 15 18.5504 15 18.0004C15 17.4504 14.55 17.0004 14 17.0004H8.41L19.3 6.11041C19.68 5.73041 19.68 5.09041 19.3 4.71041Z"
                            fill="#FD2C79"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_167_10936">
                            <rect width="20" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Received
                    </span>
                    <span className="stat-value">
                      {(apiData7?.received_interactions || 0)}
                    </span>
                  </div>
                </div>{" "}
                <div className="stat-details stat-sub-details-margin">
                  <div className="stat-sub-details">
                    <span className="pending">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.99"
                          d="M6.44576 10.0582C6.36357 10.0584 6.28216 10.0423 6.20621 10.0109C6.13027 9.97944 6.06129 9.9333 6.00326 9.8751L4.24576 8.11697C4.13191 7.9991 4.06891 7.84122 4.07034 7.67735C4.07176 7.51348 4.13749 7.35672 4.25337 7.24084C4.36925 7.12496 4.52601 7.05923 4.68988 7.0578C4.85375 7.05638 5.01163 7.11938 5.12951 7.23322L6.44513 8.54947L9.87076 5.12447C9.98909 5.01336 10.146 4.95263 10.3083 4.95515C10.4706 4.95767 10.6256 5.02324 10.7404 5.13798C10.8552 5.25272 10.9209 5.40763 10.9235 5.56993C10.9262 5.73223 10.8655 5.88919 10.7545 6.0076L6.88701 9.8751C6.82905 9.93322 6.76017 9.97932 6.68434 10.0107C6.60851 10.0422 6.52784 10.0583 6.44576 10.0582Z"
                          fill="#FD2C79"
                        />
                        <path
                          d="M7.5 1.25C6.26387 1.25 5.0555 1.61656 4.02769 2.30331C2.99988 2.99007 2.1988 3.96619 1.72576 5.10823C1.25271 6.25027 1.12894 7.50693 1.37009 8.71931C1.61125 9.9317 2.20651 11.0453 3.08059 11.9194C3.95466 12.7935 5.06831 13.3888 6.28069 13.6299C7.49307 13.8711 8.74974 13.7473 9.89178 13.2742C11.0338 12.8012 12.0099 12.0001 12.6967 10.9723C13.3834 9.94451 13.75 8.73613 13.75 7.5C13.7482 5.84296 13.0891 4.2543 11.9174 3.08259C10.7457 1.91088 9.15705 1.25182 7.5 1.25ZM10.7544 6.00812L6.88688 9.87562C6.76967 9.99279 6.61073 10.0586 6.445 10.0586C6.27928 10.0586 6.12033 9.99279 6.00313 9.87562L4.24563 8.1175C4.13178 7.99962 4.06878 7.84175 4.07021 7.67787C4.07163 7.514 4.13736 7.35724 4.25324 7.24136C4.36912 7.12548 4.52588 7.05975 4.68975 7.05833C4.85362 7.0569 5.0115 7.1199 5.12938 7.23375L6.445 8.55L9.87063 5.125C9.98896 5.01388 10.1459 4.95316 10.3082 4.95568C10.4705 4.9582 10.6254 5.02377 10.7403 5.13851C10.8551 5.25324 10.9208 5.40815 10.9234 5.57046C10.926 5.73276 10.8654 5.88972 10.7544 6.00812Z"
                          fill="#FED2E2"
                        />
                      </svg>
                      {stats.totalRequests.sent_details.pending}
                    </span>
                    <span className="accepted">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="6" cy="6" r="6" fill="#FFAAAA" />
                        <path
                          d="M3.46531 9L3 8.5347L8.5347 3L9 3.4653L3.46531 9Z"
                          fill="#FF0000"
                        />
                        <path
                          d="M8.5347 9L3 3.4653L3.46531 3L9 8.5347L8.5347 9Z"
                          fill="#FF0000"
                        />
                      </svg>
                      {stats.totalRequests.sent_details.accepted}
                    </span>
                  </div>
                  <div className="stat-sub-details">
                    <span className="pending">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.99"
                          d="M6.44576 10.0582C6.36357 10.0584 6.28216 10.0423 6.20621 10.0109C6.13027 9.97944 6.06129 9.9333 6.00326 9.8751L4.24576 8.11697C4.13191 7.9991 4.06891 7.84122 4.07034 7.67735C4.07176 7.51348 4.13749 7.35672 4.25337 7.24084C4.36925 7.12496 4.52601 7.05923 4.68988 7.0578C4.85375 7.05638 5.01163 7.11938 5.12951 7.23322L6.44513 8.54947L9.87076 5.12447C9.98909 5.01336 10.146 4.95263 10.3083 4.95515C10.4706 4.95767 10.6256 5.02324 10.7404 5.13798C10.8552 5.25272 10.9209 5.40763 10.9235 5.56993C10.9262 5.73223 10.8655 5.88919 10.7545 6.0076L6.88701 9.8751C6.82905 9.93322 6.76017 9.97932 6.68434 10.0107C6.60851 10.0422 6.52784 10.0583 6.44576 10.0582Z"
                          fill="#FD2C79"
                        />
                        <path
                          d="M7.5 1.25C6.26387 1.25 5.0555 1.61656 4.02769 2.30331C2.99988 2.99007 2.1988 3.96619 1.72576 5.10823C1.25271 6.25027 1.12894 7.50693 1.37009 8.71931C1.61125 9.9317 2.20651 11.0453 3.08059 11.9194C3.95466 12.7935 5.06831 13.3888 6.28069 13.6299C7.49307 13.8711 8.74974 13.7473 9.89178 13.2742C11.0338 12.8012 12.0099 12.0001 12.6967 10.9723C13.3834 9.94451 13.75 8.73613 13.75 7.5C13.7482 5.84296 13.0891 4.2543 11.9174 3.08259C10.7457 1.91088 9.15705 1.25182 7.5 1.25ZM10.7544 6.00812L6.88688 9.87562C6.76967 9.99279 6.61073 10.0586 6.445 10.0586C6.27928 10.0586 6.12033 9.99279 6.00313 9.87562L4.24563 8.1175C4.13178 7.99962 4.06878 7.84175 4.07021 7.67787C4.07163 7.514 4.13736 7.35724 4.25324 7.24136C4.36912 7.12548 4.52588 7.05975 4.68975 7.05833C4.85362 7.0569 5.0115 7.1199 5.12938 7.23375L6.445 8.55L9.87063 5.125C9.98896 5.01388 10.1459 4.95316 10.3082 4.95568C10.4705 4.9582 10.6254 5.02377 10.7403 5.13851C10.8551 5.25324 10.9208 5.40815 10.9234 5.57046C10.926 5.73276 10.8654 5.88972 10.7544 6.00812Z"
                          fill="#FED2E2"
                        />
                      </svg>
                      {stats.totalRequests.sent_details.pending}
                    </span>
                    <span className="accepted">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="6" cy="6" r="6" fill="#FFAAAA" />
                        <path
                          d="M3.46531 9L3 8.5347L8.5347 3L9 3.4653L3.46531 9Z"
                          fill="#FF0000"
                        />
                        <path
                          d="M8.5347 9L3 3.4653L3.46531 3L9 8.5347L8.5347 9Z"
                          fill="#FF0000"
                        />
                      </svg>
                      {stats.totalRequests.sent_details.accepted}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <div className="dCardHeading">
                  <h3>{role === "agent" ? "Total Shortlisted" : "Total Shortlisted"}</h3>
                  <svg
                    width="58"
                    height="52"
                    viewBox="0 0 44 43"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g filter="url(#filter0_d_167_10962)">
                      <path
                        d="M4 0.625V10H13.375V0.625H4ZM7.125 3.75H10.25V6.875H7.125V3.75ZM16.5 3.75V6.875H39.9375V3.75H16.5ZM4 13.125V22.5H13.375V13.125H4ZM7.125 16.25H10.25V19.375H7.125V16.25ZM16.5 16.25V19.375H39.9375V16.25H16.5ZM4 25.625V35H13.375V25.625H4ZM7.125 28.75H10.25V31.875H7.125V28.75ZM16.5 28.75V31.875H39.9375V28.75H16.5Z"
                        fill="#FD2C79"
                      />
                    </g>
                    <defs>
                      <filter
                        id="filter0_d_167_10962"
                        x="0"
                        y="0.625"
                        width="43.9375"
                        height="42.375"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                      >
                        <feFlood
                          flood-opacity="0"
                          result="BackgroundImageFix"
                        />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feOffset dy="4" />
                        <feGaussianBlur stdDeviation="2" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow_167_10962"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow_167_10962"
                          result="shape"
                        />
                      </filter>
                    </defs>
                  </svg>
                </div>
                <div className="stat-number">
                  {apiData2?.total_shortlisted_count
                    ? apiData2.total_shortlisted_count
                    : 0}
                </div>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <div className="dCardHeading">
                  <h3>{role === "agent" ? "Blocked Members" : "Total Blocked"}</h3>
                  {/* <div className="stat-icon heart-icon"> */}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 21 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.2598 1.87109C8.78841 1.87109 7.42122 2.24219 6.1582 2.98438C4.93424 3.70052 3.96419 4.67057 3.24805 5.89453C2.50586 7.15755 2.13477 8.52474 2.13477 9.99609C2.13477 11.4674 2.50586 12.8346 3.24805 14.0977C3.96419 15.3216 4.93424 16.2917 6.1582 17.0078C7.42122 17.75 8.78841 18.1211 10.2598 18.1211C11.7311 18.1211 13.0983 17.75 14.3613 17.0078C15.5853 16.2917 16.5553 15.3216 17.2715 14.0977C18.0137 12.8346 18.3848 11.4674 18.3848 9.99609C18.3848 8.52474 18.0137 7.15755 17.2715 5.89453C16.5553 4.67057 15.5853 3.70052 14.3613 2.98438C13.0983 2.24219 11.7311 1.87109 10.2598 1.87109ZM10.2598 3.12109C11.5098 3.12109 12.6686 3.43359 13.7363 4.05859C14.765 4.67057 15.5853 5.49089 16.1973 6.51953C16.8223 7.58724 17.1348 8.74609 17.1348 9.99609C17.1348 10.8294 16.9915 11.6367 16.7051 12.418C16.4186 13.1602 16.015 13.8372 15.4941 14.4492L5.9043 4.66406C6.50326 4.16927 7.17383 3.78841 7.91602 3.52148C8.6582 3.25456 9.43945 3.12109 10.2598 3.12109ZM5.02539 5.54297L14.6152 15.3281C14.0163 15.8229 13.3457 16.2038 12.6035 16.4707C11.8613 16.7376 11.0801 16.8711 10.2598 16.8711C9.00977 16.8711 7.85091 16.5586 6.7832 15.9336C5.75456 15.3216 4.93424 14.5013 4.32227 13.4727C3.69727 12.4049 3.38477 11.2461 3.38477 9.99609C3.38477 9.16276 3.52799 8.35547 3.81445 7.57422C4.10091 6.83203 4.50456 6.15495 5.02539 5.54297Z"
                        fill="#FD2C79"
                      />
                    </svg>
                  {/* </div> */}
                </div>
                <div className="stat-number">
                  {apiData3?.total_blocked_count
                    ? apiData3?.total_blocked_count
                    : 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Matches Graph Section */}
        <div className="matches-section">
          <div className="section-header">
            <h2>{role === "agent" ? "Member Activity" : "Matches"}</h2>
            <select 
              className="month-select" 
              value={selectedTimePeriod}
              onChange={(e) => handleTimePeriodChange(e.target.value)}
              disabled={chartLoading}
            >
              {weekOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="chart-container">
            {chartLoading ? (
              <div className="chart-loading">
                <div className="loading-spinner"></div>
                <p>Loading chart data...</p>
              </div>
            ) : (
              <Line key={chartKey} data={chartData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Match Details Table */}
        <div className="match-details-section">
          <div className="section-header">
            <h2>{role === "agent" ? "Member Details" : "Match Details"}</h2>
          </div>

          {role != "agent" && (
            <div className="match-details-table overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Member ID</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Age</th>
                    <th>Sect</th>
                    <th>Profession</th>
                    <th>Marital Status</th>
                    <th>Match Per(%)</th>
                  </tr>
                </thead>

                <tbody>
                  {apiData6?.matches
                    ?.filter(match => {
                      // Debug log to see what data we're getting
                      console.log("Match data:", match);
                      console.log("Match percentage:", match.match_percentage);
                      console.log("Match percentage type:", typeof match.match_percentage);

                      // Only show matches with percentage > 0 from backend
                      return match.match_percentage && match.match_percentage > 0;
                    })
                    .length > 0 ? (
                    apiData6?.matches
                      ?.filter(match => match.match_percentage && match.match_percentage > 0)
                      .map((match, index) => (
                        <tr key={index}>
                          <td>{match?.member_id || match?.id || "N/A"}</td>
                          <td>
                            <div className="name-cell">
                              <img
                                src={
                                  (() => {
                                    // Try multiple possible photo sources for match
                                    const photoUrl = match?.profile_photo ||
                                      match?.photo ||
                                      match?.avatar ||
                                      match?.image ||
                                      match?.profile_image;

                                    console.log(`Match ${index} photo URL:`, photoUrl);

                                    if (photoUrl) {
                                      const fullUrl = photoUrl.startsWith('http')
                                        ? photoUrl
                                        : `${process.env.REACT_APP_API_URL}${photoUrl}`;
                                      console.log(`Match ${index} full URL:`, fullUrl);
                                      return fullUrl;
                                    }

                                    console.log(`Match ${index} no photo, using fallback`);
                                    return men1;
                                  })()
                                }
                                alt={match.name || "Profile"}
                                onError={(e) => {
                                  console.log(`Match ${index} image failed to load, using fallback`);
                                  e.target.src = men1;
                                }}
                                onLoad={() => {
                                  console.log(`Match ${index} image loaded successfully`);
                                }}
                              />
                              {match.name || "Not Mentioned"}
                            </div>
                          </td>
                          <td>{match.city || "Not Mentioned"}</td>
                          <td>{match.age || "Not Mentioned"}</td>
                          <td>{match.sect_school_info || "Not Mentioned"}</td>
                          <td>{match.profession || "Not Mentioned"}</td>
                          <td>
                            <span
                              className={`marital-badge ${match.martial_status ? match.martial_status.toLowerCase().replace(/\s+/g, '-') : 'not-mentioned'}`}
                              style={{
                                background: getMaritalBadgeColor(match.martial_status)
                              }}
                            >
                              {match.martial_status || "Not Mentioned"}
                            </span>
                          </td>
                          <td>
                            <div className="progress-bar-container">
                              <div
                                className="progress-bar"
                                style={{
                                  width: `${match.match_percentage || 0}%`,
                                  backgroundColor: getMatchProgressColor(match.match_percentage),
                                }}
                              ></div>
                              <span className="progress-text">
                                {match.match_percentage || 0}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                        No matches found with percentage &gt; 0%
                      </td>
                    </tr>
                  )
                  }
                </tbody>
              </table>
            </div>
          )}
          {role == "agent" && (
            <MatchDetailsComponents apiData6={apiData6?.matches || []} />
          )}
        </div>
      </div>

      <style>
        {`
          .total-interest-container {
            padding: 20px;
            background: #f8f9fa;
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
            background: #f0f0f0;
            color: #333;
            font-weight: bold;
            text-transform: uppercase;
          }
          .interest-table th, .interest-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          .table-row {
            cursor: pointer;
          }
          .table-row:hover {
            background: #f1f1f1;
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
          .marital-badge.never-married {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            border-color: #047857;
          }
          .marital-badge.unmarried {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            border-color: #047857;
          }
          .marital-badge.awaiting-divorce {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: #ffffff;
            border-color: #b45309;
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
        `}
      </style>
    </DashboardLayout>
  );
};

export default UserDashboard;
