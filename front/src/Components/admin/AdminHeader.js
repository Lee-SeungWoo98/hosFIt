import React from 'react';
import { RefreshCw } from 'lucide-react';

const AdminHeader = ({ title, lastUpdated, onRefresh }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {title}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          마지막 업데이트: {lastUpdated}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          새로고침
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;