import React, { useState } from 'react';
import { Plus, Search, Edit, Key } from 'lucide-react';
import StaffModal from './StaffModal';
import './styles/Staff.css';

const Staff = ({ showNotification }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const staffList = [
    {
      id: '2024001',
      name: '김의사',
      role: '전문의',
      department: '응급의학과',
      email: 'kim@hospital.com',
      lastLogin: '2024-10-25 09:30',
      status: 'active'
    },
    // 더 많은 의료진 데이터...
  ];

  const handleAddStaff = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaveStaff = (staffData) => {
    // 의료진 저장 로직
    showNotification('의료진 정보가 저장되었습니다.', 'success');
    setModalOpen(false);
  };

  return (
    <div className="staff-page">
      <div className="staff-controls">
        <div className="controls-left">
          <button className="add-staff-btn" onClick={handleAddStaff}>
            <Plus className="icon" />
            의료진 추가
          </button>
        </div>

        <div className="controls-right">
          <div className="search-box">
            <Search className="icon" />
            <input
              type="text"
              placeholder="검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="department-filter">
            <button
              className={selectedDepartment === 'all' ? 'active' : ''}
              onClick={() => setSelectedDepartment('all')}
            >
              전체 부서
            </button>
            <button
              className={selectedDepartment === 'emergency' ? 'active' : ''}
              onClick={() => setSelectedDepartment('emergency')}
            >
              응급의학과
            </button>
            <button
              className={selectedDepartment === 'internal' ? 'active' : ''}
              onClick={() => setSelectedDepartment('internal')}
            >
              내과
            </button>
            <button
              className={selectedDepartment === 'surgery' ? 'active' : ''}
              onClick={() => setSelectedDepartment('surgery')}
            >
              외과
            </button>
          </div>
        </div>
      </div>

      <div className="staff-list">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>사번</th>
                <th>이름</th>
                <th>직책</th>
                <th>부서</th>
                <th>이메일</th>
                <th>마지막 로그인</th>
                <th>상태</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr key={staff.id}>
                  <td>{staff.id}</td>
                  <td className="staff-name">
                    <img
                      src={`https://via.placeholder.com/32`}
                      alt={staff.name}
                      className="staff-avatar"
                    />
                    {staff.name}
                  </td>
                  <td>{staff.role}</td>
                  <td>{staff.department}</td>
                  <td>{staff.email}</td>
                  <td>{staff.lastLogin}</td>
                  <td>
                    <span className={`status ${staff.status}`}>
                      {staff.status === 'active' ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn" title="정보 수정">
                        <Edit className="icon" />
                      </button>
                      <button className="action-btn" title="비밀번호 재설정">
                        <Key className="icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <StaffModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveStaff}
      />
    </div>
  );
};

export default Staff;