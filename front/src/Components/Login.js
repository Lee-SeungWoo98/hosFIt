import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // 서버에 로그인 요청
      const response = await axios.post('http://localhost:8082/boot/login', {
        username,
        password,
      });

      if (response.data.success) {
        onLogin(true);  // 로그인 성공 시 상태 업데이트
        sessionStorage.setItem('isAuthenticated', 'true');  // 세션 저장
        navigate('/');  // 메인 페이지로 이동
      } else {
        setError('로그인 실패: 아이디 또는 비밀번호가 잘못되었습니다.');
      }
    } catch (err) {
      setError('서버와 통신에 문제가 발생했습니다.');
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="아이디"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}

export default Login;
