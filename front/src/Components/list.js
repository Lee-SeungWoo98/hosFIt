import React, { useState, useEffect } from "react";

function List({ searchTerm, patients }) {
  const [patientList, setPatientList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
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

  // Props로 받은 patients 데이터 처리
  useEffect(() => {
    console.log("Received patients data:", patients);
    if (patients && Array.isArray(patients)) {
      setPatientList(patients);
    } else if (patients) {
      // 단일 환자 데이터인 경우 배열로 변환
      setPatientList([patients]);
    }
    setCurrentPage(1); // 새 데이터를 받으면 첫 페이지로 이동
  }, [patients]);

  // 필터 적용
  useEffect(() => {
    if (!patientList.length) return;

    let filteredResults = [...patientList];
    
    if (Object.values(selectedFilters).some(filter => filter.active)) {
      // 필터링
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

      // 정렬
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
  }, [selectedFilters, patientList]);

  const patientsPerPage = 5;
  const pageNumbersToShow = 5;
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patientList.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(patientList.length / patientsPerPage);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - Math.floor(pageNumbersToShow / 2));
    let endPage = Math.min(totalPages, startPage + pageNumbersToShow - 1);

    if (endPage - startPage + 1 < pageNumbersToShow) {
      startPage = Math.max(1, endPage - pageNumbersToShow + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const toggleFilterOptions = () => {
    setShowFilterOptions(!showFilterOptions);
  };

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

  const showPatientDetails = (patient) => {
    console.log("Selected patient details:", patient);
    // 상세 정보 표시 로직 구현
  };

  if (!patientList.length) {
    return <div>Loading patients...</div>;
  }

  return (
    <>
      <div className="page-header">
        <div className="breadcrumb">
          <a href="/">Home</a>
          <span> / </span>
          <span className="current">Main</span>
        </div>
        <h1 className="page-title">응급실 환자 리스트</h1>
      </div>

      <div className="content-area">
        <div className="table-container">
          <div className="table-header">
            <span>(총 {patientList.length}명)</span>
            <button className="filter-button" onClick={toggleFilterOptions}>
              필터 옵션
            </button>
          </div>

          {showFilterOptions && (
            <div className="filter-options-panel">
              <div className="filter-section">
                <h3>정렬 옵션</h3>
                {Object.entries({
                  subject_id: '환자번호',
                  name: '이름',
                  age: '나이',
                  birthdate: '생년월일',
                  los_hours: '체류 시간'
                }).map(([field, label]) => (
                  <div key={field} className="filter-option">
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedFilters[field].active}
                        onChange={() => handleFilterChange(field, 'asc')}
                      />
                      {label}
                    </label>
                    {selectedFilters[field].active && (
                      <div className="direction-options">
                        <label>
                          <input
                            type="radio"
                            checked={selectedFilters[field].direction === 'asc'}
                            onChange={() => handleFilterChange(field, 'asc')}
                          />
                          오름차순
                        </label>
                        <label>
                          <input
                            type="radio"
                            checked={selectedFilters[field].direction === 'desc'}
                            onChange={() => handleFilterChange(field, 'desc')}
                          />
                          내림차순
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="filter-section">
                <h3>필터 옵션</h3>
                <div className="filter-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFilters.gender.active}
                      onChange={() => handleFilterChange('gender', [], 'values')}
                    />
                    성별
                  </label>
                  {selectedFilters.gender.active && (
                    <div className="value-options">
                      <label>
                        <input
                          type="checkbox"
                          value="여"
                          checked={selectedFilters.gender.values.includes('여')}
                          onChange={(e) => handleFilterChange('gender', e.target.value, 'values')}
                        />
                        여자
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          value="남"
                          checked={selectedFilters.gender.values.includes('남')}
                          onChange={(e) => handleFilterChange('gender', e.target.value, 'values')}
                        />
                        남자
                      </label>
                    </div>
                  )}
                </div>

                <div className="filter-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFilters.pregnancystatus.active}
                      onChange={() => handleFilterChange('pregnancystatus', [], 'values')}
                    />
                    임신 여부
                  </label>
                  {selectedFilters.pregnancystatus.active && (
                    <div className="value-options">
                      <label>
                        <input
                          type="checkbox"
                          value="0"
                          checked={selectedFilters.pregnancystatus.values.includes('0')}
                          onChange={(e) => handleFilterChange('pregnancystatus', e.target.value, 'values')}
                        />
                        No
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          value="1"
                          checked={selectedFilters.pregnancystatus.values.includes('1')}
                          onChange={(e) => handleFilterChange('pregnancystatus', e.target.value, 'values')}
                        />
                        Yes
                      </label>
                    </div>
                  )}
                </div>

                <div className="filter-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFilters.tas.active}
                      onChange={() => handleFilterChange('tas', [], 'values')}
                    />
                    TAS
                  </label>
                  {selectedFilters.tas.active && (
                    <div className="value-options">
                      {[1, 2, 3, 4, 5].map(level => (
                        <label key={level}>
                          <input
                            type="checkbox"
                            value={level}
                            checked={selectedFilters.tas.values.includes(level.toString())}
                            onChange={(e) => handleFilterChange('tas', e.target.value, 'values')}
                          />
                          Level {level}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
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

          <div className="pagination">
            {getPageNumbers().map((number) => (
              <button
                key={number}
                onClick={() => changePage(number)}
                className={number === currentPage ? "active" : ""}
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default List;