import React from 'react';
import SummaryCards from './SummaryCards';
import ChartSection from './ChartSection';
import AlertSection from './AlertSection';
import LoadingSpinner from './LoadingSpinner';
import { Chart, registerables } from 'chart.js';
import './styles/Dashboard.css';

// Chart.js 등록
Chart.register(...registerables);

// 공통 차트 옵션
const commonChartOptions = {
 responsive: true,
 maintainAspectRatio: false,
 plugins: {
   legend: {
     position: 'top',
     labels: {
       usePointStyle: true,
       padding: 20,
       font: { size: 12 }
     }
   },
   tooltip: {
     backgroundColor: 'white',
     titleColor: '#1f2937',
     bodyColor: '#1f2937',
     borderColor: '#e5e7eb',
     borderWidth: 1,
     padding: 12,
     boxPadding: 6,
     usePointStyle: true,
     callbacks: {
       label: function(context) {
         return ` ${context.formattedValue}%`;
       }
     }
   }
 }
};

const Dashboard = ({ loading }) => {
 const dashboardData = {
   summaryCards: [
     {
       title: '모델 정확도',
       value: '94.5%',
       trend: 'up',
       trendValue: '1.2%',
       subText: '최근 30일'
     },
     {
       title: 'ICU 입실률',
       value: '15.2%',
       trend: 'down',
       trendValue: '0.8%',
       subText: '목표: 20%'
     },
     {
       title: '총 예측 건수',
       value: '2,480',
       trend: 'up',
       trendValue: '12.5%',
       subText: '이번 달'
     }
   ],
   chartData: {
     monthly: {
       labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월'],
       datasets: [{
         label: 'ICU 입실률',
         data: [15.2, 14.8, 16.1, 15.5, 14.9, 15.2, 16.0, 15.7, 15.9, 15.2],
         borderColor: '#2563eb',
         backgroundColor: 'rgba(37, 99, 235, 0.1)',
         tension: 0.4,
         fill: true
       }]
     },
     distribution: {
       labels: ['ICU', '일반병동', '퇴원'],  //글자 수정
       datasets: [{
         data: [30, 25, 35],
         backgroundColor: ['#3b82f6', '#22c55e', '#f97316']  // 색 변경 ICU(파),일반(초),퇴원(주)
       }]
     }
   }
 };

 return (
   <div className="admin-dashboard">
     {loading && <div className="admin-dashboard-loading"><LoadingSpinner /></div>}
     <SummaryCards data={dashboardData.summaryCards} />
     <ChartSection 
       monthlyData={dashboardData.chartData.monthly}
       distributionData={dashboardData.chartData.distribution}
       options={commonChartOptions}
     />
     <AlertSection />
   </div>
 );
};

export default Dashboard;