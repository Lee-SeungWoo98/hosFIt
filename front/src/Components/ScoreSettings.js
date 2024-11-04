import React, { useState } from 'react';
import { Info } from 'lucide-react';

const ScoreSettings = ({ onSave }) => {
  const [scores, setScores] = useState({
    icu: 75,
    ward: 45,
    discharge: 25
  });

  const handleScoreChange = (type, value) => {
    setScores(prev => ({
      ...prev,
      [type]: parseInt(value) || 0
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">입실/퇴원 기준 점수 설정</h3>
        <span className="text-sm text-gray-500">마지막 수정: 2024-10-24 15:30</span>
      </div>
      
      <div className="flex flex-nowrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 min-w-[250px]">
          <span className="text-sm font-medium w-20">ICU 입실</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={scores.icu}
              onChange={(e) => handleScoreChange('icu', e.target.value)}
              className="w-20 px-3 py-1.5 border rounded text-right"
            />
            <span className="text-sm">점</span>
          </div>
          <div className="flex items-center text-blue-500">
            <Info className="h-4 w-4 mr-1" />
            <span className="text-sm whitespace-nowrap">≥ 75점</span>
          </div>
        </div>

        <div className="flex items-center gap-4 min-w-[250px]">
          <span className="text-sm font-medium w-20">일반병동</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={scores.ward}
              onChange={(e) => handleScoreChange('ward', e.target.value)}
              className="w-20 px-3 py-1.5 border rounded text-right"
            />
            <span className="text-sm">점</span>
          </div>
          <div className="flex items-center text-blue-500">
            <Info className="h-4 w-4 mr-1" />
            <span className="text-sm whitespace-nowrap">45~74점</span>
          </div>
        </div>

        <div className="flex items-center gap-4 min-w-[250px]">
          <span className="text-sm font-medium w-20">퇴원</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={scores.discharge}
              onChange={(e) => handleScoreChange('discharge', e.target.value)}
              className="w-20 px-3 py-1.5 border rounded text-right"
            />
            <span className="text-sm">점</span>
          </div>
          <div className="flex items-center text-blue-500">
            <Info className="h-4 w-4 mr-1" />
            <span className="text-sm whitespace-nowrap">≤ 25점</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => onSave(scores)}
          style={{ backgroundColor: '#2563eb' }}
          className="px-4 py-2 text-white rounded hover:bg-blue-700 transition-colors"
        >
          설정 저장
        </button>
      </div>
    </div>
  );
};

export default ScoreSettings;