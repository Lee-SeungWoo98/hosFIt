import React from 'react';
import { TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { useScores } from '../../../context/ScoreContext';

// DashboardCard 컴포넌트: AI 퇴실 배치 일치도 및 일일 응급실 내원 환자 카드를 렌더링
const DashboardCard = ({ title, value, trend, trendValue, target }) => (
  <div className="bg-white rounded-xl p-5">
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-sm text-gray-600">{title}</h3>
      {trend && (
        <div className="flex items-center gap-1 text-green-500 text-xs">
          <TrendingUp size={14} /> {/* 트렌드 아이콘 */}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
    <div className="text-2xl font-bold mb-1">{value}</div> {/* 메인 수치 */}
    {target && <div className="text-xs text-gray-500">{target}</div>} {/* 목표값 */}
  </div>
);

// ScoreBox 컴포넌트: 배치 기준 점수를 표시하는 컴포넌트
const ScoreBox = ({ type, value, comparison }) => {
  // 배치 유형에 따라 스타일을 설정하는 함수
  const getStyles = () => {
    switch(type) {
      case 'ICU':
        return 'bg-[#EEF2FF] text-[#2563EB]';
      case 'WARD':
        return 'bg-[#ECFDF5] text-[#059669]';
      case 'DISCHARGE':
        return 'bg-[#FEF9C3] text-[#CA8A04]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const label = type === 'ICU' ? 'ICU' : type === 'WARD' ? '일반병동' : '퇴원';

  return (
    <div className={`${getStyles()} rounded-lg p-3 flex flex-col items-center`}>
      <span className="text-sm font-medium">{label}</span>
      <div className="text-lg font-bold mt-1">
        {comparison} {value} {/* 비교 연산자와 값 */}
      </div>
      <span className="text-xs mt-1">점</span>
    </div>
  );
};

// MismatchCase 컴포넌트: 불일치 케이스(의사와 AI의 예측 불일치) 표시
const MismatchCase = ({ doctor, ai, percentage }) => {
  // 예측에 따라 스타일을 설정하는 함수
  const getTypeAndStyle = (prediction) => {
    switch(prediction) {
      case 'ICU 입실':
        return 'bg-[#EEF2FF] text-[#2563EB]';
      case '일반병동':
        return 'bg-[#ECFDF5] text-[#059669]';
      case '퇴원':
        return 'bg-[#FEF9C3] text-[#CA8A04]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg p-3 border border-gray-100 min-w-[150px]">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-400">불일치</span> {/* 불일치 라벨 */}
        <span className="text-sm font-medium">{percentage}%</span> {/* 불일치 비율 */}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-gray-400">의사</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-sm ${getTypeAndStyle(doctor)}`}>
            {doctor}
          </span>
        </div>

        <div className="pl-6">
          <ArrowRight className="w-3 h-3 text-gray-300" /> {/* 불일치 방향 표시 */}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-gray-400">AI</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-sm ${getTypeAndStyle(ai)}`}>
            {ai}
          </span>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-50">
        <p className="text-[10px] text-gray-400">
          전체 중 {percentage}%
        </p>
      </div>
    </div>
  );
};

// Dashboard 컴포넌트: 전체 대시보드를 구성하고 주요 섹션을 렌더링
const Dashboard = ({ loading, onTabChange }) => {
  const { scores } = useScores();

  const handleSettingsClick = () => {
    onTabChange("settings"); // 설정 버튼 클릭 시 탭을 설정 페이지로 변경
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
    <div className="p-6 w-full">
      <div className="space-y-6">
        {/* 상단 메트릭 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 배치 기준 점수 */}
          <div className="bg-white rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm text-gray-600">배치기준 점수</h3>
              <button 
                onClick={handleSettingsClick}
                className="text-[#2563EB] hover:text-blue-700 text-xs font-medium px-3 py-1 rounded border border-[#2563EB]"
              >
                설정
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <ScoreBox type="ICU" value={scores.icu} comparison="≥" />
              <ScoreBox type="WARD" value={scores.ward} comparison="" />
              <ScoreBox type="DISCHARGE" value={scores.discharge} comparison="≤" />
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <AlertCircle size={14} className="text-gray-400" />
              <span className="text-xs text-gray-500">
                설정 버튼을 누르면 배치기준 설정 페이지로 이동합니다.
              </span>
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
        <div className="bg-white rounded-xl p-5">
          <div className="mb-4">
            <h3 className="text-base font-medium text-gray-900">퇴실 후 환자배치 불일치 분석</h3>
            <div className="mt-1">
              <span className="text-sm text-gray-500">전체 불일치율:</span>
              <span className="text-sm font-bold text-[#2563EB] ml-2">
                {cases.reduce((acc, curr) => acc + curr.percentage, 0).toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <div className="inline-flex gap-4 min-w-full">
              {cases.map((c, i) => (
                <MismatchCase key={i} {...c} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
