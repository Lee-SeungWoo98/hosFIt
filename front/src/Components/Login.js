import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await axios.post('http://localhost:8082/boot/member/login', {
        username,
        password,
      }, { withCredentials: true });

      await onLogin();
      navigate('/', { state: { username } });
    } catch (err) {
      setError('로그인 실패: 아이디 또는 비밀번호가 잘못되었습니다.');
    }
  };

  return (
    <div className="page-wrapper min-vh-100">
      <div className="radial-gradient min-vh-100">
        <div className="container min-vh-100">
          <div className="row min-vh-100 align-items-center justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
              <div className="card mb-0">
                <div className="card-body p-4">
                  <div className="text-center mb-4">
                      <span className="logo">hos
                        <span className='logo-highlight'> 
                          F
                        </span>
                        it
                      </span>
                  </div>
                  
                  <form>
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">아이디</label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="password" className="form-label">비밀번호</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    
                    <div className="d-flex align-items-center justify-content-between mb-4">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="remember" />
                        <label className="form-check-label text-dark" htmlFor="remember">
                          Remember this Device
                        </label>
                      </div>
                    </div>
                    
                    <button 
                      type="button" 
                      className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2"
                      onClick={handleLogin}
                    >
                      로그인
                    </button>
                    
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;