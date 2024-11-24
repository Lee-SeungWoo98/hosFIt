import { API_ENDPOINTS } from './api';


export const ERROR_ENDPOINTS = {
  LOG: API_ENDPOINTS.ERROR.LOG,
  STATS: API_ENDPOINTS.ERROR.STATS
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