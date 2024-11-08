import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import './styles/AdminHeader.css';

const AdminHeader = ({ title, onRefresh }) => {
  const [currentTime, setCurrentTime] = useState('');

  const getCurrentKoreanTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  };

  const handleRefresh = () => {
    setCurrentTime(getCurrentKoreanTime());
    onRefresh && onRefresh();
  };

  useEffect(() => {
    setCurrentTime(getCurrentKoreanTime());
  }, []);

  return (
    <div className="admin-content-header">
      <div className="admin-header-title">
        <h1 id="current-page-title">{title}</h1>
        <span className="admin-last-updated">
          마지막 업데이트: {currentTime}
        </span>
      </div>
      <div className="admin-header-actions">
        <button onClick={handleRefresh} className="admin-refresh-btn">
          <RefreshCw className="admin-icon" />
          새로고침
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
