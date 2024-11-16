import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import { Download } from "lucide-react";
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
import "./styles/ChartSection.css";

// Chart.js 구성 요소 등록
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

const ChartSection = ({ monthlyData, distributionData, options }) => {
  // 차트 다운로드 핸들러
  const handleDownload = (chartId) => {
    const canvas = document.getElementById(chartId);
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `chart_${chartId}_${new Date().toISOString()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="admin-charts-container">
      {/* 월별 입실 현황 차트 */}
      <div className="admin-chart-card">
        <div className="admin-chart-header">
          <h3>월별 입실 현황</h3>
          <div className="admin-chart-actions">
            <select className="admin-chart-period">
              <option>최근 6개월</option>
              <option>최근 12개월</option>
            </select>
          </div>
        </div>
        <div className="admin-chart-wrapper" style={{ maxHeight: "300px" }}>
          <Line
            id="monthlyChart"
            data={monthlyData}
            options={{
              ...options,
              maintainAspectRatio: false,
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 20,
                  grid: {
                    color: "#f1f5f9",
                  },
                  ticks: {
                    callback: (value) => `${value}%`,
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* 병동별 분포 차트 */}
      <div className="admin-chart-card">
        <div className="admin-chart-header">
          <h3>병동별 분포</h3>
          <div className="admin-chart-actions">
            <button
              className="admin-chart-download"
              onClick={() => handleDownload("distributionChart")}
            >
              <Download className="icon" />
            </button>
          </div>
        </div>
        <div className="admin-chart-wrapper" style={{ maxHeight: "300px", width: "100%" }}>
          <Doughnut
            id="distributionChart"
            data={distributionData}
            options={{
              ...options,
              maintainAspectRatio: false,
              responsive: true,
              cutout: "60%",
              plugins: {
                ...options.plugins,
                legend: {
                  position: "right",
                  labels: {
                    boxWidth: 12,
                    padding: 15,
                    font: {
                      size: 12,
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
