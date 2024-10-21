import React, { useState, useEffect } from "react";
import "../Components/Ktas.css";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const Ktas = () => {
  // 서버에서 받아올 상태 초기화
  const [totalBeds, setTotalBeds] = useState(0); // 총 병상 수
  const [usedBeds, setUsedBeds] = useState(0); // 사용 중인 병상 수
  const unusedBeds = totalBeds - usedBeds; // 미사용
  const [ktasData, setKtasData] = useState([]); // KTAS 비율 데이터

  useEffect(() => {
    // 서버에서 병상 정보와 KTAS 비율을 받아옴
    axios
      .get("http://localhost:8082/boot/beds")
      .then((response) => {
        const data = response.data;
        setTotalBeds(data.totalBeds); // 총 병상 수
        setUsedBeds(data.usedBeds); // 사용 중인 병상 수
        setKtasData(data.ktasRatios); // KTAS 비율 (리스트 형식)
      })
      .catch(() => {
        console.log("데이터를 불러오는 데 실패했습니다.");
      });
  }, []);

  // 사용 중인 병상의 KTAS 레벨 비율 데이터 가공
  const tasData = ktasData.map((ratio, index) => {
    const level = index + 1;
    const colors = ["#0000FF", "#FF0000", "#FFFF00", "#00FF00", "#FFFFFF"]; // 각 레벨에 맞는 색상
    return {
      name: `KTAS ${level}`,
      value: ratio,
      color: colors[index] || "#DDDDDD", // 색상 지정
    };
  });

  // 사용 중 vs 미사용 병상을 포함한 데이터
  const fullData = [
    ...tasData, // 사용 중인 병상에 KTAS 레벨 데이터 추가
    { name: "미사용", value: unusedBeds, color: "#DDDDDD" }, // 미사용 병상 (회색)
  ];

  return (
    <aside className="sidebar">
      <div className="chart-container">
        <h3>KTAS 병상 점유율</h3>
        <ResponsiveContainer width="100%" height={200}>
          {" "}
          {/* 반응형으로 차트 크기 조정 */}
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

                return (
                  <text
                    x={x}
                    y={y}
                    fill="black" // 글씨 색상을 차트 안에서 보이도록 설정
                    textAnchor="middle" // 텍스트를 중앙에 정렬
                    dominantBaseline="central"
                  >
                    {`${value}`}
                  </text>
                );
              }}
            >
              {" "}
              // 파이 차트 조각 그리기
              {fullData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* 라벨 */}
      <div className="label-container">
        {fullData.map((entry, index) => (
          <div key={index} className="label-item">
            <span
              style={{ backgroundColor: entry.color }}
              className="label-dot"
            ></span>
            <div className="tas-per">
              {/* 서버에 클릭한 tas 검색 */}
              <span
                onClick={() => {
                  axios
                    .get("http://localhost:8082/boot/patients/details?")
                    .then((result) => {
                      console.log("result");
                    })
                    .catch(() => {
                      console.log("fail");
                    });
                }}
              >
                {entry.name}: {entry.value} Beds ({entry.percentage}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Ktas;
