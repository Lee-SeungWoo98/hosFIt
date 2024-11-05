import React, { useState } from 'react';
import { X } from 'lucide-react';
import './styles/StaffModal.css';

const EditModal = ({ isOpen, onClose, editData = null, onSave }) => {
  const [formData, setFormData] = useState(editData || {
    name: '',
    role: '전문의',
    department: '응급의학과',
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div id="staffModal" className="admin-modal">
      <div className="admin-modal-content">
        <div className="admin-modal-header">
          <h3>{editData ? '의료진 정보 수정' : '의료진 추가'}</h3>
          <button className="admin-modal-close" onClick={onClose}>
            <X className="icon" />
          </button>
        </div>

        <form className="admin-modal-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="role">직책</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="전문의">전문의</option>
              <option value="레지던트">레지던트</option>
              <option value="인턴">인턴</option>
              <option value="간호사">간호사</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label htmlFor="department">부서</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="응급의학과">응급의학과</option>
              <option value="내과">내과</option>
              <option value="외과">외과</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-modal-actions">
            <button type="button" className="admin-modal-cancel" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="admin-modal-save">
              저장
            </button>
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
    <div className="admin-modal">
      <div className="admin-modal-content">
        <div className="admin-modal-header">
          <h3>비밀번호 재설정</h3>
          <button className="admin-modal-close" onClick={onClose}>
            <X className="icon" />
          </button>
        </div>

        <form className="admin-modal-form" onSubmit={handleSubmit}>
          {error && <div className="admin-error-message">{error}</div>}
          <div className="admin-form-group">
            <label>새 비밀번호</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div className="admin-form-group">
            <label>비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div className="admin-modal-actions">
            <button type="button" className="admin-modal-cancel" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="admin-modal-save">
              재설정
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ResignModal = ({ isOpen, onClose, staff, onResign }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onResign(staff.id);
    onClose();
  };

  return (
    <div className="admin-modal">
      <div className="admin-modal-content">
        <div className="admin-modal-header">
          <h3>퇴사 처리</h3>
          <button className="admin-modal-close" onClick={onClose}>
            <X className="icon" />
          </button>
        </div>
        <div className="admin-modal-body">
          <p className="admin-resign-message">
            <strong>{staff?.name}</strong> 님을 퇴사 처리하시겠습니까?
            <br />
            퇴사 처리된 계정은 시스템 접근이 즉시 중단됩니다.
          </p>
        </div>
        <div className="admin-modal-actions">
          <button className="admin-modal-cancel" onClick={onClose}>
            취소
          </button>
          <button className="admin-modal-resign" onClick={handleConfirm}>
            퇴사 처리
          </button>
        </div>
      </div>
    </div>
  );
};

export { EditModal, PasswordResetModal, ResignModal };