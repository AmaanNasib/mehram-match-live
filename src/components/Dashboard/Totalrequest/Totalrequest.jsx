import React, { useState, useEffect } from "react";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import { AiOutlineFilter, AiOutlineRedo, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"; // Import icons
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



const StatusDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState(value || []);

  const statusOptions = ["Pending", "Accepted", "Rejected"];

  useEffect(() => {
    if (value) {
      setSelectedStatuses(Array.isArray(value) ? value : [value]);
    }
  }, [value]);

  const toggleStatus = (status) => {
    const newSelected = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
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
        {selectedStatuses.length > 0 && (
          <span className="status-count-badge">{selectedStatuses.length}</span>
        )}
      </div>
      
      {isOpen && (
        <div className="status-dropdown-menu">
          <h6>Select Status</h6>
          <div className="status-options-row">
            {statusOptions.map((status) => (
              <div
                key={status}
                className={`status-option status-option-${status.toLowerCase()} ${
                  selectedStatuses.includes(status) ? "selected" : ""
                }`}
                onClick={() => toggleStatus(status)}
              >
                {status}
              </div>
            ))}
          </div>
          <div className="status-note">
            *You can choose multiple Statuses
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
            justify-content: space-between;
            font-weight: 600;
            color: #333;
          }
          
          .status-count-badge {
            background-color: #FF1493;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
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
          
          .status-options-row {
            display: flex;
            gap: 8px;
            margin-bottom: 10px;
          }
          
          .status-option {
            flex: 1;
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
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
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
  useEffect(() => {
    if (userId) {
      const parameter = {
        url: `/api/user/requested/?user_id=${userId}`,
        setterFunction: setMatchDetails,
        setLoading: setLoading,
        setErrors: setError,
      };
      fetchDataObjectV2(parameter);
    }
  }, [userId]);

  // Combine all request data into a single array with proper status based on gender and request direction
  const combinedRequests = [
    ...matchDetails.sent_request.map((item) => ({ ...item, status: "Pending" })),
    ...matchDetails.received_request.map((item) => ({ ...item, status: "Pending" })),
    ...matchDetails.sent_request_accepted.map((item) => ({ ...item, status: "Approved" })),
    ...matchDetails.sent_request_rejected.map((item) => ({ ...item, status: "Rejected" })),
    ...matchDetails.received_request_accepted.map((item) => ({ ...item, status: "Approved" })),
    ...matchDetails.received_request_rejected.map((item) => ({ ...item, status: "Rejected" })),
  ];
  const applyFilters = (updatedFilters) => {
    console.log(updatedFilters.id, ">>>");

    setFilteredItems(
      combinedRequests?.filter((match) => {
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
  const distinctIds = [...new Set(combinedRequests?.map((match) => match?.user?.id))];
  const distinctNames = [...new Set(combinedRequests?.map((match) => match?.user?.name))];
  const distinctCities = [...new Set(combinedRequests?.map((match) => match?.user?.city))];
  const distinctDobs = [...new Set(combinedRequests?.map((match) => match?.user?.dob))];
  const distinctSchoolInfo = [...new Set(combinedRequests?.map((match) => match?.user?.sect_school_info))];
  const distinctProfessions = [...new Set(combinedRequests?.map((match) => match?.user?.profession))];
  const distinctStatuses = [...new Set(combinedRequests?.map((match) => match?.status))];
  const distinctMaritalStatuses = [...new Set(combinedRequests?.map((match) => match?.user?.martial_status))];
  // Function to handle delete action
  const handleDelete = (id) => {
    // Remove the item with the given id from the data
    Object.keys(matchDetails).forEach((key) => {
      matchDetails[key] = matchDetails[key].filter((item) => item?.user?.id !== id);
    });
    setMatchDetails({ ...matchDetails }); // Update state to trigger re-render
  };

  // Function to handle edit action
  const handleEdit = (id) => {
    // Add your edit logic here
    console.log(`Edit item with ID: ${id}`);
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
    // Apply filters when `currentItems` or filters change
    setFilteredItems(combinedRequests)
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

          {/* <select
          className="filter-dropdown"
          value={filters.martialStatus}
          onChange={(e) => handleFilterChange('martialStatus', e.target.value)}
        >
          <option value="">Martial Status</option>
          {distinctMaritalStatuses?.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </select> */}


<StatusDropdown 
  value={filters.status ? filters.status.split(',') : []}
  onChange={(selectedStatuses) => {
    setFilters(prevFilters => {
      const updatedFilters = { 
        ...prevFilters, 
        status: selectedStatuses.join(',') 
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

        {/* Combined Table */}
        <div style={{ marginBottom: "30px" }}>
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
                <th>Status</th>
                {gender == "female" && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user, index) => (
                <tr key={index}>
                  <td>{user?.user?.id}</td>
                  <td>{user?.user?.name}</td>
                  <td>{user?.user?.city || "-"}</td>
                  <td>{user?.date || "-"}</td>
                  <td>{user?.user?.sect_school_info || "-"}</td>
                  <td>{user?.user?.profession || "-"}</td>
                  <td>
                    <span className={`status-badge ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                    {/* Show request direction based on gender and requestType */}
                    <div style={{ fontSize: "10px", color: "#666", marginTop: "2px" }}>
                      {gender === "male" ? (
                        user.requestType === "sent" ? "Request Sent" : "Request Received"
                      ) : (
                        user.requestType === "received" ? "Request Received" : "Request Sent"
                      )}
                    </div>
                  </td>
                  {gender == "female" && <td>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      <AiOutlineEdit
                        className="edit-icon"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click event
                          handleEdit(user?.user?.id);
                        }}
                      />
                      <AiOutlineDelete
                        className="delete-icon"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click event
                          handleDelete(user?.user?.id);
                        }}
                      />
                    </div>
                  </td>}
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
          .status-badge {
            padding: 5px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: bold;
            text-transform: capitalize;
            display: inline-block;
          }
          .status-badge.pending {
            background: #e3f7f0;
            color: #18a558;
          }
          .status-badge.accepted {
            background: #d1f8d1;
            color: #2c7a2c;
          }
          .status-badge.rejected {
            background: #ffc0cb;
            color: #c4002b;
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
    </DashboardLayout>
  );
};

export default TotalRequests;





// import React, { useState ,useEffect} from "react";
// import DashboardLayout from "../UserDashboard/DashboardLayout";
// import { AiOutlineFilter, AiOutlineRedo, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"; // Import icons
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { fetchDataObjectV2 } from "../../../apiUtils";

// const TotalRequests = () => {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [matchDetails, setMatchDetails] = useState({
//     "sent_request": [],
//     "received_request": [],
//     "sent_request_accepted": [],
//     "sent_request_rejected": [],
//     "received_request_accepted": [],
//     "received_request_rejected": []
// });
//   const [useError, setError] = useState(false);
//   const [useLoading, setLoading] = useState(false);
//   const [userId] = useState(localStorage.getItem("userId"));

//   useEffect(() => {
//     if (userId) {
//       const parameter = {
//         url: `/api/user/requested/?user_id=${userId}`,
//         setterFunction: setMatchDetails,
//         setLoading: setLoading,
//         setErrors: setError,
//       };
//       fetchDataObjectV2(parameter);
//     }
//   }, [userId])
//   const requestData = matchDetails

//   // Function to handle delete action
//   const handleDelete = (id) => {
//     // Remove the item with the given id from the data
//     Object.keys(requestData).forEach((key) => {
//       requestData[key] = requestData[key].filter((item) => item?.user?.id !== id);
//     });
//   };

//   // Function to handle edit action
//   const handleEdit = (id) => {
//     // Add your edit logic here
//     console.log(`Edit item with ID: ${id}`);
//   };

//   // Reusable RequestTable component
//   const RequestTable = ({ title, data }) => {
//     // Pagination for each table
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 5;

//     // Get current items
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

//     // Total pages
//     const totalPages = Math.ceil(data.length / itemsPerPage);

//     // Handle Page Change
//     const handlePageChange = (pageNumber) => {
//       setCurrentPage(pageNumber);
//     };

//     return (
//       <div style={{ marginBottom: "30px" }}>
//         <h2 style={{ fontWeight: "500", fontSize: "18px", color: "#444", textAlign: "left", marginBottom: "10px" }}>{title}</h2>
//         <table className="interest-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Location</th>
//               <th>Date</th>
//               <th>Sect</th>
//               <th>Profession</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentItems.map((user) => (
//               <tr key={user?.user?.id}>
//                 <td>{user?.user?.id}</td>
//                 <td>{user?.user?.name}</td>
//                 <td>{user?.user?.city||"-"}</td>
//                 <td>{user?.user?.dob||"-"}</td>
//                 <td>{user?.user?.sect_school_info||"-"}</td>
//                 <td>{user?.user?.profession ||"-"}</td>
//                 <td>
//                   <span className={`status-badge ${user?.user?.status?user?.user?.status.toLowerCase():'not-mentioned'}`}>
//                     {user?.user?.status ||"N/A"}
//                   </span>
//                 </td>
//                 <td>
//                   <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//                     <AiOutlineEdit
//                       className="edit-icon"
//                       onClick={(e) => {
//                         e.stopPropagation(); // Prevent row click event
//                         handleEdit(user?.user?.id);
//                       }}
//                     />
//                     <AiOutlineDelete
//                       className="delete-icon"
//                       onClick={(e) => {
//                         e.stopPropagation(); // Prevent row click event
//                         handleDelete(user?.user?.id);
//                       }}
//                     />
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         <div className="pagination">
//           <button className="pagination-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
//             &laquo; Previous
//           </button>

//           {Array.from({ length: totalPages }, (_, i) => (
//             <button
//               key={i + 1}
//               className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
//               onClick={() => handlePageChange(i + 1)}
//             >
//               {i + 1}
//             </button>
//           ))}

//           <button className="pagination-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
//             Next &raquo;
//           </button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <DashboardLayout>
//       <div className="total-interest-container">
//         <h1 className="page-title">Total Requests</h1>

//         {/* Filters Section */}
//         <div className="filter-container">
//           <button className="filter-button">
//             <AiOutlineFilter className="icon" /> Filter By
//           </button>
//           <select className="filter-dropdown">
//             <option>ID</option>
//           </select> 

       
//           <select className="filter-dropdown">
//             <option>Location</option>
//           </select>
//           {/* Date Picker Dropdown */}
//           <div className="date-filter">
//             <button
//               className="date-picker-btn"
//               onClick={() => setShowDatePicker(!showDatePicker)}
//             >
//               Select Date
//             </button>
//             {showDatePicker && (
//               <DatePicker
//                 selected={selectedDate}
//                 onChange={(date) => {
//                   setSelectedDate(date);
//                   setShowDatePicker(false);
//                 }}
//                 inline
//               />
//             )}
//           </div>
//           <select className="filter-dropdown">
//             <option>Sect</option>
//           </select>
//           <select className="filter-dropdown">
//             <option>Profession</option>
//           </select>
//           <select className="filter-dropdown">
//             <option>Status</option>
//           </select>


          

//           <button className="reset-filter">
//             <AiOutlineRedo className="icon" /> Reset Filter
//           </button>
//         </div>

//         {/* Render each category as a separate table */}
//         <RequestTable title="Requests Sent" data={requestData.sent_request} />
//         <RequestTable title="Requests Received" data={requestData.received_request} />
//         <RequestTable title="Sent Requests - Accepted" data={requestData.sent_request_accepted} />
//         <RequestTable title="Sent Requests - Rejected" data={requestData.sent_request_rejected} />
//         <RequestTable title="Received Requests - Accepted" data={requestData.received_request_accepted} />
//         <RequestTable title="Received Requests - Rejected" data={requestData.received_request_rejected} />
//       </div>

//       <style>
//         {`
//           .total-interest-container {
//             padding: 20px;
//             background: #f8f9fa;
//           }
//           .date-filter {
//             border-radius: 5px;
//             background: #fff;
//             font-size: 14px;
//             font-weight: 500;
//           }
//           .date-picker-btn {
//             padding: 8px;
//             border: 1px solid #ccc;
//             border-radius: 5px;
//             cursor: pointer;
//             background: #fff;
//           }
//           .date-picker-btn:hover {
//             background: #007bff;
//             color: #fff;
//           }
//           .react-datepicker {
//             position: absolute;
//             z-index: 999;
//             background: white;
//             border: 1px solid #ccc;
//             padding: 10px;
//             border-radius: 8px;
//             box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
//           }
//           .page-title {
//             font-weight: 700;
//             font-size: 24px;
//             text-align: left;
//             margin-bottom: 20px;
//           }
//           .filter-container {
//             display: flex;
//             align-items: center;
//             gap: 10px;
//             margin-bottom: 20px;
//           }
//           .filter-button, .reset-filter {
//             display: flex;
//             align-items: center;
//             gap: 5px;
//             padding: 8px 12px;
//             background: #fff;
//             border: 1px solid #ccc;
//             border-radius: 5px;
//             cursor: pointer;
//             font-size: 14px;
//             font-weight: 500;
//           }
//           .reset-filter {
//             color: red;
//           }
//           .icon {
//             font-size: 14px;
//           }
//           .filter-dropdown {
//             padding: 8px;
//             border: 1px solid #ccc;
//             border-radius: 5px;
//             background: #fff;
//             font-size: 14px;
//             font-weight: 500;
//           }
//           .interest-table {
//             width: 100%;
//             border-collapse: collapse;
//             background: #fff;
//             border-radius: 10px;
//             overflow: hidden;
//           }
//           .interest-table th {
//             background: #f0f0f0;
//             color: #333;
//             font-weight: bold;
//             text-transform: uppercase;
//           }
//           .interest-table th, .interest-table td {
//             padding: 12px;
//             text-align: left;
//             border-bottom: 1px solid #ddd;
//           }
//           .table-row {
//             cursor: pointer;
//           }
//           .table-row:hover {
//             background: #f1f1f1;
//           }
//           .status-badge {
//             padding: 5px 10px;
//             border-radius: 12px;
//             font-size: 12px;
//             font-weight: bold;
//             text-transform: capitalize;
//             display: inline-block;
//           }
//           .status-badge.sent {
//             background: #e3f7f0;
//             color: #18a558;
//           }
//           .status-badge.received {
//             background: #f3e8ff;
//             color: #8e44ad;
//           }
//           .status-badge.accepted {
//             background: #d1f8d1;
//             color: #2c7a2c;
//           }
//           .status-badge.rejected {
//             background: #ffc0cb;
//             color: #c4002b;
//           }
//           .delete-icon {
//             cursor: pointer;
//             color: #ff4d4d;
//             font-size: 18px;
//           }
//           .delete-icon:hover {
//             color: #cc0000;
//           }
//           .edit-icon {
//             cursor: pointer;
//             color: #007bff;
//             font-size: 18px;
//           }
//           .edit-icon:hover {
//             color: #0056b3;
//           }
//           .pagination {
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             margin-top: 20px;
//             gap: 8px;
//           }
//           .pagination-btn {
//             padding: 8px 12px;
//             border: 1px solid #ccc;
//             background: #fff;
//             border-radius: 5px;
//             cursor: pointer;
//             transition: 0.3s;
//           }
//           .pagination-btn.active {
//             background: #007bff;
//             color: #fff;
//             font-weight: bold;
//           }
//           .pagination-btn:hover {
//             background: #007bff;
//             color: #fff;
//           }
//           .pagination-btn:disabled {
//             cursor: not-allowed;
//             opacity: 0.6;
//           }
//         `}
//       </style>
//     </DashboardLayout>
//   );
// };

// export default TotalRequests;
