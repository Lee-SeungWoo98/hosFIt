import React, { useState } from 'react';
import Layout from './Components/Layout';
import Dashboard from './Components/Dashboard';
import AIModel from './Components/AIModel';
import Staff from './Components/Staff';
import Stats from './Components/Stats';
import Errors from './Components/Errors';
import Settings from './Components/Settings';
import AdminHeader from './Components/AdminHeader';
import NotificationContainer from './Components/NotificationContainer';
import './Components/styles/AdminApp.css';

const AdminApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      showNotification('데이터가 업데이트되었습니다.', 'success');
      setLoading(false);
    }, 1000);
  };

  const showNotification = (message, type = 'info') => {
    const container = document.getElementById('adminNotificationContainer');
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    
    const icon = document.createElement('div');
    icon.className = 'admin-notification-icon';
    icon.innerHTML = getNotificationIcon(type);
    
    const content = document.createElement('div');
    content.className = 'admin-notification-content';
    content.textContent = message;
    
    notification.appendChild(icon);
    notification.appendChild(content);
    container.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      success: `<svg class="admin-icon" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>`,
      error: `<svg class="admin-icon" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>`,
      warning: `<svg class="admin-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`,
      info: `<svg class="admin-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`
    };
    return icons[type] || icons.info;
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: '대시보드',
      model: 'AI 모델 관리',
      staff: '의료진 관리',
      stats: '통계 분석',
      errors: '에러 로그',
      settings: '설정'
    };
    return titles[activeTab] || '대시보드';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard loading={loading} />;
      case 'model':
        return <AIModel />;
      case 'staff':
        return <Staff showNotification={showNotification} />;
      case 'stats':
        return <Stats />;
      case 'errors':
        return <Errors />;
      case 'settings':
        return <Settings showNotification={showNotification} />;
      default:
        return <Dashboard loading={loading} />;
    }
  };

  return (
    <>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        <AdminHeader 
          title={getPageTitle()} 
          lastUpdated="2024-10-25 10:30:00"
          onRefresh={handleRefresh}
        />
        {renderContent()}
      </Layout>
      <NotificationContainer />
    </>
  );
};

export default AdminApp;