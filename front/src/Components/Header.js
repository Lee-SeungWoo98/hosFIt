import React from "react";
import Ktas from "../Components/Ktas";
import LoginImg from './assets/images/doctor.png';

function Header({ onSearch, ktasData, predictionData, userName, onTASClick, logout, ktasFilter }) {
  return (
    <div className="user-layout">
      <div className="user-sidebar">
        <div className="user-sidebar-header">
          <h2>hosFit</h2>
          <div className="user-info">
            <div className="user-profile-container">
              <div className="user-details">
                <div className="name-logout-container">
                  <span className="user-name">{userName}</span>
                </div>
                <div className="logout-container">
                  <span className="user-role">응급의학과 전문의</span>
                  <button className="logout-button" onClick={logout}>
                    로그아웃
                  </button>
                </div>
              </div>
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