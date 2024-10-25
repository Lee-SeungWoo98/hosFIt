// Chart.js
import React, { useEffect } from 'react';
import { Chart as ChartJS } from 'chart.js';
import './Chart.css';

const Chart = ({ title, chartId }) => {
    useEffect(() => {
        new ChartJS(document.getElementById(chartId), {
            type: 'line',
            data: {},
            options: {}
        });
    }, [chartId]);

    return (
        <div className="chart-card">
            <div className="chart-header">
                <h3>{title}</h3>
            </div>
            <div className="chart-wrapper">
                <canvas id={chartId}></canvas>
            </div>
        </div>
    );
};

export default Chart;
