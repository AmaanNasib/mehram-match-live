import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import { AiOutlineFilter, AiOutlineRedo, AiOutlineClose  } from "react-icons/ai"; // Import icons
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchDataObjectV2 } from "../../../apiUtils";
import { format } from 'date-fns';


// Add this new component for the marital status dropdown
const MaritalStatusDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(value || "");
  const maritalDropdownRef = useRef(null);

  const maritalStatusOptions = [
    "Single", "Married", "Divorced",
    "Khula", "Widowed",
  ];

  useEffect(() => {
    if (value) {
      setSelectedStatus(value);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (maritalDropdownRef.current && !maritalDropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const selectStatus = (status) => {
    setSelectedStatus(status);
    onChange(status);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="marital-status-dropdown-container" ref={maritalDropdownRef}>
      <div 
        className="marital-status-dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedStatus || "Marital Status"}
      </div>
      
      {isOpen && (
        <div className="marital-status-dropdown-menu">
          <h6>Select Marital Status</h6>
          <div className="marital-status-grid">
            {maritalStatusOptions.map((status) => (
              <div
                key={status}
                className={`marital-status-option ${
                  selectedStatus === status ? "selected" : ""
                }`}
                onClick={() => selectStatus(status)}
              >
                {status}
              </div>
            ))}
          </div>
          <div className="marital-status-note">
            *You can choose one Marital Status
          </div>
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
  const [selectedStatus, setSelectedStatus] = useState(value || "");
  const statusDropdownRef = useRef(null);

  const statusOptions = ["Sent", "Received"];

  useEffect(() => {
    if (value) {
      setSelectedStatus(value);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const selectStatus = (status) => {
    setSelectedStatus(status);
    onChange(status);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="status-dropdown-container" ref={statusDropdownRef}>
      <div
        className="status-dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedStatus || "Status"}
      </div>

      {isOpen && (
        <div className="status-dropdown-menu">
          <h6>Select Status</h6>
          <div className="status-grid">
            {statusOptions.map((status) => (
              <div
                key={status}
                className={`status-option ${selectedStatus === status ? "selected" : ""} ${status.toLowerCase()}`}
                onClick={() => selectStatus(status)}
              >
                {status}
              </div>
            ))}
          </div>
          <div className="status-note">
            *You can choose one Status
          </div>
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
  const [internalDate, setInternalDate] = useState(selectedDate ? new Date(selectedDate) : null);
  const datePickerRef = useRef(null);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

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
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    // Next month's days
    const nextMonthDays = [];
    const daysToShow = 42 - (prevMonthDays.length + currentMonthDays.length);
    for (let i = 1; i <= daysToShow; i++) {
      nextMonthDays.push(i);
    }
    
    return { prevMonthDays, currentMonthDays, nextMonthDays };
  };

  const { prevMonthDays, currentMonthDays, nextMonthDays } = generateCalendarDays();

  const handleDateClick = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setInternalDate(newDate);
    onChange(format(newDate, 'yyyy-MM-dd'));
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
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="custom-date-picker-container" ref={datePickerRef}>
      <div 
        className="custom-date-picker-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedDate || placeholder}
      </div>
      
      {isOpen && (
        <div className="custom-date-picker-menu">
          <div className="month-navigation">
            <button 
              className="nav-button"
              onClick={() => changeMonth(-1)}
            >
              &lt;
            </button>
            <h6>{monthNames[currentMonth]} {currentYear}</h6>
            <button 
              className="nav-button"
              onClick={() => changeMonth(1)}
            >
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
            {prevMonthDays.map(day => (
              <div key={`prev-${day}`} className="calendar-day other-month">
                {day}
              </div>
            ))}
            
            {/* Current month days */}
            {currentMonthDays.map(day => (
              <div 
                key={`current-${day}`}
                className={`calendar-day ${isDateSelected(day) ? 'selected' : ''}`}
                onClick={() => handleDateClick(day)}
              >
                {day}
              </div>
            ))}
            
            {/* Next month days */}
            {nextMonthDays.map(day => (
              <div key={`next-${day}`} className="calendar-day other-month">
                {day}
              </div>
            ))}
          </div>
          
          <div className="date-picker-note">
            *You can choose a date
          </div>
          
          <button 
            className="apply-now-btn"
            onClick={() => setIsOpen(false)}
          >
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



const TotalInterest = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate1, setSelectedDate1] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDatePicker1, setShowDatePicker1] = useState(false);
  const [userId] = useState(localStorage.getItem("userId"));
  const [apiData, setApiData] = useState({sent_interests:[], received_interests:[]});
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [errors, setErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  let [filters, setFilters] = useState({
    id: '',
    name: '',
    city: '',
    date: '',
    sectSchoolInfo: '',
    profession: '',
    status: '',
    martialStatus: '',
    startDate: '',
    endDate: ''
  })
  // Handle change in the search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };
  useEffect(() => {
    if (userId) {
      // Fetch both sent and received interests
      Promise.all([
        // Fetch sent interests (where current user sent interest to others)
        new Promise((resolve, reject) => {
          const sentParameter = {
            url: `/api/recieved/?action_by_id=${userId}`,
            setterFunction: resolve,
            setLoading: () => {},
            setErrors: reject
          };
          fetchDataObjectV2(sentParameter);
        }),
        // Fetch received interests (where others sent interest to current user)
        new Promise((resolve, reject) => {
          const receivedParameter = {
            url: `/api/recieved/?action_on_id=${userId}`,
            setterFunction: resolve,
            setLoading: () => {},
            setErrors: reject
          };
          fetchDataObjectV2(receivedParameter);
        })
      ])
      .then(([sentData, receivedData]) => {
        
        // Process sent interests (action_by_id = current user) 
        let sentInterests = [];
        if (Array.isArray(sentData) && sentData.length > 0) {
          sentInterests = sentData
            .filter(item => item.action_by_id == userId) // Ensure it's actually sent by current user
            .map(item => ({
              ...item,
              status: "Sent"
            }));
        } else if (sentData?.results && Array.isArray(sentData.results)) {
          sentInterests = sentData.results
            .filter(item => item.action_by_id == userId)
            .map(item => ({
              ...item,
              status: "Sent"
            }));
        }
        
        // Process received interests (action_on_id = current user)
        let receivedInterests = [];
        if (Array.isArray(receivedData) && receivedData.length > 0) {
          receivedInterests = receivedData
            .filter(item => item.action_on_id == userId) // Ensure it's actually received by current user
            .map(item => ({
              ...item,
              status: "Received" // Fix the API typo
            }));
        } else if (receivedData?.results && Array.isArray(receivedData.results)) {
          receivedInterests = receivedData.results
            .filter(item => item.action_on_id == userId)
            .map(item => ({
              ...item,
              status: "Received"
            }));
        }
        
        const combinedData = [...sentInterests, ...receivedInterests];
        
        setApiData({
          sent_interests: combinedData
        });
        setLoading(false);
      })
      .catch(error => {
        setErrors(error);
        setLoading(false);
      });
      
      setLoading(true);
    }
  }, [userId]);
  const matchDetails = [
    { id: "00001", name: "Christine Brooks", location: "089 Kutch Green Apt. 448", date: "04 Sep 2019", sect: "Sunni-Hanafi", profession: "Software-Designer", status: "Sent", maritalStatus: "Never Married" },
    { id: "00002", name: "Rosie Pearson", location: "979 Immanuel Ferry Suite 526", date: "28 May 2019", sect: "Sunni-Hanafi", profession: "Software-Designer", status: "Received", maritalStatus: "Divorced" },
    { id: "00003", name: "Darrell Caldwell", location: "8587 Frida Ports", date: "23 Nov 2019", sect: "Sunni-Hanafi", profession: "Software-Designer", status: "Sent", maritalStatus: "Never Married" },
    { id: "00004", name: "Gilbert Johnston", location: "768 Destiny Lake Suite 600", date: "05 Feb 2019", sect: "Sunni-Hanafi", profession: "Software-Designer", status: "Received", maritalStatus: "Widowed" },
    { id: "00005", name: "Alan Cain", location: "042 Mylene Throughway", date: "29 Jul 2019", sect: "Sunni-Hanafi", profession: "Software-Designer", status: "Received", maritalStatus: "Married" },
    { id: "00006", name: "Alfred Murray", location: "543 Weinmann Mountain", date: "15 Aug 2019", sect: "Sunni-Hanafi", profession: "Software-Designer", status: "Received", maritalStatus: "Awaiting Divorce" },
    { id: "00007", name: "Maggie Sullivan", location: "New Scottieberg", date: "21 Dec 2019", sect: "Sunni-Hanafi", profession: "Software-Designer", status: "Sent", maritalStatus: "Never Married" },
    { id: "00008", name: "Rosie Todd", location: "New Jon", date: "30 Apr 2019", sect: "Sunni-Hanafi", profession: "Software-Designer", status: "Received", maritalStatus: "Khula" },
    { id: "00009", name: "Dollie Hines", location: "124 Lyla Forge Suite 975", date: "09 Jan 2019", sect: "Sunni-Hanafi", profession: "Software-Designer", status: "Sent", maritalStatus: "Never Married" },
  ];

   // Pagination
     // Extract distinct values for each filter (IDs, Names, etc.) - using flexible data structure
  const getDistinctValues = (field) => {
    return [...new Set(apiData?.sent_interests?.map((match) => {
      const userData = match?.user || match?.action_on || match?.action_by || match;
      const userId = userData?.id || match?.action_on_id || match?.action_by_id;
      
      switch(field) {
        case 'id': return userId;
        case 'name': return userData?.name;
        case 'city': return userData?.city;
        case 'dob': return userData?.dob;
        case 'sect_school_info': return userData?.sect_school_info;
        case 'profession': return userData?.profession;
        case 'status': return match?.status;
        case 'martial_status': return userData?.martial_status;
        default: return null;
      }
    }).filter(Boolean))];
  };
  
  const distinctIds = getDistinctValues('id');
  const distinctNames = getDistinctValues('name');
  const distinctCities = getDistinctValues('city');
  const distinctDobs = getDistinctValues('dob');
  const distinctSchoolInfo = getDistinctValues('sect_school_info');
  const distinctProfessions = getDistinctValues('profession');
  const distinctStatuses = getDistinctValues('status');
  const distinctMaritalStatuses = getDistinctValues('martial_status');

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
  const [resetKey, setResetKey] = useState(0);
  
  const onClearFilterClick=() => {
    let clear={
      id: '',
      name: '',
      city: '',
      date: '',
      sectSchoolInfo: '',
      profession: '',
      status: '',
      martialStatus: '',
      startDate: '',
      endDate: ''
    }
    setFilters(clear)
    applyFilters(clear)
    // Force re-render of dropdown components by changing key
    setResetKey(prev => prev + 1);
  };
  // Apply filters to the data based on selected filter values
  const applyFilters = (updatedFilters) => {
    const filtered = apiData?.sent_interests?.filter((match) => {
      let statusMatch = true;
      if (updatedFilters.status) {
        // Handle both "Received" and "Recieved" (typo from API)
        const itemStatus = match?.status?.toLowerCase().trim();
        const filterStatus = updatedFilters.status.toLowerCase().trim();
        
        statusMatch = itemStatus === filterStatus || 
                     (filterStatus === "received" && itemStatus === "recieved") ||
                     (filterStatus === "recieved" && itemStatus === "received");
      }
      
      // Flexible user data access - same as in table display
      const userData = match?.user || match?.action_on || match?.action_by || match;
      const userId = userData?.id || match?.action_on_id || match?.action_by_id;
      
      return (
        (updatedFilters.id ? userId == updatedFilters.id : true) &&
        (updatedFilters.name ? userData?.name?.toLowerCase().includes(updatedFilters.name.toLowerCase()) : true) &&
        (updatedFilters.city ? userData?.city?.toLowerCase().includes(updatedFilters.city.toLowerCase()) : true) &&
        (updatedFilters.startDate && updatedFilters.endDate 
          ? new Date(match?.created_at || match?.date) >= new Date(updatedFilters.startDate) && new Date(match?.created_at || match?.date) <= new Date(updatedFilters.endDate)
          : true) &&
        (updatedFilters.sectSchoolInfo ? userData?.sect_school_info?.toLowerCase().includes(updatedFilters.sectSchoolInfo.toLowerCase()) : true) &&
        (updatedFilters.profession ? userData?.profession?.toLowerCase().includes(updatedFilters.profession.toLowerCase()) : true) &&
        statusMatch &&
        (updatedFilters.martialStatus ? userData?.martial_status?.toLowerCase().includes(updatedFilters.martialStatus.toLowerCase()) : true)
      );
    });
    
    setFilteredItems(filtered);
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
    setFilteredItems( apiData?.sent_interests)
  }, [apiData]);
      // Function to handle sorting
      const handleSort = (column) => {
        let direction = 'asc';
        if (sortConfig.key === column && sortConfig.direction === 'asc') {
          direction = 'desc'; // Toggle sorting direction
        }
        setSortConfig({ key: column, direction });
      };
    
      // Function to sort the data based on the current sortConfig
      
    
      useEffect(() => {
        const sortedData = [...filteredItems].sort((a, b) => {
          // Sorting by user field or date
          if (sortConfig.key === 'date') {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (dateA < dateB) {
              return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (dateA > dateB) {
              return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
          }else{
               // Sorting by user field
          if (a.user[sortConfig.key] < b.user[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (a.user[sortConfig.key] > b.user[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
          }
    
       
        });
        setFilteredItems(sortedData)
      }, [sortConfig.direction])




      const handleMaritalStatusChange = (selectedStatus) => {
        setFilters(prevFilters => {
          const updatedFilters = { 
            ...prevFilters, 
            martialStatus: selectedStatus 
          };
          applyFilters(updatedFilters);
          return updatedFilters;
        });
      };



  return (
    <DashboardLayout>
      <div className="total-interest-container">
        <h1 className="page-title">Total Interest</h1>

        {/* Filters Section */}
        <div className="filter-container">
          <button className="filter-button">
            <AiOutlineFilter className="icon" /> Filter By
          </button>
          <input
            className="filter-dropdown"
            type="text"
            value={filters.id}
            onChange={(e) => handleFilterChange('id', e.target.value)}
            placeholder="Enter ID"
            list="distinct-ids"
            style={{ width: '70px' }}
          />


          <input
            className="filter-dropdown"
            type="text"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            placeholder="Location"
            list="distinct-ids"
            style={{ width: '70px' }}
          />

         {/* Replace your current date picker implementation with this */}
<div className="date-filters-container">
  <CustomDatePicker
    key={`start-date-${resetKey}`}
    selectedDate={filters.startDate}
    onChange={(date) => handleFilterChange("startDate", date)}
    placeholder="Start Date"
  />
  
  <CustomDatePicker
    key={`end-date-${resetKey}`}
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
            onChange={(e) => handleFilterChange('sectSchoolInfo', e.target.value)}
          >
            <option value="">Sect</option>
            <option value="Ahle Qur'an">Ahle Qur'an</option>
            <option value="Ahamadi">Ahamadi</option>
            <option value="Barelvi">Barelvi</option>
            <option value="Bohra">Bohra</option>
            <option value="Deobandi">Deobandi</option>
            <option value="Hanabali">Hanabali</option>
            <option value="Hanafi">Hanafi</option>
            <option value="Ibadi">Ibadi</option>
            <option value="Ismaili">Ismaili</option>
            <option value="Jamat e Islami">Jamat e Islami</option>
            <option value="Maliki">Maliki</option>
            <option value="Pathan">Pathan</option>
            <option value="Salafi">Salafi</option>
            <option value="Salafi/Ahle Hadees">Salafi/Ahle Hadees</option>
            <option value="Sayyid">Sayyid</option>
            <option value="Shafi">Shafi</option>
            <option value="Shia">Shia</option>
            <option value="Sunni">Sunni</option>
            <option value="Sufism">Sufism</option>
            <option value="Tableeghi Jama'at">Tableeghi Jama'at</option>
            <option value="Zahiri">Zahiri</option>
            <option value="Muslim">Muslim</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>

          <select
            className="filter-dropdown"
            value={filters.profession}
            onChange={(e) => handleFilterChange('profession', e.target.value)}
          >
            <option value="">Profession</option>
            <option value="Accountant">Accountant</option>
            <option value="Acting Professional">Acting Professional</option>
            <option value="Actor">Actor</option>
            <option value="Administrator">Administrator</option>
            <option value="Advertising Professional">Advertising Professional</option>
            <option value="Air Hostess">Air Hostess</option>
            <option value="Airline Professional">Airline Professional</option>
            <option value="Airforce">Airforce</option>
            <option value="Architect">Architect</option>
            <option value="Artist">Artist</option>
            <option value="Assistant Professor">Assistant Professor</option>
            <option value="Audiologist">Audiologist</option>
            <option value="Auditor">Auditor</option>
            <option value="Bank Officer">Bank Officer</option>
            <option value="Bank Staff">Bank Staff</option>
            <option value="Beautician">Beautician</option>
            <option value="Biologist / Botanist">Biologist / Botanist</option>
            <option value="Business Person">Business Person</option>
            <option value="Captain">Captain</option>
            <option value="CEO / CTO / President">CEO / CTO / President</option>
            <option value="Chemist">Chemist</option>
            <option value="Civil Engineer">Civil Engineer</option>
            <option value="Clerical Official">Clerical Official</option>
            <option value="Clinical Pharmacist">Clinical Pharmacist</option>
            <option value="Company Secretary">Company Secretary</option>
            <option value="Computer Engineer">Computer Engineer</option>
            <option value="Computer Programmer">Computer Programmer</option>
            <option value="Consultant">Consultant</option>
            <option value="Contractor">Contractor</option>
            <option value="Content Creator">Content Creator</option>
            <option value="Counsellor">Counsellor</option>
            <option value="Creative Person">Creative Person</option>
            <option value="Customer Support Professional">Customer Support Professional</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="Defence Employee">Defence Employee</option>
            <option value="Dentist">Dentist</option>
            <option value="Designer">Designer</option>
            <option value="Director / Chairman">Director / Chairman</option>
            <option value="Doctor">Doctor</option>
            <option value="Economist">Economist</option>
            <option value="Electrical Engineer">Electrical Engineer</option>
            <option value="Engineer">Engineer</option>
            <option value="Entertainment Professional">Entertainment Professional</option>
            <option value="Event Manager">Event Manager</option>
            <option value="Executive">Executive</option>
            <option value="Factory Worker">Factory Worker</option>
            <option value="Farmer">Farmer</option>
            <option value="Fashion Designer">Fashion Designer</option>
            <option value="Finance Professional">Finance Professional</option>
            <option value="Food Technologist">Food Technologist</option>
            <option value="Government Employee">Government Employee</option>
            <option value="Graphic Designer">Graphic Designer</option>
            <option value="Hair Dresser">Hair Dresser</option>
            <option value="Health Care Professional">Health Care Professional</option>
            <option value="Hospitality Professional">Hospitality Professional</option>
            <option value="Hotel & Restaurant Professional">Hotel & Restaurant Professional</option>
            <option value="Human Resource Professional">Human Resource Professional</option>
            <option value="HSE Officer">HSE Officer</option>
            <option value="Influencer">Influencer</option>
            <option value="Insurance Advisor">Insurance Advisor</option>
            <option value="Insurance Agent">Insurance Agent</option>
            <option value="Interior Designer">Interior Designer</option>
            <option value="Investment Professional">Investment Professional</option>
            <option value="IT / Telecom Professional">IT / Telecom Professional</option>
            <option value="Islamic Scholar">Islamic Scholar</option>
            <option value="Islamic Teacher">Islamic Teacher</option>
            <option value="Journalist">Journalist</option>
            <option value="Lawyer">Lawyer</option>
            <option value="Lecturer">Lecturer</option>
            <option value="Legal Professional">Legal Professional</option>
            <option value="Librarian">Librarian</option>
            <option value="Logistics Professional">Logistics Professional</option>
            <option value="Manager">Manager</option>
            <option value="Marketing Professional">Marketing Professional</option>
            <option value="Mechanical Engineer">Mechanical Engineer</option>
            <option value="Medical Representative">Medical Representative</option>
            <option value="Medical Transcriptionist">Medical Transcriptionist</option>
            <option value="Merchant Naval Officer">Merchant Naval Officer</option>
            <option value="Microbiologist">Microbiologist</option>
            <option value="Military">Military</option>
            <option value="Nanny / Child Care Worker">Nanny / Child Care Worker</option>
            <option value="Navy Officer">Navy Officer</option>
            <option value="Nurse">Nurse</option>
            <option value="Occupational Therapist">Occupational Therapist</option>
            <option value="Office Staff">Office Staff</option>
            <option value="Optician">Optician</option>
            <option value="Optometrist">Optometrist</option>
            <option value="Pharmacist">Pharmacist</option>
            <option value="Physician">Physician</option>
            <option value="Physician Assistant">Physician Assistant</option>
            <option value="Pilot">Pilot</option>
            <option value="Police Officer">Police Officer</option>
            <option value="Priest">Priest</option>
            <option value="Product Manager / Professional">Product Manager / Professional</option>
            <option value="Professor">Professor</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Public Relations Professional">Public Relations Professional</option>
            <option value="Real Estate Professional">Real Estate Professional</option>
            <option value="Research Scholar">Research Scholar</option>
            <option value="Retail Professional">Retail Professional</option>
            <option value="Sales Professional">Sales Professional</option>
            <option value="Scientist">Scientist</option>
            <option value="Self-Employed">Self-Employed</option>
            <option value="Social Worker">Social Worker</option>
            <option value="Software Consultant">Software Consultant</option>
            <option value="Software Developer">Software Developer</option>
            <option value="Speech Therapist">Speech Therapist</option>
            <option value="Sportsman">Sportsman</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Teacher">Teacher</option>
            <option value="Technician">Technician</option>
            <option value="Tour Guide">Tour Guide</option>
            <option value="Trainer">Trainer</option>
            <option value="Transportation Professional">Transportation Professional</option>
            <option value="Tutor">Tutor</option>
            <option value="Veterinary Doctor">Veterinary Doctor</option>
            <option value="Videographer">Videographer</option>
            <option value="Web Designer">Web Designer</option>
            <option value="Web Developer">Web Developer</option>
            <option value="Wholesale Businessman">Wholesale Businessman</option>
            <option value="Writer">Writer</option>
            <option value="Zoologist">Zoologist</option>
            <option value="Other">Other</option>
          </select>

  <MaritalStatusDropdown 
    key={`marital-status-${resetKey}`}
    value={filters.martialStatus}
    onChange={handleMaritalStatusChange}
  />

<StatusDropdown 
  key={`status-${resetKey}`}
  value={filters.status}
  onChange={(selectedStatus) => {
    setFilters(prevFilters => {
      const updatedFilters = { 
        ...prevFilters, 
        status: selectedStatus 
      };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  }}
/>


          <button type="button" className="reset-filter" onClick={onClearFilterClick}>
            <AiOutlineRedo className="icon" /> Reset Filter
          </button>
        </div>

        {/* Table Section */}
        <table className="interest-table">
          <thead>
            <tr>
            <th onClick={() => handleSort('id')}>
            ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </th>
              <th>Name</th>
              <th>Location</th>
              <th  onClick={() => handleSort('date')} >Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th>Sect</th>
              <th>Profession</th>
              <th>Status</th>
              <th>Marital Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                  Loading data...
                </td>
              </tr>
            ) : currentItems?.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                  {filteredItems?.length === 0 && filters.status ? 
                    `No ${filters.status.toLowerCase()} interests found` : 
                    "No data available"
                  }
                </td>
              </tr>
            ) : (
              currentItems?.map((match,index) => {
                // Flexible user data access - try different possible structures
                const userData = match?.user || match?.action_on || match?.action_by || match;
                const userId = userData?.id || match?.action_on_id || match?.action_by_id;
                
                return (
                  <tr key={index} onClick={() => navigate(`/details/${userId}`)} style={{ cursor: "pointer" }}>
                    <td>{userId ||"N/A"}</td>
                    <td>{userData?.name ||"N/A"}</td>
                    <td>{userData?.city ||"N/A"}</td>
                    <td>{match?.created_at?.split('T')[0] || match?.date ||"N/A"}</td>
                    <td>{userData?.sect_school_info ||"N/A"}</td>
                    <td>{userData?.profession ||"N/A"}</td>
                    <td>
                      <span className={`status-badge ${match?.status?match?.status?.toLowerCase():"unspecified"}`}>{match?.status ||"Unspecified"}</span>
                    </td>
                    <td>
                      <span className={`marital-badge ${userData?.martial_status?userData?.martial_status?.toLowerCase()?.replace(" ", "-"):"not-mentioned"}`}>
                        {userData?.martial_status||"Not mentioned"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

          {/* Pagination */}
        <div className="pagination">
          <button className="pagination-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            &laquo; Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button className="pagination-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
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
              width: 120px; /* Adjust the width as needed */

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
  );
};

export default TotalInterest;













// import React from "react";
// import { useNavigate } from "react-router-dom";
// import DashboardLayout from "../UserDashboard/DashboardLayout";

// const TotalInterest = () => {
//   const navigate = useNavigate();

//   // Mock data for match details
//   const matchDetails = [
//     { id: 59, name: "Fatima", location: "Mumbai", age: 23, occupation: "Designer", maritalStatus: "Never Married", image: "https://placehold.co/30x30", matchPercentage: 80 },
//     { id: 60, name: "Ayesha", location: "Delhi", age: 25, occupation: "Doctor", maritalStatus: "Never Married", image: "https://placehold.co/30x30", matchPercentage: 75 },
//     { id: 61, name: "Sara", location: "Bangalore", age: 27, occupation: "Engineer", maritalStatus: "Divorced", image: "https://placehold.co/30x30", matchPercentage: 85 },
//     { id: 62, name: "Omar", location: "Hyderabad", age: 30, occupation: "Software Engineer", maritalStatus: "Single", image: "https://placehold.co/30x30", matchPercentage: 82 },
//     { id: 63, name: "Ali", location: "Lucknow", age: 28, occupation: "Banker", maritalStatus: "Never Married", image: "https://placehold.co/30x30", matchPercentage: 79 },
//   ];

//   // Splitting data into sections
//   const interestSent = matchDetails.slice(0, 3);
//   const interestReceived = matchDetails.slice(3);

//   // Table Component
//   const MatchTable = ({ title, data }) => (
//     <div className="match-section" style={{ marginBottom: "30px" }}>
//       <h2 style={{ fontWeight: "500", fontSize: "18px", color: "#444", textAlign: "left", marginBottom: "10px" }}>{title}</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Age</th>
//             <th>Location</th>
//             <th>Occupation</th>
//             <th>Marital Status</th>
//             <th>Match %</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((match) => (
//             <tr key={match.user.id} onClick={() => navigate(`/details/${match.user.id}`)} style={{ cursor: "pointer" }}>
//               <td>
//                 <div className="name-cell">
//                   <img src={match.user.image} alt={match.user.name} />
//                   {match.user.name}
//                 </div>
//               </td>
//               <td>{match.user.age}</td>
//               <td>{match.user.location}</td>
//               <td>{match.user.occupation}</td>
//               <td>
//                 <span className={`status-badge ${match.user.maritalStatus.toLowerCase().replace(" ", "-")}`}>
//                   {match.user.maritalStatus}
//                 </span>
//               </td>
//               <td>{match.user.matchPercentage}%</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );

//   return (
//     <DashboardLayout>
//       <div className="match-details-container">
//         <h1 style={{ fontWeight: "700", fontSize: "30px", textAlign: "center", textTransform: "uppercase", marginBottom: "30px" }}>
//           Total Interest
//         </h1>
//         <MatchTable title="Interest Sent" data={interestSent} />
//         <MatchTable title="Interest Received" data={interestReceived} />
//       </div>
//     </DashboardLayout>
//   );
// };

// export default TotalInterest;
