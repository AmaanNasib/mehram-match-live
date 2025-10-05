import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import { AiOutlineFilter, AiOutlineRedo, AiOutlineDelete, AiOutlineClose } from "react-icons/ai"; // Import icons
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchDataObjectV2 } from "../../../apiUtils";
import { format } from 'date-fns';




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
            position: fixed;
            top: auto;
            left: auto;
            width: 300px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 15px;
            padding: 15px;
            z-index: 9999;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            transform: translateY(0);
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


// Marital Status Dropdown Component
const MaritalStatusDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(value || "");
  const maritalDropdownRef = useRef(null);

  const maritalStatusOptions = [
    "Single", "Married", "Divorced",
    "Khula", "Widowed"
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
            position: fixed;
            top: auto;
            left: auto;
            width: 400px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 15px;
            padding: 15px;
            z-index: 9999;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            transform: translateY(0);
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
            border-color: rgb(20, 255, 134);
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


const TotalShortlist = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate1, setSelectedDate1] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDatePicker1, setShowDatePicker1] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [matchDetails, setMatchDetails] = useState({ shortlisted_users: [] });
  const [useError, setError] = useState(false);
  const [useLoading, setLoading] = useState(false);
  const [userId] = useState(localStorage.getItem("userId"));
  const [filteredItems, setFilteredItems] = useState([]);
  const [showRemovalModal, setShowRemovalModal] = useState(false);
  const [selectedUserForRemoval, setSelectedUserForRemoval] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);
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
  const [resetKey, setResetKey] = useState(0);
  
  const onClearFilterClick = () => {
    let clear = {
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

  const applyFilters = (updatedFilters) => {
    console.log(updatedFilters.id, ">>>");

    setFilteredItems(
      matchDetails?.shortlisted_users?.filter((match) => {
        return (
          (updatedFilters.id ? match?.user?.id == updatedFilters.id : true) &&
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
          (updatedFilters.status ? match?.status?.toLowerCase().includes(updatedFilters.status.toLowerCase()) : true) &&
          (updatedFilters.martialStatus ? match?.user?.martial_status?.toLowerCase().includes(updatedFilters.martialStatus.toLowerCase()) : true)
        );
      })
    );
  };
  const distinctIds = [...new Set(matchDetails?.shortlisted_users?.map((match) => match?.user?.id))];
  const distinctNames = [...new Set(matchDetails?.shortlisted_users?.map((match) => match?.user?.name))];
  const distinctCities = [...new Set(matchDetails?.shortlisted_users?.map((match) => match?.user?.city))];
  const distinctDobs = [...new Set(matchDetails?.shortlisted_users?.map((match) => match?.user?.date))];
  const distinctSchoolInfo = [...new Set(matchDetails?.shortlisted_users?.map((match) => match?.user?.sect_school_info))];
  const distinctProfessions = [...new Set(matchDetails?.shortlisted_users?.map((match) => match?.user?.profession))];
  const distinctStatuses = [...new Set(matchDetails?.shortlisted_users?.map((match) => match?.status))];
  const distinctMaritalStatuses = [...new Set(matchDetails?.shortlisted_users?.map((match) => match?.user?.martial_status))];
  useEffect(() => {
    // Apply filters when `currentItems` or filters change
    setFilteredItems(matchDetails?.shortlisted_users)
  }, [matchDetails]);
  // Function to handle delete action

  useEffect(() => {
    if (userId) {
      const parameter = {
        url: `/api/user/shortlisted/?user_id=${userId}`,
        setterFunction: setMatchDetails,
        setLoading: setLoading,
        setErrors: setError,
      };
      fetchDataObjectV2(parameter);
    }
  }, [userId])
  const handleDelete = (user) => {
    setSelectedUserForRemoval(user);
    setShowRemovalModal(true);
  };

  const confirmRemoval = async () => {
    if (!selectedUserForRemoval) return;
    
    setIsRemoving(true);
    try {
      // API call to remove from shortlist
      const removeData = {
        action_by_id: userId,
        action_on_id: selectedUserForRemoval.id,
        shortlisted: false // Set to false to remove from shortlist
      };

      const parameter = {
        url: `/api/recieved/`,
        method: 'POST',
        data: removeData,
        setLoading: setIsRemoving,
        setErrors: setError
      };

      await fetchDataObjectV2(parameter);
      
      // Remove from local state after successful API call
      setMatchDetails({ 
        shortlisted_users: matchDetails?.shortlisted_users?.filter(
          match => match?.user?.id !== selectedUserForRemoval.id
        ) 
      });
      
      // Close modal and reset
      setShowRemovalModal(false);
      setSelectedUserForRemoval(null);
      
    } catch (error) {
      console.error('Error removing from shortlist:', error);
      setError('Failed to remove from shortlist. Please try again.');
    } finally {
      setIsRemoving(false);
    }
  };

  const cancelRemoval = () => {
    setShowRemovalModal(false);
    setSelectedUserForRemoval(null);
  };

  // Pagination
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
      } else {
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



   // Handle marital status filter change
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
        <h1 className="page-title">Total Shortlist</h1>

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
            placeholder="Enter Member ID"
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

          {/* Use the MaritalStatusDropdown component */}
          <MaritalStatusDropdown 
            key={`marital-status-${resetKey}`}
            value={filters.martialStatus}
            onChange={handleMaritalStatusChange}
          />


          {/* <select
          className="filter-dropdown"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">Status</option>
          {distinctStatuses?.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </select> */}


          <button type="button" className="reset-filter" onClick={onClearFilterClick}>
            <AiOutlineRedo className="icon" /> Reset Filter
          </button>
        </div>

        {/* Table Section */}
        <table className="interest-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('member_id')}>
                MEMBER ID {sortConfig.key === 'member_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Name</th>
              <th>Location</th>
              <th onClick={() => handleSort('date')} >Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th>Sect</th>
              <th>Profession</th>
              <th>Marital Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((match) => (
              <tr key={match?.user?.id} style={{ cursor: "pointer" }}>
                <td>{match?.user?.member_id || "N/A"}</td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <img 
                      src={match?.user?.profile_photo
                        ? `${process.env.REACT_APP_API_URL || 'https://mehram-match.onrender.com'}${match.user.profile_photo}`
                        : `data:image/svg+xml;utf8,${encodeURIComponent(
                            match?.user?.gender === "male"
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
                      alt={match?.user?.name || "User"} 
                      style={{ 
                        width: "32px", 
                        height: "32px", 
                        borderRadius: "50%", 
                        objectFit: "cover",
                        border: "2px solid #e0e0e0"
                      }}
                      onError={(e) => {
                        e.target.src = `data:image/svg+xml;utf8,${encodeURIComponent(
                          match?.user?.gender === "male"
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
                    <span>{match?.user?.name || 'NA'}</span>
                  </div>
                </td>
                <td>{match?.user?.city || 'NA'}</td>
                <td>{match?.date || 'NA'}</td>
                <td>{match?.user?.sect_school_info || 'NA'}</td>
                <td>{match?.user?.profession || 'NA'}</td>
                <td>
                  <span className={`marital-badge ${match?.user?.martial_status ? match?.user?.martial_status.toLowerCase().replace(" ", "-") : 'not-mentioned'}`}>
                    {match?.user?.martial_status || 'NA'}
                  </span>
                </td>
                <td>
                  <div className="action-container">
                    <button
                      className="unshortlist-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                        handleDelete(match?.user);
                      }}
                      disabled={isRemoving}
                      title="Remove from Shortlist"
                    >
                      <AiOutlineDelete className="delete-icon" />
                      <span>Unshortlist</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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

        {/* Professional Modern Modal */}
        {showRemovalModal && (
          <div className="modern-modal-overlay" onClick={cancelRemoval}>
            <div className="modern-modal-container" onClick={(e) => e.stopPropagation()}>
              
              {/* Header Section */}
              <div className="modern-modal-header">
                <div className="header-icon-wrapper">
                  <div className="warning-icon">⚠️</div>
                </div>
                <h2 className="modal-title">Remove from Shortlist</h2>
                <button className="modern-close-btn" onClick={cancelRemoval}>
                  <AiOutlineClose />
                </button>
              </div>

              {/* Body Section */}
              <div className="modern-modal-body">
                <div className="confirmation-text">
                  You're about to remove this candidate from your shortlist
                </div>
                
                {selectedUserForRemoval && (
                  <div className="candidate-preview-card">
                    <div className="candidate-avatar">
                      <div className="avatar-placeholder">
                        {selectedUserForRemoval.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </div>
                    <div className="candidate-info">
                      <div className="candidate-name">{selectedUserForRemoval.name}</div>
                      <div className="candidate-meta">
                        <span className="meta-item">
                          <span className="meta-label">ID:</span> 
                          <span className="meta-value">{selectedUserForRemoval.id}</span>
                        </span>
                        <span className="meta-item">
                          <span className="meta-label">Profession:</span> 
                          <span className="meta-value">{selectedUserForRemoval.profession || 'Not specified'}</span>
                        </span>
                        <span className="meta-item">
                          <span className="meta-label">Location:</span> 
                          <span className="meta-value">{selectedUserForRemoval.city || 'Not specified'}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="modern-warning">
                  <div className="warning-icon-small">🔒</div>
                  <div className="warning-content">
                    <div className="warning-title">This action cannot be undone</div>
                    <div className="warning-subtitle">The candidate will be permanently removed from your shortlist</div>
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <div className="modern-modal-footer">
                <button 
                  className="modern-cancel-btn" 
                  onClick={cancelRemoval}
                  disabled={isRemoving}
                >
                  <span>Keep in Shortlist</span>
                </button>
                <button 
                  className="modern-confirm-btn" 
                  onClick={confirmRemoval}
                  disabled={isRemoving}
                >
                  <span className="btn-content">
                    {isRemoving ? (
                      <>
                        <div className="spinner"></div>
                        <span>Removing...</span>
                      </>
                    ) : (
                      <>
                        <AiOutlineDelete />
                        <span>Remove Candidate</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
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
            min-width: 0;
            overflow: hidden;
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
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            background: #ffffff;
            font-size: 14px;
            font-weight: 500;
            color: #374151;
            outline: none;
            transition: all 0.2s ease;
            min-width: 120px;
          }
          
          .filter-dropdown:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          
          .filter-dropdown:hover {
            border-color: #9ca3af;
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
            cursor: pointer;
            transition: background-color 0.2s ease;
            border-bottom: 1px solid #e5e7eb;
            border-right: 1px solid #e5e7eb;
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
          
          .action-container {
            display: flex;
            justify-content: center;
          }
          
          .unshortlist-btn {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 6px 12px;
            background: #fff;
            border: 1px solid #ff4d4d;
            border-radius: 5px;
            color: #ff4d4d;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            transition: all 0.3s ease;
          }
          
          .unshortlist-btn:hover {
            background: #ff4d4d;
            color: white;
          }
          
          .unshortlist-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          
          .delete-icon {
            font-size: 14px;
          }
          
          /* Modern Professional Modal Styles */
          .modern-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8));
            backdrop-filter: blur(8px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
          }
          
          .modern-modal-container {
            background: linear-gradient(145deg, #ffffff, #f8f9fa);
            border-radius: 24px;
            width: 90%;
            max-width: 540px;
            box-shadow: 
              0 25px 50px rgba(0, 0, 0, 0.15),
              0 0 0 1px rgba(255, 255, 255, 0.8),
              inset 0 1px 0 rgba(255, 255, 255, 0.9);
            animation: modalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes modalSlideUp {
            from {
              opacity: 0;
              transform: translateY(50px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          .modern-modal-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 28px 32px;
            display: flex;
            align-items: center;
            gap: 16px;
            position: relative;
          }
          
          .header-icon-wrapper {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 16px;
            padding: 12px;
            backdrop-filter: blur(10px);
          }
          
          .warning-icon {
            font-size: 24px;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
          }
          
          .modal-title {
            flex: 1;
            margin: 0;
            color: white;
            font-size: 22px;
            font-weight: 600;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            letter-spacing: 0.3px;
          }
          
          .modern-close-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
          }
          
          .modern-close-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.05);
          }
          
          .modern-modal-body {
            padding: 32px;
          }
          
          .confirmation-text {
            font-size: 18px;
            color: #2c3e50;
            margin-bottom: 24px;
            font-weight: 500;
            text-align: center;
            line-height: 1.5;
          }
          
          .candidate-preview-card {
            background: linear-gradient(145deg, #f8f9fa, #ffffff);
            border-radius: 20px;
            padding: 24px;
            display: flex;
            align-items: center;
            gap: 20px;
            margin: 24px 0;
            border: 1px solid rgba(0, 0, 0, 0.05);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
          }
          
          .candidate-avatar {
            flex-shrink: 0;
          }
          
          .avatar-placeholder {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: 700;
            color: white;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          
          .candidate-info {
            flex: 1;
            min-width: 0;
          }
          
          .candidate-name {
            font-size: 20px;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 8px;
            letter-spacing: 0.3px;
          }
          
          .candidate-meta {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          
          .meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
          }
          
          .meta-label {
            color: #7f8c8d;
            font-weight: 500;
            min-width: 80px;
          }
          
          .meta-value {
            color: #2c3e50;
            font-weight: 600;
            background: rgba(103, 126, 234, 0.1);
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 13px;
          }
          
          .modern-warning {
            background: linear-gradient(135deg, #fff5f5, #fef2f2);
            border: 1px solid #fecaca;
            border-radius: 16px;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 16px;
            margin-top: 24px;
          }
          
          .warning-icon-small {
            font-size: 20px;
            filter: drop-shadow(0 2px 4px rgba(239, 68, 68, 0.2));
          }
          
          .warning-content {
            flex: 1;
          }
          
          .warning-title {
            font-size: 16px;
            font-weight: 700;
            color: #dc2626;
            margin-bottom: 4px;
            letter-spacing: 0.2px;
          }
          
          .warning-subtitle {
            font-size: 14px;
            color: #7f1d1d;
            line-height: 1.4;
          }
          
          .modern-modal-footer {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            padding: 24px 32px;
            display: flex;
            justify-content: flex-end;
            gap: 16px;
            border-top: 1px solid rgba(0, 0, 0, 0.05);
          }
          
          .modern-cancel-btn, .modern-confirm-btn {
            padding: 14px 28px;
            border: none;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            letter-spacing: 0.3px;
            min-width: 140px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .modern-cancel-btn {
            background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
            color: #475569;
            border: 1px solid rgba(71, 85, 105, 0.2);
          }
          
          .modern-cancel-btn:hover {
            background: linear-gradient(135deg, #cbd5e1, #94a3b8);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(71, 85, 105, 0.15);
          }
          
          .modern-confirm-btn {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            border: 1px solid rgba(220, 38, 38, 0.3);
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
          }
          
          .modern-confirm-btn:hover {
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
          }
          
          .btn-content {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .spinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .modern-cancel-btn:disabled, .modern-confirm-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }
          
          /* Mobile responsiveness */
          @media (max-width: 768px) {
            .modern-modal-container {
              width: 95%;
              margin: 0 10px;
            }
            
            .modern-modal-header {
              padding: 20px;
            }
            
            .modern-modal-body {
              padding: 24px 20px;
            }
            
            .modern-modal-footer {
              padding: 20px;
              flex-direction: column;
            }
            
            .modern-cancel-btn, .modern-confirm-btn {
              width: 100%;
              min-width: auto;
            }
            
            .candidate-preview-card {
              flex-direction: column;
              text-align: center;
            }
            
            .candidate-meta {
              align-items: center;
            }
          }
        `}
      </style>
    </DashboardLayout>
  );
};

export default TotalShortlist;