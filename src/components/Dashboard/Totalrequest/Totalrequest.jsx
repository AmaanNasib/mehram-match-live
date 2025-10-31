import React, { useState, useEffect } from "react";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import { AiOutlineFilter, AiOutlineRedo, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"; // Import icons
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchDataObjectV2, postDataWithFetchV2, putDataWithFetchV2 } from "../../../apiUtils";
import { format } from 'date-fns';



const CustomDatePicker = ({ selectedDate, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [internalDate, setInternalDate] = useState(selectedDate ? new Date(selectedDate) : null);
  const datePickerRef = React.useRef(null);

  // Close date picker when clicking outside
  React.useEffect(() => {
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
        <div className="custom-date-picker-menu" style={{ zIndex: 1000 }}>
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



// Marital Status Dropdown Component for single selection
const MaritalStatusDropdown = ({ value, onChange, userGender }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(value || "");
  const maritalDropdownRef = React.useRef(null);

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
        <div className="marital-status-dropdown-menu" style={{ zIndex: 1001 }}>
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
            width: 150px;
            min-width: 150px;
            flex-shrink: 0;
          }
          
          .marital-status-dropdown-toggle {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            background: #ffffff;
            cursor: pointer;
            font-size: 14px;
            min-height: 36px;
            display: flex;
            align-items: center;
            font-weight: 500;
            color: #374151;
            outline: none;
            transition: all 0.2s ease;
          }
          
          .marital-status-dropdown-toggle:hover {
            border-color: #9ca3af;
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
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
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
            transition: all 0.3s ease;
          }
          
          .marital-status-option.selected {
            background-color: #FF1493;
            color: white;
            border-color: #FF1493;
          }

          .marital-status-option:hover {
            background-color: rgb(20, 255, 134);
            border-color: rgb(20, 255, 134);
            color: white;
          }
          
          .marital-status-note {
            font-size: 12px;
            color: #666;
            margin-bottom: 10px;
          }
        `}
      </style>
    </div>
  );
};

const StatusDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(value || "");
  const statusDropdownRef = React.useRef(null);

  const statusOptions = ["Pending", "Approved", "Rejected"];

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

  const clearStatus = () => {
    setSelectedStatus("");
    onChange("");
    setIsOpen(false);
  };

  return (
    <div className="status-dropdown-container" ref={statusDropdownRef}>
      <div 
        className="status-dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedStatus || "Status"}
        {selectedStatus && (
          <span 
            className="clear-status-btn"
            onClick={(e) => {
              e.stopPropagation();
              clearStatus();
            }}
          >
            ✕
          </span>
        )}
      </div>
      
      {isOpen && (
        <div className="status-dropdown-menu" style={{ zIndex: 1002 }}>
          <h6>Select Status</h6>
          <div className="status-options-grid">
            {statusOptions.map((status) => (
              <div
                key={status}
                className={`status-option status-option-${status.toLowerCase()} ${
                  selectedStatus === status ? "selected" : ""
                }`}
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
            min-width: 150px;
            flex-shrink: 0;
          }
          
          .status-dropdown-toggle {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            background: #ffffff;
            cursor: pointer;
            font-size: 14px;
            min-height: 36px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-weight: 500;
            color: #374151;
            outline: none;
            transition: all 0.2s ease;
          }
          
          .status-dropdown-toggle:hover {
            border-color: #9ca3af;
          }
          
          .clear-status-btn {
            margin-left: 8px;
            color: #ff4d4d;
            font-weight: bold;
            font-size: 16px;
            padding: 0 4px;
            border-radius: 3px;
            transition: all 0.2s ease;
          }
          
          .clear-status-btn:hover {
            background: #fee;
            color: #cc0000;
          }
          
          .status-dropdown-menu {
            position: fixed;
            top: auto;
            left: auto;
            width: 350px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 15px;
            padding: 15px;
            z-index: 1002;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            transform: translateY(0);
          }
          
          .status-options-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 10px;
          }
          
          .status-option {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 50px;
            text-align: center;
            cursor: pointer;
            font-size: 13px;
            white-space: nowrap;
            transition: all 0.3s ease;
          }
          
          .status-option-pending:hover {
            background-color: #90EE90; /* Light green */
            color: #000;
          }
          
          .status-option-accepted:hover {
            background-color: #32CD32; /* Lime green */
            color: #000;
          }
          
          .status-option-rejected:hover {
           background-color: #FF6347; /* Tomato red */
            color: #fff;
          }
          
          .status-option.selected {
            background-color: #FF1493;
            color: white;
            border-color: #FF1493;
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
            transition: background-color 0.3s;
          }
          
          .apply-now-btn:hover {
            background-color: #e01180;
          }
          
          /* Action buttons styling */
          .action-btn {
            width: 30px;
            height: 30px;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            font-weight: bold;
          }
          
          .action-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          }
          
          .approve-btn {
            background-color: #28a745;
            color: white;
          }
          
          .approve-btn:hover {
            background-color: #218838;
          }
          
          .reject-btn {
            background-color: #dc3545;
            color: white;
          }
          
          .reject-btn:hover {
            background-color: #c82333;
          }
          
          .block-btn {
            background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
            color: #212529;
            position: relative;
            overflow: hidden;
            transition: all 0.4s ease;
          }
          
          .block-btn::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
          }
          
          .block-btn:hover {
            background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 6px 20px rgba(255, 152, 0, 0.5);
          }
          
          .block-btn:hover::before {
            width: 300px;
            height: 300px;
          }
          
          .block-btn:active {
            transform: translateY(0) scale(0.98);
            box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
          }
          
          .block-btn svg {
            position: relative;
            z-index: 1;
            transition: transform 0.3s ease;
          }
          
          .block-btn:hover svg {
            transform: rotate(90deg) scale(1.1);
          }
          
          .report-btn {
            background-color: #6f42c1;
            color: white;
          }
          
          .report-btn:hover {
            background-color: #5a32a3;
          }
          
          .modern-btn {
            border-radius: 8px !important;
            width: 36px !important;
            height: 36px !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
            transition: all 0.2s ease !important;
          }
          
          .modern-btn:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          }
          
          .modern-btn svg {
            transition: transform 0.2s ease;
          }
          
          .modern-btn:hover svg {
            transform: scale(1.1);
          }
          
          /* Remove z-index fixes to avoid conflicts */
          
          /* Modern Button Styles */
          .action-btn {
            border: none;
            border-radius: 8px;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
          }
          
          .action-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
          }
          
          .action-btn:hover::before {
            left: 100%;
          }
          
          .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          
          .action-btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          
          .action-btn svg {
            transition: transform 0.2s ease;
            z-index: 1;
            position: relative;
          }
          
          .action-btn:hover svg {
            transform: scale(1.1);
          }
        `}
      </style>
    </div>
  );
};


const TotalRequests = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate1, setSelectedDate1] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDatePicker1, setShowDatePicker1] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'member_id', direction: 'asc' });
  const [matchDetails, setMatchDetails] = useState({
    sent_request: [],
    received_request: [],
    sent_request_accepted: [],
    sent_request_rejected: [],
    received_request_accepted: [],
    received_request_rejected: [],
  });
  const [useError, setError] = useState(false);
  const [useLoading, setLoading] = useState(false);
  const [userId] = useState(localStorage.getItem("userId"));
  const [filteredItems, setFilteredItems] = useState([]);
  const [resetKey, setResetKey] = useState(0);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState(new Set());
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
  });
  let [gender] = useState(localStorage.getItem("gender"));

  const handleFilterChange = (column, value) => {

    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [column]: value };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };
  const onClearFilterClick = () => {
    let clear = {
      member_id: '',
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
  useEffect(() => {
    if (userId) {
      const parameter = {
        url: `/api/user/requested/?user_id=${userId}`,
        setterFunction: (data) => {
          console.log('🚀 INITIAL API Response Data:', data);
          console.log('📋 Received requests count:', data?.received_request?.length || 0);
          console.log('✅ Accepted requests count:', data?.received_request_accepted?.length || 0);
          console.log('❌ Rejected requests count:', data?.received_request_rejected?.length || 0);
          console.log('📤 Sent requests count:', data?.sent_request?.length || 0);
          console.log('✅ Sent accepted count:', data?.sent_request_accepted?.length || 0);
          console.log('❌ Sent rejected count:', data?.sent_request_rejected?.length || 0);
          
          // Data loaded successfully
          
          if (data?.received_request && data.received_request.length > 0) {
            console.log('🔍 First received request:', data.received_request[0]);
            console.log('🔍 First received request status:', data.received_request[0]?.status);
            console.log('🔍 Database status mapping:', {
              'Open': 'Rejected',
              'Requested': 'Pending', 
              'Accepted': 'Approved'
            });
          }
          
          if (data?.received_request_rejected && data.received_request_rejected.length > 0) {
            console.log('🔍 First rejected request:', data.received_request_rejected[0]);
            console.log('🔍 First rejected request status:', data.received_request_rejected[0]?.status);
          }
          
          setMatchDetails(data || {
            sent_request: [],
            received_request: [],
            sent_request_accepted: [],
            sent_request_rejected: [],
            received_request_accepted: [],
            received_request_rejected: []
          });
        },
        setLoading: setLoading,
        setErrors: setError,
      };
      fetchDataObjectV2(parameter);
    }
  }, [userId]);

  // Auto-refresh data every 10 seconds to catch status updates
  useEffect(() => {
    if (userId) {
      console.log('🚀 Setting up auto-refresh for user:', userId);
      const interval = setInterval(() => {
        console.log('🔄 Auto-refreshing data for status updates...');
        const parameter = {
          url: `/api/user/requested/?user_id=${userId}`,
          setterFunction: (data) => {
            console.log('📊 Auto-refresh data received:', data);
            console.log('📋 Received requests:', data?.received_request?.length || 0);
            console.log('✅ Accepted requests:', data?.received_request_accepted?.length || 0);
            console.log('❌ Rejected requests:', data?.received_request_rejected?.length || 0);
            console.log('📤 Sent requests:', data?.sent_request?.length || 0);
            console.log('✅ Sent accepted:', data?.sent_request_accepted?.length || 0);
            console.log('❌ Sent rejected:', data?.sent_request_rejected?.length || 0);
            setMatchDetails(data || {
              sent_request: [],
              received_request: [],
              sent_request_accepted: [],
              sent_request_rejected: [],
              received_request_accepted: [],
              received_request_rejected: []
            });
          },
          setLoading: setLoading,
          setErrors: setError,
        };
        fetchDataObjectV2(parameter);
      }, 10000); // Refresh every 10 seconds for faster updates

      return () => {
        console.log('🛑 Clearing auto-refresh interval');
        clearInterval(interval);
      };
    }
  }, [userId]);

  // Combine all request data into a single array with proper status based on gender and request direction
  console.log('🔄 Processing combinedRequests with matchDetails:', matchDetails);
  console.log('📊 Received requests for processing:', matchDetails.received_request);
  console.log('📊 Rejected requests for processing:', matchDetails.received_request_rejected);
  
  const combinedRequests = [
    // Sent requests - show "Pending" for males (who sent but waiting for response)
    ...matchDetails.sent_request.map((item) => ({ 
      ...item, 
      status: item.status === "Open" ? "Rejected" : (item.status === "Requested" ? "Pending" : item.status),
      user: item.user,
      date: item.date,
      requestType: "sent"
    })),
    // Received requests - show "Pending" for females (who received but haven't responded)
    ...matchDetails.received_request.map((item) => ({ 
      ...item, 
      status: item.status === "Open" ? "Rejected" : (item.status === "Requested" ? "Pending" : item.status),
      user: item.user,
      date: item.date,
      requestType: "received"
    })),
    // Accepted sent requests
    ...matchDetails.sent_request_accepted.map((item) => ({ 
      ...item, 
      status: "Approved",
      user: item.user,
      date: item.date,
      requestType: "sent"
    })),
    // Rejected sent requests
    ...matchDetails.sent_request_rejected.map((item) => ({ 
      ...item, 
      status: item.status === "Open" ? "Rejected" : "Rejected",
      user: item.user,
      date: item.date,
      requestType: "sent"
    })),
    // Accepted received requests
    ...matchDetails.received_request_accepted.map((item) => ({ 
      ...item, 
      status: "Approved",
      user: item.user,
      date: item.date,
      requestType: "received"
    })),
    // Rejected received requests
    ...matchDetails.received_request_rejected.map((item) => ({ 
      ...item, 
      status: item.status === "Open" ? "Rejected" : "Rejected",
      user: item.user,
      date: item.date,
      requestType: "received"
    })),
  ];

  // De-duplicate the same target user appearing in multiple buckets
  // Prefer the most progressed status (Approved/Accepted > Pending/Sent > Rejected/Open)
  const statusRank = {
    Approved: 4,
    Accepted: 4,
    Pending: 3,
    Sent: 3,
    Requested: 3,
    Rejected: 2,
    Open: 1,
  };
  const combinedRequestsUnique = Object.values(
    combinedRequests.reduce((acc, item) => {
      const key = item?.user?.id ?? `${item?.user?.member_id}`;
      const currentRank = statusRank[item?.status] || 0;
      const existing = acc[key];
      if (!existing || currentRank > (statusRank[existing.status] || 0)) {
        acc[key] = item;
      }
      return acc;
    }, {})
  );

  console.log('📋 Final combinedRequests (unique) count:', combinedRequestsUnique.length);
  console.log('📋 Final combinedRequests (unique):', combinedRequestsUnique);
  
  const statusDistribution = {
    pending: combinedRequestsUnique.filter(r => r.status === 'Pending').length,
    approved: combinedRequestsUnique.filter(r => r.status === 'Approved' || r.status === 'Accepted').length,
    rejected: combinedRequestsUnique.filter(r => r.status === 'Rejected').length
  };
  
  console.log('📋 Status distribution:', statusDistribution);
  
  // Status distribution calculated successfully
  const applyFilters = (updatedFilters) => {
    console.log('Applying filters:', updatedFilters);
    setFilteredItems(
      combinedRequestsUnique?.filter((match) => {
        const statusMatch = updatedFilters.status && updatedFilters.status !== "" 
          ? (match?.status?.toLowerCase() === updatedFilters.status.toLowerCase() || 
             (updatedFilters.status.toLowerCase() === 'approved' && match?.status?.toLowerCase() === 'accepted'))
          : true;
        
        return (
          (updatedFilters.member_id ? match?.user?.member_id?.toLowerCase().includes(updatedFilters.member_id.toLowerCase()) : true) &&
          (updatedFilters.name ? match?.user?.name?.toLowerCase().includes(updatedFilters.name.toLowerCase()) : true) &&
          (updatedFilters.city ? match?.user?.city?.toLowerCase().includes(updatedFilters.city.toLowerCase()) : true) &&
          (updatedFilters.startDate && updatedFilters.endDate
            ? new Date(match?.date) >= new Date(updatedFilters.startDate) && new Date(match?.date) <= new Date(updatedFilters.endDate)
            : true) &&
          (updatedFilters.sectSchoolInfo ? match?.user?.sect_school_info?.toLowerCase().includes(updatedFilters.sectSchoolInfo.toLowerCase()) : true) &&
          (updatedFilters.profession ? (
            match?.user?.profession?.toLowerCase().includes(updatedFilters.profession.toLowerCase()) ||
            match?.user?.profession?.toLowerCase().replace(/\s+/g, '_').includes(updatedFilters.profession.toLowerCase().replace(/\s+/g, '_')) ||
            match?.user?.profession?.toLowerCase().replace(/_/g, ' ').includes(updatedFilters.profession.toLowerCase().replace(/_/g, ' '))
          ) : true) &&
          statusMatch &&
          (updatedFilters.martialStatus && updatedFilters.martialStatus !== "" ? 
            match?.user?.martial_status?.toLowerCase() === updatedFilters.martialStatus.toLowerCase() : true)
        );
      })
    );
  };
  const distinctIds = [...new Set(combinedRequestsUnique?.map((match) => match?.user?.id))];
  const distinctNames = [...new Set(combinedRequestsUnique?.map((match) => match?.user?.name))];
  const distinctCities = [...new Set(combinedRequestsUnique?.map((match) => match?.user?.city))];
  const distinctDobs = [...new Set(combinedRequestsUnique?.map((match) => match?.user?.dob))];
  const distinctSchoolInfo = [...new Set(combinedRequestsUnique?.map((match) => match?.user?.sect_school_info))];
  const distinctProfessions = [...new Set(combinedRequestsUnique?.map((match) => match?.user?.profession))];
  const distinctStatuses = [...new Set(combinedRequestsUnique?.map((match) => match?.status))];
  const distinctMaritalStatuses = [...new Set(combinedRequestsUnique?.map((match) => match?.user?.martial_status))];
  // Function to handle delete action
  const handleDelete = (id) => {
    // Remove the item with the given id from the data
    Object.keys(matchDetails).forEach((key) => {
      matchDetails[key] = matchDetails[key].filter((item) => item?.user?.id !== id);
    });
    setMatchDetails({ ...matchDetails }); // Update state to trigger re-render
  };

  // Function to handle photo request actions
  const handleApproveRequest = (requestId, targetUserId) => {
    console.log('Approving request:', requestId, 'for user:', targetUserId);
    console.log('Request ID type:', typeof requestId, 'Value:', requestId);
    
    // No immediate UI update - let backend data fetch handle the update
    console.log('🔄 Approving request - will fetch fresh data from backend...');
    
    const parameter = {
      url: `/api/user/requestphoto/${requestId}/approve/`,
      payload: { approved: 'Accepted' },
      setSuccessMessage: (message) => {
        console.log('Request approved successfully:', message);
        // Force immediate data reload to ensure UI consistency
        setTimeout(() => {
          console.log('Force reloading data after approve...');
          const reloadParameter = {
            url: `/api/user/requested/?user_id=${userId}`,
            setterFunction: (data) => {
              console.log('Reloaded data after approve:', data);
              console.log('Received requests after reload:', data?.received_request);
              console.log('Accepted requests after reload:', data?.received_request_accepted);
              setMatchDetails(data || {
                sent_request: [],
                received_request: [],
                sent_request_accepted: [],
                sent_request_rejected: [],
                received_request_accepted: [],
                received_request_rejected: []
              });
            },
            setLoading: setLoading,
            setErrors: setError,
          };
          fetchDataObjectV2(reloadParameter);
        }, 1000); // Wait 1 second for backend to process
      },
      setErrors: (error) => {
        console.error('❌ Error approving request:', error);
        // Fetch fresh data from backend on error to ensure consistency
        console.log('🔄 Fetching fresh data after error...');
        const reloadParameter = {
          url: `/api/user/requested/?user_id=${userId}`,
          setterFunction: (data) => {
            console.log('📊 Fresh data after error:', data);
            setMatchDetails(data || {
              sent_request: [],
              received_request: [],
              sent_request_accepted: [],
              sent_request_rejected: [],
              received_request_accepted: [],
              received_request_rejected: []
            });
          },
          setLoading: setLoading,
          setErrors: setError,
        };
        fetchDataObjectV2(reloadParameter);
        setError(error);
      },
    };
    putDataWithFetchV2(parameter);
  };

  const handleRejectRequest = (requestId, targetUserId) => {
    console.log('❌ REJECTING REQUEST:', requestId, 'for user:', targetUserId);
    console.log('📊 Current matchDetails before reject:', matchDetails);
    console.log('🔍 Received requests before reject:', matchDetails.received_request);
    
    // Rejecting request
    
    // No immediate UI update - let backend data fetch handle the update
    console.log('🔄 Rejecting request - will fetch fresh data from backend...');
    
    const parameter = {
      url: `/api/user/requestphoto/${requestId}/approve/`,
      payload: { approved: 'Rejected' },
      setSuccessMessage: (message) => {
        console.log('Request rejected successfully:', message);
        // Force immediate data reload to ensure UI consistency
        setTimeout(() => {
          console.log('Force reloading data after reject...');
          const reloadParameter = {
            url: `/api/user/requested/?user_id=${userId}`,
            setterFunction: (data) => {
              console.log('Reloaded data after reject:', data);
              console.log('Received requests after reload:', data?.received_request);
              console.log('Rejected requests after reload:', data?.received_request_rejected);
              setMatchDetails(data || {
                sent_request: [],
                received_request: [],
                sent_request_accepted: [],
                sent_request_rejected: [],
                received_request_accepted: [],
                received_request_rejected: []
              });
            },
            setLoading: setLoading,
            setErrors: setError,
          };
          fetchDataObjectV2(reloadParameter);
        }, 1000); // Wait 1 second for backend to process
      },
      setErrors: (error) => {
        console.error('❌ Error rejecting request:', error);
        // Fetch fresh data from backend on error to ensure consistency
        console.log('🔄 Fetching fresh data after error...');
        const reloadParameter = {
          url: `/api/user/requested/?user_id=${userId}`,
          setterFunction: (data) => {
            console.log('📊 Fresh data after error:', data);
            setMatchDetails(data || {
              sent_request: [],
              received_request: [],
              sent_request_accepted: [],
              sent_request_rejected: [],
              received_request_accepted: [],
              received_request_rejected: []
            });
          },
          setLoading: setLoading,
          setErrors: setError,
        };
        fetchDataObjectV2(reloadParameter);
        setError(error);
      },
    };
    putDataWithFetchV2(parameter);
  };

  const handleBlockUser = (targetUserId) => {
    setUserToBlock(targetUserId);
    setShowBlockModal(true);
  };

  const confirmBlockUser = () => {
    if (!userToBlock) return;
    
    const parameter = {
      url: `/api/recieved/block/`,
      payload: {
        action_by_id: Number(userId),
        action_on_id: Number(userToBlock),
        blocked: true
      },
      setSuccessMessage: (message) => {
        // Add to blocked users set
        setBlockedUsers(prev => new Set([...prev, userToBlock]));
        
        // Reload data
        const reloadParameter = {
          url: `/api/user/requested/?user_id=${userId}`,
          setterFunction: setMatchDetails,
          setLoading: setLoading,
          setErrors: setError,
        };
        fetchDataObjectV2(reloadParameter);
        
        // Close modal
        setShowBlockModal(false);
        setUserToBlock(null);
      },
      setErrors: (error) => {
        setError(error);
        setShowBlockModal(false);
        setUserToBlock(null);
      },
    };
    postDataWithFetchV2(parameter);
  };

  const handleReportUser = (targetUserId) => {
    const parameter = {
      url: `/api/recieved/`,
      payload: {
        action_by_id: Number(userId),
        action_on_id: Number(targetUserId),
        blocked: true,
        status: 'Reported'
      },
      setSuccessMessage: (message) => {
        // Reload data
        const reloadParameter = {
          url: `/api/user/requested/?user_id=${userId}`,
          setterFunction: setMatchDetails,
          setLoading: setLoading,
          setErrors: setError,
        };
        fetchDataObjectV2(reloadParameter);
      },
      setErrors: setError,
    };
    postDataWithFetchV2(parameter);
  };

  // Pagination for the combined table
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems?.slice(indexOfFirstItem, indexOfLastItem);

  // Total pages
  const totalPages = Math.ceil(filteredItems?.length / itemsPerPage);

  // Handle Page Change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    // Use unique list for rendering to avoid duplicates
    setFilteredItems(combinedRequestsUnique)
  }, [matchDetails]);
  const handleSort = (column) => {
    let direction = 'asc';
    if (sortConfig.key === column && sortConfig.direction === 'asc') {
      direction = 'desc'; // Toggle sorting direction
    }
    setSortConfig({ key: column, direction });
  };

  // Function to sort the data based on the current sortConfig


  useEffect(() => {
    if (!filteredItems || filteredItems.length === 0) return;
    
    const sortedData = [...filteredItems].sort((a, b) => {
      let valueA, valueB;

      // Sorting by date
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
      } 
        // Sorting by member_id
      else if (sortConfig.key === 'member_id') {
        valueA = a.user?.member_id || a.user?.id || '';
        valueB = b.user?.member_id || b.user?.id || '';
      }
      // Sorting by name
      else if (sortConfig.key === 'name') {
        valueA = (a.user?.name || '').toLowerCase();
        valueB = (b.user?.name || '').toLowerCase();
      }
      // Sorting by location/city
      else if (sortConfig.key === 'city') {
        valueA = (a.user?.city || '').toLowerCase();
        valueB = (b.user?.city || '').toLowerCase();
      }
      // Sorting by sect
      else if (sortConfig.key === 'sect_school_info') {
        valueA = (a.user?.sect_school_info || '').toLowerCase();
        valueB = (b.user?.sect_school_info || '').toLowerCase();
      }
      // Sorting by profession
      else if (sortConfig.key === 'profession') {
        valueA = (a.user?.profession || '').toLowerCase();
        valueB = (b.user?.profession || '').toLowerCase();
      }
      // Sorting by status
      else if (sortConfig.key === 'status') {
        valueA = (a.status || '').toLowerCase();
        valueB = (b.status || '').toLowerCase();
      }
      // Sorting by marital status
      else if (sortConfig.key === 'martial_status') {
        valueA = (a.user?.martial_status || '').toLowerCase();
        valueB = (b.user?.martial_status || '').toLowerCase();
      }
      // Default: sorting by user field
      else {
        valueA = (a.user?.[sortConfig.key] || '').toString().toLowerCase();
        valueB = (b.user?.[sortConfig.key] || '').toString().toLowerCase();
      }

      // Compare values
      if (valueA < valueB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
      if (valueA > valueB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });
    setFilteredItems(sortedData)
  }, [sortConfig.direction, sortConfig.key])
  return (
    <DashboardLayout>
      <div className="total-interest-container">
        <h1 className="page-title">Total Requests</h1>

        {/* Filters Section */}
        <div className="filter-container">
          <button className="filter-button">
            <AiOutlineFilter className="icon" /> Filter By
          </button>
          <input
            className="filter-dropdown"
            type="text"
            value={filters.member_id}
            onChange={(e) => handleFilterChange('member_id', e.target.value)}
            placeholder="Enter Member ID"
            style={{ 
              width: '120px',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '13px',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#ff6b9d';
              e.target.style.boxShadow = '0 0 0 2px rgba(255, 107, 157, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ddd';
              e.target.style.boxShadow = 'none';
            }}
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
    position: relative;
    z-index: 1;
  }
  
  .filter-container {
    position: relative;
    z-index: 1;
  }
  
  .filter-dropdown {
    position: relative;
    z-index: 2;
  }
  
  .date-picker-container {
    position: relative;
    z-index: 10;
  }
  
  .date-picker-popup {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .status-dropdown {
    position: relative;
    z-index: 3;
  }
  
  .status-dropdown .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1001;
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

          {/* Marital Status Filter - Single Selection */}
          <MaritalStatusDropdown 
            key={`marital-status-${resetKey}`}
            value={filters.martialStatus}
            userGender={gender}
            onChange={(selectedStatus) => {
              setFilters(prevFilters => {
                const updatedFilters = { 
                  ...prevFilters, 
                  martialStatus: selectedStatus 
                };
                applyFilters(updatedFilters);
                return updatedFilters;
              });
            }}
          />

<div className="status-dropdown">
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
</div>


          <button type="button" className="reset-filter" onClick={onClearFilterClick}>
            <AiOutlineRedo className="icon" /> Reset Filter
          </button>
        </div>

        {/* Combined Table */}
        <div style={{ marginBottom: "30px" }}>
          <table className="interest-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('member_id')} style={{ cursor: 'pointer' }}>
                  MEMBER ID {sortConfig.key === 'member_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                  {gender === "male" ? "TARGET USER" : "REQUESTER"} {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('city')} style={{ cursor: 'pointer' }}>
                  Location {sortConfig.key === 'city' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>
                  Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('sect_school_info')} style={{ cursor: 'pointer' }}>
                  Sect {sortConfig.key === 'sect_school_info' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('profession')} style={{ cursor: 'pointer' }}>
                  Profession {sortConfig.key === 'profession' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                  Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('martial_status')} style={{ cursor: 'pointer' }}>
                  Marital Status {sortConfig.key === 'martial_status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                {gender == "female" && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={gender === "female" ? 8 : 7} style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                    <div style={{ fontSize: "16px", marginBottom: "10px" }}>
                      {gender === "male" ? "📤" : "📥"} 
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: "500", marginBottom: "5px" }}>
                      {gender === "male" ? "No Sent Requests" : "No Received Requests"}
                    </div>
                    <div style={{ fontSize: "14px", color: "#888" }}>
                      {gender === "male" 
                        ? "You haven't sent any photo requests yet." 
                        : "You haven't received any photo requests yet."
                      }
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((user, index) => (
                <tr key={index}>
                  <td>{user?.user?.member_id || "N/A"}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <img 
                        src={user?.user?.profile_photo
                          ? `${process.env.REACT_APP_API_URL}${user.user.profile_photo}`
                          : `data:image/svg+xml;utf8,${encodeURIComponent(
                              user?.user?.gender === "male"
                                ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6">
                    <circle cx="12" cy="8" r="5" fill="#bfdbfe"/>
                    <path d="M12 14c-4.42 0-8 2.69-8 6v1h16v-1c0-3.31-3.58-6-8-6z" fill="#bfdbfe"/>
                  </svg>`
                                : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ec4899">
                    <circle cx="12" cy="8" r="5" fill="#fbcfe8"/>
                    <path d="M12 14c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6z" fill="#fbcfe8"/>
                    <circle cx="12" cy="8" r="2" fill="#ec4899"/>
                  </svg>`
                            )}`}
                        alt={user?.user?.name || "User"} 
                        style={{ 
                          width: "32px", 
                          height: "32px", 
                          borderRadius: "50%", 
                          objectFit: "cover",
                          border: "2px solid #e0e0e0"
                        }}
                        onError={(e) => {
                          e.target.src = `data:image/svg+xml;utf8,${encodeURIComponent(
                            user?.user?.gender === "male"
                              ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6">
                    <circle cx="12" cy="8" r="5" fill="#bfdbfe"/>
                    <path d="M12 14c-4.42 0-8 2.69-8 6v1h16v-1c0-3.31-3.58-6-8-6z" fill="#bfdbfe"/>
                  </svg>`
                              : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ec4899">
                    <circle cx="12" cy="8" r="5" fill="#fbcfe8"/>
                    <path d="M12 14c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6z" fill="#fbcfe8"/>
                    <circle cx="12" cy="8" r="2" fill="#ec4899"/>
                  </svg>`
                          )}`;
                        }}
                      />
                      <span>
                        {gender === "male" ? (
                          // Male user - show target user (female) details
                          user?.user?.name || "-"
                        ) : (
                          // Female user - show requester (male) details
                          user?.user?.name || "-"
                        )}
                      </span>
                    </div>
                  </td>
                  <td>{user?.user?.city || user?.user?.location || "-"}</td>
                  <td>{user?.date || "-"}</td>
                  <td>{user?.user?.sect_school_info || user?.user?.sect || "-"}</td>
                  <td>{user?.user?.profession || "-"}</td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {/* Primary Status with gender-aware mapping */}
                      {(() => {
                        const raw = user.status;
                        const isMale = gender === 'male';
                        const isBlocked = blockedUsers.has(user?.user?.id);
                        
                        if (isBlocked) {
                          return (
                            <span className="status-badge blocked-badge">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '4px', verticalAlign: 'middle' }}>
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                                <path d="M4.93 4.93l14.14 14.14" stroke="currentColor" strokeWidth="2"/>
                              </svg>
                              Blocked
                            </span>
                          );
                        }
                        
                        if (raw === 'Accepted' || raw === 'Approved') {
                          return (
                            <>
                              <span className="status-badge approved">Approved</span>
                              {isMale ? (
                                <span className="status-badge sent">Sent</span>
                              ) : (
                                <span className="status-badge received">Received</span>
                              )}
                            </>
                          );
                        }
                        if (raw === 'Requested' || raw === 'Pending') {
                          return (
                            <>
                              <span className="status-badge pending">Pending</span>
                              {isMale ? (
                                <span className="status-badge sent">Sent</span>
                              ) : (
                                <span className="status-badge received">Received</span>
                              )}
                            </>
                          );
                        }
                        // Open treated as Rejected
                        if (raw === 'Open' || raw === 'Rejected') {
                          return (
                            <>
                              <span className="status-badge rejected">Rejected</span>
                              {isMale ? (
                                <span className="status-badge sent">Sent</span>
                              ) : (
                                <span className="status-badge received">Received</span>
                              )}
                            </>
                          );
                        }
                        return <span className={`status-badge ${(raw || '').toLowerCase()}`}>{raw || 'N/A'}</span>;
                      })()}
              
                    </div>
                  </td>
                  <td>
                    <span className={`marital-badge ${user?.user?.martial_status?user?.user?.martial_status?.toLowerCase()?.replace(" ", "-"):"not-mentioned"}`}>
                      {user?.user?.martial_status || "Not mentioned"}
                    </span>
                  </td>
                  {gender == "female" && <td>
                    <div style={{ display: "flex", gap: "5px", alignItems: "center", flexWrap: "wrap" }}>
                      {/* Only show action buttons for pending/received requests */}
                      {(user.status === "Pending" || user.status === "Received") && (
                        <>
                          <button
                            className="action-btn approve-btn modern-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Button clicked - Full user object:', user);
                              console.log('User ID:', user?.id, 'Target User ID:', user?.user?.id);
                              console.log('Available fields:', Object.keys(user));
                              // Try different possible request ID fields
                              const requestId = user?.id || user?.request_id || user?.requestId || user?.user?.id;
                              console.log('Using request ID:', requestId);
                              handleApproveRequest(requestId, user?.user?.id);
                            }}
                            title="Approve Request"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20 6L9 17l-5-5"/>
                            </svg>
                          </button>
                          <button
                            className="action-btn reject-btn modern-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Reject button clicked - Full user object:', user);
                              console.log('Available fields:', Object.keys(user));
                              // Try different possible request ID fields
                              const requestId = user?.id || user?.request_id || user?.requestId || user?.user?.id;
                              console.log('Using request ID for reject:', requestId);
                              handleRejectRequest(requestId, user?.user?.id);
                            }}
                            title="Reject Request"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                          </button>
                        </>
                      )}
                      
                      {/* Block and Report buttons for all requests */}
                      <button
                        className="action-btn block-btn modern-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBlockUser(user?.user?.id);
                        }}
                        title="Block User"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                      </button>
                      <button
                        className="action-btn report-btn modern-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReportUser(user?.user?.id);
                        }}
                        title="Report User"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </button>
                    </div>
                  </td>}
                </tr>
                ))
              )}
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
                className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
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
            color: #1f2937;
            font-weight: 600;
            font-size: 24px;
            text-align: left;
            margin-bottom: 24px;
            line-height: 1.2;
          }
  .filter-container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
    padding: 20px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
          .filter-button, .reset-filter {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            background: #ffffff;
            color: #374151;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          }
          
          .filter-button:hover, .reset-filter:hover {
            border-color: #9ca3af;
            background: #f9fafb;
          }
          
          .reset-filter {
            color: #dc2626;
            border-color: #fecaca;
            background: #fef2f2;
          }
          
          .reset-filter:hover {
            border-color: #f87171;
            background: #fee2e2;
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
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          
          .interest-table th {
            background: #f9fafb;
            color: #374151;
            font-weight: 600;
            padding: 12px 16px;
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            transition: all 0.2s ease;
            border-bottom: 1px solid #e5e7eb;
            border-right: 1px solid #e5e7eb;
            user-select: none;
          }
          
          .interest-table th[style*="cursor: pointer"] {
            cursor: pointer;
          }
          
          .interest-table th[style*="cursor: pointer"]:hover {
            background: #e0e0e0;
            color: #CB3B8B;
          }
          
          .interest-table th:hover {
            background: #f3f4f6;
          }
          
          .interest-table th:last-child {
            border-right: none;
          }
          
          .interest-table td {
            padding: 12px 16px;
            border-bottom: 1px solid #f3f4f6;
            border-right: 1px solid #f3f4f6;
            font-size: 14px;
            color: #1f2937;
            background: #ffffff;
          }
          
          .interest-table td:last-child {
            border-right: none;
          }
          
          .interest-table tr:hover {
            background: #f9fafb;
          }
          
          .interest-table tr:last-child td {
            border-bottom: none;
          }
          .table-row {
            cursor: pointer;
          }
          .table-row:hover {
            background: #f1f1f1;
          }
          .status-badge {
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
          .status-badge.sent {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            border-color: #047857;
          }
          .status-badge.pending {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: #ffffff;
            border-color: #b45309;
          }
          .status-badge.received {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: #ffffff;
            border-color: #1e40af;
          }
          .status-badge.pending {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: #ffffff;
            border-color: #b45309;
          }
          .status-badge.approved, .status-badge.accepted {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            border-color: #047857;
          }
          .status-badge.rejected {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: #ffffff;
            border-color: #b91c1c;
          }
          .status-badge.blocked-badge {
            background: linear-gradient(135deg, #ff4d4d 0%, #cc0000 100%);
            color: #ffffff;
            border-color: #990000;
            display: inline-flex;
            align-items: center;
            animation: blockBadgePulse 2s infinite;
          }
          @keyframes blockBadgePulse {
            0%, 100% {
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 0 rgba(255, 77, 77, 0.7);
            }
            50% {
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 8px rgba(255, 77, 77, 0);
            }
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
          .delete-icon {
            cursor: pointer;
            color: #ff4d4d;
            font-size: 18px;
          }
          .delete-icon:hover {
            color: #cc0000;
          }
          .edit-icon {
            cursor: pointer;
            color: #007bff;
            font-size: 18px;
          }
          .edit-icon:hover {
            color: #0056b3;
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
        `}
      </style>

      {/* Block Confirmation Modal */}
      {showBlockModal && (
        <div className="block-modal-overlay" onClick={() => setShowBlockModal(false)}>
          <div className="block-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="block-modal-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#ff4d4d" strokeWidth="2" fill="#fee"/>
                <path d="M4.93 4.93l14.14 14.14" stroke="#ff4d4d" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h2>Block User?</h2>
            <p>Are you sure you want to block this user? They won't be able to send you requests or interact with your profile.</p>
            <div className="block-modal-actions">
              <button className="modal-btn cancel-btn" onClick={() => setShowBlockModal(false)}>
                Cancel
              </button>
              <button className="modal-btn confirm-btn" onClick={confirmBlockUser}>
                Yes, Block User
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .block-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .block-modal-content {
          background: white;
          padding: 40px;
          border-radius: 20px;
          max-width: 450px;
          width: 90%;
          text-align: center;
          animation: slideUp 0.3s ease;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .block-modal-icon {
          margin-bottom: 20px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .block-modal-content h2 {
          font-size: 28px;
          color: #333;
          margin-bottom: 15px;
          font-weight: 700;
        }

        .block-modal-content p {
          font-size: 16px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 30px;
        }

        .block-modal-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .modal-btn {
          padding: 12px 30px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 140px;
        }

        .cancel-btn {
          background: #f0f0f0;
          color: #666;
        }

        .cancel-btn:hover {
          background: #e0e0e0;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .confirm-btn {
          background: linear-gradient(135deg, #ff4d4d, #cc0000);
          color: white;
        }

        .confirm-btn:hover {
          background: linear-gradient(135deg, #cc0000, #990000);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 77, 77, 0.4);
        }

        .modal-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </DashboardLayout>
  );
};

export default TotalRequests;





