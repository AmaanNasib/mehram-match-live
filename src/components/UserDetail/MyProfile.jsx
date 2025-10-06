import React from "react";
import Header from "../Dashboard/header/Header";
import "./userDetail.css";
import UserSetionOne from "./UserSetionOne";
import UserDetailSecondMyProfile from "./UserDetailSecondMyProfile";
import UserDetailThird from "./UserDetailThird";
import men from "../../images/men1.jpg"

import { useState, useEffect } from "react";
import { deletePhoto as apiDeletePhoto } from "../../services/mmApi";
import { justUpdateDataV2, fetchDataObjectV2, fetchDataWithTokenV2, ReturnResponseFormdataWithoutToken } from "../../apiUtils";
import { useParams } from "react-router-dom";
const UserDetail = () => {
  const { userId } = useParams();
  const [apiData, setApiData] = useState([]);
  const [apiData1, setApiData1] = useState([]);
  const [errors, setErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setMessage] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    first_name: null,
    last_name: null,
    city: null,
    // email: "",
    contact_number: null,
    onbehalf: null,
    caste: null,
    dob: null,
    is_staff: false,
    is_active: false,
    created_at: null,
    updated_at: null,
    gender: null,
    martial_status: null,
    state: null,
    country: null,
    native_country: null,
    native_city: null,
    native_state: null,
    Education: null,
    profession: null,
    cultural_background: null,
    about_you: null,
    disability: null,
    income: null,
    sect_school_info: null,
    islamic_practicing_level: null,
    believe_in_dargah_fatiha_niyah: null,
    hijab_niqab_prefer: null,
    father_name: null,
    father_occupation: null,
    mother_name: null,
    mother_occupation: null,
    wali_name: null,
    wali_contact_number: null,
    wali_blood_relation: null,
    number_of_children: null,
    number_of_son: null,
    number_of_daughter: null,
    number_of_siblings: null,
    number_of_brothers: null,
    number_of_sisters: null,
    family_type: null,
    family_practicing_level: null,
    preferred_surname: null,
    preferred_dargah_fatiha_niyah: null,
    preferred_sect: null,
    desired_practicing_level: null,
    preferred_city_state: null,
    preferred_family_type: null,
    preferred_family_background: null,
    preferred_education: null,
    preferred_occupation_profession: null,
    profile_visible: null,
    photo_upload_privacy_option: null,
    summary: "",
    terms_condition: false,
  });

  useEffect(() => {
    if (userId) {
      const parameter = {
        url: `/api/user/${userId}/`,
        setterFunction: setApiData,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataObjectV2(parameter);
      const parameter1 = {
        url: `/api/user/add_photo/?user_id=${userId}`,
        setterFunction: setApiData1,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataWithTokenV2(parameter1);
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
        // email: apiData.email || "",
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
        believe_in_dargah_fatiha_niyah:
          apiData.believe_in_dargah_fatiha_niyah || null,
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
        preferred_dargah_fatiha_niyah:
          apiData.preferred_dargah_fatiha_niyah || null,
        preferred_sect: apiData.preferred_sect || null,
        desired_practicing_level: apiData.desired_practicing_level || null,
        preferred_city_state: apiData.preferred_city_state || null,
        preferred_family_type: apiData.preferred_family_type || null,
        preferred_family_background:
          apiData.preferred_family_background || null,
        preferred_education: apiData.preferred_education || null,
        preferred_occupation_profession:
          apiData.preferred_occupation_profession || null,
        profile_visible: apiData.profile_visible || null,
        photo_upload_privacy_option:
          apiData.photo_upload_privacy_option || null,
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
   console.log(name,value);
   
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked?'yes':"no" : value
    }));
  };

  const [PersonalEdit, setPersonalEdit] = useState(true);
  const [religiousEdit, setReligiousEdit] = useState(true);
  const [familyEdit, setFamilyEdit] = useState(true);
  const [partnerdit, setPartnerEdit] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [viewingImages, setViewingImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deletingPhoto, setDeletingPhoto] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);

  const updateData = () => {
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
      preferred_family_background:
        formData.preferred_family_background == null
          ? ""
          : formData.preferred_family_background,
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
      setMessage: setMessage,
      setErrors: setErrors,
    };

    justUpdateDataV2(parameters);
    setPartnerEdit(true);
    setFamilyEdit(true);
    setReligiousEdit(true);
    setPersonalEdit(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setMessage(false);
    }, 5000);
  }, [successMessage]);

  // Watermarking removed – upload original files as-is

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('Kuch files invalid hain. Sirf images aur videos allow hain aur maximum size 10MB hai.');
    }
    // Directly use original files (no watermark)
    setSelectedFiles(validFiles);
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      alert('Pehle koi file select kariye');
      return;
    }

    setUploading(true);
    
    // Upload first file using existing pattern
    const firstFile = selectedFiles[0];
    const formData = new FormData();
    formData.append('upload_photo', firstFile);
    formData.append('user_id', userId);

    const parameter = {
      url: '/api/user/add_photo/',
      setUserId: () => {
        // Success callback
        if (selectedFiles.length > 1) {
          // Upload remaining files
          uploadRemainingFiles(1);
        } else {
          // All files uploaded
          alert('Photos successfully upload ho gayi!');
          setSelectedFiles([]);
          setShowUploadModal(false);
          setUploading(false);
          
          // Refresh gallery data
          refreshGallery();
        }
      },
      formData: formData,
      setErrors: (error) => {
        alert('Upload mein koi problem aayi. Please try again.');
        setUploading(false);
      },
      setLoading: setLoading,
    };

    ReturnResponseFormdataWithoutToken(parameter);
  };

  const uploadRemainingFiles = (index) => {
    if (index >= selectedFiles.length) {
      // All files uploaded
      alert('Photos successfully upload ho gayi!');
      setSelectedFiles([]);
      setShowUploadModal(false);
      setUploading(false);
      
      // Refresh gallery data
      refreshGallery();
      return;
    }

    const file = selectedFiles[index];
    const formData = new FormData();
    formData.append('upload_photo', file);
    formData.append('user_id', userId);

    const parameter = {
      url: '/api/user/add_photo/',
      setUserId: () => {
        uploadRemainingFiles(index + 1);
      },
      formData: formData,
      setErrors: (error) => {
        alert('Upload mein koi problem aayi. Please try again.');
        setUploading(false);
      },
      setLoading: setLoading,
    };

    ReturnResponseFormdataWithoutToken(parameter);
  };

  const refreshGallery = () => {
    if (userId) {
      const parameter1 = {
        url: `/api/user/add_photo/?user_id=${userId}`,
        setterFunction: setApiData1,
        setErrors: setErrors,
        setLoading: setLoading,
      };
      fetchDataWithTokenV2(parameter1);
    }
  };

  const handleDeletePhoto = (photoId, photoUrl) => {
    setPhotoToDelete({ id: photoId, url: photoUrl });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!photoToDelete) return;

    setDeletingPhoto(photoToDelete.id);
    setShowDeleteModal(false);
    
    try {
      await apiDeletePhoto(photoToDelete.id);
      refreshGallery();
      setDeletingPhoto(null);
    } catch (error) {
      setDeletingPhoto(null);
    }
    
    setPhotoToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPhotoToDelete(null);
  };

  // Keyboard navigation for lightbox (same as inbox)
  useEffect(() => {
    const handleKeyboard = (e) => {
      if (viewingImages.length === 0) return;
      
      if (e.key === 'Escape') {
        setViewingImages([]);
        setCurrentImageIndex(0);
      } else if (e.key === 'ArrowLeft') {
        setCurrentImageIndex(prev => 
          prev === 0 ? viewingImages.length - 1 : prev - 1
        );
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex(prev => 
          prev === viewingImages.length - 1 ? 0 : prev + 1
        );
      }
    };
    
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [viewingImages, currentImageIndex]);

  const handleMediaClick = (media) => {
    // Get all media URLs for navigation
    const allMediaUrls = apiData1?.map(profile => profile?.upload_photo).filter(Boolean) || [];
    const currentIndex = allMediaUrls.indexOf(media.url);
    
    setViewingImages(allMediaUrls);
    setCurrentImageIndex(currentIndex >= 0 ? currentIndex : 0);
  };
  return (
    <div>
      <Header />
      <div className="section-container">
        <UserSetionOne apiData={apiData} profileOwnerId={userId} />
        <div className="secondSection">
          <div className="extra">
            <UserDetailSecondMyProfile  formData={formData}   apiData={apiData}  updateData={updateData} handleFieldChange={handleFieldChange}/>
            <UserDetailThird />

          </div>
          <div className="gallert">
            <div className="secondDetail5">
              <div className="headingSecond1">
                <h1>📸 Photo/Video Gallery</h1>
                <h3>All Media</h3>
              </div>
              <div className="photo-gallery">
                {
                  apiData1?.map((profile, index) => {
                    const fileUrl = profile?.upload_photo;
                    const isVideo = fileUrl && (
                      fileUrl.toLowerCase().includes('.mp4') ||
                      fileUrl.toLowerCase().includes('.mov') ||
                      fileUrl.toLowerCase().includes('.avi') ||
                      fileUrl.toLowerCase().includes('.webm') ||
                      fileUrl.toLowerCase().includes('.mkv')
                    );
                    
                    return (
                      <div 
                        key={index} 
                        className={`img1 ${isVideo ? 'video-container' : ''} gallery-item`}
                        style={{ position: 'relative' }}
                      >
                        <div
                          onClick={() => handleMediaClick({ url: fileUrl, isVideo, type: isVideo ? 'video' : 'image' })}
                          style={{ cursor: 'pointer' }}
                        >
                          {isVideo ? (
                            <video 
                              src={fileUrl} 
                              alt="video" 
                              controls
                              preload="metadata"
                              className="gallery-media"
                              onPlay={(e) => {
                                e.target.setAttribute('data-playing', 'true');
                              }}
                              onPause={(e) => {
                                e.target.setAttribute('data-playing', 'false');
                              }}
                              onEnded={(e) => {
                                e.target.setAttribute('data-playing', 'false');
                              }}
                            />
                          ) : (
                            <img src={fileUrl} alt="photo" className="gallery-media" />
                          )}
                        </div>
                        
                        {/* Delete Button */}
                        <button
                          className="delete-photo-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePhoto(profile.id, fileUrl);
                          }}
                          disabled={deletingPhoto === profile.id}
                          title="Delete this photo"
                        >
                          {deletingPhoto === profile.id ? '⏳' : '🗑️'}
                        </button>
                      </div>
                    );
                  })
                }
                <div className="img1 add-photo" onClick={() => setShowUploadModal(true)}>
                  <div className="add-photo-content">
                    <span>+</span>
                    <p>Add Media</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="upload-modal-overlay">
          <div className="upload-modal">
            <div className="upload-modal-header">
              <h2>📸 Photo/Video Upload</h2>
              <button 
                className="close-upload-btn"
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFiles([]);
                }}
              >
                ×
              </button>
            </div>
            
            <div className="upload-modal-body">
              <div className="upload-instructions">
                <h3>📋 Upload Instructions:</h3>
                <ul>
                  <li>✅ You can upload photos and videos from here</li>
                  <li>📁 Maximum file size: 10MB per file</li>
                  <li>🎥 Supported formats: Images (JPG, PNG, GIF) and Videos (MP4, MOV)</li>
                  <li>📱 Multiple files select kar sakte hain</li>
                  <li>🏷️ <strong>Photos mein MehramMatch logo watermark automatically add ho jayega</strong></li>
                </ul>
              </div>
              
              <div className="file-upload-area">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  id="file-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-upload" className="file-upload-label">
                  <div className="upload-icon">📁</div>
                  <h4>Select Photos/Videos</h4>
                  <p>Click here to choose files</p>
                </label>
              </div>
              
              {/* Watermark processing removed */}

              {selectedFiles.length > 0 && (
                <div className="selected-files">
                  <h4>Selected Files ({selectedFiles.length}):</h4>
                  <div className="files-list">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="file-item">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        <span className="watermark-indicator">🏷️</span>
                        <button 
                          className="remove-file-btn"
                          onClick={() => {
                            const newFiles = selectedFiles.filter((_, i) => i !== index);
                            setSelectedFiles(newFiles);
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="upload-actions">
                <button 
                  className="upload-btn"
                  onClick={handleUpload}
                  disabled={uploading || selectedFiles.length === 0}
                >
                  {uploading ? '⏳ Uploading...' : '🚀 Upload Files'}
                </button>
                <button 
                  className="cancel-btn"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                  }}
                  disabled={uploading}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <div className="delete-modal-header">
              <h3>🗑️ Delete Photo</h3>
              <button 
                className="delete-modal-close"
                onClick={cancelDelete}
              >
                ×
              </button>
            </div>
            
            <div className="delete-modal-body">
              <div className="delete-warning">
                <div className="warning-icon">⚠️</div>
                <p>Are you sure you want to delete this photo?</p>
                <p className="warning-text">This action cannot be undone.</p>
              </div>
              
              {photoToDelete && (
                <div className="photo-preview">
                  <img 
                    src={photoToDelete.url} 
                    alt="Photo to delete" 
                    className="preview-image"
                  />
                </div>
              )}
            </div>
            
            <div className="delete-modal-actions">
              <button 
                className="cancel-btn"
                onClick={cancelDelete}
              >
                ❌ Cancel
              </button>
              <button 
                className="delete-btn"
                onClick={confirmDelete}
              >
                🗑️ Delete Photo
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Image Gallery Lightbox Modal - Same as Inbox */}
      {viewingImages.length > 0 && (
        <div className="inbox-image-lightbox" onClick={() => {
          setViewingImages([]);
          setCurrentImageIndex(0);
        }}>
          <div className="inbox-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="inbox-lightbox-close"
              onClick={() => {
                setViewingImages([]);
                setCurrentImageIndex(0);
              }}
            >
              ✕
            </button>
            
            {/* Navigation Arrows */}
            {viewingImages.length > 1 && (
              <>
                <button 
                  className="inbox-lightbox-prev"
                  onClick={() => setCurrentImageIndex(prev => 
                    prev === 0 ? viewingImages.length - 1 : prev - 1
                  )}
                >
                  ‹
                </button>
                <button 
                  className="inbox-lightbox-next"
                  onClick={() => setCurrentImageIndex(prev => 
                    prev === viewingImages.length - 1 ? 0 : prev + 1
                  )}
                >
                  ›
                </button>
              </>
            )}
            
            {(() => {
              const currentMedia = viewingImages[currentImageIndex];
              const isVideo = currentMedia && (
                currentMedia.toLowerCase().includes('.mp4') ||
                currentMedia.toLowerCase().includes('.mov') ||
                currentMedia.toLowerCase().includes('.avi') ||
                currentMedia.toLowerCase().includes('.webm') ||
                currentMedia.toLowerCase().includes('.mkv')
              );
              
              return isVideo ? (
                <video 
                  src={currentMedia} 
                  controls
                  autoPlay
                  className="inbox-lightbox-image" 
                />
              ) : (
                <img 
                  src={currentMedia} 
                  alt={`Media ${currentImageIndex + 1}`} 
                  className="inbox-lightbox-image" 
                />
              );
            })()}
            
            {/* Image Counter */}
            {viewingImages.length > 1 && (
              <div className="inbox-lightbox-counter">
                {currentImageIndex + 1} / {viewingImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;