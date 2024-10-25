import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Login from "./Login";

function AdminAPP() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);

  // 회원 리스트 가져오기
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const result = await axios.get(
        "http://localhost:8082/boot/member/memberList"
      );
      setMembers(result.data);
    } catch (error) {
      setError("회원 리스트 로드 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="breadcrumb">
        <a href="/">Home</a>
      </div>

      <div className="page-header">
        <h1 className="page-title">
          <span className="breadcrumb-separator">&lt;</span>
          모든 회원
        </h1>
        <span className="total-count">(총 {members.length}명)</span>
      </div>

      <div className="content-area">
        <div className="table-container">
          <div className="filter-section">
            <button className="filter-button">환자 옵션</button>
            {/* 필터 적용된 항목을 보여주는 부분 */}
          </div>

          <div className="filter-options-panel">
            <div className="filter-options-container">
              <div className="filter-group">
                <label className="filter-label">성별</label>
                <div className="filter-choices">
                  <label>
                    <input type="checkbox" />
                    남자
                  </label>
                  <label>
                    <input type="checkbox" />
                    여자
                  </label>
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">임신 여부</label>
                <div className="filter-choices">
                  <label>
                    <input type="checkbox" />
                    No
                  </label>
                  <label>
                    <input type="checkbox" />
                    Yes
                  </label>
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">KTAS</label>
                <div className="filter-choices">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <label key={level}>
                      <input type="checkbox" />
                      Level {level}
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">체류 시간</label>
                <div className="filter-choices">
                  <label>
                    <input type="radio" />
                    기본
                  </label>
                  <label>
                    <input type="radio" />
                    오름차순
                  </label>
                  <label>
                    <input type="radio" />
                    내림차순
                  </label>
                </div>
              </div>
            </div>

            <div className="filter-actions">
              <button className="filter-apply-button">확인</button>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>ID</th>
                <th>권한</th>
                <th>부서</th>
                <th>전공</th>
                <th>detail</th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? (
                members.map((member, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{member.name}</td>
                    <td>{member.position}</td>
                    <td>{member.department || "-"}</td>
                    <td>{member.major || "-"}</td>
                    <td>
                      <button className="details-button onClick={() => {}}">
                        ㅈ ㅏ ㅅ ㅔ ㅎ ㅣ 보기
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

          {/* 페이지 네비게이션 */}
          <div className="pagination">
            <button className="pagination-arrow">{/* 좌측 화살표 */}</button>
            <span className="page-info">0 / 0</span>
            <button className="pagination-arrow">{/* 우측 화살표 */}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAPP;
