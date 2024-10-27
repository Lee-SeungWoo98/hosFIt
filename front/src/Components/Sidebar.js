import React from 'react';
import { Grid, Settings, Users, BarChart2, AlertCircle, Sliders } from 'lucide-react';
import logoutIcon from './assets/images/logout.png';
import './styles/Sidebar.css';

const Sidebar = ({ activeTab, onTabChange, logout }) => {
  const navItems = [
    { id: 'dashboard', Icon: Grid, label: '대시보드' },
    { id: 'model', Icon: Settings, label: 'AI 모델 관리' },
    { id: 'staff', Icon: Users, label: '의료진 관리' },
    { id: 'stats', Icon: BarChart2, label: '통계 분석' },
    { id: 'errors', Icon: AlertCircle, label: '에러 로그' },
    { id: 'settings', Icon: Sliders, label: '설정' }
  ];

  const handleClick = (e, id) => {
    e.preventDefault();
    onTabChange(id);
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>응급실 관리자</h2>
        <div className="admin-user-info">
          <span className="admin-user-name">홍길동</span>
          <span className="admin-user-role">시스템 관리자</span>
          <img className="logout" src={logoutIcon} alt="logout icon" onClick={() => logout()}></img>
        </div>
      </div>

      <nav className="admin-nav-links">
        {navItems.map(({ id, Icon, label }) => (
          <a key={id} href="#" onClick={(e) => handleClick(e, id)} className={`admin-nav-link ${activeTab === id ? 'active' : ''}`} data-tab={id}>
            <Icon className="admin-icon" />
            <span>{label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;