// src/Components/__tests__/Login.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

// 테스트용 로그인 컴포넌트 래퍼
const renderLogin = (onLogin = jest.fn()) => {
  return render(
    <BrowserRouter>
      <Login onLogin={onLogin} />
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  // 가장 기본적인 렌더링 테스트
  test('renders login page correctly', () => {
    renderLogin();

    // 필수 요소들이 존재하는지 확인
    expect(screen.getByLabelText(/아이디/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/비밀번호/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /로그인/i })).toBeInTheDocument();
    expect(screen.getByText(/hosfit/i)).toBeInTheDocument();
  });

  // 입력 필드 동작 테스트
  test('input fields work correctly', async () => {
    renderLogin();

    const usernameInput = screen.getByLabelText(/아이디/i);
    const passwordInput = screen.getByLabelText(/비밀번호/i);

    // 사용자 입력 시뮬레이션
    await userEvent.type(usernameInput, 'testuser');
    await userEvent.type(passwordInput, 'password123');

    // 입력값 확인
    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('password123');
  });

  // 로고 렌더링 테스트
  test('renders logo correctly', () => {
    renderLogin();
    
    const logoElement = screen.getByText(/hos/i);
    expect(logoElement).toBeInTheDocument();
    expect(screen.getByText('F')).toBeInTheDocument();
    expect(screen.getByText('it')).toBeInTheDocument();
  });
});