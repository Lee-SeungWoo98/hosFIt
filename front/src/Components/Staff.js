import React, { useState } from 'react';
import { Edit, Key, Search } from 'lucide-react';
import './styles/Staff.css';

const EditModal = ({ isOpen, onClose, staffData, onSave }) => {
  const [formData, setFormData] = useState(staffData || {});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2>정보 수정</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>이름</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>이메일</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>직책</label>
            <select 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              required
            >
              <option value="전문의">전문의</option>
              <option value="레지던트">레지던트</option>
              <option value="인턴">인턴</option>
              <option value="간호사">간호사</option>
            </select>
          </div>
          <div className="form-group">
            <label>부서</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              required
            >
              <option value="응급의학과">응급의학과</option>
              <option value="내과">내과</option>
              <option value="외과">외과</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">취소</button>
            <button type="submit" className="save-button">저장</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PasswordResetModal = ({ isOpen, onClose, staffId, onReset }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }
    onReset(staffId, newPassword);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2>비밀번호 재설정</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label>새 비밀번호</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div className="form-group">
            <label>비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">취소</button>
            <button type="submit" className="save-button">재설정</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Staff = ({ showNotification }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
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
    }
  ];

  const handleEditClick = (staff) => {
    setSelectedStaff(staff);
    setModalOpen(true);
  };

  const handlePasswordResetClick = (staff) => {
    setSelectedStaff(staff);
    setPasswordModalOpen(true);
  };

  const handleSaveStaff = async (staffData) => {
    try {
      // API 호출로 직원 정보 업데이트
      // const response = await axios.put(`/api/staff/${staffData.id}`, staffData);
      showNotification('직원 정보가 업데이트되었습니다.', 'success');
      setModalOpen(false);
    } catch (error) {
      showNotification('업데이트 중 오류가 발생했습니다.', 'error');
    }
  };

  const handlePasswordReset = async (staffId, newPassword) => {
    try {
      // API 호출로 비밀번호 재설정
      // const response = await axios.post(`/api/staff/${staffId}/reset-password`, { password: newPassword });
      showNotification('비밀번호가 재설정되었습니다.', 'success');
      setPasswordModalOpen(false);
    } catch (error) {
      showNotification('비밀번호 재설정 중 오류가 발생했습니다.', 'error');
    }
  };

  return (
    <div className="staff-page">
      <div className="staff-controls">
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
                  <td>{staff.name}</td>
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
                      <button 
                        className="action-btn" 
                        title="정보 수정"
                        onClick={() => handleEditClick(staff)}
                      >
                        <Edit className="icon" />
                      </button>
                      <button 
                        className="action-btn" 
                        title="비밀번호 재설정"
                        onClick={() => handlePasswordResetClick(staff)}
                      >
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

      <EditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        staffData={selectedStaff}
        onSave={handleSaveStaff}
      />

      <PasswordResetModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        staffId={selectedStaff?.id}
        onReset={handlePasswordReset}
      />
    </div>
  );
};

export default Staff;