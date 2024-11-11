import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from '../App';
import { API_ENDPOINTS } from '../constants/api';

// axios 모킹 
jest.mock('axios');

// Mock location object
const mockLocation = {
 pathname: '/',
 search: '',
 state: { username: '테스트 사용자' }
};

// Mock KTAS Data
const mockKtasData = {
 KTAS_1: 10,
 KTAS_2: 15,
 KTAS_3: 25,
 KTAS_4: 30,
 KTAS_5: 20
};

// Mock prediction data
const mockPredictionData = {
 DISCHARGE: 35,
 WARD: 45,
 ICU: 20
};

// Mock patients data
const mockPatientsData = {
 patients: [],
 totalPages: 1, 
 totalElements: 0
};

// React Router 모킹
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
 const actual = jest.requireActual('react-router-dom');
 return {
   ...actual,
   BrowserRouter: ({ children }) => children,
   Routes: ({ children }) => children,
   Route: ({ element }) => element,
   Navigate: ({ to }) => {
     mockNavigate(to);
     return null;
   },
   useNavigate: () => mockNavigate,
   useLocation: () => mockLocation
 };
});

describe('App Login Functionality', () => {
 beforeEach(() => {
   jest.clearAllMocks();
   window.localStorage.clear();
   mockNavigate.mockClear();
   
   // localStorage 기본 상태 설정
   window.localStorage.getItem.mockImplementation((key) => {
     if (key === 'isAuthenticated') return 'false';
     if (key === 'position') return null;
     return null;
   });
 });

 test('초기 로그인 페이지 렌더링 테스트', async () => {
   // 세션 체크 API 모킹
   axios.get.mockImplementation((url) => {
     if (url === API_ENDPOINTS.AUTH.CHECK_SESSION) {
       return Promise.resolve({
         data: {
           isAuthenticated: false
         }
       });
     }
     return Promise.resolve({ data: {} });
   });

   await act(async () => {
     render(<App />);
   });

   await waitFor(() => {
     expect(mockNavigate).toHaveBeenCalledWith('/login');
   });
 });

 test('일반 사용자 로그인 성공 후 메인 페이지 리다이렉션', async () => {
   // 로그인 상태 설정
   window.localStorage.getItem.mockImplementation((key) => {
     if (key === 'isAuthenticated') return 'true';
     if (key === 'position') return '일반';
     return null;
   });

   // API 응답 모킹
   axios.get.mockImplementation((url) => {
     if (url === API_ENDPOINTS.AUTH.CHECK_SESSION) {
       return Promise.resolve({
         data: {
           isAuthenticated: true,
           user: { position: '일반' }
         }
       });
     }
     if (url.includes('/statistics/tas')) {
       return Promise.resolve({ data: mockKtasData });
     }
     if (url.includes('/patients')) {
       return Promise.resolve({ data: mockPatientsData });
     }
     if (url.includes('/prediction')) {
       return Promise.resolve({ data: mockPredictionData });
     }
     return Promise.resolve({ data: {} });
   });

   await act(async () => {
     render(<App />);
   });
   
   await waitFor(() => {
     expect(window.localStorage.setItem).toHaveBeenCalledWith('isAuthenticated', 'true');
     expect(window.localStorage.setItem).toHaveBeenCalledWith('position', '일반');
     expect(mockNavigate).toHaveBeenLastCalledWith('/');
   });
 });

 test('관리자 로그인 성공 후 관리자 페이지 리다이렉션', async () => {
   axios.get.mockImplementation((url) => {
     if (url === API_ENDPOINTS.AUTH.CHECK_SESSION) {
       return Promise.resolve({
         data: {
           isAuthenticated: true,
           user: { position: '관리자' }
         }
       });
     }
     return Promise.resolve({ data: {} });
   });

   await act(async () => {
     render(<App />);
   });

   await waitFor(() => {
     expect(window.localStorage.setItem).toHaveBeenCalledWith('isAuthenticated', 'true');
     expect(window.localStorage.setItem).toHaveBeenCalledWith('position', '관리자');
     expect(mockNavigate).toHaveBeenCalledWith('/admin');
   });
 });

 test('로그인 세션 만료 시 로그인 페이지로 리다이렉션', async () => {
   axios.get.mockImplementation((url) => {
     if (url === API_ENDPOINTS.AUTH.CHECK_SESSION) {
       return Promise.reject(new Error('Session expired'));
     }
     return Promise.resolve({ data: {} });
   });

   await act(async () => {
     render(<App />);
   });

   await waitFor(() => {
     expect(window.localStorage.removeItem).toHaveBeenCalledWith('isAuthenticated');
     expect(window.localStorage.removeItem).toHaveBeenCalledWith('position');
     expect(mockNavigate).toHaveBeenCalledWith('/login');
   });
 });

 test('로그아웃 기능 테스트', async () => {
   // 로그인 상태 설정
   window.localStorage.getItem.mockImplementation((key) => {
     if (key === 'isAuthenticated') return 'true';
     if (key === 'position') return '일반';
     return null;
   });

   // API 응답 모킹
   axios.get.mockImplementation((url) => {
     if (url === API_ENDPOINTS.AUTH.CHECK_SESSION) {
       return Promise.resolve({
         data: {
           isAuthenticated: true,
           user: { position: '일반' }
         }
       });
     }
     if (url.includes('/statistics/tas')) {
       return Promise.resolve({ data: mockKtasData });
     }
     if (url === API_ENDPOINTS.AUTH.LOGOUT) {
       return Promise.resolve({ data: { success: true } });
     }
     if (url.includes('/patients')) {
       return Promise.resolve({ data: mockPatientsData });
     }
     if (url.includes('/prediction')) {
       return Promise.resolve({ data: mockPredictionData });
     }
     return Promise.resolve({ data: {} });
   });

   await act(async () => {
     render(<App />);
   });

   // 로그아웃 버튼이 나타날 때까지 대기
   await waitFor(() => {
     const logoutButton = screen.queryByRole('button', { name: /logout/i });
     expect(logoutButton).toBeInTheDocument();
   });

   await act(async () => {
     const logoutButton = screen.getByRole('button', { name: /logout/i });
     await userEvent.click(logoutButton);
   });

   await waitFor(() => {
     expect(window.localStorage.removeItem).toHaveBeenCalledWith('isAuthenticated');
     expect(window.localStorage.removeItem).toHaveBeenCalledWith('position');
     expect(mockNavigate).toHaveBeenCalledWith('/login');
   });
 });

 test('세션 체크 네트워크 오류 처리', async () => {
   axios.get.mockImplementation((url) => {
     if (url === API_ENDPOINTS.AUTH.CHECK_SESSION) {
       return Promise.reject(new Error('Network Error'));
     }
     return Promise.resolve({ data: {} });
   });

   await act(async () => {
     render(<App />);
   });

   await waitFor(() => {
     expect(window.localStorage.removeItem).toHaveBeenCalledWith('isAuthenticated');
     expect(window.localStorage.removeItem).toHaveBeenCalledWith('position');
     expect(mockNavigate).toHaveBeenCalledWith('/login');
   });
 });
});