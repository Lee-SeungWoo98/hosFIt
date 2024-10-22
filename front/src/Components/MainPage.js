import React from "react";
import { useLocation } from "react-router-dom";  // useLocation을 MainPage에서 사용
import Header from "./Header";  // Header 컴포넌트
import List from "./list";  // List 컴포넌트


function MainPage({ searchTerm, patients, ktasData, loading, error, handleSearch }) {
    const location = useLocation();  // 로그인 페이지에서 전달된 state 받아오기
    const username = location.state?.username || "익명 사용자";  // username이 전달되었는지 확인
    
    return (
      <div className="app">
        <Header onSearch={handleSearch} ktasData={ktasData} username={username} />
        <div className="main-content">
          {loading ? (
            <p>로딩 중...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <List searchTerm={searchTerm} patients={patients} />
          )}
        </div>
      </div>
    );
  }

export default MainPage;
