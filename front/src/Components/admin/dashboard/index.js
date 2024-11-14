import React from 'react';
import { TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { useScores } from '../../../context/ScoreContext';

// DashboardCard 컴포넌트: AI 퇴실배치 일치도 및 일일 응급실 내원 환자 데이터를 보여주는 카드 컴포넌트
const DashboardCard = ({ title, value, trend, trendValue, target }) => (
  <div className="bg-white rounded-xl p-4">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm text-gray-600">{title}</h3>
      {/* 트렌드가 있는 경우 트렌드 아이콘과 값 표시 */}
      {trend && (
        <div className="flex items-center gap-1 text-green-500 text-xs font-medium">
          <TrendingUp size={14} />
          <span>{trendValue}</span>
        </div>
      )}
    </div>
    <div className="text-2xl font-bold mb-1">{value}</div> {/* 메인 수치 값 */}
    {target && <div className="text-xs text-gray-500">{target}</div>} {/* 목표 값이 있을 경우 표시 */}
  </div>
);

// ScoreBox 컴포넌트: ICU, 일반병동, 퇴원에 대한 배치 기준 점수를 표시하는 컴포넌트
const ScoreBox = ({ type, value, comparison }) => {
  // 배치 유형에 따라 스타일 설정
  const getStyles = () => {
    switch(type) {
      case 'ICU':
        return 'bg-[#EEF2FF] text-[#2563EB] border-[#BFDBFE]';
      case 'WARD':
        return 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]';
      case 'DISCHARGE':
        return 'bg-[#FEF9C3] text-[#B45309] border-[#FDE68A]';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 라벨 설정: ICU, 일반병동, 퇴원
  const label = type === 'ICU' ? 'ICU' : type === 'WARD' ? '일반병동' : '퇴원';
  
  return (
    <div className={`${getStyles()} rounded-lg p-3 flex flex-col items-center border`}>
      <span className="text-sm font-medium">{label}</span>
      <div className="text-lg font-bold mt-1">
        {comparison} {value} {/* 비교 연산자와 값 표시 */}
      </div>
      <span className="text-xs mt-0.5">점</span>
    </div>
  );
};

// MismatchCase 컴포넌트: 의사와 AI의 예측 불일치 상황을 표시하는 카드 컴포넌트
const MismatchCase = ({ doctor, ai, percentage }) => {
  // 예측에 따라 스타일 설정
  const getTypeAndStyle = (prediction) => {
    switch(prediction) {
      case 'ICU 입실':
        return 'bg-[#EEF2FF] text-[#2563EB] border-[#BFDBFE] font-medium';
      case '일반병동':
        return 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0] font-medium';
      case '퇴원':
        return 'bg-[#FEF9C3] text-[#B45309] border-[#FDE68A] font-medium';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 font-medium';
    }
  };

  // 의사와 AI의 예측 위험도를 비교하여 심각성 레벨을 결정
  const getSeverityLevel = (doctor, ai) => {
    const riskLevel = {
      'ICU 입실': 3,
      '일반병동': 2,
      '퇴원': 1
    };
    
    const doctorRisk = riskLevel[doctor];
    const aiRisk = riskLevel[ai];
    
    if (aiRisk > doctorRisk) {
      return 'warning'; // AI가 더 위험하다고 판단
    } else if (doctorRisk - aiRisk > 1) {
      return 'review';  // 큰 폭의 위험도 하락
    }
    return 'normal';    // 일반적인 불일치
  };

  // 불일치의 심각성 레벨 계산
  const severity = getSeverityLevel(doctor, ai);

  return (
    <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm hover:shadow-md transition-all w-[160px]">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-500 font-medium">불일치</span> {/* 불일치 라벨 */}
        <span className="text-sm font-semibold text-blue-600">{percentage}%</span> {/* 불일치 비율 */}
      </div>
      
      <div className="flex flex-col gap-2.5">
        {/* 의사 실제 배치 */}
        <div>
          <span className="text-xs text-gray-500 mb-1 block">의사 예측</span>
          <div className={`px-2 py-1 rounded-md text-xs ${getTypeAndStyle(doctor)} border`}>
            {doctor}
          </div>
        </div>

        {/* 화살표 아이콘: 불일치 표시 */}
        <div className="flex justify-center">
          <ArrowRight className={`w-4 h-4 ${
            severity === 'warning' ? 'text-red-400' :
            severity === 'review' ? 'text-yellow-400' :
            'text-gray-400'
          }`} />
        </div>

        {/* AI 예측 */}
        <div>
          <span className="text-xs text-gray-500 mb-1 block">AI 예측</span>
          <div className={`px-2 py-1 rounded-md text-xs ${getTypeAndStyle(ai)} border ${
            severity === 'warning' ? 'ring-1 ring-red-200' :
            severity === 'review' ? 'ring-1 ring-yellow-200' :
            ''
          }`}>
            {ai}
          </div>
        </div>
      </div>

      {/* 불일치 유형에 따른 추가 정보 표시 */}
      {severity === 'warning' && (
        <div className="mt-2 pt-2 border-t border-gray-50">
          <p className="text-[10px] text-red-500 font-medium">
            놓친 위험 가능성 {percentage}%
          </p>
        </div>
      )}
      {severity === 'review' && (
        <div className="mt-2 pt-2 border-t border-gray-50">
          <p className="text-[10px] text-yellow-600 font-medium">
            과잉 치료 가능성 {percentage}%
          </p>
        </div>
      )}
      {severity === 'normal' && (
        <div className="mt-2 pt-2 border-t border-gray-50">
          <p className="text-[10px] text-gray-400">
            전체 중 {percentage}%
          </p>
        </div>
      )}
    </div>
  );
};

// Dashboard 컴포넌트: 전체 대시보드를 구성하고 주요 섹션을 렌더링
const Dashboard = ({ loading, onTabChange }) => {
  const { scores } = useScores(); // 점수 데이터를 Context에서 가져옴

  // 설정 버튼 클릭 시 탭을 설정 페이지로 변경하는 함수
  const handleSettingsClick = () => {
    onTabChange("settings");
  };

  // 불일치 사례 데이터
  const cases = [
    { doctor: 'ICU 입실', ai: '퇴원', percentage: 1.2 },
    { doctor: 'ICU 입실', ai: '일반병동', percentage: 4.2 },
    { doctor: '일반병동', ai: 'ICU 입실', percentage: 3.8 },
    { doctor: '일반병동', ai: '퇴원', percentage: 2.5 },
    { doctor: '퇴원', ai: 'ICU 입실', percentage: 0.7 },
    { doctor: '퇴원', ai: '일반병동', percentage: 2.1 }
  ];

  // 전체 불일치율 계산
  const totalMismatch = cases.reduce((acc, curr) => acc + curr.percentage, 0);

  return (
    <div className="p-6 w-full">
      <div className="space-y-6">
        {/* 상단 메트릭 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 배치 기준 점수 */}
          <div className="bg-white rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm text-gray-600">배치기준 점수</h3>
              <button 
                onClick={handleSettingsClick}
                className="text-[#2563EB] hover:text-blue-700 text-xs font-medium px-3 py-1 rounded border border-[#2563EB]"
              >
                설정
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <ScoreBox type="ICU" value={scores.icu} comparison="≥" /> {/* ICU 기준 점수 */}
              <ScoreBox type="WARD" value={scores.ward} comparison="" /> {/* 일반병동 기준 점수 */}
              <ScoreBox type="DISCHARGE" value={scores.discharge} comparison="≤" /> {/* 퇴원 기준 점수 */}
            </div>

            {/* 설정 버튼 안내 문구 */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <AlertCircle size={14} className="text-gray-400" />
              <span className="text-xs text-gray-500">
                설정 버튼을 누르면 배치기준 설정 페이지로 이동합니다.
              </span>
            </div>
          </div>

          {/* AI 퇴실배치 일치도 카드 */}
          <DashboardCard
            title="AI 퇴실배치 일치도"
            value="85.5%"
            trend="up"
            trendValue="1.2%"
            target="목표: 90%"
          />
          
          {/* 일일 응급실 내원 환자 카드 */}
          <DashboardCard
            title="일일 응급실 내원 환자"
            value="127명"
            trend="up"
            trendValue="12.5%"
            target="2024.10.25 10:30:00 기준"
          />
        </div>

        {/* 불일치 비율 섹션 */}
        <div className="bg-white rounded-xl p-6">
          <div className="mb-5">
            <div className="flex items-baseline gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">퇴실 후 환자배치 불일치 분석</h3>
              <span className="text-2xl font-bold text-blue-600">{totalMismatch.toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="flex gap-5">
            {cases.map((c, i) => (
              <MismatchCase key={i} {...c} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
