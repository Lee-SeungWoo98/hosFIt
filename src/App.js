import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import PP from './pp';
import './App.css';

function App() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const rooms = ['버튼 1', '버튼 2'];
  
  const icuData = [
    { name: '사용 중', value: 40, color: '#FF6B6B' },
    { name: '사용 가능', value: 10, color: '#4ECDC4' },
  ];

  const wardData = [
    { name: '사용 중', value: 110, color: '#45B7D1' },
    { name: '사용 가능', value: 40, color: '#4ECDC4' },
  ];

  const renderCustomizedLabel = () => null;

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setShowReport(false);
  };

  const handleConfirmClick = () => {
    setShowReport(true);
  };

  const vitalSigns = [
    '활력징후1', '산소포화도', '심박수 (bpm)',
    '호흡 (회/분)', '체온 (°C)', '혈압 (mmHg)'
  ];

  return (
    <div className="dashboard">
      <div className="top-bar">
        <div className="logo">로고</div>
        <div className="search-bar">
          <input type="text" placeholder="검색" />
        </div>
        <div className="user-icon"></div>
      </div>
      
      <div className="main-content">
        <div className="sidebar">
          {rooms.map((room, index) => (
            <button key={index} className="room-button" onClick={() => handleRoomClick(room)}>
              {room}
            </button>
          ))}
        </div>

        <div className="content-area">
          {selectedRoom ? (
            <PP selectedRoom={selectedRoom} onBack={() => setSelectedRoom(null)} />
          ) : showReport ? (
            <div className="report-screen">
              <h2>보고서 화면을 넣어보자</h2>
              {/* 여기에 보고서 내용을 추가하세요 */}
            </div>
          ) : (
            <>
              <h2 className="section-title">병상 현황 및 환자 중증도</h2>
              <div className="dashboard-content">
                <div className="charts-container">
                  <div className="chart">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={icuData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={100}
                          innerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {icuData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <text x="50%" y="42%" textAnchor="middle" dominantBaseline="middle" className="chart-center-text">
                          중환자실
                        </text>
                        <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle" className="chart-center-number">
                          50
                        </text>
                        <text x="50%" y="66%" textAnchor="middle" dominantBaseline="middle" className="chart-center-subtext">
                          총 병상
                        </text>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="chart-legend">
                      <div className="legend-item">
                        <span className="legend-color" style={{backgroundColor: '#FF6B6B'}}></span>
                        <span>사용 중: 40실 (80%)</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{backgroundColor: '#4ECDC4'}}></span>
                        <span>사용 가능: 10실 (20%)</span>
                      </div>
                    </div>
                  </div>
                  <div className="chart">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={wardData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={100}
                          innerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {wardData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <text x="50%" y="42%" textAnchor="middle" dominantBaseline="middle" className="chart-center-text">
                          일반 병상
                        </text>
                        <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle" className="chart-center-number">
                          150
                        </text>
                        <text x="50%" y="66%" textAnchor="middle" dominantBaseline="middle" className="chart-center-subtext">
                          총 병상
                        </text>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="chart-legend">
                      <div className="legend-item">
                        <span className="legend-color" style={{backgroundColor: '#45B7D1'}}></span>
                        <span>사용 중: 110실 (73%)</span>
                      </div>
                      <div className="legend-item">
                        <span className="legend-color" style={{backgroundColor: '#4ECDC4'}}></span>
                        <span>사용 가능: 40실 (27%)</span>
                      </div>
                    </div>
                  </div>
                  <div className="patient-info">
                    <h3>환자 정보 및 중증도</h3>
                    <div className="patient-details">
                      <div className="patient-name-contact">
                        <div>이름: <input type="text" /></div>
                        <div>나이: <input type="text" /></div>
                      </div>
                      <div className="patient-severity">
                        <div>중증도</div>
                        <input type="range" className="severity-slider" />
                        <div className="severity-labels">
                          <span>미입력</span>
                          <span>정상 상태</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="vital-signs-container">
                <div className="vital-signs">
                  {vitalSigns.slice(0, 3).map((item, index) => (
                    <div key={index} className="vital-sign-item">
                      <h4>{item}</h4>
                      <input type="text" />
                    </div>
                  ))}
                </div>
                <div className="vital-signs">
                  {vitalSigns.slice(3).map((item, index) => (
                    <div key={index} className="vital-sign-item">
                      <h4>{item}</h4>
                      <input type="text" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="confirm-button-container">
                <button className="confirm-button" onClick={handleConfirmClick}>확인(누르지마세요)</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;