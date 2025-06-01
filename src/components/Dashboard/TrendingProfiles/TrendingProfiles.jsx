import React, { useState, useEffect } from 'react';
import DashboadrCard from '../dashboardCard/DashboardCard';
import './trendingProfiles.css';

const TrendingProfiles = ({ profiles, setApiData, url }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="trending-section" style={{margin:"0"}} >
      <div className="narrow-gap">
        <div className="button-container">
          <h1>Top Trending Profiles</h1>
          <button className="top-right-button">View All</button>
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
              profiles.map((profile) => (
                <DashboadrCard 
                  key={profile.id} 
                  profile={profile.user} 
                  url={url} 
                  interested_id={profile?.interested_id} 
                  setApiData={setApiData} 
                  IsInterested={profile?.is_interested}
                />
              ))
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