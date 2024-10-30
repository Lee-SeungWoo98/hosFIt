import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Search,
} from "lucide-react";

const filterOptions = {
  gender: {
    label: "Select Gender",
    options: [
      { value: "", label: "All" },
      { value: "남", label: "남자" },
      { value: "여", label: "여자" },
    ],
  },
  tas: {
    label: "Select KTAS",
    options: [
      { value: "", label: "All" },
      { value: "1", label: "Level 1" },
      { value: "2", label: "Level 2" },
      { value: "3", label: "Level 3" },
      { value: "4", label: "Level 4" },
      { value: "5", label: "Level 5" },
    ],
  },
  painScore: {
    label: "Select Pain Score",
    options: [
      { value: "", label: "All" },
      ...Array.from({ length: 10 }, (_, i) => ({
        value: String(i + 1),
        label: String(i + 1),
      })),
    ],
  },
};

function List({
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
  onPageChange,
}) {
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    gender: "",
    tas: "",
    painScore: "",
  });

  const resetAllFilters = () => {
    const resetFilters = {
      gender: "",
      tas: "",
      painScore: "",
    };
    setSelectedFilters(resetFilters);
    onFilteredPatientsUpdate(resetFilters);
  };

  const handleFilterSelect = (type, value) => {
    const newFilters = {
      ...selectedFilters,
      [type]: value,
    };
    setSelectedFilters(newFilters);
    onFilteredPatientsUpdate(newFilters);
    setOpenDropdown(null);
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null;
    }

    setSortConfig({ key, direction });

    if (direction === null) {
      onPageChange(currentPage);
      return;
    }

    // 정렬은 현재 페이지의 데이터에 대해서만 수행
    const sortedList = [...patients].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      if (key === "losHours") {
        aValue = a.visits?.[0]?.losHours || 0;
        bValue = b.visits?.[0]?.losHours || 0;
      } else if (key === "tas") {
        aValue = a.visits?.[0]?.tas || 0;
        bValue = b.visits?.[0]?.tas || 0;
      } else if (key === "pain") {
        aValue = a.visits?.[0]?.pain || 0;
        bValue = b.visits?.[0]?.pain || 0;
      } else if (key === "visitDate" && a.visits?.length && b.visits?.length) {
        aValue = new Date(a.visits[a.visits.length - 1].visitDate).getTime();
        bValue = new Date(b.visits[b.visits.length - 1].visitDate).getTime();
      }

      if (direction === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    onFilteredPatientsUpdate({ ...selectedFilters, sort: { key, direction } });
  };

  const renderSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      if (sortConfig.direction === "asc") {
        return <ChevronUp className="sort-icon" size={14} />;
      } else if (sortConfig.direction === "desc") {
        return <ChevronDown className="sort-icon" size={14} />;
      }
    }
    return null;
  };

  const showPatientDetails = async (patient) => {
    console.log("상세보기 시작 - 환자 데이터:", patient);
    setLoadingDetails(true);
    
    try {
      // 1. 최신 방문의 stayId 가져오기
      const visits = patient.visits || [];
      const latestVisit = visits[visits.length - 1];
      const stayId = latestVisit?.stayId;
  
      console.log("최신 방문 정보:", latestVisit);
      console.log("stay_id:", stayId);
  
      if (!stayId) {
        throw new Error("Stay ID not found");
      }
  
      // 2. Lab Tests와 Visit Info 동시 조회
      const [labTestsResponse, visitInfoResponse] = await Promise.all([
        fetchLabTests(stayId),
        fetchVisitInfo(patient.subjectId)
      ]);
  
      console.log("조회된 데이터:", {
        labTests: labTestsResponse,
        visitInfo: visitInfoResponse
      });
  
      // 3. 데이터 유효성 검증
      if (!Array.isArray(labTestsResponse)) {
        throw new Error("Invalid lab tests data format");
      }
  
      if (!visitInfoResponse || !Array.isArray(visitInfoResponse.visits)) {
        throw new Error("Invalid visit info data format");
      }
  
      // 4. Patient 컴포넌트에 전달할 기본 데이터 구성
      const patientData = {
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        subjectId: patient.subjectId,
        visits: visitInfoResponse.visits.map(visit => ({
          stayId: visit.stayId,
          visitDate: visit.visitDate,
          losHours: parseFloat(visit.losHours || 0),
          pain: parseInt(visit.pain || 0),
          tas: parseInt(visit.tas || 0),
          staystatus: parseInt(visit.staystatus || 0),
          vitalSigns: (visit.vitalSigns || []).map(sign => ({
            chartTime: sign.chartTime,
            heartrate: parseFloat(sign.heartrate || 0),
            resprate: parseFloat(sign.resprate || 0),
            o2sat: parseFloat(sign.o2sat || 0),
            sbp: parseFloat(sign.sbp || 0),
            dbp: parseFloat(sign.dbp || 0),
            temperature: parseFloat(sign.temperature || 0)
          }))
        }))
      };
  
      // 5. 데이터 전달
      onPatientSelect(patientData, labTestsResponse[0], visitInfoResponse);
  
    } catch (error) {
      console.error("상세 정보 조회 실패:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const renderFilterDropdowns = () => (
    <div className="filter-dropdowns">
      <div className="dropdown-container search-container">
        <div className="dropdown-trigger search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Patient ID or Name"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="patient-search-input"
          />
        </div>
      </div>

      {Object.entries(filterOptions).map(([filterType, { label, options }]) => (
        <div key={filterType} className="dropdown-container">
          <button
            className="dropdown-trigger"
            onClick={() => toggleDropdown(filterType)}
          >
            {selectedFilters[filterType]
              ? options.find((opt) => opt.value === selectedFilters[filterType])
                  ?.label
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
                  onClick={() => handleFilterSelect(filterType, option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <button
        className="reset-filters-button"
        onClick={resetAllFilters}
        title="Reset Filters"
      >
        <RotateCcw size={18} />
      </button>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="breadcrumb">
        <a href="/">Home</a>
      </div>

      <div className="page-header">
        <h1 className="page-title">
          <span className="breadcrumb-separator">&lt;</span>
          응급실 환자 리스트
        </h1>
        <span className="total-count">(총 {patients.length}명)</span>
      </div>

      <div className="content-area">
        <div className="table-container">
          {renderFilterDropdowns()}

          <table>
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("subjectId")}
                  className="sortable-header"
                >
                  PID {renderSortIcon("subjectId")}
                </th>
                <th
                  onClick={() => handleSort("icd")}
                  className="sortable-header"
                >
                  ICD {renderSortIcon("icd")}
                </th>
                <th
                  onClick={() => handleSort("name")}
                  className="sortable-header"
                >
                  이름 {renderSortIcon("name")}
                </th>
                <th
                  onClick={() => handleSort("gender")}
                  className="sortable-header"
                >
                  성별 {renderSortIcon("gender")}
                </th>
                <th
                  onClick={() => handleSort("age")}
                  className="sortable-header"
                >
                  나이 {renderSortIcon("age")}
                </th>
                <th
                  onClick={() => handleSort("visitDate")}
                  className="sortable-header"
                >
                  입실 시간 {renderSortIcon("visitDate")}
                </th>
                <th
                  onClick={() => handleSort("pain")}
                  className="sortable-header"
                >
                  통증 점수 {renderSortIcon("pain")}
                </th>
                <th
                  onClick={() => handleSort("tas")}
                  className="sortable-header"
                >
                  KTAS {renderSortIcon("tas")}
                </th>
                <th
                  onClick={() => handleSort("ai_tas")}
                  className="sortable-header"
                >
                  AI_TAS {renderSortIcon("ai_tas")}
                </th>
                <th>상세 정보</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <tr key={patient.subjectId}>
                    <td>{patient.subjectId}</td>
                    <td>{patient.icd}</td>
                    <td>{patient.name}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.age}</td>
                    <td>
                      {patient.visits?.length > 0 ? (
                        <>
                          {new Date(
                            patient.visits[patient.visits.length - 1].visitDate
                          )
                            .toLocaleDateString("ko-KR", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })
                            .replace(/\. /g, ".")
                            .slice(0, -1)}{" "}
                          <br />
                          <span>
                            {new Date(
                              patient.visits[
                                patient.visits.length - 1
                              ].visitDate
                            ).toLocaleTimeString("ko-KR", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })}
                          </span>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{patient.visits?.[0]?.pain || "-"}</td>
                    <td>{patient.visits?.[0]?.tas || "-"}</td>
                    <td>{patient.ai_tas || "-"}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="no-data-message">
                    조건에 해당하는 환자가 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {patients.length > 0 && (
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
        </div>
      </div>
    </div>
  );
}

export default List;
