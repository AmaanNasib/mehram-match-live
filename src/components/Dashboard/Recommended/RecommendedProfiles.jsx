import React, { useState, useEffect } from 'react';
import DashboadrCard from '../dashboardCard/DashboardCard';
import './recommendedProfiles.css';
import { useNavigate } from 'react-router-dom';

const RecommendedProfiles = ({ profiles, setApiData, url, activeUser }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

    const navigate =useNavigate();

  return (
    <section className="recommended-section" style={{margin:"0"}}>
      <div className="narrow-gap">
        <div className="button-container">
          <h1>Recommended Profiles</h1>
          <button className="top-right-button" onClick={()=>navigate(`/viewallrecommendedprofiles`)}>View All</button>
        </div>
        <p>The profile creation process leads you to better search results and recommended profiles.</p>
      </div>
      <div className="profile-scroll">
        {isLoading ? (
          <div className="shimmer-container">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="secondDetail shimmer">
                <div className="headingSecond">
                  <div className="shimmer shimmer-img"></div>
                  <h1 className="shimmer shimmer-text shimmer-title"></h1>
                </div>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="basic">
                    <div className="basicleft">
                      <h5 className="shimmer shimmer-text shimmer-info"></h5>
                    </div>
                    <div className="basicRight">
                      <h5 className="shimmer shimmer-text shimmer-info"></h5>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="profile-cards">
            {profiles && profiles.length > 0 ? (
              profiles.filter(profile => {
                // Gender filtering: show opposite gender
                const currentUserGender = activeUser?.gender;
                const profileGender = profile.user?.gender || profile?.gender;
                
                // If current user is male, show female profiles and vice versa
                if (currentUserGender === 'male' && profileGender === 'female') return true;
                if (currentUserGender === 'female' && profileGender === 'male') return true;
                
                // If gender is not specified, show all profiles
                if (!currentUserGender || !profileGender) return true;
                
                return false;
              }).map((profile) => {
                const user = profile && profile.user ? profile.user : profile;
                const keyId = user?.id || profile?.id;
                return (
                  <DashboadrCard 
                    key={keyId}
                    profile={user}
                    url={url}
                    interested_id={profile?.interested_id}
                    setApiData={setApiData}
                    IsInterested={profile?.is_interested}
                  />
                );
              })
            ) : (
              <p style={{ color: 'red' }}>No match found</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendedProfiles;










// import React, { useState, useEffect } from 'react';
// import DashboadrCard from '../dashboardCard/DashboardCard';
// import './recommendedProfiles.css';

// // Loader Component
// const Loader = () => (
//   <div className="loader">
//     <div className="spinner"></div>
//   </div>
// );

// const RecommendedProfiles = ({ profiles , setApiData,url}) => {
//   const [isLoading, setIsLoading] = useState(true);

//   // Simulate loading delay
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 2000); // Simulate a 2-second loading time

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <section className="trending-section">
//       <div class="narrow-gap">
//         <div className="button-container">
//           <h1>Recommended Profiles</h1>

//           <button className="top-right-button">View All</button>
//         </div>
//         <p>The profile creation process leads you to better search results and recommended profiles.</p>
//       </div>
//       <div className="profile-scroll">
//       {isLoading ? (
//           <Loader />
//         ) : (
//         <div className="profile-cards">
//           {profiles && profiles.length > 0 ? (
//             profiles.map((profile) => (
//               <DashboadrCard key={profile.id} profile={profile.user} url={url} interested_id={profile?.interested_id} setApiData={setApiData} IsInterested={profile?.is_interested}/>
//             ))
//           ) : (
//             <p style={{ color: 'red' }}>No match found</p>
//           )}
//         </div>
//                 )}

//       </div>
//     </section>
//   );
// };

// export default RecommendedProfiles;
