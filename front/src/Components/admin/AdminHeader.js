import React from 'react';
import { RefreshCw } from 'lucide-react';

const AdminHeader = ({ title, lastUpdated, onRefresh }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {title}
        </h1>
        
      </div>
   
    </div>
  );
};

export default AdminHeader;