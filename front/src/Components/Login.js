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
      await axios.post('http://localhost:8082/boot/login', {
        username,
        password,
      }, { withCredentials: true });  // 세션 쿠키 허용

      // 로그인 성공 후 세션 체크
      await onLogin();  // 세션 확인을 위해 App.js의 checkSession 실행
      navigate('/', {state:{username}});    // 메인 페이지로 이동
    } catch (err) {
      setError('로그인 실패: 아이디 또는 비밀번호가 잘못되었습니다.');
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
