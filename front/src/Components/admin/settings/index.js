import React, { useState } from 'react';
import { Edit, Check, Info, Server, Database } from 'lucide-react';

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

  const [maintenanceEmail, setMaintenanceEmail] = useState('maintenance@hospital.com');

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

  const handleSaveSettings = () => {
    showNotification('설정이 저장되었습니다.', 'success');
  };

  return (
    <div className="p-6 space-y-6">
      {/* 알림 설정 */}
      <SettingsCard title="알림 설정" icon={Edit}>
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

            <div className="space-y-3">
              <Checkbox
                label="에러 발생 시 자동 알림"
                checked={notificationSettings.errorAlert}
                onChange={() => handleNotificationChange('errorAlert')}
              />
              <Checkbox
                label="성능 저하 시 알림"
                checked={notificationSettings.performanceAlert}
                onChange={() => handleNotificationChange('performanceAlert')}
              />
              <Checkbox
                label="시스템 업데이트 알림"
                checked={notificationSettings.systemUpdateAlert}
                onChange={() => handleNotificationChange('systemUpdateAlert')}
              />
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* 대시보드 설정 */}
      <SettingsCard title="대시보드 설정" icon={Edit}>
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

      {/* 시스템 정보 */}
      <SettingsCard title="시스템 정보" icon={Info}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">버전</div>
              <div className="mt-1 text-gray-900">v2.1.0</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">최근 업데이트</div>
              <div className="mt-1 text-gray-900">2024-10-25</div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-500">서버 상태</span>
              </div>
              <div className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  정상
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-500">데이터베이스 상태</span>
              </div>
              <div className="mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  정상
                </span>
              </div>
            </div>
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
          <Check className="h-4 w-4 mr-2" />
          설정 저장
        </button>
      </div>
    </div>
  );
};

export default Settings;