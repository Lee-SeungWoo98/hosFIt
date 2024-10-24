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
import AdminAPP from "./Components/AdminApp";
import "./App.css";
import "./Components/list.css";
import "./Components/Header.css";
import "./Components/Ktas.css";
import "./Components/SearchBar.css";


function App() {
  // 상태 관리
  const [searchTerm, setSearchTerm] = useState("");  // 검색어 상태 관리
  const [patients, setPatients] = useState([]);  // 전체 환자 데이터 저장
  const [filteredPatients, setFilteredPatients] = useState([]);  // 필터링된 환자 데이터 저장
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isAuthenticated") || "false");  // 로그인 상태 관리
  const [position, setPosition] = useState(localStorage.getItem("position") || null);  // 관리자 or 일반
  const [loading, setLoading] = useState(false);  // 로딩 상태 관리
  const [error, setError] = useState(null);  // 오류 상태 관리
  const [ktasData, setKtasData] = useState(null);  // KTAS 데이터를 저장
  const [totalBed, setToalBed] = useState(48);  // 총 병상(아직 노 아이디어)
  const [ktasFilter, setKtasFilter] = useState([]);  // KTAS 필터를 저장
  const [labTests, setLabTests] = useState(null);  // 피검사 결과 데이터를 저장
  const [visitInfo, setVisitInfo] = useState(null);  // 환자의 방문 정보를 저장
  
  // 세션 및 로그인 관련 함수
  const checkSession = async () => {
    try {
      const result = await axios.get("http://localhost:8082/boot/member/checkSession", { withCredentials: true });
      if (result.data.isAuthenticated) {
        setIsAuthenticated(true);  // 로그인 인증 성공 시 상태 업데이트
        setPosition(result.data.user.position);  // 로그인 성공 -> 권한 (일반, 관리자)
        localStorage.setItem("isAuthenticated", "true");  // localStorage에 인증 정보 저장
        localStorage.getItem("position", position);  // localStorage에 권한 정보 저장
      } else {
        setIsAuthenticated(false);  // 인증 실패 시 상태 업데이트
        setPosition(null);  // 로그아웃 -> 권한 비우기
        localStorage.removeItem("isAuthenticated");  // localStorage에서 인증 정보 제거
        localStorage.removeItem("positon");  // localStorage에서 권한 정보 제거
      }
    } catch (error) {
      setIsAuthenticated(false);  // 오류 발생 시 인증 상태 해제
      setPosition(null);  // 오류 -> 권한 비우기
      localStorage.removeItem("isAuthenticated");  // 인증 정보 제거
      localStorage.removeItem("positon");  // localStorage에서 권한 정보 제거
    }
  };

  const logout = async () =>{
    console.log("로그아웃");
    try{
      const result = await axios.get("http://localhost:8082/boot/member/logout");
    }catch(e){
      console.log("실패");
    }
  };

  useEffect(() => {
    checkSession();  // 컴포넌트가 처음 렌더링될 때 세션 확인
  }, []);

  const handleLogin = () => {
    checkSession();  // 로그인 후 세션 확인
  };

  // 데이터 관련 함수
  const fetchData = async () => {
    setLoading(true);  // 로딩 시작
    try {
      const result = await axios.get("http://localhost:8082/boot/patients/byStaystatus");  // 모든 환자
      if (Array.isArray(result.data)) {
        setPatients(result.data);  // 배열인 경우 전체 데이터 설정
        setFilteredPatients(result.data);  // 필터링된 데이터 설정
      } else {
        setPatients([result.data]);  // 단일 항목일 경우 배열로 설정
        setFilteredPatients([result.data]);  // 필터링된 데이터 설정
      }
    } catch (error) {
      setError("App.js_데이터 로드 실패:", error);  // 오류 처리
    } finally {
      setLoading(false);  // 로딩 종료
    }
  };

  const fetchKtasData = async () => {  // KTAS 데이터 요청
    try {
      const result = await axios.get("http://localhost:8082/boot/patients/bybed");
      const valueArray = Object.values(result.data);
      setKtasData({
        totalBeds : totalBed,
        usedBeds : totalBed - Object.values(result.data).reduce((acc, current) => acc + current, 0),
        ktasRatios : valueArray,

      });  // KTAS 데이터 설정
    } catch (error) {  // 데이터를 받아오지 못하면 임시 데이터 
      console.error("KTAS 데이터 로드 실패:", error);  // 오류 로그 출력
      setKtasData({
        totalBeds: 100,
        usedBeds: 75,
        ktasRatios: [10, 20, 30, 25, 15],
      });  // 기본값 설정
    }
  };

  const fetchLabTests = async (stay_id) => {
    try {
      const result = await axios.get(`http://localhost:8082/boot/labtests/${stay_id}`);
      setLabTests(result.data);  // 피검사 데이터 설정
      return result.data;  // 데이터 반환
    } catch (error) {
      console.error("Lab tests 데이터 로드 실패:", error);  // 오류 로그 출력
      setLabTests(null);  // 오류 시 null로 설정
      return null;  // 오류 발생 시 null 반환
    }
  };

  const fetchVisitInfo = async (subject_id) => {  // 활성 신호
    try {
      const result = await axios.get(`http://localhost:8082/boot/patients/${subject_id}/visits`);
      setVisitInfo(result.data);  // 방문 정보 설정
      return result.data;  // 데이터 반환
    } catch (error) {
      console.error("Vital signs 데이터 로드 실패:", error);  // 오류 로그 출력
      setVisitInfo(null);  // 오류 시 null로 설정
      return null;  // 오류 발생 시 null 반환
    }
  };

  // 필터 및 검색 관련 함수
  const fetchFilteredPatients = async (term) => {
    setLoading(true);  // 로딩 시작
    setError(null);  // 오류 초기화
    try {
      const result = await axios.get(`http://localhost:8082/boot/patients/search?name=${term}`);
      setPatients(result.data);  // 환자 데이터 설정
      setFilteredPatients(result.data);  // 필터링된 데이터 설정
    } catch (error) {
      setError("App.js_데이터 로드 실패:", error);  // 오류 처리
    } finally {
      setLoading(false);  // 로딩 종료
    }
  };

  const handleFilteredPatientsUpdate = (filters) => {
    let filtered = [...patients];  // 환자 데이터를 복사하여 필터링 준비

    if (filters.gender.length > 0) {
      filtered = filtered.filter(patient => filters.gender.includes(patient.gender));  // 성별 필터링 적용
    }

    if (filters.pregnancystatus.length > 0) {
      filtered = filtered.filter(patient => filters.pregnancystatus.includes(patient.pregnancystatus));  // 임신 여부 필터링 적용
    }

    if (filters.tas.length > 0) {
      filtered = filtered.filter(patient => 
        patient.visits?.[0]?.tas && filters.tas.map(t => String(t)).includes(String(patient.visits[0].tas))
      );  // TAS 레벨 필터링 적용
      setKtasFilter(filters.tas.map(t => parseInt(t)));  // KTAS 필터 업데이트
    } else {
      setKtasFilter([]);  // 필터가 없으면 초기화
    }

    if (filters.los_hours !== 'none') {
      filtered.sort((a, b) => {
        const aHours = parseFloat(a.visits?.[0]?.los_hours || 0);  // 체류 시간 비교
        const bHours = parseFloat(b.visits?.[0]?.los_hours || 0);
        return filters.los_hours === 'asc' ? aHours - bHours : bHours - aHours;  // 오름차순 또는 내림차순 정렬
      });
    }

    setFilteredPatients(filtered);  // 필터링된 결과 저장
  };

  const handleTASClick = (tasLevel) => {
    
    if (tasLevel.includes("미사용")) {
      setKtasFilter([]);  // 미사용 선택 시 필터 초기화
      setFilteredPatients(patients);  // 필터링 없이 전체 데이터 설정
      return;
    }
    
    const level = tasLevel.split(" ")[1];  // TAS 레벨 추출
    const numericLevel = parseInt(level);  // 정수로 변환

    setKtasFilter(prev => {
      let newFilter;
      if (prev.includes(numericLevel)) {
        newFilter = prev.filter(l => l !== numericLevel);  // 선택된 레벨 제거
      } else {
        newFilter = [...prev, numericLevel];  // 새로운 레벨 추가
      }

      const filtered = patients.filter(patient => {
        return newFilter.length === 0 || 
               (patient.visits?.[0]?.tas && newFilter.includes(patient.visits[0].tas));  // 필터링된 환자 반환
      });
      setFilteredPatients(filtered);  // 필터링된 결과 설정

      return newFilter;  // 새로운 필터 반환
    });
  };

  useEffect(() => {
    if (searchTerm) {
      fetchFilteredPatients(searchTerm);  // 검색어가 있을 때 필터링된 환자 데이터 가져옴
    } else {
      fetchData();  // 검색어가 없을 때 전체 환자 데이터 가져옴
    }

    const intervalId = setInterval(() => {
      fetchData();  // 1분마다 데이터 새로고침
    }, 60000);

    return () => clearInterval(intervalId);  // 컴포넌트가 사라질 때 interval 정리
  }, [searchTerm]);

  useEffect(() => {
    fetchKtasData();  // KTAS 데이터 가져오기
    const intervalId = setInterval(fetchKtasData, 60000);  // 1분마다 KTAS 데이터 새로고침
    return () => clearInterval(intervalId);  // 컴포넌트가 사라질 때 interval 정리
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);  // 검색어 업데이트
  };

  return (
    <Router>
      <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />  {/* 로그인 경로 설정 */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
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
                logout = {logout}
              />
            ) : (
              <Navigate to="/admin" /> // 관리자는 /admin으로 리디렉션
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/admin"
        element={
          isAuthenticated && position === "관리자" ? (
            <AdminAPP/>
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
