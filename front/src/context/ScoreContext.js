// src/context/ScoreContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';

const ScoreContext = createContext();

export const ScoreProvider = ({ children }) => {
  const [weights, setWeights] = useState({
    level0: 0.7, // 중증병동
    level1: 0.4, // 일반병동
    level2: 0.2  // 퇴원
  });

  const updateWeights = useCallback((newWeights) => {
    setWeights(newWeights);
  }, []);

  return (
    <ScoreContext.Provider value={{ weights, updateWeights }}>
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