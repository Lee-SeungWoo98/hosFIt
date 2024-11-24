const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8082/boot";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/member/login`,
    CHECK_SESSION: `${BASE_URL}/member/checkSession`,
    LOGOUT: `${BASE_URL}/member/logout`,
  },
  PATIENTS: {
    LIST: `${BASE_URL}/patients/list`,
    SEARCH: `${BASE_URL}/patients/search`,
    STATISTICS: {
      TAS: `${BASE_URL}/patients/statistics/tas`,
      TOTALBED: `${BASE_URL}/count`,
    },
    PREDICTION: `${BASE_URL}/patients/prediction`,
    LABEL: {
      UPDATE: (stayId) => `${BASE_URL}/patient/label/latest/${stayId}`,
    }
  },
  LAB_TESTS: `${BASE_URL}/labtests`,
  DETAILS: `${BASE_URL}/patients`,
  ERROR: {
    LOG: `${BASE_URL}/errors/log`,  
    LIST: `${BASE_URL}/errors`      
  }
};

export const AUTO_REFRESH_INTERVAL = 600000; // 10분

export const INITIAL_FILTERS = {
  gender: '',
  tas: '',
  painScore: '',
};

export const INITIAL_STATE = {
  patients: [],
  filteredPatients: [],
  totalPages: 1,
  totalElements: 0,
  currentPage: 0,
  ktasFilter: [],
  error: null,
  loading: false,
};