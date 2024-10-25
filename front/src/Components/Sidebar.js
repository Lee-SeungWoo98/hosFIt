// Sidebar.js
import React from 'react';
import './Sidebar.css';

function Sidebar() {
  return (
    <nav className="sidebar">
      <SidebarHeader />
      <NavLinks />
    </nav>
  );
}

function SidebarHeader() {
  return (
    <div className="sidebar-header">
      <h2>응급실 관리자</h2>
      <div className="admin-info">
        <span className="admin-name">홍길동</span>
        <span className="admin-role">시스템 관리자</span>
      </div>
    </div>
  );
}

function NavLinks() {
  return (
    <ul className="nav-links">
      <li><a href="#" className="active" data-tab="dashboard">
        <svg className="icon" viewBox="0 0 24 24">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
        </svg>
        대시보드
      </a></li>
      <li><a href="#" data-tab="model">
        <svg className="icon" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1.75 9c0 .24-.02.47-.05.71l.01-.01 1.47 1.16c.14.1.23.18.23.18l-1.7 2.94-2.02-.8.02-.02c-.37.29-.77.53-1.21.71l-.97 1.68h-3.24l-.97-1.68c-.44-.18-.84-.42-1.21-.71l.02.02-2.02.8-1.7-2.94s.09-.08.23-.18l1.47-1.16.01.01c-.03-.24-.05-.47-.05-.71s.02-.47.05-.71l-.01.01-1.47-1.16c-.14-.1-.23-.18-.23-.18l1.7-2.94 2.02.8-.02.02c.37-.29.77-.53 1.21-.71l.97-1.68h3.24l.97 1.68c.44.18.84.42 1.21.71l-.02-.02 2.02-.8 1.7 2.94s-.09.08-.23.18l-1.47 1.16-.01-.01c.03.24.05.47.05.71z"/>
        </svg>
        AI 모델 관리
      </a></li>
      <li><a href="#" data-tab="staff">
        <svg className="icon" viewBox="0 0 24 24">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V18h14v-1.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05.02.01.03.03.04.04 1.14.83 1.93 1.94 1.93 3.41V18h6v-1.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
        의료진 관리
      </a></li>
      <li><a href="#" data-tab="stats">
        <svg className="icon" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
        통계 분석
      </a></li>
      <li><a href="#" data-tab="errors">
        <svg className="icon" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
        에러 로그
      </a></li>
      <li><a href="#" data-tab="settings">
        <svg className="icon" viewBox="0 0 24 24">
          <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
        </svg>
        설정
      </a></li>
    </ul>
  );
}


export default Sidebar;
