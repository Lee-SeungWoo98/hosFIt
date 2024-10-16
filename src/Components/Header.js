import React, { useState } from 'react';
import { Search } from 'lucide-react';

const categoryOptions = {
  "필터 1": ["카테고리 A", "카테고리 B", "카테고리 C"],
  "필터 2": ["카테고리 D", "카테고리 E", "카테고리 F"]
};

// 프로필 아이콘
const ProfileIcon = ({ size = 29 }) => (
  <svg width={size} height={size} viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14.5" cy="14.5" r="14" fill="#E0E0E0" stroke="#BDBDBD"/>
    <circle cx="14.5" cy="11.5" r="5" fill="#BDBDBD"/>
    <path d="M6 25.5C6 25.5 8 19.5 14.5 19.5C21 19.5 23 25.5 23 25.5" stroke="#BDBDBD" strokeWidth="2"/>
  </svg>
);

// 메인 아이콘
const MainIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 10L10 1L19 10" stroke="currentColor" strokeWidth="2"/>
    <path d="M4 10V19H16V10" stroke="currentColor" strokeWidth="2"/>
    <rect x="8" y="13" width="4" height="6" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

// 환자 관리 아이콘
const PatientIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M3 18C3 14.6863 6.13401 12 10 12C13.866 12 17 14.6863 17 18" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

// 진료 기록 아이콘
const MedicalRecordIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
    <line x1="7" y1="6" x2="13" y2="6" stroke="currentColor" strokeWidth="2"/>
    <line x1="7" y1="10" x2="13" y2="10" stroke="currentColor" strokeWidth="2"/>
    <line x1="7" y1="14" x2="11" y2="14" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

// 통계 아이콘
const StatisticsIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="10" width="4" height="8" stroke="currentColor" strokeWidth="2"/>
    <rect x="8" y="6" width="4" height="12" stroke="currentColor" strokeWidth="2"/>
    <rect x="14" y="2" width="4" height="16" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

function Header() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [activeMenu, setActiveMenu] = useState('');
  const [loggedInUser, setLoggedInUser] = useState("김철수");

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setProductOptions(categoryOptions[category] || []);
    setSelectedProduct("");
  };

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <>
      <div className="top-bar">
        <div className="logo-container">
          <div className="logo-space">hosPit</div>
        </div>
        <div className="search-container">
          <select className="dropdown" onChange={handleCategoryChange} value={selectedCategory}>
            <option value="">필터</option>
            {Object.keys(categoryOptions).map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select className="dropdown" onChange={handleProductChange} value={selectedProduct} disabled={!selectedCategory}>
            <option value="">카테고리</option>
            {productOptions.map((product) => (
              <option key={product} value={product}>{product}</option>
            ))}
          </select>
          <div className="search-bar">
            <Search size={20} />
            <input type="text" placeholder="검색어를 입력하세요" />
          </div>
          <button className="search-button">Search</button>
        </div>
        <div className="user-info">
          <ProfileIcon size={29} />
          <span className="user-name">{loggedInUser} 환영합니다.</span>
        </div>
      </div>
      <div className="main-content">
        <aside className="sidebar">
          <nav>
            <ul>
              <li className={activeMenu === 'main' ? 'active' : ''} onClick={() => handleMenuClick('main')}>
                <MainIcon size={20} /> Main
              </li>
              <li className={activeMenu === 'patientManagement' ? 'active' : ''} onClick={() => handleMenuClick('patientManagement')}>
                <PatientIcon size={20} /> 환자 관리
              </li>
              <li className={activeMenu === 'medicalRecords' ? 'active' : ''} onClick={() => handleMenuClick('medicalRecords')}>
                <MedicalRecordIcon size={20} /> 진료 기록
              </li>
              <li className={activeMenu === 'statistics' ? 'active' : ''} onClick={() => handleMenuClick('statistics')}>
                <StatisticsIcon size={20} /> 통계
              </li>
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
}

export default Header;