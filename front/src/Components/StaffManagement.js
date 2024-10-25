// StaffManagement.js
import React from 'react';

const StaffManagement = () => {
  return (
    <section id="staff" className="tab-content">
      <h3>의료진 관리</h3>
      <button>의료진 추가</button>
      <table>
        <thead>
          <tr>
            <th>사번</th>
            <th>이름</th>
            <th>직책</th>
            <th>부서</th>
            <th>이메일</th>
          </tr>
        </thead>
        <tbody>
          {/* 의료진 데이터 */}
        </tbody>
      </table>
    </section>
  );
};

export default StaffManagement;
