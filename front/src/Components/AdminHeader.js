import React from 'react';
import { RefreshCw } from 'lucide-react';
import './styles/AdminHeader.css';

const AdminHeader = ({ title, lastUpdated, onRefresh }) => {
  return (
    <div className="admin-content-header"> 
      <div className="admin-header-title"> 
        <h1 id="current-page-title">{title}</h1>
        <span className="admin-last-updated">
          마지막 업데이트: {lastUpdated}
        </span>
      </div>
      <div className="admin-header-actions">      
        <button onClick={onRefresh} className="admin-refresh-btn"> 
          <RefreshCw className="admin-icon" />  
          새로고침
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;