import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from '../App';
import { API_ENDPOINTS } from '../constants/api';

// axios 모킹
jest.mock('axios');

// localStorage 모킹
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('App Login Functionality', () => {
  beforeEach(() => {
    // 각 테스트 전에 모든 목업을 초기화
    jest.clearAllMocks();
    window.localStorage.clear();
    
    // localStorage 기본 상태 설정
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'isAuthenticated') return 'false';
      if (key === 'position') return null;
      return null;
    });
  });

  test('초기 로그인 페이지 렌더링 테스트', () => {
    render(<App />);
    expect(screen.getByText(/로그인/i)).toBeInTheDocument();
  });

  test('일반 사용자 로그인 성공 후 메인 페이지 리다이렉션', async () => {
    // 세션 체크 API 응답 모킹
    axios.get.mockImplementationOnce((url) => {
      if (url === API_ENDPOINTS.AUTH.CHECK_SESSION) {
        return Promise.resolve({
          data: {
            isAuthenticated: true,
            user: { position: '일반' }
          }
        });
      }
    });

    await act(async () => {
      render(<App />);
    });

    // localStorage 설정 확인
    expect(localStorage.setItem).toHaveBeenCalledWith('isAuthenticated', 'true');
    expect(localStorage.setItem).toHaveBeenCalledWith('position', '일반');

    // 리다이렉션 확인
    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });

  test('관리자 로그인 성공 후 관리자 페이지 리다이렉션', async () => {
    // 세션 체크 API 응답 모킹
    axios.get.mockImplementationOnce((url) => {
      if (url === API_ENDPOINTS.AUTH.CHECK_SESSION) {
        return Promise.resolve({
          data: {
            isAuthenticated: true,
            user: { position: '관리자' }
          }
        });
      }
    });

    await act(async () => {
      render(<App />);
    });

    // localStorage 설정 확인
    expect(localStorage.setItem).toHaveBeenCalledWith('isAuthenticated', 'true');
    expect(localStorage.setItem).toHaveBeenCalledWith('position', '관리자');

    // 리다이렉션 확인
    await waitFor(() => {
      expect(window.location.pathname).toBe('/admin');
    });
  });

  test('로그인 세션 만료 시 로그인 페이지로 리다이렉션', async () => {
    // 실패하는 세션 체크 응답 모킹
    axios.get.mockImplementationOnce((url) => {
      if (url === API_ENDPOINTS.AUTH.CHECK_SESSION) {
        return Promise.reject(new Error('Session expired'));
      }
    });

    await act(async () => {
      render(<App />);
    });

    // localStorage 항목 제거 확인
    expect(localStorage.removeItem).toHaveBeenCalledWith('isAuthenticated');
    expect(localStorage.removeItem).toHaveBeenCalledWith('position');

    // 로그인 페이지로 리다이렉션 확인
    await waitFor(() => {
      expect(screen.getByText(/로그인/i)).toBeInTheDocument();
    });
  });

  test('로그아웃 기능 테스트', async () => {
    // 먼저 로그인 상태로 설정
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'isAuthenticated') return 'true';
      if (key === 'position') return '일반';
      return null;
    });

    // 로그아웃 API 응답 모킹
    axios.get.mockImplementationOnce((url) => {
      if (url === API_ENDPOINTS.AUTH.LOGOUT) {
        return Promise.resolve({ data: { success: true } });
      }
    });

    await act(async () => {
      render(<App />);
    });

    // 로그아웃 처리 확인
    const logoutButton = screen.getByText(/로그아웃/i);
    await act(async () => {
      userEvent.click(logoutButton);
    });

    // localStorage 항목 제거 확인
    expect(localStorage.removeItem).toHaveBeenCalledWith('isAuthenticated');
    expect(localStorage.removeItem).toHaveBeenCalledWith('position');

    // 로그인 페이지로 리다이렉션 확인
    await waitFor(() => {
      expect(window.location.pathname).toBe('/login');
    });
  });

  test('세션 체크 네트워크 오류 처리', async () => {
    // 네트워크 오류 모킹
    axios.get.mockImplementationOnce((url) => {
      if (url === API_ENDPOINTS.AUTH.CHECK_SESSION) {
        return Promise.reject(new Error('Network Error'));
      }
    });

    await act(async () => {
      render(<App />);
    });

    // 로그인 페이지로 리다이렉션 확인
    await waitFor(() => {
      expect(screen.getByText(/로그인/i)).toBeInTheDocument();
    });

    // localStorage 초기화 확인
    expect(localStorage.removeItem).toHaveBeenCalledWith('isAuthenticated');
    expect(localStorage.removeItem).toHaveBeenCalledWith('position');
  });
});