import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Settings as SettingsIcon } from 'lucide-react';
import { useScores } from '../../../context/ScoreContext';
import { API_ENDPOINTS } from '../../../../constants/api';
import axios from 'axios';

const INITIAL_STATS = {
  dailyPatients: 85,
  changeRate: 0.5,
  trend: 'up',
  aiMatchRate: 95,
  mismatchPercentages: {
    'label0:level2': 2.1,
    'label0:level1': 1.8,
    'label1:level0': 1.5,
    'label1:level2': 1.2,
    'label2:level0': 0.9,
    'label2:level1': 0.6
  }
};

const SEVERITY_STYLES = {
  ICU: {
    bg: 'bg-[#FEE2E2]/50',
    text: 'text-[#DC2626]',
    border: 'border-[#FECACA]',
    label: '중환자실',
  },
  WARD: {
    bg: 'bg-[#FEF3C7]/50',
    text: 'text-[#D97706]',
    border: 'border-[#FDE68A]',
    label: '일반병동',
  },
  DISCHARGE: {
    bg: 'bg-[#DCFCE7]/50',
    text: 'text-[#059669]',
    border: 'border-[#A7F3D0]',
    label: '퇴원',
  },
};

const WeightBox = React.memo(({ type, value }) => {
  const styles = SEVERITY_STYLES[type];

  if (value === null) {
    return null;
  }

  return (
    <div className={`rounded-xl flex flex-col items-center justify-center border-2 h-[130px] ${styles.bg} ${styles.border} relative group p-4 hover:shadow-lg transition-all`}>
      <span className={`text-sm font-bold whitespace-nowrap mb-2 ${styles.text}`}>
        {styles.label}
      </span>
      <div className={`text-3xl font-extrabold ${styles.text} bg-white/90 rounded-lg px-3 py-1.5 shadow-sm group-hover:scale-105 transition-transform`}>
        {value?.toFixed(1) || '0.0'}
      </div>
    </div>
  );
});

const DashboardCard = React.memo(({ title, value, trend, trendValue, target }) => (
  <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all h-full flex flex-col">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl lg:text-2xl font-bold text-gray-800">{title}</h3>
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
));

const MismatchCase = React.memo(({ doctor, ai, percentage }) => {
  const getBorderStyle = (type) => {
    if (type.includes('중환자실')) return 'border-l-4 border-l-[#DC2626] bg-[#FEE2E2]/50';
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
          <span className="text-[12px] text-gray-400 font-medium uppercase tracking-wider block mb-1.5">
            실제 배치
          </span>
          <div className="text-base font-bold text-gray-900">{doctor}</div>
        </div>
        <div>
          <span className="text-[12px] text-blue-500 font-medium uppercase tracking-wider block mb-1.5">
            AI 추천 배치
          </span>
          <div className="text-base font-bold text-blue-800">{ai}</div>
        </div>
      </div>
    </div>
  );
});

const Dashboard = ({ onTabChange }) => {
  const { weights } = useScores();
  const [stats, setStats] = useState(INITIAL_STATS);

  const fetchData = useCallback(async () => {
    try {
      const [statsResponse, mismatchResponse, predictionResponse] = await Promise.all([
        axios.get(API_ENDPOINTS.ADMIN.DASHBOARD.STATS),
        axios.get(API_ENDPOINTS.ADMIN.DASHBOARD.MISMATCH),
        axios.get(API_ENDPOINTS.ADMIN.DASHBOARD.PREDICTION)
      ]);

      setStats(prev => ({
        dailyPatients: Math.round(predictionResponse.data?.nextHourPrediction) || prev.dailyPatients,
        changeRate: statsResponse.data?.changeRate || prev.changeRate,
        trend: statsResponse.data?.trend || prev.trend,
        aiMatchRate: statsResponse.data?.aiMatchRate || prev.aiMatchRate,
        mismatchPercentages: {
          ...prev.mismatchPercentages,
          ...(mismatchResponse.data?.percentages || {})
        }
      }));
    } catch (error) {
      console.error('데이터 로드 오류:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const mismatchCases = useMemo(() => [
    { doctor: '중환자실', ai: '퇴원', percentage: stats.mismatchPercentages['label0:level2'] || 0 },
    { doctor: '중환자실', ai: '일반병동', percentage: stats.mismatchPercentages['label0:level1'] || 0 },
    { doctor: '일반병동', ai: '중환자실', percentage: stats.mismatchPercentages['label1:level0'] || 0 },
    { doctor: '일반병동', ai: '퇴원', percentage: stats.mismatchPercentages['label1:level2'] || 0 },
    { doctor: '퇴원', ai: '중환자실', percentage: stats.mismatchPercentages['label2:level0'] || 0 },
    { doctor: '퇴원', ai: '일반병동', percentage: stats.mismatchPercentages['label2:level1'] || 0 }
  ], [stats.mismatchPercentages]);

  if (!weights) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/80 overflow-hidden py-6">
      <div className="w-full max-w-[1600px] mx-auto px-4 xl:px-8 space-y-20">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-6 2xl:gap-8">
          <div className="bg-white/90 rounded-xl p-6 shadow-sm border border-gray-200 group hover:shadow-lg transition-all h-[260px]">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800">가중치</h3>
              <button
                onClick={() => onTabChange('settings')}
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
            />
          </div>

          <div className="h-[260px]">
            <DashboardCard
              title="일일 응급실 내원 환자"
              value={`${stats.dailyPatients}명`}
              trend={stats.trend}
              trendValue={`${Math.abs(stats.changeRate)}%`}
              target={new Date().toLocaleString()}
            />
          </div>
        </section>

        <section className="bg-white/90 rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6 lg:mb-8">환자배치 불일치</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-6">
            {mismatchCases.map((caseData, index) => (
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

export default React.memo(Dashboard);