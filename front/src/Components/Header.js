
import React, { useState } from "react";
import { Search } from "lucide-react";
import "../Components/Ktas";
import Ktas from "../Components/Ktas";
import SearchBar from "./SearchBar";

// 프로필 아이콘
const ProfileIcon = ({ size = 29 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 29 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="14.5" cy="14.5" r="14" fill="#E0E0E0" stroke="#BDBDBD" />
    <circle cx="14.5" cy="11.5" r="5" fill="#BDBDBD" />
    <path
      d="M6 25.5C6 25.5 8 19.5 14.5 19.5C21 19.5 23 25.5 23 25.5"
      stroke="#BDBDBD"
      strokeWidth="2"
    />
  </svg>
);

// 메인 아이콘
const MainIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1 10L10 1L19 10" stroke="currentColor" strokeWidth="2" />
    <path d="M4 10V19H16V10" stroke="currentColor" strokeWidth="2" />
    <rect
      x="8"
      y="13"
      width="4"
      height="6"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

function Header({ onSearch, ktasData, username  }) {  // 부모로부터 onSearch 함수를 전달받음
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value); // 검색어를 부모 컴포넌트로 전달

  };

  return (
    <>
      <div className="top-bar">
        <div className="logo-container">
          <div className="logo-space">hosFit</div>
        </div>
        <SearchBar onSearch={onSearch}/> 
        <div className="user-info">
          <ProfileIcon size={29} />
          <span className="user-name">{username}님 환영합니다.</span>
        </div>
      </div>
      <div className="header-content">
        <Ktas ktasData={ktasData}/> {/* App.js에서 받은 KTAS 데이터를 Ktas 컴포넌트로 전달 */}
      </div>
    </>
  );
}

export default Header;

