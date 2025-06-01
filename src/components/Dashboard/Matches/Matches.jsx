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
  placeholder="Enter ID"
  list="distinct-ids"
  style={{ width: '70px' }} 
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
  style={{ width: '70px' }} 
/>
    <input
    className="filter-dropdown"
      type="number"
      id="age"
      name="age"
      value={filters.minAge || ''}
      onChange={(e) => handleFilterChange('minAge', e.target.value)}
      placeholder="Min age"
      min="18"
      max="50"
    />
    <input
    className="filter-dropdown"
      type="number"
      id="age"
      name="age"
      value={filters.maxAge || ''}
      onChange={(e) => handleFilterChange('maxAge', e.target.value)}
      placeholder="Max age"
      min="18"
      max="50"
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
     
               <select
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
            ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
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
                <td>{match?.id}</td>
                <td>{match?.name||"-"}</td>
                <td>{match?.city||"-"}</td>
                <td>{match?.age||"-"}</td>
                <td>{match?.sect_school_info||"-"}</td>
                <td>{match?.profession||"-"}</td>
                <td>
                  <span className={`marital-badge ${match?.martial_status?match?.martial_status?.toLowerCase()?.replace(" ", "-"):''}`}>
                    {match?.martial_status||"-"}
                  </span>
                </td>
                <td>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${match?.martial_status}%`,
                        backgroundColor: getProgressBarColor(match?.martial_status),
                      }}
                    ></div>
                    <span className="progress-text">{match?.match_percentage}%</span>
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

export default Matches;