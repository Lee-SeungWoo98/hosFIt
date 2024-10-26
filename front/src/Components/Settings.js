import React, { useState } from 'react';
import { Edit, Check } from 'lucide-react';
import './styles/Settings.css';

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
    // 설정 저장 로직
    showNotification('설정이 저장되었습니다.', 'success');
  };

  return (
    <div className="settings-page">
      <div className="settings-grid">
        <div className="settings-card">
          <div className="settings-header">
            <h3>알림 설정</h3>
            <Edit className="icon" />
          </div>

          <div className="settings-content">
            <div className="email-setting">
              <label>유지보수 담당자 이메일</label>
              <input
                type="email"
                value={maintenanceEmail}
                onChange={(e) => setMaintenanceEmail(e.target.value)}
                placeholder="이메일 주소 입력"
              />
            </div>

            <div className="checkbox-group">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={notificationSettings.errorAlert}
                  onChange={() => handleNotificationChange('errorAlert')}
                />
                <span>에러 발생 시 자동 알림</span>
              </label>

              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={notificationSettings.performanceAlert}
                  onChange={() => handleNotificationChange('performanceAlert')}
                />
                <span>성능 저하 시 알림</span>
              </label>

              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={notificationSettings.systemUpdateAlert}
                  onChange={() => handleNotificationChange('systemUpdateAlert')}
                />
                <span>시스템 업데이트 알림</span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-header">
            <h3>대시보드 설정</h3>
            <Edit className="icon" />
          </div>

          <div className="settings-content">
            <div className="setting-item">
              <label>데이터 갱신 주기</label>
              <select
                value={dashboardSettings.refreshInterval}
                onChange={(e) => handleDashboardChange('refreshInterval', e.target.value)}
              >
                <option value="30">30초</option>
                <option value="60">1분</option>
                <option value="300">5분</option>
              </select>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={dashboardSettings.showTrendLine}
                  onChange={() => handleDashboardChange('showTrendLine')}
                />
                <span>추세선 표시</span>
              </label>

              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={dashboardSettings.showTooltip}
                  onChange={() => handleDashboardChange('showTooltip')}
                />
                <span>툴팁 표시</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="cancel-btn">취소</button>
        <button className="save-btn" onClick={handleSaveSettings}>
          <Check className="icon" />
          설정 저장
        </button>
      </div>
    </div>
  );
};

export default Settings;