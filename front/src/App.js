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

import "./App.css";
import "./Components/list.css";
import "./Components/Header.css";
import "./Components/Ktas.css";
import "./Components/SearchBar.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ktasData, setKtasData] = useState(null);
  const [ktasFilter, setKtasFilter] = useState([]); // 배열로 변경
  
  const checkSession = async () => {
    try {
      const result = await axios.get(
        "http://localhost:8082/boot/checkSession",
        { withCredentials: true }
      );
      if (result.data.isAuthenticated) {
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
      }
    } catch (error) {
      setIsAuthenticated(false);
      localStorage.removeItem("isAuthenticated");
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const fetchFilteredPatients = async (term) => {
    setLoading(true);
    setError(null);
    try {
      const result = await axios.get(
        `http://localhost:8082/boot/patients/=${term}`
      );
      setPatients(result.data);
      setFilteredPatients(result.data);
    } catch (error) {
      setError("App.js_데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await axios.get(
        "http://localhost:8082/boot/patients/list"
      );
      if (Array.isArray(result.data)) {
        setPatients(result.data);
        setFilteredPatients(result.data);
      } else {
        setPatients([result.data]);
        setFilteredPatients([result.data]);
      }
    } catch (error) {
      setError("App.js_데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKtasData = async () => {
    try {
      const result = await axios.get("http://localhost:8082/boot/beds");
      setKtasData(result.data);
    } catch (error) {
      console.error("KTAS 데이터 로드 실패:", error);
      setKtasData({
        totalBeds: 100,
        usedBeds: 75,
        ktasRatios: [10, 20, 30, 25, 15],
      });
    }
  };

  const handleFilteredPatientsUpdate = (filters) => {
    let filtered = [...patients];
    
    // 성별 필터링
    if (filters.gender.length > 0) {
      filtered = filtered.filter(patient => 
        filters.gender.includes(patient.gender)
      );
    }

    // 임신 여부 필터링
    if (filters.pregnancystatus.length > 0) {
      filtered = filtered.filter(patient => 
        filters.pregnancystatus.includes(patient.pregnancystatus)
      );
    }

    // TAS 레벨 필터링 수정
    if (filters.tas.length > 0) {
      filtered = filtered.filter(patient => 
        patient.visits?.[0]?.tas && 
        filters.tas.map(t => String(t)).includes(String(patient.visits[0].tas))
      );
      // KTAS 필터 상태 업데이트
      setKtasFilter(filters.tas.map(t => parseInt(t)));
    } else {
      setKtasFilter([]);
    }

    // 체류 시간 정렬
    if (filters.los_hours !== 'none') {
      filtered.sort((a, b) => {
        const aHours = parseFloat(a.visits?.[0]?.los_hours || 0);
        const bHours = parseFloat(b.visits?.[0]?.los_hours || 0);
        return filters.los_hours === 'asc' ? aHours - bHours : bHours - aHours;
      });
    }

    setFilteredPatients(filtered);
  };

  const handleTASClick = (tasLevel) => {
    if (tasLevel.includes("미사용")) {
      setKtasFilter([]);
      setFilteredPatients(patients);
      return;
    }
    
    const level = tasLevel.split(" ")[1];
    const numericLevel = parseInt(level);
    
    setKtasFilter(prev => {
      let newFilter;
      if (prev.includes(numericLevel)) {
        // 이미 선택된 레벨이면 제거
        newFilter = prev.filter(l => l !== numericLevel);
      } else {
        // 새로운 레벨이면 추가
        newFilter = [...prev, numericLevel];
      }

      // 필터링된 환자 목록 업데이트
      const filtered = patients.filter(patient => {
        return newFilter.length === 0 || 
               (patient.visits?.[0]?.tas && 
                newFilter.includes(patient.visits[0].tas));
      });
      setFilteredPatients(filtered);

      return newFilter;
    });
  };

  useEffect(() => {
    if (searchTerm) {
      fetchFilteredPatients(searchTerm);
    } else {
      fetchData();
    }

    const intervalId = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [searchTerm]);

  useEffect(() => {
    fetchKtasData();
    const intervalId = setInterval(fetchKtasData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleLogin = () => {
    checkSession();
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/"
          element={
            isAuthenticated ? (
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
              />
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