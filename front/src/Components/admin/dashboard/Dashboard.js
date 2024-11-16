import React, { useState, useEffect } from 'react';
import { AlertCircle, Settings as SettingsIcon } from 'lucide-react';
import { useScores } from '../../../context/ScoreContext';
import axios from 'axios';

const SEVERITY_STYLES = {
  ICU: {
    bg: 'bg-[#FEE2E2]/50',
    text: 'text-[#DC2626]',
    border: 'border-[#FECACA]',
    label: '중증병동',
    description: '중증병동 입실이 필요한 환자'
  },
  WARD: {
    bg: 'bg-[#FEF3C7]/50',
    text: 'text-[#D97706]',
    border: 'border-[#FDE68A]',
    label: '일반병동',
    description: '일반병동 입원이 필요한 환자'
  },
  DISCHARGE: {
    bg: 'bg-[#DCFCE7]/50',
    text: 'text-[#059669]',
    border: 'border-[#A7F3D0]',
    label: '퇴원',
    description: '퇴원 가능한 환자'
  }
};

const DashboardCard = ({ title, value, target }) => (
  <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all">
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="text-2xl md:text-3xl font-bold text-gray-900 text-center">{value}</div>
    {target && (
      <div className="text-sm text-gray-500 text-center mt-1">{target}</div>
    )}
  </div>
);

const WeightBox = ({ type, value, description }) => {
  const styles = SEVERITY_STYLES[type];

  return (
    <div className={`rounded-lg p-3 md:p-4 flex flex-col items-center border ${styles.bg} ${styles.text} ${styles.border} relative group`}>
      <span className="text-base md:text-lg font-bold mb-2 text-center">{styles.label}</span>
      <div className="text-xl md:text-2xl font-bold">{value.toFixed(2)}</div>
      <span className="text-sm md:text-base mt-1 font-medium">가중치</span>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm md:text-base rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
        {description}
      </div>
    </div>
  );
};

const MismatchCase = ({ doctor, ai, percentage }) => {
  const getBorderStyle = (type) => {
    if (type.includes('중증')) return 'border-l-4 border-l-[#DC2626] bg-[#FEE2E2]/50';
    if (type.includes('일반')) return 'border-l-4 border-l-[#D97706] bg-[#FEF3C7]/50';
    return 'border-l-4 border-l-[#059669] bg-[#DCFCE7]/50';
  };

  return (
    <div className={`rounded-lg shadow-sm overflow-hidden ${getBorderStyle(doctor)} hover:shadow-md transition-all`}>
      <div className="p-4 border-b border-gray-100/50">
        <div className="text-center">
          <span className="text-xl md:text-2xl font-bold text-gray-900">{percentage}%</span>
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          <div>
            <span className="text-sm text-gray-500 block mb-1">실제 배치</span>
            <div className="text-base font-bold text-gray-900">{doctor}</div>
          </div>
          <div>
            <span className="text-sm text-blue-600 block mb-1">AI 추천 배치</span>
            <div className="text-base font-bold text-blue-900">{ai}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ onTabChange }) => {
  const { weights } = useScores();
  const [stats, setStats] = useState({ dailyPatients: 0, matchRate: 0, lastUpdated: new Date() });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('http://localhost:8082/boot/stats/daily');
        setStats({
          dailyPatients: data.dailyPatients || 127,
          matchRate: data.matchRate || 85.5,
          lastUpdated: new Date(),
        });
      } catch (error) {
        console.error('통계 데이터 로드 실패:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 300000);
    return () => clearInterval(interval);
  }, []);

  const cases = [
    { doctor: '중증병동', ai: '퇴원', percentage: 1.2 },
    { doctor: '중증병동', ai: '일반병동', percentage: 4.2 },
    { doctor: '일반병동', ai: '중증병동', percentage: 3.8 },
    { doctor: '일반병동', ai: '퇴원', percentage: 2.5 },
    { doctor: '퇴원', ai: '중증병동', percentage: 0.7 },
    { doctor: '퇴원', ai: '일반병동', percentage: 2.1 },
  ];

  return (
    <div className="p-4 md:p-6 w-full bg-gray-50">
      <div className="space-y-6 md:space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">가중치</h3>
              <button
                onClick={() => onTabChange('settings')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all"
              >
                <SettingsIcon size={16} /> 설정
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <WeightBox type="ICU" value={weights.icu} description="중증병동 입실이 필요한 환자 판단 가중치" />
              <WeightBox type="WARD" value={weights.ward} description="일반병동 입원이 필요한 환자 판단 가중치" />
              <WeightBox type="DISCHARGE" value={weights.discharge} description="퇴원 가능한 환자 판단 가중치" />
            </div>
          </div>
          <DashboardCard title="AI 퇴실배치 일치도" value={`${stats.matchRate}%`} target="목표: 90%" />
          <DashboardCard title="일일 응급실 내원 환자" value={`${stats.dailyPatients}명`} target={`${stats.lastUpdated.toLocaleString()} 기준`} />
        </div>
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">환자 배치 불일치</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
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
