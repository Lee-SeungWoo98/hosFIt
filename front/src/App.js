import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import Login from "./Components/Login";
import MainPage from "./Components/MainPage";  // MainPage로 분리하여 임포트

import "./App.css";
import "./Components/list.css";
import "./Components/Header.css";
import "./Components/Ktas.css";
import "./Components/SearchBar.css";


function App() {
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [patients, setPatients] = useState([]); // 서버에서 받아온 환자 목록
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 서버에서 받아온 로그인 상태
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리
  const [ktasData, setKtasData] = useState(null); // KTAS 데이터

  // 서버에서 세션 정보를 통해 로그인 상태를 확인하는 함수
  const checkSession = async () => {
    try {
      const result = await axios.get("http://localhost:8082/boot/checkSession", { withCredentials: true });
      setIsAuthenticated(result.data.isAuthenticated); // 서버로부터 로그인 상태 확인
    } catch (error) {
      setIsAuthenticated(false); // 에러 발생 시 로그인 상태를 false로 설정
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
      const result = await axios.get(`http://localhost:8082/boot/patients/=${term}`);
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
    setError(null);
    try {
      const result = await axios.get("http://localhost:8082/boot/patients/5/visits");
      setPatients(result.data);
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
      setKtasData({ totalBeds: 0, usedBeds: 0, ktasRatios: [] });
    }
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
                patients={patients}
                ktasData={ktasData}
                loading={loading}
                error={error}
                handleSearch={handleSearch}
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
