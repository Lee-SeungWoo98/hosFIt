// src/services/errorLogger.js

import axios from 'axios';
import { ERROR_ENDPOINTS, ERROR_TYPES, SEVERITY_LEVELS } from '../constants/errorLogger';
import { API_ENDPOINTS } from '../constants/api';

class ErrorLogger {
  constructor() {
    this.endpoint = API_ENDPOINTS.ERROR.LOG;
    this.errorQueue = [];  
    this.retryInterval = 5 * 60 * 1000;  
    this.retryCount = 0;
    this.maxRetries = 5;  
    this.initializeRetryMechanism();  // startRetryMechanism을 initializeRetryMechanism으로 변경
  }

  initializeRetryMechanism() {  // 메서드 이름 변경
    setInterval(() => {
      if (this.errorQueue.length > 0) {
        console.log(`Retrying to send ${this.errorQueue.length} error logs`);
        this.retryFailedLogs();
      }
    }, this.retryInterval);
  }

  async logError(error, errorInfo = {}) {
    const errorLog = {
      errorname: error.name || 'Unknown Error',
      errormessage: error.message || '',
      errorstack: error.stack || '',
      errortype: this.determineErrorType(error, errorInfo.type),
      severitylevel: this.determineSeverityLevel(error, errorInfo.severity),
      url: window.location.pathname,
      userid: localStorage.getItem('userId'),
      browser: navigator.userAgent,
      createdat: new Date().toISOString(),
      isresolved: false
    };
  
    try {
      await axios.post(this.endpoint, errorLog);
      console.info('Error logged successfully');
    } catch (loggingError) {
      this.errorQueue.push({
        log: errorLog,
        retryCount: 0,
        timestamp: Date.now()
      });
      console.warn('Error log queued for retry');
    }
  }

  async retryFailedLogs() {
    const currentQueue = [...this.errorQueue];
    this.errorQueue = [];

    for (const item of currentQueue) {
      if (item.retryCount >= this.maxRetries) {
        console.warn('Max retries exceeded for error log:', item.log);
        continue;
      }

      try {
        await axios.post(this.endpoint, item.log);
        console.info('Queued error log sent successfully');
      } catch (error) {
        item.retryCount++;
        this.errorQueue.push(item);
      }
    }
  }

  determineErrorType(error, providedType) {
    if (providedType) return providedType;
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return error.response.status >= 500 ? 
          ERROR_TYPES.SERVER_ERROR : 
          ERROR_TYPES.CLIENT_ERROR;
      }
      return ERROR_TYPES.NETWORK_ERROR;
    }
    
    return ERROR_TYPES.CLIENT_ERROR;
  }

  determineSeverityLevel(error, providedSeverity) {
    if (providedSeverity) return providedSeverity;

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status >= 500) return SEVERITY_LEVELS.ERROR;
      if (status >= 400) return SEVERITY_LEVELS.WARNING;
      return SEVERITY_LEVELS.INFO;
    }

    return SEVERITY_LEVELS.ERROR;
  }

  async logAPIError(error, endpoint) {
    const errorInfo = {
      type: ERROR_TYPES.API_ERROR,
      severity: error.response?.status >= 500 ? 
        SEVERITY_LEVELS.ERROR : 
        SEVERITY_LEVELS.WARNING
    };
    
    await this.logError(error, errorInfo);
  }
}

export const errorLogger = new ErrorLogger();