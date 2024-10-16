import React, { useState } from 'react';
import './next.css';

function Next({ onBack, onDecision }) {
  const [doctorNote, setDoctorNote] = useState('');
  const [emergencyLevel, setEmergencyLevel] = useState('');

  const handleDecisionClick = () => {
    if (!doctorNote.trim() || !emergencyLevel) {
      alert('의사 소견과 응급도 분류를 모두 입력해주세요.');
      return;
    }

    const decisionData = {
      doctorNote: doctorNote,
      emergencyLevel: emergencyLevel,
      timestamp: new Date().toISOString()
    };

    console.log('저장된 결정 데이터:', decisionData);
    onDecision();
  };

  return (
    <div className="next-screen">
      <div className="content-container">
        <h2>의사 소견 및 응급도 분류</h2>
        <textarea
          className="doctor-note"
          placeholder="의사 소견을 입력하세요"
          value={doctorNote}
          onChange={(e) => setDoctorNote(e.target.value)}
        />
        <select
          className="emergency-level"
          value={emergencyLevel}
          onChange={(e) => setEmergencyLevel(e.target.value)}
        >
          <option value="">응급도 선택</option>
          <option value="Level 1">Level 1</option>
          <option value="Level 2">Level 2</option>
          <option value="Level 3">Level 3</option>
          <option value="Level 4">Level 4</option>
          <option value="Level 5">Level 5</option>
        </select>
        <div className="back-button-container">
          <button className="back-button" onClick={onBack}>뒤로가기</button>
        </div>
        <div className="button-container">
          <button className="decision-button" onClick={handleDecisionClick}>결정</button>
        </div>
      </div>
    </div>
  );
}

export default Next;