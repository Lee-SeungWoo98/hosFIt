import React from 'react';
import Sidebar from './Sidebar';
import './styles/Layout.css';

const Layout = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="admin-container">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      <main className="admin-main-content" role="main">
        {children}
      </main>
    </div>
  );
};

export default Layout;