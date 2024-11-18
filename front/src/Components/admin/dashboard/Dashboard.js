import React, { useState, useEffect } from 'react';
import { TrendingUp, Settings as SettingsIcon } from 'lucide-react';
import { useScores } from '../../../context/ScoreContext';
import axios from 'axios';

// 배치 유형별 스타일을 정의한 상수 객체
// 각 병동 유형에 따라 배경색, 텍스트 색상, 테두리 색상 등이 다름
const SEVERITY_STYLES = {
  ICU: {
    bg: 'bg-[#FEE2E2]/50', // 중증병동 배경색 (연한 빨간색)
    text: 'text-[#DC2626]', // 텍스트 색상 (짙은 빨간색)
    border: 'border-[#FECACA]', // 테두리 색상 (밝은 빨간색)
    label: '중증병동', // 병동 이름
    description: '중증병동 입실이 필요한 환자', // 추가 설명
  },
  WARD: {
    bg: 'bg-[#FEF3C7]/50', // 일반병동 배경색 (연한 노란색)
    text: 'text-[#D97706]', // 텍스트 색상 (짙은 주황색)
    border: 'border-[#FDE68A]', // 테두리 색상 (밝은 노란색)
    label: '일반병동',
    description: '일반병동 입원이 필요한 환자',
  },
  DISCHARGE: {
    bg: 'bg-[#DCFCE7]/50', // 퇴원 배경색 (연한 녹색)
    text: 'text-[#059669]', // 텍스트 색상 (짙은 녹색)
    border: 'border-[#A7F3D0]', // 테두리 색상 (밝은 녹색)
    label: '퇴원',
    description: '퇴원 가능한 환자',
  },
};

// 대시보드에서 통계 데이터를 카드 형태로 표시하는 컴포넌트
// props로 제목(title), 값(value), 트렌드(trend), 목표(target)를 받음
const DashboardCard = ({ title, value, trend, trendValue, target }) => (
  <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all h-full flex flex-col">
    {/* 카드 제목과 트렌드 아이콘 */}
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl lg:text-2xl font-bold text-gray-800">{title}</h3>
      {trend && (
        <div
          className={`flex items-center gap-1.5 ${
            trend === 'up' ? 'text-green-600 bg-green-50/80' : 'text-red-600 bg-red-50/80'
          } font-medium px-3 py-1.5 rounded-full`}
        >
          {/* 트렌드 아이콘 - 상승(up)일 경우 그대로, 하락(down)일 경우 180도 회전 */}
          <TrendingUp
            size={14}
            className={`shrink-0 ${trend === 'down' ? 'rotate-180' : ''}`}
          />
          {/* 트렌드 변화값 */}
          <span className="text-sm font-semibold">{trendValue}</span>
        </div>
      )}
    </div>
    {/* 주요 데이터 값 */}
    <div className="flex-1 flex flex-col justify-center">
      <div className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-3">
        {value}
      </div>
      {/* 목표 값 (옵션) */}
      {target && (
        <div className="text-xs text-gray-400 text-center tracking-wide">{target}</div>
      )}
    </div>
  </div>
);

// 병동별 가중치 값을 표시하는 컴포넌트
const WeightBox = ({ type, value }) => {
  // 병동 유형(type)에 따른 스타일 선택
  const styles = SEVERITY_STYLES[type];

  return (
    <div
      className={`rounded-xl flex flex-col items-center justify-center border-2 h-[130px] ${styles.bg} ${styles.border} relative group p-4 hover:shadow-lg transition-all`}
    >
      {/* 병동 유형 이름 (ICU, 일반병동, 퇴원 등) */}
      <span className={`text-sm font-bold whitespace-nowrap mb-2 ${styles.text}`}>
        {styles.label}
      </span>
      {/* 병동별 가중치 값 (소수점 둘째 자리까지 표시) */}
      <div
        className={`text-3xl font-extrabold ${styles.text} bg-white/90 rounded-lg px-3 py-1.5 shadow-sm group-hover:scale-105 transition-transform`}
      >
        {value.toFixed(2)}
      </div>
    </div>
  );
};

// 배치 불일치 케이스를 표시하는 컴포넌트
// props로 의사 배치(doctor), AI 추천 배치(ai), 불일치 비율(percentage)을 받음
const MismatchCase = ({ doctor, ai, percentage }) => {
  // 의사 배치 유형에 따른 스타일 설정
  const getBorderStyle = (type) => {
    if (type.includes('중증')) return 'border-l-4 border-l-[#DC2626] bg-[#FEE2E2]/50';
    if (type.includes('일반')) return 'border-l-4 border-l-[#D97706] bg-[#FEF3C7]/50';
    return 'border-l-4 border-l-[#059669] bg-[#DCFCE7]/50';
  };

  return (
    <div
      className={`rounded-lg shadow-sm overflow-hidden ${getBorderStyle(
        doctor
      )} hover:shadow-lg transition-all h-full group`}
    >
      {/* 불일치 비율 표시 - 막대 그래프와 퍼센트 값 */}
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
      {/* 의사 배치와 AI 배치 정보 */}
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
// 통계 데이터와 병동별 가중치, 불일치 정보를 표시
const Dashboard = ({ loading, onTabChange }) => {
  const { weights } = useScores(); // 컨텍스트에서 가중치 데이터를 가져옴

  const [stats, setStats] = useState({
    dailyPatients: '로딩 중...', // 일일 환자 수
    changeRate: 0, // 변화율
    trend: 'up', // 트렌드 방향 (up 또는 down)
    aiMatchRate: 0, // AI 일치율
    mismatchDistribution: {}, // 배치 불일치 데이터
  });

  // 서버에서 통계 데이터를 가져오는 함수
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:8082/boot/admin/dashboard/stats');
        if (response.data) {
          setStats({
            dailyPatients: response.data.dailyPatients,
            changeRate: response.data.changeRate,
            trend: response.data.trend,
            aiMatchRate: response.data.aiMatchRate,
            mismatchDistribution: response.data.mismatchDistribution || {},
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats((prev) => ({
          ...prev,
          dailyPatients: '오류', // 데이터 로드 실패 시 오류 표시
        }));
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 300000); // 5분마다 데이터 갱신
    return () => clearInterval(interval);
  }, []);

  // 설정 버튼 클릭 핸들러
  const handleSettingsClick = () => {
    onTabChange('settings');
  };

  // 불일치 데이터 배열
  const mismatchCases = [
    { doctor: '중증병동', ai: '퇴원', percentage: stats.mismatchDistribution.ICU_to_DISCHARGE || 0 },
    { doctor: '중증병동', ai: '일반병동', percentage: stats.mismatchDistribution.ICU_to_WARD || 0 },
    { doctor: '일반병동', ai: '중증병동', percentage: stats.mismatchDistribution.WARD_to_ICU || 0 },
    { doctor: '일반병동', ai: '퇴원', percentage: stats.mismatchDistribution.WARD_to_DISCHARGE || 0 },
    { doctor: '퇴원', ai: '중증병동', percentage: stats.mismatchDistribution.DISCHARGE_to_ICU || 0 },
    { doctor: '퇴원', ai: '일반병동', percentage: stats.mismatchDistribution.DISCHARGE_to_WARD || 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50/80 overflow-hidden py-6">
      <div className="w-full max-w-[1600px] mx-auto px-4 xl:px-8 space-y-20">
        {/* 병동 가중치와 통계 섹션 */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-6 2xl:gap-8">
          {/* 병동별 가중치 섹션 */}
          <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-gray-200 group hover:shadow-lg transition-all h-[260px]">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800">가중치</h3>
              <button
                onClick={handleSettingsClick}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 hover:scale-105"
              >
                <SettingsIcon size={14} />
                설정
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 xl:gap-6 h-[180px]">
              <WeightBox type="ICU" value={weights.icu} />
              <WeightBox type="WARD" value={weights.ward} />
              <WeightBox type="DISCHARGE" value={weights.discharge} />
            </div>
          </div>

          {/* AI 퇴실 배치 일치도 */}
          <div className="h-[260px]">
            <DashboardCard
              title="AI 퇴실배치 일치도"
              value={`${stats.aiMatchRate}%`}
              trend="up"
              trendValue="1.2%"
              target="목표: 90%"
            />
          </div>

          {/* 일일 응급실 내원 환자 수 */}
          <div className="h-[260px]">
            <DashboardCard
              title="일일 응급실 내원 환자"
              value={stats.dailyPatients === '로딩 중...' ? '로딩 중...' : `${stats.dailyPatients}명`}
              trend={stats.trend}
              trendValue={`${Math.abs(stats.changeRate)}%`}
              target={new Date().toLocaleString()}
            />
          </div>
        </section>

        {/* 불일치 데이터 섹션 */}
        <section className="bg-white/90 rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6 lg:mb-8">환자배치 불일치</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6">
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
