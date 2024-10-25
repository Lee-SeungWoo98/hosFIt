import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import './Patient.css';

// 상수로 분리 (파일 상단에 위치)
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

// 단위 정보 추가
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

// 피그마 보니까 그래프 밑에 한글로 검사명이 적혀있어서 한글 매핑 객체 추가(그래프 밑에 영어로 검사명 적혀있으니 안 예쁘긴 했음)
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


// checkNormalRange 함수 수정
const checkNormalRange = (category, value, gender) => {
  const range = ranges[category];
  if (!range) return null;

  const numValue = parseFloat(value);
  
  // 성별에 따른 범위가 있는 경우
  if (range.male && range.female) {
    const genderRange = gender === '남' ? range.male : range.female;
    return numValue >= genderRange[0] && numValue <= genderRange[1];
  }
  
  // 일반적인 범위
  return numValue >= range[0] && numValue <= range[1];
};

const BloodTestResults = ({ labTests, gender }) => {
  const [showRawData, setShowRawData] = useState(false);
  
  if (!labTests || labTests.length === 0) return <p>피검사 데이터가 없습니다.</p>;
  
  const labTest = labTests[0];
  let abnormalItems = [];
  
  const categories = [
    { name: 'blood_levels', displayName: '혈액검사' },
    { name: 'electrolyte_levels', displayName: '전해질검사' },
    { name: 'enzymes_metabolisms', displayName: '효소 및 대사검사' },
    { name: 'chemical_examinations_enzymes', displayName: '화학검사' },
    { name: 'blood_gas_analysis', displayName: '혈액가스분석' }
  ];
 
  categories.forEach(category => {
    if (labTest[category.name] && labTest[category.name].length > 0) {
      const data = labTest[category.name][0];
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'blood_idx' && key !== 'reg_date' && key !== 'labtest' && value !== null) {
          const isNormal = checkNormalRange(key, value, gender);
          if (isNormal === false) {
            const range = typeof ranges[key] === 'function' 
              ? ranges[key](gender) 
              : ranges[key];
            
            if (range) {
              abnormalItems.push({ 
                key: key,
                value: value,
                normalRange: `${range[0]}-${range[1]}`
              });
            }
          }
        }
      });
    }
  });
 
  return (
    <div className="blood-test-results">
      <div className="blood-test-header">
        <h2>피검사 데이터</h2>
        <button className="raw-data-button" onClick={() => setShowRawData(!showRawData)}>
          {showRawData ? '그래프로 보기' : '수치 보기'}
        </button>
      </div>
 
          {showRawData ? (
      <div className="raw-data">
        {categories.map(category => {
          const categoryData = labTest[category.name];
          if (categoryData && categoryData.length > 0) {
            const data = categoryData[0];
            return (
              <div key={category.name} style={{marginBottom: '20px'}}>
                <h3>{category.displayName}</h3>
                <table className="raw-data-table">
                  <thead>
                    <tr>
                      <th>검사항목</th>
                      <th>수치</th>
                      <th>정상범위</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data).map(([key, value]) => {
                      if (key !== 'blood_idx' && key !== 'reg_date' && key !== 'labtest' && value !== null) {
                        return (
                          <tr key={key}>
                            <td>{koreanNames[key] || key}</td>
                            <td>{value} {units[key]}</td>
                            <td>{getRangeDisplay(key, gender, ranges)} {units[key]}</td>
                          </tr>
                        );
                      }
                      return null;
                    })}
                  </tbody>
                </table>
              </div>
            );
          }
          return null;
        })}
      </div>
      ) : (
        <>
          <div className="abnormal-circles">
            {abnormalItems.map((item, index) => (
              <div key={index} className="circle-item">
                <div className="circle">
                  <div className="value">{item.value}</div>
                  <div className="range">/{item.normalRange}</div>
                </div>
                <p className="item-name">{koreanNames[item.key] || item.key}</p>
              </div>
            ))}
          </div>
          <div className="result-text">
            <p className="abnormal-count">
              비정상 <span className="count">{abnormalItems.length}</span>건 외 정상 검출
            </p>
          </div>
        </>
      )}
    </div>
  );
 };

 const getRangeDisplay = (key, gender, ranges) => {
  const range = ranges[key];
  if (!range) return '-';
  
  // 성별에 따른 범위가 있는 경우
  if (range.male && range.female) {
    if (gender === '남') {
      return `${range.male[0]} - ${range.male[1]}`;
    } else {
      return `${range.female[0]} - ${range.female[1]}`;
    }
  }
  
  // 일반적인 범위
  return `${range[0]} - ${range[1]}`;
};

function Patient({ patientData, labTests, visitInfo, onBack }) {
  const [showBloodTest, setShowBloodTest] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const [patientInfo, setPatientInfo] = useState({
    name: patientData?.name,
    age: patientData?.age,
    // 기존: visits[0] -> 변경: visits[visits.length - 1]
    // 데이터가 쭉쭉 추가되는 거라 생각해서 그럼 가장 마지막에 추가된 데이터가 최근 기록이겠네 생각.
    emergencyLevel: `Level ${patientData?.visits?.[patientData.visits.length - 1]?.tas}`,
    stayDuration: `${patientData?.visits?.[patientData.visits.length - 1]?.los_hours}시간`,
    vitalSigns: patientData?.visits?.[patientData.visits.length - 1]?.vital_signs || [],
    bloodTestData: labTests
});

  // 방문 기록 변환  // 최신 기록이 위에 나오도록
  const [patientHistory, setPatientHistory] = useState(
    (visitInfo?.visits?.map(visit => ({
        date: new Date(visit.visit_date).toLocaleDateString(),
        originalDate: visit.visit_date,  // 정렬을 위해 원본 날짜 보존
        stay_id: visit.stay_id,         // 클릭 시 해당 방문 데이터 찾기 위해 보존
        ktas: visit.tas,
        stayDuration: `${visit.los_hours}시간`,
        placement: visit.staystatus === 0 ? '퇴원' : '입원'
    })) || []).sort((a, b) => new Date(b.originalDate) - new Date(a.originalDate)) // 날짜 역순 정렬
);


  const PatientInfoBanner = ({ patientInfo, error }) => (
    <div className="patient-info-banner">
      {error ? (
        <div className="error-message">데이터가 없어요.</div>
      ) : (
        <>
          <div>
            <strong>환자이름</strong>
            {patientInfo?.name || '데이터가 없어요.'}
          </div>
          <div>
            <strong>나이</strong>
            {patientInfo?.age ? `${patientInfo.age}세` : '데이터가 없어요.'}
          </div>
          <div>
            <strong>KTAS</strong>
            {patientInfo?.emergencyLevel ? (
              <span className={`emergency-level level-${patientInfo.emergencyLevel.split(' ')[1]}`}>
                {patientInfo.emergencyLevel}
              </span>
            ) : '데이터가 없어요.'}
          </div>
          <div>
            <strong>체류 시간</strong>
            {patientInfo?.stayDuration || '데이터가 없어요.'}
          </div>
          <div>
            <strong>배치 추천</strong>
            ㅁㅁㅁ
          </div>
        </>
      )}
    </div>
  );

  const handleDateClick = (date, stay_id) => {
    setSelectedDate(date);
    // stay_id로 해당하는 방문 기록 찾기
    const selectedVisit = visitInfo.visits.find(visit => visit.stay_id === stay_id);
    if (selectedVisit) {
        // 찾은 방문 기록의 데이터로 차트 업데이트
        setPatientInfo(prev => ({
            ...prev,
            emergencyLevel: `Level ${selectedVisit.tas}`,
            stayDuration: `${selectedVisit.los_hours}시간`,
            vitalSigns: selectedVisit.vital_signs || []
        }));
    }
};

  // 차트 데이터 포맷 수정
  const vitalSignsData = patientInfo.vitalSigns.map(sign => ({
    time: new Date(sign.chart_time).toLocaleTimeString(),
    temperature: parseFloat(sign.temperature),
    heartRate: sign.heartrate,
    bloodPressure: sign.sbp,
    bloodPressureDiastolic: sign.dbp,
    oxygenSaturation: parseFloat(sign.o2sat),
    respirationRate: sign.resprate
  }));

  const renderChart = (title, chart, description) => (
    <div className="chart-item">
      <h4>{title}</h4>
      {chart}
      <p className="chart-description">{description}</p>
    </div>
  );

  const temperatureChart = (
    <ResponsiveContainer width="100%" height={200}>
      {vitalSignsData.length > 0 ? (
        <LineChart data={vitalSignsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[35, 40]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="체온(°C)" />
        </LineChart>
      ) : (
        <div className="no-data-message">데이터가 필요합니다.</div>
      )}
    </ResponsiveContainer>
  );

  const heartRateBloodPressureChart = (
    <ResponsiveContainer width="100%" height={200}>
      {vitalSignsData.length > 0 ? (
        <LineChart data={vitalSignsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis yAxisId="left" domain={[40, 200]} />
          <YAxis yAxisId="right" orientation="right" domain={[40, 200]} />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="heartRate" stroke="#82ca9d" name="심박수(bpm)" />
          <Line yAxisId="right" type="monotone" dataKey="bloodPressure" stroke="#ffc658" name="수축기 혈압(mmHg)" />
          <Line yAxisId="right" type="monotone" dataKey="bloodPressureDiastolic" stroke="#ff8042" name="이완기 혈압(mmHg)" />
        </LineChart>
      ) : (
        <div className="no-data-message">데이터가 필요합니다.</div>
      )}
    </ResponsiveContainer>
  );

  const oxygenSaturationChart = (
    <ResponsiveContainer width="100%" height={200}>
      {vitalSignsData.length > 0 ? (
        <LineChart data={vitalSignsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[85, 100]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="oxygenSaturation" stroke="#8884d8" name="산소포화도(%)" />
        </LineChart>
      ) : (
        <div className="no-data-message">데이터가 필요합니다.</div>
      )}
    </ResponsiveContainer>
  );

  const respirationRateChart = (
    <ResponsiveContainer width="100%" height={200}>
      {vitalSignsData.length > 0 ? (
        <LineChart data={vitalSignsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[8, 40]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="respirationRate" stroke="#8884d8" name="호흡수(/분)" />
        </LineChart>
      ) : (
        <div className="no-data-message">데이터가 필요합니다.</div>
      )}
    </ResponsiveContainer>
  );

  return (
    <div className="patient-details">
      <button onClick={onBack} className="back-button">
        <ArrowLeft size={24} />
      </button>
      <PatientInfoBanner patientInfo={patientInfo} error={error} />
      <div className="data-header">
        <h3>{patientInfo?.name || '환자'}의 생체 데이터</h3>
        <button onClick={() => setShowBloodTest(!showBloodTest)} className="blood-test-button">
          {showBloodTest ? '그래프만 보기' : '피검사 데이터 보기'}
        </button>
      </div>
      <div className={`data-container ${showBloodTest ? 'show-blood-test' : ''}`}>
        <div className="charts-container">
          {renderChart("체온 변화", temperatureChart, "체온 변화 추이")}
          {renderChart("심박수 및 혈압", heartRateBloodPressureChart, "심박수 및 혈압 추이")}
          {renderChart("산소포화도", oxygenSaturationChart, "산소포화도 추이")}
          {renderChart("호흡수", respirationRateChart, "호흡수 추이")}
        </div>
        {showBloodTest && (
        <div className="blood-test-data">
          <BloodTestResults labTests={patientInfo.bloodTestData} gender={patientData?.gender} />
        </div>
      )}
      </div>
      <br/>
      <h3>응급실 내원 기록</h3>
      <div className="history-table-container">
        {patientHistory.length === 0 ? (
          <p>내원 기록 데이터가 없습니다.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>입실 날짜</th>
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
                      onClick={() => handleDateClick(record.date, record.stay_id)}  // 입실 날짜 클릭시 해당 record의 stay_id도 같이 전달해서 그 날짜 데이터
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