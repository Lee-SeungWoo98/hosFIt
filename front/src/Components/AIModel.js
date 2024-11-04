import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Save, Download, AlertTriangle, Info } from 'lucide-react';
import './styles/AIModel.css';

const AIModel = ({ showNotification }) => {
  const [scores, setScores] = useState({
    icu: 75,
    ward: 45,
    discharge: 25,
  });
  const [selectedPeriod, setSelectedPeriod] = useState("7");

  // 성능 데이터
  const performanceData = [
    { day: "10/18", accuracy: 92.5, precision: 91.2, recall: 93.8 },
    { day: "10/19", accuracy: 93.1, precision: 92.0, recall: 94.2 },
    { day: "10/20", accuracy: 93.8, precision: 92.8, recall: 94.8 },
    { day: "10/21", accuracy: 94.2, precision: 93.5, recall: 95.0 },
    { day: "10/22", accuracy: 94.5, precision: 93.8, recall: 95.2 },
    { day: "10/23", accuracy: 94.3, precision: 93.6, recall: 95.0 },
    { day: "10/24", accuracy: 94.5, precision: 93.9, recall: 95.3 },
  ];

  // 모델 업데이트 이력
  const modelHistory = [
    {
      date: "2024-10-24",
      version: "v2.1.0",
      accuracy: "94.5%",
      precision: "93.9%",
      recall: "95.3%",
      changes: "LSTM 레이어 최적화",
      status: "active",
    },
    {
      date: "2024-10-15",
      version: "v2.0.1",
      accuracy: "93.2%",
      precision: "92.5%",
      recall: "94.0%",
      changes: "데이터 전처리 개선",
      status: "inactive",
    },
    {
      date: "2024-09-30",
      version: "v2.0.0",
      accuracy: "92.8%",
      precision: "91.8%",
      recall: "93.8%",
      changes: "새로운 모델 아키텍처 적용",
      status: "inactive",
    },
  ];

  const handleScoreChange = (type, value) => {
    setScores((prev) => ({
      ...prev,
      [type]: parseInt(value) || '',
    }));
  };

  const handleSaveSettings = () => {
    showNotification('설정이 저장되었습니다.', 'success');
  };

  const exportToCSV = () => {
    const headers = ['날짜', '버전', '정확도', '정밀도', '재현율', '변경사항', '상태'];
    const csvContent = [
      headers.join(','),
      ...modelHistory.map((item) =>
        [item.date, item.version, item.accuracy, item.precision, item.recall, item.changes, item.status].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `AI_모델_리포트_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('CSV 파일이 생성되었습니다.', 'success');
  };

  return (
    <div className="wrapper">
      {/* 헤더 정보 */}
      <div className="header-info">
        마지막 업데이트: 2024-10-25 10:30:00
        <button className="refresh-btn">새로고침</button>
      </div>

      {/* 알림 박스 */}
      <div className="notice-box">
        <AlertTriangle className="notice-icon" />
        <span className="notice-title">주의</span>
        <p className="notice-text">
          입실/퇴원 기준 점수를 변경하면 환자 배치에 직접적인 영향을 미칩니다. 신중하게 검토 후 변경해주세요.
        </p>
      </div>

      {/* 점수 설정 섹션 */}
      <section className="score-section">
        <h2>입실/퇴원 기준 점수 설정</h2>
        <span className="last-modified">마지막 수정: 2024-10-24 15:30</span>
        <div className="score-content">
          {['icu', 'ward', 'discharge'].map((type, idx) => (
            <div className="score-group" key={idx}>
              <label>{type === 'icu' ? 'ICU 입실 기준점수' : type === 'ward' ? '일반병동 입실 기준점수' : '퇴원 기준점수'}</label>
              <div className="input-box">
                <input
                  type="number"
                  value={scores[type]}
                  onChange={(e) => handleScoreChange(type, e.target.value)}
                />
                <span className="unit">점</span>
              </div>
              <div className="score-info">
                <Info className="info-icon" />
                <span>
                  {type === 'icu' ? '75점 이상시 ICU 입실 권장' : type === 'ward' ? '45~74점시 병동 입실 권장' : '25점 이하시 퇴원 권장'}
                </span>
              </div>
            </div>
          ))}
        </div>
        <button className="save-btn" onClick={handleSaveSettings}>
          설정 저장
        </button>
      </section>

      {/* 모델 성능 모니터링 */}
      <section className="model-section">
        <h2>모델 성능 모니터링</h2>
        <select
          className="period-select"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <option value="7">최근 7일</option>
          <option value="14">최근 14일</option>
          <option value="30">최근 30일</option>
        </select>
        <div className="performance-chart">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[90, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="accuracy" name="정확도" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="precision" name="정밀도" stroke="#16a34a" strokeWidth={2} />
              <Line type="monotone" dataKey="recall" name="재현율" stroke="#dc2626" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 모델 업데이트 이력 */}
      <section className="model-history">
        <div className="history-header">
          <h3>모델 업데이트 이력</h3>
          <button className="export-btn" onClick={exportToCSV}>
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
              {modelHistory.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.version}</td>
                  <td>{item.accuracy}</td>
                  <td>{item.precision}</td>
                  <td>{item.recall}</td>
                  <td>{item.changes}</td>
                  <td className={`status ${item.status}`}>{item.status === 'active' ? '활성' : '비활성'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AIModel;
