import React from 'react';
import "../Components/Ktas.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const Ktas = ({ fullData }) => {
  return (
    <div className="chart-container">
      <h3>KTAS 병상 점유율</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={fullData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            labelLine={false}
            label={({ value, cx, cy, midAngle, innerRadius, outerRadius }) => {
              const RADIAN = Math.PI / 180;
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);
              return (
                <text
                  x={x}
                  y={y}
                  fill="black"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {`${value}`}
                </text>
              );
            }}
          >
            {fullData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Ktas;
