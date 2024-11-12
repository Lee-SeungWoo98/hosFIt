import React, { useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import axios from 'axios';
import ErrorCard from './ErrorCard';

/**
 * 필터 버튼 컴포넌트
 * 에러 로그 필터링을 위한 토글 버튼
 */
const FilterButton = ({ active, onClick, children, type }) => {
  // 레벨별 스타일 정의
  const buttonStyles = {
    error: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-500 hover:bg-yellow-600",
    info: "bg-blue-600 hover:bg-blue-700",
    all: "bg-blue-600 hover:bg-blue-700"  // 전체 버튼은 기존 파란색 유지
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
        ${active 
          ? `${buttonStyles[type]} text-white` 
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          style={{ border: 'none' }}  // CSS 스타일로도 경계선 제거
    >
      {children}
    </button>
  );
};

/**
 * 에러 로그 관리 페이지 메인 컴포넌트
 * 에러 로그 목록을 표시하고 관리하는 컴포넌트
 */
const Errors = () => {
  // 상태 관리
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * 에러 로그 데이터 fetch
   * 컴포넌트 마운트시 실행
   */
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:8082/boot/errors');
        setLogs(response.data);
      } catch (err) {
        setError('에러 로그를 불러오는데 실패했습니다.');
        console.error('Error fetching logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  /**
   * 에러 로그 CSV 내보내기
   * 현재 표시된 로그들을 CSV 파일로 다운로드
   */
  const handleExportLogs = () => {
    const exportData = logs.map(log => ({
      'Log No.': log.id,
      '에러명': log.errorname,
      '메시지': log.errormessage,
      '로그타입': log.errortype,
      '심각도': log.severitylevel,
      'URL': log.url,
      '사용자': log.userid || '미로그인',
      '브라우저': log.browser,
      '발생시각': log.createdat.join('-')
    }));

    // BOM 추가로 한글 인코딩 처리
    const BOM = '\uFEFF';
    const csvContent = BOM + 
      Object.keys(exportData[0]).join(',') + '\n' +
      exportData.map(row => 
        Object.values(row)
          .map(value => `"${value}"`) // 값을 쌍따옴표로 감싸서 쉼표 처리
          .join(',')
      ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `error_logs_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  /**
   * 에러 로그 이메일 전송
   * 선택한 로그를 유지보수팀에 이메일로  전송
   */
  const handleSendToSupport = async (logId) => {
    try {
      await axios.post(`http://localhost:8082/boot/errors/${logId}/support`);
      alert('메일이 전송되었습니다.');
    } catch (err) {
      alert('전송 중 오류가 발생했습니다.');
      console.error('Error sending email:', err);
    }
  };

  /**
   * 에러 로그 필터링
   * 검색어와 선택된 레벨에 따라 로그를 필터링
   */
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.errormessage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.errorname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.errortype?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(log.id).includes(searchTerm);
    const matchesLevel = selectedLevel === 'all' || log.severitylevel === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  if (loading) return <div className="flex items-center justify-center min-h-screen">로딩 중...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-6">
      {/* 컨트롤 섹션: 검색, 필터, 내보내기 */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-grow">
          {/* 검색 입력 */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="검색 (Log No, 메시지, 타입...)"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 필터 버튼 */}
          <div className="flex gap-2">
            <FilterButton
              active={selectedLevel === 'all'}
              onClick={() => setSelectedLevel('all')}
              type="all"
            >
              전체
            </FilterButton>
            <FilterButton
              active={selectedLevel === 'error'}
              onClick={() => setSelectedLevel('error')}
              type="error"
            >
              에러
            </FilterButton>
            <FilterButton
              active={selectedLevel === 'warning'}
              onClick={() => setSelectedLevel('warning')}
              type="warning"
            >
              경고
            </FilterButton>
            <FilterButton
              active={selectedLevel === 'info'}
              onClick={() => setSelectedLevel('info')}
              type="info"
            >
              정보
            </FilterButton>
          </div>
        </div>

        {/* 내보내기 버튼 */}
        <button
          onClick={handleExportLogs}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Download className="w-4 h-4 mr-2" />
          로그 내보내기
        </button>
      </div>

      {/* 에러 로그 리스트 */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            표시할 에러 로그가 없습니다.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <ErrorCard
              key={log.id}
              log={log}
              onSendToSupport={handleSendToSupport}
            />
          ))
        )}
      </div>

      {/* 전체 개수 표시 */}
      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600">
          총 <span className="font-medium">{filteredLogs.length}</span>개의 에러 로그
        </p>
      </div>
    </div>
  );
};

export default Errors;