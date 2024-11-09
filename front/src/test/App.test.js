const { render, screen, act, waitFor } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event').default;
const axios = require('axios');
const App = require('../App').default;
const { API_ENDPOINTS } = require('../constants/api');

// axios 모킹
jest.mock('axios');

describe('App Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('기본 데이터 로딩 테스트', async () => {
    const mockData = {
      patients: [],
      totalPages: 0,
      totalElements: 0
    };

    axios.get.mockResolvedValueOnce({ data: mockData });

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
});