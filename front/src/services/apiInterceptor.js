// src/services/apiInterceptor.js

import axios from 'axios';
import { errorLogger } from './errorLogger';
import { API_ENDPOINTS } from '../constants/api';  // BASE_URL 대신 API_ENDPOINTS

export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    config => {
      if (config.url.startsWith(API_ENDPOINTS.AUTH.CHECK_SESSION)) {
        config.withCredentials = true;
      }
      return config;
    },
    error => {
      errorLogger.logAPIError(error, 'request_interceptor');
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    response => response,
    error => {
      const endpoint = error.config.url;
      errorLogger.logAPIError(error, endpoint);
      return Promise.reject(error);
    }
  );
};