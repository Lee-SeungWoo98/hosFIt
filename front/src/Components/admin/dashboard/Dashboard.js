import React, { useState, useEffect } from 'react';
import { TrendingUp, Settings as SettingsIcon } from 'lucide-react';
import { useScores } from '../../../context/ScoreContext';
import axios from 'axios'; // 서버와 통신하기 위해 Axios 사용

// 배치 유형에 따른 스타일 정의
const SEVERITY_STYLES = {
  ICU: {
    bg: 'bg-[#FEE2E2]/50', // 중증병동 배경색
    text: 'text-[#DC2626]', // 텍스트 색상
    border: 'border-[#FECACA]', // 테두리 색상
    label: '중증병동', // 병동 이름
    description: '중증병동 입실이 필요한 환자' // 추가 설명
  },
  WARD: {
    bg: 'bg-[#FEF3C7]/50', // 일반병동 배경색
    text: 'text-[#D97706]',
    border: 'border-[#FDE68A]',
    label: '일반병동',
    description: '일반병동 입원이 필요한 환자'
  },
  DISCHARGE: {
    bg: 'bg-[#DCFCE7]/50', // 퇴원 배경색
    text: 'text-[#059669]',
    border: 'border-[#A7F3D0]',
    label: '퇴원',
    description: '퇴원 가능한 환자'
  }
};

// 대시보드의 통계 카드 컴포넌트
const DashboardCard = ({ title, value, trend, trendValue, target }) => (
  <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all h-full group">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-base text-gray-600">{title}</h3>
      {trend && (
        <div className="flex items-center gap-1.5 text-green-600 font-medium px-3 py-1.5 bg-green-50/80 rounded-full">
          <TrendingUp size={14} className="shrink-0" />
          <span className="text-sm font-semibold">{trendValue}</span>
        </div>
      )}
    </div>
    <div className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-3 group-hover:scale-105 transition-transform">
      {value}
    </div>
    {target && (
      <div className="text-xs text-gray-400 text-center tracking-wide">
        {target}
      </div>
    )}
  </div>
);

// 가중치 박스 컴포넌트 (병동 별 가중치 표시)
const WeightBox = ({ type, value }) => {
  const styles = SEVERITY_STYLES[type];

  return (
    <div className={`rounded-xl flex flex-col items-center justify-center border-2 h-[130px] ${styles.bg} ${styles.border} relative group p-4 hover:shadow-lg transition-all`}>
      <span className={`text-sm font-bold whitespace-nowrap mb-2 ${styles.text}`}>
        {styles.label}
      </span>
      <div className={`text-3xl font-extrabold ${styles.text} bg-white/90 rounded-lg px-3 py-1.5 shadow-sm group-hover:scale-105 transition-transform`}>
        {value.toFixed(2)}
      </div>
    </div>
  );
};

// 불일치 케이스 카드 컴포넌트
const MismatchCase = ({ doctor, ai, percentage }) => {
  const getBorderStyle = (type) => {
    if (type.includes('중증')) return 'border-l-4 border-l-[#DC2626] bg-[#FEE2E2]/50';
    if (type.includes('일반')) return 'border-l-4 border-l-[#D97706] bg-[#FEF3C7]/50';
    return 'border-l-4 border-l-[#059669] bg-[#DCFCE7]/50';
  };

  return (
    <div className={`rounded-lg shadow-sm overflow-hidden ${getBorderStyle(doctor)} hover:shadow-lg transition-all h-full group`}>
      <div className="p-4 border-b border-gray-100/50">
        <div className="relative h-3 bg-gray-100 rounded-full mb-3 overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-blue-600 rounded-full transition-all group-hover:bg-blue-700"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold text-gray-900 group-hover:scale-105 transition-transform inline-block">
            {percentage}%
          </span>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider block mb-1.5">
            실제 배치
          </span>
          <div className="text-sm font-bold text-gray-900">{doctor}</div>
        </div>
        <div>
          <span className="text-[10px] text-blue-500 font-medium uppercase tracking-wider block mb-1.5">
            AI 추천 배치
          </span>
          <div className="text-sm font-bold text-blue-800">{ai}</div>
        </div>
      </div>
    </div>
  );
};

// 대시보드 컴포넌트
const Dashboard = ({ loading, onTabChange }) => {
  const { weights } = useScores();

  const [stats, setStats] = useState({
    dailyPatients: '로딩 중...', // 초기 상태
    changeRate: 0,
    trend: 'up',
    aiMatchRate: 0
  });

  // 통계 데이터를 주기적으로 로드
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/admin/dashboard/stats');
        setStats({
          dailyPatients: response.data.dailyPatients || '오류',
          changeRate: response.data.changeRate || 0,
          trend: response.data.trend || 'none',
          aiMatchRate: response.data.aiMatchRate || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          dailyPatients: '오류',
          changeRate: 0,
          trend: 'none',
          aiMatchRate: 0
        });
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 300000); // 5분 간격으로 데이터 갱신
    return () => clearInterval(interval);
  }, []);

  const handleSettingsClick = () => {
    onTabChange('settings'); // 설정 탭으로 이동
  };

  const mismatchCases = [
    { doctor: '중증병동', ai: '퇴원', percentage: 1.2 },
    { doctor: '중증병동', ai: '일반병동', percentage: 4.2 },
    { doctor: '일반병동', ai: '중증병동', percentage: 3.8 },
    { doctor: '일반병동', ai: '퇴원', percentage: 2.5 },
    { doctor: '퇴원', ai: '중증병동', percentage: 0.7 },
    { doctor: '퇴원', ai: '일반병동', percentage: 2.1 }
  ];

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="max-w-[1600px] mx-auto px-4 xl:px-8 py-6 xl:py-8 2xl:py-10 space-y-6 xl:space-y-8">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-6 2xl:gap-8">
          <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-gray-200 group hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-base text-gray-600">가중치</h3>
              <button
                onClick={handleSettingsClick}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 hover:scale-105"
              >
                <SettingsIcon size={14} />
                설정
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 xl:gap-6">
              <WeightBox type="ICU" value={weights.icu} />
              <WeightBox type="WARD" value={weights.ward} />
              <WeightBox type="DISCHARGE" value={weights.discharge} />
            </div>
          </div>

          <DashboardCard
            title="AI 퇴실배치 일치도"
            value={`${stats.aiMatchRate}%`}
            trend="up"
            trendValue="1.2%"
            target="목표: 90%"
          />
          <DashboardCard
            title="일일 응급실 내원 환자"
            value={`${stats.dailyPatients}명`}
            trend={stats.trend}
            trendValue={`${Math.abs(stats.changeRate)}%`}
            target={new Date().toLocaleString()}
          />
        </section>

        <section className="bg-white/90 rounded-xl p-6 xl:p-8 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 xl:gap-6">
            {mismatchCases.map((caseData, index) => (
              <MismatchCase key={index} {...caseData} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
