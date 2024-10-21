import React, { useState, useEffect } from "react";
import Patient from "./Patient";

function List({ searchTerm, patients }) {
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
  const [genderFilter, setGenderFilter] = useState([]);
  const [showGenderOptions, setShowGenderOptions] = useState(false);
  const patientsPerPage = 5;
  const pageNumbersToShow = 5;

  useEffect(() => {
    // 검색어와 성별 필터로 환자 필터링
    let sorted = [...patients].filter((patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (genderFilter.length === 0 || genderFilter.includes(patient.gender))
      // 주석: 이 부분을 실제 성별 데이터가 들어오는 값과 동일하게 변경해야 함.
      // 예: (genderFilter.length === 0 || 
      //      (genderFilter.includes('남') && patient.gender === 'MALE') ||
      //      (genderFilter.includes('여') && patient.gender === 'FEMALE'))
    );
    
    // 정렬 로직
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredPatients(sorted);
  }, [patients, searchTerm, sortConfig, genderFilter]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const toggleGenderFilter = (gender) => {
    setGenderFilter(prev => 
      prev.includes(gender)
        ? prev.filter(g => g !== gender)
        : [...prev, gender]
    );
  };

  const removeGenderFilter = (gender) => {
    setGenderFilter(prev => prev.filter(g => g !== gender));
  };

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const showPatientDetails = (patient) => {
    setSelectedPatient(patient);
  };

  const handleBackToList = () => {
    setSelectedPatient(null);
  };

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    let startPage = Math.max(
      1,
      currentPage - Math.floor(pageNumbersToShow / 2)
    );
    let endPage = Math.min(totalPages, startPage + pageNumbersToShow - 1);

    if (endPage - startPage + 1 < pageNumbersToShow) {
      startPage = Math.max(1, endPage - pageNumbersToShow + 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  if (selectedPatient) {
    return <Patient patient={selectedPatient} onBack={handleBackToList} />;
  }

  return (
    <div className="content-area">
      <div className="table-container">
        <h2>
          응급실 환자 리스트 <span>(총 {filteredPatients.length}명)</span>
        </h2>
        <table>
          <thead>
            <tr>
              <th onClick={() => requestSort('id')} style={{ cursor: 'pointer' }}>
                <div className="sort-header">
                  <span>번호</span>
                  <div className="sort-arrows">
                    <span className={`sort-arrow up ${sortConfig.key === 'id' && sortConfig.direction === 'ascending' ? 'active' : ''}`}>▲</span>
                    <span className={`sort-arrow down ${sortConfig.key === 'id' && sortConfig.direction === 'descending' ? 'active' : ''}`}>▼</span>
                  </div>
                </div>
              </th>
              <th>이름</th>
              <th onClick={() => requestSort('age')} style={{ cursor: 'pointer' }}>
                <div className="sort-header">
                  <span>나이</span>
                  <div className="sort-arrows">
                    <span className={`sort-arrow up ${sortConfig.key === 'age' && sortConfig.direction === 'ascending' ? 'active' : ''}`}>▲</span>
                    <span className={`sort-arrow down ${sortConfig.key === 'age' && sortConfig.direction === 'descending' ? 'active' : ''}`}>▼</span>
                  </div>
                </div>
              </th>
              <th className="gender-header" onClick={() => setShowGenderOptions(!showGenderOptions)}>
                <div className="gender-header-content">
                  <span>성별</span>
                  <span className="gender-filter-indicator">▼</span>
                  {genderFilter.length > 0 && (
                    <span className="gender-filter-tags">
                      {genderFilter.map(gender => (
                        <span key={gender} className="gender-tag">
                          {gender === '남' ? '남자' : '여자'}
                          <button onClick={(e) => { e.stopPropagation(); removeGenderFilter(gender); }}>×</button>
                        </span>
                      ))}
                    </span>
                  )}
                </div>
                {showGenderOptions && (
                  <div className="gender-options">
                    <label>
                      <input
                        type="checkbox"
                        checked={genderFilter.includes('남')}
                        onChange={() => toggleGenderFilter('남')}
                      />
                      <span onClick={() => toggleGenderFilter('남')}>남자</span>
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={genderFilter.includes('여')}
                        onChange={() => toggleGenderFilter('여')}
                      />
                      <span onClick={() => toggleGenderFilter('여')}>여자</span>
                    </label>
                  </div>
                )}
              </th>
              <th>임신</th>
              <th>KTAS</th>
              <th>병원 체류 시간</th>
              <th>상세 정보</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td>{patient.isPregnant ? "예" : "아니오"}</td>
                <td>{patient.ktas}</td>
                <td>{patient.stayDuration}시간</td>
                <td>
                  <button
                    onClick={() => showPatientDetails(patient)}
                    className="detail-button"
                  >
                    상세정보
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button
            className="page-button"
            onClick={() => changePage(Math.max(1, currentPage - pageNumbersToShow))}
            disabled={currentPage === 1}
          >
            &lt;&lt;
          </button>
          <button
            className="page-button"
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {getPageNumbers().map((number) => (
            <button
              key={number}
              className={`page-button ${currentPage === number ? "active" : ""}`}
              onClick={() => changePage(number)}
            >
              {number}
            </button>
          ))}
          <button
            className="page-button"
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
          <button
            className="page-button"
            onClick={() => changePage(Math.min(totalPages, currentPage + pageNumbersToShow))}
            disabled={currentPage === totalPages}
          >
            &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default List;