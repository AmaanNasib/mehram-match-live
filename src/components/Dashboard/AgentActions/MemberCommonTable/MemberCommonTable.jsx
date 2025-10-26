import React from 'react';
import './MemberCommonTable.css';

const MemberCommonTable = ({ 
  data, 
  columns, 
  emptyMessage,
  loading = false,
  getProfileImageUrl,
  formatDate
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
              e.target.src = "https://via.placeholder.com/40";
            }}
          />
        );
      
      case 'member-info':
        return (
          <div className="table-member-info">
            <img
              src={getProfileImageUrl(row[column.photoKey])}
              alt={row[column.nameKey]}
              className="table-avatar"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/40";
              }}
            />
            <div>
              <div className="table-name">{row[column.nameKey] || "N/A"}</div>
              <div className="table-id">ID: {row[column.idKey]}</div>
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
            {columns.map((column, index) => (
              <th key={index}>{column.label}</th>
            ))}
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
