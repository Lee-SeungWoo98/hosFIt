import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import debounce from 'lodash/debounce';
import axios from "axios";
import Login from "./Components/Login";
import MainPage from "./Components/MainPage";
import AdminAPP from "./AdminAPP";
import "./App.css";
import "./Components/list.css";
import "./Components/Header.css";
import "./Components/Ktas.css";
import "./Components/SearchBar.css";

function App() {
  // =========== 상태 관리 ===========
  // 기본 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  
  // 인증 관련 상태
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
  const [totalBed, setTotalBed] = useState(48);
  const [ktasFilter, setKtasFilter] = useState([]);
  const [labTests, setLabTests] = useState(null);
  const [visitInfo, setVisitInfo] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  
  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // 필터 상태
  const [filters, setFilters] = useState({
    gender: '',
    tas: '',
    painScore: '',
  });

  // =========== 인증 관련 함수 ===========
  const checkSession = async () => {
    try {
      const result = await axios.get(
        "http://localhost:8082/boot/member/checkSession",
        { withCredentials: true }
      );
      if (result.data.isAuthenticated && !isAuthenticated) {
        setIsAuthenticated(true);
        setPosition(result.data.user.position);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("position", result.data.user.position);

        if (result.data.user.position === "관리자") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      } else if (!result.data.isAuthenticated && isAuthenticated) {
        handleLogout();
      }
    } catch (error) {
      handleLogout();
    }
  };

  const handleLogin = () => {
    checkSession();
  };

  const logout = async () => {
    try {
      console.log("로그아웃 시도");
      const result = await axios.get(
        "http://localhost:8082/boot/member/logout",
        { withCredentials: true }
      );
      console.log(result.data.message);
      handleLogout();
    } catch (error) {
      console.log("로그아웃 실패:", error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPosition(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("position");
  };

  // =========== 데이터 fetching 함수 ===========
  // KTAS 데이터 조회
  const fetchKtasData = async () => {
    try {
      const result = await axios.get(
        "http://localhost:8082/boot/patients/bybed"
      );
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
  };

  // AI 예측 데이터 조회
  const fetchPredictionData = async () => {
    try {
      const result = await axios.get(
        "http://localhost:8082/boot/patients/prediction"
      );
      setPredictionData(result.data);
    } catch (error) {
      console.error("예측 데이터 로드 실패:", error);
      setPredictionData({
        DISCHARGE: 35,
        WARD: 45,
        ICU: 20
      });
    }
  };

  // 환자 데이터 조회
  const fetchData = async (page = 0) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page,
        ...(searchTerm && { name: searchTerm }),
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.tas && { tas: filters.tas }),
        ...(filters.painScore && { painScore: filters.painScore })
      });
  
      const result = await axios.get(
        `http://localhost:8082/boot/patients/byStaystatus?${queryParams}`
      );
      
      if (Array.isArray(result.data.patients)) {
        const updatedPatients = result.data.patients.map(patient => {
          if (!patient) return null;
  
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
              icd: visit.icd || patient.icd || visit.patient?.icd || '-'
            }))
          };
        }).filter(patient => patient !== null);
        
        setPatients(updatedPatients);
        setFilteredPatients(updatedPatients);
        setTotalPages(result.data.totalPages);
        setTotalElements(result.data.totalElements);
      }
    } catch (error) {
      setError("데이터 로드 실패:" + error.message);
      setPatients([]);
      setFilteredPatients([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Lab Tests 데이터 조회
  const fetchLabTests = async (stay_id) => {
    try {
      const result = await axios.get(
        `http://localhost:8082/boot/labtests/${stay_id}`
      );
      setLabTests(result.data);
      return result.data;
    } catch (error) {
      console.error("Lab tests 데이터 로드 실패:", error);
      setLabTests(null);
      return null;
    }
  };
  
  // 방문 정보 조회
  const fetchVisitInfo = async (subject_id) => {
    try {
      const result = await axios.get(
        `http://localhost:8082/boot/patients/${subject_id}/visits`
      );
      setVisitInfo(result.data);
      return result.data;
    } catch (error) {
      console.error("Vital signs 데이터 로드 실패:", error);
      setVisitInfo(null);
      return null;
    }
  };

  // =========== 이벤트 핸들러 ===========
  const handlePageChange = async (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      await fetchData(newPage);
    }
  };

  const handleSearch = async (term) => {
    setSearchTerm(term);
    setCurrentPage(0);
  
    try {
      const queryParams = new URLSearchParams({
        page: 0,
        ...(term?.trim() && { name: term.trim() }),
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.tas && { tas: filters.tas }),
        ...(filters.painScore && { painScore: filters.painScore })
      });
  
      const result = await axios.get(
        `http://localhost:8082/boot/patients/byStaystatus?${queryParams}`
      );
      
      if (Array.isArray(result.data.patients)) {
        const updatedPatients = result.data.patients.map(patient => ({
          ...patient,
          gender: patient?.gender ?? 'N/A',
          name: patient?.name ?? 'Unknown',
        })).filter(Boolean);
  
        setPatients(updatedPatients);
        setFilteredPatients(updatedPatients);
        setTotalPages(result.data.totalPages);
        setError(null);
      }
    } catch (error) {
      console.error("검색 실패:", error);
      setError("검색 실패: " + error.message);
    }
  };

  const handleFilteredPatientsUpdate = (newFilters) => {
    setFilters(newFilters);
    fetchData(0);
  };

  const handleTASClick = async (entry) => {
    if (entry.name === "미사용") {
      setKtasFilter([]);
      setFilters(prev => ({ ...prev, tas: '' }));
      await fetchData(0);
      return;
    }
  
    const level = parseInt(entry.name.split(" ")[1]);
  
    setKtasFilter((prev) => {
      if (prev.length === 1 && prev[0] === level) {
        setFilters(prev => ({ ...prev, tas: '' }));
        fetchData(0);
        return [];
      } else {
        setFilters(prev => ({ ...prev, tas: level.toString() }));
        fetchData(0);
        return [level];
      }
    });
  };

  // =========== Effect Hooks ===========
  // 로그인 상태 감지
  useEffect(() => {
    if (isAuthenticated && position) {
      console.log("로그인 상태와 권한이 설정되었습니다:", position);
    }
  }, [isAuthenticated, position]);

  // 초기 세션 체크
  useEffect(() => {
    checkSession();
  }, []);

  // 데이터 자동 새로고침
  useEffect(() => {
    if (isAuthenticated) {
      const fetchAllData = async () => {
        try {
          await fetchData(currentPage);
          await fetchKtasData();
          await fetchPredictionData();
        } catch (error) {
          console.error("데이터 로드 중 오류:", error);
        }
      };

      fetchAllData();
      const intervalId = setInterval(fetchAllData, 600000); // 10분마다 갱신
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated]);

  console.log("admin", labTests);

  // =========== 렌더링 ===========
  return (
    <Router>
      <Routes>
        {/* Suspense로 페이지 전환 시 깜빡임 방지 */}
        <Route 
          path="/login" 
          element={
            <React.Suspense fallback={null}>
              <Login onLogin={handleLogin} />
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
                      onFilteredPatientsUpdate={handleFilteredPatientsUpdate}
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