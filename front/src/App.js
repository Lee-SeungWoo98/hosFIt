import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./Components/Header";
import List from "./Components/list"; // List 컴포넌트 import
import "./Components/list.css";
import "./Components/Header.css";
import "./Components/Ktas.css";
import "./Components/SearchBar.css";
import axios from "axios";

function App() {
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [patients, setPatients] = useState([]); // 서버에서 받아온 환자 목록
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리
  const [ktasData, setKtasData] = useState(null); // KTAS 데이터

  // 서버로부터 필터링된 데이터를 가져오는 함수
  const fetchFilteredPatients = async (term) => {
    setLoading(true);
    setError(null);
    try {
      // 검색어가 있을 경우 필터링된 데이터를 요청
      const result = await axios.get(
        `http://localhost:8082/boot/patients?name=${term}`
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
    setError(null);
    try {
      const result = await axios.get("http://localhost:8082/boot/patients");
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
      setError("KTAS 데이터 로드 실패: " + error.message);
    }
  };

  // 페이지 로드 시 전체 데이터를 가져오고, 검색어에 맞춰 서버에서 필터링된 데이터 가져오기
  useEffect(() => {
    if (searchTerm) {
      fetchFilteredPatients(searchTerm); // 검색어가 있으면 필터링된 데이터 요청
    } else {
      fetchData(); // 검색어가 없으면 전체 데이터를 요청
    }
    fetchKtasData(); // KTAS 데이터를 함께 요청

    // 주기적으로 전체 데이터를 불러오기 (1분 마다)
    const intervalId = setInterval(() => {
      fetchData();
      fetchKtasData();
    }, 60000);
    

    // 컴포넌트가 언마운트될 때 인터벌 제거
    return () => clearInterval(intervalId);
  }, [searchTerm]); // searchTerm이 변경될 때마다 요청

  const handleSearch = (term) => {
    setSearchTerm(term); // 검색어 상태 업데이트
  };

  return (
    <div className="app">
      <Header onSearch={handleSearch} ktasData={ktasData} /> {/* 검색어 상태 전달 , KTAS 데이터 전달*/}
      <div className="main-content">
        <div className="content-wrapper">
          <div className="content">
            {loading && <p>로딩 중...</p>}
            {error && <p>{error}</p>}
            <List searchTerm={searchTerm} patients={patients} /> {/* 검색어와 환자 데이터 전달 */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
