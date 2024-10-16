import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

function List() {
  const [patients] = useState([
    { id: 6, name: '홍환자', age: 45, status: '응급', condition: '위험', admissionDate: '2024-10-16 09:00', doctor: '최의사', emergencyLevel: 'Level 5', stayDuration: '7시간', vitalSigns: [
      { time: '09:00', temperature: 39.0, heartRate: 120, bloodPressure: 160, respiratoryRate: 22, oxygenSaturation: 94 },
      { time: '10:00', temperature: 38.8, heartRate: 115, bloodPressure: 155, respiratoryRate: 20, oxygenSaturation: 95 },
      { time: '11:00', temperature: 38.5, heartRate: 110, bloodPressure: 150, respiratoryRate: 19, oxygenSaturation: 96 },
      { time: '12:00', temperature: 38.2, heartRate: 105, bloodPressure: 145, respiratoryRate: 18, oxygenSaturation: 97 },
    ]},
    { id: 5, name: '김환자', age: 32, status: '응급', condition: '위험', admissionDate: '2024-10-15 14:00', doctor: '박의사', emergencyLevel: 'Level 4', stayDuration: '26시간', vitalSigns: [
      { time: '09:00', temperature: 38.5, heartRate: 110, bloodPressure: 150, respiratoryRate: 20, oxygenSaturation: 95 },
      { time: '10:00', temperature: 38.2, heartRate: 105, bloodPressure: 145, respiratoryRate: 19, oxygenSaturation: 96 },
      { time: '11:00', temperature: 37.9, heartRate: 100, bloodPressure: 140, respiratoryRate: 18, oxygenSaturation: 97 },
      { time: '12:00', temperature: 37.5, heartRate: 95, bloodPressure: 135, respiratoryRate: 17, oxygenSaturation: 98 },
    ]},
    { id: 4, name: '이환자', age: 28, status: '안정', condition: '양호', admissionDate: '2024-10-15 10:00', doctor: '김의사', emergencyLevel: 'Level 1', stayDuration: '30시간', vitalSigns: [
      { time: '09:00', temperature: 36.8, heartRate: 75, bloodPressure: 120, respiratoryRate: 14, oxygenSaturation: 98 },
      { time: '10:00', temperature: 36.7, heartRate: 72, bloodPressure: 118, respiratoryRate: 14, oxygenSaturation: 99 },
      { time: '11:00', temperature: 36.9, heartRate: 74, bloodPressure: 122, respiratoryRate: 15, oxygenSaturation: 98 },
      { time: '12:00', temperature: 36.8, heartRate: 73, bloodPressure: 120, respiratoryRate: 14, oxygenSaturation: 99 },
    ]},
    { id: 3, name: '박환자', age: 55, status: '관찰', condition: '보통', admissionDate: '2024-10-14 18:00', doctor: '이의사', emergencyLevel: 'Level 2', stayDuration: '46시간', vitalSigns: [
      { time: '09:00', temperature: 37.2, heartRate: 85, bloodPressure: 130, respiratoryRate: 16, oxygenSaturation: 97 },
      { time: '10:00', temperature: 37.0, heartRate: 82, bloodPressure: 128, respiratoryRate: 15, oxygenSaturation: 97 },
      { time: '11:00', temperature: 37.1, heartRate: 84, bloodPressure: 129, respiratoryRate: 16, oxygenSaturation: 98 },
      { time: '12:00', temperature: 37.0, heartRate: 83, bloodPressure: 127, respiratoryRate: 15, oxygenSaturation: 98 },
    ]},
    { id: 2, name: '정환자', age: 40, status: '관찰', condition: '보통', admissionDate: '2024-10-14 12:00', doctor: '최의사', emergencyLevel: 'Level 3', stayDuration: '52시간', vitalSigns: [
      { time: '09:00', temperature: 37.5, heartRate: 90, bloodPressure: 135, respiratoryRate: 17, oxygenSaturation: 96 },
      { time: '10:00', temperature: 37.3, heartRate: 88, bloodPressure: 133, respiratoryRate: 16, oxygenSaturation: 97 },
      { time: '11:00', temperature: 37.4, heartRate: 89, bloodPressure: 134, respiratoryRate: 17, oxygenSaturation: 97 },
      { time: '12:00', temperature: 37.2, heartRate: 87, bloodPressure: 132, respiratoryRate: 16, oxygenSaturation: 98 },
    ]},
    { id: 1, name: '강환자', age: 60, status: '안정', condition: '양호', admissionDate: '2024-10-13 08:00', doctor: '한의사', emergencyLevel: 'Level 1', stayDuration: '80시간', vitalSigns: [
      { time: '09:00', temperature: 36.7, heartRate: 70, bloodPressure: 115, respiratoryRate: 13, oxygenSaturation: 99 },
      { time: '10:00', temperature: 36.8, heartRate: 72, bloodPressure: 118, respiratoryRate: 14, oxygenSaturation: 99 },
      { time: '11:00', temperature: 36.7, heartRate: 71, bloodPressure: 116, respiratoryRate: 13, oxygenSaturation: 99 },
      { time: '12:00', temperature: 36.9, heartRate: 73, bloodPressure: 117, respiratoryRate: 14, oxygenSaturation: 99 },
    ]},
  ]);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5;

  const showPatientDetails = (patient) => {
    setSelectedPatient(patient);
  };

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

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);

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
      { date: '2024-07-05', ktas: 3, stayDuration: '6시간', placement: '퇴원' },
      { date: '2024-06-20', ktas: 5, stayDuration: '15시간', placement: '중환자실' },
      { date: '2024-06-01', ktas: 4, stayDuration: '9시간', placement: '일반 병상' },
      { date: '2024-05-15', ktas: 2, stayDuration: '4시간', placement: '퇴원' },
      { date: '2024-05-01', ktas: 3, stayDuration: '7시간', placement: '퇴원' },
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

  return (
    <div className="content-area">
      {!selectedPatient ? (
        <div className="table-container">
          <h2>응급실 환자 리스트 <span>(총 {patients.length}명)</span></h2>
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>환자명</th>
                <th>상태</th>
                <th>응급도</th>
                <th>입원일</th>
                <th>담당의</th>
                <th>상세정보</th>
                <th>응급도 레벨</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.map(patient => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{patient.name}</td>
                  <td><span className={`status-dot ${patient.status.toLowerCase()}`}></span>{patient.status}</td>
                  <td>{patient.condition}</td>
                  <td>{patient.admissionDate}</td>
                  <td>{patient.doctor}</td>
                  <td>
                    <button onClick={() => showPatientDetails(patient)} className="detail-button">상세정보</button>
                  </td>
                  <td>{patient.emergencyLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button className="page-button" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>&lt;</button>
            <button className="page-button active">{currentPage}</button>
            <button className="page-button" onClick={() => setCurrentPage(prev => prev + 1)}>&gt;</button>
          </div>
        </div>
      ) : (
        <div className="patient-details">
          <button onClick={() => setSelectedPatient(null)} className="back-button">목록으로 돌아가기</button>
          <PatientInfoBanner patient={selectedPatient} />
          <h3>{selectedPatient.name}의 생체 데이터</h3>
          <div className="charts-container">
            <div className="chart-item">
              <h4>체온 변화</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={selectedPatient.vitalSigns}>
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
                <LineChart data={selectedPatient.vitalSigns}>
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
                {patientHistories[selectedPatient.name].map((record, index) => (
                  <tr key={index}>
                    <td>{record.date}</td>
                    <td>{record.ktas}</td>
                    <td>{record.stayDuration}</td>
                    <td>{record.placement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default List;