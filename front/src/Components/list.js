import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
  const [username, setUsername] = useState(''); // 사용자 입력 아이디
  const [password, setPassword] = useState(''); // 사용자 입력 비밀번호
  const [error, setError] = useState(null); // 에러 상태 관리
  const navigate = useNavigate();

  // 로그인 처리 함수
  const handleLogin = async () => {
    try {
      // 서버에 로그인 요청
      const response = await axios.post(
        'http://localhost:8082/boot/login', 
        { username, password },
        { withCredentials: true } // 세션 쿠키를 받아오기 위해 필요
      );

      if (response.data.success) {
        onLogin(true);  // 로그인 성공 시 상태 업데이트
        navigate('/');  // 메인 페이지로 이동
      } else {
        setError('로그인 실패: 아이디 또는 비밀번호가 잘못되었습니다.'); // 로그인 실패 시 에러 메시지 표시
      }
    } catch (err) {
      setError('서버와 통신에 문제가 발생했습니다.'); // 서버와의 통신 오류 발생 시
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* 에러 메시지 표시 */}
      <input
        type="text"
        placeholder="아이디"
        value={username}
        onChange={(e) => setUsername(e.target.value)} // 사용자 아이디 입력
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)} // 사용자 비밀번호 입력
      />
      <button onClick={handleLogin}>로그인</button> {/* 로그인 버튼 클릭 시 handleLogin 호출 */}
    </div>
  );
}

export default Login;
