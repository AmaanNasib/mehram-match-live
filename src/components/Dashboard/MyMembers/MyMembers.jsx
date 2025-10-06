import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import {
  AiOutlineFilter,
  AiOutlineRedo,
  AiOutlineClose,
  AiOutlineDelete,
} from "react-icons/ai"; // Import icons
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchDataObjectV2, fetchDataV2, fetchDataWithTokenV2 } from "../../../apiUtils";
import { format } from "date-fns";
import { HiOutlineDotsHorizontal  } from "react-icons/hi";

// Add this new component for the marital status dropdown
const MaritalStatusDropdown = ({ value, onChange, userGender }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState(value || []);

  // Gender-based marital status options
  const getMaritalStatusOptions = (gender) => {
    const baseOptions = ["Single", "Divorced", "Khula", "Widowed"];
    
    if (gender === "female") {
      return [...baseOptions, "Married"];
    }
    
    return baseOptions;
  };

  const maritalStatusOptions = getMaritalStatusOptions(userGender);

  useEffect(() => {
    if (value) {
      setSelectedStatuses(Array.isArray(value) ? value : [value]);
    }
  }, [value]);

  const toggleStatus = (status) => {
    const newSelected = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];

    setSelectedStatuses(newSelected);
    onChange(newSelected);
  };

  return (
    <div className="marital-status-dropdown-container">
      <div
        className="marital-status-dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        Marital Status
      </div>

      {isOpen && (
        <div className="marital-status-dropdown-menu">
          <h6>Select Marital Status</h6>

          <div className="marital-status-grid">
            {maritalStatusOptions.map((status) => (
              <div
                key={status}
                className={`marital-status-option ${
                  selectedStatuses.includes(status) ? "selected" : ""
                }`}
                onClick={() => toggleStatus(status)}
              >
                {status}
              </div>
            ))}
          </div>
          <div className="marital-status-note">
            *You can choose multiple Marital Status
          </div>
          <button className="apply-now-btn" onClick={() => setIsOpen(false)}>
            Apply Now
          </button>
        </div>
      )}

      <style>
        {`
          .marital-status-dropdown-container {
            position: relative;
            width: 200px;
          }
          
          .marital-status-dropdown-toggle {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background: #fff;
            cursor: pointer;
            font-size: 14px;
            min-height: 36px;
            display: flex;
            align-items: center;
            font-weight: 600; /* Bold */
            color: #333; /* Dark gray */
          }
          
          .marital-status-dropdown-menu {
            position: absolute;
            top: 105%;
            left: 0;
            width: 400px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 15px;
            padding: 15px;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          
          .marital-status-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 10px;
          }
          
          .marital-status-option {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 50px;
            text-align: center;
            cursor: pointer;
            font-size: 13px;
          }
          
          .marital-status-option.selected {
            background-color: #FF1493;
            color: white;
            border-color: #FF1493;
          }

            .marital-status-option:hover {
          background-color: rgb(20, 255, 134);
          border-color:rgb(20, 255, 134);
        }

          .apply-now-btn:hover {
          background-color: rgb(20, 255, 134);
        }
          
          .marital-status-note {
            font-size: 12px;
            color: #666;
            margin-bottom: 10px;
          }
          
          .apply-now-btn {
            width: 100%;
            padding: 8px;
            background-color: #FF1493;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          
          .selected-status-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 5px;
          }
          
          .status-tag {
            display: flex;
            align-items: center;
            background-color: #e9ecef;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 12px;
          }
          
          .remove-tag-icon {
            margin-left: 5px;
            cursor: pointer;
            font-size: 10px;
          }
        `}
      </style>
    </div>
  );
};

const StatusDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState(value || []);

  const statusOptions = ["Sent", "Received"];

  useEffect(() => {
    if (value) {
      setSelectedStatuses(Array.isArray(value) ? value : [value]);
    }
  }, [value]);

  const toggleStatus = (status) => {
    const newSelected = selectedStatuses.includes(status)
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];

    setSelectedStatuses(newSelected);
    onChange(newSelected);
  };

  return (
    <div className="status-dropdown-container">
      <div
        className="status-dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        Status
      </div>

      {isOpen && (
        <div className="status-dropdown-menu">
          <h6>Select Status</h6>
          <div className="status-grid">
            {statusOptions.map((status) => (
              <div
                key={status}
                className={`status-option ${
                  selectedStatuses.includes(status) ? "selected" : ""
                } ${status.toLowerCase()}`}
                onClick={() => toggleStatus(status)}
              >
                {status}
              </div>
            ))}
          </div>
          <div className="status-note">*You can choose multiple Statuses</div>
          <button className="apply-now-btn" onClick={() => setIsOpen(false)}>
            Apply Now
          </button>
        </div>
      )}

      <style>
        {`
          .status-dropdown-container {
            position: relative;
            width: 150px;
          }

          .status-dropdown-toggle {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background: #fff;
            cursor: pointer;
            font-size: 14px;
            min-height: 36px;
            display: flex;
            align-items: center;
            font-weight: 600;
            color: #333;
          }

          .status-dropdown-menu {
            position: absolute;
            top: 105%;
            left: 0;
            width: 300px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 15px;
            padding: 15px;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }

          .status-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 10px;
          }

          .status-option {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 50px;
            text-align: center;
            cursor: pointer;
            font-size: 13px;
            transition: background-color 0.2s, color 0.2s;
          }

          .status-option.selected {
            background-color: #FF1493;
            color: white;
            border-color: #FF1493;
          }

          .status-option.sent:hover {
            background-color: #90EE90; /* Light green */
            color: #000;
          }

          .status-option.received:hover {
            background-color: #8A2BE2; /* Blueberry */
            color: #fff;
          }

          .status-note {
            font-size: 12px;
            color: #666;
            margin-bottom: 10px;
          }

          .apply-now-btn {
            width: 100%;
            padding: 8px;
            background-color: #FF1493;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};

const CustomDatePicker = ({ selectedDate, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [internalDate, setInternalDate] = useState(
    selectedDate ? new Date(selectedDate) : null
  );

  // Generate calendar days for the current month/year
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    // Previous month's days
    const prevMonthDays = [];
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      prevMonthDays.push(prevMonthLastDay - i);
    }

    // Current month's days
    const currentMonthDays = Array.from(
      { length: daysInMonth },
      (_, i) => i + 1
    );

    // Next month's days
    const nextMonthDays = [];
    const daysToShow = 42 - (prevMonthDays.length + currentMonthDays.length);
    for (let i = 1; i <= daysToShow; i++) {
      nextMonthDays.push(i);
    }

    return { prevMonthDays, currentMonthDays, nextMonthDays };
  };

  const { prevMonthDays, currentMonthDays, nextMonthDays } =
    generateCalendarDays();

  const handleDateClick = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setInternalDate(newDate);
    onChange(format(newDate, "yyyy-MM-dd"));
    setIsOpen(false);
  };

  const isDateSelected = (day) => {
    if (!internalDate) return false;
    return (
      internalDate.getDate() === day &&
      internalDate.getMonth() === currentMonth &&
      internalDate.getFullYear() === currentYear
    );
  };

  const changeMonth = (increment) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="custom-date-picker-container">
      <div
        className="custom-date-picker-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedDate || placeholder}
      </div>

      {isOpen && (
        <div className="custom-date-picker-menu">
          <div className="month-navigation">
            <button className="nav-button" onClick={() => changeMonth(-1)}>
              &lt;
            </button>
            <h6>
              {monthNames[currentMonth]} {currentYear}
            </h6>
            <button className="nav-button" onClick={() => changeMonth(1)}>
              &gt;
            </button>
          </div>

          <div className="calendar-grid">
            {/* Day headers */}
            <div className="day-header">S</div>
            <div className="day-header">M</div>
            <div className="day-header">T</div>
            <div className="day-header">W</div>
            <div className="day-header">T</div>
            <div className="day-header">F</div>
            <div className="day-header">S</div>

            {/* Previous month days */}
            {prevMonthDays.map((day) => (
              <div key={`prev-${day}`} className="calendar-day other-month">
                {day}
              </div>
            ))}

            {/* Current month days */}
            {currentMonthDays.map((day) => (
              <div
                key={`current-${day}`}
                className={`calendar-day ${
                  isDateSelected(day) ? "selected" : ""
                }`}
                onClick={() => handleDateClick(day)}
              >
                {day}
              </div>
            ))}

            {/* Next month days */}
            {nextMonthDays.map((day) => (
              <div key={`next-${day}`} className="calendar-day other-month">
                {day}
              </div>
            ))}
          </div>

          <div className="date-picker-note">*You can choose a date</div>

          <button className="apply-now-btn" onClick={() => setIsOpen(false)}>
            Apply Now
          </button>
        </div>
      )}

      <style>
        {`
          .custom-date-picker-container {
            position: relative;
            width: 120px;
          }
          
          .custom-date-picker-toggle {
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background: #fff;
            cursor: pointer;
            font-size: 14px;
            min-height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            color: #333;
          }
          
          .custom-date-picker-menu {
            position: absolute;
            top: 105%;
            left: 0;
            width: 300px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 15px;
            padding: 15px;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          
          .month-navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          
          .month-navigation h6 {
            margin: 0;
            font-size: 16px;
          }
          
          .nav-button {
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 4px;
          }
          
          .nav-button:hover {
            background-color: #f0f0f0;
          }
          
          .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 5px;
            margin-bottom: 10px;
          }
          
          .day-header {
            text-align: center;
            font-weight: bold;
            font-size: 12px;
            color: #666;
          }
          
          .calendar-day {
            padding: 8px;
            text-align: center;
            cursor: pointer;
            font-size: 13px;
            border-radius: 50%;
          }
          
          .calendar-day:hover {
            background-color: #f0f0f0;
          }
          
          .calendar-day.selected {
            background-color: #FF1493;
            color: white;
          }
          
          .other-month {
            color: #ccc;
          }
          
          .date-picker-note {
            font-size: 12px;
            color: #666;
            margin-bottom: 10px;
          }
          
          .apply-now-btn {
            width: 100%;
            padding: 8px;
            background-color: #FF1493;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          
          .apply-now-btn:hover {
            background-color: rgb(20, 255, 134);
          }
        `}
      </style>
    </div>
  );
};

const MyMembers = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate1, setSelectedDate1] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDatePicker1, setShowDatePicker1] = useState(false);
  const [userId] = useState(localStorage.getItem("userId"));
  const [gender] = useState(localStorage.getItem("gender"));
  const [apiData, setApiData] = useState({ member: [] });
  const [loading, setLoading] = useState(false);
  console.log(selectedDate, "selectedDate", apiData);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const role = localStorage.getItem("role");
    const token = localStorage.getItem('token');


  let [filters, setFilters] = useState({
    id: "",
    name: "",
    city: "",
    date: "",
    sectSchoolInfo: "",
    profession: "",
    status: "",
    martialStatus: "",
    startDate: "",
    endDate: "",
  });
  // Handle change in the search input

  const handleClick = () => {
    navigate("/memstepone", {
      state: { username: "memberCreation", age: 30 },
    });
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };
  useEffect(() => {
    if (role === "agent") return;
    if (userId) {
      const parameter = {
        url: `/api/agent/user_agent/?agent_id=${userId}`,
        setterFunction: setApiData,
        setLoading: setLoading,
        setErrors: setErrors,
      };
      fetchDataObjectV2(parameter);
    }
  }, [userId]);
  const matchDetails = [
    {
      id: "00001",
      name: "Christine Brooks",
      location: "089 Kutch Green Apt. 448",
      date: "04 Sep 2019",
      sect: "Sunni-Hanafi",
      profession: "Software-Designer",
      status: "Sent",
      maritalStatus: "Never Married",
    },
    {
      id: "00002",
      name: "Rosie Pearson",
      location: "979 Immanuel Ferry Suite 526",
      date: "28 May 2019",
      sect: "Sunni-Hanafi",
      profession: "Software-Designer",
      status: "Received",
      maritalStatus: "Divorced",
    },
    {
      id: "00003",
      name: "Darrell Caldwell",
      location: "8587 Frida Ports",
      date: "23 Nov 2019",
      sect: "Sunni-Hanafi",
      profession: "Software-Designer",
      status: "Sent",
      maritalStatus: "Never Married",
    },
    {
      id: "00004",
      name: "Gilbert Johnston",
      location: "768 Destiny Lake Suite 600",
      date: "05 Feb 2019",
      sect: "Sunni-Hanafi",
      profession: "Software-Designer",
      status: "Received",
      maritalStatus: "Widowed",
    },
    {
      id: "00005",
      name: "Alan Cain",
      location: "042 Mylene Throughway",
      date: "29 Jul 2019",
      sect: "Sunni-Hanafi",
      profession: "Software-Designer",
      status: "Received",
      maritalStatus: "Married",
    },
    {
      id: "00006",
      name: "Alfred Murray",
      location: "543 Weinmann Mountain",
      date: "15 Aug 2019",
      sect: "Sunni-Hanafi",
      profession: "Software-Designer",
      status: "Received",
      maritalStatus: "Awaiting Divorce",
    },
    {
      id: "00007",
      name: "Maggie Sullivan",
      location: "New Scottieberg",
      date: "21 Dec 2019",
      sect: "Sunni-Hanafi",
      profession: "Software-Designer",
      status: "Sent",
      maritalStatus: "Never Married",
    },
    {
      id: "00008",
      name: "Rosie Todd",
      location: "New Jon",
      date: "30 Apr 2019",
      sect: "Sunni-Hanafi",
      profession: "Software-Designer",
      status: "Received",
      maritalStatus: "Khula",
    },
    {
      id: "00009",
      name: "Dollie Hines",
      location: "124 Lyla Forge Suite 975",
      date: "09 Jan 2019",
      sect: "Sunni-Hanafi",
      profession: "Software-Designer",
      status: "Sent",
      maritalStatus: "Never Married",
    },
  ];

  // Pagination
  // Extract distinct values for each filter (IDs, Names, etc.)
  const distinctIds = [...new Set(apiData?.member?.map((match) => match?.id))];
  const distinctNames = [
    ...new Set(apiData?.member?.map((match) => match?.name)),
  ];
  const distinctCities = [
    ...new Set(apiData?.member?.map((match) => match?.city)),
  ];
  const distinctDobs = [
    ...new Set(apiData?.member?.map((match) => match?.dob)),
  ];
  const distinctSchoolInfo = [
    ...new Set(apiData?.member?.map((match) => match?.sect_school_info)),
  ];
  const distinctProfessions = [
    ...new Set(apiData?.member?.map((match) => match?.profession)),
  ];
  const distinctStatuses = [
    ...new Set(apiData?.member?.map((match) => match?.status)),
  ];
  const distinctMaritalStatuses = [
    ...new Set(apiData?.member?.map((match) => match?.martial_status)),
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const handleFilterChange = (column, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [column]: value };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };
  const onClearFilterClick = () => {
    let clear = {
      id: "",
      name: "",
      city: "",
      date: "",
      sectSchoolInfo: "",
      profession: "",
      status: "",
      martialStatus: "",
      startDate: "",
      endDate: "",
    };
    setFilters(clear);
    applyFilters(clear);
  };
  // Apply filters to the data based on selected filter values
  const applyFilters = (updatedFilters) => {
    console.log(updatedFilters.id, ">>>");

    setFilteredItems(
      apiData?.member?.filter((match) => {
        return (
          (updatedFilters.id ? match?.id == updatedFilters.id : true) &&
          (updatedFilters.name
            ? match?.name
                ?.toLowerCase()
                .includes(updatedFilters.name.toLowerCase())
            : true) &&
          (updatedFilters.city
            ? match?.city
                ?.toLowerCase()
                .includes(updatedFilters.city.toLowerCase())
            : true) &&
          (updatedFilters.startDate && updatedFilters.endDate
            ? new Date(match?.date) >= new Date(updatedFilters.startDate) &&
              new Date(match?.date) <= new Date(updatedFilters.endDate)
            : true) &&
          (updatedFilters.sectSchoolInfo
            ? match?.sect_school_info
                ?.toLowerCase()
                .includes(updatedFilters.sectSchoolInfo.toLowerCase())
            : true) &&
          (updatedFilters.profession
            ? match?.profession
                ?.toLowerCase()
                .includes(updatedFilters.profession.toLowerCase())
            : true) &&
          (updatedFilters.status
            ? match?.status
                ?.toLowerCase()
                .includes(updatedFilters.status.toLowerCase())
            : true) &&
          (updatedFilters.martialStatus
            ? match?.martial_status
                ?.toLowerCase()
                .includes(updatedFilters.martialStatus.toLowerCase())
            : true)
        );
      })
    );
  };
  const currentItems = filteredItems?.slice(indexOfFirstItem, indexOfLastItem);
  // Total pages
  const totalPages = Math.ceil(filteredItems?.length / itemsPerPage);

  // Handle Page Change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    // Apply filters when `currentItems` or filters change
    console.log(apiData, ">>>okk");

    setFilteredItems(apiData?.member);
  }, [apiData]);
  // Function to handle sorting
  const handleSort = (column) => {
    let direction = "asc";
    if (sortConfig.key === column && sortConfig.direction === "asc") {
      direction = "desc"; // Toggle sorting direction
    }
    setSortConfig({ key: column, direction });
  };

  // Function to sort the data based on the current sortConfig

  useEffect(() => {
    const sortedData = [...filteredItems]?.sort((a, b) => {
      // Sorting by user field or date
      if (sortConfig?.key === "date") {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA < dateB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (dateA > dateB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      } else {
        // Sorting by user field
        if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      }
    });
    setFilteredItems(sortedData);
  }, [sortConfig.direction]);

  const handleMaritalStatusChange = (selectedStatuses) => {
    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        martialStatus: selectedStatuses.join(","),
      };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };

  const [highlightAddButton, setHighlightAddButton] = useState(false);
  const [showBulkMemberPopup, setShowBulkMemberPopup] = useState(false);

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [sidebarVisible, setSidebarVisible] = useState(true);

  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); 

  const [openMenuId, setOpenMenuId] = useState(null);
const memberRef = useRef(null);

const handleMenuClick = (e, memberId) => {
  e.stopPropagation(); // Prevent row navigation
  setOpenMenuId(prev => (prev === memberId ? null : memberId));
};

// Optional: handle click outside to close the menu
useEffect(() => {
  const handleClickOutside = (event) => {
    if (memberRef.current && !memberRef.current.contains(event.target)) {
      setOpenMenuId(null);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  const [showAllMembers, setShowAllMembers] = useState(false);
  const [allMembers, setAllMembers] = useState([]);

  useEffect(() => {
    const parameter = {
      url: `/api/agent/user_agent/?agent_id=${userId}`,
      setterFunction: (data) => {
        setAllMembers(data.member || []);
      },
      setErrors: setErrors,
    };
    fetchDataWithTokenV2(parameter);
  }, [userId]);


  const loginAsUser = async (userId) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/agent/access-agent-as-user/${userId}/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to login as user');
    }

    const data = await response.json();
    console.log('Successfully logged in as user:', data);
    // Optional: navigate or update state
  } catch (error) {
    console.error('Error:', error.message);
  }
};


  return (
    <>
     

      <DashboardLayout
        onAddMember={() => setHighlightAddButton(true)}
        onToggleSidebar={setSidebarVisible}
      >
        <div className="flex-col p-[24px] w-[100%]">
          <h1 className="page-title">My Members</h1>

          {/* Filters Section */}
          <div className="filter-container">
            <button className="filter-button">
              <AiOutlineFilter className="icon" /> Filter
            </button>
            <input
              className="filter-dropdown"
              type="text"
              value={filters.id}
              onChange={(e) => handleFilterChange("id", e.target.value)}
              placeholder="Enter ID"
              list="distinct-ids"
              style={{ width: "70px" }}
            />

            <input
              className="filter-dropdown"
              type="text"
              value={filters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
              placeholder="Location"
              list="distinct-ids"
              style={{ width: "70px" }}
            />

            {/* Replace your current date picker implementation with this */}
            <div className="date-filters-container">
              <CustomDatePicker
                selectedDate={filters.startDate}
                onChange={(date) => handleFilterChange("startDate", date)}
                placeholder="Start Date"
              />

              <CustomDatePicker
                selectedDate={filters.endDate}
                onChange={(date) => handleFilterChange("endDate", date)}
                placeholder="End Date"
              />
            </div>

            <style>
              {`
  .date-filters-container {
    display: flex;
    gap: 10px;
  }
`}
            </style>

            <select
              className="filter-dropdown"
              value={filters.sectSchoolInfo}
              onChange={(e) =>
                handleFilterChange("sectSchoolInfo", e.target.value)
              }
            >
              <option value="">Sect</option>
              {distinctSchoolInfo?.map((info, index) => (
                <option key={index} value={info}>
                  {info}
                </option>
              ))}
            </select>

            <select
              className="filter-dropdown"
              value={filters.profession}
              onChange={(e) => handleFilterChange("profession", e.target.value)}
            >
              <option value="">Profession</option>
              {distinctProfessions?.map((profession, index) => (
                <option key={index} value={profession}>
                  {profession}
                </option>
              ))}
            </select>

            <MaritalStatusDropdown
              value={
                filters.martialStatus ? filters.martialStatus.split(",") : []
              }
              userGender={gender}
              onChange={handleMaritalStatusChange}
            />

            <StatusDropdown
              value={filters.status ? filters.status.split(",") : []}
              onChange={(selectedStatuses) => {
                setFilters((prevFilters) => {
                  const updatedFilters = {
                    ...prevFilters,
                    status: selectedStatuses.join(","),
                  };
                  applyFilters(updatedFilters);
                  return updatedFilters;
                });
              }}
            />

            <button
              type="button"
              className="reset-filter"
              onClick={onClearFilterClick}
            >
              <AiOutlineRedo className="icon" /> Reset
            </button>

            <button
              onClick={handleClick}
              type="button"
              className={`m-[12px] ${
                highlightAddButton ? "ring-2 ring-black rounded-full" : ""
              }`}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 108 108"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="54" cy="54" r="54" fill="#0fd357" />
                <path
                  d="M77 54.5H32"
                  stroke="#fff"
                  stroke-width="4.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M54.5 77V32"
                  stroke="#fff"
                  stroke-width="4.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Table Section */}
          <table className="interest-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("id")}>
                  id{" "}
                  {sortConfig.key === "id" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th>My member</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Location</th>
                <th>Sect</th>
                <th>Profession</th>
                <th>Status</th>
                <th>Notifications</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allMembers.map((member) => (
                <tr
                  key={member.id}
                  onClick={() => navigate(`/details/${member?.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{member?.id || "N/A"}</td>
                  <td>{member?.name || "N/A"}</td>
                  <td>{member?.city || "N/A"}</td>
                  <td>{member?.date || "N/A"}</td>
                  <td>{member?.sect_school_info || "N/A"}</td>
                  <td>{member?.profession || "N/A"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        member?.status
                          ? member?.status?.toLowerCase()
                          : "unspecified"
                      }`}
                    >
                      {member?.status || "Unspecified"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`marital-badge ${
                        member?.martial_status
                          ? member?.martial_status
                              ?.toLowerCase()
                              ?.replace(" ", "-")
                          : "not-mentioned"
                      }`}
                    >
                      {member?.martial_status || "Not mentioned"}
                    </span>
                  </td>
                  <td>{member?.notifications || "0"}</td>
                  <td style={{ position: "relative" }}>
                    <HiOutlineDotsHorizontal 
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        handleMenuClick(e, member.id);
                      }}
                    />
                    {openMenuId === member.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 mt-2 w-40 bg-white shadow-md border rounded z-100001"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => loginAsUser(member.id)}
                        >
                          Login as User
                        </div>

                        <div
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                          // onClick={onDelete}
                        >
                          Delete
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &laquo; Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`pagination-btn ${
                  currentPage === i + 1 ? "active" : ""
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next &raquo;
            </button>
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
            flex-wrap:wrap;
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
              width: auto;

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
      background: #f0f0f0; /* Light Gray */
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
          .status-badge.unspecified {
            background: #ffc0cb;
            color: #c4002b;
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
          }.marital-badge.unmarried {
            background: #d1f8d1;
            color: #2c7a2c;
          }.marital-badge.single {
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
          .marital-badge.not-mentioned {
            background: #ff6666;
            color: #800000;
          }.marital-badge.married {
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
            .accept-btn, .reject-btn {
            padding: 5px 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 5px;
          }
          .accept-btn {
            background-color: #4CAF50;
            color: white;
          }
          .reject-btn {
            background-color: #f44336;
            color: white;
          }
          .accept-btn:hover {
            background-color: #45a049;
          }
          .reject-btn:hover {
            background-color: #e53935;
          }
        `}
        </style>
      </DashboardLayout>
    </>
  );
};

export default MyMembers;