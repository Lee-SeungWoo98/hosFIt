import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:8082/boot';

export const ScoreContext = createContext();

export const ScoreProvider = ({ children }) => {
  const [weights, setWeights] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchWeights = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/thresholds`);
      const thresholds = response.data;
      const newWeights = {
        level0: thresholds['0'],
        level1: thresholds['1'],
        level2: thresholds['2'],
      };
      setWeights(newWeights);
      setIsInitialized(true);
      localStorage.setItem('dashboard_weights', JSON.stringify(newWeights));
    } catch (error) {
      console.error('Error fetching weights:', error);
      // 서버 요청 실패 시 캐시된 값 사용
      const cached = localStorage.getItem('dashboard_weights');
      if (cached) {
        setWeights(JSON.parse(cached));
      }
      setIsInitialized(true);
    }
  };

  const updateWeights = useCallback(async (newWeights) => {
    try {
      await Promise.all([
        axios.put(`${BASE_URL}/admin/thresholds/0?value=${newWeights.level0}`),
        axios.put(`${BASE_URL}/admin/thresholds/1?value=${newWeights.level1}`),
        axios.put(`${BASE_URL}/admin/thresholds/2?value=${newWeights.level2}`),
      ]);
      setWeights(newWeights);
      localStorage.setItem('dashboard_weights', JSON.stringify(newWeights));
    } catch (error) {
      console.error('Error updating weights:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchWeights();
  }, []);

  if (!isInitialized) {
    return null; // 또는 로딩 표시
  }

  return (
    <ScoreContext.Provider value={{ weights, updateWeights, fetchWeights }}>
      {children}
    </ScoreContext.Provider>
  );
};

export const useScores = () => {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error('useScores must be used within a ScoreProvider');
  }
  return context;
};