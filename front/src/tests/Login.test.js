// front/src/tests/Login.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Login from '../Components/Login';

// axios mock 설정
jest.mock('axios');

// react-router-dom의 useNavigate mock 설정
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('Login Component', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('로그인 성공 시 onLogin이 호출되어야 함', async () => {
    render(
      <BrowserRouter>
        <Login onLogin={mockOnLogin} />
      </BrowserRouter>
    );

    // API 응답 모의 설정
    axios.post.mockResolvedValueOnce({
      data: { success: true }
    });

    // 로그인 시도
    const usernameInput = screen.getByLabelText(/아이디/i);
    const passwordInput = screen.getByLabelText(/비밀번호/i);
    const loginButton = screen.getByRole('button', { name: /로그인/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.submit(loginButton.closest('form'));

    await waitFor(() => {
      // API가 올바른 데이터로 호출되었는지 확인
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8082/boot/member/login',
        {
          username: 'testuser',
          password: 'password123'
        },
        { withCredentials: true }
      );
      
      // onLogin 콜백이 호출되었는지 확인
      expect(mockOnLogin).toHaveBeenCalled();
    });
  });

  test('로그인 실패 시 에러 메시지가 표시되어야 함', async () => {
    render(
      <BrowserRouter>
        <Login onLogin={mockOnLogin} />
      </BrowserRouter>
    );

    // API 실패 응답 모의 설정
    axios.post.mockRejectedValueOnce(new Error('Login failed'));

    // 로그인 시도
    const usernameInput = screen.getByLabelText(/아이디/i);
    const passwordInput = screen.getByLabelText(/비밀번호/i);
    const loginButton = screen.getByRole('button', { name: /로그인/i });

    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.submit(loginButton.closest('form'));

    // 에러 메시지가 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        /로그인 실패: 아이디 또는 비밀번호가 잘못되었습니다/i
      );
    });
  });
});