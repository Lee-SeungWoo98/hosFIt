import React from 'react';
import Sidebar from './Sidebar';
import './styles/Layout.css';

const Layout = ({ children, activeTab, onTabChange, logout }) => {
  return (
    <div className="admin-container">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} logout={logout} />
      <main className="admin-main-content" role="main">
        {children}
      </main>
    </div>
  );
};

export default Layout;