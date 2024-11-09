import { render, act, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from '../App';
import { API_ENDPOINTS } from '../constants/api';

jest.mock('axios');

describe('fetchFilteredData Functionality', () => {
  const mockPatientData = {
    patients: [
      {
        id: 1,
        name: "Test Patient",
        gender: "M",
        visitDate: [2024, 3, 15, 10, 30],
        icd: "J00",
        visits: [{
          visitDate: [2024, 3, 15, 10, 30],
          icd: "J00"
        }]
      }
    ],
    totalPages: 1,
    totalElements: 1
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'true'),
        setItem: jest.fn(),
        removeItem: jest.fn()
      },
      writable: true
    });
  });

  test('기본 데이터 로딩 테스트', async () => {
    axios.get.mockResolvedValue({ data: mockPatientData });

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining(API_ENDPOINTS.PATIENTS.LIST),
        expect.any(Object)
      );
    });
  });

  test('필터링 파라미터 테스트', async () => {
    axios.get.mockResolvedValue({ data: mockPatientData });

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      const url = axios.get.mock.calls[0][0];
      expect(url).toContain('page=0');
    });
  });

  test('API 에러 처리 테스트', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });
});