import React from 'react';
import { Grid, Settings, Users, BarChart2, AlertCircle, Sliders } from 'lucide-react';
import logoutIcon from '../assets/images/logout.png';

// NavLink 컴포넌트: 사이드바 메뉴 항목을 렌더링하며, 아이콘과 레이블을 표시합니다.
const NavLink = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5
      transition-all duration-200 ease-in-out text-[0.9rem]
      ${active 
        ? 'bg-blue-600 text-white font-semibold rounded-lg' 
        : 'bg-white text-gray-800'
      }
      ${active ? '' : 'hover:bg-gray-100'}
    `}
    style={{
      border: active ? 'none' : '1px solid transparent', // 활성화 상태에 따라 테두리 설정
      paddingLeft: '1.5rem',
      textAlign: 'left',
      borderRadius: active ? '8px' : '0',
    }}
  >
    <Icon className="h-[18px] w-[18px] shrink-0" /> {/* 아이콘 크기 설정 */}
    <span>{label}</span> {/* 레이블 표시 */}
  </button>
);

// Sidebar 컴포넌트: 사이드바 구조를 정의하며, 대시보드와 같은 네비게이션 메뉴 항목을 렌더링합니다.
const Sidebar = ({ activeTab, onTabChange, logout }) => (
  <aside className="w-full max-w-xs h-full bg-white md:fixed md:left-0 md:top-0 md:w-60">
    <div className="p-4 md:p-6">
      {/* 로고 섹션 */}
      <h1 className="text-2xl font-bold text-blue-600 text-center mb-4 md:mb-6">hosFit</h1>
      
      {/* 관리자 정보 및 로그아웃 버튼 */}
      <div className="flex flex-col items-center text-center text-gray-600 mb-6 md:mb-8">
        <h2 className="text-base font-medium">관리자</h2>
        <div className="flex items-center text-sm mb-1">
          <span>홍길동</span> {/* 관리자 이름 표시 */}
        </div>
        
        {/* 로그아웃 버튼 */}
        <button 
          onClick={logout} 
          className="mt-1"
          style={{
            backgroundColor: 'transparent', // 배경색 제거
            border: 'none', // 테두리 제거
            boxShadow: 'none', // 그림자 제거
            padding: 0, 
            margin: 0, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center', // 이미지가 중앙에 위치하도록 설정
          }}
        >
          <img 
            src={logoutIcon} 
            alt="Logout" 
            className="h-5 w-5" 
            style={{ 
              backgroundColor: 'transparent', // 이미지 배경색 제거
              border: 'none', // 테두리 제거
              boxShadow: 'none', // 그림자 제거
              padding: 0, 
              margin: 0, 
              display: 'block' // 이미지가 정상적으로 보이도록 설정
            }} 
          />
        </button>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex flex-col gap-2 md:gap-[0.8rem]">
        <NavLink
          active={activeTab === 'dashboard'} // 현재 활성화된 탭인지 확인
          icon={Grid} // 아이콘 컴포넌트
          label="대시보드" // 메뉴 이름
          onClick={() => onTabChange('dashboard')} // 클릭 시 탭 변경 함수 호출
        />
        <NavLink
          active={activeTab === 'model'}
          icon={Settings}
          label="AI 모델 관리"
          onClick={() => onTabChange('model')}
        />
        <NavLink
          active={activeTab === 'staff'}
          icon={Users}
          label="의료진 관리"
          onClick={() => onTabChange('staff')}
        />
        <NavLink
          active={activeTab === 'stats'}
          icon={BarChart2}
          label="통계 분석"
          onClick={() => onTabChange('stats')}
        />
        <NavLink
          active={activeTab === 'errors'}
          icon={AlertCircle}
          label="에러 로그"
          onClick={() => onTabChange('errors')}
        />
        <NavLink
          active={activeTab === 'settings'}
          icon={Sliders}
          label="설정"
          onClick={() => onTabChange('settings')}
        />
      </nav>
      
    </div>
  </aside>
); 

export default Sidebar;
