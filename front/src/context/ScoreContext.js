import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 기본 점수 설정
const DEFAULT_WEIGHTS = {
  icu: 0.7,
  ward: 0.6,
  discharge: 0.5
};

const ScoreContext = createContext();

export const ScoreProvider = ({ children }) => {
  const [weights, setWeights] = useState(() => {
    const savedWeights = localStorage.getItem('placementWeights');
    return savedWeights ? JSON.parse(savedWeights) : DEFAULT_WEIGHTS;
  });

  // 초기 가중치 데이터 로드
  useEffect(() => {
    const fetchInitialWeights = async () => {
      try {
        const responses = await Promise.all([
          axios.get('http://localhost:8082/boot/thresholds/0'), // 퇴원
          axios.get('http://localhost:8082/boot/thresholds/1'), // 일반병동
          axios.get('http://localhost:8082/boot/thresholds/2')  // 중환자실
        ]);

        const newWeights = {
          discharge: responses[0].data,
          ward: responses[1].data,
          icu: responses[2].data
        };

        setWeights(newWeights);
        localStorage.setItem('placementWeights', JSON.stringify(newWeights));
      } catch (error) {
        console.error('가중치 데이터 로드 실패:', error);
        // 에러 발생 시 기본값 사용
        setWeights(DEFAULT_WEIGHTS);
      }
    };

    fetchInitialWeights();
  }, []);

  // 가중치 업데이트 함수
  const updateWeights = async (newWeights) => {
    try {
      // 가중치 유효성 검사
      if (newWeights.icu <= newWeights.ward || newWeights.ward <= newWeights.discharge) {
        throw new Error('가중치는 ICU > 일반병동 > 퇴원 순서로 설정되어야 합니다.');
      }

      if (Object.values(newWeights).some(weight => weight > 0.9)) {
        throw new Error('가중치는 0.9를 초과할 수 없습니다.');
      }

      // DB 업데이트
      await Promise.all([
        axios.put(`http://localhost:8082/boot/thresholds/0`, null, { params: { value: newWeights.discharge }}),
        axios.put(`http://localhost:8082/boot/thresholds/1`, null, { params: { value: newWeights.ward }}),
        axios.put(`http://localhost:8082/boot/thresholds/2`, null, { params: { value: newWeights.icu }})
      ]);

      // 로컬 상태 업데이트
      setWeights(newWeights);
      localStorage.setItem('placementWeights', JSON.stringify(newWeights));
      
      return { success: true };
    } catch (error) {
      console.error('가중치 업데이트 실패:', error);
      throw error;
    }
  };

  return (
    <ScoreContext.Provider value={{ 
      weights, 
      updateWeights, 
      DEFAULT_WEIGHTS 
    }}>
      {children}
    </ScoreContext.Provider>
  );
};

// 커스텀 훅
export const useScores = () => {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error('useScores must be used within a ScoreProvider');
  }
  return context;
};