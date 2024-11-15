import React from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { useScores } from '../../../context/ScoreContext';

const SEVERITY_STYLES = {
  ICU: {
    bg: 'bg-[#FEE2E2]',
    text: 'text-[#DC2626]',
    border: 'border-[#FECACA]',
    label: 'ICU 입실'
  },
  WARD: {
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#D97706]',
    border: 'border-[#FDE68A]',
    label: '일반병동'
  },
  DISCHARGE: {
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#059669]',
    border: 'border-[#A7F3D0]',
    label: '퇴원'
  }
};

const DashboardCard = ({ title, value, trend, trendValue, target }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-base text-gray-700 font-['Pretendard'] font-medium tracking-tight">{title}</h3>
      {trend && (
        <div className="flex items-center gap-1 text-green-600 text-sm font-['Pretendard'] font-medium">
          <TrendingUp size={16} />
          <span>{trendValue}</span>
        </div>
      )}
    </div>
    <div className="text-4xl font-bold text-gray-900 font-['Pretendard'] text-center tracking-tight">{value}</div>
    {target && <div className="text-sm text-gray-600 font-['Pretendard'] text-center mt-2">{target}</div>}
  </div>
);

const ScoreBox = ({ type, value, comparison }) => {
  const styles = SEVERITY_STYLES[type];
  
  return (
    <div className={`rounded-lg p-4 flex flex-col items-center border ${styles.bg} ${styles.text} ${styles.border}`}>
      <span className="text-base font-['Pretendard'] font-semibold">{styles.label}</span>
      <div className="text-xl font-['Pretendard'] font-bold mt-2">
        {comparison} {value}
      </div>
      <span className="text-sm font-['Pretendard'] mt-1">점</span>
    </div>
  );
};

const MismatchCase = ({ doctor, ai, percentage }) => {
  const getBorderStyle = (type) => {
    if (type.includes('ICU')) return 'border-l-4 border-l-red-400 bg-red-50';
    if (type.includes('일반')) return 'border-l-4 border-l-yellow-400 bg-yellow-50';
    return 'border-l-4 border-l-green-400 bg-green-50';
  };

  return (
    <div className={`rounded-lg shadow-sm overflow-hidden ${getBorderStyle(doctor)} hover:shadow-md transition-all`}>
      <div className="p-4 border-b border-gray-100">
        <div className="text-center">
          <span className="text-2xl font-['Pretendard'] font-bold text-gray-900">{percentage}%</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          <div>
            <span className="text-sm font-['Pretendard'] text-gray-500 font-medium">실제 배치</span>
            <div className="text-base font-['Pretendard'] font-bold text-gray-900 mt-1">
              {doctor}
            </div>
          </div>

          <div>
            <span className="text-sm font-['Pretendard'] text-blue-600 font-medium">AI 추천 배치</span>
            <div className="text-base font-['Pretendard'] font-bold text-blue-900 mt-1">
              {ai}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ loading, onTabChange }) => {
  const { scores } = useScores();

  const handleSettingsClick = () => {
    onTabChange("settings");
  };

  const cases = [
    { doctor: 'ICU 입실', ai: '퇴원', percentage: 1.2 },
    { doctor: 'ICU 입실', ai: '일반병동', percentage: 4.2 },
    { doctor: '일반병동', ai: 'ICU 입실', percentage: 3.8 },
    { doctor: '일반병동', ai: '퇴원', percentage: 2.5 },
    { doctor: '퇴원', ai: 'ICU 입실', percentage: 0.7 },
    { doctor: '퇴원', ai: '일반병동', percentage: 2.1 }
  ];

  return (
    <div className="p-6 w-full bg-gray-50">
      <div className="space-y-8">
        {/* 상단 통계 카드 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 배치 기준 점수 카드 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-['Pretendard'] font-bold text-gray-900">배치기준 점수</h3>
              <button 
                onClick={handleSettingsClick}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-['Pretendard'] font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm"
              >
                설정
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <ScoreBox type="ICU" value={scores.icu} comparison="≥" />
              <ScoreBox type="WARD" value={scores.ward} comparison="" />
              <ScoreBox type="DISCHARGE" value={scores.discharge} comparison="≤" />
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <AlertCircle size={16} className="text-gray-400" />
              <span className="text-sm font-['Pretendard'] text-gray-500">
                설정 버튼을 누르면 배치기준 설정 페이지로 이동합니다.
              </span>
            </div>
          </div>

          <DashboardCard
            title="AI 퇴실배치 일치도"
            value="85.5%"
            trend="up"
            trendValue="1.2%"
            target="목표: 90%"
          />
          
          <DashboardCard
            title="일일 응급실 내원 환자"
            value="127명"
            trend="up"
            trendValue="12.5%"
            target="2024.10.25 10:30:00 기준"
          />
        </div>

        {/* 퇴실 후 환자배치 불일치 분석 섹션 */}
        <div className="space-y-6">
          <h3 className="text-2xl font-['Pretendard'] font-bold text-gray-900">
            퇴실 후 환자배치 불일치 분석
          </h3>
          
          <div className="grid grid-cols-6 gap-4">
            {cases.map((c, i) => (
              <div key={i}>
                <MismatchCase {...c} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;