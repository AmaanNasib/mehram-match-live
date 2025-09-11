import React, { useState } from 'react';
import './sidebar.css';
import RangeSlider from './AgeFilter/RangeSlider';
import { postDataReturnResponse } from '../../../apiUtils';

// Shimmer Loading Component for Sidebar
const ShimmerFormField = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] rounded w-1/3 mb-3"></div>
    <div className="h-12 bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] rounded-lg"></div>
  </div>
);

const ShimmerButton = () => (
  <div className="animate-pulse">
    <div className="h-12 bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] rounded-xl"></div>
  </div>
);

const Sidebar = ({setApiData, onClose}) => {
  const [rangeText , setRangeText]=useState('18-23');
  const [rangeText1 , setRangeText1]=useState({});
  const [userId] = useState(localStorage.getItem("userId"));
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
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
    setIsSearching(true);
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
    postDataReturnResponse(parameter);
    
    // Reset searching state after a delay
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden font-['Poppins'] lg:h-auto h-full lg:max-h-none max-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Advanced Search
            </h2>
            <p className="text-pink-100 text-sm mt-1">Filter profiles by your preferences</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 rounded-full p-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            {/* Mobile Close Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden bg-white/20 rounded-full p-2 hover:bg-white/30 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-6 lg:max-h-none max-h-[calc(100vh-120px)] overflow-y-auto">
        {loading ? (
          <div className="space-y-6">
            <ShimmerFormField />
            <ShimmerFormField />
            <ShimmerFormField />
            <ShimmerFormField />
            <ShimmerFormField />
            <ShimmerFormField />
            <ShimmerFormField />
            <ShimmerFormField />
            <ShimmerButton />
          </div>
        ) : (
          <form className="space-y-6">
            {/* Age Range */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2 text-[#CB3B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Age Range
              </label>
              <div className="bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] p-4 rounded-xl">
                <RangeSlider rangeText={rangeText} setRangeText={setRangeText}/>
              </div>
            </div>

            {/* Member ID */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2 text-[#CB3B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
                Member ID
              </label>
              <input
                type="text"
                name="memberID"
                placeholder="Enter Member ID"
                value={formData.memberID}
                onChange={handleChange}
                className="w-full h-12 px-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF59B6] focus:border-transparent transition-all duration-200 text-sm font-medium"
              />
            </div>

            {/* Marital Status */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2 text-[#CB3B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Marital Status
              </label>
              <select 
                name="maritalStatus" 
                value={formData.maritalStatus} 
                onChange={handleChange}
                className="w-full h-12 px-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF59B6] focus:border-transparent transition-all duration-200 text-sm font-medium appearance-none bg-white cursor-pointer"
              >
                <option value="">Select One</option>
                <option value="never-married">Never Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
                <option value="Single">Single</option>
              </select>
            </div>

            {/* Sect */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2 text-[#CB3B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Sect
              </label>
              <select 
                name="sect" 
                value={formData.sect} 
                onChange={handleChange}
                className="w-full h-12 px-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF59B6] focus:border-transparent transition-all duration-200 text-sm font-medium appearance-none bg-white cursor-pointer"
              >
                <option value="">Choose One</option>
                <option value="sunni-hanafi">Sunni-Hanafi</option>
                <option value="sunni">Sunni</option>
                <option value="shia">Shia</option>
                <option value="sunni-shafi">Sunni-Shafi</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Profession */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2 text-[#CB3B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
                Profession
              </label>
              <select 
                name="profession" 
                value={formData.profession} 
                onChange={handleChange}
                className="w-full h-12 px-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF59B6] focus:border-transparent transition-all duration-200 text-sm font-medium appearance-none bg-white cursor-pointer"
              >
                <option value="">Choose One</option>
                <option value="doctor">Doctor</option>
                <option value="engineer">Engineer</option>
                <option value="teacher">Teacher</option>
                <option value="lawyer">Lawyer</option>
                <option value="artist">Artist</option>
              </select>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2 text-[#CB3B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Country
              </label>
              <select 
                name="country" 
                value={formData.country} 
                onChange={handleChange}
                className="w-full h-12 px-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF59B6] focus:border-transparent transition-all duration-200 text-sm font-medium appearance-none bg-white cursor-pointer"
              >
                <option value="">Choose One</option>
                <option value="usa">United States</option>
                <option value="canada">Canada</option>
                <option value="uk">United Kingdom</option>
                <option value="india">India</option>
                <option value="australia">Australia</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* State */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2 text-[#CB3B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                State
              </label>
              <select 
                name="state" 
                value={formData.state} 
                onChange={handleChange}
                className="w-full h-12 px-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF59B6] focus:border-transparent transition-all duration-200 text-sm font-medium appearance-none bg-white cursor-pointer"
              >
                <option value="">Choose One</option>
                <option value="andhra-pradesh">Andhra Pradesh</option>
                <option value="arunachal-pradesh">Arunachal Pradesh</option>
                <option value="assam">Assam</option>
                {/* Add other states here */}
              </select>
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center">
                <svg className="w-4 h-4 mr-2 text-[#CB3B8B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                City
              </label>
              <select 
                name="city" 
                value={formData.city} 
                onChange={handleChange}
                className="w-full h-12 px-4 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF59B6] focus:border-transparent transition-all duration-200 text-sm font-medium appearance-none bg-white cursor-pointer"
              >
                <option value="">Choose One</option>
                <option value="mumbai">Mumbai</option>
                <option value="delhi">Delhi</option>
                <option value="New York">New York</option>
                {/* Add other cities here */}
              </select>
            </div>

            {/* Search Button */}
            <button 
              type="button"
              onClick={handleSearch}
              disabled={isSearching}
              className={`w-full h-12 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2 ${
                isSearching 
                  ? 'bg-gradient-to-r from-[#FFC0E3] to-[#FFA4D6] text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#FF59B6] to-[#EB53A7] text-white hover:from-[#F971BC] hover:to-[#DA73AD] shadow-lg hover:shadow-xl'
              }`}
            >
              {isSearching ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search Profiles</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
