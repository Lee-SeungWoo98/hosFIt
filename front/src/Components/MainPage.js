import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import List from "./list";
import Patient from "./Patient";
import axios from "axios";
import debounce from "lodash/debounce";

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
  currentPage,
  totalPages,
  onPageChange
}) {
  const location = useLocation();
  const username = location.state?.username || "익명 사용자";

  const [selectedPatient, setSelectedPatient] = useState({
    patientData: null,
    labTests: null,
    visitInfo: null,
  });

  const formatVitalSigns = (vitalSigns) => {
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
  };

  const formatVisit = (visit) => ({
    ...visit,
    visit_date: visit.visit_date ? new Date(visit.visit_date).toISOString() : null,
    los_hours: parseFloat(visit.los_hours || 0),
    stay_id: visit.stay_id,
    tas: parseInt(visit.tas || 0),
    staystatus: parseInt(visit.staystatus || 0),
    vitalSigns: formatVitalSigns(visit.vital_signs || visit.vitalSigns)
  });

  const handlePatientSelect = async (patientData, labTestData, visitInfoData) => {
    try {
      console.log("Patient Select 데이터:", {
        patientData,
        labTestData,
        visitInfoData
      });
  
      // 1. Lab Tests 데이터 구조화
      let formattedLabTests = null;
      if (labTestData && Array.isArray(labTestData) && labTestData.length > 0) {
        formattedLabTests = [{
          blood_levels: labTestData[0].bloodLevels || [],
          electrolyte_levels: labTestData[0].electrolyteLevels || [],
          enzymes_metabolisms: labTestData[0].enzymesMetabolisms || [],
          chemical_examinations_enzymes: labTestData[0].chemicalExaminationsEnzymes || [],
          blood_gas_analysis: labTestData[0].bloodGasAnalysis || []
        }];
      }
  
      // 2. Visit Info 데이터 포맷팅
      const formattedVisits = visitInfoData.visits.map(visit => ({
        ...visit,
        visitDate: visit.visitDate,
        losHours: parseFloat(visit.losHours || 0),
        pain: parseInt(visit.pain || 0),
        tas: parseInt(visit.tas || 0),
        staystatus: parseInt(visit.staystatus || 0),
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
  
      const formattedVisitInfo = {
        ...visitInfoData,
        visits: formattedVisits
      };
  
      // 3. 환자 데이터 구조화
      const formattedPatientData = {
        ...patientData,
        visits: formattedVisits
      };
  
      console.log("변환된 데이터:", {
        patientData: formattedPatientData,
        labTests: formattedLabTests,
        visitInfo: formattedVisitInfo
      });
  
      // 4. 상태 업데이트
      setSelectedPatient({
        patientData: formattedPatientData,
        labTests: formattedLabTests,
        visitInfo: formattedVisitInfo
      });
  
    } catch (error) {
      console.error("handlePatientSelect 에러:", error);
      setSelectedPatient({
        patientData: null,
        labTests: null,
        visitInfo: null
      });
    }
  };

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
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </div>
  );
}

export default MainPage;