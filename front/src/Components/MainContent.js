// MainContent.js
import React from 'react';
import './MainContent.css';
import Chart from './Chart';

function MainContent() {
    return (
        <main className="main-content-container">
            <header className="content-header">
                <div className="header-title">
                    <h1>대시보드</h1>
                </div>
                <button className="refresh-btn">새로고침</button>
            </header>
            <section>
                <Chart title="월별 입실 현황" chartId="monthlyChart" />
                <Chart title="병동별 분포" chartId="distributionChart" />
            </section>
        </main>
    );
}

export default MainContent;
