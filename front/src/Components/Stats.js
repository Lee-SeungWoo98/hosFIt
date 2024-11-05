import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Download, RefreshCw } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import './styles/Stats.css';

export default function Stats() {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // 데이터 정의
  const lineChartData = [
    { month: '1월', value: 15 },
    { month: '2월', value: 14.8 },
    { month: '3월', value: 16 },
    { month: '4월', value: 15.5 },
    { month: '5월', value: 14.9 },
    { month: '6월', value: 15.2 }
  ];

  const barChartData = [
    { name: '내과', value: 65 },
    { name: '외과', value: 45 },
    { name: '응급의학과', value: 85 },
    { name: '신경과', value: 35 }
  ];

  // PDF 생성 함수
  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const element = document.getElementById('statsReport');
      const opt = {
        filename: `ICU_통계리포트_${new Date().toLocaleDateString()}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF 생성 실패:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="stats-container" id="statsReport">
      <h1 className="page-title">통계 분석</h1> {/* 한 번만 표시되도록 유지 */}
      
      {/* 마지막 업데이트 시간 */}
      <div className="update-time">마지막 업데이트: 2024-10-25 10:30:00</div>

      {/* 주요 지표 */}
      <div className="stats-summary">
        <div className="stat-item">
          <span className="stat-label">평균 ICU 입실률</span>
          <div className="stat-value blue">15.2%</div>
          <div className="stat-trend increase">↑ 2.1%</div>
        </div>
        <div className="stat-item">
          <span className="stat-label">평균 재실일수</span>
          <div className="stat-value green">4.5일</div>
          <div className="stat-trend decrease">↓ 0.5일</div>
        </div>
        <div className="stat-item">
          <span className="stat-label">모델 정확도</span>
          <div className="stat-value blue">94.5%</div>
          <div className="stat-trend increase">↑ 1.2%</div>
        </div>
      </div>

      <div className="actions-section">
        <button className="action-btn refresh" onClick={() => window.location.reload()}>
          <RefreshCw size={16} />
          새로고침
        </button>
        <button className="action-btn pdf" onClick={handleGeneratePDF}>
          <Download size={16} />
          {isGeneratingPDF ? 'PDF 생성 중...' : 'PDF 생성'}
        </button>
      </div>

      {/* 차트 섹션 */}
      <div className="charts-area">
        <div className="chart-container">
          <h3>ICU 입실률 추이</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis domain={[10, 20]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ fill: '#2563eb', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>부서별 입실 현황</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
