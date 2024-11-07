import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Save, Download, AlertTriangle, RotateCw, Info } from 'lucide-react';
import { useScores } from '../../ScoreContext';

const AIModel = () => {
  const { scores, updateScores } = useScores();

  // 모델 성능 데이터
  const performanceData = [
    { day: "10/18", accuracy: 92.5, precision: 91.2, recall: 93.8 },
    { day: "10/19", accuracy: 93.1, precision: 92.0, recall: 94.2 },
    { day: "10/20", accuracy: 93.8, precision: 92.8, recall: 94.8 },
    { day: "10/21", accuracy: 94.2, precision: 93.5, recall: 95.0 },
    { day: "10/22", accuracy: 94.5, precision: 93.8, recall: 95.2 },
    { day: "10/23", accuracy: 94.3, precision: 93.6, recall: 95.0 },
    { day: "10/24", accuracy: 94.5, precision: 93.9, recall: 95.3 }
  ];

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

      {/* 모델 성능 모니터링 섹션 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            모델 성능 모니터링
          </h2>
          <select className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <option value="7">최근 7일</option>
            <option value="14">최근 14일</option>
            <option value="30">최근 30일</option>
          </select>
        </div>

        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                domain={[90, 100]} 
                tick={{ fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                name="정확도" 
                stroke="#2563EB" 
                strokeWidth={2}
                dot={{ fill: '#2563EB', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="precision" 
                name="정밀도" 
                stroke="#059669" 
                strokeWidth={2}
                dot={{ fill: '#059669', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="recall" 
                name="재현율" 
                stroke="#DC2626" 
                strokeWidth={2}
                dot={{ fill: '#DC2626', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 모델 업데이트 이력 */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              모델 업데이트 이력
            </h2>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Download className="h-4 w-4 mr-2" />
              CSV 내보내기
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">버전</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">정확도</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">정밀도</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">재현율</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">변경사항</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-10-24</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">v2.1.0</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">94.5%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">93.9%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">95.3%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">LSTM 레이어 최적화</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      활성
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2024-10-15</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">v2.0.1</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">93.2%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">92.5%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">94.0%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">데이터 전처리 개선</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      비활성
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModel;