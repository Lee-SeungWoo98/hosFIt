/**
 * List.js
 * 환자 목록을 표시하고 관리하는 컴포넌트
 * 데이터 로딩 최적화 및 성능 개선 버전
 */
import React, { useState, useEffect, useCallback, useMemo, useRef} from "react";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  ChevronDown,
} from "lucide-react";

// =========== 상수 정의 ===========
const LOCATION_TABS = [
  { id: "all", label: "전체" },
  { id: "icu", label: "응급" },
  { id: "ward", label: "관찰" },
  { id: "discharge", label: "퇴원" },
];

const FILTER_OPTIONS = {
  gender: {
    label: "Select Gender",
    options: [
      { value: "", label: "All" },
      { value: 1, label: "남자" },
      { value: 0, label: "여자" },
    ],
  },
  tas: {
    label: "Select KTAS",
    options: [
      { value: "", label: "All" },
      ...Array.from({ length: 5 }, (_, i) => ({
        value: i + 1,
        label: `Level ${i + 1}`,
      })),
    ],
  },
  painScore: {
    label: "Select Pain Score",
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
}) {
  // =========== 상태 관리 ===========
  const [searchInputValue, setSearchInputValue] = useState("");
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    gender: "",
    tas: "",
    painScore: "",
    searchTerm: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [abnormalCounts, setAbnormalCounts] = useState({});
  const labTestsCacheRef = useRef(new Map());
  const previousPatientsRef = useRef([]);
  
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
    // 이미 계산된 환자의 경우 캐시된 값 사용
    const cachedCount = abnormalCounts[patient.subjectId];
    if (cachedCount !== undefined && 
        previousPatientsRef.current.some(p => 
          p.subjectId === patient.subjectId && 
          p.visits?.[p.visits.length - 1]?.stayId === patient.visits?.[patient.visits.length - 1]?.stayId
        )) {
      counts[patient.subjectId] = cachedCount;
      return;
    }

    // 새로운 환자나 데이터가 변경된 환자의 경우 계산 수행
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
    const formattedLabTests = {
      blood_levels: labTestsData[0]?.bloodLevels || [],
      electrolyte_levels: labTestsData[0]?.electrolyteLevels || [],
      enzymes_metabolisms: labTestsData[0]?.enzymesMetabolisms || [],
      chemical_examinations_enzymes: labTestsData[0]?.chemicalExaminationsEnzymes || [],
      blood_gas_analysis: labTestsData[0]?.bloodGasAnalysis || []
    };

    // 카테고리별로 한 번만 순회하도록 최적화
    for (const category of Object.values(formattedLabTests)) {
      if (category?.length > 0) {
        const data = category[0];
        for (const [key, value] of Object.entries(data)) {
          // 메타데이터 필드 건너뛰기
          if (key === 'blood_idx' || 
              key === 'bloodIdx' || 
              key === 'reg_date' || 
              key === 'regDate' || 
              key === 'regdate' || 
              key === 'labtest' || 
              value === null) {
            continue;
          }

          if (!checkNormalRange(key, value, patient.gender)) {
            abnormalCount++;
          }
        }
      }
    }

    counts[patient.subjectId] = abnormalCount;
  });

  return counts;
}, [abnormalCounts, checkNormalRange]);

  // =========== 이벤트 핸들러 ===========
  /**
   * 필터 선택 처리 함수
   */
  const handleFilterSelect = useCallback(async (type, value) => {
    setIsUpdating(true);
    try {
      const processedValue = value === "" ? "" : Number(value);
      const newFilters = {
        ...selectedFilters,
        [type]: processedValue,
        searchTerm: searchInputValue,
      };
      setSelectedFilters(newFilters);
      await onFilteredPatientsUpdate(0, newFilters);
    } finally {
      setIsUpdating(false);
      setOpenDropdown(null);
    }
  }, [selectedFilters, searchInputValue, onFilteredPatientsUpdate]);

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
      await onFilteredPatientsUpdate(0, resetFilters);
    } finally {
      setIsUpdating(false);
    }
  }, [onFilteredPatientsUpdate]);

  /**
   * 환자 상세정보 조회 함수
   */
  const showPatientDetails = useCallback(async (patient) => {
    setLoadingDetails(true);
    try {
      const visitInfoResponse = await fetchVisitInfo(patient.subjectId);
      if (!visitInfoResponse?.visits?.length) {
        throw new Error("방문 정보가 없습니다.");
      }

      const latestVisit = visitInfoResponse.visits[visitInfoResponse.visits.length - 1];
      const stayId = latestVisit.stayId || latestVisit.stay_id;

      if (!stayId) {
        throw new Error("Stay ID를 찾을 수 없습니다.");
      }

      const labTestsResponse = await fetchLabTests(stayId);
      onPatientSelect(patient, labTestsResponse, visitInfoResponse);
    } catch (error) {
      console.error("상세 정보 조회 실패:", error);
    } finally {
      setLoadingDetails(false);
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

  // AI_TAS 값과 위치를 결정하는 함수
  const determineAiTasAndLocation = useCallback((wardAssignment) => {
    if (!wardAssignment) {
      return { aiTas: "-", location: "all" };
    }

    const { level1, level2, level3 } = wardAssignment;
    const levels = [
      { value: level1, label: "퇴원", location: "discharge" },
      { value: level2, label: "관찰", location: "ward" },
      { value: level3, label: "응급", location: "icu" },
    ];

    const maxLevel = levels.reduce((prev, current) => {
      return (current.value > prev.value) ? current : prev;
    });

    return {
      aiTas: maxLevel.label,
      location: maxLevel.location
    };
  }, []);

  // 환자 필터링 함수
  const filteredPatients = useMemo(() => {
    if (activeTab === "all") {
      return memoizedPatients;
    }

    return memoizedPatients.filter(patient => {
      const { location } = determineAiTasAndLocation(patient.wardAssignment);
      return location === activeTab;
    });
  }, [memoizedPatients, activeTab, determineAiTasAndLocation]);

  // =========== 렌더링 함수 ===========
  /**
   * 환자 행 렌더링
   */
  const renderPatientRow = useCallback((patient) => {
    const { aiTas } = determineAiTasAndLocation(patient.wardAssignment);
    
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
        <td>{patient.gender}</td>
        <td>{patient.age}</td>
        <td>
          {patient.visits?.length > 0 && patient.visits[patient.visits.length - 1].visitDate ? (
            <>
              {formatDate(patient.visits[patient.visits.length - 1].visitDate)}
              <br />
              <span>
                {formatTime(patient.visits[patient.visits.length - 1].visitDate)}
              </span>
            </>
          ) : '-'}
        </td>
        <td>{patient.visits?.[0]?.pain || "-"}</td>
        <td>{patient.visits?.[0]?.tas || "-"}</td>
        <td>{aiTas}</td>
        <td className="abnormal-count-cell">
          {abnormalCounts[patient.subjectId]+"건" || ""}
        </td>
        <td>
          <button
            onClick={() => showPatientDetails(patient)}
            className="details-button"
            disabled={loadingDetails}
          >
            {loadingDetails ? "로딩 중..." : "상세 보기"}
          </button>
        </td>
      </tr>
    );
  }, [isUpdating, loadingDetails, formatDate, formatTime, showPatientDetails, abnormalCounts, determineAiTasAndLocation]);

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
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 테이블 컨테이너 */}
        <div
          className="table-container"
          style={{
            position: "relative",
            opacity: isUpdating || loading ? 0.6 : 1,
            transition: "opacity 0.3s ease",
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
                    placeholder="Search by Patient ID or Name"
                    value={searchInputValue}
                    onChange={(e) => setSearchInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const newFilters = {
                          ...selectedFilters,
                          searchTerm: e.target.value
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
                  >
                    {selectedFilters[filterType]
                      ? options.find(opt => opt.value === selectedFilters[filterType])?.label
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
                            selectedFilters[filterType] === option.value ? "selected" : ""
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
                title="Reset Filters"
              >
                <RotateCcw size={18} />
              </button>
            </div>
            <div className="total-count-filter">
              (총 {(totalElements || 0).toLocaleString()}명)
            </div>
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
                      const nextPage = currentPage - 1;
                      if (nextPage >= 0) {
                        await onPageChange(nextPage);
                      }
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
              <span className="page-info">
                {currentPage + 1} / {totalPages}
              </span>
              <button
                onClick={async () => {
                  if (!isUpdating) {
                    setIsUpdating(true);
                    try {
                      await onPageChange(currentPage + 1);
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