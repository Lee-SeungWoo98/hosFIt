import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, activeTab, onTabChange, logout }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
        logout={logout} 
      />
      <main 
        className="ml-[280px] min-h-screen p-6 transition-all duration-300 ease-in-out"
        role="main"
      >
        <div className="h-full rounded-lg">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;