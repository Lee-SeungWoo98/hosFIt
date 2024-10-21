import React from "react";
import "../Components/Ktas.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const Ktas = ({ ktasData }) => {  // App.js로부터 받은 ktasData 사용
  const totalBeds = ktasData?.totalBeds || 0;
  const usedBeds = ktasData?.usedBeds || 0;
  const unusedBeds = totalBeds - usedBeds;

  const tasData = ktasData?.ktasRatios?.map((ratio, index) => {
    const level = index + 1;
    const colors = ["#0000FF", "#FF0000", "#FFFF00", "#00FF00", "#FFFFFF"]; // 각 레벨에 맞는 색상
    return {
      name: `KTAS ${level}`,
      value: ratio,
      color: colors[index] || "#DDDDDD", // 색상 지정
    };
  }) || [];

  const fullData = [
    ...tasData, 
    { name: "미사용", value: unusedBeds, color: "#DDDDDD" }, // 미사용 병상 (회색)
  ];

  return (
    <aside className="sidebar">
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
              label={({ name, value, cx, cy, midAngle, innerRadius, outerRadius }) => {
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
      <div className="label-container">
        {fullData.map((entry, index) => (
          <div key={index} className="label-item">
            <span
              style={{ backgroundColor: entry.color }}
              className="label-dot"
            ></span>
            <div className="tas-per">
              <span>
                {entry.name}: {entry.value} Beds
              </span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Ktas;
