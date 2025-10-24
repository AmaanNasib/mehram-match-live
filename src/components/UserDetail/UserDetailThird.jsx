import React, { useState, useEffect } from "react";
import "./userThird.css";
import men from "../../images/men8.jpg";
import user from "../../images/findUser.svg";
import { fetchDataWithTokenV2 } from "../../apiUtils";
import { useNavigate } from "react-router-dom";

const UserDetailThird = () => {
  const [apiData, setApiData] = useState([]);
  const [apiData1, setApiData1] = useState([]);
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId] = useState(localStorage.getItem("userId"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch Trending Profiles
        const trendingResponse = await fetchDataWithTokenV2({
          url: `/api/trending_profile/?user_id=${userId}&profile_completed=true`,
          setterFunction: setApiData,
          setErrors: setErrors,
        });

        // Fetch Similar Profiles
        const similarResponse = await fetchDataWithTokenV2({
          url: `/api/user/recommend/?user_id=${userId}&profile_completed=true`,
          setterFunction: setApiData1,
          setErrors: setErrors,
        });

        // If both requests are successful, set loading to false
        if (trendingResponse && similarResponse) {
          setLoading(false);
        }
      } catch (error) {
        setErrors(true);
        setLoading(false);
      }
    };

    // Set a timeout to stop loading after 10 seconds (fallback)
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 2000); // 10 seconds

    fetchData();

    // Clear the timeout if the component unmounts or data is fetched
    return () => clearTimeout(timeoutId);
  }, [userId]);

  return (
    <div className="thirdSection">
      {/* Trending Profiles Section */}
      <div className="allcards">
        <div className="trending">
          <h5>Trending Profiles</h5>
          <div className="cardContainer">
            {loading
              ? [...Array(3)].map((_, index) => (
                  <div key={index} className="tCard shimmer">
                    <div className="tImg shimmer shimmer-img"></div>
                    <div className="tDetails">
                      <div className="tHeading">
                        <div className="tLeft">
                          <h3 className="shimmer shimmer-text shimmer-title"></h3>
                          <h4 className="shimmer shimmer-text shimmer-info"></h4>
                        </div>
                        <div className="tRight shimmer shimmer-text shimmer-info"></div>
                      </div>
                      <h3 className="shimmer shimmer-text shimmer-info"></h3>
                      <h3 className="shimmer shimmer-text shimmer-info"></h3>
                      <h3 className="shimmer shimmer-text shimmer-info"></h3>
                      <h3 className="shimmer shimmer-text shimmer-info"></h3>
                      <div className="fullProfile shimmer shimmer-text shimmer-info"></div>
                    </div>
                  </div>
                ))
              : apiData?.map((profile) => (
                  <div key={profile?.user?.id} className="tCard">
                    
                      <img
                        src={
                    profile.profile_photo
                      ? `${process.env.REACT_APP_API_URL}${profile.profile_photo}`
                      : `data:image/svg+xml;utf8,${encodeURIComponent(
                          profile?.gender === "male"
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
                        alt=""
                        style={{
                    objectFit: "cover",
                  }}
                      />
                    
                    <div className="tDetails">
                      <div className="tHeading">
                        <div className="tLeft">
                          <h3 style={{ fontWeight: "bold" }}>{profile?.user?.name || "NA"}</h3>
                          <h4>ID: {profile?.user?.id || "NA"}</h4>
                        </div>
                        <div className="tRight">
                          <span id="NLable">{profile?.user?.martial_status || "NA"}</span>
                        </div>
                      </div>
                      <h3>Age: {profile?.user?.age || "NA"}</h3>
                      <h3>Sect: {profile?.user?.sect_school_info || "NA"}</h3>
                      <h3>Education: {profile?.user?.Education || "NA"}</h3>
                      <h3>Profession: {profile?.user?.profession || "NA"}</h3>
                      <div className="fullProfile" onClick={() => navigate(`/details/${profile?.user?.id}/`)}>
                        <img src={user} alt="" />
                        <p>Full Profile</p>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* Similar Profiles Section */}
      <div className="allcards">
        <div className="trending">
          <h5>Similar Profiles</h5>
          <div className="cardContainer">
            {loading
              ? [...Array(3)].map((_, index) => (
                  <div key={index} className="tCard shimmer">
                    <div className="tImg shimmer shimmer-img"></div>
                    <div className="tDetails">
                      <div className="tHeading">
                        <div className="tLeft">
                          <h3 className="shimmer shimmer-text shimmer-title"></h3>
                          <h4 className="shimmer shimmer-text shimmer-info"></h4>
                        </div>
                        <div className="tRight shimmer shimmer-text shimmer-info"></div>
                      </div>
                      <h3 className="shimmer shimmer-text shimmer-info"></h3>
                      <h3 className="shimmer shimmer-text shimmer-info"></h3>
                      <h3 className="shimmer shimmer-text shimmer-info"></h3>
                      <h3 className="shimmer shimmer-text shimmer-info"></h3>
                      <div className="fullProfile shimmer shimmer-text shimmer-info"></div>
                    </div>
                  </div>
                ))
              : apiData1?.map((profile) => (
                  <div key={profile?.user?.id} className="tCard">
                    <div className="tImg">
                      <img
                        src={men}
                        alt=""
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                          borderRadius: "2vh 2vh 0 0",
                        }}
                      />
                    </div>
                    <div className="tDetails">
                      <div className="tHeading">
                        <div className="tLeft">
                          <h3 style={{ fontWeight: "bold" }}>{profile?.user?.name || "NA"}</h3>
                          <h4>ID: {profile?.user?.id || "NA"}</h4>
                        </div>
                        <div className="tRight">
                          <span id="NLable">{profile?.user?.martial_status || "NA"}</span>
                        </div>
                      </div>
                      <h3>Age: {profile?.user?.age || "NA"}</h3>
                      <h3>Sect: {profile?.user?.sect_school_info || "NA"}</h3>
                      <h3>Education: {profile?.user?.Education || "NA"}</h3>
                      <h3>Profession: {profile?.user?.profession || "NA"}</h3>
                      <div className="fullProfile" onClick={() => navigate(`/details/${profile?.user?.id}/`)}>
                        <img src={user} alt="" />
                        <p>Full Profile</p>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* Note Section */}
      <div className="note">
        <p>
          <span>NOTE:</span> Please verify the details provided in any profile
          personally before taking further steps. Always prioritize your safety
          and never send money or share personal financial information with
          anyone you meet online.
        </p>
      </div>
    </div>
  );
};

export default UserDetailThird;













// import React from "react";
// import "./userThird.css";
// import men from "../../images/men8.jpg";
// import user from "../../images/findUser.svg";
// import { useState, useEffect } from "react";
// import { fetchDataWithTokenV2 } from "../../apiUtils";
// import { useNavigate } from "react-router-dom";
// const UserDetailThird = () => {
//   const [apiData, setApiData] = useState([]);
//   const [apiData1, setApiData1] = useState([]);
//   const [errors, setErrors] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [userId] = useState(localStorage.getItem("userId"));
//   const navigate = useNavigate();

//   useEffect(() => {
//     const parameter = {
//       url: `/api/trending_profile/?user_id=${userId}`,
//       setterFunction: setApiData,
//       setErrors: setErrors,
//       setLoading: setLoading,
//     };
//     fetchDataWithTokenV2(parameter);
//     const parameter1 = {
//       url: `/api/user/recommend/?user_id=${userId}`,
//       setterFunction: setApiData1,
//       setErrors: setErrors,
//       setLoading: setLoading,
//     };
//     fetchDataWithTokenV2(parameter1);
//   }, []);
//   return (
//     <div className="thirdSection">
//       <div className="allcards">
//         <div className="trending">
//           <h5>Trending Profiles</h5>
//           <div className="cardContainer">
//             {apiData?.map((profile) => (
//               <div className="tCard">
//                 <div className="tImg">
//                   <img
//                     src={men}
//                     alt=""
//                     style={{
//                       height: "100%",
//                       width: "100%",
//                       objectFit: "cover",
//                       borderRadius: "2vh 2vh 0 0",
//                     }}
//                   />
//                 </div>
//                 <div className="tDetails">
//                   <div className="tHeading">
//                     <div className="tLeft">
//                       <h3 style={{ fontWeight: "bold" }}>{profile?.user?.name || "NA"}</h3>
//                       <h4>{profile?.user?.id || "NA"}</h4>
//                     </div>
//                     <div className="tRight">
//                       <span id="NLable">{profile?.user?.martial_status || "NA"}</span>
//                     </div>
//                   </div>
//                   <h3>{profile?.user?.age || "NA"}</h3>
//                   <h3>{profile?.user?.sec || "NA"}</h3>
//                   <h3>{profile?.user?.Education || "NA"}</h3>
//                   <h3>{profile?.user?.profession || "NA"}</h3>
//                   <div className="fullProfile" onClick={() => navigate(`/details/${profile?.user?.id}/`)}>
//                     <img src={user} alt="" />
//                     <p>Full Profile</p>
//                   </div>
//                 </div>
//               </div>))
//             }

//           </div>
//         </div>
//         <div className="similar"></div>
//       </div>

//       <div className="allcards">
//         <div className="trending">
//           <h5>Similar Profiles</h5>
//           <div className="cardContainer">
//             {apiData1?.map((profile) => (
//               <>
//                 <div className="tCard">
//                   <div className="tImg">
//                     <img
//                       src={men}
//                       alt=""
//                       style={{
//                         height: "100%",
//                         width: "100%",
//                         objectFit: "cover",
//                         borderRadius: "2vh 2vh 0 0",
//                       }}
//                     />
//                   </div>
//                   <div className="tDetails">
//                     <div className="tHeading">
//                       <div className="tLeft">
//                         <h3 style={{ fontWeight: "bold" }}>{profile?.user?.name || "NA"}</h3>
//                         <h4>{profile?.user?.id || "NA"}</h4>
//                       </div>
//                       <div className="tRight">
//                         <span id="NLable">{profile?.user?.martial_status || "NA"}</span>
//                       </div>
//                     </div>
//                     <h3>{profile?.user?.age || "NA"}</h3>
//                     <h3>{profile?.user?.sec || "NA"}</h3>
//                     <h3>{profile?.user?.Education || "NA"}</h3>
//                     <h3>{profile?.user?.profession || "NA"}</h3>
//                     <div className="fullProfile" onClick={() => navigate(`/details/${profile?.user?.id}/`)}>
//                       <img src={user} alt="" />
//                       <p>Full Profile</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="tCard">
//                   <div className="tImg">
//                     <img
//                       src={men}
//                       alt=""
//                       style={{
//                         height: "100%",
//                         width: "100%",
//                         objectFit: "cover",
//                         borderRadius: "2vh 2vh 0 0",
//                       }}
//                     />
//                   </div>
//                   <div className="tDetails">
//                     <div className="tHeading">
//                       <div className="tLeft">
//                         <h3 style={{ fontWeight: "bold" }}>KhanSaab</h3>
//                         <h4>013HGHK01</h4>
//                       </div>
//                       <div className="tRight">
//                         <span id="NLable">Never Married</span>
//                       </div>
//                     </div>
//                     <h3>23</h3>
//                     <h3>Sunni</h3>
//                     <h3>B-tech</h3>
//                     <h3>Software-Developer</h3>
//                     <div className="fullProfile">
//                       <img src={user} alt="" />
//                       <p>Full Profile</p>
//                     </div>
//                   </div>
//                 </div>

//               </>))
//             }
//           </div>
//         </div>
//         <div className="similar"></div>
//       </div>

//       <div className="note">
//         <p>
//           <span>NOTE:</span> Please verify the details provided in any profile
//           personally before taking further steps. Always prioritize your safety
//           and never send money or share personal financial information with
//           anyone you meet online
//         </p>
//       </div>
//     </div>
//   );
// };

// export default UserDetailThird;
