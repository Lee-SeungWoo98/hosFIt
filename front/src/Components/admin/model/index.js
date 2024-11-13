import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Save, Download, AlertTriangle, RotateCw, Info } from 'lucide-react';
import { useScores } from '../../ScoreContext';

const AIModel = () => {
  const { scores, updateScores } = useScores();

  // 모델 성능 데이터


  const handleScoreChange = (type, value) => {
    const newScores = {
      ...scores,
      [type]: parseInt(value) || 0
    };
    updateScores(newScores);
  };

  const handleSaveSettings = () => {
    alert('설정이 저장되었습니다.');
  };

  return (
    <div className="space-y-6 p-6">
      {/* 경고 알림 */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
        <p className="text-amber-800 text-sm">
          입실/퇴원 기준 점수를 변경하면 환자 배치에 직접적인 영향을 미칩니다. 신중하게 검토 후 변경해주세요.
        </p>
      </div>

      {/* 점수 설정 섹션 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            입실/퇴원 기준 점수 설정
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ICU 점수 설정 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                ICU 입실
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={scores.icu}
                  onChange={(e) => handleScoreChange('icu', e.target.value)}
                  min="0"
                  max="100"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <span className="ml-2 text-gray-500">점</span>
              </div>
              <div className="flex items-center text-sm text-blue-600">
                <Info className="h-4 w-4 mr-1" />
                <span>≥ {scores.icu}점</span>
              </div>
            </div>

            {/* 일반병동 점수 설정 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                일반병동
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={scores.ward}
                  onChange={(e) => handleScoreChange('ward', e.target.value)}
                  min="0"
                  max="100"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <span className="ml-2 text-gray-500">점</span>
              </div>
              <div className="flex items-center text-sm text-blue-600">
                <Info className="h-4 w-4 mr-1" />
                <span>{scores.ward}~{scores.icu - 1}점</span>
              </div>
            </div>

            {/* 퇴원 점수 설정 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                퇴원
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={scores.discharge}
                  onChange={(e) => handleScoreChange('discharge', e.target.value)}
                  min="0"
                  max="100"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <span className="ml-2 text-gray-500">점</span>
              </div>
              <div className="flex items-center text-sm text-blue-600">
                <Info className="h-4 w-4 mr-1" />
                <span>≤ {scores.discharge}점</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
          <div className="flex justify-end">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleSaveSettings}
            >
              <Save className="h-4 w-4 mr-2" />
              설정 저장
            </button>
          </div>
        </div>
      </div>
 

    </div>
  );
};

export default AIModel;