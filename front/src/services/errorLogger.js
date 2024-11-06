// src/services/errorLogger.js

import axios from 'axios';
import { ERROR_ENDPOINTS, ERROR_TYPES, SEVERITY_LEVELS } from '../constants/errorLogger';
import { API_ENDPOINTS } from '../constants/api';

class ErrorLogger {
  constructor() {
    this.endpoint = ERROR_ENDPOINTS.LOG;
  }

  async logError(error, errorInfo = {}) {
    try {
      const errorLog = {
        error_name: error.name || 'Unknown Error',
        error_message: error.message || '',
        error_stack: error.stack || '',
        error_type: this.determineErrorType(error, errorInfo.type),
        severity_level: this.determineSeverityLevel(error, errorInfo.severity),
        url: window.location.pathname,
        user_id: localStorage.getItem('userId'),
        browser: navigator.userAgent,
        created_at: new Date().toISOString()
      };

      await axios.post(this.endpoint, errorLog);
      console.info('Error logged successfully');
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
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