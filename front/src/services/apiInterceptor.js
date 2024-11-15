// src/services/apiInterceptor.js

import axios from 'axios';
import { errorLogger } from './errorLogger';
import { API_ENDPOINTS } from '../constants/api';

export const setupAxiosInterceptors = () => {
 const shouldSkipLogging = (url) => {
   // source map 관련 요청
   if (url.endsWith('.map') || 
       url.includes('sourcemap') || 
       url.includes('bundle.js')) {
     return true;
   }
   // 에러 로깅 관련 요청
   if (url === API_ENDPOINTS.ERROR.LOG || url === API_ENDPOINTS.ERROR.LIST) {
     return true;
   }
   return false;
 };

 axios.interceptors.request.use(
   config => {
     if (config.url.startsWith(API_ENDPOINTS.AUTH.CHECK_SESSION)) {
       config.withCredentials = true;
     }
     return config;
   },
   error => Promise.reject(error)
 );

 axios.interceptors.response.use(
   response => response,
   error => {
     // 로깅을 건너뛰지 않아야 할 요청의 에러만 로깅
     if (!shouldSkipLogging(error.config.url)) {
       errorLogger.logAPIError(error, error.config.url);
     } else {
       console.warn('Skip logging for:', error.config.url);
     }
     return Promise.reject(error);
   }
 );
};