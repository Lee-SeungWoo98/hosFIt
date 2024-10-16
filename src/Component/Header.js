import React from 'react';
import { Menu, Search, Home, Stethoscope, Clipboard, Activity, User } from 'lucide-react';

function Header() {
  return (
    <>
      <div className="top-bar">
        <div className="logo-container">
          <Menu size={24} />
          <div className="logo-space">hosPit</div>
        </div>
        <div className="search-container">
          <div className="search-bar">
            <Search size={20} />
            <input type="text" placeholder="검색어를 입력하세요" />
          </div>
          <button className="search-button">Search</button>
        </div>
        <div className="user-info">
          <span>유저 이름</span>
          <User size={29} />
        </div>
      </div>
      <div className="main-content">
        <aside className="sidebar">
          <nav>
            <ul>
              <li><Home size={20} /> Main</li>
              <li><Stethoscope size={20} /> 환자 관리</li>
              <li><Clipboard size={20} /> 진료 기록</li>
              <li><Activity size={20} /> 통계</li>
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
}

export default Header;
