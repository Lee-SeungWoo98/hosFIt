// src/components/Records.js
import React, { useState } from 'react';

const Records = () => {
  // 임시 데이터 (진료 기록)
  const [records, setRecords] = useState([
    { id: 1, date: '2023-10-01', details: '진료 기록 내용 1' },
    { id: 2, date: '2023-10-05', details: '진료 기록 내용 2' },
    { id: 3, date: '2023-10-10', details: '진료 기록 내용 3' },
  ]);

  // 새로운 기록 작성 상태
  const [newRecord, setNewRecord] = useState('');

  // 기록 작성 핸들러
  const handleAddRecord = () => {
    if (newRecord.trim() !== '') {
      const newRecordData = {
        id: records.length + 1,
        date: new Date().toISOString().split('T')[0], // 현재 날짜
        details: newRecord,
      };
      setRecords([...records, newRecordData]);
      setNewRecord('');
    }
  };

  return (
    <div>
      <h2>진료 기록</h2>
      {records.map((record) => (
        <div key={record.id}>
          <p>날짜: {record.date}</p>
          <p>내용: {record.details}</p>
          <hr />
        </div>
      ))}

      <div>
        <h3>새로운 진료 기록 작성</h3>
        <textarea
          value={newRecord}
          onChange={(e) => setNewRecord(e.target.value)}
          placeholder="새로운 진료 기록을 입력하세요."
        />
        <button onClick={handleAddRecord}>기록 추가</button>
      </div>
    </div>
  );
};

export default Records;
