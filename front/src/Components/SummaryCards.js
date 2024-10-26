import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './styles/SummaryCards.css';

const SummaryCards = ({ data }) => {
  return (
    <div className="summary-cards">
      {data.map((card, index) => (
        <div key={index} className="card">
          <div className="card-header">
            <h3>{card.title}</h3>
            <div className={`trend ${card.trend}`}>
              {card.trend === 'up' ? (
                <TrendingUp className="icon" />
              ) : (
                <TrendingDown className="icon" />
              )}
              {card.trendValue}
            </div>
          </div>
          <div className="value">{card.value}</div>
          <div className="sub-text">{card.subText}</div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;