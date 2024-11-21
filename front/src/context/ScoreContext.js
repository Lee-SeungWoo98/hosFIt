import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:8082/boot';

export const ScoreContext = createContext();

export const ScoreProvider = ({ children }) => {
  const [weights, setWeights] = useState({
    level0: 0.7,
    level1: 0.4,
    level2: 0.2
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchWeights = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/thresholds`);
      const thresholds = response.data;
      const newWeights = {
        level0: thresholds['0'] || 0.7,
        level1: thresholds['1'] || 0.4,
        level2: thresholds['2'] || 0.2,
      };
      console.log('Fetched weights from server:', newWeights);
      setWeights(newWeights);
    } catch (error) {
      console.error('Error fetching weights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeights();
  }, []);

  const updateWeights = useCallback(async (newWeights) => {
    setIsLoading(true);
    try {
        console.log('Updating weights:', newWeights);
        await Promise.all([
            axios.put(`${BASE_URL}/admin/thresholds/0?value=${newWeights.level0}`),
            axios.put(`${BASE_URL}/admin/thresholds/1?value=${newWeights.level1}`),
            axios.put(`${BASE_URL}/admin/thresholds/2?value=${newWeights.level2}`),
        ]);
        setWeights(newWeights);
        console.log('Weights updated successfully:', newWeights);
    } catch (error) {
        console.error('Error updating weights:', error);
        throw error;
    } finally {
        setIsLoading(false);
    }
}, []);

  return (
    <ScoreContext.Provider value={{ weights, updateWeights, isLoading, fetchWeights }}>
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