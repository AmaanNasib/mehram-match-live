import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDataObjectV2, justUpdateDataV2 } from "../../apiUtils";
import Header from "../Dashboard/header/Header";
import "./userDetail.css";

const EditProfile = () => {
  const { section, userId } = useParams();
  const navigate = useNavigate();
  const [apiData, setApiData] = useState({});
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    if (userId) {
      const parameter = {
        url: `/api/user/${userId}/`,
        setterFunction: setApiData,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataObjectV2(parameter);
    }
  }, [userId]);

  useEffect(() => {
    if (apiData) {
      setFormData({
        id: apiData.id || null,
        name: apiData.name || "",
        first_name: apiData.first_name || null,
        last_name: apiData.last_name || null,
        city: apiData.city || null,
        contact_number: apiData.contact_number || null,
        onbehalf: apiData.onbehalf || null,
        caste: apiData.caste || null,
        dob: apiData.dob || null,
        is_staff: apiData.is_staff || false,
        is_active: apiData.is_active || false,
        created_at: apiData.created_at || null,
        updated_at: apiData.updated_at || null,
        gender: apiData.gender || null,
        martial_status: apiData.martial_status || null,
        state: apiData.state || null,
        country: apiData.country || null,
        native_country: apiData.native_country || null,
        native_city: apiData.native_city || null,
        native_state: apiData.native_state || null,
        Education: apiData.Education || null,
        profession: apiData.profession || null,
        cultural_background: apiData.cultural_background || null,
        about_you: apiData.about_you || null,
        disability: apiData.disability || null,
        income: apiData.income || null,
        sect_school_info: apiData.sect_school_info || null,
        islamic_practicing_level: apiData.islamic_practicing_level || null,
        believe_in_dargah_fatiha_niyah: apiData.believe_in_dargah_fatiha_niyah || null,
        hijab_niqab_prefer: apiData.hijab_niqab_prefer || null,
        father_name: apiData.father_name || null,
        father_occupation: apiData.father_occupation || null,
        mother_name: apiData.mother_name || null,
        mother_occupation: apiData.mother_occupation || null,
        wali_name: apiData.wali_name || null,
        wali_contact_number: apiData.wali_contact_number || null,
        wali_blood_relation: apiData.wali_blood_relation || null,
        number_of_children: apiData.number_of_children || null,
        number_of_son: apiData.number_of_son || null,
        number_of_daughter: apiData.number_of_daughter || null,
        number_of_siblings: apiData.number_of_siblings || null,
        number_of_brothers: apiData.number_of_brothers || null,
        number_of_sisters: apiData.number_of_sisters || null,
        family_type: apiData.family_type || null,
        family_practicing_level: apiData.family_practicing_level || null,
        preferred_surname: apiData.preferred_surname || null,
        preferred_dargah_fatiha_niyah: apiData.preferred_dargah_fatiha_niyah || null,
        preferred_sect: apiData.preferred_sect || null,
        desired_practicing_level: apiData.desired_practicing_level || null,
        preferred_city_state: apiData.preferred_city_state || null,
        preferred_family_type: apiData.preferred_family_type || null,
        preferred_family_background: apiData.preferred_family_background || null,
        preferred_education: apiData.preferred_education || null,
        preferred_occupation_profession: apiData.preferred_occupation_profession || null,
        profile_visible: apiData.profile_visible || null,
        photo_upload_privacy_option: apiData.photo_upload_privacy_option || null,
        summary: apiData.summary || "",
        terms_condition: apiData.terms_condition || false,
        skin_tone: apiData.skin_tone || '',
        describe_job_business: apiData.describe_job_business || '',
        preferred_city: apiData.preferred_city || ''
      });
    }
  }, [apiData]);

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked ? 'yes' : "no" : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const toArray = (value) => {
      if (value == null) return [];
      if (Array.isArray(value)) return value.filter((v) => v != null && v !== "");
      return [value];
    };

    const normalizedPayload = {
      ...formData,
      preferred_city: toArray(formData.preferred_city),
      preferred_state: toArray(formData.preferred_state),
      preferred_country: toArray(formData.preferred_country),
      preferred_family_background: formData.preferred_family_background == null ? "" : formData.preferred_family_background,
    };

    const parameters = {
      url: `/api/user/${formData.id}`,
      payload: normalizedPayload,
      tofetch: {
        items: [
          {
            fetchurl: `/api/user/${formData.id}/`,
            setterFunction: setApiData,
            setErrors: setErrors,
          },
        ],
      },
      setMessage: setSuccessMessage,
      setErrors: setErrors,
    };

    justUpdateDataV2(parameters);
  };

  const handleBack = () => {
    navigate(`/myprofile/${userId}`);
  };

  const renderField = (label, name, type = 'text', required = false) => (
    <div className="form-field" style={{ marginBottom: '20px' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '8px', 
        fontWeight: '600',
        color: '#333',
        fontSize: '14px'
      }}>
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={formData[name] || ''}
          onChange={handleFieldChange}
          style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: '8px', 
            border: '2px solid #e1e5e9',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'vertical',
            minHeight: '100px'
          }}
          rows="4"
        />
      ) : type === 'checkbox' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            name={name}
            checked={formData[name] === 'yes'}
            onChange={handleFieldChange}
            style={{ transform: 'scale(1.2)' }}
          />
          <span style={{ fontSize: '14px', color: '#666' }}>
            {formData[name] === 'yes' ? 'Yes' : 'No'}
          </span>
        </div>
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name] || ''}
          onChange={handleFieldChange}
          style={{ 
            width: '100%', 
            padding: '12px', 
            borderRadius: '8px', 
            border: '2px solid #e1e5e9',
            fontSize: '14px',
            fontFamily: 'inherit'
          }}
        />
      )}
    </div>
  );

  const getSectionTitle = () => {
    switch (section) {
      case 'basic': return 'Edit Basic Information';
      case 'religious': return 'Edit Religious Information';
      case 'family': return 'Edit Family Background';
      case 'partner': return 'Edit Partner Expectations';
      default: return 'Edit Profile';
    }
  };

  const getSectionIcon = () => {
    switch (section) {
      case 'basic': return '👤';
      case 'religious': return '🕌';
      case 'family': return '👨‍👩‍👧‍👦';
      case 'partner': return '💕';
      default: return '✏️';
    }
  };

  const renderFormFields = () => {
    switch (section) {
      case 'basic':
        return (
          <>
            {renderField('Skin Tone', 'skin_tone')}
            {renderField('Native City', 'native_city')}
            {renderField('Native State', 'native_state')}
            {renderField('Native Country', 'native_country')}
            {renderField('Annual Income Range', 'income')}
            {renderField('Disability', 'disability', 'checkbox')}
            {renderField('Job/Business Description', 'describe_job_business', 'textarea')}
          </>
        );
      case 'religious':
        return (
          <>
            {renderField('Sect/School of Thought', 'sect_school_info')}
            {renderField('Islam Practicing Level', 'islamic_practicing_level')}
            {renderField('Belief in Dargah/Fatiha/Niyah?', 'believe_in_dargah_fatiha_niyah', 'checkbox')}
          </>
        );
      case 'family':
        return (
          <>
            {renderField("Father's Name", 'father_name')}
            {renderField("Father's Occupation", 'father_occupation')}
            {renderField("Mother's Name", 'mother_name')}
            {renderField("Mother's Occupation", 'mother_occupation')}
            {renderField('Number of Siblings', 'number_of_siblings', 'number')}
            {renderField('Family Type', 'family_type')}
            {renderField('Family Practicing Level', 'family_practicing_level')}
          </>
        );
      case 'partner':
        return (
          <>
            {renderField('Preferred Surname', 'preferred_surname')}
            {renderField('Preferred Sect/School', 'preferred_sect')}
            {renderField('Desired Practicing Level', 'desired_practicing_level')}
            {renderField('Believes in Dargah/Fatiha/Niyah?', 'preferred_dargah_fatiha_niyah')}
            {renderField('Preferred City', 'preferred_city')}
            {renderField('Preferred Family Type', 'preferred_family_type')}
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          fontSize: '18px',
          color: '#666'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={{ 
        maxWidth: '800px', 
        margin: '20px auto', 
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '2px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>{getSectionIcon()}</span>
            <h1 style={{ 
              margin: 0, 
              color: '#ec4899',
              fontSize: '24px',
              fontWeight: '600'
            }}>
              {getSectionTitle()}
            </h1>
          </div>
          <button
            onClick={handleBack}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ← Back to Profile
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div style={{
            backgroundColor: '#d1fae5',
            color: '#065f46',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #a7f3d0'
          }}>
            ✅ Profile updated successfully!
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '30px' }}>
            {renderFormFields()}
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'flex-end',
            paddingTop: '20px',
            borderTop: '2px solid #f0f0f0'
          }}>
            <button
              type="button"
              onClick={handleBack}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                backgroundColor: '#ec4899',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
