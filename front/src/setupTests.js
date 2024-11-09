// front/src/setupTests.js

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
require('@testing-library/jest-dom');

// 테스트 라이브러리 설정
configure({ testIdAttribute: 'data-testid' });

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.location
const mockLocation = new URL('http://localhost');
delete window.location;
window.location = mockLocation;

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

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  defaults: {
    baseURL: 'http://localhost:8082/boot',
    withCredentials: true
  }
}));

// 글로벌 에러 핸들링 설정
beforeAll(() => {
  // 콘솔 에러 무시 설정 (선택사항)
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  // 콘솔 에러 무시 해제 (선택사항)
  console.error.mockRestore?.();
});

// 각 테스트 전에 모든 mock 초기화
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});