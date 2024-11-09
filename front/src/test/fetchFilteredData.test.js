const { render, act, waitFor } = require('@testing-library/react');
const axios = require('axios');
const App = require('../App').default;
const { API_ENDPOINTS } = require('../constants/api');

// axios 모킹
jest.mock('axios', () => ({
  get: jest.fn()
}));

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
    // localStorage 모킹
    global.localStorage = {
      getItem: jest.fn(() => 'true'),
      setItem: jest.fn(),
      removeItem: jest.fn()
    };
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
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('page=0'),
        expect.any(Object)
      );
    });
  });

  test('API 에러 처리 테스트', async () => {
    const errorMessage = 'Network Error';
    axios.get.mockRejectedValue(new Error(errorMessage));

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });
});