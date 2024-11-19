import React from 'react';
import { Grid, Users, AlertCircle, Sliders, Settings } from 'lucide-react'; // 필요한 아이콘을 lucide-react 라이브러리에서 불러옵니다.
import "../layout/Sidbar.css"; // 사이드바에 대한 추가 스타일을 적용하기 위해 CSS 파일을 import

/**
 * NavLink 컴포넌트
 * 네비게이션 버튼을 생성하며, 활성화 상태에 따라 스타일이 변경됩니다.
 * 
 * @param {boolean} active - 현재 활성화 상태
 * @param {React.ElementType} icon - 버튼에 표시될 아이콘 컴포넌트
 * @param {string} label - 버튼에 표시될 레이블 텍스트
 * @param {function} onClick - 버튼 클릭 이벤트 핸들러
 * @returns {JSX.Element} 네비게이션 버튼 컴포넌트
 */
const NavLink = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick} // 클릭 시 실행할 이벤트 핸들러
    className={`w-full flex items-center gap-3 px-4 py-2.5
      transition-all duration-200 ease-in-out text-[0.9rem]
      ${active 
        ? 'bg-blue-600 text-white font-semibold rounded-lg' // 활성화 상태: 파란 배경, 흰 텍스트, 둥근 모서리
        : 'bg-white text-gray-800' // 비활성화 상태: 흰 배경, 회색 텍스트
      }
      ${active ? '' : 'hover:bg-gray-100'} // 비활성화 상태일 때 호버 효과 추가
    `}
    style={{
      border: active ? 'none' : '1px solid transparent', // 비활성화 상태에서 투명한 테두리 적용
      paddingLeft: '1.25rem', // 좌측 패딩 설정
      textAlign: 'left', // 텍스트를 왼쪽 정렬
      borderRadius: active ? '8px' : '0', // 활성화 상태에서 둥근 모서리 적용
    }}
  >
    <Icon className="h-[18px] w-[18px] shrink-0" /> {/* 아이콘 크기 설정 */}
    <span>{label}</span> {/* 버튼 레이블 텍스트 */}
  </button>
);

/**
 * Sidebar 컴포넌트
 * 사이드바 전체 레이아웃을 구성하는 컴포넌트로, 네비게이션 메뉴와 사용자 정보를 표시합니다.
 * 
 * @param {string} activeTab - 현재 활성화된 탭 이름
 * @param {function} onTabChange - 탭 변경 이벤트 핸들러
 * @param {function} logout - 로그아웃 이벤트 핸들러
 * @param {string} userName - 현재 로그인된 사용자 이름
 * @returns {JSX.Element} 사이드바 컴포넌트
 */
const Sidebar = ({ activeTab, onTabChange, logout, userName }) => (
  <aside className="w-[280px] h-full bg-white fixed left-0 top-0 border-r border-gray-200">
    {/* 사이드바 컨테이너 */}
    <div className="p-5"> {/* 전체 패딩을 설정 */}
      {/* 로고 섹션 */}
      <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">
        hosFit {/* 애플리케이션 로고 */}
      </h1>
      
      {/* 사용자 정보 섹션 */}
      <div className="user-profile-container mb-6"> {/* 사용자 정보 컨테이너 */}
        <div className="user-details">
          <div className="name-logout-container">
            <span className="user-name">{userName}</span> {/* 사용자 이름 */}
          </div>
          <div className="logout-container">
            <span className="user-role">관리자</span> {/* 사용자 역할 */}
            <button className="logout-button" onClick={logout}> {/* 로그아웃 버튼 */}
              로그아웃
            </button>
          </div>
        </div>
      </div>

      {/* 네비게이션 메뉴 섹션 */}
      <nav className="flex flex-col gap-[0.4rem]"> {/* 메뉴 간 간격 조정 */}
        {/* 네비게이션 버튼 리스트 */}
        <NavLink
          active={activeTab === 'dashboard'} // 현재 활성화된 탭인지 확인
          icon={Grid} // 대시보드 아이콘
          label="대시보드" // 버튼 레이블
          onClick={() => onTabChange('dashboard')} // 탭 변경 핸들러
        />
        <NavLink
          active={activeTab === 'staff'}
          icon={Users} // 의료진 관리 아이콘
          label="의료진 관리"
          onClick={() => onTabChange('staff')}
        />
        <NavLink
          active={activeTab === 'errors'}
          icon={AlertCircle} // 로그 아이콘
          label="로그"
          onClick={() => onTabChange('errors')}
        />
        <NavLink
          active={activeTab === 'settings'}
          icon={Settings} // 설정 아이콘
          label="설정"
          onClick={() => onTabChange('settings')}
        />
      </nav>
    </div>
  </aside>
);

export default Sidebar; // Sidebar 컴포넌트를 외부에서 사용할 수 있도록 export
