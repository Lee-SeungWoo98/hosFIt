import React from 'react';
import { TrendingUp, AlertCircle, ArrowRight, Info } from 'lucide-react';
import { useScores } from '../../../context/ScoreContext';

const SEVERITY_STYLES = {
  ICU: {
    bg: 'bg-[#FEE2E2]',
    text: 'text-[#DC2626]',
    border: 'border-[#FECACA]',
    label: 'ICU 입실',
    level: 3
  },
  WARD: {
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#D97706]',
    border: 'border-[#FDE68A]',
    label: '일반병동',
    level: 2
  },
  DISCHARGE: {
    bg: 'bg-[#DCFCE7]',
    text: 'text-[#059669]',
    border: 'border-[#A7F3D0]',
    label: '퇴원',
    level: 1
  }
};

const InfoTooltip = ({ message }) => (
  <div className="group relative inline-block ml-2">
    <Info size={14} className="text-gray-400 cursor-help" />
    <div className="invisible group-hover:visible absolute z-10 w-64 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 -right-2 top-full mt-1">
      {message}
      <div className="absolute -top-1 right-2 w-2 h-2 bg-gray-900 transform rotate-45" />
    </div>
  </div>
);

const DashboardCard = ({ title, value, trend, trendValue, target }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm text-gray-600">{title}</h3>
      {trend && (
        <div className="flex items-center gap-1 text-green-500 text-xs font-medium">
          <TrendingUp size={14} />
          <span>{trendValue}</span>
        </div>
      )}
    </div>
    <div className="text-2xl font-bold mb-1">{value}</div>
    {target && <div className="text-xs text-gray-500">{target}</div>}
  </div>
);

const ScoreBox = ({ type, value, comparison }) => {
  const styles = SEVERITY_STYLES[type];
  
  return (
    <div className={`rounded-lg p-3 flex flex-col items-center border ${styles.bg} ${styles.text} ${styles.border}`}>
      <span className="text-sm font-medium">{styles.label}</span>
      <div className="text-lg font-bold mt-1">
        {comparison} {value}
      </div>
      <span className="text-xs mt-0.5">점</span>
    </div>
  );
};

const MismatchCase = ({ doctor, ai, percentage }) => {
  const calculateSeverity = (doctor, ai) => {
    const getTypeLevel = (type) => {
      if (type.includes('ICU')) return 3;
      if (type.includes('일반')) return 2;
      return 1;
    };

    const doctorLevel = getTypeLevel(doctor);
    const aiLevel = getTypeLevel(ai);
    const diff = aiLevel - doctorLevel;
    
    return {
      type: diff > 0 ? 'risk-increase' : diff < 0 ? 'risk-decrease' : 'same',
      magnitude: Math.abs(diff),
      message: diff > 0 ? '위험도 상승' : '위험도 하락'
    };
  };

  const getTypeStyle = (type) => {
    if (type.includes('ICU')) return SEVERITY_STYLES.ICU;
    if (type.includes('일반')) return SEVERITY_STYLES.WARD;
    return SEVERITY_STYLES.DISCHARGE;
  };

  const severity = calculateSeverity(doctor, ai);
  const doctorStyle = getTypeStyle(doctor);
  const aiStyle = getTypeStyle(ai);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex justify-end mb-3">
        <span className="text-sm font-semibold text-blue-600">{percentage}%</span>
      </div>
      
      <div className="flex flex-col gap-2.5">
        <div>
          <span className="text-xs text-gray-500 mb-1 block">실제 배치</span>
          <div className={`px-2 py-1.5 rounded-md text-xs ${doctorStyle.bg} ${doctorStyle.text} border ${doctorStyle.border}`}>
            {doctor}
          </div>
        </div>

        <div className="flex justify-center my-1">
          <ArrowRight 
            className={`w-4 h-4 ${
              severity.type === 'risk-increase' ? 'text-red-500' : 
              severity.type === 'risk-decrease' ? 'text-yellow-500' : 
              'text-gray-400'
            }`}
            style={{
              transform: `scale(${1 + severity.magnitude * 0.2})`,
              transition: 'all 0.2s ease'
            }}
          />
        </div>

        <div>
          <span className="text-xs text-gray-500 mb-1 block">AI 추천 배치</span>
          <div className={`px-2 py-1.5 rounded-md text-xs ${aiStyle.bg} ${aiStyle.text} border ${aiStyle.border} ${
            severity.type === 'risk-increase' ? 'ring-1 ring-red-200' :
            severity.type === 'risk-decrease' ? 'ring-1 ring-yellow-200' :
            ''
          }`}>
            {ai}
          </div>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-gray-50">
        {severity.type === 'risk-increase' ? (
          <p className="text-[10px] text-red-500 font-medium text-center">
            위험도 상승
          </p>
        ) : severity.type === 'risk-decrease' ? (
          <p className="text-[10px] text-yellow-600 font-medium text-center">
            위험도 하락
          </p>
        ) : (
          <p className="text-[10px] text-gray-400 text-center">
            단순 불일치
          </p>
        )}
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

  const totalMismatch = cases.reduce((acc, curr) => acc + curr.percentage, 0);

  return (
    <div className="p-6 w-full bg-gray-50">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
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
              <ScoreBox type="ICU" value={scores.icu} comparison="≥" />
              <ScoreBox type="WARD" value={scores.ward} comparison="" />
              <ScoreBox type="DISCHARGE" value={scores.discharge} comparison="≤" />
            </div>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <AlertCircle size={14} className="text-gray-400" />
              <span className="text-xs text-gray-500">
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

        <div>
          <div className="mb-5">
            <div className="flex items-baseline gap-3">
              <h3 className="text-lg font-semibold text-gray-900">
                퇴실 후 환자배치 불일치 분석
                <InfoTooltip message="전체 배치 건수 중 의사의 실제 배치와 AI의 추천이 다른 경우의 비율입니다." />
              </h3>
              <span className="text-2xl font-bold text-blue-600">{totalMismatch.toFixed(1)}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
