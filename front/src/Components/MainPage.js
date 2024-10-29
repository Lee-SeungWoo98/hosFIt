import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import List from "./list";
import Patient from "./Patient";

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

  // 선택된 환자 상태를 더 세분화
  const [selectedPatient, setSelectedPatient] = useState({
    patientData: null,
    labTests: null,
    visitInfo: null,
  });

  // 환자 선택 핸들러 업데이트
  const handlePatientSelect = async (patientData, initialLabTests, initialVisitInfo) => {
    try {
      // 선택된 환자의 최신 데이터 조회
      const newLabTests = await fetchLabTests(patientData.visits[0].stay_id);
      const newVisitInfo = await fetchVisitInfo(patientData.subject_id);

      // 받아온 visitInfo 데이터에 vital_signs가 있는지 확인하고 데이터 구조 수정
      const formattedVisitInfo = {
        ...newVisitInfo,
        visits: newVisitInfo.visits.map(visit => ({
          ...visit,
          vital_signs: visit.vital_signs?.map(sign => ({
            ...sign,
            heartrate: parseFloat(sign.heartrate),
            resprate: parseFloat(sign.resprate),
            o2sat: parseFloat(sign.o2sat),
            sbp: parseFloat(sign.sbp),
            dbp: parseFloat(sign.dbp),
            temperature: parseFloat(sign.temperature)
          }))
        }))
      };

      setSelectedPatient({
        patientData: {
          ...patientData,
          visits: patientData.visits.map(visit => ({
            ...visit,
            vital_signs: visit.vital_signs?.map(sign => ({
              ...sign,
              heartrate: parseFloat(sign.heartrate),
              resprate: parseFloat(sign.resprate),
              o2sat: parseFloat(sign.o2sat),
              sbp: parseFloat(sign.sbp),
              dbp: parseFloat(sign.dbp),
              temperature: parseFloat(sign.temperature)
            }))
          }))
        },
        labTests: newLabTests,
        visitInfo: formattedVisitInfo
      });
    } catch (error) {
      console.error("Error fetching patient details:", error);
    }
  };

  // 뒤로가기 핸들러
  const handleBack = () => {
    setSelectedPatient({
      patientData: null,
      labTests: null,
      visitInfo: null
    });
  };

  return (
    <div className="app">
      <Header
        onSearch={handleSearch}
        ktasData={ktasData}
        username={username}
        onTASClick={onTASClick}
        logout={logout}
        ktasFilter={ktasFilter}
      />
      <div className="main-content">
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p>{error}</p>
        ) : selectedPatient.patientData ? (
          <Patient
            patientData={selectedPatient.patientData}
            labTests={selectedPatient.labTests}
            visitInfo={selectedPatient.visitInfo}
            onBack={handleBack}
            fetchLabTests={fetchLabTests}
            fetchVisitInfo={fetchVisitInfo}
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
            onSearch={handleSearch}
          />
        )}
      </div>
    </div>
  );
}

export default MainPage;