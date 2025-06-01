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


    const [apiData, setApiData] = useState([]);
    const [apiData1, setApiData1] = useState([]);
    const [apiData2, setApiData2] = useState([]);
    const [apiData3, setApiData3] = useState([]);
    const [apiData4, setApiData4] = useState([]);
    const [apiData5, setApiData5] = useState([]);
    const [apiData6, setApiData6] = useState([]);
    const [apiData7, setApiData7] = useState({});
    const [apiData8, setApiData8] = useState({});
    const [errors, setErrors] = useState(false);
    const [loading, setLoading] = useState(false);
    const userId =localStorage.getItem('userId');
    const role =localStorage.getItem('role');

    useEffect(() => {
      const parameter = {
        url:  role=="agent"?`/api/agent/request/count/`:`/api/requested/count/?user_id=${userId}`,
        setterFunction: setApiData,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataWithTokenV2(parameter);

      const parameter1 = {
        url: role=="agent"?`/api/agent/interest/count/`:`/api/interest/count/?user_id=${userId}`,
        setterFunction: setApiData1,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataWithTokenV2(parameter1);

      const parameter2 = {
        url:role=="agent"?'/api/agent/shortlisted/count/': `/api/shortlisted/count/?user_id=${userId}`,
        setterFunction: setApiData2,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataWithTokenV2(parameter2);

      const parameter3 = {
        url:role=="agent"?'/api/agent/blocked/count/': `/api/blocked/count/?user_id=${userId}`,
        setterFunction: setApiData3,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataWithTokenV2(parameter3);

      // const parameter4 = {
      //   url: `/api/blocked/count/?user_id=${userId}`,
      //   setterFunction: setApiData4,
      //   setErrors: setErrors,
      //   setLoading: setLoading,
      // };
      // fetchDataWithTokenV2(parameter4);

      const parameter5 = {
        url: role=="agent"?'/api/agent/graph/?based_on=6month':`/api/user/graph/?user_id=${userId}&based_on=week`,
        setterFunction: setApiData5,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataWithTokenV2(parameter5);
      const parameter6 = {
        url: role=="agent"?'/api/agent/user/matches/':`/api/user/matches/?user_id=${userId}`,
        setterFunction: setApiData6,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataWithTokenV2(parameter6);
      const parameter7 = {
        url: role=="agent"?'/api/agent/total_interaction/count/':`/api/total_interaction/count/?user_id=${userId}`,
        setterFunction: setApiData7,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataWithTokenV2(parameter7);
      
    
    }, []);


    useEffect(() => {
    
    }, []);

     // Function to get progress bar color based on marital status
  const getProgressBarColor = (maritalStatus) => {
    switch (maritalStatus?.toLowerCase()) {
      case "never married":
        return "#d1f8d1"; // Light Green
      case "divorced":
        return "#ffc0cb"; // Light Pink
      case "widowed":
        return "#ffe4b5"; // Light Orange
      case "married":
        return "#ff6666"; // Light Red
      case "awaiting divorce":
        return "#ffdd99"; // Light Yellow
      case "khula":
        return "#e6ccff"; // Light Purple
      default:
        return "#76c7c0"; // Default color
    }
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

  // Chart data
  const chartData = {
    labels: [
      "Total interest",
      "Sent interest",
      "Received interest",
      "Short listed",
      "Total requests",
      "sent requests accepted"
    ],
    datasets: [
      {
        fill: true,
        label: "Profile Views",
        data: Object.values(apiData5),
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
        },
        border: {
          display: false,
        },
      },
    },
  };

  // Mock data for match details
  let men1='https://w7.pngwing.com/pngs/832/40/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png'
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
    <DashboardLayout >
      <div className="flex-col p-[24px] w-[100%]">
      <h3>Dashboard</h3>
        <div className="stats-container">
          {/* Stats Section */}
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <div className="dCardHeading">
                  <h3>Total Interests</h3>
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
                <div className="stat-number">{apiData1?.total_interest_count ? apiData1?.total_interest_count : 0}</div>
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
                      {apiData1?.interest_received ? apiData1?.interest_received :0}
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
                  <h3>Total Request</h3>
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
                <div className="stat-number">{apiData?.total_request_count}</div>
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
                      {apiData.request_sent}
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
                      {apiData.request_received}
                    </span>
                  </div>
                </div>
                <div className="stat-details" style={{ marginTop: "1vh" }}>
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
                      {apiData?.received_request_accepted ||0}
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
                      {apiData?.received_request_rejected	 ||0}
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
                  <h3>Total Interaction</h3>
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
                <div className="stat-number">{apiData7.total_interactions}</div>
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
                      {stats.totalInterests.sent}
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
                      {stats.totalInterests.received}
                    </span>
                  </div>
                </div>{" "}
                <div className="stat-details" style={{ marginTop: "1vh" }}>
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
                  <h3>Total Shortlist</h3>
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
                <div className="stat-number">{apiData2?.total_shortlisted_count ? apiData2.total_shortlisted_count : 0}</div>
               
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-content">
              <div className="stat-info">
                <div className="dCardHeading">
                  <h3>Total Blocked</h3>
                  <div className="stat-icon heart-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FF1493"
                    >
                      <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
                <div className="stat-number">{apiData3?.total_blocked_count ? apiData3?.total_blocked_count :0}</div>
                
              </div>
            </div>
          </div>
        </div>

        {/* Matches Graph Section */}
        <div className="matches-section">
          <div className="section-header">
            <h2>Matches</h2>
            <select className="month-select">
              <option value="1">Last week</option>
              {/* <option value="3">Last 3 Months</option>
              <option value="6">Last 6 Months</option>
              <option value="12">Last Year</option> */}
            </select>
          </div>
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Match Details Table */}
        <div className="match-details-section">
          <div className="section-header">
            <h2>Match Details</h2>
          </div>
        
        {role!="agent" &&<div className="match-details-table">
            <table>
              <thead>
              <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Age</th>
                  <th>Sect</th>
                  <th>Profession</th>
                  <th>Status</th>
                  <th>Match Per(%)</th>
                </tr>
              </thead>
          
              <tbody>
                {apiData6.map((match, index) => (
                  <tr key={index}>
                    <td>
                      <div className="name-cell">
                        <img src={match?.profile_photo ? `${'https://mehram-match.onrender.com'}${match?.profile_photo}` : men1} alt={match.name} />
                        {match.name||"Not Mentioned"}
                      </div>
                    </td>
                    <td>{match.city||"Not Mentioned"}</td>
                    <td>{match.age||"Not Mentioned"}</td>
                
                 
                    {/* <td>{match.match_percentage}%</td> */}
                    <td>{match.sect_school_info|| "Not Mentioned"}</td>
                    <td>{match.profession||"Not Mentioned"}</td>
                    <td>
                      <span className="status-badge never-married">
                        {match.marital_status||"Not Mentioned"}
                      </span>
                    </td>
                    <td>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${match.martial_status}%`,
                        backgroundColor: getProgressBarColor(match.martial_status),
                      }}
                    ></div>
                    <span className="progress-text">{match.match_percentage}%</span>
                  </div>
                </td>
                  </tr>
                ))}
              </tbody>
           
            </table>
          </div>
}
{role=='agent'&&<MatchDetailsComponents apiData6={apiData6?.members||[]}/>}
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
            padding: 5px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            display: inline-block;
          }
          .marital-badge.never-married {
            background: #d1f8d1;
            color: #2c7a2c;
          }
          .marital-badge.divorced {
            background: #ffc0cb;
            color: #c4002b;
          }
          .marital-badge.widowed {
            background: #ffe4b5;
            color: #b8860b;
          }
          .marital-badge.married {
            background: #ff6666;
            color: #800000;
          }
          .marital-badge.awaiting-divorce {
            background: #ffdd99;
            color: #a35400;
          }
          .marital-badge.khula {
            background: #e6ccff;
            color: #6a0dad;
          }
          .progress-bar-container {
            width: 100%;
            background-color: #e0e0e0;
            border-radius: 5px;
            overflow: hidden;
            position: relative;
            height: 20px;
          }
          .progress-bar {
            height: 100%;
            border-radius: 5px;
            transition: width 0.3s ease;
          }
          .progress-text {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            color: #333;
            font-size: 12px;
            font-weight: bold;
          }
        `}
      </style>
    </DashboardLayout>
  );
};

export default UserDashboard;
