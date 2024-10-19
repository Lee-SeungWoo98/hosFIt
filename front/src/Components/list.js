import React, { useState } from "react";
import Patient from "./Patient";

function List({ searchTerm, patients }) {
  // 검색어가 있을 경우, 검색어에 맞는 환자 필터링
  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 5;
  const pageNumbersToShow = 5;

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
              <th>번호</th>
              <th>이름</th>
              <th>나이</th>
              <th>성별</th>
              <th>임신</th>
              <th>KTAS</th>
              <th>병원 체류 시간</th>
              <th>상세 정보</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.map((patient, index) => (
              <tr key={patient.id}>
                <td>{indexOfFirstPatient + index + 1}</td> {/* 번호 */}
                <td>{patient.name}</td> {/* 이름 */}
                <td>{patient.age}</td> {/* 나이 */}
                <td>{patient.gender}</td> {/* 성별 */}
                <td>{patient.isPregnant ? "예" : "아니오"}</td> {/* 임신 여부 */}
                <td>{patient.ktas}</td> {/* KTAS 레벨 */}
                <td>{patient.stayDuration}시간</td> {/* 병원 체류 시간 */}
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
            onClick={() =>
              changePage(Math.max(1, currentPage - pageNumbersToShow))
            }
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
              className={`page-button ${
                currentPage === number ? "active" : ""
              }`}
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
            onClick={() =>
              changePage(Math.min(totalPages, currentPage + pageNumbersToShow))
            }
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