import React, { useState, useEffect } from "react";
import "../Components/Ktas.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// ktasFilter prop 추가
const Ktas = ({ ktasData, onTASClick, ktasFilter }) => {
 const [hoveredIndex, setHoveredIndex] = useState(null); // 레이블 호버 -> 그래프 튀어나옴

 // App.js로부터 받은 ktasData 사용
 const totalBeds = ktasData?.totalBeds || 0;
 const usedBeds = ktasData?.usedBeds || 0;
 // 데이터가 아직 로드되지 않았다면 미사용 병상 계산을 미루기
 const unusedBeds = totalBeds > 0 ? totalBeds - usedBeds : 0;

 // 테스트용
 // console.log(`Total Beds: ${totalBeds}, Used Beds: ${usedBeds}`);
 // console.log(`Unused Beds: ${unusedBeds}`);

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

 // 새로운 handleLabelClick 함수 추가
 const handleLabelClick = (entry) => {
   onTASClick(entry); // 전체 이름을 그대로 전달
 };

 return (
   <aside className="sidebar">
     <div className="chart-container">
       <h3 className="chart-title">KTAS 병상 점유율</h3>
       <ResponsiveContainer width="100%" height={200}>
         <PieChart>
           <Pie
             data={fullData}
             dataKey="value"
             nameKey="name"
             cx="50%"
             cy="50%"
             innerRadius={45}
             outerRadius={90}
             onMouseEnter={(data, index) => setHoveredIndex(index)}
             onMouseLeave={() => setHoveredIndex(null)}
           >
             {fullData.map((entry, index) => (
               <Cell
                 key={`cell-${index}`}
                 fill={entry.color}
                 stroke={hoveredIndex === index ? "#000" : "none"} // 호버 시 윤곽선 추가
                 strokeWidth={hoveredIndex === index ? 3 : 0} // 윤곽선 두께 설정
                 style={{
                   transition: "stroke 0.3s ease", // 부드럽게 윤곽선 나타나게 하기
                 }}
               />
             ))}
           </Pie>
         </PieChart>
       </ResponsiveContainer>
     </div>
     <div className="label-container">
       {fullData.map((entry, index) => (
         <div
           key={index}
           className="label-item"
           onMouseEnter={() => setHoveredIndex(index)} // 레이블에 마우스 오버 시 해당 인덱스 설정
           onMouseLeave={() => setHoveredIndex(null)} // 마우스 아웃 시 인덱스 초기화
           onClick={() => handleLabelClick(entry)} // 수정된 부분
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