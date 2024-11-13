import React from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { useScores } from '../../../context/ScoreContext';

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

const Dashboard = ({ loading, onTabChange }) => {
  const { scores } = useScores();

  const handleSettingsClick = () => {
    onTabChange("settings"); // "model" 대신 "settings"로 변경(설정 페이지 변경됨.)
  };

  return (
    <div className="space-y-6 p-6">
      {/* 메트릭 그리드 - 순서 변경됨 */}
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

      {/* 추가 섹션들을 위한 공간 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 차트나 추가 정보를 위한 섹션 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-900 font-semibold mb-4">실시간 모니터링</h3>
          {/* 차트나 실시간 데이터 컴포넌트 */}
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            모델이 높게 모델이 낮게 평가한 6가지 케이스 보여주기
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-gray-900 font-semibold mb-4">최근 알림</h3>
          <div className="space-y-4">
            {/* 알림 목록 예시 */}
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="p-1.5 bg-blue-100 rounded-full">
                <AlertCircle size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">시스템 업데이트</p>
                <p className="text-sm text-blue-700 mt-0.5">
                  AI 모델 v2.1.0 업데이트가 완료되었습니다
                </p>
                <p className="text-xs text-blue-600 mt-1">10분 전</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;