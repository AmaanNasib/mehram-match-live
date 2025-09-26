import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postDataWithFetchV2, putDataWithFetchV2 } from '../../apiUtils'; // Adjust import path
import heart from "../../images/colorHeart.svg";
import hamburger from "../../images/hamburger.svg";
import notAllowed from "../../images/notAllowed.svg";
import men1 from "../../images/men1.jpg";
import profileStart from "../../images/profileStar.svg";
import start1 from "../../images/iconoir_star-solid.svg";
import strat2 from "../../images/iconoir_bright-star.svg";
import "./UserSectionOne.css";

const UserSetionOne = ({ apiData, setApiData ,setMessage,setErrors}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem('role');
  const gender = localStorage.getItem('gender');

  useEffect(() => {
    if (apiData) {
      setLoading(false);
    }
  }, [apiData]);

  const handleInterest = () => {
    const payload = {
      action_by_id: userId,
      action_on_id:apiData.id,
      interest: true
    };

    const url = apiData.interested_id 
      ? `/api/recieved/${apiData.interested_id}/` 
      : `/api/recieved/`;

    const parameter = {
      url,
      payload,
      setErrors:setErrors,
      tofetch: {
        items: [{
          fetchurl: `/api/user/${userId}/`,
          dataset: setApiData,
          setSuccessMessage:setMessage,
          setErrors:setErrors
        }],
        setErrors:setErrors
      }
    };

    if (apiData.interested_id) {
      putDataWithFetchV2(parameter);
    } else {
      postDataWithFetchV2(parameter);
    }
  };

  const handleShortlist = () => {
    const parameter = {
      url: role === 'agent' ? `/api/agent/shortlist/` : `/api/recieved/`,
      payload: {
        action_by_id: userId,
        action_on_id: apiData.id,
        shortlisted: true
      },
      setErrors:setErrors,
      tofetch: {
        items: [{
          fetchurl: `/api/user/${userId}/`,
          dataset: setApiData,
          setSuccessMessage:setMessage,
          setErrors:setErrors
        }],
        setErrors:setErrors
      }
    };
    postDataWithFetchV2(parameter);
  };

  const handleBlock = () => {
    const parameter = {
      url: `/api/recieved/`,
      payload: {
        action_by_id: userId,
        action_on_id: apiData.id,
        blocked: true
      },
      setErrors:setErrors,
      tofetch: {
        items: [{
          fetchurl:`/api/user/${userId}/`,
          dataset: setApiData,
          setSuccessMessage:setMessage,
          setErrors:setErrors
        }],
        setErrors:setErrors
      }
    };
    postDataWithFetchV2(parameter);
  };

  return (
    <div className='sectionOne'>
      <div className='upper'>
        <div style={{ position: "relative" }}>
          <div className='blurImg'></div>
          <div className={gender === 'female' && !apiData?.photo_upload_privacy_option ? 'profileImg' : ''}>
            {loading ? (
              <div className="shimmer shimmer-img" />
            ) : (
              <img 
                src={
                    apiData?.profile_photo
                      ? `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}${apiData.profile_photo}`
                      : `data:image/svg+xml;utf8,${encodeURIComponent(
                          apiData?.gender === "male"
                            ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6">
                <circle cx="12" cy="8" r="5" fill="#bfdbfe"/>
                <path d="M12 14c-4.42 0-8 2.69-8 6v1h16v-1c0-3.31-3.58-6-8-6z" fill="#bfdbfe"/>
              </svg>`
                            : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ec4899">
                <circle cx="12" cy="8" r="5" fill="#fbcfe8"/>
                <path d="M12 14c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6z" fill="#fbcfe8"/>
                <circle cx="12" cy="8" r="2" fill="#ec4899"/>
              </svg>`
                        )}`
                  } 
                alt="Profile" 
                className='profile-picture'
                style={{ height: "33vh", width: "33vh", borderRadius: "50%", margin: "auto", border: "8px solid pink" }}
              />
            )}
            <div className='blurImg1'>
              <img src={profileStart} alt="" />
            </div>
          </div>
        </div>
        
        {loading ? <div className="shimmer shimmer-text shimmer-title" /> : <h1>{apiData?.name}</h1>}
        {loading ? <div className="shimmer shimmer-text" /> : <h5 className='userId'>{apiData?.id}</h5>}
        
        {/* <div className='firstdetail'>
          {loading ? (
            <div className="shimmer shimmer-text shimmer-paragraph" />
          ) : (
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
          )}
        </div> */}
        
        <div className="matchCard">
          {/* <div className="percentMatch">
            <h6 className="cardText">(Matched-36%)</h6>
          </div> */}
          
          <div className="cardDetail">
            {loading ? (
              <div className="shimmer shimmer-text shimmer-info" />
            ) : (
              <>
                <h5>Age: <span>{apiData?.age || "NA"}</span></h5>
                <h5>Marital Status: <span>{apiData?.martial_status || "NA"}</span></h5>
                <h5>Current Address: <span>{apiData?.city || "NA"}</span></h5>
                <h5>Profession: <span>{apiData?.profession || "NA"}</span></h5>
                <h5>Education: <span>{apiData?.education || "NA"}</span></h5>
                <h5>Height: <span>{apiData?.height || "NA"}</span></h5>
                <h5>Weight: <span>{apiData?.weight || "NA"}</span></h5>
              </>
            )}
          </div>
          
          <div className='percentComplete'>
          <h5>
            {apiData?.profile_percentage || "0"}% Completed Profile
          </h5>
            <div className='filled'></div>
            
            <div className='matchedIcondDiv'>
              {/* Interest Button */}
              <button 
                className='matchedIcond' 
                onClick={()=>handleInterest()}
                style={{ cursor: 'pointer' }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={apiData?.is_interested===true ? "#ff4081" : "none"}
                  stroke="#ff4081"
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>Interest</p>
              </button>
              
              {/* Shortlist Button */}
              <button 
                className='matchedIcond' 
                onClick={()=>handleShortlist()}
                style={{ cursor: 'pointer' }}
              >
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.68945 3.62109V7.37109H6.43945V3.62109H2.68945ZM3.93945 4.87109H5.18945V6.12109H3.93945V4.87109ZM7.68945 4.87109V6.12109H17.0645V4.87109H7.68945ZM2.68945 8.62109V12.3711H6.43945V8.62109H2.68945ZM3.93945 9.87109H5.18945V11.1211H3.93945V9.87109ZM7.68945 9.87109V11.1211H17.0645V9.87109H7.68945ZM2.68945 13.6211V17.3711H6.43945V13.6211H2.68945ZM3.93945 14.8711H5.18945V16.1211H3.93945V14.8711ZM7.68945 14.8711V16.1211H17.0645V14.8711H7.68945Z"
                    fill="#FD2C79"
                  />
                </svg>
                <p>{apiData?.is_shortlisted=== true ?"Shortlisted":"Shortlist"}</p>
              </button>
              
              {/* Block Button */}
              <button 
                className='matchedIcond' 
                onClick={()=>handleBlock()}
                style={{ cursor: 'pointer' }}
              >
                <svg
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.2598 1.87109C8.78841 1.87109 7.42122 2.24219 6.1582 2.98438C4.93424 3.70052 3.96419 4.67057 3.24805 5.89453C2.50586 7.15755 2.13477 8.52474 2.13477 9.99609C2.13477 11.4674 2.50586 12.8346 3.24805 14.0977C3.96419 15.3216 4.93424 16.2917 6.1582 17.0078C7.42122 17.75 8.78841 18.1211 10.2598 18.1211C11.7311 18.1211 13.0983 17.75 14.3613 17.0078C15.5853 16.2917 16.5553 15.3216 17.2715 14.0977C18.0137 12.8346 18.3848 11.4674 18.3848 9.99609C18.3848 8.52474 18.0137 7.15755 17.2715 5.89453C16.5553 4.67057 15.5853 3.70052 14.3613 2.98438C13.0983 2.24219 11.7311 1.87109 10.2598 1.87109ZM10.2598 3.12109C11.5098 3.12109 12.6686 3.43359 13.7363 4.05859C14.765 4.67057 15.5853 5.49089 16.1973 6.51953C16.8223 7.58724 17.1348 8.74609 17.1348 9.99609C17.1348 10.8294 16.9915 11.6367 16.7051 12.418C16.4186 13.1602 16.015 13.8372 15.4941 14.4492L5.9043 4.66406C6.50326 4.16927 7.17383 3.78841 7.91602 3.52148C8.6582 3.25456 9.43945 3.12109 10.2598 3.12109ZM5.02539 5.54297L14.6152 15.3281C14.0163 15.8229 13.3457 16.2038 12.6035 16.4707C11.8613 16.7376 11.0801 16.8711 10.2598 16.8711C9.00977 16.8711 7.85091 16.5586 6.7832 15.9336C5.75456 15.3216 4.93424 14.5013 4.32227 13.4727C3.69727 12.4049 3.38477 11.2461 3.38477 9.99609C3.38477 9.16276 3.52799 8.35547 3.81445 7.57422C4.10091 6.83203 4.50456 6.15495 5.02539 5.54297Z"
                    fill="#FD2C79"
                  />
                </svg>
                <p>{apiData?.is_blocked===true?"Blocked":"Ignore"}</p>
              </button>
            </div>

            {/* <button 
              className='matchBtn'
              onClick={() => navigate(`/details/${apiData.id}`)}
            >
              View Profile
            </button> */}
          </div>
        </div>
      </div>
      
      <div className="planDetail">
        <div className="starts">
          <img src={start1} alt="" />
          <h2>Upgrade Your Profile</h2>
          <img src={strat2} alt="" />
        </div>
        <h5>Upgrade your profile to view contact details of interested profiles, send Super Interests, send personal messages, enjoy increased profile visibility, and access advanced search features for better matches. Unlock these premium features and elevate your experience</h5>
        <button className='planBtn'>Upgrade Now</button>
      </div>
    </div>
  );
};

export default UserSetionOne;