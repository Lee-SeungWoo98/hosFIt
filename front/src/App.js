/**
 * App.js
 * 메인 애플리케이션 컴포넌트
 * 데이터 상태 관리 및 API 통신을 담당
 */
import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";

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

// API 엔드포인트 상수
const API_ENDPOINTS = {
  CHECK_SESSION: "http://localhost:8082/boot/member/checkSession",
  LOGOUT: "http://localhost:8082/boot/member/logout",
  PATIENTS: "http://localhost:8082/boot/patients/byStaystatus",
  BEDS: "http://localhost:8082/boot/patients/bybed",
  PREDICTION: "http://localhost:8082/boot/patients/prediction",
  LAB_TESTS: "http://localhost:8082/boot/labtests",
  VISITS: "http://localhost:8082/boot/patients"
};

// 초기 필터 상태
const INITIAL_FILTERS = {
  gender: '',
  tas: '',
  painScore: '',
  sort: {
    key: 'visitDate',
    direction: 'desc'
  }
};

function App() {
  // =========== 상태 관리 ===========
  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // 인증 상태
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [position, setPosition] = useState(
    localStorage.getItem("position") || "null"
  );

  // UI 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 데이터 상태
  const [ktasData, setKtasData] = useState(null);
  const [totalBed] = useState(48);
  const [ktasFilter, setKtasFilter] = useState([]);
  const [labTests, setLabTests] = useState(null);
  const [visitInfo, setVisitInfo] = useState(null);
  const [predictionData, setPredictionData] = useState(null);

  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // =========== API 통신 함수 ===========
  /**
   * 통합된 데이터 조회 함수
   * 필터링, 정렬, 검색 조건을 모두 포함
   */
  const fetchFilteredData = useCallback(async (page = 0, currentFilters = filters) => {
    try {
      const queryParams = new URLSearchParams({
        page,
        sort: currentFilters.sort?.key || 'visitDate',
        direction: currentFilters.sort?.direction || 'desc',
        ...(searchTerm && { name: searchTerm }),
        ...(currentFilters.gender && { gender: currentFilters.gender }),
        ...(currentFilters.tas && { tas: currentFilters.tas }),
        ...(currentFilters.painScore && { painScore: currentFilters.painScore })
      });

      const result = await axios.get(
        `${API_ENDPOINTS.PATIENTS}?${queryParams}`
      );

      if (Array.isArray(result.data.patients)) {
        handleFetchDataSuccess(result.data);
      }
    } catch (error) {
      handleFetchDataError(error);
    }
  }, [searchTerm, filters]);

  /**
 * 환자 데이터 포맷팅 함수
 * 서버에서 받은 환자 데이터를 프론트엔드에서 사용할 수 있는 형식으로 변환
 */
const formatPatientData = (patient) => {
  if (!patient) return null;

  // ICD 결정
  let icd = '-';
  if (patient.icd) {
    icd = patient.icd;
  } else if (patient.visits?.[0]?.icd) {
    icd = patient.visits[0].icd;
  } else if (patient.visits?.[0]?.patient?.icd) {
    icd = patient.visits[0].patient.icd;
  }

  return {
    ...patient,
    gender: patient?.gender ?? 'N/A',
    name: patient?.name ?? 'Unknown',
    icd: icd,
    visits: patient.visits?.map(visit => ({
      ...visit,
      icd: visit.icd || icd || visit.patient?.icd || '-'
    }))
  };
};

  /**
   * 데이터 조회 성공 처리
   */
  const handleFetchDataSuccess = useCallback((data) => {
    const updatedPatients = data.patients
      .map(formatPatientData)
      .filter(Boolean);
    
    setPatients(updatedPatients);
    setFilteredPatients(updatedPatients);
    setTotalPages(data.totalPages);
    setTotalElements(data.totalElements);
    setError(null);
  }, []);

  /**
   * 데이터 조회 실패 처리
   */
  const handleFetchDataError = useCallback((error) => {
    setError("데이터 로드 실패:" + error.message);
    setPatients([]);
    setFilteredPatients([]);
    setTotalPages(1);
  }, []);

  /**
   * KTAS 데이터 조회
   */
  const fetchKtasData = useCallback(async () => {
    try {
      const result = await axios.get(API_ENDPOINTS.BEDS);
      const valueArray = Object.values(result.data);
      setKtasData({
        totalBeds: totalBed,
        usedBeds: totalBed - valueArray.reduce((acc, cur) => acc + cur, 0),
        ktasRatios: valueArray,
      });
    } catch (error) {
      console.error("KTAS 데이터 로드 실패:", error);
      setKtasData({
        totalBeds: 100,
        usedBeds: 75,
        ktasRatios: [10, 20, 30, 25, 15],
      });
    }
  }, [totalBed]);

  /**
   * 예측 데이터 조회
   */
  const fetchPredictionData = useCallback(async () => {
    try {
      const result = await axios.get(API_ENDPOINTS.PREDICTION);
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

  // =========== 이벤트 핸들러 ===========
  const handleFilterUpdate = useCallback(async (newFilters) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: 0,
      });
  
      // 검색어 추가
      if (searchTerm?.trim()) {
        queryParams.append('name', searchTerm.trim());
      }
  
      // 정렬 조건 추가
      if (newFilters.sort?.key) {
        queryParams.append('sort', newFilters.sort.key);
        queryParams.append('direction', newFilters.sort.direction || 'desc');
      }
  
      // 필터 조건 추가
      if (newFilters.gender) {
        queryParams.append('gender', newFilters.gender);
      }
      if (newFilters.tas) {
        queryParams.append('TAS', newFilters.tas);
      }
      if (newFilters.painScore) {
        queryParams.append('painScore', newFilters.painScore);
      }
  
      const response = await axios.get(
        `${API_ENDPOINTS.PATIENTS}/byStaystatus?${queryParams.toString()}`
      );
  
      if (response.data.patients) {
        // 필터 상태 업데이트
        setFilters(newFilters);
        
        // 데이터 업데이트
        const formattedData = response.data.patients.map(formatPatientData).filter(Boolean);
        setPatients(formattedData);
        setFilteredPatients(formattedData);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
        setCurrentPage(0);
      }
    } catch (error) {
      console.error('필터링 실패:', error);
      setError("데이터 로드 실패: " + error.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, formatPatientData]);

/**
 * TAS 클릭 핸들러
 */
const handleTASClick = useCallback(async (entry) => {
  if (entry.name === "미사용") {
    setKtasFilter([]);
    await handleFilterUpdate({ ...filters, tas: '' });
    return;
  }

  const level = parseInt(entry.name.split(" ")[1]);
  
  setKtasFilter(prev => {
    const newFilter = prev.length === 1 && prev[0] === level ? [] : [level];
    const newFilters = {
      ...filters,
      tas: newFilter.length ? level.toString() : ''
    };

    handleFilterUpdate(newFilters);
    return newFilter;
  });
}, [filters, handleFilterUpdate]);

/**
 * 검색 핸들러
 */
const handleSearch = useCallback(async (term) => {
  setSearchTerm(term);
  await handleFilterUpdate({ ...filters });
}, [filters, handleFilterUpdate]);

  /**
   * 페이지 변경 핸들러
   */
  const handlePageChange = useCallback(async (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      await fetchFilteredData(newPage);
    }
  }, [totalPages, fetchFilteredData]);

 // =========== 인증 관련 함수 ===========
  /**
   * 세션 체크 함수
   */
  const checkSession = useCallback(async () => {
    try {
      const result = await axios.get(API_ENDPOINTS.CHECK_SESSION, { 
        withCredentials: true 
      });

      if (result.data.isAuthenticated && !isAuthenticated) {
        handleAuthenticationSuccess(result.data.user.position);
      } else if (!result.data.isAuthenticated && isAuthenticated) {
        handleLogout();
      }
    } catch (error) {
      handleLogout();
    }
  }, [isAuthenticated]);

  /**
   * 로그아웃 처리 함수
   */
  const logout = useCallback(async () => {
    try {
      await axios.get(API_ENDPOINTS.LOGOUT, { withCredentials: true });
      handleLogout();
    } catch (error) {
      console.error("로그아웃 실패:", error);
      handleLogout();
    }
  }, []);

  /**
   * 로그아웃 상태 처리
   */
  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setPosition(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("position");
  }, []);

  /**
   * 인증 성공 처리
   */
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

  // =========== 데이터 조회 함수 ===========
  /**
   * Lab Tests 데이터 조회
   */
  const fetchLabTests = useCallback(async (stay_id) => {
    try {
      const result = await axios.get(`${API_ENDPOINTS.LAB_TESTS}/${stay_id}`);
      setLabTests(result.data);
      return result.data;
    } catch (error) {
      console.error("Lab tests 데이터 로드 실패:", error);
      setLabTests(null);
      return null;
    }
  }, []);

  /**
   * 방문 정보 조회
   */
  const fetchVisitInfo = useCallback(async (subject_id) => {
    try {
      const result = await axios.get(
        `${API_ENDPOINTS.VISITS}/${subject_id}/visits`
      );
      setVisitInfo(result.data);
      return result.data;
    } catch (error) {
      console.error("Vital signs 데이터 로드 실패:", error);
      setVisitInfo(null);
      return null;
    }
  }, []);

  // =========== Effect Hooks ===========
  // 초기 세션 체크
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // 데이터 자동 새로고침
  useEffect(() => {
    if (isAuthenticated) {
      const fetchAllData = async () => {
        try {
          await Promise.all([
            fetchFilteredData(currentPage),
            fetchKtasData(),
            fetchPredictionData()
          ]);
        } catch (error) {
          console.error("데이터 로드 중 오류:", error);
        }
      };

      fetchAllData();
      const intervalId = setInterval(fetchAllData, 600000); // 10분마다 갱신
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, currentPage, fetchFilteredData, fetchKtasData, fetchPredictionData]);

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
                      onFilteredPatientsUpdate={handleFilterUpdate}
                      labTests={labTests}
                      visitInfo={visitInfo}
                      fetchLabTests={fetchLabTests}
                      fetchVisitInfo={fetchVisitInfo}
                      logout={logout}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      totalElements={totalElements}
                      onPageChange={handlePageChange}
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
                <AdminAPP logout={logout} />
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