import React, { useState, useEffect } from "react";
import axios from "axios";
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
// 카드 형식 UI 컴포넌트 (공통 컴포넌트)
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
// 가중치 설정 관련 컴포넌트
const WeightSettings = ({ showNotification }) => {
  const [weights, setWeights] = useState({
    discharge: 0.5,
    ward: 0.6,
    icu: 0.7,
  });
  // 가중치 상태 관리 및 초기 값 로드
  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8082/boot/thresholds/display"
        );
        const thresholds = response.data;
        setWeights({
          discharge:
            thresholds.find((t) => t.key === "DISCHARGE")?.value ?? 0.5,
          ward: thresholds.find((t) => t.key === "WARD")?.value ?? 0.6,
          icu: thresholds.find((t) => t.key === "ICU")?.value ?? 0.7,
        });
      } catch (error) {
        console.error("가중치 로드 오류:", error);
        showNotification("가중치 로드 중 오류가 발생했습니다.", "error");
      }
    };
    fetchWeights();
  }, [showNotification]);
  // 가중치 유효성 검사 및 저장 로직
  const handleWeightChange = (type, value) => {
    const numValue = Math.min(Math.max(parseFloat(value) || 0, 0.0), 0.9);
    setWeights((prev) => ({
      ...prev,
      [type]: numValue,
    }));
  };

  const validateWeights = () => {
    if (weights.discharge > weights.ward || weights.ward > weights.icu) {
      showNotification(
        "가중치는 중증병동 > 일반병동 > 퇴원 순서로 설정되어야 합니다.",
        "error"
      );
      return false;
    }
    if (Object.values(weights).some((w) => w > 0.9 || w < 0)) {
      showNotification("가중치는 0.0에서 0.9 사이의 값이어야 합니다.", "error");
      return false;
    }
    return true;
  };

  const handleWeightsSave = async () => {
    if (!validateWeights()) return;
    try {
      await Promise.all([
        axios.put("http://localhost:8082/boot/thresholds/DISCHARGE", {
          value: weights.discharge,
        }),
        axios.put("http://localhost:8082/boot/thresholds/WARD", {
          value: weights.ward,
        }),
        axios.put("http://localhost:8082/boot/thresholds/ICU", {
          value: weights.icu,
        }),
      ]);
      showNotification("가중치 설정이 저장되었습니다.", "success");
    } catch (error) {
      console.error("가중치 저장 오류:", error);
      showNotification("가중치 저장 중 오류가 발생했습니다.", "error");
    }
  };

  return (
    <div className="space-y-3">
      <div className="mx-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 transition-colors hover:text-blue-600">
                퇴원 가중치
              </label>
              <input
                type="number"
                value={weights.discharge}
                onChange={(e) =>
                  handleWeightChange("discharge", e.target.value)
                }
                step="0.1"
                min="0.0"
                max="0.9"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-colors sm:text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 transition-colors hover:text-blue-600">
                일반병동 가중치
              </label>
              <input
                type="number"
                value={weights.ward}
                onChange={(e) => handleWeightChange("ward", e.target.value)}
                step="0.1"
                min="0.0"
                max="0.9"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-colors sm:text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 transition-colors hover:text-blue-600">
                중증병동 가중치
              </label>
              <input
                type="number"
                value={weights.icu}
                onChange={(e) => handleWeightChange("icu", e.target.value)}
                step="0.1"
                min="0.0"
                max="0.9"
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-300 transition-colors sm:text-sm bg-white"
              />
            </div>
          </div>

          <div className="flex items-end lg:justify-end">
            <button
              onClick={handleWeightsSave}
              className="h-10 w-[180px] inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
// 병상 설정 관련 컴포넌트
const BedSettings = ({ showNotification }) => {
   // 병상 수 상태 관리 및 저장 로직
  const [bedCapacity, setBedCapacity] = useState({
    totalBeds: 48,
  });

  const handleBedCapacityChange = (value) => {
    const numValue = parseInt(value) || 0;
    setBedCapacity({ totalBeds: numValue });
  };

  const handleBedCapacitySave = async () => {
    try {
      await axios.put("http://localhost:8082/boot/beds/capacity", bedCapacity);
      showNotification("병상 수 설정이 저장되었습니다.", "success");
    } catch (error) {
      console.error("병상 수 저장 오류:", error);
      showNotification("병상 수 저장 중 오류가 발생했습니다.", "error");
    }
  };

  return (
    <div className="space-y-3">
      <div className="mx-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            전체 병상 수
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              value={bedCapacity.totalBeds}
              onChange={(e) => handleBedCapacityChange(e.target.value)}
              className="flex-1 h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <button
              onClick={handleBedCapacitySave}
              className="h-10 w-[180px] inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Save className="h-4 w-4 mr-2" />
              병상 수 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// Settings 전체 구성 컴포넌트
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
