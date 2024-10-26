import React from 'react';
import { Bell } from 'lucide-react';
import './styles/AlertSection.css';

const AlertSection = () => {
  const alerts = [
    {
      type: 'warning',
      title: 'ICU 입실률 경고',
      time: '10:30',
      message: '현재 ICU 입실률(15.2%)이 목표치(20%)보다 낮습니다'
    },
    {
      type: 'info',
      title: '모델 업데이트',
      time: '09:15',
      message: 'AI 모델 v2.1.0 업데이트가 완료되었습니다'
    }
  ];

  return (
    <div className="admin-alerts-section">
      <div className="admin-alerts-header">
        <h3>최근 알림</h3>
        <button className="admin-view-all-btn">전체보기</button>
      </div>
      <div className="admin-alert-list">
        {alerts.map((alert, index) => (
          <div key={index} className={`admin-alert-item ${alert.type}`}>
            <div className="admin-alert-icon">
              <Bell className="icon" />
            </div>
            <div className="admin-alert-content">
              <div className="admin-alert-header">
                <span className="admin-alert-title">{alert.title}</span>
                <span className="admin-alert-time">{alert.time}</span>
              </div>
              <div className="admin-alert-message">{alert.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertSection;