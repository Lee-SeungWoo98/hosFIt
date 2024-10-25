// Dashboard.js
import React from 'react';
import Card from './Card';
import Chart from './Chart';

const Dashboard = () => {
  return (
    <section id="dashboard" className="tab-content active">
      <div className="summary-cards">
        <Card title="모델 정확도" value="94.5%" trend="up" trendValue="1.2%" />
        <Card title="ICU 입실률" value="15.2%" trend="down" trendValue="0.8%" />
        <Card title="총 예측 건수" value="2,480" trend="up" trendValue="12.5%" />
      </div>

      <div className="charts-container">
        <Chart title="월별 입실 현황" chartId="monthlyChart" />
        <Chart title="병동별 분포" chartId="distributionChart" />
      </div>

      <div className="alerts-section">
        <h3>최근 알림</h3>
        <div className="alert-list">
          {/* 알림 항목 */}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
