/**
 * Ktas.js
 * KTAS 통계 및 예측 차트 컴포넌트
 * 도넛 차트와 반원 차트를 통해 KTAS 데이터와 AI 예측 데이터를 시각화
 */
import React, { useState, useCallback, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import "./Ktas.css";

// =========== 상수 정의 ===========
const KTAS_COLORS = [
  "#1A66FF",
  "#FF1A1A",
  "#FFEB1A",
  "#00E600",
  "#f3f3f3",
  "#d7d7d7"
];

const PREDICTION_COLORS = {
  DISCHARGE: "#ef4444",
  WARD: "#3b82f6",
  ICU: "#22c55e"
};

const Ktas = ({ ktasData, predictionData, onTASClick, ktasFilter }) => {
  // =========== 상태 관리 ===========
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredPredictionIndex, setHoveredPredictionIndex] = useState(null);

  // =========== 메모이제이션된 데이터 ===========
  /**
   * KTAS 차트 데이터 계산
   */
  const ktasChartData = useMemo(() => {
    const totalBeds = ktasData?.totalBeds || 0;
    const usedBeds = ktasData?.usedBeds || 0;
    const unusedBeds = totalBeds > 0 ? totalBeds - usedBeds : 0;
  
    // KTAS 레벨별 데이터 매핑
    const tasData = ktasData?.ktasRatios?.map((ratio, index) => ({
      name: `KTAS ${index + 1}`,
      value: ratio,
      beds: Math.round(ratio * totalBeds),  // 병상 수 계산
      color: KTAS_COLORS[index]
    })) || [];

    // 미사용 병상 데이터 추가
  return [
    ...tasData,
    { 
      name: "미사용", 
      value: unusedBeds / totalBeds,  // 비율로 변환
      beds: unusedBeds,               // 실제 병상 수
      color: "#DDDDDD" 
    }
  ];
}, [ktasData]);

  /**
   * 예측 차트 데이터 계산
   */
  const predictionChartData = useMemo(() => {
    if (!predictionData) return [];

    return [
      { name: "ICU", value: predictionData.ICU, color: PREDICTION_COLORS.ICU },
      { name: "WARD", value: predictionData.WARD, color: PREDICTION_COLORS.WARD },
      { name: "DISCHARGE", value: predictionData.DISCHARGE, color: PREDICTION_COLORS.DISCHARGE }
    ];
  }, [predictionData]);

  // =========== 이벤트 핸들러 ===========
  /**
   * KTAS 레이블 클릭 핸들러
   */
  const handleLabelClick = useCallback((entry) => {
    if (onTASClick && typeof onTASClick === 'function') {
      onTASClick(entry);
    }
  }, [onTASClick]);

  /**
   * 툴팁 표시 여부 확인
   */
  const shouldShowTooltip = useCallback((index, hoveredIdx, isActive) => {
    return hoveredIdx === index || (ktasFilter?.includes(index + 1) && isActive);
  }, [ktasFilter]);

  // =========== 레이블 렌더링 ===========
  /**
   * 레이블 렌더링
   */
  const renderLabels = useCallback((data, setHoverIndex, isKtas = true) => (
    <div className={isKtas ? "label-container" : "prediction-label-container"}>
      {data.map((entry, index) => {
        const isActive = isKtas && entry.name !== "미사용" && 
          ktasFilter?.includes(parseInt(entry.name.split(" ")[1]));
  
        return (
          <div
            key={`dot-${index}`}
            className={`${isKtas ? 'label-dot' : 'prediction-label-dot'} ${isActive ? 'active' : ''}`}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            onClick={() => isKtas && handleLabelClick(entry)}
          >
            <span className="ktas-label-text">{entry.name}</span>
            <div 
              className={`${isKtas ? 'label-tooltip' : 'prediction-label-tooltip'} ${
                shouldShowTooltip(index, hoveredIndex, isActive) ? 'visible' : ''
              }`}
            >
              {isKtas 
                ? `${entry.name} (${entry.beds}beds, ${(entry.value).toFixed(1)}%)`
                : `${entry.name} (${(entry.value).toFixed(1)}%)`
              }
            </div>
          </div>
        );
      })}
    </div>
  ), [hoveredIndex, ktasFilter, handleLabelClick, shouldShowTooltip]);

  // =========== 차트 렌더링 ===========
  /**
   * KTAS 도넛 차트 섹션 렌더링
   */
  const renderKtasChart = useCallback(() => (
    <section className="ktas-section">
      <h3 className="chart-title">KTAS 병상 점유율</h3>
      <div className="ktas-wrapper">
        <ResponsiveContainer width="100%" height={165}>
          <PieChart>
            <Pie
              data={ktasChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={48.5}
              outerRadius={75}
              paddingAngle={1.5}
              startAngle={90}
              endAngle={-270}
              isAnimationActive={true}
              animationBegin={44}
              animationDuration={800}
            >
              {ktasChartData.map((entry, index) => (
                <Cell
                  key={`ktas-cell-${index}`}
                  fill={entry.color}
                  stroke={hoveredIndex === index || 
                    (entry.name !== "미사용" && 
                     ktasFilter?.includes(parseInt(entry.name.split(" ")[1])))
                    ? "#000"
                    : "none"}
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${(value).toFixed(1)}%`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '0.75rem'
              }}
              animationDuration={300}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="label-container">
        {ktasChartData.map((entry, index) => {
          const isActive = entry.name !== "미사용" && 
            ktasFilter?.includes(parseInt(entry.name.split(" ")[1]));
  
          return (
            <div
              key={`dot-${index}`}
              className={`label-dot ${isActive ? 'active' : ''}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleLabelClick(entry)}
            >
              <span className="ktas-label-text">
                {entry.name}
              </span>
              {/* 호버 시에만 보이는 툴팁 */}
              <div 
                className={`label-tooltip ${shouldShowTooltip(index, hoveredIndex, isActive) ? 'visible' : ''}`}
              >
                {`${entry.name} (${entry.beds}beds, ${(entry.value).toFixed(1)}%)`}
              </div>
            </div>
          );
        })}
      </div>
      </section>
), [ktasChartData, hoveredIndex, ktasFilter, handleLabelClick, shouldShowTooltip]);

  /**
   * AI 예측 차트 섹션 렌더링
   */
  const renderPredictionChart = useCallback(() => (
    <section className="prediction-section">
      <h3 className="prediction-title">AI_TAS 배치 비율</h3>
      <div className="prediction-wrapper">
        <ResponsiveContainer width="100%" height={163}>
          <PieChart>
            <Pie
              data={predictionChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={48.5}
              outerRadius={75}
              paddingAngle={1.7}
              startAngle={90}
              endAngle={-270}
              isAnimationActive={true}
              animationBegin={44}
              animationDuration={800}
            >
              {predictionChartData.map((entry, index) => (
                <Cell
                  key={`prediction-cell-${index}`}
                  fill={entry.color}
                  stroke={hoveredPredictionIndex === index ? "#000" : "none"}
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${(value).toFixed(1)}%`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '0.75rem'
              }}
              animationDuration={300}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {renderLabels(predictionChartData, setHoveredPredictionIndex, false)}
    </section>
  ), [predictionChartData, hoveredPredictionIndex, renderLabels]);

  return (
    <div className="charts-container">
      {renderKtasChart()}
      {renderPredictionChart()}
    </div>
  );
};

export default React.memo(Ktas);