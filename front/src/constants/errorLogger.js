// src/constants/errorLogger.js

const ERROR_ENDPOINTS = {
    LOG: "http://localhost:8082/boot/errors/log",  // 에러 로그 저장 엔드포인트
    STATS: "http://localhost:8082/boot/error/stats" // 에러 통계 엔드포인트
  };
  
  export const ERROR_TYPES = {
    CLIENT_ERROR: 'client_error',
    SERVER_ERROR: 'server_error',
    NETWORK_ERROR: 'network_error',
    REACT_ERROR: 'react_error',
    API_ERROR: 'api_error'
  };
  
  export const SEVERITY_LEVELS = {
    FATAL: 'fatal',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  };
  
  export { ERROR_ENDPOINTS };