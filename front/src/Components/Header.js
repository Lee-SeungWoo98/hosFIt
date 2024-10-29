import React, { useState } from "react";
import { Search } from "lucide-react";
import "../Components/Ktas";
import Ktas from "../Components/Ktas";
import logoutIcon from './assets/images/logout.png';

function Header({ onSearch, ktasData, username, onTASClick, logout, ktasFilter }) {  // ktasFilter 추가
  return (
    <div className="user-layout">
      <div className="user-sidebar">
        <div className="user-sidebar-header">
          <h2>hosFit</h2>
          <div className="user-info">
            <div className="user-profile">
              <span className="user-name">{username}</span>
              <span className="user-role">의료진</span>
              <button className="logout-button" onClick={logout}>
                <img src={logoutIcon} alt="logout" className="logout-icon" />
                로그아웃
              </button>
            </div>
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