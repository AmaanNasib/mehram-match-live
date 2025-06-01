import React, { useState } from 'react';
import './sidebar.css';
import RangeSlider from './AgeFilter/RangeSlider';
import { postDataReturnResponse } from '../../../apiUtils';

const Sidebar = ({setApiData}) => {
  const [rangeText , setRangeText]=useState('18-23');
  const [rangeText1 , setRangeText1]=useState({});
const [userId] = useState(localStorage.getItem("userId"));
    const [errors, setErrors] = useState(false);
    const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    memberID: '',
    maritalStatus: '',
    // sect: '',
    profession: '',
    country: '',
    state: '',
    city: '', 
  });




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    const parameter = {
      url: "/api/user/filter/",
      payload: {
        ...formData,
        age_min: parseInt(rangeText?.split("-")?.[0]),  
        age_max: parseInt(rangeText?.split("-")?.[1]),  
        user_id:userId
      },
      setUserId: setApiData,
      setErrors: setErrors,
    };
    postDataReturnResponse(parameter);  };

  return (
    <div className="sidebar">
      <h2>ADVANCED SEARCH</h2>
      <div className="search-form">
        <div className="form-group">
          <RangeSlider rangeText={rangeText} setRangeText={setRangeText}/>
        </div>
        <div className="form-group">
          <label>Member ID</label>
          <input
            type="text"
            name="memberID"
            placeholder="Enter Member ID"
            value={formData.memberID}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Marital Status</label>
          <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
            <option value="">Select One</option>
            <option value="never-married">Never Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
            <option value="Single">Single</option>
          </select>
        </div>
        <div className="form-group">
          <label>Sect</label>
          <select name="sect" value={formData.sect} onChange={handleChange}>
            <option value="">Choose One</option>
            <option value="sunni-hanafi">Sunni-Hanafi</option>
            <option value="sunni">Sunni</option>
            <option value="shia">Shia</option>
            <option value="sunni-shafi">Sunni-Shafi</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Profession</label>
          <select name="profession" value={formData.profession} onChange={handleChange}>
            <option value="">Choose One</option>
            <option value="doctor">Doctor</option>
            <option value="engineer">Engineer</option>
            <option value="teacher">Teacher</option>
            <option value="lawyer">Lawyer</option>
            <option value="artist">Artist</option>
          </select>
        </div>
        <div className="form-group">
          <label>Country</label>
          <select name="country" value={formData.country} onChange={handleChange}>
            <option value="">Choose One</option>
            <option value="usa">United States</option>
            <option value="canada">Canada</option>
            <option value="uk">United Kingdom</option>
            <option value="india">India</option>
            <option value="australia">Australia</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>State</label>
          <select name="state" value={formData.state} onChange={handleChange}>
            <option value="">Choose One</option>
            <option value="andhra-pradesh">Andhra Pradesh</option>
            <option value="arunachal-pradesh">Arunachal Pradesh</option>
            <option value="assam">Assam</option>
            {/* Add other states here */}
          </select>
        </div>
        <div className="form-group">
          <label>City</label>
          <select name="city" value={formData.city} onChange={handleChange}>
            <option value="">Choose One</option>
            <option value="mumbai">Mumbai</option>
            <option value="delhi">Delhi</option>
            <option value="New York">New York</option>
            {/* Add other cities here */}
          </select>
        </div>
        {/* <div className="form-group">
          <label>MEMBER TYPE</label>
          <div className="filter-option">
            <input
              type="radio"
              id="premium"
              name="memberType"
              value="premium"
              checked={formData.memberType === 'premium'}
              onChange={handleChange}
            />
            <label htmlFor="premium">Premium Member</label>
          </div>
          <div className="filter-option">
            <input
              type="radio"
              id="free"
              name="memberType"
              value="free"
              checked={formData.memberType === 'free'}
              onChange={handleChange}
            />
            <label htmlFor="free">Free Member</label>
          </div>
          <div className="filter-option">
            <input
              type="radio"
              id="all"
              name="memberType"
              value="all"
              checked={formData.memberType === 'all'}
              onChange={handleChange}
            />
            <label htmlFor="all">All Member</label>
          </div>
        </div> */}
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
