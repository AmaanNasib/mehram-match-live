import api from "../api";

// API Base helpers
export const MEDIA_BASE = `${process.env.REACT_APP_API_URL}/media/`;

// Auth/Users
export const getUsers = (params) => api.get("/api/user/", { params });
export const getUser = (id) => api.get(`/api/user/${id}/`);
export const updateUser = (id, payload) => api.put(`/api/user/${id}/`, payload);
export const deleteUser = (id) => api.delete(`/api/user/${id}/`);
export const registerUser = (payload) => api.post("/api/user/register/", payload);
export const checkPhone = (phone) => api.post("/api/user/check_phone/", { phone });
export const checkEmail = (email) => api.post("/api/user/check_email/", { email });
export const findByPhone = (phone) => api.get("/api/user/find_by_phone/", { params: { phone } });
export const verifyOtpCaptcha = (payload) => api.post("/api/verify-otp-captcha/", payload);
export const getCaptcha = () => api.get("/api/get-captcha/");
export const sendOtp = (payload) => api.post("/api/otp/", payload);
export const changePassword = (id, payload) => api.post(`/api/user/${id}/change_password/`, payload);
export const userFilter = (params) => api.get("/api/user/filter/", { params });
export const userFilterByInterest = (params) => api.get("/api/user/filter/interest/", { params });
export const getNextIncompleteStep = () => api.get("/api/user/next_incomplete_step/");
export const resetPasswordRequest = (payload) => api.post("/api/user/reset-password-request/", payload);
export const resetPassword = (payload) => api.post("/api/user/reset-password/", payload);
export const deactivateAccount = (id) => api.post(`/api/user/deactivate-account/${id}/`);

// Interest/Recieved (likes/shortlist/block)
export const getInterested = () => api.get("/api/user/interested/");
export const getRequested = () => api.get("/api/user/requested/");
export const getShortlisted = () => api.get("/api/user/shortlisted/");
export const getBlocked = () => api.get("/api/user/blocked/");
export const blockUser = (meId, otherId) => api.post("/api/recieved/block/", { action_by_id: meId, action_on_id: otherId });
export const unblockUser = (meId, otherId) => api.post("/api/recieved/unblock/", { action_by_id: meId, action_on_id: otherId });
export const getInterestCount = () => api.get("/api/interest/count/");
export const getRequestedCount = () => api.get("/api/requested/count/");
export const getShortlistedCount = () => api.get("/api/shortlisted/count/");
export const getBlockedCount = () => api.get("/api/blocked/count/");
export const getTotalInteractionCount = () => api.get("/api/total_interaction/count/");
export const recievedList = (params) => api.get("/api/recieved/", { params });
export const createRecieved = (payload) => api.post("/api/recieved/", payload);
export const getRecieved = (id) => api.get(`/api/recieved/${id}/`);
export const updateRecieved = (id, payload) => api.put(`/api/recieved/${id}/`, payload);
export const deleteRecieved = (id) => api.delete(`/api/recieved/${id}/`);
export const updateRecievedStatus = (id, payload) => api.put(`/api/recieved/${id}/status/`, payload);

// Photo requests
export const sendPhotoRequest = (actionById, actionOnId) => api.post("/api/user/requestphoto/", { action_by_id: actionById, action_on_id: actionOnId });
export const updatePhotoRequest = (requestId, approved) => api.put(`/api/user/requestphoto/${requestId}/approve/`, { approved });
export const getReceivedPhotoRequests = () => api.get("/api/user/recived_request_photo/");
export const createReceivedPhotoRequest = (payload) => api.post("/api/user/recived_request_photo/", payload);
export const getPhotoRequestAlias = () => api.get("/api/user/photo-request/");

// Photos (profile/gallery)
export const uploadPhoto = (formData) => api.post("/api/user/add_photo/", formData);
export const getPhoto = (id) => api.get(`/api/user/add_photo/${id}/`);
export const updatePhoto = (id, formData) => api.put(`/api/user/add_photo/${id}/`, formData);
export const deletePhoto = (id) => api.delete(`/api/user/add_photo/${id}/`);
export const setProfilePhoto = (formData) => api.post("/api/user/profile_photo/", formData);
export const getProfilePhoto = (id) => api.get(`/api/user/profile_photo/${id}/`);
export const updateProfilePhoto = (id, formData) => api.put(`/api/user/profile_photo/${id}/`, formData);
export const deleteProfilePhoto = (id) => api.delete(`/api/user/profile_photo/${id}/`);

// Matches/Discovery
export const getMatches = (minMatchThreshold = 25) => api.get("/api/user/matches/", { params: { min_match_threshold: minMatchThreshold } });
export const getTrending = (minMatchThreshold = 25) => api.get("/api/trending_profile/", { params: { min_match_threshold: minMatchThreshold } });
export const getTrendingByInterest = () => api.get("/api/trending_profiles_by_interest/");
export const getRecommend = (minMatchThreshold = 25) => api.get("/api/user/recommend/", { params: { min_match_threshold: minMatchThreshold } });
export const getLatestProfile = () => api.get("/api/user/latest_profile/");

// Profile views/visitors
export const recordProfileView = (userId) => api.post(`/api/profile/${userId}/`);
export const getProfileVisitors = (userId) => api.get(`/api/user/profile_visitors/${userId}/`);
export const getAnalytics = () => api.get("/api/analytics/");
export const getUserGraph = () => api.get("/api/user/graph/");

// Visibility/Privacy
export const getProfileVisibility = (viewerId, profileId) => api.get("/api/profile/visibility/check/", { params: { viewer_id: viewerId, profile_id: profileId } });
export const getVisibilitySettings = () => api.get("/api/profile/visibility/settings/");

// Chat/Messages
export const sendMessage = (payload) => api.post("/api/user/messages/", payload);
export const getMessages = (otherUserId) => api.get(`/api/chats/${otherUserId}/messages/`);
export const getRecentUsers = () => api.get("/api/chats/recent-users/");
export const markRead = (otherUserId) => api.post(`/api/chats/${otherUserId}/mark-read/`);
export const getMessageReactions = (messageId) => api.get(`/api/messages/${messageId}/reactions/`);
export const addMessageReaction = (payload) => api.post("/api/messages/reactions/", payload);
export const removeMessageReaction = (messageId) => api.post(`/api/messages/${messageId}/reactions/remove/`);
export const uploadChatImage = (formData) => api.post("/api/chat/upload-image/", formData);
export const deleteChatImage = (payload) => api.post("/api/chat/delete-image/", payload);

// Notifications
export const getNotifications = () => api.get("/api/notification/");
export const deleteNotification = (id) => api.delete(`/api/notification/${id}/`);

// Admin/import utilities
export const createUserFromExcel = (formData) => api.post("/api/user/user-create-from-excel/", formData);


