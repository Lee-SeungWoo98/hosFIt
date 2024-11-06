import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Save, Download, AlertTriangle, RotateCw } from 'lucide-react';
import { useScores } from './ScoreContext';
import './styles/AIModel.css';

const AIModel = () => {
  // 입실기준 점수 사용
  const { scores, updateScores } = useScores();

  // 모델 성능 데이터
  const performanceData = [
    { day: "10/18", accuracy: 92.5, precision: 91.2, recall: 93.8 },
    { day: "10/19", accuracy: 93.1, precision: 92.0, recall: 94.2 },
    { day: "10/20", accuracy: 93.8, precision: 92.8, recall: 94.8 },
    { day: "10/21", accuracy: 94.2, precision: 93.5, recall: 95.0 },
    { day: "10/22", accuracy: 94.5, precision: 93.8, recall: 95.2 },
    { day: "10/23", accuracy: 94.3, precision: 93.6, recall: 95.0 },
    { day: "10/24", accuracy: 94.5, precision: 93.9, recall: 95.3 }
  ];

  // 점수 변경 핸들러
  const handleScoreChange = (type, value) => {
    const newScores = {
      ...scores,
      [type]: parseInt(value) || 0
    };
    updateScores(newScores);
  };

  // 설정 저장 핸들러
  const handleSaveSettings = () => {
    alert('설정이 저장되었습니다.');
  };

  return (
    <div className="ai-model-container">
      <div className="page-header">
        <span className="last-update">마지막 업데이트: 2024-10-25 10:30:00</span>
        <button className="refresh-btn">
          <RotateCw size={16} />
          새로고침
        </button>
      </div>

      <div className="notice-box">
        <AlertTriangle size={16} className="notice-icon" />
        <p className="notice-text">
          입실/퇴원 기준 점수를 변경하면 환자 배치에 직접적인 영향을 미칩니다. 신중하게 검토 후 변경해주세요.
        </p>
      </div>

      {/* 점수 설정 섹션 */}
      <div className="settings-section card">
        <div className="section-header">
          <h2>입실/퇴원 기준 점수 설정</h2>
        </div>

        <div className="score-settings">
          {/* ICU 점수 설정 */}
          <div className="score-setting-item">
            <label className="score-label">ICU 입실</label>
            <div className="score-input-container">
              <input
                type="number"
                value={scores.icu}
                onChange={(e) => handleScoreChange('icu', e.target.value)}
                min="0"
                max="100"
                className="score-input"
              />
              <span className="score-unit">점</span>
            </div>
            <div className="score-info">
              ≥ {scores.icu}점
            </div>
          </div>

          {/* 일반병동 점수 설정 */}
          <div className="score-setting-item">
            <label className="score-label">일반병동</label>
            <div className="score-input-container">
              <input
                type="number"
                value={scores.ward}
                onChange={(e) => handleScoreChange('ward', e.target.value)}
                min="0"
                max="100"
                className="score-input"
              />
              <span className="score-unit">점</span>
            </div>
            <div className="score-info">
              {scores.ward}~{scores.icu - 1}점
            </div>
          </div>

          {/* 퇴원 점수 설정 */}
          <div className="score-setting-item">
            <label className="score-label">퇴원</label>
            <div className="score-input-container">
              <input
                type="number"
                value={scores.discharge}
                onChange={(e) => handleScoreChange('discharge', e.target.value)}
                min="0"
                max="100"
                className="score-input"
              />
              <span className="score-unit">점</span>
            </div>
            <div className="score-info">
              ≤ {scores.discharge}점
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button className="save-settings-btn" onClick={handleSaveSettings}>
            <Save size={16} />
            설정 저장
          </button>
        </div>
      </div>

      {/* 모델 성능 모니터링 섹션 */}
      <section className="model-section card">
        <div className="section-header">
          <h2>모델 성능 모니터링</h2>
          <select className="period-select">
            <option value="7">최근 7일</option>
            <option value="14">최근 14일</option>
            <option value="30">최근 30일</option>
          </select>
        </div>

        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[90, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="accuracy" name="정확도" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="precision" name="정밀도" stroke="#16a34a" strokeWidth={2} />
              <Line type="monotone" dataKey="recall" name="재현율" stroke="#dc2626" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 모델 업데이트 이력 */}
      <section className="model-history card">
        <div className="section-header">
          <h2>모델 업데이트 이력</h2>
          <button className="csv-btn">
            <Download size={16} />
            CSV 내보내기
          </button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>날짜</th>
                <th>버전</th>
                <th>정확도</th>
                <th>정밀도</th>
                <th>재현율</th>
                <th>변경사항</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024-10-24</td>
                <td>v2.1.0</td>
                <td>94.5%</td>
                <td>93.9%</td>
                <td>95.3%</td>
                <td className="change-cell">LSTM 레이어 최적화</td>
                <td>
                  <span className="status-badge active">활성</span>
                </td>
              </tr>
              <tr>
                <td>2024-10-15</td>
                <td>v2.0.1</td>
                <td>93.2%</td>
                <td>92.5%</td>
                <td>94.0%</td>
                <td className="change-cell">데이터 전처리 개선</td>
                <td>
                  <span className="status-badge inactive">비활성</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AIModel;