import React from "react";
import "./Notification.css";

function Notification({ notifications }) {
  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          <div className="notification-content">
            {notification.message}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Notification;
