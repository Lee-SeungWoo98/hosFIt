import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { useScores } from "./ScoreContext";
import "./styles/Dashboard.css";

const Dashboard = ({ loading, onTabChange }) => {
  // onTabChange prop 추가
  const { scores } = useScores();

  // AI 모델 관리 탭으로 이동하는 핸들러
  const handleSettingsClick = () => {
    onTabChange("model"); // 사이드바의 AI 모델 관리 탭 활성화
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-title">
          <h1>대시보드</h1>
          <span className="last-update">
            마지막 업데이트: 2024-10-25 10:30:00
          </span>
        </div>
        <button className="refresh-button">새로고침</button>
      </div>

      <div className="metrics-grid">
        {/* AI 퇴실배치 일치도 */}
        <div className="metric-card">
          <div className="metric-header">
            <h3>AI 퇴실배치 일치도</h3>
            <div className="trend-badge positive">
              <TrendingUp size={16} />
              <span>1.2%</span>
            </div>
          </div>
          <div className="metric-value">85.5%</div>
          <div className="metric-target">목표: 90%</div>
        </div>

        {/* 일일 응급실 내원 환자 */}
        <div className="metric-card">
          <div className="metric-header">
            <h3>일일 응급실 내원 환자</h3>
            <div className="trend-badge positive">
              <TrendingUp size={16} />
              <span>12.5%</span>
            </div>
          </div>
          <div className="metric-value">127명</div>
          <div className="metric-target">전일 대비</div>
        </div>

        {/* 입실기준 점수 */}
        <div className="metric-card">
          <div className="metric-header">
            <h3>입실기준 점수</h3>
            <button className="settings-button" onClick={handleSettingsClick}>
              설정
            </button>
          </div>

          <div className="scores-grid">
            <div className="score-box icu">
              <span className="score-label">ICU</span>
              <div className="score-value">≥ {scores.icu}</div>
              <span className="score-unit">점</span>
            </div>

            <div className="score-box ward">
              <span className="score-label">일반병동</span>
              <div className="score-value">{scores.ward}</div>
              <span className="score-unit">점</span>
            </div>

            <div className="score-box discharge">
              <span className="score-label">퇴원</span>
              <div className="score-value">≤ {scores.discharge}</div>
              <span className="score-unit">점</span>
            </div>
          </div>

          <div className="settings-note">
            <AlertCircle size={16} />
            <span>설정 변경은 AI 모델 관리에서 가능합니다</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
