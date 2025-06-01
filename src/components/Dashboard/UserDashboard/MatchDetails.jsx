import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './DashboardLayout.css';
import logo from '../../../images/newLogo.jpg'
import { FiSettings, FiKey, FiEdit, FiUserMinus, FiTrash2, FiLogOut, FiChevronDown, FiUserPlus,  FiUser, FiHome  } from 'react-icons/fi';
import { FaSearch, FaBars } from "react-icons/fa"; // Import the search icon
import { fetchDataObjectV2, fetchDataWithTokenV2, ReturnPutResponseFormdataWithoutToken } from '../../../apiUtils';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';



let notificationCount = 0

const MatchDetailsComponents = ({apiData6}) => {


    let men1='https://w7.pngwing.com/pngs/832/40/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png'
  
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
return(

   
    <div className="match-details-table">
      <table>
        <thead>
        <tr>
            <th>My Member</th>
            <th>Total interests</th>
            <th>Total requests </th>
            <th>Total interactions</th>
            <th>Total shortlisted</th>
            <th>Total blocked</th>
            <th>Total matches</th>
          </tr>
        </thead>
    
        <tbody>
          {apiData6.map((match, index) => (
            <tr key={index}>
              <td>
                <div className="name-cell">
                  <img src={match?.profile_photo ? `${'https://mehram-match.onrender.com'}${match?.profile_photo}` : men1} alt={match?.user?.name} />
                  {match?.user?.name||"0"}
                </div>
              </td>
              <td>{match?.total_interest||"0"}</td>
              <td>{match?.total_request||"0"}</td>
          
           
              {/* <td>{match?.user?.match_percentage}%</td> */}
              <td>{match?.total_interaction|| "0"}</td>
              <td>{match?.total_shortlisted||"0"}</td>
              <td>{match?.total_blocked||"0"}</td>
              <td>{match?.total_matches||"0"}</td>
    

            </tr>
          ))}
        </tbody>
     
      </table>
    </div>

)
}
export default MatchDetailsComponents;