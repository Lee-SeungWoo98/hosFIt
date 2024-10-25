import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import Login from "./Login";

function AdminAPP() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);

  // 회원 리스트 가져오기
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const result = await axios.get(
        "http://localhost:8082/boot/member/memberList"
      );
      setMembers(result.data);
    } catch (error) {
      setError("회원 리스트 로드 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <>
        
    </>
  );
}

export default AdminAPP;
