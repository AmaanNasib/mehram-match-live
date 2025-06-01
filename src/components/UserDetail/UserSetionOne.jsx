import React, { useState, useEffect } from 'react';
import heart from "../../images/colorHeart.svg";
import hamburger from "../../images/hamburger.svg";
import notAllowed from "../../images/notAllowed.svg";
import men1 from "../../images/men1.jpg";
import requestphoto from "../../images/requestPoto.svg";
import profileStart from "../../images/profileStar.svg";
import start1 from "../../images/iconoir_star-solid.svg";
import strat2 from "../../images/iconoir_bright-star.svg";
import "./UserSectionOne.css"; // Ensure you have the CSS file for shimmer effect

const UserSetionOne = ({ apiData }) => {
  const [loading, setLoading] = useState(true);
  const [gender] = useState(localStorage.getItem('gender'));
  useEffect(() => {
    if (apiData) {
      setTimeout(() => setLoading(false), 2000); // Simulate loading time
    }
  }, [apiData]);

  return (
    <>
      <div className='sectionOne'>
        <div className='upper'>
          <div style={{ position: "relative" }}>
            <div className='blurImg'>

            </div>
            <div className={ apiData.gender=='female'&&!apiData?.photo_upload_privacy_option?'profileImg':''}>
              {loading ? (
                <div className="shimmer shimmer-img" />
              ) : (
                // <img
                //   src={apiData?.upload_photo || men1}
                //   alt=""
                //   className='profile-picture'
                // />
                <img src={apiData?.profile_photo ? `${'https://mehram-match.onrender.com'}${apiData?.profile_photo}` : men1} alt="" style={{ height: "33vh", width: "33vh", borderRadius: "50%", margin: "auto", border: "8px solid pink" }} />
              )}
              <div className='blurImg1'>
                <img src={profileStart} alt="" />
              </div>
            </div>
          </div>
          {loading ? <div className="shimmer shimmer-text shimmer-title" /> : <h1>{apiData?.name}</h1>}
          {loading ? <div className="shimmer shimmer-text" /> : <h5 className='userId'>{apiData?.id}</h5>}
          <div className='firstdetail'>
            {loading ? (
              <div className="shimmer shimmer-text shimmer-paragraph" />
            ) : (
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
            )}
          </div>
          <div className="matchCard">
            <div className="percentMatch">
              <h6 className="cardText">(Matched-36%)</h6>
            </div>
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
              <h5>88% Comleted Profile</h5>
              <div className='filled'>

              </div>
              <div className='matchedIcondDiv'>
                <div className='matchedIcond'><img src={heart} alt="" />
                  <p> Intrest</p> </div>
                <div className='matchedIcond'><img src={hamburger} alt="" /> <p>ShortList</p></div>
                <div className='matchedIcond'><img src={notAllowed} alt="" /> <p>Ignore</p></div>

              </div>

              <button className='matchBtn'>Message</button>

            </div>
          </div>

        </div>
        <div className="planDetail">
          <div className="starts"><img src={start1} alt="" /><h2>Upgrade Your Plofile</h2><img src={strat2} alt="" /></div>
          <h5>Upgrade your profile to view contact details of
            interested profiles, send Super Interestes, send
            personal messages, enjoy increase profile
            visibility, and access advances searched features
            for better matches. Unlock these premium
            features and elevate your experience</h5>
          <button className='planBtn'>Upgrade Now</button>
        </div>
      </div>


    </>
  );
};

export default UserSetionOne;

















// import React from 'react'
// import heart from "../../images/colorHeart.svg"
// import hamburger from "../../images/hamburger.svg"
// import notAllowed from "../../images/notAllowed.svg"
// import men1 from "../../images/men1.jpg"
// import requestphoto from "../../images/requestPoto.svg"
// import profileStart from "../../images/profileStar.svg"
// import start1 from "../../images/iconoir_star-solid.svg"
// import strat2 from "../../images/iconoir_bright-star.svg"

// const UserSetionOne = ({apiData}) => {
//   return (
//     <div className='sectionOne'>
//     <div className='upper'>
//     <div style={{position : "relative"}}>
//       <div className='blurImg'>
//         <img src={requestphoto}  alt="" />
//       </div>
//       <div className="profileImg">
    
// <img src={apiData?.upload_photo ||men1} alt="" style={{height:"33vh", width:"33vh" , borderRadius:"50%", margin :"auto" , border :"8px solid pink"}}/>
// <div className='blurImg1'>
//         <img src={profileStart}  alt="" />
//       </div>
//       </div>
//       </div>
//       <h1>{apiData?.name}</h1>
//       <h5 className='userId'>{apiData?.id}</h5>
//       <div className='firstdetail'>

//       <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus commodi et id fugit! Dolores optio ab ullam, adipisci quis maiores.</p>
//       </div>
//       <div className="matchCard">
//         <div className="percentMatch">
//             <h6>(Matched-36%)</h6>
//         </div>
//         <div className="cardDetail">
//             <h5>Age : <span>{apiData?.age || "NA"} </span></h5>
//             <h5>Marital Status : <span id='lable'>{apiData?.martial_status || "NA"}</span></h5>

//             <h5>Current Address :  <span>{apiData?.city || "NA"}</span></h5>

//             <h5> Profession : <span>{apiData?.profession || "Na"}</span></h5>

//             <h5> Education : <span>{apiData?.profession || "Na"}</span></h5>

//             <h5> Height : <span>{apiData?.height || "Na"}</span> </h5>

//             <h5>Weight : <span>{apiData?.weight || "Na"}</span></h5>
//         </div>
//         <div className='percentComplete'>
//             <h5>88% Comleted Profile</h5>
//             <div className='filled'>

//             </div>
//             <div className='matchedIcondDiv'>
//                 <div className='matchedIcond'><img src={heart} alt="" />
//               <p> Intrest</p> </div>
//                 <div className='matchedIcond'><img src={hamburger} alt="" /> <p>ShortList</p></div>
//                 <div className='matchedIcond'><img src={notAllowed} alt="" /> <p>Ignore</p></div>

//             </div>

//             <button className='matchBtn'>Message</button>

//         </div>
//       </div>
// </div>
//       <div className="planDetail">
//         <div className="starts"><img src={start1} alt="" /><h2>Upgrade Your Plofile</h2><img src={strat2} alt="" /></div>
// <h5>Upgrade your profile to view contact details of
// interested profiles, send Super Interestes, send
// personal messages, enjoy increase profile
// visibility, and access advances searched features
// for better matches. Unlock these premium
// features and elevate your experience</h5>
//         <button className='planBtn'>Upgrade Now</button>
//       </div>
//     </div>
//   )
// }

// export default UserSetionOne
