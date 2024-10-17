import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Components/Header';
import List from './Components/list'; // List 컴포넌트 import
import './Components/list.css';
import './Components/Header.css';
import axios from 'axios';

function App() {
  // 로그인 상태 관리 변수 추가
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      const result = await axios.get('http://localhost:8082/boot/login', {
        params: {
          username: username,
          password: password,
        },
      });
      setResponse(result.data); // 서버에서 받아온 데이터를 저장
      setError(null); // 에러 초기화
    } catch (err) {
      setError('로그인 실패: ' + err.message); // 에러 메시지 저장
      setResponse(null);
    }
  };

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <div className="content-wrapper">
          <h1>서버에서 받아온 데이터</h1>
          {response && <pre>{JSON.stringify(response, null, 2)}</pre>} {/* 데이터를 보기 쉽게 표시 */}
          {error && <p>{error}</p>}
          <div className="login-section">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>로그인</button>
          </div>
          <div className="content">
            <List /> {/* List 컴포넌트 추가 */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
