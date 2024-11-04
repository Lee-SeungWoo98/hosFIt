/**
 * App.js
 * 환자 관리 애플리케이션의 메인 컴포넌트
 * 환자 목록 조회, 상세 정보 조회, 배치 결정 등의 기능 제공
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
  SEARCH_PATIENTS: "http://localhost:8082/boot/patients/search",  
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

/**
 * 환자 데이터 포맷팅 함수
 * 서버에서 받은 데이터를 프론트엔드에서 사용할 형식으로 변환
 */
const formatPatientData = (patient) => {
  if (!patient) return null;

  // ICD 디버깅 로그
  console.log('Patient data for ICD:', {
    patientICD: patient.icd,
    visitICD: patient.visits?.[0]?.icd,
    visitPatientICD: patient.visits?.[0]?.patient?.icd
  });

  // ICD 결정 로직
  let icd = '-';
  if (patient.icd) {
    icd = patient.icd;
  } else if (patient.visits?.[0]?.icd) {
    icd = patient.visits[0].icd;
  } else if (patient.visits?.[0]?.patient?.icd) {
    icd = patient.visits[0].patient.icd;
  }

  // 날짜 포맷팅 함수
  const formatVisitDate = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 5) return null;
    const [year, month, day, hour, minute] = dateArray;
    return new Date(year, month - 1, day, hour, minute);
  };

  return {
    ...patient,
    gender: patient?.gender ?? 'N/A',
    name: patient?.name ?? 'Unknown',
    icd: icd,
    visits: patient.visits?.map(visit => ({
      ...visit,
      visitDate: formatVisitDate(visit.visitDate),
      icd: visit.icd || icd || '-'
    }))
  };
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
      setLoading(true);
      const pageNumber = typeof page === 'object' ? 0 : page;
      
      if (pageNumber < 0 || (totalPages > 0 && pageNumber >= totalPages)) {
        return;
      }
  
      let url = `${API_ENDPOINTS.PATIENTS}?page=${pageNumber}`;
  
      const params = [];
      
      // 검색어 추가
      if (searchTerm?.trim()) {
        params.push(`name=${encodeURIComponent(searchTerm.trim())}`);
      }
  
      // 정렬 조건 추가
      if (currentFilters?.sort?.key) {
        params.push(`sort=${currentFilters.sort.key}`);
        params.push(`direction=${currentFilters.sort.direction || 'desc'}`);
      }
  
      // 필터 조건 추가
      if (currentFilters?.gender != null && currentFilters.gender !== '') {
        params.push(`gender=${currentFilters.gender}`);
      }
  
      if (currentFilters?.tas) {
        params.push(`tas=${currentFilters.tas}`);
      }
  
      if (currentFilters?.painScore) {
        params.push(`pain=${currentFilters.painScore}`);
      }
  
      // URL 생성
      if (params.length > 0) {
        url += '&' + params.join('&');
      }
  
      const response = await axios.get(url);
  
      if (response.data && response.data.patients) {
        const formattedData = response.data.patients.map(formatPatientData).filter(Boolean);
        setFilters(currentFilters);
        setPatients(formattedData);
        setFilteredPatients(formattedData);
        setTotalPages(response.data.totalPages || 1);
        setTotalElements(response.data.totalElements || formattedData.length);
        setCurrentPage(pageNumber);
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      setPatients([]);
      setFilteredPatients([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters, totalPages]);
  
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

 

  

  // =========== 이벤트 핸들러 ===========
  /**
   * TAS 클릭 핸들러
   */
  const handleTASClick = useCallback(async (entry) => {
    if (entry.name === "미사용") {
      setKtasFilter([]);
      const newFilters = { ...filters, tas: '' };
      setFilters(newFilters);
      await fetchFilteredData(0, newFilters);
      return;
    }
  
    const level = parseInt(entry.name.split(" ")[1]);
    
    setKtasFilter(prev => {
      const newFilter = prev.length === 1 && prev[0] === level ? [] : [level];
      const newFilters = {
        ...filters,
        tas: newFilter.length ? level.toString() : ''
      };
      setFilters(newFilters);
      fetchFilteredData(0, newFilters);
      return newFilter;
    });
  }, [filters, fetchFilteredData]);

  /**
   * 검색 핸들러
   */
  const handleSearch = useCallback(async (term) => {
    setSearchTerm(term);
    if (term?.trim()) {
      try {
        await fetchFilteredData(0, filters);
      } catch (error) {
        console.error('Search failed:', error);
      }
    }
  }, [filters, fetchFilteredData]);

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
      console.error("방문 정보 데이터 로드 실패:", error);
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
  const fetchAllData = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      
      // byStaystatus 요청만 수행하고, 나머지는 필요할 때만 호출하도록 변경
      await fetchFilteredData(currentPage);
  
    } catch (error) {
      console.error("데이터 로드 중 오류:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, currentPage, fetchFilteredData]); 
  
  useEffect(() => {
    if (!isAuthenticated) return;
    let isSubscribed = true;  // cleanup을 위한 flag
  
    const fetchData = async () => {
      if (!isSubscribed) return;
      try {
        setLoading(true);
        await Promise.all([
          fetchFilteredData(currentPage),
          fetchKtasData(),
          fetchPredictionData()
        ]);
      } catch (error) {
        console.error("데이터 로드 중 오류:", error);
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };
  
    fetchData();
    const intervalId = setInterval(fetchData, 600000);
  
    return () => {
      isSubscribed = false;
      clearInterval(intervalId);
    };
  }, [isAuthenticated, fetchFilteredData, fetchKtasData, fetchPredictionData]);

  // =========== 라우팅 및 렌더링 ===========
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