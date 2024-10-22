import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';  // 부트스트랩 CSS와 함께 사용할 추가적인 스타일

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await axios.post('http://localhost:8082/boot/login', {
        username,
        password,
      }, { withCredentials: true });  // 세션 쿠키 허용

      await onLogin(); // 세션 확인
      navigate('/', { state: { username } });  // 메인 페이지로 이동
    } catch (err) {
      setError('로그인 실패: 아이디 또는 비밀번호가 잘못되었습니다.');
    }
  };

  return (
    <div className="container h-100">
      <div className="d-flex justify-content-center h-100">
        <div className="user_card">
          <div className="d-flex justify-content-center">
            <div className="brand_logo_container">
              <img
                src="https://cdn.freebiesupply.com/logos/large/2x/pinterest-circle-logo-png-transparent.png"
                className="brand_logo"
                alt="Logo"
              />
            </div>
          </div>
          <div className="d-flex justify-content-center form_container">
            <form>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <div className="input-group mb-3">
                <div className="input-group-append">
                  <span className="input-group-text"><i className="fas fa-user"></i></span>
                </div>
                <input
                  type="text"
                  className="form-control input_user"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="input-group mb-2">
                <div className="input-group-append">
                  <span className="input-group-text"><i className="fas fa-key"></i></span>
                </div>
                <input
                  type="password"
                  className="form-control input_pass"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <div className="custom-control custom-checkbox">
                  <input type="checkbox" className="custom-control-input" id="customControlInline" />
                  <label className="custom-control-label" htmlFor="customControlInline">Remember me</label>
                </div>
              </div>
              <div className="d-flex justify-content-center mt-3 login_container">
                <button type="button" onClick={handleLogin} className="btn login_btn">Login</button>
              </div>
            </form>
          </div>
          <div className="mt-4">
            <div className="d-flex justify-content-center links">
              Don't have an account? <a href="#" className="ml-2">Sign Up</a>
            </div>
            <div className="d-flex justify-content-center links">
              <a href="#">Forgot your password?</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
