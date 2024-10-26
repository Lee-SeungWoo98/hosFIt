import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 BarElement,
 Title,
 Tooltip,
 Legend,
 ArcElement
} from 'chart.js';
import './styles/Stats.css';
 
ChartJS.register(
 CategoryScale,
 LinearScale,
 PointElement,
 LineElement,
 BarElement,
 Title,
 Tooltip,
 Legend,
 ArcElement
);

const Stats = () => {
 const [activeTab, setActiveTab] = useState('monthly');

 const generatePDFReport = () => {
   const element = document.getElementById('statsReport');
   const opt = {
     margin: 1,
     filename: `ICU_통계리포트_${new Date().toLocaleDateString()}.pdf`,
     image: { type: 'jpeg', quality: 0.98 },
     html2canvas: { scale: 2 },
     jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
   };
   html2pdf().set(opt).from(element).save();
 };

 const monthlyData = {
   labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
   datasets: [
     {
       label: 'ICU 입실률',
       data: [15.2, 14.8, 16.1, 15.5, 14.9, 15.2],
       borderColor: '#2563eb',
       backgroundColor: 'rgba(37, 99, 235, 0.1)',
       fill: true
     }
   ]
 };

 const averageStats = [
   {
     title: '평균 ICU 입실률',
     value: '15.2%',
     trend: 'up',
     trendValue: '2.1%'
   },
   {
     title: '평균 재실일수',
     value: '4.5일',
     trend: 'down',
     trendValue: '0.5일'
   },
   {
     title: '모델 정확도',
     value: '94.5%',
     trend: 'up',
     trendValue: '1.2%'
   }
 ];

 return (
   <div className="admin-stats-page">
     <div className="admin-stats-controls">
       <div className="admin-stats-controls-left">
         <button
           className={`admin-period-btn ${activeTab === 'monthly' ? 'active' : ''}`}
           onClick={() => setActiveTab('monthly')}
         >
           월별 통계
         </button>
         <button
           className={`admin-period-btn ${activeTab === 'yearly' ? 'active' : ''}`}
           onClick={() => setActiveTab('yearly')}
         >
           연간 통계
         </button>
       </div>
       <button className="admin-stats-download" onClick={generatePDFReport}>
         <Download className="icon" />
         PDF 생성
       </button>
     </div>

     <div id="statsReport" className="admin-stats-content">
       <div className="admin-stats-summary">
         <h3>통계 요약</h3>
         <div className="admin-stats-grid">
           {averageStats.map((stat, index) => (
             <div key={index} className="admin-stat-item">
               <h4>{stat.title}</h4>
               <div className="admin-stat-value">{stat.value}</div>
               <div className={`admin-stat-trend ${stat.trend}`}>
                 {stat.trend === 'up' ? '↑' : '↓'} {stat.trendValue}
               </div>
             </div>
           ))}
         </div>
       </div>

       <div className="admin-stats-charts">
         <div className="admin-chart-card">
           <h3>ICU 입실률 추이</h3>
           <div className="admin-chart-wrapper">
             <Line
               data={monthlyData}
               options={{
                 responsive: true,
                 maintainAspectRatio: false,
                 scales: {
                   y: {
                     beginAtZero: true,
                     max: 20,
                     ticks: {
                       callback: value => `${value}%`
                     }
                   }
                 }
               }}
             />
           </div>
         </div>

         <div className="admin-chart-card">
           <h3>부서별 입실 현황</h3>
           <div className="admin-chart-wrapper">
             <Bar
               data={{
                 labels: ['내과', '외과', '응급의학과', '신경과'],
                 datasets: [{
                   label: '입실 건수',
                   data: [65, 45, 85, 35],
                   backgroundColor: [
                     '#2563eb',
                     '#60a5fa',
                     '#93c5fd',
                     '#bfdbfe'
                   ]
                 }]
               }}
               options={{
                 responsive: true,
                 maintainAspectRatio: false,
                 plugins: {
                   legend: {
                     display: false
                   }
                 }
               }}
             />
           </div>
         </div>
       </div>

       <div className="admin-stats-details">
         <h3>상세 분석</h3>
         <div className="admin-details-content">
           <div className="admin-detail-group">
             <h4>ICU 입실 패턴 분석</h4>
             <p>주중 평균 입실률이 주말 대비 15% 높게 나타났으며, 
               오전 시간대(9시-12시)에 입실이 집중되는 경향을 보입니다.</p>
           </div>
           <div className="admin-detail-group">
             <h4>재실 기간 분석</h4>
             <p>평균 재실 기간은 4.5일로, 전월 대비 0.5일 감소했습니다. 
               중증도가 높은 환자의 경우 평균 7.2일의 재실 기간을 보입니다.</p>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
};

export default Stats;