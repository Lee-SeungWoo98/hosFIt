import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Download, RefreshCw } from 'lucide-react';
import '../styles/AdminApp.css';

const Stats = () => {
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
      // PDF 생성 로직
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 지연
    } catch (error) {
      console.error('PDF 생성 실패:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="stats-container" id="statsReport">
      {/* 주요 지표 */}
      <div className="stats-summary">
        <div className="stat-item">
          <span className="stat-label">연도별 월별 응급실 이용</span>
          <div className="stat-value blue">15.2%</div>
          <div className="stat-trend increase">↑ 2.1%</div>
        </div>
        <div className="stat-item">
          <span className="stat-label">연도별 평균일치도</span>
          <div className="stat-value green">4.5일</div>
          <div className="stat-trend decrease">↓ 0.5일</div>
        </div>
        <div className="stat-item">
          <span className="stat-label">AI 예측 정확도</span>
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
        

        {/* 추가 통계 테이블 */}
        <div className="stats-table-container">
          <h3>상세 통계</h3>
          <table className="stats-table">
            <thead>
              <tr>
                <th>지표</th>
                <th>현재</th>
                <th>전월 대비</th>
                <th>목표</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>AI 예측 정확도</td>
                <td>94.5%</td>
                <td className="positive">+1.2%</td>
                <td>95%</td>
              </tr>
              <tr>
                <td>평균 재실 시간</td>
                <td>4.5일</td>
                <td className="negative">-0.5일</td>
                <td>4일</td>
              </tr>
              <tr>
                <td>병상 회전율</td>
                <td>85%</td>
                <td className="positive">+2.3%</td>
                <td>90%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Stats;