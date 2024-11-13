import React from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { useScores } from '../../../context/ScoreContext';
import { ArrowRight } from 'lucide-react';
// 대시보드 카드 컴포넌트
const DashboardCard = ({ title, value, trend, trendValue, target }) => {
  const isPositive = trend === 'up';
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium
            ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            <TrendingUp size={16} className={!isPositive && 'rotate-180'} />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className="text-3xl font-semibold text-gray-900 mb-2">{value}</div>
      {target && <div className="text-sm text-gray-500">{target}</div>}
    </div>
  );
};

// 점수 박스 컴포넌트
const ScoreBox = ({ label, value, unit, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    orange: 'bg-orange-50 text-orange-700',
  }[color];

  return (
    <div className={`p-3 rounded-lg text-center ${colorClasses}`}>
      <span className="text-xs font-medium block mb-2">{label}</span>
      <div className="text-lg font-semibold mb-1">{value}</div>
      <span className="text-xs opacity-75">{unit}</span>
    </div>
  );
};

// 불일치 케이스 컴포넌트
const MismatchCase = ({ doctor, ai, percentage }) => {
  const getColors = (type) => {
    switch(type) {
      case 'ICU': return 'bg-red-50 text-red-700 border-red-100';
      case '일반병동': return 'bg-blue-50 text-blue-700 border-blue-100';
      case '퇴원': return 'bg-green-50 text-green-700 border-green-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className={`${getColors(doctor)} rounded-xl p-4 border flex flex-col h-full`}>
      <div className="text-xs text-gray-500 mb-2">의사 → AI</div>
      <div className="font-bold mb-1 text-xl">{percentage}%</div>
      <div className="text-sm">
        {doctor} → {ai}
      </div>
    </div>
  );
};

// 메인 대시보드 컴포넌트
const Dashboard = ({ loading, onTabChange }) => {
  const { scores } = useScores();

  const handleSettingsClick = () => {
    onTabChange("settings");
  };

  const cases = [
    { doctor: 'ICU', ai: '퇴원', percentage: 1.2 },
    { doctor: 'ICU', ai: '일반병동', percentage: 4.2 },
    { doctor: '일반병동', ai: 'ICU', percentage: 3.8 },
    { doctor: '일반병동', ai: '퇴원', percentage: 2.5 },
    { doctor: '퇴원', ai: 'ICU', percentage: 0.7 },
    { doctor: '퇴원', ai: '일반병동', percentage: 2.1 }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* 상단 메트릭 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 배치 기준 점수 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-500 text-sm font-medium">배치기준 점수</h3>
            <button 
              onClick={handleSettingsClick}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              설정
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <ScoreBox
              label="ICU"
              value={`≥ ${scores.icu}`}
              unit="점"
              color="blue"
            />
            <ScoreBox
              label="일반병동"
              value={scores.ward}
              unit="점"
              color="green"
            />
            <ScoreBox
              label="퇴원"
              value={`≤ ${scores.discharge}`}
              unit="점"
              color="orange"
            />
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 text-gray-500 text-sm">
            <AlertCircle size={16} />
            <span>설정 버튼을 누르면 배치기준 설정 페이지로 이동합니다.</span>
          </div>
        </div>

        {/* AI 퇴실배치 일치도 */}
        <DashboardCard
          title="AI 퇴실배치 일치도"
          value="85.5%"
          trend="up"
          trendValue="1.2%"
          target="목표: 90%"
        />
        
        {/* 일일 응급실 내원 환자 */}
        <DashboardCard
          title="일일 응급실 내원 환자"
          value="127명"
          trend="up"
          trendValue="12.5%"
          target="2024.10.25 10:30:00 기준"
        />
      </div>

      {/* 불일치 비율 섹션 */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-gray-900 font-semibold">퇴실 후 환자배치 불일치 비율</h3>
          <p className="text-sm text-gray-500 mt-1">
            전체 불일치: {cases.reduce((acc, curr) => acc + curr.percentage, 0).toFixed(1)}%
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cases.map((c, i) => (
            <MismatchCase key={i} {...c} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;