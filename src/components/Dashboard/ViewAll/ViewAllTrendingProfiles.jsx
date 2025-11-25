import React, { useEffect, useMemo, useState } from "react";
import {
  fetchDataV2,
  fetchDataWithTokenV2,
  postDataWithFetchV2,
} from "../../../apiUtils";
import Header from "../header/Header";
import Sidebar from "../DSidebar/Sidebar";
import Footer from "../../sections/Footer";
import { useNavigate } from "react-router-dom";
import SimpleProfileCard from "../dashboardCard/SimpleProfileCard";

/**
 * Responsive ViewAllTrendingProfiles
 * - Responsive grid: 1 / 2 / 3 / 4 cols (xs / sm / lg / xl)
 * - Uses useMemo for filteredProfiles and pagination
 * - Small components for ProfileCard, Pagination, Modal
 */

const ProfilesEmpty = ({ onReload }) => (
  <div className="py-20 flex justify-center">
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-pink-200 to-pink-300 flex items-center justify-center mb-4">
        <svg
          className="w-10 h-10 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        No trending profiles
      </h3>
      <p className="text-gray-600 mb-4">
        We couldn't find any trending profiles that match your criteria.
      </p>
      <button
        onClick={onReload}
        className="inline-block px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
      >
        Reload
      </button>
    </div>
  </div>
);

const SkeletonGrid = ({ cols = 3 }) => {
  const items = Array.from({ length: cols * 2 });
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`}
    >
      {items.map((_, i) => (
        <div key={i} className="animate-pulse bg-white rounded-xl p-4 shadow">
          <div className="h-40 bg-gray-200 rounded-md mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="flex gap-2 mt-4">
            <div className="h-9 w-9 bg-gray-200 rounded" />
            <div className="h-9 w-9 bg-gray-200 rounded" />
            <div className="h-9 w-9 bg-gray-200 rounded" />
            <div className="flex-1 h-9 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

const Pagination = ({ totalPages, page, setPage }) => {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="w-full flex flex-col items-center py-6 bg-gray-50">
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className={`px-3 py-2 rounded-lg ${
            page === 1
              ? "bg-gray-100 text-gray-400"
              : "bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] text-white shadow"
          }`}
          disabled={page === 1}
        >
          ‹ Prev
        </button>

        <div className="flex gap-1">
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-2 rounded-lg ${
                p === page
                  ? "bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] text-white shadow"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className={`px-3 py-2 rounded-lg ${
            page === totalPages
              ? "bg-gray-100 text-gray-400"
              : "bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] text-white shadow"
          }`}
          disabled={page === totalPages}
        >
          Next ›
        </button>
      </div>
    </div>
  );
};

const Modal = ({
  open,
  title,
  description,
  onCancel,
  onConfirm,
  confirmText = "Confirm",
  confirmClass = "bg-pink-600",
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-full flex items-center justify-center bg-pink-100">
            <svg
              className="w-6 h-6 text-pink-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-6">{description}</p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2 rounded-md bg-gray-100 text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-2 rounded-md text-white ${confirmClass}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewAllTrendingProfiles = () => {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const [trendingProfiles, setTrendingProfiles] = useState([]);
  const [activeUser, setActiveUser] = useState({});
  const [apiMember, setApiDataMember] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [interestStatus, setInterestStatus] = useState({});
  const [shortlistStatus, setShortlistStatus] = useState({});
  const [ignoredUsers, setIgnoredUsers] = useState(new Set());
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showIgnoreModal, setShowIgnoreModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 12;

  const navigate = useNavigate();

  // Load trending profiles
  useEffect(() => {
    setLoading(true);
    setErrors(null);
    const parameter = {
      url:
        role === "agent"
          ? `/api/trending_profiles_by_interest/`
          : `/api/trending_profile/?user_id=${userId}`,
      setterFunction: (data) => {
        setTrendingProfiles(Array.isArray(data) ? data : []);
        setLoading(false);
      },
      setErrors,
      setLoading,
    };
    fetchDataWithTokenV2(parameter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, role]);

  // Load active user
  useEffect(() => {
    const parameter = {
      url: role === "agent" ? `/api/agent/${userId}/` : `/api/user/${userId}/`,
      setterFunction: setActiveUser,
      setErrors,
    };
    fetchDataV2(parameter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load agent members (if agent)
  useEffect(() => {
    if (role === "agent") {
      const parameter2 = {
        url: `/api/agent/user_agent/?agent_id=${userId}`,
        setterFunction: setApiDataMember,
        setErrors,
        setLoading,
      };
      fetchDataWithTokenV2(parameter2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  // auto-hide success message
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(t);
  }, [successMessage]);

  // helper: reload original data (used by sidebar)
  const reloadOriginalData = () => {
    setLoading(true);
    const parameter = {
      url:
        role === "agent"
          ? `/api/trending_profiles_by_interest/`
          : `/api/trending_profile/?user_id=${userId}`,
      setterFunction: (data) => {
        setTrendingProfiles(Array.isArray(data) ? data : []);
        setLoading(false);
      },
      setErrors,
      setLoading,
    };
    fetchDataWithTokenV2(parameter);
  };

  // Memoized ignored set (for stable reference)
  const ignoredSet = useMemo(
    () => new Set(Array.from(ignoredUsers)),
    [ignoredUsers]
  );

  // Filter profiles using useMemo for performance
  const filteredProfiles = useMemo(() => {
    if (!Array.isArray(trendingProfiles)) return [];

    const currentRole = localStorage.getItem("role");
    const isImpersonating =
      localStorage.getItem("is_agent_impersonating") === "true";
    const currentUserGender = activeUser?.gender;

    return trendingProfiles.filter((profile) => {
      const userObj = profile?.user ?? profile;
      const profileId = userObj?.id ?? profile?.id;

      // ignore lifetime-ignored users
      if (ignoredSet.has(profileId)) return false;
      try {
        const locallyIgnored = new Set(
          JSON.parse(localStorage.getItem("ignoredUserIds") || "[]")
        );
        if (locallyIgnored.has(profileId)) return false;
      } catch (err) {}

      // require profile completed true
      if (userObj?.profile_completed !== true) return false;

      // agents (not impersonating) see all completed
      if (currentRole === "agent" && !isImpersonating) return true;

      // For individuals show opposite gender if possible
      const profileGender = userObj?.gender;
      if (currentUserGender && profileGender) {
        if (currentUserGender === "male" && profileGender === "female")
          return true;
        if (currentUserGender === "female" && profileGender === "male")
          return true;
        return false;
      }

      // if any gender missing, allow
      return true;
    });
  }, [trendingProfiles, activeUser, ignoredSet]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProfiles.length / profilesPerPage)
  );
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const currentProfiles = useMemo(() => {
    const start = (currentPage - 1) * profilesPerPage;
    return filteredProfiles.slice(start, start + profilesPerPage);
  }, [filteredProfiles, currentPage]);

  // Interest handlers (immediate optimistic updates)
  const handleInterestClick = (actionOnId) => {
    if (interestStatus[actionOnId]) {
      setSelectedUserId(actionOnId);
      setShowWithdrawModal(true);
      return;
    }

    setInterestStatus((prev) => ({ ...prev, [actionOnId]: true }));
    const parameter = {
      url: role === "agent" ? "/api/agent/interest/" : `/api/recieved/`,
      payload: {
        action_by_id: userId,
        action_on_id: actionOnId,
        interest: true,
      },
      setErrors,
      tofetch: {
        items: [
          {
            fetchurl:
              role === "agent"
                ? `/api/trending_profiles_by_interest/`
                : `/api/trending_profile/?user_id=${userId}`,
            dataset: setTrendingProfiles,
          },
        ],
      },
    };
    postDataWithFetchV2(parameter);
  };

  const handleWithdrawInterest = () => {
    if (!selectedUserId) return;
    setInterestStatus((prev) => ({ ...prev, [selectedUserId]: false }));
    const parameter = {
      url: role === "agent" ? "/api/agent/interest/" : `/api/recieved/`,
      payload: {
        action_by_id: userId,
        action_on_id: selectedUserId,
        interest: false,
      },
      setErrors,
      tofetch: {
        items: [
          {
            fetchurl:
              role === "agent"
                ? `/api/trending_profiles_by_interest/`
                : `/api/trending_profile/?user_id=${userId}`,
            dataset: setTrendingProfiles,
          },
        ],
      },
    };
    postDataWithFetchV2(parameter);
    setShowWithdrawModal(false);
    setSelectedUserId(null);
  };

  const handleShortlistClick = (actionOnId) => {
    setShortlistStatus((prev) => ({
      ...prev,
      [actionOnId]: !prev[actionOnId],
    }));
    const parameter = {
      url: role === "agent" ? "/api/agent/shortlist/" : `/api/recieved/`,
      payload: {
        action_by_id: userId,
        action_on_id: actionOnId,
        shortlisted: !shortlistStatus[actionOnId],
      },
      setErrors,
      tofetch: {
        items: [
          {
            fetchurl:
              role === "agent"
                ? `/api/trending_profiles_by_interest/`
                : `/api/trending_profile/?user_id=${userId}`,
            dataset: setTrendingProfiles,
          },
        ],
      },
    };
    postDataWithFetchV2(parameter);
  };

  const handleIgnoreClick = (actionOnId) => {
    setSelectedUserId(actionOnId);
    setShowIgnoreModal(true);
  };

  const handleConfirmIgnore = () => {
    if (!selectedUserId) return;
    setIgnoredUsers((prev) => new Set(prev).add(selectedUserId));
    const parameter = {
      url: `/api/recieved/ignore/`,
      payload: {
        action_by_id: userId,
        action_on_id: selectedUserId,
      },
      setErrors,
      tofetch: {
        items: [
          {
            fetchurl:
              role === "agent"
                ? `/api/trending_profiles_by_interest/`
                : `/api/trending_profile/?user_id=${userId}`,
            dataset: setTrendingProfiles,
          },
        ],
      },
    };
    postDataWithFetchV2(parameter);
    setShowIgnoreModal(false);
    setSelectedUserId(null);
  };

  // helper: scroll to top when changing pages
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Subcomponent: profile card wrapper that wires actions to SimpleProfileCard
  const ProfileCard = ({ profile }) => {
    const userObj = profile?.user ?? profile;
    const id = userObj?.id ?? profile?.id;

    return (
      <div className="transform hover:scale-[1.02] transition duration-300">
        <SimpleProfileCard
          profile={userObj}
          onInterested={() => handleInterestClick(id)}
          onShortlist={() => handleShortlistClick(id)}
          onIgnore={() => handleIgnoreClick(id)}
          onMessage={() => navigate(`/chat/${id}`)}
          onViewProfile={() => navigate(`/details/${id}`)}
          isInterested={!!interestStatus[id] || !!profile?.is_interested}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        apiData={activeUser}
        members={apiMember?.member || []}
        subNavActive={"newdashboard"}
      />

      <div className="w-full px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Mobile toggle */}
          <div className="xl:hidden fixed top-24 right-4 z-50">
            <button
              onClick={() => setIsSidebarOpen((s) => !s)}
              className="bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] text-white p-3 rounded-full shadow-lg"
              aria-label="Toggle filters"
            >
              {isSidebarOpen ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* off-canvas overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-40 xl:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar
        <aside className={`z-50 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} xl:translate-x-0 fixed xl:static top-0 left-0 h-full xl:h-auto w-72 bg-white border-r xl:border-0`}>
          <div className="p-4 h-full overflow-auto">
          </div>
        </aside> */}
          <Sidebar
            setApiData={setTrendingProfiles}
            onClose={() => setIsSidebarOpen(false)}
            reloadOriginalData={reloadOriginalData}
          />

          {/* Main content (center) */}
          <main className="flex-1 p-6 xl:pl-8 rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Browse Trending Profiles
                </h1>
                <p className="text-gray-600 mt-1">
                  Discover trending profiles and find your perfect match from
                  our community.
                </p>
              </div>

              {/* Loading */}
              {loading && <SkeletonGrid />}

              {/* Error */}
              {errors && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-6">
                  <div className="text-red-700 font-semibold mb-1">
                    Something went wrong
                  </div>
                  <div className="text-red-500 text-sm">
                    {errors.message || "Failed to load trending profiles."}
                  </div>
                </div>
              )}

              {/* Empty */}
              {!loading && filteredProfiles.length === 0 && (
                <ProfilesEmpty onReload={reloadOriginalData} />
              )}

              {/* Grid */}
              {!loading && filteredProfiles.length > 0 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentProfiles.map((p) => (
                      <ProfileCard key={p.user?.id ?? p.id} profile={p} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="mt-8">
                    <Pagination
                      totalPages={totalPages}
                      page={currentPage}
                      setPage={(p) => {
                        setCurrentPage(p);
                        scrollToTop();
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      <Footer />

      {/* Withdraw Interest Modal */}
      <Modal
        open={showWithdrawModal}
        title="Withdraw Interest"
        description="Are you sure you want to withdraw your interest? This action cannot be undone."
        onCancel={() => {
          setShowWithdrawModal(false);
          setSelectedUserId(null);
        }}
        onConfirm={handleWithdrawInterest}
        confirmText="Withdraw Interest"
        confirmClass="bg-pink-600"
      />

      {/* Ignore user modal */}
      <Modal
        open={showIgnoreModal}
        title="Ignore User"
        description="Are you sure you want to ignore this user? They will be hidden from your view permanently."
        onCancel={() => {
          setShowIgnoreModal(false);
          setSelectedUserId(null);
        }}
        onConfirm={handleConfirmIgnore}
        confirmText="Ignore User"
        confirmClass="bg-red-600"
      />
    </div>
  );
};

export default ViewAllTrendingProfiles;
