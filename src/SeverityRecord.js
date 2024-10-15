// src/components/SeverityRecord.js
import React from 'react';

const SeverityRecord = () => {
  // 임시 데이터 (중증도 기록)
  const severityRecords = [
    { id: 1, date: '2023-10-01', severity: '중증' },
    { id: 2, date: '2023-10-05', severity: '경증' },
    { id: 3, date: '2023-10-10', severity: '중증' },
  ];

  return (
    <div>
      <h2>중증도 기록 조회</h2>
      {severityRecords.map((record) => (
        <div key={record.id}>
          <p>날짜: {record.date}</p>
          <p>중증도: {record.severity}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default SeverityRecord;
