import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, Settings as SettingsIcon } from 'lucide-react';
import { useScores } from '../../../context/ScoreContext';
import axios from 'axios'; // Axios를 이용해 백엔드에서 데이터를 가져오기 위해 import

// 배치 유형에 따른 스타일과 라벨 정의
const SEVERITY_STYLES = {
  ICU: {
    bg: 'bg-[#FEE2E2]/50', // 중증병동 스타일의 배경색
    text: 'text-[#DC2626]', // 중증병동 텍스트 색상
    border: 'border-[#FECACA]', // 중증병동 테두리 색상
    label: '중증병동', // 라벨 텍스트
    description: '중증병동 입실이 필요한 환자' // 설명 텍스트
  },
  WARD: {
    bg: 'bg-[#FEF3C7]/50', // 일반병동 스타일의 배경색
    text: 'text-[#D97706]', // 일반병동 텍스트 색상
    border: 'border-[#FDE68A]', // 일반병동 테두리 색상
    label: '일반병동', // 라벨 텍스트
    description: '일반병동 입원이 필요한 환자' // 설명 텍스트
  },
  DISCHARGE: {
    bg: 'bg-[#DCFCE7]/50', // 퇴원 스타일의 배경색
    text: 'text-[#059669]', // 퇴원 텍스트 색상
    border: 'border-[#A7F3D0]', // 퇴원 테두리 색상
    label: '퇴원', // 라벨 텍스트
    description: '퇴원 가능한 환자' // 설명 텍스트
  }
};

// 대시보드 카드 컴포넌트
const DashboardCard = ({ title, value, trend, trendValue, target }) => (
  <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all h-full group">
    {/* 제목과 트렌드 섹션 */}
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-base text-gray-600">{title}</h3>
      {trend && (
        <div className="flex items-center gap-1.5 text-green-600 font-medium px-3 py-1.5 bg-green-50/80 rounded-full">
          <TrendingUp size={14} className="shrink-0" /> {/* 트렌드 아이콘 */}
          <span className="text-sm font-semibold">{trendValue}</span>
        </div>
      )}
    </div>
    {/* 값 표시 */}
    <div className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-3 group-hover:scale-105 transition-transform">
      {value}
    </div>
    {target && (
      <div className="text-xs text-gray-400 text-center tracking-wide">
        {target} {/* 목표 텍스트 */}
      </div>
    )}
  </div>
);

// 가중치 표시 박스 컴포넌트
const WeightBox = ({ type, value }) => {
  const styles = SEVERITY_STYLES[type];

  return (
    <div className={`rounded-xl flex flex-col items-center justify-center border-2 h-[130px] ${styles.bg} ${styles.border} relative group p-4 hover:shadow-lg transition-all`}>
      <span className={`text-sm font-bold whitespace-nowrap mb-2 ${styles.text}`}>
        {styles.label} {/* 병동 유형 라벨 */}
      </span>
      <div className={`text-3xl font-extrabold ${styles.text} bg-white/90 rounded-lg px-3 py-1.5 shadow-sm group-hover:scale-105 transition-transform`}>
        {value.toFixed(2)} {/* 가중치 값 */}
      </div>
    </div>
  );
};

// 불일치 케이스 컴포넌트
const MismatchCase = ({ doctor, ai, percentage }) => {
  const getBorderStyle = (type) => {
    if (type.includes('중증')) return 'border-l-4 border-l-[#DC2626] bg-[#FEE2E2]/50';
    if (type.includes('일반')) return 'border-l-4 border-l-[#D97706] bg-[#FEF3C7]/50';
    return 'border-l-4 border-l-[#059669] bg-[#DCFCE7]/50';
  };

  return (
    <div className={`rounded-lg shadow-sm overflow-hidden ${getBorderStyle(doctor)} hover:shadow-lg transition-all h-full group`}>
      {/* 백분율 막대 */}
      <div className="p-4 border-b border-gray-100/50">
        <div className="relative h-3 bg-gray-100 rounded-full mb-3 overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-full bg-blue-600 rounded-full transition-all group-hover:bg-blue-700"
            style={{ width: `${percentage}%` }} // 불일치 백분율 표시
          />
        </div>
        <div className="text-center">
          <span className="text-2xl font-bold text-gray-900 group-hover:scale-105 transition-transform inline-block">
            {percentage}% {/* 불일치 비율 */}
          </span>
        </div>
      </div>
      
      {/* 상세 설명 */}
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
    dailyPatients: 0, // 일일 환자 수 초기값
    matchRate: 0, // 퇴실 배치 일치도 초기값
    lastUpdated: new Date() // 마지막 업데이트 시각
  });

  // 통계 데이터 로드 및 주기적 업데이트
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:8082/boot/stats/daily');
        setStats({
          dailyPatients: response.data.dailyPatients || 127, // 일일 환자 수
          matchRate: response.data.matchRate || 85.5, // 배치 일치도
          lastUpdated: new Date()
        });
      } catch (error) {
        console.error('통계 데이터 로드 실패:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 300000); // 5분마다 데이터 갱신
    return () => clearInterval(interval);
  }, []);

  const handleSettingsClick = () => {
    onTabChange("settings"); // 설정 탭으로 이동
  };

  const cases = [
    { doctor: '중증병동', ai: '퇴원', percentage: 1.2 },
    { doctor: '중증병동', ai: '일반병동', percentage: 4.2 },
    { doctor: '일반병동', ai: '중증병동', percentage: 3.8 },
    { doctor: '일반병동', ai: '퇴원', percentage: 2.5 },
    { doctor: '퇴원', ai: '중증병동', percentage: 0.7 },
    { doctor: '퇴원', ai: '일반병동', percentage: 2.1 }
  ];

  return (
    <div className="min-h-screen bg-gray-50/80">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8 space-y-8">
        {/* 상단 섹션 */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* 가중치 카드 */}
          <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-gray-200 group hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-base text-gray-600">가중치</h3>
              <div className="flex flex-col items-end">
                <button 
                  onClick={handleSettingsClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
                >
                  <SettingsIcon size={14} /> {/* 설정 아이콘 */}
                  설정
                </button>
                <span className="text-xs text-gray-400 mt-1">
                  가중치를 설정하세요
                </span>
              </div>
            </div>

            {/* 가중치 박스 */}
            <div className="grid grid-cols-3 gap-6">
              <WeightBox type="ICU" value={weights.icu} />
              <WeightBox type="WARD" value={weights.ward} />
              <WeightBox type="DISCHARGE" value={weights.discharge} />
            </div>
          </div>

          {/* 통계 카드 */}
          <DashboardCard
            title="AI 퇴실배치 일치도"
            value={`${stats.matchRate}%`}
            trend="up"
            trendValue="1.2%"
            target="목표: 90%"
          />
          
          <DashboardCard
            title="일일 응급실 내원 환자"
            value={`${stats.dailyPatients}명`}
            trend="up"
            trendValue="12.5%"
            target={stats.lastUpdated.toLocaleString()}
          />
        </section>

        {/* 불일치 케이스 섹션 */}
        <section className="bg-white/90 rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base text-gray-600">환자 배치 불일치</h3>
            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider bg-gray-50 px-3 py-1.5 rounded-full">
              최근 30일 기준
            </div>
          </div>
          
          {/* 불일치 케이스 리스트 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6">
            {cases.map((c, i) => (
              <MismatchCase key={i} {...c} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
