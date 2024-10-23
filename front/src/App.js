import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Login from "./Components/Login";
import MainPage from "./Components/MainPage"; // MainPage로 분리하여 임포트

import "./App.css";
import "./Components/list.css";
import "./Components/Header.css";
import "./Components/Ktas.css";
import "./Components/SearchBar.css";

function App() {
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [patients, setPatients] = useState([]); // 서버에서 받아온 환자 목록
  const [filteredPatients, setFilteredPatients] = useState([]); // 필터링된 환자 목록 상태 추가
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  ); // 로컬 스토리지로 로그인 상태 관리
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리
  const [ktasData, setKtasData] = useState(null); // KTAS 데이터
  const [tasLevel, setTasLevel] = useState(null); // 선택된 TAS 레벨 저장

  // 서버에서 세션 정보를 통해 로그인 상태를 확인하는 함수
  const checkSession = async () => {
    try {
      const result = await axios.get(
        "http://localhost:8082/boot/checkSession",
        { withCredentials: true }
      );
      if (result.data.isAuthenticated) {
        setIsAuthenticated(true); // 서버로부터 로그인 상태 확인
        localStorage.setItem("isAuthenticated", "true"); // 로컬 스토리지에 저장
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated"); // 로그인 안 된 경우 로컬 스토리지에서 제거
      }
    } catch (error) {
      setIsAuthenticated(false); // 에러 발생 시 로그인 상태를 false로 설정
      localStorage.removeItem("isAuthenticated"); // 에러 발생 시 로컬 스토리지에서 제거
    }
  };

  // 페이지가 로드될 때 세션 상태 확인
  useEffect(() => {
    checkSession(); // 처음 로딩 시 세션 확인
  }, []);

  // 서버로부터 필터링된 데이터를 가져오는 함수
  const fetchFilteredPatients = async (term) => {
    setLoading(true);
    setError(null);
    try {
      // 검색어가 있을 경우 필터링된 데이터를 요청
      const result = await axios.get(
        `http://localhost:8082/boot/patients/=${term}`
      );
      setPatients(result.data);
    } catch (error) {
      setError("App.js_데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 페이지 로드 시 처음 전체 데이터를 가져오는 함수
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await axios.get(
        "http://localhost:8082/boot/patients/5/visits"
      );
      console.log("Fetched data:", result.data); // 데이터 확인
      if (Array.isArray(result.data)) {
        setPatients(result.data); // 배열일 때만 설정
      } else {
        setPatients([result.data]); // 단일 객체면 배열로 감싸서 설정
      }
      if (tasLevel) {
        const filtered = result.data.filter(
          (patient) => patient.tas === parseInt(tasLevel)
        );
        setFilteredPatients(filtered);
      } else {
        setFilteredPatients(result.data); // 처음에는 전체 환자 목록을 표시
      }
    } catch (error) {
      setError("App.js_데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // KTAS 데이터를 가져오는 함수
  const fetchKtasData = async () => {
    try {
      const result = await axios.get("http://localhost:8082/boot/beds"); // KTAS 관련 데이터 요청
      setKtasData(result.data); // KTAS 데이터 저장
    } catch (error) {
      console.error("KTAS 데이터 로드 실패:", error);
      // KTAS 데이터를 가져오지 못했을 때에도 기본값을 설정
      setKtasData({
        totalBeds: 100,
        usedBeds: 75,
        ktasRatios: [10, 20, 30, 25, 15],
      });
    }
  };
  // TAS 클릭 핸들러 추가
  const handleTASClick = (tasLevel) => {
    if (tasLevel.includes("미사용")) {
      alert("미사용은 필터링 없어용");
      return;
    } // '미사용'일 경우 함수 실행 중단
    const level = tasLevel.split(" ")[1]; // 'KTAS 1', 'KTAS 2' 등에서 숫자만 추출
    alert(`KTAS : ${level}`);
    // 환자 목록 필터링
    const filtered = patients.filter(patient => {
      // visits 배열이 존재하고, 첫 번째 요소의 tas 값을 사용하여 필터링
      return patient.visits.length > 0 && patient.visits[0].tas === parseInt(level);
    });
    setFilteredPatients(filtered); // 필터링된 환자 목록 설정
    setTasLevel(level); // 현재 선택된 TAS 레벨 저장
  };

  // 리스트 데이터 요청
  useEffect(() => {
    if (searchTerm) {
      fetchFilteredPatients(searchTerm); // 검색어가 있으면 필터링된 데이터 요청
    } else {
      fetchData(); // 검색어가 없으면 전체 데이터를 요청
    }

    // 주기적으로 리스트 데이터를 불러오기 (1분 마다)
    const intervalId = setInterval(() => {
      fetchData(); // 리스트 데이터만 주기적으로 요청
    }, 60000);

    // 컴포넌트가 언마운트될 때 인터벌 제거
    return () => clearInterval(intervalId);
  }, [searchTerm]);

  // KTAS 데이터는 별도의 useEffect로 관리
  useEffect(() => {
    fetchKtasData(); // KTAS 데이터를 별도로 주기적으로 요청

    const intervalId = setInterval(() => {
      fetchKtasData();
    }, 60000); // 1분마다 KTAS 데이터 요청

    return () => clearInterval(intervalId);
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term); // 검색어 상태 업데이트
  };

  const handleLogin = () => {
    checkSession(); // 로그인 성공 시 세션 상태 확인
  };

  return (
    <Router>
      <Routes>
        {/* 로그인 페이지 */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* 메인 화면: 로그인된 경우에만 접근 가능 */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <MainPage
                searchTerm={searchTerm}
                patients={filteredPatients} // 필터링된 환자 목록 전달
                ktasData={ktasData}
                loading={loading}
                error={error} // error 상태도 함께 전달
                handleSearch={handleSearch}
                onTASClick={handleTASClick} // TAS 클릭 핸들러 전달
              />
            ) : (
              <Navigate to="/login" /> // 로그인되지 않은 경우 로그인 페이지로 리디렉션
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
