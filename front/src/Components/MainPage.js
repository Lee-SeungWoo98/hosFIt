import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import List from "./list";

function MainPage({
  searchTerm,
  allPatients,
  patients,
  ktasData,
  ktasFilter,  // KTAS 필터 상태 추가
  loading,
  error,
  handleSearch,
  onTASClick,  // KTAS 클릭 핸들러 추가
  onFilteredPatientsUpdate
}) {
  const location = useLocation();
  const username = location.state?.username || "익명 사용자";

  return (
    <div className="app">
      <Header
        onSearch={handleSearch}
        ktasData={ktasData}
        username={username}
        onTASClick={onTASClick}  // KTAS 클릭 핸들러 전달
      />
      <div className="main-content">
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <List
            searchTerm={searchTerm}
            allPatients={allPatients}
            patients={patients}
            ktasFilter={ktasFilter}  // KTAS 필터 상태 전달
            onFilteredPatientsUpdate={onFilteredPatientsUpdate}
          />
        )}
      </div>
    </div>
  );
}

export default MainPage;