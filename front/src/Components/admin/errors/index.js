import React, { useState } from 'react';
import { Search, Download, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';

const FilterButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
      ${active 
        ? "bg-blue-600 text-white" 
        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}
  >
    {children}
  </button>
);

const ErrorCard = ({ error, onResolve, onSendToSupport }) => {
  const statusColors = {
    resolved: "bg-green-100 text-green-800",
    unresolved: "bg-red-100 text-red-800"
  };

  const typeColors = {
    error: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-800"
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{error.timestamp}</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[error.type]}`}>
            {error.type}
          </span>
          <span className="text-sm font-mono text-gray-600">{error.id}</span>
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
          ${statusColors[error.status]}`}>
          <span className="w-2 h-2 rounded-full bg-current"/>
          {error.status === 'resolved' ? '해결됨' : '미해결'}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="text-gray-900 font-medium mb-4">{error.message}</div>
        <div className="bg-gray-50 rounded-md p-4 font-mono text-sm text-gray-600 whitespace-pre-wrap">
          {error.details}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
        {error.status === 'unresolved' && (
          <button
            onClick={() => onResolve(error.id)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            해결 표시
          </button>
        )}
        <button
          onClick={() => onSendToSupport(error.id)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          유지보수 팀에 전송
        </button>
      </div>
    </div>
  );
};

const Errors = () => {
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const errorLogs = [
    {
      id: 'ERR-2410-001',
      timestamp: '2024-10-24 14:30:00',
      type: 'error',
      title: '모델 예측 실패',
      message: '모델 예측 실패 (환자 ID: 12345)',
      details: `Stack trace:
Error: Failed to predict ICU admission score
   at PredictionModel.calculate (model.js:245)
   at async ProcessManager.handlePatient (manager.js:123)`,
      status: 'unresolved'
    },
    {
      id: 'WARN-2410-002',
      timestamp: '2024-10-24 13:15:00',
      type: 'warning',
      title: '데이터 지연 발생',
      message: '생체 신호 데이터 수신 지연 (30초 이상)',
      details: '데이터 수신 지연으로 인한 처리 대기',
      status: 'resolved'
    }
  ];

  const handleExportLogs = () => {
    const exportData = errorLogs.map(log => ({
      ID: log.id,
      시간: log.timestamp,
      유형: log.type,
      제목: log.title,
      메시지: log.message,
      상태: log.status
    }));

    const csvContent = 'data:text/csv;charset=utf-8,' 
      + Object.keys(exportData[0]).join(',') + '\n'
      + exportData.map(row => Object.values(row).join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `error_logs_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendToSupport = (errorId) => {
    console.log('Send to support:', errorId);
  };

  const handleMarkResolved = (errorId) => {
    console.log('Mark as resolved:', errorId);
  };

  const filteredLogs = errorLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || log.type === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-grow">
          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="로그 검색..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <FilterButton
              active={selectedLevel === 'all'}
              onClick={() => setSelectedLevel('all')}
            >
              전체 레벨
            </FilterButton>
            <FilterButton
              active={selectedLevel === 'error'}
              onClick={() => setSelectedLevel('error')}
            >
              에러
            </FilterButton>
            <FilterButton
              active={selectedLevel === 'warning'}
              onClick={() => setSelectedLevel('warning')}
            >
              경고
            </FilterButton>
            <FilterButton
              active={selectedLevel === 'info'}
              onClick={() => setSelectedLevel('info')}
            >
              정보
            </FilterButton>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportLogs}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Download className="w-4 h-4 mr-2" />
          로그 내보내기
        </button>
      </div>

      {/* Error List */}
      <div className="space-y-4">
        {filteredLogs.map((error) => (
          <ErrorCard
            key={error.id}
            error={error}
            onResolve={handleMarkResolved}
            onSendToSupport={handleSendToSupport}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-3">
        <div className="flex justify-between flex-1 sm:hidden">
          <button
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            이전
          </button>
          <button
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            다음
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">총 2개</span>의 로그
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                이전
              </button>
              <button
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
              >
                1
              </button>
              <button
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                다음
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Errors;