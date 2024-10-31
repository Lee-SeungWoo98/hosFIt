// Ktas.js
import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./Ktas.css";

const Ktas = ({ ktasData, predictionData, onTASClick }) => {
  // 호버 상태 관리
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [secondHoveredIndex, setSecondHoveredIndex] = useState(null);

  // KTAS 데이터 처리
  const totalBeds = ktasData?.totalBeds || 0;
  const usedBeds = ktasData?.usedBeds || 0;
  const unusedBeds = totalBeds > 0 ? totalBeds - usedBeds : 0;

  // KTAS 레벨별 데이터 매핑
  const tasData = ktasData?.ktasRatios?.map((ratio, index) => ({
    name: `KTAS ${index + 1}`,
    value: ratio,
    color: ["#0000FF", "#FF0000", "#FFFF00", "#00FF00", "#FFFFFF"][index]
  })) || [];

  // KTAS 차트 데이터 구성
  const ktasChartData = [
    ...tasData,
    { name: "미사용", value: unusedBeds, color: "#DDDDDD" }
  ];

  // AI 예측 차트 데이터 구성
  const predictionChartData = predictionData ? [
    { name: "DISCHARGE", value: predictionData.DISCHARGE, color: "#FF9999" },
    { name: "WARD", value: predictionData.WARD, color: "#99FF99" },
    { name: "ICU", value: predictionData.ICU, color: "#9999FF" }
  ] : [];

  // 레이블 렌더링 함수 (KTAS)
  const renderLabels = (data, setHoverIndex) => (
    <div className="label-container">
      {data.map((entry, index) => (
        <div
          key={`dot-${index}`}
          className="label-dot"
          style={{ backgroundColor: entry.color }}
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(null)}
          onClick={() => entry.name !== "미사용" && onTASClick(entry)}
        >
          <div className="label-tooltip">
            {entry.name} ({entry.value})
          </div>
        </div>
      ))}
    </div>
  );

  // 레이블 렌더링 함수 (예측)
  const renderPredictionLabels = (data, setHoverIndex) => (
    <div className="prediction-label-container">
      {data.map((entry, index) => (
        <div
          key={`prediction-dot-${index}`}
          className="prediction-label-dot"
          style={{ backgroundColor: entry.color }}
          onMouseEnter={() => setHoverIndex(index)}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <div className="prediction-label-tooltip">
            {entry.name} ({entry.value})
          </div>
        </div>
      ))}
    </div>
  );

  // KTAS 도넛 차트 렌더링
  const renderKtasChart = () => (
    <div className="chart-container">
      <h3 className="chart-title">KTAS 병상 점유율</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={ktasChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={70}
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {ktasChartData.map((entry, index) => (
                <Cell
                  key={`ktas-cell-${index}`}
                  fill={entry.color}
                  stroke={hoveredIndex === index ? "#000" : "none"}
                  strokeWidth={hoveredIndex === index ? 3 : 0}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      {renderLabels(ktasChartData, setHoveredIndex)}
    </div>
  );

  // AI 예측 반원 차트 렌더링
  const renderPredictionChart = () => (
    <div className="prediction-container">
      <h3 className="prediction-title">AI 예측 환자 배치 비율</h3>
      <div className="prediction-wrapper">
        <ResponsiveContainer width="100%" height={120}>
          <PieChart>
            <Pie
              data={predictionChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={35}
              outerRadius={70}
              onMouseEnter={(_, index) => setSecondHoveredIndex(index)}
              onMouseLeave={() => setSecondHoveredIndex(null)}
            >
              {predictionChartData.map((entry, index) => (
                <Cell
                  key={`prediction-cell-${index}`}
                  fill={entry.color}
                  stroke={secondHoveredIndex === index ? "#000" : "none"}
                  strokeWidth={secondHoveredIndex === index ? 3 : 0}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      {renderPredictionLabels(predictionChartData, setSecondHoveredIndex)}
    </div>
  );

  return (
    <aside className="sidebar">
      {renderKtasChart()}
      {renderPredictionChart()}
    </aside>
  );
};

export default Ktas;