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

// 카드 컴포넌트
const SettingsCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
    </div>
    <div className="px-4 py-3">{children}</div>
  </div>
);

// 가중치 설정 컴포넌트
const WeightSettings = ({ showNotification }) => {
  const { weights, updateWeights } = useScores();
  const [localWeights, setLocalWeights] = useState({
    icu: 0.7,
    ward: 0.4,
    discharge: 0.2
  });
  const [isSaving, setIsSaving] = useState(false);
  // 백엔드 API 엔드포인트 상수

  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const response = await axios.get('http://localhost:8082/boot/api/thresholds');
        if (response.data) {
          const newWeights = {
            icu: response.data['0'] || 0.7,
            ward: response.data['1'] || 0.4,
            discharge: response.data['2'] || 0.2
          };
          setLocalWeights(newWeights);
          updateWeights(newWeights);
          console.log('Fetched weights:', newWeights);
        }
      } catch (error) {
        console.error('Error loading weights:', error);
        showNotification('가중치 로드 중 오류가 발생했습니다.', 'error');
      }
    };

    fetchWeights();
  }, [showNotification, updateWeights]);

  const handleWeightChange = (type, value) => {
    const numValue = Math.min(Math.max(parseFloat(value) || 0, 0), 0.9);
    setLocalWeights(prev => ({
      ...prev,
      [type]: numValue
    }));
  };

  const validateWeights = () => {
    if (localWeights.discharge > localWeights.ward || localWeights.ward > localWeights.icu) {
      showNotification(
        '가중치는 중증병동 > 일반병동 > 퇴원 순서로 설정되어야 합니다.',
        'error'
      );
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateWeights()) return;

    setIsSaving(true);
    try {
      // 백엔드 API의 key 매핑
      const keyMapping = {
        icu: '0',
        ward: '1',
        discharge: '2'
      };

      // 각 가중치 개별적으로 업데이트
      const updatePromises = Object.entries(localWeights).map(([type, value]) => {
        const key = keyMapping[type];
        return axios.put(`http://localhost:8082/boot/api/thresholds/${key}`, null, {
          params: { value }
        });
      });

      await Promise.all(updatePromises);
      
      // ScoreContext 업데이트
      updateWeights(localWeights);
      console.log('Updated weights:', localWeights);
      
      showNotification('가중치 설정이 저장되었습니다.', 'success');
    } catch (error) {
      console.error('Error saving weights:', error);
      showNotification('가중치 저장 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries({
          icu: '중증병동',
          ward: '일반병동',
          discharge: '퇴원'
        }).map(([type, label]) => (
          <div key={type}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label} 가중치
            </label>
            <input
              type="number"
              value={localWeights[type]}
              onChange={(e) => handleWeightChange(type, e.target.value)}
              step="0.1"
              min="0"
              max="0.9"
              disabled={isSaving}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  );
};

// 병상 설정 컴포넌트
const BedSettings = ({ showNotification }) => {
  const [bedCount, setBedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchBedCount = async () => {
      try {
        const response = await axios.get('http://localhost:8082/boot/count');
        setBedCount(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading bed count:', error);
        showNotification('병상 수 로드 중 오류가 발생했습니다.', 'error');
        setIsLoading(false);
      }
    };

    fetchBedCount();
  }, [showNotification]);

  const handleBedCountChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setBedCount(Math.max(0, value));
  };

  const handleSave = async () => {
    if (bedCount < 1) {
      showNotification('병상 수는 1개 이상이어야 합니다.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await axios.put('http://localhost:8082/boot/beds/update', {
        totalBeds: bedCount,
        lastUpdatedBy: 'admin'  // BedInfo 엔티티의 필드명과 일치하도록 수정
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      showNotification('병상 수가 업데이트되었습니다.', 'success');
    } catch (error) {
      console.error('Error saving bed count:', error);
      const errorMessage = error.response?.data?.message || '병상 수 저장 중 오류가 발생했습니다.';
      showNotification(errorMessage, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-grow">
          <input
            type="number"
            value={bedCount}
            onChange={handleBedCountChange}
            min="1"
            disabled={isLoading || isSaving}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder={isLoading ? "로딩 중..." : "병상 수 입력"}
          />
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading || isSaving || bedCount < 1}
          className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200
            ${(isLoading || isSaving || bedCount < 1)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
           <Save className="h-4 w-4 mr-2" />
          {isSaving ? '저장 중...' : '저장'}
        </button>
      </div>
      {bedCount < 1 && (
        <p className="text-sm text-red-500">
          병상 수는 1개 이상이어야 합니다.
        </p>
      )}
    </div>
  );
};
// 유지보수 정보 컴포넌트
const MaintenanceInfo = () => (
  <div className="mx-6">
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
      <div className="flex">
        <Building className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
        <div className="ml-3">
          <p className="font-medium text-gray-900">{MAINTENANCE_CONTACT.company}</p>
          <p className="text-sm text-gray-500">{MAINTENANCE_CONTACT.department}</p>
        </div>
      </div>
      <div className="flex">
        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-gray-400 mt-1">👤</span>
        <div className="ml-3">
          <p className="font-medium text-gray-900">{MAINTENANCE_CONTACT.name}</p>
          <p className="text-sm text-gray-500">{MAINTENANCE_CONTACT.position}</p>
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
        <p className="ml-3 text-gray-600">{MAINTENANCE_CONTACT.address}</p>
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
);

// Settings 메인 컴포넌트
const Settings = ({ showNotification }) => {
  return (
    <div className="p-6 space-y-6">
      <SettingsCard title="가중치 설정" icon={Save}>
        <WeightSettings showNotification={showNotification} />
      </SettingsCard>

      <SettingsCard title="병상 설정" icon={Hospital}>
        <BedSettings showNotification={showNotification} />
      </SettingsCard>

      <SettingsCard title="유지보수 담당자 정보" icon={Bell}>
        <MaintenanceInfo />
      </SettingsCard>
    </div>
  );
};

export default Settings;