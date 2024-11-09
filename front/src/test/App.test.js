// src/test/App.test.js

import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from '../App';
import { API_ENDPOINTS } from '../constants/api';

jest.mock('axios'); // axios를 mock 처리

// localStorage mock 설정
beforeEach(() => {
    jest.clearAllMocks();

    const localStorageMock = (() => {
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
            })
        };
    })();

    Object.defineProperty(window, 'localStorage', {
        value: localStorageMock
    });

    window.localStorage.clear(); // 각 테스트 전에 clear()를 호출하여 초기화
});

test('초기 로그인 페이지 렌더링 테스트', () => {
    render(<App />);
    const loginButton = screen.getByText(/로그인/i);
    expect(loginButton).toBeInTheDocument();
});

test('일반 사용자 로그인 성공 후 메인 페이지 리다이렉션', async () => {
    axios.post.mockResolvedValueOnce({ data: { role: 'user', token: 'user-token' } });

    render(<App />);
    userEvent.type(screen.getByLabelText(/아이디/i), 'testuser');
    userEvent.type(screen.getByLabelText(/비밀번호/i), 'password');
    userEvent.click(screen.getByText(/로그인/i));

    await waitFor(() => {
        expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'user-token');
    });
    expect(screen.getByText(/메인 페이지/i)).toBeInTheDocument();
});

test('관리자 로그인 성공 후 관리자 페이지 리다이렉션', async () => {
    axios.post.mockResolvedValueOnce({ data: { role: 'admin', token: 'admin-token' } });

    render(<App />);
    userEvent.type(screen.getByLabelText(/아이디/i), 'adminuser');
    userEvent.type(screen.getByLabelText(/비밀번호/i), 'password');
    userEvent.click(screen.getByText(/로그인/i));

    await waitFor(() => {
        expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'admin-token');
    });
    expect(screen.getByText(/관리자 페이지/i)).toBeInTheDocument();
});

test('로그인 세션 만료 시 로그인 페이지로 리다이렉션', async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 401 } }); // 401 Unauthorized

    render(<App />);

    await waitFor(() => {
        expect(screen.getByText(/로그인/i)).toBeInTheDocument();
    });
});

test('로그아웃 기능 테스트', async () => {
    render(<App />);

    userEvent.click(screen.getByText(/로그아웃/i));

    await waitFor(() => {
        expect(window.localStorage.clear).toHaveBeenCalled();
    });
    expect(screen.getByText(/로그인/i)).toBeInTheDocument();
});

test('세션 체크 네트워크 오류 처리', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    render(<App />);

    await waitFor(() => {
        expect(screen.getByText(/로그인/i)).toBeInTheDocument();
    });
});
