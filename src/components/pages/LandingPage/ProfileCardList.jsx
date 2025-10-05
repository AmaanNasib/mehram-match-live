import React from 'react';
import DashboadrCard from "../../Dashboard/dashboardCard/DashboardCard"
import './trendingProfiles.css';

const ProfileCardList = ({ profiles, setApiData, activeUser }) => {
  
  return (
    <section className="trending-section">
    <div className="narrow-gap">
      <div className="button-container">
      </div>
    </div>
      <div className="profile-scroll">
        <div className="profile-cards" >
          {profiles && profiles.length > 0 ? (
            profiles.map((profile) => (
              <DashboadrCard key={profile.id} profile={profile} setApiData={setApiData} IsInterested={profile?.is_interested} activeUser={activeUser}/>
            ))
          ) : (
            <p style={{ color: 'red' }}>No match found</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfileCardList;



















// import React, { useState } from 'react';
// import { useEffect } from 'react';
// import { fetchDataV2 } from '../../../apiUtils';
// import { useNavigate } from 'react-router-dom';

// const ProfileCard = ({ name, city, age, height, complexion, isHighlighted }) => {

  

//   return (
//     <div className={`card bg-[#FFF5FB] rounded-2xl border-2 p-6 flex flex-col flex-shrink-0 items-center h-[380px] w-[280px] transition-transform duration-300 ${isHighlighted
//           ? "scale-110 bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-white"
//           : "text-[#9E286A]"
//         }`}
//     >
//       {/* Profile Picture */}
//       <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
//         <img
//           src="profile-picture-url.jpg"
//           alt="Profile Picture"
//           className="w-full h-full object-cover"
//         />
//       </div>

//       {/* Name */}
//       <h3
//         className={`text-2xl font-bold ${isHighlighted
//             ? "text-white"
//             : "bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text"
//           } mb-2`}
//       >
//         {name}
//       </h3>

//       {/* City */}
//       <p
//         className={`text-base font-medium ${isHighlighted
//             ? "text-white"
//             : "bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text"
//           } mb-4`}
//       >
//         {city}
//       </p>

//       {/* Bottom-Aligned Info */}
//       <div className="w-full mt-auto flex justify-between text-sm font-medium">
//         <div className="flex flex-col items-center">
//           <span
//             className={`text-xl font-semibold ${isHighlighted
//                 ? "text-white"
//                 : "bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text"
//               } mb-2`}
//           >
//             {age}
//           </span>
//         </div>
//         <div className="flex flex-col items-center">
//           <span
//             className={`text-xl font-semibold ${isHighlighted
//                 ? "text-white"
//                 : "bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text"
//               } mb-2`}
//           >
//             {height}
//           </span>
//         </div>
//         <div className="flex flex-col items-center">
//           <span
//             className={`text-xl font-semibold ${isHighlighted
//                 ? "text-white"
//                 : "bg-gradient-to-r from-[#FF59B6] to-[#CB3B8B] text-transparent bg-clip-text"
//               } mb-2`}
//           >
//             {complexion}
//           </span>
//         </div>
//       </div>
//     </div>
//   );

// };

// const ProfileCardList = ({setIsModalOpen}) => {
//   const navigate = useNavigate();
//   const [apiData, setApiData] = useState([]);
//   const [errors, setErrors] = useState(false);



//   useEffect(() => {
//     const parameter = {
//       url: "/api/user/",
//       setterFunction: setApiData,
//       setErrors : setErrors
//     }
//     fetchDataV2(parameter)
//   }, [])

//   const checkToken = () => {



//     if (!localStorage.getItem('token')) {
//       setIsModalOpen(true)
//     }else{
//       navigate("/memprofile")
//     }
//   }

//   const profiles = [
//   {
//     name: "John Doe",
//     city: "New York",
//     age: 28,
//     height: "5'9\"",
//     complexion: "Fair",
//   },
//   {
//     name: "Jane Smith",
//     city: "Los Angeles",
//     age: 25,
//     height: "5'6\"",
//     complexion: "Medium",
//   },
//   {
//     name: "Ahmed Khan",
//     city: "Karachi",
//     age: 30,
//     height: "5'8\"",
//     complexion: "Olive",
//   },
//   {
//     name: "Maria Garcia",
//     city: "Barcelona",
//     age: 27,
//     height: "5'7\"",
//     complexion: "Fair",
//   },
// ];


//   return (
//     <div className="relative overflow-visible py-10">
//       <div className="flex justify-center space-x-20" onClick={() => checkToken()}>
//         {profiles?.map((profile, index) => (
//           <ProfileCard
//             key={index}
//             name={profile?.name}
//             city={profile?.city}
//             age={profile?.age}
//             height={profile?.height}
//             complexion={profile?.complexion}
//             isHighlighted={index === 2}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };



// export default ProfileCardList;
