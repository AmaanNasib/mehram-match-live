import React, { useEffect, useRef, useState } from "react";
import { FaVideo, FaPhone, FaBan } from "react-icons/fa";
import {
  FiInbox,
  FiStar,
  FiSend,
  FiFileText,
  FiMic,
  FiPaperclip,
  FiImage,
  FiSquare,
  FiSearch,
} from "react-icons/fi";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import axios from "axios";
import { convertDateTime } from "../../../apiUtils";

const Inbox = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [userInteraction, setUserInteraction] = useState([]);
  const [errors, setErrors] = useState(null);
  const userId = parseInt(localStorage.getItem("userId"), 10);
  const [newMessage, setNewMessage] = useState("");
  const [pollingIntervalId, setPollingIntervalId] = useState(null);

  console.log("User ID:", userId);

  const token = localStorage.getItem("token");

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
      setRecentUsers(response.data);
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

  // Fetch immediately and then every 3 seconds
  fetchRecentUsers();
  const interval = setInterval(fetchRecentUsers, 3000);

  // Clear interval on unmount
  return () => clearInterval(interval);
}, [token]);


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
    if (!newMessage.trim() || selectedMessage === null) return;

    const receiverId = recentUsers[selectedMessage]?.id;

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/user/messages/`,
        {
          receiver_id: receiverId,
          content: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      setErrors("Failed to send message. Please try again.");
    }
  };

  useEffect(() => {
  return () => {
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
    }
  };
}, [pollingIntervalId]);


  return (
    <>
      {errors && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 shadow-md border border-red-300 transition-opacity duration-300 ease-in-out">
          {errors}
        </div>
      )}

      <DashboardLayout>
        <h2 className="text-lg mt-4 ml-2 font-semibold">Inbox</h2>
        <div className="flex h-[80vh] bg-gray-100">
          {/* Sidebar */}
          <div className="w-1/5 m-2 bg-white p-4 shadow-lg rounded-lg">
            <h6 className="text-lg font-semibold">My Messages</h6>
            <ul className="space-y-4">
              {[
                { name: "Inbox", count: 1253, icon: <FiInbox /> },
                { name: "Starred", count: 245, icon: <FiStar /> },
                { name: "Draft", count: 9, icon: <FiFileText /> },
              ].map((item, index) => (
                <li
                  key={index}
                  className={`flex justify-between p-2 rounded-md cursor-pointer ${
                    item.name === "Inbox"
                      ? "bg-[#FF1493]/20 text-[#FF1493]"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    {item.icon} <span>{item.name}</span>
                  </span>
                  <span>{item.count}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Message List */}
          <div className="w-1/2 m-2 bg-white p-4 shadow-lg rounded-lg">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="       Search mail"
                className="w-1/2 p-2 pl-20 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF1493] focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />{" "}
              {/* Search icon */}
            </div>

            {/* Message List Table */}
            <div className=" h-[90%] overflow-y-auto">
              <table className="w-full mt-4">
                <tbody>
                  {recentUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`cursor-pointer ${
                        selectedMessage === index
                          ? "bg-[#FF1493]/20 text-[#FF1493]"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setSelectedMessage(index);

                        const receiverId = recentUsers[index].id;
                        fetchUserInteraction(receiverId); // Fetch immediately

                        if (pollingIntervalId) {
                          clearInterval(pollingIntervalId);
                        }

                        const intervalId = setInterval(() => {
                          fetchUserInteraction(receiverId);
                        }, 3000);

                        setPollingIntervalId(intervalId);
                      }}
                    >
                      {/* Profile Column */}
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          <img
                            src={
                              user.profile_photo
                                ? `${process.env.REACT_APP_API_URL}${user.profile_photo}`
                                : "/default-avatar.png" // Replace with your placeholder image path
                            }
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <FiSquare className="text-gray-400 hover:text-gray-600 cursor-pointer" />
                        </div>
                      </td>

                      {/* Name Column */}
                      <td className="p-2 font-semibold">
                        <div className="flex-col items-start">
                          <div className="font-semibold text-sm text-gray-800">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user.last_message}
                          </div>
                        </div>
                      </td>

                      {/* Placeholder Time Column */}
                      <td className="p-2 text-xs text-gray-500">
                        {convertDateTime(user.last_message_time)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chat Section */}
          <div className="flex-1 flex flex-col bg-white shadow-lg m-2 rounded-lg">
            <div className="flex justify-between items-center p-4 border-b">
              <img
                src={
                  selectedMessage !== null &&
                  recentUsers[selectedMessage]?.profile_photo
                    ? `${process.env.REACT_APP_API_URL}${recentUsers[selectedMessage].profile_photo}`
                    : "/default-avatar.png"
                }
                alt={
                  selectedMessage !== null
                    ? recentUsers[selectedMessage]?.name
                    : "User"
                }
                className="w-8 h-8 rounded-full object-cover"
              />

              <h2 className="text-lg font-semibold">
                {selectedMessage !== null
                  ? recentUsers[selectedMessage]?.name
                  : "Select a message"}
              </h2>

              <div className="flex space-x-3">
                <FaVideo className="text-[#FF1493] cursor-pointer" />
                <FaPhone className="text-[#FF1493] cursor-pointer" />
                <FaBan className="text-[#FF1493] cursor-pointer" />
              </div>
            </div>

            <div className="flex flex-col p-4 space-y-4 flex-grow overflow-y-auto">
              {userInteraction.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender?.id === userId ? "justify-end" : "justify-start"
                  } items-start space-x-3`}
                >
                  {msg.sender?.id !== userId && (
                    <img
                      src="/default-avatar.png"
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  )}

                  <div
                    className={`${
                      msg.sender?.id !== userId
                        ? "bg-[#E01382] text-white"
                        : "bg-[#FF1493]/20 text-[#FF1493]"
                    } p-3 rounded-lg w-2/3`}
                  >
                    <p>{msg.content}</p>
                    <span
                      className={`${
                        msg.sender?.id !== userId
                          ? "text-sm text-white"
                          : "text-sm text-[#FF1493]"
                      }`}
                    >
                      {convertDateTime(msg.timestamp || "Time not available")}
                    </span>
                  </div>

                  {msg.sender?.id === userId && (
                    <img
                      src="/default-avatar.png"
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t flex items-center space-x-3">
              <FiMic />
              <input
                type="text"
                placeholder="Write a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 p-2 border rounded-lg"
              />

              <FiPaperclip className="text-xl cursor-pointer" />
              <FiImage className="text-xl cursor-pointer" />
              <button
                onClick={() => handleSendMessage()}
                className="bg-[#FF1493] text-white px-4 py-2 flex items-center space-x-2 rounded-lg"
              >
                <span>Send</span> <FiSend />
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Inbox;
