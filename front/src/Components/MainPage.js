/**
 * MainPage.js
 * 메인 페이지 컴포넌트
 * 환자 목록과 상세 정보를 표시하는 메인 인터페이스
 */
import React, { useState, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import List from "./list";
import Patient from "./Patient";

function MainPage({
  searchTerm,
  allPatients,
  patients,
  ktasData,
  predictionData,
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
  currentPage,
  totalPages,
  totalElements,
  onPageChange
}) {
  // =========== 상태 관리 ===========
  const location = useLocation();
  const username = useMemo(() => 
    location.state?.username || "익명 사용자",
    [location.state]
  );

  const [selectedPatient, setSelectedPatient] = useState({
    patientData: null,
    labTests: null,
    visitInfo: null,
  });

  // =========== 데이터 포맷팅 함수 ===========
  /**
   * 활력징후 데이터 포맷팅
   */
  const formatVitalSigns = useCallback((vitalSigns) => {
    if (!Array.isArray(vitalSigns)) return [];
    return vitalSigns.map(sign => ({
      ...sign,
      chart_time: sign.chart_time ? new Date(sign.chart_time).toISOString() : null,
      heartrate: parseFloat(sign.heartrate || 0),
      resprate: parseFloat(sign.resprate || 0),
      o2sat: parseFloat(sign.o2sat || 0),
      sbp: parseFloat(sign.sbp || 0),
      dbp: parseFloat(sign.dbp || 0),
      temperature: parseFloat(sign.temperature || 0)
    }));
  }, []);

  /**
   * Lab Tests 데이터 포맷팅
   */
  const formatLabTestsData = useCallback((labTestData) => {
    if (!labTestData?.length) return null;
    
    return [{
      blood_levels: labTestData[0].bloodLevels || [],
      electrolyte_levels: labTestData[0].electrolyteLevels || [],
      enzymes_metabolisms: labTestData[0].enzymesMetabolisms || [],
      chemical_examinations_enzymes: labTestData[0].chemicalExaminationsEnzymes || [],
      blood_gas_analysis: labTestData[0].bloodGasAnalysis || []
    }];
  }, []);

  /**
   * 방문 데이터 포맷팅
   */
  const formatVisitsData = useCallback((visits) => {
    return (visits || []).map(visit => ({
      ...visit,
      visitDate: visit.visitDate,
      losHours: parseFloat(visit.losHours || 0),
      pain: parseInt(visit.pain || 0),
      tas: parseInt(visit.tas || 0),
      statstatus: parseInt(visit.statstatus || 0),
      vitalSigns: (visit.vitalSigns || []).map(sign => ({
        chartTime: sign.chartTime,
        heartrate: parseFloat(sign.heartrate || 0),
        resprate: parseFloat(sign.resprate || 0),
        o2sat: parseFloat(sign.o2sat || 0),
        sbp: parseFloat(sign.sbp || 0),
        dbp: parseFloat(sign.dbp || 0),
        temperature: parseFloat(sign.temperature || 0)
      }))
    }));
  }, []);

  // =========== 이벤트 핸들러 ===========
  /**
   * 환자 선택 처리
   */
  const handlePatientSelect = useCallback(async (patientData, labTestData, visitInfoData) => {
    try {
      const formattedLabTests = formatLabTestsData(labTestData);
      const formattedVisits = formatVisitsData(visitInfoData.visits);
      
      const formattedPatient = {
        ...patientData,
        visits: formattedVisits
      };

      setSelectedPatient({
        patientData: formattedPatient,
        labTests: formattedLabTests,
        visitInfo: { ...visitInfoData, visits: formattedVisits }
      });

    } catch (error) {
      console.error("handlePatientSelect 에러:", error);
      setSelectedPatient({
        patientData: null,
        labTests: null,
        visitInfo: null
      });
    }
  }, [formatLabTestsData, formatVisitsData]);

  /**
   * 뒤로가기 처리
   */
  const handleBack = useCallback(() => {
    setSelectedPatient({
      patientData: null,
      labTests: null,
      visitInfo: null
    });
  }, []);

  // =========== 렌더링 ===========
  const renderContent = () => {
    if (selectedPatient.patientData) {
      return (
        <Patient
          patientData={selectedPatient.patientData}
          labTests={selectedPatient.labTests}
          visitInfo={selectedPatient.visitInfo}
          onBack={handleBack}
          fetchLabTests={fetchLabTests}
          fetchVisitInfo={fetchVisitInfo}
        />
      );
    }

    return (
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
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={onPageChange}
        loading={loading}
      />
    );
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
        predictionData={predictionData}
      />
      <div className="main-content">
        {error ? (
          <div className="error-message">{error}</div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
}

export default React.memo(MainPage);