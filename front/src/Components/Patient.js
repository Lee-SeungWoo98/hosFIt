import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import './Patient.css';

function Patient({ patient, onBack }) {
  const [showBloodTest, setShowBloodTest] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [patientInfo, setPatientInfo] = useState(null);
  const [patientHistory, setPatientHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    fetchPatientData();
  }, [patient.patientId]);

  const fetchPatientData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/selectPatient?patientId=${patient.patientId}`);
      if (response.data && response.data.patient) {
        setPatientInfo(response.data.patient);
        setPatientHistory(response.data.medicalRecords || []);
      } else {
        setPatientInfo(null);
        setPatientHistory([]);
      }
    } catch (err) {
      console.error('Error fetching patient data:', err);
      setError('환자 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleDateClick = (date) => {
    setSelectedDate(date);
    // 여기에서 선택된 날짜에 대한 데이터를 가져오는 로직을 구현해야 합니다.
    // 예: fetchDataForDate(date);
  };

  const renderChart = (title, chart, description) => (
    <div className="chart-item">
      <h4>{title}</h4>
      {chart}
      <p className="chart-description">그래프에 대한 설명을 적어주세요. {description}</p>
    </div>
  );

  const temperatureChart = (
    <ResponsiveContainer width="100%" height={200}>
      {patientInfo?.vitalSigns && patientInfo.vitalSigns.length > 0 ? (
        <LineChart data={patientInfo.vitalSigns}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
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
      {patientInfo?.vitalSigns && patientInfo.vitalSigns.length > 0 ? (
        <LineChart data={patientInfo.vitalSigns}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="heartRate" stroke="#82ca9d" name="심박수(bpm)" />
          <Line yAxisId="right" type="monotone" dataKey="bloodPressure" stroke="#ffc658" name="혈압(mmHg)" />
        </LineChart>
      ) : (
        <div className="no-data-message">데이터가 필요합니다.</div>
      )}
    </ResponsiveContainer>
  );

  const oxygenSaturationChart = (
    <ResponsiveContainer width="100%" height={200}>
      {patientInfo?.oxygenSaturation ? (
        <PieChart>
          <Pie
            data={[
              { name: '정상', value: patientInfo.oxygenSaturation.normal },
              { name: '경계', value: patientInfo.oxygenSaturation.borderline },
              { name: '위험', value: patientInfo.oxygenSaturation.critical },
            ]}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {COLORS.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <div className="no-data-message">데이터가 필요합니다.</div>
      )}
    </ResponsiveContainer>
  );

  const respirationRateChart = (
    <ResponsiveContainer width="100%" height={200}>
      {patientInfo?.respirationRate && patientInfo.respirationRate.length > 0 ? (
        <BarChart data={patientInfo.respirationRate}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" name="호흡수(/분)" />
        </BarChart>
      ) : (
        <div className="no-data-message">데이터가 필요합니다.</div>
      )}
    </ResponsiveContainer>
  );

  const bloodTestChart = (
    <ResponsiveContainer width="100%" height={300}>
      {patientInfo?.bloodTestData ? (
        <BarChart data={patientInfo.bloodTestData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      ) : (
        <div className="no-data-message">피검사 데이터가 없습니다.</div>
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
          {renderChart("체온 변화", temperatureChart, "체온 변화에 대한 AI 소견")}
          {renderChart("심박수 및 혈압", heartRateBloodPressureChart, "심박수 및 혈압에 대한 AI 소견")}
          {renderChart("산소포화도 분포", oxygenSaturationChart, "산소포화도 분포에 대한 AI 소견")}
          {renderChart("호흡수 변화", respirationRateChart, "호흡수 변화에 대한 AI 소견")}
        </div>
        {showBloodTest && (
          <div className="blood-test-data">
            <h4>피검사 데이터</h4>
            {bloodTestChart}
            <div className="ai-opinion">
              <h5>AI 소견</h5>
              <p>AI소견이 들어갈 곳입니다.</p>
            </div>
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
        )}
      </div>
    </div>
  );
}

export default Patient;