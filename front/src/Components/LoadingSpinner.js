import React from 'react';
import "./styles/LoadingSpiner.css";

const LoadingSpinner = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner"></div>
      <div className="loading-text">데이터 로딩 중...</div>
    </div>
  );
};

export default LoadingSpinner;