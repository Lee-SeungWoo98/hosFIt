import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 hook 추가
import { ChevronLeft, ChevronRight } from 'lucide-react'; // 페이지네이션 화살표 아이콘 추가


function List({ searchTerm, patients }) {
  const navigate = useNavigate();
  const [patientList, setPatientList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  
  // 필터 상태 관리
  const [selectedFilters, setSelectedFilters] = useState({
    subject_id: { active: false, direction: 'asc' },
    name: { active: false, direction: 'asc' },
    gender: { active: false, values: [] },
    birthdate: { active: false, direction: 'asc' },
    age: { active: false, direction: 'asc' },
    address: { active: false, direction: 'asc' },
    pregnancystatus: { active: false, values: [] },
    pain: { active: false, direction: 'asc' },
    los_hours: { active: false, direction: 'asc' },
    tas: { active: false, values: [] }
  });

  // 환자 데이터 초기화
  useEffect(() => {
    if (patients && Array.isArray(patients)) {
      setPatientList(patients);
    } else if (patients) {
      setPatientList([patients]);
    }
    setCurrentPage(1); // 새 데이터를 받으면 첫 페이지로 이동
  }, [patients]);

  // 필터 적용 로직
  useEffect(() => {
    if (!patientList.length) return;

    let filteredResults = [...patientList];
    
    if (Object.values(selectedFilters).some(filter => filter.active)) {
      // 필터링 로직
      filteredResults = filteredResults.filter(patient => {
        return Object.entries(selectedFilters).every(([key, filter]) => {
          if (!filter.active) return true;
          
          if (filter.values && filter.values.length > 0) {
            if (key === 'tas') {
              return filter.values.includes(String(patient.visits?.[0]?.tas));
            } else if (key === 'pain') {
              return filter.values.includes(String(patient.visits?.[0]?.pain));
            }
            return filter.values.includes(String(patient[key]));
          }
          return true;
        });
      });

      // 정렬 로직
      filteredResults.sort((a, b) => {
        for (const [key, filter] of Object.entries(selectedFilters)) {
          if (filter.active && filter.direction) {
            let aValue, bValue;
            
            if (key === 'tas') {
              aValue = a.visits?.[0]?.tas;
              bValue = b.visits?.[0]?.tas;
            } else if (key === 'los_hours') {
              aValue = parseFloat(a.visits?.[0]?.los_hours || 0);
              bValue = parseFloat(b.visits?.[0]?.los_hours || 0);
            } else if (key === 'pain') {
              aValue = parseFloat(a.visits?.[0]?.pain || 0);
              bValue = parseFloat(b.visits?.[0]?.pain || 0);
            } else {
              aValue = a[key];
              bValue = b[key];
            }
            
            if (filter.direction === 'asc') {
              return aValue > bValue ? 1 : -1;
            } else {
              return aValue < bValue ? 1 : -1;
            }
          }
        }
        return 0;
      });
    }

    setPatientList(filteredResults);
  }, [selectedFilters]);

  // 페이지네이션 로직
  const patientsPerPage = 5;
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patientList.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(patientList.length / patientsPerPage);

  // 페이지 이동 함수 - 화살표 네비게이션 지원
  const changePage = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // 필터 옵션 토글
  const toggleFilterOptions = () => {
    setShowFilterOptions(!showFilterOptions);
  };

  // 필터 변경 핸들러
  const handleFilterChange = (field, value, type = 'direction') => {
    setSelectedFilters(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        active: true,
        [type]: type === 'direction' ? value :
          prev[field].values?.includes(value) ?
          prev[field].values.filter(v => v !== value) :
          [...(prev[field].values || []), value]
      }
    }));
  };

  // 환자 상세정보 페이지로 이동
  const showPatientDetails = (patient) => {
    navigate('/patient', { state: { patientData: patient } });
  };

  if (!patientList.length) {
    return <div>Loading patients...</div>;
  }

  return (
    <div className="page-wrapper">
      {/* 수정된 브레드크럼 구조 */}
      <div className="breadcrumb">
        <a href="/">Home</a>
      </div>
      
      {/* 수정된 헤더 구조 */}
      <div className="page-header">
        <h1 className="page-title">
          <span className="breadcrumb-separator">&lt;</span>
          응급실 환자 리스트
        </h1>
        <span className="total-count">(총 {patientList.length}명)</span>
      </div>

      <div className="content-area">
        <div className="table-container">
          <div className="table-header">
            <button className="filter-button" onClick={toggleFilterOptions}>
              환자 옵션
            </button>
          </div>

          {/* 모듈화된 필터 옵션 패널 */}
          {showFilterOptions && (
            <div className="filter-options-panel">
              <FilterOptions
                selectedFilters={selectedFilters}
                handleFilterChange={handleFilterChange}
              />
            </div>
          )}

          {/* 환자 목록 테이블 */}
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
                <th>TAS</th>
                <th>상세 정보</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.map((patient) => (
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
              ))}
            </tbody>
          </table>

          {/* 새로운 화살표 페이지네이션 */}
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
        </div>
      </div>
    </div>
  );
}

// 필터 옵션 컴포넌트 - 모듈화를 통한 유지보수성 개선
const FilterOptions = ({ selectedFilters, handleFilterChange }) => {
  // 필터 옵션 설정
  const filterCategories = {
    sorting: {
      title: "정렬 옵션",
      options: {
        subject_id: '환자번호',
        name: '이름',
        age: '나이',
        birthdate: '생년월일',
        los_hours: '체류 시간'
      }
    },
    filtering: {
      title: "필터 옵션",
      options: {
        gender: {
          label: '성별',
          values: [
            { value: '여', label: '여자' },
            { value: '남', label: '남자' }
          ]
        },
        pregnancystatus: {
          label: '임신 여부',
          values: [
            { value: '0', label: 'No' },
            { value: '1', label: 'Yes' }
          ]
        },
        tas: {
          label: 'TAS',
          values: [1, 2, 3, 4, 5].map(level => ({
            value: level.toString(),
            label: `Level ${level}`
          }))
        }
      }
    }
  };

  return (
    <div className="filter-options-container">
      {Object.entries(filterCategories).map(([categoryKey, category]) => (
        <div key={categoryKey} className="filter-section">
          <h3>{category.title}</h3>
          <div className="filter-options-grid">
            {Object.entries(category.options).map(([optionKey, option]) => (
              <div key={optionKey} className="filter-option">
                {categoryKey === 'sorting' ? (
                  <SortingOption
                    field={optionKey}
                    label={option}
                    filter={selectedFilters[optionKey]}
                    onChange={handleFilterChange}
                  />
                ) : (
                  <FilteringOption
                    field={optionKey}
                    label={option.label}
                    values={option.values}
                    filter={selectedFilters[optionKey]}
                    onChange={handleFilterChange}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// 정렬 옵션 컴포넌트
const SortingOption = ({ field, label, filter, onChange }) => (
  <div className="sorting-option">
    <label>
      <input
        type="checkbox"
        checked={filter.active}
        onChange={() => onChange(field, 'asc')}
      />
      {label}
    </label>
    {filter.active && (
      <div className="direction-options">
        <label>
          <input
            type="radio"
            checked={filter.direction === 'asc'}
            onChange={() => onChange(field, 'asc')}
          />
          오름차순
        </label>
        <label>
          <input
            type="radio"
            checked={filter.direction === 'desc'}
            onChange={() => onChange(field, 'desc')}
          />
          내림차순
        </label>
      </div>
    )}
  </div>
);

// 필터링 옵션 컴포넌트
const FilteringOption = ({ field, label, values, filter, onChange }) => (
  <div className="filtering-option">
    <label>
      <input
        type="checkbox"
        checked={filter.active}
        onChange={() => onChange(field, [], 'values')}
      />
      {label}
    </label>
    {filter.active && (
      <div className="value-options">
        {values.map(({ value, label }) => (
          <label key={value}>
            <input
              type="checkbox"
              value={value}
              checked={filter.values.includes(value)}
              onChange={(e) => onChange(field, e.target.value, 'values')}
            />
            {label}
          </label>
        ))}
      </div>
    )}
  </div>
);

export default List;