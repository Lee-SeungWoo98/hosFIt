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

// 스타일 상수
const styles = {
  card: "bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all",
  cardHeader: "flex items-center gap-3 mb-6",
  cardTitle: "text-lg font-semibold text-gray-900",
  input: "w-full h-11 px-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
  button: "h-11 px-6 rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2",
  buttonPrimary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400",
  buttonSecondary: "border border-gray-200 text-gray-700 hover:bg-gray-50",
  infoBox: "mt-3 p-3 bg-yellow-50 rounded-lg flex items-start gap-3",  // 여백 조정
  infoText: "text-sm text-gray-600",
  icon: "w-5 h-5 flex-shrink-0",  // flex-shrink-0 추가
  grid: "grid grid-cols-1 lg:grid-cols-2 gap-6",
  contactSection: "space-y-4 bg-gray-50/50 p-6 rounded-lg",
  contactItem: "flex items-start gap-3",
  contactTitle: "font-medium text-gray-900",
  contactSubtitle: "text-sm text-gray-500",
};

// 유지보수 담당자 정보
const MAINTENANCE_CONTACT = {
  company: "hosFit Solutions Co., Ltd.",
  department: "의료정보시스템팀",
  name: "김유지",
  position: "수석 엔지니어",
  email: "maintenance@hosfit.co.kr",
  phone: "02-1234-5678",
  address: "서울특별시 강남구 테헤란로 123 호스핏빌딩 15층",
};

// 공통 컴포넌트: 카드 섹션
const SettingsCard = ({ title, icon: Icon, children }) => (
  <section className={styles.card}>
    <div className={styles.cardHeader}>
      <Icon className={`${styles.icon} text-blue-600`} />
      <h2 className={styles.cardTitle}>{title}</h2>
    </div>
    {children}
  </section>
);

// 공통 컴포넌트: 입력 필드
const InputField = ({ label, value, onChange, disabled, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-600">{label}</label>
    <input
      type="number"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`${styles.input} ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
      {...props}
    />
  </div>
);

// 공통 컴포넌트: 버튼
const Button = ({ onClick, icon: Icon, children, primary = true, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${styles.button} ${primary ? styles.buttonPrimary : styles.buttonSecondary}`}
  >
    {Icon && <Icon className={styles.icon} />}
    {children}
  </button>
);

// 공통 컴포넌트: 정보 메시지
const InfoMessage = ({ children }) => (
  <div className={styles.infoBox}>
    <Info className={`${styles.icon} text-yellow-500`} />
    <p className={styles.infoText}>{children}</p>
  </div>
);

// 가중치 설정 컴포넌트
const WeightSettings = ({ showNotification }) => {
  const { weights, updateWeights, isLoading } = useScores();
  const [localWeights, setLocalWeights] = useState(weights);

  useEffect(() => {
    setLocalWeights(weights);
  }, [weights]);

  const handleWeightChange = (level, value) => {
    const numValue = Math.min(Math.max(parseFloat(value) || 0, 0.0), 1.0);
    setLocalWeights(prev => ({ ...prev, [level]: numValue }));
  };

  const validateWeights = () => {
    if (
      localWeights.level2 > localWeights.level1 ||
      localWeights.level1 > localWeights.level0
    ) {
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

    try {
      await updateWeights(localWeights);
      showNotification("가중치 설정이 저장되었습니다.", "success");
    } catch (error) {
      console.error("가중치 저장 오류:", error);
      showNotification("가중치 저장 중 오류가 발생했습니다.", "error");
      setLocalWeights(weights);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <InputField
          label="중증병동 가중치"
          value={localWeights.level0}
          onChange={e => handleWeightChange("level0", e.target.value)}
          min={0}
          max={1}
          step={0.1}
          disabled={isLoading}
        />
        <InputField
          label="일반병동 가중치"
          value={localWeights.level1}
          onChange={e => handleWeightChange("level1", e.target.value)}
          min={0}
          max={1}
          step={0.1}
          disabled={isLoading}
        />
        <InputField
          label="퇴원 가중치"
          value={localWeights.level2}
          onChange={e => handleWeightChange("level2", e.target.value)}
          min={0}
          max={1}
          step={0.1}
          disabled={isLoading}
        />
      </div>
      <div className="flex justify-center">
        <Button
          onClick={handleSave}
          disabled={isLoading}
          icon={Save}
        >
          {isLoading ? "저장 중..." : "가중치 설정 저장"}
        </Button>
      </div>
      <InfoMessage>
        가중치는 중증병동 &gt; 일반병동 &gt; 퇴원 순서로 설정되어야 합니다.
      </InfoMessage>
    </div>
  );
};

// 병상 설정 컴포넌트
const BedSettings = ({ showNotification }) => {
  const [bedCapacity, setBedCapacity] = useState({
    totalBeds: 0,
    isLoading: true,
    error: null,
  });

  const fetchBedCount = async () => {
    try {
      const response = await axios.get("http://localhost:8082/boot/beds/count");
      setBedCapacity(prev => ({
        ...prev,
        totalBeds: response.data,
        isLoading: false,
      }));
    } catch (error) {
      console.error("병상 수 로드 오류:", error);
      setBedCapacity(prev => ({
        ...prev,
        isLoading: false,
        error: "데이터 로드 중 오류가 발생했습니다.",
      }));
      showNotification("병상 수 로드 중 오류가 발생했습니다.", "error");
    }
  };

  useEffect(() => {
    fetchBedCount();
  }, []);

  const handleBedCapacityChange = value => {
    const numValue = parseInt(value) || 0;
    setBedCapacity(prev => ({
      ...prev,
      totalBeds: numValue,
    }));
  };

  const handleSave = async () => {
    try {
      if (bedCapacity.totalBeds < 1) {
        showNotification("병상 수는 1개 이상이어야 합니다.", "error");
        return;
      }

      const response = await axios.put(
        "http://localhost:8082/boot/beds/update",
        { totalBeds: bedCapacity.totalBeds }
      );

      if (response.data.success) {
        showNotification("병상 수 설정이 저장되었습니다.", "success");
        fetchBedCount();
      }
    } catch (error) {
      console.error("병상 수 저장 오류:", error);
      showNotification("병상 수 저장 중 오류가 발생했습니다.", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="w-full">
        <InputField
          label="전체 병상 수"
          value={bedCapacity.totalBeds}
          onChange={e => handleBedCapacityChange(e.target.value)}
          min={1}
          disabled={bedCapacity.isLoading}
          placeholder={bedCapacity.isLoading ? "로딩 중..." : "병상 수 입력"}
        />
      </div>
      <div className="flex justify-center">
        <Button
          onClick={handleSave}
          disabled={bedCapacity.isLoading || bedCapacity.totalBeds < 1}
          icon={Hospital}
        >
          병상 수 저장
        </Button>
      </div>
      <InfoMessage>
        병상 수는 1개 이상이어야 하며, 저장 후 시스템 정보를 확인해 주세요.
      </InfoMessage>
    </div>
  );
};

// 메인 Settings 컴포넌트
const Settings = ({ showNotification }) => {
  return (
    <div className="p-6 space-y-6">
      <div className={styles.grid}>
        <SettingsCard title="가중치 설정" icon={Save}>
          <WeightSettings showNotification={showNotification} />
        </SettingsCard>

        <SettingsCard title="병상 설정" icon={Hospital}>
          <BedSettings showNotification={showNotification} />
        </SettingsCard>
      </div>

      <SettingsCard title="유지보수 담당자 정보" icon={Bell}>
        <div className={styles.contactSection}>
          <div className={styles.contactItem}>
            <Building className={`${styles.icon} text-gray-400`} />
            <div>
              <p className={styles.contactTitle}>{MAINTENANCE_CONTACT.company}</p>
              <p className={styles.contactSubtitle}>
                {MAINTENANCE_CONTACT.department}
              </p>
            </div>
          </div>

          <div className={styles.contactItem}>
            <div className="w-5 h-5 flex items-center justify-center text-gray-400">
              👤
            </div>
            <div>
              <p className={styles.contactTitle}>{MAINTENANCE_CONTACT.name}</p>
              <p className={styles.contactSubtitle}>{MAINTENANCE_CONTACT.position}</p>
            </div>
          </div>

          <div className={styles.contactItem}>
            <Phone className={`${styles.icon} text-gray-400`} />
            <p className={styles.infoText}>{MAINTENANCE_CONTACT.phone}</p>
          </div>

          <div className={styles.contactItem}>
            <Mail className={`${styles.icon} text-gray-400`} />
            <p className={styles.infoText}>{MAINTENANCE_CONTACT.email}</p>
          </div>

          <div className={styles.contactItem}>
            <MapPin className={`${styles.icon} text-gray-400`} />
            <p className={styles.infoText}>{MAINTENANCE_CONTACT.address}</p>
          </div>
        </div>
        <InfoMessage>
          유지보수 담당자 정보는 시스템 관리자만 수정할 수 있습니다.
          정보 수정이 필요한 경우 시스템 관리자에게 문의해 주세요.
        </InfoMessage>
      </SettingsCard>
    </div>
  );
};

export default Settings;