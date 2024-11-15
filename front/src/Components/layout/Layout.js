import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, activeTab, onTabChange, logout, userName}) => {
  console.log(userName);
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
        logout={logout} 
        userName={userName}
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