import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Save, Download } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "./styles/AIModel.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AIModel = () => {
  const [scoreThreshold, setScoreThreshold] = useState(40);
  const [selectedPeriod, setSelectedPeriod] = useState("7");

  const performanceData = {
    labels: ["1일", "2일", "3일", "4일", "5일", "6일", "7일"],
    datasets: [
      {
        label: "정확도",
        data: [92.5, 93.1, 93.8, 94.2, 94.5, 94.3, 94.5],
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const modelHistory = [
    {
      date: "2024-10-24",
      version: "v2.1.0",
      accuracy: "94.5%",
      changes: "LSTM 레이어 최적화",
      status: "active",
    },
    {
      date: "2024-10-15",
      version: "v2.0.1",
      accuracy: "93.2%",
      changes: "데이터 전처리 개선",
      status: "inactive",
    },
    {
      date: "2024-09-30",
      version: "v2.0.0",
      accuracy: "92.8%",
      changes: "새로운 모델 아키텍처 적용",
      status: "inactive",
    },
  ];

  const handleSaveSettings = () => {
    // 설정 저장 로직
  };

  const handleExportHistory = () => {
    // 히스토리 내보내기 로직
  };

  return (
    <div className="adminai-model">
      <section className="model-settings">
        <div className="settings-header">
          <h3>ICU 점수 설정</h3>
          <span className="last-modified">마지막 수정: 2024-10-24 15:30</span>
        </div>

        <div className="score-settings">
          <div className="setting-item">
            <label htmlFor="scoreThreshold">ICU 입실 기준점수</label>
            <div className="input-group">
              <input
                type="number"
                id="scoreThreshold"
                value={scoreThreshold}
                onChange={(e) => setScoreThreshold(e.target.value)}
                min="0"
                max="100"
              />
              <span className="unit">점</span>
            </div>
            <div className="threshold-info">
              <div className="info-icon">ⓘ</div>
              <span>현재 설정: {scoreThreshold}점 이상 시 ICU 입실 권장</span>
            </div>
          </div>

          <button className="save-btn" onClick={handleSaveSettings}>
            <Save className="icon" />
            설정 저장
          </button>
        </div>
      </section>

      <section className="model-performance">
        <div className="performance-header">
          <h3>예측 성능 모니터링</h3>
          <div className="period-selector">
            <button
              className={selectedPeriod === "7" ? "active" : ""}
              onClick={() => setSelectedPeriod("7")}
            >
              7일
            </button>
            <button
              className={selectedPeriod === "30" ? "active" : ""}
              onClick={() => setSelectedPeriod("30")}
            >
              30일
            </button>
            <button
              className={selectedPeriod === "90" ? "active" : ""}
              onClick={() => setSelectedPeriod("90")}
            >
              90일
            </button>
          </div>
        </div>

        <div className="performance-chart">
          <Line
            data={performanceData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: (value) => `${value}%`,
                  },
                },
              },
            }}
          />
        </div>
      </section>

      <section className="model-history">
        <div className="history-header">
          <h3>모델 업데이트 이력</h3>
          <button className="export-btn" onClick={handleExportHistory}>
            <Download className="icon" />
            내보내기
          </button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>날짜</th>
                <th>버전</th>
                <th>정확도</th>
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
                  <td>{item.changes}</td>
                  <td>
                    <span className={`status ${item.status}`}>
                      {item.status === "active" ? "활성" : "비활성"}
                    </span>
                  </td>
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
