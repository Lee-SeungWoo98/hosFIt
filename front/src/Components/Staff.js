import React, { useState } from "react";
import { Edit, Key, Search, UserX } from "lucide-react";
import { EditModal, PasswordResetModal, ResignModal } from './StaffModal';
import "./styles/Staff.css";

const Staff = ({ showNotification }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [resignModalOpen, setResignModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const staffList = [
    {
      id: "2024001",
      name: "김의사",
      role: "전문의",
      department: "응급의학과",
      email: "kim@hospital.com",
      lastLogin: "2024-10-25 09:30",
      status: "active",
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

  const handleResignClick = (staff) => {
    setSelectedStaff(staff);
    setResignModalOpen(true);
  };

  const handleSaveStaff = async (staffData) => {
    try {
      // API 호출로 직원 정보 업데이트
      // const response = await axios.put(`/api/staff/${staffData.id}`, staffData);
      showNotification("직원 정보가 업데이트되었습니다.", "success");
      setModalOpen(false);
    } catch (error) {
      showNotification("업데이트 중 오류가 발생했습니다.", "error");
    }
  };

  const handlePasswordReset = async (staffId, newPassword) => {
    try {
      // API 호출로 비밀번호 재설정
      // const response = await axios.post(`/api/staff/${staffId}/reset-password`, { password: newPassword });
      showNotification("비밀번호가 재설정되었습니다.", "success");
      setPasswordModalOpen(false);
    } catch (error) {
      showNotification("비밀번호 재설정 중 오류가 발생했습니다.", "error");
    }
  };

  const handleResign = async (staffId) => {
    try {
      // API 호출로 퇴사 처리
      // await axios.post(`/api/staff/${staffId}/resign`);
      showNotification('퇴사 처리가 완료되었습니다.', 'success');
      setResignModalOpen(false);
      // TODO: 목록 새로고침 로직 추가
    } catch (error) {
      showNotification('퇴사 처리 중 오류가 발생했습니다.', 'error');
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
              className={selectedDepartment === "all" ? "active" : ""}
              onClick={() => setSelectedDepartment("all")}
            >
              전체 부서
            </button>
            <button
              className={selectedDepartment === "emergency" ? "active" : ""}
              onClick={() => setSelectedDepartment("emergency")}
            >
              응급의학과
            </button>
            <button
              className={selectedDepartment === "internal" ? "active" : ""}
              onClick={() => setSelectedDepartment("internal")}
            >
              내과
            </button>
            <button
              className={selectedDepartment === "surgery" ? "active" : ""}
              onClick={() => setSelectedDepartment("surgery")}
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
                      {staff.status === "active" ? "활성" : "비활성"}
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
                      <button 
                        className="action-btn danger" 
                        title="퇴사 처리"
                        onClick={() => handleResignClick(staff)}
                      >
                        <UserX className="icon" />
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
        editData={selectedStaff}
        onSave={handleSaveStaff}
      />

      <PasswordResetModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        staffId={selectedStaff?.id}
        onReset={handlePasswordReset}
      />

      <ResignModal
        isOpen={resignModalOpen}
        onClose={() => setResignModalOpen(false)}
        staff={selectedStaff}
        onResign={handleResign}
      />
    </div>
  );
};

export default Staff;