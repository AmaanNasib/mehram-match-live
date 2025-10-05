import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import { AiOutlineFilter, AiOutlineRedo, AiOutlineClose  } from "react-icons/ai"; // Import icons
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchDataObjectV2 } from "../../../apiUtils";
import { format } from 'date-fns';





const CustomDatePicker = ({ selectedDate, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [internalDate, setInternalDate] = useState(selectedDate ? new Date(selectedDate) : null);

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




const MaritalStatusDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(value || "");

  const maritalStatusOptions = [
    "Single", "Married", "Divorced",
    "Khula", "Widowed"
  ];

  useEffect(() => {
    if (value) {
      setSelectedStatus(value);
    }
  }, [value]);

  const selectStatus = (status) => {
    setSelectedStatus(status);
    onChange(status);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="marital-status-dropdown-container">
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




const TotalIgnoredList = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate1, setSelectedDate1] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDatePicker1, setShowDatePicker1] = useState(false);
  const [matchDetails, setMatchDetails] = useState({});
  const [userId] = useState(localStorage.getItem("userId"));
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [errors, setErrors] = useState({});
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
  };

  const applyFilters = (updatedFilters) => {
    console.log(updatedFilters.id, ">>>");

    setFilteredItems(
      matchDetails?.blocked_users?.filter((match) => {
        return (
          (updatedFilters.id ? match?.user?.id == updatedFilters.id : true) &&
          (updatedFilters.name ? match?.user?.name?.toLowerCase().includes(updatedFilters.name.toLowerCase()) : true) &&
          (updatedFilters.city ? match?.user?.city?.toLowerCase().includes(updatedFilters.city.toLowerCase()) : true) &&
          (updatedFilters.startDate && updatedFilters.endDate
            ? new Date(match?.date) >= new Date(updatedFilters.startDate) && new Date(match?.date) <= new Date(updatedFilters.endDate)
            : true) &&
          (updatedFilters.sectSchoolInfo ? match?.user?.sect_school_info?.toLowerCase().includes(updatedFilters.sectSchoolInfo.toLowerCase()) : true) &&
          (updatedFilters.profession ? match?.user?.profession?.toLowerCase().includes(updatedFilters.profession.toLowerCase()) : true) &&
          (updatedFilters.status ? match?.status?.toLowerCase().includes(updatedFilters.status.toLowerCase()) : true) &&
          (updatedFilters.martialStatus ? match?.user?.martial_status?.toLowerCase().includes(updatedFilters.martialStatus.toLowerCase()) : true)
        );
      })
    );
  };
  const distinctIds = [...new Set(matchDetails?.blocked_users?.map((match) => match?.user?.id))];
  const distinctNames = [...new Set(matchDetails?.blocked_users?.map((match) => match?.user?.name))];
  const distinctCities = [...new Set(matchDetails?.blocked_users?.map((match) => match?.user?.city))];
  const distinctDobs = [...new Set(matchDetails?.blocked_users?.map((match) => match?.user?.dob))];
  const distinctSchoolInfo = [...new Set(matchDetails?.blocked_users?.map((match) => match?.user?.sect_school_info))];
  const distinctProfessions = [...new Set(matchDetails?.blocked_users?.map((match) => match?.user?.profession))];
  const distinctStatuses = [...new Set(matchDetails?.blocked_users?.map((match) => match?.status))];
  const distinctMaritalStatuses = [...new Set(matchDetails?.blocked_users?.map((match) => match?.user?.martial_status))];
  useEffect(() => {
    // Apply filters when `currentItems` or filters change
    setFilteredItems(matchDetails?.blocked_users)
  }, [matchDetails]);
  useEffect(() => {
    if (userId) {
      const parameter = {
        url: `/api/user/blocked/?user_id=${userId}`,
        setterFunction: setMatchDetails,
        setLoading: setLoading,
        setErrors: setErrors
      };
      fetchDataObjectV2(parameter);

    }
  }, [userId]);

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
        <h1 className="page-title">Total Ignored</h1>

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
            onChange={(e) => handleFilterChange('sectSchoolInfo', e.target.value)}
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
            onChange={(e) => handleFilterChange('profession', e.target.value)}
          >
            <option value="">Profession</option>
            {distinctProfessions?.map((profession, index) => (
              <option key={index} value={profession}>
                {profession}
              </option>
            ))}
          </select>

{/* With this new component */}
<MaritalStatusDropdown 
  value={filters.martialStatus || ""}
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
              <th onClick={() => handleSort('id')}>
                ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Name</th>
              <th>Location</th>
              <th onClick={() => handleSort('date')} >Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th>Sect</th>
              <th>Profession</th>
              <th>Marital Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((match) => (
              <tr key={match?.user?.id} onClick={() => navigate(`/details/${match?.user?.id}`)} style={{ cursor: "pointer" }}>
                <td>{match?.user?.id}</td>
                <td>{match?.user?.name || '-'}</td>
                <td>{match?.user?.city || '-'}</td>
                <td>{match?.date || '-'}</td>
                <td>{match?.user?.sect_school_info || '-'}</td>
                <td>{match?.user?.profession || '-'}</td>
                <td>
                  <span className={`marital-badge ${match?.user?.martial_status ? match?.user?.martial_status?.toLowerCase()?.replace(" ", "-") : ''}`}>
                    {match?.user?.martial_status || '-'}
                  </span>
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
        `}
      </style>
    </DashboardLayout>
  );
};

export default TotalIgnoredList;