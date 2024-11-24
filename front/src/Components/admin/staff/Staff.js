import React, { useState, useEffect } from "react";
import { Search, UserX, RotateCcw } from "lucide-react";
import { API_ENDPOINTS } from '../../../../constants/api';
import { StatusModal } from './StaffModal';
import axios from 'axios';
import "../styles/Staff.css";

// 직원 기본 데이터
const DEFAULT_DATA = {
  '김성식': {
    id: 'EMP-1000',
    role: '과장',
    department: '신경외과',
    email: 'kimss@hosfit.com',
    lastLogin: '2024-02-05 09:30'
  },
  '임광혁': {
    id: 'EMP-1001',
    role: '과장',
    department: '응급의학과',
    email: 'limkh@hosfit.com',
    lastLogin: '2024-02-05 11:45'
  },
  '손홍재': {
    id: 'EMP-1002',
    role: '과장',
    department: '응급의학과',
    email: 'sonhj@hosfit.com',
    lastLogin: '2024-02-05 13:15'
  }
};

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
const MOCK_DATA = {
  email: 'hosfit@medical.com',
  lastLogin: '2024-02-05 14:30',
  id: 'EMP-',
  status: 'active'
};

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
      const response = await axios.get(API_ENDPOINTS.ADMIN.STAFF.LIST);
      const mappedStaff = response.data.map(staff => {
        const defaultInfo = DEFAULT_DATA[staff.name] || {
          id: `EMP-${1000 + Math.floor(Math.random() * 100)}`,
          role: staff.major || '전공의',
          department: staff.department || '응급의학과',
          email: `${staff.name?.split(' ').join('')}@hosfit.com`,
          lastLogin: `2024-02-05 ${Math.floor(Math.random() * 24).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
        };

        return {
          ...defaultInfo,
          name: staff.name || '데이터 없음',
          status: staff.status || 'active',
          username: staff.username
        };
      });
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
    const matchesDepartment = selectedDepartment === "all" || staff.department === selectedDepartment;
    const searchFields = ['name', 'role', 'department', 'email', 'id'];
    const matchesSearch = activeSearchTerm === "" || 
      searchFields.some(field => staff[field]?.toLowerCase().includes(activeSearchTerm.toLowerCase()));
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
      setStaffList(prev => prev.map(staff => {
        if (staff.username === staffId) {
          return {
            ...staff,
            status: staff.status === 'active' ? 'inactive' : 'active'
          };
        }
        return staff;
      }));
      
      showNotification(
        `계정이 ${selectedStaff.status === 'active' ? '비활성화' : '활성화'} 되었습니다.`,
        'success'
      );
      setResignModalOpen(false);
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