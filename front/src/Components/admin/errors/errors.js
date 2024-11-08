import React, { useState, useEffect } from 'react';
import { Search, Download, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

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

const ErrorCard = ({ error, onSendToSupport }) => {
  const typeColors = {
    error: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-800"
  };

  // Format createdat array to readable string
  const formatDate = (dateArr) => {
    const [year, month, day, hour, minute, second] = dateArr;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{formatDate(error.createdat)}</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[error.severitylevel]}`}>
            {error.severitylevel}
          </span>
          <span className="text-sm font-mono text-gray-600">ID: {error.id}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-gray-900">{error.errorname}</span>
          {error.userid && (
            <span className="text-sm text-gray-500">User: {error.userid}</span>
          )}
        </div>
        <div className="text-gray-900 mb-4">{error.errormessage}</div>
        <div className="bg-gray-50 rounded-md p-4 font-mono text-sm text-gray-600 whitespace-pre-wrap">
          {error.errorstack}
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <div>URL: {error.url}</div>
          <div>Browser: {error.browser}</div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
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
      } finally {
        setLoading(false);
      }
    };

    fetchErrors();
  }, []);

  const handleExportLogs = () => {
    const exportData = errorLogs.map(log => ({
      ID: log.id,
      시간: formatDate(log.createdat),
      유형: log.severitylevel,
      에러명: log.errorname,
      메시지: log.errormessage,
      URL: log.url,
      사용자: log.userid || '-',
      브라우저: log.browser,
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

  const handleSendToSupport = (errorId) => {
    console.log('Send to support:', errorId);
  };

  const formatDate = (dateArr) => {
    const [year, month, day, hour, minute, second] = dateArr;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
  };

  const filteredLogs = errorLogs.filter(log => {
    const matchesSearch = 
      log.errormessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.errorname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.errortype.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(log.id).includes(searchTerm);
    const matchesLevel = selectedLevel === 'all' || log.severitylevel === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  if (loading) {
    return <div className="p-6 text-center">로딩 중...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-grow">
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
          </div>
        </div>

        <button
          onClick={handleExportLogs}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Download className="w-4 h-4 mr-2" />
          로그 내보내기
        </button>
      </div>

      <div className="space-y-4">
        {filteredLogs.map((error) => (
          <ErrorCard
            key={error.id}
            error={error}
            onSendToSupport={handleSendToSupport}
          />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 pt-3">
        <div className="flex justify-between flex-1">
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">총 {filteredLogs.length}개</span>의 로그
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Errors;