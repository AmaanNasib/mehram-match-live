import React, { useEffect, useState } from "react";
import {
  fetchDataV2,
  fetchDataWithTokenV2,
  postDataWithFetchV2,
  putDataWithFetchV2,
} from "../../../apiUtils";
import Header from "../header/Header";
import { useNavigate } from "react-router-dom";

const ViewAllTrendingProfiles = () => {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const [trendingProfiles, setTrendingProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [successMessage, setSuccessMessage] = useState(false);
  const [activeUser, setactiveUser] = useState({});
  const [apiMember, setApiDataMember] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const parameter = {
      url:
        role === "agent"
          ? `/api/trending_profiles_by_interest/`
          : `/api/trending_profile/?user_id=${userId}`,
      setterFunction: setTrendingProfiles,
      setErrors: setErrors,
      setLoading: setLoading,
    };
    fetchDataWithTokenV2(parameter);
  }, [userId, role]);

  useEffect(() => {
    const parameter = {
      url: role === "agent" ? `/api/agent/${userId}/` : `/api/user/${userId}/`,
      setterFunction: setactiveUser,
      setErrors: setErrors,
    };
    fetchDataV2(parameter);
  }, []);

  useEffect(() => {
    if (role === "individual") return; // check with backend developer for unauthorized error
    const parameter2 = {
      url: `/api/agent/user_agent/?agent_id=${userId}`,
      setterFunction: setApiDataMember,
      setErrors: setErrors,
      setLoading: setLoading,
    };
    fetchDataWithTokenV2(parameter2);
  }, [userId]);

  const handleInterestClick = (actionOnId) => {
    const url = role ? `/api/recieved/${actionOnId}/` : `/api/recieved/`;

    const parameter = {
      url,
      payload: {
        action_by_id: userId,
        action_on_id: actionOnId,
        interest: true,
      },
      setErrors: setErrors,
      tofetch: {
        items: [
          {
            fetchurl:
              role === "agent"
                ? `/api/trending_profiles_by_interest/`
                : `/api/trending_profile/?user_id=${userId}`,
            dataset: setTrendingProfiles,
            setSuccessMessage: setSuccessMessage,
            setErrors: setErrors,
          },
        ],
        setSuccessMessage: setSuccessMessage,
        setErrors: setErrors,
      },
    };

    if (Number(actionOnId)) {
      putDataWithFetchV2(parameter);
    } else {
      postDataWithFetchV2(parameter);
    }
  };

  const handleShortlistClick = (actionOnId) => {
    const parameter = {
      url: role === "agent" ? "/api/agent/shortlist/" : `/api/recieved/`,
      payload: {
        action_by_id: userId,
        action_on_id: actionOnId,
        shortlisted: true,
      },
      setErrors: setErrors,
      tofetch: {
        items: [
          {
            fetchurl:
              role === "agent"
                ? `/api/trending_profiles_by_interest/`
                : `/api/trending_profile/?user_id=${userId}`,
            dataset: setTrendingProfiles,
            setSuccessMessage: setSuccessMessage,
            setErrors: setErrors,
          },
        ],
        setSuccessMessage: setSuccessMessage,
        setErrors: setErrors,
      },
    };

    postDataWithFetchV2(parameter);
  };

  const handleIgnoreClick = (actionOnId) => {
    const parameter = {
      url: `/api/recieved/`,
      payload: {
        action_by_id: userId,
        action_on_id: actionOnId,
        blocked: true,
      },
      setErrors: setErrors,
      tofetch: {
        items: [
          {
            fetchurl:
              role === "agent"
                ? `/api/trending_profiles_by_interest/`
                : `/api/trending_profile/?user_id=${userId}`,
            dataset: setTrendingProfiles,
            setSuccessMessage: setSuccessMessage,
            setErrors: setErrors,
          },
        ],
        setSuccessMessage: setSuccessMessage,
        setErrors: setErrors,
      },
    };

    postDataWithFetchV2(parameter);
  };

  return (
    <div className="dashboard flex flex-col gap-[20px] relative">
      <Header
        apiData={activeUser}
        members={apiMember?.member || []}
        subNavActive={"newdashboard"}
      />
      {loading && <p>Loading...</p>}
      {errors && (
        <p className="text-red-500">{errors.message || "An error occurred"}</p>
      )}
      {!loading && trendingProfiles.length === 0 && (
        <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          No trending profiles found.
        </p>
      )}

      <div className="flex flex-wrap gap-10 justify-center">
        {trendingProfiles.map((profile, index) => (
          <div
            key={index}
            className="w-72 bg-white rounded-xl shadow-md relative overflow-hidden"
          >
            {/* Ribbon */}
            <div className="absolute top-0 right-0">
              <div className="featured-tag"></div>
            </div>

            {/* Avatar Placeholder */}
            <div className="flex justify-center items-center py-6">
              <div className="profile-image">
                <img
                  src={
                    profile.profile_photo
                      ? `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${profile.profile_photo}`
                      : `data:image/svg+xml;utf8,${encodeURIComponent(
                          profile?.gender === "male"
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
                  alt="Profile Photo"
                  style={{
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>

            {/* Arrows (decorative, static for now) */}
            <div className="absolute left-2 top-1/2 text-gray-400 text-xl cursor-pointer">
              &lt;
            </div>
            <div className="absolute right-2 top-1/2 text-gray-400 text-xl cursor-pointer">
              &gt;
            </div>

            {/* Details */}
            <div className="text-center px-4 pb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {profile.user?.name || "No Name"}
              </h2>
              <span className="inline-block bg-pink-500 text-white text-xs px-2 py-1 rounded-full mt-1">
                {profile.user?.marital_status || "Not Mentioned"}
              </span>
              <p className="text-pink-600 text-sm mt-1">
                {profile.user?.age || "N/A"}
              </p>
              <p className="text-gray-500 text-sm">
                {profile.user?.hieght || "Not Mentioned"}
              </p>
              <p className="text-gray-500 text-sm">
                {profile.user?.city || "Not Mentioned"}
              </p>
              <p className="text-gray-600 text-sm">
                {profile.user?.profession || "Not Mentioned"}
              </p>

              {/* Actions */}
              <div className="flex justify-between items-center mt-4 px-2 text-pink-500 text-sm">
                <div
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => handleInterestClick(profile.user.id)}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={profile?.is_interested === true ? "#ff4081" : "none"}
                    stroke="#ff4081"
                  >
                    <path
                      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Interest
                </div>
                <div
                  onClick={() => navigate(`/details/${profile?.user?.id}`)}
                  className="flex flex-col items-center cursor-pointer"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="#ff4081"
                  >
                    <path
                      d="M6.59961 2.60039C6.09128 2.60039 5.62253 2.72539 5.19336 2.97539C4.76419 3.22539 4.42461 3.56497 4.17461 3.99414C3.92461 4.42331 3.79961 4.89206 3.79961 5.40039C3.79961 5.87539 3.91003 6.31706 4.13086 6.72539C4.35169 7.13372 4.65378 7.46706 5.03711 7.72539C4.56211 7.93372 4.13919 8.22122 3.76836 8.58789C3.39753 8.95456 3.11211 9.37539 2.91211 9.85039C2.70378 10.3421 2.59961 10.8587 2.59961 11.4004H3.39961C3.39961 10.8171 3.54336 10.2816 3.83086 9.79414C4.11836 9.30664 4.50586 8.91914 4.99336 8.63164C5.48086 8.34414 6.01628 8.20039 6.59961 8.20039C7.18294 8.20039 7.71836 8.34414 8.20586 8.63164C8.69336 8.91914 9.08086 9.30664 9.36836 9.79414C9.65586 10.2816 9.79961 10.8171 9.79961 11.4004H10.5996C10.5996 10.8587 10.4954 10.3421 10.2871 9.85039C10.0871 9.37539 9.80169 8.95456 9.43086 8.58789C9.06003 
8.22122 8.63711 7.93372 8.16211 7.72539C8.54544 7.46706 8.84753 7.13372 9.06836 6.72539C9.28919 6.31706 9.39961 5.87539 9.39961
 5.40039C9.39961 4.89206 9.27461 4.42331 9.02461 3.99414C8.77461 3.56497 8.43503 3.22539 8.00586 2.97539C7.57669 2.72539 7.10794 
 2.60039 6.59961 2.60039ZM6.59961 3.40039C6.96628 3.40039 7.30169 3.48997 7.60586 3.66914C7.91003 3.84831 8.15169 4.08997 8.33086
  4.39414C8.51003 4.69831 8.59961 5.03372 8.59961 5.40039C8.59961 5.76706 8.51003 6.10247 8.33086 6.40664C8.15169 6.71081 7.91003 6.95247 7.60586 7.13164C7.30169 7.31081 6.96628 7.40039 6.59961 7.40039C6.23294 7.40039 5.89753 7.31081 5.59336 7.13164C5.28919 6.95247 5.04753 6.71081 4.86836 6.40664C4.68919 6.10247 4.59961 5.76706 4.59961 5.40039C4.59961 5.03372 4.68919 4.69831 4.86836 4.39414C5.04753 4.08997 5.28919 3.84831 5.59336 3.66914C5.89753 3.48997 6.23294 3.40039 6.59961 3.40039Z"
                      fill="#6D6E6F"
                      strokeWidth="0.5"
                    />
                  </svg>
                  <span>Full Profile</span>
                </div>
                <div
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => handleShortlistClick(profile.user.id)}
                >
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.68945 3.62109V7.37109H6.43945V3.62109H2.68945ZM3.93945 4.87109H5.18945V6.12109H3.93945V4.87109ZM7.68945 4.87109V6.12109H17.0645V4.87109H7.68945ZM2.68945 8.62109V12.3711H6.43945V8.62109H2.68945ZM3.93945 9.87109H5.18945V11.1211H3.93945V9.87109ZM7.68945 9.87109V11.1211H17.0645V9.87109H7.68945ZM2.68945 13.6211V17.3711H6.43945V13.6211H2.68945ZM3.93945 14.8711H5.18945V16.1211H3.93945V14.8711ZM7.68945 14.8711V16.1211H17.0645V14.8711H7.68945Z"
                      fill="#FD2C79"
                    />
                  </svg>
                  <span>
                    {profile?.is_shortlisted === true
                      ? "Shortlisted"
                      : "Shortlist"}
                  </span>
                </div>
                <div
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => handleIgnoreClick(profile.user.id)}
                >
                  <svg
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.2598 1.87109C8.78841 1.87109 7.42122 2.24219 6.1582 2.98438C4.93424 3.70052 3.96419 4.67057 3.24805 5.89453C2.50586 7.15755 2.13477 8.52474 2.13477 9.99609C2.13477 11.4674 2.50586 12.8346 3.24805 14.0977C3.96419 15.3216 4.93424 16.2917 6.1582 17.0078C7.42122 17.75 8.78841 18.1211 10.2598 18.1211C11.7311 18.1211 13.0983 17.75 14.3613 17.0078C15.5853 16.2917 16.5553 15.3216 17.2715 14.0977C18.0137 12.8346 18.3848 11.4674 18.3848 9.99609C18.3848 8.52474 18.0137 7.15755 17.2715 5.89453C16.5553 4.67057 15.5853 3.70052 14.3613 2.98438C13.0983 2.24219 11.7311 1.87109 10.2598 1.87109ZM10.2598 3.12109C11.5098 3.12109 12.6686 3.43359 13.7363 4.05859C14.765 4.67057 15.5853 5.49089 16.1973 6.51953C16.8223 7.58724 17.1348 8.74609 17.1348 9.99609C17.1348 10.8294 16.9915 11.6367 16.7051 12.418C16.4186 13.1602 16.015 13.8372 15.4941 14.4492L5.9043 4.66406C6.50326 4.16927 7.17383 3.78841 7.91602 3.52148C8.6582 3.25456 9.43945 3.12109 10.2598 3.12109ZM5.02539 5.54297L14.6152 15.3281C14.0163 15.8229 13.3457 16.2038 12.6035 16.4707C11.8613 16.7376 11.0801 16.8711 10.2598 16.8711C9.00977 16.8711 7.85091 16.5586 6.7832 15.9336C5.75456 15.3216 4.93424 14.5013 4.32227 13.4727C3.69727 12.4049 3.38477 11.2461 3.38477 9.99609C3.38477 9.16276 3.52799 8.35547 3.81445 7.57422C4.10091 6.83203 4.50456 6.15495 5.02539 5.54297Z"
                      fill="#FD2C79"
                    />
                  </svg>
                  <span>
                    {profile?.is_blocked === true ? "Blocked" : "Ignore"}
                  </span>
                </div>
              </div>

              {/* Message Button */}
              <button className="mt-4 bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200">
                Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAllTrendingProfiles;
