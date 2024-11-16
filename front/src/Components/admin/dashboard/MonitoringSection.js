const MonitoringSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">실시간 모니터링</h3>
          <div className="flex gap-2">
            <select className="text-sm border border-gray-300 rounded-md p-1">
              <option>최근 6시간</option>
              <option>최근 12시간</option>
              <option>최근 24시간</option>
            </select>
          </div>
        </div>
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          차트 영역
        </div>
      </div>
  
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 알림</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="text-blue-600 bg-blue-100 p-2 rounded-full">
              <AlertCircle size={16} />
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
  );