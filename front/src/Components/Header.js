import React, { useState } from "react";
import { Search } from "lucide-react";
import "../Components/Ktas";
import Ktas from "../Components/Ktas";
import logoutIcon from './assets/images/logout.png';

const ProfileIcon = ({ size = 29 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 29 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="14.5" cy="14.5" r="14" fill="#E0E0E0" stroke="#BDBDBD" />
    <circle cx="14.5" cy="11.5" r="5" fill="#BDBDBD" />
    <path
      d="M6 25.5C6 25.5 8 19.5 14.5 19.5C21 19.5 23 25.5 23 25.5"
      stroke="#BDBDBD"
      strokeWidth="2"
    />
  </svg>
);

function Header({ onSearch, ktasData, username, onTASClick, logout, ktasFilter }) {  // ktasFilter 추가
  return (
    <div className="user-layout">
      <div className="user-sidebar">
        <div className="user-sidebar-header">
          <h2>hosFit</h2>
          <div className="user-info">
            <div className="user-profile">
              <ProfileIcon size={40} />
              <span className="user-name">{username}</span>
              <span className="user-role">의료진</span>
            </div>
            <button className="logout-button" onClick={logout}>
              <img src={logoutIcon} alt="logout" className="logout-icon" />
              로그아웃
            </button>
          </div>
        </div>
        <div className="ktas-section">
          <Ktas 
            ktasData={ktasData} 
            onTASClick={onTASClick} 
            ktasFilter={ktasFilter}  // 추가된 부분
          />
        </div>
      </div>
    </div>
  );
}

export default Header;