import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  fetchDataV2,
  justUpdateDataV2,
  fetchDataWithTokenV2,
} from "../../apiUtils";
import UserPop from "../sections/UserPop";
import ProfileDetailsModal from "./ProfileDetailsModal";
import "./MobileDashboard.css";
import "./ProfileDetailsModal.css";

// Shimmer Loading for Profile Cards - Exact Flutter Homepage Style
const ShimmerProfileCard = () => (
  <div className="mobile-shimmer-card">
    <div className="mobile-shimmer-image"></div>
    <div className="mobile-shimmer-content">
      <div className="mobile-shimmer-header">
        <div className="mobile-shimmer-name"></div>
        <div className="mobile-shimmer-icon"></div>
      </div>
      <div className="mobile-shimmer-details">
        <div className="mobile-shimmer-line mobile-shimmer-line-1"></div>
        <div className="mobile-shimmer-line mobile-shimmer-line-2"></div>
        <div className="mobile-shimmer-line mobile-shimmer-line-3"></div>
      </div>
      <div className="mobile-shimmer-actions">
        <div className="mobile-shimmer-button"></div>
        <div className="mobile-shimmer-circle"></div>
      </div>
    </div>
  </div>
);

// Profile Completion Card - Exact Homepage.dart Style with Bottom Sheet
const ProfileCompletionCard = ({ profilePercentage, userName, userPhoto, userGender, userData }) => {
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "#10B981"; // Green
    if (percentage >= 75) return "#F59E0B"; // Amber
    if (percentage >= 50) return "#F97316"; // Orange
    return "#EF4444"; // Red
  };

  const getStatusText = (percentage) => {
    if (percentage >= 90) return "Excellent!";
    if (percentage >= 75) return "Almost Complete";
    if (percentage >= 50) return "Good Progress";
    return "Needs Attention";
  };

  const getMotivationText = (percentage) => {
    if (percentage >= 90) return "Ready to find perfect match!";
    if (percentage >= 75) return "Few more details to complete.";
    if (percentage >= 50) return "Continue for better matches.";
    return "Complete for better matches.";
  };

  // Get Step 2 completion details (Religious Details) - Real DB Check with Marital Status Logic
  const getStep2CompletionDetails = (userData) => {
    if (!userData) {
      return {
        totalFields: 8,
        completedFields: 0,
        missingFields: [
          "Sect/School", "Islamic Practice Level", "Spiritual Beliefs", "Hijab/Niqab Preference",
          "Beard Preference", "Namaz Performance", "Quran Recitation", "Religious Commitment"
        ],
        completedFieldsList: []
      };
    }

    const gender = userData.gender?.toString().toLowerCase() || '';
    const maritalStatus = userData.martial_status?.toString().toLowerCase() || '';
    
    // Define MANDATORY fields for Step 2 (Religious Details) - Required for 100% completion
    const mandatoryFields = [
      { key: 'sect_school_info', label: 'Sect/School', isMandatory: true },
      { key: 'islamic_practicing_level', label: 'Islamic Practice Level', isMandatory: true },
      { key: 'believe_in_dargah_fatiha_niyah', label: 'Spiritual Beliefs', isMandatory: true }
    ];

    // Define OPTIONAL fields for Step 2 (Religious Details) - Enhance profile but not required
    const optionalFields = [
      { key: 'perform_namaz', label: 'Namaz Performance', isMandatory: false },
      { key: 'recite_quran', label: 'Quran Recitation', isMandatory: false },
      { key: 'marriage_plan', label: 'Religious Commitment', isMandatory: false }
    ];

    // Gender-specific fields
    if (gender === 'female') {
      optionalFields.push({ key: 'hijab_niqab_prefer', label: 'Hijab/Niqab Preference', isMandatory: false });
    } else {
      // For males, we can use smoking status as beard preference indicator
      optionalFields.push({ key: 'smoking_cigarette_sheesha', label: 'Beard Preference', isMandatory: false });
    }

    // Combine all fields
    const requiredFields = [...mandatoryFields, ...optionalFields];

    // Marital status specific logic for Step 2
    if (maritalStatus === 'divorced' || maritalStatus === 'widowed') {
      // For divorced/widowed users, religious commitment becomes more important
      // They might be more serious about religious compatibility
    } else if (maritalStatus === 'single') {
      // For single users, all religious fields are equally important
    } else if (maritalStatus === 'married') {
      // Married users shouldn't be on matrimonial platform
    }

    const completedFields = [];
    const missingFields = [];

    requiredFields.forEach(field => {
      const value = userData[field.key];
      const isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      
      if (isCompleted) {
        completedFields.push(field.label);
      } else {
        missingFields.push(field.label);
      }
    });

    // Calculate mandatory and optional completion
    const mandatoryCompleted = mandatoryFields.filter(field => {
      const value = userData[field.key];
      const isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      return isCompleted;
    });

    const optionalCompleted = optionalFields.filter(field => {
      const value = userData[field.key];
      const isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      return isCompleted;
    });

    const mandatoryMissing = mandatoryFields.filter(field => {
      const value = userData[field.key];
      const isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      return !isCompleted;
    }).map(field => field.label);

    const optionalMissing = optionalFields.filter(field => {
      const value = userData[field.key];
      const isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      return !isCompleted;
    }).map(field => field.label);

    return {
      totalFields: requiredFields.length,
      completedFields: completedFields.length,
      missingFields: missingFields,
      completedFieldsList: completedFields,
      mandatoryTotal: mandatoryFields.length,
      mandatoryCompleted: mandatoryCompleted.length,
      mandatoryMissing: mandatoryMissing,
      optionalTotal: optionalFields.length,
      optionalCompleted: optionalCompleted.length,
      optionalMissing: optionalMissing
    };
  };

  // Get Step 3 completion details (Family Information) - Real DB Check with Marital Status Logic
  const getStep3CompletionDetails = (userData) => {
    if (!userData) {
      return {
        totalFields: 15,
        completedFields: 0,
        missingFields: [
          "Father Name", "Father Occupation", "Mother Name", "Mother Occupation", "Family Type",
          "Family Practice Level", "Number of Siblings", "Wali Name", "Wali Contact", "Wali Relation",
          "Number of Brothers", "Number of Sisters", "Number of Children", "Number of Sons", "Number of Daughters"
        ],
        completedFieldsList: []
      };
    }

    const gender = userData.gender?.toString().toLowerCase() || '';
    const maritalStatus = userData.martial_status?.toString().toLowerCase() || '';
    
    // Define MANDATORY fields for Step 3 (Family Information) - Required for 100% completion
    const mandatoryFields = [
      { key: 'father_name', label: 'Father Name', isMandatory: true },
      { key: 'mother_name', label: 'Mother Name', isMandatory: true },
      { key: 'family_type', label: 'Family Type', isMandatory: true }
    ];

    // Define OPTIONAL fields for Step 3 (Family Information) - Enhance profile but not required
    const optionalFields = [
      { key: 'father_occupation', label: 'Father Occupation', isMandatory: false },
      { key: 'mother_occupation', label: 'Mother Occupation', isMandatory: false },
      { key: 'family_practicing_level', label: 'Family Practice Level', isMandatory: false },
      { key: 'number_of_siblings', label: 'Number of Siblings', isMandatory: false },
      { key: 'number_of_brothers', label: 'Number of Brothers', isMandatory: false },
      { key: 'number_of_sisters', label: 'Number of Sisters', isMandatory: false }
    ];

    // Gender-specific fields for females
    if (gender === 'female') {
      optionalFields.push(
        { key: 'wali_name', label: 'Wali Name', isMandatory: false },
        { key: 'wali_contact_number', label: 'Wali Contact', isMandatory: false },
        { key: 'wali_blood_relation', label: 'Wali Relation', isMandatory: false }
      );
    }

    // Marital status specific fields for divorced/widowed/khula users
    if (maritalStatus === 'divorced' || maritalStatus === 'widowed' || maritalStatus === 'khula') {
      optionalFields.push(
        { key: 'number_of_children', label: 'Number of Children', isMandatory: false },
        { key: 'number_of_son', label: 'Number of Sons', isMandatory: false },
        { key: 'number_of_daughter', label: 'Number of Daughters', isMandatory: false }
      );
    }

    // Combine all fields
    const requiredFields = [...mandatoryFields, ...optionalFields];

    // Marital status specific logic for Step 3
    if (maritalStatus === 'divorced' || maritalStatus === 'widowed' || maritalStatus === 'khula') {
      // For divorced/widowed/khula users, family support becomes more important
      // Father/Mother status might be more critical
      // Family practicing level becomes more significant
      // Children information is crucial for future partner matching
    } else if (maritalStatus === 'single') {
      // For single users, family background is important for matching
      // All family fields are equally important
      // No children fields required
    } else if (maritalStatus === 'married') {
      // Married users shouldn't be on matrimonial platform
    }

    const completedFields = [];
    const missingFields = [];

    requiredFields.forEach(field => {
      const value = userData[field.key];
      let isCompleted = false;
      
      // Special handling for number fields - 0 is a valid completed value
      if (field.key.includes('number_of_') || field.key === 'age') {
        isCompleted = value !== null && value !== undefined && value !== '';
      } else {
        isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      }
      
      if (isCompleted) {
        completedFields.push(field.label);
      } else {
        missingFields.push(field.label);
      }
    });

    // Calculate mandatory and optional completion
    const mandatoryCompleted = mandatoryFields.filter(field => {
      const value = userData[field.key];
      let isCompleted = false;
      
      // Special handling for number fields - 0 is a valid completed value
      if (field.key.includes('number_of_') || field.key === 'age') {
        isCompleted = value !== null && value !== undefined && value !== '';
      } else {
        isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      }
      
      return isCompleted;
    });

    const optionalCompleted = optionalFields.filter(field => {
      const value = userData[field.key];
      let isCompleted = false;
      
      // Special handling for number fields - 0 is a valid completed value
      if (field.key.includes('number_of_') || field.key === 'age') {
        isCompleted = value !== null && value !== undefined && value !== '';
      } else {
        isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      }
      
      return isCompleted;
    });

    const mandatoryMissing = mandatoryFields.filter(field => {
      const value = userData[field.key];
      let isCompleted = false;
      
      // Special handling for number fields - 0 is a valid completed value
      if (field.key.includes('number_of_') || field.key === 'age') {
        isCompleted = value !== null && value !== undefined && value !== '';
      } else {
        isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      }
      
      return !isCompleted;
    }).map(field => field.label);

    const optionalMissing = optionalFields.filter(field => {
      const value = userData[field.key];
      let isCompleted = false;
      
      // Special handling for number fields - 0 is a valid completed value
      if (field.key.includes('number_of_') || field.key === 'age') {
        isCompleted = value !== null && value !== undefined && value !== '';
      } else {
        isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      }
      
      return !isCompleted;
    }).map(field => field.label);

    return {
      totalFields: requiredFields.length,
      completedFields: completedFields.length,
      missingFields: missingFields,
      completedFieldsList: completedFields,
      mandatoryTotal: mandatoryFields.length,
      mandatoryCompleted: mandatoryCompleted.length,
      mandatoryMissing: mandatoryMissing,
      optionalTotal: optionalFields.length,
      optionalCompleted: optionalCompleted.length,
      optionalMissing: optionalMissing
    };
  };

  // Get Step 4 completion details (Partner Preferences) - Real DB Check with Marital Status Logic
  const getStep4CompletionDetails = (userData) => {
    if (!userData) {
      return {
        totalFields: 12,
        completedFields: 0,
        missingFields: [
          "Preferred Surname", "Preferred Sect", "Spiritual Beliefs", "Desired Practice Level", 
          "Preferred Family Type", "Preferred Family Background", "Preferred Education", 
          "Preferred Occupation", "Preferred Country", "Preferred State", "Preferred City", "Preferred City State"
        ],
        completedFieldsList: []
      };
    }

    const maritalStatus = userData.martial_status?.toString().toLowerCase() || '';
    
    // Define MANDATORY fields for Step 4 (Partner Preferences) - Required for 100% completion
    const mandatoryFields = [
      { key: 'preferred_sect', label: 'Preferred Sect', isMandatory: true },
      { key: 'preferred_dargah_fatiha_niyah', label: 'Spiritual Beliefs', isMandatory: true },
      { key: 'desired_practicing_level', label: 'Desired Practice Level', isMandatory: true }
    ];

    // Define OPTIONAL fields for Step 4 (Partner Preferences) - Enhance profile but not required
    const optionalFields = [
      { key: 'preferred_surname', label: 'Preferred Surname', isMandatory: false },
      { key: 'preferred_family_type', label: 'Preferred Family Type', isMandatory: false },
      { key: 'preferred_family_background', label: 'Preferred Family Background', isMandatory: false },
      { key: 'preferred_education', label: 'Preferred Education', isMandatory: false },
      { key: 'preferred_occupation_profession', label: 'Preferred Occupation', isMandatory: false },
      { key: 'preferred_country', label: 'Preferred Country', isMandatory: false },
      { key: 'preferred_state', label: 'Preferred State', isMandatory: false },
      { key: 'preferred_city', label: 'Preferred City', isMandatory: false },
      { key: 'preferred_city_state', label: 'Preferred City State', isMandatory: false }
    ];

    // Combine all fields
    const requiredFields = [...mandatoryFields, ...optionalFields];

    // Marital status specific logic for Step 4
    if (maritalStatus === 'divorced' || maritalStatus === 'widowed' || maritalStatus === 'khula') {
      // For divorced/widowed/khula users, partner preferences become more specific
      // They might be more particular about family type and background
      // Location preferences might be more flexible
      // They might prefer partners who are understanding about their situation
    } else if (maritalStatus === 'single') {
      // For single users, all partner preferences are important
      // They might be more flexible with some preferences
    } else if (maritalStatus === 'married') {
      // Married users shouldn't be on matrimonial platform
    }

    const completedFields = [];
    const missingFields = [];

    requiredFields.forEach(field => {
      const value = userData[field.key];
      let isCompleted = false;
      
      // Special handling for array fields
      if (field.key === 'preferred_dargah_fatiha_niyah') {
        isCompleted = value && (
          (Array.isArray(value) && value.length > 0) ||
          (typeof value === 'string' && value.trim() !== '')
        );
      } else {
        isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      }
      
      if (isCompleted) {
        completedFields.push(field.label);
      } else {
        missingFields.push(field.label);
      }
    });

    // Calculate mandatory and optional completion
    const mandatoryCompleted = mandatoryFields.filter(field => {
      const value = userData[field.key];
      let isCompleted = false;
      
      // Special handling for array fields
      if (field.key === 'preferred_dargah_fatiha_niyah') {
        isCompleted = value && (
          (Array.isArray(value) && value.length > 0) ||
          (typeof value === 'string' && value.trim() !== '')
        );
      } else {
        isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      }
      
      return isCompleted;
    });

    const optionalCompleted = optionalFields.filter(field => {
      const value = userData[field.key];
      let isCompleted = false;
      
      // Special handling for array fields
      if (field.key === 'preferred_dargah_fatiha_niyah') {
        isCompleted = value && (
          (Array.isArray(value) && value.length > 0) ||
          (typeof value === 'string' && value.trim() !== '')
        );
      } else {
        isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      }
      
      return isCompleted;
    });

    const mandatoryMissing = mandatoryFields.filter(field => {
      const value = userData[field.key];
      let isCompleted = false;
      
      // Special handling for array fields
      if (field.key === 'preferred_dargah_fatiha_niyah') {
        isCompleted = value && (
          (Array.isArray(value) && value.length > 0) ||
          (typeof value === 'string' && value.trim() !== '')
        );
      } else {
        isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      }
      
      return !isCompleted;
    }).map(field => field.label);

    const optionalMissing = optionalFields.filter(field => {
      const value = userData[field.key];
      let isCompleted = false;
      
      // Special handling for array fields
      if (field.key === 'preferred_dargah_fatiha_niyah') {
        isCompleted = value && (
          (Array.isArray(value) && value.length > 0) ||
          (typeof value === 'string' && value.trim() !== '')
        );
      } else {
        isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      }
      
      return !isCompleted;
    }).map(field => field.label);

    return {
      totalFields: requiredFields.length,
      completedFields: completedFields.length,
      missingFields: missingFields,
      completedFieldsList: completedFields,
      mandatoryTotal: mandatoryFields.length,
      mandatoryCompleted: mandatoryCompleted.length,
      mandatoryMissing: mandatoryMissing,
      optionalTotal: optionalFields.length,
      optionalCompleted: optionalCompleted.length,
      optionalMissing: optionalMissing
    };
  };

  // Get Step 5 completion details (Photo & Profile Privacy) - Real DB Check with Marital Status Logic
  const getStep5CompletionDetails = (userData) => {
    if (!userData) {
      return {
        totalFields: 2,
        completedFields: 0,
        missingFields: [
          "Profile Photo", "Profile Visibility"
        ],
        completedFieldsList: []
      };
    }

    const gender = userData.gender?.toString().toLowerCase() || '';
    const maritalStatus = userData.martial_status?.toString().toLowerCase() || '';
    
    // Define MANDATORY fields for Step 5 (Photo & Profile Privacy) - Required for 100% completion
    const mandatoryFields = [
      { key: 'upload_photo', label: 'Profile Photo', isMandatory: true }
    ];

    // Define OPTIONAL fields for Step 5 (Photo & Profile Privacy) - Enhance profile but not required
    const optionalFields = [
      { key: 'profile_visible', label: 'Profile Visibility', isMandatory: false }
    ];

    // Gender-specific fields for females
    if (gender === 'female') {
      optionalFields.push({ key: 'photo_upload_privacy_option', label: 'Photo Privacy Option', isMandatory: false });
    }

    // Combine all fields
    const requiredFields = [...mandatoryFields, ...optionalFields];

    // Marital status specific logic for Step 5
    if (maritalStatus === 'divorced' || maritalStatus === 'widowed' || maritalStatus === 'khula') {
      // For divorced/widowed/khula users, profile visibility might be more important
      // They might want to be more selective about who can see their profile
      // Privacy becomes more critical for their situation
    } else if (maritalStatus === 'single') {
      // For single users, profile photo and visibility are both important
    } else if (maritalStatus === 'married') {
      // Married users shouldn't be on matrimonial platform
    }

    const completedFields = [];
    const missingFields = [];

    requiredFields.forEach(field => {
      const value = userData[field.key];
      const isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      
      if (isCompleted) {
        completedFields.push(field.label);
      } else {
        missingFields.push(field.label);
      }
    });

    // Calculate mandatory and optional completion
    const mandatoryCompleted = mandatoryFields.filter(field => {
      const value = userData[field.key];
      const isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      return isCompleted;
    });

    const optionalCompleted = optionalFields.filter(field => {
      const value = userData[field.key];
      const isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      return isCompleted;
    });

    const mandatoryMissing = mandatoryFields.filter(field => {
      const value = userData[field.key];
      const isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      return !isCompleted;
    }).map(field => field.label);

    const optionalMissing = optionalFields.filter(field => {
      const value = userData[field.key];
      const isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      return !isCompleted;
    }).map(field => field.label);

    return {
      totalFields: requiredFields.length,
      completedFields: completedFields.length,
      missingFields: missingFields,
      completedFieldsList: completedFields,
      mandatoryTotal: mandatoryFields.length,
      mandatoryCompleted: mandatoryCompleted.length,
      mandatoryMissing: mandatoryMissing,
      optionalTotal: optionalFields.length,
      optionalCompleted: optionalCompleted.length,
      optionalMissing: optionalMissing
    };
  };

  // Get step completion status based on percentage (homepage.dart logic)
  const getStepCompletionStatus = (percentage, userData) => {
    // Get real Step 1, Step 2, Step 3, Step 4, and Step 5 completion details from user data
    const step1Details = getStep1CompletionDetails(userData);
    const step2Details = getStep2CompletionDetails(userData);
    const step3Details = getStep3CompletionDetails(userData);
    const step4Details = getStep4CompletionDetails(userData);
    const step5Details = getStep5CompletionDetails(userData);
    
    if (percentage >= 90) {
      return [
        { step: 1, title: "Basic Details", completed: true, color: "#10B981", details: step1Details },
        { step: 2, title: "Religious Details", completed: true, color: "#10B981", details: step2Details },
        { step: 3, title: "Family Background", completed: true, color: "#10B981", details: step3Details },
        { step: 4, title: "Partner Preferences", completed: true, color: "#10B981", details: step4Details },
        { step: 5, title: "Photo & Profile Privacy", completed: true, color: "#10B981", details: step5Details }
      ];
    } else if (percentage >= 75) {
      return [
        { step: 1, title: "Basic Details", completed: true, color: "#10B981", details: step1Details },
        { step: 2, title: "Religious Details", completed: true, color: "#10B981", details: step2Details },
        { step: 3, title: "Family Background", completed: true, color: "#10B981", details: step3Details },
        { step: 4, title: "Partner Preferences", completed: false, color: "#F59E0B", details: step4Details },
        { step: 5, title: "Photo & Profile Privacy", completed: false, color: "#F59E0B", details: step5Details }
      ];
    } else if (percentage >= 50) {
      return [
        { step: 1, title: "Basic Details", completed: true, color: "#10B981", details: step1Details },
        { step: 2, title: "Religious Details", completed: true, color: "#10B981", details: step2Details },
        { step: 3, title: "Family Background", completed: false, color: "#F97316", details: step3Details },
        { step: 4, title: "Partner Preferences", completed: false, color: "#F97316", details: step4Details },
        { step: 5, title: "Photo & Profile Privacy", completed: false, color: "#F97316", details: step5Details }
      ];
    } else {
      return [
        { step: 1, title: "Basic Details", completed: false, color: "#EF4444", details: step1Details },
        { step: 2, title: "Religious Details", completed: false, color: "#EF4444", details: step2Details },
        { step: 3, title: "Family Background", completed: false, color: "#EF4444", details: step3Details },
        { step: 4, title: "Partner Preferences", completed: false, color: "#EF4444", details: step4Details },
        { step: 5, title: "Photo & Profile Privacy", completed: false, color: "#EF4444", details: step5Details }
      ];
    }
  };

  // Get Step 1 completion details (Basic Information) - Real DB Check with Marital Status Logic
  const getStep1CompletionDetails = (userData) => {
    if (!userData) {
      return {
        totalFields: 30,
        completedFields: 0,
        missingFields: [
          "First Name", "Last Name", "Age", "Gender", "Marital Status", 
          "Height", "Weight", "Education", "Profession", "Current City", "Current State", "Current Country",
          "Native City", "Native State", "Native Country", "Annual Income Range", "Disability Status",
          "About You", "Cultural Background", "Skin Tone", "Body Type", "Financial Status",
          "Father Status", "Mother Status", "Namaz Performance", "Quran Recitation", "Marriage Plan",
          "Smoking Status", "Drinking Status"
        ],
        completedFieldsList: []
      };
    }

    const gender = userData.gender?.toString().toLowerCase() || '';
    const maritalStatus = userData.martial_status?.toString().toLowerCase() || '';
    
    // Define MANDATORY fields for Step 1 (Basic Information) - Required for 100% completion
    const mandatoryFields = [
      { key: 'first_name', label: 'First Name', isMandatory: true },
      { key: 'last_name', label: 'Last Name', isMandatory: true },
      { key: 'age', label: 'Age', isMandatory: true },
      { key: 'gender', label: 'Gender', isMandatory: true },
      { key: 'martial_status', label: 'Marital Status', isMandatory: true },
      { key: 'hieght', label: 'Height', isMandatory: true },
      { key: 'Education', label: 'Education', isMandatory: true },
      { key: 'profession', label: 'Profession', isMandatory: true }
    ];

    // Define OPTIONAL fields for Step 1 (Basic Information) - Enhance profile but not required
    const optionalFields = [
      { key: 'weight', label: 'Weight', isMandatory: false },
      { key: 'city', label: 'Current City', isMandatory: false },
      { key: 'state', label: 'Current State', isMandatory: false },
      { key: 'country', label: 'Current Country', isMandatory: false },
      { key: 'native_city', label: 'Native City', isMandatory: false },
      { key: 'native_state', label: 'Native State', isMandatory: false },
      { key: 'native_country', label: 'Native Country', isMandatory: false },
      { key: 'income', label: 'Annual Income Range', isMandatory: false },
      { key: 'disability', label: 'Disability Status', isMandatory: false },
      { key: 'about_you', label: 'About You', isMandatory: false },
      { key: 'cultural_background', label: 'Cultural Background', isMandatory: false },
      { key: 'skin_tone', label: 'Skin Tone', isMandatory: false },
      { key: 'body_type', label: 'Body Type', isMandatory: false },
      { key: 'financial_status', label: 'Financial Status', isMandatory: false },
      { key: 'father_alive', label: 'Father Status', isMandatory: false },
      { key: 'mother_alive', label: 'Mother Status', isMandatory: false },
      { key: 'perform_namaz', label: 'Namaz Performance', isMandatory: false },
      { key: 'recite_quran', label: 'Quran Recitation', isMandatory: false },
      { key: 'marriage_plan', label: 'Marriage Plan', isMandatory: false },
      { key: 'smoking_cigarette_sheesha', label: 'Smoking Status', isMandatory: false },
      { key: 'drinking_alcohol_wine', label: 'Drinking Status', isMandatory: false }
    ];

    // Combine all fields
    const requiredFields = [...mandatoryFields, ...optionalFields];

    // Marital status specific logic for Step 1
    if (maritalStatus === 'divorced' || maritalStatus === 'widowed') {
      // For divorced/widowed users, marriage plan might be more important
      // Income and financial status become more critical
    } else if (maritalStatus === 'single') {
      // For single users, marriage plan is crucial
      // Age becomes more important for matching
    } else if (maritalStatus === 'married') {
      // Married users shouldn't be on matrimonial platform
      // But if they are, different validation might be needed
    }

    const completedFields = [];
    const missingFields = [];

    requiredFields.forEach(field => {
      const value = userData[field.key];
      let isCompleted = false;
      
      // Special handling for number fields - 0 is a valid completed value
      if (field.key.includes('number_of_') || field.key === 'age') {
        isCompleted = value !== null && value !== undefined && value !== '';
      } else {
        isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      }
      
      if (isCompleted) {
        completedFields.push(field.label);
      } else {
        missingFields.push(field.label);
      }
    });

    // Calculate mandatory and optional completion
    const mandatoryCompleted = mandatoryFields.filter(field => {
      const value = userData[field.key];
      let isCompleted = false;
      
      // Special handling for number fields - 0 is a valid completed value
      if (field.key.includes('number_of_') || field.key === 'age') {
        isCompleted = value !== null && value !== undefined && value !== '';
      } else {
        isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      }
      
      return isCompleted;
    });

    const optionalCompleted = optionalFields.filter(field => {
      const value = userData[field.key];
      let isCompleted = false;
      
      // Special handling for number fields - 0 is a valid completed value
      if (field.key.includes('number_of_') || field.key === 'age') {
        isCompleted = value !== null && value !== undefined && value !== '';
      } else {
        isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      }
      
      return isCompleted;
    });

    const mandatoryMissing = mandatoryFields.filter(field => {
      const value = userData[field.key];
      let isCompleted = false;
      
      // Special handling for number fields - 0 is a valid completed value
      if (field.key.includes('number_of_') || field.key === 'age') {
        isCompleted = value !== null && value !== undefined && value !== '';
      } else {
        isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      }
      
      return !isCompleted;
    }).map(field => field.label);

    const optionalMissing = optionalFields.filter(field => {
      const value = userData[field.key];
      let isCompleted = false;
      
      // Special handling for number fields - 0 is a valid completed value
      if (field.key.includes('number_of_') || field.key === 'age') {
        isCompleted = value !== null && value !== undefined && value !== '';
      } else {
        isCompleted = value !== null && value !== undefined && value !== '' && value !== 0;
      }
      
      return !isCompleted;
    }).map(field => field.label);

    return {
      totalFields: requiredFields.length,
      completedFields: completedFields.length,
      missingFields: missingFields,
      completedFieldsList: completedFields,
      mandatoryTotal: mandatoryFields.length,
      mandatoryCompleted: mandatoryCompleted.length,
      mandatoryMissing: mandatoryMissing,
      optionalTotal: optionalFields.length,
      optionalCompleted: optionalCompleted.length,
      optionalMissing: optionalMissing
    };
  };

  const progressColor = getProgressColor(profilePercentage);
  const statusText = getStatusText(profilePercentage);
  const motivationText = getMotivationText(profilePercentage);
  const stepStatus = getStepCompletionStatus(profilePercentage, userData);

  return (
      <div className="modern-profile-banner">
        <div className="banner-background-pattern"></div>
        <div className="banner-content">
          <div className="banner-header">
          <div className="banner-icon-container">
            <div 
              className="banner-icon"
              style={{ backgroundColor: `${progressColor}20` }}
            >
              {profilePercentage >= 90 ? (
                <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          <div className="banner-info">
            <div className="banner-title-row">
              <span className="banner-percentage">{profilePercentage.toFixed(0)}% Complete</span>
              <div 
                className="banner-status"
                style={{ backgroundColor: `${progressColor}20`, color: progressColor }}
              >
                {statusText}
              </div>
            </div>
            <p className="banner-motivation">{motivationText}</p>
          </div>
        </div>

        <div className="banner-progress-section">
          <div className="progress-header">
            <span className="progress-label">Profile Completion</span>
            <span className="progress-percentage">{profilePercentage.toFixed(1)}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ 
                width: `${profilePercentage}%`,
                background: `linear-gradient(90deg, ${progressColor}, ${progressColor}CC)`
              }}
            ></div>
          </div>
        </div>

        <div className="banner-actions">
          <button 
            className="continue-setup-button"
            style={{ 
              background: `linear-gradient(90deg, ${progressColor}, ${progressColor}CC)`,
              boxShadow: `0 3px 8px ${progressColor}30`
            }}
          >
            <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>CONTINUE SETUP</span>
          </button>
          <button 
            className="steps-button"
            onClick={() => setShowBottomSheet(true)}
          >
            <svg className="button-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Bottom Sheet */}
      <ProfileStepsBottomSheet 
        isOpen={showBottomSheet}
        onClose={() => setShowBottomSheet(false)}
        profilePercentage={profilePercentage}
        stepStatus={stepStatus}
      />
    </div>
  );
};

{/* // Bottom Sheet Component - Exact Homepage.dart Style */}
const ProfileStepsBottomSheet = ({ isOpen, onClose, profilePercentage, stepStatus }) => {
 // Disable body scroll when bottom sheet is open
  useEffect(() => {
    if (isOpen) {
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      // Re-enable body scroll
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet-container" onClick={(e) => e.stopPropagation()}>
        {/* Drag Handle */}
        <div className="bottom-sheet-drag-handle"></div>
        
        {/* Header with Gradient */}
        <div className="bottom-sheet-header">
          <div className="header-icon-container">
            <svg className="header-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="header-content">
            <h2 className="header-title">Profile Completion Steps</h2>
            <p className="header-subtitle">Complete your profile to find better matches</p>
          </div>
          <button className="header-close-btn" onClick={onClose}>
            <svg className="close-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="bottom-sheet-content">
          {/* Progress Bar Section */}
          <div className="progress-section">
            <div className="progress-header">
              <span className="progress-label">Overall Progress</span>
              <span className="progress-percentage">{profilePercentage.toFixed(0)}%</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill"
                style={{ 
                  width: `${profilePercentage}%`,
                  background: profilePercentage >= 75 ? "#10B981" : "#F97316"
                }}
              ></div>
            </div>
          </div>

          {/* Progress Calculation Explanation */}
          <div className="progress-explanation">
            <div className="explanation-header">
              <svg className="info-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="explanation-title">How is this calculated?</span>
            </div>
            <div className="explanation-content">
              <p className="explanation-text">
                Your profile completion is calculated based on <strong>mandatory fields only</strong> across all 5 steps. 
                Optional fields enhance your profile but don't affect the completion percentage.
              </p>
              <div className="mandatory-explanation">
                <div className="mandatory-info">
                  <span className="mandatory-label">📋 Mandatory Fields:</span>
                  <span className="mandatory-desc">Required for 100% completion</span>
                </div>
                <div className="optional-info">
                  <span className="optional-label">✨ Optional Fields:</span>
                  <span className="optional-desc">Enhance profile visibility</span>
                </div>
              </div>
              <div className="calculation-breakdown">
                {stepStatus.map((step, index) => (
                  <div key={index} className="step-breakdown">
                    <div className="step-breakdown-header">
                      <span className="step-breakdown-title">{step.title}</span>
                      <div className="step-breakdown-counts">
                        <span className="mandatory-count">
                          📋 {step.details ? `${step.details.mandatoryCompleted || 0}/${step.details.mandatoryTotal || 0}` : '0/0'}
                        </span>
                        <span className="optional-count">
                          ✨ {step.details ? `${step.details.optionalCompleted || 0}/${step.details.optionalTotal || 0}` : '0/0'}
                        </span>
                      </div>
                    </div>
                    {step.details && (step.details.mandatoryMissing?.length > 0 || step.details.optionalMissing?.length > 0) && (
                      <div className="step-missing-fields">
                        {step.details.mandatoryMissing && step.details.mandatoryMissing.length > 0 && (
                          <div className="missing-mandatory">
                            <span className="missing-label mandatory">📋 Mandatory Missing:</span>
                            <div className="missing-fields-mini">
                              {step.details.mandatoryMissing.slice(0, 2).map((field, fieldIndex) => (
                                <span key={fieldIndex} className="missing-field-mini mandatory">
                                  {field}
                                </span>
                              ))}
                              {step.details.mandatoryMissing.length > 2 && (
                                <span className="missing-field-mini mandatory">
                                  +{step.details.mandatoryMissing.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        {step.details.optionalMissing && step.details.optionalMissing.length > 0 && (
                          <div className="missing-optional">
                            <span className="missing-label optional">✨ Optional Missing:</span>
                            <div className="missing-fields-mini">
                              {step.details.optionalMissing.slice(0, 2).map((field, fieldIndex) => (
                                <span key={fieldIndex} className="missing-field-mini optional">
                                  {field}
                                </span>
                              ))}
                              {step.details.optionalMissing.length > 2 && (
                                <span className="missing-field-mini optional">
                                  +{step.details.optionalMissing.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step Items */}
          <div className="step-items-section">
            {stepStatus.map((step, index) => (
              <div key={index} className="step-item-detailed">
                <div 
                  className="step-number-detailed"
                  style={{ backgroundColor: step.completed ? "#10B981" : step.color }}
                >
                  {step.completed ? (
                    <svg className="step-check-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="step-number-text">{step.step}</span>
                  )}
                </div>
                <div className="step-details-detailed">
                  <h3 className="step-title-detailed">{step.title}</h3>
                  
                  {/* Show detailed completion for all 5 steps */}
                  {(step.step === 1 || step.step === 2 || step.step === 3 || step.step === 4 || step.step === 5) && step.details && (
                    <div className="step-completion-details">
                      <div className="completion-stats">
                        <span className="completion-text">
                          {step.details.completedFields}/{step.details.totalFields} fields completed
                        </span>
                        <div className="completion-progress-bar">
                          <div 
                            className="completion-progress-fill"
                            style={{ 
                              width: `${(step.details.completedFields / step.details.totalFields) * 100}%`,
                              backgroundColor: step.completed ? "#10B981" : step.color
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      {step.details.missingFields.length > 0 && (
                        <div className="missing-fields">
                          <div className="missing-fields-title">Missing:</div>
                          <div className="missing-fields-list">
                            {step.details.missingFields.map((field, fieldIndex) => (
                              <span key={fieldIndex} className="missing-field-tag">
                                {field}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div 
                    className="step-status-detailed"
                    style={{ 
                      backgroundColor: step.completed ? "#10B98120" : `${step.color}20`, 
                      color: step.completed ? "#10B981" : step.color 
                    }}
                  >
                    {step.completed ? "✓ Complete" : "Pending"}
                  </div>
                </div>
                {!step.completed && (
                  <div className="step-tap-hint">
                    <span>TAP</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Section Header - Exact Homepage.dart Style
const ModernSectionHeader = ({ title, subtitle, themeColor }) => (
  <div className="modern-section-header">
    <div className="section-header-content">
      <div className="section-indicator-container">
        <div 
          className="section-indicator"
          style={{ 
            background: `linear-gradient(180deg, ${themeColor}, ${themeColor}80)`
          }}
        ></div>
      </div>
      <div className="section-text-content">
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="section-icon-container">
        <svg className="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      </div>
    </div>
    <div className="section-subtitle-container">
      <p className="section-subtitle">{subtitle}</p>
    </div>
  </div>
);

// Profile Card - Exact Homepage.dart Style
const ProfileCard = ({ profile, themeColor, onInterest, onShortlist, onChat, onProfileClick }) => {
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  
  // API Base URL for image handling
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // Extract profile data with fallbacks - Enhanced for database compatibility
  const profileName = profile.name || profile.first_name || profile.username || profile.full_name || "Unknown User";
  
  // Better age calculation
  let profileAge = "N/A";
  if (profile.age && !isNaN(profile.age)) {
    profileAge = profile.age;
  } else if (profile.date_of_birth) {
    try {
      const birthYear = new Date(profile.date_of_birth).getFullYear();
      const currentYear = new Date().getFullYear();
      profileAge = currentYear - birthYear;
    } catch (e) {
      profileAge = "N/A";
    }
  }
  
  const profileHeight = profile.height || profile.height_cm || profile.height_inches || "5'6\"";
  const profileCity = profile.city || profile.location_city || profile.current_city || profile.location || "City";
  const profileState = profile.state || profile.location_state || profile.current_state || "State";
  const profileEducation = profile.education || profile.education_level || profile.qualification || profile.degree || "Graduate";
  
  // Better image handling
  let profileImage = null;
  if (profile.upload_photo) {
    profileImage = profile.upload_photo.startsWith('http') ? profile.upload_photo : `${API_BASE_URL}${profile.upload_photo}`;
  } else if (profile.profile_image) {
    profileImage = profile.profile_image.startsWith('http') ? profile.profile_image : `${API_BASE_URL}${profile.profile_image}`;
  } else if (profile.profile_photo) {
    profileImage = profile.profile_photo.startsWith('http') ? profile.profile_photo : `${API_BASE_URL}${profile.profile_photo}`;
  } else {
    profileImage = profile.gender === 'female' ? '/images/hijab-woman.png' : '/images/muslim-man.png';
  }
  
  const isVerified = profile.is_verified || profile.verified || profile.verification_status || false;
  const isOnline = profile.is_online || profile.online || false;
  const matchPercentage = profile.match_percentage || profile.compatibility || profile.compatibility_score || 85;
  const profession = profile.profession || profile.occupation || profile.job_title || profile.work || "Professional";
  const maritalStatus = profile.marital_status || profile.marriage_status || profile.status || "Single";
  const religion = profile.religion || profile.religious_background || profile.faith || "Islam";

  const handleInterest = () => {
    setIsInterested(!isInterested);
    onInterest && onInterest(profile);
  };

  const handleShortlist = () => {
    setIsShortlisted(!isShortlisted);
    onShortlist && onShortlist(profile);
  };

  const handleChat = () => {
    onChat && onChat(profile);
  };

  return (
    <div className="modern-profile-card-homepage" onClick={() => onProfileClick && onProfileClick(profile)}>
      {/* Enhanced Photo Section */}
      <div className="profile-image-section-homepage">
        <img 
          src={profileImage} 
          alt={profileName}
          className="profile-main-image-homepage"
          onError={(e) => {
            console.log('Image failed to load, using fallback:', e.target.src);
            e.target.src = profile.gender === 'female' ? '/images/hijab-woman.png' : '/images/muslim-man.png';
          }}
        />
        
        {/* Status indicator - Marital Status Badge */}
        <div className="profile-status-badge-homepage">
          {maritalStatus}
        </div>
        
        {/* Menu button - top right corner */}
        <button className="profile-options-button-homepage">
          <div className="options-dots">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </button>
      </div>

      {/* Enhanced Profile Information Section */}
      <div className="profile-details-section-homepage">
        {/* Name and age row */}
        <div className="profile-name-age-row">
          <h3 className="profile-display-name-homepage">{profileName}</h3>
          <div className="profile-age-badge-homepage">{profileAge} yrs</div>
        </div>
        
        {/* Profession */}
        {profession && (
          <div className="profile-profession-homepage">
            {profession}
          </div>
        )}
        
        {/* Location */}
        <div className="profile-location-homepage">
          <svg className="location-pin-icon-homepage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{profileCity}, {profileState}</span>
        </div>

        {/* Send Interest Button */}
        <button 
          className="send-interest-button-homepage"
          onClick={handleInterest}
        >
          <svg className="heart-icon-homepage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>Send Interest</span>
        </button>
      </div>
    </div>
  );
};

// Modern Section with Profiles - Exact Flutter Style
const ModernSection = ({ title, subtitle, profiles, themeColor, isLoading, onInterest, onShortlist, onChat, onProfileClick }) => (
  <div className="modern-section">
    <ModernSectionHeader title={title} subtitle={subtitle} themeColor={themeColor} />
    
    <div className="section-content">
      {isLoading ? (
        <div className="profiles-horizontal-scroll">
          <div className="profiles-scroll-container">
          {[...Array(3)].map((_, index) => (
              <div key={`shimmer-${index}`} className="profile-card-item">
              <ShimmerProfileCard />
            </div>
          ))}
          </div>
        </div>
      ) : profiles.length > 0 ? (
        <>
          {/* Horizontal Scroll Container - Exact Homepage.dart Style */}
          <div className="profiles-horizontal-scroll">
            <div className="profiles-scroll-container">
              {profiles.slice(0, 10).map((profile, index) => (
                <div key={profile.id || profile.user_id || `profile-${index}`} className="profile-card-item">
              <ProfileCard 
                profile={profile} 
                themeColor={themeColor}
                onInterest={onInterest}
                onShortlist={onShortlist}
                onChat={onChat}
                onProfileClick={onProfileClick}
              />
            </div>
          ))}
        </div>
    </div>

          {/* See All Button */}
          <div className="section-footer">
            <button className="see-all-button">
              <span>SEE ALL PROFILES</span>
              <svg className="button-arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="empty-title">No {title} Found</h3>
          <p className="empty-subtitle">Check back later for new profiles</p>
      </div>
    )}
    </div>
  </div>
);


// Professional Drawer Component - Exact Homepage.dart Style
const ProfessionalDrawer = ({ isOpen, onClose, userName, userPhoto, userGender, isProfileComplete, isProfileMenuExpanded, setIsProfileMenuExpanded, isHelpSupportMenuExpanded, setIsHelpSupportMenuExpanded }) => {
  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-container" onClick={(e) => e.stopPropagation()}>
        {/* Professional Header */}
        <div className="drawer-header">
          <div className="drawer-user-profile">
            <div className="drawer-user-photo-container">
              <img 
                src={userPhoto || (userGender === 'female' ? '/images/hijab-woman.png' : '/images/muslim-man.png')} 
                alt={userName}
                className="drawer-user-photo"
                onError={(e) => {
                  e.target.src = userGender === 'female' ? '/images/hijab-woman.png' : '/images/muslim-man.png';
                }}
              />
              <div className="drawer-edit-button">
                <svg className="drawer-edit-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                </svg>
              </div>
            </div>
            <div className="drawer-user-info">
              <h3 className="drawer-user-name">{userName}</h3>
              <p className={`drawer-profile-status ${isProfileComplete ? 'complete' : 'incomplete'}`}>
                {isProfileComplete ? 'Profile Complete' : 'Profile Incomplete'}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="drawer-menu">
          {/* Profile (expandable) */}
          <div className="drawer-menu-section">
            <div className="drawer-menu-item expandable" onClick={() => setIsProfileMenuExpanded(!isProfileMenuExpanded)}>
              <svg className="drawer-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="drawer-menu-title">Profile</span>
              <svg className={`drawer-expand-icon ${isProfileMenuExpanded ? 'expanded' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {isProfileMenuExpanded && (
              <div className="drawer-submenu">
                <div className="drawer-submenu-item">Edit My Profile</div>
                <div className="drawer-submenu-item">Gallery</div>
                <div className="drawer-submenu-item">Add Trust Badge</div>
                <div className="drawer-submenu-item">My Package</div>
              </div>
            )}
          </div>

          {/* My Interests */}
          <div className="drawer-menu-section">
            <div className="drawer-menu-item">
            <svg className="drawer-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="drawer-menu-title">My Interests</span>
            <svg className="drawer-arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            </div>
          </div>

          <div className="drawer-divider"></div>

          {/* Messages */}
          <div className="drawer-menu-section">
            <div className="drawer-menu-item">
            <svg className="drawer-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="drawer-menu-title">Messages</span>
            <svg className="drawer-arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            </div>
          </div>

          <div className="drawer-divider"></div>

          {/* Advanced Search */}
          <div className="drawer-menu-section">
            <div className="drawer-menu-item">
            <svg className="drawer-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="drawer-menu-title">Advanced Search</span>
            <svg className="drawer-arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            </div>
          </div>

          <div className="drawer-divider"></div>

          {/* Help & Support (expandable) */}
          <div className="drawer-menu-section">
            <div className="drawer-menu-item expandable" onClick={() => setIsHelpSupportMenuExpanded(!isHelpSupportMenuExpanded)}>
              <svg className="drawer-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="drawer-menu-title">Help & Support</span>
              <svg className={`drawer-expand-icon ${isHelpSupportMenuExpanded ? 'expanded' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {isHelpSupportMenuExpanded && (
              <div className="drawer-submenu">
                <div className="drawer-submenu-item">Contact Us</div>
                <div className="drawer-submenu-item">About Us</div>
                <div className="drawer-submenu-item">Blogs</div>
                <div className="drawer-submenu-item">Report Bugs</div>
                <div className="drawer-submenu-item">Terms & Conditions</div>
                <div className="drawer-submenu-item">Privacy Policy</div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="drawer-menu-section">
            <div className="drawer-menu-item">
            <svg className="drawer-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="drawer-menu-title">Settings</span>
            <svg className="drawer-arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileDashboard = () => {
  const location = useLocation();
  const lastSegment = location.pathname.split("/").pop();
  
  // State management
  const [apiData, setApiData] = useState([]);
  const [apiRecommend, setApiDataRecommend] = useState([]);
  const [userDetail, setUserDetail] = useState([]);
  const [apiMember, setApiMember] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with true for initial load
  const [trendingLoading, setTrendingLoading] = useState(true); // Start with true
  const [recommendedLoading, setRecommendedLoading] = useState(true); // Start with true
  const [allUsersLoading, setAllUsersLoading] = useState(true); // Start with true
  const [errors, setErrors] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenWindow, setIsOpenWindow] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [isProfileMenuExpanded, setIsProfileMenuExpanded] = useState(false);
  const [isHelpSupportMenuExpanded, setIsHelpSupportMenuExpanded] = useState(false);
  
  // Filter state
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    ageRange: [18, 40],
    location: '', // Default location like homepage.dart
    profession: '',
    maritalStatus: '', // Default selection like homepage.dart
    education: '',
    sect: ''
  });
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  
  // Drag to close functionality
  const [dragStartY, setDragStartY] = useState(0);
  const [dragCurrentY, setDragCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Dropdown functionality
  const [showProfessionDropdown, setShowProfessionDropdown] = useState(false);
  const [showEducationDropdown, setShowEducationDropdown] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  
  // Location picker states
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  
  // Options lists like homepage.dart
  const professionList = [
    'Accountant',
    'Acting Professional',
    'Actor',
    'Administrator',
    'Administration Professional',
    'Advertising Professional',
    'Advertiser',
    'Air Hostess',
    'Airline Professional',
    'Agriculture',
    'Airforce',
    'Architect',
    'Artist',
    'Assistant Professor',
    'Audiologist',
    'Auditor',
    'Bank Job',
    'Bank Officer',
    'Bank Staff',
    'Beautician',
    'Biologist/Botanist',
    'Business Person',
    'Captain',
    'CEO/CTO/President',
    'Chemist',
    'Civil Engineer',
    'Civil Service',
    'Clerical Official',
    'Clinical Pharmacist',
    'Company Secretary',
    'Computer Engineer',
    'Computer Programmer',
    'Consultant',
    'Contractor',
    'Content Creator',
    'Counsellor',
    'Creative Person',
    'Customer Support Professional',
    'Data Analyst and Content Strategist',
    'Defence Employee',
    'Dentist',
    'Designer',
    'Director/Chairman',
    'Doctor',
    'Domestic Helper',
    'Economist',
    'Engineer',
    'Engineer (Civil)',
    'Engineer (Electrical)',
    'Engineer (Mechanical)',
    'Engineer (Project)',
    'Entertainment Professional',
    'Event Manager',
    'Event Management Professional',
    'Executive',
    'Factory Worker',
    'Farmer',
    'Fashion Designer',
    'Finance Professional',
    'Food Technology',
    'Government Employee',
    'Government Official',
    'Graphic Designer',
    'Gulf Based',
    'Hair Dresser',
    'Health Care Professional',
    'Hospitality',
    'Hotel & Restaurant Professional',
    'Hotel Professional',
    'Human Resource Professional',
    'HSE Officer',
    'Interior Designer',
    'Influencer',
    'Insurance Advisor',
    'Insurance Agent',
    'Investment Professional',
    'IT/Telecom Professional',
    'Islamic Activities',
    'Islamic Dawah',
    'Islamic Scholar',
    'Islamic Teacher',
    'Journalist',
    'Law',
    'Lawyer',
    'Lecturer',
    'Legal Professional',
    'Librarian',
    'Logistics',
    'Manager',
    'Marketing Professional',
    'Media Professional',
    'Medical Professional',
    'Medical Representative',
    'Medical Transcriptionist',
    'Merchant Naval Officer',
    'Microbiologist',
    'Military',
    'Nanny/Child Care',
    'Navy',
    'Non-mainstream Professional',
    'Nurse',
    'NRI',
    'Occupation Therapist',
    'Office Staff',
    'Optician',
    'Optometrist',
    'Pharmacist',
    'Physician Assistant',
    'Physician',
    'Pilot',
    'Police',
    'Priest',
    'Product Professional',
    'Professor',
    'Project Manager',
    'Public Relations Professional',
    'Real Estate Professional',
    'Research Scholar',
    'Retail Professional',
    'Sales Professional',
    'Scientist',
    'Self-employed Person',
    'Social Worker',
    'Software Consultant',
    'Speech Therapist',
    'Sportsman',
    'Supervisor',
    'Teacher',
    'Technician',
    'Technical Staff',
    'Tiktoker',
    'Tour Guide',
    'Trainer',
    'Transportation Professional',
    'Tutor',
    'Unemployed',
    'Veterinary Doctor',
    'Videographer',
    'Web Designer',
    'Web Developer',
    'Wholesale Businessman',
    'Writer',
    'Zoologist',
    'NA',
    'Other',
  ];
  
  const educationList = [
    'PhD in Science (Doctor of Philosophy in Science)',
    "Master's Degree",
    "Bachelor's Degree",
    'Diploma',
    'Trade School/TTC (Technical Training College)/ITI (Industrial Training Institute)',
    'Islamic Education',
    'Higher Secondary School (12th)',
    'Less than High School',
    'Secondary School (10th)',
    'Never been to School/Never Studied',
    'Agriculture',
    'Mass Communication',
    'D.Pharm (Diploma in Pharmacy)',
    'Drafting/Design',
    'Religious Education',
    'Nursing',
    'Medicine (Other)',
    'Administrative Services',
    'Social Work',
    'Philosophy',
    'Aeronautical Engineering',
    'Fine Arts',
    'Travel & Tourism',
    'Shipping',
    'Advertising/Marketing',
    'Office Administration',
    'Paramedical',
    'Medicine (Allopathic)',
    'Law',
    'Home Science',
    'Finance',
    'Fashion',
    'Education',
    'Computers/IT (Information Technology)',
    'Commerce',
    'Arts',
    'Armed Forces',
    'Architecture',
    'Administration/Management',
    'Engineering/Technology',
    'Veterinary Science',
    'Biotechnology',
    'Visual Communication',
    'Radiology',
    'Cardiac Care Technology',
    'Health and Safety',
    'Business Administration',
    'Design (B.Design/M.Design - Bachelor/Master of Design)',
    'Management (MFM - Master of Fashion Management, MBA - Master of Business Administration)',
    'Engineering (B.Tech - Bachelor of Technology, M.Tech - Master of Technology, B.E - Bachelor of Engineering, M.E - Master of Engineering, MS - Master of Science)',
    'Medical Laboratory Technology',
    'Pharmacy (B.Pharm - Bachelor of Pharmacy, M.Pharm - Master of Pharmacy, Pharm.D - Doctor of Pharmacy)',
    'Biochemistry/Bioengineering',
    'Law (LLB - Bachelor of Laws, LLM - Master of Laws, Course in Legal)',
    'Chartered Accountancy (CA, CA Inter - Chartered Accountant, CA Intermediate)',
    'Cost Accounting (ICWA - Institute of Cost and Works Accountants)',
    'Company Secretary (CS)',
    'Chartered Financial Analyst (CFA)',
    'Public Administration (IAS - Indian Administrative Service, IPS - Indian Police Service, IRS - Indian Revenue Service)',
    'Civil Services (IES - Indian Engineering Services)',
    'Fashion Management (MFM - Master of Fashion Management, BFM - Bachelor of Fashion Management)',
    'Management (PGDM - Post Graduate Diploma in Management, MBA - Master of Business Administration)',
    'Media Studies/Visual Arts',
    'Clinical Psychology',
    'Geography/Geology',
    'Environmental Science',
    'Aerospace Engineering',
    'Education (B.Ed - Bachelor of Education, M.Ed - Master of Education)',
    'Bachelor of Law (BL)',
    'Bachelor of Engineering (B.E)',
    'Bachelor of Science (BSc)',
    'MSc (Master of Science) Computer Science/IT (Information Technology)',
    'MSc Health and Safety',
    'MSc Radiology',
    'MSc Biotechnology',
    'MSc Nursing',
    'Master of Law (LLM)',
    'Master of Veterinary Science',
    'MPhil (Master of Philosophy)',
    'MD/MS (Medical Doctor/Master of Surgery)',
    'MDS (Master of Dental Surgery)',
    'MPT (Master of Physiotherapy)',
    'MCA (Master of Computer Applications)',
    'BPT (Bachelor of Physiotherapy)',
    'Aalimah',
    'Aalim',
    'Hafizah',
    'Hafiz',
    'PhD in Islamic Studies (Doctor of Philosophy in Islamic Studies)',
    'Artificial Intelligence (AI)',
    'Data Science',
    'Cybersecurity',
    'Digital Marketing',
    'Blockchain Technology',
    'Cloud Computing',
    'Robotics',
    'Game Development',
    'Animation',
    'Graphic Design',
    'Interior Design',
    'Film Studies',
    'Journalism',
    'Public Relations',
    'Hospitality Management',
    'Event Management',
    'Culinary Arts',
    'Sports Management',
    'Education Administration',
    'Early Childhood Education',
    'Special Education',
    'Occupational Therapist',
    'Speech-Language Pathology',
    'Dentistry (BDS - Bachelor of Dental Surgery, MDS - Master of Dental Surgery)',
    'Optometry',
    'Physiotherapy',
    'Biotechnology Engineering',
    'Chemical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Environmental Engineering',
    'Nuclear Engineering',
    'Robotics Engineering',
    'Materials Science Engineering',
    'Petroleum Engineering',
    'Mining Engineering',
    'Structural Engineering',
    'Computer Engineering',
    'Software Engineering',
    'Data Engineering',
    'Applied Mathematics',
    'Actuarial Science',
    'Statistics',
    'Public Health',
    'Epidemiology',
    'Biomedical Science',
    'Microbiology',
    'Pharmacology',
    'Toxicology',
    'Medical Sciences',
    'Nuclear Medicine',
    'Psychiatry',
    'Neurology',
    'Cardiology',
    'Gastroenterology',
    'Orthopedics',
    'Dermatology',
    'Pediatrics',
    'Obstetrics and Gynecology',
    'Emergency Medicine',
    'Anesthesiology',
    'Ophthalmology',
    'Radiology',
    'Veterinary Medicine',
    'Human Resource Management',
    'Supply Chain Management',
    'Project Management',
    'International Relations',
    'Political Science',
    'Sociology',
    'Psychology',
    'Anthropology',
    'Linguistics',
    'Theology/Religious Studies',
    'History',
    'Literature',
    'Philosophy',
    'Social Sciences',
    'Human Development',
    'Geography',
    'Geophysics',
    'Meteorology',
    'Urban Planning',
    'Renewable Energy',
    'Sustainable Development',
    'Environmental Policy',
    'International Business',
    'Entrepreneurship',
    'Marketing Research',
    'Risk Management',
    'International Law',
    'Human Rights Law',
    'Maritime Studies',
    'Forensic Science',
    'Criminology',
    'Fire Safety Engineering',
    'Industrial Design',
    'Fashion Design',
    'Textile Engineering',
    'Marine Engineering',
    'Others',
    'Not Applicable/Not Studied/Never Studied',
  ];
  
  // Location data structure like homepage.dart
  const locationData = {
    'India': {
      'Delhi': ['New Delhi', 'Central Delhi', 'East Delhi', 'North Delhi', 'South Delhi', 'West Delhi'],
      'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur'],
      'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga'],
      'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'],
      'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman'],
      'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam'],
      'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
      'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'],
      'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Allahabad'],
      'Assam': ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat', 'Tezpur', 'Nagaon']
    },
    'Pakistan': {
      'Sindh': ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpur Khas'],
      'Punjab': ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot'],
      'Khyber Pakhtunkhwa': ['Peshawar', 'Mardan', 'Mingora', 'Kohat', 'Abbottabad', 'Dera Ismail Khan'],
      'Balochistan': ['Quetta', 'Turbat', 'Chaman', 'Zhob', 'Gwadar', 'Sibi']
    },
    'Bangladesh': {
      'Dhaka': ['Dhaka', 'Narayanganj', 'Gazipur', 'Savar', 'Dohar', 'Keraniganj'],
      'Chittagong': ['Chittagong', 'Cox\'s Bazar', 'Comilla', 'Feni', 'Lakshmipur', 'Noakhali'],
      'Sylhet': ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj', 'Kishoreganj', 'Netrokona']
    }
  };
  
  const countryList = Object.keys(locationData);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [selectedProfileData, setSelectedProfileData] = useState(null);

  // User data extraction
  // Extract user data from localStorage - Matching NewDashboard
  const [userId] = useState(localStorage.getItem("userId"));
  const userData = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  // API Base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // Debug logging
  console.log("MobileDashboard Debug:", {
    userId,
    role,
    userData,
    loading,
    trendingLoading,
    recommendedLoading,
    allUsersLoading,
    apiDataLength: apiData?.length || 0,
    apiRecommendLength: apiRecommend?.length || 0,
    userDetailLength: userDetail?.length || 0,
    activeUser,
    API_BASE_URL,
    rawApiData: apiData,
    rawApiRecommend: apiRecommend,
    rawUserDetail: userDetail
  });

  // Profile completion data with validation
  const profilePercentage = activeUser?.profile_completed ? 100 : (activeUser?.profile_percentage || 0);
  const userName = activeUser?.name || activeUser?.first_name || activeUser?.username || "User";
  const userPhoto = activeUser?.upload_photo || activeUser?.profile_image;
  const userGender = activeUser?.gender || "unknown";

  // Data validation and error handling
  const validateProfileData = (profiles) => {
    if (!Array.isArray(profiles)) return [];
    return profiles.filter(profile => profile && typeof profile === 'object');
  };

  // Transform database data to consistent format
  const transformProfileData = (profiles) => {
    if (!Array.isArray(profiles)) {
      console.log("transformProfileData: Not an array", profiles);
      return [];
    }
    
    if (profiles.length === 0) {
      console.log("transformProfileData: Empty array");
      return [];
    }
    
    const transformed = profiles.map((item, index) => {
      if (!item || typeof item !== 'object') {
        console.log(`transformProfileData: Invalid item at index ${index}`, item);
        return null;
      }
      
      // Handle nested structure like NewDashboard (profile.user)
      const profile = item.user || item; // Use nested user object if available
      
      if (!profile || typeof profile !== 'object') {
        console.log(`transformProfileData: Invalid profile at index ${index}`, profile);
        return null;
      }
      
      // Calculate age from date_of_birth if available
      let calculatedAge = 25; // Default age
      if (profile.date_of_birth) {
        const birthYear = new Date(profile.date_of_birth).getFullYear();
        const currentYear = new Date().getFullYear();
        calculatedAge = currentYear - birthYear;
      }
      
      // Handle profile photo URL
      let profilePhoto = null;
      if (profile.upload_photo) {
        profilePhoto = profile.upload_photo.startsWith('http') 
          ? profile.upload_photo 
          : `${API_BASE_URL}${profile.upload_photo}`;
      } else if (profile.profile_image) {
        profilePhoto = profile.profile_image.startsWith('http') 
          ? profile.profile_image 
          : `${API_BASE_URL}${profile.profile_image}`;
      } else if (profile.profile_photo) {
        profilePhoto = profile.profile_photo.startsWith('http') 
          ? profile.profile_photo 
          : `${API_BASE_URL}${profile.profile_photo}`;
      }
      
      const transformedProfile = {
        id: profile.id || profile.user_id || `profile-${index}`,
        user_id: profile.user_id || profile.id || `profile-${index}`,
        name: profile.name || profile.first_name || profile.username || "Unknown User",
        first_name: profile.first_name || profile.name || "Unknown",
        last_name: profile.last_name || "",
        age: profile.age || calculatedAge,
        height: profile.height || profile.height_cm || "5'6\"",
        city: profile.city || profile.location_city || profile.current_city || "City",
        state: profile.state || profile.location_state || profile.current_state || "State",
        education: profile.education || profile.education_level || profile.qualification || "Graduate",
        upload_photo: profilePhoto,
        gender: profile.gender || "unknown",
        is_verified: profile.is_verified || profile.verified || profile.verification_status || false,
        is_online: profile.is_online || profile.online || profile.last_seen ? 
          (new Date() - new Date(profile.last_seen)) < 300000 : false, // 5 minutes
        match_percentage: profile.match_percentage || profile.compatibility || profile.compatibility_score || 85,
        profession: profile.profession || profile.occupation || profile.job_title || "Professional",
        marital_status: profile.marital_status || profile.marriage_status || "Single",
        religion: profile.religion || profile.religious_background || "Islam",
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        // Additional fields from database
        phone: profile.phone || profile.phone_number,
        email: profile.email,
        bio: profile.bio || profile.about || profile.description,
        interests: profile.interests || profile.hobbies,
        family_background: profile.family_background,
        lifestyle: profile.lifestyle,
        partner_preferences: profile.partner_preferences,
        // Include original nested data if available
        interested_id: item.interested_id,
        is_interested: item.is_interested
      };
      
      console.log(`transformProfileData: Transformed profile ${index}`, transformedProfile);
      return transformedProfile;
    }).filter(profile => profile !== null);
    
    console.log("transformProfileData: Final transformed array", transformed);
    return transformed;
  };

  // Fallback data for testing
  const fallbackProfiles = [
    {
      id: 1,
      name: "Sample User 1",
      age: 25,
      height: "5'6\"",
      city: "Mumbai",
      state: "Maharashtra",
      education: "Bachelor's Degree",
      upload_photo: null,
      gender: "female",
      is_verified: true,
      is_online: true,
      match_percentage: 85
    },
    {
      id: 2,
      name: "Sample User 2", 
      age: 28,
      height: "5'8\"",
      city: "Delhi",
      state: "Delhi",
      education: "Master's Degree",
      upload_photo: null,
      gender: "male",
      is_verified: false,
      is_online: false,
      match_percentage: 78
    }
  ];

  // Transform and validate profile data
  const transformedApiData = transformProfileData(apiData);
  const transformedApiRecommend = transformProfileData(apiRecommend);
  const transformedUserDetail = transformProfileData(userDetail);

  // Debug transformed data
  console.log("Transformed Data Debug:", {
    originalApiData: apiData,
    transformedApiData: transformedApiData,
    originalApiRecommend: apiRecommend,
    transformedApiRecommend: transformedApiRecommend,
    originalUserDetail: userDetail,
    transformedUserDetail: transformedUserDetail
  });

  // Use original data if transformation fails or returns empty
  const trendingProfiles = transformedApiData.length > 0 ? transformedApiData : (apiData.length > 0 ? apiData : fallbackProfiles);
  const recommendedProfiles = transformedApiRecommend.length > 0 ? transformedApiRecommend : (apiRecommend.length > 0 ? apiRecommend : fallbackProfiles);
  const allUsersProfiles = transformedUserDetail.length > 0 ? transformedUserDetail : (userDetail.length > 0 ? userDetail : fallbackProfiles);

  console.log("Final Profiles Debug:", {
    trendingProfiles: trendingProfiles,
    recommendedProfiles: recommendedProfiles,
    allUsersProfiles: allUsersProfiles
  });

  // Theme colors for sections
  const themeColors = {
    trending: "#CB3B8B",
    recommended: "#DA73AD", 
    allUsers: "#EB53A7"
  };

  // API calls with proper loading states and error handling - Matching NewDashboard
  useEffect(() => {
    const parameter = {
      url: role === "agent" ? `/api/agent/${userId}/` : `/api/user/${userId}/`,
      setterFunction: (data) => {
        console.log("User data received:", data);
        setActiveUser(data);
        setLoading(false);
        // Store important user data in localStorage like NewDashboard
        localStorage.setItem("gender", data?.gender);
        localStorage.setItem("profile_completed", data?.profile_completed);
      },
      setErrors: (error) => {
        console.error("Error fetching user data:", error);
        setErrors(error);
        setLoading(false);
      },
      setLoading: setLoading,
    };
    fetchDataV2(parameter); // Using fetchDataV2 like NewDashboard
  }, []);

  useEffect(() => {
    if (!userId) {
      setTrendingLoading(false);
      return;
    }
    
    const parameter1 = {
      url: role === "agent" ? `/api/trending_profiles_by_interest/` : `/api/trending_profile/?user_id=${userId}`,
      setterFunction: (data) => {
        console.log("Trending profiles received:", data);
        console.log("Trending profiles type:", typeof data, Array.isArray(data));
        setApiData(data || []);
        setTrendingLoading(false);
      },
      setErrors: (error) => {
        console.error("Error fetching trending profiles:", error);
        setErrors(error);
        setTrendingLoading(false);
      },
      setLoading: () => {}, // We handle loading manually
    };
    fetchDataWithTokenV2(parameter1);
  }, [userId, role]);

  useEffect(() => {
    if (role === "agent") {
      setRecommendedLoading(false);
      return; // Skip recommendations for agents like NewDashboard
    }
    
    if (!userId) {
      setRecommendedLoading(false);
      return;
    }
    
    const parameter2 = {
      url: `/api/user/recommend/?user_id=${userId}`,
      setterFunction: (data) => {
        console.log("Recommended profiles received:", data);
        console.log("Recommended profiles type:", typeof data, Array.isArray(data));
        setApiDataRecommend(data || []);
        setRecommendedLoading(false);
      },
      setErrors: (error) => {
        console.error("Error fetching recommended profiles:", error);
        setErrors(error);
        setRecommendedLoading(false);
      },
      setLoading: () => {}, // We handle loading manually
    };
    fetchDataWithTokenV2(parameter2);
  }, [userId, role]);

  useEffect(() => {
    const parameter3 = {
      url: role === "agent" ? `/api/agent/user_list/` : `/api/user/`,
      setterFunction: (data) => {
        console.log("All users received:", data);
        console.log("All users type:", typeof data, Array.isArray(data));
        setUserDetail(data || []);
        setAllUsersLoading(false);
      },
      setErrors: (error) => {
        console.error("Error fetching all users:", error);
        setErrors(error);
        setAllUsersLoading(false);
      },
      setLoading: () => {}, // We handle loading manually
    };
    fetchDataWithTokenV2(parameter3);
  }, [role]);

  useEffect(() => {
    if (role === "individual") return; // Skip for individual users like NewDashboard
    
    // Only fetch agent members if role is agent (not when impersonating user)
    if (role === "agent") {
      const parameter4 = {
        url: `/api/agent/user_agent/?agent_id=${userId}`,
        setterFunction: (data) => {
          console.log("Agent members received:", data);
          setApiMember(data);
        },
        setErrors: (error) => {
          console.error("Error fetching agent members:", error);
          setErrors(error);
        },
        setLoading: () => {}, // We handle loading manually
      };
      fetchDataWithTokenV2(parameter4);
    }
  }, [userId]);

  // Handle body scroll locking when drawer is open
  useEffect(() => {
    if (showDrawer) {
      // Lock body scroll
      document.body.classList.add('drawer-open');
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      // Unlock body scroll
      document.body.classList.remove('drawer-open');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('drawer-open');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [showDrawer]);

  // Disable background content when filter modal is open
  useEffect(() => {
    if (showFilterModal) {
      document.body.classList.add('filter-modal-open');
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      document.body.classList.remove('filter-modal-open');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      
      // Reset bottom sheet transform when modal closes
      const bottomSheet = document.querySelector('.filter-bottom-sheet-container');
      if (bottomSheet) {
        bottomSheet.style.transform = '';
        bottomSheet.style.transition = '';
      }
    }
    return () => {
      document.body.classList.remove('filter-modal-open');
      document.body.classList.remove('filter-dragging');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      
      // Reset bottom sheet transform on cleanup
      const bottomSheet = document.querySelector('.filter-bottom-sheet-container');
      if (bottomSheet) {
        bottomSheet.style.transform = '';
        bottomSheet.style.transition = '';
      }
    };
  }, [showFilterModal]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEducationDropdown) {
        const dropdowns = document.querySelectorAll('.filter-dropdown-list');
        const containers = document.querySelectorAll('.filter-dropdown-container');
        
        let clickedInside = false;
        containers.forEach(container => {
          if (container.contains(event.target)) {
            clickedInside = true;
          }
        });
        
        if (!clickedInside) {
          setShowEducationDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showEducationDropdown]);

  // Event handlers with real API calls
  const handleInterest = async (profile) => {
    try {
      console.log("Sending interest to:", profile.name);
      
      // Real API call for sending interest
      const response = await fetch(`${API_BASE_URL}/api/interest/send/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          from_user_id: userId,
          to_user_id: profile.id || profile.user_id,
          to_user_name: profile.name || profile.first_name,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log("Interest sent successfully:", result);
        // Show success message
        alert(`Interest sent to ${profile.name || profile.first_name}!`);
        
        // Dispatch custom event to refresh dashboard data
        window.dispatchEvent(new CustomEvent('interestSent'));
      } else {
        console.error("Failed to send interest:", result);
        alert(result.message || "Failed to send interest. Please try again.");
      }
    } catch (error) {
      console.error("Error sending interest:", error);
      alert("Network error. Please try again.");
    }
  };

  const handleShortlist = async (profile) => {
    try {
      console.log("Shortlisting:", profile.name);
      
      // Real API call for shortlisting
      const response = await fetch(`${API_BASE_URL}/api/shortlist/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          from_user_id: userId,
          to_user_id: profile.id || profile.user_id,
          to_user_name: profile.name || profile.first_name,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log("Shortlisted successfully:", result);
        // Show success message
        alert(`${profile.name || profile.first_name} added to shortlist!`);
      } else {
        console.error("Failed to shortlist:", result);
        alert(result.message || "Failed to shortlist. Please try again.");
      }
    } catch (error) {
      console.error("Error shortlisting:", error);
      alert("Network error. Please try again.");
    }
  };

  const handleChat = (profile) => {
    try {
      console.log("Opening chat with:", profile.name);
      
      // Navigate to chat or open chat modal
      const chatUrl = `/chat/${profile.id || profile.user_id}`;
      window.location.href = chatUrl;
      
    } catch (error) {
      console.error("Error opening chat:", error);
      alert("Error opening chat. Please try again.");
    }
  };

  const updateLater = () => {
    setIsOpenWindow(false);
  };

  const closeWindow = () => {
    setIsOpenWindow(false);
  };

  // Filter functionality
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Dropdown selection functions
  const handleProfessionSelect = (profession) => {
    handleFilterChange('profession', profession);
    setShowProfessionDropdown(false);
  };

  const handleEducationSelect = (education) => {
    handleFilterChange('education', education);
    setShowEducationDropdown(false);
  };

  // Location picker functions
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSelectedState('');
    setSelectedCity('');
    // Keep dropdown open for state selection
  };

  const handleStateSelect = (state) => {
    setSelectedState(state);
    setSelectedCity('');
    // Keep dropdown open for city selection
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    // Update the main location filter
    const fullLocation = `${selectedCountry}, ${selectedState}, ${city}`;
    handleFilterChange('location', fullLocation);
    // Close dropdown and reset selections
    setShowCountryDropdown(false);
    setSelectedCountry('');
    setSelectedState('');
    setSelectedCity('');
  };

  const applyFilters = () => {
    // Apply filters to profiles
    let filtered = [...apiData];
    
    if (filters.ageRange) {
      filtered = filtered.filter(profile => {
        const age = profile.age || 0;
        return age >= filters.ageRange[0] && age <= filters.ageRange[1];
      });
    }
    
    if (filters.location) {
      filtered = filtered.filter(profile => 
        (profile.city && profile.city.toLowerCase().includes(filters.location.toLowerCase())) ||
        (profile.state && profile.state.toLowerCase().includes(filters.location.toLowerCase()))
      );
    }
    
    if (filters.profession) {
      filtered = filtered.filter(profile => 
        profile.profession && profile.profession.toLowerCase().includes(filters.profession.toLowerCase())
      );
    }
    
    if (filters.maritalStatus) {
      filtered = filtered.filter(profile => 
        profile.marital_status === filters.maritalStatus
      );
    }
    
    if (filters.education) {
      filtered = filtered.filter(profile => 
        profile.education && profile.education.toLowerCase().includes(filters.education.toLowerCase())
      );
    }
    
    if (filters.sect) {
      filtered = filtered.filter(profile => 
        profile.sect && profile.sect.toLowerCase().includes(filters.sect.toLowerCase())
      );
    }
    
    setFilteredProfiles(filtered);
    setIsFilterApplied(true);
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setFilters({
      ageRange: [18, 40],
      location: '',
      profession: '',
      maritalStatus: '',
      education: '',
      sect: ''
    });
    setFilteredProfiles([]);
    setIsFilterApplied(false);
    setShowFilterModal(false);
  };

  // Smooth drag to close functionality - Like iPhone bottom navbar
  const handleDragStart = (e) => {
    e.preventDefault(); // Prevent default touch behavior
    e.stopPropagation(); // Stop event bubbling
    setDragStartY(e.touches ? e.touches[0].clientY : e.clientY);
    setIsDragging(true);
    // Add dragging class to body to prevent background scrolling
    document.body.classList.add('filter-dragging');
    
    // Add dragging class to bottom sheet for visual feedback
    const bottomSheet = document.querySelector('.filter-bottom-sheet-container');
    if (bottomSheet) {
      bottomSheet.classList.add('dragging');
    }
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent default touch behavior
    e.stopPropagation(); // Stop event bubbling
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
    const dragDistance = currentY - dragStartY;
    
    // Only allow downward dragging
    if (dragDistance > 0) {
      setDragCurrentY(currentY);
      // Apply smooth transform to bottom sheet
      const bottomSheet = document.querySelector('.filter-bottom-sheet-container');
      if (bottomSheet) {
        bottomSheet.style.transform = `translateY(${dragDistance}px)`;
        
        // Add visual feedback when close to threshold
        if (dragDistance > 100) {
          bottomSheet.style.opacity = '0.8'; // Slightly fade when close to close threshold
        } else {
          bottomSheet.style.opacity = '1'; // Full opacity when not close to threshold
        }
      }
    }
  };

  const handleDragEnd = (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent default touch behavior
    e.stopPropagation(); // Stop event bubbling
    const dragDistance = dragCurrentY - dragStartY;
    const bottomSheet = document.querySelector('.filter-bottom-sheet-container');
    
    if (bottomSheet) {
      // Remove dragging class and re-enable transition
      bottomSheet.classList.remove('dragging');
      bottomSheet.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
      bottomSheet.style.opacity = '1'; // Reset opacity
      
      if (dragDistance > 150) {
        // If dragged down more than 150px, close the modal with animation
        bottomSheet.style.transform = 'translateY(100vh)';
        setTimeout(() => {
          setShowFilterModal(false);
        }, 300); // Wait for animation to complete
      } else {
        // If not dragged enough, snap back to original position
        bottomSheet.style.transform = 'translateY(0)';
      }
    }
    
    setIsDragging(false);
    setDragStartY(0);
    setDragCurrentY(0);
    // Remove dragging class from body
    document.body.classList.remove('filter-dragging');
  };

  // Profile completion popup logic like NewDashboard
  const handPopup = () => {
    if (activeUser?.update_later === false) {
      if (
        activeUser?.profile_started === false ||
        activeUser?.profile_completed === false
      ) {
        setIsOpenWindow(true);
      }
    }
  };

  useEffect(() => {
    handPopup();
  }, [activeUser]);

  // Error display component
  const ErrorDisplay = ({ error }) => (
    <div className="mobile-error-display">
      <div className="mobile-error-icon">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="mobile-error-title">Something went wrong</h3>
      <p className="mobile-error-message">{error || "Please try again later"}</p>
      <button 
        className="mobile-error-retry-btn"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );

  // Show error if there's a critical error and no data
  if (errors && !loading && !activeUser) {
    return (
      <div className="mobile-dashboard">
        <ErrorDisplay error={errors} />
      </div>
    );
  }

  return (
    <div className="homepage-dashboard">

      {/* Location Picker Modal - Professional Modal */}
      {showCountryDropdown && (
        <div className="location-picker-modal-overlay" onClick={() => setShowCountryDropdown(false)}>
          <div className="location-picker-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="location-picker-modal-header">
              <h3 className="location-picker-modal-title">Select Location</h3>
              <button className="location-picker-modal-close" onClick={() => setShowCountryDropdown(false)}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="location-picker-modal-content">
              {/* Country Selection */}
              {!selectedCountry && (
                <div className="location-modal-step">
                  <h4 className="location-modal-step-title">Select Country</h4>
                  <div className="location-modal-options-grid">
                    {countryList.map((country, index) => (
                      <div
                        key={index}
                        className="location-modal-option-item"
                        onClick={() => handleCountrySelect(country)}
                      >
                        {country}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* State Selection */}
              {selectedCountry && !selectedState && (
                <div className="location-modal-step">
                  <h4 className="location-modal-step-title">Select State/Province</h4>
                  <div className="location-modal-options-grid">
                    {Object.keys(locationData[selectedCountry] || {}).map((state, index) => (
                      <div
                        key={index}
                        className="location-modal-option-item"
                        onClick={() => handleStateSelect(state)}
                      >
                        {state}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* City Selection */}
              {selectedCountry && selectedState && !selectedCity && (
                <div className="location-modal-step">
                  <h4 className="location-modal-step-title">Select City</h4>
                  <div className="location-modal-options-grid">
                    {(locationData[selectedCountry]?.[selectedState] || []).map((city, index) => (
                      <div
                        key={index}
                        className="location-modal-option-item"
                        onClick={() => handleCitySelect(city)}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profession Picker Modal - Professional Modal */}
      {showProfessionDropdown && (
        <div className="profession-picker-modal-overlay" onClick={() => setShowProfessionDropdown(false)}>
          <div className="profession-picker-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="profession-picker-modal-header">
              <h3 className="profession-picker-modal-title">Select Profession</h3>
              <button className="profession-picker-modal-close" onClick={() => setShowProfessionDropdown(false)}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="profession-picker-modal-content">
              <div className="profession-modal-step">
                <h4 className="profession-modal-step-title">Select Profession</h4>
                <div className="profession-modal-options-grid">
                  {professionList.map((profession, index) => (
                    <div
                      key={index}
                      className="profession-modal-option-item"
                      onClick={() => handleProfessionSelect(profession)}
                    >
                      {profession}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Education Picker Modal - Professional Modal */}
      {showEducationDropdown && (
        <div className="education-picker-modal-overlay" onClick={() => setShowEducationDropdown(false)}>
          <div className="education-picker-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="education-picker-modal-header">
              <h3 className="education-picker-modal-title">Select Education</h3>
              <button className="education-picker-modal-close" onClick={() => setShowEducationDropdown(false)}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="education-picker-modal-content">
              <div className="education-modal-step">
                <h4 className="education-modal-step-title">Select Education</h4>
                <div className="education-modal-options-grid">
                  {educationList.map((education, index) => (
                    <div
                      key={index}
                      className="education-modal-option-item"
                      onClick={() => handleEducationSelect(education)}
                    >
                      {education}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Details Modal */}
      <ProfileDetailsModal 
        isOpen={showProfileDetails}
        onClose={() => {
          setShowProfileDetails(false);
          setSelectedProfileData(null);
        }}
        userData={selectedProfileData}
        currentUserGender={userGender || "female"}
        currentUserId={userId || ""}
      />

      {/* Filter Bottom Sheet - Exact homepage.dart Match */}
      {showFilterModal && (
        <div className="filter-bottom-sheet-overlay" onClick={() => setShowFilterModal(false)}>
          <div 
            className="filter-bottom-sheet-container" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="filter-bottom-sheet-content">
              {/* Handle Bar - Exact homepage.dart style with drag functionality */}
              <div 
                className="filter-bottom-sheet-handle"
                onTouchStart={handleDragStart}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
              ></div>
              
              {/* Title - Exact homepage.dart style */}
              <h2 className="filter-bottom-sheet-title">Filter Profiles</h2>
              
              <div className="filter-spacing-20"></div>
              
              {/* Age Range - Exact homepage.dart RangeSlider */}
              <div className="filter-group">
                <label className="filter-label">Age Range</label>
                <div className="age-range-display-row">
                  <span className="age-range-min">{filters.ageRange[0]} yrs</span>
                  <span className="age-range-max">{filters.ageRange[1]} yrs</span>
                </div>
                <div className="age-range-slider-container">
                  <input
                    type="range"
                    min="18"
                    max="60"
                    value={filters.ageRange[0]}
                    onChange={(e) => handleFilterChange('ageRange', [parseInt(e.target.value), filters.ageRange[1]])}
                    className="age-range-slider"
                  />
                  <input
                    type="range"
                    min="18"
                    max="60"
                    value={filters.ageRange[1]}
                    onChange={(e) => handleFilterChange('ageRange', [filters.ageRange[0], parseInt(e.target.value)])}
                    className="age-range-slider"
                  />
                </div>
              </div>
              
              <div className="filter-spacing-16"></div>
              
              {/* Location - Exact homepage.dart TextFormField with LocationPicker */}
              <div className="filter-group">
                <label className="filter-label">Location</label>
                <div className="filter-input-container" onClick={() => setShowCountryDropdown(!showCountryDropdown)}>
                  <input
                    type="text"
                    placeholder="Select location"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="filter-text-input"
                    readOnly
                  />
                  <svg className="filter-input-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
              </div>
              
              <div className="filter-spacing-16"></div>
              
              {/* Profession - Exact homepage.dart Container style */}
              <div className="filter-group">
                <label className="filter-label">Profession</label>
                <div className="filter-dropdown-container" onClick={() => setShowProfessionDropdown(!showProfessionDropdown)}>
                  <input
                    type="text"
                    placeholder="Select Profession"
                    value={filters.profession}
                    onChange={(e) => handleFilterChange('profession', e.target.value)}
                    className="filter-dropdown-input"
                    readOnly
                  />
                  <svg className="filter-dropdown-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Education - Exact homepage.dart Container style */}
              <div className="filter-group">
                <label className="filter-label">Education</label>
                <div className="filter-dropdown-container" onClick={() => setShowEducationDropdown(!showEducationDropdown)}>
                  <input
                    type="text"
                    placeholder="Select Education"
                    value={filters.education}
                    onChange={(e) => handleFilterChange('education', e.target.value)}
                    className="filter-dropdown-input"
                    readOnly
                  />
                  <svg className="filter-dropdown-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {/* Marital Status - Exact homepage.dart ChoiceChip with all options */}
              <div className="filter-group">
                <label className="filter-label">Select Marital Status</label>
                <div className="marital-status-wrap">
                  <button 
                    className={`marital-status-choice-chip ${filters.maritalStatus === 'Single' ? 'selected' : ''}`}
                    onClick={() => handleFilterChange('maritalStatus', filters.maritalStatus === 'Single' ? '' : 'Single')}
                  >
                    Single
                  </button>
                  <button 
                    className={`marital-status-choice-chip ${filters.maritalStatus === 'Married' ? 'selected' : ''}`}
                    onClick={() => handleFilterChange('maritalStatus', filters.maritalStatus === 'Married' ? '' : 'Married')}
                  >
                    Married
                  </button>
                  <button 
                    className={`marital-status-choice-chip ${filters.maritalStatus === 'Divorced' ? 'selected' : ''}`}
                    onClick={() => handleFilterChange('maritalStatus', filters.maritalStatus === 'Divorced' ? '' : 'Divorced')}
                  >
                    Divorced
                  </button>
                  <button 
                    className={`marital-status-choice-chip ${filters.maritalStatus === 'Khula' ? 'selected' : ''}`}
                    onClick={() => handleFilterChange('maritalStatus', filters.maritalStatus === 'Khula' ? '' : 'Khula')}
                  >
                    Khula
                  </button>
                  <button 
                    className={`marital-status-choice-chip ${filters.maritalStatus === 'Widowed' ? 'selected' : ''}`}
                    onClick={() => handleFilterChange('maritalStatus', filters.maritalStatus === 'Widowed' ? '' : 'Widowed')}
                  >
                    Widowed
                  </button>
                </div>
              </div>
              
              <div className="filter-spacing-24"></div>
              
              {/* Apply Filter Button - Exact homepage.dart ElevatedButton */}
              <button className="filter-apply-button" onClick={applyFilters}>
                Apply Filter
              </button>
              
              <div className="filter-spacing-10"></div>
              
              {/* Clear Filter Button - Exact homepage.dart OutlinedButton */}
              {isFilterApplied && (
                <button className="filter-clear-button" onClick={clearFilters}>
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Professional Drawer */}
      <ProfessionalDrawer 
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        userName={userName || "Demo User"}
        userPhoto={userPhoto}
        userGender={userGender || "female"}
        isProfileComplete={profilePercentage >= 100}
        isProfileMenuExpanded={isProfileMenuExpanded}
        setIsProfileMenuExpanded={setIsProfileMenuExpanded}
        isHelpSupportMenuExpanded={isHelpSupportMenuExpanded}
        setIsHelpSupportMenuExpanded={setIsHelpSupportMenuExpanded}
      />
      {/* Modern AppBar with glassmorphism effect - Exact homepage.dart style */}
      <div className="modern-appbar">
        <div className="appbar-container">
          <button 
            className="menu-button"
            onClick={() => setShowDrawer(!showDrawer)}
          >
            <svg className="menu-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
          
          <div className="appbar-content">
            <div className="greeting-section">
              <p className="greeting-text">Assalam-o-Alaikum</p>
              <h1 className="user-name">{userName}!</h1>
            </div>
          </div>
          
          <div className="appbar-actions">
            <button className="notification-button">
              <svg className="notification-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button className="filter-button" onClick={() => setShowFilterModal(true)}>
              <svg className="filter-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* User Profile Completion Modal */}
      <UserPop
        updateLater={updateLater}
        isOpenWindow={isOpenWindow}
        closeWindow={closeWindow}
        showText={
          activeUser?.profile_started == true
            ? "you have not completed your profile "
            : "complete your profile first"
        }
        navTo={
          activeUser?.profile_started == true
            ? `/memstepone/`
            : (role || lastSegment) === "agent"
            ? `/agentstepone/${userData}`
            : `/memstepone/`
        }
      />

      {/* Main Content */}
      <div className="dashboard-main-content">
        {/* Profile Completion Card - Always Show for Demo */}
        <ProfileCompletionCard 
          profilePercentage={profilePercentage || 45}
          userName={userName || "Demo User"}
          userPhoto={userPhoto}
          userGender={userGender || "female"}
          userData={activeUser}
        />

        {/* Gender Filter Banner - Always Show for Demo */}
        <div className="gender-filter-banner">
          <div className="gender-icon-container">
            <div className="gender-icon">♂</div>
          </div>
          <div className="gender-banner-content">
            <p className="gender-banner-title">Showing Male profiles as per Islamic matrimonial traditions</p>
            <p className="gender-banner-subtitle">Your gender: {userGender || "female"} • User ID: {userId || "12345"}</p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="content-spacing"></div>
        
            {/* Trending Profiles Section */}
            <ModernSection
              title="Trending Profiles"
          subtitle="Most active and popular male members according to Islamic values."
              profiles={isFilterApplied ? filteredProfiles : trendingProfiles}
          themeColor="#EC4899"
              isLoading={trendingLoading}
              onInterest={handleInterest}
              onShortlist={handleShortlist}
              onChat={handleChat}
              onProfileClick={(profileData) => {
                setSelectedProfileData(profileData);
                setShowProfileDetails(true);
              }}
            />

        <div className="content-spacing"></div>

        {/* Recommended Profiles Section - Only for non-agents */}
        {role !== "agent" && (
          <>
            <ModernSection
              title="Recommendations"
              subtitle="Best matches based on your preferences male members according to Islamic values."
              profiles={recommendedProfiles}
              themeColor="#8B5CF6"
              isLoading={recommendedLoading}
              onInterest={handleInterest}
              onShortlist={handleShortlist}
              onChat={handleChat}
              onProfileClick={(profileData) => {
                setSelectedProfileData(profileData);
                setShowProfileDetails(true);
              }}
            />
            <div className="content-spacing"></div>
          </>
        )}

        {/* Latest Profiles Section */}
        <ModernSection
          title="Latest Profiles"
          subtitle="Newest members who just joined"
          profiles={allUsersProfiles}
          themeColor="#3B82F6"
          isLoading={allUsersLoading}
          onInterest={handleInterest}
          onShortlist={handleShortlist}
          onChat={handleChat}
          onProfileClick={(profileData) => {
            setSelectedProfileData(profileData);
            setShowProfileDetails(true);
          }}
        />

        <div className="bottom-spacing"></div>
      </div>

      {/* Modern Bottom Navigation - Exact Homepage.dart Style */}
        <div className="modern-bottom-nav">
          <button className="nav-item active" title="Home">
            <svg className="nav-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </button>
          <button className="nav-item" title="Activity">
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button className="nav-item" title="Search">
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="nav-item" title="Messages">
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <button className="nav-item" title="Profile">
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
      </div>
    </div>
  );
};

export default MobileDashboard;
