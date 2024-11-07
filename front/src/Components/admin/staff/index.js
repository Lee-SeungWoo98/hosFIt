import React, { useState } from "react";
import { Edit, Key, Search, UserX, Filter } from "lucide-react";

const StaffFilterButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
      ${active 
        ? "bg-blue-600 text-white" 
        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
      }`}
  >
    {children}
  </button>
);

const ActionButton = ({ onClick, title, icon: Icon, variant = "default" }) => {
  const variants = {
    default: "hover:bg-gray-100 text-gray-700",
    danger: "hover:bg-red-50 text-red-600",
  };

  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-md transition-colors ${variants[variant]}`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
};

const Staff = ({ showNotification }) => {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const staffList = [
    {
      id: "2024001",
      name: "김의사",
      role: "전문의",
      department: "응급의학과",
      email: "kim@hospital.com",
      lastLogin: "2024-10-25 09:30",
      status: "active",
    },
    {
      id: "2024002",
      name: "이간호",
      role: "간호사",
      department: "내과",
      email: "lee@hospital.com",
      lastLogin: "2024-10-25 10:15",
      status: "active",
    },
    {
      id: "2024003",
      name: "박의사",
      role: "전문의",
      department: "외과",
      email: "park@hospital.com",
      lastLogin: "2024-10-24 18:45",
      status: "inactive",
    }
  ];

  const handleAction = (type, staff) => {
    switch (type) {
      case 'edit':
        showNotification("편집 모드가 활성화되었습니다.", "info");
        break;
      case 'resetPassword':
        showNotification("비밀번호 재설정 이메일이 발송되었습니다.", "success");
        break;
      case 'resign':
        if (window.confirm(`${staff.name}님을 퇴사 처리하시겠습니까?`)) {
          showNotification("퇴사 처리가 완료되었습니다.", "success");
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 검색 및 필터 영역 */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* 검색바 */}
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
              placeholder="이름 또는 이메일로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 필터 토글 버튼 */}
          <button
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Filter className="h-4 w-4 mr-2" />
            필터
          </button>
        </div>

        {/* 부서 필터 버튼들 */}
        {isFiltersVisible && (
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <StaffFilterButton
              active={selectedDepartment === "all"}
              onClick={() => setSelectedDepartment("all")}
            >
              전체 부서
            </StaffFilterButton>
            <StaffFilterButton
              active={selectedDepartment === "emergency"}
              onClick={() => setSelectedDepartment("emergency")}
            >
              응급의학과
            </StaffFilterButton>
            <StaffFilterButton
              active={selectedDepartment === "internal"}
              onClick={() => setSelectedDepartment("internal")}
            >
              내과
            </StaffFilterButton>
            <StaffFilterButton
              active={selectedDepartment === "surgery"}
              onClick={() => setSelectedDepartment("surgery")}
            >
              외과
            </StaffFilterButton>
          </div>
        )}
      </div>

      {/* 직원 목록 테이블 */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  사번
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이름
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  직책
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  부서
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이메일
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  마지막 로그인
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staffList.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {staff.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {staff.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {staff.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {staff.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {staff.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {staff.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${staff.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {staff.status === 'active' ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-1">
                      <ActionButton
                        onClick={() => handleAction('edit', staff)}
                        title="정보 수정"
                        icon={Edit}
                      />
                      <ActionButton
                        onClick={() => handleAction('resetPassword', staff)}
                        title="비밀번호 재설정"
                        icon={Key}
                      />
                      <ActionButton
                        onClick={() => handleAction('resign', staff)}
                        title="퇴사 처리"
                        icon={UserX}
                        variant="danger"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 페이지네이션 (옵션) */}
      <div className="flex items-center justify-between py-3">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            이전
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            다음
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              총 <span className="font-medium">3</span> 명
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                이전
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                다음
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staff;