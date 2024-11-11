// setupTests.js
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// 테스트 라이브러리 설정
configure({
  testIdAttribute: 'data-testid',
  defaultHidden: true,
});

// Mock localStorage
const createStorageMock = () => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    length: jest.fn(() => Object.keys(store).length),
    key: jest.fn((index) => Object.keys(store)[index] || null),
  };
};

// localStorage와 sessionStorage 모킹 생성
const localStorageMock = createStorageMock();
const sessionStorageMock = createStorageMock();

// window 객체에 Storage 모킹 추가
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
  configurable: true,
});

// Mock window.location
const mockLocation = {
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  href: 'http://localhost',
  pathname: '/',
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
  configurable: true,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: jest.fn().mockImplementation((query) => ({
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

// React Router 관련 모킹 함수들
global.mockNavigate = jest.fn();
global.mockUseNavigate = jest.fn();

// 글로벌 에러 핸들링 설정
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore?.();
  console.warn.mockRestore?.();
});

// 각 테스트 전에 모든 mock 초기화
beforeEach(() => {
  jest.clearAllMocks();
  
  // Storage 초기화
  window.localStorage.clear();
  window.sessionStorage.clear();
  
  // Location 초기화
  window.location.href = 'http://localhost';
  window.location.pathname = '/';
  mockLocation.assign.mockClear();
  mockLocation.replace.mockClear();
  mockLocation.reload.mockClear();
});

// 각 테스트 후 정리
afterEach(() => {
  document.body.innerHTML = '';
  jest.clearAllTimers();
  jest.useRealTimers();
});

// 전역 타임아웃 설정
jest.setTimeout(10000);