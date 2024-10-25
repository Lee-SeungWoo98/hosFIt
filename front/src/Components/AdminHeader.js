import React from 'react';

function AdminHeader() {
  return (
    <header className="content-header">
      <div className="header-title">
        <h1 id="current-page-title">대시보드</h1>
        <span className="last-updated">마지막 업데이트: 2024-10-25 10:30:00</span>
      </div>
      <div className="header-actions">
        <button className="refresh-btn" onClick={refreshData}>
          <svg className="icon" viewBox="0 0 24 24">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          새로고침
        </button>
      </div>
    </header>
  );
}

function refreshData() {
  // 데이터 새로고침 로직
}

export default AdminHeader;
