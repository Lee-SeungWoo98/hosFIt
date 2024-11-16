'use strict';

// 전역 상수
const CHART_UPDATE_INTERVAL = 30000; // 30초
const NOTIFICATION_DURATION = 3000;  // 3초
// 차트 설정 및 데이터
const chartColors = {
    primary: '#2563eb',
    secondary: '#60a5fa',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    grid: '#f1f5f9'
};

const chartData = {
    monthly: {
        labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월'],
        datasets: [{
            label: 'ICU 입실률',
            data: [15.2, 14.8, 16.1, 15.5, 14.9, 15.2, 16.0, 15.7, 15.9, 15.2],
            borderColor: chartColors.primary,
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },
    distribution: {
        labels: ['ICU', 'Ward', 'Discharge'],
        datasets: [{
            data: [30, 25, 35],
            backgroundColor: [
                chartColors.primary,
                chartColors.secondary,
                '#93c5fd',
                '#bfdbfe'
            ]
        }]
    }
};

const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                usePointStyle: true,
                padding: 20,
                font: {
                    size: 12
                }
            }
        },
        tooltip: {
            backgroundColor: 'white',
            titleColor: '#1f2937',
            bodyColor: '#1f2937',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
                label: function(context) {
                    return ` ${context.formattedValue}%`;
                }
            }
        }
    }
};

// 페이지 초기화
document.addEventListener('DOMContentLoaded', () => {
    showLoadingSpinner();
    initializeCharts();
    initializeEventListeners();
    updateDashboardData();
    hideLoadingSpinner();
    
    // 초기 활성 탭 설정
    switchTab('dashboard');
});

// 로딩 스피너 제어
function showLoadingSpinner() {
    const spinner = document.getElementById('dashboardLoading');
    if (spinner) spinner.style.display = 'flex';
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('dashboardLoading');
    if (spinner) {
        setTimeout(() => {
            spinner.style.display = 'none';
        }, 500);
    }
}

// 차트 초기화
function initializeCharts() {
    // 월별 입실 현황 차트
    const monthlyChart = new Chart(document.getElementById('monthlyChart'), {
        type: 'line',
        data: chartData.monthly,
        options: {
            ...commonChartOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 20,
                    grid: {
                        color: chartColors.grid
                    },
                    ticks: {
                        callback: value => `${value}%`
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // 병동별 분포 차트
    const distributionChart = new Chart(document.getElementById('distributionChart'), {
        type: 'doughnut',
        data: chartData.distribution,
        options: {
            ...commonChartOptions,
            cutout: '60%',
            plugins: {
                ...commonChartOptions.plugins,
                legend: {
                    position: 'right'
                }
            }
        }
    });

    // 차트 반응형 처리
    window.addEventListener('resize', () => {
        monthlyChart.resize();
        distributionChart.resize();
    });
}

// 이벤트 리스너 초기화
function initializeEventListeners() {
    // 탭 전환
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // 기간 선택
    document.querySelectorAll('.chart-period').forEach(select => {
        select.addEventListener('change', (e) => {
            updateChartPeriod(e.target.value);
        });
    });

    // 새로고침 버튼
    document.querySelector('.refresh-btn')?.addEventListener('click', () => {
        refreshData();
    });
}

// 데이터 업데이트
function updateDashboardData() {
    // 실제 구현에서는 API 호출
    const summaryData = {
        modelAccuracy: 94.5,
        icuAdmissionRate: 15.2,
        totalPredictions: 2480
    };

    // 요약 카드 업데이트
    updateSummaryCards(summaryData);
}

function updateSummaryCards(data) {
    const cards = document.querySelectorAll('.card .value');
    if (cards.length >= 3) {
        cards[0].textContent = `${data.modelAccuracy}%`;
        cards[1].textContent = `${data.icuAdmissionRate}%`;
        cards[2].textContent = data.totalPredictions.toLocaleString();
    }
}

// 탭 전환
function switchTab(tabId) {
    // 현재 페이지 타이틀 업데이트
    const title = document.getElementById('current-page-title');
    const tabTitles = {
        dashboard: '대시보드',
        model: 'AI 모델 관리',
        staff: '의료진 관리',
        stats: '통계 분석',
        errors: '에러 로그',
        settings: '설정'
    };
    if (title) title.textContent = tabTitles[tabId] || '대시보드';

    // 모든 탭 숨기기
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
        tab.classList.remove('active');
    });
    
    // 선택된 탭 보이기
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.style.display = 'block';
        selectedTab.classList.add('active');
        
        // 페이드 인 효과
        setTimeout(() => {
            selectedTab.classList.add('fade-in');
        }, 10);
    }
    
    // 네비게이션 링크 스타일 업데이트
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-tab') === tabId) {
            link.classList.add('active');
        }
    });

    // 해당 탭의 차트 다시 그리기
    if (tabId === 'dashboard') {
        initializeCharts();
    }
}

// 데이터 새로고침
function refreshData() {
    showLoadingSpinner();
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
        updateDashboardData();
        hideLoadingSpinner();
        showNotification('데이터가 업데이트되었습니다.', 'success');
    }, 1000);
}

// 차트 기간 업데이트
function updateChartPeriod(period) {
    showLoadingSpinner();
    
    // 실제 구현에서는 API 호출
    setTimeout(() => {
        // 차트 데이터 업데이트 로직
        hideLoadingSpinner();
    }, 500);
}

// PDF 생성
function generatePDFReport() {
    const element = document.getElementById('statsReport');
    const opt = {
        margin: 1,
        filename: `ICU_통계리포트_${new Date().toLocaleDateString()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
    showNotification('PDF 리포트가 생성되었습니다.', 'success');
}

// 알림 표시
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = document.createElement('div');
    icon.className = 'notification-icon';
    icon.innerHTML = getNotificationIcon(type);
    
    const content = document.createElement('div');
    content.className = 'notification-content';
    content.textContent = message;
    
    notification.appendChild(icon);
    notification.appendChild(content);
    container.appendChild(notification);

    // 3초 후 알림 제거
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 알림 아이콘 가져오기
function getNotificationIcon(type) {
    const icons = {
        success: `<svg viewBox="0 0 24 24" class="icon"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>`,
        error: `<svg viewBox="0 0 24 24" class="icon"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>`,
        warning: `<svg viewBox="0 0 24 24" class="icon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`,
        info: `<svg viewBox="0 0 24 24" class="icon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`
    };
    return icons[type] || icons.info;
}

// 차트 다운로드
function downloadChart(chartId) {
    const canvas = document.getElementById(chartId);
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `chart_${chartId}_${new Date().toISOString()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

