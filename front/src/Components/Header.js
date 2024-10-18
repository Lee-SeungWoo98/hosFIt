import React, { useState } from "react";
import { Search } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const totalBeds = 100; // 총 병상 수
const usedBeds = 78; // 사용 중인 병상 수
const unusedBeds = totalBeds - usedBeds; // 미사용 병상 수

// 사용 중인 병상의 KTAS 레벨 비율
const tasData = [
  { name: "KTAS 1", value: 30, color: "#0000FF" }, // 파란색 (KTAS 1)
  { name: "KTAS 2", value: 20, color: "#FF0000" }, // 빨간색 (KTAS 2)
  { name: "KTAS 3", value: 10, color: "#FFFF00" }, // 노란색 (KTAS 3)
  { name: "KTAS 4", value: 10, color: "#00FF00" }, // 초록색 (KTAS 4)
  { name: "KTAS 5", value: 8, color: "#FFFFFF" }, // 흰색 (KTAS 5)
];

// 사용 중 vs 미사용 병상을 포함한 데이터
const fullData = [
  ...tasData, // 사용 중인 병상에 KTAS 레벨 데이터 추가
  { name: "미사용", value: unusedBeds, color: "#DDDDDD" }, // 미사용 병상 (회색)
];

const categoryOptions = {
  "필터 1": ["카테고리 A", "카테고리 B", "카테고리 C"],
  "필터 2": ["카테고리 D", "카테고리 E", "카테고리 F"],
};

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

// 환자 관리 아이콘
const PatientIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="2" />
    <path
      d="M3 18C3 14.6863 6.13401 12 10 12C13.866 12 17 14.6863 17 18"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

// 진료 기록 아이콘
const MedicalRecordIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="2"
      width="14"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="2"
    />
    <line x1="7" y1="6" x2="13" y2="6" stroke="currentColor" strokeWidth="2" />
    <line
      x1="7"
      y1="10"
      x2="13"
      y2="10"
      stroke="currentColor"
      strokeWidth="2"
    />
    <line
      x1="7"
      y1="14"
      x2="11"
      y2="14"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

// 통계 아이콘
const StatisticsIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="10"
      width="4"
      height="8"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect
      x="8"
      y="6"
      width="4"
      height="12"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect
      x="14"
      y="2"
      width="4"
      height="16"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [activeMenu, setActiveMenu] = useState("");
  const [loggedInUser, setLoggedInUser] = useState("김철수");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value); // 검색어를 부모 컴포넌트로 전달
  };

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
          <div className="logo-space">hosFit</div>
        </div>
        <div className="search-container">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="환자 이름 검색"
              value={searchTerm}
              onChange={handleSearchChange}
            />
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
            {/* <ul>  그래프에 밀려 잠정 폐기
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
            </ul> */}
          </nav>
          <div className="chart-container">
            <h3>KTAS 병상 점유율</h3>
            <ResponsiveContainer width="100%" height={200}>
              {" "}
              {/* 반응형으로 차트 크기 조정 */}
              <PieChart>
                <Pie
                  data={fullData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  labelLine={false}
                  label={({
                    name,
                    value,
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                  }) => {
                    const RADIAN = Math.PI / 180;
                    const radius =
                      innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="black" // 글씨 색상을 차트 안에서 보이도록 설정
                        textAnchor="middle" // 텍스트를 중앙에 정렬
                        dominantBaseline="central"
                      >
                        {`${value}`}
                      </text>
                    );
                  }}
                >
                  {fullData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="label-container">
            {fullData.map((entry, index) => (
              <div key={index} className="label-item">
                <span
                  style={{ backgroundColor: entry.color }}
                  className="label-dot"
                ></span>
                {entry.name}: {entry.value} Beds ({entry.percentage}%)
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}

export default Header;
