import React, { useState, useEffect } from "react";
import axios from "axios";
import Patient from "./Patient";

function List({ searchTerm }) {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    subjectId: { active: false, direction: 'asc' },
    diseaseCode: { active: false, direction: 'asc' },
    name: { active: false, direction: 'asc' },
    age: { active: false, direction: 'asc' },
    gender: { active: false, values: [] },
    pregnancyStatus: { active: false, values: [] },
    ktas: { active: false, values: [] },
    stayDuration: { active: false, direction: 'asc' }
  });

  const patientsPerPage = 5;
  const pageNumbersToShow = 5;
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(patients.length / patientsPerPage);

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

  useEffect(() => {
    fetchPatients();
  }, [searchTerm, selectedFilters]);

  const fetchPatients = async () => {
    try {
      const activeFilters = Object.entries(selectedFilters).reduce((acc, [key, value]) => {
        if (value.active) {
          if (value.direction) {
            acc[`${key}Direction`] = value.direction;
          }
          if (value.values) {
            acc[key] = value.values;
          }
        }
        return acc;
      }, {});

      const response = await axios.get("/api/patients", {
        params: {
          searchTerm,
          ...activeFilters,
        },
      });
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
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

  const removeFilter = (field, value = null) => {
    setSelectedFilters(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        active: value ? true : false,
        values: value ? prev[field].values.filter(v => v !== value) : [],
        direction: 'asc'
      }
    }));
  };

  const showPatientDetails = (patient) => {
    setSelectedPatient(patient);
  };

  const handleBackToList = () => {
    setSelectedPatient(null);
  };

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
            <span>(총 {patients.length}명)</span>
            <button className="filter-button" onClick={toggleFilterOptions}>
              필터 옵션
            </button>
          </div>

          {showFilterOptions && (
            <div className="filter-options-panel">
              <div className="filter-section">
                <h3>정렬 옵션</h3>
                {Object.entries({
                  subjectId: '환자번호',
                  diseaseCode: '병명 코드',
                  name: '이름',
                  age: '나이',
                  stayDuration: '병원 체류 시간'
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
                          value="남자"
                          checked={selectedFilters.gender.values.includes('남자')}
                          onChange={(e) => handleFilterChange('gender', e.target.value, 'values')}
                        />
                        남자
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          value="여자"
                          checked={selectedFilters.gender.values.includes('여자')}
                          onChange={(e) => handleFilterChange('gender', e.target.value, 'values')}
                        />
                        여자
                      </label>
                    </div>
                  )}
                </div>

                <div className="filter-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFilters.pregnancyStatus.active}
                      onChange={() => handleFilterChange('pregnancyStatus', [], 'values')}
                    />
                    임신 여부
                  </label>
                  {selectedFilters.pregnancyStatus.active && (
                    <div className="value-options">
                      <label>
                        <input
                          type="checkbox"
                          value="Y"
                          checked={selectedFilters.pregnancyStatus.values.includes('Y')}
                          onChange={(e) => handleFilterChange('pregnancyStatus', e.target.value, 'values')}
                        />
                        Yes
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          value="N"
                          checked={selectedFilters.pregnancyStatus.values.includes('N')}
                          onChange={(e) => handleFilterChange('pregnancyStatus', e.target.value, 'values')}
                        />
                        No
                      </label>
                    </div>
                  )}
                </div>

                <div className="filter-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedFilters.ktas.active}
                      onChange={() => handleFilterChange('ktas', [], 'values')}
                    />
                    KTAS
                  </label>
                  {selectedFilters.ktas.active && (
                    <div className="value-options">
                      {[1, 2, 3, 4, 5].map(level => (
                        <label key={level}>
                          <input
                            type="checkbox"
                            value={level}
                            checked={selectedFilters.ktas.values.includes(level.toString())}
                            onChange={(e) => handleFilterChange('ktas', e.target.value, 'values')}
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
                <th>병명 코드</th>
                <th>이름</th>
                <th>나이</th>
                <th>성별</th>
                <th>임신 여부</th>
                <th>KTAS</th>
                <th>병원 체류 시간</th>
                <th>배치 추천</th>
                <th>상세 정보</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.map((patient) => (
                <tr key={patient.subjectId}>
                  <td>{patient.subjectId}</td>
                  <td>{patient.diseaseCode}</td>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.pregnancyStatus}</td>
                  <td>{patient.ktas}</td>
                  <td>{patient.stayDuration}시간</td>
                  <td>{patient.prediction}</td>
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

export default Login;
