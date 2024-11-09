import React, { useState, useEffect } from "react";
import { Search, UserX, RotateCcw } from "lucide-react";
import { StatusModal } from './StaffModal';
import axios from 'axios';
import "../styles/Staff.css";

// 부서 메뉴 설정
const DEPARTMENT_MENUS = [
  { id: 'all', label: '전체 부서' },
  { id: '응급의학과', label: '응급의학과' },
  { id: '내과', label: '내과' },
  { id: '외과', label: '외과' },
  { id: '신경외과', label: '신경외과' }
];

// 테이블 컬럼 설정
const TABLE_COLUMNS = [
  { id: 'id', label: '사번' },
  { id: 'name', label: '이름' },
  { id: 'role', label: '직책' },
  { id: 'department', label: '부서' },
  { id: 'email', label: '이메일' },
  { id: 'lastLogin', label: '마지막 로그인' },
  { id: 'status', label: '상태' }
];

const Staff = ({ showNotification }) => {
  const [resignModalOpen, setResignModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [staffList, setStaffList] = useState([]);

  // 직원 목록 가져오기
  const fetchStaffList = async () => {
    try {
      const response = await axios.get('http://localhost:8082/boot/member/memberList');
      const mappedStaff = response.data.map(staff => ({
        id: '데이터 없음',
        name: staff.name || '데이터 없음',
        role: staff.major || '데이터 없음',
        department: staff.department || '데이터 없음',
        email: '데이터 없음',
        lastLogin: '데이터 없음',
        status: staff.status || 'active',
        username: staff.username
      }));
      setStaffList(mappedStaff);
    } catch (error) {
      showNotification("직원 목록을 불러오는데 실패했습니다.", "error");
    }
  };

  useEffect(() => {
    fetchStaffList();
  }, []);

  // 검색 및 필터링된 직원 목록
  const filteredStaffList = staffList.filter(staff => {
    const matchesDepartment = selectedDepartment === "all" || 
      (staff.department === selectedDepartment);
    
    const searchFields = ['name', 'role', 'department', 'email'];
    const matchesSearch = activeSearchTerm === "" || searchFields.some(field => 
      staff[field].toLowerCase().includes(activeSearchTerm.toLowerCase())
    );

    return matchesDepartment && matchesSearch;
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearchTerm(searchTerm);
  };

  const handleSearchReset = () => {
    setSearchTerm("");
    setActiveSearchTerm("");
  };

  const handleResignClick = (staff) => {
    setSelectedStaff(staff);
    setResignModalOpen(true);
  };

  const handleResign = async (staffId) => {
    try {
      const staffToUpdate = staffList.find(staff => staff.username === staffId);
      const newStatus = staffToUpdate.status === 'active' ? 'inactive' : 'active';
      
      await axios.put(`http://localhost:8082/boot/member/updateStatus/${staffId}`, {
        status: newStatus
      });
      
      showNotification(
        newStatus === 'active' ? '활성화되었습니다.' : '비활성화되었습니다.', 
        'success'
      );
      setResignModalOpen(false);
      fetchStaffList();
    } catch (error) {
      showNotification('상태 변경 중 오류가 발생했습니다.', 'error');
    }
  };

  return (
    <div className="staff-page">
      <div className="staff-controls">
        <div className="controls-right">
          <div className="search-section">
            <form onSubmit={handleSearchSubmit} className="search-box">
              <Search className="icon search-icon" />
              <input
                type="text"
                placeholder="검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            <button
              className="search-reset-btn"
              onClick={handleSearchReset}
              title="검색 초기화"
            >
              <RotateCcw className="icon" size={16} />
            </button>
          </div>
  
          <div className="department-filter">
            {DEPARTMENT_MENUS.map(menu => (
              <button
                key={menu.id}
                className={selectedDepartment === menu.id ? "active" : ""}
                onClick={() => setSelectedDepartment(menu.id)}
              >
                {menu.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="staff-list">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {TABLE_COLUMNS.map(column => (
                  <th key={column.id}>{column.label}</th>
                ))}
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaffList.length > 0 ? (
                filteredStaffList.map((staff) => (
                  <tr key={staff.username}>
                    {TABLE_COLUMNS.map(column => (
                      <td key={`${staff.username}-${column.id}`}>
                        {column.id === 'status' ? (
                          <span className={`status ${staff.status}`}>
                            {staff.status === "active" ? "활성" : "비활성"}
                          </span>
                        ) : (
                          staff[column.id]
                        )}
                      </td>
                    ))}
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn danger" 
                          title={staff.status === 'active' ? "비활성화" : "활성화"}
                          onClick={() => handleResignClick(staff)}
                        >
                          <UserX className="icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={TABLE_COLUMNS.length + 1} className="no-data">
                    데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StatusModal
        isOpen={resignModalOpen}
        onClose={() => setResignModalOpen(false)}
        staff={selectedStaff}
        onResign={handleResign}
      />
    </div>
  );
};

export default Staff;