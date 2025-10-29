import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './MembersTable.css';

const MembersTable = ({ 
  members, 
  sortConfig, 
  handleSort, 
  onConfirmRemove,
  currentPage,
  itemsPerPage 
}) => {
  const navigate = useNavigate();

  // Calculate current items for pagination
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return members.slice(startIndex, endIndex);
  }, [members, currentPage, itemsPerPage]);

  // Get profile photo URL with fallback
  const getProfilePhoto = (member) => {
    const photoUrl = member?.profile_photo?.upload_photo || 
                    member?.user_profilephoto?.upload_photo ||
                    member?.profile_image ||
                    member?.avatar ||
                    member?.photo ||
                    member?.image ||
                    member?.user_profilephoto?.photo ||
                    member?.user_profilephoto?.image;
    
    if (photoUrl) {
      return `${process.env.REACT_APP_API_URL}${photoUrl}`;
    }
    
    // Default avatar based on gender
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTIgMTJaIiBmaWxsPSIjOWNhM2FmIi8+CjxwYXRoIGQ9Ik0xMiAxNEM3LjU4MTcyIDE0IDQgMTcuNTgxNyA0IDIySDEyQzE2LjQxODMgMTQgMTIgMTQgMTIgMTRaIiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo8L3N2Zz4K";
  };

  // Handle image error with fallback
  const handleImageError = (e, member) => {
    e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHN2ZyB4PSIxMCIgeT0iMTAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEyIDEyQzE0Ljc2MTQgMTIgMTcgOS43NjE0MiAxNyA3QzE3IDQuMjM4NTggMTQuNzYxNCAyIDEyIDJDOS4yMzg1OCAyIDcgNC4yMzg1OCA3IDdDNyA5Ljc2MTQyIDkuMjM4NTggMTIgMTIgMTJaIiBmaWxsPSIjOWNhM2FmIi8+CjxwYXRoIGQ9Ik0xMiAxNEM3LjU4MTcyIDE0IDQgMTcuNTgxNyA0IDIySDEyQzE2LjQxODMgMTQgMTIgMTQgMTIgMTRaIiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo8L3N2Zz4K";
  };

  // Sortable header component
  const SortableHeader = ({ field, label, onClick }) => (
    <th 
      className="sortable-header" 
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {label}
      {sortConfig.key === field && (
        <span className="sort-indicator">
          {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
        </span>
      )}
    </th>
  );

  // Action button component
  const ActionButton = ({ className, onClick, title, children, ...props }) => (
    <button
      className={`action-btn ${className} modern-btn`}
      onClick={onClick}
      title={title}
      style={{
        width: "36px",
        height: "36px",
        minWidth: "36px",
        minHeight: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      {...props}
    >
      {children}
    </button>
  );

  return (
    <div className="members-table-container">
      <div className="table-wrapper">
        <table className="members-table">
          <thead>
            <tr>
              <SortableHeader 
                field="member_id" 
                label="Member ID" 
                onClick={() => handleSort('member_id')} 
              />
              <th>Photo</th>
              <SortableHeader 
                field="name" 
                label="Name" 
                onClick={() => handleSort('name')} 
              />
              <SortableHeader 
                field="age" 
                label="Age" 
                onClick={() => handleSort('age')} 
              />
              <SortableHeader 
                field="gender" 
                label="Gender" 
                onClick={() => handleSort('gender')} 
              />
              <SortableHeader 
                field="city" 
                label="Location" 
                onClick={() => handleSort('city')} 
              />
              <SortableHeader 
                field="sect_school_info" 
                label="Sect" 
                onClick={() => handleSort('sect_school_info')} 
              />
              <SortableHeader 
                field="profession" 
                label="Profession" 
                onClick={() => handleSort('profession')} 
              />
              <SortableHeader 
                field="martial_status" 
                label="Martial Status" 
                onClick={() => handleSort('martial_status')} 
              />
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((member) => (
              <tr key={member.id} className="table-row">
                <td>
                  <span className="member-id-badge">
                    {member?.member_id || "N/A"}
                  </span>
                </td>
                <td>
                  <div className="member-photo-cell">
                    <div className="member-avatar">
                      <img
                        src={getProfilePhoto(member)}
                        alt={member?.name || "Member"}
                        className="avatar-img"
                        onError={(e) => handleImageError(e, member)}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <span className="simple-member-name">
                    {member?.name || "N/A"}
                  </span>
                </td>
                <td>{member?.age || "N/A"}</td>
                <td>{member?.gender || "N/A"}</td>
                <td>{member?.location || member?.city || "N/A"}</td>
                <td>{member?.sect || member?.sect_school_info || "N/A"}</td>
                <td>{member?.profession || "N/A"}</td>
                <td>
                  <span className={`marital-badge ${member?.martial_status ? member?.martial_status?.toLowerCase()?.replace(" ", "-") : "not-mentioned"}`}>
                    {member?.martial_status || "Not mentioned"}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <ActionButton
                      className="view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/details/${member?.id}`);
                      }}
                      title="View Profile"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </ActionButton>
                    
                    <ActionButton
                      className="edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/memstepone/${member.id}`, { 
                          state: { editMode: true, memberId: member.id } 
                        });
                      }}
                      title="Edit Profile"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </ActionButton>
                    
                    <ActionButton
                      className="match-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/member-matches/${member.member_id}`);
                      }}
                      title="View Match Details"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12l2 2 4-4"/>
                        <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                        <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                        <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/>
                        <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"/>
                      </svg>
                    </ActionButton>
                    
                    <ActionButton
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onConfirmRemove(member);
                      }}
                      title="Delete Profile"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersTable;
