import React from "react";
import Ktas from "../Components/Ktas";
import logoutIcon from './assets/images/logout.png';

function Header({ onSearch, ktasData, predictionData, username, onTASClick, logout, ktasFilter }) {
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
            predictionData={predictionData}
            onTASClick={onTASClick} 
            ktasFilter={ktasFilter}
          />
        </div>
      </div>
    </div>
  );
}

export default Header;