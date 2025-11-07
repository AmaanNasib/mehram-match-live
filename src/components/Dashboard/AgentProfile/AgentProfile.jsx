import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../UserDashboard/DashboardLayout';
import './AgentProfile.css';

const AgentProfile = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [agentData, setAgentData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [agentProfilePhoto, setAgentProfilePhoto] = useState({});
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Form data for editing
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    contact_number: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pin_code: '',
    town: '',
    profession: '',
    education_level: '',
    expierience_in_business: '',
    full_time_marraige_agent: '',
    marraige_fixed_in_pass: '',
    gender: ''
  });

  useEffect(() => {
    fetchAgentData();
    fetchAgentPhoto();
  }, [agentId]);

  const fetchAgentData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/agent/${agentId}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAgentData(data);
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          contact_number: data.contact_number || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          country: data.country || '',
          pin_code: data.pin_code || '',
          town: data.town || '',
          profession: data.profession || '',
          education_level: data.education_level || '',
          expierience_in_business: data.expierience_in_business || '',
          full_time_marraige_agent: data.full_time_marraige_agent || '',
          marraige_fixed_in_pass: data.marraige_fixed_in_pass || '',
          gender: data.gender || ''
        });
      } else {
        setError('Failed to fetch agent data');
      }
    } catch (err) {
      setError('Error fetching agent data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentPhoto = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/agent/profile_photo/?agent_id=${agentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const currentAgentPhoto = data.find(photo => photo.agent?.id == agentId);
          if (currentAgentPhoto) {
            setAgentProfilePhoto(currentAgentPhoto);
          }
        } else if (data && typeof data === 'object' && !Array.isArray(data)) {
          setAgentProfilePhoto(data);
        }
      }
    } catch (err) {
      console.error('Error fetching agent photo:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/agent/${agentId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedData = await response.json();
        setAgentData(updatedData);
        setEditing(false);
        alert('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to update profile: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert('Error updating profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: agentData.first_name || '',
      last_name: agentData.last_name || '',
      contact_number: agentData.contact_number || '',
      address: agentData.address || '',
      city: agentData.city || '',
      state: agentData.state || '',
      country: agentData.country || '',
      pin_code: agentData.pin_code || '',
      town: agentData.town || '',
      profession: agentData.profession || '',
      education_level: agentData.education_level || '',
      expierience_in_business: agentData.expierience_in_business || '',
      full_time_marraige_agent: agentData.full_time_marraige_agent || '',
      marraige_fixed_in_pass: agentData.marraige_fixed_in_pass || '',
      gender: agentData.gender || ''
    });
    setEditing(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    try {
      setUploadingPhoto(true);
      
      // If there's an existing photo, update it, otherwise create new
      if (agentProfilePhoto?.id) {
        // Update existing photo
        const formData = new FormData();
        formData.append('upload_photo', selectedFile);
        formData.append('agent_id', agentId);

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/agent/profile_photo/${agentProfilePhoto.id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          setAgentProfilePhoto(data);
          setSelectedFile(null);
          
          // Reset file input
          const fileInput = document.getElementById('photo-upload');
          if (fileInput) {
            fileInput.value = '';
          }
          
          alert('Profile photo updated successfully!');
        } else {
          const errorData = await response.json();
          alert(`Failed to update photo: ${errorData.error || 'Unknown error'}`);
        }
      } else {
        // Create new photo
        const formData = new FormData();
        formData.append('upload_photo', selectedFile);
        formData.append('agent_id', agentId);

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/agent/profile_photo/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          setAgentProfilePhoto(data);
          setSelectedFile(null);
          
          // Reset file input
          const fileInput = document.getElementById('photo-upload');
          if (fileInput) {
            fileInput.value = '';
          }
          
          alert('Profile photo uploaded successfully!');
        } else {
          const errorData = await response.json();
          alert(`Failed to upload photo: ${errorData.error || 'Unknown error'}`);
        }
      }
    } catch (err) {
      console.error('Error uploading photo:', err);
      alert('Error uploading photo: ' + err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoCancel = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById('photo-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handlePhotoDelete = async () => {
    if (!agentProfilePhoto?.id) {
      alert('No photo to delete');
      return;
    }

    if (!window.confirm('Are you sure you want to delete your profile photo?')) {
      return;
    }

    try {
      setUploadingPhoto(true);
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/agent/profile_photo/${agentProfilePhoto.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (response.ok) {
        setAgentProfilePhoto({});
        alert('Profile photo deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete photo: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
      alert('Error deleting photo: ' + err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const getProfileImageUrl = () => {
    // First try agent profile photo from API
    if (agentProfilePhoto?.upload_photo) {
      let photoUrl = agentProfilePhoto.upload_photo;
      
      // Fix HTTP to HTTPS for production URLs
      if (photoUrl.startsWith('http://api.mehrammatch.com')) {
        photoUrl = photoUrl.replace('http://apii.mehrammatch.com', 'https://apii.mehrammatch.com');
      }
      
      return photoUrl.startsWith('http') 
        ? photoUrl 
        : `${process.env.REACT_APP_API_URL}${photoUrl}`;
    }
    
    // Fallback to agent data profile photo
    if (agentData?.profile_photo) {
      let photoUrl = agentData.profile_photo;
      
      // Fix HTTP to HTTPS for production URLs
      if (photoUrl.startsWith('http://api.mehrammatch.com')) {
        photoUrl = photoUrl.replace('http://apii.mehrammatch.com', 'https://apii.mehrammatch.com');
      }
      
      return photoUrl.startsWith('http') 
        ? photoUrl 
        : `${process.env.REACT_APP_API_URL}${photoUrl}`;
    }
    
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjYwIiBmaWxsPSIjRjEyNTdGIi8+CjxzdmcgeD0iMzAiIHk9IjMwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMiAxMkMxNC43NjE0IDEyIDE3IDkuNzYxNDIgMTcgN0MxNyA0LjIzODU4IDE0Ljc2MTQgMiAxMiAyQzkuMjM4NTggMiA3IDQuMjM4NTggNyA3QzcgOS43NjE0MiA5LjIzODU4IDEyIDEyIDEyWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEyIDE0QzcuNTgxNzIgMTQgNCAxNy41ODE3IDQgMjJIMTJDMTYuNDE4MyAxNCAxMiAxNCAxMiAxNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="agent-profile-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="agent-profile-container">
          <div className="error-message">{error}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="agent-profile-container">
        <div className="agent-profile-header">
          <div className="profile-header-content">
            <div className="profile-photo-section">
              <img
                src={getProfileImageUrl()}
                alt="Agent Profile"
                className="profile-photo"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjYwIiBmaWxsPSIjRjEyNTdGIi8+CjxzdmcgeD0iMzAiIHk9IjMwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMiAxMkMxNC43NjE0IDEyIDE3IDkuNzYxNDIgMTcgN0MxNyA0LjIzODU4IDE0Ljc2MTQgMiAxMiAyQzkuMjM4NTggMiA3IDQuMjM4NTggNyA3QzcgOS43NjE0MiA5LjIzODU4IDEyIDEyIDEyWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEyIDE0QzcuNTgxNzIgMTQgNCAxNy41ODE3IDQgMjJIMTJDMTYuNDE4MyAxNCAxMiAxNCAxMiAxNFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo8L3N2Zz4K";
                }}
              />
              <div className="profile-photo-overlay">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <div className="photo-dropdown">
                  <button className="photo-menu-trigger">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/>
                    </svg>
                  </button>
                  <div className="photo-dropdown-menu">
                    <button 
                      className="photo-dropdown-item"
                      onClick={() => document.getElementById('photo-upload').click()}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                      Change Photo
                    </button>
                    {agentProfilePhoto?.id && (
                      <button 
                        className="photo-dropdown-item delete-item"
                        onClick={handlePhotoDelete}
                        disabled={uploadingPhoto}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                        Delete Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="profile-info-section">
              <div className="profile-name-section">
                <h1 className="profile-name">
                  {agentData.first_name} {agentData.last_name}
                </h1>
                <span className="profile-role">Agent</span>
              </div>
              
              <div className="profile-actions">
                {!editing ? (
                  <button 
                    className="edit-profile-btn"
                    onClick={() => setEditing(true)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <div className="edit-actions">
                    <button 
                      className="save-btn"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button 
                      className="cancel-btn"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Photo Upload Section */}
        {selectedFile && (
          <div className="photo-upload-section">
            <div className="photo-upload-preview">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="photo-preview"
              />
              <div className="photo-upload-info">
                <h3>Preview New Photo</h3>
                <p>File: {selectedFile.name}</p>
                <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <div className="photo-upload-actions">
              <button
                className="upload-btn"
                onClick={handlePhotoUpload}
                disabled={uploadingPhoto}
              >
                {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
              </button>
              <button
                className="cancel-upload-btn"
                onClick={handlePhotoCancel}
                disabled={uploadingPhoto}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="agent-profile-content">
          <div className="profile-sections">
            {/* Basic Information */}
            <div className="profile-section">
              <h2 className="section-title">Basic Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  {editing ? (
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-display">{agentData.first_name || 'Not provided'}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Last Name</label>
                  {editing ? (
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-display">{agentData.last_name || 'Not provided'}</div>
                  )}
                </div>
                
                
                <div className="form-group">
                  <label>Contact Number</label>
                  {editing ? (
                    <input
                      type="tel"
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-display">{agentData.contact_number || 'Not provided'}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Gender</label>
                  {editing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  ) : (
                    <div className="form-display">{agentData.gender || 'Not provided'}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="profile-section">
              <h2 className="section-title">Professional Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Profession</label>
                  {editing ? (
                    <select
                      name="profession"
                      value={formData.profession}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Select Profession</option>
                      <option value="1">Business</option>
                      <option value="2">Service</option>
                      <option value="3">Other</option>
                    </select>
                  ) : (
                    <div className="form-display">
                      {agentData.profession === '1' ? 'Business' : 
                       agentData.profession === '2' ? 'Service' : 
                       agentData.profession === '3' ? 'Other' : 
                       'Not provided'}
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Education Level</label>
                  {editing ? (
                    <select
                      name="education_level"
                      value={formData.education_level}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Select Education Level</option>
                      <option value="0">High School</option>
                      <option value="1">Bachelor's</option>
                      <option value="2">Master's</option>
                      <option value="3">PhD</option>
                    </select>
                  ) : (
                    <div className="form-display">
                      {agentData.education_level === '0' ? 'High School' : 
                       agentData.education_level === '1' ? 'Bachelor\'s' : 
                       agentData.education_level === '2' ? 'Master\'s' : 
                       agentData.education_level === '3' ? 'PhD' : 
                       'Not provided'}
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Experience in Business (Years)</label>
                  {editing ? (
                    <input
                      type="number"
                      name="expierience_in_business"
                      value={formData.expierience_in_business}
                      onChange={handleInputChange}
                      className="form-input"
                      min="0"
                    />
                  ) : (
                    <div className="form-display">{agentData.expierience_in_business ? `${agentData.expierience_in_business} years` : 'Not provided'}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Full Time Marriage Agent</label>
                  {editing ? (
                    <select
                      name="full_time_marraige_agent"
                      value={formData.full_time_marraige_agent}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Select Option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  ) : (
                    <div className="form-display">{agentData.full_time_marraige_agent || 'Not provided'}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Marriages Fixed in Past</label>
                  {editing ? (
                    <input
                      type="number"
                      name="marraige_fixed_in_pass"
                      value={formData.marraige_fixed_in_pass}
                      onChange={handleInputChange}
                      className="form-input"
                      min="0"
                    />
                  ) : (
                    <div className="form-display">{agentData.marraige_fixed_in_pass || 'Not provided'}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="profile-section">
              <h2 className="section-title">Address Information</h2>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Address</label>
                  {editing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="form-textarea"
                      rows="3"
                      placeholder="Enter your full address..."
                    />
                  ) : (
                    <div className="form-display">{agentData.address || 'Not provided'}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>City</label>
                  {editing ? (
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter city"
                    />
                  ) : (
                    <div className="form-display">{agentData.city || 'Not provided'}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>State</label>
                  {editing ? (
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter state"
                    />
                  ) : (
                    <div className="form-display">{agentData.state || 'Not provided'}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Country</label>
                  {editing ? (
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter country"
                    />
                  ) : (
                    <div className="form-display">{agentData.country || 'Not provided'}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Town</label>
                  {editing ? (
                    <input
                      type="text"
                      name="town"
                      value={formData.town}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter town"
                    />
                  ) : (
                    <div className="form-display">{agentData.town || 'Not provided'}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Pin Code</label>
                  {editing ? (
                    <input
                      type="text"
                      name="pin_code"
                      value={formData.pin_code}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter pin code"
                    />
                  ) : (
                    <div className="form-display">{agentData.pin_code || 'Not provided'}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AgentProfile;
