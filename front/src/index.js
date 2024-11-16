import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

// 에러 로깅 관련 import
import { setupAxiosInterceptors } from './services/apiInterceptor';
import { errorLogger } from './services/errorLogger';

// axios 인터셉터 설정
setupAxiosInterceptors();

// 전역 에러 핸들러 설정
window.onerror = (message, source, lineno, colno, error) => {
  errorLogger.logError(error || new Error(message));
};

// Promise 에러 핸들러 추가
window.onunhandledrejection = (event) => {
  errorLogger.logError(event.reason || new Error('Unhandled Promise rejection'));
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);

reportWebVitals();