/**
 * Ktas.js
 * KTAS 통계 및 예측 차트 컴포넌트
 * 도넛 차트와 반원 차트를 통해 KTAS 데이터와 AI 예측 데이터를 시각화
 */
import React, { useState, useCallback, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import "./Ktas.css";

// =========== 상수 정의 ===========
const KTAS_COLORS = [
  "#3b82f6",    // Level 1 - 선명한 파란색
  "#ef4444",    // Level 2 - 선명한 빨간색
  "#fde047",    // Level 3 - 더 밝은 노란색 (수정됨)
  "#22c55e",    // Level 4 - 선명한 초록색
  "#e7e7e7",    // Level 5 - 회색 같은 하얀색 같은 무언가
  "#bbbbbb"     // 기타 - 더 회색
];

// PREDICTION_COLORS 상수 수정
const PREDICTION_COLORS = {
  DISCHARGE: "#22c55e",    // 퇴원
  WARD: "#3b82f6",        // 일반 병동
  ICU: "#ef4444"          // 중증 병동
};

const Ktas = ({ ktasData, predictionData, onTASClick, ktasFilter }) => {
  // =========== 상태 관리 ===========
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredPredictionIndex, setHoveredPredictionIndex] = useState(null);
  const [selectedDotIndex, setSelectedDotIndex] = useState(null); // 선택된 dot 인덱스 추가
  
// =========== 그라데이션 및 효과 정의 ===========
const renderGradients = () => (
  <defs>
    {/* KTAS 색상에 대한 그라데이션 */}
    <linearGradient id="ktas1" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#60a5fa" />
      <stop offset="50%" stopColor="#3b82f6" />
      <stop offset="100%" stopColor="#2563eb" />
    </linearGradient>
    <linearGradient id="ktas2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#f87171" />
      <stop offset="50%" stopColor="#ef4444" />
      <stop offset="100%" stopColor="#dc2626" />
    </linearGradient>
    <linearGradient id="ktas3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#fef08a" />
      <stop offset="50%" stopColor="#fde047" />
      <stop offset="100%" stopColor="#facc15" />
    </linearGradient>
    <linearGradient id="ktas4" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#4ade80" />
      <stop offset="50%" stopColor="#22c55e" />
      <stop offset="100%" stopColor="#16a34a" />
    </linearGradient>
    <linearGradient id="ktas5" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#f8f8f8" />
      <stop offset="50%" stopColor="#e7e7e7" />
      <stop offset="100%" stopColor="#d1d1d1" />
    </linearGradient>
    <linearGradient id="ktas6" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#d1d1d1" />
      <stop offset="50%" stopColor="#bbbbbb" />
      <stop offset="100%" stopColor="#a3a3a3" />
    </linearGradient>

    {/* 예측 차트 색상에 대한 그라데이션 */}
    <linearGradient id="predDISCHARGE" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#f87171" />
      <stop offset="50%" stopColor="#ef4444" />
      <stop offset="100%" stopColor="#dc2626" />
    </linearGradient>
    <linearGradient id="predWARD" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#60a5fa" />
      <stop offset="50%" stopColor="#3b82f6" />
      <stop offset="100%" stopColor="#2563eb" />
    </linearGradient>
    <linearGradient id="predICU" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#4ade80" />
      <stop offset="50%" stopColor="#22c55e" />
      <stop offset="100%" stopColor="#16a34a" />
    </linearGradient>

    {/* 그림자 및 글로우 효과 */}
    <filter id="shadow" height="150%" width="150%">
      <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.2" />
      <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
      <feOffset in="blur" dx="0" dy="2" result="offsetBlur" />
      <feComponentTransfer in="offsetBlur" result="darker">
        <feFuncA type="linear" slope="0.6" />
      </feComponentTransfer>
      <feMerge>
        <feMergeNode in="darker" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    {/* 호버 효과를 위한 광택 필터 */}
    <filter id="glow" height="150%" width="150%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
      <feColorMatrix in="blur" mode="matrix"
        values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 18 -7" result="glow" />
      <feMerge>
        <feMergeNode in="glow" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

// =========== 메모이제이션된 데이터 ===========
const ktasChartData = useMemo(() => {
  const totalBeds = ktasData?.totalBeds || 0;
  const usedBeds = ktasData?.usedBeds || 0;
  const unusedBeds = totalBeds > 0 ? totalBeds - usedBeds : 0;

  // KTAS 레벨별 데이터 매핑
  const tasData = ktasData?.ktasRatios?.map((ratio, index) => ({
    name: `KTAS ${index + 1}`,
    value: ratio,
    color: KTAS_COLORS[index]
  })) || [];

  // 미사용 병상 데이터 추가
  return tasData;
}, [ktasData]);

const predictionChartData = useMemo(() => {
  console.log('Received predictionData:', predictionData); // 디버깅 로그

  if (!predictionData) {
    console.log('No prediction data available');
    return [];
  }

  // 각 값이 존재하는지 확인하고 숫자가 아니면 0으로 설정
  const icu = (!isNaN(predictionData.ICU) && predictionData.ICU) || 0;
  const ward = (!isNaN(predictionData.WARD) && predictionData.WARD) || 0;
  const discharge = (!isNaN(predictionData.DISCHARGE) && predictionData.DISCHARGE) || 0;
  const total = icu + ward + discharge;

  console.log('Calculated values:', { icu, ward, discharge, total }); // 디버깅 로그

  if (!total) {
    console.log('Total is 0, returning empty array');
    return [];
  }

  const data = [
    { 
      name: "중증 병동", 
      value: (icu / total) * 100,
      rawCount: Math.round(icu),  // 반올림하여 정수로 저장
      tabId: "icu"
    },
    { 
      name: "일반 병동", 
      value: (ward / total) * 100,
      rawCount: Math.round(ward),  // 반올림하여 정수로 저장
      tabId: "ward"
    },
    { 
      name: "퇴원", 
      value: (discharge / total) * 100,
      rawCount: Math.round(discharge),  // 반올림하여 정수로 저장
      tabId: "discharge"
    }
  ];

  console.log('Generated chart data:', data); // 디버깅 로그
  return data;
}, [predictionData]);

// =========== 이벤트 핸들러 ===========
const handleLabelClick = useCallback((entry, event) => {
  // 기존 선택된 dot에서 클래스 제거
  document.querySelectorAll('.ktas-selected').forEach(el => {
    el.classList.remove('ktas-selected');
  });

  // 클릭된 dot에 선택 클래스 추가
  const ktasLevel = entry.name.split(' ')[1];
  const clickedDot = event.currentTarget;
  clickedDot.classList.add('ktas-selected');
  clickedDot.setAttribute('data-ktas', ktasLevel);

  if (onTASClick && typeof onTASClick === 'function') {
    onTASClick(entry);
  }
}, [onTASClick]);

// 툴팁 표시 여부를 결정하는 함수
const shouldShowTooltip = useCallback((index, hoveredIdx, isActive) => {
  if (typeof index !== 'number' || typeof hoveredIdx !== 'number') return false;
  return hoveredIdx === index || (ktasFilter?.includes(index + 1) && isActive);
}, [ktasFilter]);

const handlePredictionLabelClick = useCallback((entry) => {
  if (!entry || !onTASClick || typeof onTASClick !== 'function') {
    return;
  }

  try {
    // 현재 선택된 필터가 있고, 클릭한 것과 같다면 전체 탭으로 이동
    if (ktasFilter?.length > 0 && ktasFilter[0] === entry.tabId) {
      onTASClick({ name: "미사용" }); // 전체 탭으로 이동
      return;
    }

    // maxLevel 매핑
    const maxLevelMap = {
      icu: 'level3',
      ward: 'level2',
      discharge: 'level1'
    };

    const maxLevel = maxLevelMap[entry.tabId] || null;

    // 해당 탭으로 이동
    onTASClick({ 
      name: entry.name,
      tabId: entry.tabId,
      maxLevel
    });
  } catch (error) {
    console.error('Error in handlePredictionLabelClick:', error);
  }
}, [onTASClick, ktasFilter]);

// =========== 레이블 렌더링 ===========
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
          onClick={(event) => isKtas && handleLabelClick(entry, event)}
        >
          <span className="ktas-label-text">{entry.name}</span>
          <div 
            className={`${isKtas ? 'label-tooltip' : 'prediction-label-tooltip'} ${
              shouldShowTooltip(index, hoveredIndex, isActive) ? 'visible' : ''
            }`}
          >
            {`${entry.name} (${(entry.value).toFixed(1)}%)`}
          </div>
        </div>
      );
    })}
  </div>
), [hoveredIndex, ktasFilter, handleLabelClick, shouldShowTooltip]);
// =========== 차트 렌더링 ===========
const renderKtasChart = useCallback(() => (
  <section className="ktas-section">
    <h3 className="chart-title">KTAS 병상 점유율</h3>
    <div className="ktas-wrapper">
      <ResponsiveContainer width="100%" height={165}>
        <PieChart>
          {renderGradients()}
          <Pie
            data={ktasChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={48.5}
            outerRadius={75}
            paddingAngle={2}
            startAngle={90}
            endAngle={-270}
            isAnimationActive={true}
            animationBegin={44}
            animationDuration={800}
            filter="url(#shadow)"
          >
            {ktasChartData.map((entry, index) => (
              <Cell
                key={`ktas-cell-${index}`}
                fill={`url(#ktas${index + 1})`}
                stroke={hoveredIndex === index || 
                  (entry.name !== "미사용" && 
                   ktasFilter?.includes(parseInt(entry.name.split(" ")[1])))
                  ? "#000"
                  : "rgba(255,255,255,0.1)"}
                strokeWidth={hoveredIndex === index ? 2 : 1}
                filter={hoveredIndex === index ? "url(#glow)" : undefined}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${(value)}%`}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(229, 231, 235, 0.5)',
              borderRadius: '0.75rem',
              padding: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              fontSize: '0.875rem',
              fontWeight: '500'
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
            onClick={(event) => handleLabelClick(entry, event)}
          >
            <span className="ktas-label-text">
              {entry.name}
            </span>
            <div 
              className={`label-tooltip ${shouldShowTooltip(index, hoveredIndex, isActive) ? 'visible' : ''}`}
            >
              {`${entry.name} (${(entry.value).toFixed(1)}%)`}
            </div>
          </div>
        );
      })}
    </div>
  </section>
), [ktasChartData, hoveredIndex, ktasFilter, handleLabelClick, shouldShowTooltip]);

const renderPredictionChart = useCallback(() => {
  console.log('Rendering prediction chart with data:', predictionChartData);

  if (!predictionChartData || predictionChartData.length === 0) {
    console.log('No data to render prediction chart');
    return null;
  }

  return (
    <section className="prediction-section">
      <h3 className="prediction-title">AI_TAS 배치 비율</h3>
      <div className="prediction-wrapper">
        <ResponsiveContainer width="100%" height={163}>
          <PieChart>
            {renderGradients()}
            <Pie
              data={predictionChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={48.5}
              outerRadius={75}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
              isAnimationActive={true}
              animationBegin={44}
              animationDuration={800}
              filter="url(#shadow)"
              onMouseEnter={(data, index) => {
                setHoveredPredictionIndex(index);
              }}
              onMouseLeave={() => {
                setHoveredPredictionIndex(null);
              }}
            >
              {predictionChartData.map((entry, index) => (
                <Cell
                  key={`prediction-cell-${index}`}
                  fill={`url(#pred${Object.keys(PREDICTION_COLORS)[index]})`}
                  stroke={hoveredPredictionIndex === index ? "#000" : "rgba(255,255,255,0.1)"}
                  strokeWidth={hoveredPredictionIndex === index ? 2 : 1}
                  filter={hoveredPredictionIndex === index ? "url(#glow)" : undefined}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => {
                if (!props || !props.payload || typeof props.payload.index !== 'number') {
                  return [''];
                }
                try {
                  const entry = predictionChartData[props.payload.index];
                  if (!entry) {
                    return [''];
                  }
                  const rawCount = entry.rawCount || 0;
                  const percentage = value ? parseFloat(value).toFixed(1) : '0.0';
                  return [`${rawCount}명 (${percentage}%)`];
                } catch (error) {
                  console.error('Tooltip formatter error:', error);
                  return [''];
                }
              }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(229, 231, 235, 0.5)',
                borderRadius: '0.75rem',
                padding: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
              animationDuration={300}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="prediction-label-container">
        {predictionChartData.map((entry, index) => {
          const isActive = ktasFilter?.length > 0 && entry.tabId === ktasFilter[0];
          return (
            <div
              key={`prediction-dot-${index}`}
              className={`prediction-label-dot ${isActive ? 'active' : ''}`}
              onMouseEnter={() => setHoveredPredictionIndex(index)}
              onMouseLeave={() => setHoveredPredictionIndex(null)}
              onClick={() => handlePredictionLabelClick(entry)}
            >
              <span className="prediction-label-text">{entry.name}</span>
              <div 
                className={`prediction-label-tooltip ${
                  hoveredPredictionIndex === index ? 'visible' : ''
                }`}
              >
                {`${entry.rawCount}명 (${entry.value.toFixed(1)}%)`}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}, [predictionChartData, hoveredPredictionIndex, ktasFilter, handlePredictionLabelClick]);

return (
  <div className="charts-container">
    {renderKtasChart()}
    {renderPredictionChart()}
  </div>
);
};

export default React.memo(Ktas);