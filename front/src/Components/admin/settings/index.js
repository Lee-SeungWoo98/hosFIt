import React, { useState } from 'react';
import { Save, Check, Info, Bell, Server, Database, Hospital } from 'lucide-react';
import { useScores } from '../../ScoreContext';

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
  
  // State management
  const [notificationSettings, setNotificationSettings] = useState({
    errorAlert: true,
    performanceAlert: true,
    systemUpdateAlert: true
  });

  const [dashboardSettings, setDashboardSettings] = useState({
    refreshInterval: '30',
    showTrendLine: true,
    showTooltip: true
  });

  const [bedCapacity, setBedCapacity] = useState({
    totalBeds: 48,
    criticalBeds: 10,
    regularBeds: 38
  });

  const [scoreSettings, setScoreSettings] = useState({
    icu: scores.icu,
    ward: scores.ward,
    discharge: scores.discharge
  });

  const [maintenanceEmail, setMaintenanceEmail] = useState('maintenance@hospital.com');

  // Event handlers
  const handleNotificationChange = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleDashboardChange = (setting, value) => {
    setDashboardSettings(prev => ({
      ...prev,
      [setting]: setting === 'refreshInterval' ? value : !prev[setting]
    }));
  };

  const handleBedCapacityChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    setBedCapacity(prev => {
      const newState = { ...prev, [field]: numValue };
      
      // Automatically update total beds when changing critical or regular beds
      if (field === 'criticalBeds' || field === 'regularBeds') {
        newState.totalBeds = newState.criticalBeds + newState.regularBeds;
      }
      // Adjust critical and regular beds proportionally when changing total
      else if (field === 'totalBeds') {
        const ratio = prev.criticalBeds / (prev.criticalBeds + prev.regularBeds);
        newState.criticalBeds = Math.round(numValue * ratio);
        newState.regularBeds = numValue - newState.criticalBeds;
      }
      
      return newState;
    });
  };

  const handleScoreChange = (type, value) => {
    const numValue = parseInt(value) || 0;
    setScoreSettings(prev => ({
      ...prev,
      [type]: numValue
    }));
  };

  const validateSettings = () => {
    // Validate score settings
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

    // Validate bed capacity
    if (bedCapacity.totalBeds !== bedCapacity.criticalBeds + bedCapacity.regularBeds) {
      showNotification('병상 수가 올바르지 않습니다.', 'error');
      return false;
    }

    return true;
  };

  const handleSaveSettings = () => {
    if (!validateSettings()) return;

    // Update global score context
    updateScores(scoreSettings);
    
    // Here you would typically make API calls to save the settings
    console.log('Saving settings:', {
      notificationSettings,
      dashboardSettings,
      bedCapacity,
      scoreSettings,
      maintenanceEmail
    });

    showNotification('설정이 저장되었습니다.', 'success');
  };

  return (
    <div className="p-6 space-y-6">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                중환자 병상
              </label>
              <input
                type="number"
                value={bedCapacity.criticalBeds}
                onChange={(e) => handleBedCapacityChange('criticalBeds', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                일반 병상
              </label>
              <input
                type="number"
                value={bedCapacity.regularBeds}
                onChange={(e) => handleBedCapacityChange('regularBeds', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* 입실/퇴원 기준 점수 설정 */}
      <SettingsCard title="입실/퇴원 기준 점수 설정" icon={Server}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ICU 입실 점수
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={scoreSettings.icu}
                  onChange={(e) => handleScoreChange('icu', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <span className="ml-2 text-gray-500">점</span>
              </div>
              <div className="mt-1 flex items-center text-sm text-blue-600">
                <Info className="h-4 w-4 mr-1" />
                <span>≥ {scoreSettings.icu}점</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                일반병동 점수
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={scoreSettings.ward}
                  onChange={(e) => handleScoreChange('ward', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <span className="ml-2 text-gray-500">점</span>
              </div>
              <div className="mt-1 flex items-center text-sm text-blue-600">
                <Info className="h-4 w-4 mr-1" />
                <span>{scoreSettings.ward}~{scoreSettings.icu - 1}점</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                퇴원 점수
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={scoreSettings.discharge}
                  onChange={(e) => handleScoreChange('discharge', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <span className="ml-2 text-gray-500">점</span>
              </div>
              <div className="mt-1 flex items-center text-sm text-blue-600">
                <Info className="h-4 w-4 mr-1" />
                <span>≤ {scoreSettings.discharge}점</span>
              </div>
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

      {/* 대시보드 설정 */}
      <SettingsCard title="대시보드 설정" icon={Database}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">데이터 갱신 주기</label>
            <select
              value={dashboardSettings.refreshInterval}
              onChange={(e) => handleDashboardChange('refreshInterval', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="30">30초</option>
              <option value="60">1분</option>
              <option value="300">5분</option>
            </select>
          </div>

          <div className="space-y-3">
            <Checkbox
              label="추세선 표시"
              checked={dashboardSettings.showTrendLine}
              onChange={() => handleDashboardChange('showTrendLine')}
            />
            <Checkbox
              label="툴팁 표시"
              checked={dashboardSettings.showTooltip}
              onChange={() => handleDashboardChange('showTooltip')}
            />
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