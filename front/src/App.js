import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";

// 상수 import
import { 
  API_ENDPOINTS, 
  AUTO_REFRESH_INTERVAL, 
  INITIAL_FILTERS, 
  INITIAL_STATE 
} from './constants/api';

// 컴포넌트 임포트
import Login from "./Components/Login";
import MainPage from "./Components/MainPage";
import AdminAPP from "./AdminAPP";

// 스타일 임포트
import "./App.css";
import "./Components/list.css";
import "./Components/Header.css";
import "./Components/Ktas.css";
import "./Components/SearchBar.css";

// 유틸리티 함수들
const getErrorMessage = (error) => {
  if (error.response) {
    return `Server Error: ${error.response.status}`;
  }
  if (error.request) {
    return 'No response from server';
  }
  return 'Failed to send request';
};

const formatPatientData = (patient) => {
  if (!patient) return null;

  const formatVisitDate = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 5) {
      console.warn('Invalid date array:', dateArray);
      return null;
    }
    
    try {
      const [year, month, day, hour, minute] = dateArray;
      return new Date(year, month - 1, day, hour, minute);
    } catch (error) {
      console.error('Date formatting error:', error);
      return null;
    }
  };

  const determineICD = (patientData) => {
    if (patientData.icd) return patientData.icd;
    if (patientData.visits?.[0]?.icd) return patientData.visits[0].icd;
    if (patientData.visits?.[0]?.patient?.icd) return patientData.visits[0].patient.icd;
    return '-';
  };

  return {
    ...patient,
    gender: patient?.gender ?? 'N/A',
    name: patient?.name ?? 'Unknown',
    icd: determineICD(patient),
    visits: patient.visits?.map(visit => ({
      ...visit,
      visitDate: formatVisitDate(visit.visitDate),
      vitalSigns: visit.vitalSigns?.map(sign => ({
        ...sign,
        level1: sign.level1,
        level2: sign.level2,
        level3: sign.level3,
        wardCode: sign.wardCode
      })) || [],
      icd: visit.icd || determineICD(patient)
    }))
  };
};

function App() {
  // =========== 상태 관리 ===========
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [position, setPosition] = useState(
    localStorage.getItem("position") || "null"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ktasData, setKtasData] = useState(null);
  const [totalBed] = useState(48);
  const [ktasFilter, setKtasFilter] = useState([]);
  const [labTests, setLabTests] = useState(null);
  const [visitInfo, setVisitInfo] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [userName, setUserName] = useState("");
  const [tabCounts, setTabCounts] = useState({
  all: 0,
  icu: 0,
  ward: 0,
  discharge: 0
});
  
  const abortControllerRef = useRef(null);

  // =========== API 통신 함수 ===========
  const fetchFilteredData = useCallback(async (page = 0, currentFilters = filters, signal) => {
    try {
      setLoading(true);
      const pageNumber = typeof page === 'object' ? 0 : page;
      
      const url = new URL(API_ENDPOINTS.PATIENTS.LIST);
      
      // 기본 파라미터 설정
      url.searchParams.append('page', pageNumber);
      
      // 전체 탭이 아닐 때만 size와 maxLevel 추가
      if (currentFilters?.maxLevel) {
        url.searchParams.append('size', '10');
        url.searchParams.append('maxLevel', currentFilters.maxLevel);
      }
  
      // 다른 필터들은 항상 적용
      if (currentFilters.searchTerm) {
        url.searchParams.append('name', currentFilters.searchTerm);
      }
      if (currentFilters?.gender != null && currentFilters.gender !== '') {
        url.searchParams.append('gender', currentFilters.gender);
      }
      if (currentFilters?.tas && currentFilters.tas !== '') {
        url.searchParams.append('tas', currentFilters.tas);
      }
      if (currentFilters?.painScore && currentFilters.painScore !== '') {
        url.searchParams.append('pain', currentFilters.painScore);
      }
  
      const options = signal ? { signal } : {};
      const response = await axios.get(url.toString(), options);
  
      if (!signal?.aborted && response.data) {
        const formattedData = response.data.patients?.map(formatPatientData).filter(Boolean) || [];
        
        setFilters(currentFilters);
        setPatients(formattedData);
        setFilteredPatients(formattedData);
        setTotalPages(response.data.totalPages || 1);
        setTotalElements(response.data.totalElements || 0);
        
        const newPageNumber = pageNumber >= response.data.totalPages ? 0 : pageNumber;
        setCurrentPage(newPageNumber);
        setError(null);
        
        return response.data;
      }else {
        setPatients([]);
        setFilteredPatients([]);
        setTotalPages(1);
        setTotalElements(0);
        setCurrentPage(0);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error('API Error:', error);
        setError(getErrorMessage(error));
        setPatients([]);
        setFilteredPatients([]);
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [filters]);

  const fetchKtasData = useCallback(async () => {
    try {
      const result = await axios.get(API_ENDPOINTS.PATIENTS.STATISTICS.TAS);
      // const bed = await axios.get(API_ENDPOINTS.PATIENTS.STATISTICS.TOTALBED);
      const valueArray = Object.values(result.data);
      setKtasData({
        totalBeds: totalBed,
        usedBeds: totalBed - valueArray.reduce((acc, cur) => acc + cur, 0),
        ktasRatios: valueArray,
      });
      // console.log("왜 마이너스 => ", totalBed);
    } catch (error) {
      console.error("KTAS 데이터 로드 실패:", error);
      setKtasData({
        totalBeds: 100,
        usedBeds: 75,
        ktasRatios: [10, 20, 30, 25, 15],
      });
    }
  }, [totalBed]);

  // 탭 카운트 계산 함수
  const fetchAllTabCounts = useCallback(async () => {
    try {
      const requests = [
        axios.get(`${API_ENDPOINTS.PATIENTS.LIST}?maxLevel=level3`),
        axios.get(`${API_ENDPOINTS.PATIENTS.LIST}?maxLevel=level2`),
        axios.get(`${API_ENDPOINTS.PATIENTS.LIST}?maxLevel=level1`),
        axios.get(`${API_ENDPOINTS.PATIENTS.LIST}`)
      ];
  
      const [icuRes, wardRes, dischargeRes, allRes] = await Promise.all(requests);
      
      setTabCounts({
        icu: icuRes.data.totalElements || 0,
        ward: wardRes.data.totalElements || 0,
        discharge: dischargeRes.data.totalElements || 0,
        all: allRes.data.totalElements || 0
      });
    } catch (error) {
      console.error('탭 카운트 로드 실패:', error);
      setTabCounts({
        icu: 0,
        ward: 0,
        discharge: 0,
        all: 0
      });
    }
  }, []);

  const fetchPredictionData = useCallback(async () => {
    try {
      const result = await axios.get(API_ENDPOINTS.PATIENTS.PREDICTION);
      setPredictionData(result.data);
    } catch (error) {
      setPredictionData({
        DISCHARGE: 35,
        WARD: 45,
        ICU: 20
      });
      console.error("예측 데이터 로드 실패:", error);
    }
  }, []);

  const fetchLabTests = useCallback(async (stay_id) => {
    try {
      const result = await axios.get(`${API_ENDPOINTS.LAB_TESTS}/${stay_id}`);
      if (result.status === 404) {
        console.log(`No lab tests found for stay_id: ${stay_id}`);
        return null;
      }
      return result.data;
    } catch (error) {
      if (error.response?.status === 404) {
        console.log(`No lab tests found for stay_id: ${stay_id}`);
        return null;
      }
      console.error("Lab tests 데이터 로드 실패:", error);
      return null;
    }
  }, []);

  // AI 배치 예측 가져오는 함수
  const fetchVisitInfo = useCallback(async (subject_id) => {
    try {
      const result = await axios.get(
        `${API_ENDPOINTS.DETAILS}/${subject_id}/details`
      );
      
      if (result.data?.visits?.length > 0) {
        const formattedData = {
          ...result.data,
          visits: result.data.visits.map(visit => ({
            ...visit,
            vitalSigns: (visit.vitalSigns || []).map(sign => ({
              ...sign,
              level1: sign.level1,
              level2: sign.level2,
              level3: sign.level3,
              wardCode: sign.wardCode
            }))
          }))
        };
        setVisitInfo(formattedData);
        return formattedData;
      }
      
      setVisitInfo(result.data);
      return result.data;
    } catch (error) {
      console.error("방문 정보 데이터 로드 실패:", error);
      setVisitInfo(null);
      return null;
    }
  }, []);

  // =========== 이벤트 핸들러 ===========
  const handleTASClick = useCallback(async (entry) => {
    try {
      // AI_TAS dot 클릭 처리
      if (entry.id || entry.id === 'all') {  // 'all' 체크 추가
        const maxLevelMapping = {
          'icu': 'level3',
          'ward': 'level2',
          'discharge': 'level1'
        };
        
        // 같은 탭을 다시 클릭한 경우 전체 탭으로 돌아가기
        if (activeTab === entry.id) {
          setActiveTab('all');
          const newFilters = { 
            ...filters,
            maxLevel: undefined,
            tas: '' 
          };
          setKtasFilter([]);
          setFilters(newFilters);
          setCurrentPage(0);
          await fetchFilteredData(0, newFilters);
          return;
        }
  
        // 전체 탭 클릭 시
        if (entry.id === 'all') {
          setActiveTab('all');
          const newFilters = {
            ...filters,
            maxLevel: undefined,
            tas: ''
          };
          setKtasFilter([]);
          setFilters(newFilters);
          setCurrentPage(0);
          await fetchFilteredData(0, newFilters);
          return;
        }
  
        const maxLevel = maxLevelMapping[entry.id];
        if (maxLevel) {
          setActiveTab(entry.id);
          const newFilters = { 
            ...filters,
            maxLevel,
            tas: ''
          };
          setKtasFilter([]);
          setFilters(newFilters);
          setCurrentPage(0);
          await fetchFilteredData(0, newFilters);
          return;
        }
      }

      // KTAS dot 클릭 처리 (기존 로직)
      let level;
      let newFilter = [];

      if (entry.name === "미사용") {
        setKtasFilter([]);
        const newFilters = { ...filters, tas: '' };
        setFilters(newFilters);
        setCurrentPage(0);
        await fetchFilteredData(0, newFilters);
        return;
      }

      if (typeof entry.name === 'string' && entry.name.includes('KTAS')) {
        level = parseInt(entry.name.split(" ")[1]);
      } else if (typeof entry.value === 'number') {
        level = entry.value;
      } else {
        console.error("Invalid KTAS entry:", entry);
        return;
      }

      const currentTas = filters.tas ? parseInt(filters.tas) : null;
      const newTas = currentTas === level ? '' : level.toString();

      if (newTas) {
        newFilter = [level];
      }
      
      setKtasFilter(newFilter);
      const newFilters = { ...filters, tas: newTas };
      setFilters(newFilters);
      setCurrentPage(0);
      await fetchFilteredData(0, newFilters);

    } catch (error) {
      console.error("TAS 필터링 오류:", error);
    }
  }, [filters, fetchFilteredData, activeTab]);

  const handlePageChange = useCallback(async (newPage) => {
    if (newPage >= 0 && newPage < totalPages && !isPageChanging) {
      try {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
  
        abortControllerRef.current = new AbortController();
        setIsPageChanging(true);
        setCurrentPage(newPage);
  
        await fetchFilteredData(newPage, filters, abortControllerRef.current.signal);
      } finally {
        setIsPageChanging(false);
      }
    }
  }, [totalPages, filters, fetchFilteredData, isPageChanging]);

  const handleSearch = useCallback(async (term) => {
    setSearchTerm(term);
    try {
      await fetchFilteredData(0, {
        ...filters,
        searchTerm: term?.trim() || ''
      });
    } catch (error) {
      console.error('Search failed:', error);
    }
  }, [filters, fetchFilteredData]);

  // =========== 인증 관련 함수 ===========
  const checkSession = useCallback(async () => {
    try {
      const result = await axios.get(API_ENDPOINTS.AUTH.CHECK_SESSION, { 
        withCredentials: true 
      });
      if (result.data.isAuthenticated) {

        const username = result.data.user?.name;
        if (username) {
          setUserName(username);
          console.log("Username set to:", username);
        }
  
        if (!isAuthenticated) {
          handleAuthenticationSuccess(result.data.user.position);
        }
      } else if (isAuthenticated) {
        handleLogout();
      }
    } catch (error) {
      handleLogout();
    }
  }, [isAuthenticated]);

  const logout = useCallback(async () => {
    try {
      await axios.get(API_ENDPOINTS.AUTH.LOGOUT, { withCredentials: true });
      handleLogout();
    } catch (error) {
      console.error("로그아웃 실패:", error);
      handleLogout();
    }
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setPosition(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("position");
  }, []);

  const handleAuthenticationSuccess = useCallback((userPosition) => {
    setIsAuthenticated(true);
    setPosition(userPosition);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("position", userPosition);

    if (userPosition === "관리자") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/";
    }
  }, []);

  // 배치 후 데이터 업데이트 함수
  const handlePatientDataUpdate = useCallback(async (updatedPatientData) => {
    try {
      // 환자 목록 데이터 갱신
      const updatedPatients = patients.map(patient => 
        patient.subjectId === updatedPatientData.subjectId 
          ? {
              ...patient,
              visits: updatedPatientData.visits.map(visit => ({
                ...visit,
                label: visit.label,
                comment: visit.comment,
                statstatus: visit.label // label 값을 statstatus에도 반영
              }))
            }
          : patient
      );
      
      setPatients(updatedPatients);
      setFilteredPatients(updatedPatients);
  
      // 탭 카운트, KTAS 데이터, 예측 데이터 모두 새로고침
      await Promise.all([
        fetchAllTabCounts(), // 탭 카운트 업데이트 추가
        fetchKtasData(),
        fetchPredictionData()
      ]);
  
      // 현재 활성 탭에 따라 데이터 다시 필터링
      const currentFilters = { ...filters };
      if (activeTab !== 'all') {
        const maxLevelMapping = {
          'icu': 'level3',
          'ward': 'level2',
          'discharge': 'level1'
        };
        currentFilters.maxLevel = maxLevelMapping[activeTab];
      }
      
      await fetchFilteredData(currentPage, currentFilters);
  
    } catch (error) {
      console.error("환자 데이터 업데이트 실패:", error);
    }
  }, [
    patients, 
    fetchKtasData, 
    fetchPredictionData, 
    fetchAllTabCounts,
    fetchFilteredData,
    filters,
    activeTab,
    currentPage
  ]);

  // =========== Effect Hooks ===========
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // 초기 데이터 로드
  useEffect(() => {
    let isSubscribed = true;
  
    const fetchInitialData = async () => {
      if (!isAuthenticated || !isSubscribed) return;
  
      try {
        setLoading(true);
        await Promise.all([
          fetchFilteredData(currentPage),
          fetchKtasData(),
          fetchPredictionData(),
          fetchAllTabCounts()  // 추가
        ]);
      } catch (error) {
        console.error("초기 데이터 로드 실패:", error);
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };
  
    fetchInitialData();
    
    return () => {
      isSubscribed = false;
    };
  }, [isAuthenticated]); // currentPage 의존성 제거


  // 자동 새로고침
  useEffect(() => {
    if (!isAuthenticated) return;

    const autoRefresh = setInterval(() => {
      fetchFilteredData(currentPage);
      fetchKtasData();
      fetchPredictionData();
      fetchAllTabCounts();
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(autoRefresh);
}, [isAuthenticated, currentPage, fetchFilteredData, fetchKtasData, fetchPredictionData, fetchAllTabCounts]);

  // console.log("App_labTests", labTests);
  // console.dir("App_fetchLabTests", fetchLabTests);
  // =========== 렌더링 ===========
  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            <React.Suspense fallback={null}>
                <Login onLogin={checkSession} />
              </React.Suspense>
            }
          /> 
        <Route
          path="/"
          element={
            isAuthenticated ? (
              position ? (
                position === "일반" ? (
                  <React.Suspense fallback={null}>
                    <MainPage
                      searchTerm={searchTerm}
                      allPatients={patients}
                      patients={filteredPatients}
                      ktasData={ktasData}
                      predictionData={predictionData}
                      ktasFilter={ktasFilter}
                      loading={loading}
                      error={error}
                      handleSearch={handleSearch}
                      onTASClick={handleTASClick}
                      onFilteredPatientsUpdate={fetchFilteredData}
                      labTests={labTests}
                      visitInfo={visitInfo}
                      fetchLabTests={fetchLabTests}
                      fetchVisitInfo={fetchVisitInfo}
                      logout={logout}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalElements={totalElements}
                      onPageChange={handlePageChange}
                      userName={userName}
                      onPatientDataUpdate={handlePatientDataUpdate}
                      activeTab={activeTab}
                      tabCounts={tabCounts}
                    />
                  </React.Suspense>
                ) : (
                  <Navigate to="/admin" replace />
                )
              ) : null
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin"
          element={
            isAuthenticated && position === "관리자" ? (
              <React.Suspense fallback={null}>
                <AdminAPP 
                  logout={logout}
                  userName={userName} 
                />
              </React.Suspense>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;