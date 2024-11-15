import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './styles/SummaryCards.css';

const SummaryCards = ({ data }) => {
 return (
   <div className="admin-summary-cards">
     {data.map((card, index) => (
       <div key={index} className="admin-summary-card">
         <div className="admin-summary-header">
           <h3>{card.title}</h3>
           <div className={`admin-trend ${card.trend}`}>
             {card.trend === 'up' ? (
               <TrendingUp className="admin-icon" />
             ) : (
               <TrendingDown className="admin-icon" />
             )}
             {card.trendValue}
           </div>
         </div>
         <div className="admin-summary-value">{card.value}</div>
         <div className="admin-summary-subtext">{card.subText}</div>
       </div>
     ))}
   </div>
 );
};

export default SummaryCards;