import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import './Patient.css';

function Patient({ patient, onBack }) {
  const [showBloodTest, setShowBloodTest] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const pieData = [
    { name: '정상', value: 60 },
    { name: '경계', value: 25 },
    { name: '위험', value: 15 },
  ];

  const barData = [
    { name: '월', value: 4000 },
    { name: '화', value: 3000 },
    { name: '수', value: 2000 },
    { name: '목', value: 2780 },
    { name: '금', value: 1890 },
    { name: '토', value: 2390 },
    { name: '일', value: 3490 },
  ];

  const getPlacementRecommendation = (patient) => {
    if (patient.emergencyLevel === 'Level 5' || patient.emergencyLevel === 'Level 4') {
      return '입원';
    } else if (patient.emergencyLevel === 'Level 3' || patient.emergencyLevel === 'Level 2') {
      return '관찰';
    } else {
      return '퇴원';
    }
  };

  const PatientInfoBanner = ({ patient }) => (
    <div className="patient-info-banner">
      <div>
        <strong>환자이름</strong>
        {patient.name}
      </div>
      <div>
        <strong>나이</strong>
        {patient.age}세
      </div>
      <div>
        <strong>응급도 레벨</strong>
        <span className={`emergency-level level-${patient.emergencyLevel.split(' ')[1]}`}>
          {patient.emergencyLevel}
        </span>
      </div>
      <div>
        <strong>체류 시간</strong>
        {patient.stayDuration}
      </div>
      <div>
        <strong>배치 추천</strong>
        <span className={`placement-recommendation ${getPlacementRecommendation(patient)}`}>
          {getPlacementRecommendation(patient)}
        </span>
      </div>
    </div>
  );

  // 환자별 히스토리 데이터
  const patientHistories = {
    '홍환자': [
      { date: '2024-09-20', ktas: 5, stayDuration: '8시간', placement: '중환자실' },
      { date: '2024-08-15', ktas: 4, stayDuration: '6시간', placement: '일반 병상' },
      { date: '2024-07-01', ktas: 3, stayDuration: '4시간', placement: '퇴원' },
    ],
    '김환자': [
      { date: '2024-10-01', ktas: 4, stayDuration: '10시간', placement: '일반 병상' },
      { date: '2024-09-15', ktas: 3, stayDuration: '5시간', placement: '퇴원' },
      { date: '2024-08-30', ktas: 5, stayDuration: '12시간', placement: '중환자실' },
      { date: '2024-08-10', ktas: 2, stayDuration: '3시간', placement: '퇴원' },
      { date: '2024-07-25', ktas: 4, stayDuration: '8시간', placement: '일반 병상' },
    ],
    '이환자': [
      { date: '2024-09-10', ktas: 1, stayDuration: '2시간', placement: '퇴원' },
      { date: '2024-07-20', ktas: 2, stayDuration: '3시간', placement: '퇴원' },
    ],
    '박환자': [
      { date: '2024-09-05', ktas: 2, stayDuration: '5시간', placement: '퇴원' },
      { date: '2024-08-01', ktas: 3, stayDuration: '7시간', placement: '일반 병상' },
      { date: '2024-06-15', ktas: 2, stayDuration: '4시간', placement: '퇴원' },
    ],
    '정환자': [
      { date: '2024-09-25', ktas: 3, stayDuration: '6시간', placement: '일반 병상' },
      { date: '2024-08-10', ktas: 2, stayDuration: '4시간', placement: '퇴원' },
      { date: '2024-07-05', ktas: 3, stayDuration: '5시간', placement: '퇴원' },
      { date: '2024-06-01', ktas: 4, stayDuration: '8시간', placement: '일반 병상' },
    ],
    '강환자': [
      { date: '2024-09-30', ktas: 1, stayDuration: '3시간', placement: '퇴원' },
      { date: '2024-08-20', ktas: 2, stayDuration: '4시간', placement: '퇴원' },
      { date: '2024-07-10', ktas: 1, stayDuration: '2시간', placement: '퇴원' },
    ],
  };

  // 피검사 데이터 (예시)
  const bloodTestData = `
    혈액검사 결과:
    
    1. 전혈구 검사 (Complete Blood Count, CBC)
       - 백혈구 (WBC): 7.5 x 10^3/μL (정상범위: 4.5-11.0)
       - 적혈구 (RBC): 5.0 x 10^6/μL (정상범위: 4.5-5.9)
       - 헤모글로빈 (Hgb): 14.5 g/dL (정상범위: 13.5-17.5)
       - 헤마토크릿 (Hct): 43% (정상범위: 41-53)
       - 혈소판 (PLT): 250 x 10^3/μL (정상범위: 150-450)

    2. 전해질 검사 (Electrolytes)
       - 나트륨 (Na): 140 mEq/L (정상범위: 135-145)
       - 칼륨 (K): 4.0 mEq/L (정상범위: 3.5-5.0)
       - 염소 (Cl): 102 mEq/L (정상범위: 98-106)
       - 중탄산염 (HCO3): 24 mEq/L (정상범위: 22-28)

    3. 신장 기능 검사
       - 혈액요소질소 (BUN): 15 mg/dL (정상범위: 7-20)
       - 크레아티닌 (Creatinine): 0.9 mg/dL (정상범위: 0.6-1.2)

    4. 간 기능 검사
       - AST (SGOT): 25 U/L (정상범위: 10-40)
       - ALT (SGPT): 30 U/L (정상범위: 7-56)
       - 알칼리성 인산분해효소 (ALP): 70 U/L (정상범위: 44-147)
       - 총 빌리루빈: 0.8 mg/dL (정상범위: 0.3-1.2)

    5. 지질 검사
       - 총 콜레스테롤: 180 mg/dL (정상범위: <200)
       - HDL 콜레스테롤: 50 mg/dL (정상범위: >40)
       - LDL 콜레스테롤: 110 mg/dL (정상범위: <130)
       - 중성지방: 120 mg/dL (정상범위: <150)

    6. 혈당 검사
       - 공복 혈당: 95 mg/dL (정상범위: 70-100)

    7. 염증 지표
       - C-반응성 단백 (CRP): 0.5 mg/dL (정상범위: <1.0)
       - 적혈구 침강속도 (ESR): 10 mm/hr (정상범위: 0-22)
  `;

  const handleDateClick = (date) => {
    setSelectedDate(date);
    // 여기에서 선택된 날짜에 대한 데이터를 가져오는 로직을 구현해야 합니다.
    // 예: fetchDataForDate(date);
  };

  // 선택된 날짜에 따라 데이터를 변경하는 useEffect
  useEffect(() => {
    if (selectedDate) {
      // 여기에서 선택된 날짜에 대한 데이터를 설정하는 로직을 구현해야 합니다.
      // 예: setPatient(fetchedData);
    }
  }, [selectedDate]);

  return (
    <div className="patient-details">
      <button onClick={onBack} className="back-button">목록으로 돌아가기</button>
      <PatientInfoBanner patient={patient} />
      <div className="data-header">
        <h3>{patient.name}의 생체 데이터</h3>
        <button onClick={() => setShowBloodTest(!showBloodTest)} className="blood-test-button">
          {showBloodTest ? '그래프만 보기' : '피검사 데이터 보기'}
        </button>
      </div>
      <div className={`data-container ${showBloodTest ? 'show-blood-test' : ''}`}>
        <div className="charts-container">
          <div className="chart-item">
            <h4>체온 변화</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={patient.vitalSigns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="체온(°C)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-item">
            <h4>심박수 및 혈압</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={patient.vitalSigns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="heartRate" stroke="#82ca9d" name="심박수(bpm)" />
                <Line yAxisId="right" type="monotone" dataKey="bloodPressure" stroke="#ffc658" name="혈압(mmHg)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-item">
            <h4>산소포화도 분포</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-item">
            <h4>주간 호흡수 변화</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="호흡수(/분)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {showBloodTest && (
          <div className="blood-test-data">
            <h4>피검사 데이터</h4>
            <pre>{bloodTestData}</pre>
          </div>
        )}
      </div>
      <br/>
      <h3>과거 응급실 방문 기록</h3>
      <div className="history-table-container">
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
            {patientHistories[patient.name].map((record, index) => (
              <tr key={index}>
                <td>
                  <button className="date-button" onClick={() => handleDateClick(record.date)}>
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
      </div>
    </div>
  );
}

export default Patient;