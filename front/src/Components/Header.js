import React from "react";
import Ktas from "../Components/Ktas";

function Header({ onSearch, ktasData, predictionData, username, onTASClick, logout, ktasFilter }) {
  return (
    <div className="user-layout">
      <div className="user-sidebar">
        <div className="user-sidebar-header">
          <h2>hosFit</h2>
          <div className="user-info">
            <div className="user-profile-container">
              <div className="user-details">
                <div className="name-logout-container">
                  <span className="user-name">{username}</span>
                  <div className="logout-container">
                    <button className="logout-button" onClick={logout}>
                      <img
                        src="/static/media/logout.6f56a90e6db30bd89e4b.png"
                        alt="logout"
                        className="logout-icon"
                      />
                      <span className="logout-text">Logout</span>
                    </button>
                  </div>
                </div>
                <span className="user-role">의료진</span>
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