import React, { useState, useEffect } from 'react';
import DashboadrCard from '../dashboardCard/DashboardCard';
import MobileProfileCard from '../dashboardCard/MobileProfileCard';
import './trendingProfiles.css';
import {  useNavigate ,} from 'react-router-dom';

const TrendingProfiles = ({ profiles, setApiData, url, activeUser }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

    const navigate =useNavigate();


  return (
    <section className="trending-section" style={{margin:"0"}} >
      <div className="narrow-gap">
        <div className="button-container">
          <h1>Top Trending Profiles</h1>
          <button className="top-right-button" onClick={()=>navigate(`/viewalltrendingprofiles`)}>View All</button>
        </div>
        <p>To achieve more personalized suggestion complete your profile.</p>
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
                // For agents, show all profiles (both male and female)
                const currentRole = localStorage.getItem('role');
                const isImpersonating = localStorage.getItem('is_agent_impersonating') === 'true';
                
                if (currentRole === 'agent' && !isImpersonating) {
                  return true; // Show all profiles for agents
                }
                
                // For regular users, show opposite gender
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
                
                if (isMobile) {
                  return (
                    <MobileProfileCard 
                      key={keyId}
                      profile={user}
                      url={url}
                      interested_id={profile?.interested_id}
                      setApiData={setApiData}
                      IsInterested={profile?.is_interested}
                    />
                  );
                }
                
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

export default TrendingProfiles;











// import React, { useState, useEffect } from 'react';
// import DashboadrCard from '../dashboardCard/DashboardCard';
// import './trendingProfiles.css';

// // Loader Component
// const Loader = () => (
//   <div className="loader">
//     <div className="spinner"></div>
//   </div>
// );

// const TrendingProfiles = ({ profiles, setApiData, url }) => {
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
//       <div className="narrow-gap">
//         <div className="button-container">
//           <h1>Top Trending Profiles</h1>
//           <button className="top-right-button">View All</button>
//         </div>
//         <p> To achieve more personalized suggestion complete your profile.</p>
//       </div>
//       <div className="profile-scroll">
//         {isLoading ? (
//           <Loader />
//         ) : (
//           <div className="profile-cards">
//             {profiles && profiles.length > 0 ? (
//               profiles.map((profile) => (
//                 <DashboadrCard key={profile.id} profile={profile.user} url={url} interested_id={profile?.interested_id} setApiData={setApiData} IsInterested={profile?.is_interested}/>
//               ))
//             ) : (
//               <p style={{ color: 'red' }}>No match found</p>
//             )}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default TrendingProfiles;