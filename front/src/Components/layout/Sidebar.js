import React from 'react';
import { Grid, Settings, Users, BarChart2, AlertCircle, Sliders, LogOut } from 'lucide-react';

const NavLink = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
      ${active 
        ? 'bg-blue-600 text-white' 
        : 'text-gray-600 hover:bg-gray-100'
      }
    `}
  >
    <Icon className="h-5 w-5" />
    <span className="flex-1 text-left">{label}</span>
  </button>
);

const Sidebar = ({ activeTab, onTabChange, logout }) => {
  const navItems = [
    { id: 'dashboard', Icon: Grid, label: '대시보드' },
    { id: 'model', Icon: Settings, label: 'AI 모델 관리' },
    { id: 'staff', Icon: Users, label: '의료진 관리' },
    { id: 'stats', Icon: BarChart2, label: '통계 분석' },
    { id: 'errors', Icon: AlertCircle, label: '에러 로그' },
    { id: 'settings', Icon: Sliders, label: '설정' }
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-[280px] bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600 mb-6">hosFit</h1>
          <div className="space-y-1">
            <div className="text-sm font-medium text-gray-900">홍길동</div>
            <div className="text-sm text-gray-500">시스템 관리자</div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map(({ id, Icon, label }) => (
            <NavLink
              key={id}
              active={activeTab === id}
              icon={Icon}
              label={label}
              onClick={() => onTabChange(id)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;