import React, { createContext, useContext, useState, useEffect } from 'react';

const DEFAULT_SCORES = {
  icu: 75,
  ward: 45,
  discharge: 25
};

const ScoreContext = createContext();

export const ScoreProvider = ({ children }) => {
  // localStorage에서 점수를 불러오거나, 기본값 사용
  const [scores, setScores] = useState(() => {
    const savedScores = localStorage.getItem('placementScores');
    return savedScores ? JSON.parse(savedScores) : DEFAULT_SCORES;
  });

  // 점수가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('placementScores', JSON.stringify(scores));
  }, [scores]);

  const updateScores = (newScores) => {
    // 점수 유효성 검사
    if (newScores.icu <= newScores.ward || newScores.ward <= newScores.discharge) {
      alert('점수는 ICU > 일반병동 > 퇴원 순서로 설정되어야 합니다.');
      return;
    }

    if (newScores.icu > 100 || newScores.ward > 100 || newScores.discharge > 100) {
      alert('점수는 100을 초과할 수 없습니다.');
      return;
    }

    setScores(newScores);
  };

  return (
    <ScoreContext.Provider value={{ scores, updateScores, DEFAULT_SCORES }}>
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