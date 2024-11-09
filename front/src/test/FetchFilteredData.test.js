// src/test/FetchFilteredData.test.js
import { render, screen, act, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react';
import axios from 'axios';

// axios mock
jest.mock('axios');

// API_ENDPOINTS mock
jest.mock('../constants/api', () => ({
  API_ENDPOINTS: {
    PATIENTS: {
      LIST: 'http://test-api/patients'
    }
  }
}));

describe('fetchFilteredData function', () => {
  // 테스트에 사용할 mock 데이터
  const mockPatientData = {
    data: {
      patients: [
        {
          id: 1,
          name: 'John Doe',
          gender: 'M',
          visits: [
            {
              visitDate: [2024, 3, 15, 10, 30],
              icd: 'A01'
            }
          ]
        }
      ],
      totalPages: 2,
      totalElements: 10
    }
  };

  // 각 테스트 전에 실행될 설정
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('기본 데이터 로드 테스트', async () => {
    // API 응답 모의 설정
    axios.get.mockResolvedValueOnce(mockPatientData);

    // 상태 관리를 위한 mock 함수들
    const setLoading = jest.fn();
    const setPatients = jest.fn();
    const setFilteredPatients = jest.fn();
    const setTotalPages = jest.fn();
    const setTotalElements = jest.fn();
    const setCurrentPage = jest.fn();
    const setError = jest.fn();
    const setFilters = jest.fn();

    // filters와 searchTerm mock
    const mockFilters = {};
    const mockSearchTerm = '';

    // 테스트할 함수 구현
    const fetchData = async (page = 0, currentFilters = mockFilters, signal) => {
      try {
        setLoading(true);
        const pageNumber = typeof page === 'object' ? 0 : page;
        
        const url = new URL('http://test-api/patients');
        url.searchParams.append('page', pageNumber);

        const options = signal ? { signal } : {};
        const response = await axios.get(url.toString(), options);

        if (response.data) {
          setFilters(currentFilters);
          setPatients(response.data.patients);
          setFilteredPatients(response.data.patients);
          setTotalPages(response.data.totalPages || 1);
          setTotalElements(response.data.totalElements);
          setCurrentPage(pageNumber);
          setError(null);
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          setError('Error fetching data');
          setPatients([]);
          setFilteredPatients([]);
        }
      } finally {
        setLoading(false);
      }
    };

    // 함수 실행
    await act(async () => {
      await fetchData();
    });

    // 검증
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('http://test-api/patients?page=0');
    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenCalledWith(false);
    expect(setPatients).toHaveBeenCalledWith(mockPatientData.data.patients);
    expect(setFilteredPatients).toHaveBeenCalledWith(mockPatientData.data.patients);
    expect(setTotalPages).toHaveBeenCalledWith(2);
    expect(setTotalElements).toHaveBeenCalledWith(10);
    expect(setCurrentPage).toHaveBeenCalledWith(0);
  });

  test('검색어와 필터가 있는 경우', async () => {
    axios.get.mockResolvedValueOnce(mockPatientData);

    const setLoading = jest.fn();
    const setPatients = jest.fn();
    const setFilteredPatients = jest.fn();
    const setTotalPages = jest.fn();
    const setTotalElements = jest.fn();
    const setCurrentPage = jest.fn();
    const setError = jest.fn();
    const setFilters = jest.fn();

    const mockFilters = {
      searchTerm: 'John',
      gender: 'M',
      tas: '1',
      painScore: '5'
    };

    const fetchData = async (page = 0, currentFilters = mockFilters, signal) => {
      try {
        setLoading(true);
        const pageNumber = typeof page === 'object' ? 0 : page;
        
        const url = new URL('http://test-api/patients');
        url.searchParams.append('page', pageNumber);
        
        if (currentFilters.searchTerm) {
          url.searchParams.append('name', currentFilters.searchTerm);
        }
        if (currentFilters?.gender != null && currentFilters.gender !== '') {
          url.searchParams.append('gender', currentFilters.gender);
        }
        if (currentFilters?.tas && currentFilters.tas !== '') {
          url.searchParams.append('tas', currentFilters.tas);
        }
        if (currentFilters?.painScore && currentFilters.painScore !== '') {
          url.searchParams.append('pain', currentFilters.painScore);
        }

        const options = signal ? { signal } : {};
        const response = await axios.get(url.toString(), options);

        if (response.data) {
          setFilters(currentFilters);
          setPatients(response.data.patients);
          setFilteredPatients(response.data.patients);
          setTotalPages(response.data.totalPages || 1);
          setTotalElements(response.data.totalElements);
          setCurrentPage(pageNumber);
          setError(null);
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          setError('Error fetching data');
          setPatients([]);
          setFilteredPatients([]);
        }
      } finally {
        setLoading(false);
      }
    };

    await act(async () => {
      await fetchData(0, mockFilters);
    });

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('name=John')
    );
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('gender=M')
    );
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('tas=1')
    );
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('pain=5')
    );
  });

  test('API 호출 실패 처리', async () => {
    // API 실패 모의 설정
    const mockError = new Error('API Error');
    axios.get.mockRejectedValueOnce(mockError);

    const setLoading = jest.fn();
    const setPatients = jest.fn();
    const setFilteredPatients = jest.fn();
    const setError = jest.fn();

    const fetchData = async (page = 0, currentFilters = {}, signal) => {
      try {
        setLoading(true);
        const url = new URL('http://test-api/patients');
        url.searchParams.append('page', page);

        const options = signal ? { signal } : {};
        await axios.get(url.toString(), options);
      } catch (error) {
        if (!axios.isCancel(error)) {
          setError('Error fetching data');
          setPatients([]);
          setFilteredPatients([]);
        }
      } finally {
        setLoading(false);
      }
    };

    await act(async () => {
      await fetchData();
    });

    expect(setError).toHaveBeenCalled();
    expect(setPatients).toHaveBeenCalledWith([]);
    expect(setFilteredPatients).toHaveBeenCalledWith([]);
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  test('요청 취소 처리', async () => {
    const abortController = new AbortController();
    const setLoading = jest.fn();
    const setError = jest.fn();

    const fetchData = async (page = 0, currentFilters = {}, signal) => {
      try {
        setLoading(true);
        const url = new URL('http://test-api/patients');
        url.searchParams.append('page', page);

        const options = signal ? { signal } : {};
        await axios.get(url.toString(), options);
      } catch (error) {
        if (!axios.isCancel(error)) {
          setError('Error fetching data');
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    };

    // 요청 시작 후 바로 취소
    const promise = fetchData(0, {}, abortController.signal);
    abortController.abort();
    await promise;

    expect(setError).not.toHaveBeenCalled();
    expect(setLoading).toHaveBeenCalledWith(true);
  });
});