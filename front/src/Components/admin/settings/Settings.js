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
  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 mx-6">
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
    discharge: 0.2,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const response = await axios.get("http://localhost:8082/boot/api/thresholds");
        if (response.data) {
          const newWeights = {
            icu: response.data["0"] || 0.7,
            ward: response.data["1"] || 0.4,
            discharge: response.data["2"] || 0.2,
          };
          setLocalWeights(newWeights);
          updateWeights(newWeights);
          console.log("Fetched weights:", newWeights);
        }
      } catch (error) {
        console.error("Error loading weights:", error);
        showNotification("가중치 로드 중 오류가 발생했습니다.", "error");
      }
    };

    fetchWeights();
  }, [showNotification, updateWeights]);

  const handleWeightChange = (type, value) => {
    const numValue = Math.min(Math.max(parseFloat(value) || 0, 0), 0.9);
    setLocalWeights((prev) => ({
      ...prev,
      [type]: numValue,
    }));
  };

  const validateWeights = () => {
    if (localWeights.discharge > localWeights.ward || localWeights.ward > localWeights.icu) {
      showNotification(
        "가중치는 중증병동 > 일반병동 > 퇴원 순서로 설정되어야 합니다.",
        "error"
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
        icu: "0",
        ward: "1",
        discharge: "2",
      };

      // 각 가중치 개별적으로 업데이트
      const updatePromises = Object.entries(localWeights).map(([type, value]) => {
        const key = keyMapping[type];
        return axios.put(`http://localhost:8082/boot/api/thresholds/${key}`, null, {
          params: { value },
        });
      });

      await Promise.all(updatePromises);

      // ScoreContext 업데이트
      updateWeights(localWeights);
      console.log("Updated weights:", localWeights);

      showNotification("가중치 설정이 저장되었습니다.", "success");
    } catch (error) {
      console.error("Error saving weights:", error);
      showNotification("가중치 저장 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-6">
        {Object.entries({
          icu: "중증병동",
          ward: "일반병동",
          discharge: "퇴원",
        }).map(([type, label]) => (
          <div key={type} className="relative">
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
        <div className="flex items-end justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="h-10 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-500 bg-yellow-50 p-3 rounded-md flex items-start mx-6">
        <Info className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
        <p className="ml-2">
          가중치를 변경한 후 저장 버튼을 눌러야 설정이 반영됩니다. 각 가중치는 중증병동 &gt; 일반병동 &gt; 퇴원의 순서로 설정되어야 하며, 가중치 범위 내에서 적절히 조정하십시오. 저장 버튼이 퇴원 가중치 입력 칸 바로 오른쪽에 위치해 있으니 클릭하여 설정을 저장하십시오.
        </p>
      </div>
    </div>
  );
};

// 병상 설정 컴포넌트
const BedSettings = ({ showNotification }) => {
  const [bedCount, setBedCount] = useState(42); // 초기값은 백엔드에서 가져올 값으로 대체
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchBedCount = async () => {
      try {
        const response = await axios.get("http://localhost:8082/beds/count");
        if (response.status === 200) {
          setBedCount(response.data); // 백엔드에서 병상 수를 가져옴
        } else {
          throw new Error("병상 수를 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error("병상 수 로드 오류:", error);
        showNotification("병상 수 로드 중 오류가 발생했습니다.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBedCount();
  }, [showNotification]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await axios.put("http://localhost:8082/beds/update", null, {
        params: { totalBeds: bedCount },
      });
      if (response.status === 200) {
        showNotification("병상 수가 저장되었습니다.", "success");
      } else {
        throw new Error("병상 수 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("병상 수 저장 오류:", error);
      showNotification("병상 수 저장 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 mx-6">
        <input
          type="number"
          value={isLoading ? "" : bedCount}
          onChange={(e) => setBedCount(parseInt(e.target.value) || 42)}
          disabled={isLoading}
          min="1"
          className="flex-1 h-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="h-10 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "저장 중..." : "저장"}
        </button>
      </div>
      <div className="mt-4 text-sm text-gray-500 bg-yellow-50 p-3 rounded-md flex items-start mx-6">
        <Info className="h-5 w-5 text-yellow-400 mt-1 flex-shrink-0" />
        <p className="ml-2">
          병상 수를 수정한 후 저장 버튼을 눌러야 변경 사항이 반영됩니다.
        </p>
      </div>
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
