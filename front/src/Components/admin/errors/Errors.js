import React, { useState, useEffect } from "react";
import { Search, Download } from "lucide-react";
import axios from "axios";
import ErrorCard from "./ErrorCard";

const FilterButton = ({ active, onClick, children, type }) => {
  const buttonStyles = {
    error: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-500 hover:bg-yellow-600",
    info: "bg-blue-600 hover:bg-blue-700",
    all: "bg-gray-600 hover:bg-gray-700",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out
        ${active 
          ? `${buttonStyles[type]} text-white shadow-md` 
          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
        }`}
    >
      {children}
    </button>
  );
};

const Errors = () => {
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [logs, setLogs] = useState({ warnings: [], errors: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get("http://localhost:8082/boot/errors/limited");
        setLogs({
          warnings: response.data.warnings || [],
          errors: response.data.errors || []
        });
      } catch (err) {
        setError("에러 로그를 불러오는데 실패했습니다.");
        console.error("Error fetching logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    const refreshInterval = setInterval(fetchLogs, 300000);
    return () => clearInterval(refreshInterval);
  }, []);

  const formatDate = (dateArr) => {
    if (!Array.isArray(dateArr) || dateArr.length < 6) return "Invalid Date";
    const [year, month, day, hour, minute, second] = dateArr;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
  };

  const handleSendToSupport = async (logId) => {
    try {
      const logToSend = [...logs.errors, ...logs.warnings].find(log => log.id === logId);
      if (!logToSend) {
        throw new Error("해당 로그를 찾을 수 없습니다.");
      }

      const response = await axios.post("http://localhost:8082/boot/errors/send-email", {
        id: logToSend.id,
        errorname: logToSend.errorname,
        errormessage: logToSend.errormessage,
        errorstack: logToSend.errorstack,
        errortype: logToSend.errortype,
        severitylevel: logToSend.severitylevel,
        url: logToSend.url,
        userid: logToSend.userid || "미로그인",
        browser: logToSend.browser,
        createdat: logToSend.createdat
      });

      if (response.data.success) {
        alert("에러 로그가 성공적으로 전송되었습니다.");
      } else {
        throw new Error(response.data.message || "이메일 전송에 실패했습니다.");
      }
    } catch (error) {
      console.error("Failed to send error log:", error);
      alert(error.message || "이메일 전송 중 오류가 발생했습니다.");
    }
  };

  const handleExportLogs = async () => {
    try {
      setIsExporting(true);

      const exportData = filteredLogs.map(log => ({
        "Log No.": log.id,
        "에러명": log.errorname,
        "메시지": log.errormessage,
        "로그타입": log.errortype,
        "심각도": log.severitylevel,
        "URL": log.url,
        "사용자": log.userid || "미로그인",
        "브라우저": log.browser,
        "발생시각": formatDate(log.createdat)
      }));

      const BOM = "\uFEFF";
      const headers = Object.keys(exportData[0]);
      const csvContent = BOM +
        headers.join(",") + "\n" +
        exportData.map(row =>
          headers.map(header =>
            `"${(row[header]?.toString() || "").replace(/"/g, '""')}"`
          ).join(",")
        ).join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `error_logs_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("로그 내보내기에 실패했습니다.");
    } finally {
      setIsExporting(false);
    }
  };

  const filteredLogs = [
    ...(selectedLevel === "all" || selectedLevel === "warning" ? logs.warnings : []),
    ...(selectedLevel === "all" || selectedLevel === "error" ? logs.errors : [])
  ].filter(log => {
    const searchFields = ["errormessage", "errorname", "errortype", "id"];
    return searchTerm === "" ||
      searchFields.some(field =>
        String(log[field]).toLowerCase().includes(searchTerm.toLowerCase())
      );
  }).sort((a, b) => {
    const dateA = new Date(...a.createdat);
    const dateB = new Date(...b.createdat);
    return dateB - dateA;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 bg-red-50 px-4 py-3 rounded-lg shadow">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-grow">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="검색 (Log No, 메시지, 타입...)"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 
                bg-white placeholder-gray-500 focus:outline-none focus:ring-2 
                focus:ring-blue-500 focus:border-transparent sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <FilterButton
              active={selectedLevel === "all"}
              onClick={() => setSelectedLevel("all")}
              type="all"
            >
              전체
            </FilterButton>
            <FilterButton
              active={selectedLevel === "error"}
              onClick={() => setSelectedLevel("error")}
              type="error"
            >
              에러
            </FilterButton>
            <FilterButton
              active={selectedLevel === "warning"}
              onClick={() => setSelectedLevel("warning")}
              type="warning"
            >
              경고
            </FilterButton>
          </div>
        </div>

        <button
          onClick={handleExportLogs}
          disabled={isExporting || filteredLogs.length === 0}
          className={`inline-flex items-center px-4 py-2 border border-transparent 
            rounded-md shadow-sm text-sm font-medium text-white 
            ${isExporting || filteredLogs.length === 0 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700"}
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            transition-colors duration-200`}
        >
          <Download className={`w-4 h-4 mr-2 ${isExporting ? "animate-bounce" : ""}`} />
          {isExporting ? "내보내는 중..." : "로그 내보내기"}
        </button>
      </div>

      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-500 text-lg">표시할 에러 로그가 없습니다.</div>
            <div className="text-gray-400 text-sm mt-2">
              {searchTerm || selectedLevel !== "all"
                ? "필터 조건을 변경해보세요."
                : "새로운 에러 로그가 기록되면 여기에 표시됩니다."}
            </div>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <ErrorCard
              key={log.id}
              log={log}
              onSendToSupport={handleSendToSupport}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Errors;