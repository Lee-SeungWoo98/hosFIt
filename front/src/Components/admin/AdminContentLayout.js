import React from 'react';
import { RefreshCw } from 'lucide-react';
import './styles/AdminContentLayout.css';

const AdminContentLayout = ({ 
  title, 
  lastUpdated,
  children,
  actionButtons,
  showRefresh = true,
  onRefresh
}) => {
  return (
    <div className="admin-content-layout">
      {/* Header */}
      <div className="admin-content-header">
        <div className="admin-header-title">
          <h1>{title}</h1>
          {lastUpdated && (
            <p className="last-update">마지막 업데이트: {lastUpdated}</p>
          )}
        </div>
        <div className="admin-header-actions">
          {showRefresh && (
            <button
              onClick={onRefresh}
              className="refresh-button"
            >
              <RefreshCw className="icon" />
              새로고침
            </button>
          )}
          {actionButtons}
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content-body">
        {children}
      </div>
    </div>
  );
};

export default AdminContentLayout;