import React, { useState, useRef, useEffect  } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, PieChart, Pie, Cell, ComposedChart, AreaChart} from 'recharts';
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

const COLORS = ['#ef4444', '#3b82f6', '#22c55e'];

// 날짜 포맷팅 함수  // Patiet만 건드리려고 App에서 복붙
const formatVisitDate = (dateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length < 5) return null;
  const [year, month, day, hour, minute] = dateArray;
  return new Date(year, month - 1, day, hour, minute);
};

const getWardInfo = (wardAssignment) => {
  if (!wardAssignment) {
    return { label: "-", value: 0 };
  }

  const levels = [
    { value: Number(wardAssignment.level1) || 0, label: "퇴원" },
    { value: Number(wardAssignment.level2) || 0, label: "일반 병동" },
    { value: Number(wardAssignment.level3) || 0, label: "중증 병동" }
  ];

  const highest = levels.reduce((prev, current) => 
    (current.value > prev.value) ? current : prev
  );

  return {
    label: highest.label,
    value: highest.value
  };
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

  // 시간 포맷팅 함수
  const formatChartTime = (chartTime) => {
    try {
      // chartTime이 ISOString 형식으로 전달됨
      const date = new Date(chartTime);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
      }
      return '시간 오류';
    } catch (error) {
      console.error('Time formatting error:', error, chartTime);
      return '시간 오류';
    }
  };

  // 디버깅을 위한 데이터 로깅
  console.log('Chart data:', data);

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
          {(dataKey === "oxygenSaturation" || dataKey === "respirationRate") ? (
            <AreaChart
              data={data}
              margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
            >
              <defs>
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
                dataKey="chartTime"
                tickFormatter={formatChartTime}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#999', fontSize: 12 }}
                padding={{ left: 10, right: 10 }}
                dy={5}
                interval="preserveStartEnd"
                minTickGap={50}
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
                labelFormatter={formatChartTime}
                formatter={(value, name) => [value, getKoreanName(name)]}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                fill={`url(#colorArea${dataKey})`}
                fillOpacity={1}
                name={dataKey}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: color }}
                connectNulls
              />
            </AreaChart>
          ) : (
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
                dataKey="chartTime"
                tickFormatter={formatChartTime}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#999', fontSize: 12 }}
                padding={{ left: 10, right: 10 }}
                dy={5}
                interval="preserveStartEnd"
                minTickGap={50}
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
                labelFormatter={formatChartTime}
                formatter={(value, name) => [value, getKoreanName(name)]}
              />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                name={dataKey}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: color }}
                connectNulls
              />
              {additionalLine && (
                <Line 
                  type="monotone" 
                  dataKey={additionalLine.dataKey} 
                  stroke={additionalLine.color} 
                  name={additionalLine.dataKey}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0, fill: additionalLine.color }}
                  connectNulls
                />
              )}
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 시계열 예측 그래프
const TimeSeriesChart = ({ data, onTimePointClick }) => {
  // vitalSigns 데이터를 시계열 데이터로 변환
  const formattedData = data.map(point => ({
    time: Array.isArray(point.chartTime) 
      ? new Date(
          point.chartTime[0],
          point.chartTime[1] - 1,
          point.chartTime[2],
          point.chartTime[3] || 0,
          point.chartTime[4] || 0
        ).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      : new Date(point.chartTime).toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
    icu: Number(point.level3) || 0,
    ward: Number(point.level2) || 0,
    discharge: Number(point.level1) || 0
  })).sort((a, b) => {
    const timeA = a.time.split(':').map(Number);
    const timeB = b.time.split(':').map(Number);
    return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
  });

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
            data={formattedData}
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
            <Tooltip
              formatter={(value) => `${(value * 100).toFixed(1)}%`}
              labelFormatter={(label) => `시간: ${label}`}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
            />
            <Line
              type="monotone"
              dataKey="icu"
              name="중증 병동"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="ward"
              name="일반 병동"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="discharge"
              name="퇴원"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// 도넛 차트 컴포넌트
const DonutChart = ({ data, title }) => {
  const chartData = [
    { name: '중증 병동', value: data.icu || 0 },
    { name: '일반 병동', value: data.ward || 0 },
    { name: '퇴원', value: data.discharge || 0 }
  ];

  return (
    <div className="vital-chart">
      <h4>{title}</h4>
      <div style={{ width: '100%', height: 'calc(100% - 60px)' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={58}
              outerRadius={80}
              paddingAngle={1}
              startAngle={90}
              endAngle={-270}
              isAnimationActive={true}
              animationBegin={44}
              animationDuration={800}
              dataKey="value"
              cx="50%"
              cy="50%"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  strokeWidth={1} 
                />
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
              animationDuration={300}
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
              <option value="응급">응급</option>
              <option value="관찰">관찰</option>
              <option value="퇴원">퇴원</option>
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
  // 기본 상태 관리
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTimePoint, setSelectedTimePoint] = useState(null);
  const [currentPredictionData, setCurrentPredictionData] = useState([]);
  const [currentLatestPrediction, setCurrentLatestPrediction] = useState(null);

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

  // 툴팁 관련 이벤트 핸들러 설정
  useEffect(() => {
    const tooltipContainer = document.querySelector('.tooltip-container');
    const tooltipText = document.querySelector('.tooltip-text');
    const infoIcon = document.querySelector('.info-icon');
    const historyTable = document.querySelector('.history-table');
    
    if (tooltipContainer && tooltipText && infoIcon && historyTable) {
      const handleMouseEnter = () => {
        const iconRect = infoIcon.getBoundingClientRect();
        const tableRect = historyTable.getBoundingClientRect();
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

  // 초기 데이터 설정
  useEffect(() => {
    if (patientData?.visits?.[0]?.vitalSigns) {
      const latestVisit = patientData.visits[patientData.visits.length - 1];
      
      // vitalSigns 데이터 직접 전달
      setCurrentPredictionData(latestVisit.vitalSigns);
  
      // wardAssignment로 도넛 차트 업데이트
      if (latestVisit.wardAssignment) {
        setCurrentLatestPrediction({
          discharge: Number(latestVisit.wardAssignment.level1),
          ward: Number(latestVisit.wardAssignment.level2),
          icu: Number(latestVisit.wardAssignment.level3)
        });
      }
    }
  }, [patientData]);

  // 차트 시간 포맷팅 함수
  const formatChartTime = (chartTime) => {
    if (Array.isArray(chartTime)) {
      return new Date(
        chartTime[0],
        chartTime[1] - 1,
        chartTime[2],
        chartTime[3] || 0,
        chartTime[4] || 0
      ).toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    }
    return new Date(chartTime).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  // 날짜 클릭 핸들러
  const handleDateClick = async (date, stay_id) => {
    try {
      const labTestsResponse = await fetchLabTests(stay_id);
      const selectedVisit = patientData.visits.find(visit => visit.stayId === stay_id);
      
      if (selectedVisit) {
        const vitalSigns = selectedVisit.vitalSigns || [];
        
        if (vitalSigns.length > 0) {
          // 시계열 그래프용 각 시점의 level 값으로 예측 데이터 생성
          const predictions = vitalSigns.map(sign => ({
            time: formatChartTime(sign.chartTime),
            icu: Number(sign.level3) || 0,
            ward: Number(sign.level2) || 0,
            discharge: Number(sign.level1) || 0
          }));
  
          setCurrentPredictionData(predictions);
          
          // wardAssignment로 도넛 차트 업데이트
          if (selectedVisit.wardAssignment) {
            setCurrentLatestPrediction({
              icu: Number(selectedVisit.wardAssignment.level3) || 0,
              ward: Number(selectedVisit.wardAssignment.level2) || 0,
              discharge: Number(selectedVisit.wardAssignment.level1) || 0
            });
            setSelectedTimePoint(null);
          }
        }
  
        // 피검사 데이터 포맷팅
        const formattedLabTests = formatLabTests(labTestsResponse);
  
        // 환자 정보 업데이트
        setPatientInfo(prev => ({
          ...prev,
          emergencyLevel: `Level ${selectedVisit.tas}`,
          stayDuration: `${selectedVisit.losHours}시간`,
          vitalSigns: vitalSigns,
          bloodTestData: formattedLabTests
        }));
      }
    } catch (error) {
      console.error("날짜 선택 시 데이터 로드 실패:", error);
      setError("데이터 로드에 실패했습니다.");
    }
  };

  // 피검사 데이터 포맷팅 함수
  const formatLabTests = (response) => {
    if (!response || !Array.isArray(response) || response.length === 0) return null;
    
    return [{
      blood_levels: response[0].bloodLevels || [],
      electrolyte_levels: response[0].electrolyteLevels || [],
      enzymes_metabolisms: response[0].enzymesMetabolisms || [],
      chemical_examinations_enzymes: response[0].chemicalExaminationsEnzymes || [],
      blood_gas_analysis: response[0].bloodGasAnalysis || []
    }];
  };

  // AI TAS 추천 텍스트 생성
  const getAIRecommendationText = (wardAssignment) => {
    if (!wardAssignment) return "예측 데이터가 없습니다.";
    
    const result = getWardInfo(wardAssignment);
    return `${result.label} 배치 권장 (${(result.value * 100).toFixed(1)}%)`;
  };

  // 히스토리 테이블용 AI TAS 텍스트
  const getHistoryAITasText = (vitalSigns) => {
    if (!vitalSigns || vitalSigns.length === 0) return "-";
    
    const latestVitalSign = vitalSigns[vitalSigns.length - 1];
    if (!latestVitalSign) return "-";

    const levels = [
      { value: Number(latestVitalSign.level1) || 0, label: "퇴원" },
      { value: Number(latestVitalSign.level2) || 0, label: "일반 병동" },
      { value: Number(latestVitalSign.level3) || 0, label: "중증 병동" }
    ];

    const highest = levels.reduce((prev, current) => 
      current.value > prev.value ? current : prev
    );

    return `${highest.label} (${(highest.value * 100).toFixed(1)}%)`;
  };

  // 방문 기록 정렬
  const patientHistory = patientData?.visits?.map(visit => ({
    date: formatVisitDate(visit.visitDate)?.toLocaleDateString() || 'Invalid Date',
    originalDate: visit.visitDate,
    stay_id: visit.stayId,
    ktas: visit.tas,
    stayDuration: `${visit.losHours}시간`,
    placement: visit.staystatus === 0 ? '퇴원' : '입원',
    vitalSigns: visit.vitalSigns || []
  })).sort((a, b) => new Date(b.originalDate) - new Date(a.originalDate)) || [];

  // 차트 데이터 포맷팅
  const vitalSignsData = patientInfo.vitalSigns.map(sign => ({
    chartTime: formatChartTime(sign.chartTime),
    heartRate: sign.heartrate,
    bloodPressure: sign.sbp,
    bloodPressureDiastolic: sign.dbp,
    oxygenSaturation: parseFloat(sign.o2sat),
    respirationRate: sign.resprate,
    temperature: parseFloat(sign.temperature)
  })).sort((a, b) => new Date(a.chartTime) - new Date(b.chartTime));

  // 배치 결정 핸들러
  const handlePlacementConfirm = (placementData) => {
    console.log("배치 결정:", placementData);
    onBack();
  };

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
          aiRecommendation: getAIRecommendationText(latestVisit?.wardAssignment)
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
                          <th>AI TAS</th>
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
                      <td>{getAIRecommendationText(
                        patientData.visits.find(v => v.stayId === record.stay_id)?.wardAssignment
                      )}</td>
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