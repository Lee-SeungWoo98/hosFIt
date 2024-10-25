// Statistics.js
import React from 'react';
import Chart from './Chart';

const Statistics = () => {
  return (
    <section id="stats" className="tab-content">
      <h3>통계 분석</h3>
      <Chart title="통계 차트" chartId="statsChart" />
    </section>
  );
};

export default Statistics;
