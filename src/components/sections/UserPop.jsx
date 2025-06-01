import React from "react";
import "./userpopup.css";
import { useNavigate } from "react-router-dom";
import cross from "../../images/cross-svgrepo-com.svg";
import userLogo from "../../images/profile-circle-svgrepo-com.svg";

const UserPop = ({ isOpenWindow, closeWindow, updateLater, showText, navTo }) => {
  const navigate = useNavigate();

  if (!isOpenWindow) return null;

  const neviateTo = () => {
    navigate(navTo);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="backdrop" onClick={closeWindow}></div>

      {/* Modal */}
      <div className="main">
        <div className="Parent">
          <div className="TopProfile">
            <img className="cross" src={cross} alt="Close" onClick={closeWindow} />
            <h1 className="heading">Complete Your Profile</h1>
            <div className="img1">
              <img src={userLogo} alt="User" />
            </div>
            <h4>{showText}</h4>
            <h5 className="Paragraph">
              Our site prefers to look at profiles that are completed. A complete profile helps us make accurate matches and give you better suggestion.
            </h5>
          </div>
          <hr />
          <div className="BottomProfile">
            <div className="BottomProfileLeft" onClick={updateLater}>
              <h4>I'll do it later</h4>
            </div>
            <div className="BottomProfileRight" onClick={neviateTo}>
              <button>Let's do it!</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPop;