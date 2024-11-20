import React, { createContext, useContext, useState, useCallback } from 'react';

const ScoreContext = createContext();

export const ScoreProvider = ({ children }) => {
  const [weights, setWeights] = useState({
    icu: 0.7,
    ward: 0.4,
    discharge: 0.2
  });

  const updateWeights = useCallback((newWeights) => {
    console.log('Updating weights in context:', newWeights);
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

export default ScoreContext;