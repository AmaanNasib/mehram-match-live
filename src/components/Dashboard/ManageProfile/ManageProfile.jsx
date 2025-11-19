import React, { useState } from "react";
import "./ManageProfile.css"; // Import CSS file
import DashboardLayout from "../UserDashboard/DashboardLayout";


const ManageProfile = () => {
    const [image, setImage] = useState(null);

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImage(URL.createObjectURL(file));
      }
    };

  return (
    <DashboardLayout>

   
<div className="profile-form-container">
      <h2>Manage Your Profile</h2>
      <div className="profile-photo">
        <label htmlFor="upload-photo" className="!w-[100%] !h-[100%]">
          {image ? (
            <img src={image} alt="Profile" className="uploaded-image" />
          ) : (
            <span className="text-center">Upload Photo</span>
          )}
        </label>
        <input
          type="file"
          id="upload-photo"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
      </div>

      <form className="profile-form">
  <div className="form-row">
    <div className="form-group">
      <label htmlFor="first-name">First Name</label>
      <input type="text" id="first-name" placeholder="Enter your first name" />
    </div>

    <div className="form-group">
      <label htmlFor="last-name">Last Name</label>
      <input type="text" id="last-name" placeholder="Enter your last name" />
    </div>
  </div>

  <div className="form-row">
    <div className="form-group">
      <label htmlFor="email">Your Email</label>
      <input type="email" id="email" placeholder="Enter your email" />
    </div>

    <div className="form-group">
      <label htmlFor="phone">Phone Number</label>
      <input type="text" id="phone" placeholder="Enter your phone number" />
    </div>
  </div>

  <div className="form-row">
    <div className="form-group">
      <label htmlFor="birthdate">Date of Birth</label>
      <input type="date" id="birthdate" />
    </div>

    <div className="form-group">
      <label htmlFor="gender">Gender</label>
      <select id="gender">
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>
  </div>

  <button type="submit" className="submit-btn">
    Add Now
  </button>
</form>

    </div>
    </DashboardLayout>

  );
};

export default ManageProfile;
