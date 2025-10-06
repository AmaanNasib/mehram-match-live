import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { userId } = useParams();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
      await api.put(
        `/api/user/${userId}/change_password/`,
        {
          old_password: currentPassword,
          password: newPassword,
          confirm_password: confirmPassword,
        }
      );

      setMessage("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else if (error.response?.data) {
        // Display first validation error
        const errors = error.response.data;
        const firstError = Object.values(errors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 shadow-md border border-red-300 transition-opacity duration-300 ease-in-out">
          {error}
        </div>
      )}

      {message && (
        <div className="fixed top-5 right-5 z-50 bg-green-100 text-green-700 px-4 py-3 rounded shadow-lg border border-green-300 transition-opacity duration-300 ease-in-out">
          {message}
        </div>
      )}

      <div className="flex flex-col justify-center items-center min-h-screen w-full">
        <div className="w-[80%] max-w-[550px] bg-white p-6 rounded-3xl shadow-2xl border-2 border-white">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Change Password
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black font-[400]">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              className="h-12 px-3 py-1 text-sm text-black font-semibold placeholder-gray-500 mt-1 w-full rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-gray-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black font-[400]">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              className="h-12 px-3 py-1 text-sm text-black font-semibold placeholder-gray-500 mt-1 w-full rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-gray-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-black font-[400]">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your new password"
              className="h-12 px-3 py-1 text-sm text-black font-semibold placeholder-gray-500 mt-1 w-full rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-gray-500"
              required
            />
          </div>

          <button
            onClick={handleChangePassword}
            className="w-full py-2 rounded-[20px] shadow border-none text-white font-medium transition duration-300 hover:shadow-lg bg-[#FFC0CB] hover:bg-[#C0C0C0]"
          >
            Change Password
          </button>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
