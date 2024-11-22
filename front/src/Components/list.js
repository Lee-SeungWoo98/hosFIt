/**
 * List.js
 * 환자 목록을 표시하고 관리하는 컴포넌트
 * 데이터 로딩 최적화 및 성능 개선 버전
 */
import React, { useState, useEffect, useCallback, useMemo, useRef} from "react";
import axios from 'axios';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  ChevronDown,
} from "lucide-react";
import { API_ENDPOINTS } from '../constants/api';

// =========== 상수 정의 ===========
const LOCATION_TABS = [
  { id: "all", label: "전체", maxLevel: null },
  { id: "icu", label: "중증 병동", maxLevel: "level3" },
  { id: "ward", label: "일반 병동", maxLevel: "level2" },
  { id: "discharge", label: "퇴원", maxLevel: "level1" },
];

const FILTER_OPTIONS = {
  gender: {
    label: "성별",
    options: [
      { value: "", label: "All" },
      { value: "1", label: "남자" },
      { value: "0", label: "여자" },
    ],
  },
  tas: {
    label: "KTAS",
    options: [
      { value: "", label: "All" },
      ...Array.from({ length: 5 }, (_, i) => ({
        value: i + 1,
        label: `Level ${i + 1}`,
      })),
    ],
  },
  painScore: {
    label: "통증 점수",
    options: [
      { value: "", label: "All" },
      ...Array.from({ length: 10 }, (_, i) => ({
        value: i + 1,
        label: String(i + 1),
      })),
    ],
  },
};

// 검사 항목별 정상 범위 정의
const NORMAL_RANGES = {
  // Blood Levels
  hemoglobin: { male: [13.5, 17.5], female: [12.0, 16.0] },
  platelet_count: [150000, 450000],
  wbc: [4000, 11000],
  rbc: { male: [4.5, 5.9], female: [4.1, 5.1] },
  sedimentation_rate: { male: [0, 15], female: [0, 20] },

  // Electrolyte Levels
  sodium: [135, 145],
  potassium: [3.5, 5.0],
  chloride: [96, 106],

  // Enzymes & Metabolism
  ck: [22, 198],
  ckmb: [0, 25],
  creatinine: [0.7, 1.3],
  ggt: [8, 61],
  glucose: [70, 100],
  inrpt: [0.8, 1.2],
  lactate: [0.5, 2.2],
  ld: [140, 280],
  lipase: [13, 60],
  magnesium: [1.7, 2.2],
  ntpro_bnp: [0, 125],
  ddimer: [0, 500],

  // Chemical Examinations & Enzymes
  acetone: [0, 0],
  alt: [7, 56],
  albumin: [3.4, 5.4],
  alkaline_phosphatase: [44, 147],
  ammonia: [15, 45],
  amylase: [28, 100],
  ast: [8, 48],
  beta_hydroxybutyrate: [0, 0.6],
  bicarbonate: [22, 29],
  bilirubin: [0.3, 1.2],
  crp: [0, 3.0],
  calcium: [8.6, 10.3],
  co2: [23, 29],

  // Blood Gas Analysis
  po2: [80, 100],
  ph: [7.35, 7.45],
  pco2: [35, 45],
};

const MAX_CACHE_SIZE = 100; // 최대 100명 환자 데이터만 캐시

class LRUCache {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.queue = [];
  }

  get(key) {
    if (this.cache.has(key)) {
      this.queue = this.queue.filter(k => k !== key);
      this.queue.push(key);
      return this.cache.get(key);
    }
    return null;
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const oldest = this.queue.shift();
      this.cache.delete(oldest);
    }
    this.cache.set(key, value);
    this.queue.push(key);
  }

  clear() {
    this.cache.clear();
    this.queue = [];
  }
}

function List({
  loading,
  searchTerm,
  patients,
  onFilteredPatientsUpdate,
  ktasFilter,
  fetchLabTests,
  fetchVisitInfo,
  onPatientSelect,
  onSearch,
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  activeTab,
  tabCounts,
  onTabChange,
  onTASClick  
}) {
  // =========== 상태 관리 ===========
  const [searchInputValue, setSearchInputValue] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    gender: "",
    tas: "",
    painScore: "",
    searchTerm: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // handleTabChange 수정
  const handleTabChange = useCallback(async (tabId, fromKtas = false) => {
    localStorage.setItem('activeTab', tabId);
    
    try {
      setIsUpdating(true);
      setLoadingDetails(false); // 탭 변경 시 loadingDetails 초기화 추가
      let newFilters;
  
      if (tabId === 'all') {
        newFilters = {
          ...selectedFilters,
          maxLevel: undefined
        };
      } else {
        const tab = LOCATION_TABS.find(t => t.id === tabId);
        newFilters = {
          ...selectedFilters,
          maxLevel: tab.maxLevel
        };
      }
      
      await onFilteredPatientsUpdate(0, newFilters);
      if (!fromKtas) {
        onTASClick({ id: tabId });
      }
    } catch (error) {
      console.error('탭 변경 중 에러:', error);
    } finally {
      setIsUpdating(false);
      loadingPatientsRef.current.clear(); // 로딩 중인 환자 목록 초기화 추가
    }
  }, [selectedFilters, onFilteredPatientsUpdate, onTASClick]);
  
  // 탭 클릭 핸들러
  const handleTabClick = useCallback((tabId) => {
    handleTabChange(tabId, false);
  }, [handleTabChange]);

  const [abnormalCounts, setAbnormalCounts] = useState({});
  const labTestsCacheRef = useRef(new Map());
  const detailsCacheRef = useRef(new Map());
  const previousPatientsRef = useRef([]);
  const detailsCache = new LRUCache(MAX_CACHE_SIZE);
  const loadingPatientsRef = useRef(new Set());

  // 환자 데이터 메모이제이션
  const memoizedPatients = useMemo(() => patients, [patients]);

  // =========== 유틸리티 함수 ===========
  /**
   * 날짜 포맷팅 함수
   */
  const formatDate = useCallback((date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '-';
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).replace(/\. /g, ".").slice(0, -1);
  }, []);

  /**
   * 시간 포맷팅 함수
   */
  const formatTime = useCallback((date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }, []);

  // =========== 데이터 fetching 최적화 ===========
  /**
   * 캐시된 검사 데이터 확인 및 새로운 데이터만 요청
   */
  const fetchLabTestsWithCache = useCallback(async (patients) => {
    const newStayIds = new Set();
    const stayIdToPatientMap = new Map();

    // 새로운 stay_id만 수집
    patients.forEach(patient => {
      const latestVisit = patient.visits?.[patient.visits.length - 1];
      if (latestVisit?.stayId) {
        if (!labTestsCacheRef.current.has(latestVisit.stayId)) {
          newStayIds.add(latestVisit.stayId);
        }
        stayIdToPatientMap.set(latestVisit.stayId, patient.subjectId);
      }
    });

    // 새로운 데이터만 요청
    if (newStayIds.size > 0) {
      const newLabTestsPromises = Array.from(newStayIds).map(stayId =>
        fetchLabTests(stayId)
          .then(result => {
            labTestsCacheRef.current.set(stayId, result);
            return { stayId, result };
          })
          .catch(err => {
            console.error(`Failed to fetch lab tests for stay_id ${stayId}:`, err);
            return { stayId, result: null };
          })
      );

      await Promise.all(newLabTestsPromises);
    }

    // 전체 맵 반환
    return labTestsCacheRef.current;
  }, [fetchLabTests]);

  /**
   * 검사 결과의 정상/비정상 여부를 확인하는 함수
   */
  const checkNormalRange = useCallback((category, value, gender) => {
    const range = NORMAL_RANGES[category];
    if (!range) return null;

    const numValue = parseFloat(value);
    
    if (range.male && range.female) {
      const genderRange = gender === '남' ? range.male : range.female;
      return numValue >= genderRange[0] && numValue <= genderRange[1];
    }
    
    return numValue >= range[0] && numValue <= range[1];
  }, []);

  /**
   * 모든 환자의 비정상 수치를 한 번에 계산하는 함수
   */
  /**
 * 모든 환자의 비정상 수치를 최적화하여 계산하는 함수
 * - 이전에 계산된 결과 재사용
 * - 필요한 경우에만 새로 계산
 */
  const calculateAbnormalCountsOptimized = useCallback((patients, labTestsMap) => {
    const counts = {};
    
    patients.forEach(patient => {
      const latestVisit = patient.visits?.[patient.visits.length - 1];
      if (!latestVisit?.stayId) {
        counts[patient.subjectId] = 0;
        return;
      }

      const labTestsData = labTestsMap.get(latestVisit.stayId);
      if (!labTestsData || !Array.isArray(labTestsData) || labTestsData.length === 0) {
        counts[patient.subjectId] = 0;
        return;
      }

      let abnormalCount = 0;
      const categories = [
        'bloodLevels',
        'electrolyteLevels',
        'enzymesMetabolisms',
        'chemicalExaminationsEnzymes',
        'bloodGasAnalysis'
      ];

      categories.forEach(category => {
        const categoryData = labTestsData[0]?.[category]?.[0];
        if (categoryData) {
          Object.entries(categoryData).forEach(([key, value]) => {
            if (key !== 'blood_idx' && 
                key !== 'bloodIdx' && 
                key !== 'reg_date' && 
                key !== 'regDate' && 
                key !== 'regdate' && 
                key !== 'labtest' && 
                value !== null) {
              const isNormal = checkNormalRange(key, value, patient.gender);
              if (isNormal === false) {
                abnormalCount++;
              }
            }
          });
        }
      });

      counts[patient.subjectId] = abnormalCount;
    });

    return counts;
  }, [checkNormalRange]);

  // =========== 이벤트 핸들러 ===========
  /**
   * 필터 선택 처리 함수
   */
  const handleFilterSelect = useCallback(async (type, value) => {
    setIsUpdating(true);
    try {
      const processedValue = type === 'gender' ? value : (value === "" ? "" : Number(value));
      const newFilters = {
        ...selectedFilters,
        [type]: processedValue,
        searchTerm: searchInputValue,
      };
      setSelectedFilters(newFilters);
  
      // 기존 탭의 maxLevel 유지하면서 필터 적용
      await onFilteredPatientsUpdate(0, {
        ...newFilters,
        maxLevel: activeTab === 'all' ? undefined : LOCATION_TABS.find(t => t.id === activeTab)?.maxLevel
      });
    } finally {
      setIsUpdating(false);
      setOpenDropdown(null);
    }
  }, [selectedFilters, searchInputValue, onFilteredPatientsUpdate, activeTab]);

  /**
   * 필터 초기화 함수
   */
  const resetAllFilters = useCallback(async () => {
    setIsUpdating(true);
    try {
      const resetFilters = {
        gender: "",
        tas: "",
        painScore: "",
        searchTerm: "",
      };
      setSelectedFilters(resetFilters);
      setSearchInputValue("");
      
      // maxLevel 유지하면서 필터 초기화
      await onFilteredPatientsUpdate(0, {
        ...resetFilters,
        maxLevel: activeTab === 'all' ? undefined : LOCATION_TABS.find(t => t.id === activeTab)?.maxLevel
      });
    } finally {
      setIsUpdating(false);
    }
  }, [onFilteredPatientsUpdate, activeTab]);

  /**
   * 환자 상세정보 조회 함수
   */
  const showPatientDetails = useCallback(async (patient) => {
    const patientId = patient.subjectId;
    
    // 이미 로딩 중인 환자는 중복 요청 방지
    if (loadingPatientsRef.current.has(patientId)) {
      return;
    }
  
    setLoadingDetails(true);
    loadingPatientsRef.current.add(patientId);
  
    try {
      // 1. 캐시 확인
      const cachedData = detailsCache.get(patientId);
      if (cachedData) {
        onPatientSelect(patient, cachedData.labTests, cachedData.visitInfo);
        return;
      }
  
      // 2. 데이터 요청
      const [visitInfoResponse, labTestsResponse] = await Promise.all([
        fetchVisitInfo(patientId),
        fetchLabTests(patient.visits?.[patient.visits.length - 1]?.stayId)
      ]);
  
      if (!visitInfoResponse?.visits?.length) {
        throw new Error("방문 정보가 없습니다.");
      }
  
      // 3. 원본 데이터 구조 유지하면서 캐시
      detailsCache.set(patientId, {
        labTests: labTestsResponse,
        visitInfo: visitInfoResponse  // 전체 응답 데이터 유지
      });
  
      // 4. 결과 반환
      onPatientSelect(patient, labTestsResponse, visitInfoResponse);
  
    } catch (error) {
      console.error("상세 정보 조회 실패:", error);
    } finally {
      setLoadingDetails(false);
      loadingPatientsRef.current.delete(patientId);
    }
  }, [fetchVisitInfo, fetchLabTests, onPatientSelect]);

  // =========== Effects ===========
  /**
   * 환자 데이터가 변경될 때 비정상 수치 계산
   */
  useEffect(() => {
    let isSubscribed = true;
    
    const processPatientData = async () => {
      if (!memoizedPatients.length) return;
  
      const patientsChanged = memoizedPatients.length !== previousPatientsRef.current.length ||
        memoizedPatients.some((patient, index) => 
          patient.subjectId !== previousPatientsRef.current[index]?.subjectId
        );
  
      if (!patientsChanged) return;
  
      try {
        const labTestsMap = await fetchLabTestsWithCache(memoizedPatients);
        if (isSubscribed) {
          const counts = calculateAbnormalCountsOptimized(memoizedPatients, labTestsMap);
          setAbnormalCounts(counts);
          previousPatientsRef.current = memoizedPatients;
        }
      } catch (error) {
        console.error("Error processing patient data:", error);
      }
    };
  
    processPatientData();
  
    return () => {
      isSubscribed = false;
    };
  }, [memoizedPatients, fetchLabTestsWithCache, calculateAbnormalCountsOptimized]);

  useEffect(() => {
    return () => {
      detailsCache.clear();
      loadingPatientsRef.current.clear();
    };
  }, []);
  /**
   * 드롭다운 외부 클릭 감지
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

   // 환자의 wardCode 가져오기
   const getWardInfo = useCallback((patient) => {
    const latestVisit = patient.visits?.[patient.visits.length - 1];
    
    if (!latestVisit?.vitalSigns?.length) {
      return { label: "-", tabId: "all" };
    }
  
    // chartNum 문자열 비교로 정렬
    const sortedVitalSigns = [...latestVisit.vitalSigns].sort((a, b) => {
      if (!a.chartNum && !b.chartNum) return 0;
      if (!a.chartNum) return 1;
      if (!b.chartNum) return -1;
      return b.chartNum.localeCompare(a.chartNum);
    });
  
    // 가장 큰 chartNum을 가진 기록 사용
    const lastVitalSign = sortedVitalSigns[0];
    
    if (!lastVitalSign || 
        typeof lastVitalSign.level1 !== 'number' || 
        typeof lastVitalSign.level2 !== 'number' || 
        typeof lastVitalSign.level3 !== 'number') {
      return { label: "-", tabId: "all" };
    }
  
    // console.log(`Patient ${patient.subjectId} Last VitalSign:`, {
    //   chartNum: lastVitalSign.chartNum,
    //   level1: lastVitalSign.level1,
    //   level2: lastVitalSign.level2,
    //   level3: lastVitalSign.level3
    // });
  
    const levels = [
      { value: lastVitalSign.level1, label: "퇴원", tabId: "discharge" },
      { value: lastVitalSign.level2, label: "일반 병동", tabId: "ward" },
      { value: lastVitalSign.level3, label: "중증 병동", tabId: "icu" }
    ];
  
    const highest = levels.reduce((prev, current) => 
      current.value > prev.value ? current : prev
    );
  
    return {
      label: highest.label,
      tabId: highest.tabId,
      value: highest.value
    };
  }, []);

    // 탭별 환자 필터링 수정 (전체 환자 대상)
    const filteredPatients = useMemo(() => {
      if (activeTab === "all") {
        return patients;
      }
      
      // 이미 API에서 필터링된 데이터를 사용
      return patients;
    }, [patients, activeTab]);

    // 성별 변환 함수 추가
  const getGenderText = useCallback((gender) => {
    if (gender === 1 || gender === "1") return "남자";
    if (gender === 0 || gender === "0") return "여자";
    return "-";
  }, []);

  // =========== 렌더링 함수 ===========
  /**
   * 환자 행 렌더링
   */
  const renderPatientRow = useCallback((patient) => {
    // 최신 방문 기록 및 기본 정보 추출
    const latestVisit = patient.visits?.[patient.visits.length - 1];
    const genderText = getGenderText(patient.gender);
    
    // AI TAS 라벨 초기값 설정
    let aiTasLabel = "-";
    
    // vitalSigns 배열이 존재하면 가장 마지막 기록의 level 값들을 사용
    if (latestVisit?.vitalSigns?.length > 0) {
      // 단순히 배열의 마지막 항목 사용
      const lastVitalSign = latestVisit.vitalSigns[latestVisit.vitalSigns.length - 1];
      
      // level 값들이 모두 숫자인지 확인
      if (typeof lastVitalSign?.level1 === 'number' && 
          typeof lastVitalSign?.level2 === 'number' && 
          typeof lastVitalSign?.level3 === 'number') {
        
        // 각 level별 배치 옵션 정의
        const levels = [
          { value: lastVitalSign.level1, label: "퇴원" },
          { value: lastVitalSign.level2, label: "일반 병동" },
          { value: lastVitalSign.level3, label: "중증 병동" }
        ];
  
        // 가장 높은 확률값을 가진 배치 옵션 선택
        const highest = levels.reduce((prev, current) => 
          current.value > prev.value ? current : prev
        );
  
        aiTasLabel = highest.label;
      }
    }
  
    return (
      <tr
        key={patient.subjectId}
        className="patient-row"
        style={{
          opacity: isUpdating ? 0.6 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        <td>{patient.subjectId}</td>
        <td>{patient.icd || '-'}</td>
        <td>{patient.name}</td>
        <td>{genderText}</td>
        <td>{patient.age}</td>
        <td>
          {latestVisit?.visitDate ? (
            <>
              {formatDate(new Date(latestVisit.visitDate))}
              <br />
              <span>
                {formatTime(new Date(latestVisit.visitDate))}
              </span>
            </>
          ) : '-'}
        </td>
        <td>{latestVisit?.pain || "-"}</td>
        <td>{latestVisit?.tas || "-"}</td>
        <td>{aiTasLabel}</td>
        <td className="abnormal-count-cell">
          {abnormalCounts[patient.subjectId] ? (
            <span className="abnormal-count">
              <span className="abnormal-number">{abnormalCounts[patient.subjectId]}</span>
              <span className="abnormal-text">건</span>
            </span>
          ) : "-"}
        </td>
        <td>
        <button
          onClick={() => showPatientDetails(patient)}
          className="details-button"
          disabled={isUpdating || loadingPatientsRef.current.has(patient.subjectId)}
        >
          {loadingPatientsRef.current.has(patient.subjectId) ? "로딩 중..." : "상세 보기"}
        </button>
        </td>
      </tr>
    );
  }, [isUpdating, loadingDetails, formatDate, formatTime, showPatientDetails, abnormalCounts, getGenderText]);

  /**
   * 필터 드롭다운 렌더링
   */
  const renderFilterDropdowns = useCallback(() => (
    <div className="filter-dropdowns">
      {/* 필터 UI 구현 */}
    </div>
  ), [searchInputValue, openDropdown, selectedFilters, totalElements, handleFilterSelect, resetAllFilters]);

  // =========== 메인 렌더링 ===========
  return (
    <div className="page-wrapper">
      {/* 스타일 정의 */}
      <style>
        {`
          .table-container {
            transition: opacity 0.3s ease;
            position: relative;
          }
          /* ... 기타 스타일 정의 ... */
        `}
      </style>

      <div className="content-area">
        {/* 위치 탭 */}
        <div className="location-tabs">
          {LOCATION_TABS.map((tab) => (
            <button
              key={tab.id}
              className={`location-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => handleTabClick(tab.id)}
              disabled={isUpdating}
            >
              {tab.label}
              <span className="tab-count">
                ({tabCounts?.[tab.id] || 0})
              </span>
            </button>
          ))}
        </div>

        {/* 테이블 컨테이너 */}
        <div
          className="table-container"
          style={{
            opacity: isUpdating || loading ? 0.6 : 1,
          }}
        >
          {/* 필터 영역 */}
          <div className="filter-dropdowns">
            <div className="filters-left">
              {/* 검색 입력 */}
                <div className="dropdown-container search-container">
                  <div className="search-input-wrapper">
                    <Search size={16} className="search-icon" />
                    <input
                      type="text"
                      placeholder="환자 이름 검색"
                      value={searchInputValue}
                      disabled={isUpdating || loading}
                      onChange={(e) => setSearchInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const newFilters = {
                            ...selectedFilters,
                            searchTerm: e.target.value,
                            maxLevel: activeTab === 'all' ? undefined : LOCATION_TABS.find(t => t.id === activeTab)?.maxLevel
                          };
                          onFilteredPatientsUpdate(0, newFilters);
                        }
                      }}
                      className="patient-search-input"
                    />
                  </div>
                </div>

                {/* 필터 드롭다운 */}
                {Object.entries(FILTER_OPTIONS).map(([filterType, { label, options }]) => (
                  <div key={filterType} className="dropdown-container">
                    <button
                      className={`dropdown-trigger ${openDropdown === filterType ? "active" : ""}`}
                      onClick={() => setOpenDropdown(prev => prev === filterType ? null : filterType)}
                      disabled={isUpdating || loading}
                    >
                      {selectedFilters[filterType] !== "" && selectedFilters[filterType] !== undefined
                        ? options.find(opt => String(opt.value) === String(selectedFilters[filterType]))?.label || label
                        : label}
                      <ChevronDown
                        size={16}
                        className={`dropdown-arrow ${openDropdown === filterType ? "open" : ""}`}
                      />
                    </button>
                    {openDropdown === filterType && (
                      <div className="dropdown-content">
                        {options.map((option) => (
                          <div
                            key={option.value}
                            className={`dropdown-item ${
                              String(selectedFilters[filterType]) === String(option.value) ? "selected" : ""
                            }`}
                            onClick={() => handleFilterSelect(filterType, option.value)}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* 필터 초기화 버튼 */}
                <button
                  className="reset-filters-button"
                  onClick={resetAllFilters}
                  disabled={isUpdating || loading}
                  title="Reset Filters"
                >
                  <RotateCcw size={18} />
                </button>
              </div>
              {/* <div className="total-count-filter">
                (총 {totalElements}명)
              </div> */}
              </div>

          {/* 환자 목록 테이블 */}
          <table>
            <thead>
              <tr>
                {[
                  { key: "subjectId", label: "PID" },
                  { key: "icd", label: "ICD" },
                  { key: "name", label: "이름" },
                  { key: "gender", label: "성별" },
                  { key: "age", label: "나이" },
                  { key: "visitDate", label: "입실 시간" },
                  { key: "pain", label: "통증 점수" },
                  { key: "tas", label: "KTAS" },
                  { key: "ai_tas", label: "AI_TAS" },
                  { key: "abnormal", label: "비정상" },
                ].map(({ key, label }) => (
                  <th key={key}>{label}</th>
                ))}
                <th>상세 정보</th>
              </tr>
            </thead>
              <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map(renderPatientRow)
              ) : (
                <tr>
                  <td colSpan="11" className="no-data-message">
                    조건에 해당하는 환자가 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          {memoizedPatients.length > 0 && (
          <div className="pagination">
            <button
              onClick={async () => {
                if (!isUpdating) {
                  setIsUpdating(true);
                  try {
                    await onPageChange(0);
                  } finally {
                    setIsUpdating(false);
                  }
                }
              }}
              disabled={currentPage === 0 || isUpdating}
              className="pagination-arrow"
            >
              <ChevronLeft />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = idx;
              } else if (currentPage < 2) {
                pageNum = idx;
              } else if (currentPage > totalPages - 3) {
                pageNum = totalPages - 5 + idx;
              } else {
                pageNum = currentPage - 2 + idx;
              }

              return (
                <button
                  key={idx}
                  onClick={async () => {
                    if (!isUpdating) {
                      setIsUpdating(true);
                      try {
                        await onPageChange(pageNum);
                      } finally {
                        setIsUpdating(false);
                      }
                    }
                  }}
                  disabled={isUpdating}
                  className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                >
                  {pageNum + 1}
                </button>
              );
            })}

            <button
              onClick={async () => {
                if (!isUpdating) {
                  setIsUpdating(true);
                  try {
                    await onPageChange(totalPages - 1);
                  } finally {
                    setIsUpdating(false);
                  }
                }
              }}
              disabled={currentPage + 1 >= totalPages || isUpdating}
              className="pagination-arrow"
            >
              <ChevronRight />
            </button>
          </div>
        )}

          {/* 로딩 오버레이 */}
          {(isUpdating || loading) && (
            <div className="loading-overlay">
              <div className="loading-spinner" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 성능 최적화를 위한 메모이제이션
export default React.memo(List);