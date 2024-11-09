import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Download } from 'lucide-react';
import ErrorCard from './ErrorCard';  // 방금 만든 ErrorCard 컴포넌트

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

const Errors = () => {
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [errorLogs, setErrorLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchErrors = async () => {
      try {
        const response = await axios.get('http://localhost:8082/boot/errors');
        setErrorLogs(response.data);
      } catch (err) {
        setError('에러 로그를 불러오는데 실패했습니다.');
        console.error('Error fetching logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchErrors();
  }, []);

  const handleExportLogs = () => {
    const exportData = errorLogs.map(log => ({
      ID: log.id,
      에러명: log.errorname,
      메시지: log.errormessage,
      타입: log.errortype,
      심각도: log.severitylevel,
      URL: log.url,
      사용자: log.userid || '미로그인',
      브라우저: log.browser,
      발생시각: log.createdat.join('-'),
      해결여부: log.isresolved ? '해결' : '미해결'
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

  const handleSendToSupport = async (errorId) => {
    try {
      // API 호출 예시
      await axios.post(`http://localhost:8082/boot/errors/${errorId}/support`);
      alert('유지보수 팀에 전송되었습니다.');
    } catch (err) {
      alert('전송 중 오류가 발생했습니다.');
      console.error('Error sending to support:', err);
    }
  };

  const filteredLogs = errorLogs.filter(log => {
    const matchesSearch = 
      log.errormessage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.errorname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.errortype?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(log.id).includes(searchTerm);
    const matchesLevel = selectedLevel === 'all' || log.severitylevel === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

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
              placeholder="에러 검색 (ID, 메시지, 타입...)"
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
              전체
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
        {filteredLogs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            표시할 에러 로그가 없습니다.
          </div>
        ) : (
          filteredLogs.map((error) => (
            <ErrorCard
              key={error.id}
              error={error}
              onSendToSupport={handleSendToSupport}
            />
          ))
        )}
      </div>

      {/* Summary */}
      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600">
          총 <span className="font-medium">{filteredLogs.length}</span>개의 에러 로그
        </p>
      </div>
    </div>
  );
};

export default Errors;