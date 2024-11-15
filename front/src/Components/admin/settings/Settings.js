import React, { useState } from 'react';
import { Save, Info, Bell, Hospital } from 'lucide-react';
import axios from 'axios';

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

const Settings = ({ showNotification }) => {
  // 가중치 설정 상태 - 테스트용 초기값
  const [weights, setWeights] = useState({
    discharge: 0.5,  // 퇴원 가중치 테스트값
    ward: 0.6,      // 일반병동 가중치 테스트값
    icu: 0.7        // 중환자실 가중치 테스트값
  });
  
  // 병상 설정 상태
  const [bedCapacity, setBedCapacity] = useState({
    totalBeds: 48,
    criticalBeds: 10,
    regularBeds: 38
  });

  // 알림 설정 상태
  const [maintenanceEmail, setMaintenanceEmail] = useState('maintenance@hospital.com');

  // 가중치 변경 핸들러
  const handleWeightChange = (type, value) => {
    const numValue = Math.min(Math.max(parseFloat(value) || 0, 0.0), 0.9);
    setWeights(prev => ({
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

  // 설정 유효성 검사
  const validateSettings = () => {
    // 가중치 검증
    if (weights.icu < weights.ward || weights.ward < weights.discharge) {
      showNotification('가중치는 중환자실 > 일반병동 > 퇴원 순서로 설정되어야 합니다.', 'error');
      return false;
    }

    if (weights.icu > 0.9 || weights.ward > 0.9 || weights.discharge > 0.9) {
      showNotification('가중치는 0.9를 초과할 수 없습니다.', 'error');
      return false;
    }

    // 병상 수 검증
    if (bedCapacity.totalBeds <= 0) {
      showNotification('전체 병상 수는 0보다 커야 합니다.', 'error');
      return false;
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(maintenanceEmail)) {
      showNotification('유효한 이메일 주소를 입력해주세요.', 'error');
      return false;
    }

    return true;
  };

  // 가중치 저장 핸들러
  const KEY_MAPPINGS = {
    discharge: '퇴원',
    ward: '응급 병동',
    icu: '중환'
  };
  
  const handleWeightsSave = async () => {
    try {
      const requests = [
        { key: '0', value: weights.discharge }, // 퇴원
        { key: '1', value: weights.ward },      // 일반병동
        { key: '2', value: weights.icu }        // 중환자실
      ];
  
      for (const { key, value } of requests) {
        await axios.put(`http://localhost:8082/boot/thresholds/${key}`, null, {
          params: {
            value: value
          }
        });
      }
        
      showNotification('가중치 설정이 저장되었습니다.', 'success');
    } catch (error) {
      console.error('가중치 저장 오류:', error);
      showNotification('가중치 저장 중 오류가 발생했습니다.', 'error');
    }
  };

  
  // 일반 설정 저장 핸들러
  const handleSaveSettings = () => {
    if (!validateSettings()) return;

    try {
      // 각 섹션별 설정 저장 로직
      showNotification('설정이 저장되었습니다.', 'success');
    } catch (error) {
      showNotification('설정 저장 중 오류가 발생했습니다.', 'error');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 가중치 설정 섹션 */}
      <SettingsCard title="가중치 설정" icon={Save}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 퇴원 가중치 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                퇴원 가중치
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={weights.discharge}
                  onChange={(e) => handleWeightChange('discharge', e.target.value)}
                  step="0.1"
                  min="0.0"
                  max="0.9"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* 일반병동 가중치 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                일반병동 가중치
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={weights.ward}
                  onChange={(e) => handleWeightChange('ward', e.target.value)}
                  step="0.1"
                  min="0.0"
                  max="0.9"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* 중환자실 가중치 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                중환자실 가중치
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={weights.icu}
                  onChange={(e) => handleWeightChange('icu', e.target.value)}
                  step="0.1"
                  min="0.0"
                  max="0.9"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* 가중치 설정 안내 */}
          <div className="mt-4 text-sm text-gray-500 bg-yellow-50 p-4 rounded-md flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <p>
              각 영역별 가중치 값은 현재 DB에 저장된 값입니다.
              <br />
              <br />
              <span className="font-medium">- 가중치 범위: 0.0 ~ 0.9</span>
              <br />
              <span className="font-medium">- 저장 버튼을 클릭해야 변경사항이 적용됩니다.</span>
            </p>
          </div>

          {/* 가중치 저장 버튼 */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleWeightsSave}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="h-4 w-4 mr-2" />
              가중치 설정 저장
            </button>
          </div>
        </div>
      </SettingsCard>

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