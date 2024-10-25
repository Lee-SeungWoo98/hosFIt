// AIModelManagement.js
import React from 'react';
import Chart from './Chart';

const AIModelManagement = () => {
  return (
    <section id="model" className="tab-content">
      <h3>ICU 점수 설정</h3>
      <div>
        <label htmlFor="icuThreshold">ICU 입실 기준점수</label>
        <input type="number" id="icuThreshold" value="40" min="0" max="100" />
        <button>설정 저장</button>
      </div>
      
      <h3>예측 성능 모니터링</h3>
      <Chart title="예측 성능" chartId="performanceChart" />
    </section>
  );
};

export default AIModelManagement;
