// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
require('@testing-library/jest-dom');

// 테스트 라이브러리 설정
configure({ 
  testIdAttribute: 'data-testid',
  defaultHidden: true
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
};
Object.defineProperty(window, 'localStorage', { 
  value: localStorageMock,
  writable: true
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
};
Object.defineProperty(window, 'sessionStorage', { 
  value: sessionStorageMock,
  writable: true
});

// Mock window.location
const mockLocation = {
  pathname: '/',
  search: '',
  hash: '',
  href: 'http://localhost/',
  origin: 'http://localhost',
  protocol: 'http:',
  host: 'localhost',
  hostname: 'localhost',
  port: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn()
};
delete window.location;
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
};

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  defaults: {
    baseURL: 'http://localhost:8082/boot',
    withCredentials: true
  },
  create: jest.fn().mockReturnThis(),
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() }
  }
}));

// 글로벌 에러 핸들링 설정
beforeAll(() => {
  // 콘솔 에러 무시 설정
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  // 콘솔 에러/경고 무시 해제
  console.error.mockRestore?.();
  console.warn.mockRestore?.();
});

// 각 테스트 전에 모든 mock 초기화
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
  window.location = { ...mockLocation }; // 위치 초기화
});

// 각 테스트 후 정리
afterEach(() => {
  // DOM 정리
  document.body.innerHTML = '';
  // 모든 진행 중인 타이머 정리
  jest.clearAllTimers();
});

// 전역 타임아웃 설정
jest.setTimeout(10000); // 10초