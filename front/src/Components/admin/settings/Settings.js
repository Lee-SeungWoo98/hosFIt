import React, { useState } from 'react';
import { Save, Info, Bell, Hospital, Building, Phone, Mail, MapPin } from 'lucide-react';
import axios from 'axios';

// 유지보수 담당자 정보 하드코딩
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
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Settings = ({ showNotification }) => {
   // 가중치 설정 상태 - 테스트용 초기값
  const [weights, setWeights] = useState({
    discharge: 0.5,  // 퇴원 가중치 테스트값
    ward: 0.6,  // 일반병동 가중치 테스트값
    icu: 0.7  // 중환자실 가중치 테스트값
  });
  
  // 병상 설정 상태
  const [bedCapacity, setBedCapacity] = useState({
    totalBeds: 48,
    criticalBeds: 10,
    regularBeds: 38
  });

  // 알림 설정 상태
 
  // 가중치 변경 핸들러 
 const handleWeightChange = (type, value) => {
    const numValue = Math.min(Math.max(parseFloat(value) || 0, 0.0), 0.9);
    setWeights(prev => ({
      ...prev,
      [type]: numValue
    }));
  };

  // 병상 수 변경 핸들러
  const handleBedCapacityChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    setBedCapacity(prev => {
      const newState = { ...prev, [field]: numValue };
      if (field === 'totalBeds') {
        const ratio = prev.criticalBeds / (prev.criticalBeds + prev.regularBeds);
        newState.criticalBeds = Math.round(numValue * ratio);
        newState.regularBeds = numValue - newState.criticalBeds;
      }
      return newState;
    });
  };

  // 설정 유효성 검사
  const validateSettings = () => {
    // 가중치 검증
    if (weights.icu < weights.ward || weights.ward < weights.discharge) {
      showNotification('가중치는 중환자실 > 일반병동 > 퇴원 순서로 설정되어야 합니다.', 'error');
      return false;
    }

    if (weights.icu > 0.9 || weights.ward > 0.9 || weights.discharge > 0.9) {
      showNotification('가중치는 0.9를 초과할 수 없습니다.', 'error');
      return false;
    }


    // 병상 수 검증
    if (bedCapacity.totalBeds <= 0) {
      showNotification('전체 병상 수는 0보다 커야 합니다.', 'error');
      return false;
    }

    return true;
  };

  const handleWeightsSave = async () => {
    if (!validateSettings()) return;
    
    try {
      const requests = [
        { key: '0', value: weights.discharge }, // 퇴원
        { key: '1', value: weights.ward },      // 일반병동
        { key: '2', value: weights.icu }        // 중환자실
      ];
  
      for (const { key, value } of requests) {
        await axios.put(`http://localhost:8082/boot/thresholds/${key}`, null, {
          params: { value: value }
        });
      }
        
      showNotification('가중치 설정이 저장되었습니다.', 'success');
    } catch (error) {
      console.error('가중치 저장 오류:', error);
      showNotification('가중치 저장 중 오류가 발생했습니다.', 'error');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 가중치 설정 섹션 */}
      <SettingsCard title="가중치 설정" icon={Save}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 퇴원 가중치 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">퇴원 가중치</label>
              <input
                type="number"
                value={weights.discharge}
                onChange={(e) => handleWeightChange('discharge', e.target.value)}
                step="0.1"
                min="0.0"
                max="0.9"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* 일반병동 가중치 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">일반병동 가중치</label>
              <input
                type="number"
                value={weights.ward}
                onChange={(e) => handleWeightChange('ward', e.target.value)}
                step="0.1"
                min="0.0"
                max="0.9"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* 중환자실 가중치 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">중환자실 가중치</label>
              <input
                type="number"
                value={weights.icu}
                onChange={(e) => handleWeightChange('icu', e.target.value)}
                step="0.1"
                min="0.0"
                max="0.9"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* 가중치 설정 안내 */}
          <div className="mt-4 text-sm text-gray-500 bg-blue-50 p-4 rounded-md flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <p>
              각 영역별 가중치 값은 현재 DB에 저장된 값입니다.
              <br /><br />
              <span className="font-medium">- 가중치 범위: 0.0 ~ 0.9</span>
              <br />
              <span className="font-medium">- 저장 버튼을 클릭해야 변경사항이 적용됩니다.</span>
            </p>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleWeightsSave}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="h-4 w-4 mr-2" />
              가중치 설정 저장
            </button>
          </div>
        </div>
      </SettingsCard>

      {/* 병상 설정 */}
      <SettingsCard title="병상 설정" icon={Hospital}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">전체 병상 수</label>
              <input
                type="number"
                value={bedCapacity.totalBeds}
                onChange={(e) => handleBedCapacityChange('totalBeds', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* 유지보수 담당자 정보 */}
      <SettingsCard title="유지보수 담당자 정보" icon={Bell}>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="space-y-4">
            {/* 회사 정보 */}
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{MAINTENANCE_CONTACT.company}</p>
                <p className="text-sm text-gray-500">{MAINTENANCE_CONTACT.department}</p>
              </div>
            </div>

            {/* 담당자 정보 */}
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 flex justify-center text-gray-400">👤</div>
              <div>
                <p className="font-medium text-gray-900">{MAINTENANCE_CONTACT.name}</p>
                <p className="text-sm text-gray-500">{MAINTENANCE_CONTACT.position}</p>
              </div>
            </div>

            {/* 연락처 정보 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-400" />
                <p className="text-gray-600">{MAINTENANCE_CONTACT.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-400" />
                <p className="text-gray-600">{MAINTENANCE_CONTACT.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <p className="text-gray-600">{MAINTENANCE_CONTACT.address}</p>
              </div>
            </div>
          </div>

          {/* 알림 메시지 */}
          <div className="mt-6 text-sm text-gray-500 bg-yellow-50 p-4 rounded-md flex items-start gap-2">
            <Info className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <p>
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