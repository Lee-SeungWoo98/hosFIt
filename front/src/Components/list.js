/**
 * List.js
 * 환자 목록 컴포넌트
 * 정렬, 필터링, 검색 기능을 제공하는 환자 데이터 테이블
 */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Search,
} from "lucide-react";
import { debounce } from 'lodash';

// =========== 상수 정의 ===========
const SORT_DIRECTIONS = {
  NONE: "none",
  ASC: "asc",
  DESC: "desc",
};

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


const INITIAL_SORT = {
  key: "visitDate",
  direction: SORT_DIRECTIONS.DESC,
  clickCount: 0,
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
  const [sortConfig, setSortConfig] = useState(INITIAL_SORT);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    gender: "",
    tas: "",
    painScore: "",
  });
  const memoizedPatients = useMemo(() => patients, [patients]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const debouncedSearch = useMemo(
    () => debounce((value) => {
      onSearch(value);
    }, 500),
    [onSearch]
  );

  // cleanup 함수 추가
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // =========== Effects ===========

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // =========== 이벤트 핸들러 ===========
  /**
   * 정렬 처리 함수
   */
  const handleSort = useCallback(
    async (key) => {
      let newDirection = SORT_DIRECTIONS.DESC;
      let newClickCount = 1;
      let newKey = key;

      if (sortConfig.key === key) {
        newClickCount = (sortConfig.clickCount + 1) % 3;

        switch (newClickCount) {
          case 0: // 세 번째 클릭: 최신순으로 리셋
            newKey = "visitDate";
            newDirection = SORT_DIRECTIONS.DESC;
            break;
          case 1: // 첫 번째 클릭: 내림차순
            newDirection = SORT_DIRECTIONS.DESC;
            break;
          case 2: // 두 번째 클릭: 오름차순
            newDirection = SORT_DIRECTIONS.ASC;
            break;
        }
      }

      setIsUpdating(true);
      setSortConfig({
        key: newKey,
        direction: newDirection,
        clickCount: newClickCount,
      });

      try {
        await onFilteredPatientsUpdate({
          ...selectedFilters,
          sort: {
            key: newKey,
            direction: newDirection,
          },
        });
      } finally {
        setIsUpdating(false);
      }
    },
    [sortConfig, selectedFilters, onFilteredPatientsUpdate]
  );

  /**
   * 필터 선택 처리 함수
   */
  const handleFilterSelect = useCallback(async (type, value) => {
    setIsUpdating(true);
    try {
      const processedValue = value === "" ? "" : Number(value);
      
      const newFilters = {
        ...selectedFilters,
        [type]: processedValue
      };
      setSelectedFilters(newFilters);
      // 페이지 번호를 명시적으로 전달
      await onFilteredPatientsUpdate(0, newFilters);
    } finally {
      setIsUpdating(false);
      setOpenDropdown(null);
    }
  }, [selectedFilters, onFilteredPatientsUpdate]);

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
        sort: INITIAL_SORT,
      };
      setSelectedFilters(resetFilters);
      setSortConfig(INITIAL_SORT);
      setSearchInputValue(""); // 검색어도 초기화
      onSearch(""); // 검색어 초기화를 서버에 반영

      // 모든 필터 조건을 제거하고 초기 상태로
      await onFilteredPatientsUpdate({
        sort: INITIAL_SORT,
      });
    } finally {
      setIsUpdating(false);
    }
  }, [onFilteredPatientsUpdate, onSearch]);

  /**
   * 드롭다운 토글 함수
   */
  const toggleDropdown = useCallback((dropdownName) => {
    setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  }, []);

  /**
   * 환자 상세정보 조회 함수
   */
  const showPatientDetails = useCallback(
    async (patient) => {
      setLoadingDetails(true);
      try {
        const visitInfoResponse = await fetchVisitInfo(patient.subjectId);
        if (!visitInfoResponse?.visits?.length) {
          throw new Error("방문 정보가 없습니다.");
        }

        const latestVisit =
          visitInfoResponse.visits[visitInfoResponse.visits.length - 1];
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
    },
    [fetchVisitInfo, fetchLabTests, onPatientSelect]
  );

  // =========== 렌더링 함수 ===========
  /**
   * 정렬 아이콘 렌더링
   */
  const renderSortIcon = useCallback(
    (columnName) => {
      if (sortConfig.key === columnName) {
        if (sortConfig.direction === SORT_DIRECTIONS.ASC) {
          return <ChevronUp className="sort-icon" size={14} />;
        } else if (sortConfig.direction === SORT_DIRECTIONS.DESC) {
          return <ChevronDown className="sort-icon" size={14} />;
        }
      }
      return null;
    },
    [sortConfig]
  );

  /**
   * 필터 드롭다운 렌더링
   */
  const renderFilterDropdowns = useCallback(
    () => (
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
                onChange={(e) => {
                  setSearchInputValue(e.target.value);
                  debouncedSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onSearch(searchInputValue);
                  }
                }}
                className="patient-search-input"
              />
            </div>
          </div>

          {/* 필터 드롭다운 */}
          {Object.entries(FILTER_OPTIONS).map(
            ([filterType, { label, options }]) => (
              <div key={filterType} className="dropdown-container">
                <button
                  className={`dropdown-trigger ${
                    openDropdown === filterType ? "active" : ""
                  }`}
                  onClick={() => toggleDropdown(filterType)}
                >
                  {selectedFilters[filterType]
                    ? options.find(
                        (opt) => opt.value === selectedFilters[filterType]
                      )?.label
                    : label}
                  <ChevronDown
                    size={16}
                    className={`dropdown-arrow ${
                      openDropdown === filterType ? "open" : ""
                    }`}
                  />
                </button>
                {openDropdown === filterType && (
                  <div className="dropdown-content">
                    {options.map((option) => (
                      <div
                        key={option.value}
                        className={`dropdown-item ${
                          selectedFilters[filterType] === option.value
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          handleFilterSelect(filterType, option.value)
                        }
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          )}

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
    ),
    [
      searchInputValue,
      openDropdown,
      selectedFilters,
      totalElements,
      onSearch,
      handleFilterSelect,
      resetAllFilters,
      toggleDropdown,
    ]
  );

  // 환자 행 렌더링 부분 수정
const renderPatientRow = useCallback((patient) => (
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
    <td>{patient.ai_tas || "-"}</td>
    <td className="abnormal-count-cell">
      {calculateAbnormalCount(patient.labTests, patient.gender)}건
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
), [isUpdating, loadingDetails, formatDate, formatTime, showPatientDetails]);

  const calculateAbnormalCount = useCallback((labTests, gender) => {
    // console.log("Calculating abnormal count:", { labTests, gender });

    if (!labTests) {
      console.log("No labTests data");
      return 0;
    }

    let abnormalCount = 0;

    try {
      // labTests 데이터 구조 확인
      // console.log("labTests structure:", JSON.stringify(labTests, null, 2));

      Object.entries(labTests).forEach(([category, tests]) => {
        if (Array.isArray(tests) && tests.length > 0) {
          tests.forEach((test) => {
            Object.entries(test).forEach(([key, value]) => {
              if (ranges[key] && value !== null) {
                const isNormal = checkNormalRange(key, value, gender);
                if (isNormal === false) {
                  console.log("Abnormal found:", { key, value, gender });
                  abnormalCount++;
                }
              }
            });
          });
        }
      });

      // console.log("Final abnormal count:", abnormalCount);
      return abnormalCount;
    } catch (error) {
      console.error("Error calculating abnormal count:", error);
      return 0;
    }
  }, []);

  const ranges = {
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

  // 정상 범위 체크 함수
  const checkNormalRange = (category, value, gender) => {
    const range = ranges[category];
    if (!range) return null;

    const numValue = parseFloat(value);

    if (range.male && range.female) {
      const genderRange = gender === "남" ? range.male : range.female;
      return numValue >= genderRange[0] && numValue <= genderRange[1];
    }

    return numValue >= range[0] && numValue <= range[1];
  };

  // =========== 메인 렌더링 ===========
  return (
    <div className="page-wrapper">
      <style>
        {`
          .table-container {
            transition: opacity 0.3s ease;
            position: relative;
          }
          .patient-row {
            transition: opacity 0.3s ease;
          }
          .filter-dropdowns {
            transition: opacity 0.3s ease;
          }
          .dropdown-content {
            transition: all 0.2s ease;
          }
          .sortable-header {
            cursor: pointer;
            user-select: none;
            transition: background-color 0.2s ease;
          }
          .sortable-header:hover {
            background-color: rgba(0, 0, 0, 0.05);
          }
          .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: ${loading ? 1 : 0};
            pointer-events: ${loading ? "auto" : "none"};
            transition: opacity 0.3s ease;
          }
        `}
      </style>

      <div className="content-area">
        {/* 위치 탭 */}
        <div className="location-tabs">
          {["all", "icu", "ward", "discharge"].map((tab) => (
            <button
              key={tab}
              className={`location-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* 테이블 컨테이너 */}
        <div
          className="table-container"
          style={{
            position: "relative",
            opacity: isUpdating ? 0.6 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          {renderFilterDropdowns()}

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
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="sortable-header"
                  >
                    {label} {renderSortIcon(key)}
                  </th>
                ))}
                <th>상세 정보</th>
              </tr>
            </thead>
            <tbody>
              {memoizedPatients.length > 0 ? (
                memoizedPatients.map(renderPatientRow)
              ) : (
                <tr>
                  <td colSpan="10" className="no-data-message">
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
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="pagination-arrow"
              >
                <ChevronLeft />
              </button>
              <span className="page-info">
                {currentPage + 1} / {totalPages}
              </span>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage + 1 >= totalPages}
                className="pagination-arrow"
              >
                <ChevronRight />
              </button>
            </div>
          )}

          {/* 로딩 오버레이는 데이터 업데이트 중에만 표시 */}
          {isUpdating && (
            <div
              className="loading-overlay"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(255, 255, 255, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
                transition: "opacity 0.3s ease",
              }}
            >
              <div className="loading-spinner" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(List);
