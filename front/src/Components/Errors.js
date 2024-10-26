import React, { useState } from 'react';
import { Search, Download, Bell, MessageSquare } from 'lucide-react';
import './styles/Errors.css';

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
    // 로그 내보내기 로직
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
    // 유지보수 팀 전송 로직
    console.log('Send to support:', errorId);
  };

  const handleMarkResolved = (errorId) => {
    // 해결 표시 로직
    console.log('Mark as resolved:', errorId);
  };

  const filteredLogs = errorLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || log.type === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="errors-page">
      <div className="error-controls">
        <div className="error-filters">
          <div className="search-box">
            <Search className="icon" />
            <input
              type="text"
              placeholder="로그 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="level-filter">
            <button
              className={selectedLevel === 'all' ? 'active' : ''}
              onClick={() => setSelectedLevel('all')}
            >
              전체 레벨
            </button>
            <button
              className={selectedLevel === 'error' ? 'active' : ''}
              onClick={() => setSelectedLevel('error')}
            >
              에러
            </button>
            <button
              className={selectedLevel === 'warning' ? 'active' : ''}
              onClick={() => setSelectedLevel('warning')}
            >
              경고
            </button>
            <button
              className={selectedLevel === 'info' ? 'active' : ''}
              onClick={() => setSelectedLevel('info')}
            >
              정보
            </button>
          </div>
        </div>

        <button className="export-btn" onClick={handleExportLogs}>
          <Download className="icon" />
          로그 내보내기
        </button>
      </div>

      <div id="errorLogs" className="error-list">
        {filteredLogs.map((log) => (
          <div key={log.id} className={`error-item ${log.type}`}>
            <div className="error-header">
              <div className="error-info">
                <span className="error-time">{log.timestamp}</span>
                <span className={`error-type ${log.type}`}>{log.type}</span>
                <span className="error-id">{log.id}</span>
              </div>
              <div className={`error-status ${log.status}`}>
                <span className="status-dot"></span>
                {log.status === 'resolved' ? '해결됨' : '미해결'}
              </div>
            </div>

            <div className="error-content">
              <div className="error-message">{log.message}</div>
              <div className="error-details">
                <pre>{log.details}</pre>
              </div>
            </div>

            <div className="error-actions">
              {log.status === 'unresolved' && (
                <button
                  className="resolve-btn"
                  onClick={() => handleMarkResolved(log.id)}
                >
                  해결 표시
                </button>
              )}
              <button
                className="support-btn"
                onClick={() => handleSendToSupport(log.id)}
              >
                <MessageSquare className="icon" />
                유지보수 팀에 전송
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="error-pagination">
        <button className="prev-btn" disabled>이전</button>
        <span className="pagination-info">1-2 / 총 2개</span>
        <button className="next-btn" disabled>다음</button>
      </div>
    </div>
  );
};

export default Errors;