// Card.js
import React from 'react';

const Card = ({ title, value, trend, trendValue }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{title}</h3>
        <div className={`trend ${trend}`}>
          <span>{trendValue}</span>
        </div>
      </div>
      <div className="value">{value}</div>
      <div className="sub-text">최근 30일</div>
    </div>
  );
};

export default Card;
