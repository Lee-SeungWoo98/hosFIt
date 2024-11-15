import React from 'react';
import { Grid, Settings, Users, BarChart2, AlertCircle, Sliders } from 'lucide-react'; // 필요한 아이콘을 lucide-react 라이브러리에서 불러옵니다.
import logoutIcon from '../assets/images/logout.png'; // 로그아웃 아이콘을 위한 이미지 파일을 불러옵니다.
import "../layout/Sidbar.css"

// NavLink 컴포넌트: 네비게이션 버튼을 생성하며 현재 활성화 상태에 따라 스타일이 변경됩니다.
const NavLink = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick} // 클릭 시 상위 컴포넌트에서 전달된 onClick 핸들러 실행
    className={`w-full flex items-center gap-3 px-3 py-2.5
      transition-all duration-200 ease-in-out text-[0.9rem]
      ${active 
        ? 'bg-blue-600 text-white font-semibold rounded-lg' // 활성화된 탭은 배경색이 파란색으로 설정되고, 텍스트는 흰색이 됩니다.
        : 'bg-white text-gray-800' // 비활성화된 탭은 흰색 배경에 회색 텍스트로 표시됩니다.
      }
      ${active ? '' : 'hover:bg-gray-100'} // 비활성화된 버튼에 마우스를 올리면 회색 배경이 적용됩니다.
    `}
    style={{
      border: active ? 'none' : '1px solid transparent', // 비활성화 상태에서는 투명 테두리가 있습니다.
      paddingLeft: '1.5rem',
      textAlign: 'left',
      borderRadius: active ? '8px' : '0', // 활성화된 버튼은 둥근 모서리를 가집니다.
    }}
  >
    <Icon className="h-[18px] w-[18px] shrink-0" /> {/* 아이콘 표시 */}
    <span>{label}</span> {/* 버튼에 표시되는 레이블 */}
  </button>
);

// Sidebar 컴포넌트: 사이드바 전체 레이아웃을 구성합니다.
const Sidebar = ({ activeTab, onTabChange, logout, userName }) => (
  <aside className="w-full max-w-xs h-full bg-white md:fixed md:left-0 md:top-0 md:w-60 flex flex-col">
    <div className="p-4 md:p-6 flex-1">
      {/* 로고 섹션 */}
      <h1 className="text-2xl font-bold text-blue-600 text-center mb-4 md:mb-6">hosFit</h1>
      
      {/* 사용자 정보 섹션 - Header 스타일로 수정 */}
      <div className="user-profile-container mb-8">
        <div className="user-details">
          <div className="name-logout-container">
            <span className="user-name">{userName}</span>
          </div>
          <div className="logout-container">
            <span className="user-role">관리자</span>
            <button className="logout-button" onClick={logout}>
              로그아웃
            </button>
          </div>
        </div>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex flex-col gap-2 md:gap-[0.8rem]">
        {/* 대시보드 메뉴 항목 */}
        <NavLink
          active={activeTab === 'dashboard'} // 현재 활성화된 탭과 비교하여 버튼의 활성화 여부를 결정
          icon={Grid} // 아이콘 지정
          label="대시보드" // 버튼 레이블
          onClick={() => onTabChange('dashboard')} // 클릭 시 대시보드 탭으로 변경
        />
        {/* 의료진 관리 메뉴 항목 */}
        <NavLink
          active={activeTab === 'staff'}
          icon={Users}
          label="의료진 관리"
          onClick={() => onTabChange('staff')}
        />
        {/* 로그 메뉴 항목 */}
        <NavLink
          active={activeTab === 'errors'}
          icon={AlertCircle}
          label="로그"
          onClick={() => onTabChange('errors')}
        />
        {/* 설정 메뉴 항목 */}
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
