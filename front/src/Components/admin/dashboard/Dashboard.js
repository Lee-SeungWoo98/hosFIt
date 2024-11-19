import React, { useState, useEffect } from 'react';
import { TrendingUp, Settings as SettingsIcon } from 'lucide-react';
import { useScores } from '../../../context/ScoreContext';
import axios from 'axios';

// 배치 유형별 스타일 정의
const SEVERITY_STYLES = {
  ICU: {
    bg: 'bg-[#FEE2E2]/50',
    text: 'text-[#DC2626]',
    border: 'border-[#FECACA]',
    label: '중증병동',
    description: '중증병동 입실이 필요한 환자',
  },
  WARD: {
    bg: 'bg-[#FEF3C7]/50',
    text: 'text-[#D97706]',
    border: 'border-[#FDE68A]',
    label: '일반병동',
    description: '일반병동 입원이 필요한 환자',
  },
  DISCHARGE: {
    bg: 'bg-[#DCFCE7]/50',
    text: 'text-[#059669]',
    border: 'border-[#A7F3D0]',
    label: '퇴원',
    description: '퇴원 가능한 환자',
  },
};

// DashboardCard 컴포넌트
const DashboardCard = ({ title, value, trend, trendValue, target }) => (
  <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all h-full flex flex-col">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl lg:text-2xl font-bold text-gray-800">{title}</h3>
      {trend && (
        <div
          className={`flex items-center gap-1.5 ${
            trend === 'up' ? 'text-green-600 bg-green-50/80' : 'text-red-600 bg-red-50/80'
          } font-medium px-3 py-1.5 rounded-full`}
        >
          <TrendingUp
            size={14}
            className={`shrink-0 ${trend === 'down' ? 'rotate-180' : ''}`}
          />
          <span className="text-sm font-semibold">{trendValue}</span>
        </div>
      )}
    </div>
    <div className="flex-1 flex flex-col justify-center">
      <div className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-3">
        {value}
      </div>
      {target && (
        <div className="text-xs text-gray-400 text-center tracking-wide">{target}</div>
      )}
    </div>
  </div>
);

// WeightBox 컴포넌트
const WeightBox = ({ type, value }) => {
  const styles = SEVERITY_STYLES[type];

  return (
    <div
      className={`rounded-xl flex flex-col items-center justify-center border-2 h-[130px] ${styles.bg} ${styles.border} relative group p-4 hover:shadow-lg transition-all`}
    >
      <span className={`text-sm font-bold whitespace-nowrap mb-2 ${styles.text}`}>
        {styles.label}
      </span>
      <div
        className={`text-3xl font-extrabold ${styles.text} bg-white/90 rounded-lg px-3 py-1.5 shadow-sm group-hover:scale-105 transition-transform`}
      >
        {value?.toFixed(2) || '0.00'}
      </div>
    </div>
  );
};

// MismatchCase 컴포넌트
const MismatchCase = ({ doctor, ai, percentage }) => {
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

// Dashboard 메인 컴포넌트
const Dashboard = ({ loading, onTabChange }) => {
  const { weights } = useScores();
  const [stats, setStats] = useState({
    dailyPatients: '로딩 중...',
    changeRate: 0,
    trend: 'up',
    aiMatchRate: 0,
    mismatchPercentages: {
      'label0:level2': 0,
      'label0:level1': 0,
      'label1:level0': 0,
      'label1:level2': 0,
      'label2:level0': 0,
      'label2:level1': 0
    }
  });

  useEffect(() => {
    const fetchMismatchData = async () => {
      try {
        console.log('Fetching mismatch data...');
        const response = await axios.get('http://localhost:8082/boot/admin/mismatch');
        console.log('Received mismatch data:', response.data);
        
        if (response.data && response.data.percentages) {
          setStats(prev => ({
            ...prev,
            mismatchPercentages: {
              ...prev.mismatchPercentages,
              ...response.data.percentages
            }
          }));
        }
      } catch (error) {
        console.error('불일치 데이터 로드 오류:', error);
      }
    };

    const fetchStats = async () => {
      try {
        console.log('Fetching dashboard stats...');
        const response = await axios.get('http://localhost:8082/boot/admin/dashboard/stats');
        console.log('Received dashboard stats:', response.data);
        
        if (response.data) {
          setStats(prev => ({
            ...prev,
            dailyPatients: response.data.dailyPatients,
            changeRate: response.data.changeRate,
            trend: response.data.trend,
            aiMatchRate: response.data.aiMatchRate || 0
          }));
        }
      } catch (error) {
        console.error('통계 데이터 로드 오류:', error);
        setStats(prev => ({
          ...prev,
          dailyPatients: '오류',
          aiMatchRate: 0
        }));
      }
    };

    const fetchAllData = async () => {
      await Promise.all([fetchStats(), fetchMismatchData()]);
    };

    fetchAllData();
    const interval = setInterval(fetchAllData, 300000);
    return () => clearInterval(interval);
  }, []);

  const getMismatchCases = () => [
    { 
      doctor: '중증병동', 
      ai: '퇴원', 
      percentage: stats.mismatchPercentages['label0:level2']
    },
    { 
      doctor: '중증병동', 
      ai: '일반병동', 
      percentage: stats.mismatchPercentages['label0:level1']
    },
    { 
      doctor: '일반병동', 
      ai: '중증병동', 
      percentage: stats.mismatchPercentages['label1:level0']
    },
    { 
      doctor: '일반병동', 
      ai: '퇴원', 
      percentage: stats.mismatchPercentages['label1:level2']
    },
    { 
      doctor: '퇴원', 
      ai: '중증병동', 
      percentage: stats.mismatchPercentages['label2:level0']
    },
    { 
      doctor: '퇴원', 
      ai: '일반병동', 
      percentage: stats.mismatchPercentages['label2:level1']
    }
  ];

  const handleSettingsClick = () => {
    onTabChange('settings');
  };

  return (
    <div className="min-h-screen bg-gray-50/80 overflow-hidden py-6">
      <div className="w-full max-w-[1600px] mx-auto px-4 xl:px-8 space-y-20">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-6 2xl:gap-8">
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
              <WeightBox type="ICU" value={weights.level0} />
              <WeightBox type="WARD" value={weights.level1} />
              <WeightBox type="DISCHARGE" value={weights.level2} />
            </div>
          </div>

          <div className="h-[260px]">
            <DashboardCard
              title="AI 퇴실배치 일치도"
              value={`${stats.aiMatchRate}%`}
              trend="up"
              trendValue="1.2%"
            />
          </div>

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

        <section className="bg-white/90 rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6 lg:mb-8">환자배치 불일치</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6">
            {getMismatchCases().map((caseData, index) => (
              <MismatchCase 
                key={`${caseData.doctor}-${caseData.ai}`}
                doctor={caseData.doctor}
                ai={caseData.ai}
                percentage={Number(caseData.percentage || 0).toFixed(1)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;