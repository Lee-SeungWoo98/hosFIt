import React, { useState, useEffect } from "react";
import axios from "axios";
import { useScores } from "../../../context/ScoreContext";
import {
  Save,
  Info,
  Bell,
  Hospital,
  Building,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

// 유지보수 담당자 정보 상수
const MAINTENANCE_CONTACT = {
  company: "hosFit Solutions Co., Ltd.",
  department: "의료정보시스템팀",
  name: "김유지",
  position: "수석 엔지니어",
  email: "maintenance@hosfit.co.kr",
  phone: "02-1234-5678",
  address: "서울특별시 강남구 테헤란로 123 호스핏빌딩 15층",
};

// 카드 형식 UI 컴포넌트
const SettingsCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
      <div className="flex">
        <Icon className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
        <h3 className="ml-3 text-lg font-medium text-gray-900">{title}</h3>
      </div>
    </div>
    <div className="px-4 py-3">{children}</div>
  </div>
);

// 가중치 설정 컴포넌트
const WeightSettings = ({ showNotification }) => {
  const { weights, updateWeights } = useScores();
  const [localWeights, setLocalWeights] = useState({
    level0: 0.7,
    level1: 0.4,
    level2: 0.2,
  });

  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const response = await axios.get('http://localhost:8082/boot/thresholds');
        const thresholds = response.data;
        const newWeights = {
          level0: thresholds['0'] || 0.7,
          level1: thresholds['1'] || 0.4,
          level2: thresholds['2'] || 0.2,
        };
        setLocalWeights(newWeights);
        updateWeights(newWeights);
      } catch (error) {
        console.error('가중치 로드 오류:', error);
        showNotification('가중치 로드 중 오류가 발생했습니다.', 'error');
      }
    };
    fetchWeights();
  }, [showNotification, updateWeights]);

  const handleWeightChange = (level, value) => {
    const numValue = Math.min(Math.max(parseFloat(value) || 0, 0.0), 1.0);
    setLocalWeights(prev => ({
      ...prev,
      [level]: numValue
    }));
  };

  const validateWeights = () => {
    if (localWeights.level2 > localWeights.level1 || localWeights.level1 > localWeights.level0) {
      showNotification(
        '가중치는 중증병동 > 일반병동 > 퇴원 순서로 설정되어야 합니다.',
        'error'
      );
      return false;
    }
    return true;
  };

  const handleWeightsSave = async () => {
    if (!validateWeights()) return;

    try {
      await Promise.all([
        axios.put(`http://localhost:8082/boot/thresholds/0?value=${localWeights.level0}`),
        axios.put(`http://localhost:8082/boot/thresholds/1?value=${localWeights.level1}`),
        axios.put(`http://localhost:8082/boot/thresholds/2?value=${localWeights.level2}`),
      ]);
      updateWeights(localWeights);
      showNotification('가중치 설정이 저장되었습니다.', 'success');
    } catch (error) {
      console.error('가중치 저장 오류:', error);
      showNotification('가중치 저장 중 오류가 발생했습니다.', 'error');
    }
  };

  return (
    <div className="space-y-3">
      <div className="mx-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                중증병동 가중치
              </label>
              <input
                type="number"
                value={localWeights.level0}
                onChange={(e) => handleWeightChange('level0', e.target.value)}
                step="0.1"
                min="0.0"
                max="1.0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                일반병동 가중치
              </label>
              <input
                type="number"
                value={localWeights.level1}
                onChange={(e) => handleWeightChange('level1', e.target.value)}
                step="0.1"
                min="0.0"
                max="1.0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                퇴원 가중치
              </label>
              <input
                type="number"
                value={localWeights.level2}
                onChange={(e) => handleWeightChange('level2', e.target.value)}
                step="0.1"
                min="0.0"
                max="1.0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex items-end lg:justify-end">
            <button
              onClick={handleWeightsSave}
              className="h-10 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="h-4 w-4 mr-2" />
              가중치 설정 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 병상 설정 컴포넌트
const BedSettings = ({ showNotification }) => {
  const [bedCapacity, setBedCapacity] = useState({
    totalBeds: 0,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchBedCount = async () => {
      try {
        console.log('Fetching bed count...');
        const response = await axios.get('http://localhost:8082/boot/count');
        console.log('Received bed count:', response.data);
        
        setBedCapacity(prev => ({
          ...prev,
          totalBeds: response.data,
          isLoading: false,
          error: null
        }));
      } catch (error) {
        console.error('병상 수 로드 오류:', error);
        setBedCapacity(prev => ({
          ...prev,
          isLoading: false,
          error: '데이터 로드 중 오류가 발생했습니다.'
        }));
        showNotification('병상 수 로드 중 오류가 발생했습니다.', 'error');
      }
    };

    fetchBedCount();
  }, [showNotification]);

  const handleBedCapacityChange = (value) => {
    const numValue = parseInt(value) || 0;
    setBedCapacity(prev => ({
      ...prev,
      totalBeds: numValue
    }));
  };

  const handleBedCapacitySave = async () => {
    try {
      if (bedCapacity.totalBeds < 1) {
        showNotification('병상 수는 1개 이상이어야 합니다.', 'error');
        return;
      }

      const response = await axios.put(
        'http://localhost:8082/boot/capacity', 
        { totalBeds: bedCapacity.totalBeds }
      );

      if (response.status === 200) {
        showNotification('병상 수 설정이 저장되었습니다.', 'success');
      }
    } catch (error) {
      console.error('병상 수 저장 오류:', error);
      showNotification('병상 수 저장 중 오류가 발생했습니다.', 'error');
    }
  };

  return (
    <div className="space-y-3">
      <div className="mx-6">
        {bedCapacity.error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {bedCapacity.error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            전체 병상 수
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              value={bedCapacity.isLoading ? '' : bedCapacity.totalBeds}
              onChange={(e) => handleBedCapacityChange(e.target.value)}
              disabled={bedCapacity.isLoading}
              placeholder={bedCapacity.isLoading ? "로딩 중..." : "병상 수 입력"}
              min="1"
              className="flex-1 h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleBedCapacitySave}
              disabled={bedCapacity.isLoading || bedCapacity.totalBeds < 1}
              className={`h-10 w-[180px] inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${bedCapacity.isLoading || bedCapacity.totalBeds < 1
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
            >
              {bedCapacity.isLoading ? (
                <span>로딩 중...</span>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  병상 수 저장
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings 메인 컴포넌트
const Settings = ({ showNotification }) => {
  return (
    <div className="p-4 space-y-4">
      <SettingsCard title="가중치 설정" icon={Save}>
        <WeightSettings showNotification={showNotification} />
      </SettingsCard>

      <SettingsCard title="병상 설정" icon={Hospital}>
        <BedSettings showNotification={showNotification} />
      </SettingsCard>

      <SettingsCard title="유지보수 담당자 정보" icon={Bell}>
        <div className="mx-6">
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex">
              <Building className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
              <div className="ml-3">
                <p className="font-medium text-gray-900">
                  {MAINTENANCE_CONTACT.company}
                </p>
                <p className="text-sm text-gray-500">
                  {MAINTENANCE_CONTACT.department}
                </p>
              </div>
            </div>
            <div className="flex">
              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-gray-400 mt-1">
                👤
              </span>
              <div className="ml-3">
                <p className="font-medium text-gray-900">
                  {MAINTENANCE_CONTACT.name}
                </p>
                <p className="text-sm text-gray-500">
                  {MAINTENANCE_CONTACT.position}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
              <p className="ml-3 text-gray-600">{MAINTENANCE_CONTACT.phone}</p>
            </div>
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
              <p className="ml-3 text-gray-600">{MAINTENANCE_CONTACT.email}</p>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
              <p className="ml-3 text-gray-600">
                {MAINTENANCE_CONTACT.address}
              </p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 bg-yellow-50 p-3 rounded-md flex items-start">
            <Info className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
            <p className="ml-2">
              유지보수 담당자 정보는 시스템 관리자만 수정할 수 있습니다.
              <br />
              정보 수정이 필요한 경우 시스템 관리자에게 문의해 주세요.
            </p>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};

export default Settings;