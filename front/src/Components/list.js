import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// 필터 옵션 레이블 매핑 추가
const filterLabels = {
  gender: { 
    name: '성별',
    values: { '남': '남자', '여': '여자' }
  },
  pregnancystatus: {
    name: '임신 여부',
    values: { '0': 'No', '1': 'Yes' }
  },
  tas: {
    name: 'KTAS',
    values: { '1': 'Level 1', '2': 'Level 2', '3': 'Level 3', '4': 'Level 4', '5': 'Level 5' }
  },
  los_hours: {
    name: '체류 시간',
    values: { 'asc': '오름차순', 'desc': '내림차순' }
  }
};

function List({ searchTerm, allPatients, patients, onFilteredPatientsUpdate }) {
  const navigate = useNavigate();
  const [patientList, setPatientList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedFilters, setSelectedFilters] = useState({
    gender: [],
    pregnancystatus: [],
    tas: [],
    los_hours: 'none'
  });

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

  const patientsPerPage = 5;
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

  const toggleFilterOptions = () => {
    setShowFilterOptions(!showFilterOptions);
  };

  const handleFilterChange = (type, value) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      
      if (type === 'los_hours') {
        newFilters.los_hours = value;
      } else {
        if (prev[type].includes(value)) {
          newFilters[type] = prev[type].filter(item => item !== value);
        } else {
          newFilters[type] = [...prev[type], value];
        }
      }
      
      return newFilters;
    });
  };

  const removeFilter = (type, value) => {
    const newFilters = { ...selectedFilters };
    
    if (type === 'los_hours') {
      newFilters.los_hours = 'none';
    } else {
      newFilters[type] = newFilters[type].filter(item => item !== value);
    }
    
    setSelectedFilters(newFilters);
    onFilteredPatientsUpdate(newFilters);
  };

  const handleApplyFilters = () => {
    onFilteredPatientsUpdate(selectedFilters);
    setShowFilterOptions(false);
  };

  const showPatientDetails = (patient) => {
    navigate('/patient', { state: { patientData: patient } });
  };

  // 수정된 renderActiveFilters 함수
  const renderActiveFilters = () => {
    return (
      <div className="active-filters">
        {Object.entries(selectedFilters).map(([type, value]) => {
          if (type === 'los_hours' && value !== 'none') {
            return (
              <div key={`${type}-${value}`} className="filter-tag">
                <span>{filterLabels[type].name}: {filterLabels[type].values[value]}</span>
                <button
                  className="filter-tag-remove"
                  onClick={() => removeFilter(type, value)}
                >
                  ×
                </button>
              </div>
            );
          }
          
          if (Array.isArray(value) && value.length > 0) {
            return value.map(item => (
              <div key={`${type}-${item}`} className="filter-tag">
                <span>{filterLabels[type].name}: {filterLabels[type].values[item]}</span>
                <button
                  className="filter-tag-remove"
                  onClick={() => removeFilter(type, item)}
                >
                  ×
                </button>
              </div>
            ));
          }
          
          return null;
        })}
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading patients...</div>;
  }

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
          <div className="filter-section">
            <button className="filter-button" onClick={toggleFilterOptions}>
              환자 옵션
            </button>
            {renderActiveFilters()}
          </div>

          {showFilterOptions && (
            <div className="filter-options-panel">
              <div className="filter-options-container">
                <div className="filter-group">
                  <label className="filter-label">성별</label>
                  <div className="filter-choices">
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedFilters.gender.includes('남')}
                        onChange={() => handleFilterChange('gender', '남')}
                      />
                      남자
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedFilters.gender.includes('여')}
                        onChange={() => handleFilterChange('gender', '여')}
                      />
                      여자
                    </label>
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">임신 여부</label>
                  <div className="filter-choices">
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedFilters.pregnancystatus.includes('0')}
                        onChange={() => handleFilterChange('pregnancystatus', '0')}
                      />
                      No
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedFilters.pregnancystatus.includes('1')}
                        onChange={() => handleFilterChange('pregnancystatus', '1')}
                      />
                      Yes
                    </label>
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">KTAS</label>
                  <div className="filter-choices">
                    {[1, 2, 3, 4, 5].map(level => (
                      <label key={level}>
                        <input
                          type="checkbox"
                          checked={selectedFilters.tas.includes(String(level))}
                          onChange={() => handleFilterChange('tas', String(level))}
                        />
                        Level {level}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label className="filter-label">체류 시간</label>
                  <div className="filter-choices">
                    <label>
                      <input
                        type="radio"
                        checked={selectedFilters.los_hours === 'none'}
                        onChange={() => handleFilterChange('los_hours', 'none')}
                      />
                      기본
                    </label>
                    <label>
                      <input
                        type="radio"
                        checked={selectedFilters.los_hours === 'asc'}
                        onChange={() => handleFilterChange('los_hours', 'asc')}
                      />
                      오름차순
                    </label>
                    <label>
                      <input
                        type="radio"
                        checked={selectedFilters.los_hours === 'desc'}
                        onChange={() => handleFilterChange('los_hours', 'desc')}
                      />
                      내림차순
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="filter-actions">
                <button className="filter-apply-button" onClick={handleApplyFilters}>
                  확인
                </button>
              </div>
            </div>
          )}

          <table>
            <thead>
              <tr>
                <th>환자번호</th>
                <th>이름</th>
                <th>성별</th>
                <th>생년월일</th>
                <th>나이</th>
                <th>주소</th>
                <th>임신 여부</th>
                <th>통증 점수</th>
                <th>체류 시간</th>
                <th>KTAS</th>
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
                    <td>{patient.birthdate}</td>
                    <td>{patient.age}</td>
                    <td>{patient.address}</td>
                    <td>{patient.pregnancystatus === "0" ? "N" : "Y"}</td>
                    <td>{patient.visits?.[0]?.pain || '-'}</td>
                    <td>{patient.visits?.[0]?.los_hours || '-'}시간</td>
                    <td>{patient.visits?.[0]?.tas || '-'}</td>
                    <td>
                      <button 
                        onClick={() => showPatientDetails(patient)} 
                        className="details-button"
                      >
                        상세 보기
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="no-data-message">
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