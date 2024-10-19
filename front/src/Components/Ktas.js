import React from "react";
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
  const totalBeds = 100; // 총 병상 수
  const usedBeds = 78; // 사용 중인 병상 수
  const unusedBeds = totalBeds - usedBeds; // 미사용 병상 수

  // 사용 중인 병상의 KTAS 레벨 비율
  const tasData = [
    { name: "KTAS 1", value: 30, color: "#0000FF" }, // 파란색 (KTAS 1)
    { name: "KTAS 2", value: 20, color: "#FF0000" }, // 빨간색 (KTAS 2)
    { name: "KTAS 3", value: 10, color: "#FFFF00" }, // 노란색 (KTAS 3)
    { name: "KTAS 4", value: 10, color: "#00FF00" }, // 초록색 (KTAS 4)
    { name: "KTAS 5", value: 8, color: "#FFFFFF" }, // 흰색 (KTAS 5)
  ];

  // 사용 중 vs 미사용 병상을 포함한 데이터
  const fullData = [
    ...tasData, // 사용 중인 병상에 KTAS 레벨 데이터 추가
    { name: "미사용", value: unusedBeds, color: "#DDDDDD" }, // 미사용 병상 (회색)
  ];

  

  return (
    <aside className="sidebar">
      <nav>
        {/* <ul>  그래프에 밀려 잠정 폐기
        <li className={activeMenu === 'main' ? 'active' : ''} onClick={() => handleMenuClick('main')}>
          <MainIcon size={20} /> Main
        </li>
        <li className={activeMenu === 'patientManagement' ? 'active' : ''} onClick={() => handleMenuClick('patientManagement')}>
          <PatientIcon size={20} /> 환자 관리
        </li>
        <li className={activeMenu === 'medicalRecords' ? 'active' : ''} onClick={() => handleMenuClick('medicalRecords')}>
          <MedicalRecordIcon size={20} /> 진료 기록
        </li>
        <li className={activeMenu === 'statistics' ? 'active' : ''} onClick={() => handleMenuClick('statistics')}>
          <StatisticsIcon size={20} /> 통계
        </li>
      </ul> */}
      </nav>
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
              <span onClick={() => {
                axios.get("http://localhost:8082/boot/patients/details")
                .then((result)=>{
                  console.log("result");
                })
                .catch(()=>{
                  console.log("fail");
                })
              }}>
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
