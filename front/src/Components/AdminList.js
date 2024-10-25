import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import ModelManagement from "./ModelManagement";
import StaffManagement from "./StaffManagement";
import StatsAnalysis from "./StatsAnalysis";
import ErrorLogs from "./ErrorLogs";
import Settings from "./Settings";
import Notification from "./Notification";
import "./AdminApp.css";

function AdminApp() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notifications, setNotifications] = useState([]);

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const showNotification = (message, type) => {
    const id = new Date().getTime();
    setNotifications([...notifications, { id, message, type }]);
    setTimeout(() => {
      setNotifications((notifications) =>
        notifications.filter((notification) => notification.id !== id)
      );
    }, 3000);
  };

  useEffect(() => {
    showNotification("페이지가 로드되었습니다.", "info");
  }, []);

  return (
    <div className="admin-container">
      <Sidebar switchTab={switchTab} activeTab={activeTab} />
      <main className="main-content">
        {activeTab === "dashboard" && <Dashboard showNotification={showNotification} />}
        {activeTab === "model" && <ModelManagement />}
        {activeTab === "staff" && <StaffManagement />}
        {activeTab === "stats" && <StatsAnalysis />}
        {activeTab === "errors" && <ErrorLogs />}
        {activeTab === "settings" && <Settings />}
      </main>
      <Notification notifications={notifications} />
    </div>
  );
}

export default AdminApp;
