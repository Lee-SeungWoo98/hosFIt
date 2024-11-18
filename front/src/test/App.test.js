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
 KTAS_5: 20,
 totalBeds: 48,
 usedBeds: 38
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
  window.localStorage.getItem.mockImplementation((key) => {
    if (key === 'isAuthenticated') return 'false';
    if (key === 'position') return null;
    return null;
  });

  let checkSessionCalled = false;
  axios.get.mockImplementation((url) => {
    if (url === API_ENDPOINTS.AUTH.CHECK_SESSION) {
      checkSessionCalled = true;
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
    if (url.includes('/prediction')) {
      return Promise.resolve({ data: mockPredictionData });
    }
    return Promise.resolve({ data: {} });
  });

  render(<App />);
  
  await waitFor(() => {
    expect(checkSessionCalled).toBe(true);
    expect(window.localStorage.setItem).toHaveBeenCalledWith('isAuthenticated', 'true');
    expect(window.localStorage.setItem).toHaveBeenCalledWith('position', '일반');
  });

  // handleAuthenticationSuccess가 호출된 후의 결과 체크
  expect(window.location.href).toBe('/');
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

 test('일반 사용자 로그아웃 기능 테스트', async () => {
  // localStorage 모킹 설정
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
    if (url.includes('/prediction')) {
      return Promise.resolve({ data: mockPredictionData });
    }
    return Promise.resolve({ data: {} });
  });

  await act(async () => {
    render(<App />);
  });

  // 로그아웃 버튼 찾기 (여러 방식으로 시도)
  const logoutButton = await waitFor(() => {
    // 한글 텍스트로 찾기 시도
    const koreanText = screen.queryByText('로그아웃');
    if (koreanText) return koreanText;

    // 영문 텍스트로 찾기 시도 (대소문자 구분 없이)
    const englishText = screen.queryByText(/logout/i);
    if (englishText) return englishText;

    // role과 이미지로 찾기 시도
    const buttonWithImage = screen.queryByRole('button', {
      name: (content, element) => {
        return element.querySelector('img[alt="logout"]') !== null ||
               element.querySelector('img[alt="Logout"]') !== null ||
               element.querySelector('img[alt="로그아웃"]') !== null;
      }
    });
    if (buttonWithImage) return buttonWithImage;

    // 모든 시도가 실패하면 에러 발생
    throw new Error('로그아웃 버튼을 찾을 수 없습니다.');
  });

  // 버튼이 실제로 존재하는지 확인
  expect(logoutButton).toBeInTheDocument();

  // 로그아웃 버튼 클릭
  await act(async () => {
    await userEvent.click(logoutButton);
  });

  // 로그아웃 후 상태 확인
  await waitFor(() => {
    // localStorage 항목 제거 확인
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('isAuthenticated');
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('position');
    
    // 로그인 페이지로 리다이렉션 확인
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});

 test('관리자 로그아웃 기능 테스트', async () => {
   window.localStorage.getItem.mockImplementation((key) => {
     if (key === 'isAuthenticated') return 'true';
     if (key === 'position') return '관리자';
     return null;
   });

   axios.get.mockImplementation((url) => {
     if (url === API_ENDPOINTS.AUTH.CHECK_SESSION) {
       return Promise.resolve({
         data: {
           isAuthenticated: true,
           user: { position: '관리자' }
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

   await waitFor(() => {
     const logoutImg = screen.queryByAltText('Logout');
     expect(logoutImg).toBeInTheDocument();
   });

   const logoutButton = screen.getByRole('button', {
     name: (content, element) => {
       return element.querySelector('img[alt="Logout"]') !== null;
     }
   });

   await act(async () => {
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