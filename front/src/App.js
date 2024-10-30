import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
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
  
  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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
        // 각 환자 데이터에서 gender 기본값 설정
        const updatedPatients = result.data.patients.map(patient => {
          if (!patient) return null;
          return {
            ...patient,
            gender: patient?.gender ?? 'N/A',  // gender 필드가 없으면 기본값 설정
            name: patient?.name ?? 'Unknown',  // name 필드가 없으면 기본값 설정
          };
        }).filter(patient => patient !== null); // null 값 제거
        setPatients(updatedPatients);
        setFilteredPatients(updatedPatients);
        setTotalPages(result.data.totalPages);
      } else {
        setPatients([]);
        setFilteredPatients([]);
        setTotalPages(1);
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

  const fetchLabTests = async (stay_id) => {
    console.log(`fetchLabTests 호출됨: stay_id = ${stay_id}`);
    try {
      const result = await axios.get(
        `http://localhost:8082/boot/labtests/${stay_id}`
      );
      setLabTests(result.data); // 피검사 데이터 설정
      return result.data; // 데이터 반환
    } catch (error) {
      console.error("Lab tests 데이터 로드 실패:", error); // 오류 로그 출력
      setLabTests(null); // 오류 시 null로 설정
      return null; // 오류 발생 시 null 반환
    }
  };
  
  const fetchVisitInfo = async (subject_id) => {
    console.log(`fetchVisitInfo 호출됨: subject_id = ${subject_id}`);
    try {
      const result = await axios.get(
        `http://localhost:8082/boot/patients/${subject_id}/visits`
      );
      setVisitInfo(result.data); // 방문 정보 설정
      return result.data; // 데이터 반환
    } catch (error) {
      console.error("Vital signs 데이터 로드 실패:", error); // 오류 로그 출력
      setVisitInfo(null); // 오류 시 null로 설정
      return null; // 오류 발생 시 null 반환
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
    
    if (term.trim()) {
      try {
        const queryParams = new URLSearchParams({
          name: term,
          page: 0,
          ...filters
        });

        const result = await axios.get(
          `http://localhost:8082/boot/patients/search?${queryParams}`
        );
        
        // 각 환자 데이터에서 gender 기본값 설정
        const updatedPatients = result.data.patients.map(patient => {
          if (!patient) return null;
          return {
            ...patient,
            gender: patient?.gender ?? 'N/A',  // gender 필드가 없으면 기본값 설정
            name: patient?.name ?? 'Unknown',  // name 필드가 없으면 기본값 설정
          };
        }).filter(patient => patient !== null); // null 값 제거
        setPatients(updatedPatients);
        setFilteredPatients(updatedPatients);
        setTotalPages(result.data.totalPages);
      } catch (error) {
        setError("검색 실패:" + error.message);
        setPatients([]);
        setFilteredPatients([]);
        setTotalPages(1);
      }
    } else {
      fetchData(0);
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
    console.log("체크했다.");
  }, []);

  // 데이터 자동 새로고침
  useEffect(() => {
    if (isAuthenticated) {
      const fetchAllData = async () => {
        try {
          await fetchData(currentPage);
          await fetchKtasData();
        } catch (error) {
          console.error("데이터 로드 중 오류:", error);
        }
      };

      fetchAllData();
      const intervalId = setInterval(fetchAllData, 600000); // 10분마다 갱신
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated]);

  // =========== 렌더링 ===========
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              position ? (
                position === "일반" ? (
                  <MainPage
                    searchTerm={searchTerm}
                    allPatients={patients}
                    patients={filteredPatients}
                    ktasData={ktasData}
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
                    onPageChange={handlePageChange}
                  />
                ) : (
                  <Navigate to="/admin" />
                )
              ) : null
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/admin"
          element={
            isAuthenticated && position === "관리자" ? (
              <AdminAPP logout={logout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
