import React, { useState, useEffect } from "react";
import "./sectionSecond.css";
import basicImg from "../../images/Kaaba.svg";
import handShake from "../../images/Handshake.svg";
import gene from "../../images/Genealogy.svg";

const UserDetailSecond = ({ apiData }) => {
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({});

  // Function to format multiple options with comma separation (only for Partner Expectations)
  const formatMultipleOptions = (value) => {
    if (!value || value === "NA") return "NA";
    
    // If it's already an array, join with commas
    if (Array.isArray(value)) {
      return value.filter(item => item && item.trim()).join(", ");
    }
    
    // If it's a string, try to split and format
    if (typeof value === 'string') {
      let formattedValue = value;
      
      // Handle specific patterns for different types of concatenated data
      
      // 1. Pattern for names like "Al-HaqqAl-HakimAl-Khalifa"
      if (/[A-Z][a-z]+[A-Z][a-z]+/.test(formattedValue)) {
        formattedValue = formattedValue.replace(/([a-z])([A-Z])/g, '$1, $2');
      }
      
      // 2. Pattern for locations like "vijayawadavisakhapatnamdibrugarhmumbaipune"
      else if (/^[a-z]+[A-Z][a-z]+/.test(formattedValue)) {
        formattedValue = formattedValue.replace(/([a-z])([A-Z])/g, '$1, $2');
      }
      
      // 3. Pattern for religious levels like "religiousModerately ReligiousOccasionally Religious"
      else if (/[a-z]+[A-Z][a-z]+/.test(formattedValue)) {
        formattedValue = formattedValue.replace(/([a-z])([A-Z])/g, '$1, $2');
      }
      
      // 4. Pattern for family types like "Nuclear FamilyJoint FamilyExtended Family"
      else if (/Family[A-Z]/.test(formattedValue)) {
        formattedValue = formattedValue.replace(/(Family)([A-Z])/g, '$1, $2');
      }
      
      // 5. Pattern for sects like "bohrabarelviahmadiAhle Qur'anmuslim"
      else if (/[a-z]+[A-Z]/.test(formattedValue)) {
        formattedValue = formattedValue.replace(/([a-z])([A-Z])/g, '$1, $2');
      }
      
      // 6. Handle Dargah/Fatiha/Niyah patterns specifically
      if (formattedValue.includes('Yes (Only Fatiha)Yes (Only Dargah)')) {
        formattedValue = formattedValue.replace(/Yes \(Only Fatiha\)Yes \(Only Dargah\)/g, 'Yes (Only Fatiha), Yes (Only Dargah)');
      }
      
      // 7. Handle specific Dargah/Fatiha/Niyah values
      if (formattedValue === 'No (No Dargah, No Fatiha, No Niyaz)') {
        return formattedValue; // Return as is for this specific case
      }
      
      // Clean up any double commas or trailing commas
      formattedValue = formattedValue
        .replace(/,\s*,/g, ',')
        .replace(/,\s*$/, '')
        .trim();
      
      return formattedValue;
    }
    
    return value;
  };

  useEffect(() => {
    if (apiData) {
      setFormData(apiData);
      setTimeout(() => setLoading(false), 2000); // Simulate loading time
    }
  }, [apiData]);

  const handleEditClick = (section) => {
    setActiveModal(section);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the updated data to your API
    console.log("Updated data:", formData);
    handleCloseModal();
  };

   // Modal components for each section
  const renderModal = () => {
    if (!activeModal) return null;

    const commonModalStyles = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      zIndex: 1000,
      width: '80%',
      maxWidth: '600px',
      maxHeight: '80vh',
      overflowY: 'auto'
    };

    const overlayStyles = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      zIndex: 999
    };

    const closeButtonStyles = {
      position: 'absolute',
      top: '10px',
      right: '10px',
      cursor: 'pointer',
      fontSize: '20px',
      fontWeight: 'bold'
    };

    const renderField = (label, name, type = 'text') => (
      <div className="modal-field" style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
          {label}
        </label>
        {type === 'textarea' ? (
          <textarea
            name={name}
            value={formData[name] || ''}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            rows="4"
          />
        ) : type === 'checkbox' ? (
          <input
            type="checkbox"
            name={name}
            checked={formData[name] || false}
            onChange={handleInputChange}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={formData[name] || ''}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        )}
      </div>
    );

    const modalContent = {
      basic: (
        <div style={commonModalStyles}>
          <span style={closeButtonStyles} onClick={handleCloseModal}>&times;</span>
          <h2 style={{ marginTop: '0', color: 'palevioletred' }}>Edit Basic Details</h2>
          <form onSubmit={handleSubmit}>
            {renderField('Skin Tone', 'skin_tone')}
            {renderField('Native City', 'native_city')}
            {renderField('Native State', 'native_state')}
            {renderField('Native Country', 'native_country')}
            {renderField('Annual Income Range', 'income')}
            {renderField('Disability', 'disability', 'checkbox')}
            {renderField('Job/Business Description', 'describe_job_business', 'textarea')}
            <button type="submit" style={{ 
              backgroundColor: 'palevioletred', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '5px', 
              cursor: 'pointer',
              marginTop: '15px'
            }}>
              Save Changes
            </button>
          </form>
        </div>
      ),
      religious: (
        <div style={commonModalStyles}>
          <span style={closeButtonStyles} onClick={handleCloseModal}>&times;</span>
          <h2 style={{ marginTop: '0', color: 'palevioletred' }}>Edit Religious Information</h2>
          <form onSubmit={handleSubmit}>
            {renderField('Sect/School of Thought', 'sect_school_info')}
            {renderField('Islam Practicing Level', 'islamic_practicing_level')}
            {renderField('Belief in Dargah/Fatiha/Niyah?', 'believe_in_dargah_fatiha_niyah', 'checkbox')}
            <button type="submit" style={{ 
              backgroundColor: 'palevioletred', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '5px', 
              cursor: 'pointer',
              marginTop: '15px'
            }}>
              Save Changes
            </button>
          </form>
        </div>
      ),
      family: (
        <div style={commonModalStyles}>
          <span style={closeButtonStyles} onClick={handleCloseModal}>&times;</span>
          <h2 style={{ marginTop: '0', color: 'palevioletred' }}>Edit Family Background</h2>
          <form onSubmit={handleSubmit}>
            {renderField('Father\'s Name', 'father_name')}
            {renderField('Father\'s Occupation', 'father_occupation')}
            {renderField('Mother\'s Name', 'mother_name')}
            {renderField('Mother\'s Occupation', 'mother_occupation')}
            {renderField('Number of Siblings', 'number_of_siblings', 'number')}
            {renderField('Family Type', 'family_type')}
            {renderField('Family Practicing Level', 'family_practicing_level')}
            <button type="submit" style={{ 
              backgroundColor: 'palevioletred', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '5px', 
              cursor: 'pointer',
              marginTop: '15px'
            }}>
              Save Changes
            </button>
          </form>
        </div>
      ),
      partner: (
        <div style={commonModalStyles}>
          <span style={closeButtonStyles} onClick={handleCloseModal}>&times;</span>
          <h2 style={{ marginTop: '0', color: 'palevioletred' }}>Edit Partner Expectations</h2>
          <form onSubmit={handleSubmit}>
            {renderField('Preferred Surname', 'preferred_surname')}
            {renderField('Preferred Sect/School', 'preferred_sect')}
            {renderField('Desired Practicing Level', 'desired_practicing_level')}
            {renderField('Believes in Dargah/Fatiha/Niyah?', 'preferred_dargah_fatiha_niyah')}
            {renderField('Preferred City', 'preferred_city')}
            {renderField('Preferred Family Type', 'preferred_family_type')}
            <button type="submit" style={{ 
              backgroundColor: 'palevioletred', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '5px', 
              cursor: 'pointer',
              marginTop: '15px'
            }}>
              Save Changes
            </button>
          </form>
        </div>
      )
    };

    return (
      <>
        <div style={overlayStyles} onClick={handleCloseModal} />
        {modalContent[activeModal]}
      </>
    );
  };

  return (
    <div className="sectionSecond">
      {loading ? (
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
        <>
          <div className="secondDetail1">
            <div className="headingSecond" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={basicImg} alt="" />
              <h1 style={{ margin: 0, paddingRight: '30px' }}>Some Basic Details</h1>
              
            </div>
            <div className="basic">
              <div className="basicleft">
                <h5>Skin Tone</h5>
              </div>
              <div className="basicRight">
                <h5>{apiData?.skin_tone || "NA"}</h5>
              </div>
            </div>
            <div className="basic">
              <div className="basicleft">
                <h5>Native Address</h5>
              </div>
              <div className="basicRight">
                <h5>
                  {apiData?.native_city || "NA"}, {apiData?.native_state || "NA"}, {apiData?.native_country || "NA"}
                </h5>
              </div>
            </div>
            <div className="basic">
              <div className="basicleft">
                <h5>Annual Income Range:</h5>
              </div>
              <div className="basicRight">
                <h5>{apiData?.income || "NA"}</h5>
              </div>
            </div>
            <div className="basic">
              <div className="basicleft">
                <h5>Disability?</h5>
              </div>
              <div className="basicRight">
                <h5>{apiData?.disability || "NA"}</h5>
              </div>
            </div>
            <div className="basic">
              <div className="basicleft">
                <h5>Job/Business Description</h5>
              </div>
              <div className="basicRight">
                <p>{apiData?.describe_job_business || "NA"}</p>
              </div>
            </div>
          </div>

          <div className="secondDetail2">
            <div className="headingSecond" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={basicImg} alt="" />
              <h1>Religious Information</h1>
              
            </div>
            <div className="basic">
              <div className="basicleft">
                <h5>Sect/School of Thought:</h5>
              </div>
              <div className="basicRight">
                <h5>{apiData?.sect_school_info || "NA"}</h5>
              </div>
            </div>
            <div className="basic">
              <div className="basicleft">
                <h5>Islam Practicing Level:</h5>
              </div>
              <div className="basicRight">
                <h5>{apiData?.islamic_practicing_level || "NA"}</h5>
              </div>
            </div>
            <div className="basic">
              <div className="basicleft">
                <h5>Belief in Dargah/Fatiha/Niyah?</h5>
              </div>
              <div className="basicRight">
                <h5>{apiData?.believe_in_dargah_fatiha_niyah || "NA"}</h5>
              </div>
            </div>
          </div>

          <div className="secondDetail3">
            <div className="headingSecond" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={gene} alt="" />
              <h1>Family Background</h1>
              
            </div>
            <div className="basic">
              <div className="basicleft">
                <h5>Father’s Name:</h5>
              </div>
              <div className="basicRight">
                <h5>{apiData?.father_name || "NA"}</h5>
              </div>
            </div>
            <div className="basic">
              <div className="basicleft">
                <h5>Father’s Occupation:</h5>
              </div>
              <div className="basicRight">
                <h5>{apiData?.father_occupation || "NA"}</h5>
              </div>
            </div>
            <div className="basic">
              <div className="basicleft">
                <h5>Mother’s Name:</h5>
              </div>
              <div className="basicRight">
                <h5>{apiData?.mother_name || "NA"}</h5>
              </div>
            </div>
            <div className="basic">
              <div className="basicleft">
                <h5>Mother’s Occupation:</h5>
              </div>
              <div className="basicRight">
                <h5>{apiData?.mother_occupation || "NA"}</h5>
              </div>
            </div>
            <div className="basic">
              <div className="basicleft">
                <h5>Number of Siblings:</h5>
              </div>
              <div className="basicRight">
                <h5>{apiData?.number_of_siblings || "NA"}</h5>
              </div>
            </div>
            <div className="basic">
              <div className="basicleft">
                <h5>Family Type:</h5>
              </div>
              <div className="basicRight">
                <h5>{apiData?.family_type || "NA"}</h5>
              </div>
            </div>
            <div className="basic">
              <div className="basicleft">
                <h5>Family Practicing Level:</h5>
              </div>
              <div className="basicRight">
                <h5>{apiData?.family_practicing_level || "NA"}</h5>
              </div>
            </div>
          </div>

          <div className="secondDetail4">
            <div className="headingSecond" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={gene} alt="" />
              <h1>Partner Expectations</h1>
             
            </div>
            <div className="basic">
              <div className="basicleft">
                <h5>Preferred Surname:</h5>
              </div>
              <div className="basicRight">
                <h5>{formatMultipleOptions(apiData?.preferred_surname)}</h5>
              </div>
            </div>
            <div className="basic">
              <div className="basicleft">
                <h5>Preferred Sect/School:</h5>
              </div>
              <div className="basicRight">
                <h5>{formatMultipleOptions(apiData?.preferred_sect)}</h5>
              </div>
            </div>
            <div className="basic">
              <div className="basicleft">
                <h5>Desired Practicing Level:</h5>
              </div>
              <div className="basicRight">
                <h5>{formatMultipleOptions(apiData?.desired_practicing_level)}</h5>
              </div>
            </div>
            <div className="basic">
              <div className="basicleft">
                <h5>Believes in Dargah/Fatiha/Niyah?:</h5>
              </div>
              <div className="basicRight">
                <h5>{formatMultipleOptions(apiData?.preferred_dargah_fatiha_niyah)}</h5>
              </div>
            </div>
            <div className="basic">
              <div className="basicleft">
                <h5>Preferred Location:</h5>
              </div>
              <div className="basicRight">
                <h5>{formatMultipleOptions(apiData?.preferred_city)}</h5>
              </div>
            </div>
            <div className="basic">
              <div className="basicleft">
                <h5>Preferred Family Type:</h5>
              </div>
              <div className="basicRight">
                <h5>{formatMultipleOptions(apiData?.preferred_family_type)}</h5>
              </div>
            </div>
          </div>
          {renderModal()}
        </>
      )}
    </div>
  );
};

export default UserDetailSecond;





















// import React, { useState, useEffect } from "react";
// import "./sectionSecond.css";
// import basicImg from "../../images/Kaaba.svg";
// import handShake from "../../images/Handshake.svg";
// import gene from "../../images/Genealogy.svg";

// const UserDetailSecond = ({ apiData }) => {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (apiData) {
//       setTimeout(() => setLoading(false), 2000); // Simulate loading time
//     }
//   }, [apiData]);

//   return (
//     <div className="sectionSecond">
//       {loading ? (
//         <div className="shimmer-container">
//           {[...Array(4)].map((_, index) => (
//             <div key={index} className="secondDetail shimmer">
//               <div className="headingSecond">
//                 <div className="shimmer shimmer-img"></div>
//                 <h1 className="shimmer shimmer-text shimmer-title"></h1>
//               </div>
//               {[...Array(6)].map((_, i) => (
//                 <div key={i} className="basic">
//                   <div className="basicleft">
//                     <h5 className="shimmer shimmer-text shimmer-info"></h5>
//                   </div>
//                   <div className="basicRight">
//                     <h5 className="shimmer shimmer-text shimmer-info"></h5>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       ) : (
//         <>
//           <div className="secondDetail1">
//             <div className="headingSecond" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
//               <img src={basicImg} alt="" />
//               <h1 style={{ margin: 0, paddingRight: '30px' }}>Some Basic Details</h1>
//               <svg
//                 className="editIcon"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 width="20"
//                 height="20"
//                 style={{
//                   position: 'absolute',
//                   right: '0',
//                   cursor: 'pointer',
//                   transition: 'all 0.3s ease',
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = 'scale(1.1)';
//                   e.currentTarget.style.fill = '#4a90e2';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = 'scale(1)';
//                   e.currentTarget.style.fill = '';
//                 }}
//               >
//                 <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
//               </svg>
//             </div>
//             <div className="basic">
//               <div className="basicleft">
//                 <h5>Skin Tone</h5>
//               </div>
//               <div className="basicRight">
//                 <h5>{apiData?.skin_tone || "NA"}</h5>
//               </div>
//             </div>
//             <div className="basic">
//               <div className="basicleft">
//                 <h5>Native Address</h5>
//               </div>
//               <div className="basicRight">
//                 <h5>
//                   {apiData?.native_city || "NA"}, {apiData?.native_state || "NA"}, {apiData?.native_country || "NA"}
//                 </h5>
//               </div>
//             </div>
//             <div className="basic">
//               <div className="basicleft">
//                 <h5>Annual Income Range:</h5>
//               </div>
//               <div className="basicRight">
//                 <h5>{apiData?.income || "NA"}</h5>
//               </div>
//             </div>
//             <div className="basic">
//               <div className="basicleft">
//                 <h5>Disability?</h5>
//               </div>
//               <div className="basicRight">
//                 <h5>
//                   <span className="secondLable">{apiData?.disability ? "Yes" : "No"}</span>
//                 </h5>
//               </div>
//             </div>
//             <div className="basic">
//               <div className="basicleft">
//                 <h5>Job/Business Description</h5>
//               </div>
//               <div className="basicRight">
//                 <p>{apiData?.describe_job_business || "NA"}</p>
//               </div>
//             </div>
//           </div>

//           <div className="secondDetail2">
//             <div className="headingSecond" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
//               <img src={basicImg} alt="" />
//               <h1>Religious Information</h1>
//               <svg
//                 className="editIcon"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 width="20"
//                 height="20"
//                 style={{
//                   position: 'absolute',
//                   right: '0',
//                   cursor: 'pointer',
//                   transition: 'all 0.3s ease',
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = 'scale(1.1)';
//                   e.currentTarget.style.fill = '#4a90e2';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = 'scale(1)';
//                   e.currentTarget.style.fill = '';
//                 }}
//               >
//                 <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
//               </svg>
//             </div>
//             <div className="basic">
//               <div className="basicleft">
//                 <h5>Sect/School of Thought:</h5>
//               </div>
//               <div className="basicRight">
//                 <h5>{apiData?.sect_school_info || "NA"}</h5>
//               </div>
//             </div>
//             <div className="basic">
//               <div className="basicleft">
//                 <h5>Islam Practicing Level:</h5>
//               </div>
//               <div className="basicRight">
//                 <h5>{apiData?.islamic_practicing_level || "NA"}</h5>
//               </div>
//             </div>
//             <div className="basic">
//               <div className="basicleft">
//                 <h5>Belief in Dargah/Fatiha/Niyah?</h5>
//               </div>
//               <div className="basicRight">
//                 <h5>
//                   <span className="secondLable">{apiData?.believe_in_dargah_fatiha_niyah ? "Yes" : "No"}</span>
//                 </h5>
//               </div>
//             </div>
//           </div>

//           <div className="secondDetail3">
//             <div className="headingSecond" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
//               <img src={gene} alt="" />
//               <h1>Family Background</h1>
//               <svg
//                 className="editIcon"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 width="20"
//                 height="20"
//                 style={{
//                   position: 'absolute',
//                   right: '0',
//                   cursor: 'pointer',
//                   transition: 'all 0.3s ease',
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = 'scale(1.1)';
//                   e.currentTarget.style.fill = '#4a90e2';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = 'scale(1)';
//                   e.currentTarget.style.fill = '';
//                 }}
//               >
//                 <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
//               </svg>
//             </div>
//             <div className="basic">
//               <div className="basicleft">
//                 <h5>Father’s Name:</h5>
//               </div>
//               <div className="basicRight">
//                 <h5>{apiData?.father_name || "NA"}</h5>
//               </div>
//             </div>
//             <div className="basic">
//               <div className="basicleft">
//                 <h5>Father’s Occupation:</h5>
//               </div>
//               <div className="basicRight">
//                 <h5>{apiData?.father_occupation || "NA"}</h5>
//               </div>
//             </div>
//             <div className="basic">
//               <div className="basicleft">
//                 <h5>Mother’s Name:</h5>
//               </div>
//               <div className="basicRight">
//                 <h5>{apiData?.mother_name || "NA"}</h5>
//               </div>
//             </div>
//             <div className="basic">
//               <div className="basicleft">
//                 <h5>Mother’s Occupation:</h5>
//               </div>
//               <div className="basicRight">
//                 <h5>{apiData?.mother_occupation || "NA"}</h5>
//               </div>
//             </div>
//             <div className="basic">
//               <div className="basicleft">
//                 <h5>Number of Siblings:</h5>
//               </div>
//               <div className="basicRight">
//                 <h5>{apiData?.number_of_siblings || "NA"}</h5>
//               </div>
//             </div>
//             <div className="basic">
//               <div className="basicleft">
//                 <h5>Family Type:</h5>
//               </div>
//               <div className="basicRight">
//                 <h5>{apiData?.family_type || "NA"}</h5>
//               </div>
//             </div>
//             <div className="basic">
//               <div className="basicleft">
//                 <h5>Family Practicing Level:</h5>
//               </div>
//               <div className="basicRight">
//                 <h5>{apiData?.family_practicing_level || "NA"}</h5>
//               </div>
//             </div>
//           </div>

//           <div className="secondDetail4">
//             <div className="headingSecond" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px' }}>
//               <img src={gene} alt="" />
//               <h1>Partner Expectations</h1>
//               <svg
//                 className="editIcon"
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 width="20"
//                 height="20"
//                 style={{
//                   position: 'absolute',
//                   right: '0',
//                   cursor: 'pointer',
//                   transition: 'all 0.3s ease',
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = 'scale(1.1)';
//                   e.currentTarget.style.fill = '#4a90e2';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = 'scale(1)';
//                   e.currentTarget.style.fill = '';
//                 }}
//               >
//                 <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
//               </svg>
//             </div>
//             <div className="basic">
//               <div className="basicleft">
//                 <h5>Preferred Surname:</h5>
//               </div>
//               <div className="basicRight">
//                 <h5>{apiData?.preferred_surname || "NA"}</h5>
//               </div>
//             </div>
//             <div className="basic">
//               <div className="basicleft">
//                 <h5>Preferred Sect/School:</h5>
//               </div>
//               <div className="basicRight">
//                 <h5>{apiData?.preferred_sect || "NA"}</h5>
//               </div>
//             </div>
//             <div className="basic">
//               <div className="basicleft">
//                 <h5>Desired Practicing Level:</h5>
//               </div>
//               <div className="basicRight">
//                 <h5>{apiData?.desired_practicing_level || "NA"}</h5>
//               </div>
//             </div>
//             <div className="basic">
//               <div className="basicleft">
//                 <h5>Believes in Dargah/Fatiha/Niyah?:</h5>
//               </div>
//               <div className="basicRight">
//                 <h5>{apiData?.preferred_dargah_fatiha_niyah || "NA"}</h5>
//               </div>
//             </div>
//             <div className="basic">
//               <div className="basicleft">
//                 <h5>Preferred Location:</h5>
//               </div>
//               <div className="basicRight">
//                 <h5>{apiData?.preferred_city || "NA"}</h5>
//               </div>
//             </div>
//             <div className="basic">
//               <div className="basicleft">
//                 <h5>Preferred Family Type:</h5>
//               </div>
//               <div className="basicRight">
//                 <h5>{apiData?.preferred_family_type || "NA"}</h5>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default UserDetailSecond;

