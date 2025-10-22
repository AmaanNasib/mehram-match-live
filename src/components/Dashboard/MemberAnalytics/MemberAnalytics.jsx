import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../UserDashboard/DashboardLayout";
import { AiOutlineFilter, AiOutlineRedo } from "react-icons/ai";
import { fetchDataWithTokenV2 } from "../../../apiUtils";

const MemberAnalytics = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userId] = useState(localStorage.getItem("userId"));
  const [matchDetails, setMatchDetails] = useState([]);
  const [useError, setError] = useState(false);
  const [useLoading, setLoading] = useState(false);
  const [detailedLoading, setDetailedLoading] = useState(false);
  
  // Filter and sort states
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

  // Filter functions
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
      age: '',
      sectSchoolInfo: '',
      profession: '',
      status: '',
      martialStatus: '',
      maxAge: '',
      minAge: ''
    };
    setFilters(clear);
    applyFilters(clear);
  };

  const applyFilters = (updatedFilters) => {
    if (!Array.isArray(matchDetails)) {
      setFilteredItems([]);
      return;
    }
    
    setFilteredItems(
      matchDetails?.filter((match) => {
        return (
          (updatedFilters.id ? 
            // Word-by-word search for id/member_id (case-insensitive)
            updatedFilters.id.split(' ').every(word => {
              const w = String(word).toLowerCase();
              const idStr = match?.id != null ? String(match.id) : '';
              const mid = match?.member_id || '';
              const idMatch = idStr.toLowerCase().includes(w);
              const memberIdMatch = mid.toLowerCase().includes(w);
              return idMatch || memberIdMatch;
            }) : true) &&
          (updatedFilters.name ? match?.name?.toLowerCase().includes(updatedFilters.name.toLowerCase()) : true) &&
          (updatedFilters.city ? match?.city?.toLowerCase().includes(updatedFilters.city.toLowerCase()) : true) &&
          (updatedFilters.minAge && updatedFilters.maxAge ? (match?.age >= updatedFilters.minAge && match?.age <= updatedFilters.maxAge) : true) &&
          (updatedFilters.sectSchoolInfo ? match?.sect_school_info?.toLowerCase().includes(updatedFilters.sectSchoolInfo.toLowerCase()) : true) &&
          (updatedFilters.profession ? match?.profession?.toLowerCase().includes(updatedFilters.profession.toLowerCase()) : true) &&
          (updatedFilters.status ? match?.status?.toLowerCase().includes(updatedFilters.status.toLowerCase()) : true) &&
          (updatedFilters.martialStatus ? match?.martial_status?.toLowerCase().includes(updatedFilters.martialStatus.toLowerCase()) : true)
        );
      })
    );
  };

  // Get distinct values for dropdowns
  const distinctIds = [...new Set(Array.isArray(matchDetails) ? matchDetails?.map((match) => match?.id) : [])];
  const distinctNames = [...new Set(Array.isArray(matchDetails) ? matchDetails?.map((match) => match?.name) : [])];
  const distinctCities = [...new Set(Array.isArray(matchDetails) ? matchDetails?.map((match) => match?.city) : [])];
  const distinctDobs = [...new Set(Array.isArray(matchDetails) ? matchDetails?.map((match) => match?.age) : [])];
  const distinctSchoolInfo = [...new Set(Array.isArray(matchDetails) ? matchDetails?.map((match) => match?.sect_school_info) : [])];
  const distinctProfessions = [...new Set(Array.isArray(matchDetails) ? matchDetails?.map((match) => match?.profession) : [])];
  const distinctStatuses = [...new Set(Array.isArray(matchDetails) ? matchDetails?.map((match) => match?.status) : [])];
  const distinctMaritalStatuses = [...new Set(Array.isArray(matchDetails) ? matchDetails?.map((match) => match?.martial_status) : [])];

  useEffect(() => {
    // Apply filters when `currentItems` or filters change
    if (Array.isArray(matchDetails)) {
      setFilteredItems(matchDetails);
    }
  }, [matchDetails]);

  // Function to handle sorting
  const handleSort = (column) => {
    let direction = 'asc';
    if (sortConfig.key === column && sortConfig.direction === 'asc') {
      direction = 'desc'; // Toggle sorting direction
    }
    setSortConfig({ key: column, direction });
  };

  useEffect(() => {
    if (Array.isArray(filteredItems)) {
      const sortedData = [...filteredItems].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
      setFilteredItems(sortedData);
    }
  }, [sortConfig.direction]);

  console.log(Array.isArray(matchDetails) ? matchDetails.length : 0, ">>>>");

  useEffect(() => {
    if (userId) {
      
       const parameter = {
         url: `/api/agent/user/matches/`,
        setterFunction: (data) => {
          // console.log('API Response:', data); // Debug log
          // console.log('API Response type:', typeof data);
          // console.log('API Response keys:', Object.keys(data || {}));
          
          // Check for API errors
          if (data && data.error) {
            console.error('API Error:', data.error);
            setError(true);
            setMatchDetails([]);
            return;
          }
          
          // Handle API response structure for /api/agent/user/matches/
          let members = [];
          if (data && data.members && Array.isArray(data.members)) {
            members = data.members;
          } else if (Array.isArray(data)) {
            members = data;
          }
          
          // console.log('Final members array:', members);
          // console.log('First member data:', members[0]);
          
          // Debug total_matches field
          // if (members.length > 0) {
          //   members.forEach((member, index) => {
          //     console.log(`Member ${index + 1} - total_matches:`, member.total_matches);
          //     console.log(`Member ${index + 1} - all fields:`, Object.keys(member));
          //   });
          // }
          
          if (members.length > 0) {
            // Optimized: Single API call to get all detailed matches at once
            // console.log('Fetching detailed matches for all members in single API call...');
            setDetailedLoading(true);
            const fetchActualCounts = async () => {
              try {
                // Single API call to get all detailed matches
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/agent/user/detailed-matches/`, {
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                  }
                });
                
                if (response.ok) {
                  const detailedData = await response.json();
                  // console.log('All detailed matches data:', detailedData);
                  
                  // Process all members with the single API response
                  const membersWithCounts = members.map(member => {
                    const actualUserId = member.user?.id;
                    let actualMatchesCount = member.total_matches || 0; // Use basic count as fallback
                    
                    if (actualUserId && detailedData.detailed_matches && Array.isArray(detailedData.detailed_matches)) {
                      // Find the detailed matches for this specific user
                      const userDetailedMatches = detailedData.detailed_matches.find(dm => 
                        (dm.user?.id || dm.user_id) == actualUserId
                      );
                      
                      if (userDetailedMatches) {
                        if (userDetailedMatches.matches && Array.isArray(userDetailedMatches.matches)) {
                          actualMatchesCount = userDetailedMatches.matches.length;
                        } else if (userDetailedMatches.total_matches !== undefined) {
                          actualMatchesCount = userDetailedMatches.total_matches;
                        }
                      }
                    }
                    
                    // console.log(`Member ${member.user?.name} - Final matches count: ${actualMatchesCount}`);
                    
                    return {
                      ...member,
                      total_matches: actualMatchesCount
                    };
                  });
                  
                  // Transform data with actual counts
                  const transformedData = membersWithCounts.map(member => {
                // console.log('Member data with actual counts:', member);
              return {
                id: member.user?.member_id,
                member_id: member.user?.member_id || member.user?.id,
                name: member.user?.first_name && member.user?.last_name 
                  ? `${member.user.first_name} ${member.user.last_name}`.trim()
                  : member.user?.name || member.name || 'No Name',
                profile_photo: (() => {
                  const photoUrl = member.user?.profile_photo || 
                                  member.user?.profile_image ||
                                  member.user?.avatar ||
                                  member.user?.photo ||
                                  member.user?.image;
                  
                  const fullUrl = photoUrl ? `${process.env.REACT_APP_API_URL}${photoUrl}` : null;
                  return fullUrl || '/images/muslim-man.png';
                })(),
                city: member.user?.city || '-',
                age: member.user?.age || '-',
                sect_school_info: member.user?.sect_school_info || '-',
                profession: member.user?.profession || '-',
                martial_status: member.user?.martial_status || 'Not mentioned',
                match_percentage: member.total_matches || 0,
                  total_matches: member.total_matches || 0, // Use actual count from detailed API
                total_interest: member.total_interest || 0,
                total_request: member.total_request || 0,
                total_interaction: member.total_interaction || 0,
                total_shortlisted: member.total_shortlisted || 0,
                total_blocked: member.total_blocked || 0
              };
            });
              
                  // console.log('Transformed data with actual counts:', transformedData);
            setMatchDetails(transformedData);
                  setDetailedLoading(false);
          } else {
                  console.error('Failed to fetch detailed matches');
                  // Fallback to basic data if detailed API fails
                  const fallbackData = members.map(member => ({
                    id: member.user?.member_id,
                    member_id: member.user?.member_id || member.user?.id,
                    name: member.user?.first_name && member.user?.last_name 
                      ? `${member.user.first_name} ${member.user.last_name}`.trim()
                      : member.user?.name || member.name || 'No Name',
                    profile_photo: (() => {
                      const photoUrl = member.user?.profile_photo || 
                                      member.user?.profile_image ||
                                      member.user?.avatar ||
                                      member.user?.photo ||
                                      member.user?.image;
                      
                      const fullUrl = photoUrl ? `${process.env.REACT_APP_API_URL}${photoUrl}` : null;
                      return fullUrl || '/images/muslim-man.png';
                    })(),
                    city: member.user?.city || '-',
                    age: member.user?.age || '-',
                    sect_school_info: member.user?.sect_school_info || '-',
                    profession: member.user?.profession || '-',
                    martial_status: member.user?.martial_status || 'Not mentioned',
                    match_percentage: member.total_matches || 0,
                    total_matches: member.total_matches || 0,
                    total_interest: member.total_interest || 0,
                    total_request: member.total_request || 0,
                    total_interaction: member.total_interaction || 0,
                    total_shortlisted: member.total_shortlisted || 0,
                    total_blocked: member.total_blocked || 0
                  }));
                  setMatchDetails(fallbackData);
                  setDetailedLoading(false);
                }
              } catch (error) {
                console.error('Error fetching detailed matches:', error);
                // Fallback to basic data on error
                const fallbackData = members.map(member => ({
                  id: member.user?.member_id,
                  member_id: member.user?.member_id || member.user?.id,
                  name: member.user?.first_name && member.user?.last_name 
                    ? `${member.user.first_name} ${member.user.last_name}`.trim()
                    : member.user?.name || member.name || 'No Name',
                  profile_photo: (() => {
                    const photoUrl = member.user?.profile_photo || 
                                    member.user?.profile_image ||
                                    member.user?.avatar ||
                                    member.user?.photo ||
                                    member.user?.image;
                    
                    const fullUrl = photoUrl ? `${process.env.REACT_APP_API_URL}${photoUrl}` : null;
                    return fullUrl || '/images/muslim-man.png';
                  })(),
                  city: member.user?.city || '-',
                  age: member.user?.age || '-',
                  sect_school_info: member.user?.sect_school_info || '-',
                  profession: member.user?.profession || '-',
                  martial_status: member.user?.martial_status || 'Not mentioned',
                  match_percentage: member.total_matches || 0,
                  total_matches: member.total_matches || 0,
                  total_interest: member.total_interest || 0,
                  total_request: member.total_request || 0,
                  total_interaction: member.total_interaction || 0,
                  total_shortlisted: member.total_shortlisted || 0,
                  total_blocked: member.total_blocked || 0
                }));
                setMatchDetails(fallbackData);
                setDetailedLoading(false);
              }
            };
            
            fetchActualCounts();
          } else {
            // console.log('No members data found'); // Debug log
            setMatchDetails([]);
          }
        },
        setLoading: setLoading,
        setErrors: setError,
      };
      fetchDataWithTokenV2(parameter);
    }
  }, [userId]);

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
  const itemsPerPage = 10;

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(filteredItems) ? filteredItems.slice(indexOfFirstItem, indexOfLastItem) : [];

  // Total pages
  const totalPages = Math.ceil((Array.isArray(filteredItems) ? filteredItems.length : 0) / itemsPerPage);

  // Handle Page Change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <DashboardLayout>
      <div className="total-interest-container">
        <h1 className="page-title">Member Analytics</h1>

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
            placeholder="Member ID"
            list="distinct-ids"
            style={{ width: '120px' }}
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
            list="distinct-ids"
            style={{ width: '120px' }}
          />

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
              <>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Khula">Khula</option>
                <option value="Widowed">Widowed</option>
              </>
          </select>

          <button type="button" className="reset-filter" onClick={onClearFilterClick}>
            <AiOutlineRedo className="icon" /> Reset Filter
          </button>
        </div>

        {/* Loading indicator for detailed data */}
        {detailedLoading && (
          <div className="loading-indicator">
            <div className="loading-spinner"></div>
            <span>Updating match counts...</span>
          </div>
        )}

        {/* Table Section */}
        <table className="interest-table">
          <thead>
            <tr>
              <th 
                className="sortable-header" 
                onClick={() => handleSort('id')}
                style={{ cursor: 'pointer' }}
              >
                Member ID
                {sortConfig.key === 'id' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th>Photo</th>
              <th 
                className="sortable-header" 
                onClick={() => handleSort('name')}
                style={{ cursor: 'pointer' }}
              >
                Name
                {sortConfig.key === 'name' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th 
                className="sortable-header" 
                onClick={() => handleSort('city')}
                style={{ cursor: 'pointer' }}
              >
                Location
                {sortConfig.key === 'city' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th 
                className="sortable-header" 
                onClick={() => handleSort('age')}
                style={{ cursor: 'pointer' }}
              >
                Age
                {sortConfig.key === 'age' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th 
                className="sortable-header" 
                onClick={() => handleSort('sect_school_info')}
                style={{ cursor: 'pointer' }}
              >
                Sect
                {sortConfig.key === 'sect_school_info' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th 
                className="sortable-header" 
                onClick={() => handleSort('profession')}
                style={{ cursor: 'pointer' }}
              >
                Profession
                {sortConfig.key === 'profession' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th 
                className="sortable-header" 
                onClick={() => handleSort('martial_status')}
                style={{ cursor: 'pointer' }}
              >
                Marital Status
                {sortConfig.key === 'martial_status' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
              <th 
                className="sortable-header" 
                onClick={() => handleSort('total_matches')}
                style={{ cursor: 'pointer' }}
              >
                Total Matches
                {sortConfig.key === 'total_matches' && (
                  <span className="sort-indicator">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((match) => (
              <tr key={match?.id} onClick={() => navigate(`/details/${match?.id}`)} style={{ cursor: "pointer" }}>
                <td>{match?.member_id || match?.id}</td>
                <td>
                  <img 
                    src={match?.profile_photo || '/images/muslim-man.png'} 
                    alt={match?.name || 'User'} 
                    className="member-avatar"
                    onError={(e) => {
                      console.log('Image error for:', match?.name, 'trying:', match?.profile_photo);
                      if (e.target.src !== '/images/muslim-man.png') {
                        e.target.src = '/images/muslim-man.png';
                      }
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully for:', match?.name, 'from:', match?.profile_photo);
                    }}
                  />
                </td>
                <td>{match?.name || "No Name"}</td>
                <td>{match?.city || "-"}</td>
                <td>{match?.age || "-"}</td>
                <td>{match?.sect_school_info || "-"}</td>
                <td>{match?.profession || "-"}</td>
                <td>
                  <span className={`marital-badge ${match?.martial_status ? match?.martial_status?.toLowerCase()?.replace(" ", "-") : "not-mentioned"}`}>
                    {match?.martial_status || "Not mentioned"}
                  </span>
                </td>
                <td>
                  <div className="matches-count">
                    <span 
                      className="matches-number clickable-matches"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        navigate(`/member-matches/${match?.member_id || match?.id}`);
                      }}
                    >
                      {match?.total_matches || 0}
                    </span>
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

          .sortable-header {
            cursor: pointer;
            transition: all 0.2s ease;
            user-select: none;
          }

          .sortable-header:hover {
            background-color: #e3f2fd;
            color: #1976d2;
          }

          .sort-indicator {
            margin-left: 5px;
            font-weight: bold;
            color: #1976d2;
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
          .name-cell {
            display: flex;
            align-items: center;
            gap: 8px;
          }
           .member-avatar {
             width: 32px;
             height: 32px;
             border-radius: 50%;
             object-fit: cover;
             border: 2px solid #e5e7eb;
             flex-shrink: 0;
           }
           .matches-count {
             display: flex;
             justify-content: center;
             align-items: center;
           }
           .matches-number {
             background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
             color: white;
             padding: 8px 16px;
             border-radius: 20px;
             font-weight: 600;
             font-size: 14px;
             min-width: 40px;
             text-align: center;
             box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
           }
           .clickable-matches {
             cursor: pointer;
             transition: all 0.2s ease;
           }
           .clickable-matches:hover {
             transform: scale(1.05);
             box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
           }
           
           .loading-indicator {
             display: flex;
             align-items: center;
             justify-content: center;
             padding: 20px;
             background: #f8f9fa;
             border-radius: 8px;
             margin: 20px 0;
             gap: 12px;
           }
           
           .loading-spinner {
             width: 20px;
             height: 20px;
             border: 2px solid #e3e3e3;
             border-top: 2px solid #007bff;
             border-radius: 50%;
             animation: spin 1s linear infinite;
           }
           
           @keyframes spin {
             0% { transform: rotate(0deg); }
             100% { transform: rotate(360deg); }
           }
           
           .loading-indicator span {
             color: #666;
             font-weight: 500;
           }
        `}
      </style>
    </DashboardLayout>
  );
};

export default MemberAnalytics;
