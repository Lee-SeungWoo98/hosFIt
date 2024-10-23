import React, { useState, useEffect } from "react";
import "../Components/Ktas.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const Ktas = ({ ktasData, onTASClick }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null); // 레이블 호버 -> 그래프 튀어나옴

  // App.js로부터 받은 ktasData 사용
  const totalBeds = ktasData?.totalBeds || 0;
  const usedBeds = ktasData?.usedBeds || 0;
  // 데이터가 아직 로드되지 않았다면 미사용 병상 계산을 미루기
  const unusedBeds = totalBeds > 0 ? totalBeds - usedBeds : 0;

  console.log(`Total Beds: ${totalBeds}, Used Beds: ${usedBeds}`);
  console.log(`Unused Beds: ${unusedBeds}`);

  const tasData =
    ktasData?.ktasRatios?.map((ratio, index) => {
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
  console.log(fullData);

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
              onMouseEnter={(data, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              label={({
                name,
                value,
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
              }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                
                // 그래프에 숫자 나오게 하는 부분
                // return (
                //   <text
                //     x={x}
                //     y={y}
                //     fill="black"
                //     textAnchor="middle"
                //     dominantBaseline="central"
                //   >
                //     {`${value}`}
                //   </text>
                // );
              }}
            >
              {fullData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  style={{
                    transition: 'transform 0.3s ease',
                    transform: hoveredIndex === index ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="label-container">
        {fullData.map((entry, index) => (
          // Ktas.js 파일에서 수정 부분
          <div
            key={index}
            className="label-item"
            onMouseEnter={() => setHoveredIndex(index)} // 레이블에 마우스 오버 시 해당 인덱스 설정
            onMouseLeave={() => setHoveredIndex(null)} // 마우스 아웃 시 인덱스 초기화
            onClick={() => onTASClick(entry.name)}
          >
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
