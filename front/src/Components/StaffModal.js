import React, { useState } from 'react';
import { X } from 'lucide-react';
import './styles/StaffModal.css';

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

const StatusModal = ({ isOpen, onClose, staff, onResign }) => {
  if (!isOpen) return null;

  const isActive = staff?.status === 'active';
  const actionText = isActive ? '비활성화' : '활성화';

  const handleConfirm = () => {
    onResign(staff.username);
    onClose();
  };

  return (
    <div className="admin-modal">
      <div className="admin-modal-content">
        <div className="admin-modal-header">
          <h3>상태 변경</h3>
          <button className="admin-modal-close" onClick={onClose}>
            <X className="icon" />
          </button>
        </div>
        <div className="admin-modal-body">
          <p className="admin-resign-message">
            <strong>{staff?.name}</strong> 님의 계정을 {actionText} 처리하시겠습니까?
            <br />
            {isActive ? 
              "비활성화된 계정은 시스템 접근이 제한됩니다." : 
              "활성화된 계정은 시스템 접근이 가능해집니다."}
          </p>
        </div>
        <div className="admin-modal-actions">
          <button className="admin-modal-cancel" onClick={onClose}>
            취소
          </button>
          <button 
            className="admin-modal-resign" 
            onClick={handleConfirm}
          >
            {actionText}
          </button>
        </div>
      </div>
    </div>
  );
};

export { PasswordResetModal, StatusModal };