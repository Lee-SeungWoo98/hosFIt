// front/src/tests/KtasData.test.js
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import axios from 'axios';
import React, { useState } from 'react';

// axios mock 설정
jest.mock('axios');

// API_ENDPOINTS mock
jest.mock('../constants/api', () => ({
  API_ENDPOINTS: {
    PATIENTS: {
      STATISTICS: {
        TAS: '/api/patients/statistics/tas'
      }
    }
  }
}));

// KTAS 데이터를 표시할 테스트용 컴포넌트
const TestComponent = () => {
  const [ktasData, setKtasData] = useState(null);
  const totalBed = 48;

  const fetchKtasData = async () => {
    try {
      const result = await axios.get('/api/patients/statistics/tas');
      const valueArray = Object.values(result.data);
      setKtasData({
        totalBeds: totalBed,
        usedBeds: totalBed - valueArray.reduce((acc, cur) => acc + cur, 0),
        ktasRatios: valueArray,
      });
    } catch (error) {
      console.error("KTAS 데이터 로드 실패:", error);
      setKtasData({
        totalBeds: 100,
        usedBeds: 75,
        ktasRatios: [10, 20, 30, 25, 15],
      });
    }
  };

  return (
    <div>
      <button onClick={fetchKtasData} data-testid="fetch-button">
        Load KTAS Data
      </button>
      {ktasData && (
        <div data-testid="ktas-data">
          <div data-testid="total-beds">{ktasData.totalBeds}</div>
          <div data-testid="used-beds">{ktasData.usedBeds}</div>
          <div data-testid="ktas-ratios">
            {ktasData.ktasRatios.join(',')}
          </div>
        </div>
      )}
    </div>
  );
};

describe('KTAS Data Fetching', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('성공적으로 KTAS 데이터를 불러오는 경우', async () => {
    // Mock API 응답 설정
    const mockKtasResponse = {
      data: {
        KTAS1: 5,
        KTAS2: 10,
        KTAS3: 15,
        KTAS4: 8,
        KTAS5: 4
      }
    };
    axios.get.mockResolvedValueOnce(mockKtasResponse);

    // 컴포넌트 렌더링
    render(<TestComponent />);

    // 데이터 로드 버튼 클릭
    const fetchButton = screen.getByTestId('fetch-button');
    await act(async () => {
      fetchButton.click();
    });

    // 결과 검증
    await waitFor(() => {
      // API 호출 확인
      expect(axios.get).toHaveBeenCalledWith('/api/patients/statistics/tas');
      
      // 데이터가 올바르게 표시되는지 확인
      const totalBeds = screen.getByTestId('total-beds');
      const usedBeds = screen.getByTestId('used-beds');
      const ktasRatios = screen.getByTestId('ktas-ratios');
      
      expect(totalBeds).toHaveTextContent('48');
      expect(usedBeds).toHaveTextContent('6'); // 48 - (5+10+15+8+4)
      expect(ktasRatios).toHaveTextContent('5,10,15,8,4');
    });
  });

  test('API 호출이 실패하는 경우', async () => {
    // Mock API 실패 설정
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch KTAS data'));

    // 컴포넌트 렌더링
    render(<TestComponent />);

    // 데이터 로드 버튼 클릭
    const fetchButton = screen.getByTestId('fetch-button');
    await act(async () => {
      fetchButton.click();
    });

    // 결과 검증
    await waitFor(() => {
      // API 호출 확인
      expect(axios.get).toHaveBeenCalledWith('/api/patients/statistics/tas');
      
      // 기본값이 올바르게 설정되는지 확인
      const totalBeds = screen.getByTestId('total-beds');
      const usedBeds = screen.getByTestId('used-beds');
      const ktasRatios = screen.getByTestId('ktas-ratios');
      
      expect(totalBeds).toHaveTextContent('100');
      expect(usedBeds).toHaveTextContent('75');
      expect(ktasRatios).toHaveTextContent('10,20,30,25,15');
    });
  });

  test('빈 데이터를 받는 경우', async () => {
    // Mock 빈 응답 설정
    const mockEmptyResponse = {
      data: {}
    };
    axios.get.mockResolvedValueOnce(mockEmptyResponse);

    // 컴포넌트 렌더링
    render(<TestComponent />);

    // 데이터 로드 버튼 클릭
    const fetchButton = screen.getByTestId('fetch-button');
    await act(async () => {
      fetchButton.click();
    });

    // 결과 검증
    await waitFor(() => {
      // API 호출 확인
      expect(axios.get).toHaveBeenCalledWith('/api/patients/statistics/tas');
      
      // 빈 데이터 처리가 올바르게 되는지 확인
      const totalBeds = screen.getByTestId('total-beds');
      const usedBeds = screen.getByTestId('used-beds');
      const ktasRatios = screen.getByTestId('ktas-ratios');
      
      expect(totalBeds).toHaveTextContent('48');
      expect(usedBeds).toHaveTextContent('48'); // 빈 배열의 reduce 결과는 0
      expect(ktasRatios).toHaveTextContent('');
    });
  });

  test('console.error가 호출되는지 확인', async () => {
    // console.error spy 설정
    const consoleSpy = jest.spyOn(console, 'error');
    
    // Mock API 실패 설정
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    // 컴포넌트 렌더링
    render(<TestComponent />);

    // 데이터 로드 버튼 클릭
    const fetchButton = screen.getByTestId('fetch-button');
    await act(async () => {
      fetchButton.click();
    });

    // console.error 호출 확인
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'KTAS 데이터 로드 실패:',
        expect.any(Error)
      );
    });

    // spy 정리
    consoleSpy.mockRestore();
  });
});