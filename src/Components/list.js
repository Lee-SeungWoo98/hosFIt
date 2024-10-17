import React, { useState } from 'react';
import Patient from './Patient';

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

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);

  const showPatientDetails = (patient) => {
    setSelectedPatient(patient);
  };

  const handleBackToList = () => {
    setSelectedPatient(null);
  };

  if (selectedPatient) {
    return <Patient patient={selectedPatient} onBack={handleBackToList} />;
  }

  return (
    <div className="content-area">
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
    </div>
  );
}

export default List;