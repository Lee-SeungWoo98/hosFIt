import React, { useState, useRef, useEffect  } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, PieChart, Pie, Cell, ComposedChart, AreaChart } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import './Patient.css';

// 상수 정의
const ranges = {
  // Blood Levels
  hemoglobin: { male: [13.5, 17.5], female: [12.0, 16.0] },
  platelet_count: [150000, 450000],
  wbc: [4000, 11000],
  rbc: { male: [4.5, 5.9], female: [4.1, 5.1] },
  sedimentation_rate: { male: [0, 15], female: [0, 20] },
  
  // Electrolyte Levels
  sodium: [135, 145],
  potassium: [3.5, 5.0],
  chloride: [96, 106],
  
  // Enzymes & Metabolism
  ck: [22, 198],
  ckmb: [0, 25],
  creatinine: [0.7, 1.3],
  ggt: [8, 61],
  glucose: [70, 100],
  inrpt: [0.8, 1.2],
  lactate: [0.5, 2.2],
  ld: [140, 280],
  lipase: [13, 60],
  magnesium: [1.7, 2.2],
  ntpro_bnp: [0, 125],
  ddimer: [0, 500],
  
  // Chemical Examinations & Enzymes
  acetone: [0, 0],
  alt: [7, 56],
  albumin: [3.4, 5.4],
  alkaline_phosphatase: [44, 147],
  ammonia: [15, 45],
  amylase: [28, 100],
  ast: [8, 48],
  beta_hydroxybutyrate: [0, 0.6],
  bicarbonate: [22, 29],
  bilirubin: [0.3, 1.2],
  crp: [0, 3.0],
  calcium: [8.6, 10.3],
  co2: [23, 29],
  
  // Blood Gas Analysis
  po2: [80, 100],
  ph: [7.35, 7.45],
  pco2: [35, 45]
};

const units = {
  hemoglobin: 'g/dL',
  platelet_count: '/μL',
  wbc: '/μL',
  rbc: 'x 10⁶/μL',
  sedimentation_rate: 'mm/hr',
  sodium: 'mEq/L',
  potassium: 'mEq/L',
  chloride: 'mEq/L',
  ck: 'U/L',
  ckmb: 'U/L',
  creatinine: 'mg/dL',
  ggt: 'U/L',
  glucose: 'mg/dL',
  inrpt: '',
  lactate: 'mmol/L',
  ld: 'U/L',
  lipase: 'U/L',
  magnesium: 'mg/dL',
  ntpro_bnp: 'pg/mL',
  ddimer: 'ng/mL',
  acetone: '',
  alt: 'U/L',
  albumin: 'g/dL',
  alkaline_phosphatase: 'U/L',
  ammonia: 'μmol/L',
  amylase: 'U/L',
  ast: 'U/L',
  beta_hydroxybutyrate: 'mmol/L',
  bicarbonate: 'mEq/L',
  bilirubin: 'mg/dL',
  crp: 'mg/L',
  calcium: 'mg/dL',
  co2: 'mEq/L',
  po2: 'mmHg',
  ph: '',
  pco2: 'mmHg'
};

const koreanNames = {
  hemoglobin: "헤모글로빈(Hemoglobin)",
  platelet_count: "혈소판 수(Platelet Count)",
  wbc: "백혈구 수(WBC)",
  rbc: "적혈구 수(RBC)",
  sedimentation_rate: "적혈구 침강속도(ESR)",
  sodium: "나트륨(Sodium)",
  potassium: "칼륨(Potassium)",
  chloride: "염소(Chloride)",
  ck: "크레아틴 키나아제(CK)",
  ckmb: "CK-MB",
  creatinine: "크레아티닌(Creatinine)",
  ggt: "감마글루타밀전이효소(GGT)",
  glucose: "혈당(Glucose)",
  inrpt: "혈액응고(INR)",
  lactate: "젖산(Lactate)",
  ld: "젖산탈수소효소(LD)",
  lipase: "리파아제(Lipase)",
  magnesium: "마그네슘(Magnesium)",
  ntpro_bnp: "NT-proBNP",
  ddimer: "D-다이머(D-dimer)",
  acetone: "아세톤(Acetone)",
  alt: "알라닌아미노전달효소(ALT)",
  albumin: "알부민(Albumin)",
  alkaline_phosphatase: "알칼리성 포스파타제(ALP)",
  ammonia: "암모니아(Ammonia)",
  amylase: "아밀라아제(Amylase)",
  ast: "아스파르테이트아미노전달효소(AST)",
  beta_hydroxybutyrate: "베타하이드록시부티레이트(BHB)",
  bicarbonate: "중탄산염(Bicarbonate)",
  bilirubin: "빌리루빈(Bilirubin)",
  crp: "C-반응성 단백(CRP)",
  calcium: "칼슘(Calcium)",
  co2: "이산화탄소(CO2)",
  po2: "산소분압(PO2)",
  ph: "산도(pH)",
  pco2: "이산화탄소분압(PCO2)"
};

// 날짜 포맷팅 함수  // Patiet만 건드리려고 App에서 복붙
const formatVisitDate = (dateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length < 5) return null;
  const [year, month, day, hour, minute] = dateArray;
  return new Date(year, month - 1, day, hour, minute);
};

// 유틸리티 함수들
const checkNormalRange = (category, value, gender) => {
  const range = ranges[category];
  if (!range) return null;

  const numValue = parseFloat(value);
  
  if (range.male && range.female) {
    const genderRange = gender === '남' ? range.male : range.female;
    return numValue >= genderRange[0] && numValue <= genderRange[1];
  }
  
  return numValue >= range[0] && numValue <= range[1];
};

const getRangeDisplay = (key, gender, ranges) => {
  const range = ranges[key];
  if (!range) return '-';
  
  if (range.male && range.female) {
    if (gender === '남') {
      return `${range.male[0]} - ${range.male[1]}`;
    } else {
      return `${range.female[0]} - ${range.female[1]}`;
    }
  }
  
  return `${range[0]} - ${range[1]}`;
};

// VitalSignChart 컴포넌트
const VitalSignChart = ({ data, config }) => {
  const { title, dataKey, dataName, yDomain, yTicks, color = "#2196F3", additionalLine } = config;

  // 호버 시 보여줄 한글 이름 설정
  const getKoreanName = (key) => {
    switch(key) {
      case 'oxygenSaturation':
        return '산소포화도(%)';
      case 'respirationRate':
        return '호흡수(/분)';
      case 'bloodPressure':
        return '수축기 혈압(mmHg)';
      case 'bloodPressureDiastolic':
        return '이완기 혈압(mmHg)';
      default:
        return dataName;
    }
  };
  
  return (
    <div className="vital-chart">
      <h4>{title}</h4>
      <div style={{ width: '100%', height: 'calc(100% - 24px)' }}>
        <ResponsiveContainer>
          {/* 산소포화도와 호흡수는 AreaChart 사용 */}
          {(dataKey === "oxygenSaturation" || dataKey === "respirationRate") ? (
            <AreaChart
              data={data}
              margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
            >
              <defs>
                {/* Area 차트의 그라데이션 설정 
                    - stopColor: Area 영역의 색상 (#E8F1FF = 연한 하늘색)
                    - stopOpacity: 각 위치별 투명도 (0: 완전 투명 ~ 1: 완전 불투명)
                    - offset: 그라데이션 위치 (0%: 상단 ~ 100%: 하단) */}
                <linearGradient id={`colorArea${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#CCE4FF" stopOpacity={0.8}/>
                  <stop offset="50%" stopColor="#99CCFF" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#66B2FF" stopOpacity={1}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                stroke="#eee" 
                vertical={false}
                strokeDasharray="5 5"
              />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#999', fontSize: 12 }}
                padding={{ left: 10, right: 10 }}
                dy={5}
              />
              <YAxis 
                domain={yDomain}
                ticks={yTicks}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#999', fontSize: 12 }}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  padding: '10px'
                }}
                labelStyle={{ color: '#666' }}
                formatter={(value) => [value, getKoreanName(dataKey)]}
              />
              {/* Area 차트 메인 설정 
                  - fill: url로 위에서 정의한 그라데이션 사용
                  - fillOpacity: Area 전체의 투명도 (그라데이션과 별개) */}
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                fill={`url(#colorArea${dataKey})`}
                fillOpacity={1}
                name={getKoreanName(dataKey)}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: color }}
              />
            </AreaChart>
          ) : (
            // 혈압은 두 개의 선이 필요하므로 ComposedChart 사용
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
            >
              <CartesianGrid 
                stroke="#eee" 
                vertical={false}
                strokeDasharray="5 5"
              />
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#999', fontSize: 12 }}
                padding={{ left: 10, right: 10 }}
                dy={5}
              />
              <YAxis 
                domain={yDomain}
                ticks={yTicks}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#999', fontSize: 12 }}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  padding: '10px'
                }}
                labelStyle={{ color: '#666' }}
                formatter={(value, name, props) => {
                  if (props.dataKey === additionalLine?.dataKey) {
                    return [value, additionalLine.name];
                  }
                  if (props.dataKey === dataKey) {
                    return [value, getKoreanName(dataKey)];
                  }
                  return ['', ''];
                }}
                filterNull={true}
              />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                name={getKoreanName(dataKey)}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: color }}
              />
              {additionalLine && (
                <Line 
                  type="monotone" 
                  dataKey={additionalLine.dataKey} 
                  stroke={additionalLine.color} 
                  name={additionalLine.name}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0, fill: additionalLine.color }}
                />
              )}
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
 };

// 시계열 그래프를 위한 툴팁
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold mb-1">
          {payload[0].payload.time}
        </p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.stroke }}>
            {entry.name}: {(entry.value * 100).toFixed(1)}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// 시계열 예측 그래프
const TimeSeriesChart = ({ data, onTimePointClick }) => {
  return (
    <div style={{
      width: '98.4%',
      height: '321px',
      marginLeft: '12px',
      border: '1px solid #edf2f7',
      borderRadius:'16px'}}
      className="bg-white rounded-lg shadow-lg p-6">

      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            onClick={(e) => {
              if (e && e.activePayload) {
                onTimePointClick(e.activePayload[0].payload);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              domain={[0, 1]}
              ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
            />
            <Line
              type="monotone"
              dataKey="icu"
              stroke="#ef4444"
              name="ICU"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="ward"
              stroke="#3b82f6"
              name="WARD"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="discharge"
              stroke="#22c55e"
              name="DISCHARGE"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 도넛 차트 컴포넌트
const DonutChart = ({ data, title }) => {
  const COLORS = ['#ef4444', '#3b82f6', '#22c55e'];
  const chartData = [
    { name: 'ICU', value: data.icu },
    { name: 'WARD', value: data.ward },
    { name: 'DISCHARGE', value: data.discharge }
  ];

  return (
    <div className="vital-chart">
      <h4>{title}</h4>
      <div style={{ width: '100%', height: 'calc(100% - 60px)' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={58}  // 내부 반지름
              outerRadius={80}  // 외부 반지름
              paddingAngle={1}  // 간격 조절 부분
              startAngle={90}   // 시작 각도
              endAngle={-270}   // 끝 각도
              isAnimationActive={true}  // 도넛차트 바뀌는 애니메이션 켜기
              animationBegin={44}        // 애니메이션 시작 딜레이 조절
              animationDuration={800}   // 애니메이션 지속시간
              dataKey="value"
              cx="50%"
              cy="50%"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}
                strokeWidth={1} />  // 테두리 지우고 싶으면 0으로
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `${(value * 100).toFixed(1)}%`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '0.75rem'
              }}
              animationDuration={300}  // 툴팁 애니메이션도 animationDuration맞춰 빠르게
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="donut-legend-container">
        {chartData.map((entry, index) => (
          <div key={entry.name} className="legend-item">
            <div
              className="legend-marker"
              style={{ backgroundColor: COLORS[index] }}
            />
            <span>{entry.name}: {(entry.value * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// PatientInfoBanner 컴포넌트
const PatientInfoBanner = ({ patientInfo, error, onPlacementConfirm }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlacementConfirm = (data) => {
    // 여기서 서버로 데이터를 전송하는 로직 추가 예정
    console.log("배치 결정:", data);
    onPlacementConfirm(data);
    setIsModalOpen(false);
  };

  return (
    <div className="patient-info-banner">
      {error ? (
        <div className="error-message">데이터가 없어요.</div>
      ) : (
        <>
          <div className="banner-item">
            <span className="label">환자이름</span>
            <div className="value-container">
              <span className="value">{patientInfo?.name || '데이터가 없어요.'}</span>
            </div>
          </div>
          <div className="banner-item">
            <span className="label">나이</span>
            <div className="value-container">
              <span className="value">{patientInfo?.age ? `${patientInfo.age}세` : '데이터가 없어요.'}</span>
            </div>
          </div>
          <div className="banner-item">
            <span className="label">KTAS</span>
            <div className="value-container">
              <span className="value">{patientInfo?.emergencyLevel || '데이터가 없어요.'}</span>
            </div>
          </div>
          <div className="banner-item">
            <span className="label">체류 시간</span>
            <div className="value-container">
              <span className="value with-unit">{patientInfo?.stayDuration || '데이터가 없어요.'}</span>
            </div>
          </div>
          <div className="banner-item">
            <span className="label">AI TAS 추천</span>
            <div className="value-container">
              <span className="value">{patientInfo?.aiRecommendation || '예측 데이터가 없어요.'}</span>
            </div>
          </div>
          <div className="banner-item decision-button-container">
            <button 
              className="placement-decision-button"
              onClick={() => setIsModalOpen(true)}
            >
              배치 결정
            </button>
          </div>
          <PlacementModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handlePlacementConfirm}
            aiRecommendation={patientInfo?.aiRecommendation || '예측 데이터가 없어요.'}
          />
        </>
      )}
    </div>
  );
};

// BloodTestResults 컴포넌트
const BloodTestResults = ({ labTests, gender }) => {
  const [showRawData, setShowRawData] = useState(false);
  const [activeTab, setActiveTab] = useState('blood_levels');
  const categoryRefs = {
    blood_levels: useRef(null),
    electrolyte_levels: useRef(null),
    enzymes_metabolisms: useRef(null),
    chemical_examinations_enzymes: useRef(null),
    blood_gas_analysis: useRef(null)
  };

  const handleRawDataToggle = () => {
    setShowRawData(!showRawData);
    if (showRawData) {
      setActiveTab('blood_levels');
    }
  };

  const handleTabClick = (categoryName) => {
    setActiveTab(categoryName);
    const ref = categoryRefs[categoryName];
    if (ref && ref.current) {
      const rawDataContainer = document.querySelector('.raw-data');
      if (rawDataContainer) {
        rawDataContainer.scrollTo({
          top: ref.current.offsetTop - rawDataContainer.offsetTop - 60,
          behavior: 'smooth'
        });
      }
    }
  };

  const findCategoryByKey = (key) => {
    const categories = [
      'blood_levels',
      'electrolyte_levels',
      'enzymes_metabolisms',
      'chemical_examinations_enzymes',
      'blood_gas_analysis'
    ];

    for (const category of categories) {
      if (labTests[0][category] && 
          labTests[0][category][0] && 
          key in labTests[0][category][0]) {
        return category;
      }
    }
    return null;
  };

  const handleCircleClick = (key) => {
    const category = findCategoryByKey(key);
    if (category) {
      setShowRawData(true);
      setActiveTab(category);
      
      setTimeout(() => {
        const targetRow = document.querySelector(`tr[data-key="${key}"]`);
        const rawDataContainer = document.querySelector('.raw-data');
        const categoryTabs = document.querySelector('.category-tabs');
        
        if (targetRow && rawDataContainer && categoryTabs) {
          const tabsHeight = categoryTabs.offsetHeight;
          const rowTop = targetRow.getBoundingClientRect().top;
          const containerTop = rawDataContainer.getBoundingClientRect().top;
          const scrollPosition = rawDataContainer.scrollTop + (rowTop - containerTop) - tabsHeight - 50;
  
          rawDataContainer.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          });
  
          targetRow.classList.add('highlighted-row');
          setTimeout(() => {
            targetRow.classList.remove('highlighted-row');
          }, 2000);
        }
      }, 150);
    }
  };

  if (!labTests || labTests.length === 0) return <p>피검사 데이터가 없습니다.</p>;
  
  const categories = [
    { name: 'blood_levels', displayName: '혈액검사' },
    { name: 'electrolyte_levels', displayName: '전해질검사' },
    { name: 'enzymes_metabolisms', displayName: '효소 및 대사검사' },
    { name: 'chemical_examinations_enzymes', displayName: '화학검사' },
    { name: 'blood_gas_analysis', displayName: '혈액가스분석' }
  ];

  let abnormalItems = [];
  
  categories.forEach(category => {
    if (labTests[0][category.name] && labTests[0][category.name].length > 0) {
      const data = labTests[0][category.name][0];
      Object.entries(data).forEach(([key, value]) => {
        // 피 검사 데이터를 뽑아올 때 수치보기 표에 reg_date가 표시돼서 안 보이게 해둠
        if (key !== 'blood_idx' && 
          key !== 'bloodIdx' && 
          key !== 'reg_date' && 
          key !== 'regDate' && 
          key !== 'regdate' && 
          key !== 'labtest' && 
          value !== null) {
          const isNormal = checkNormalRange(key, value, gender);
          if (isNormal === false) {
            abnormalItems.push({ 
              key: key,
              value: value,
              normalRange: getRangeDisplay(key, gender, ranges),
              unit: units[key] || ''
            });
          }
        }
      });
    }
  });

  return (
    <div className="blood-test-results">
      <div className="blood-test-header">
        <div className="header-content">
          <p className="abnormal-count">
            비정상 <span className="count">{abnormalItems.length}</span>건 외 정상 검출
          </p>
          <button 
            className={`raw-data-button ${showRawData ? 'active' : ''}`} 
            onClick={handleRawDataToggle}
          >
            수치보기
          </button>
        </div>
      </div>
 
      <div className={`blood-test-content ${showRawData ? 'show-raw-data' : ''}`}>
        {showRawData ? (
          <>
            <div className="category-tabs">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className={`category-tab ${activeTab === category.name ? 'active' : ''}`}
                  onClick={() => handleTabClick(category.name)}
                >
                  {category.displayName}
                </button>
              ))}
            </div>
            <div className="raw-data">
              {categories.map(category => {
                const categoryData = labTests[0][category.name];
                return (
                  <div 
                    key={category.name} 
                    className="category-section"
                    ref={categoryRefs[category.name]}
                    data-category={category.name}
                  >
                    <h3>{category.displayName}</h3>
                    {categoryData && categoryData.length > 0 ? (
                      <table className="raw-data-table">
                        <thead>
                          <tr>
                            <th>검사항목</th>
                            <th>수치</th>
                            <th>정상범위</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(categoryData[0]).map(([key, value]) => {
                            if (key !== 'blood_idx' && 
                              key !== 'bloodIdx' && 
                              key !== 'reg_date' && 
                              key !== 'regDate' && 
                              key !== 'regdate' && 
                              key !== 'labtest' && 
                              value !== null) {
                              const isNormal = checkNormalRange(key, value, gender);
                              return (
                                <tr 
                                  key={key}
                                  data-key={key}
                                  className={isNormal === false ? 'abnormal-row' : ''}
                                >
                                  <td>{koreanNames[key] || key}</td>
                                  <td className={isNormal === false ? 'abnormal-value' : ''}>
                                    {value} <span className="unit">{units[key]}</span>
                                  </td>
                                  <td>
                                    {getRangeDisplay(key, gender, ranges)} <span className="unit">{units[key]}</span>
                                  </td>
                                </tr>
                              );
                            }
                            return null;
                          })}
                        </tbody>
                      </table>
                    ) : (
                      // 데이터가 없으면 아예 사라지고 탭도 안 눌려서 빈 배열이라도 카테고리는 표시되게 변경
                      <div className="no-data-message" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                        {category.displayName}에 대한 결과가 없습니다.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="abnormal-circles">
            {abnormalItems.map((item, index) => (
              <div 
                key={index} 
                className="circle-item"
                onClick={() => handleCircleClick(item.key)}
              >
                <div className="circle">
                  <div className="value">{item.value}</div>
                  <div className="range">/{item.normalRange}</div>
                  <div className="unit">{item.unit}</div>
                </div>
                <p className="item-name">{koreanNames[item.key] || item.key}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
 };

 // PlacementModal 컴포넌트
const PlacementModal = ({ isOpen, onClose, onConfirm, aiRecommendation }) => {
  const [doctorNote, setDoctorNote] = useState('');
  const [selectedPlacement, setSelectedPlacement] = useState('');

  const handleConfirm = () => {
    onConfirm({
      doctorNote,
      placement: selectedPlacement
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="placement-modal">
        <div className="modal-header">
          <h2>환자 배치 결정</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-content">
          <div className="ai-recommendation">
            <h3>AI TAS 추천 :</h3>
            <div className="recommendation-box">
              {aiRecommendation || 'AI 분석 중...'}
            </div>
          </div>
          <div className="modal-section">
            <h3>의사 소견</h3>
            <textarea
              value={doctorNote}
              onChange={(e) => setDoctorNote(e.target.value)}
              placeholder="의사 소견을 입력하세요..."
              rows={4}
              className="doctor-note"
            />
          </div>
          <div className="modal-section">
            <h3>배치 결정</h3>
            <select
              value={selectedPlacement}
              onChange={(e) => setSelectedPlacement(e.target.value)}
              className="placement-select"
            >
              <option value="">배치를 선택하세요</option>
              <option value="ICU">ICU</option>
              <option value="WARD">WARD</option>
              <option value="DISCHARGE">DISCHARGE</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button 
            className="confirm-button"
            onClick={handleConfirm}
            disabled={!selectedPlacement || !doctorNote}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

// 메인 Patient 컴포넌트
function Patient({ patientData, labTests, visitInfo, onBack, fetchLabTests }) {
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTimePoint, setSelectedTimePoint] = useState(null);
  const [currentPredictionData, setCurrentPredictionData] = useState([]);
  const [currentLatestPrediction, setCurrentLatestPrediction] = useState(null);

  useEffect(() => {
    const tooltipContainer = document.querySelector('.tooltip-container');
    const tooltipText = document.querySelector('.tooltip-text');
    const infoIcon = document.querySelector('.info-icon');
    const historyTable = document.querySelector('.history-table');
    
    if (tooltipContainer && tooltipText && infoIcon && historyTable) {
      const handleMouseEnter = () => {
        const iconRect = infoIcon.getBoundingClientRect();
        const tableRect = historyTable.getBoundingClientRect();
        
        // 테이블의 상단에서 충분히 위로 올라간 위치에 툴팁 배치
        tooltipText.style.left = `${iconRect.left + (iconRect.width / 2)}px`;
        tooltipText.style.top = `${tableRect.top - tooltipText.offsetHeight - 3}px`;
        tooltipText.setAttribute('data-show', 'true');
      };
  
      const handleMouseLeave = () => {
        tooltipText.removeAttribute('data-show');
      };
  
      tooltipContainer.addEventListener('mouseenter', handleMouseEnter);
      tooltipContainer.addEventListener('mouseleave', handleMouseLeave);
  
      return () => {
        tooltipContainer.removeEventListener('mouseenter', handleMouseEnter);
        tooltipContainer.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  // 예측 중 가장 높은 값을 찾는 함수
  const getHighestPrediction = (prediction) => {
    if (!prediction) return null;
    
    const predictions = {
      ICU: prediction.icu,
      WARD: prediction.ward,
      DISCHARGE: prediction.discharge
    };

    const highestValue = Math.max(...Object.values(predictions));
    const highestKey = Object.keys(predictions).find(key => predictions[key] === highestValue);

    return {
      type: highestKey,
      value: highestValue,
      prediction: prediction  // 전체 예측값도 함께 반환
    };
  };

  // 임시 예측 데이터 생성 함수
  const generatePredictionData = (vitalSigns) => {
    if (!vitalSigns || vitalSigns.length === 0) return [];
    
    const predictions = vitalSigns.map(sign => {
      const total = Math.random() * 0.3 + 0.7;
      const icu = Math.random() * 0.4 * total;
      const ward = Math.random() * 0.4 * total;
      const discharge = total - icu - ward;
      
      return {
        time: new Date(sign.chartTime).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        icu,
        ward,
        discharge
      };
    }).sort((a, b) => {
      const timeA = a.time.split(':').map(Number);
      const timeB = b.time.split(':').map(Number);
      return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
    });

    return predictions;
  };

  // 가장 최근 방문 데이터로 초기화
  const latestVisit = patientData?.visits?.[patientData.visits.length - 1];
  
  const [patientInfo, setPatientInfo] = useState({
    name: patientData?.name,
    age: patientData?.age,
    emergencyLevel: `Level ${latestVisit?.tas}`,
    stayDuration: `${latestVisit?.losHours}시간`,
    vitalSigns: latestVisit?.vitalSigns || [],
    bloodTestData: labTests
  });

  // 배치결정 함수 추가
  const handlePlacementConfirm = (placementData) => {
    // 여기서 서버로 데이터를 전송하고
    console.log("배치 결정:", placementData);
    // 성공 시 리스트로 돌아가기
    onBack();
  };

  // 방문 기록을 날짜 기준 내림차순으로 정렬
  const patientHistory = patientData?.visits?.map(visit => ({
    date: formatVisitDate(visit.visitDate)?.toLocaleDateString() || 'Invalid Date',
    originalDate: visit.visitDate,
    stay_id: visit.stayId,
    ktas: visit.tas,
    stayDuration: `${visit.losHours}시간`,
    placement: visit.staystatus === 0 ? '퇴원' : '입원',
    vitalSigns: visit.vitalSigns || []
  })).sort((a, b) => new Date(b.originalDate) - new Date(a.originalDate)) || [];

  // 컴포넌트 마운트 시 초기 데이터 설정
  useEffect(() => {
    const initialPredictions = generatePredictionData(patientInfo?.vitalSigns || []);
    setCurrentPredictionData(initialPredictions);
    if (initialPredictions.length > 0) {
      const latestPrediction = initialPredictions[initialPredictions.length - 1];
      setCurrentLatestPrediction(latestPrediction);
    }
  }, [patientInfo?.vitalSigns]);

  const handleDateClick = async (date, stay_id) => {
    try {
      const labTestsResponse = await fetchLabTests(stay_id);
      const selectedVisit = patientData.visits.find(visit => visit.stayId === stay_id);
      
      if (selectedVisit) {
        // 선택한 날짜의 vitalSigns로 새로운 예측 데이터 생성
        const newPredictions = generatePredictionData(selectedVisit.vitalSigns || []);
        setCurrentPredictionData(newPredictions);
        
        // 가장 최근 예측값으로 도넛차트 업데이트
        if (newPredictions.length > 0) {
          const latestPrediction = newPredictions[newPredictions.length - 1];
          setCurrentLatestPrediction(latestPrediction);
          setSelectedTimePoint(null); // 시계열 그래프의 선택 초기화
        }

        // 포맷팅 된 피검사 데이터 생성
        const formattedLabTests = labTestsResponse && Array.isArray(labTestsResponse) && labTestsResponse.length > 0 
          ? [{
              blood_levels: labTestsResponse[0].bloodLevels || [],
              electrolyte_levels: labTestsResponse[0].electrolyteLevels || [],
              enzymes_metabolisms: labTestsResponse[0].enzymesMetabolisms || [],
              chemical_examinations_enzymes: labTestsResponse[0].chemicalExaminationsEnzymes || [],
              blood_gas_analysis: labTestsResponse[0].bloodGasAnalysis || []
            }]
          : null;

        setPatientInfo(prev => ({
          ...prev,
          emergencyLevel: `Level ${selectedVisit.tas}`,
          stayDuration: `${selectedVisit.losHours}시간`,
          vitalSigns: selectedVisit.vitalSigns || [],
          bloodTestData: formattedLabTests
        }));
      }
    } catch (error) {
      console.error("날짜 선택 시 데이터 로드 실패:", error);
      setError("데이터 로드에 실패했습니다.");
    }
  };

  // AI TAS 추천 텍스트 생성 함수
  const getAIRecommendationText = (prediction) => {
    const highest = getHighestPrediction(prediction);
    if (!highest) return "예측 데이터가 없습니다.";

    return `${highest.type} 배치 권장 (${(highest.value * 100).toFixed(1)}%)`;
  };

  const predictionData = generatePredictionData(patientInfo?.vitalSigns || []);
  
  // 기본값 설정
  const defaultPrediction = { icu: 0.33, ward: 0.33, discharge: 0.34 };
  
  // latestPrediction 설정
  const latestPrediction = predictionData.length > 0 
    ? predictionData[predictionData.length - 1] 
    : defaultPrediction;

  // 차트 데이터 포맷팅
  const vitalSignsData = patientInfo.vitalSigns.map(sign => ({
    time: new Date(sign.chartTime).toLocaleTimeString(),
    heartRate: sign.heartrate,
    bloodPressure: sign.sbp,
    bloodPressureDiastolic: sign.dbp,
    oxygenSaturation: parseFloat(sign.o2sat),
    respirationRate: sign.resprate,
    temperature: parseFloat(sign.temperature)
  })).sort((a, b) => new Date(a.time) - new Date(b.time));

  // 차트 설정 객체
  const chartConfigs = {
    prediction: {
      component: DonutChart,
      data: selectedTimePoint || currentLatestPrediction || { icu: 0.33, ward: 0.33, discharge: 0.34 },
      title: "예측 확률"
    },
    bloodPressure: {
      title: "혈압",
      dataKey: "bloodPressure",
      dataName: "수축기 혈압(mmHg)",
      yDomain: [10, 200],
      yTicks: [30, 70, 110, 150, 190],
      additionalLine: {
        dataKey: "bloodPressureDiastolic",
        name: "이완기 혈압(mmHg)",
        color: "#90CAF9"
      }
    },
    oxygenSaturation: {
      title: "산소포화도",
      dataKey: "oxygenSaturation",
      dataName: "산소포화도(%)",
      yDomain: [90, 110],
      yTicks: [90, 95, 100, 105, 110]
    },
    respirationRate: {
      title: "호흡수",
      dataKey: "respirationRate",
      dataName: "호흡수(/분)",
      yDomain: [0, 40],
      yTicks: [0, 10, 20, 30, 40]
    }
  };

  return (
    <div className="patient-details">
      <button onClick={onBack} className="back-button">
        <ArrowLeft size={24} />
      </button>
      <PatientInfoBanner
        patientInfo={{
          ...patientInfo,
          aiRecommendation: getAIRecommendationText(currentLatestPrediction)
        }}
        error={error}
        onPlacementConfirm={handlePlacementConfirm}
      />
      <div className="timeseries-container p-6">
        <TimeSeriesChart
          data={currentPredictionData}
          onTimePointClick={setSelectedTimePoint}
        />
      </div>
      <div className="data-container with-blood-test">
        <div className="charts-grid">
          {Object.entries(chartConfigs).map(([key, config]) => {
            if (key === 'prediction') {
              return (
                <config.component
                  key={key}
                  data={config.data}
                  title={config.title}
                />
              );
            }
            return (
              <VitalSignChart 
                key={key} 
                data={vitalSignsData} 
                config={config} 
              />
            );
          })}
        </div>
        <div className="blood-test-container">
          <BloodTestResults labTests={patientInfo.bloodTestData} gender={patientData?.gender} />
        </div>
      </div>
      <div className="history-table-container">
        {patientHistory.length === 0 ? (
          <p>내원 기록 데이터가 없습니다.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>
                  <div className="header-content">
                    과거 입실 날짜
                    <div className="tooltip-container">
                      <span className="info-icon">?</span>
                      <span className="tooltip-text">
                        과거 입실 날짜를 클릭해 해당 날짜의 데이터 보기
                      </span>
                    </div>
                  </div>
                </th>
                <th>KTAS</th>
                <th>체류 시간</th>
                <th>배치 결과</th>
              </tr>
            </thead>
            <tbody>
              {patientHistory.map((record, index) => (
                <tr key={index}>
                  <td>
                    <button
                      className="date-button"
                      onClick={() => handleDateClick(record.date, record.stay_id)}
                    >
                      {record.date}
                    </button>
                  </td>
                  <td>{record.ktas}</td>
                  <td>{record.stayDuration}</td>
                  <td>{record.placement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Patient;