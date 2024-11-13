import React, { useState } from 'react';
import { Save, Info, Bell, Check, Hospital } from 'lucide-react';
import { useScores } from '../../../context/ScoreContext';

// SettingsCard 컴포넌트
const SettingsCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// Checkbox 컴포넌트
const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center space-x-3 cursor-pointer group">
    <div className="relative">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="h-5 w-5 border-2 rounded border-gray-300 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all group-hover:border-blue-500">
        {checked && (
          <Check className="h-4 w-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
    </div>
    <span className="text-gray-700">{label}</span>
  </label>
);

const Settings = ({ showNotification }) => {
  const { scores, updateScores } = useScores();
  
  // 점수 설정 상태
  const [scoreSettings, setScoreSettings] = useState({
    icu: scores.icu,
    ward: scores.ward,
    discharge: scores.discharge
  });

  // 추가 상태들
  const [bedCapacity, setBedCapacity] = useState({
    totalBeds: 48,
    criticalBeds: 10,
    regularBeds: 38
  });

  const [maintenanceEmail, setMaintenanceEmail] = useState('maintenance@hospital.com');

  // 점수 설정 핸들러
  const handleScoreChange = (type, value) => {
    const numValue = parseInt(value) || 0;
    setScoreSettings(prev => ({
      ...prev,
      [type]: numValue
    }));
  };

  // 병상 수 변경 핸들러
  const handleBedCapacityChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    setBedCapacity(prev => {
      const newState = { ...prev, [field]: numValue };
      
      if (field === 'criticalBeds' || field === 'regularBeds') {
        newState.totalBeds = newState.criticalBeds + newState.regularBeds;
      }
      else if (field === 'totalBeds') {
        const ratio = prev.criticalBeds / (prev.criticalBeds + prev.regularBeds);
        newState.criticalBeds = Math.round(numValue * ratio);
        newState.regularBeds = numValue - newState.criticalBeds;
      }
      
      return newState;
    });
  };

  const validateSettings = () => {
    if (scoreSettings.icu <= scoreSettings.ward || 
        scoreSettings.ward <= scoreSettings.discharge) {
      showNotification('점수는 ICU > 일반병동 > 퇴원 순서로 설정되어야 합니다.', 'error');
      return false;
    }

    if (scoreSettings.icu > 100 || scoreSettings.ward > 100 || 
        scoreSettings.discharge > 100) {
      showNotification('점수는 100을 초과할 수 없습니다.', 'error');
      return false;
    }

    return true;
  };

  const handleSaveSettings = () => {
    if (!validateSettings()) return;
    
    try {
      updateScores(scoreSettings);
      showNotification('설정이 저장되었습니다.', 'success');
    } catch (error) {
      showNotification('설정 저장 중 오류가 발생했습니다.', 'error');
    }
  };

  return (
    <div className="p-6 space-y-6">
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
                  value={scoreSettings.icu}
                  onChange={(e) => handleScoreChange('icu', e.target.value)}
                  min="0"
                  max="100"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <span className="ml-2 text-gray-500">점</span>
              </div>
              <div className="flex items-center text-sm text-blue-600">
                <Info className="h-4 w-4 mr-1" />
                <span>≥ {scoreSettings.icu}점</span>
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
                  value={scoreSettings.ward}
                  onChange={(e) => handleScoreChange('ward', e.target.value)}
                  min="0"
                  max="100"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <span className="ml-2 text-gray-500">점</span>
              </div>
              <div className="flex items-center text-sm text-blue-600">
                <Info className="h-4 w-4 mr-1" />
                <span>{scoreSettings.ward}~{scoreSettings.icu - 1}점</span>
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
                  value={scoreSettings.discharge}
                  onChange={(e) => handleScoreChange('discharge', e.target.value)}
                  min="0"
                  max="100"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <span className="ml-2 text-gray-500">점</span>
              </div>
              <div className="flex items-center text-sm text-blue-600">
                <Info className="h-4 w-4 mr-1" />
                <span>≤ {scoreSettings.discharge}점</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-500 bg-yellow-50  p-4 rounded-md flex items-start gap-2">
            <Info className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
            <p>
              입실/퇴원 기준 점수는 환자의 자동 배치에 직접적인 영향을 미칩니다. 
              <br/>
              각 점수는 다음 조건을 만족해야 합니다.
              <br />
              <br /><span className="font-bold">- ICU 입실 점수 {'>'} 일반병동 점수 {'>'} 퇴원 점수</span>
              <br /><span className="font-bold">- 모든 점수는 0-100 사이의 값이어야 합니다</span>
            </p>
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

      {/* 병상 설정 */}
      <SettingsCard title="병상 설정" icon={Hospital}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전체 병상 수
              </label>
              <input
                type="number"
                value={bedCapacity.totalBeds}
                onChange={(e) => handleBedCapacityChange('totalBeds', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* 알림 설정 */}
      <SettingsCard title="알림 설정" icon={Bell}>
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 text-sm font-medium">유지보수 담당자 이메일</span>
              <input
                type="email"
                value={maintenanceEmail}
                onChange={(e) => setMaintenanceEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="이메일 주소 입력"
              />
            </label>
          </div>
        </div>
      </SettingsCard>

      {/* 저장 버튼 */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          취소
        </button>
        <button
          onClick={handleSaveSettings}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save className="h-4 w-4 mr-2" />
          설정 저장
        </button>
      </div>
    </div>
  );
};

export default Settings;