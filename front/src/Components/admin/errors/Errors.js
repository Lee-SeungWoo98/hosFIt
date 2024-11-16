import React, { useState, useEffect } from "react";
import { Search, Download } from "lucide-react";
import axios from "axios";
import ErrorCard from "./ErrorCard";
import errorEmailService from "./ErrorEmailService"; // 파일명과 정확히 일치하게 수정

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
    all: "bg-gray-600 hover:bg-gray-700",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out
        ${active 
          ? `${buttonStyles[type]} text-white shadow-md` 
          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
        }`}
    >
      {children}
    </button>
  );
};

/**
 * 에러 로그 관리 페이지 메인 컴포넌트
 */
const Errors = () => {
  // =========== 상태 관리 =========== 
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // =========== 데이터 페치 =========== 
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get("http://localhost:8082/boot/errors");
        const formattedLogs = response.data.map(log => ({
          ...log,
          createdat: Array.isArray(log.createdat) ? log.createdat : [2024, 1, 1, 0, 0, 0]
        }));
        setLogs(formattedLogs);
      } catch (err) {
        setError("에러 로그를 불러오는데 실패했습니다.");
        console.error("Error fetching logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();

    // 자동 새로고침 설정 (5분마다)
    const refreshInterval = setInterval(fetchLogs, 300000);
    return () => clearInterval(refreshInterval);
  }, []);

  // =========== 유틸리티 함수 =========== 
  const formatDate = (dateArr) => {
    if (!Array.isArray(dateArr) || dateArr.length < 6) return 'Invalid Date';
    const [year, month, day, hour, minute, second] = dateArr;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
  };

  // =========== 이벤트 핸들러 =========== 
  const handleSendToSupport = async (logId) => {
    try {
      const logToSend = logs.find(log => log.id === logId);
      if (!logToSend) {
        throw new Error('해당 로그를 찾을 수 없습니다.');
      }
  
      // 이메일 전송 시도
      const result = await errorEmailService.sendErrorLog(logToSend);
      
      // 성공 메시지
      alert(result.message || '에러 로그가 유지보수팀에게 전송되었습니다.');
      
    } catch (error) {
      console.error('Failed to send error log:', error);
      alert(error.message || '이메일 전송 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.');
    }
  };

  const handleExportLogs = async () => {
    try {
      setIsExporting(true);
      
      const exportData = filteredLogs.map(log => ({
        "Log No.": log.id,
        "에러명": log.errorname,
        "메시지": log.errormessage,
        "로그타입": log.errortype,
        "심각도": log.severitylevel,
        "URL": log.url,
        "사용자": log.userid || "미로그인",
        "브라우저": log.browser,
        "발생시각": formatDate(log.createdat)
      }));

      // UTF-8 BOM 추가
      const BOM = "\uFEFF";
      const headers = Object.keys(exportData[0]);
      
      const csvContent = BOM + 
        headers.join(',') + '\n' +
        exportData.map(row => 
          headers.map(header => 
            `"${row[header]?.toString().replace(/"/g, '""') || ''}"`)
          .join(',')
        ).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `error_logs_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('로그 내보내기에 실패했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  // =========== 필터링 로직 =========== 
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.errormessage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.errorname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.errortype?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(log.id).includes(searchTerm);

    const matchesLevel = selectedLevel === "all" || log.severitylevel === selectedLevel;
    
    return matchesSearch && matchesLevel;
  }).sort((a, b) => {
    const dateA = new Date(...a.createdat);
    const dateB = new Date(...b.createdat);
    return dateB - dateA;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 bg-red-50 px-4 py-3 rounded-lg shadow">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 컨트롤 섹션 */}
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 
                bg-white placeholder-gray-500 focus:outline-none focus:ring-2 
                focus:ring-blue-500 focus:border-transparent sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 필터 버튼 그룹 */}
          <div className="flex gap-2 flex-wrap">
            <FilterButton
              active={selectedLevel === "all"}
              onClick={() => setSelectedLevel("all")}
              type="all"
            >
              전체
            </FilterButton>
            <FilterButton
              active={selectedLevel === "error"}
              onClick={() => setSelectedLevel("error")}
              type="error"
            >
              에러
            </FilterButton>
            <FilterButton
              active={selectedLevel === "warning"}
              onClick={() => setSelectedLevel("warning")}
              type="warning"
            >
              경고
            </FilterButton>
            <FilterButton
              active={selectedLevel === "info"}
              onClick={() => setSelectedLevel("info")}
              type="info"
            >
              정보
            </FilterButton>
          </div>
        </div>

        {/* 내보내기 버튼 */}
        <button
          onClick={handleExportLogs}
          disabled={isExporting || filteredLogs.length === 0}
          className={`inline-flex items-center px-4 py-2 border border-transparent 
            rounded-md shadow-sm text-sm font-medium text-white 
            ${isExporting || filteredLogs.length === 0 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'}
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            transition-colors duration-200`}
        >
          <Download className={`w-4 h-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
          {isExporting ? '내보내는 중...' : '로그 내보내기'}
        </button>
      </div>

      {/* 에러 로그 리스트 */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-500 text-lg">
              표시할 에러 로그가 없습니다.
            </div>
            <div className="text-gray-400 text-sm mt-2">
              {searchTerm || selectedLevel !== 'all' 
                ? '필터 조건을 변경해보세요.' 
                : '새로운 에러 로그가 기록되면 여기에 표시됩니다.'}
            </div>
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

      {/* 요약 정보 */}
      {filteredLogs.length > 0 && (
        <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-sm text-gray-600">
          <div>
            총 <span className="font-medium">{filteredLogs.length}</span>개의 에러 로그
          </div>
          <div>
            마지막 업데이트: {formatDate(new Date().toISOString().split('T')[0].split('-').map(Number))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Errors;
