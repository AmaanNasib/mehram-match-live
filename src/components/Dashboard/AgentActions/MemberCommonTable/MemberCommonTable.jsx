import React from 'react';
import './MemberCommonTable.css';

const MemberCommonTable = ({ 
  data, 
  columns, 
  emptyMessage,
  loading = false,
  getProfileImageUrl,
  formatDate,
  sortConfig = null,
  onSort = null,
  onMemberClick = null
}) => {
  
  const renderCellContent = (column, row, index) => {
    switch(column.key) {
      case 'photo':
        return (
          <img
            src={getProfileImageUrl(row[column.dataKey])}
            alt={row.member_name || "Member"}
            className="table-avatar"
            onError={(e) => {
              e.target.src = "https://placehold.co/40";
            }}
          />
        );
      
      case 'member-info':
        return (
          <div 
            className="table-member-info"
            style={{ cursor: onMemberClick ? 'pointer' : 'default' }}
            onClick={() => {
              if (onMemberClick) {
                onMemberClick(row, column);
              }
            }}
          >
            <img
              src={getProfileImageUrl(row[column.photoKey])}
              alt={row[column.nameKey]}
              className="table-avatar"
              style={{ cursor: onMemberClick ? 'pointer' : 'default' }}
              onError={(e) => {
                e.target.src = "https://placehold.co/40";
              }}
            />
            <div>
              <div 
                className="table-name"
                style={{ cursor: onMemberClick ? 'pointer' : 'default' }}
              >
                {row[column.nameKey] || "N/A"}
              </div>
              <div className="table-id">Member ID: {row[column.idKey]}</div>
            </div>
          </div>
        );
      
      case 'date':
        return formatDate(row[column.dataKey]);
      
      case 'status':
        if (column.renderStatus) {
          return column.renderStatus(row, index);
        }
        return (
          <span className={`status ${row[column.dataKey]?.toLowerCase() || 'pending'}`}>
            {row[column.dataKey] || "Pending"}
          </span>
        );
      
      case 'custom':
        if (column.render) {
          return column.render(row, index);
        }
        return "N/A";
      
      default:
        return row[column.dataKey] || "N/A";
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" />
          <polyline points="17 8 12 3 7 8" strokeWidth="2" />
          <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" />
        </svg>
        <h3>{emptyMessage?.title || "No Data"}</h3>
        <p>{emptyMessage?.description || "No data available"}</p>
      </div>
    );
  }

  return (
    <div className="common-table-container">
      <table className="common-table">
        <thead>
          <tr>
            {columns.map((column, index) => {
              const isSortable = column.sortable !== false && column.sortKey && onSort;
              const isActive = sortConfig && sortConfig.key === column.sortKey;
              const sortDirection = isActive ? sortConfig.direction : null;
              
              return (
                <th 
                  key={index}
                  className={isSortable ? 'sortable-header' : ''}
                  onClick={() => isSortable && onSort(column.sortKey)}
                  style={isSortable ? { cursor: 'pointer', userSelect: 'none' } : {}}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    {column.label}
                    {isSortable && (
                      <span className="sort-indicator">
                        {isActive ? (
                          sortDirection === 'asc' ? '↑' : '↓'
                        ) : (
                          '⇅'
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {renderCellContent(column, row, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberCommonTable;
