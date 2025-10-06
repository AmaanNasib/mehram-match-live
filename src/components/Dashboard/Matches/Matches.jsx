import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import { AiOutlineFilter, AiOutlineRedo } from "react-icons/ai"; // Import icons
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchDataObjectV2, fetchDataWithTokenV2 } from "../../../apiUtils";

const Matches = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userId] = useState(localStorage.getItem("userId"));
  const [matchDetails, setMatchDetails] = useState([]);
  const [useError, setError] = useState(false);
  const [useLoading, setLoading] = useState(false);
  // Function to handle delete action
    const [filteredItems, setFilteredItems] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
    let [filters, setFilters] = useState({
      id: '',
      name: '',
      city: '',
      age: '',
      sectSchoolInfo: '',
      profession: '',
      status: '',
      martialStatus: '',
        maxAge: '',
    minAge: ''
    });
    let [gender] = useState(localStorage.getItem("gender"));
  
    const handleFilterChange = (column, value) => {
  
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters, [column]: value };
        applyFilters(updatedFilters);
        return updatedFilters;
      });
    };
  
    const onClearFilterClick=() => {
  let clear={
    id: '',
    name: '',
    city: '',
    age: '',
    sectSchoolInfo: '',
    profession: '',
    status: '',
    martialStatus: '',
    maxAge: '',
    minAge: ''
    
  }
  setFilters(clear)
  applyFilters(clear)
    };
    const applyFilters = (updatedFilters) => {
      console.log(updatedFilters.id,">>>");
      
      setFilteredItems(
        matchDetails?.filter((match) => {
          return (
            (updatedFilters.id ? match?.id == updatedFilters.id : true) &&
            (updatedFilters.name ? match?.name?.toLowerCase().includes(updatedFilters.name.toLowerCase()) : true) &&
            (updatedFilters.city ? match?.city?.toLowerCase().includes(updatedFilters.city.toLowerCase()) : true) &&
            (updatedFilters.minAge&&updatedFilters.maxAge ? (match?.age >= updatedFilters.minAge && match?.age <= updatedFilters.maxAge) : true) &&
            (updatedFilters.sectSchoolInfo ? match?.sect_school_info?.toLowerCase().includes(updatedFilters.sectSchoolInfo.toLowerCase()) : true) &&
            (updatedFilters.profession ? match?.profession?.toLowerCase().includes(updatedFilters.profession.toLowerCase()) : true) &&
            (updatedFilters.status ? match?.status?.toLowerCase().includes(updatedFilters.status.toLowerCase()) : true) &&
            (updatedFilters.martialStatus ? match?.martial_status?.toLowerCase().includes(updatedFilters.martialStatus.toLowerCase()) : true)
          );
        })
      );
    };
    const distinctIds = [...new Set(matchDetails?.map((match) =>  match?.id))];
    const distinctNames = [...new Set(matchDetails?.map((match) => match?.name))];
    const distinctCities = [...new Set(matchDetails?.map((match) => match?.city))];
    const distinctDobs = [...new Set(matchDetails?.map((match) => match?.age))];
    const distinctSchoolInfo = [...new Set(matchDetails?.map((match) => match?.sect_school_info))];
    const distinctProfessions = [...new Set(matchDetails?.map((match) => match?.profession))];
    const distinctStatuses = [...new Set(matchDetails?.map((match) => match?.status))];
    const distinctMaritalStatuses = [...new Set(matchDetails?.map((match) => match?.martial_status))];
    useEffect(() => {
      // Apply filters when `currentItems` or filters change
      setFilteredItems( matchDetails)
    }, [matchDetails]);
    // Function to handle delete action
  

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
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
      setFilteredItems(sortedData)
    }, [sortConfig.direction])
  console.log(matchDetails.length,">>>>");
  
  useEffect(() => {
    if (userId) {
      const parameter = {
        url: `/api/user/matches/?user_id=${userId}`,
        setterFunction: setMatchDetails,
        setLoading: setLoading,
        setErrors: setError,
      };
      fetchDataWithTokenV2(parameter)
    }
  }, [userId])



  // Function to get progress bar color based on match percentage
  const getProgressBarColor = (matchPercentage) => {
    const percentage = parseFloat(matchPercentage) || 0;
    if (percentage >= 75) return "#10b981"; // Green for high match
    if (percentage >= 60) return "#3b82f6"; // Blue for good match
    if (percentage >= 45) return "#f59e0b"; // Orange for moderate match
    if (percentage >= 30) return "#f97316"; // Dark orange for low-moderate match
    return "#ef4444"; // Red for very low match
  };


  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Total pages
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Handle Page Change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <DashboardLayout>
      <div className="total-interest-container">
        <h1 className="page-title">Matches</h1>

        {/* Filters Section */}
           <div className="filter-container">
               <button className="filter-button">
                 <AiOutlineFilter className="icon" /> Filter By
               </button>
               {/* <select
               className="filter-dropdown"
               value={filters.id}
               onChange={(e) => handleFilterChange('id', e.target.value)}
             >
               <option value="">Select ID</option>
               {distinctIds?.map((id, index) => (
                 <option key={index} value={id}>
                   {id}
                 </option>
               ))}
             </select> */}
     
     <input
  className="filter-dropdown"
  type="text"
  value={filters.id}
  onChange={(e) => handleFilterChange('id', e.target.value)}
  placeholder="Member ID"
  list="distinct-ids"
  style={{ width: '120px' }} 
/>

{/* <datalist id="distinct-ids">
  {distinctIds?.map((id, index) => (
    <option key={index} value={id} />
  ))}
</datalist> */}
               {/* <select
             className="filter-dropdown"
               value={filters.city}
               onChange={(e) => handleFilterChange('city', e.target.value)}
             >
               <option value="">Location</option>
               {distinctCities?.map((city, index) => (
                 <option key={index} value={city}>
                   {city}
                 </option>
               ))}
             </select> */}
           
           <input
  className="filter-dropdown"
  type="text"
  value={filters.city}
  onChange={(e) => handleFilterChange('city', e.target.value)}
  placeholder="Location"
  list="distinct-ids"
  style={{ width: '120px' }} 
/>
    <input
    className="filter-dropdown"
      type="number"
      id="minAge"
      name="minAge"
      value={filters.minAge || ''}
      onChange={(e) => handleFilterChange('minAge', e.target.value)}
      placeholder="Min age"
      min="18"
      max="50"
      style={{ width: '100px' }}
    />
    <input
    className="filter-dropdown"
      type="number"
      id="maxAge"
      name="maxAge"
      value={filters.maxAge || ''}
      onChange={(e) => handleFilterChange('maxAge', e.target.value)}
      placeholder="Max age"
      min="18"
      max="50"
      style={{ width: '100px' }}
    />

               {/* Date Picker Dropdown */}
           {/* <div className="date-filter">
                 <button
                   className="date-picker-btn"
                   onClick={() => setShowDatePicker(!showDatePicker)}
                 >
                   Date
                 </button>
                 {showDatePicker && (
                   <DatePicker
                     selected={selectedDate}
                     onChange={(date) => {
                       setSelectedDate(date);
                       setShowDatePicker(false);
                     }}
                     inline
                   />
                 )}
               </div> */}
     
            
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
     
               <select
               className="filter-dropdown"
               value={filters.martialStatus}
               onChange={(e) => handleFilterChange('martialStatus', e.target.value)}
             >
               <option value="">Marital Status</option>
               {gender === 'male' ? (
                 <>
                   <option value="Single">Single</option>
                   <option value="Divorced">Divorced</option>
                   <option value="Khula">Khula</option>
                   <option value="Widowed">Widowed</option>
                 </>
               ) : (
                 <>
                   <option value="Single">Single</option>
                   <option value="Married">Married</option>
                   <option value="Divorced">Divorced</option>
                   <option value="Khula">Khula</option>
                   <option value="Widowed">Widowed</option>
                 </>
               )}
             </select>
               
           
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
            Member ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </th>
              <th>Name</th>
              <th>Location</th>
              <th  onClick={() => handleSort('age')} >Age {sortConfig.key === 'age' && (sortConfig.direction === 'asc' ? '↑' : '↓')}</th>
              <th>Sect</th>
              <th>Profession</th>
              <th>Marital Status</th>
              <th>Match Per(%)</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((match) => (
              <tr key={match?.id} onClick={() => navigate(`/details/${match?.id}`)} style={{ cursor: "pointer" }}>
                <td>{match?.member_id || match?.id}</td>
                <td>{match?.name||"-"}</td>
                <td>{match?.city||"-"}</td>
                <td>{match?.age||"-"}</td>
                <td>{match?.sect_school_info||"-"}</td>
                <td>{match?.profession||"-"}</td>
                <td>
                  <span className={`marital-badge ${match?.martial_status?match?.martial_status?.toLowerCase()?.replace(" ", "-"):"not-mentioned"}`}>
                    {match?.martial_status||"Not mentioned"}
                  </span>
                </td>
                <td>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${match?.match_percentage || 0}%`,
                        backgroundColor: getProgressBarColor(match?.match_percentage),
                      }}
                    ></div>
                    <span className="progress-text">{match?.match_percentage || 0}%</span>
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
            flex-wrap: wrap;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            padding: 16px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            background: #fff;
            font-size: 14px;
            font-weight: 500;
            min-width: 120px;
            transition: all 0.2s ease;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          }
          .filter-dropdown:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          .filter-dropdown:hover {
            border-color: #9ca3af;
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
          .progress-bar-container {
            width: 100%;
            background-color: #f3f4f6;
            border-radius: 8px;
            overflow: hidden;
            position: relative;
            height: 24px;
            border: 1px solid #e5e7eb;
          }
          .progress-bar {
            height: 100%;
            border-radius: 7px;
            transition: all 0.3s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          .progress-text {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            color: #374151;
            font-size: 11px;
            font-weight: 700;
            text-shadow: 0 1px 2px rgba(255,255,255,0.8);
            z-index: 1;
          }
        `}
      </style>
    </DashboardLayout>
  );
};

export default Matches;