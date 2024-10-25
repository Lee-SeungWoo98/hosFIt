import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Settings, 
  Users, 
  BarChart2, 
  AlertTriangle,
  Grid,
  RefreshCw,
  Download,
  Edit2,
  Key,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie
} from 'recharts';

// App Component
const AdminAPP = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <MainContent activeTab={activeTab} loading={loading} />
    </div>
  );
};

// Sidebar Component 
const Sidebar = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', icon: <Grid size={19} />, label: '대시보드' },
    { id: 'model', icon: <Settings size={19} />, label: 'AI 모델 관리' },
    { id: 'staff', icon: <Users size={19} />, label: '의료진 관리' },
    { id: 'stats', icon: <BarChart2 size={19} />, label: '통계 분석' },
    { id: 'errors', icon: <AlertTriangle size={19} />, label: '에러 로그' },
    { id: 'settings', icon: <Settings size={19} />, label: '설정' }
  ];

  return (
    <div className="w-72 bg-white shadow-md fixed h-full p-8">
      <div className="pb-8 border-b">
        <h2 className="text-xl font-semibold text-blue-600">응급실 관리자</h2>
        <div className="mt-2 space-y-1">
          <div className="font-medium">홍길동</div>
          <div className="text-sm text-gray-500">시스템 관리자</div>
        </div>
      </div>
      
      <nav className="mt-8">
        <ul className="space-y-2">
          {navItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-4">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

// Dashboard Stats Card Component
const StatsCard = ({ title, value, trend, trendValue, subText }) => {
  return (
    <Card className="hover:translate-y-[-2px] transition-transform">
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        {trend && (
          <div className={`flex items-center text-sm font-medium px-2 py-1 rounded ${
            trend === 'up' 
              ? 'text-green-600 bg-green-50' 
              : 'text-red-600 bg-red-50'
          }`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold my-2">{value}</div>
        <div className="text-sm text-gray-500">{subText}</div>
      </CardContent>
    </Card>
  );
};

// Main Content Component 
const MainContent = ({ activeTab, loading }) => {
  const monthlyData = [
    { month: '1월', rate: 15.2 },
    { month: '2월', rate: 14.8 },
    // ... more data
  ];

  const distributionData = [
    { name: 'ICU', value: 30 },
    { name: 'Ward', value: 25 },
    { name: 'Discharge', value: 35 }
  ];

  return (
    <div className="flex-1 ml-72 p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2">대시보드</h1>
          <div className="text-sm text-gray-500">마지막 업데이트: 2024-10-25 10:30:00</div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
          <RefreshCw size={16} />
          새로고침
        </button>
      </header>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6">
            <StatsCard 
              title="모델 정확도"
              value="94.5%"
              trend="up"
              trendValue="1.2%"
              subText="최근 30일"
            />
            <StatsCard
              title="ICU 입실률"
              value="15.2%"
              trend="down"
              trendValue="0.8%"
              subText="목표: 20%"
            />
            <StatsCard
              title="총 예측 건수"
              value="2,480"
              trend="up"
              trendValue="12.5%"
              subText="이번 달"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>월별 입실 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart width={500} height={300} data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#2563eb" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>병동별 분포</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <PieChart width={400} height={300}>
                    <Pie
                      data={distributionData}
                      cx={200}
                      cy={150}
                      innerRadius={60}
                      outerRadius={80}
                      fill="#2563eb"
                      dataKey="value"
                    />
                    <Tooltip />
                  </PieChart>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAPP;
