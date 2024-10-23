import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import List from "./list";

function MainPage({ 
  searchTerm, 
  allPatients,
  patients, 
  ktasData, 
  loading, 
  error, 
  handleSearch,
  onFilteredPatientsUpdate 
}) {
  const location = useLocation();
  const username = location.state?.username || "익명 사용자";

  return (
    <div className="app">
      <Header 
        onSearch={handleSearch} 
        ktasData={ktasData} 
        username={username}
      />
      <div className="main-content">
        {loading ? (
          <p>로딩 중...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <List 
            searchTerm={searchTerm}
            allPatients={allPatients}
            patients={patients}
            onFilteredPatientsUpdate={onFilteredPatientsUpdate}
          />
        )}
      </div>
    </div>
  );
}

export default MainPage;