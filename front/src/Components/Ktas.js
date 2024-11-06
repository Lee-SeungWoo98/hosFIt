/**
 * Ktas.js
 * KTAS 통계 및 예측 차트 컴포넌트
 * 도넛 차트와 반원 차트를 통해 KTAS 데이터와 AI 예측 데이터를 시각화
 */
import React, { useState, useCallback, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "./Ktas.css";

// =========== 상수 정의 ===========
const KTAS_COLORS = ["#0000FF", "#FF0000", "#FFFF00", "#00FF00", "#FFFFFF"];
const PREDICTION_COLORS = {
  DISCHARGE: "#FF9999",
  WARD: "#99FF99",
  ICU: "#9999FF"
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

    console.log("total : ", totalBeds);
    console.log("use : ", usedBeds);
    console.log("unuse : ", unusedBeds);

    // KTAS 레벨별 데이터 매핑
    const tasData = ktasData?.ktasRatios?.map((ratio, index) => ({
      name: `KTAS ${index + 1}`,
      value: ratio,
      color: KTAS_COLORS[index]
    })) || [];

    // 미사용 병상 데이터 추가
    return [
      ...tasData,
      { name: "미사용", value: unusedBeds, color: "#DDDDDD" }
    ];
  }, [ktasData]);

  /**
   * 예측 차트 데이터 계산
   */
  const predictionChartData = useMemo(() => {
    if (!predictionData) return [];

    return [
      { name: "DISCHARGE", value: predictionData.DISCHARGE, color: PREDICTION_COLORS.DISCHARGE },
      { name: "WARD", value: predictionData.WARD, color: PREDICTION_COLORS.WARD },
      { name: "ICU", value: predictionData.ICU, color: PREDICTION_COLORS.ICU }
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

  // =========== 렌더링 함수 ===========
  /**
   * KTAS 레이블 렌더링
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
            style={{ 
              backgroundColor: entry.color,
              border: isActive ? '2px solid #000' : 'none'
            }}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            onClick={() => isKtas && handleLabelClick(entry)}
          >
            <span className="ktas-label-text">
              {entry.name}
            </span>
            <div 
              className={`${isKtas ? 'label-tooltip' : 'prediction-label-tooltip'} ${
                shouldShowTooltip(index, hoveredIndex, isActive) ? 'visible' : ''
              }`}
            >
              {entry.name} ({entry.value})
            </div>
          </div>
        );
      })}
    </div>
  ), [hoveredIndex, ktasFilter, handleLabelClick, shouldShowTooltip]);;

  /**
   * KTAS 도넛 차트 렌더링
   */
  const renderKtasChart = useCallback(() => (
    <div className="chart-container">
      <h3 className="chart-title">KTAS 병상 점유율</h3>
      <div className="ktas-wrapper">
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
                  stroke={hoveredIndex === index || 
                    (entry.name !== "미사용" && 
                     ktasFilter?.includes(parseInt(entry.name.split(" ")[1])))
                    ? "#000"
                    : "none"}
                  strokeWidth={hoveredIndex === index ? 3 : 2}
                  style={{ transition: 'stroke-width 0.2s ease' }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      {renderLabels(ktasChartData, setHoveredIndex)}
    </div>
  ), [ktasChartData, hoveredIndex, ktasFilter, renderLabels]);

  /**
   * AI 예측 반원 차트 렌더링
   */
  const renderPredictionChart = useCallback(() => (
    <div className="prediction-container">
      <h3 className="prediction-title">AI 예측 환자 배치 비율</h3>
      <div className="prediction-wrapper">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={predictionChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={70}
              onMouseEnter={(_, index) => setHoveredPredictionIndex(index)}
              onMouseLeave={() => setHoveredPredictionIndex(null)}
            >
              {predictionChartData.map((entry, index) => (
                <Cell
                  key={`prediction-cell-${index}`}
                  fill={entry.color}
                  stroke={hoveredPredictionIndex === index ? "#000" : "none"}
                  strokeWidth={hoveredPredictionIndex === index ? 3 : 2}
                  style={{ transition: 'stroke-width 0.2s ease' }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      {renderLabels(predictionChartData, setHoveredPredictionIndex, false)}
    </div>
  ), [predictionChartData, hoveredPredictionIndex, renderLabels]);

  return (
    <aside className="sidebar">
      {renderKtasChart()}
      {renderPredictionChart()}
    </aside>
  );
};

export default React.memo(Ktas);