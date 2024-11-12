// ErrorCard.js
import React from 'react';
import { Search } from 'lucide-react';

/**
 * 에러 로그 카드 컴포넌트
 * 각 에러 로그의 세부 정보를 표시하는 카드형 UI
 * 
 * @param {Object} log - 에러 로그 데이터
 * @param {Function} onSendToSupport - 이메일 전송 핸들러 함수
 */
const ErrorCard = ({ log, onSendToSupport }) => {
  // 로그 레벨별 스타일 정의
  const typeColors = {
    error: {
      border: "border-red-200",
      bg: "bg-red-50",
      text: "text-red-800",
      badge: "bg-red-100"
    },
    warning: {
      border: "border-yellow-200",
      bg: "bg-yellow-50",
      text: "text-yellow-800",
      badge: "bg-yellow-100"
    },
    info: {
      border: "border-blue-200",
      bg: "bg-blue-50",
      text: "text-blue-800",
      badge: "bg-blue-100"
    }
  };

  // 로그 레벨 한글 매핑
  const levelText = {
    error: "에러",
    warning: "경고",
    info: "정보"
  };

  const colors = typeColors[log.severitylevel];

  /**
   * 날짜 배열을 포맷팅된 문자열로 변환
   * @param {Array} dateArr - [년, 월, 일, 시, 분, 초] 형태의 배열
   * @returns {string} "YYYY-MM-DD HH:mm:ss" 형태의 문자열
   */
  const formatDate = (dateArr) => {
    const [year, month, day, hour, minute, second] = dateArr;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
  };

  /**
   * 정보 행 컴포넌트
   * 아이콘과 함께 레이블-값 쌍을 표시
   */
  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Icon className="w-4 h-4" />
      <span className="font-medium">{label}:</span>
      <span>{value}</span>
    </div>
  );

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${colors.border}`}>
      {/* 헤더 섹션 */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors.badge} ${colors.text}`}>
              {levelText[log.severitylevel]}
            </span>
            <h3 className="text-lg font-semibold text-gray-900">{log.errorname}</h3>
          </div>
        </div>
        {/* 기본 정보 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoRow icon={Search} label="Log No." value={log.id} />
          <InfoRow icon={Search} label="발생시각" value={formatDate(log.createdat)} />
          <InfoRow icon={Search} label="로그타입" value={log.errortype} />
          <InfoRow icon={Search} label="사용자" value={log.userid || "미로그인"} />
        </div>
      </div>

      {/* 로그 상세 정보 섹션 */}
      <div className="p-6 space-y-4">
        {/* 로그 메시지 */}
        <div className={`border rounded-md p-4 ${colors.bg} ${colors.border}`}>
          <h4 className="text-sm font-medium text-gray-900 mb-2">로그 메시지</h4>
          <p className={colors.text}>{log.errormessage}</p>
        </div>

        {/* 스택 트레이스 */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">스택 트레이스</h4>
          <pre className="bg-gray-50 rounded-md p-4 font-mono text-sm text-gray-600 whitespace-pre-wrap overflow-x-auto">
            {log.errorstack}
          </pre>
        </div>

        {/* 추가 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <InfoRow icon={Search} label="URL" value={log.url} />
          <InfoRow icon={Search} label="브라우저" value={log.browser} />
        </div>
      </div>

      {/* 액션 버튼 섹션 */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
        <button
          onClick={() => onSendToSupport(log.id)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          로그 기록 메일 전송
        </button>
      </div>
    </div>
  );
};

export default ErrorCard;
