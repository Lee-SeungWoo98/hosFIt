import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Info, Bell, Hospital, Building, Phone, Mail, MapPin } from 'lucide-react';

const MAINTENANCE_CONTACT = {
  company: 'hosFit Solutions Co., Ltd.',
  department: '의료정보시스템팀',
  name: '김유지',
  position: '수석 엔지니어',
  email: 'maintenance@hosfit.co.kr',
  phone: '02-1234-5678',
  address: '서울특별시 강남구 테헤란로 123 호스핏빌딩 15층'
};

const SettingsCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
    </div>
    <div className="px-4 py-3">{children}</div>
  </div>
);

const WeightSettings = ({ showNotification }) => {
  const [weights, setWeights] = useState({
    discharge: 0.5,
    ward: 0.6,
    icu: 0.7
  });

  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const response = await axios.get('http://localhost:8082/boot/thresholds/display');
        const thresholds = response.data;
        setWeights({
          discharge: thresholds.find(t => t.key === 'DISCHARGE')?.value ?? 0.5,
          ward: thresholds.find(t => t.key === 'WARD')?.value ?? 0.6,
          icu: thresholds.find(t => t.key === 'ICU')?.value ?? 0.7
        });
      } catch (error) {
        console.error('가중치 로드 오류:', error);
        showNotification('가중치 로드 중 오류가 발생했습니다.', 'error');
      }
    };
    fetchWeights();
  }, [showNotification]);

  const handleWeightChange = (type, value) => {
    const numValue = Math.min(Math.max(parseFloat(value) || 0, 0.0), 0.9);
    setWeights(prev => ({
      ...prev,
      [type]: numValue
    }));
  };

  const validateWeights = () => {
    if (weights.discharge > weights.ward || weights.ward > weights.icu) {
      showNotification('가중치는 중환자실 > 일반병동 > 퇴원 순서로 설정되어야 합니다.', 'error');
      return false;
    }
    if (Object.values(weights).some(w => w > 0.9 || w < 0)) {
      showNotification('가중치는 0.0에서 0.9 사이의 값이어야 합니다.', 'error');
      return false;
    }
    return true;
  };

  const handleWeightsSave = async () => {
    if (!validateWeights()) return;
    try {
      await Promise.all([
        axios.put('http://localhost:8082/boot/thresholds/DISCHARGE', { value: weights.discharge }),
        axios.put('http://localhost:8082/boot/thresholds/WARD', { value: weights.ward }),
        axios.put('http://localhost:8082/boot/thresholds/ICU', { value: weights.icu })
      ]);
      showNotification('가중치 설정이 저장되었습니다.', 'success');
    } catch (error) {
      console.error('가중치 저장 오류:', error);
      showNotification('가중치 저장 중 오류가 발생했습니다.', 'error');
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">퇴원</label>
          <input
            type="number"
            value={weights.discharge}
            onChange={(e) => handleWeightChange('discharge', e.target.value)}
            step="0.1"
            min="0.0"
            max="0.9"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">일반병동</label>
          <input
            type="number"
            value={weights.ward}
            onChange={(e) => handleWeightChange('ward', e.target.value)}
            step="0.1"
            min="0.0"
            max="0.9"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">중증병동</label>
          <input
            type="number"
            value={weights.icu}
            onChange={(e) => handleWeightChange('icu', e.target.value)}
            step="0.1"
            min="0.0"
            max="0.9"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="mt-2 text-sm text-gray-500 bg-blue-50 p-3 rounded-md flex items-start gap-2">
        <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
        <p>
          각 영역별 가중치 값은 현재 DB에 저장된 값입니다.
          <br /><br />
          <span className="font-medium">- 가중치 범위: 0.0 ~ 0.9</span>
          <br />
          <span className="font-medium">- 저장 버튼을 클릭해야 변경사항이 적용됩니다.</span>
        </p>
      </div>

      <div className="flex justify-end mt-3">
        <button
          onClick={handleWeightsSave}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save className="h-4 w-4 mr-2" />
          가중치 설정 저장
        </button>
      </div>
    </div>
  );
};

const BedSettings = ({ showNotification }) => {
  const [bedCapacity, setBedCapacity] = useState({
    totalBeds: 48
  });

  const handleBedCapacityChange = (value) => {
    const numValue = parseInt(value) || 0;
    setBedCapacity({ totalBeds: numValue });
  };

  const handleBedCapacitySave = async () => {
    try {
      // API 엔드포인트는 실제 환경에 맞게 수정하세요
      await axios.put('http://localhost:8082/boot/beds/capacity', bedCapacity);
      showNotification('병상 수 설정이 저장되었습니다.', 'success');
    } catch (error) {
      console.error('병상 수 저장 오류:', error);
      showNotification('병상 수 저장 중 오류가 발생했습니다.', 'error');
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">전체 병상 수</label>
        <div className="flex gap-3">
          <input
            type="number"
            value={bedCapacity.totalBeds}
            onChange={(e) => handleBedCapacityChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <button
            onClick={handleBedCapacitySave}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save className="h-4 w-4 mr-2" />
            병상 수 저장
          </button>
        </div>
      </div>
    </div>
  );
};

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
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-4">
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
      </SettingsCard>
    </div>
  );
};

export default Settings;