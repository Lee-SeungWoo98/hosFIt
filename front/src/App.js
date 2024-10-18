import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./Components/Header";
import List from "./Components/list"; // List 컴포넌트 import
import "./Components/list.css";
import "./Components/Header.css";
import axios from "axios";

function App() {
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [patients, setPatients] = useState([]); // 서버에서 받아온 환자 목록

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("http://localhost:8082/boot/patients");
        setPatients(result.data);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="app">
      <Header onSearch={setSearchTerm} /> {/* 검색어 상태 전달 */}
      <div className="main-content">
        <div className="content-wrapper">
          <div className="content">
            <List searchTerm={searchTerm} patients={patients} /> {/* 검색어와 환자 데이터 전달 */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
