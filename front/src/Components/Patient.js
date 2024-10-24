import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import './Patient.css';

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

  const getPlacementRecommendation = (patient) => {
    if (patient.emergencyLevel === 'Level 5' || patient.emergencyLevel === 'Level 4') {
      return '입원';
    } else if (patient.emergencyLevel === 'Level 3' || patient.emergencyLevel === 'Level 2') {
      return '관찰';
    } else {
      return '퇴원';
    }
  };

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
            <strong>응급도 레벨</strong>
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
            {patientInfo?.emergencyLevel ? (
              <span className={`placement-recommendation ${getPlacementRecommendation(patientInfo)}`}>
                {getPlacementRecommendation(patientInfo)}
              </span>
            ) : '데이터가 없어요.'}
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
          <YAxis domain={[35, 42]} />
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
          <YAxis domain={[80, 100]} />
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
          <h4>피검사 데이터</h4>
          {labTests && labTests.length > 0 ? (
            <pre>{JSON.stringify(labTests, null, 2)}</pre>
          ) : (
            <p>피검사 데이터가 없습니다.</p>
          )}
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