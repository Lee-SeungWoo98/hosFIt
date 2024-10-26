import React from 'react';
import { RefreshCw } from 'lucide-react';
import './styles/AdminHeader.css';

const AdminHeader = ({ title, lastUpdated, onRefresh }) => {
  return (
    <div className="content-header">
      <div className="header-title">
        <h1 id="current-page-title">{title}</h1>
        <span className="last-updated">마지막 업데이트: {lastUpdated}</span>
      </div>
      <div className="header-actions">
        <button onClick={onRefresh} className="refresh-btn">
          <RefreshCw className="icon" />
          새로고침
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;