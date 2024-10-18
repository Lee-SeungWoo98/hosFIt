import React, { useState } from 'react';
import './pp.css';

function PP({ selectedRoom, onBack }) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);

  const roomData = {
    '병실 1': [
      { id: 1, name: '이승우', status: 'occupied' },
      { id: 2, name: '이경준', status: 'occupied' },
      { id: 3, name: null, status: 'available' },
      { id: 4, name: '박강준', status: 'occupied' },
      { id: 5, name: '기나영', status: 'occupied' },
      { id: 6, name: null, status: 'available' },
      { id: 7, name: '이경원', status: 'occupied' },
      { id: 8, name: null, status: 'available' },
    ],
    '병실 2': [
      { id: 1, name: '박민수', status: 'occupied' },
      { id: 2, name: null, status: 'available' },
      { id: 3, name: '정성훈', status: 'occupied' },
      { id: 4, name: '강지영', status: 'occupied' },
      { id: 5, name: '이승우', status: 'occupied' },
      { id: 6, name: null, status: 'available' },
      { id: 7, name: '김연아', status: 'occupied' },
      { id: 8, name: null, status: 'available' },
    ],
    '병실 3': [
      { id: 1, name: '최예진', status: 'occupied' },
      { id: 2, name: '황민우', status: 'occupied' },
      { id: 3, name: null, status: 'available' },
      { id: 4, name: null, status: 'available' },
      { id: 5, name: '유재석', status: 'occupied' },
      { id: 6, name: '강호동', status: 'occupied' },
      { id: 7, name: null, status: 'available' },
      { id: 8, name: '이효리', status: 'occupied' },
    ],
    '병실 4': [
      { id: 1, name: '송혜교', status: 'occupied' },
      { id: 2, name: '김수현', status: 'occupied' },
      { id: 3, name: '전지현', status: 'occupied' },
      { id: 4, name: null, status: 'available' },
      { id: 5, name: '차은우', status: 'occupied' },
      { id: 6, name: null, status: 'available' },
      { id: 7, name: '박보검', status: 'occupied' },
      { id: 8, name: '수지', status: 'occupied' },
    ],
    '병실 5': [
      { id: 1, name: '이병헌', status: 'occupied' },
      { id: 2, name: null, status: 'available' },
      { id: 3, name: '공유', status: 'occupied' },
      { id: 4, name: '손예진', status: 'occupied' },
      { id: 5, name: '현빈', status: 'occupied' },
      { id: 6, name: '김태희', status: 'occupied' },
      { id: 7, name: null, status: 'available' },
      { id: 8, name: '이민호', status: 'occupied' },
    ],
    '병실 6': [
      { id: 1, name: '박보검', status: 'occupied' },
      { id: 2, name: '아이유', status: 'occupied' },
      { id: 3, name: null, status: 'available' },
      { id: 4, name: '김태희', status: 'occupied' },
      { id: 5, name: '조정석', status: 'occupied' },
      { id: 6, name: '김고은', status: 'occupied' },
      { id: 7, name: null, status: 'available' },
      { id: 8, name: '박서준', status: 'occupied' },
    ],
    '병실 7': [
      { id: 1, name: '조인성', status: 'occupied' },
      { id: 2, name: '한지민', status: 'occupied' },
      { id: 3, name: '박서준', status: 'occupied' },
      { id: 4, name: null, status: 'available' },
      { id: 5, name: '김우빈', status: 'occupied' },
      { id: 6, name: '신민아', status: 'occupied' },
      { id: 7, name: null, status: 'available' },
      { id: 8, name: '이성경', status: 'occupied' },
    ],
  };

  const handleBedClick = (patient) => {
    if (patient.name) {
      setSelectedPatient(patient);
      setShowPatientModal(true);
    }
  };

  const closePatientModal = () => {
    setShowPatientModal(false);
    setSelectedPatient(null);
  };

  return (
    <div className="room-view">
      <button className="back-button" onClick={onBack}>뒤로 가기</button>
      <h2>{selectedRoom} 현황</h2>
      <div className="bed-container">
        {roomData[selectedRoom].map((bed) => (
          <div
            key={bed.id}
            className={`bed ${bed.status}`}
            onClick={() => handleBedClick(bed)}
          >
            <span className="bed-number">{bed.id}</span>
            <span className="patient-name">{bed.name || '비어있음'}</span>
          </div>
        ))}
      </div>

      {showPatientModal && selectedPatient && (
        <div className="modal-overlay" onClick={closePatientModal}>
          <div className="patient-modal" onClick={(e) => e.stopPropagation()}>
            <h3>환자 정보</h3>
            <p>이름: {selectedPatient.name}</p>
            <p>병상 번호: {selectedPatient.id}</p>
            <button onClick={closePatientModal}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PP;