import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import List from "./list";
import Patient from "./Patient"; // Patient 컴포넌트 import 추가

function MainPage({
  searchTerm,
  allPatients,
  patients,
  ktasData,
  ktasFilter,
  loading,
  error,
  handleSearch,
  onTASClick,
  onFilteredPatientsUpdate,
  labTests,
  visitInfo,
  fetchLabTests,
  fetchVisitInfo,
  logout,
}) {
  const location = useLocation();
  const username = location.state?.username || "익명 사용자";
  
  // 선택된 환자 상태 추가
  const [selectedPatient, setSelectedPatient] = useState(null);

  // 환자 선택 핸들러 추가
  const handlePatientSelect = (patientData, labTestsData, visitInfoData) => {
    setSelectedPatient({
      patientData,
      labTests: labTestsData,
      visitInfo: visitInfoData
    });
  };

  // 뒤로가기 핸들러 추가
  const handleBack = () => {
    setSelectedPatient(null);
  };

  return (
    <div className="app">
      <Header
        onSearch={handleSearch}  // 검색어
        ktasData={ktasData}  // ktas 데이터
        username={username}  // 로그인 유저 id
        onTASClick={onTASClick}  // ktas 필터링
        logout={logout}  // 로그아웃
      />
      <div className="main-content">
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p>{error}</p>
        ) : selectedPatient ? ( // 환자 선택 여부에 따라 조건부 렌더링
          <Patient
            patientData={selectedPatient.patientData}
            labTests={selectedPatient.labTests}
            visitInfo={selectedPatient.visitInfo}
            onBack={handleBack}
          />
        ) : (
          <List
            searchTerm={searchTerm}
            allPatients={allPatients}
            patients={patients}
            ktasFilter={ktasFilter}
            onFilteredPatientsUpdate={onFilteredPatientsUpdate}
            labTests={labTests}
            visitInfo={visitInfo}
            fetchLabTests={fetchLabTests}
            fetchVisitInfo={fetchVisitInfo}
            onPatientSelect={handlePatientSelect}
          />
        )}
      </div>
    </div>
  );
}

export default MainPage;