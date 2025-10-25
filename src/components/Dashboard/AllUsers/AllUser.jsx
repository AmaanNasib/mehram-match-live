import React, { useState, useEffect } from 'react';
import DashboadrCard from '../dashboardCard/DashboardCard';
import MobileProfileCard from '../dashboardCard/MobileProfileCard';
import './alluser.css';
import { useNavigate } from 'react-router-dom';

const AllUser = ({ profiles, setApiData, setIsModalOpen, isOpenWindow, url, filterActive }) => {
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
    <section className="trending-section" style={{margin:"0"}}>
      <div className="narrow-gap">
        <div className="button-container">
          <h1>All Profiles</h1>
          <button className="top-right-button" onClick={()=>navigate(`/viewalluser`)}>View All</button>
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
                // Check if profile is completed - only show completed profiles
                const user = profile && profile.user ? profile.user : profile;
                const isProfileCompleted = user?.profile_completed === true;
                
                // If profile is not completed, don't show it
                if (!isProfileCompleted) {
                  return false;
                }
                
                // When filter is active, bypass gender filtering to show all filtered results
                if (filterActive) {
                  return true; // Show all filtered results regardless of gender
                }
                
                // For agents, show all completed profiles (both male and female)
                const currentRole = localStorage.getItem('role');
                const isImpersonating = localStorage.getItem('is_agent_impersonating') === 'true';
                
                if (currentRole === 'agent' && !isImpersonating) {
                  return true; // Show all completed profiles for agents
                }
                
                // For regular users, show opposite gender
                const currentUserGender = localStorage.getItem('gender');
                const profileGender = profile.user?.gender || profile?.gender;
                
                // If current user is male, show female profiles and vice versa
                if (currentUserGender === 'male' && profileGender === 'female') return true;
                if (currentUserGender === 'female' && profileGender === 'male') return true;
                
                // If gender is not specified, show all completed profiles
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
                      setApiData={setApiData}
                      interested_id={profile?.interested_id}
                      IsInterested={profile?.is_interested}
                    />
                  );
                }
                
                return (
                  <DashboadrCard
                    key={keyId}
                    profile={user}
                    url={url}
                    setApiData={setApiData}
                    interested_id={profile?.interested_id}
                    IsInterested={profile?.is_interested}
                    setIsModalOpen={setIsModalOpen}
                    isOpenWindow={isOpenWindow}
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

export default AllUser;














// import React, { useState, useEffect } from 'react';
// import DashboadrCard from '../dashboardCard/DashboardCard';
// import './alluser.css';


//   // Loader Component
//   const Loader = () => (
//     <div className="loader">
//       <div className="spinner"></div>
//     </div>
//   );
  

// const AllUser = ({ profiles, setApiData, setIsModalOpen ,isOpenWindow,url }) => {
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
//   <div className="button-container">
//   <h1>All Profiles</h1>

//         <button className="top-right-button">View All</button>
//       </div>
//   <p> To achieve more personalized suggestion complete your profile.</p>
// </div>
//     <div className="profile-scroll">
//     {isLoading ? (
//           <Loader />
//         ) : (
//       <div className="profile-cards">
//       {profiles && profiles.length > 0 ? (
//             profiles.map((profile) => (
//               <DashboadrCard key={profile.id} profile={profile.user} url={url} setApiData={setApiData} interested_id={profile?.interested_id} IsInterested={profile?.is_interested} setIsModalOpen={setIsModalOpen} isOpenWindow ={isOpenWindow} />
//             ))
//           ) : (
//             <p style={{ color: 'red' }}>No match found</p>
//           )}
//       </div>
//               )}

//     </div>
//   </section>
//   );
// };

// export default AllUser;
