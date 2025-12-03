import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import { AiOutlineFilter, AiOutlineRedo, AiOutlineDelete, AiOutlineClose } from "react-icons/ai"; // Import icons
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchDataObjectV2, postDataWithFetchV2 } from "../../../apiUtils";
import { format } from 'date-fns';



const CustomDatePicker = ({ selectedDate, onChange, placeholder, isOpen, onToggle }) => {

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
    onToggle(false);
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
        onClick={() => onToggle(!isOpen)}
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
            onClick={() => onToggle(false)}
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
            width: 320px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 15px;
            padding: 15px;
            z-index: 1000;
            box-shadow: 0 8px 16px rgba(0,0,0,0.15);
          }
          
          .date-filters-container .custom-date-picker-container:last-child .custom-date-picker-menu {
            left: auto;
            right: 0;
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
            padding: 10px;
            background: linear-gradient(135deg, #CB3B8B 0%, #FF59B6 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
          }
          
          .apply-now-btn:hover {
            background: linear-gradient(135deg, #EB53A7 0%, #CB3B8B 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(203, 59, 139, 0.3);
          }
        `}
      </style>
    </div>
  );
};


// Marital Status Dropdown Component
const MaritalStatusDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState(value || []);

  const maritalStatusOptions = [
    "Single", "Married", "Divorced", "Khula", "Widowed"
  ];

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

  const removeStatus = (status) => {
    const newSelected = selectedStatuses.filter(s => s !== status);
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
                className={`marital-status-option ${selectedStatuses.includes(status) ? "selected" : ""
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
            font-weight: 600;
            color: #333;
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
  const [isFilters, setIsFilters] = useState(false);

  const toggleFilters = () => setIsFilters(!isFilters);

  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDate1, setSelectedDate1] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'member_id', direction: 'asc' });
  const [matchDetails, setMatchDetails] = useState([]);
  const [userId] = useState(localStorage.getItem("userId"));
  const [loading, setLoading] = useState(false);

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
          (updatedFilters.id ? match?.user?.member_id == updatedFilters.id : true) &&
          (updatedFilters.name ? match?.user?.name?.toLowerCase().includes(updatedFilters.name.toLowerCase()) : true) &&
          (updatedFilters.city ? match?.user?.city?.toLowerCase().includes(updatedFilters.city.toLowerCase()) : true) &&
          (updatedFilters.date ? match?.date?.toLowerCase().includes(updatedFilters.date.toLowerCase()) : true) &&
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
  // Function to handle unblock action
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to unblock this user?')) {
      const parameter = {
        url: `/api/recieved/unblock/`,
        payload: {
          action_by_id: userId,
          action_on_id: id
        },
        setErrors: setErrors,
        tofetch: {
          items: [{
            fetchurl: `/api/user/${userId}/`,
            dataset: setMatchDetails,
            setErrors: setErrors
          }],
          setErrors: setErrors
        }
      };

      postDataWithFetchV2(parameter);

      // Update local state immediately
      setMatchDetails({
        blocked_users: matchDetails?.blocked_users?.filter(match => match?.user?.id !== id)
      });
      setFilteredItems(filteredItems?.filter(match => match?.user?.id !== id));
    }
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems?.slice(indexOfFirstItem, indexOfLastItem);

  const Arrow = ({ field }) => {
    if (sortConfig.key !== field) return null;
    return sortConfig.direction === "asc" ? " ↑" : " ↓";
  };

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



  // Handle marital status filter change
  const handleMaritalStatusChange = (selectedStatuses) => {
    setFilters(prevFilters => {
      const updatedFilters = {
        ...prevFilters,
        martialStatus: selectedStatuses.join(',')
      };
      applyFilters(updatedFilters);
      return updatedFilters;
    });
  };



  return (
    <DashboardLayout>
      <div className="total-interest-container">
        <h1 className="page-title">Blocked User List</h1>

        {/* Filters Section */}
        <div className="filter-container">
          <button onClick={toggleFilters} className="filter-button">
            <AiOutlineFilter className="icon" /> Filter By
          </button>

          {isFilters && (
            <>

              <input
                className="filter-dropdown"
                type="text"
                value={filters.id}
                onChange={(e) => handleFilterChange('id', e.target.value)}
                placeholder="Member ID"
                list="distinct-ids"
                style={{ width: '100px' }}
              />

              <input
                className="filter-dropdown"
                type="text"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                placeholder="Name"
                style={{ width: '120px' }}
              />

              <input
                className="filter-dropdown"
                type="text"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                placeholder="Location"
                style={{ width: '100px' }}
              />
              {/* Replace your current date picker implementation with this */}
              <div className="date-filters-container">
                <CustomDatePicker
                  selectedDate={filters.startDate}
                  onChange={(date) => handleFilterChange("startDate", date)}
                  placeholder="Start Date"
                  isOpen={showStartDatePicker}
                  onToggle={(open) => {
                    setShowStartDatePicker(open);
                    if (open) setShowEndDatePicker(false);
                  }}
                />

                <CustomDatePicker
                  selectedDate={filters.endDate}
                  onChange={(date) => handleFilterChange("endDate", date)}
                  placeholder="End Date"
                  isOpen={showEndDatePicker}
                  onToggle={(open) => {
                    setShowEndDatePicker(open);
                    if (open) setShowStartDatePicker(false);
                  }}
                />
              </div>

              <style>
                {`
  .date-filters-container {
    display: flex;
    gap: 15px;
    position: relative;
    z-index: 1;
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
                <option value="accountant">Accountant</option>
                <option value="Acting Professional">Acting Professional</option>
                <option value="actor">Actor</option>
                <option value="administrator">Administrator</option>
                <option value="Advertising Professional">Advertising Professional</option>
                <option value="air_hostess">Air Hostess</option>
                <option value="airline_professional">Airline Professional</option>
                <option value="airforce">Airforce</option>
                <option value="architect">Architect</option>
                <option value="artist">Artist</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="audiologist">Audiologist</option>
                <option value="auditor">Auditor</option>
                <option value="Bank Officer">Bank Officer</option>
                <option value="Bank Staff">Bank Staff</option>
                <option value="beautician">Beautician</option>
                <option value="Biologist / Botanist">Biologist / Botanist</option>
                <option value="Business Person">Business Person</option>
                <option value="captain">Captain</option>
                <option value="CEO / CTO / President">CEO / CTO / President</option>
                <option value="chef">Chef</option>
                <option value="civil_servant">Civil Servant</option>
                <option value="clerk">Clerk</option>
                <option value="coach">Coach</option>
                <option value="consultant">Consultant</option>
                <option value="counselor">Counselor</option>
                <option value="dentist">Dentist</option>
                <option value="designer">Designer</option>
                <option value="doctor">Doctor</option>
                <option value="engineer">Engineer</option>
                <option value="entrepreneur">Entrepreneur</option>
                <option value="farmer">Farmer</option>
                <option value="fashion_designer">Fashion Designer</option>
                <option value="freelancer">Freelancer</option>
                <option value="government_employee">Government Employee</option>
                <option value="graphic_designer">Graphic Designer</option>
                <option value="homemaker">Homemaker</option>
                <option value="interior_designer">Interior Designer</option>
                <option value="journalist">Journalist</option>
                <option value="lawyer">Lawyer</option>
                <option value="manager">Manager</option>
                <option value="marketing_professional">Marketing Professional</option>
                <option value="nurse">Nurse</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="photographer">Photographer</option>
                <option value="pilot">Pilot</option>
                <option value="police">Police</option>
                <option value="professor">Professor</option>
                <option value="psychologist">Psychologist</option>
                <option value="researcher">Researcher</option>
                <option value="sales_executive">Sales Executive</option>
                <option value="scientist">Scientist</option>
                <option value="social_worker">Social Worker</option>
                <option value="software_consultant">Software Consultant</option>
                <option value="sportsman">Sportsman</option>
                <option value="teacher">Teacher</option>
                <option value="technician">Technician</option>
                <option value="therapist">Therapist</option>
                <option value="veterinarian">Veterinarian</option>
                <option value="writer">Writer</option>
                <option value="other">Other</option>
              </select>

              {/* Use the MaritalStatusDropdown component */}
              <MaritalStatusDropdown
                value={filters.martialStatus ? filters.martialStatus.split(',') : []}
                onChange={handleMaritalStatusChange}
              />


            </>
          )}


          <button type="button" className="reset-filter" onClick={onClearFilterClick}>
            <AiOutlineRedo className="icon" /> Reset Filter
          </button>
        </div>

        {/* Table Section */}
        {/* <table className="interest-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('member_id')} style={{ cursor: 'pointer' }}>
                Member ID {sortConfig.key === 'member_id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
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
              <th onClick={() => handleSort('martial_status')} style={{ cursor: 'pointer' }}>
                Marital Status {sortConfig.key === 'martial_status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems?.map((match) => (
              <tr key={match?.user?.id} style={{ cursor: "pointer" }}>
                <td>{match?.user?.member_id || match?.user?.id}</td>
                <td>
                  <div className="user-photo-name">
                    <img
                      src={match?.user?.profile_photo || 'https://via.placeholder.com/50'}
                      alt={match?.user?.name}
                      className="table-user-photo"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/details/${match?.user?.id}`);
                      }}
                      title="View Profile"
                    />
                    <span>{match?.user?.name}</span>
                  </div>
                </td>
                <td>{match?.user?.city || "-"}</td>
                <td>{match?.date || "-"}</td>
                <td>{match?.user?.sect_school_info || "-"}</td>
                <td>{match?.user?.profession || '-'}</td>
                <td>
                  <span className={`marital-badge ${match?.user?.martial_status ? match?.user?.martial_status?.toLowerCase().replace(" ", "-") : ''}`}>
                    {match?.user?.martial_status || '-'}
                  </span>
                </td>
                <td>
                  <AiOutlineDelete
                    className="delete-icon"
                    title="Unblock User"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      handleDelete(match?.user?.id);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}

        <div className="w-full">
          {/* Mobile: compact stacked cards (visible on <md) */}
          <div className="space-y-3 md:hidden">
            {currentItems?.map((match) => {
              const user = match?.user || {};
              return (
                <div
                  key={user.id || Math.random()}
                  className="bg-white shadow-xs rounded-lg p-3 flex gap-3 items-start cursor-pointer hover:shadow-sm"
                  onClick={() => navigate(`/details/${user.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter") navigate(`/details/${user.id}`); }}
                >
                  <img
                    src={user.profile_photo || "https://placehold.co/40"}
                    alt={user.name || "User photo"}
                    className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/details/${user.id}`);
                    }}
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/40";
                    }}
                    title="View Profile"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">{user.name || "-"}</div>
                        <div className="text-xs text-gray-500 truncate">
                          ID: <span className="text-gray-700">{user.member_id || user.id || "-"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }}
                          title="Unblock User"
                          className="p-1 rounded-md hover:bg-red-50"
                          aria-label={`Unblock ${user.name}`}
                        >
                          <AiOutlineDelete className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-y-1 text-sm text-gray-600">
                      <div className="truncate">
                        <div className="text-xs text-gray-400">Location</div>
                        <div className="truncate">{user.city || "-"}</div>
                      </div>

                      <div className="truncate">
                        <div className="text-xs text-gray-400">Date</div>
                        <div className="truncate">{match?.date || "-"}</div>
                      </div>

                      <div className="truncate">
                        <div className="text-xs text-gray-400">Marital</div>
                        <div>
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full font-medium ${(user.martial_status || "").toLowerCase().includes("single")
                              ? "bg-green-100 text-green-800"
                              : (user.martial_status || "").toLowerCase().includes("married")
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {user.martial_status || "-"}
                          </span>
                        </div>
                      </div>

                      <div className="truncate">
                        <div className="text-xs text-gray-400">Sect</div>
                        <div className="truncate">{user.sect_school_info || "-"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop / md+: responsive table */}
          <div className="hidden md:block w-full">
            {/* Wrapper gives horizontal scroll if viewport is too narrow */}
            <div className="w-full overflow-x-auto">
              <table className="min-w-[900px] table-fixed w-full bg-white divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {/* Member ID */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[130px]">
                      <button
                        onClick={() => handleSort("member_id")}
                        className="flex items-center gap-1 focus:outline-none"
                        aria-label="Sort by member id"
                      >
                        Member ID<Arrow field="member_id" />
                      </button>
                    </th>

                    {/* Name */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[200px]">
                      <button onClick={() => handleSort("name")} className="flex items-center gap-1 focus:outline-none">
                        Name<Arrow field="name" />
                      </button>
                    </th>

                    {/* Location (hide on small desktops if needed) */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[150px]">
                      <button onClick={() => handleSort("city")} className="flex items-center gap-1 focus:outline-none">
                        Location<Arrow field="city" />
                      </button>
                    </th>

                    {/* Date */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[120px]">
                      <button onClick={() => handleSort("date")} className="flex items-center gap-1 focus:outline-none">
                        Date<Arrow field="date" />
                      </button>
                    </th>

                    {/* Sect (hide on md -> show on lg) */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[220px] hidden lg:table-cell">
                      <button onClick={() => handleSort("sect_school_info")} className="flex items-center gap-1 focus:outline-none">
                        Sect<Arrow field="sect_school_info" />
                      </button>
                    </th>

                    {/* Profession (hide on md -> show on lg) */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[220px] hidden lg:table-cell">
                      <button onClick={() => handleSort("profession")} className="flex items-center gap-1 focus:outline-none">
                        Profession<Arrow field="profession" />
                      </button>
                    </th>

                    {/* Marital Status */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[120px]">
                      <button onClick={() => handleSort("martial_status")} className="flex items-center gap-1 focus:outline-none">
                        Marital Status<Arrow field="martial_status" />
                      </button>
                    </th>

                    {/* Action */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-[80px]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-100">
                  {currentItems?.map((match) => {
                    const user = match?.user || {};
                    return (
                      <tr
                        key={user.id || Math.random()}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/details/${user.id}`)}
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{user.member_id || user.id || "-"}</td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={user.profile_photo || "https://placehold.co/40"}
                              alt={user.name || "User photo"}
                              className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/details/${user.id}`);
                              }}
                              onError={(e) => {
                                e.currentTarget.src = "https://placehold.co/40";
                              }}
                              title="View Profile"
                            />
                            <div className="text-sm font-medium text-gray-900 truncate">{user.name || "-"}</div>
                          </div>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 truncate">{user.city || "-"}</td>

                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{match?.date || "-"}</td>

                        {/* Sect: hidden below lg */}
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell truncate">{user.sect_school_info || "-"}</td>

                        {/* Profession: hidden below lg */}
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell truncate">{user.profession || "-"}</td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${(user.martial_status || "").toLowerCase().includes("single")
                              ? "bg-green-100 text-green-800"
                              : (user.martial_status || "").toLowerCase().includes("married")
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {user.martial_status || "-"}
                          </span>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }}
                            title="Unblock User"
                            className="p-1 rounded-md hover:bg-red-50"
                            aria-label={`Unblock ${user.name}`}
                          >
                            <AiOutlineDelete className="w-5 h-5 text-red-600" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

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
            border: 1px solid #e5e7eb;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .interest-table th {
            background: #f0f0f0;
            color: #333;
            font-weight: bold;
            text-transform: uppercase;
            user-select: none;
          }
          .interest-table th:last-child {
            text-align: center;
          }
          .interest-table th[style*="cursor: pointer"]:hover {
            background: #e0e0e0;
            color: #CB3B8B;
          }
          .interest-table th, .interest-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
            border-right: 1px solid #e5e7eb;
          }
          .interest-table th:last-child,
          .interest-table td:last-child {
            border-right: none;
          }
          .interest-table td:last-child {
            text-align: center;
          }
          .user-photo-name {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .table-user-photo {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            object-fit: cover;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 2px solid #ddd;
            flex-shrink: 0;
          }
          .table-user-photo:hover {
            transform: scale(1.15);
            border-color: #CB3B8B;
            box-shadow: 0 4px 12px rgba(203, 59, 139, 0.4);
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
          .delete-icon {
            cursor: pointer;
            color: #ff4d4d;
            font-size: 20px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }
          .delete-icon:hover {
            color: #cc0000;
            transform: scale(1.2);
          }
        `}
      </style>
    </DashboardLayout>
  );
};

export default TotalShortlist;