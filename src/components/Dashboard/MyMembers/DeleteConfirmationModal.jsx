import React, { useEffect } from 'react';
import { AiOutlineDelete, AiOutlineClose, AiOutlineWarning } from 'react-icons/ai';
import './DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  member, 
  isDeleting,
  title = "Delete Member",
  confirmText = "Delete Member",
  cancelText = "Cancel"
}) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !member) return null;

  const memberName = member.name || member.first_name || member.full_name || 'Unknown Member';
  const memberId = member.member_id || member.id || 'N/A';

  return (
    <>
      <div className="delete-modal-overlay" onClick={onClose}>
        <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="delete-modal-header">
            <div className="delete-icon-container">
              <div className="delete-icon">
                <AiOutlineDelete />
              </div>
              <div className="warning-icon">
                <AiOutlineWarning />
              </div>
            </div>
            <button 
              className="close-btn" 
              onClick={onClose}
              disabled={isDeleting}
              title="Close (Esc)"
            >
              <AiOutlineClose />
            </button>
          </div>

          {/* Content */}
          <div className="delete-modal-content">
            <div className="member-info">
              <div className="member-avatar">
                {member.profile_photo ? (
                  <img 
                    src={member.profile_photo} 
                    alt={memberName}
                    className="avatar-image"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {memberName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="member-details">
                <h3 className="member-name">{memberName}</h3>
                <p className="member-id">ID: {memberId}</p>
              </div>
            </div>

            <div className="warning-section">
              <h4 className="warning-title">⚠️ Confirmation Required</h4>
              <p className="warning-text">
                Are you sure you want to delete <strong>{memberName}</strong>?
              </p>
              <div className="warning-details">
                <p className="warning-subtext">
                  This action will permanently remove:
                </p>
                <ul className="warning-list">
                  <li>• All profile information</li>
                  <li>• Match history and interactions</li>
                  <li>• Photos and documents</li>
                  <li>• All associated data</li>
                </ul>
                <p className="irreversible-text">
                  <strong>This action cannot be undone.</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="delete-modal-footer">
            <button 
              className="cancel-btn" 
              onClick={onClose}
              disabled={isDeleting}
            >
              {cancelText}
            </button>
            <button 
              className="confirm-btn" 
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="spinner"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <AiOutlineDelete />
                  {confirmText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

    </>
  );
};

export default DeleteConfirmationModal;
