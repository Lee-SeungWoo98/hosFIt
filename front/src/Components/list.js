import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, RotateCcw, Search } from 'lucide-react';  // 필터 초기화,검색 버튼 추가로 import했어요

const filterOptions = {
  gender: {
    label: 'Select Gender',
    options: [
      { value: '', label: 'All' },  // 초기값 옵션 추가
      { value: '남', label: '남자' },
      { value: '여', label: '여자' }
    ]
  },
  tas: {
    label: 'Select KTAS',
    options: [
      { value: '', label: 'All' },  // 초기값 옵션 추가
      { value: '1', label: 'Level 1' },
      { value: '2', label: 'Level 2' },
      { value: '3', label: 'Level 3' },
      { value: '4', label: 'Level 4' },
      { value: '5', label: 'Level 5' }
    ]
  },
  painScore: {
    label: 'Select Pain Score',
    options: [
      { value: '', label: 'All' },  // 초기값 옵션 추가
      ...Array.from({ length: 10 }, (_, i) => ({
        value: String(i + 1),
        label: String(i + 1)
      }))
    ]
  }
};

function List({ 
  searchTerm, 
  allPatients, 
  patients, 
  onFilteredPatientsUpdate, 
  ktasFilter, 
  labTests, 
  visitInfo, 
  fetchLabTests, 
  fetchVisitInfo, 
  onPatientSelect,
  onSearch
}) {
  const [patientList, setPatientList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null
  });
  
  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState(null);
  
  const [selectedFilters, setSelectedFilters] = useState({
    gender: '',
    tas: '',
    painScore: ''
  });
  // 필터 초기화 함수 추가
  const resetAllFilters = () => {
    setSelectedFilters({
      gender: '',
      tas: '',
      painScore: ''
    });
  };

  // Filter the patient list when filters change
  useEffect(() => {
    if (!patients) return;
  
    let filteredPatients = [...patients];
  
    // 검색어로 환자 이름과 번호 필터링 추가
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredPatients = filteredPatients.filter(patient => 
        patient.name.toLowerCase().includes(searchLower) || 
        patient.subject_id.toString().includes(searchLower)
      );
    }
  
    // 기존 필터 로직
    if (selectedFilters.gender) {
      filteredPatients = filteredPatients.filter(patient => 
        patient.gender === selectedFilters.gender
      );
    }
  
    if (selectedFilters.tas) {
      filteredPatients = filteredPatients.filter(patient => 
        patient.visits?.[0]?.tas === Number(selectedFilters.tas)
      );
    }
  
    if (selectedFilters.painScore) {
      filteredPatients = filteredPatients.filter(patient => 
        patient.visits?.[0]?.pain === Number(selectedFilters.painScore)
      );
    }
  
    setPatientList(filteredPatients);
    setCurrentPage(1);
  }, [patients, selectedFilters, searchTerm]); // searchTerm을 의존성 배열에 추가

  useEffect(() => {
    setIsLoading(true);
    if (patients && Array.isArray(patients)) {
      setPatientList(patients);
    } else if (patients) {
      setPatientList([patients]);
    }
    setCurrentPage(1);
    setIsLoading(false);
  }, [patients]);

  // KTAS 필터 변경 시 효과
  useEffect(() => {
    if (Array.isArray(ktasFilter) && ktasFilter.length > 0) {
      setSelectedFilters(prev => ({
        ...prev,
        tas: ktasFilter[0].toString() // 문자열로 변환
      }));
    } else {
      // KTAS 필터가 비어있을 때 (미사용 선택시나 같은 레벨 다시 클릭시) 초기화
      setSelectedFilters(prev => ({
        ...prev,
        tas: ''
      }));
    }
  }, [ktasFilter]);

  const patientsPerPage = 10;
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patientList.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(patientList.length / patientsPerPage);

  const changePage = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleFilterSelect = (type, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: value
    }));
    setOpenDropdown(null);
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    
    setSortConfig({ key, direction });
    
    if (direction === null) {
      setPatientList([...patients]);
      return;
    }

    const sortedList = [...patientList].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];
      
      // Handle special cases
      if (key === 'los_hours') {
        aValue = a.visits?.[0]?.los_hours || 0;
        bValue = b.visits?.[0]?.los_hours || 0;
      } else if (key === 'tas') {
        aValue = a.visits?.[0]?.tas || 0;
        bValue = b.visits?.[0]?.tas || 0;
      } else if (key === 'pain') {
        aValue = a.visits?.[0]?.pain || 0;
        bValue = b.visits?.[0]?.pain || 0;
      } else if (key === 'visit_date' && a.visits?.length && b.visits?.length) {
        aValue = new Date(a.visits[a.visits.length - 1].visit_date).getTime();
        bValue = new Date(b.visits[b.visits.length - 1].visit_date).getTime();
      }

      if (direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    setPatientList(sortedList);
  };

  const renderSortIcon = (columnName) => {
    if (sortConfig.key === columnName) {
      if (sortConfig.direction === 'asc') {
        return <ChevronUp className="sort-icon" size={14} />;
      } else if (sortConfig.direction === 'desc') {
        return <ChevronDown className="sort-icon" size={14} />;
      }
    }
    return null;
  };

  const clearFilter = (type) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: ''
    }));
  };

  const showPatientDetails = async (patient) => {
    setLoadingDetails(true);
    try {
      const [labTestsData, visitInfoData] = await Promise.all([
        fetchLabTests(patient.visits?.[0]?.stay_id),
        fetchVisitInfo(patient.subject_id)
      ]);

      if (!visitInfoData) {
        console.error("Failed to fetch visit info");
        return;
      }

      onPatientSelect(patient, labTestsData || [], visitInfoData);
    } catch (error) {
      console.error("Failed to fetch patient details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  if (isLoading) {
    return <div>Loading patients...</div>;
  }

  // Filter dropdowns rendering
  const renderFilterDropdowns = () => (
    <div className="filter-dropdowns">
      {/* 검색창 추가 */}
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
  
      {/* 기존 필터 옵션들 */}
      {Object.entries(filterOptions).map(([filterType, { label, options }]) => (
      <div key={filterType} className="dropdown-container">
        <button 
          className="dropdown-trigger"
          onClick={() => toggleDropdown(filterType)}
        >
          {selectedFilters[filterType] 
            ? options.find(opt => opt.value === selectedFilters[filterType])?.label 
            : label}
          <ChevronDown size={16} className={`dropdown-arrow ${openDropdown === filterType ? 'open' : ''}`} />
        </button>
        {openDropdown === filterType && (
          <div className="dropdown-content">
            {options.map(option => (
              <div
                key={option.value}
                className={`dropdown-item ${selectedFilters[filterType] === option.value ? 'selected' : ''}`}
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
        <span className="total-count">(총 {patientList.length}명)</span>
      </div>

      <div className="content-area">
        <div className="table-container">
          {renderFilterDropdowns()}

          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('subject_id')} className="sortable-header">
                  환자번호 {renderSortIcon('subject_id')}
                </th>
                <th onClick={() => handleSort('name')} className="sortable-header">
                  이름 {renderSortIcon('name')}
                </th>
                <th onClick={() => handleSort('gender')} className="sortable-header">
                  성별 {renderSortIcon('gender')}
                </th>
                <th onClick={() => handleSort('age')} className="sortable-header">
                  나이 {renderSortIcon('age')}
                </th>
                <th onClick={() => handleSort('pain')} className="sortable-header">
                  통증 점수 {renderSortIcon('pain')}
                </th>
                <th onClick={() => handleSort('visit_date')} className="sortable-header">
                  입실 시간 {renderSortIcon('visit_date')}
                </th>
                <th onClick={() => handleSort('los_hours')} className="sortable-header">
                  체류 시간 {renderSortIcon('los_hours')}
                </th>
                <th onClick={() => handleSort('tas')} className="sortable-header">
                  KTAS {renderSortIcon('tas')}
                </th>
                <th onClick={() => handleSort('ai_tas')} className="sortable-header">
                  AI_TAS {renderSortIcon('ai_tas')}
                </th>
                <th>상세 정보</th>
              </tr>
            </thead>
            <tbody>
              {patientList.length > 0 ? (
                currentPatients.map((patient) => (
                  <tr key={patient.subject_id}>
                    <td>{patient.subject_id}</td>
                    <td>{patient.name}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.age}</td>
                    <td>{patient.visits?.[0]?.pain || '-'}</td>
                    <td>
                      {patient.visits?.length > 0 ? (
                        <>
                          {new Date(patient.visits[patient.visits.length - 1].visit_date).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          }).replace(/\. /g, '.').slice(0, -1)} (KST)
                          <br />
                          <span>
                            {new Date(patient.visits[patient.visits.length - 1].visit_date).toLocaleTimeString('ko-KR', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false
                            })}
                          </span>
                        </>
                      ) : '-'}
                    </td>
                    <td>{patient.visits?.[patient.visits.length - 1]?.los_hours || '-'}시간</td>
                    <td>{patient.visits?.[0]?.tas || '-'}</td>
                    <td>{patient.ai_tas || '-'}</td>
                    <td>
                      <button 
                        onClick={() => showPatientDetails(patient)} 
                        className="details-button"
                        disabled={loadingDetails}
                      >
                        {loadingDetails ? '로딩 중...' : '상세 보기'}
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

          {patientList.length > 0 && (
            <div className="pagination">
              <button 
                onClick={() => changePage('prev')}
                disabled={currentPage === 1}
                className="pagination-arrow"
              >
                <ChevronLeft />
              </button>
              <span className="page-info">{currentPage} / {totalPages}</span>
              <button 
                onClick={() => changePage('next')}
                disabled={currentPage === totalPages}
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