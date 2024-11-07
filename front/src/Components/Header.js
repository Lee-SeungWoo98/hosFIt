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
              <div className="profile-image">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="profile-icon">
                  <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                </svg>
              </div>
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