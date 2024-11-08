import React from 'react';
import { MessageSquare, AlertCircle, Globe, User, Chrome, Clock, XCircle, CheckCircle } from 'lucide-react';

const ErrorCard = ({ error, onSendToSupport }) => {
  const typeColors = {
    error: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    info: "bg-blue-100 text-blue-800 border-blue-200"
  };

  const formatDate = (dateArr) => {
    const [year, month, day, hour, minute, second] = dateArr;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Icon className="w-4 h-4" />
      <span className="font-medium">{label}:</span>
      <span>{value}</span>
    </div>
  );

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${typeColors[error.severitylevel]}`}>
      {/* Header Section */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[error.severitylevel]}`}>
              {error.severitylevel.toUpperCase()}
            </span>
            <h3 className="text-lg font-semibold text-gray-900">{error.errorname}</h3>
          </div>
          <div className="flex items-center gap-2">
            {error.isresolved ? 
              <CheckCircle className="w-5 h-5 text-green-500" /> : 
              <XCircle className="w-5 h-5 text-red-500" />
            }
            {/* <span className="text-sm font-medium">
              {error.isresolved ? "해결됨" : "미해결"}
            </span> */}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoRow icon={AlertCircle} label="Error ID" value={error.id} />
          <InfoRow icon={Clock} label="발생시각" value={formatDate(error.createdat)} />
          <InfoRow icon={AlertCircle} label="에러타입" value={error.errortype} />
          <InfoRow icon={User} label="사용자" value={error.userid || "미로그인"} />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Error Message */}
        <div className="bg-red-50 border border-red-100 rounded-md p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">에러 메시지</h4>
          <p className="text-red-800">{error.errormessage}</p>
        </div>

        {/* Stack Trace */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">스택 트레이스</h4>
          <pre className="bg-gray-50 rounded-md p-4 font-mono text-sm text-gray-600 whitespace-pre-wrap overflow-x-auto">
            {error.errorstack}
          </pre>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <InfoRow icon={Globe} label="URL" value={error.url} />
          <InfoRow icon={Chrome} label="브라우저" value={error.browser} />
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
        <button
          onClick={() => onSendToSupport(error.id)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          유지보수 팀에 전송
        </button>
      </div>
    </div>
  );
};

export default ErrorCard;