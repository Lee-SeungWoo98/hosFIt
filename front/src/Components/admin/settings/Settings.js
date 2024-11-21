import React, { useState, useEffect } from "react";
import axios from "axios";
import { Save, Info, Bell, Hospital, Building, Phone, Mail, MapPin } from "lucide-react";

const MAINTENANCE_CONTACT = {
  company: "hosFit Solutions Co., Ltd.",
  department: "의료정보시스템팀",
  name: "김유지",
  position: "수석 엔지니어",
  email: "maintenance@hosfit.co.kr",
  phone: "02-1234-5678",
  address: "서울특별시 강남구 테헤란로 123 호스핏빌딩 15층",
};

const SettingsBox = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);

const WeightSettings = ({ showNotification }) => {
  const [weights, setWeights] = useState({ level0: 0.7, level1: 0.4, level2: 0.3 });

  const handleWeightChange = (level, value) => {
    const numValue = Math.min(Math.max(parseFloat(value) || 0, 0.0), 1.0);
    setWeights((prev) => ({ ...prev, [level]: numValue }));
  };

  const handleSaveWeights = async () => {
    if (weights.level2 > weights.level1 || weights.level1 > weights.level0) {
      showNotification(
        "가중치는 중증병동 > 일반병동 > 퇴원 순서로 설정되어야 합니다.",
        "error"
      );
      return;
    }

    try {
      await axios.put("/api/weights", weights);
      showNotification("가중치 설정이 저장되었습니다.", "success");
    } catch (error) {
      console.error("가중치 저장 오류:", error);
      showNotification("가중치 저장 중 오류가 발생했습니다.", "error");
    }
  };

  return (
    <SettingsBox title="가중치 설정">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            중증병동 가중치
          </label>
          <input
            type="number"
            value={weights.level0}
            onChange={(e) => handleWeightChange("level0", e.target.value)}
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
            value={weights.level1}
            onChange={(e) => handleWeightChange("level1", e.target.value)}
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
            value={weights.level2}
            onChange={(e) => handleWeightChange("level2", e.target.value)}
            step="0.1"
            min="0.0"
            max="1.0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-500 bg-yellow-50 p-3 rounded-md flex items-start">
        <Info className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
        <p className="ml-6">
          가중치는 중증병동 > 일반병동 > 퇴원 순서로 설정해야 합니다.
          <br />
          올바르게 설정되었는지 확인 후 저장해 주세요.
        </p>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSaveWeights}
          className="h-10 px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save className="h-4 w-4 mr-2" />
          가중치 설정 저장
        </button>
      </div>
    </SettingsBox>
  );
};

const BedSettings = ({ showNotification }) => {
  const [bedCapacity, setBedCapacity] = useState(25);

  const handleSaveBeds = async () => {
    if (bedCapacity < 1) {
      showNotification("병상 수는 1개 이상이어야 합니다.", "error");
      return;
    }

    try {
      await axios.put("/api/beds/update", { totalBeds: bedCapacity });
      showNotification("병상 수 설정이 저장되었습니다.", "success");
    } catch (error) {
      console.error("병상 수 저장 오류:", error);
      showNotification("병상 수 저장 중 오류가 발생했습니다.", "error");
    }
  };

  return (
    <SettingsBox title="병상 설정">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          전체 병상 수
        </label>
        <input
          type="number"
          value={bedCapacity}
          onChange={(e) => setBedCapacity(parseInt(e.target.value) || 0)}
          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          min="1"
        />
      </div>
      <div className="mt-4 text-sm text-gray-500 bg-yellow-50 p-3 rounded-md flex items-start">
        <Info className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
        <p className="ml-6">
          병상 수는 1개 이상이어야 하며, 설정한 병상 수는 전체 시스템에 적용됩니다.
          <br />
          저장 후 시스템의 병상 정보를 다시 확인해 주세요.
        </p>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSaveBeds}
          className="h-10 px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save className="h-4 w-4 mr-2" />
          병상 설정 저장
        </button>
      </div>
    </SettingsBox>
  );
};

const MaintenanceInfo = () => (
  <SettingsBox title="유지보수 담당자 정보">
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
      <div className="flex">
        <Building className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
        <div className="ml-3">
          <p className="font-medium text-gray-900">{MAINTENANCE_CONTACT.company}</p>
          <p className="text-sm text-gray-500">{MAINTENANCE_CONTACT.department}</p>
        </div>
      </div>
      <div className="flex">
        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-gray-400 mt-1">
          👤
        </span>
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
      <p className="ml-6">
        유지보수 담당자 정보는 시스템 관리자만 수정할 수 있습니다.
        <br />
        정보 수정이 필요한 경우 시스템 관리자에게 문의해 주세요.
      </p>
    </div>
  </SettingsBox>
);

const Settings = ({ showNotification }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeightSettings showNotification={showNotification} />
        <BedSettings showNotification={showNotification} />
      </div>
      <MaintenanceInfo />
    </div>
  );
};

export default Settings;
